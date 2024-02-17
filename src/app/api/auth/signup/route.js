import { NextResponse } from "next/server"
import bcrypt from "bcryptjs";
import { prisma } from "@/libs/prisma";

export async function POST(request) {
    // Validate request data
    let name, email, password
    try {
        const requestjson = await request.json()
        name = requestjson.name
        email = requestjson.email
        password = requestjson.password

        if (!name || name === '') {
            return NextResponse.json({ errorMessage: 'Por favor envíe un nombre' }, { status: 400 })
        } else if (!email || email === '') {
            return NextResponse.json({ errorMessage: 'Por favor envíe un correo valido' }, { status: 400 })
        } else if (!password || password === '') {
            return NextResponse.json({ errorMessage: 'Por favor envíe una contraseña valida' }, { status: 400 })
        }
    } catch (error) {
        return NextResponse.json({ errorMessage: 'Por favor envíe todos los datos obligatorios' })
    }

    try {
        // Verify if the user already exists
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        })
        if (user) {
            return NextResponse.json({ errorMessage: 'El correo no esta disponible' }, { status: 400 })
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create the new user
        const newUser = await prisma.users.create({
            data: { name, email, password: hashedPassword }
        })

        // Create the states and categories by default
        const states = await prisma.states.createMany({
            data: [
                {
                    user_id: newUser.id,
                    name: "Pendiente"
                },
                {
                    user_id: newUser.id,
                    name: "Comenzado"
                },
                {
                    user_id: newUser.id,
                    name: "Avanzado"
                },
                {
                    user_id: newUser.id,
                    name: "Finalizado"
                },
                {
                    user_id: newUser.id,
                    name: 'Entregado'
                }
            ]
        })

        const categories = await prisma.categories.createMany({
            data: [
                {
                    user_id: newUser.id,
                    name: "Personal"
                },
                {
                    user_id: newUser.id,
                    name: "Estudio"
                },
                {
                    user_id: newUser.id,
                    name: "Trabajo"
                }
            ]
        })
    
        return NextResponse.json({ 
            message: 'Registrado existosamente' 
        }, { status: 201 })
        
    } catch (error) {
        return NextResponse.json({
			errorMessage: 'Error interno del servidor'
		}, { status: 500 })
    }
}