import { FormEvent, useState } from 'react'
import { api } from '../api/client'

export default function Metadata() {
  const [metaId, setMetaId] = useState('')
  const [field, setField] = useState('')
  const [collectionNotes, setCollectionNotes] = useState('')
  const [fieldNotes, setFieldNotes] = useState('')
  const [resp, setResp] = useState('')
  const [error, setError] = useState('')

  const onCollectionUpdate = async (e: FormEvent) => {
    e.preventDefault()
    setError(''); setResp('')
    try {
      const r = await api(`/metadata/${metaId}/collection`, {
        method: 'PATCH',
        body: JSON.stringify({ notes: collectionNotes })
      })
      setResp(JSON.stringify(r, null, 2))
    } catch (e: any) { setError(e.message) }
  }

  const onFieldUpdate = async (e: FormEvent) => {
    e.preventDefault()
    setError(''); setResp('')
    try {
      const r = await api(`/metadata/${metaId}/field/${encodeURIComponent(field)}`, {
        method: 'PATCH',
        body: JSON.stringify({ notes: fieldNotes })
      })
      setResp(JSON.stringify(r, null, 2))
    } catch (e: any) { setError(e.message) }
  }

  const onAutoPII = async () => {
    setError(''); setResp('')
    try {
      const r = await api(`/metadata/${metaId}/auto-pii`, { method: 'POST' })
      setResp(JSON.stringify(r, null, 2))
    } catch (e: any) { setError(e.message) }
  }

  return (
    <div className="container-fluid">
      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card card-soft p-4 mb-3">
            <h5>Collection notes</h5>
            <form onSubmit={onCollectionUpdate}>
              <div className="mb-3">
                <label className="form-label">Metadata ID</label>
                <input className="form-control" value={metaId} onChange={e => setMetaId(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea className="form-control" rows={3} value={collectionNotes} onChange={e => setCollectionNotes(e.target.value)} />
              </div>
              <button className="btn btn-primary" type="submit">Save</button>
            </form>
          </div>

          <div className="card card-soft p-4">
            <h5>Auto-PII detection</h5>
            <p className="small text-muted">Run detection on this metadata ID.</p>
            <button className="btn btn-warning" disabled={!metaId} onClick={onAutoPII}>Run auto-PII</button>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card card-soft p-4">
            <h5>Field notes</h5>
            <form onSubmit={onFieldUpdate}>
              <div className="mb-3">
                <label className="form-label">Metadata ID</label>
                <input className="form-control" value={metaId} onChange={e => setMetaId(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Field name</label>
                <input className="form-control" value={field} onChange={e => setField(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea className="form-control" rows={3} value={fieldNotes} onChange={e => setFieldNotes(e.target.value)} />
              </div>
              <button className="btn btn-primary" type="submit">Save</button>
            </form>
          </div>
        </div>

        {(resp || error) && (
          <div className="col-12">
            {error && <div className="alert alert-danger">{error}</div>}
            {resp && (
              <div className="card card-soft p-3">
                <pre className="bg-light p-3 rounded">{resp}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}