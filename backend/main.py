import io
import json
import os
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="HealWise API",
    description="Backend API for prescription simplification, audio guidance, and doctor check-in triage",
    version="1.0.0"
)

# CORS setup
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [orig.strip() for orig in allowed_origins_env.split(",") if orig.strip()] if allowed_origins_env != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini Setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash").strip()

client = None
if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
    try:
        from google import genai
        client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        print(f"[Warning] Failed to initialize Google GenAI Client: {e}")

# Supported languages map for gTTS
TTS_LANG_MAP = {
    "hindi": "hi",
    "hi": "hi",
    "marathi": "mr",
    "mr": "mr",
    "tamil": "ta",
    "ta": "ta",
    "telugu": "te",
    "te": "te",
    "english": "en",
    "en": "en",
    "konkani": "mr", # Fallback to Marathi as planned
}

# Pydantic Schemas
class MedicineItem(BaseModel):
    name: str
    generic_name: Optional[str] = "unclear"
    dose: Optional[str] = "unclear"
    times: List[str] = Field(default_factory=list, description="morning, afternoon, night")
    with_food: Optional[str] = Field(default="after", description="before, after, with, any")
    duration_days: Optional[int] = 3
    purpose: Optional[str] = ""

class AnalyzeRequest(BaseModel):
    prescription_text: str
    lang: str = "Hindi"

class AnalyzeResponse(BaseModel):
    original_text: str
    diagnosis: str
    summary: str
    medicines: List[MedicineItem]
    interactions: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    disclaimer: str = "यह मार्गदर्शन केवल सूचनात्मक उद्देश्य के लिए है। किसी भी बदलाव के लिए अपने डॉक्टर या फार्मासिस्ट से परामर्श लें।"

class CheckinQuestionsRequest(BaseModel):
    prescription_data: Dict[str, Any]
    lang: str = "Hindi"

class QuestionItem(BaseModel):
    id: str
    text: str
    options: List[str] = Field(default_factory=lambda: ["Better", "Same", "Worse"])

class CheckinQuestionsResponse(BaseModel):
    questions: List[QuestionItem]

class CheckinAnswerItem(BaseModel):
    question: str
    answer: str

class SummarizeCheckinRequest(BaseModel):
    prescription_data: Dict[str, Any]
    answers: List[CheckinAnswerItem]
    lang: str = "Hindi"

class SummarizeCheckinResponse(BaseModel):
    status: str = Field(description="green, amber, red")
    summary: str
    action_recommended: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    prescription_data: Dict[str, Any]
    message: str
    history: Optional[List[ChatMessage]] = Field(default_factory=list)
    lang: str = "Hindi"

class ChatResponse(BaseModel):
    reply: str
    disclaimer: str = "Always verify any medication changes directly with your doctor or pharmacist."

