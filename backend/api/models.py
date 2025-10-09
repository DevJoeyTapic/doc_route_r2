import uuid
import os
from django.db import models
from django.contrib.auth.hashers import make_password,check_password
from django.core.exceptions import ValidationError
from .storage_backends import MediaStorage

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

class Vessel(models.Model):
    vessel_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    vessel_name = models.CharField(max_length=150, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['vessel_name']
        verbose_name = "Vessel"
        verbose_name_plural = "Vessels"

    def __str__(self):
        return self.vessel_name


class Pin(models.Model):
    supplier = models.OneToOneField(
        Supplier,
        on_delete=models.CASCADE,
        related_name="pin"
    )
    pin_code = models.CharField(max_length=128)
    is_locked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
    
    def clean(self):
        raw_pin = self.pin_code

        for existing_pin in Pin.objects.exclude(pk=self.pk):
            if check_password(raw_pin, existing_pin.pin_code):
                raise ValidationError("This PIN code already in use by another supplier.")

    def save(self,*args, **kwargs):
        self.full_clean()
        if not self.pin_code.startswith('pbkdf2_'):
            self.pin_code = make_password(self.pin_code)
        super().save(*args, **kwargs)

    def set_pin(self,raw_pin):
        self.pin_code = make_password(raw_pin)
    
    def check_pin(self,raw_pin,ignore_lock=False):
        if self.is_locked and not ignore_lock:
            return False
        return check_password(raw_pin,self.pin_code)
    
    
    def __str__(self):
        return f"PIN for {self.supplier.supplier_name}"

def invoice_upload_path(instance, filename):
    base, ext = os.path.splitext(filename)
    invoice_id = str(instance.invoice_id).replace('-', '')

    existing_files = Invoice.objects.filter(invoice_id=instance.invoice_id).count()
    suffix = f"_{existing_files + 1}" if existing_files > 0 else ""

    new_filename = f"{invoice_id}{suffix}{ext}"
    return f"invoices/pdfs/{new_filename}"

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
    vessel = models.ForeignKey(   
        Vessel,
        on_delete=models.CASCADE,
        related_name='invoices'

    )
    invoice_number = models.CharField(max_length=100, unique=True)
    submitted_date = models.DateTimeField()
    amount_due = models.DecimalField(max_digits=12,decimal_places=2)
    description = models.TextField(blank=True,null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    pdf_file = models.FileField(upload_to=invoice_upload_path, blank=True, null=True)
    # pdf_file = models.FileField(upload_to="invoices/pdfs/", blank=True, null=True)
    # pdf_file = models.FileField(
    #     storage=MediaStorage(),
    #     upload_to="",
    #     blank=True,
    #     null=True
    # )

    class Meta:
        ordering = ["-date_created"]
        verbose_name = "Invoice" 

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.vessel.vessel_name} ({self.supplier.supplier_name})"
