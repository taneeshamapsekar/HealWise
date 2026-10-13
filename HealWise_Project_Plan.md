# HealWise: Project Plan & Build Guide

> **Tagline:** *Care doesn't end when the patient leaves the clinic.*
> **Hackathon theme:** Health Tech & Human Wellbeing
> **Team:** 2 people | **Timeline:** 3 days

---

## 0. Instructions for the AI coding agent (Antigravity)

- Build the project exactly in the **phase order** in Section 7. **Phase 1 must be a complete, working app on its own** before starting Phase 2.
- Monorepo with two folders: `backend/` (FastAPI, Python) and `frontend/` (React + Vite + Tailwind).
- **Never** expose the Gemini API key in the frontend. All AI calls go through the backend.
- Read secrets from environment variables. Commit only `.env.example`, never `.env`.
- Keep the code beginner-readable: small files, clear names, short comments. The team is learning React and backend development.
- Always show the disclaimer in the UI: *"This is guidance, not medical advice. Confirm with your doctor or pharmacist."*
- The model must **never guess** unreadable text. Illegible fields are returned as `"unclear"`.
- Do not store prescription images. Process them in memory only.
- Prioritise a reliable demo over extra features. See the cut rules in Section 10.

---

## 1. Project overview

**HealWise** is a web app that helps patients understand their prescriptions and helps doctors follow up after the visit.

**Problem:** Many patients, especially elderly and rural ones, cannot read English prescriptions or medical reports. They take medicines incorrectly, and nobody checks on them after the clinic visit.

**Solution:**
1. A patient (or doctor) uploads a photo of a prescription or report.
2. AI extracts the medicines, dosage, and timings and explains them in simple language in the patient's own language, with audio.
3. A calendar shows the medicine schedule and follow-up dates.
4. The doctor sends short AI-drafted check-in questions. The patient answers with simple taps. The AI summarises the responses and flags concerning cases on a doctor dashboard.

**Target user story:** A patient's daughter in Goa photographs her father's prescription. He hears it in Marathi or Hindi, sees a visual daily schedule, and a few days later answers a quick "Better / Same / Worse" check-in. His doctor sees an amber flag if something is off.

---

## 2. Positioning and what makes it win

- The plain "upload a prescription and get an explanation" idea is common. HealWise stands out through **execution, local-language support, and the follow-up loop**.
- Differentiators (build at least two, ideally all):
  - **Follow-up check-ins** drafted by AI and approved by the doctor (human in the loop)
  - **Calendar** generated automatically from the prescription
  - **Generic medicine suggestions** (salt name) with a note to ask the pharmacist, and no invented prices
  - **Interaction and safety flags** between the listed medicines
  - **Follow-up chat** grounded in the prescription (optional stretch)
  - **Regional language support** with audio (Hindi, Marathi, Tamil, Telugu, English; test Konkani)
- Responsible AI points to mention to judges: doctor approves questions, "unclear" instead of guessing, original text shown beside the simplification, no image storage, visible disclaimers.

---

## 3. Review of the earlier (Gemini-generated) plan

**Good and kept:** stateless core flow, single AI call, structured output cards, audio button, sample images for demo.

**Corrections applied:**
1. `gemini-1.5-flash` is outdated. Use the **current Flash model from Google AI Studio** and store it in the `GEMINI_MODEL` env variable.
2. Do not call Gemini from the frontend, since the API key would leak. Use a small FastAPI backend.
3. Browser `speechSynthesis` depends on installed voices and is unreliable for Indian languages. Use **server-side gTTS** as the main path. gTTS does not support Konkani, so fall back to Marathi or Hindi.
4. Added safety: illegible text becomes `"unclear"`, original text is shown alongside, and a disclaimer is always visible.
5. The time estimates were optimistic. Plan for full working days.
6. Free-tier hosting sleeps. Wake the backend 5 minutes before the demo.

---

