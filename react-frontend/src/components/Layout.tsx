import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  return (
    <div className="d-flex">
      <aside className="sidebar p-3">
        <h5 className="mb-4">Data Atlas</h5>
        <nav className="d-grid gap-1">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>
          <NavLink to="/connect" className={({isActive}) => isActive ? 'active' : ''}>Connections</NavLink>
          <NavLink to="/ingest" className={({isActive}) => isActive ? 'active' : ''}>Ingest</NavLink>
          <NavLink to="/metadata" className={({isActive}) => isActive ? 'active' : ''}>Metadata</NavLink>
          <NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''}>Profile</NavLink>
        </nav>
        <div className="mt-auto pt-4 small opacity-75">Signed in as<br/><strong>{user?.username}</strong></div>
        <button className="btn btn-sm btn-outline-light mt-2" onClick={logout}>Logout</button>
      </aside>
      <main className="flex-fill content">
        <Outlet />
      </main>
    </div>
  )
}