import React, { useState, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  MessageSquare, 
  Sparkles, 
  Sun, 
  Sunset, 
  Moon, 
  Pill, 
  Check, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { getAudioStreamUrl, submitCheckinAnswers, askPrescriptionChat } from '../lib/api';

export default function PatientPortal({
  activePrescriptionData,
  selectedLang,
  onCheckinSubmitted
}) {
  const analysis = activePrescriptionData?.analysis || null;
  const questions = activePrescriptionData?.questions || [];

  // Audio State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);

  // Adherence State (mock daily checklist)
  const [takenDoses, setTakenDoses] = useState({
    'med-0-morning': true,
    'med-1-morning': true,
  });

  // Check-in Form State
  const [answers, setAnswers] = useState({});
  const [isSubmittingCheckin, setIsSubmittingCheckin] = useState(false);
  const [checkinResult, setCheckinResult] = useState(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: selectedLang.toLowerCase().includes('marathi')
        ? 'नमस्कार! मी HealWise काळजी सहाय्यक आहे. तुमच्या औषधांविषयी किंवा आहाराविषयी कोणताही प्रश्न विचारा.'
        : 'नमस्ते! मैं HealWise केयर असिस्टेंट हूँ। अपनी दवाओं, समय या खान-पान से जुड़ा कोई भी सवाल पूछें।'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Toggle dose taken
  const toggleDose = (key) => {
    setTakenDoses(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Audio Playback
  const handleToggleAudio = () => {
    if (!analysis) return;
    
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
      return;
    }

    const ttsText = `${analysis.diagnosis}. ${analysis.summary}. ${analysis.medicines?.map(m => `${m.name}, ${m.dose}, ${m.with_food} food.`).join(' ')}`;
    const langMap = { Hindi: 'hi', Marathi: 'mr', Tamil: 'ta', Telugu: 'te', English: 'en' };
    const langCode = langMap[selectedLang] || 'hi';

    if (audioRef.current) {
      audioRef.current.src = getAudioStreamUrl(ttsText, langCode);
      audioRef.current.play()
        .then(() => setIsPlayingAudio(true))
        .catch(err => {
          console.warn("Audio playback error, falling back to speech synthesis:", err);
          // Fallback to browser SpeechSynthesis
          if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance(ttsText);
            utter.lang = langCode === 'hi' ? 'hi-IN' : 'en-US';
            utter.onend = () => setIsPlayingAudio(false);
            window.speechSynthesis.speak(utter);
            setIsPlayingAudio(true);
          }
        });
    }
  };

  // Handle Check-in Answer Selection
  const handleSelectAnswer = (qText, option) => {
    setAnswers(prev => ({ ...prev, [qText]: option }));
  };

  // Submit Check-in
  const handleSubmitCheckin = async () => {
    const formatted = Object.entries(answers).map(([question, answer]) => ({ question, answer }));
    if (formatted.length === 0) return;

    setIsSubmittingCheckin(true);
    try {
      const result = await submitCheckinAnswers(analysis, formatted, selectedLang);
      setCheckinResult(result);
      if (onCheckinSubmitted) {
        onCheckinSubmitted({
          patientName: 'Ramesh Patil',
          status: result.status,
          summary: result.summary,
          action: result.action_recommended,
          answers: formatted
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingCheckin(false);
    }
  };

  // Send Chat Query
  const handleSendChat = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await askPrescriptionChat(analysis, userText, selectedLang);
      setChatMessages(prev => [...prev, { role: 'assistant', text: res.reply }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [
        ...prev, 
        { role: 'assistant', text: 'कृपया आपली औषधे वेळेवर घ्या आणि कोणत्याही अडचणीवर डॉक्टरांशी बोला.' }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Pill className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
        <h2 className="text-xl font-bold text-slate-800">No active prescription found</h2>
        <p className="text-sm text-slate-500">
          Switch to <strong>Doctor Studio</strong> to load or approve a prescription first.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlayingAudio(false)} 
        onError={() => setIsPlayingAudio(false)}
      />

      {/* Patient Hero Banner with Audio Action */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <ShieldCheck className="w-4 h-4" /> Doctor-Supervised Care Plan
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Namaste, Ramesh Patil
          </h1>
          <p className="text-sm text-emerald-100/90 max-w-xl">
            {analysis.summary}
          </p>
        </div>

        {/* Audio Player Button */}
        <div className="shrink-0">
          <button
            onClick={handleToggleAudio}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all transform active:scale-95 ${
              isPlayingAudio
                ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300/40 animate-pulse'
                : 'bg-white text-emerald-950 hover:bg-emerald-50'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-6 h-6 text-slate-950" />
                <div className="text-left">
                  <div className="text-xs uppercase tracking-wider text-slate-800">Speaking ({selectedLang})</div>
                  <div className="font-extrabold text-sm">Tap to Pause</div>
                </div>
              </>
            ) : (
              <>
                <Volume2 className="w-6 h-6 text-emerald-600" />
                <div className="text-left">
                  <div className="text-xs uppercase tracking-wider text-slate-500">Audio Guide</div>
                  <div className="font-extrabold text-sm">Listen in {selectedLang}</div>
                </div>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Patient Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Medication Schedule & Calendar (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Daily Schedule Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">Today's Medication Tracker</h2>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Day 1 of 5
              </span>
            </div>

            {/* Timed Dose Slots */}
            <div className="space-y-3">
              
              {/* Morning Slot */}
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-600" /> Morning Routine (8:00 AM)
                  </span>
                  <span className="text-amber-700 font-medium">After Breakfast</span>
                </div>
                {analysis.medicines?.filter(m => m.times?.includes('morning')).map((med, idx) => {
                  const key = `med-${idx}-morning`;
                  const isChecked = !!takenDoses[key];
                  return (
                    <div 
                      key={idx} 
                      onClick={() => toggleDose(key)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                        isChecked ? 'bg-white border-emerald-300 text-slate-500' : 'bg-white/80 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <span className={`text-xs font-bold ${isChecked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {med.name}
                          </span>
                          <span className="text-[11px] text-slate-500 ml-2">({med.dose})</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                        Take {med.with_food} food
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Afternoon Slot */}
              <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-orange-900">
                  <span className="flex items-center gap-1.5">
                    <Sunset className="w-4 h-4 text-orange-600" /> Afternoon Routine (2:00 PM)
                  </span>
                  <span className="text-orange-700 font-medium">After Lunch</span>
                </div>
                {analysis.medicines?.filter(m => m.times?.includes('afternoon')).map((med, idx) => {
                  const key = `med-${idx}-afternoon`;
                  const isChecked = !!takenDoses[key];
                  return (
                    <div 
                      key={idx} 
                      onClick={() => toggleDose(key)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                        isChecked ? 'bg-white border-emerald-300 text-slate-500' : 'bg-white/80 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <span className={`text-xs font-bold ${isChecked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {med.name}
                          </span>
                          <span className="text-[11px] text-slate-500 ml-2">({med.dose})</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                        Take {med.with_food} food
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Night Slot */}
              <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                  <span className="flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-indigo-600" /> Night Routine (9:00 PM)
                  </span>
                  <span className="text-indigo-700 font-medium">After Dinner</span>
                </div>
                {analysis.medicines?.filter(m => m.times?.includes('night')).map((med, idx) => {
                  const key = `med-${idx}-night`;
                  const isChecked = !!takenDoses[key];
                  return (
                    <div 
                      key={idx} 
                      onClick={() => toggleDose(key)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                        isChecked ? 'bg-white border-emerald-300 text-slate-500' : 'bg-white/80 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <span className={`text-xs font-bold ${isChecked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {med.name}
                          </span>
                          <span className="text-[11px] text-slate-500 ml-2">({med.dose})</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                        Take {med.with_food} food
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Medicine Card details & Generic Salts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-600" />
              Medication Details & Affordable Generic Equivalents
            </h3>

            <div className="space-y-3">
              {analysis.medicines?.map((med, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{med.name} ({med.dose})</span>
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-md">
                      {med.duration_days} Days Course
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Generic Chemical Salt:</strong>{' '}
                    <span className="text-emerald-800 font-medium">{med.generic_name}</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    💡 <em>{med.purpose}</em>
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Check-in & Q&A Assistant (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Doctor-approved Check-in Form */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-200/80 shadow-xs space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Care Loop Follow-up
              </span>
              <h2 className="text-base font-bold text-slate-900">
                How Are You Feeling Today?
              </h2>
              <p className="text-xs text-slate-500">
                Answer these 3 quick questions. Your doctor will review your responses.
              </p>
            </div>

            {checkinResult ? (
              <div className={`p-4 rounded-xl border space-y-2 ${
                checkinResult.status === 'red'
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : checkinResult.status === 'amber'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}>
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Check-in Submitted ({checkinResult.status.toUpperCase()} Flag)</span>
                </div>
                <p className="text-xs font-medium leading-relaxed">{checkinResult.summary}</p>
                <p className="text-xs font-bold pt-1 border-t border-slate-200/40">
                  Doctor Advice: {checkinResult.action_recommended}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={q.id} className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-semibold text-slate-800">
                      {idx + 1}. {q.text}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((opt) => {
                        const isSelected = answers[q.text] === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelectAnswer(q.text, opt)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              isSelected
                                ? opt === 'Better'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : opt === 'Worse'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'bg-amber-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleSubmitCheckin}
                  disabled={isSubmittingCheckin || Object.keys(answers).length === 0}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmittingCheckin ? 'Submitting...' : 'Send Updates to Doctor'}
                </button>
              </div>
            )}
          </div>

          {/* Grounded Prescription Q&A Assistant */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Ask HealWise About This Prescription</h3>
                <p className="text-[11px] text-slate-500">Ask about missed doses, food rules, or precautions</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-48 overflow-y-auto space-y-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl max-w-[85%] ${
                    msg.role === 'user'
                      ? 'ml-auto bg-emerald-600 text-white rounded-br-none'
                      : 'mr-auto bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {isChatLoading && (
                <div className="text-[11px] text-slate-400 italic">HealWise is typing...</div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="उदा. हे औषध दुधासोबत घेऊ शकतो का?..."
                className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
              />
              <button
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