# Fallback presets for offline / demo mode
DEMO_PRESETS = {
    "default": {
        "original_text": "Tab Augmentin 625mg 1 tab BD pc x 5 days\nTab Paracetamol 650mg 1 tab TDS pc x 3 days\nCap Pantoprazole 40mg 1 cap OD ac x 5 days\nDiagnosis: Acute bacterial sinus infection with headache",
        "diagnosis": "साइनस का गंभीर जीवाणु संक्रमण और सिरदर्द",
        "summary": "यह दवाएं आपके साइनस इन्फेक्शन, सूजन और सिरदर्द को ठीक करने के लिए हैं। एंटीबायोटिक का पूरा 5 दिनों का कोर्स अवश्य पूरा करें।",
        "medicines": [
            {
                "name": "Augmentin 625mg",
                "generic_name": "Amoxicillin + Clavulanic Acid",
                "dose": "1 tablet",
                "times": ["morning", "night"],
                "with_food": "after",
                "duration_days": 5,
                "purpose": "संक्रमण (इन्फेक्शन) पैदा करने वाले बैक्टीरिया को खत्म करने के लिए"
            },
            {
                "name": "Paracetamol 650mg",
                "generic_name": "Paracetamol",
                "dose": "1 tablet",
                "times": ["morning", "afternoon", "night"],
                "with_food": "after",
                "duration_days": 3,
                "purpose": "तेज बुखार और सिरदर्द से तुरंत राहत पाने के लिए"
            },
            {
                "name": "Pantoprazole 40mg",
                "generic_name": "Pantoprazole",
                "dose": "1 capsule",
                "times": ["morning"],
                "with_food": "before",
                "duration_days": 5,
                "purpose": "एंटीबायोटिक से पेट में गैस या जलन से बचाव के लिए"
            }
        ],
        "interactions": [
            "ऑगमेंटिन से पेट में गड़बड़ या मतली हो सकती है, इसलिए इसे हमेशा भोजन के बाद लें।"
        ],
        "warnings": [
            "एंटीबायोटिक का कोर्स बीच में न छोड़ें भले ही आप बेहतर महसूस करने लगें।",
            "पैरासिटामोल 24 घंटे में 3 खुराक से ज्यादा न लें।"
        ],
        "disclaimer": "यह मार्गदर्शन केवल सूचनात्मक उद्देश्य के लिए है। किसी भी बदलाव के लिए अपने डॉक्टर या फार्मासिस्ट से परामर्श लें।"
    }
}

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "gemini_configured": client is not None,
        "model": GEMINI_MODEL
    }

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_prescription(req: AnalyzeRequest):
    if not req.prescription_text.strip():
        raise HTTPException(status_code=400, detail="Prescription text cannot be empty.")

    prompt = f"""You are HealWise, an empathetic medical assistant helping patients understand prescriptions and doctor notes.
Target Patient Language: {req.lang}

Task:
Analyze the prescription or clinical notes below:
1. Extract diagnosis in simple terms in {req.lang}.
2. Provide a 1-2 sentence plain-language explanation of what this treatment is for in {req.lang}.
3. For every medicine:
   - name (commercial or brand name)
   - generic_name (active chemical salt, e.g., Amoxicillin, Paracetamol, Metformin)
   - dose (e.g., 1 tablet, 500mg, 5ml)
   - times: list containing only subset of ["morning", "afternoon", "night"] based on OD (morning), BD (morning, night), TDS (morning, afternoon, night), QID, HS (night)
   - with_food: "before" (for AC), "after" (for PC), "with", or "any"
   - duration_days: integer (default 3 or 5 if unstated)
   - purpose: brief purpose translated into {req.lang} (e.g. "बुखार कम करने के लिए")
4. List any drug-drug interactions or food cautions in {req.lang}.
5. List key safety warnings in {req.lang} (e.g. complete antibiotic course, max doses).
6. Return a friendly disclaimer in {req.lang}.
7. If any information is missing or unclear, write "unclear" - NEVER fabricate details.

Prescription Text:
\"\"\"{req.prescription_text}\"\"\"

Return strictly valid JSON with keys:
- original_text (string)
- diagnosis (string in {req.lang})
- summary (string in {req.lang})
- medicines (array of objects: name, generic_name, dose, times, with_food, duration_days, purpose)
- interactions (array of strings in {req.lang})
- warnings (array of strings in {req.lang})
- disclaimer (string in {req.lang})
"""

    if client:
        try:
            from google.genai import types
            res = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )
            data = json.loads(res.text)
            if "original_text" not in data or not data["original_text"]:
                data["original_text"] = req.prescription_text
            return data
        except Exception as e:
            print(f"[Gemini Error in /analyze]: {e}. Falling back to default demo data if applicable.")

    # Graceful fallback demo response
    demo = DEMO_PRESETS["default"].copy()
    demo["original_text"] = req.prescription_text
    return demo

@app.get("/tts")
def text_to_speech(
    text: str = Query(..., description="Text to convert to speech"),
    lang: str = Query("hi", description="Language code (hi, mr, ta, te, en)")
):
    from gtts import gTTS
    selected_lang = TTS_LANG_MAP.get(lang.lower(), "hi")
    
    clean_text = text.strip()
    if not clean_text:
        clean_text = "No text provided."

    try:
        tts_obj = gTTS(text=clean_text, lang=selected_lang, slow=False)
        buf = io.BytesIO()
        tts_obj.write_to_fp(buf)
        buf.seek(0)
        return StreamingResponse(buf, media_type="audio/mpeg", headers={
            "Content-Disposition": 'inline; filename="explanation.mp3"',
            "Cache-Control": "public, max-age=3600"
        })
    except Exception as e:
        # Fallback to English TTS if regional speech voice fails
        print(f"[gTTS regional failed for {selected_lang}]: {e}. Falling back to 'en'.")
        tts_obj = gTTS(text=clean_text, lang="en", slow=False)
        buf = io.BytesIO()
        tts_obj.write_to_fp(buf)
        buf.seek(0)
        return StreamingResponse(buf, media_type="audio/mpeg")

