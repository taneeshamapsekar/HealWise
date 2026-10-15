import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Save, Send, AlertTriangle, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { submitCheckinAnswers } from '../lib/api';

export default function QuizView({ onBack, onCompleteCheckin }) {
  // Answers state
  const [answers, setAnswers] = useState({
    q1: 'Yes',
    q2: 'Mild',
    q3: 'Yes'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [result, setResult] = useState(null);

  const handleSelectOption = (qKey, option) => {
    setAnswers(prev => ({ ...prev, [qKey]: option }));
    setIsDraftSaved(false);
  };

  const handleSaveDraft = () => {
    localStorage.setItem('healwise_quiz_draft', JSON.stringify(answers));
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 2500);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formatted = [
        { question: "Did you take your medication on time today?", answer: answers.q1 },
        { question: "How would you rate your current pain or symptom level?", answer: answers.q2 },
        { question: "Are you feeling improvement in your general health?", answer: answers.q3 }
      ];

      const triage = await submitCheckinAnswers({}, formatted, 'English');
      setResult(triage);
      if (onCompleteCheckin) {
        onCompleteCheckin({
          answers: formatted,
          triage
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Top Navigation Row strictly matching wireframe Back Arrow [<-] */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-800 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950/60 border border-teal-800/80 px-2.5 py-0.5 rounded-full">
          Doctor Follow-up Questionnaire
        </span>
      </div>

      {/* Main Questionnaire Box strictly matching Wireframe 2 */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            Patient Health & Symptom Quiz
          </h1>
          <p className="text-xs text-slate-400">
            Please answer these questions so your doctor can track your recovery after the clinic visit.
          </p>
        </div>

        {/* Triage result banner if submitted */}
        {result && (
          <div className={`p-4 rounded-2xl border space-y-2 ${
            result.status === 'red'
              ? 'bg-rose-950/40 border-rose-800 text-rose-300'
              : result.status === 'amber'
              ? 'bg-amber-950/40 border-amber-800 text-amber-300'
              : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
          }`}>
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
              {result.status === 'red' ? (
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              ) : result.status === 'amber' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              <span>Triage Assessment: {result.status.toUpperCase()} Flag</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-200">{result.summary}</p>
            <p className="text-xs font-bold pt-1.5 border-t border-slate-800 text-white">
              Doctor Recommendation: {result.action_recommended}
            </p>
          </div>
        )}

        {/* Question 1: [yesss] / [noooooo] matching wireframe Card 1 */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Question 1</span>
            <span className="text-[11px] text-emerald-400 font-semibold">Adherence</span>
          </div>
          <p className="text-sm font-bold text-white">
            Have you been taking all your prescribed medications on time?
          </p>
          
          {/* Options: Yes / No (wireframe: yesss / noooooo) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {['Yes', 'No'].map((opt) => {
              const isSelected = answers.q1 === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectOption('q1', opt)}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? opt === 'Yes'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-extrabold'
                        : 'bg-rose-500 text-white border-rose-400 shadow-md font-extrabold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {opt === 'Yes' ? 'Yes (Taking regularly)' : 'No (Missed doses)'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 2: [normal] / [mild] / [severe] matching wireframe Card 2 */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Question 2</span>
            <span className="text-[11px] text-teal-400 font-semibold">Symptom Severity</span>
          </div>
          <p className="text-sm font-bold text-white">
            How would you rate your current pain, fever, or discomfort level?
          </p>
          
          {/* Options: Normal / Mild / Severe matching wireframe */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            {['Normal', 'Mild', 'Severe'].map((opt) => {
              const isSelected = answers.q2 === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectOption('q2', opt)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border capitalize ${
                    isSelected
                      ? opt === 'Normal'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-extrabold'
                        : opt === 'Mild'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-extrabold'
                        : 'bg-rose-500 text-white border-rose-400 shadow-md font-extrabold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 3: Overall feeling */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Question 3</span>
            <span className="text-[11px] text-cyan-400 font-semibold">Tolerance</span>
          </div>
          <p className="text-sm font-bold text-white">
            Are you experiencing any nausea, stomach burning, or dizziness from medications?
          </p>
          <div className="grid grid-cols-2 gap-3 pt-1">
            {['No', 'Yes'].map((opt) => {
              const isSelected = answers.q3 === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectOption('q3', opt)}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? opt === 'No'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-extrabold'
                        : 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-extrabold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {opt === 'No' ? 'No (Feeling comfortable)' : 'Yes (Feeling side effects)'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions strictly matching wireframe: [save draft] and [submit] */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-slate-400" />
            <span>{isDraftSaved ? 'Draft Saved!' : 'Save Draft'}</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-extrabold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Check-in</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
