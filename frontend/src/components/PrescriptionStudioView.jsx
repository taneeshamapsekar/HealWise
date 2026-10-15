import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Pill, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle, 
  Calendar, 
  Sun, 
  Sunset, 
  Moon,
  Plus
} from 'lucide-react';
import { analyzePrescription } from '../lib/api';

const CLINICAL_TEMPLATES = [
  {
    title: "Acute Sinus Infection",
    text: "Tab Augmentin 625mg 1 tab BD pc x 5 days\nTab Paracetamol 650mg 1 tab TDS pc x 3 days\nCap Pantoprazole 40mg 1 cap OD ac x 5 days\nDiagnosis: Acute bacterial sinus infection"
  },
  {
    title: "Type-2 Diabetes & BP",
    text: "Tab Metformin 500mg 1 tab BD pc\nTab Telmisartan 40mg 1 tab OD ac\nTab Atorvastatin 10mg 1 tab OD HS\nDiagnosis: Type 2 Diabetes Mellitus with Essential Hypertension"
  },
  {
    title: "Seasonal Allergy & Cough",
    text: "Tab Montelukast 10mg + Levocetirizine 5mg 1 tab OD HS x 7 days\nSyp Ascoril-D 5ml TDS pc x 5 days\nDiagnosis: Allergic Bronchitis with dry nocturnal cough"
  }
];

export default function PrescriptionStudioView({ onImportToSchedule }) {
  const [inputText, setInputText] = useState(CLINICAL_TEMPLATES[0].text);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const res = await analyzePrescription(inputText, 'English');
      setAnalysisResult(res);
      showToast('Prescription simplified successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAllToCalendar = () => {
    if (!analysisResult?.medicines?.length) return;
    const newItems = analysisResult.medicines.map((m, idx) => ({
      id: `rx-${Date.now()}-${idx}`,
      name: `${m.name} (${m.dose || '1 dose'})`,
      time: m.times?.[0] || 'morning',
      status: 'pending'
    }));
    onImportToSchedule(newItems);
    showToast('Added medicines to your Dashboard Medication Tracker!');
  };

  return (
    <div className="space-y-6">
      
      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            AI Prescription Simplifier & Care Plan
          </h1>
          <p className="text-xs text-slate-400">
            Paste doctor notes or prescriptions. AI automatically structures the dosage schedule, extracts generic salts, and identifies drug-food cautions.
          </p>
        </div>

        {analysisResult && (
          <button
            onClick={handleAddAllToCalendar}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Sync to My Calendar</span>
          </button>
        )}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input and Templates (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Templates */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CLINICAL_TEMPLATES.map((tmpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInputText(tmpl.text)}
                className="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white whitespace-nowrap transition-all"
              >
                {tmpl.title}
              </button>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <label className="text-xs font-bold text-white block">
              Enter / Paste Prescription Text
            </label>
            <textarea
              rows={11}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste doctor notes, e-prescription, or discharge summary here..."
              className="w-full text-xs font-mono p-3.5 bg-slate-950 border border-slate-800 rounded-2xl focus:border-emerald-500 outline-hidden text-slate-200 leading-relaxed placeholder:text-slate-600"
            />
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !inputText.trim()}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Simplify & Structure Care Plan</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: AI Output Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {analysisResult ? (
            <div className="space-y-4">
              
              {/* Diagnosis Summary Card */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                  Clinical Diagnosis
                </span>
                <h3 className="text-base font-bold text-white">{analysisResult.diagnosis}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{analysisResult.summary}</p>
              </div>

              {/* Medicine Breakdown Cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Extracted Medications & Dosing
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysisResult.medicines?.map((med, idx) => (
                    <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">{med.name}</div>
                          <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                            Generic: {med.generic_name}
                          </div>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                          {med.dose}
                        </span>
                      </div>

                      {/* Timings */}
                      <div className="flex items-center gap-1.5 text-[10px]">
                        {med.times?.includes('morning') && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/80">
                            <Sun className="w-3 h-3 text-amber-400" /> Morning
                          </span>
                        )}
                        {med.times?.includes('afternoon') && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-950/60 text-orange-300 border border-orange-800/80">
                            <Sunset className="w-3 h-3 text-orange-400" /> Afternoon
                          </span>
                        )}
                        {med.times?.includes('night') && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/80">
                            <Moon className="w-3 h-3 text-indigo-400" /> Night
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                        <span>Take: <strong className="text-slate-200 capitalize">{med.with_food} food</strong></span>
                        <span>{med.duration_days} days</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety & Interactions */}
              {(analysisResult.interactions?.length > 0 || analysisResult.warnings?.length > 0) && (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Safety Precautions & Cautions
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {analysisResult.interactions?.map((item, i) => <li key={`int-${i}`}>{item}</li>)}
                    {analysisResult.warnings?.map((item, i) => <li key={`warn-${i}`}>{item}</li>)}
                  </ul>
                </div>
              )}

            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 p-8 text-center space-y-2">
              <Pill className="w-8 h-8 text-slate-600" />
              <p className="text-xs font-semibold text-slate-400">Ready to simplify</p>
              <p className="text-[11px]">Select a template on the left or paste your notes and click Simplify.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
