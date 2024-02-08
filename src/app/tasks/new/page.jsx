'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TaskPage({ params }) {
  const router = useRouter()

  const [error, setOnError] = useState(null);
  
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [state, setState] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const [states, setStates] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchTask = () => {
    fetch(`/api/tasks/${params.id}`)
    .then(res => res.json())
    .then(res => {
      setTitle(res.title)
      setDate(res.date.substring(0, 10))
      setNote(res.note)
      setState(res.state.idState)
      setCategory(res.category.idCategory)
    })
  }

  const fetchStates = () => {
    fetch('/api/states')
    .then(res => res.json())
    .then(res => setStates(res))
  }

  const fetchCategories = () => {
    fetch('/api/categories')
    .then(res => res.json())
    .then(res => setCategories(res))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    fetch(`/api/tasks/${ params.id ? params.id : '' }`, {
      method: params.id ? 'PUT' : 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title, 
        date, 
        note,
        idState: state,
        idCategory: category
      })
    })
    .then(res => {
      if (res.ok){
        router.push('/')
        return null
      } else {
        return res.json()
      }
    })
    .then(res => {
      if (res){
        setOnError(res.message)
      }
    })
  }

  const handleDelete = () => {
    fetch(`/api/tasks/${params.id}`, { method: 'DELETE' })
    .then(res => {
      if (res.ok){
        router.push('/')
      }
    })
  }

  useEffect(() => {
    fetchStates()
    fetchCategories()
    if (params.id) {
      fetchTask()
    }
  }, [])

  return (
    <section className="container mt-4 mb-5">
      <h1 className="text-center">{params.id ? "Editar tarea" : "Crear tarea"}</h1>
      <form onSubmit={handleSubmit}>
        {
          error !== null && <div className="alert alert-danger mt-4">
              {error}
          </div>
        }
        {/* Title */}
        <div className="mt-3">
          <label
            htmlFor="title"
            className="form-label"
          >
            Título
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={event => setTitle(event.target.value)}
            className="form-control"
            // required
          />
        </div>
        {/* Date */}
        <div className="mt-3">
          <label
            htmlFor="date"
            className="form-label"
          >
            Fecha
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={event => setDate(event.target.value)}
            className="form-control"
            // required
          />
        </div>
        {/* States */}
        <div className="mt-3">
          <label
            htmlFor="state"
            className="form-label"
          >
            Estado
          </label>
          <select
            className="form-select"
            id="state"
            value={state}
            onChange={event => {setState(event.target.value)}}
          >
            <option>Selecciona un estado</option>
            {states.map((item) => (
              <option value={item.idState} key={item.idState}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        {/* Categories */}
        <div className="mt-3">
          <label
            htmlFor="category"
            className="form-label"
          >
            Categoría
          </label>
          <select
            className="form-select"
            id="category"
            value={category}
            onChange={event => setCategory(event.target.value)}
          >
            <option>Selecciona una categoría</option>
            {categories.map((item) => (
              <option value={item.idCategory} key={item.idCategory}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        {/* Note */}
        <div className="mt-3">
          <label
            htmlFor="note"
            className="form-label"
          >
            Notas de la tarea
          </label>
          <textarea
            type="text"
            id="note"
            value={note}
            onChange={event => setNote(event.target.value)}
            className="form-control"
            rows={3}
          />
        </div>
        {/* Buttons */}
        <div className="mt-3 d-flex justify-content-between">
          <Link
            href="/"
            className='btn btn-outline-warning'
          >
            Descartar
          </Link>
          <button
            type="submit"
            className="btn btn-success"
          >
            {params.id ? "Guardar cambios" : "Crear tarea"}
          </button>
          {params.id && (
            <button type="button" className="btn btn-danger" onClick={handleDelete} >
              Eliminar
            </button>
          )}
        </div>
      </form>
    </section>
  )
}