import React, { useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  Phone, 
  FileEdit, 
  Search, 
  Filter, 
  Clock, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { INITIAL_DOCTOR_PATIENTS } from '../lib/demoData';

export default function DoctorDashboard({ triagePatients, setTriagePatients }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const patients = triagePatients || INITIAL_DOCTOR_PATIENTS;

  // Filtered patients
  const filteredPatients = patients
    .filter(p => {
      if (filter !== 'all' && p.status !== filter) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Sort priority: red > amber > green
      const weight = { red: 3, amber: 2, green: 1 };
      return (weight[b.status] || 0) - (weight[a.status] || 0);
    });

  const redCount = patients.filter(p => p.status === 'red').length;
  const amberCount = patients.filter(p => p.status === 'amber').length;
  const greenCount = patients.filter(p => p.status === 'green').length;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleResolvePatient = (id) => {
    setTriagePatients(prev => prev.map(p => p.id === id ? { ...p, status: 'green', statusText: 'Follow-up completed & verified' } : p));
    showToast('Patient marked as resolved / stable.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Doctor Triage Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Patient Post-Clinic Recovery Triage
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            AI prioritizes follow-up check-ins based on symptom trajectory. Red alerts flag patients reporting worsening symptoms or acute medication intolerance.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Monitored</div>
          <div className="text-2xl font-extrabold text-slate-900">{patients.length} Patients</div>
        </div>

        <div className="bg-rose-50/80 p-4 rounded-xl border border-rose-200 shadow-xs space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> Red Alerts
          </div>
          <div className="text-2xl font-extrabold text-rose-800">{redCount} Urgent</div>
        </div>

        <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 shadow-xs space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Amber Flags
          </div>
          <div className="text-2xl font-extrabold text-amber-800">{amberCount} Review</div>
        </div>

        <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 shadow-xs space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Green Stable
          </div>
          <div className="text-2xl font-extrabold text-emerald-800">{greenCount} On Track</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient or diagnosis..."
            className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl focus:border-teal-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold w-full sm:w-auto">
          {['all', 'red', 'amber', 'green'].map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg capitalize transition-all ${
                filter === key
                  ? 'bg-white shadow-xs font-bold text-slate-900'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {key === 'all' ? 'All Patients' : `${key} cases`}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Triage Cards List */}
      <div className="space-y-4">
        {filteredPatients.map((patient) => {
          const isRed = patient.status === 'red';
          const isAmber = patient.status === 'amber';

          return (
            <div
              key={patient.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all space-y-4 ${
                isRed
                  ? 'border-rose-300 ring-2 ring-rose-200/50'
                  : isAmber
                  ? 'border-amber-300'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                    isRed ? 'bg-rose-500 animate-ping' : isAmber ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{patient.name}</h3>
                      <span className="text-xs text-slate-400">({patient.gender}, {patient.age} yrs)</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isRed 
                          ? 'bg-rose-100 text-rose-800' 
                          : isAmber 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {patient.status} flag
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Diagnosis: <strong className="text-slate-700">{patient.diagnosis}</strong> • Last visit: {patient.lastVisit}
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${patient.phone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Patient
                  </a>
                  {isRed && (
                    <button
                      onClick={() => handleResolvePatient(patient.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>

              {/* Patient Check-in QA & AI Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                
                {/* Answers */}
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                    Patient Check-in Responses
                  </div>
                  <div className="space-y-1">
                    {patient.checkinAnswers?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-slate-600 line-clamp-1">{item.question}</span>
                        <span className={`font-bold px-1.5 py-0.2 rounded-xs ${
                          item.answer === 'Worse' || item.answer === 'No'
                            ? 'bg-rose-100 text-rose-800'
                            : item.answer === 'Same'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.answer}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Triage & Recommendation */}
                <div className={`p-3 rounded-xl border space-y-1.5 ${
                  isRed ? 'bg-rose-50/70 border-rose-200' : isAmber ? 'bg-amber-50/70 border-amber-200' : 'bg-emerald-50/70 border-emerald-200'
                }`}>
                  <div className="font-bold uppercase tracking-wider text-[10px] text-slate-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-teal-600" /> AI Clinical Assessment
                  </div>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {patient.summary}
                  </p>
                  <p className="font-bold text-slate-900 pt-1 border-t border-slate-200/40">
                    Recommended Action: <span className="underline">{patient.action}</span>
                  </p>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
