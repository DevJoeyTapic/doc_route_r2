from django.db import models
from django.contrib.auth.hashers import make_password,check_password

class Pin(models.Model):
    supplier_id = models.CharField(max_length=150,unique=True, default="unknown_user")
    pin_code = models.CharField(max_length=128, unique=True)
    is_locked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def set_pin(self,raw_pin):
        self.pin_code = make_password(raw_pin)
    
    def check_pin(self,raw_pin,ignore_lock=False):
        if self.is_locked and not ignore_lock:
            return False
        return check_password(raw_pin,self.pin_code)
    
    
    def __str__(self):
        return f"PIN for {self.supplier_id}"
    