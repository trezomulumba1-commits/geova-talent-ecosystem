import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GeovaLogo } from '../components/GeovaLogo';
import {
  GraduationCap,
  Building2,
  School,
  Mail,
  Lock,
  User,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { login, register, PortalRole } from '../services/authService';

type AuthMode = 'login' | 'register';

interface PortalConfig {
  role: PortalRole;
  label: string;
  tagline: string;
  icon: React.ReactNode;
  color: string;
  bgGlow: string;
  borderActive: string;
  btnBg: string;
  placeholderEmail: string;
  placeholderInstitution: string;
  demoEmail: string;
  demoPassword: string;
}

const PORTALS: PortalConfig[] = [
  {
    role: 'student',
    label: 'Student',
    tagline: 'Prep, build projects & get verified',
    icon: <GraduationCap className="w-6 h-6" />,
    color: 'text-indigo-500 dark:text-indigo-400',
    bgGlow: 'from-indigo-600/20 via-sky-500/10 to-transparent',
    borderActive: 'border-indigo-500 ring-2 ring-indigo-500/20',
    btnBg: 'bg-indigo-600 hover:bg-indigo-700',
    placeholderEmail: 'you@university.edu',
    placeholderInstitution: 'e.g. Stanford / Self-Taught',
    demoEmail: 'student@geova.ai',
    demoPassword: 'student123',
  },
  {
    role: 'company',
    label: 'Company',
    tagline: 'Recruit verified engineering talent',
    icon: <Building2 className="w-6 h-6" />,
    color: 'text-emerald-500 dark:text-emerald-400',
    bgGlow: 'from-emerald-600/20 via-teal-500/10 to-transparent',
    borderActive: 'border-emerald-500 ring-2 ring-emerald-500/20',
    btnBg: 'bg-emerald-600 hover:bg-emerald-700',
    placeholderEmail: 'recruiter@company.com',
    placeholderInstitution: 'e.g. Nebula AI / Stripe',
    demoEmail: 'recruiter@geova.ai',
    demoPassword: 'company123',
  },
  {
    role: 'school',
    label: 'School',
    tagline: 'Monitor cohorts & verify projects',
    icon: <School className="w-6 h-6" />,
    color: 'text-purple-500 dark:text-purple-400',
    bgGlow: 'from-purple-600/20 via-violet-500/10 to-transparent',
    borderActive: 'border-purple-500 ring-2 ring-purple-500/20',
    btnBg: 'bg-purple-600 hover:bg-purple-700',
    placeholderEmail: 'faculty@university.edu',
    placeholderInstitution: 'e.g. MIT / Covenant University',
    demoEmail: 'faculty@geova.ai',
    demoPassword: 'school123',
  },
];

interface LoginPageProps {
  onAuthSuccess: (role: PortalRole, name: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onAuthSuccess }) => {
  const [activePortal, setActivePortal] = useState<PortalRole>('student');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const portal = PORTALS.find(p => p.role === activePortal)!;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setInstitution('');
    setError(null);
    setSuccess(null);
  };

  const handlePortalSwitch = (role: PortalRole) => {
    setActivePortal(role);
    resetForm();
  };

  const fillDemo = () => {
    setEmail(portal.demoEmail);
    setPassword(portal.demoPassword);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let resp;
      if (authMode === 'login') {
        resp = await login(email, password, activePortal);
      } else {
        if (!name.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }
        resp = await register(email, password, name, activePortal, institution);
      }
      setSuccess(`Welcome, ${resp.user.name}! Entering your portal...`);
      setTimeout(() => onAuthSuccess(activePortal, resp.user.name), 800);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center relative overflow-hidden p-4">

      {/* Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b ${portal.bgGlow} blur-3xl opacity-60`}
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Logo + Brand */}
        <div className="flex flex-col items-center mb-8 space-y-3">
          <GeovaLogo size="lg" className="filter drop-shadow-[0_8px_20px_rgba(99,102,241,0.35)]" />
          <div className="text-center">
            <h1 className="text-2xl font-black text-white tracking-tight">GEOVA Platform</h1>
            <p className="text-xs text-zinc-400 font-semibold tracking-widest uppercase mt-0.5">
              Talent & Technical Ecosystem
            </p>
          </div>
        </div>

        {/* Portal Selector Tabs */}
        <div className="flex gap-2 mb-6">
          {PORTALS.map(p => (
            <button
              key={p.role}
              onClick={() => handlePortalSwitch(p.role)}
              className={`flex-1 py-2.5 px-3 rounded-xl border text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                activePortal === p.role
                  ? `bg-zinc-900 ${p.borderActive} text-white`
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600'
              }`}
            >
              <span className={activePortal === p.role ? p.color : ''}>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Card */}
        <motion.div
          key={activePortal}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-zinc-900 rounded-xl p-1 mb-6 border border-zinc-800">
            {(['login', 'register'] as AuthMode[]).map(m => (
              <button
                key={m}
                onClick={() => { setAuthMode(m); resetForm(); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  authMode === m
                    ? 'bg-zinc-700 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Tagline */}
          <div className="mb-5">
            <h2 className="text-base font-bold text-white">
              {authMode === 'login' ? `Welcome back` : `Join as a ${portal.label}`}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">{portal.tagline}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name (register only) */}
            <AnimatePresence>
              {authMode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-3"
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={institution}
                      onChange={e => setInstitution(e.target.value)}
                      placeholder={portal.placeholderInstitution}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={portal.placeholderEmail}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2 text-xs text-red-400 bg-red-950/40 border border-red-900/50 rounded-xl px-3 py-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 rounded-xl px-3 py-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !!success}
              className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${portal.btnBg} disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>
                  {authMode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Fill Button */}
          {authMode === 'login' && (
            <button
              onClick={fillDemo}
              className="w-full mt-3 py-2 rounded-xl border border-zinc-800 text-zinc-500 text-xs font-semibold hover:text-zinc-300 hover:border-zinc-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Fill Demo Credentials ({portal.label} Portal)
            </button>
          )}
        </motion.div>

        {/* Demo hint */}
        <p className="text-center text-[11px] text-zinc-600 mt-4">
          Demo · {portal.demoEmail} · {portal.demoPassword}
        </p>
      </div>
    </div>
  );
};
