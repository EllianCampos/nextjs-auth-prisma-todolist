'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name, email, password
      })
    })
      .then(response => {
        if (response.status === 201) {
          setError(null)
          signIn('credentials', {
            email, password, redirect: false
          })
            .then(authres => {
              if (authres.ok) {
                router.push('/')
              }
            })
        } else {
          return response.json()
        }
      })
      .then(response => {
        if (response) {
          setError(response.errorMessage)
          console.log(error)
        }
      })
  }

  return (
    <main className='text-center m-3'>
      <h1>Crea tu cuenta</h1>
      <form onSubmit={handleSubmit} className='m-5'>
        <div className="row mb-1">
          {
            error !== null && (
              <div className='alert alert-danger text-start'>
                {error}
              </div>
            )
          }
        </div>
        <div className="row mb-3">
          <label htmlFor="name" className='col-sm-2 col-form-label'>Nombre</label>
          <div className="col-sm-10">
            <input
              onChange={event => setName(event.target.value)}
              value={name}
              type="text"
              name="name"
              id="name"
              className='form-control'
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="email" className='col-sm-2 col-form-label'>Correo</label>
          <div className="col-sm-10">
            <input
              onChange={event => setEmail(event.target.value)}
              value={email}
              type="email"
              name="email"
              id="email"
              className='form-control'
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="password" className='col-sm-2 col-form-label'>Contraseña</label>
          <div className="col-sm-10">
            <input
              onChange={event => setPassword(event.target.value)}
              value={password}
              type="password"
              name="password"
              id="password"
              className='form-control'
            />
          </div>
        </div>
        <button type="submit" className='btn btn-primary px-5'>Enviar datos</button>
      </form>
    </main>
  )
}
