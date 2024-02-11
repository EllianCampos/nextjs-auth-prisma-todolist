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
		const categories = await prisma.categories.findMany({
			where: {
				user_id: token.user.id,
			}
		})

		// Build the response
		const response = []
		for (const category of categories) {
			response.push({
				idCategory: category.id,
				name: category.name
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
		const newCategory = await prisma.categories.create({
			data: {
				user_id: token.user.id,
				name: name,
			}
		})

		// Validate if was created
		if (!newCategory) {
			return NextResponse.json({
				errorMessage: 'Ha ocurrido un error creando la categoria'
			}, { status: 500 })
		}

		// Build response
		return NextResponse.json({
			message: 'Categoria creada satisfactoriamenete',
			category: {
				idCategory: newCategory.id,
				name: newCategory.name
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