## 4. Tech stack (final)

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React (Vite) + Tailwind CSS | Team knows Tailwind and is learning React, and it allows parallel work |
| Backend | Python + FastAPI | Team knows Python, and it is quick to build |
| AI | Google Gemini API (current Flash model) | Handles images (OCR), translation, and simplification in one call |
| Database and auth | Supabase (Postgres + Auth) | Free and hosted, with no server setup |
| Text-to-speech | gTTS (server-side) | Reliable across devices, with browser TTS as an optional bonus |
| Calendar | react-big-calendar + date-fns | Quick to set up |
| Hosting | Render (backend) + Vercel (frontend) | Free, with a live link |

**Emergency fallback:** Streamlit (pure Python) if the React frontend becomes a blocker.

---

## 5. Repository structure

```
healwise/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example        # GEMINI_API_KEY=, GEMINI_MODEL=
├── frontend/
│   ├── src/
│   │   ├── components/     # Upload, MedicineCard, CalendarView, CheckinForm, Dashboard
│   │   ├── pages/          # Login, DoctorHome, PatientHome
│   │   └── lib/            # api.js, supabase.js
│   └── .env.example        # VITE_API_URL=, VITE_SUPABASE_URL=, VITE_SUPABASE_ANON_KEY=
├── .gitignore              # .env, node_modules/, __pycache__/, .venv/
└── README.md
```

**Git workflow:** both members are collaborators. Work on branches (`feat/ui`, `feat/api`), merge to `main` through PRs, and never commit `.env`.

---

## 6. Data model and AI output schema

### Supabase tables

```sql
create table profiles (
  id uuid primary key references auth.users,
  name text,
  role text check (role in ('doctor','patient')),
  language text default 'Hindi'
);

create table prescriptions (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references profiles(id),
  patient_id uuid references profiles(id),
  data jsonb,            -- full AI JSON from /analyze
  questions jsonb,       -- approved check-in questions
  start_date date default current_date,
  created_at timestamptz default now()
);

create table checkins (
  id uuid primary key default gen_random_uuid(),
  prescription_id uuid references prescriptions(id),
  answers jsonb,
  status text,           -- green | amber | red
  summary text,
  created_at timestamptz default now()
);
```
Disable RLS for the hackathon, or enable it only if there is spare time at the end.

### `/analyze` JSON output

```json
{
  "original_text": "...",
  "diagnosis": "...",
  "medicines": [{
    "name": "", "generic_name": "", "dose": "",
    "times": ["morning", "night"], "with_food": "after",
    "duration_days": 5, "purpose": ""
  }],
  "interactions": [],
  "warnings": [],
  "summary": ""
}
```

---

## 7. Step-by-step build workflow

### Phase 0: Setup (about 1 hour, together)
1. Create the monorepo and add the teammate as a collaborator.
2. Get a Gemini API key from Google AI Studio and choose the current Flash model.
3. Create a free Supabase project and note the URL and anon key.
4. Decide the split: **frontend owner** and **backend and AI prompts owner**. Avoid editing the same files.
5. Create `.env.example` files. Share real keys privately, never through git.

```bash
mkdir healwise && cd healwise
git init
mkdir backend frontend
printf ".env\nnode_modules/\n__pycache__/\n.venv/\n" > .gitignore
git add . && git commit -m "init"
git remote add origin <your-repo-url>
git branch -M main && git push -u origin main
```

### Phase 1, Day 1: Prescription → explanation pipeline (standalone MVP)

**Step 1: Backend skeleton**
```bash
cd backend && python -m venv .venv && source .venv/bin/activate
pip install fastapi uvicorn python-multipart google-genai gtts
```

```python
# backend/main.py
import os, json
from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

PROMPT = """You are helping a patient understand a prescription or medical report.
Extract the diagnosis, and for each medicine: name, generic (salt) name, dose, times of day
(morning/afternoon/night), with_food (before/after/with/any), duration_days, and purpose.
List any interactions between the medicines and general warnings.
If any text is illegible or uncertain, use "unclear" - never guess.
Write explanations in {lang} using simple everyday words for a rural patient.
Return JSON with keys: original_text, diagnosis, medicines, interactions, warnings, summary."""

@app.post("/analyze")
async def analyze(file: UploadFile, lang: str = Form("Hindi")):
    img = await file.read()
    res = client.models.generate_content(
        model=os.environ["GEMINI_MODEL"],
        contents=[types.Part.from_bytes(data=img, mime_type=file.content_type),
                  PROMPT.format(lang=lang)],
        config=types.GenerateContentConfig(response_mime_type="application/json"),
    )
    return json.loads(res.text)
```
Run it with `uvicorn main:app --reload`.

