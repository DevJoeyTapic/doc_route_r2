from django.contrib import admin
from .models import Pin

@admin.register(Pin)
class PinAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "attempts",
        "locked_until",
        "created_at"
        )
    ordering = ("created_at",)
    search_fields = ("user",)

    def save_model(self,request,obj,form,change):
        raw_pin = form.cleaned_data.get("pin_code")
        if raw_pin and not raw_pin.startswith("pbkdf2_"):
            obj.set_pin(raw_pin)
        super().save_model(request,obj,form,change)

