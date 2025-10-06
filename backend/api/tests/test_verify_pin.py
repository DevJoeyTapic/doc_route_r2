from django.test import TestCase
from api.models import Supplier, Pin


class PinModelTest(TestCase):
    def setUp(self):
        # Create a supplier for testing
        self.supplier = Supplier.objects.create(supplier_name="Test Supplier")

    def test_set_and_check_pin(self):
        """Ensure that setting and checking a PIN works correctly."""
        pin = Pin.objects.create(supplier=self.supplier)
        pin.set_pin("1234")
        pin.save()

        # Check correct pin
        self.assertTrue(pin.check_pin("1234"), "PIN should match the stored hash")

        # Check incorrect pin
        self.assertFalse(pin.check_pin("0000"), "Incorrect PIN should fail")

    def test_locked_pin(self):
        """Ensure that a locked PIN cannot be validated unless ignored."""
        pin = Pin.objects.create(supplier=self.supplier)
        pin.set_pin("5678")
        pin.is_locked = True
        pin.save()

        # Normal check should fail because it’s locked
        self.assertFalse(pin.check_pin("5678"), "Locked PIN should not validate")

        # With ignore_lock=True, it should still pass
        self.assertTrue(pin.check_pin("5678", ignore_lock=True), "Locked PIN should validate when ignore_lock=True")

    def test_str_representation(self):
        """Ensure that __str__ returns a readable string."""
        pin = Pin.objects.create(supplier=self.supplier)
        pin.set_pin("1111")
        pin.save()

        self.assertEqual(str(pin), f"PIN for {self.supplier.supplier_name}")
