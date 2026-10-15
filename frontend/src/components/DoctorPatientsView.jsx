import React, { useState } from 'react';
import { Users, Search, Phone, Calendar, Heart, FileText, Plus, CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react';
import { INITIAL_DOCTOR_PATIENTS } from '../lib/demoData';

export default function DoctorPatientsView() {
  const [patients, setPatients] = useState([
    ...INITIAL_DOCTOR_PATIENTS,
    {
      id: "p4",
      name: "Panduji",
      age: 58,
      gender: "Male",
      phone: "+91 98221 55678",
      diagnosis: "Type-2 Diabetes & Hypertension",
      lastVisit: "Today",
      status: "green",
      statusText: "Active daily regimen (Dolo, Metformin)",
      summary: "Patient adhering to morning and evening doses. Glucose within normal fasting range.",
      action: "Continue maintenance dose."
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const filtered = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPatient = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newP = {
      id: `p-${Date.now()}`,
      name: newName.trim(),
      age: 45,
      gender: 'Male',
      phone: newPhone.trim() || '+91 98000 00000',
      diagnosis: newDiagnosis.trim() || 'General Health Consultation',
      lastVisit: 'Today',
      status: 'green',
      statusText: 'New consultation registered',
      summary: 'Initial intake completed. Prescribed follow-up scheduled.',
      action: 'Schedule Day 3 follow-up review.'
    };
    setPatients([newP, ...patients]);
    setNewName('');
    setNewDiagnosis('');
    setNewPhone('');
    setShowAddModal(false);
    setToastMessage('New patient registered successfully!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Clinic Patient Registry
          </h1>
          <p className="text-xs text-slate-400">
            View active patient records, follow-up timelines, and clinical diagnosis logs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by patient name or diagnosis..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
        />
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((patient) => {
          const isRed = patient.status === 'red';
          const isAmber = patient.status === 'amber';

          return (
            <div
              key={patient.id}
              className={`p-5 rounded-3xl bg-slate-900 border shadow-xl flex flex-col justify-between space-y-4 transition-all ${
                isRed
                  ? 'border-rose-800/80 ring-1 ring-rose-500/40'
                  : isAmber
                  ? 'border-amber-800/80 ring-1 ring-amber-500/40'
                  : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 text-slate-950 font-black text-base flex items-center justify-center shrink-0">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{patient.name}</h3>
                      <p className="text-[11px] text-slate-400">{patient.gender}, {patient.age} yrs</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isRed
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : isAmber
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {patient.status} flag
                  </span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Diagnosis</span>
                    <strong className="text-slate-200">{patient.diagnosis}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Last Visit</span>
                    <span className="text-slate-300">{patient.lastVisit}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {patient.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={`tel:${patient.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call {patient.phone}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" /> Register Patient to Clinic
            </h2>
            <form onSubmit={handleAddPatient} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Meera Bai"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 outline-hidden"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Diagnosis</label>
                <input
                  type="text"
                  required
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Bronchitis"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 outline-hidden"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 outline-hidden"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold"
                >
                  Save Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
