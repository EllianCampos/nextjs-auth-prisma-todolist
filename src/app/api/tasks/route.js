import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/libs/prisma';

export async function GET(req) {
  // Validate if the request contains a token
  const token = await getToken({ req })
  if (!token.user.id) return NextResponse.json({
    errorMessage: 'Acceso NO autorizado'
  }, { status: 401 });

  try {
    // Search tasks by user_id
    const tasks = await prisma.tasks.findMany({
      where: {
        user_id: token.user.id,
      },
      include: {
        state: true,
        category: true
      },
      orderBy: {
        state_id: 'asc'
      }
    })

    // Build the response
    let response = []
    for (const task of tasks) {
      response.push({
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
      })
    }

    return NextResponse.json(response);

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
  let title, date, idState, idCategory, note
  try {
    const requestjson = await req.json()
    title = requestjson.title
    date = requestjson.date
    note = requestjson.note || ""
    idState = requestjson.idState
    idCategory = requestjson.idCategory

    if (!title || title === '') {
      return NextResponse.json({ errorMessage: "El título es requerido" }, { status: 400 })
    } else if (!date || date === '') {
      return NextResponse.json({ errorMessage: "La fecha es requerida" }, { status: 400 })
    } else if (!idState || idState === '') {
      return NextResponse.json({ errorMessage: "El estado es requerido" }, { status: 400 })
    } else if (!idCategory || idCategory === '') {
      return NextResponse.json({ errorMessage: "La categoría es requerida" }, { status: 400 })
    } 
  } catch (error) {
    return NextResponse.json({ errorMessage: "Por favor rellene todos los campos obligatorios" }, { status: 400 })
  }

  try {
    // Create
    const newTask = await prisma.tasks.create({
      data: {
        user_id: token.user.id,
        state_id: Number(idState),
        category_id: Number(idCategory),
        title,
        date: new Date(date),
        note
      }
    })

    // Validate if was created
    if (!newTask) {
      return NextResponse.json({ errorMessage: 'Error creando la tarea' }, { status: 500 })
    }

    // Search the task for give all data in the response
    const task = await prisma.tasks.findUnique({
      where: {
        id: newTask.id
      },
      include: {
        state: true,
        category: true
      }
    })

    return NextResponse.json({
      message: 'Tarea creada satisfactoriamenete',
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
    }, {
      status: 201
    })
  } catch (error) { console.log(error)
    return NextResponse.json({ errorMessage: 'Error interno del servidor' }, { status: 500 })
  }
}