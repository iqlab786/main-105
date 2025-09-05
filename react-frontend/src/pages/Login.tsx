import { FormEvent, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>('')
  const nav = useNavigate()
  const loc = useLocation() as any
  const { login, register } = useAuth()

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'register') {
        await register({ username, email, password })
      }
      await login(username, password)
      const to = loc.state?.from?.pathname || '/dashboard'
      nav(to, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Failed')
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card card-soft p-4">
            <h3 className="mb-3">{mode === 'login' ? 'Welcome back' : 'Create account'}</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
              {mode === 'register' && (
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button className="btn btn-primary w-100" type="submit">
                {mode === 'login' ? 'Login' : 'Register & Login'}
              </button>
            </form>
            <div className="text-center mt-3">
              <button className="btn btn-link" onClick={() => setMode(m => m === 'login' ? 'register' : 'login')}>
                {mode === 'login' ? 'No account? Register' : 'Have an account? Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}