"""Pydantic models describing the API's request and response payloads."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Response returned by the health-check endpoint."""

    status: str = Field(..., examples=["ok"])
    service: str = Field(..., examples=["AISTATS API"])
    version: str = Field(..., examples=["0.1.0"])
    environment: str = Field(..., examples=["development"])
    timestamp: datetime


class Metric(BaseModel):
    """A single dashboard metric card."""

    id: str
    label: str
    value: float
    unit: str = ""
    change: float = Field(
        ...,
        description="Percentage change versus the previous period.",
    )


class StatsResponse(BaseModel):
    """Aggregated dashboard metrics."""

    generated_at: datetime
    metrics: list[Metric]


class Activity(BaseModel):
    """A recent activity entry displayed on the dashboard feed."""

    id: int
    user: str
    action: str
    timestamp: datetime


class ActivitiesResponse(BaseModel):
    """A page of recent activity entries."""

    total: int
    items: list[Activity]


class EchoRequest(BaseModel):
    """Request body for the example echo endpoint."""

    message: str = Field(..., min_length=1, max_length=500)


class EchoResponse(BaseModel):
    """Response body for the example echo endpoint."""

    message: str
    length: int
    received_at: datetime
