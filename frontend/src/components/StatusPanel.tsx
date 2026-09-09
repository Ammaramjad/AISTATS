import type { HealthResponse } from '../types'

interface StatusPanelProps {
  health: HealthResponse | null
  loading: boolean
  error: string | null
}

export function StatusPanel({ health, loading, error }: StatusPanelProps) {
  let state: 'ok' | 'error' | 'pending' = 'pending'
  if (error) state = 'error'
  else if (health) state = 'ok'

  const label =
    state === 'ok' ? 'Connected' : state === 'error' ? 'Disconnected' : 'Checking…'

  return (
    <div className={`status-pill status-${state}`} role="status">
      <span className="status-dot" aria-hidden="true" />
      <span>
        Backend: {label}
        {health ? ` · v${health.version} · ${health.environment}` : ''}
        {loading && !health ? '' : ''}
      </span>
    </div>
  )
}
