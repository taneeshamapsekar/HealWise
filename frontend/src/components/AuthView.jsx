import React, { useState } from 'react';
import { Activity, Lock, Mail, User, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { signUpUser, signInUser, isSupabaseConfigured } from '../lib/supabase';

export default function AuthView({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState('patient'); // 'patient' | 'doctor'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const supabaseConnected = isSupabaseConfigured();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        const user = await signUpUser({
          email,
          password,
          name: name.trim() || email.split('@')[0],
          role
        });
        onAuthSuccess(user);
      } else {
        const user = await signInUser({ email, password });
        onAuthSuccess(user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Logins for instant evaluation
  const handleQuickDemo = (demoType) => {
    if (demoType === 'patient') {
      const demoPatient = {
        id: 'demo-panduji',
        email: 'panduji@healwise.care',
        user_metadata: {
          name: 'Panduji',
          role: 'patient',
          gender: 'Male',
          age: 58,
          condition: 'Type-2 Diabetes & Hypertension'
        }
      };
      localStorage.setItem('healwise_current_user', JSON.stringify(demoPatient));
      onAuthSuccess(demoPatient);
    } else {
      const demoDoctor = {
        id: 'demo-doctor',
        email: 'dr.ananya@healwise.care',
        user_metadata: {
          name: 'Dr. Ananya Sharma',
          role: 'doctor',
          gender: 'Female',
          age: 41,
          qualification: 'MBBS, MD (Medicine)',
          specialty: 'Internal Medicine'
        }
      };
      localStorage.setItem('healwise_current_user', JSON.stringify(demoDoctor));
      onAuthSuccess(demoDoctor);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">HealWise</h1>
          <p className="text-xs text-slate-400">
            Care doesn't end when the patient leaves the clinic
          </p>
        </div>

        {/* Supabase Status pill */}
        <div className="flex items-center justify-center">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
            supabaseConnected
              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80'
              : 'bg-amber-950/60 text-amber-400 border-amber-800/80'
          }`}>
            {supabaseConnected ? '● Supabase Live Auth' : '● Supabase Standby (Auto-Demo Mode)'}
          </span>
        </div>

        {/* Auth Toggle Tabs */}
        <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              !isSignUp ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              isSignUp ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isSignUp && (
            <>
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Panduji"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-600 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Role Picker */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">I am a</label>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`py-2 rounded-xl border transition-all ${
                      role === 'patient'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('doctor')}
                    className={`py-2 rounded-xl border transition-all ${
                      role === 'doctor'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Doctor
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-600 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-600 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isSignUp ? 'Create My Account' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Login Separator */}
        <div className="relative flex py-1 items-center">
          <div className="grow border-t border-slate-800"></div>
          <span className="shrink mx-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Or Instant 1-Click Demo
          </span>
          <div className="grow border-t border-slate-800"></div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('patient')}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>Panduji (Patient)</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('doctor')}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Dr. Ananya (Doctor)</span>
          </button>
        </div>

      </div>

    </div>
  );
}
