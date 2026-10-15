import React from 'react';
import { Activity, Stethoscope, Users, User, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

export const LANGUAGES = [
  { code: 'Hindi', label: 'हिन्दी (Hindi)', ttsCode: 'hi' },
  { code: 'Marathi', label: 'मराठी (Marathi)', ttsCode: 'mr' },
  { code: 'Tamil', label: 'தமிழ் (Tamil)', ttsCode: 'ta' },
  { code: 'Telugu', label: 'తెలుగు (Telugu)', ttsCode: 'te' },
  { code: 'English', label: 'English', ttsCode: 'en' },
];

export default function Navbar({
  activeRole,
  setActiveRole,
  selectedLang,
  setSelectedLang,
  isBackendConnected
}) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-800 bg-clip-text text-transparent">
                  HealWise
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-500" /> AI Care Loop
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium hidden md:block">
                Care doesn't end when the patient leaves the clinic
              </p>
            </div>
          </div>

          {/* Role Navigation Bar */}
          <nav className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold shadow-inner">
            <button
              onClick={() => setActiveRole('doctor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-150 ${
                activeRole === 'doctor'
                  ? 'bg-white text-emerald-800 shadow-xs font-bold border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>Doctor Studio</span>
            </button>

            <button
              onClick={() => setActiveRole('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-150 ${
                activeRole === 'dashboard'
                  ? 'bg-white text-teal-800 shadow-xs font-bold border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-teal-600" />
              <span>Triage Dashboard</span>
            </button>

            <button
              onClick={() => setActiveRole('patient')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-150 ${
                activeRole === 'patient'
                  ? 'bg-white text-emerald-800 shadow-xs font-bold border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>Patient Hub</span>
            </button>
          </nav>

          {/* Language Selector & Health */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="text-xs sm:text-sm font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 pr-8 text-slate-700 shadow-xs hover:border-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Backend connectivity indicator */}
            <div 
              title={isBackendConnected ? "Connected to FastAPI Backend" : "Operating in Safe Local Mode"}
              className={`hidden lg:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border ${
                isBackendConnected 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
              <span>{isBackendConnected ? 'API Live' : 'Demo Mode'}</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
