"""End-to-end style tests for the FastAPI endpoints using the TestClient."""

from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root() -> None:
    response = client.get("/")
    assert response.status_code == 200
    body = response.json()
    assert body["health"] == "/api/health"


def test_health() -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["service"]
    assert body["version"]
    assert "timestamp" in body


def test_stats_returns_metrics() -> None:
    response = client.get("/api/stats")
    assert response.status_code == 200
    body = response.json()
    assert "generated_at" in body
    assert len(body["metrics"]) == 4
    metric_ids = {metric["id"] for metric in body["metrics"]}
    assert {"active_users", "requests", "latency", "uptime"} == metric_ids
    for metric in body["metrics"]:
        assert "label" in metric
        assert isinstance(metric["value"], (int, float))


def test_activities_default_limit() -> None:
    response = client.get("/api/activities")
    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 6
    assert len(body["items"]) == 6
    timestamps = [item["timestamp"] for item in body["items"]]
    assert timestamps == sorted(timestamps, reverse=True)


def test_activities_respects_limit() -> None:
    response = client.get("/api/activities", params={"limit": 3})
    assert response.status_code == 200
    assert len(response.json()["items"]) == 3


def test_activities_rejects_invalid_limit() -> None:
    response = client.get("/api/activities", params={"limit": 0})
    assert response.status_code == 422


def test_echo_roundtrip() -> None:
    response = client.post("/api/echo", json={"message": "hello"})
    assert response.status_code == 200
    body = response.json()
    assert body["message"] == "hello"
    assert body["length"] == 5


def test_echo_validation_error() -> None:
    response = client.post("/api/echo", json={"message": ""})
    assert response.status_code == 422
