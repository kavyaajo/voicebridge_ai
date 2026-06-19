import pytest
from unittest.mock import patch
from django.contrib.auth.models import User
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_register_user():
    client = APIClient()

    response = client.post(
        "/api/register/",
        {
            "username": "kavya",
            "email": "kavya@test.com"
        },
        format="json",
    )

    assert response.status_code == 201
    assert response.data["message"] == "User registered successfully."


@pytest.mark.django_db
def test_login_user():
    User.objects.create(
        username="kavya",
        email="kavya@test.com"
    )

    client = APIClient()

    response = client.post(
        "/api/login/",
        {
            "email": "kavya@test.com"
        },
        format="json",
    )

    assert response.status_code == 200
    assert response.data["message"] == "Login successful."


@pytest.mark.django_db
def test_login_user_not_found():
    client = APIClient()

    response = client.post(
        "/api/login/",
        {
            "email": "abc@test.com"
        },
        format="json",
    )

    assert response.status_code == 404


@patch("core.views.generate_summary")
@pytest.mark.django_db
def test_ai_summary(mock_generate):
    mock_generate.return_value = {
        "summary": "Test Summary",
        "action_items": ["Task 1"]
    }

    client = APIClient()

    response = client.post(
        "/api/ai/summary/",
        {
            "transcript": "Hello world"
        },
        format="json",
    )

    assert response.status_code == 200
    assert response.data["summary"] == "Test Summary"


@pytest.mark.django_db
def test_ai_summary_without_transcript():
    client = APIClient()

    response = client.post(
        "/api/ai/summary/",
        {},
        format="json",
    )

    assert response.status_code == 400