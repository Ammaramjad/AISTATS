export interface HealthResponse {
  status: string
  service: string
  version: string
  environment: string
  timestamp: string
}

export interface Metric {
  id: string
  label: string
  value: number
  unit: string
  change: number
}

export interface StatsResponse {
  generated_at: string
  metrics: Metric[]
}

export interface Activity {
  id: number
  user: string
  action: string
  timestamp: string
}

export interface ActivitiesResponse {
  total: number
  items: Activity[]
}

export interface EchoResponse {
  message: string
  length: number
  received_at: string
}
