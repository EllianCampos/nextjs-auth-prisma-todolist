import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/libs/prisma';

export async function GET(req) {
  const token = await getToken({ req })
  if (!token) {
    return NextResponse.json({ messge: 'Unauthorized' }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    where: {
      idUser: token.user.idUser,
    },
    include: {
      state: true,
      category: true
    }
  })

  let data = []
  for (const task of tasks) {
    data.push({
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
    })
  }

  return NextResponse.json(data);
}

export async function POST(req) {
	// Get the user
	const token = await getToken({ req })
	if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

	// Validate request
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
			return NextResponse.json({ message: "Bad Request send a title" }, { status: 400 })
		} else if (!date || date === '') {
      return NextResponse.json({ message: "Bad Request send a date" }, { status: 400 })
    }
	} catch (error) {
		return NextResponse.json({ message: "Bad Request send a title and date" }, { status: 400 })
	}

	try {
		// Create new state
		const newTask = await prisma.task.create({
			data: {
				idUser: token.user.idUser,
        idState: Number(idState),
        idCategory: Number(idCategory),
        title,
        date: new Date(date),
        note
			}
		})

		// Validate if the stated was created
		if (!newTask) {
			return NextResponse.json({ message: 'Error creando la tarea' }, { status: 500 })
		}

		return NextResponse.json({
			message: 'Tarea creada satisfactoriamenete',
		}, {
			status: 201
		})
	} catch (error) {
    console.log(error)
		return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
	}
}