export const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '/api/v1').replace(/\/+$/, '')

export class ApiError extends Error {
  status: number
  path: string

  constructor(status: number, path: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.path = path
  }
}

function buildQuery(params?: Record<string, string | number | boolean | undefined | null>): string {
  if (!params) return ''
  const usable = Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
  if (usable.length === 0) return ''
  const search = new URLSearchParams()
  for (const [key, value] of usable) search.set(key, String(value))
  return `?${search.toString()}`
}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const contentType = res.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const body = await res.json()
      if (typeof body === 'string') return body
      if (body?.message) return String(body.message)
      if (body?.error) return String(body.error)
      return JSON.stringify(body)
    }
    const text = await res.text()
    return text || res.statusText
  } catch {
    return res.statusText || `HTTP ${res.status}`
  }
}

async function request<T>(
  path: string,
  init: RequestInit,
  params?: Record<string, string | number | boolean | undefined | null>,
): Promise<T> {
  const url = `${API_BASE}${path}${buildQuery(params)}`
  const token = localStorage.getItem('waygo_token')
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers ?? {}),
    },
    ...init,
  })

  if (!res.ok) {
    throw new ApiError(res.status, path, await parseErrorMessage(res))
  }

  if (res.status === 204) return undefined as T

  const contentType = res.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return (await res.text()) as unknown as T
  }
  return (await res.json()) as T
}

export const api = {
  get: <T>(path: string, params?: Record<string, string | number | boolean | undefined | null>) =>
    request<T>(path, { method: 'GET' }, params),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
}
