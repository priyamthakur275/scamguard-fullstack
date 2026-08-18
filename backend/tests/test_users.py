def register_and_login(client, email: str, password: str = "StrongPass1") -> str:
    client.post("/api/v1/auth/register", json={"email": email, "password": password})
    login_resp = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    return login_resp.json()["access_token"]


def test_get_current_user_requires_token(client):
    response = client.get("/api/v1/users/me")
    assert response.status_code == 401
    assert response.json()["error_code"] == "UNAUTHORIZED"


def test_get_current_user_with_valid_token(client):
    token = register_and_login(client, "me@example.com")
    response = client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "me@example.com"


def test_get_current_user_invalid_token_rejected(client):
    response = client.get(
        "/api/v1/users/me", headers={"Authorization": "Bearer not-a-real-token"}
    )
    assert response.status_code == 401


def test_get_current_user_malformed_header_rejected(client):
    response = client.get("/api/v1/users/me", headers={"Authorization": "not-bearer-format"})
    assert response.status_code == 401
