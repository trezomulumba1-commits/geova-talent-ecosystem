import React, { useState, useEffect } from 'react';
import { AppMode, EcosystemView, PrepView, Student, UserRole } from '../types';
import { GeovaLogo } from './GeovaLogo';
import { VectorDrawIcon } from './common/VectorDrawIcon';
import { useTheme } from '../context/ThemeContext';
import { 
  Menu, 
  X,
  Sun,
  Moon,
  User,
  GraduationCap,
  Building2,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  mode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  ecosystemView: EcosystemView;
  onSelectEcosystemView: (view: EcosystemView) => void;
  prepView: PrepView;
  onSelectPrepView: (view: PrepView) => void;
  currentUser: Student;
  onOpenSettings: () => void;
  onOpenEditProfile?: () => void;
  userRole: UserRole;
  onSelectUserRole: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onSelectMode,
  ecosystemView,
  onSelectEcosystemView,
  prepView,
  onSelectPrepView,
  currentUser,
  onOpenSettings,
  onOpenEditProfile,
  userRole,
  onSelectUserRole
}) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navAnimKey, setNavAnimKey] = useState(0);

  const handleNavClick = (action: () => void) => {
    setNavAnimKey(prev => prev + 1);
    action();
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 15);

      const winHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (winHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentScrollY / winHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 w-full z-50 transition-all duration-200 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-md shadow-sm border-b border-zinc-200 dark:border-zinc-800' 
        : 'bg-white dark:bg-[#18181b] border-b border-zinc-200 dark:border-zinc-800'
    }`}>
      {/* Scroll Progress Indicator Line */}
      <div className="w-full h-[2px] bg-transparent absolute top-0 left-0 overflow-hidden pointer-events-none">
        <div 
          className="h-full bg-black dark:bg-white transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Banner Mode Bar */}
      <div className="bg-zinc-100 dark:bg-[#121212] text-zinc-900 dark:text-zinc-100 px-4 py-1.5 text-xs font-medium flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-zinc-300 dark:border-zinc-700">
              <VectorDrawIcon name="target" size="xs" badge={false} className="w-3.5 h-3.5" />
              Talent & Technical Prep Hub
            </span>
            <span className="hidden sm:inline text-zinc-600 dark:text-zinc-400 text-[11px]">Talent Discovery & Technical Simulation</span>
          </div>
          
          <div className="flex items-center bg-zinc-200 dark:bg-zinc-800 p-0.5 rounded-full border border-zinc-300 dark:border-zinc-700">
            <button
              onClick={() => onSelectMode('ecosystem')}
              className={`px-3 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mode === 'ecosystem'
                  ? 'bg-white text-black dark:bg-white dark:text-black shadow-sm font-bold border border-zinc-300 dark:border-transparent'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
              }`}
            >
              Ecosystem
            </button>
            <button
              onClick={() => onSelectMode('prep')}
              className={`px-3 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mode === 'prep'
                  ? 'bg-white text-black dark:bg-white dark:text-black shadow-sm font-bold border border-zinc-300 dark:border-transparent'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
              }`}
            >
              Prep Arena
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side Logo */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {mode === 'prep' ? (
            <button 
              onClick={() => onSelectPrepView('hub')} 
              className="flex items-center group cursor-pointer"
              title="Interview Readiness Hub"
            >
              <GeovaLogo size="md" isScrolled={isScrolled} className="group-hover:scale-105" />
            </button>
          ) : (
            <button 
              onClick={() => onSelectEcosystemView('landing')}
              className="flex items-center group cursor-pointer"
              title="GEOVA Ecosystem"
            >
              <GeovaLogo size="md" isScrolled={isScrolled} className="group-hover:scale-105" />
            </button>
          )}
        </div>

        {/* Global Desktop Perspective Switcher (Warm Accent Segmented Toggle) */}
        <div className="hidden lg:flex items-center bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shrink-0">
          <button
            onClick={() => onSelectUserRole('student')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              userRole === 'student'
                ? 'bg-white text-indigo-700 dark:bg-zinc-800 dark:text-indigo-400 shadow-xs border border-zinc-200 dark:border-zinc-700'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
            title="Switch to Student Candidate View"
          >
            <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Candidate Portal</span>
          </button>
          <button
            onClick={() => onSelectUserRole('teacher')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              userRole === 'teacher'
                ? 'bg-white text-emerald-700 dark:bg-zinc-800 dark:text-emerald-400 shadow-xs border border-zinc-200 dark:border-zinc-700'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
            title="Switch to Teacher Educator View"
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Educator Portal</span>
          </button>
          <button
            onClick={() => onSelectUserRole('company')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              userRole === 'company'
                ? 'bg-white text-purple-700 dark:bg-zinc-800 dark:text-purple-400 shadow-xs border border-zinc-200 dark:border-zinc-700'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
            title="Switch to Corporate Partner View"
          >
            <Building2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Partner Portal</span>
          </button>
        </div>

        {/* Desktop Nav Links (High Contrast Monochrome + Visible Icons) */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {mode === 'prep' ? (
            <>
              {/* Hub */}
              <button
                onClick={() => handleNavClick(() => onSelectPrepView('hub'))}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  prepView === 'hub'
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                    : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <VectorDrawIcon 
                  name="hub" 
                  size="xs" 
                  active={prepView === 'hub'}
                  triggerKey={`desktop-hub-${prepView}-${navAnimKey}`}
                />
                <span>Hub</span>
              </button>

              {/* Arena */}
              <button
                onClick={() => handleNavClick(() => onSelectPrepView('arena'))}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  prepView === 'arena'
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                    : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <VectorDrawIcon 
                  name="arena" 
                  size="xs" 
                  active={prepView === 'arena'}
                  triggerKey={`desktop-arena-${prepView}-${navAnimKey}`}
                />
                <span>Arena</span>
              </button>

              {/* Library */}
              <button
                onClick={() => handleNavClick(() => onSelectPrepView('library'))}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  prepView === 'library'
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                    : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <VectorDrawIcon 
                  name="library" 
                  size="xs" 
                  active={prepView === 'library'}
                  triggerKey={`desktop-library-${prepView}-${navAnimKey}`}
                />
                <span>Library</span>
              </button>

              {/* Architecture Lab */}
              <button
                onClick={() => handleNavClick(() => onSelectPrepView('system-architect'))}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  prepView === 'system-architect'
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                    : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <VectorDrawIcon 
                  name="architecture" 
                  size="xs" 
                  active={prepView === 'system-architect'}
                  triggerKey={`desktop-arch-${prepView}-${navAnimKey}`}
                />
                <span>Architecture Lab</span>
              </button>

              {/* Review */}
              <button
                onClick={() => handleNavClick(() => onSelectPrepView('review'))}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  prepView === 'review'
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                    : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <VectorDrawIcon 
                  name="review" 
                  size="xs" 
                  active={prepView === 'review'}
                  triggerKey={`desktop-review-${prepView}-${navAnimKey}`}
                />
                <span>Review</span>
              </button>
            </>
          ) : (
            <>
              {/* STUDENT SIDE MENU */}
              {userRole === 'student' && (
                <>
                  {/* Dashboard */}
                  <button
                    onClick={() => handleNavClick(() => onSelectEcosystemView('home'))}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                      ecosystemView === 'home'
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <VectorDrawIcon 
                      name="dashboard" 
                      size="xs" 
                      active={ecosystemView === 'home'}
                      triggerKey={`desktop-dash-${ecosystemView}-${navAnimKey}`}
                    />
                    <span>Dashboard</span>
                  </button>

                  {/* Discover */}
                  <button
                    onClick={() => handleNavClick(() => onSelectEcosystemView('discover-projects'))}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                      ecosystemView.startsWith('discover')
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <VectorDrawIcon 
                      name="discover" 
                      size="xs" 
                      active={ecosystemView.startsWith('discover')}
                      triggerKey={`desktop-disc-${ecosystemView}-${navAnimKey}`}
                    />
                    <span>Discover</span>
                  </button>

                  {/* Squads */}
                  <button
                    onClick={() => handleNavClick(() => onSelectEcosystemView('squads-progress'))}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                      ecosystemView === 'squads-progress'
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <VectorDrawIcon 
                      name="target" 
                      size="xs" 
                      active={ecosystemView === 'squads-progress'}
                      triggerKey={`desktop-squads-${ecosystemView}-${navAnimKey}`}
                    />
                    <span>My Squad</span>
                  </button>

                  {/* Collab */}
                  <button
                    onClick={() => handleNavClick(() => onSelectEcosystemView('collab'))}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                      ecosystemView === 'collab'
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <VectorDrawIcon 
                      name="collab" 
                      size="xs" 
                      active={ecosystemView === 'collab'}
                      triggerKey={`desktop-collab-${ecosystemView}-${navAnimKey}`}
                    />
                    <span>Collab</span>
                  </button>

                  {/* Forum */}
                  <button
                    onClick={() => handleNavClick(() => onSelectEcosystemView('community-forum'))}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                      ecosystemView === 'community-forum'
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <VectorDrawIcon 
                      name="chat" 
                      size="xs" 
                      active={ecosystemView === 'community-forum'}
                      triggerKey={`desktop-forum-${ecosystemView}-${navAnimKey}`}
                    />
                    <span>Forum</span>
                  </button>

                  {/* Profile */}
                  <button
                    onClick={() => handleNavClick(() => onSelectEcosystemView('student-profile'))}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                      ecosystemView === 'student-profile'
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <VectorDrawIcon 
                      name="profile" 
                      size="xs" 
                      active={ecosystemView === 'student-profile'}
                      triggerKey={`desktop-profile-${ecosystemView}-${navAnimKey}`}
                    />
                    <span>Profile</span>
                  </button>
                </>
              )}

              {/* TEACHER SIDE MENU */}
              {userRole === 'teacher' && (
                <>
                  {/* Teacher Portal */}
                  <button
                    onClick={() => handleNavClick(() => onSelectEcosystemView('teacher-company-portal'))}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                      ecosystemView === 'teacher-company-portal'
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <VectorDrawIcon 
                      name="briefcase" 
                      size="xs" 
                      active={ecosystemView === 'teacher-company-portal'}
                      triggerKey={`desktop-portal-${ecosystemView}-${navAnimKey}`}
                    />
                    <span>Teacher Portal</span>
                  </button>

                  {/* Submitted Projects */}
                  <button
                    onClick={() => handleNavClick(() => onSelectEcosystemView('discover-projects'))}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                      ecosystemView === 'discover-projects'
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <VectorDrawIcon 
                      name="discover" 
                      size="xs" 
                      active={ecosystemView === 'discover-projects'}
                      triggerKey={`desktop-disc-${ecosystemView}-${navAnimKey}`}
                    />
                    <span>Submitted Projects</span>
                  </button>

                  {/* Forum */}
                  <button
                    onClick={() => handleNavClick(() => onSelectEcosystemView('community-forum'))}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                      ecosystemView === 'community-forum'
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <VectorDrawIcon 
                      name="chat" 
                      size="xs" 
                      active={ecosystemView === 'community-forum'}
                      triggerKey={`desktop-forum-${ecosystemView}-${navAnimKey}`}
                    />
                    <span>Forum Monitor</span>
                  </button>

                  {/* Cohort Analytics */}
                  <button
                    onClick={() => handleNavClick(() => onSelectEcosystemView('global-analytics'))}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                      ecosystemView === 'global-analytics'
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <VectorDrawIcon 
                      name="trending" 
                      size="xs" 
                      active={ecosystemView === 'global-analytics'}
                      triggerKey={`desktop-analytics-${ecosystemView}-${navAnimKey}`}
                    />
                    <span>Cohort Analytics</span>
                  </button>
                </>
              )}

              {/* COMPANY SIDE MENU */}
              {userRole === 'company' && (
                <>
                  {/* Recruiter Portal */}
                  <button
                    onClick={() => handleNavClick(() => onSelectEcosystemView('teacher-company-portal'))}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                      ecosystemView === 'teacher-company-portal'
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <VectorDrawIcon 
                      name="briefcase" 
                      size="xs" 
                      active={ecosystemView === 'teacher-company-portal'}
                      triggerKey={`desktop-portal-${ecosystemView}-${navAnimKey}`}
                    />
                    <span>Recruiter Portal</span>
                  </button>

                  {/* Discover Talent */}
                  <button
                    onClick={() => handleNavClick(() => onSelectEcosystemView('discover-talent'))}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                      ecosystemView === 'discover-talent'
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <VectorDrawIcon 
                      name="profile" 
                      size="xs" 
                      active={ecosystemView === 'discover-talent'}
                      triggerKey={`desktop-disc-talent-${ecosystemView}-${navAnimKey}`}
                    />
                    <span>Discover Talent</span>
                  </button>

                  {/* Submitted Projects */}
                  <button
                    onClick={() => handleNavClick(() => onSelectEcosystemView('discover-projects'))}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                      ecosystemView === 'discover-projects'
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <VectorDrawIcon 
                      name="discover" 
                      size="xs" 
                      active={ecosystemView === 'discover-projects'}
                      triggerKey={`desktop-disc-projects-${ecosystemView}-${navAnimKey}`}
                    />
                    <span>Ecosystem Projects</span>
                  </button>

                  {/* Ecosystem Analytics */}
                  <button
                    onClick={() => handleNavClick(() => onSelectEcosystemView('global-analytics'))}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                      ecosystemView === 'global-analytics'
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-xs border border-transparent'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <VectorDrawIcon 
                      name="trending" 
                      size="xs" 
                      active={ecosystemView === 'global-analytics'}
                      triggerKey={`desktop-analytics-${ecosystemView}-${navAnimKey}`}
                    />
                    <span>Ecosystem Analytics</span>
                  </button>
                </>
              )}
            </>
          )}
        </nav>

        {/* Right Actions Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PROMINENT LIGHT / DARK THEME TOGGLE BUTTON (ICON ONLY, NO WORDS) */}
          <button
            onClick={toggleTheme}
            className="p-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 rounded-full transition-all cursor-pointer shadow-xs select-none flex items-center justify-center"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Light and Dark Mode"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-zinc-100 fill-zinc-100" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-900 fill-zinc-900" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <VectorDrawIcon name="bell" size="xs" triggerKey={`bell-${notificationsOpen}`} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1f1f23] rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-4 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-700">
                  <span className="font-semibold text-sm text-zinc-900 dark:text-white">Notifications</span>
                  <span className="text-[11px] bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2 py-0.5 rounded-full font-medium border border-zinc-200 dark:border-zinc-700">3 New</span>
                </div>
                <div className="space-y-3 mt-3">
                  <div className="flex gap-3 text-xs">
                    <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center shrink-0 font-bold">
                      ✓
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">Project Validated</p>
                      <p className="text-zinc-500 dark:text-zinc-400">Distributed Task Engine received peer verification.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center shrink-0">
                      💬
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">Elena interested in Collab</p>
                      <p className="text-zinc-500 dark:text-zinc-400">Elena sent a message about Supply Chain Tracker.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center shrink-0">
                      🎯
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">Mock Session Reminder</p>
                      <p className="text-zinc-500 dark:text-zinc-400">Behavioral Mock Interview scheduled for today.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings button */}
          <button 
            onClick={onOpenSettings}
            className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
            title="Settings & Simulation Controls"
          >
            <VectorDrawIcon name="settings" size="xs" />
          </button>

          {/* User Profile Avatar & Edit Account Pill */}
          <div className="flex items-center gap-1.5 ml-1 shrink-0">
            <button 
              onClick={() => onSelectEcosystemView('student-profile')}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-500/50 hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500/30 transition-all cursor-pointer shadow-xs"
              title={`${currentUser.name} - View Profile`}
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-full h-full object-cover"
              />
            </button>
            {onOpenEditProfile && (
              <button
                onClick={onOpenEditProfile}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 rounded-full text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                title="Customize your real account details"
              >
                <User className="w-3 h-3" />
                <span className="max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#18181b] border-b border-zinc-200 dark:border-zinc-800 px-4 pt-2 pb-4 space-y-3 animate-in slide-in-from-top duration-200 shadow-md">
          {/* Active Side Perspective Toggler for Mobile */}
          <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 space-y-2 border border-zinc-200 dark:border-zinc-700">
            <div className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Active Side</div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => { onSelectUserRole('student'); setMobileMenuOpen(false); }}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  userRole === 'student'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Candidate</span>
              </button>
              <button
                onClick={() => { onSelectUserRole('teacher'); setMobileMenuOpen(false); }}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  userRole === 'teacher'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Educator</span>
              </button>
              <button
                onClick={() => { onSelectUserRole('company'); setMobileMenuOpen(false); }}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  userRole === 'company'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Partner</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Active Mode</span>
            <div className="flex gap-1">
              <button 
                onClick={() => { onSelectMode('ecosystem'); setMobileMenuOpen(false); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${mode === 'ecosystem' ? 'bg-black text-white dark:bg-zinc-700' : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'}`}
              >
                Ecosystem
              </button>
              <button 
                onClick={() => { onSelectMode('prep'); setMobileMenuOpen(false); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${mode === 'prep' ? 'bg-black text-white dark:bg-zinc-700' : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'}`}
              >
                Prep Arena
              </button>
            </div>
          </div>

          {/* Theme Switcher in mobile */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-900 dark:text-white cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-900" />}
              <span>Current Theme: {isDark ? 'Gray Dark' : 'Black & White Light'}</span>
            </div>
            <span className="text-[11px] underline">Toggle</span>
          </button>

          {mode === 'prep' ? (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => { onSelectPrepView('hub'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 cursor-pointer ${prepView === 'hub' ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
              >
                <VectorDrawIcon name="hub" size="xs" active={prepView === 'hub'} strokeColor={prepView === 'hub' ? '#ffffff' : undefined} /> Hub
              </button>
              <button
                onClick={() => { onSelectPrepView('arena'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 cursor-pointer ${prepView === 'arena' ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
              >
                <VectorDrawIcon name="arena" size="xs" active={prepView === 'arena'} strokeColor={prepView === 'arena' ? '#ffffff' : undefined} /> Arena
              </button>
              <button
                onClick={() => { onSelectPrepView('library'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 cursor-pointer ${prepView === 'library' ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
              >
                <VectorDrawIcon name="library" size="xs" active={prepView === 'library'} strokeColor={prepView === 'library' ? '#ffffff' : undefined} /> Library
              </button>
              <button
                onClick={() => { onSelectPrepView('system-architect'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 cursor-pointer ${prepView === 'system-architect' ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
              >
                <VectorDrawIcon name="architecture" size="xs" active={prepView === 'system-architect'} strokeColor={prepView === 'system-architect' ? '#ffffff' : undefined} /> Arch Lab
              </button>
              <button
                onClick={() => { onSelectPrepView('review'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 col-span-2 cursor-pointer ${prepView === 'review' ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
              >
                <VectorDrawIcon name="review" size="xs" active={prepView === 'review'} strokeColor={prepView === 'review' ? '#ffffff' : undefined} /> Review
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* STUDENT / CANDIDATE LINKS */}
              {userRole === 'student' && (
                <>
                  <button
                    onClick={() => { onSelectEcosystemView('home'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 cursor-pointer ${ecosystemView === 'home' ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
                  >
                    <VectorDrawIcon name="dashboard" size="xs" active={ecosystemView === 'home'} strokeColor={ecosystemView === 'home' ? '#ffffff' : undefined} /> Dashboard
                  </button>
                  <button
                    onClick={() => { onSelectEcosystemView('discover-projects'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 cursor-pointer ${ecosystemView.startsWith('discover') ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
                  >
                    <VectorDrawIcon name="discover" size="xs" active={ecosystemView.startsWith('discover')} strokeColor={ecosystemView.startsWith('discover') ? '#ffffff' : undefined} /> Discover
                  </button>
                  <button
                    onClick={() => { onSelectEcosystemView('squads-progress'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 cursor-pointer ${ecosystemView === 'squads-progress' ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
                  >
                    <VectorDrawIcon name="target" size="xs" active={ecosystemView === 'squads-progress'} strokeColor={ecosystemView === 'squads-progress' ? '#ffffff' : undefined} /> My Squad
                  </button>
                  <button
                    onClick={() => { onSelectEcosystemView('collab'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 cursor-pointer ${ecosystemView === 'collab' ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
                  >
                    <VectorDrawIcon name="collab" size="xs" active={ecosystemView === 'collab'} strokeColor={ecosystemView === 'collab' ? '#ffffff' : undefined} /> Collab
                  </button>
                  <button
                    onClick={() => { onSelectEcosystemView('community-forum'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 cursor-pointer ${ecosystemView === 'community-forum' ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
                  >
                    <VectorDrawIcon name="chat" size="xs" active={ecosystemView === 'community-forum'} strokeColor={ecosystemView === 'community-forum' ? '#ffffff' : undefined} /> Forum
                  </button>
                  <button
                    onClick={() => { onSelectEcosystemView('student-profile'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 cursor-pointer ${ecosystemView === 'student-profile' ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
                  >
                    <VectorDrawIcon name="profile" size="xs" active={ecosystemView === 'student-profile'} strokeColor={ecosystemView === 'student-profile' ? '#ffffff' : undefined} /> Profile (Alex)
                  </button>
                </>
              )}

              {/* TEACHER / EDUCATOR LINKS */}
              {userRole === 'teacher' && (
                <>
                  <button
                    onClick={() => { onSelectEcosystemView('teacher-company-portal'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 col-span-2 cursor-pointer ${ecosystemView === 'teacher-company-portal' ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
                  >
                    <VectorDrawIcon name="briefcase" size="xs" active={ecosystemView === 'teacher-company-portal'} strokeColor={ecosystemView === 'teacher-company-portal' ? '#ffffff' : undefined} /> Teacher Portal
                  </button>
                  <button
                    onClick={() => { onSelectEcosystemView('discover-projects'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 cursor-pointer ${ecosystemView === 'discover-projects' ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
                  >
                    <VectorDrawIcon name="discover" size="xs" active={ecosystemView === 'discover-projects'} strokeColor={ecosystemView === 'discover-projects' ? '#ffffff' : undefined} /> Submitted Projects
                  </button>
                  <button
                    onClick={() => { onSelectEcosystemView('community-forum'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 cursor-pointer ${ecosystemView === 'community-forum' ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
                  >
                    <VectorDrawIcon name="chat" size="xs" active={ecosystemView === 'community-forum'} strokeColor={ecosystemView === 'community-forum' ? '#ffffff' : undefined} /> Forum Monitor
                  </button>
                  <button
                    onClick={() => { onSelectEcosystemView('global-analytics'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 col-span-2 cursor-pointer ${ecosystemView === 'global-analytics' ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
                  >
                    <VectorDrawIcon name="trending" size="xs" active={ecosystemView === 'global-analytics'} strokeColor={ecosystemView === 'global-analytics' ? '#ffffff' : undefined} /> Cohort Analytics
                  </button>
                </>
              )}

              {/* COMPANY / RECRUITER PARTNER LINKS */}
              {userRole === 'company' && (
                <>
                  <button
                    onClick={() => { onSelectEcosystemView('teacher-company-portal'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 col-span-2 cursor-pointer ${ecosystemView === 'teacher-company-portal' ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
                  >
                    <VectorDrawIcon name="briefcase" size="xs" active={ecosystemView === 'teacher-company-portal'} strokeColor={ecosystemView === 'teacher-company-portal' ? '#ffffff' : undefined} /> Recruiter Portal
                  </button>
                  <button
                    onClick={() => { onSelectEcosystemView('discover-talent'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 cursor-pointer ${ecosystemView === 'discover-talent' ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
                  >
                    <VectorDrawIcon name="profile" size="xs" active={ecosystemView === 'discover-talent'} strokeColor={ecosystemView === 'discover-talent' ? '#ffffff' : undefined} /> Discover Talent
                  </button>
                  <button
                    onClick={() => { onSelectEcosystemView('discover-projects'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 cursor-pointer ${ecosystemView === 'discover-projects' ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
                  >
                    <VectorDrawIcon name="discover" size="xs" active={ecosystemView === 'discover-projects'} strokeColor={ecosystemView === 'discover-projects' ? '#ffffff' : undefined} /> Ecosystem Projects
                  </button>
                  <button
                    onClick={() => { onSelectEcosystemView('global-analytics'); setMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl text-sm text-left flex items-center gap-2 col-span-2 cursor-pointer ${ecosystemView === 'global-analytics' ? 'bg-black text-white dark:bg-zinc-700 font-semibold' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}
                  >
                    <VectorDrawIcon name="trending" size="xs" active={ecosystemView === 'global-analytics'} strokeColor={ecosystemView === 'global-analytics' ? '#ffffff' : undefined} /> Ecosystem Analytics
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
