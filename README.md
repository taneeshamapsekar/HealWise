# HealWise 🩺

> **"Care doesn't end when the patient leaves the clinic."**  
> *Health Tech & Human Wellbeing | 3-Day Hackathon Project*

---

## 📌 Project Overview
**HealWise** is an AI-powered post-consultation care companion tailored for rural, elderly, and multilingual patients. It decodes medical prescriptions into plain-language, spoken instructions across regional Indian languages, plots an automatic dosage calendar, and maintains a doctor-supervised follow-up check-in loop.

### 🌟 Core Capabilities
1. **Prescription Parsing & Simplification**: Extracts medications, generic (salt) equivalents, dosages, frequency, and warnings using Google Gemini.
2. **Multilingual Audio (TTS)**: Delivers spoken explanations in Hindi (`hi`), Marathi (`mr`), Tamil (`ta`), Telugu (`te`), and English (`en`) via server-side gTTS (with Konkani falling back to Marathi/Hindi).
3. **Visual Medication Calendar**: Schedules daily dosage events (morning, afternoon, night) with `react-big-calendar`.
4. **Adaptive Doctor-in-the-Loop Check-ins**: 
   - Supports both symptom progression (`Better / Same / Worse`) and side-effect screening (`Yes / No`).
   - Dynamically triggers progression queries when patients report `"Same"` or `"Worse"`.
   - Triages patient status on a doctor dashboard (`Green` / `Amber` / `Red`).
5. **Safety-First AI**: Explicitly emits `"unclear"` for illegible handwriting instead of guessing dosages; displays persistent medical disclaimers; keeps original prescription text side-by-side.
6. **Failsafe Demo Mode**: Includes 1-click role switching (`Doctor` / `Patient`) and pre-loaded sample prescriptions to guarantee seamless live presentations without network or auth blockers.

---

## 📂 Repository Architecture

```text
healwise/
├── backend/
│   ├── main.py              # FastAPI app (/analyze, /checkin-questions, /summarize, /tts)
│   ├── requirements.txt     # fastapi, uvicorn, python-multipart, google-genai, gtts, pydantic
│   └── .env.example         # GEMINI_API_KEY, GEMINI_MODEL, ALLOWED_ORIGINS
├── frontend/
│   ├── src/
│   │   ├── components/      # Upload, MedicineCard, CalendarView, CheckinForm, Dashboard, DemoBar
│   │   ├── pages/           # Login, DoctorHome, PatientHome
│   │   └── lib/             # api.js, supabase.js, demoData.js
│   ├── package.json
│   ├── vercel.json          # SPA route rewrites for client-side navigation
│   └── .env.example         # VITE_API_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
├── HealWise_Project_Plan.md # Original 3-day hackathon plan
└── README.md                # Project documentation & developer guide
```

---

## 🛠️ Tech Stack & Service Decisions

