# HealWise 🩺

> **"Care doesn't end when the patient leaves the clinic."**  
> *Health Tech & Human Wellbeing | AI-Powered Post-Consultation Care Loop*

---

## 📌 Project Overview
**HealWise** is an AI-powered healthcare companion connecting doctors and patients after clinic consultations. It eliminates medication confusion by translating complex clinical notes into structured dosage schedules, tracks daily medication adherence with an interactive calendar, enables verified specialist discovery, and maintains an adaptive doctor check-in loop to flag recovering or deteriorating patients.

---

## 🌟 Core Features & Wireframe Modules

### 1. 🔐 Supabase Authentication & Role Access
* **Sign In & Sign Up** modal powered by **Supabase Auth**.
* Supports both **Patient** and **Doctor** roles with tailored interfaces.
* **1-Click Instant Demo** buttons (`Panduji (Patient)` & `Dr. Ananya (Doctor)`) for rapid evaluation.

### 2. 📅 Patient Care Dashboard
* **Patient Profile Card**: Displays circular avatar, user name (`Panduji`), age, gender, active medical condition, and an **`[Edit Profile]`** modal.
* **Daily Medication Checklist**: Interactive task cards (`Take Dolo 650 morning`) with one-tap **`[✓]` (Taken)** and **`[✕]` (Missed)** logging.
* **Kalender Grid**: Monthly schedule showing active medication days, doses taken, and upcoming check-ins.

### 3. 🔍 Doctor Directory (`Search for dr`)
* Top search bar filtering by name, qualification, or hospital.
* Category pills for specialties (Cardiology, General Physician, ENT, Pediatrics, Orthopedics).
* Detailed doctor cards displaying qualifications (`MBBS, MD`), clinic locations, consultation fees, and **highlighted specialty tags**.

### 4. 📝 Doctor Follow-up Check-in (`Quiz`)
* Interactive post-visit questionnaire matching clinical follow-up protocols:
  * **Question 1**: Adherence check (`Yes` / `No`).
  * **Question 2**: Pain & symptom severity scale (`Normal` / `Mild` / `Severe`).
  * **Question 3**: Side effects and medication tolerance screening.
* **Draft Saving**: Save progress locally with `[Save Draft]`.
* **Clinical Triage Submission**: Instant AI classification into 🟢 **Green (Stable)**, 🟡 **Amber (Review)**, or 🔴 **Red (Urgent Alert)** flags.

### 5. 💊 AI Prescription & Clinical Note Simplifier
* Simplifies prescription text and abbreviations (`OD`, `BD`, `TDS`, `PC`, `AC`).
* Extracts active generic (salt) chemical equivalents, dosage schedules, food interactions, and safety precautions.
* **Sync to Calendar**: 1-click button to import parsed medicines directly into your daily tracker.

### 6. 👨‍⚕️ Doctor Care Triage & Patient Registry
* **Triage Dashboard**: Priority patient queue sorting acute 🔴 **Red Alerts** to the top with automated clinical summaries and a direct **`[Call Patient]`** button.
* **Clinic Patient Registry**: Searchable roster of registered clinic patients, active diagnoses, and consultation histories.

---

## 📂 Repository Architecture

```text
HealWise/
├── backend/
│   ├── main.py              # FastAPI app (/analyze, /checkin-questions, /summarize-checkin, /chat)
│   ├── requirements.txt     # fastapi, uvicorn, google-genai, pydantic, python-dotenv
│   └── .env.example         # GEMINI_API_KEY, GEMINI_MODEL, ALLOWED_ORIGINS
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthView.jsx             # Supabase Login & Sign Up screen
│   │   │   ├── Sidebar.jsx              # Navigation with 1-click Role Switcher
│   │   │   ├── DashboardView.jsx        # Patient Profile, Med Tasks (✓/✕) & Kalender
│   │   │   ├── DoctorDirectoryView.jsx  # Search for Doctor & Specialty Cards
│   │   │   ├── QuizView.jsx             # Doctor Follow-up Questionnaire (Yes/No, Normal/Mild/Severe)
│   │   │   ├── PrescriptionStudioView.jsx # AI Note Simplifier & Calendar Sync
│   │   │   ├── DoctorDashboard.jsx      # Doctor Triage Priority Queue (Red/Amber/Green)
│   │   │   ├── DoctorPatientsView.jsx   # Clinic Patient Registry
│   │   │   └── EditProfileModal.jsx     # Profile editor modal
│   │   ├── lib/
│   │   │   ├── api.js                   # Backend API client with offline fallback
│   │   │   ├── supabase.js              # Supabase Auth client & session manager
│   │   │   └── demoData.js              # Presets and mock patient records
│   │   ├── App.jsx                      # Main app state orchestrator
│   │   ├── index.css                    # Tailwind CSS directives
│   │   └── main.jsx                     # React entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── .env.example
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| **Frontend** | React (Vite) + Tailwind CSS | Rapid, component-driven responsive dashboard |
| **Backend** | Python + FastAPI + Uvicorn | High-performance asynchronous REST API |
| **Database & Auth** | Supabase (PostgreSQL + Auth) | User authentication and relational data storage |
| **AI Engine** | Google Gemini (`gemini-2.0-flash`) | Fast inference, structured extraction & risk triage |

---

## 🔑 Environment Setup

### 1. Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_or_publishable_key
```

### 2. Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```env
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
PORT=8000
```

---

## 🗄️ Supabase SQL Schema

Execute the following in your **Supabase SQL Editor**:

```sql
-- 1. Profiles Table linked to Supabase Auth
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  role text check (role in ('patient', 'doctor')) default 'patient',
  gender text default 'Male',
  age int default 58,
  condition text default 'General Health',
  created_at timestamptz default now()
);

-- 2. Follow-up Check-ins Table
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  answers jsonb not null,
  status text check (status in ('green', 'amber', 'red')),
  summary text,
  action_recommended text,
  created_at timestamptz default now()
);
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 2. Running Frontend
```bash
cd frontend
npm install
npm run dev
# App is available at http://localhost:5173
```

### 3. Running Backend
```bash
cd backend
python -m venv .venv

# Windows Powershell:
.\.venv\Scripts\Activate.ps1
# Mac / Linux:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# API docs available at http://127.0.0.1:8000/docs
```
