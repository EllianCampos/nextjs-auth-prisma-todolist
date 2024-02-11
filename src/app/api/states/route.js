import { prisma } from "@/libs/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
	// Validate if the request contains a token
	const token = await getToken({ req })
	if (!token.user.id) return NextResponse.json({
		errorMessage: 'Acceso NO autorizado'
	}, { status: 401 });

	try {
		// Search states by user_id
		const states = await prisma.states.findMany({
			where: {
				user_id: token.user.id,
			}
		})

		// Build the response
		const response = []
		for (const state of states) {
			response.push({
				idState: state.id,
				name: state.name
			})
		}

		return NextResponse.json(response)

	} catch (error) {
		console.log(error)
		return NextResponse.json({
			errorMessage: 'Error interno del servidor'
		}, { status: 500 })
	}
}

export async function POST(req) { 
	// Validate if the request contains a token
	const token = await getToken({ req })
	if (!token.user.id) return NextResponse.json({
		errorMessage: 'Acceso NO autorizado'
	}, { status: 401 });

	// Validate request data
	let name
	try {
		const requestjson = await req.json()
		name = requestjson.name

		if (!name || name === '') {
			return NextResponse.json({ errorMessage: "Por favor ingrese un nombre" }, { status: 400 })
		}
	} catch (error) {
		return NextResponse.json({ errorMessage: "Por favor envíe todos los datos obligatorios" }, { status: 400 })
	}

	try {
		// Create 
		const newState = await prisma.states.create({
			data: {
				user_id: token.user.id,
				name: name,
			}
		})

		// Validate if was created
		if (!newState) {
			return NextResponse.json({
				errorMessage: 'Ha ocurrido un error creando el estado'
			}, { status: 500 })
		}

		// Build response
		return NextResponse.json({
			message: 'Estado creado satisfactoriamenete',
			state: {
				idState: newState.id,
				name: newState.name
			}
		}, {
			status: 201
		})

	} catch (error) {
		return NextResponse.json({
			errorMessage: 'Error interno del servidor'
		}, { status: 500 })
	}
}