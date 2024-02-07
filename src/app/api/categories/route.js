import { prisma } from "@/libs/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
	// Get the user
	const token = await getToken({ req })
	if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

	try {
		const states = await prisma.category.findMany({ 
			where: {
				idUser: token.user.idUser,
				active: true
			}
		 })

		const response = []
		for (const state of states) {
			response.push({
				idCategory: state.id,
				name: state.name
			})
		}

		return NextResponse.json(response)
	} catch (error) {
		return NextResponse.json({ message: "Bad Request send a name" }, { status: 400 })
	}
}

export async function POST(req) {
	// Get the user
	const token = await getToken({ req })
	if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

	// Validate request
	let name
	try {
		// Get parameters
		const reqdata = await req.json()
		name = reqdata.name

		if (!name || name === '') {
			return NextResponse.json({ message: "Bad Request send a name" }, { status: 400 })
		}
	} catch (error) {
		return NextResponse.json({ message: "Bad Request send a name" }, { status: 400 })
	}

	try {
		// Create the new category
		const newState = await prisma.category.create({
			data: {
				idUser: token.user.idUser,
				name: name,
			}
		})

		// Validate if the stated was created
		if (!newState) {
			return NextResponse.json({ message: 'Error creando la categoría' }, { status: 500 })
		}

		return NextResponse.json({
			message: 'Categoría creada satisfactoriamenete',
			state: {
				idState: newState.id,
				name: newState.name
			}
		}, {
			status: 201
		})
	} catch (error) {
		return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
	}
}