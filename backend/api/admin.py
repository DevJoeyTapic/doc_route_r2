from django.contrib import admin
from .models import Supplier, Invoice, Pin
from django.utils.html import format_html

class InvoiceInline(admin.TabularInline): 
    model = Invoice
    extra = 1  # number of empty invoice rows to show
    fields = ("invoice_number", "submitted_date", "amount_due", "description")
    readonly_fields = ("date_created", "date_modified")

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ("supplier_name", "invoice_count", "date_created")
    search_fields = ("supplier_name",)
    inlines = [InvoiceInline]

    @admin.display(description="Invoices")
    def invoice_count(self, obj):
        return obj.invoices.count()

@admin.register(Pin)
class PinAdmin(admin.ModelAdmin):
    list_display = (
        "supplier",
        "is_locked",
        "created_at"
        )
    # readonly_fields = ("pin_code",)
    ordering = ("created_at",)
    search_fields = ("supplier",)

    def save_model(self,request,obj,form,change):
        raw_pin = form.cleaned_data.get("pin_code")
        if raw_pin and not raw_pin.startswith("pbkdf2_"):
            obj.set_pin(raw_pin)
        super().save_model(request,obj,form,change)

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("invoice_number", "supplier", "amount_due", "submitted_date", "pdf_link")
    list_filter = ("supplier", "submitted_date")
    search_fields = ("invoice_number", "supplier__supplier_name")

    @admin.display(description="PDF File")
    def pdf_link(self, obj):
        if obj.pdf_file:
            return format_html(
                "<a href='{}' target='_blank'>View PDF</a>", obj.pdf_file.url
            )
        return "-"