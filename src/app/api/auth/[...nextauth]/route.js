import NextAuth from "next-auth"
import CreadentialsProvider from 'next-auth/providers/credentials'
import bcrypt from "bcryptjs";
import { prisma } from "@/libs/prisma";

const handler = NextAuth({
    providers: [
        CreadentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Correo", type: "email", placeholder: "Correo" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials, req) {
                const user = await prisma.users.findUnique({ where: { email: credentials.email } })
                if (!user) throw new Error('Invalid credentials')
                
                const passwordMatch = await bcrypt.compare(credentials.password, user.password)
                if (!passwordMatch) throw new Error('Invalid credentials')

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }
        })
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) token.user = user
            return token
        },
        session({ session, token }) {
            session.user = token.user
            return session
        }
    },
    pages: {
        signIn: '/login',
        signOut: '/login'
    }
})

module.exports = {
    GET: handler,
    POST: handler,
};