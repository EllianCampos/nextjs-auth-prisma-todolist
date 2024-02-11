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

    // Validate if the state exists and belongs to the user
    const state = await prisma.states.findUnique({
        where: {
            id: Number(params.id),
            user_id: token.user.id,
        }
    })
    if (!state) return NextResponse.json({ errorMessage: 'Estado no encontrado' }, { status: 404 })

    // Update
    try {
        const stateUpdated = await prisma.states.update({
            where: {
                id: Number(params.id),
                user_id: token.user.id
            },
            data: {
                name: name
            }
        })

        // Validate if was updated
		if (!stateUpdated) {
			return NextResponse.json({ errorMessage: 'Error actualizando el estado' }, { status: 500 })
		}

        // Build response
		return NextResponse.json({
			message: 'El estado ha sido actualizado',
			state: {
				idState: stateUpdated.id,
				name: stateUpdated.name
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

    // Validate if the state exists and belongs to the user
    const state = await prisma.states.findUnique({
        where: {
            id: Number(params.id),
            user_id: token.user.id,
        }
    })
    if (!state) return NextResponse.json({ errorMessage: 'Estado no encontrado' }, { status: 404 })

    // Check if the params is already used by some task
    const statesUsed = await prisma.tasks.findMany({
        where: {
            state_id: Number(params.id)
        }
    })
    if (statesUsed.length !== 0) {
        return NextResponse.json({ 
            errorMessage: 'El estado no se puede eliminar porque esta siendo utilizado por un una o mas tareas' 
        }, { 
            status: 400 
        })
    }

    try {
        // Delete
        const stateDeleted = await prisma.states.delete({
            where: {
                id: Number(params.id),
            }
        })

        // Validate if was deleted
		if (!stateDeleted) {
			return NextResponse.json({ errorMessage: 'Error eliminando el estado' }, { status: 500 })
		}

        return NextResponse.json({ message: 'El estado ha sido eliminado' })
        
    } catch (error) {
        return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
    }
}