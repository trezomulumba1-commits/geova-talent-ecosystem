import React, { useState } from 'react';
import { Opportunity, Student } from '../../types';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Share2, 
  Bookmark, 
  ChevronRight, 
  ShieldCheck, 
  Send, 
  MessageSquare 
} from 'lucide-react';

interface OpportunityDetailViewProps {
  opportunity: Opportunity;
  onBack: () => void;
  onApply: (opportunity: Opportunity) => void;
  onOpenCompany: (companyId: string) => void;
  onConnectManager: (managerName: string) => void;
}

export const OpportunityDetailView: React.FC<OpportunityDetailViewProps> = ({
  opportunity,
  onBack,
  onApply,
  onOpenCompany,
  onConnectManager
}) => {
  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Back & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#464555] hover:text-[#3525cd] bg-white border border-[#c7c4d8]/60 px-3.5 py-2 rounded-xl transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Opportunities
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSaved(!saved)}
            className={`p-2 rounded-xl border transition-all ${
              saved
                ? 'bg-[#e5eeff] text-[#3525cd] border-[#3525cd]'
                : 'bg-white text-[#464555] border-[#c7c4d8]/60 hover:bg-[#eff4ff]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: opportunity.title, text: opportunity.overview, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Job link copied to clipboard!');
              }
            }}
            className="p-2 rounded-xl bg-white border border-[#c7c4d8]/60 hover:bg-[#eff4ff] text-[#464555]"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Opportunity Card */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(15,23,42,0.04)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div 
              onClick={() => onOpenCompany(opportunity.companyId)}
              className="w-16 h-16 rounded-2xl bg-white border border-[#eceef3] p-2 shrink-0 shadow-xs flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-[#3525cd] transition-all"
            >
              <img
                src={opportunity.companyLogo}
                alt={opportunity.companyName}
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <span className="text-xs font-bold text-[#3525cd] bg-[#eff4ff] px-2.5 py-0.5 rounded-full">
                {opportunity.type}
              </span>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0b1c30] mt-1">
                {opportunity.title}
              </h1>
              <p 
                onClick={() => onOpenCompany(opportunity.companyId)}
                className="text-sm font-semibold text-[#464555] hover:text-[#3525cd] cursor-pointer mt-0.5"
              >
                {opportunity.companyName}
              </p>
            </div>
          </div>

          <button
            onClick={() => onApply(opportunity)}
            className="px-7 py-3.5 bg-[#3525cd] hover:bg-[#1e00a9] text-white font-bold text-sm rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
          >
            <Send className="w-4 h-4" />
            Apply to Role
          </button>
        </div>

        {/* Quick Highlights Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#f8f9ff] rounded-2xl border border-[#e5eeff] text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#3525cd]" />
            <div>
              <p className="text-[#777587]">Location</p>
              <p className="font-semibold text-[#0b1c30]">{opportunity.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#3525cd]" />
            <div>
              <p className="text-[#777587]">Duration</p>
              <p className="font-semibold text-[#0b1c30]">{opportunity.duration}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
            <DollarSign className="w-4 h-4 text-[#3525cd]" />
            <div>
              <p className="text-[#777587]">Stipend / Salary</p>
              <p className="font-bold text-[#0b1c30]">{opportunity.stipend}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Application Process Timeline */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="font-display font-bold text-lg text-[#0b1c30] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#3525cd]" />
          Application Process
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          {opportunity.processSteps.map((step, idx) => (
            <div 
              key={step.step}
              className={`p-4 rounded-2xl border transition-all ${
                step.current 
                  ? 'bg-[#eff4ff] border-[#3525cd] shadow-2xs' 
                  : 'bg-[#f8f9ff] border-[#e5eeff]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  step.current ? 'bg-[#3525cd] text-white' : 'bg-[#e5eeff] text-[#3525cd]'
                }`}>
                  {step.step}
                </span>
                {step.current && (
                  <span className="text-[10px] font-bold text-[#3525cd] bg-white px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-sm text-[#0b1c30]">{step.title}</h3>
              <p className="text-xs text-[#464555] mt-0.5">{step.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Role Overview */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
        <h2 className="font-display font-bold text-lg text-[#0b1c30]">
          Role Overview
        </h2>
        <p className="text-sm text-[#464555] leading-relaxed whitespace-pre-line font-body">
          {opportunity.overview}
        </p>
      </div>

      {/* Requirements: Tech Stack & Core Competencies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Tech Stack */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-display font-bold text-base text-[#0b1c30]">
            Required Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {opportunity.requirements.techStack.map(tech => (
              <span
                key={tech}
                className="px-3.5 py-1.5 bg-[#eff4ff] text-[#3525cd] font-semibold text-xs rounded-xl"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Core Competencies */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-display font-bold text-base text-[#0b1c30]">
            Core Competencies
          </h3>
          <ul className="space-y-2 text-xs text-[#464555]">
            {opportunity.requirements.coreCompetencies.map((comp, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3525cd] shrink-0 mt-0.5" />
                <span>{comp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="font-display font-bold text-lg text-[#0b1c30]">
          Internship Benefits & Growth
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {opportunity.benefits.map((b, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#e5eeff] space-y-1">
              <h3 className="font-display font-bold text-sm text-[#0b1c30]">{b.title}</h3>
              <p className="text-xs text-[#464555]">{b.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hiring Manager & Team */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={opportunity.hiringManager.avatar}
            alt={opportunity.hiringManager.name}
            className="w-14 h-14 rounded-2xl object-cover border border-[#c7c4d8]"
          />
          <div>
            <span className="text-[11px] font-semibold text-[#777587]">Hiring Manager</span>
            <h3 className="font-display font-bold text-base text-[#0b1c30]">
              {opportunity.hiringManager.name}
            </h3>
            <p className="text-xs text-[#464555]">{opportunity.hiringManager.role}</p>
          </div>
        </div>

        <button
          onClick={() => onConnectManager(opportunity.hiringManager.name)}
          className="px-5 py-2.5 rounded-xl bg-white border border-[#c7c4d8]/70 hover:bg-[#eff4ff] text-[#0b1c30] text-xs font-semibold transition-colors flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4 text-[#3525cd]" />
          Message Sarah
        </button>
      </div>

      {/* Bottom Sticky Apply Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md border border-[#c7c4d8]/60 p-4 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
          <p className="font-display font-bold text-sm text-[#0b1c30]">{opportunity.title}</p>
          <p className="text-xs text-[#777587]">{opportunity.companyName} • {opportunity.stipend}</p>
        </div>

        <button
          onClick={() => onApply(opportunity)}
          className="px-6 py-2.5 bg-[#3525cd] hover:bg-[#1e00a9] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Apply Now
        </button>
      </div>
    </div>
  );
};
