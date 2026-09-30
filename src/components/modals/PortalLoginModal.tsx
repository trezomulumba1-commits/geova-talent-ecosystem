import React, { useState } from 'react';
import { X, GraduationCap, Building2, School, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, KeyRound } from 'lucide-react';
import { UserRole } from '../../types';

interface PortalLoginModalProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onClose: () => void;
}

export const PortalLoginModal: React.FC<PortalLoginModalProps> = ({
  currentRole,
  onSelectRole,
  onClose,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [portalEmail, setPortalEmail] = useState(
    currentRole === 'student'
      ? 'student@stanford.edu'
      : currentRole === 'company'
      ? 'recruiter@nebula.ai'
      : 'faculty@mit.edu'
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handlePortalSwitch = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'student') setPortalEmail('student@stanford.edu');
    else if (role === 'company') setPortalEmail('recruiter@nebula.ai');
    else setPortalEmail('faculty@mit.edu');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      onSelectRole(selectedRole);
      localStorage.setItem('geova_user_role', selectedRole);
      setIsLoggingIn(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold border border-indigo-200 dark:border-indigo-800">
              <KeyRound className="w-3.5 h-3.5" /> GEOVA Triple Access Portal Gateway
            </div>
            <h2 className="font-display font-black text-2xl text-zinc-900 dark:text-white">
              Select Your Access Portal
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Log in through a specialized gateway to view custom dashboards, tools, and workflows.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Distinct Portal Choice Cards */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* PORTAL 1: STUDENT */}
            <div
              onClick={() => handlePortalSwitch('student')}
              className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                selectedRole === 'student'
                  ? 'bg-indigo-500/10 border-indigo-600 shadow-md ring-2 ring-indigo-500/30'
                  : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600'
              }`}
            >
              {selectedRole === 'student' && (
                <span className="absolute top-3 right-3 text-indigo-600 dark:text-indigo-400">
                  <CheckCircle2 className="w-5 h-5 fill-indigo-600 text-white dark:fill-indigo-400 dark:text-zinc-900" />
                </span>
              )}
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white">Student Portal</h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Build verified projects, solve system challenges in the Prep Arena, and earn candidate badges.
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Full Prep & Talent Suite
              </div>
            </div>

            {/* PORTAL 2: COMPANY / RECRUITER */}
            <div
              onClick={() => handlePortalSwitch('company')}
              className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                selectedRole === 'company'
                  ? 'bg-emerald-500/10 border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-emerald-400 dark:hover:border-emerald-600'
              }`}
            >
              {selectedRole === 'company' && (
                <span className="absolute top-3 right-3 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white dark:fill-emerald-400 dark:text-zinc-900" />
                </span>
              )}
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white">Company Portal</h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Discover verified candidates, post job/internship opportunities, and inspect AI executive summaries.
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Recruiter & Talent Scout
              </div>
            </div>

            {/* PORTAL 3: SCHOOL / FACULTY */}
            <div
              onClick={() => handlePortalSwitch('teacher')}
              className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                selectedRole === 'teacher'
                  ? 'bg-purple-500/10 border-purple-600 shadow-md ring-2 ring-purple-500/30'
                  : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-purple-400 dark:hover:border-purple-600'
              }`}
            >
              {selectedRole === 'teacher' && (
                <span className="absolute top-3 right-3 text-purple-600 dark:text-purple-400">
                  <CheckCircle2 className="w-5 h-5 fill-purple-600 text-white dark:fill-purple-400 dark:text-zinc-900" />
                </span>
              )}
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                  <School className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white">School / Faculty</h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Monitor cohort progress, verify student project submissions, grade squads, and track growth analytics.
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-[10px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Academic & Faculty Admin
              </div>
            </div>

          </div>

          {/* Portal Authentication Input Fields */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/80 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                Selected Gateway Email ({selectedRole === 'student' ? 'Student' : selectedRole === 'company' ? 'Enterprise' : 'Academic'})
              </span>
              <span className="text-[11px] text-indigo-500 font-mono">2FA SSO Enabled</span>
            </div>
            <input
              type="email"
              required
              value={portalEmail}
              onChange={(e) => setPortalEmail(e.target.value)}
              className="w-full text-xs bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoggingIn}
              className={`px-7 py-3 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                selectedRole === 'student'
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : selectedRole === 'company'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isLoggingIn ? (
                <>Authenticating Gateway...</>
              ) : (
                <>
                  Enter {selectedRole === 'student' ? 'Student' : selectedRole === 'company' ? 'Company' : 'School'} Portal <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
