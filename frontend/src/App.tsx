import { api } from './api'
import { useAsync } from './hooks/useAsync'
import { MetricCard } from './components/MetricCard'
import { ActivityFeed } from './components/ActivityFeed'
import { StatusPanel } from './components/StatusPanel'
import { EchoCard } from './components/EchoCard'
import './App.css'

function App() {
  const health = useAsync(() => api.getHealth())
  const stats = useAsync(() => api.getStats())
  const activities = useAsync(() => api.getActivities())

  function reloadAll() {
    health.reload()
    stats.reload()
    activities.reload()
  }

  const anyLoading = stats.loading || activities.loading
  const dashboardError = stats.error ?? activities.error

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="logo" aria-hidden="true">
            📊
          </span>
          <div>
            <h1>AISTATS Dashboard</h1>
            <p className="muted">React + Vite + FastAPI starter</p>
          </div>
        </div>
        <div className="header-actions">
          <StatusPanel
            health={health.data}
            loading={health.loading}
            error={health.error}
          />
          <button
            className="refresh-btn"
            onClick={reloadAll}
            disabled={anyLoading}
          >
            {anyLoading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <section aria-labelledby="metrics-heading">
          <h2 id="metrics-heading">Overview</h2>
          {stats.loading && (
            <div className="metrics-grid">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="card metric-card skeleton" />
              ))}
            </div>
          )}
          {stats.error && (
            <div className="banner error-banner">
              <span>Couldn’t load metrics: {stats.error}</span>
              <button onClick={stats.reload}>Retry</button>
            </div>
          )}
          {stats.data && (
            <div className="metrics-grid">
              {stats.data.metrics.map((metric) => (
                <MetricCard key={metric.id} metric={metric} />
              ))}
            </div>
          )}
        </section>

        <div className="two-col">
          <section className="card" aria-labelledby="activity-heading">
            <h2 id="activity-heading">Recent Activity</h2>
            {activities.loading && <p className="muted">Loading activity…</p>}
            {activities.error && (
              <div className="banner error-banner">
                <span>Couldn’t load activity: {activities.error}</span>
                <button onClick={activities.reload}>Retry</button>
              </div>
            )}
            {activities.data && <ActivityFeed items={activities.data.items} />}
          </section>

          <section className="card" aria-labelledby="echo-heading">
            <h2 id="echo-heading">Try the API</h2>
            <EchoCard />
          </section>
        </div>

        {dashboardError && (
          <p className="muted footnote">
            Tip: start the backend with{' '}
            <code>uvicorn app.main:app --reload --port 8000</code> from the{' '}
            <code>backend</code> folder, then click Refresh.
          </p>
        )}
      </main>

      <footer className="app-footer muted">
        API base: <code>{api.baseUrl}</code>
      </footer>
    </div>
  )
}

export default App
