import { prisma } from "@/libs/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    // Get the user
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    // Check the params
    if (params.id == null) return NextResponse.json({ message: "Bad Request" }, { status: 400 })

    // Get parameters
    let name
    try {
        const reqdata = await req.json()
        name = reqdata.name
        if (!name || name === '') return NextResponse.json({ message: "Bad Request send a name" }, { status: 400 })
    } catch (error) {
        return NextResponse.json({ message: "Bad Request send a name" }, { status: 400 })
    }

    // Validate if the state exists and belongs to the user
    const category = await prisma.category.findUnique({
        where: {
            id: Number(params.id),
            idUser: token.user.idUser,
            active: true
        }
    })
    if (!category) return NextResponse.json({ message: 'Categoría no encontrada' }, { status: 404 })

    // Update
    try {
        const categoryUpdated = await prisma.category.update({
            where: {
                id: Number(params.id),
                idUser: token.user.idUser
            },
            data: {
                name: name
            }
        })

        // Validate if the stated was updated
		if (!categoryUpdated) {
			return NextResponse.json({ message: 'Error creando el estado' }, { status: 500 })
		}

        return NextResponse.json({ 
            message: 'La categoría ha sido actualizada',
            state: {
				idCategory: categoryUpdated.id,
				name: categoryUpdated.name
			}
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
    }
}

export async function DELETE(req, { params }) {
    // Get the user
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    // Check the params
    if (params.id == null) return NextResponse.json({ message: "Bad Request" }, { status: 400 })

    // Validate if the category exists and belongs to the user
    const category = await prisma.category.findUnique({
        where: {
            id: Number(params.id),
            idUser: token.user.idUser,
            active: true
        }
    })
    if (!category) return NextResponse.json({ message: 'Categoría no encontrada' }, { status: 404 })
    
    try {
        // Delete
        const categoryDeleted = await prisma.category.update({
            where: {
                id: Number(params.id),
                idUser: token.user.idUser
            },
            data: {
                active: false
            }
        })

        // Validate if the stated was deleted
		if (!categoryDeleted) {
			return NextResponse.json({ message: 'Error creando la categoría' }, { status: 500 })
		}

        return NextResponse.json({ message: 'La categoría ha sido eliminada' })
    } catch (error) {
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
    }
}