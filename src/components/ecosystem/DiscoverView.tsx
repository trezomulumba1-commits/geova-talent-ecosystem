import React, { useState } from 'react';
import { Student, Project, Company, Opportunity, EcosystemView } from '../../types';
import { GeovaLogo } from '../GeovaLogo';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Users, 
  Briefcase, 
  Building2, 
  Code2, 
  ExternalLink,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';

interface DiscoverViewProps {
  initialTab?: 'students' | 'projects' | 'companies' | 'opportunities';
  students: Student[];
  projects: Project[];
  companies: Company[];
  opportunities: Opportunity[];
  onOpenStudent: (studentId: string) => void;
  onOpenProject: (projectId: string) => void;
  onOpenCompany: (companyId: string) => void;
  onOpenOpportunity: (opportunityId: string) => void;
  onConnectStudent: (student: Student) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  initialTab = 'projects',
  students,
  projects,
  companies,
  opportunities,
  onOpenStudent,
  onOpenProject,
  onOpenCompany,
  onOpenOpportunity,
  onConnectStudent
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'projects' | 'companies' | 'opportunities'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Filter lists based on tab
  const getFilterOptions = () => {
    switch (activeTab) {
      case 'students':
        return ['All', 'Frontend', 'Product Designer', 'Full-stack', 'Data Scientist', 'Growth'];
      case 'projects':
        return ['All', 'Web', 'Mobile', 'AI/ML', 'Validated'];
      case 'companies':
        return ['All', 'Artificial Intelligence', 'Financial Services', 'Healthtech', 'Verified'];
      case 'opportunities':
        return ['All', 'Internship', 'Full-time', 'Remote'];
    }
  };

