'use client'

import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    signIn('credentials', {
      email, password, redirect: false
    })
    .then(authres => {
      if (authres.error) {
       return setError(authres.error)
      }
      if (authres.ok) {
       return router.push('/')
      }
    })
  }

  return (
    <main>
      <h2 className="text-center mt-5">Iniciar sesión</h2>
      <section className="container d-flex align-content-center justify-content-center">
        <form onSubmit={handleSubmit} className="col-8  ">
          <div className="row mb-1">
            {
              error !== null && (
                <div className='alert alert-danger'>
                  {error}
                </div>
              )
            }
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo</label>
            <input onChange={event => setEmail(event.target.value)} value={email} type="email" name="email" id="email" className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input onChange={event => setPassword(event.target.value)} value={password} type="password" name="password" id="password" className="form-control" />
          </div>
          <button type="submit" className="btn btn-success w-100">Ingresar</button>
          <hr className="mt-4" />
          <Link href='/register' className="btn btn-primary w-100">Crear una cuenta</Link>
        </form>
      </section>

    </main>
  )
}
