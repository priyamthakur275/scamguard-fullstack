import os

# Environment must be set before any app_service module is imported, since
# get_settings() is evaluated at import time in several modules.
os.environ.setdefault("SECRET_KEY", "test-only-secret-key-do-not-use-in-production-0000")
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("APP_ENV", "test")
os.environ.setdefault("DEBUG", "true")

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import Session, sessionmaker  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402

from app_service.core.rate_limit import limiter  # noqa: E402
from app_service.core.security import hash_password  # noqa: E402
from app_service.db.base import Base  # noqa: E402
from app_service.db.postgres.models import User, UserRole  # noqa: E402
from app_service.db.session import get_db  # noqa: E402
from app_service.main import app  # noqa: E402

TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function", autouse=True)
def reset_rate_limiter():
    """Every test gets a clean slate for rate limiting.

    slowapi's default in-memory storage is keyed by client IP, and
    TestClient always presents the same synthetic IP, so without this
    reset, request volume from an earlier test would spuriously trip
    limits (e.g. 5/minute on /auth/register) in a later, unrelated test.
    """
    limiter.reset()
    yield
    limiter.reset()


@pytest.fixture()
def db_session() -> Session:
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client(db_session: Session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture()
def admin_user(db_session: Session) -> User:
    user = User(
        email="admin@example.com",
        password_hash=hash_password("AdminPass1"),
        role=UserRole.ADMIN,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture()
def regular_user(db_session: Session) -> User:
    user = User(
        email="user@example.com",
        password_hash=hash_password("UserPass1"),
        role=UserRole.USER,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user
