"""FastAPI application entry point.

Run locally with::

    uvicorn app.main:app --reload --port 8000

from within the ``backend`` directory.
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import __version__
from .config import settings
from .routers.api import router as api_router


def create_app() -> FastAPI:
    """Application factory. Builds and configures the FastAPI instance."""
    app = FastAPI(
        title=settings.app_name,
        version=__version__,
        description="Starter API for the AISTATS full-stack template.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix="/api")

    @app.get("/", tags=["system"])
    def root() -> dict[str, str]:
        """Root endpoint pointing callers at the docs and health check."""
        return {
            "service": settings.app_name,
            "docs": "/docs",
            "health": "/api/health",
        }

    return app


app = create_app()
