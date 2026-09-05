import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  BookOpen,
  Users,
  Target
} from 'lucide-react';
import { Student } from '../../types';

interface GlobalAnalyticsViewProps {
  currentUser: Student;
}

export const GlobalAnalyticsView: React.FC<GlobalAnalyticsViewProps> = ({ currentUser }) => {
  const skillBreakdown = [
    { skill: 'System Design & Scalability', level: 88, color: 'bg-indigo-600' },
    { skill: 'Full-Stack React & Node', level: 94, color: 'bg-emerald-600' },
    { skill: 'Algorithms & Data Structures', level: 76, color: 'bg-amber-600' },
    { skill: 'AI & Gemini API Integration', level: 92, color: 'bg-violet-600' },
    { skill: 'Database Architecture (SQL/NoSQL)', level: 85, color: 'bg-sky-600' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Title & Overview */}
      <div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          Skill Proficiency & Ecosystem Benchmarks
        </span>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100">
          Global Analytics & Readiness Hub
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
          Detailed metrics of your technical competency, interview simulation performance, and cohort benchmark comparisons.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Readiness Score</span>
            <Target className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100">88.4%</div>
          <p className="text-xs text-emerald-600 font-medium mt-1">+5.2% this month</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Simulations Passed</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100">14 Rounds</div>
          <p className="text-xs text-zinc-500 mt-1">Top 5% of cohort</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Projects</span>
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{currentUser.projectsCount} Built</div>
          <p className="text-xs text-indigo-600 font-medium mt-1">Production ready</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Recruiter Inquiries</span>
            <Users className="w-5 h-5 text-violet-600" />
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100">8 Companies</div>
          <p className="text-xs text-emerald-600 font-medium mt-1">Active interview invites</p>
        </div>
      </div>

      {/* Skill Proficiency Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">
              Technical Domain Proficiency
            </h3>
            <p className="text-xs text-zinc-500">Evaluated across coding simulations and project reviews</p>
          </div>

          <div className="space-y-4">
            {skillBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-700 dark:text-zinc-300">{item.skill}</span>
                  <span className="text-zinc-900 dark:text-zinc-100">{item.level}%</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} transition-all duration-1000`} 
                    style={{ width: `${item.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cohort Benchmark & Activity Timeline */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">
              Cohort Benchmark Comparison
            </h3>
            <p className="text-xs text-zinc-500">How your engineering velocity compares to cohort averages</p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Code Commit Velocity</h4>
                <span className="text-xs text-zinc-500">Average 14 commits/week</span>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-full">
                +35% vs Cohort
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">System Design Accuracy</h4>
                <span className="text-xs text-zinc-500">Architecture lab completion rate</span>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 rounded-full">
                Top 10%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Peer Collaboration Index</h4>
                <span className="text-xs text-zinc-500">Task milestone contribution</span>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-full">
                Excellent
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
