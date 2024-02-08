import { prisma } from "@/libs/prisma"
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
    const token = await getToken({ req })
    if (!token) {
        return NextResponse.json({ messge: 'Unauthorized' }, { status: 401 });
    }

    // Check the params
    if (params.id == null) return NextResponse.json({ message: "Bad Request" }, { status: 400 })

    const task = await prisma.task.findUnique({
        where: {
            id: Number(params.id),
            idUser: token.user.idUser,
        },
        include: {
            state: true,
            category: true
        }
    })

    const response = {
        id: task.id,
        state: {
            idState: task.idState,
            name: task.state.name
        },
        category: {
            idCategory: task.idCategory,
            name: task.category.name
        },
        title: task.title,
        date: task.date,
        note: task.note
    }

    return NextResponse.json(response);
}

export async function PUT(req, { params }) {
    // Get the user
    const token = await getToken({ req })
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    // Check the params
    if (params.id == null) return NextResponse.json({ message: "Bad Request" }, { status: 400 })

    // Get parameters
    let title, date, idState, idCategory, note
    try {
        // Get parameters
        const reqdata = await req.json()
        title = reqdata.title
        date = reqdata.date
        note = reqdata.note
        idState = reqdata.idState
        idCategory = reqdata.idCategory

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
        return NextResponse.json({ message: "Bad Request send a title and date" }, { status: 400 })
    }

    // Validate if the tasks exists and belongs to the user
    const task = await prisma.task.findUnique({
        where: {
            id: Number(params.id),
            idUser: token.user.idUser,
        }
    })
    if (!task) return NextResponse.json({ message: 'Tarea no encontrada' }, { status: 404 })

    // Update
    try {
        const taskUpdated = await prisma.task.update({
            where: {
                id: Number(params.id),
                idUser: token.user.idUser
            },
            data: {
                idState,
                idCategory,
                title,
                date: new Date(date),
                note
            }
        })

        // Validate if the stated was updated
        if (!taskUpdated) {
            return NextResponse.json({ message: 'Error eliminando la tarea' }, { status: 500 })
        }

        return NextResponse.json({
            message: 'El estado ha sido actalizado',
            state: {
                idState: taskUpdated.id,
                name: taskUpdated.name
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

    // Validate if the tasks exists and belongs to the user
    const task = await prisma.task.findUnique({
        where: {
            id: Number(params.id),
            idUser: token.user.idUser,
        }
    })
    if (!task) return NextResponse.json({ message: 'Tarea no encontrada' }, { status: 404 })

    try {
        // Delete
        const taskDeleted = await prisma.task.delete({
            where: {
                id: Number(params.id)
            }
        })

        // Validate if the stated was deleted
        if (!taskDeleted) {
            return NextResponse.json({ message: 'Error eliminando la tarea' }, { status: 500 })
        }

        return NextResponse.json({ message: 'La tarea ha sido eliminada' })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
    }
}