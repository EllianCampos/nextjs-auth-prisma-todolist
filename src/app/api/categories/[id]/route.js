import { prisma } from "@/libs/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) { 
    // Validate if the request contains a token
	const token = await getToken({ req })
	if (!token.user.id) return NextResponse.json({
		errorMessage: 'Acceso NO autorizado'
	}, { status: 401 });

    // Check the params
    if (params.id == null) return NextResponse.json({ 
        errorMessage: "Acción no válida" 
    }, { status: 400 })

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

    // Validate if exists and belongs to the user
    const category = await prisma.categories.findUnique({
        where: {
            id: Number(params.id),
            user_id: token.user.id,
        }
    })
    if (!category) return NextResponse.json({ errorMessage: 'Categoría no encontrada' }, { status: 404 })

    // Update
    try {
        const categoryUpdated = await prisma.categories.update({
            where: {
                id: Number(params.id),
                user_id: token.user.id
            },
            data: {
                name: name
            }
        })

        // categoryUpdated if was updated
		if (!categoryUpdated) {
			return NextResponse.json({ errorMessage: 'Error actaulizando la categoía' }, { status: 500 })
		}

        // Build response
		return NextResponse.json({
			message: 'La categoría ha sido actualizada',
			category: {
				idCategory: categoryUpdated.id,
				name: categoryUpdated.name
			}
		}, {
			status: 200
		})

    } catch (error) {
        return NextResponse.json({
			errorMessage: 'Error interno del servidor'
		}, { status: 500 })
    }
}

export async function DELETE(req, { params }) {
    // Validate if the request contains a token
	const token = await getToken({ req })
	if (!token.user.id) return NextResponse.json({
		errorMessage: 'Acceso NO autorizado'
	}, { status: 401 });

    // Check the params
    if (params.id == null) return NextResponse.json({ 
        errorMessage: "Acción no válida" 
    }, { status: 400 })

    // Validate if exists and belongs to the user
    const state = await prisma.categories.findUnique({
        where: {
            id: Number(params.id),
            user_id: token.user.id,
        }
    })
    if (!state) return NextResponse.json({ errorMessage: 'Categoría no encontrada' }, { status: 404 })

    // Check if the params is already used by some task
    const categoryUsed = await prisma.tasks.findMany({
        where: {
            category_id: Number(params.id)
        }
    })
    if (categoryUsed.length !== 0) {
        return NextResponse.json({ 
            errorMessage: 'La categoría no se puede eliminar porque esta siendo utilizada por una o mas tareas' 
        }, { 
            status: 400 
        })
    }

    try {
        // Delete
        const categoryDeleted = await prisma.categories.delete({
            where: {
                id: Number(params.id),
            }
        })

        // Validate if was deleted
		if (!categoryDeleted) {
			return NextResponse.json({ errorMessage: 'Error eliminando la categoría' }, { status: 500 })
		}

        return NextResponse.json({ message: 'La categoría ha sido eliminada' })
        
    } catch (error) {
        return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
    }
}