# 🔐 PIN Verification System (React + Django)

This project is a **full-stack PIN verification system** consisting of:

- **Frontend (React + Vite + SWC + TypeScript)** – a simple PIN entry UI with lockout logic.  
- **Backend (Django + DRF + JWT)** – an API to validate PIN codes, enforce lockouts, and issue JWT tokens.  

The project demonstrates secure PIN-based authentication with both a **UI** and a **REST API**.

---

## 📂 Project Structure
```
doc_route/
├─ frontend/ # React + Vite + TypeScript + SWC PIN UI
├─ backend/ # Django + DRF + JWT PIN API
└─ README.md # Project overview
```
## 🚀 Features
### Frontend
- Enter a PIN using a clean UI.
- Auto-focus for each digit.
- Lockout after 3 failed attempts.
- Timeout unlock after 10 seconds.

### Backend
- Secure PIN storage (hashed using Django’s built-in password utilities).
- Each PIN is linked to a `supplier_id` for ownership identification.
- Lockout enforcement at the API level after 3 failed attempts.
- JWT Access + Refresh tokens for session handling.
---

## 📜 Documentation
- 📘 [Frontend Documentation](./frontend/README.md)  
- 📙 [Backend Documentation](./backend/README.md)  
---

## 📜 License
All Rights Reserved © 2025 by Wallem Shipping Philippines,Inc and its affliate companies