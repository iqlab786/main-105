import { useEffect, useState } from 'react'
import { api } from '../api/client'

export default function Profile() {
  const [me, setMe] = useState<any>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    api('/auth/me').then(setMe).catch((e: any) => setError(e.message))
  }, [])

  return (
    <div className="container-fluid">
      <div className="card card-soft p-4">
        <h4>Profile</h4>
        {error && <div className="alert alert-danger">{error}</div>}
        {me ? (
          <pre className="bg-light p-3 rounded">{JSON.stringify(me, null, 2)}</pre>
        ) : (
          <div className="text-muted">Loading…</div>
        )}
      </div>
    </div>
  )
}