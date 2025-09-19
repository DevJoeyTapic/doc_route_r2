# 🔐 PIN Verification API (Django + DRF)

This backend provides a simple **PIN-based authentication system** built with **Django REST Framework** and **JWT**.  
It allows clients to verify a `pin_code` and receive access + refresh tokens.

---

## 🚀 Features
- Verify `pin_code` from frontend (no username/password).
- Each PIN belongs to a **supplier** (`supplier_id` for identification).
- **Locked PINs** are handled manually by admins (`is_locked` flag).
- Returns **JWT access & refresh tokens** upon success.
- Lightweight and extendable.

---


## 📂 Codebase Overview
> ### Model: `Pin`
Defined in `api/models.py`:
- `supplier_id` → ID of the supplier associated with the PIN.
- `pin_code` → Hashed PIN (using Django’s `make_password`).
- `is_locked` → If `True`, the PIN cannot be used until manually unlocked.
- `created_at` → Timestamp when the PIN was created.

Utility methods:
- `set_pin(raw_pin)` → Hash and store a PIN.
- `check_pin(raw_pin, ignore_lock=False)` → Verify PIN (optionally ignoring lock status).

---
> ### View: `VerifyPinView`
Defined in `api/views.py`:
- Accepts POST requests at `/api/verify-pin/`.
- Request body must contain:
  ```json
  {
    "pin_code": "1234"
  }
  ```

## 📡 API Responses

- **200 OK** → Valid PIN, returns tokens + supplier info  
- **403 Forbidden** → PIN is correct but account is locked  
- **401 Unauthorized** → Invalid PIN  
- **400 Bad Request** → Missing `pin_code`  

- Example success response:
```
{
  "message": "PIN verified successfully",
  "supplier_id": "SUP123",
  "access_token": "<jwt_token>",
  "refresh_token": "<jwt_token>"
}
```


## 🧪 Tests

Tests are located in **`api/tests.py`**.

>### Coverage
- ✅ Valid PIN  
- ❌ Invalid PIN  
- 🔒 Locked PIN  
- ⚠️ Missing `pin_code` field  

>### Run Tests
 ```
  python manage.py test
 ```

## 🔑 Notes

- PIN locking is manual → set is_locked=True in DB or admin panel.
- Tokens are signed with your project’s SECRET_KEY (see settings.py).
- Default access token expiry → 30 minutes.
- Default refresh token expiry → 7 days.

## 🛠️ Tech Stack

- Python 3.10+
- Django 4.x
- Django REST Framework
- SimpleJWT (PyJWT)

## ⚙️ Setup
- Create python environment
    ```
    python -m venv .venv
    ```
- Activate environment
    ```
    venv\Scripts\activate
    ```
- Install Django and dependencies
    ```
    pip install django django-extensions
    pip install djangorestframework
    pip install djangorestframework-simplejwt
    pip install python-dotenv
    pip install mysqlclient
    pip install pymysql
    ```
- Freeze all dependencies to requirements.txt
    ```
    pip freeze > requirements.txt
    ```
- Create Project:
    ```
    django-admin startproject server .
    ```
- Create Api:
    ```
    python manage.py startapp api
    
> Optional Next Steps
- Migrate Database:
    ```
    python manage.py migrate
    ```
- Create superuser (admin account):
    ```
    python manage.py createsuperuser
    ```
- Super User
    ```
    mis/wallem1234
    ```