import React, { useState } from 'react';
import { Company, Opportunity, Student } from '../../types';
import { 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  BookOpen, 
  TrendingUp,
  Award,
  Search,
  Plus,
  Briefcase
} from 'lucide-react';

interface TeacherCompanyPortalViewProps {
  companies: Company[];
  opportunities: Opportunity[];
  students: Student[];
  onOpenOpportunity: (oppId: string) => void;
  onOpenStudent: (studentId: string) => void;
  forcedRole?: 'teacher' | 'company';
}

export const TeacherCompanyPortalView: React.FC<TeacherCompanyPortalViewProps> = ({
  companies,
  opportunities,
  students,
  onOpenOpportunity,
  onOpenStudent,
  forcedRole
}) => {
  const [portalRole, setPortalRole] = useState<'teacher' | 'company'>('teacher');
  const [searchQuery, setSearchQuery] = useState('');

  const activeRole = forcedRole || portalRole;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header & Role Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            {activeRole === 'teacher' ? 'Educator Space' : 'Corporate Partner Space'}
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100">
            {activeRole === 'teacher' ? 'Teacher & Cohort Management' : 'Company Recruiting & Project Dashboard'}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            {activeRole === 'teacher' 
              ? 'Monitor student readiness, grade practice interview evaluations, and oversee team project milestones across your university cohort.'
              : 'Discover verified engineering talent, review live technical portfolios, and manage active internship postings.'}
          </p>
        </div>

        {/* Portal Switcher - Only shown if not forced from parent */}
        {!forcedRole && (
          <div className="flex items-center bg-zinc-200 dark:bg-zinc-800 p-1 rounded-2xl border border-zinc-300 dark:border-zinc-700 shrink-0">
            <button
              onClick={() => setPortalRole('teacher')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                portalRole === 'teacher'
                  ? 'bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              Teacher / Educator Side
            </button>
            <button
              onClick={() => setPortalRole('company')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                portalRole === 'company'
                  ? 'bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              Company / Recruiter Side
            </button>
          </div>
        )}
      </div>

      {/* Portal Content Based on Role */}
      {activeRole === 'teacher' ? (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between text-zinc-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Enrolled Students</span>
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100">42</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">+12% active this semester</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between text-zinc-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Cohort Avg Readiness</span>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100">81.4%</div>
              <p className="text-xs text-zinc-500 mt-1">Based on 140+ mock simulations</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between text-zinc-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Active Projects</span>
                <BookOpen className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100">8 Squads</div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">All milestones on track</p>
            </div>
          </div>

          {/* Student Roster & Readiness Grading */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">
                  Cohort Student Roster & Verification
                </h3>
                <p className="text-xs text-zinc-500">Review student technical scores and verify portfolio outputs</p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-indigo-600 w-full sm:w-64"
                />
              </div>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.role.toLowerCase().includes(searchQuery.toLowerCase())).map(student => (
                <div key={student.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 px-3 rounded-2xl transition-colors">
                  <div className="flex items-center gap-3.5">
                    <img src={student.avatar} alt={student.name} className="w-11 h-11 rounded-2xl object-cover" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-sm text-zinc-900 dark:text-zinc-100">{student.name}</h4>
                        {student.verified && (
                          <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500">{student.role} • {student.projectsCount} projects built</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Readiness: 88%</span>
                      <div className="w-24 bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-emerald-600 h-full w-[88%]" />
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenStudent(student.id)}
                      className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      View Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Company Sponsor Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between text-zinc-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Active Job Postings</span>
                <Briefcase className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{opportunities.length}</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Over 340 applicant matches</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between text-zinc-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Verified Talent Pool</span>
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100">1,240+</div>
              <p className="text-xs text-zinc-500 mt-1">Pre-vetted engineering students</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between text-zinc-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Hiring Partners</span>
                <Building2 className="w-5 h-5 text-violet-600" />
              </div>
              <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{companies.length}</div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">Top tier tech enterprises</p>
            </div>
          </div>

          {/* Active Opportunities Posted */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">
                  Active Corporate Opportunities & Open Roles
                </h3>
                <p className="text-xs text-zinc-500">Manage internships and full-time engineering openings</p>
              </div>

              <button className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all">
                <Plus className="w-4 h-4" /> Post New Role
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunities.map(opp => (
                <div
                  key={opp.id}
                  onClick={() => onOpenOpportunity(opp.id)}
                  className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/40 rounded-2xl p-5 cursor-pointer transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img src={opp.companyLogo} alt={opp.companyName} className="w-10 h-10 rounded-xl object-cover border border-zinc-200" />
                      <div>
                        <h4 className="font-display font-bold text-sm text-zinc-900 dark:text-zinc-100">{opp.title}</h4>
                        <span className="text-xs text-zinc-500">{opp.companyName} • {opp.location}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                      {opp.type}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {opp.overview}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700/60 text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{opp.stipend}</span>
                    <span className="text-zinc-500">Duration: {opp.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
