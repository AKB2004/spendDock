# 💼 SpendDock — AI-Powered Invoice Management System

**Final Year Project | B2B Invoice Processing Platform**

SpendDock is a B2B invoice management system that automates the entire invoice lifecycle — from vendor submission to approval and payment — using an AI model for intelligent data extraction.

---

## 🚀 Overview

In many organizations, invoice processing is manual, slow, and error-prone. SpendDock eliminates this by introducing an AI-powered workflow that:

* Extracts invoice data automatically
* Streamlines multi-level approvals
* Tracks invoice and payment status
* Reduces manual workload for accountants

---

## ⭐ Key Features

* 🤖 AI-powered invoice data extraction (Pix2Struct)
* 🔄 Multi-level approval workflow (Manager → Client)
* 📊 Dashboard for tracking invoice status
* 📧 Email-based onboarding (Supabase)
* 💳 Simulated payment gateway integration
* 👥 Role-based access control

---

## 👥 User Roles

| Role              | Portal        | Access                                                               |
| ----------------- | ------------- | -------------------------------------------------------------------- |
| Manager           | Vendor Portal | Invite accountants, review invoices, view analytics, manage settings |
| Accountant        | Vendor Portal | Upload invoices                                                      |
| Client Manager    | Client Portal | Approve or reject invoices                                           |
| Client Accountant | Client Portal | Process payments                                                     |

---

## 🔄 Invoice Workflow

```
Accountant uploads PDF
        ↓
AI extracts invoice data
        ↓
Manager reviews → Accept / Reject
        ↓ (if accepted)
Client Manager → Approve / Reject
        ↓ (if approved)
Client Accountant → Payment (simulated)
        ↓
Completed
```

---

## 🏗️ System Architecture

```
Frontend (React)
        ↓
Spring Boot Backend (REST APIs)
        ↓
PostgreSQL (Supabase)

        ↓
AI Service (FastAPI + Pix2Struct)
```

---

## 🛠️ Tech Stack

### Frontend

* React + Vite
* Tailwind CSS
* Supabase Auth

### Backend

* Java Spring Boot
* PostgreSQL (Supabase)
* REST APIs

### AI Service

* FastAPI (Python)
* Pix2Struct (Google)
* pdf2image + poppler

---

## 📁 Project Structure

This repository contains two branches:

| Branch     | Description           |
| ---------- | --------------------- |
| `main`     | Backend — Spring Boot |
| `frontend` | Frontend — React      |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```
git clone https://github.com/AKB2004/spendDock.git
cd spendDock
```

---

### 2. Run Backend (main branch)

```
./mvnw spring-boot:run
```

Runs on: http://localhost:8080

---

### 3. Run AI Service

```
pip install fastapi uvicorn python-multipart Pillow transformers torch pdf2image

set POPPLER_PATH=YOUR_PATH

uvicorn main:app --reload --port 8000
```

Runs on: http://localhost:8000

---

### 4. Run Frontend

```
git checkout frontend
npm install
npm run dev
```

Runs on: http://localhost:5173

---

## 🔐 Environment Variables

### Backend

```
spring.datasource.url=YOUR_DB_URL
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
supabase.url=YOUR_SUPABASE_URL
supabase.service.key=YOUR_KEY
ai.service.url=http://localhost:8000
```

---

### Frontend (.env)

```
VITE_SUPABASE_URL=YOUR_URL
VITE_SUPABASE_ANON_KEY=YOUR_KEY
```

---

## 👨‍💻 Team

| Member             | Role          |
| ------------------ | ------------- |
| Adarsh Priyadarshi | Backend + ML  |
| Abhinash Kumar Bej | Frontend      |
| Vivek SH           | Backend       |
| Amaan Mushtaque    | Frontend + ML |

---

*Final Year Project — 2026*
