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
    throw new Error(err.detail || `Server error ${res.status}`)
  }

  return res.json()
}
