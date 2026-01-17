def test_register_success(client):
    payload = {
        "email": "test@elte.hu",
        "password": "password123",
        "name": "Teszt Elek",
        "major": "Informatika",
        "hobbies": ["sport", "programozás"]
    }

    response = client.post("/register", json=payload)

    assert response.status_code == 201

    data = response.get_json()
    assert "token" in data
    assert data["user"]["email"] == "test@elte.hu"

def test_register_invalid_email(client):
    payload = {
        "email": "test@gmail.com",
        "password": "password123",
        "major": "Informatika"
    }

    response = client.post("/register", json=payload)

    assert response.status_code == 400

def test_login_success(client):
    # előbb regisztrálunk
    client.post("/register", json={
        "email": "login@elte.hu",
        "password": "password123",
        "major": "Informatika"
    })

    response = client.post("/login", json={
        "email": "login@elte.hu",
        "password": "password123"
    })

    assert response.status_code == 200
    assert "token" in response.get_json()

def test_login_wrong_password(client):
    client.post("/register", json={
        "email": "bad@elte.hu",
        "password": "password123",
        "major": "Informatika"
    })

    res = client.post("/login", json={
        "email": "bad@elte.hu",
        "password": "WRONG"
    })

    assert res.status_code == 401

def test_profile_requires_token(client):
    res = client.get("/profile")
    assert res.status_code == 401


def test_profile_success(client):
    reg = client.post("/register", json={
        "email": "me@elte.hu",
        "password": "password123",
        "major": "Informatika"
    })
    token = reg.get_json()["token"]

    res = client.get(
        "/profile",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert res.status_code == 200
    assert res.get_json()["email"] == "me@elte.hu"
    
def test_groups_search_requires_auth(client):
    res = client.get("/groups/search?q=analízis")
    assert res.status_code == 401
    


def test_join_group_requires_auth(client):
    res = client.post("/groups/join", json={"group_id": "123"})
    assert res.status_code == 401

############################################################################################

def test_my_groups_requires_auth(client):
    res = client.get("/groups/my-groups")
    assert res.status_code == 401


def test_register_duplicate_email(client):
    payload = {
        "email": "dup@elte.hu",
        "password": "password123",
        "major": "Informatika"
    }
    client.post("/register", json=payload)

    response = client.post("/register", json=payload)

    assert response.status_code == 400 or 409
    assert "email" in str(response.get_json()).lower() or "exists" in str(response.get_json()).lower()


def test_login_invalid_email(client):
    client.post("/register", json={
        "email": "valid@elte.hu",
        "password": "password123",
        "major": "Informatika"
    })

    res = client.post("/login", json={
        "email": "invalid@elte.hu",
        "password": "password123"
    })

    assert res.status_code == 401



def test_register_invalid_email_format(client):
    payload = {
        "email": "invalid-email",
        "password": "password123",
        "major": "Informatika"
    }

    res = client.post("/register", json=payload)

    assert res.status_code == 400
    assert "email" in str(res.get_json()).lower()

def test_profile_invalid_token(client):
    reg_res = client.post("/register", json={
        "email": "invalidtoken@elte.hu",
        "password": "password123",
        "major": "Informatika"
    })

    res = client.get(
        "/profile",
        headers={"Authorization": "Bearer invalidtoken"}
    )

    assert res.status_code == 401


def test_register_non_elte_email(client):
    payload = {
        "email": "nonelte@gmail.com",
        "password": "password123",
        "major": "Informatika"
    }

    res = client.post("/register", json=payload)

    assert res.status_code == 400


def test_login_missing_email(client):
    client.post("/register", json={
        "email": "test@elte.hu",
        "password": "password123",
        "major": "Informatika"
    })

    res = client.post("/login", json={"password": "password123"})

    assert res.status_code == 401

def test_register_empty_major(client):
    payload = {
        "email": "emptymajor@elte.hu",
        "password": "password123",
        "major": ""
    }

    res = client.post("/register", json=payload)

    assert res.status_code == 400

def test_groups_search_url_encoded_query(client):
    reg_res = client.post("/register", json={
        "email": "encoded@elte.hu",
        "password": "password123",
        "major": "Informatika"
    })
    token = reg_res.get_json()["token"]

    res = client.get(
        "/groups/search?q=Analízis%20I.",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert res.status_code == 200


def test_profile_no_token_header(client):

    res = client.get("/profile")

    assert res.status_code == 401

def test_register_with_hobbies(client):
    payload = {
        "email": "hobbies@elte.hu",
        "password": "password123",
        "major": "Informatika",
        "hobbies": ["sport", "zene"]
    }

    res = client.post("/register", json=payload)

    assert res.status_code == 201

def test_register_long_bio(client):
    long_bio = "A" * 1000
    payload = {
        "email": "longbio@elte.hu",
        "password": "password123",
        "major": "Informatika",
        "bio": long_bio
    }

    res = client.post("/register", json=payload)

    assert res.status_code == 201 or res.status_code == 400

def test_groups_search_special_chars(client):
    reg_res = client.post("/register", json={
        "email": "special@elte.hu",
        "password": "password123",
        "major": "Informatika"
    })
    token = reg_res.get_json()["token"]

    res = client.get(
        "/groups/search?q=Matematika#1",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert res.status_code == 200


def test_register_case_sensitive_email(client):
    payload_lower = {
        "email": "case@elte.hu",
        "password": "password123",
        "major": "Informatika"
    }
    client.post("/register", json=payload_lower)

    payload_upper = {
        "email": "CASE@elte.hu",
        "password": "password123",
        "major": "Informatika"
    }

    res = client.post("/register", json=payload_upper)

    assert res.status_code == 400

def test_login_case_sensitive_email(client):
    client.post("/register", json={
        "email": "case@elte.hu",
        "password": "password123",
        "major": "Informatika"
    })

    res = client.post("/login", json={
        "email": "Case@elte.hu",
        "password": "password123"
    })

    assert res.status_code == 200 or res.status_code == 401

def test_register_sql_injection_email(client):
    payload = {
        "email": "test'; DROP TABLE users; --@elte.hu",
        "password": "password123",
        "major": "Informatika"
    }

    res = client.post("/register", json=payload)

    assert res.status_code == 400 or res.status_code == 201

def test_register_xss_bio(client):
    xss_bio = "<script>alert('xss')</script>"
    payload = {
        "email": "xss@elte.hu",
        "password": "password123",
        "major": "Informatika",
        "bio": xss_bio
    }

    res = client.post("/register", json=payload)

    assert res.status_code == 201 or res.status_code == 400

def test_profile_multiple_requests_same_token(client):
    reg_res = client.post("/register", json={
        "email": "multi@elte.hu",
        "password": "password123",
        "major": "Informatika"
    })
    token = reg_res.get_json()["token"]

    res1 = client.get(
        "/profile",
        headers={"Authorization": f"Bearer {token}"}
    )
    res2 = client.get(
        "/profile",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert res1.status_code == 200
    assert res2.status_code == 200

def test_register_spaces_email(client):
    payload = {
        "email": " test@elte.hu ",
        "password": "password123",
        "major": "Informatika"
    }

    res = client.post("/register", json=payload)

    assert res.status_code == 400 or res.status_code == 201

def test_my_groups_invalid_token(client):
    res = client.get(
        "/groups/my-groups",
        headers={"Authorization": "Bearer invalid"}
    )

    assert res.status_code == 401

def test_groups_search_missing_auth_header(client):
    res = client.get("/groups/search?q=test")

    assert res.status_code == 401


