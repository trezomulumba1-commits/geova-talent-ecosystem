import React, { useState } from 'react';
import { Student, Project, CollabPost, Company, Opportunity, EcosystemView } from '../../types';
import { AnimatedIcon } from '../common/AnimatedIcon';
import { VectorDrawIcon } from '../common/VectorDrawIcon';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  Briefcase, 
  Users, 
  Target, 
  Plus, 
  ExternalLink,
  Flame,
  Check,
  Clock,
  Calendar,
  Send,
  Bell,
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  ShieldCheck,
  Code2,
  FileCode,
  Layers,
  BarChart2,
  CheckSquare,
  Square,
  MessageSquare
} from 'lucide-react';

interface HomeDashboardViewProps {
  currentUser: Student;
  projects: Project[];
  collabs: CollabPost[];
  students: Student[];
  companies?: Company[];
  opportunities?: Opportunity[];
  readinessScore?: number;
  onNavigate: (view: EcosystemView | any) => void;
  onOpenProject: (projectId: string) => void;
  onOpenStudent: (studentId: string) => void;
  onOpenCompany?: (companyId: string) => void;
  onOpenOpportunity?: (opportunityId: string) => void;
  onConnectStudent: (student: Student) => void;
  onToggleCollabInterest: (collabId: string) => void;
  onStartArena?: () => void;
}

interface ActionItem {
  id: string;
  title: string;
  category: 'prep' | 'collab' | 'verification' | 'hiring';
  impact: string;
  completed: boolean;
  actionText: string;
  targetView: string;
}

interface ApplicationTrackerItem {
  id: string;
  company: string;
  role: string;
  logo: string;
  stage: 'Technical Prep' | 'Recruiter Review' | 'Code Evaluation' | 'Final Round';
  stageIndex: number; // 1 to 4
  matchScore: number;
  deadline: string;
  hiringManager: string;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  currentUser,
  projects,
  collabs,
  students,
  companies = [],
  opportunities = [],
  readinessScore = 78,
  onNavigate,
  onOpenProject,
  onOpenStudent,
  onOpenCompany,
  onOpenOpportunity,
  onConnectStudent,
  onToggleCollabInterest,
  onStartArena
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pipeline' | 'market' | 'activity'>('overview');

