import React from 'react';
import { 
  Activity, 
  LayoutDashboard, 
  Search, 
  HelpCircle, 
  FileText, 
  LogOut, 
  ShieldCheck, 
  User,
  Users,
  AlertTriangle,
  RefreshCw,
  Stethoscope
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  currentRole,
  onToggleRole
}) {
  const isDoctor = currentRole === 'doctor';
  const userName = currentUser?.user_metadata?.name || (isDoctor ? 'Dr. Ananya Sharma' : 'Panduji');
  const initial = userName.charAt(0).toUpperCase();

  const patientNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Profile, Meds & Calendar'
    },
    {
      id: 'search-dr',
      label: 'Search for dr',
      icon: Search,
      description: 'Find verified specialists'
    },
    {
      id: 'quiz',
      label: 'Quiz',
      icon: HelpCircle,
      description: 'Doctor check-in questions'
    },
    {
      id: 'prescriptions',
      label: 'AI Prescriptions',
      icon: FileText,
      description: 'Smart simplification & notes'
    }
  ];

  const doctorNavItems = [
    {
      id: 'doctor-triage',
      label: 'Triage Dashboard',
      icon: AlertTriangle,
      description: 'Patient recovery priority queue'
    },
    {
      id: 'prescriptions',
      label: 'Prescription Studio',
      icon: FileText,
      description: 'AI note analysis & plan builder'
    },
    {
      id: 'doctor-patients',
      label: 'My Patients',
      icon: Users,
      description: 'Clinic registry & follow-up log'
    },
    {
      id: 'search-dr',
      label: 'Doctor Directory',
      icon: Search,
      description: 'Specialist referral network'
    }
  ];

  const activeNavItems = isDoctor ? doctorNavItems : patientNavItems;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      
      {/* Top Header */}
      <div className="p-5 space-y-5">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight">HealWise</h1>
            <p className="text-[10px] text-slate-400 font-medium">Care beyond the clinic</p>
          </div>
        </div>

        {/* 1-Click Role Switcher Toggle */}
        <div className="p-1 bg-slate-950 rounded-xl border border-slate-800 flex text-xs font-bold">
          <button
            onClick={() => onToggleRole('patient')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              !isDoctor
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Patient</span>
          </button>

          <button
            onClick={() => onToggleRole('doctor')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              isDoctor
                ? 'bg-teal-400 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {activeNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <div className="flex-1">
                  <div className="leading-tight">{item.label}</div>
                </div>
              </button>
            );
          })}
        </nav>

      </div>

      {/* Bottom Profile Pill */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-9 h-9 rounded-full font-black text-sm flex items-center justify-center shrink-0 ${
              isDoctor
                ? 'bg-gradient-to-br from-teal-400 to-cyan-600 text-slate-950'
                : 'bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950'
            }`}>
              {initial}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{userName}</div>
              <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                {currentRole}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700/60 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
}
