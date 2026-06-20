import requests
import sys
import subprocess
import time
import os
import pytest
from backend.database.session import SessionLocal, Base, engine
from backend.models.user import User
from backend.models.terraform import TerraformFile, ReportHistory  # Register models for relationship mapper
from backend.utils.security import verify_password

API_URL = "http://localhost:8000"

def is_localhost_running():
    try:
        response = requests.get(API_URL, timeout=1)
        return response.status_code == 200
    except Exception:
        return False

@pytest.mark.skipif(not is_localhost_running(), reason="Requires localhost service")
def test_local_registration_and_login():
    print("Testing local email/password registration and login...")
    
    # 0. Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    # 1. Clean up existing test user if any
    db = SessionLocal()
    try:
        test_user = db.query(User).filter(User.email == "test_auth_user@example.com").first()
        if test_user:
            db.delete(test_user)
            db.commit()
    finally:
        db.close()

    # 2. Register new user
    register_payload = {
        "name": "Test Auth User",
        "email": "test_auth_user@example.com",
        "password": "securepassword123"
    }
    
    register_resp = requests.post(f"{API_URL}/auth/register", json=register_payload)
    assert register_resp.status_code == 200, f"Registration failed: {register_resp.status_code} - {register_resp.text}"
    user_data = register_resp.json()
    assert user_data["name"] == "Test Auth User"
    assert user_data["email"] == "test_auth_user@example.com"
    assert user_data["provider"] == "local"

    # 3. Register duplicate user (should fail)
    duplicate_resp = requests.post(f"{API_URL}/auth/register", json=register_payload)
    assert duplicate_resp.status_code == 400, f"Duplicate registration didn't fail: {duplicate_resp.status_code}"
    assert "Email already registered." in duplicate_resp.text

    # 4. Login with correct credentials
    login_payload = {
        "email": "test_auth_user@example.com",
        "password": "securepassword123"
    }
    login_resp = requests.post(f"{API_URL}/auth/login", json=login_payload)
    assert login_resp.status_code == 200, f"Login failed: {login_resp.status_code} - {login_resp.text}"
    token_data = login_resp.json()
    assert "access_token" in token_data
    token = token_data["access_token"]
    assert token_data["user"]["email"] == "test_auth_user@example.com"

    # 5. Login with incorrect password (should fail)
    bad_login_payload = {
        "email": "test_auth_user@example.com",
        "password": "wrongpassword"
    }
    bad_login_resp = requests.post(f"{API_URL}/auth/login", json=bad_login_payload)
    assert bad_login_resp.status_code == 401, f"Bad login didn't fail: {bad_login_resp.status_code}"

    # 6. Fetch /auth/me profile
    headers = {"Authorization": f"Bearer {token}"}
    me_resp = requests.get(f"{API_URL}/auth/me", headers=headers)
    assert me_resp.status_code == 200, f"Fetch /auth/me failed: {me_resp.status_code} - {me_resp.text}"
    me_data = me_resp.json()
    assert me_data["name"] == "Test Auth User"
    assert me_data["email"] == "test_auth_user@example.com"
    assert me_data["provider"] == "local"

    # 7. Change password with correct current password
    change_payload = {
        "current_password": "securepassword123",
        "new_password": "newsecurepassword456"
    }
    change_resp = requests.post(f"{API_URL}/auth/change-password", json=change_payload, headers=headers)
    assert change_resp.status_code == 200, f"Change password failed: {change_resp.status_code} - {change_resp.text}"

    # 8. Try to login with old password (should fail)
    old_login_payload = {
        "email": "test_auth_user@example.com",
        "password": "securepassword123"
    }
    old_login_resp = requests.post(f"{API_URL}/auth/login", json=old_login_payload)
    assert old_login_resp.status_code == 401, f"Login with old password didn't fail: {old_login_resp.status_code}"

    # 9. Login with new password (should succeed)
    new_login_payload = {
        "email": "test_auth_user@example.com",
        "password": "newsecurepassword456"
    }
    new_login_resp = requests.post(f"{API_URL}/auth/login", json=new_login_payload)
    assert new_login_resp.status_code == 200, f"Login with new password failed: {new_login_resp.status_code} - {new_login_resp.text}"

    # 10. Attempt to change password with wrong current password (should fail)
    bad_change_payload = {
        "current_password": "wrongcurrentpassword",
        "new_password": "anotherpassword789"
    }
    bad_change_resp = requests.post(f"{API_URL}/auth/change-password", json=bad_change_payload, headers=headers)
    assert bad_change_resp.status_code == 400, f"Change password with wrong current password didn't fail: {bad_change_resp.status_code}"

    # Clean up test user
    db = SessionLocal()
    try:
        test_user = db.query(User).filter(User.email == "test_auth_user@example.com").first()
        if test_user:
            db.delete(test_user)
            db.commit()
    finally:
        db.close()
    
    print("Local registration, login, and password change test: PASSED")

def main():
    # Check if backend server is already running, if not start it
    server_started_by_us = False
    proc = None
    try:
        requests.get(f"{API_URL}/")
    except requests.exceptions.ConnectionError:
        print("Starting FastAPI backend server...")
        # Start server as subprocess using current system python executable
        proc = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "backend.main:app", "--port", "8000"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        server_started_by_us = True
        time.sleep(3) # Wait for server startup

    try:
        test_local_registration_and_login()
    finally:
        if server_started_by_us and proc:
            print("Stopping backend server...")
            proc.terminate()
            proc.wait()

if __name__ == "__main__":
    main()