  const filterOptions = getFilterOptions();

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.skills.some(sk => sk.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedFilter === 'All') return matchesSearch;
    return matchesSearch && (s.role.toLowerCase().includes(selectedFilter.toLowerCase()) || s.skills.some(sk => sk.toLowerCase().includes(selectedFilter.toLowerCase())));
  });

  // Filtered Projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedFilter === 'All') return matchesSearch;
    if (selectedFilter === 'Validated') return matchesSearch && p.status === 'Validated';
    return matchesSearch && (p.category === selectedFilter || p.tags.some(t => t.toLowerCase().includes(selectedFilter.toLowerCase())));
  });

  // Filtered Companies
  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'All') return matchesSearch;
    if (selectedFilter === 'Verified') return matchesSearch && c.verified;
    return matchesSearch && c.industry.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  // Filtered Opportunities
  const filteredOpportunities = opportunities.filter(o => {
    const matchesSearch = o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedFilter === 'All') return matchesSearch;
    if (selectedFilter === 'Remote') return matchesSearch && o.location.toLowerCase().includes('remote');
    return matchesSearch && o.type === selectedFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0b1c30]">
          Discover Ecosystem
        </h1>
        <p className="text-sm text-[#464555] mt-1">
          Explore validated student builders, shipped projects, top tech companies, and active hiring opportunities.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-[#c7c4d8]/40 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => { setActiveTab('projects'); setSelectedFilter('All'); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'projects'
              ? 'bg-[#3525cd] text-white shadow-xs'
              : 'text-[#464555] hover:bg-[#e5eeff]/60'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Projects ({projects.length})
        </button>

        <button
          onClick={() => { setActiveTab('students'); setSelectedFilter('All'); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'students'
              ? 'bg-[#3525cd] text-white shadow-xs'
              : 'text-[#464555] hover:bg-[#e5eeff]/60'
          }`}
        >
          <Users className="w-4 h-4" />
          Students / Talent ({students.length})
        </button>

        <button
          onClick={() => { setActiveTab('companies'); setSelectedFilter('All'); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'companies'
              ? 'bg-[#3525cd] text-white shadow-xs'
              : 'text-[#464555] hover:bg-[#e5eeff]/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Companies ({companies.length})
        </button>

        <button
          onClick={() => { setActiveTab('opportunities'); setSelectedFilter('All'); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'opportunities'
              ? 'bg-[#3525cd] text-white shadow-xs'
              : 'text-[#464555] hover:bg-[#e5eeff]/60'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Opportunities ({opportunities.length})
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777587]" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#c7c4d8]/60 focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#0b1c30] placeholder-[#777587] outline-hidden shadow-2xs transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {filterOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setSelectedFilter(opt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === opt
                  ? 'bg-[#3525cd] text-white'
                  : 'bg-white border border-[#c7c4d8]/50 text-[#464555] hover:bg-[#eff4ff]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              onClick={() => onOpenProject(project.id)}
              className="bg-white border border-[#c7c4d8]/60 rounded-2xl overflow-hidden p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-44 rounded-xl overflow-hidden mb-4 bg-[#eff4ff] relative border border-[#e5eeff]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-[#0b1c30] text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1.5 border border-[#c7c4d8]/40">
                    <GeovaLogo size="xs" />
                    <span>{project.status}</span>
                  </div>
                  <span className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {project.category}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-[#0b1c30] group-hover:text-[#3525cd] transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-[#464555] mt-1 mb-4 line-clamp-2 leading-relaxed">
                  {project.tagline}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.slice(0, 4).map(t => (
                    <span key={t} className="text-[11px] bg-[#eff4ff] text-[#3525cd] font-medium px-2 py-0.5 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#eceef3]">
                <div className="flex items-center gap-2">
                  <img
                    src={project.creator.avatar}
                    alt={project.creator.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#c7c4d8]"
                  />
                  <span className="text-xs font-semibold text-[#0b1c30]">{project.creator.name}</span>
                </div>
                <span className="text-xs font-bold text-[#3525cd] group-hover:underline">
                  View Specs →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: STUDENTS / TALENT */}
      {activeTab === 'students' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <div
              key={student.id}
              className="bg-white border border-[#c7c4d8]/60 rounded-2xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#eceef3]"
                      />
                      {student.verified && (
                        <CheckCircle2 className="w-4 h-4 text-[#3525cd] bg-white rounded-full absolute -bottom-1 -right-1" />
                      )}
                    </div>
                    <div>
                      <h3 
                        onClick={() => onOpenStudent(student.id)}
                        className="font-display font-bold text-base text-[#0b1c30] hover:text-[#3525cd] cursor-pointer"
                      >
                        {student.name}
                      </h3>
                      <p className="text-xs text-[#464555] font-medium">{student.role}</p>
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                        student.available ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#eceef3] text-[#777587]'
                      }`}>
                        {student.statusText || (student.available ? 'Available' : 'Busy')}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#464555] line-clamp-3 mb-4 leading-relaxed">
                  {student.about}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {student.skills.slice(0, 5).map(skill => (
                    <span key={skill} className="text-[11px] bg-[#f8f9ff] border border-[#e5eeff] text-[#464555] px-2 py-0.5 rounded-md font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#eceef3]">
                <button
                  onClick={() => onOpenStudent(student.id)}
                  className="flex-1 text-center py-2 rounded-xl bg-[#eff4ff] text-[#3525cd] hover:bg-[#3525cd] hover:text-white text-xs font-semibold transition-all"
                >
                  View Profile
                </button>
                <button
                  onClick={() => onConnectStudent(student)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#c7c4d8]/70 hover:bg-[#f8f9ff] text-[#0b1c30] text-xs font-semibold transition-colors"
                >
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: COMPANIES */}
      {activeTab === 'companies' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map(company => (
            <div
              key={company.id}
              onClick={() => onOpenCompany(company.id)}
              className="bg-white border border-[#c7c4d8]/60 rounded-2xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-[#eceef3] p-1.5 shrink-0 shadow-xs flex items-center justify-center">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-bold text-base text-[#0b1c30] group-hover:text-[#3525cd] transition-colors">
                        {company.name}
                      </h3>
                      {company.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3525cd]" />
                      )}
                    </div>
                    <p className="text-xs text-[#464555] font-medium">{company.industry}</p>
                    <p className="text-[11px] text-[#777587] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {company.location}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#464555] line-clamp-3 mb-4 leading-relaxed">
                  {company.about}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#eceef3] text-xs">
                <span className="font-semibold text-[#3525cd] bg-[#e5eeff] px-2.5 py-0.5 rounded-full">
                  {company.activeRolesCount} Active Roles
                </span>
                <span className="font-bold text-[#0b1c30] group-hover:text-[#3525cd] flex items-center gap-1">
                  Company Specs →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: OPPORTUNITIES */}
      {activeTab === 'opportunities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOpportunities.map(opp => (
            <div
              key={opp.id}
              onClick={() => onOpenOpportunity(opp.id)}
              className="bg-white border border-[#c7c4d8]/60 rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={opp.companyLogo}
                      alt={opp.companyName}
                      className="w-12 h-12 rounded-xl object-contain border border-[#eceef3] p-1 shadow-2xs"
                    />
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#0b1c30] group-hover:text-[#3525cd] transition-colors">
                        {opp.title}
                      </h3>
                      <p className="text-xs text-[#464555] font-medium">{opp.companyName}</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 bg-[#eff4ff] text-[#3525cd] rounded-full shrink-0">
                    {opp.type}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-[#f8f9ff] rounded-xl mb-4 text-xs text-[#464555] border border-[#e5eeff]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#777587]" />
                    <span className="truncate">{opp.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#777587]" />
                    <span className="truncate">{opp.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-[#0b1c30]">
                    <DollarSign className="w-3.5 h-3.5 text-[#3525cd]" />
                    <span className="truncate">{opp.stipend.split('/')[0]}</span>
                  </div>
                </div>

                <p className="text-xs text-[#464555] line-clamp-2 mb-4 leading-relaxed">
                  {opp.overview}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {opp.tags.map(tag => (
                    <span key={tag} className="text-[11px] bg-white border border-[#c7c4d8]/60 text-[#464555] px-2 py-0.5 rounded-md font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#eceef3]">
                <div className="flex items-center gap-2">
                  <img
                    src={opp.hiringManager.avatar}
                    alt={opp.hiringManager.name}
                    className="w-6 h-6 rounded-full object-cover border border-[#c7c4d8]"
                  />
                  <span className="text-xs text-[#464555]">Hiring: <strong className="text-[#0b1c30]">{opp.hiringManager.name}</strong></span>
                </div>
                <span className="text-xs font-bold text-[#3525cd] group-hover:underline">
                  Apply Now →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
