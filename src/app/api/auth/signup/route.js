import { NextResponse } from "next/server"
import bcrypt from "bcryptjs";
import { prisma } from "@/libs/prisma";

export async function POST(request) {
    let name, email, password

    // Get data
    try {
        const requestjson = await request.json()
        name = requestjson.name
        email = requestjson.email
        password = requestjson.password

        if (!name || name === '') {
            return NextResponse.json({ message: 'Por favor envie un nombre' }, { status: 400 })
        } else if (!email || email === '') {
            return NextResponse.json({ message: 'Por favor envie un correo valido' }, { status: 400 })
        } else if (!password || password === '') {
            return NextResponse.json({ message: 'Por favor envie una contraseña valida' }, { status: 400 })
        }
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Por favor envie un nombre, un correo y una contraseña' })
    }

    try {
        // Verify if the user already exists
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (user) {
            return NextResponse.json({ message: 'El correo no esta disponible' }, { status: 400 })
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create the new user
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        })

        // Create the states and categories by default
        const states = await prisma.state.createMany({
            data: [
                {
                    idUser: newUser.id,
                    name: "Pendiente"
                },
                {
                    idUser: newUser.id,
                    name: "Comenzado"
                },
                {
                    idUser: newUser.id,
                    name: "Avanzado"
                },
                {
                    idUser: newUser.id,
                    name: "Finalizado"
                }
            ]
        })

        const categories = await prisma.category.createMany({
            data: [
                {
                    idUser: newUser.id,
                    name: "Personal"
                },
                {
                    idUser: newUser.id,
                    name: "Estudio"
                },
                {
                    idUser: newUser.id,
                    name: "Trabajo"
                }
            ]
        })
    
        return NextResponse.json({ message: 'Registrado existosamente' }, { status: 201 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
    }
}