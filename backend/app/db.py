"""SQLAlchemy engine/session (Stage 2).

Uses the synchronous API so the existing store interfaces stay unchanged.
FastAPI runs these route handlers in its threadpool; moving to async SQLAlchemy
is a later optimisation (the dependency is already declared in pyproject).
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings


class Base(DeclarativeBase):
    pass


def sync_database_url(url: str) -> str:
    """Normalise an async URL to its sync driver equivalent."""
    return url.replace("+aiosqlite", "").replace("+asyncpg", "+psycopg")


def _connect_args(url: str) -> dict:
    return {"check_same_thread": False} if url.startswith("sqlite") else {}


_engine = None
_SessionLocal = None


def get_engine():
    global _engine
    if _engine is None:
        _engine = create_engine(
            sync_database_url(settings.database_url),
            future=True,
            pool_pre_ping=True,
            connect_args=_connect_args(sync_database_url(settings.database_url)),
        )
    return _engine


def get_sessionmaker():
    global _SessionLocal
    if _SessionLocal is None:
        _SessionLocal = sessionmaker(
            bind=get_engine(), expire_on_commit=False, autoflush=False
        )
    return _SessionLocal


def session():
    return get_sessionmaker()()


def init_db() -> None:
    from app import db_models  # noqa: F401  (register models on Base.metadata)

    if settings.db_auto_create:
        Base.metadata.create_all(get_engine())
