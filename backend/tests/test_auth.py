def test_register_new_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "newuser@example.com", "password": "StrongPass1"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["role"] == "user"
    assert data["is_active"] is True


def test_register_duplicate_email_fails(client):
    payload = {"email": "dup@example.com", "password": "StrongPass1"}
    first = client.post("/api/v1/auth/register", json=payload)
    assert first.status_code == 201

    second = client.post("/api/v1/auth/register", json=payload)
    assert second.status_code == 409
    assert second.json()["error_code"] == "CONFLICT"


def test_register_weak_password_fails(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "weak@example.com", "password": "short"},
    )
    assert response.status_code == 422


def test_register_password_missing_uppercase_fails(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "nouppercase@example.com", "password": "lowercase1"},
    )
    assert response.status_code == 422


def test_login_success_returns_token_pair(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "loginuser@example.com", "password": "StrongPass1"},
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "loginuser@example.com", "password": "StrongPass1"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password_fails(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "wrongpass@example.com", "password": "StrongPass1"},
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "wrongpass@example.com", "password": "WrongPass1"},
    )
    assert response.status_code == 401
    assert response.json()["error_code"] == "UNAUTHORIZED"


def test_login_unknown_email_fails(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "doesnotexist@example.com", "password": "StrongPass1"},
    )
    assert response.status_code == 401


def test_refresh_token_rotates_and_returns_new_pair(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "refresh@example.com", "password": "StrongPass1"},
    )
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "refresh@example.com", "password": "StrongPass1"},
    )
    old_refresh = login_resp.json()["refresh_token"]

    refresh_resp = client.post("/api/v1/auth/refresh", json={"refresh_token": old_refresh})
    assert refresh_resp.status_code == 200
    new_pair = refresh_resp.json()
    assert new_pair["refresh_token"] != old_refresh
    assert "access_token" in new_pair

    # Old (already-rotated) refresh token must be rejected on reuse.
    reuse_resp = client.post("/api/v1/auth/refresh", json={"refresh_token": old_refresh})
    assert reuse_resp.status_code == 401


def test_refresh_with_garbage_token_fails(client):
    response = client.post("/api/v1/auth/refresh", json={"refresh_token": "not-a-real-token"})
    assert response.status_code == 401


def test_logout_revokes_refresh_token(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "logout@example.com", "password": "StrongPass1"},
    )
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "logout@example.com", "password": "StrongPass1"},
    )
    refresh_token = login_resp.json()["refresh_token"]

    logout_resp = client.post("/api/v1/auth/logout", json={"refresh_token": refresh_token})
    assert logout_resp.status_code == 204

    reuse_resp = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert reuse_resp.status_code == 401
