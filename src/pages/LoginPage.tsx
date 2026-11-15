import React, { useState } from 'react';
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
  Database,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Check
} from 'lucide-react';
import { login, register, PortalRole } from '../services/authService';

type AuthMode = 'login' | 'register';

interface PortalConfig {
  role: PortalRole;
  label: string;
  tagline: string;
  badge: string;
  icon: React.ReactNode;
  color: string;
  accentBg: string;
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
    label: 'Candidate',
    tagline: 'Prep, build distributed systems & get verified by top tech employers',
    badge: 'Student Portal',
    icon: <GraduationCap className="w-4 h-4" />,
    color: 'text-indigo-400',
    accentBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    borderActive: 'border-indigo-500 bg-indigo-500/15 text-white shadow-sm ring-1 ring-indigo-500/30',
    btnBg: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25',
    placeholderEmail: 'student@university.edu',
    placeholderInstitution: 'e.g. Stanford University / Self-Taught',
    demoEmail: 'student@geova.ai',
    demoPassword: 'student123',
  },
  {
    role: 'employer',
    label: 'Corporate',
    tagline: 'Discover machine-verified engineering talent and review live project architectures',
    badge: 'Partner Portal',
    icon: <Building2 className="w-4 h-4" />,
    color: 'text-emerald-400',
    accentBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    borderActive: 'border-emerald-500 bg-emerald-500/15 text-white shadow-sm ring-1 ring-emerald-500/30',
    btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25',
    placeholderEmail: 'recruiter@company.com',
    placeholderInstitution: 'e.g. Nebula AI / Stripe',
    demoEmail: 'recruiter@geova.ai',
    demoPassword: 'company123',
  },
  {
    role: 'provider',
    label: 'Educator',
    tagline: 'Monitor university cohort readiness, grade practice interviews & endorse projects',
    badge: 'Faculty Portal',
    icon: <School className="w-4 h-4" />,
    color: 'text-purple-400',
    accentBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    borderActive: 'border-purple-500 bg-purple-500/15 text-white shadow-sm ring-1 ring-purple-500/30',
    btnBg: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/25',
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
      setSuccess(`Authenticated as ${resp.user.name}. Entering portal...`);
      setTimeout(() => onAuthSuccess(activePortal, resp.user.name), 600);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-zinc-100 flex flex-col justify-center items-center relative overflow-y-auto p-4 sm:p-6 lg:p-8">
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[128px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-sky-500/5 rounded-full blur-[140px]" />
      </div>

      {/* Main Split Layout Container */}
      <div className="relative z-10 w-full max-w-5xl bg-zinc-950/80 border border-zinc-800/80 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-auto">
        
        {/* Left Column: Platform Branding & Value Props (Visible on desktop & tablet) */}
        <div className="hidden lg:flex lg:col-span-5 p-8 xl:p-10 flex-col justify-between border-r border-zinc-800/80 bg-gradient-to-br from-zinc-900/40 via-zinc-950/60 to-black relative">
          {/* Subtle Grid Accent */}
          <div className="space-y-6">
            {/* Header Brand */}
            <div className="flex items-center gap-3">
              <GeovaLogo size="sm" className="filter drop-shadow-[0_4px_12px_rgba(99,102,241,0.4)]" />
              <div>
                <span className="font-display font-black text-lg tracking-tight text-white flex items-center gap-1.5">
                  GEOVA <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">v2.0</span>
                </span>
                <p className="text-[11px] text-zinc-400 font-medium tracking-wide">
                  Talent & Technical Ecosystem
                </p>
              </div>
            </div>

            {/* Hero Value Statement */}
            <div className="space-y-2 pt-2">
              <h2 className="font-display font-bold text-2xl xl:text-3xl text-zinc-100 leading-tight">
                Engineering proof over paper resumes.
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Connect directly with engineering partners through machine-verified system architectures, agile sprint squads, and real-time practice interviews.
              </p>
            </div>

            {/* Feature Highlights Bento Items */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/60">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Verified System Architectures</h4>
                  <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">
                    Demonstrate Raft consensus engines, microservices, and live telemetry.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/60">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Collaborative Sprint Squads</h4>
                  <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">
                    Agile task boards with real-time status progression from todo to complete.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/60">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Interactive Prep & Rubrics</h4>
                  <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">
                    Algorithmic practice arena, voice pacing metrics, and readiness scoring.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Live System Indicator */}
          <div className="pt-6 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-[11px]">Live SQLite Database</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">13 Tables Synced</span>
          </div>
        </div>

        {/* Right Column: Authentication Interface */}
        <div className="lg:col-span-7 p-6 sm:p-8 xl:p-10 flex flex-col justify-center">
          
          {/* Mobile-Only Header Branding */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <GeovaLogo size="sm" />
            <div>
              <h1 className="font-display font-bold text-lg text-white">GEOVA Platform</h1>
              <p className="text-[11px] text-zinc-400">Talent & Technical Ecosystem</p>
            </div>
          </div>

          {/* Top Row: Portal Role Segmented Switcher */}
          <div className="mb-5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Select Workspace Portal
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-900/90 rounded-2xl border border-zinc-800">
              {PORTALS.map(p => (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => handlePortalSwitch(p.role)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activePortal === p.role
                      ? p.borderActive
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  <span className={activePortal === p.role ? p.color : 'text-zinc-500'}>
                    {p.icon}
                  </span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Auth Card Content */}
          <div className="space-y-4">
            
            {/* Header: Mode Toggle + Active Role Tagline */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  {authMode === 'login' ? `Welcome to ${portal.badge}` : `Create ${portal.badge} Account`}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                  {portal.tagline}
                </p>
              </div>

              {/* Mode Switch Pills */}
              <div className="flex items-center gap-1 bg-zinc-900 rounded-xl p-1 border border-zinc-800 shrink-0 self-start sm:self-auto">
                {(['login', 'register'] as AuthMode[]).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setAuthMode(m); resetForm(); }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      authMode === m
                        ? 'bg-zinc-800 text-white shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {m === 'login' ? 'Sign In' : 'Register'}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name & Institution (Register only) */}
              <AnimatePresence>
                {authMode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden space-y-2.5"
                  >
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Full Legal Name"
                        className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        value={institution}
                        onChange={e => setInstitution(e.target.value)}
                        placeholder={portal.placeholderInstitution}
                        className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Address */}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={portal.placeholderEmail}
                  className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password (min. 6 characters)"
                  className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl py-2 pl-10 pr-10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2 text-xs text-red-400 bg-red-950/40 border border-red-900/50 rounded-xl px-3 py-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 rounded-xl px-3 py-2"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{success}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={loading || !!success}
                className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${portal.btnBg} disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{authMode === 'login' ? `Sign In to ${portal.label} Portal` : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Database Account Autofill */}
            {authMode === 'login' && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={fillDemo}
                  className="w-full py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 hover:border-zinc-600 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Database className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span>Autofill Seeded DB Account ({portal.label})</span>
                </button>
              </div>
            )}

            {/* Footer Trust & Security Note */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800/80">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>JWT & Bcrypt Encrypted</span>
              </span>
              <span>Strict Role-Isolated Portals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
