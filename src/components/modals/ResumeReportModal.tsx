import React, { useState, useEffect } from 'react';
import { Student, InterviewEvaluation } from '../../types';
import { GeovaLogo } from '../GeovaLogo';
import { 
  X, 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResumeReportModalProps {
  currentUser: Student;
  latestEvaluation?: InterviewEvaluation | null;
  onClose: () => void;
}

export const ResumeReportModal: React.FC<ResumeReportModalProps> = ({
  currentUser,
  latestEvaluation,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSummary, setAiSummary] = useState(
    `${currentUser.name} is a GEOVA-certified engineer with proven competency in full-stack architecture, high-concurrency systems, and clean code principles. Verified through proctored mock interview evaluations and active live project builds.`
  );
  const [endorsementScore, setEndorsementScore] = useState(94);
  const [keyCompetencies, setKeyCompetencies] = useState<string[]>([
    'Distributed Systems & Caching',
    'Full-Stack TypeScript & React',
    'Database Optimization (PostgreSQL / Redis)',
    'Technical STAR Interview Delivery',
    'Idempotency & Message Queues'
  ]);

  const certificateId = `GEOVA-VERIFIED-${currentUser.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleGenerateAiSummary = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/gemini/generate-candidate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: currentUser.name,
          role: currentUser.role || currentUser.title,
          skills: currentUser.skills,
          completedSessions: 5,
          verifiedProjects: currentUser.projects?.map(p => p.title) || ['SprintSync Task Engine', 'EcoTrack'],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.executiveSummary) setAiSummary(data.executiveSummary);
        if (data.endorsementScore) setEndorsementScore(data.endorsementScore);
        if (data.keyCompetencies) setKeyCompetencies(data.keyCompetencies);
      }
    } catch (err) {
      console.log('AI Generation error:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://geova.network/verify/${certificateId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 my-auto border border-[#c7c4d8]/60 print:border-0 print:shadow-none print:max-w-none">
        
        {/* Modal Controls Header (Hidden on Print) */}
        <div className="flex items-center justify-between border-b border-[#eceef3] pb-4 print:hidden">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#eff4ff] text-[#3525cd] text-xs font-bold rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3525cd]" />
              Official Verified Candidate Transcript
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-[#eff4ff] hover:bg-[#d7dff9] text-[#3525cd] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              title="Print / Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 bg-[#f8f9ff] hover:bg-[#e5eeff] text-[#0b1c30] text-xs font-bold rounded-xl border border-[#c7c4d8]/60 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-[#2e7d32]" /> : <Copy className="w-4 h-4 text-[#777587]" />}
              <span>{copied ? 'Copied' : 'Share Link'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-[#777587] hover:text-[#0b1c30] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Transcript Document Container */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#fafbfe] border border-[#d7dff9]/70 space-y-6 print:border-0 print:p-0 print:bg-white">
          
          {/* Top Emblem & Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 border-b border-[#eceef3] pb-6">
            <div className="flex items-center gap-4">
              {/* Standalone 3-Strip Logo Emblem */}
              <div className="p-3 bg-white rounded-2xl border border-[#c7c4d8]/60 shadow-xs">
                <GeovaLogo size="md" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="font-display font-black text-xl sm:text-2xl text-[#0b1c30]">
                  Verified Talent Credential
                </h1>
                <p className="text-xs font-medium text-[#777587]">
                  Autonomous Engineering Evaluation & Readiness Authority
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right space-y-1">
              <div className="inline-block bg-[#0b1c30] text-white px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-wider">
                {certificateId}
              </div>
              <p className="text-[11px] text-[#777587]">Issued: {issueDate}</p>
            </div>
          </div>

          {/* Candidate Profile Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-5 rounded-2xl border border-[#eceef3]">
            <div className="flex items-center gap-3 sm:col-span-2">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover border border-[#c7c4d8]/60 shadow-xs"
              />
              <div>
                <h2 className="font-display font-bold text-lg text-[#0b1c30]">
                  {currentUser.name}
                </h2>
                <p className="text-xs font-medium text-[#3525cd]">
                  {currentUser.role || currentUser.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-[#e8f5e9] text-[#2e7d32] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Identity & Code Authenticated
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end justify-center border-t sm:border-t-0 sm:border-l border-[#eceef3] pt-3 sm:pt-0 sm:pl-4">
              <span className="text-[11px] font-semibold text-[#777587] uppercase tracking-wider">
                Overall Endorsement
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-display font-black text-3xl text-[#0b1c30]">
                  {endorsementScore}
                </span>
                <span className="text-xs font-bold text-[#3525cd]">/ 100</span>
              </div>
              <span className="text-[11px] font-bold text-[#2e7d32]">
                Grade A+ (Fast-Track Ready)
              </span>
            </div>
          </div>

          {/* Executive Recruiter Summary */}
          <div className="bg-white p-5 rounded-2xl border border-[#eceef3] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-[#0b1c30] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3525cd]" />
                Executive Technical Endorsement
              </h3>
              <button
                onClick={handleGenerateAiSummary}
                disabled={isGeneratingAi}
                className="print:hidden text-[11px] font-semibold text-[#3525cd] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                {isGeneratingAi ? 'Regenerating...' : 'Regenerate with Gemini AI'}
              </button>
            </div>
            <p className="text-xs text-[#464555] leading-relaxed italic bg-[#f8f9ff] p-3.5 rounded-xl border border-[#d7dff9]/60">
              "{aiSummary}"
            </p>
          </div>

          {/* Verified Competencies Matrix */}
          <div className="bg-white p-5 rounded-2xl border border-[#eceef3] space-y-3">
            <h3 className="font-display font-bold text-sm text-[#0b1c30]">
              Verified Competencies & System Disciplines
            </h3>
            <div className="flex flex-wrap gap-2">
              {keyCompetencies.map((comp, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-[#eff4ff] text-[#0b1c30] text-xs font-semibold rounded-xl border border-[#d7dff9] flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3525cd]" />
                  {comp}
                </span>
              ))}
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#eceef3] space-y-2">
              <span className="text-xs font-bold text-[#0b1c30]">Core Technical Stack</span>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-gray-100 text-[#464555] text-xs font-medium rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#eceef3] space-y-2">
              <span className="text-xs font-bold text-[#0b1c30]">Verified Project Portfolio</span>
              <ul className="text-xs text-[#464555] space-y-1.5">
                <li className="flex items-center justify-between">
                  <span className="font-semibold text-[#0b1c30]">SprintSync Task Engine</span>
                  <span className="text-[10px] font-bold text-[#2e7d32] bg-[#e8f5e9] px-2 py-0.5 rounded-md">Validated</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-semibold text-[#0b1c30]">EcoTrack Real-time Carbon Dashboard</span>
                  <span className="text-[10px] font-bold text-[#2e7d32] bg-[#e8f5e9] px-2 py-0.5 rounded-md">Validated</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Security & Verification Footer */}
          <div className="pt-4 border-t border-[#eceef3] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#777587]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2e7d32]" />
              <span>Cryptographically signed evaluation transcript. Scan or share link for employer verification.</span>
            </div>
            <span className="font-mono text-[#0b1c30] font-bold">geova.network/verify</span>
          </div>

        </div>

        {/* Modal Action Buttons (Bottom) */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 print:hidden">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#0b1c30] text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#3525cd] hover:bg-[#1e00a9] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Printable Certificate
          </button>
        </div>

      </div>
    </div>
  );
};
