const API_BASE = import.meta.env.VITE_API_URL || '/api/v1'

export interface ContactPayload {
  first_name: string
  last_name: string
  email: string
  company?: string
  phone?: string
  interest: string
  message: string
}

export interface ContactResult {
  success: boolean
  message: string
  lead_id?: string
}

export async function submitContact(payload: ContactPayload): Promise<ContactResult> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    let message = `Server error ${res.status}`
    if (typeof err.detail === 'string') {
      message = err.detail
    } else if (Array.isArray(err.detail) && err.detail.length > 0) {
      message = err.detail.map((d: any) => d.msg ?? String(d)).join(', ')
    }
    throw new Error(message)
  }

  return res.json()
}
