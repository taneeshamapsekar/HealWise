import React, { useState } from 'react';
import { 
  User, 
  Calendar as CalendarIcon, 
  Check, 
  X, 
  Plus, 
  Clock, 
  Edit3, 
  Pill, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function DashboardView({
  currentUser,
  medications,
  setMedications,
  onOpenEditProfile
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [newMedName, setNewMedName] = useState('');
  const [newMedTime, setNewMedTime] = useState('morning');
  const [showAddMed, setShowAddMed] = useState(false);

  const userName = currentUser?.user_metadata?.name || 'Panduji';
  const userGender = currentUser?.user_metadata?.gender || 'Male';
  const userAge = currentUser?.user_metadata?.age || 58;
  const userCondition = currentUser?.user_metadata?.condition || 'Type-2 Diabetes & Hypertension';
  const initial = userName.charAt(0).toUpperCase();

  // Toggle Medicine status (taken: true, false, or pending)
  const handleToggleTaken = (id, isTaken) => {
    setMedications(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: isTaken ? 'taken' : 'missed',
          lastActionTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return m;
    }));
  };

  // Add new medicine dynamically
  const handleAddMedication = (e) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    const newEntry = {
      id: `med-${Date.now()}`,
      name: newMedName.trim(),
      time: newMedTime,
      status: 'pending',
      scheduledDays: [1, 2, 3, 4, 5, 6, 7]
    };
    setMedications(prev => [newEntry, ...prev]);
    setNewMedName('');
    setShowAddMed(false);
  };

  // Days in month calculation for the calendar grid
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/80">
            Personal Care Portal
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Welcome back, {userName}!
          </h1>
          <p className="text-xs text-slate-400">
            Monitor your daily medicine schedule, log check-in answers, and track your calendar.
          </p>
        </div>
      </div>

      {/* Grid Layout strictly matching wireframe Middle Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Profile Card (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl">
          
          <div className="space-y-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Circular Avatar matching wireframe circle */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-500 to-emerald-600 text-slate-950 font-black text-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                {initial}
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">{userName}</h2>
                <p className="text-xs text-emerald-400 font-semibold">{currentUser?.email || 'patient@healwise.care'}</p>
                <div className="text-xs text-slate-400">
                  {userGender} • {userAge} yrs
                </div>
              </div>
            </div>

            {/* Profile Details List */}
            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Condition</span>
                <span className="font-semibold text-slate-200">{userCondition}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Adherence Rate</span>
                <span className="font-bold text-emerald-400">92% On Track</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Next Doctor Review</span>
                <span className="font-semibold text-teal-400">In 3 Days</span>
              </div>
            </div>
          </div>

          {/* Edit Profile Button matching wireframe */}
          <button
            onClick={onOpenEditProfile}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700 shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Edit Profile</span>
          </button>

        </div>

        {/* Right Column: Meds List (Top) & Calendar (Bottom) (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top Right: Medication Tasks matching "take dolo 365 morning (v) (x)" in wireframe */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Today's Medication Tasks</h3>
              </div>
              <button
                onClick={() => setShowAddMed(!showAddMed)}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" /> Add Medicine
              </button>
            </div>

            {/* Add Med Inline Form */}
            {showAddMed && (
              <form onSubmit={handleAddMedication} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="e.g. Take Dolo 650 morning"
                    className="flex-1 text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                  <select
                    value={newMedTime}
                    onChange={(e) => setNewMedTime(e.target.value)}
                    className="text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 text-white"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="night">Night</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            {/* Medications List */}
            <div className="space-y-2.5">
              {medications.map((med) => {
                const isTaken = med.status === 'taken';
                const isMissed = med.status === 'missed';

                return (
                  <div
                    key={med.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isTaken
                        ? 'bg-emerald-950/20 border-emerald-800/60 text-slate-300'
                        : isMissed
                        ? 'bg-rose-950/20 border-rose-800/60 text-slate-300'
                        : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isTaken
                          ? 'bg-emerald-500 text-slate-950'
                          : isMissed
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Pill className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isTaken ? 'line-through text-slate-400' : 'text-white'}`}>
                          {med.name}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span className="capitalize">{med.time}</span>
                          {med.lastActionTime && <span>• Logged at {med.lastActionTime}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Tick (v) and Cross (x) buttons strictly matching wireframe */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleTaken(med.id, true)}
                        title="Mark Taken"
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isTaken
                            ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400/50'
                            : 'bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>

                      <button
                        onClick={() => handleToggleTaken(med.id, false)}
                        title="Mark Missed / Not taken"
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isMissed
                            ? 'bg-rose-500 text-white ring-2 ring-rose-400/50'
                            : 'bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400'
                        }`}
                      >
                        <X className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Bottom Right: Calendar Card matching "Kalender" grid in wireframe */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">
                  Kalender ({monthNames[month]} {year})
                </h3>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <button
                  onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                  className="p-1 hover:text-white rounded-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-slate-300">{monthNames[month]}</span>
                <button
                  onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                  className="p-1 hover:text-white rounded-md"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid matching wireframe grid */}
            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {/* Empty padding days */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-10 rounded-xl bg-slate-950/40" />
                ))}

                {/* Days of month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const isSelected = selectedDay === dayNum;
                  const isToday = new Date().getDate() === dayNum && new Date().getMonth() === month;
                  const hasDose = dayNum % 2 === 1; // demo active medication schedule

                  return (
                    <button
                      key={`day-${dayNum}`}
                      onClick={() => setSelectedDay(dayNum)}
                      className={`h-11 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all relative border ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-extrabold'
                          : isToday
                          ? 'bg-slate-800 border-teal-500/80 text-teal-300'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{dayNum}</span>
                      {hasDose && (
                        <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                          isSelected ? 'bg-slate-950' : 'bg-emerald-400'
                        }`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Scheduled doses
              </span>
              <span>Selected Day: Day {selectedDay} of {monthNames[month]}</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
