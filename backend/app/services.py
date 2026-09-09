"""In-memory data providers for the example endpoints.

This module fabricates deterministic-but-lively sample data so the starter
dashboard has something meaningful to render without requiring a database.
Replace these functions with real data sources as the application grows.
"""

from __future__ import annotations

import random
from datetime import datetime, timedelta, timezone

from .schemas import Activity, Metric

_ACTIVITY_TEMPLATES: list[tuple[str, str]] = [
    ("alice", "created a new experiment"),
    ("bob", "uploaded a dataset"),
    ("carol", "published a model report"),
    ("dave", "started a training run"),
    ("erin", "shared a dashboard"),
    ("frank", "closed an incident"),
]


def _now() -> datetime:
    return datetime.now(timezone.utc)


def build_metrics() -> list[Metric]:
    """Return the set of metric cards shown on the dashboard."""
    rng = random.Random()
    return [
        Metric(
            id="active_users",
            label="Active Users",
            value=float(rng.randint(1200, 1800)),
            unit="",
            change=round(rng.uniform(-4, 12), 1),
        ),
        Metric(
            id="requests",
            label="API Requests",
            value=float(rng.randint(45_000, 90_000)),
            unit="",
            change=round(rng.uniform(-2, 20), 1),
        ),
        Metric(
            id="latency",
            label="Avg Latency",
            value=round(rng.uniform(80, 220), 1),
            unit="ms",
            change=round(rng.uniform(-15, 5), 1),
        ),
        Metric(
            id="uptime",
            label="Uptime",
            value=round(rng.uniform(99.5, 99.99), 2),
            unit="%",
            change=round(rng.uniform(-0.1, 0.1), 2),
        ),
    ]


def build_activities(limit: int = 6) -> list[Activity]:
    """Return a list of recent activity entries, newest first."""
    rng = random.Random()
    now = _now()
    items: list[Activity] = []
    for index in range(limit):
        user, action = rng.choice(_ACTIVITY_TEMPLATES)
        items.append(
            Activity(
                id=index + 1,
                user=user,
                action=action,
                timestamp=now - timedelta(minutes=rng.randint(1, 240)),
            )
        )
    items.sort(key=lambda item: item.timestamp, reverse=True)
    return items
