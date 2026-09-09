import type { Metric } from '../types'

interface MetricCardProps {
  metric: Metric
}

function formatValue(metric: Metric): string {
  const rounded =
    metric.unit === '%' || metric.unit === 'ms'
      ? metric.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : Math.round(metric.value).toLocaleString()
  return metric.unit ? `${rounded} ${metric.unit}` : rounded
}

export function MetricCard({ metric }: MetricCardProps) {
  const positive = metric.change >= 0
  return (
    <article className="card metric-card">
      <span className="metric-label">{metric.label}</span>
      <span className="metric-value">{formatValue(metric)}</span>
      <span className={`metric-change ${positive ? 'up' : 'down'}`}>
        {positive ? '▲' : '▼'} {Math.abs(metric.change)}%
      </span>
    </article>
  )
}
