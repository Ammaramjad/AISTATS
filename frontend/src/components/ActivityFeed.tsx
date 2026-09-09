import type { Activity } from '../types'

interface ActivityFeedProps {
  items: Activity[]
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const diffMinutes = Math.max(0, Math.round((Date.now() - then) / 60000))
  if (diffMinutes < 1) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const hours = Math.round(diffMinutes / 60)
  return `${hours}h ago`
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return <p className="muted">No recent activity.</p>
  }
  return (
    <ul className="activity-list">
      {items.map((item) => (
        <li key={item.id} className="activity-item">
          <span className="avatar" aria-hidden="true">
            {item.user.charAt(0).toUpperCase()}
          </span>
          <span className="activity-text">
            <strong>{item.user}</strong> {item.action}
          </span>
          <time className="activity-time" dateTime={item.timestamp}>
            {relativeTime(item.timestamp)}
          </time>
        </li>
      ))}
    </ul>
  )
}
