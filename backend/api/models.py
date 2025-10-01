import uuid
from django.db import models
from django.contrib.auth.hashers import make_password,check_password

class Supplier(models.Model):
    supplier_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    supplier_name = models.CharField(max_length=150)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_created']
        verbose_name = "Supplier"
        verbose_name_plural = "Suppliers"

    def __str__(self):
        return f"{self.supplier_name}"


class Pin(models.Model):
    supplier = models.OneToOneField(
        Supplier,
        on_delete=models.CASCADE,
        related_name="pin"
    )
    pin_code = models.CharField(max_length=128)
    is_locked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def set_pin(self,raw_pin):
        self.pin_code = make_password(raw_pin)
    
    def check_pin(self,raw_pin,ignore_lock=False):
        if self.is_locked and not ignore_lock:
            return False
        return check_password(raw_pin,self.pin_code)
    
    
    def __str__(self):
        return f"PIN for {self.supplier.supplier_name}"

class Invoice(models.Model):
    invoice_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.CASCADE,
        related_name='invoices'
    )
    invoice_number = models.CharField(max_length=100, unique=True)
    submitted_date = models.DateTimeField()
    amount_due = models.DecimalField(max_digits=12,decimal_places=2)
    description = models.TextField(blank=True,null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date_created"]
        verbose_name = "Invoice" 

    def __str__(self):
        return f"Invoice {self.invoice_number} from {self.supplier.supplier_name}"  

