import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

type User = { id?: string | number; username: string; email?: string }
type AuthShape = {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  register: (payload: { username: string; email: string; password: string }) => Promise<void>
  refreshMe: () => Promise<void>
}

const AuthCtx = createContext<AuthShape | null>(null)
export const useAuth = () => {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<User | null>(null)

  const refreshMe = async () => {
    if (!token) { setUser(null); return }
    try {
      const me = await api<User>('/auth/me')
      setUser(me)
    } catch {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    }
  }

  useEffect(() => { refreshMe() }, [token])

  const login = async (username: string, password: string) => {
    const res = await api<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
    localStorage.setItem('token', res.access_token)
    setToken(res.access_token)
    await refreshMe()
  }

  const register = async (payload: { username: string; email: string; password: string }) => {
    await api('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, token, login, logout, register, refreshMe }}>
      {children}
    </AuthCtx.Provider>
  )
}