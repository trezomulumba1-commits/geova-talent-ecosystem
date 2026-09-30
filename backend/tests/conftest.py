import pytest

from app.opportunities import opportunity_store
from app.profiles import profile_store
from app.store import user_store


@pytest.fixture(autouse=True)
def reset_in_memory_stores():
    user_store.reset()
    profile_store.reset()
    opportunity_store.reset()
    yield