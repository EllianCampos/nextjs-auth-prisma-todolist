'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react' 

export default function Navbar() {
	const pathname = usePathname()

	return (
		<nav className="navbar nav-tabss navbar-expand-md navbar-dark bg-success">
			<div className="container-fluid">
				<Link className="navbar-brand" href={pathname === '/login' || pathname === '/register' ? '/login' : '/'}>Gestor de tareas</Link>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav">
						{
							pathname === '/login' || pathname === '/register' ?
								<>
									<li className="nav-item">
										<Link className="nav-link" href="/login">Iniciar Sesión</Link>
									</li>
									<li className="nav-item">
										<Link className="nav-link" href="/register">Registrarse</Link>
									</li>
								</> : <>
									<li className="nav-item active">
										<Link className="nav-link" href="/">Mis Tareas</Link>
									</li>
									<li className="nav-item active">
										<Link className="nav-link" href="/tasks/new">Nueva Tarea</Link>
									</li>
									<li className="nav-item">
										<Link className="nav-link" href="/settings">Configuración</Link>
									</li>
									<li className="nav-item">
										<button className="nav-link bg-danger rounded-2" onClick={() => { signOut() }}>Cerrar Sesión</button>
									</li>
								</>
						}

					</ul>
				</div>
			</div>
		</nav>
	)
}
