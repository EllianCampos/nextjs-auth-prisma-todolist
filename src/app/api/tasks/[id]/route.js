import { prisma } from "@/libs/prisma"
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
    // Validate if the request contains a token
    const token = await getToken({ req })
    if (!token.user.id) return NextResponse.json({
        errorMessage: 'Acceso NO autorizado'
    }, { status: 401 });

    // Check the params
    if (params.id == null) return NextResponse.json({
        errorMessage: "Acción no válida"
    }, { status: 400 })

    try {
        // Validate if the task exists and belongs to the user
        const state = await prisma.tasks.findUnique({
            where: {
                id: params.id,
                user_id: token.user.id,
            }
        })
        if (!state) return NextResponse.json({ errorMessage: 'Tarea no encontrada' }, { status: 404 })

        // Search
        const task = await prisma.tasks.findUnique({
            where: {
                id: params.id,
                user_id: token.user.id,
            },
            include: {
                state: true,
                category: true
            }
        })

        // Build response
        const response = {
            id: task.id,
            state: {
                idState: task.state_id,
                name: task.state.name
            },
            category: {
                idCategory: task.category_id,
                name: task.category.name
            },
            title: task.title,
            date: task.date,
            note: task.note
        }

        return NextResponse.json(response);

    } catch (error) {
        return NextResponse.json({
            errorMessage: 'Error interno del servidor'
        }, { status: 500 })
    }
}

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
    let title, date, idState, idCategory, note
    try {
        const requestjson = await req.json()
        title = requestjson.title
        date = requestjson.date
        note = requestjson.note || ""
        idState = requestjson.idState
        idCategory = requestjson.idCategory

        if (!title || title === '') {
            return NextResponse.json({ message: "El título es requerido" }, { status: 400 })
        } else if (!date || date === '') {
            return NextResponse.json({ message: "La fecha es requerida" }, { status: 400 })
        } else if (!idState || idState === '') {
            return NextResponse.json({ message: "El estado es requerido" }, { status: 400 })
        } else if (!idCategory || idCategory === '') {
            return NextResponse.json({ message: "La categoría es requerida" }, { status: 400 })
        } 
    } catch (error) {
        return NextResponse.json({ errorMessage: "Por favor rellene todos los campos obligatorios" }, { status: 400 })
    }

    // Validate if the tasks exists and belongs to the user
    const task = await prisma.tasks.findUnique({
        where: {
            id: params.id,
            user_id: token.user.id,
        }
    })
    if (!task) return NextResponse.json({ errorMessage: 'Tarea no encontrada' }, { status: 404 })

    // Update
    try {
        const taskUpdated = await prisma.tasks.update({
            where: {
                id: params.id,
                user_id: token.user.id
            },
            data: {
                state_id: Number(idState),
                category_id: Number(idCategory),
                title,
                date: new Date(date),
                note
            }
        })

        // Validate if was updated
        if (!taskUpdated) {
            return NextResponse.json({ errorMessage: 'Error actualizando la tarea' }, { status: 500 })
        }

        // Search the task for give all data in the response
        const task = await prisma.tasks.findUnique({
            where: {
                id: taskUpdated.id
            },
            include: {
                state: true,
                category: true
            }
        })

        return NextResponse.json({
            message: 'La tarea ha sido actalizada',
            task: {
                id: task.id,
                state: {
                    idState: task.state_id,
                    name: task.state.name
                },
                category: {
                    idCategory: task.category_id,
                    name: task.category.name
                },
                title: task.title,
                date: task.date,
                note: task.note
            }
        })

    } catch (error) {
        console.log(error)
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

    // Validate if the tasks exists and belongs to the user
    const task = await prisma.tasks.findUnique({
        where: {
            id: params.id,
            user_id: token.user.id,
        }
    })
    if (!task) return NextResponse.json({ errorMessage: 'Tarea no encontrada' }, { status: 404 })

    try {
        // Delete
        const taskDeleted = await prisma.tasks.delete({
            where: {
                id: params.id
            }
        })

        // Validate if the stated was deleted
        if (!taskDeleted) {
            return NextResponse.json({ errorMessage: 'Error eliminando la tarea' }, { status: 500 })
        }

        return NextResponse.json({ message: 'La tarea ha sido eliminada' })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
    }
}