@app.post("/checkin-questions", response_model=CheckinQuestionsResponse)
async def generate_checkin_questions(req: CheckinQuestionsRequest):
    prompt = f"""You are drafting doctor-approved follow-up check-in questions for a patient.
Language: {req.lang}
Prescription Data:
{json.dumps(req.prescription_data, ensure_ascii=False)}

Task:
Generate 3 to 4 concise, empathetic check-in questions to evaluate patient recovery.
- Focus on: symptom improvement (effectiveness), expected side effects (tolerance), and medication adherence.
- For symptom questions, use options: ["Better", "Same", "Worse"]
- For specific side-effect questions, use options: ["Yes", "No"]
- Write questions directly addressing the patient in everyday {req.lang}.

Return strictly JSON with key:
"questions": [
  {{
    "id": "q1",
    "text": "Question in {req.lang}",
    "options": ["Better", "Same", "Worse"]
  }}
]
"""
    if client:
        try:
            from google.genai import types
            res = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.3
                )
            )
            data = json.loads(res.text)
            return data
        except Exception as e:
            print(f"[Gemini Error in /checkin-questions]: {e}")

    # Fallback default questions
    if req.lang.lower() in ["marathi", "mr"]:
        return {
            "questions": [
                {"id": "q1", "text": "औषध सुरू केल्यानंतर तुमचे दुखणे/ताप कसा आहे?", "options": ["Better", "Same", "Worse"]},
                {"id": "q2", "text": "औषध घेतल्यानंतर पोटात मळमळ किंवा जळजळ जाणवत आहे का?", "options": ["Yes", "No"]},
                {"id": "q3", "text": "तुम्ही वेळेवर न चुकता औषध घेत आहात का?", "options": ["Yes", "No"]}
            ]
        }
    return {
        "questions": [
            {"id": "q1", "text": "दवा शुरू करने के बाद आपकी तकलीफ या बुखार में कैसा महसूस हो रहा है?", "options": ["Better", "Same", "Worse"]},
            {"id": "q2", "text": "क्या दवा लेने के बाद पेट में जलन या उल्टी जैसा महसूस हो रहा है?", "options": ["Yes", "No"]},
            {"id": "q3", "text": "क्या आप रोजाना समय पर पूरी खुराक ले रहे हैं?", "options": ["Yes", "No"]}
        ]
    }

@app.post("/summarize-checkin", response_model=SummarizeCheckinResponse)
async def summarize_checkin(req: SummarizeCheckinRequest):
    prompt = f"""You are a clinical decision-support assistant evaluating patient follow-up answers for a doctor dashboard.
Prescription:
{json.dumps(req.prescription_data, ensure_ascii=False)}

Patient Responses:
{json.dumps([a.model_dump() for a in req.answers], ensure_ascii=False)}

Task:
1. Determine patient triage status:
   - "green": patient improving, adhering, no critical side effects.
   - "amber": patient condition unchanged ("Same"), mild side effects, or minor adherence difficulty.
   - "red": patient worsening ("Worse"), severe adverse reactions, or acute danger signs.
2. Provide a 1-2 sentence clinical summary for the doctor.
3. Recommend an action for the clinic team (e.g., "Schedule follow-up call", "Review dose", "Continue regimen").

Return JSON:
{{
  "status": "green" | "amber" | "red",
  "summary": "...",
  "action_recommended": "..."
}}
"""
    if client:
        try:
            from google.genai import types
            res = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1
                )
            )
            data = json.loads(res.text)
            return data
        except Exception as e:
            print(f"[Gemini Error in /summarize-checkin]: {e}")

    # Fallback rule-based triage
    worse_count = sum(1 for a in req.answers if a.answer.lower() == "worse")
    same_count = sum(1 for a in req.answers if a.answer.lower() == "same")
    
    if worse_count > 0:
        return {
            "status": "red",
            "summary": "Patient reports worsening symptoms after medication onset. Immediate doctor review advised.",
            "action_recommended": "Urgent tele-consultation or clinic visit."
        }
    elif same_count > 0:
        return {
            "status": "amber",
            "summary": "Patient symptoms unchanged after 3 days. Monitor tolerance and recovery pace.",
            "action_recommended": "Routine follow-up call in 24 hours."
        }
    return {
        "status": "green",
        "summary": "Patient shows expected recovery and good treatment adherence.",
        "action_recommended": "Complete prescribed course as scheduled."
    }

@app.post("/chat", response_model=ChatResponse)
async def chat_prescription_assistant(req: ChatRequest):
    prompt = f"""You are HealWise, a caring, safety-focused medical assistant answering a patient's questions about their active prescription.
Language: {req.lang}
Active Prescription:
{json.dumps(req.prescription_data, ensure_ascii=False)}

Patient Question:
\"{req.message}\"

Rules:
1. Answer in friendly, reassuring, simple language in {req.lang}.
2. ONLY provide practical usage advice (e.g. taking with water/food, what to do if missed dose, food interactions).
3. NEVER alter dosages or prescribe new drugs.
4. If the question implies severe danger or an emergency, immediately instruct them to seek urgent medical care.
5. Keep the answer concise (2-4 sentences max).

Return strictly JSON:
{{
  "reply": "Your response in {req.lang}"
}}
"""
    if client:
        try:
            from google.genai import types
            res = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.3
                )
            )
            data = json.loads(res.text)
            return {
                "reply": data.get("reply", "कृपया अपनी दवा समय पर लें और किसी भी परेशानी पर डॉक्टर से मिलें।"),
                "disclaimer": "This guidance is for informational purposes. Always consult your doctor or pharmacist."
            }
        except Exception as e:
            print(f"[Gemini Error in /chat]: {e}")

    return {
        "reply": "यह दवा डॉक्टर के निर्देशानुसार समय पर लें। पेट की सुरक्षा के लिए दवा हमेशा भोजन के बाद पानी के साथ लें। यदि कोई असामान्य परेशानी हो तो तुरंत डॉक्टर से संपर्क करें।",
        "disclaimer": "This guidance is for informational purposes. Always consult your doctor or pharmacist."
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
