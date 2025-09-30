from django.contrib import admin
from .models import Supplier, Invoice, Pin

class InvoiceInline(admin.TabularInline): 
    model = Invoice
    extra = 1  # number of empty invoice rows to show
    fields = ("invoice_number", "submitted_date", "amount_due", "description")
    readonly_fields = ("date_created", "date_modified")

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ("supplier_name", "date_created")
    search_fields = ("supplier_name",)
    inlines = [InvoiceInline]

@admin.register(Pin)
class PinAdmin(admin.ModelAdmin):
    list_display = (
        "supplier",
        "pin_code",
        "is_locked",
        "created_at"
        )
    ordering = ("created_at",)
    search_fields = ("supplier",)

    def save_model(self,request,obj,form,change):
        raw_pin = form.cleaned_data.get("pin_code")
        if raw_pin and not raw_pin.startswith("pbkdf2_"):
            obj.set_pin(raw_pin)
        super().save_model(request,obj,form,change)

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("invoice_number", "supplier", "amount_due", "submitted_date", "date_created")
    list_filter = ("supplier", "submitted_date")
    search_fields = ("invoice_number", "supplier__supplier_name")