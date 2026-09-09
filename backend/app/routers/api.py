"""Primary API routes for the AISTATS starter application."""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Query

from .. import __version__
from ..config import settings
from ..schemas import (
    ActivitiesResponse,
    EchoRequest,
    EchoResponse,
    HealthResponse,
    StatsResponse,
)
from ..services import build_activities, build_metrics

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["system"])
def health() -> HealthResponse:
    """Report basic service health used by uptime checks and the frontend."""
    return HealthResponse(
        status="ok",
        service=settings.app_name,
        version=__version__,
        environment=settings.environment,
        timestamp=datetime.now(timezone.utc),
    )


@router.get("/stats", response_model=StatsResponse, tags=["dashboard"])
def stats() -> StatsResponse:
    """Return aggregated dashboard metrics."""
    return StatsResponse(
        generated_at=datetime.now(timezone.utc),
        metrics=build_metrics(),
    )


@router.get("/activities", response_model=ActivitiesResponse, tags=["dashboard"])
def activities(limit: int = Query(default=6, ge=1, le=50)) -> ActivitiesResponse:
    """Return a page of recent activity entries."""
    items = build_activities(limit=limit)
    return ActivitiesResponse(total=len(items), items=items)


@router.post("/echo", response_model=EchoResponse, tags=["example"])
def echo(payload: EchoRequest) -> EchoResponse:
    """Echo a message back to the caller.

    Demonstrates request-body validation and a POST endpoint the frontend
    can exercise interactively.
    """
    return EchoResponse(
        message=payload.message,
        length=len(payload.message),
        received_at=datetime.now(timezone.utc),
    )