**Step 2: Prompt tuning.** Test on 5 or more prescriptions (printed, handwritten, blurry) and fix the prompt until the output is reliable. Do this before building the UI.

**Step 3: Frontend scaffold**
```bash
cd frontend && npm create vite@latest . -- --template react
npm i axios @supabase/supabase-js react-big-calendar date-fns
```
Set up Tailwind. Build the layout, a language dropdown, and the upload component:
```html
<input type="file" accept="image/*" capture="environment" />
```

**Step 4: Connect and display.** Send the image to `/analyze` as `FormData`, then render:
- Medicine cards with name, dose, time icons (☀️ morning, 🌆 afternoon, 🌙 night), and purpose
- Warnings and interactions box
- Disclaimer notice (always visible)
- Expandable "original text" section
- 2 sample prescription buttons for demos

**Checkpoint:** upload a photo and get correct cards. If this is not reliable, do not start Phase 2.

### Phase 2, Day 2: Doctor–patient loop

**Step 5: Database.** Run the SQL from Section 6 in Supabase.

**Step 6: Auth and roles.** Use Supabase email/password auth. On sign-up, insert a `profiles` row with a role. Route to `/doctor` or `/patient` after login. Pre-create 1 doctor and 2 patient accounts for the demo.

**Step 7: Doctor flow**
1. Doctor selects a patient and uploads or enters the prescription.
2. The frontend calls `/analyze` in the patient's language and shows the result for review and edit.
3. The frontend calls `/checkin-questions`. The doctor edits or deletes questions, then clicks **Approve & Send**.
4. Save to `prescriptions`.

```python
Q_PROMPT = """Given this prescription JSON, write 3-5 short follow-up questions to check
how the patient is doing (effectiveness, side effects, adherence). Each must be answerable
with one of: "Better", "Same", "Worse". Write in {lang}.
Return JSON: {{"questions": [str]}}"""
```

**Step 8: Patient flow and calendar**
- Show the explanation cards with a **🔊 Listen** button.
- Build calendar events from the medicines:

```js
const HOUR = { morning: 8, afternoon: 14, night: 21 };

function buildEvents(meds, startDate) {
  const events = [];
  meds.forEach(m => {
    for (let d = 0; d < (m.duration_days || 1); d++) {
      (m.times || []).forEach(t => {
        const start = new Date(startDate);
        start.setDate(start.getDate() + d);
        start.setHours(HOUR[t], 0);
        events.push({
          title: `${m.name} ${m.dose}`,
          start,
          end: new Date(start.getTime() + 30 * 60000),
        });
      });
    }
  });
  return events;
}
```
Render with `react-big-calendar`. Add a follow-up check-in date event (for example, start date + 3 days).

**Step 9: Check-in and doctor dashboard**
1. The patient sees the questions as three tap buttons (Better / Same / Worse), and answers are saved to `checkins.answers`.
2. The backend `/summarize` takes the prescription and answers and returns:
```json
{"status": "green|amber|red", "summary": "Patient reports nausea worsening on day 3..."}
```
3. The doctor dashboard lists patients with a coloured status dot and the AI summary, red first.

**Checkpoint:** the full loop works once (doctor → patient → check-in → dashboard).

### Phase 3, Day 3: Audio, polish, deploy, pitch

**Step 10: Audio**
```python
import io
from gtts import gTTS
from fastapi.responses import StreamingResponse

@app.post("/tts")
async def tts(text: str = Form(...), lang: str = Form("hi")):
    buf = io.BytesIO()
    gTTS(text=text, lang=lang).write_to_fp(buf)
    buf.seek(0)
    return StreamingResponse(buf, media_type="audio/mpeg")
```
Language codes: `hi`, `mr`, `ta`, `te`, `en`. Konkani is not supported, so fall back to Marathi or Hindi.

