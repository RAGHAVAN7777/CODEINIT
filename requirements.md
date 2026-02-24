# Catalyst Project Requirements

This document outlines the tactical and software requirements for running the **Catalyst Hub** (Student Ranking & Performance System).

## 🛠️ Software Requirements
- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher (distributed with Node.js)
- **MongoDB**: A running instance of MongoDB (Local or Atlas)

## 🔑 Environment Configuration
The system requires a `.env` file in the `backend/` directory with the following tactical parameters:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `MONGO_URI` | Connection string for your MongoDB instance | `mongodb://localhost:27017/catalyst` |
| `JWT_SECRET` | Secret key for generating secure session tokens | `your_high_security_secret_key` |
| `PORT` | (Optional) Port for the backend server | `5000` |

## 🚀 Execution directives

### 1. Initialize Dependencies
Run this in both `frontend/` and `backend/` directories after cloning:
```powershell
npm install
```

### 2. Launch Sequence
Launch both services in separate terminal windows:

**Backend:**
```powershell
cd backend
npm run dev
```

**Frontend:**
```powershell
cd frontend
npm run dev
```

---
*Created and maintained by the Catalyst Development Unit.*
