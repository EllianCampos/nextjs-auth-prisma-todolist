'use client'

import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home() {

  const [tasks, setTasks] = useState([])

  const fetchTasks = () => {
    fetch('/api/tasks')
    .then(res => {
      if (res.status === 200) {

      }
      return res.json()
    })
    .then(data => setTasks(data))
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <main className="container mt-5">
      <table className="table table-dark table-striped-columns">
        <thead>
          <tr>
            <th>Título</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Categoria</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.date.substring(0, 10)}</td>
              <td>{task.state.name}</td>
              <td>{task.category.name}</td>
              <td className="text-center">
                <Link href={`/tasks/${task.id}`} className="btn btn-primary ">
                  Seleccionar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
