# LINK : https://edu-vault-phi.vercel.app/


<div align="center">

# EduVault – Structured Academic Intelligence Platform

![EduVault](https://img.shields.io/badge/EduVault-Academic%20Collaboration-4F46E5?style=for-the-badge)

**Role-Based Governance • Secure Knowledge Exchange • Performance-First Architecture**

[![Stack](https://img.shields.io/badge/Stack-MERN-green?style=flat-square)](#)
[![Authentication](https://img.shields.io/badge/Auth-JWT%20%2B%20RBAC-blue?style=flat-square)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-38BDF8?style=flat-square)](#)
[![Backend](https://img.shields.io/badge/Backend-Express%20%2B%20MongoDB-10B981?style=flat-square)](#)
[![Architecture](https://img.shields.io/badge/Architecture-Role%20Driven-orange?style=flat-square)](#)

A full-stack academic governance platform built to replace fragmented campus note-sharing systems with structured, secure collaboration.

</div>

---

## Problem Statement

Academic collaboration in campuses is fragmented and inefficient.

- Notes are scattered across messaging apps.
- Cloud folders lack role-based structure.
- Faculty struggle to manage class resources securely.
- Students face search friction and resource inconsistency.
- No unified academic governance model exists.

EduVault solves this by modeling real academic relationships — Faculty, Classes, Students, and Resources — within a structured digital ecosystem.

---

## Solution Overview

EduVault introduces a role-driven architecture that enforces structured academic flow:

- Faculty manage classes and resources.
- Students access materials within defined visibility tiers.
- Notes are governed by secure role-based access control.
- Collaboration happens inside controlled boundaries.

The system is built for clarity, governance, and performance — not generic file storage.

---

## System Architecture

```mermaid
graph TD
    A[React Frontend] -->|REST API| B[Express Server]
    B --> C[Authentication Middleware]
    B --> D[Role-Based Access Control]
    B --> E[Controllers]
    E --> F[(MongoDB Database)]

    subgraph Frontend
        F1[Faculty Dashboard]
        F2[Student Dashboard]
        F3[Class View]
        F4[Notes & Sharing]
    end

    subgraph Backend
        C
        D
        E
    end
```

---

## Role-Based Flow

```mermaid
flowchart LR
    U[User Login] --> V{Role?}
    V -->|Faculty| FD[Faculty Dashboard]
    V -->|Student| SD[Student Dashboard]

    FD --> C1[Create Class]
    FD --> N1[Upload Notes]
    FD --> A1[Broadcast Announcement]

    SD --> J1[Join Class]
    SD --> N2[Access Notes]
    SD --> S1[Peer Share]
```

---

## Core Features

### Faculty Governance

- Create and manage academic classes
- Enroll and revoke students securely
- Upload notes with multi-level visibility
- Broadcast structured announcements
- Access student performance dashboards

### Student Ecosystem

- Join classes via secure enrollment
- Access organized academic resources
- Peer-to-peer note sharing
- Study timer with ranking integration

### Secure Note Architecture

- Visibility Tiers:
  - Personal
  - Student-only
  - Public
- Editable / Read-only collaboration modes
- “Delete for Me” local exclusion logic
- JWT-based authentication with RBAC enforcement

---

## Technology Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4-38BDF8?style=for-the-badge&logo=tailwindcss)
![Framer](https://img.shields.io/badge/Framer%20Motion-Animation-black?style=for-the-badge)

### Backend
![Node](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-5-black?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)

### Security
![JWT](https://img.shields.io/badge/JWT-Authentication-red?style=for-the-badge)
![RBAC](https://img.shields.io/badge/RBAC-Role%20Control-purple?style=for-the-badge)

</div>

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/eduvault.git
```

---

### Backend Setup

Create a `.env` file inside `/backend`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_key
PORT=3000
```

Run:

```bash
cd backend
npm install
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Design Principles

EduVault is built on:

1. Structured Academic Flow  
2. Role-Based Governance  
3. Secure Access Control  
4. Performance-First Interface  

The UI emphasizes hierarchy, clarity, and purposeful motion over decorative complexity.

---

## Future Roadmap

- AI-powered note summarization
- Real-time collaborative editing
- Advanced analytics dashboards
- Institution-level deployment support

---

<div align="center">

EduVault — structured academic collaboration engineered for clarity and governance.


</div>
<div align="center">
Developed by RAGHAVAN S
</div>
