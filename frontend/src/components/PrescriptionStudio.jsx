import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  FileText, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle, 
  Pill, 
  Plus, 
  Trash2, 
  ArrowRight,
  Sun,
  Sunset,
  Moon,
  Info
} from 'lucide-react';
import { CLINICAL_PRESETS } from '../lib/demoData';
import { analyzePrescription, generateCheckinQuestions } from '../lib/api';

export default function PrescriptionStudio({
  selectedLang,
  onPublishToPatient,
  activePrescription,
  setActivePrescription
}) {
  const [inputText, setInputText] = useState(CLINICAL_PRESETS[0].text);
  const [selectedPresetId, setSelectedPresetId] = useState(CLINICAL_PRESETS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [editableQuestions, setEditableQuestions] = useState(CLINICAL_PRESETS[0].questions);
  const [toastMessage, setToastMessage] = useState('');

  // Handle Preset Selection
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setInputText(preset.text);
    setActivePrescription(preset.analysis);
    setEditableQuestions(preset.questions);
    showToast(`Loaded ${preset.title}`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Run AI Analysis
  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const result = await analyzePrescription(inputText, selectedLang);
      setActivePrescription(result);
      
      // Also generate check-in questions
      setIsGeneratingQuestions(true);
      const qResult = await generateCheckinQuestions(result, selectedLang);
      if (qResult && qResult.questions) {
        setEditableQuestions(qResult.questions);
      }
      showToast('Prescription analyzed and simplified!');
    } catch (err) {
      console.error(err);
      showToast('Error analyzing prescription, loaded fallback.');
    } finally {
      setIsLoading(false);
      setIsGeneratingQuestions(false);
    }
  };

  // Question editing
  const handleQuestionChange = (id, newText) => {
    setEditableQuestions(prev => prev.map(q => q.id === id ? { ...q, text: newText } : q));
  };

  const handleDeleteQuestion = (id) => {
    setEditableQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleAddQuestion = () => {
    const newId = `q${Date.now()}`;
    setEditableQuestions(prev => [
      ...prev,
      { id: newId, text: 'क्या आप दवा लेने के बाद सामान्य महसूस कर रहे हैं?', options: ['Better', 'Same', 'Worse'] }
    ]);
  };

  // Publish to Patient
  const handlePublish = () => {
    onPublishToPatient({
      analysis: activePrescription,
      questions: editableQuestions,
      rawText: inputText,
      language: selectedLang,
      publishedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    showToast('Sent to Patient Hub & Calendar!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      
      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Doctor Prescription Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Prescription Simplifier & Care Loop
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Input clinical notes or digital prescriptions. HealWise simplifies dosages, warns of interactions, translates to regional languages, and prepares follow-up care.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg transition-transform active:scale-95 text-sm"
          >
            <Send className="w-4 h-4" />
            <span>Approve & Send to Patient</span>
          </button>
        </div>
      </div>

      {/* 1-Click Clinical Demo Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-600" /> Quick Demo Presets (1-Click Load)
          </span>
          <span className="text-xs text-slate-400">Click to test instant live parsing</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CLINICAL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`text-left p-3.5 rounded-xl border transition-all ${
                selectedPresetId === preset.id
                  ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-bold text-slate-800 line-clamp-1">{preset.title}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{preset.shortDesc}</div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                <span>{preset.patientName}</span>
                <span className="font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-xs">{preset.lang}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" /> Clinical Prescription / Doctor Notes
              </label>
              <span className="text-xs text-slate-400">Supports OD, BD, TDS, PC, AC</span>
            </div>

            <textarea
              rows={12}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste doctor prescription, discharge summary or clinical notes..."
              className="w-full text-xs sm:text-sm font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden transition-all text-slate-800 leading-relaxed"
            />

            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing with Gemini 2.0...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Analyze & Simplify in {selectedLang}</span>
                </>
              )}
            </button>
          </div>

          {/* Doctor Questions Review Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-600" /> AI Follow-up Check-in Questions
                </h3>
                <p className="text-xs text-slate-500">Doctor-in-the-loop: Review before dispatch</p>
              </div>
              <button
                onClick={handleAddQuestion}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="space-y-2.5">
              {editableQuestions.map((q, idx) => (
                <div key={q.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-400">Q{idx + 1}</span>
                    <button 
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                    className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:border-emerald-500 outline-hidden"
                  />
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-slate-400">Options:</span>
                    {q.options.map((opt, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Output Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {activePrescription ? (
            <div className="space-y-5">
              
              {/* Diagnosis & Summary Banner */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 p-5 rounded-2xl shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                    Diagnosis & Treatment Goal
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">Language: {selectedLang}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  {activePrescription.diagnosis}
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {activePrescription.summary}
                </p>
              </div>

              {/* Medicine Cards Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-emerald-600" /> Prescribed Medications ({activePrescription.medicines?.length || 0})
                  </h3>
                  <span className="text-xs text-slate-500">Auto-extracted schedule</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {activePrescription.medicines?.map((med, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{med.name}</h4>
                          <p className="text-xs text-slate-500 italic mt-0.5">
                            Generic: <span className="font-semibold text-emerald-700">{med.generic_name}</span>
                          </p>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {med.dose}
                        </span>
                      </div>

                      {/* Schedule Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {med.times?.includes('morning') && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                            <Sun className="w-3 h-3 text-amber-500" /> Morning (8 AM)
                          </span>
                        )}
                        {med.times?.includes('afternoon') && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-orange-50 text-orange-800 border border-orange-200 px-2 py-0.5 rounded-full">
                            <Sunset className="w-3 h-3 text-orange-500" /> Afternoon (2 PM)
                          </span>
                        )}
                        {med.times?.includes('night') && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-full">
                            <Moon className="w-3 h-3 text-indigo-500" /> Night (9 PM)
                          </span>
                        )}
                      </div>

                      {/* Meal & Duration */}
                      <div className="text-xs text-slate-600 flex items-center justify-between pt-1 border-t border-slate-100">
                        <span>Take: <strong className="text-slate-800 capitalize">{med.with_food} food</strong></span>
                        <span>Duration: <strong className="text-slate-800">{med.duration_days} days</strong></span>
                      </div>

                      {med.purpose && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                          💡 {med.purpose}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Warnings & Interactions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Interactions */}
                {activePrescription.interactions?.length > 0 && (
                  <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" /> Safety & Food Interactions
                    </h4>
                    <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
                      {activePrescription.interactions.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {activePrescription.warnings?.length > 0 && (
                  <div className="bg-rose-50/70 border border-rose-200 p-4 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-600" /> Critical Precautions
                    </h4>
                    <ul className="text-xs text-rose-800 space-y-1 list-disc list-inside">
                      {activePrescription.warnings.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-slate-100 rounded-xl text-slate-500 text-[11px] flex items-center gap-2 border border-slate-200">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{activePrescription.disclaimer || "Always verify prescription guidance with your licensed physician or pharmacist."}</span>
              </div>

            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 p-8 text-center space-y-2">
              <FileText className="w-10 h-10 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No prescription parsed yet</p>
              <p className="text-xs">Click one of the 1-click presets above or paste text and click "Analyze".</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
