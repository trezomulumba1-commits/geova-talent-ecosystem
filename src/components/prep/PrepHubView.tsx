import React, { useState } from 'react';
import { PrepSession, PrepView, Student } from '../../types';
import { AnimatedIcon } from '../common/AnimatedIcon';
import { VectorDrawIcon } from '../common/VectorDrawIcon';
import { 
  CheckCircle2, 
  Video, 
  BookOpen, 
  BarChart3, 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Flame, 
  ArrowRight, 
  Target, 
  Calendar,
  Clock,
  Play,
  FileText,
  ShieldCheck,
  Network,
  Sparkles
} from 'lucide-react';
import { ResumeReportModal } from '../modals/ResumeReportModal';
import { motion } from 'motion/react';

interface PrepHubViewProps {
  currentUser: Student;
  sessions: PrepSession[];
  readinessScore: number;
  onNavigatePrep: (view: PrepView) => void;
  onStartArena: () => void;
}

export const PrepHubView: React.FC<PrepHubViewProps> = ({
  currentUser,
  sessions,
  readinessScore,
  onNavigatePrep,
  onStartArena
}) => {
  const [showResumeModal, setShowResumeModal] = useState(false);
  // SVG circle math for circular gauge:
  // circumference = 2 * PI * 40 ≈ 251.2
  const circumference = 251.2;
  const strokeDashoffset = circumference - (circumference * readinessScore) / 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Readiness Gauge Bento Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(15,23,42,0.04)]"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="bg-[#eff4ff] text-[#3525cd] text-xs font-bold px-3 py-1 rounded-full inline-block">
              Technical Interview Readiness
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0b1c30]">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-sm text-[#464555] max-w-md leading-relaxed">
              Your overall interview readiness is pacing ahead of 82% of candidates. Complete 2 more mock scenarios to hit your 90% target.
            </p>
          </div>

          {/* Circular Progress Gauge */}
          <div className="relative flex flex-col items-center shrink-0">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#eff4ff"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Active progress */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#3525cd"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-display font-bold text-2xl text-[#0b1c30] leading-none">
                  {readinessScore}%
                </span>
                <span className="text-[10px] font-semibold text-[#777587] mt-0.5">
                  Readiness
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[#464555] mt-1">
              Target: 90%
            </span>
          </div>
        </div>

        {/* Quick Launch & Transcript Buttons */}
        <div className="pt-6 mt-6 border-t border-[#eceef3] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#464555]">
            <AnimatedIcon icon={Target} size="xs" variant="minimal" className="text-[#3525cd]" />
            <span>Real-time voice pacing & architectural rubric evaluation</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowResumeModal(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#eff4ff] hover:bg-[#d7dff9] text-[#3525cd] font-bold text-xs rounded-xl border border-[#d7dff9] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <AnimatedIcon icon={FileText} size="xs" variant="minimal" />
              <span>Verified Transcript</span>
            </button>

            <button
              onClick={onStartArena}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#3525cd] hover:bg-[#1e00a9] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <AnimatedIcon icon={Play} size="xs" variant="minimal" className="fill-white" />
              <span>Launch Practice Arena</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Mock Sessions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-[#0b1c30]">
            Upcoming Sessions
          </h2>
          <button
            onClick={onStartArena}
            className="text-xs font-bold text-[#3525cd] hover:underline cursor-pointer"
          >
            Schedule New +
          </button>
        </div>

        <div className="space-y-3">
          {sessions.map(sess => (
            <motion.div
              key={sess.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-10px' }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-[#c7c4d8]/60 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#3525cd]/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#eff4ff] border border-[#d7dff9] flex flex-col items-center justify-center text-[#3525cd] shrink-0 font-display">
                  <span className="text-[11px] font-semibold uppercase">{sess.dateMonth}</span>
                  <span className="text-lg font-bold leading-none">{sess.dateDay}</span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-base text-[#0b1c30]">
                    {sess.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#777587] mt-0.5">
                    <span className="flex items-center gap-1">
                      <AnimatedIcon icon={Clock} size="xs" variant="minimal" />
                      {sess.timeRange}
                    </span>
                    <span className="bg-[#f8f9ff] text-[#464555] px-2 py-0.5 rounded-md border border-[#e5eeff] font-medium capitalize">
                      {sess.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onStartArena}
                  className="w-full sm:w-auto px-4 py-2 bg-[#3525cd] hover:bg-[#1e00a9] text-white text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
                >
                  Join Room
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Preparation Access Cards Grid with Line Drawing Icons as You Scroll */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-xl text-[#0b1c30]">
          Quick Access Hub
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Common Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-20px' }}
            transition={{ duration: 0.4, delay: 0.05 }}
            onClick={() => onNavigatePrep('library')}
            className="bg-white border border-[#c7c4d8]/60 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#3525cd]/40 transition-all cursor-pointer group flex items-start gap-4"
          >
            <VectorDrawIcon name="target" size="lg" badgeTheme="indigo" delay={0.05} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-[#0b1c30] group-hover:text-[#3525cd] transition-colors">
                  Common Questions
                </h3>
                <span className="text-xs font-bold text-[#3525cd]">45%</span>
              </div>
              <p className="text-xs text-[#464555] mt-1 mb-3">Top 50 algorithm & behavioral questions.</p>
              <div className="w-full bg-[#eceef3] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#3525cd] h-full rounded-full w-[45%]" />
              </div>
            </div>
          </motion.div>

          {/* Company Research */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-20px' }}
            transition={{ duration: 0.4, delay: 0.1 }}
            onClick={() => onNavigatePrep('library')}
            className="bg-white border border-[#c7c4d8]/60 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#3525cd]/40 transition-all cursor-pointer group flex items-start gap-4"
          >
            <VectorDrawIcon name="discover" size="lg" badgeTheme="indigo" delay={0.1} />
            <div>
              <h3 className="font-display font-bold text-base text-[#0b1c30] group-hover:text-[#3525cd] transition-colors">
                Company Research
              </h3>
              <p className="text-xs text-[#464555] mt-1">
                Deep dive into Google, Meta, Nebula AI, and FinFlow rubrics.
              </p>
            </div>
          </motion.div>

          {/* Mock Interview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-20px' }}
            transition={{ duration: 0.4, delay: 0.15 }}
            onClick={onStartArena}
            className="bg-white border border-[#c7c4d8]/60 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#3525cd]/40 transition-all cursor-pointer group flex items-start gap-4"
          >
            <VectorDrawIcon name="showcase" size="lg" badgeTheme="indigo" delay={0.15} />
            <div>
              <h3 className="font-display font-bold text-base text-[#0b1c30] group-hover:text-[#3525cd] transition-colors">
                Mock Interview
              </h3>
              <p className="text-xs text-[#464555] mt-1">
                Simulate 1-on-1 video interviews with real-time feedback.
              </p>
            </div>
          </motion.div>

          {/* Behavioral Prep */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-20px' }}
            transition={{ duration: 0.4, delay: 0.2 }}
            onClick={() => onNavigatePrep('library')}
            className="bg-white border border-[#c7c4d8]/60 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#3525cd]/40 transition-all cursor-pointer group flex items-start gap-4"
          >
            <VectorDrawIcon name="connect" size="lg" badgeTheme="indigo" delay={0.2} />
            <div>
              <h3 className="font-display font-bold text-base text-[#0b1c30] group-hover:text-[#3525cd] transition-colors">
                Behavioral Prep
              </h3>
              <p className="text-xs text-[#464555] mt-1">
                Structure stories using STAR and leadership principles.
              </p>
            </div>
          </motion.div>

          {/* System Architecture Lab (Experimental) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-20px' }}
            transition={{ duration: 0.4, delay: 0.25 }}
            onClick={() => onNavigatePrep('system-architect')}
            className="bg-white border border-[#3525cd]/40 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-start gap-4 sm:col-span-2 relative overflow-hidden"
          >
            <VectorDrawIcon name="connect" size="lg" badgeTheme="dark" delay={0.25} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-[#0b1c30] group-hover:text-[#3525cd] transition-colors">
                  System Architecture Live Simulation Lab
                </h3>
                <span className="bg-[#eff4ff] text-[#3525cd] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Interactive Simulator
                </span>
              </div>
              <p className="text-xs text-[#464555] mt-1">
                Simulate high-concurrency 100k RPS traffic loads, test failover chaos injection, inspect latencies, and get Gemini AI reliability audits.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#3525cd] self-center shrink-0 hidden sm:block group-hover:translate-x-1 transition-transform" />
          </motion.div>
        </div>
      </div>

      {/* Tip of the Day */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-20px' }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-[#eff4ff] to-[#f8f9ff] border border-[#d7dff9] rounded-3xl p-6 flex items-start gap-4"
      >
        <AnimatedIcon icon={Flame} size="md" badgeColor="indigo" />
        <div>
          <h3 className="font-display font-bold text-sm text-[#0b1c30]">
            Tip of the Day: Quantify the Result
          </h3>
          <p className="text-xs text-[#464555] mt-1 leading-relaxed">
            When concluding your behavioral STAR answers, always provide hard numbers (e.g. "reduced latency by 42%" or "boosted sprint velocity by 25%"). Interviewers index heavily on measurable business impact.
          </p>
        </div>
      </motion.div>

      {/* Verified Candidate Transcript Modal */}
      {showResumeModal && (
        <ResumeReportModal
          currentUser={currentUser}
          onClose={() => setShowResumeModal(false)}
        />
      )}
    </div>
  );
};
