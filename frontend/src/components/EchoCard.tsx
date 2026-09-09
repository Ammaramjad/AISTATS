import { useState, type FormEvent } from 'react'
import { api } from '../api'
import type { EchoResponse } from '../types'

export function EchoCard() {
  const [message, setMessage] = useState('Hello from the dashboard!')
  const [result, setResult] = useState<EchoResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const response = await api.echo(message)
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="echo-form" onSubmit={handleSubmit}>
      <label htmlFor="echo-input" className="muted">
        Send a message to <code>POST /api/echo</code>
      </label>
      <div className="echo-row">
        <input
          id="echo-input"
          type="text"
          value={message}
          maxLength={500}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Type a message…"
        />
        <button type="submit" disabled={loading || message.trim().length === 0}>
          {loading ? 'Sending…' : 'Send'}
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}
      {result && (
        <p className="echo-result">
          Server echoed <strong>“{result.message}”</strong> ({result.length}{' '}
          chars)
        </p>
      )}
    </form>
  )
}
