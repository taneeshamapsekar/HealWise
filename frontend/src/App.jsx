import React, { useState, useEffect } from 'react';
import AuthView from './components/AuthView';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import DoctorDirectoryView from './components/DoctorDirectoryView';
import QuizView from './components/QuizView';
import PrescriptionStudioView from './components/PrescriptionStudioView';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorPatientsView from './components/DoctorPatientsView';
import EditProfileModal from './components/EditProfileModal';
import { getActiveSessionUser, signOutUser } from './lib/supabase';
import { INITIAL_DOCTOR_PATIENTS } from './lib/demoData';

// Initial dynamic medications list matching wireframe
const INITIAL_MEDICATIONS = [
  {
    id: 'med-1',
    name: 'Take Dolo 650 morning',
    time: 'morning',
    status: 'taken',
    lastActionTime: '08:30 AM'
  },
  {
    id: 'med-2',
    name: 'Augmentin 625mg (Antibiotic)',
    time: 'morning',
    status: 'taken',
    lastActionTime: '08:45 AM'
  },
  {
    id: 'med-3',
    name: 'Pantoprazole 40mg (Before food)',
    time: 'morning',
    status: 'taken',
    lastActionTime: '07:30 AM'
  },
  {
    id: 'med-4',
    name: 'Paracetamol 650mg (Afternoon)',
    time: 'afternoon',
    status: 'pending'
  },
  {
    id: 'med-5',
    name: 'Augmentin 625mg (Night after dinner)',
    time: 'night',
    status: 'pending'
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState('patient'); // 'patient' | 'doctor'
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [medications, setMedications] = useState(INITIAL_MEDICATIONS);
  const [triagePatients, setTriagePatients] = useState(INITIAL_DOCTOR_PATIENTS);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Check auth session on mount
  useEffect(() => {
    getActiveSessionUser().then((user) => {
      setCurrentUser(user);
      if (user?.user_metadata?.role) {
        setCurrentRole(user.user_metadata.role);
        if (user.user_metadata.role === 'doctor') {
          setActiveTab('doctor-triage');
        }
      }
      setIsAuthChecking(false);
    });
  }, []);

  const handleLogout = async () => {
    await signOutUser();
    setCurrentUser(null);
    setCurrentRole('patient');
    setActiveTab('dashboard');
  };

  const handleToggleRole = (newRole) => {
    setCurrentRole(newRole);
    if (newRole === 'doctor') {
      setActiveTab('doctor-triage');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleImportToSchedule = (newItems) => {
    setMedications((prev) => [...newItems, ...prev]);
    setActiveTab('dashboard');
  };

  const handleCompleteCheckin = ({ answers, triage }) => {
    setTriagePatients(prev => [
      {
        id: `p-${Date.now()}`,
        name: currentUser?.user_metadata?.name || 'Panduji',
        age: currentUser?.user_metadata?.age || 58,
        gender: currentUser?.user_metadata?.gender || 'Male',
        phone: '+91 98231 44510',
        diagnosis: currentUser?.user_metadata?.condition || 'Type-2 Diabetes & Hypertension',
        lastVisit: 'Just now',
        status: triage.status,
        statusText: triage.summary,
        checkinAnswers: answers,
        summary: triage.summary,
        action: triage.action_recommended
      },
      ...prev.filter(p => p.id !== 'p4')
    ]);
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not logged in, show Auth View
  if (!currentUser) {
    return (
      <AuthView
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          const role = user?.user_metadata?.role || 'patient';
          setCurrentRole(role);
          setActiveTab(role === 'doctor' ? 'doctor-triage' : 'dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans">
      
      {/* Sidebar with Role Switcher & Dynamic Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        currentRole={currentRole}
        onToggleRole={handleToggleRole}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Patient Tabs */}
          {activeTab === 'dashboard' && (
            <DashboardView
              currentUser={currentUser}
              medications={medications}
              setMedications={setMedications}
              onOpenEditProfile={() => setIsEditProfileOpen(true)}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizView
              onBack={() => setActiveTab('dashboard')}
              onCompleteCheckin={handleCompleteCheckin}
            />
          )}

          {activeTab === 'prescriptions' && (
            <PrescriptionStudioView
              onImportToSchedule={handleImportToSchedule}
            />
          )}

          {activeTab === 'search-dr' && (
            <DoctorDirectoryView />
          )}

          {/* Doctor Tabs */}
          {activeTab === 'doctor-triage' && (
            <DoctorDashboard
              triagePatients={triagePatients}
              setTriagePatients={setTriagePatients}
            />
          )}

          {activeTab === 'doctor-patients' && (
            <DoctorPatientsView />
          )}

        </div>
      </main>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <EditProfileModal
          currentUser={currentUser}
          onClose={() => setIsEditProfileOpen(false)}
          onSaveProfile={(updatedUser) => {
            setCurrentUser(updatedUser);
            localStorage.setItem('healwise_current_user', JSON.stringify(updatedUser));
          }}
        />
      )}

    </div>
  );
}