  // Interactive Action Items / Checklist
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: 'act-1',
      title: 'Practice System Design & Caching scenario for Nebula AI technical interview',
      category: 'prep',
      impact: '+5% Readiness Score',
      completed: false,
      actionText: 'Launch Arena',
      targetView: 'arena'
    },
    {
      id: 'act-2',
      title: 'Review and approve sprint tasks for Visionary CRM v2.0 collaboration',
      category: 'collab',
      impact: 'Sprint Deadline in 3 days',
      completed: false,
      actionText: 'Open Collabs',
      targetView: 'collab'
    },
    {
      id: 'act-3',
      title: 'Submit SwiftPay transaction processing code for architecture verification badge',
      category: 'verification',
      impact: 'Unlocks Tier-1 Recruiter Feed',
      completed: true,
      actionText: 'View Project',
      targetView: 'discover-projects'
    },
    {
      id: 'act-4',
      title: 'Complete Behavioral STAR response module on "Handling High-Severity Production Outages"',
      category: 'prep',
      impact: '+12% Keyword Match',
      completed: false,
      actionText: 'Study Guide',
      targetView: 'library'
    }
  ]);

  // Active Fast-Track Applications Pipeline
  const [applications] = useState<ApplicationTrackerItem[]>([
    {
      id: 'app-1',
      company: 'Nebula AI',
      role: 'Machine Learning Engineering Intern',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      stage: 'Technical Prep',
      stageIndex: 2,
      matchScore: 96,
      deadline: 'Tomorrow, 2:00 PM PST',
      hiringManager: 'Sarah Jenkins (Lead ML Engineer)'
    },
    {
      id: 'app-2',
      company: 'FinFlow Global',
      role: 'Frontend Systems & UI Architect',
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&auto=format&fit=crop&q=80',
      stage: 'Code Evaluation',
      stageIndex: 3,
      matchScore: 92,
      deadline: 'In Review by Staff Eng',
      hiringManager: 'David Chen (Director of Eng)'
    },
    {
      id: 'app-3',
      company: 'CloudSphere Scale',
      role: 'Distributed Systems Fellow',
      logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80',
      stage: 'Recruiter Review',
      stageIndex: 1,
      matchScore: 88,
      deadline: 'Fast-Track Applied',
      hiringManager: 'Talent Acquisition Team'
    }
  ]);

  // Live Ecosystem Pulse Feed
  const activityEvents = [
    {
      id: 'ev-1',
      type: 'recruiter',
      title: 'Recruiter from Stripe Talent viewed your GitHub & STAR verification',
      time: '25m ago',
      badge: 'High Priority',
      badgeColor: 'bg-[#eff4ff] text-[#3525cd]'
    },
    {
      id: 'ev-2',
      type: 'role',
      title: 'Nebula AI posted 2 new Q4 Internship slots matching your PyTorch profile',
      time: '1h ago',
      badge: 'New Opening',
      badgeColor: 'bg-[#e8f5e9] text-[#2e7d32]'
    },
    {
      id: 'ev-3',
      type: 'collab',
      title: 'Elena Vance published a collaboration invite for Web3 AI Trading Engine',
      time: '3h ago',
      badge: 'Collab Opportunity',
      badgeColor: 'bg-[#f0efff] text-[#4f46e5]'
    },
    {
      id: 'ev-4',
      type: 'project',
      title: 'SwiftPay reached 340+ developer upvotes and verified architecture status',
      time: '5h ago',
      badge: 'Milestone',
      badgeColor: 'bg-[#fff8e1] text-[#b78103]'
    }
  ];

  // In-Demand Tech Stack Market Radar
  const marketSkills = [
    { name: 'PyTorch & Distributed ML', demand: 94, growth: '+28%', companies: 'Nebula AI, OpenAI, DeepMind' },
    { name: 'TypeScript & Next.js 15', demand: 96, growth: '+15%', companies: 'Stripe, Vercel, FinFlow' },
    { name: 'Redis & Kafka Pub/Sub', demand: 88, growth: '+32%', companies: 'Uber, CloudSphere, Netflix' },
    { name: 'PostgreSQL & Drizzle ORM', demand: 85, growth: '+18%', companies: 'Supabase, Linear, Datadog' }
  ];

  const toggleActionItem = (id: string) => {
    setActionItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const completedCount = actionItems.filter(a => a.completed).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Command Center Header */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#eff4ff] text-[#3525cd] text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-[#3525cd]" />
                Command Center & Talent Radar
              </span>
              <span className="bg-[#e8f5e9] text-[#2e7d32] text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2e7d32] animate-pulse" />
                Live Fast-Track Active
              </span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0b1c30]">
              Ecosystem Dashboard & Pipeline
            </h1>
            <p className="text-sm text-[#464555] max-w-2xl leading-relaxed">
              Track active enterprise interview stages, recruiter discovery pulses, verified code milestones, and high-priority collaboration requests.
            </p>
          </div>

          {/* Quick Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (onStartArena) onStartArena();
                else onNavigate('hub' as any);
              }}
              className="px-5 py-2.5 bg-[#3525cd] hover:bg-[#1e00a9] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 shrink-0"
            >
              <Target className="w-4 h-4" />
              Launch Practice Arena
            </button>
            <button
              onClick={() => onNavigate('discover-opportunities')}
              className="px-4 py-2.5 bg-white border border-[#c7c4d8]/70 hover:bg-[#eff4ff] text-[#0b1c30] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Briefcase className="w-4 h-4 text-[#3525cd]" />
              Fast-Track Roles
            </button>
            <button
              onClick={() => onNavigate('collab')}
              className="px-4 py-2.5 bg-[#f8f9ff] border border-[#e5eeff] hover:bg-[#e5eeff] text-[#464555] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Users className="w-4 h-4 text-[#3525cd]" />
              Collab Hub
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-t border-[#eceef3] pt-4 mt-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-[#3525cd] text-white shadow-xs'
                : 'bg-[#f8f9ff] text-[#464555] hover:bg-[#eff4ff]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Overview & Action Plan
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'pipeline'
                ? 'bg-[#3525cd] text-white shadow-xs'
                : 'bg-[#f8f9ff] text-[#464555] hover:bg-[#eff4ff]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Active Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'activity'
                ? 'bg-[#3525cd] text-white shadow-xs'
                : 'bg-[#f8f9ff] text-[#464555] hover:bg-[#eff4ff]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Live Ecosystem Pulse
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'market'
                ? 'bg-[#3525cd] text-white shadow-xs'
                : 'bg-[#f8f9ff] text-[#464555] hover:bg-[#eff4ff]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Market Skill Radar
          </button>
        </div>
      </div>

      {/* Top Metric Barometers with Scroll Line Icons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recruiter Inquiries */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-10px' }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="bg-white p-5 rounded-2xl border border-[#c7c4d8]/60 shadow-xs flex items-center justify-between hover:border-[#3525cd]/40 transition-colors"
        >
          <div>
            <span className="text-xs font-semibold text-[#777587]">Recruiter Matches</span>
            <p className="font-display font-bold text-2xl text-[#0b1c30] mt-0.5">14</p>
            <span className="text-[11px] font-bold text-[#2e7d32] flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" /> +42% this week
            </span>
          </div>
          <VectorDrawIcon name="showcase" size="lg" badgeTheme="indigo" delay={0.1} />
        </motion.div>

        {/* Fast-Track Applications */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-10px' }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white p-5 rounded-2xl border border-[#c7c4d8]/60 shadow-xs flex items-center justify-between hover:border-[#3525cd]/40 transition-colors"
        >
          <div>
            <span className="text-xs font-semibold text-[#777587]">Active Pipeline</span>
            <p className="font-display font-bold text-2xl text-[#0b1c30] mt-0.5">3 Roles</p>
            <span className="text-[11px] font-bold text-[#3525cd] flex items-center gap-0.5 mt-1">
              Next round: Tomorrow
            </span>
          </div>
          <VectorDrawIcon name="briefcase" size="lg" badgeTheme="indigo" delay={0.15} />
        </motion.div>

        {/* AI Readiness Score */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-10px' }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white p-5 rounded-2xl border border-[#c7c4d8]/60 shadow-xs flex items-center justify-between hover:border-[#3525cd]/40 transition-colors"
        >
          <div>
            <span className="text-xs font-semibold text-[#777587]">Interview Readiness</span>
            <p className="font-display font-bold text-2xl text-[#0b1c30] mt-0.5">{readinessScore}%</p>
            <span className="text-[11px] font-bold text-[#4f46e5] flex items-center gap-0.5 mt-1">
              Target: 90%
            </span>
          </div>
          <VectorDrawIcon name="trending" size="lg" badgeTheme="violet" delay={0.2} />
        </motion.div>

        {/* Verified Codebase Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-10px' }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white p-5 rounded-2xl border border-[#c7c4d8]/60 shadow-xs flex items-center justify-between hover:border-[#3525cd]/40 transition-colors"
        >
          <div>
            <span className="text-xs font-semibold text-[#777587]">Verified Milestones</span>
            <p className="font-display font-bold text-2xl text-[#0b1c30] mt-0.5">5 Badges</p>
            <span className="text-[11px] font-bold text-[#2e7d32] flex items-center gap-0.5 mt-1">
              <CheckCircle2 className="w-3 h-3" /> 100% Validated
            </span>
          </div>
          <VectorDrawIcon name="shield-check" size="lg" badgeTheme="emerald" delay={0.25} />
        </motion.div>
      </div>

      {/* Dynamic Tab Views */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (8 cols): Action Items & Active Applications Pipeline */}
          <div className="lg:col-span-8 space-y-6">
            {/* Action Items / High-Priority Tasks Checklist */}
            <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-display font-bold text-xl text-[#0b1c30] flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-[#3525cd]" />
                    High-Priority Action Items
                  </h2>
                  <p className="text-xs text-[#464555] mt-0.5">
                    Tasks that directly improve your interview match rate and hiring velocity
                  </p>
                </div>
                <span className="text-xs font-bold text-[#3525cd] bg-[#eff4ff] px-3 py-1 rounded-full self-start sm:self-auto">
                  {completedCount} of {actionItems.length} Completed
                </span>
              </div>

              <div className="space-y-3">
                {actionItems.map(item => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      item.completed
                        ? 'bg-[#f8f9ff]/60 border-[#e5eeff] opacity-75'
                        : 'bg-[#f8f9ff] border-[#e5eeff] hover:border-[#3525cd]/40'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <button
                        onClick={() => toggleActionItem(item.id)}
                        className="mt-0.5 text-[#3525cd] hover:scale-110 transition-transform"
                      >
                        {item.completed ? (
                          <CheckSquare className="w-5 h-5 fill-[#3525cd] text-white" />
                        ) : (
                          <Square className="w-5 h-5 text-[#c7c4d8]" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <p className={`text-xs font-bold ${item.completed ? 'line-through text-[#777587]' : 'text-[#0b1c30]'}`}>
                          {item.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="font-semibold text-[#3525cd] bg-[#eff4ff] px-2 py-0.5 rounded-md">
                            {item.impact}
                          </span>
                          <span className="text-[#777587] capitalize">• {item.category}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (item.targetView === 'arena' && onStartArena) {
                          onStartArena();
                        } else {
                          onNavigate(item.targetView as any);
                        }
                      }}
                      className="self-end sm:self-auto px-4 py-2 bg-white border border-[#c7c4d8]/70 hover:bg-[#eff4ff] hover:border-[#3525cd] text-[#3525cd] text-xs font-bold rounded-xl transition-all shadow-2xs whitespace-nowrap"
                    >
                      {item.actionText} →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Fast-Track Application Pipeline Teardown */}
            <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-xl text-[#0b1c30] flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#3525cd]" />
                    Fast-Track Application Stages
                  </h2>
                  <p className="text-xs text-[#464555]">Real-time review progress with hiring managers</p>
                </div>
                <button
                  onClick={() => onNavigate('discover-opportunities')}
                  className="text-xs font-bold text-[#3525cd] hover:underline flex items-center gap-1"
                >
                  Browse More Roles
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {applications.map(app => (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl bg-[#f8f9ff] border border-[#e5eeff] hover:shadow-xs transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={app.logo}
                          alt={app.company}
                          className="w-12 h-12 rounded-xl object-cover border border-[#c7c4d8]/60"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display font-bold text-base text-[#0b1c30]">{app.company}</h3>
                            <span className="text-[10px] font-bold bg-[#e8f5e9] text-[#2e7d32] px-2 py-0.5 rounded-full">
                              {app.matchScore}% Fit Score
                            </span>
                          </div>
                          <p className="text-xs text-[#464555] font-semibold">{app.role}</p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs font-bold text-[#ba1a1a] bg-[#ffdad6]/40 px-2.5 py-1 rounded-lg">
                          Next: {app.deadline}
                        </span>
                        <p className="text-[11px] text-[#777587] mt-1">{app.hiringManager}</p>
                      </div>
                    </div>

                    {/* Progress Step Bar */}
                    <div className="pt-2">
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                        <div className={`p-1.5 rounded-lg ${app.stageIndex >= 1 ? 'bg-[#3525cd] text-white' : 'bg-[#eceef3] text-[#777587]'}`}>
                          1. Application Sent
                        </div>
                        <div className={`p-1.5 rounded-lg ${app.stageIndex >= 2 ? 'bg-[#3525cd] text-white' : 'bg-[#eceef3] text-[#777587]'}`}>
                          2. Technical Mock Prep
                        </div>
                        <div className={`p-1.5 rounded-lg ${app.stageIndex >= 3 ? 'bg-[#3525cd] text-white' : 'bg-[#eceef3] text-[#777587]'}`}>
                          3. Code Evaluation
                        </div>
                        <div className={`p-1.5 rounded-lg ${app.stageIndex >= 4 ? 'bg-[#3525cd] text-white' : 'bg-[#eceef3] text-[#777587]'}`}>
                          4. Final Decision
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Collaborative Sprints Workspace */}
            <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-xl text-[#0b1c30] flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-[#3525cd]" />
                    Active Team Sprints
                  </h2>
                  <p className="text-xs text-[#464555]">Joint builds in progress with student co-founders</p>
                </div>
                <button
                  onClick={() => onNavigate('collab')}
                  className="text-xs font-bold text-[#3525cd] hover:underline"
                >
                  View All Collabs →
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#eff4ff] to-[#f8f9ff] border border-[#d7dff9] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#3525cd] bg-white px-2 py-0.5 rounded-full">
                      Sprint #3: Production Ready
                    </span>
                    <h3 className="font-display font-bold text-base text-[#0b1c30] mt-1">
                      Visionary CRM v2.0 Architecture
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-[#2e7d32] bg-[#e8f5e9] px-2.5 py-1 rounded-full">
                    74% Sprint Complete
                  </span>
                </div>

                <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#eceef3]">
                  <div className="bg-[#3525cd] h-full rounded-full w-[74%]" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Elena" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                      <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80" alt="Marcus" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                      <img src={currentUser.avatar} alt="You" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                    </div>
                    <span className="text-[#464555] font-semibold">3 Active Builders</span>
                  </div>

                  <button
                    onClick={() => onOpenProject('visionary-crm')}
                    className="text-xs font-bold text-[#3525cd] hover:underline"
                  >
                    Open Sprint Board →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Live Pulse Feed & Upcoming Workshops */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Recruiter & Ecosystem Pulse */}
            <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-[#0b1c30] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#3525cd]" />
                  Live Activity Pulse
                </h3>
                <span className="text-[10px] font-bold text-[#2e7d32] bg-[#e8f5e9] px-2 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>

              <div className="space-y-3">
                {activityEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-3.5 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`font-bold px-2 py-0.5 rounded-md ${event.badgeColor}`}>
                        {event.badge}
                      </span>
                      <span className="text-[#777587] font-semibold">{event.time}</span>
                    </div>
                    <p className="text-xs font-medium text-[#0b1c30] leading-snug">
                      {event.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Mock Interview & Live Events */}
            <div className="bg-gradient-to-br from-[#1e00a9] to-[#3525cd] text-white p-6 rounded-3xl shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Scheduled Live Arena
                </span>
                <span className="text-xs text-white/80 font-mono">Tomorrow 2:00 PM</span>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Nebula Systems Technical Mock
                </h3>
                <p className="text-xs text-white/80 mt-1 leading-relaxed">
                  Focus: PyTorch distributed gradient pipelines, Redis caching, and STAR problem solving.
                </p>
              </div>

              <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                <span className="text-xs font-semibold text-white/90">Interview Panel Ready</span>
                <button
                  onClick={() => {
                    if (onStartArena) onStartArena();
                    else onNavigate('hub' as any);
                  }}
                  className="px-4 py-2 bg-white text-[#1e00a9] font-bold text-xs rounded-xl shadow-xs hover:bg-[#f8f9ff] transition-all"
                >
                  Join Room
                </button>
              </div>
            </div>

            {/* Quick Skill Demand Ticker */}
            <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-[#0b1c30]">
                  Trending Skills This Week
                </h3>
                <span className="text-xs font-semibold text-[#3525cd]">Top Match: 96%</span>
              </div>

              <div className="space-y-2.5 text-xs">
                {marketSkills.slice(0, 3).map(skill => (
                  <div key={skill.name} className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#0b1c30]">{skill.name}</p>
                      <p className="text-[10px] text-[#777587]">{skill.companies}</p>
                    </div>
                    <span className="text-xs font-bold text-[#2e7d32]">{skill.growth}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Applications Pipeline Detail */}
      {activeTab === 'pipeline' && (
        <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-2xl text-[#0b1c30]">
                Enterprise Application Pipeline
              </h2>
              <p className="text-sm text-[#464555] mt-1">
                Full-funnel status tracking for your fast-track verified submissions
              </p>
            </div>
            <button
              onClick={() => onNavigate('discover-opportunities')}
              className="px-5 py-2.5 bg-[#3525cd] hover:bg-[#1e00a9] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              + Submit New Application
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {applications.map(app => (
              <div
                key={app.id}
                className="bg-[#f8f9ff] border border-[#e5eeff] rounded-2xl p-5 space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <img
                      src={app.logo}
                      alt={app.company}
                      className="w-12 h-12 rounded-xl object-cover border border-[#c7c4d8]/60"
                    />
                    <span className="text-xs font-bold bg-[#e8f5e9] text-[#2e7d32] px-2.5 py-1 rounded-full">
                      {app.matchScore}% Match
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-[#0b1c30]">{app.role}</h3>
                    <p className="text-xs font-semibold text-[#3525cd]">{app.company}</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#eceef3] space-y-1 text-xs">
                    <span className="text-[#777587]">Current Stage:</span>
                    <p className="font-bold text-[#0b1c30]">{app.stage}</p>
                    <p className="text-[11px] text-[#ba1a1a] font-semibold">{app.deadline}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#eceef3] flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      if (onStartArena) onStartArena();
                      else onNavigate('hub' as any);
                    }}
                    className="font-bold text-[#3525cd] hover:underline"
                  >
                    Practice Technical Mock →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Live Activity Stream */}
      {activeTab === 'activity' && (
        <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-2xl text-[#0b1c30]">
                Ecosystem Activity Stream
              </h2>
              <p className="text-sm text-[#464555] mt-1">
                Real-time updates across enterprise partners, recruiters, and fellow builders
              </p>
            </div>
            <span className="text-xs font-bold text-[#3525cd] bg-[#eff4ff] px-3 py-1 rounded-full">
              Live Stream
            </span>
          </div>

          <div className="divide-y divide-[#eceef3]">
            {activityEvents.map(event => (
              <div key={event.id} className="py-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#3525cd] flex items-center justify-center shrink-0 mt-0.5">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${event.badgeColor}`}>
                      {event.badge}
                    </span>
                    <span className="text-xs text-[#777587]">{event.time}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#0b1c30]">{event.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Market Skill Radar */}
      {activeTab === 'market' && (
        <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-[#0b1c30]">
              Skill Demand & Hiring Benchmarks
            </h2>
            <p className="text-sm text-[#464555] mt-1">
              Top technical stacks demanded by enterprise recruiters in this hiring cycle
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {marketSkills.map(skill => (
              <div key={skill.name} className="p-5 rounded-2xl bg-[#f8f9ff] border border-[#e5eeff] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-[#0b1c30]">{skill.name}</h3>
                  <span className="text-xs font-bold text-[#2e7d32] bg-[#e8f5e9] px-2.5 py-1 rounded-full">
                    {skill.growth} QoQ
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-[#464555]">
                    <span>Industry Demand</span>
                    <span>{skill.demand}%</span>
                  </div>
                  <div className="w-full bg-[#eceef3] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#3525cd] h-full rounded-full" style={{ width: `${skill.demand}%` }} />
                  </div>
                </div>

                <p className="text-xs text-[#777587]">
                  Actively Hiring: <span className="text-[#0b1c30] font-semibold">{skill.companies}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
