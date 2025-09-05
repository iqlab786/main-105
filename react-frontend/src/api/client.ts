export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export async function api<T=any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = { ...(options.headers as any) }
  if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(path, { ...options, headers })
  let data: any = null
  try { data = await res.json() } catch {}
  if (!res.ok) {
    const msg = (data && (data.detail || data.msg)) || res.statusText || 'Request failed'
    throw new Error(msg)
  }
  return data as T
}