| Layer | Choice | Rationale & Configuration |
|---|---|---|
| **Frontend** | React (Vite) + Tailwind CSS | Rapid component building with responsive mobile layout |
| **Backend** | Python + FastAPI + Uvicorn | Lightweight, asynchronous REST API with auto-generated docs |
| **AI / OCR** | `gemini-2.0-flash` | Generous free tier limits (15 RPM, 1,500 RPD), fast inference, multimodal OCR |
| **Text-to-Speech** | gTTS via `GET /tts` | Direct browser `<audio src="...">` streaming without complex blob decoding |
| **Database & Auth** | Supabase (PostgreSQL + Auth) | Free hosted database with 1-click Demo Switcher fallback |
| **Calendar** | `react-big-calendar` + `date-fns` | Visual daily dosage scheduling |
| **Hosting** | Vercel (Frontend) + Render (Backend) | Free tier cloud deployment with pre-warming protocol |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+) & Python (v3.10+)
- Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)
- Free [Supabase](https://supabase.com/) project

### 2. Backend Setup
```bash
cd backend
python -m venv .venv

# Windows Powershell:
.\.venv\Scripts\Activate.ps1
# Mac/Linux:
# source .venv/bin/activate

pip install fastapi uvicorn python-multipart google-genai gtts pydantic

# Copy environment variables
cp .env.example .env

# Run backend
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## 🔑 Environment Variables

### `backend/.env`
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
ALLOWED_ORIGINS=http://localhost:5173,https://healwise.vercel.app
```

### `frontend/.env`
```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

---

## 📡 API Endpoints

### 1. `POST /analyze`
- **Description**: Parses prescription image into structured medical plan.
- **Request**: `multipart/form-data` with `file: UploadFile`, `lang: str` (e.g., `Hindi`, `Marathi`)
- **Response**:
```json
{
  "original_text": "Tab Paracetamol 650mg TDS x 3d pc",
  "diagnosis": "Viral fever with body ache",
  "medicines": [
    {
      "name": "Paracetamol 650mg",
      "generic_name": "Paracetamol",
      "dose": "650mg",
      "times": ["morning", "afternoon", "night"],
      "with_food": "after",
      "duration_days": 3,
      "purpose": "बुखार और बदन दर्द कम करने के लिए"
    }
  ],
  "interactions": [],
  "warnings": ["Do not exceed 3 tablets in 24 hours"],
  "summary": "यह दवा बुखार कम करने के लिए है। खाना खाने के बाद लें।"
}
```

### 2. `GET /tts`
- **Description**: Streams MP3 audio directly for any text string.
- **Query Params**: `text` (URL encoded string), `lang` (`hi`, `mr`, `ta`, `te`, `en`)
- **Usage in React**: `<audio controls src="${API_URL}/tts?text=${encodeURIComponent(text)}&lang=hi" />`

### 3. `POST /checkin-questions`
- **Description**: Generates doctor-reviewable check-in questions with mixed formats (Yes/No & progression).
- **Request Body**:
```json
{
  "prescription": { ... },
  "lang": "Hindi"
}
```
- **Response**:
```json
{
  "questions": [
    { "id": "q1", "text": "क्या बुखार में सुधार हुआ है?", "type": "progression", "options": ["Better", "Same", "Worse"] },
    { "id": "q2", "text": "क्या पेट में कोई जलन या उल्टी महसूस हो रही है?", "type": "boolean", "options": ["Yes", "No"] }
  ]
}
```

### 4. `POST /summarize`
- **Description**: Evaluates patient check-in responses; triggers escalation when answers are `"Same"` or `"Worse"`.
- **Response**:
```json
{
  "status": "amber",
  "summary": "Patient reports persistent fever (Same) with mild dizziness on Day 2.",
  "follow_up_recommended": true
}
```

---

## 🗄️ Database Schema (Supabase)

```sql
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null,
  role text check (role in ('doctor','patient')) not null,
  language text default 'Hindi',
  created_at timestamptz default now()
);

create table prescriptions (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references profiles(id),
  patient_id uuid references profiles(id),
  data jsonb not null,
  questions jsonb,
  start_date date default current_date,
  created_at timestamptz default now()
);

create table checkins (
  id uuid primary key default gen_random_uuid(),
  prescription_id uuid references prescriptions(id) on delete cascade,
  answers jsonb not null,
  status text check (status in ('green', 'amber', 'red')),
  summary text,
  created_at timestamptz default now()
);
```

---

## 🛡️ Critical Flaws Addressed & Guardrails

| Flaw / Edge Case | Impact | Solution Implemented |
|---|---|---|
| **Audio via POST** | Standard `<audio>` tag cannot play form POSTs | Changed to `GET /tts?text=...&lang=...` for native streaming |
| **Inflexible "Better/Same/Worse"** | Cannot answer side-effect questions | Mixed schema: `Yes/No` for side-effects + `Better/Same/Worse` for symptoms + adaptive drilldown on `Worse` |
| **Auth Failures during Demo** | Supabase default email confirmation halts sign-up | Built-in 1-click **Demo Switcher Bar** to jump between Doctor and Patient sessions instantly |
| **Calendar `NaN` / Bad Timing** | String `duration_days` or unrecognized time keywords crash calendar | Safe time mapper supporting `morning`, `afternoon`, `evening`, `night`, `bedtime`, `SOS` with integer coercion |
| **Gemini JSON Markdown Wrapping** | `json.loads()` errors on ````json ... ```` formatting | Backend regex strip before JSON decoding with fallback parser |
| **Vercel Client-Side 404s** | Direct navigation to `/doctor` or `/patient` causes 404 | Included `vercel.json` rewrite configuration |
| **Render Cold Starts** | 60-second delay during live judging | Pre-load 2 sample prescriptions locally in frontend + wake-up ping script |

---

## 👥 Hackathon Team Split
- **Frontend Lead**: Vite React setup, UI Components (Medicine Cards, Calendar, Check-in Form), Mobile layout, Demo switcher.
- **Backend & AI Lead**: FastAPI routes, Gemini prompt engineering, Supabase queries, gTTS pipeline, deployment & CORS.
