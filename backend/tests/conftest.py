import pytest


@pytest.fixture(autouse=True)
def reset_rate_limiter():
    """Reset in-memory rate limiter storage before every test.

    Without this, requests accumulate across tests and exceed the 5/hour
    contact limit, causing 429s in test_all_interest_types.
    """
    from app.api.v1.routes.contact import limiter
    limiter._storage.reset()
    yield
