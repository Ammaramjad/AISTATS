import type {
  ActivitiesResponse,
  EchoResponse,
  HealthResponse,
  StatsResponse,
} from './types'

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'
).replace(/\/$/, '')

/** Error thrown when the backend responds with a non-2xx status. */
export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    })
  } catch {
    throw new ApiError(
      `Unable to reach the backend at ${API_BASE_URL}. Is it running?`,
      0,
    )
  }

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`
    try {
      const body = await response.json()
      if (body?.detail) {
        detail = typeof body.detail === 'string' ? body.detail : detail
      }
    } catch {
      // Response body was not JSON; keep the default message.
    }
    throw new ApiError(detail, response.status)
  }

  return (await response.json()) as T
}

export const api = {
  baseUrl: API_BASE_URL,
  getHealth: () => request<HealthResponse>('/api/health'),
  getStats: () => request<StatsResponse>('/api/stats'),
  getActivities: (limit = 6) =>
    request<ActivitiesResponse>(`/api/activities?limit=${limit}`),
  echo: (message: string) =>
    request<EchoResponse>('/api/echo', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
}
