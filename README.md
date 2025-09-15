# 🔐 PIN Verification App

A fullstack PIN verification application built with:

- **Frontend** → React (Vite + TypeScript)
- **Backend** → Django + Django REST Framework + JWT (SimpleJWT)

---

## 📂 Project Structure
```
doc_route/
├── frontend/ # React app (PIN entry UI)
└── backend/ # Django API (PIN verification + JWT auth)
```

## ⚛️ Frontend (React)


## 🐍 Backend (Django)

> Setup
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