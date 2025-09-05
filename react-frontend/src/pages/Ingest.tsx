import { useEffect, useState } from 'react'
import { api } from '../api/client'

type Conn = { id: string | number; name: string }

export default function Ingest() {
  const [conns, setConns] = useState<Conn[]>([])
  const [selected, setSelected] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')

  const load = async () => {
    try {
      const data = await api<Conn[]>('/db/list')
      setConns(data || [])
    } catch (e: any) { setError(e.message) }
  }
  useEffect(() => { load() }, [])

  const ingest = async () => {
    if (!selected) return
    setStatus(''); setError('')
    try {
      const res = await api(`/ingest/mongodb/${selected}`, { method: 'POST' })
      setStatus(JSON.stringify(res, null, 2))
    } catch (e: any) { setError(e.message) }
  }

  return (
    <div className="container-fluid">
      <div className="card card-soft p-4">
        <h4 className="mb-3">Ingest Metadata</h4>
        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <label className="form-label">Select connection</label>
            <select className="form-select" value={selected} onChange={e => setSelected(e.target.value)}>
              <option value="">-- choose --</option>
              {conns.map(c => <option key={String(c.id)} value={String(c.id)}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <button className="btn btn-primary" onClick={ingest} disabled={!selected}>Start ingest</button>
          </div>
        </div>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {status && (
          <div className="mt-3">
            <label className="form-label">Server response</label>
            <pre className="bg-light p-3 rounded">{status}</pre>
          </div>
        )}
      </div>
    </div>
  )
}