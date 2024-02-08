import NextAuth from "next-auth"
import CreadentialsProvider from 'next-auth/providers/credentials'
import bcrypt from "bcryptjs";
import { prisma } from "@/libs/prisma";

const handler = NextAuth({
    providers: [
        CreadentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Correo", type: "email", placeholder: "Correo" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials, req) {
                const resultVerify = await prisma.user.findUnique({ where: { email: credentials.email } })
                if (!resultVerify) throw new Error('Invalid credentials')
                
                const passwordMatch = await bcrypt.compare(credentials.password, resultVerify.password)
                if (!passwordMatch) throw new Error('Invalid credentials')

                return {
                    idUser: resultVerify.id,
                    name: resultVerify.name,
                    email: resultVerify.email
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