# 🔐 PIN Verification App (React + Vite + SWC + TS)
A simple PIN verification app built with React, Vite, TypeScript, and SWC.
It demonstrates PIN input, validation, lockout after failed attempts, and timeout-based unlock — all without external styling frameworks.

---
## 🚀 Features
- 4-digit PIN input
- PIN lockout after 3 failed attempts (10 seconds)
- Toast notifications (success, error, warning)
- Redirect to a simple Dashboard on success
- Logout option to return to the PIN screen

---

## 🛠️ Tech Stack
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)

---
## 📂 Project Structure
```
frontend/
├── src/
│ ├── App.tsx # Main router setup
│ ├── PinPage.tsx # PIN verification page
│ ├── Dashboard.tsx # Dashboard page (after success)
│ ├── App.css # Styles
│ └── main.tsx # Entry point
├── package.json
├── tsconfig.json
└── README.md
```
