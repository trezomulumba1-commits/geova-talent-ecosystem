import React, { useState } from 'react';
import { Company, Opportunity, Project, EcosystemView } from '../../types';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Bookmark, 
  Share2, 
  Briefcase, 
  ArrowLeft, 
  ExternalLink,
  ChevronRight,
  Clock,
  DollarSign
} from 'lucide-react';

interface CompanyProfileViewProps {
  company: Company;
  opportunities: Opportunity[];
  projects: Project[];
  onBack: () => void;
  onOpenOpportunity: (opportunityId: string) => void;
  onOpenProject: (projectId: string) => void;
}

export const CompanyProfileView: React.FC<CompanyProfileViewProps> = ({
  company,
  opportunities,
  projects,
  onBack,
  onOpenOpportunity,
  onOpenProject
}) => {
  const [saved, setSaved] = useState(company.saved || false);

  const companyOpportunities = opportunities.filter(o => o.companyId === company.id || o.companyName.toLowerCase() === company.name.toLowerCase());

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Back & Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#464555] hover:text-[#3525cd] bg-white border border-[#c7c4d8]/60 px-3.5 py-2 rounded-xl transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Discover
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSaved(!saved)}
            className={`p-2 rounded-xl border transition-all ${
              saved
                ? 'bg-[#e5eeff] text-[#3525cd] border-[#3525cd]'
                : 'bg-white text-[#464555] border-[#c7c4d8]/60 hover:bg-[#eff4ff]'
            }`}
            title="Save Company"
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: company.name, text: company.about, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Company link copied!');
              }
            }}
            className="p-2 rounded-xl bg-white border border-[#c7c4d8]/60 hover:bg-[#eff4ff] text-[#464555] transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(15,23,42,0.04)] space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border border-[#eceef3] p-3 shrink-0 shadow-xs flex items-center justify-center">
            <img
              src={company.logo}
              alt={company.name}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0b1c30]">
                {company.name}
              </h1>
              {company.verified && (
                <span className="bg-[#3525cd] text-white p-0.5 rounded-full text-[10px]" title="Verified Enterprise Partner">
                  <CheckCircle2 className="w-4 h-4 fill-[#3525cd] text-white" />
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-[#464555]">
              {company.industry}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-[#777587]">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#3525cd]" /> {company.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#3525cd]" /> Founded {company.founded}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#3525cd]" /> {company.companySize} Employees
              </span>
            </div>
          </div>

          <a
            href={company.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#eff4ff] hover:bg-[#3525cd] text-[#3525cd] hover:text-white text-xs font-bold rounded-xl transition-all shadow-2xs shrink-0"
          >
            <Globe className="w-4 h-4" />
            Website
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* About Company */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
        <h2 className="font-display font-bold text-lg text-[#0b1c30]">
          About {company.name}
        </h2>
        <p className="text-sm text-[#464555] leading-relaxed whitespace-pre-line font-body">
          {company.about}
        </p>
      </div>

      {/* Active Roles / Opportunities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-[#0b1c30] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#3525cd]" />
            Active Opportunities ({companyOpportunities.length})
          </h2>
          <span className="text-xs font-semibold text-[#777587]">Verified Fast-Track Applications</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companyOpportunities.map(opp => (
            <div
              key={opp.id}
              onClick={() => onOpenOpportunity(opp.id)}
              className="bg-white border border-[#c7c4d8]/60 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-display font-bold text-base text-[#0b1c30] group-hover:text-[#3525cd] transition-colors">
                    {opp.title}
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 bg-[#eff4ff] text-[#3525cd] rounded-full shrink-0">
                    {opp.type}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#777587] mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{opp.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{opp.duration}</span>
                  <span className="flex items-center gap-1 font-semibold text-[#0b1c30]"><DollarSign className="w-3 h-3 text-[#3525cd]" />{opp.stipend.split('/')[0]}</span>
                </div>

                <p className="text-xs text-[#464555] line-clamp-2 mb-4 leading-relaxed">
                  {opp.overview}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {opp.tags.map(t => (
                    <span key={t} className="text-[11px] bg-[#f8f9ff] border border-[#e5eeff] text-[#464555] px-2 py-0.5 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#eceef3] flex items-center justify-between text-xs font-bold text-[#3525cd]">
                <span>Fast-track with GEOVA Score</span>
                <span className="group-hover:underline flex items-center gap-1">
                  View Role <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Validated Projects in Company Stack */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display font-bold text-xl text-[#0b1c30]">
          Validated Student Projects in {company.name}'s Technology Domain
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.slice(0, 2).map(proj => (
            <div
              key={proj.id}
              onClick={() => onOpenProject(proj.id)}
              className="bg-white border border-[#c7c4d8]/60 rounded-2xl overflow-hidden p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center gap-4"
            >
              <img
                src={proj.image}
                alt={proj.title}
                className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#eceef3]"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-[#3525cd] bg-[#e5eeff] px-2 py-0.5 rounded-full">
                  {proj.category}
                </span>
                <h4 className="font-display font-bold text-sm text-[#0b1c30] group-hover:text-[#3525cd] truncate mt-1">
                  {proj.title}
                </h4>
                <p className="text-xs text-[#464555] truncate">By {proj.creator.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
