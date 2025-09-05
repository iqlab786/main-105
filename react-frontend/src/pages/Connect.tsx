import { FormEvent, useEffect, useState } from 'react'
import { api } from '../api/client'

type Conn = { id: string | number; name: string; connection_uri: string }

export default function Connect() {
  const [name, setName] = useState('')
  const [uri, setUri] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [list, setList] = useState<Conn[]>([])

  const load = async () => {
    try {
      const data = await api<Conn[]>('/db/list')
      setList(data || [])
    } catch (e: any) { setError(e.message) }
  }
  useEffect(() => { load() }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(''); setSuccess('')
    try {
      await api('/db/connect', {
        method: 'POST',
        body: JSON.stringify({ name, connection_uri: uri })
      })
      setName(''); setUri('')
      setSuccess('Connection saved')
      await load()
    } catch (err: any) { setError(err.message || 'Failed') }
  }

  return (
    <div className="container-fluid">
      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card card-soft p-4">
            <h4 className="mb-3">New MongoDB Connection</h4>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Connection URI</label>
                <input className="form-control" placeholder="mongodb+srv://..." value={uri} onChange={e => setUri(e.target.value)} required />
              </div>
              <button className="btn btn-primary" type="submit">Save</button>
            </form>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card card-soft p-4">
            <h4 className="mb-3">Saved Connections</h4>
            {!list.length && <div className="text-muted">No connections yet.</div>}
            <ul className="list-group">
              {list.map(c => (
                <li className="list-group-item d-flex justify-content-between align-items-center" key={String(c.id)}>
                  <div>
                    <div className="fw-semibold">{c.name}</div>
                    <div className="small text-muted text-truncate" style={{maxWidth: '40ch'}}>{c.connection_uri}</div>
                  </div>
                  <span className="badge text-bg-light">{String(c.id)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}