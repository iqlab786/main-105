import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Protected() {
  const { token } = useAuth()
  const loc = useLocation()
  if (!token) return <Navigate to="/login" replace state={{ from: loc }} />
  return <Outlet />
}