**Step 11: Polish.** Add loading spinners and error messages, test the mobile layout on a real phone, compress images client-side before upload, and keep the disclaimers visible.

**Step 12: Deploy**
1. Backend on **Render**: set `GEMINI_API_KEY`, `GEMINI_MODEL`, and the start command `uvicorn main:app --host 0.0.0.0 --port $PORT`. Restrict CORS to the Vercel URL.
2. Frontend on **Vercel**: set `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
3. Test the whole flow on a phone using the live URLs.
4. Open the app 5 minutes before the demo to wake the backend.

**Step 13: Pitch and demo.** Build 3 slides (Problem → Live Demo → Impact), rehearse, and record a backup video.

---

## 8. Role split

| When | Frontend owner | Backend and AI owner |
|---|---|---|
| Day 1 morning | Vite, React, Tailwind setup, layout, upload with camera, language dropdown | FastAPI setup, API key, `/analyze` endpoint |
| Day 1 evening | Result cards, loading state | Prompt tuning on 5+ prescriptions, JSON schema, "unclear" handling |
| Day 2 morning | Connect UI to API, error states, mobile layout | Supabase schema, `/tts` endpoint, test languages |
| Day 2 evening | Calendar, check-in form, dashboard UI | `/checkin-questions` and `/summarize` endpoints |
| Day 3 morning | Polish, disclaimers, image compression | Deploy backend, set CORS and env vars |
| Day 3 afternoon | Deploy frontend, phone test | Backup video, then pitch slides together |

---

## 9. Demo script (3 minutes)

1. **Problem (30 s):** patients cannot read English prescriptions and nobody checks on them after the visit.
2. **Doctor (45 s):** uploads the prescription, reviews the AI result, and approves the check-in questions.
3. **Patient (45 s):** sees the explanation in Marathi or Hindi, plays the audio, and views the calendar.
4. **Check-in (45 s):** the patient answers "Worse" to a side-effect question, and the doctor dashboard flips to amber with an AI summary.
5. **Close (15 s):** *"Care doesn't end when the patient leaves the clinic."*

**Demo safety:** pre-loaded sample prescriptions, pre-created accounts, a backup video, and a warmed-up backend.

---

## 10. Cut rules if time runs short

| Situation | Cut |
|---|---|
| End of Day 1, pipeline not reliable | Stop. Fix the prompt, skip Phase 2 |
| Mid Day 2, auth is painful | Hardcode two logins and a role switch button |
| End of Day 2, dashboard not done | Show a plain list of check-in summaries |
| Day 3, deployment fails | Demo locally and show the backup video |

**Explicitly out of scope:** video calls, chat between doctor and patient, payments, appointment booking, SMS or push notifications, multiple specialties.

---

## 11. Risks and safety

- **Wrong extraction of dosage.** Mitigation: "unclear" instead of guessing, original text shown beside the explanation, and a visible pharmacist/doctor notice.
- **Not a diagnostic tool.** HealWise explains existing prescriptions and does not diagnose or prescribe.
- **Privacy.** Do not store images. Keep patient data minimal. Note in the pitch that a real deployment needs proper consent and data protection.
- **Cold starts and Wi-Fi.** Wake the server before the demo and keep a backup video.
- **Language audio gaps.** Test each language's TTS on Day 2.

---

## 12. Submission copy

**One-line pitch:** HealWise turns a doctor's prescription into a plain-language, spoken, scheduled care plan in the patient's own language, then checks in with the patient afterwards so problems reach the doctor early.

**Short description:** HealWise helps patients who cannot read English prescriptions understand their medicines through AI explanations with audio, a medicine calendar, and simple check-in questions drafted by AI and approved by their doctor. Doctors get a dashboard that flags patients who are not doing well, so care continues after the clinic visit.

**Impact angle:** fewer medication errors, better adherence, earlier detection of side effects, and accessible healthcare for non-English and low-literacy patients.

---

## 13. Name

**HealWise** was chosen as the final name. Before submission, search it on Google and GitHub to check that nothing well-known already uses it, and pick a Vercel subdomain such as `healwise.vercel.app`. Use one consistent colour palette and a simple logo (a heart or pulse icon) across the app and slides.
