import React, { useState } from 'react';
import { PrepView, Student, InterviewEvaluation } from '../../types';
import { GeovaLogo } from '../GeovaLogo';
import { 
  CheckCircle2, 
  Target, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  BarChart3, 
  TrendingUp, 
  ArrowRight, 
  Download, 
  Share2, 
  Check, 
  AlertTriangle,
  Lightbulb,
  Award,
  Sparkles,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { ResumeReportModal } from '../modals/ResumeReportModal';

interface PerformanceReviewViewProps {
  currentUser: Student;
  feedbackData?: any;
  onRetake: () => void;
  onNavigatePrep: (view: PrepView) => void;
}

export const PerformanceReviewView: React.FC<PerformanceReviewViewProps> = ({
  currentUser,
  feedbackData,
  onRetake,
  onNavigatePrep
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState('01:24');
  const [showResumeModal, setShowResumeModal] = useState(false);

  const evaluation: InterviewEvaluation | undefined = feedbackData?.evaluation;
  const overallScore = evaluation?.overallScore || feedbackData?.overallScore || 94;
  const grade = evaluation?.grade || feedbackData?.grade || 'A+';
  const pacing = feedbackData?.pacingScore || 88;
  const clarity = evaluation?.rubric?.communicationClarity?.score || feedbackData?.clarityScore || 94;
  const technical = evaluation?.rubric?.technicalAccuracy?.score || feedbackData?.keywordScore || 92;
  const problemSolving = evaluation?.rubric?.problemSolving?.score || 90;
  const codeQuality = evaluation?.rubric?.codeQualityOrStructure?.score || 88;

  const strengths = evaluation?.strengths || feedbackData?.strengths || [
    'Excellent use of the STAR method to structure the response.',
    'High technical precision when discussing Redis caching, consistent hashing, and Kafka queues.',
    'Clear metric quantification: "reduced query latency by 64%".'
  ];

  const improvementAreas = evaluation?.areasForImprovement || feedbackData?.improvementAreas || [
    'Slow down pacing slightly during the explanation of the root cause.',
    'Incorporate more discussion on trade-offs and distributed failure modes.'
  ];

  const idealAnswer = evaluation?.modelIdealAnswer || 'A senior-level answer balances scalability, fault tolerance, and data consistency while clearly stating trade-offs between cache latency and eventual consistency.';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#eff4ff] text-[#3525cd] text-xs font-bold px-3 py-1 rounded-full inline-block">
              Session Completed
            </span>
            <span className="bg-[#e8f5e9] text-[#2e7d32] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Transcript Ready
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0b1c30]">
            Performance Review & Rubric Feedback
          </h1>
          <p className="text-sm text-[#464555] mt-1">
            Comprehensive evaluation by Gemini AI and proctored evaluation rubrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowResumeModal(true)}
            className="px-4 py-2.5 bg-[#eff4ff] hover:bg-[#d7dff9] text-[#3525cd] text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer border border-[#d7dff9]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Verified Transcript</span>
          </button>

          <button
            onClick={onRetake}
            className="px-4 py-2.5 bg-[#3525cd] hover:bg-[#1e00a9] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Practice Again</span>
          </button>
        </div>
      </div>

      {/* Top Overall Score Card */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs font-semibold text-[#777587] uppercase tracking-wider">Candidate Readiness Rating</span>
          <div className="flex items-baseline gap-2 justify-center sm:justify-start">
            <span className="font-display font-black text-4xl sm:text-5xl text-[#0b1c30]">{overallScore}%</span>
            <span className="text-sm font-bold text-[#3525cd]">Grade {grade}</span>
          </div>
          <p className="text-xs text-[#2e7d32] font-semibold flex items-center gap-1 justify-center sm:justify-start">
            <CheckCircle2 className="w-4 h-4" />
            {evaluation?.recruiterReadinessVerdict || 'Fast-Track Recommended for Technical Rounds'}
          </p>
        </div>

        <div className="flex items-center gap-4 text-center">
          <div className="p-3.5 bg-[#fafbfe] rounded-2xl border border-[#eceef3]">
            <span className="text-[10px] uppercase font-bold text-[#777587] block">Pacing</span>
            <span className="font-bold text-lg text-[#0b1c30]">{pacing}%</span>
          </div>
          <div className="p-3.5 bg-[#fafbfe] rounded-2xl border border-[#eceef3]">
            <span className="text-[10px] uppercase font-bold text-[#777587] block">Clarity</span>
            <span className="font-bold text-lg text-[#0b1c30]">{clarity}%</span>
          </div>
          <div className="p-3.5 bg-[#fafbfe] rounded-2xl border border-[#eceef3]">
            <span className="text-[10px] uppercase font-bold text-[#777587] block">Technical</span>
            <span className="font-bold text-lg text-[#0b1c30]">{technical}%</span>
          </div>
        </div>
      </div>

      {/* Video Session Replay Player */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(15,23,42,0.04)] space-y-4">
        <h2 className="font-display font-bold text-lg text-[#0b1c30] flex items-center justify-between">
          <span>Session Video & Voice Recording</span>
          <span className="text-xs font-mono font-semibold text-[#777587]">Duration: 02:45</span>
        </h2>

        <div className="w-full h-64 sm:h-80 rounded-2xl bg-[#0b1c30] overflow-hidden relative flex items-center justify-center border border-[#1e00a9]/30">
          <img
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80"
            alt="Interview Replay"
            className="w-full h-full object-cover opacity-85"
          />

          {/* Center Play Button Overlay */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-[#3525cd] flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
          </button>

          {/* Bottom Player Controls */}
          <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md px-4 py-2.5 rounded-xl text-white text-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsPlaying(!isPlaying)} className="cursor-pointer">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <span className="font-mono text-[11px]">{playbackTime} / 02:45</span>
            </div>

            <div className="flex-1 max-w-xs mx-4 bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#3525cd] h-full rounded-full w-1/2" />
            </div>

            <Volume2 className="w-4 h-4 text-white/80" />
          </div>
        </div>
      </div>

      {/* 4 Rubric Evaluation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Technical Accuracy */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#464555]">Technical Accuracy & Depth</span>
            <span className="font-display font-bold text-xl text-[#0b1c30]">{technical}%</span>
          </div>
          <div className="w-full bg-[#eceef3] h-2.5 rounded-full overflow-hidden">
            <div className="bg-[#3525cd] h-full rounded-full transition-all duration-1000" style={{ width: `${technical}%` }} />
          </div>
          <p className="text-[11px] text-[#777587]">
            {evaluation?.rubric?.technicalAccuracy?.comment || 'Strong architectural terminology, solid reasoning on data caching.'}
          </p>
        </div>

        {/* Communication Clarity */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#464555]">Communication & STAR Clarity</span>
            <span className="font-display font-bold text-xl text-[#0b1c30]">{clarity}%</span>
          </div>
          <div className="w-full bg-[#eceef3] h-2.5 rounded-full overflow-hidden">
            <div className="bg-[#2e7d32] h-full rounded-full transition-all duration-1000" style={{ width: `${clarity}%` }} />
          </div>
          <p className="text-[11px] text-[#777587]">
            {evaluation?.rubric?.communicationClarity?.comment || 'Minimal filler words, structured problem narrative, and calm delivery.'}
          </p>
        </div>

        {/* Problem Solving */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#464555]">Problem Solving & Trade-offs</span>
            <span className="font-display font-bold text-xl text-[#0b1c30]">{problemSolving}%</span>
          </div>
          <div className="w-full bg-[#eceef3] h-2.5 rounded-full overflow-hidden">
            <div className="bg-[#4f46e5] h-full rounded-full transition-all duration-1000" style={{ width: `${problemSolving}%` }} />
          </div>
          <p className="text-[11px] text-[#777587]">
            {evaluation?.rubric?.problemSolving?.comment || 'Proactive edge-case mitigation and scalability analysis.'}
          </p>
        </div>

        {/* Code Quality & Structure */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#464555]">Code Quality & Structure</span>
            <span className="font-display font-bold text-xl text-[#0b1c30]">{codeQuality}%</span>
          </div>
          <div className="w-full bg-[#eceef3] h-2.5 rounded-full overflow-hidden">
            <div className="bg-[#f57f17] h-full rounded-full transition-all duration-1000" style={{ width: `${codeQuality}%` }} />
          </div>
          <p className="text-[11px] text-[#777587]">
            {evaluation?.rubric?.codeQualityOrStructure?.comment || 'Clean syntax, sensible variable identifiers, and modular layout.'}
          </p>
        </div>
      </div>

      {/* Strengths & Improvement Tips Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#e8f5e9]/40 border border-[#c8e6c9] rounded-3xl p-6 space-y-3">
          <h3 className="font-display font-bold text-base text-[#2e7d32] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#2e7d32]" />
            What You Did Great
          </h3>
          <ul className="space-y-2 text-xs text-[#0b1c30]">
            {strengths.map((str: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32] shrink-0 mt-1.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#fff8e1]/50 border border-[#ffe082] rounded-3xl p-6 space-y-3">
          <h3 className="font-display font-bold text-base text-[#f57f17] flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#f57f17]" />
            Targeted Improvement Tips
          </h3>
          <ul className="space-y-2 text-xs text-[#0b1c30]">
            {improvementAreas.map((tip: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f57f17] shrink-0 mt-1.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Model Ideal Response Snippet */}
      <div className="bg-[#fafbfe] border border-[#d7dff9] rounded-3xl p-6 sm:p-8 space-y-3">
        <h3 className="font-display font-bold text-base text-[#0b1c30] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#3525cd]" />
          Benchmark Exemplary Answer Model
        </h3>
        <p className="text-xs text-[#464555] leading-relaxed italic bg-white p-4 rounded-2xl border border-[#eceef3]">
          "{idealAnswer}"
        </p>
      </div>

      {/* Historical Progress Chart */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-[#0b1c30]">
              Session Performance Progress
            </h2>
            <p className="text-xs text-[#464555]">Comparison across your recent practice interviews</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2e7d32] bg-[#e8f5e9] px-2.5 py-1 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" />
            +35% Improvement
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 h-48 pt-6 pb-2 px-4 border-b border-[#eceef3]">
          <div className="flex-1 flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-[#464555]">60%</span>
            <div className="w-full max-w-[48px] bg-[#d7dff9] rounded-t-xl h-[60%] transition-all duration-500" />
            <span className="text-xs font-semibold text-[#777587]">S1</span>
          </div>

          <div className="flex-1 flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-[#464555]">75%</span>
            <div className="w-full max-w-[48px] bg-[#d7dff9] rounded-t-xl h-[75%] transition-all duration-500" />
            <span className="text-xs font-semibold text-[#777587]">S2</span>
          </div>

          <div className="flex-1 flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-[#464555]">82%</span>
            <div className="w-full max-w-[48px] bg-[#d7dff9] rounded-t-xl h-[82%] transition-all duration-500" />
            <span className="text-xs font-semibold text-[#777587]">S3</span>
          </div>

          <div className="flex-1 flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-[#3525cd]">{overallScore}%</span>
            <div className="w-full max-w-[48px] bg-[#3525cd] shadow-md rounded-t-xl h-[94%] transition-all duration-500" />
            <span className="text-xs font-bold text-[#3525cd]">Current</span>
          </div>
        </div>
      </div>

      {/* Modal for Resume / Certificate Transcript */}
      {showResumeModal && (
        <ResumeReportModal
          currentUser={currentUser}
          latestEvaluation={evaluation}
          onClose={() => setShowResumeModal(false)}
        />
      )}

    </div>
  );
};
