import React, { useState } from 'react';
import { Opportunity, Student } from '../../types';
import { GeovaLogo } from '../GeovaLogo';
import { CheckCircle2, Send, X, ShieldCheck, FileText, Upload } from 'lucide-react';

interface ApplyModalProps {
  opportunity: Opportunity;
  currentUser: Student;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  opportunity,
  currentUser,
  onClose,
  onSubmit
}) => {
  const [portfolioLink, setPortfolioLink] = useState('https://alexmwansa.dev');
  const [githubLink, setGithubLink] = useState('https://github.com/alexmwansa');
  const [coverNote, setCoverNote] = useState(
    "Hi Sarah, I've spent the last 6 months building and optimizing predictive analytics dashboards and machine learning pipelines. My projects on GEOVA demonstrate practical experience with PyTorch and responsive UI systems."
  );
  const [includeVerifiedScore, setIncludeVerifiedScore] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        onSubmit({ portfolioLink, githubLink, coverNote, includeVerifiedScore });
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 text-zinc-900 dark:text-zinc-100">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={opportunity.companyLogo}
              alt={opportunity.companyName}
              className="w-12 h-12 rounded-xl object-contain border border-[#eceef3] dark:border-zinc-700 bg-white p-1 shadow-2xs"
            />
            <div>
              <h2 className="font-display font-bold text-lg text-[#0b1c30] dark:text-white">
                Apply to {opportunity.companyName}
              </h2>
              <p className="text-xs text-[#464555] dark:text-zinc-400">{opportunity.title} • {opportunity.type}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#777587] hover:text-[#0b1c30] dark:text-zinc-400 dark:hover:text-white rounded-full hover:bg-[#eceef3] dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#e8f5e9] dark:bg-emerald-950/60 text-[#2e7d32] dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#0b1c30] dark:text-white">Application Sent!</h3>
            <p className="text-xs text-[#464555] dark:text-zinc-400">
              Your validated profile, GitHub history, and verified scores have been forwarded to {opportunity.hiringManager.name}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Auto-attached GEOVA verified student badge */}
            <div className="p-3.5 bg-[#eff4ff] dark:bg-zinc-800/80 border border-[#d7dff9] dark:border-zinc-700 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <GeovaLogo size="xs" />
                <div>
                  <p className="font-semibold text-xs text-[#0b1c30] dark:text-white">GEOVA Verified Profile Attached</p>
                  <p className="text-[11px] text-[#464555] dark:text-zinc-400">Fast-tracks your review past standard ATS filters</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeVerifiedScore}
                onChange={e => setIncludeVerifiedScore(e.target.checked)}
                className="w-4 h-4 text-[#3525cd] rounded-sm cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0b1c30] dark:text-zinc-300 mb-1">
                Portfolio / Live Demo URL
              </label>
              <input
                type="url"
                value={portfolioLink}
                onChange={e => setPortfolioLink(e.target.value)}
                required
                className="w-full bg-[#f8f9ff] dark:bg-zinc-800 border border-[#c7c4d8]/60 dark:border-zinc-700 focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] rounded-xl px-3.5 py-2.5 text-xs text-[#0b1c30] dark:text-white outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0b1c30] dark:text-zinc-300 mb-1">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={githubLink}
                onChange={e => setGithubLink(e.target.value)}
                required
                className="w-full bg-[#f8f9ff] dark:bg-zinc-800 border border-[#c7c4d8]/60 dark:border-zinc-700 focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] rounded-xl px-3.5 py-2.5 text-xs text-[#0b1c30] dark:text-white outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0b1c30] dark:text-zinc-300 mb-1">
                Note to Hiring Manager ({opportunity.hiringManager.name})
              </label>
              <textarea
                value={coverNote}
                onChange={e => setCoverNote(e.target.value)}
                rows={3}
                required
                className="w-full bg-[#f8f9ff] dark:bg-zinc-800 border border-[#c7c4d8]/60 dark:border-zinc-700 focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] rounded-xl p-3 text-xs text-[#0b1c30] dark:text-white outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eceef3] dark:border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-[#464555] dark:text-zinc-400 hover:bg-[#eceef3] dark:hover:bg-zinc-800 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#3525cd] hover:bg-[#1e00a9] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
