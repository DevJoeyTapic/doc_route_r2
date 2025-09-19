from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Pin

class VerifyPinViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a test PIN
        self.pin = Pin.objects.create(
            supplier_id="SUP123",
            is_locked=False
        )
        self.pin.set_pin("1234")
        self.pin.save()

        # Create a locked PIN
        self.locked_pin = Pin.objects.create(
            supplier_id="SUP999",
            is_locked=True
        )
        self.locked_pin.set_pin("9999")
        self.locked_pin.save()

    def test_valid_pin(self):
        response = self.client.post("/api/verify-pin/", {"pin_code": "1234"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)

    def test_invalid_pin(self):
        response = self.client.post("/api/verify-pin/", {"pin_code": "0000"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["error"], "Invalid PIN")

    def test_locked_pin(self):
        response = self.client.post("/api/verify-pin/", {"pin_code": "9999"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data["error"], "Account is locked")

    def test_missing_pin(self):
        response = self.client.post("/api/verify-pin/", {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "pin_code is required")
