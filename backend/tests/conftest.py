import os

os.environ["PERSISTENCE"] = "memory"
os.environ.setdefault("DATABASE_URL", "sqlite:///./test_geova.db")

import pytest

from app.network import collab_store, connection_store
from app.opportunities import opportunity_store
from app.profiles import profile_store
from app.store import user_store


@pytest.fixture(autouse=True)
def reset_in_memory_stores():
    user_store.reset()
    profile_store.reset()
    opportunity_store.reset()
    connection_store.reset()
    collab_store.reset()
    yield
