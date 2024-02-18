import Link from "next/link";

export default function TableTasks ({ tasks }) {
    return <table className="table table-dark table-striped-columns mt-3">
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
}