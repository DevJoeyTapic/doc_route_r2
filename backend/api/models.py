from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.hashers import make_password,check_password

class Pin(models.Model):
    user = models.CharField(max_length=150,unique=True, default="unknown_user")
    pin_code = models.CharField(max_length=128, unique=True)
    attempts = models.IntegerField(default=0)
    locked_until = models.DateTimeField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def set_pin(self,raw_pin:str):
        self.pin_code = make_password(raw_pin)
    
    def check_pin(self,raw_pin:str) -> bool:
        return check_password(raw_pin,self.pin_code)
    
    def is_locked(self) -> bool:
        return self.locked_until and self.locked_until > timezone.now()
    
    def lock(self, minutes=5):
        self.locked_until = timezone.now() + timedelta(minutes=minutes)
        self.save()
    
    def __str__(self):
        return f"PIN {self.user} (locked:{self.is_locked()})"
    