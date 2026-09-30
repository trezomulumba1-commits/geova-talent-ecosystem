import React, { useState } from 'react';
import { Student, Project, EcosystemView } from '../../types';
import { GeovaLogo } from '../GeovaLogo';
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Github, 
  Linkedin, 
  Globe, 
  Share2, 
  MessageSquare, 
  Plus, 
  ExternalLink,
  ChevronRight,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { ResumeReportModal } from '../modals/ResumeReportModal';

interface StudentProfileViewProps {
  student: Student;
  projects: Project[];
  onOpenProject: (projectId: string) => void;
  onConnectStudent: (student: Student) => void;
  onNavigate: (view: EcosystemView) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  projects,
  onOpenProject,
  onConnectStudent,
  onNavigate
}) => {
  const [connected, setConnected] = useState(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);

  const studentProjects = student.projects || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Card Header */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(15,23,42,0.04)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-white shadow-md"
              />
              {student.verified && (
                <div className="absolute -bottom-1 -right-1 bg-[#0b1c30] text-white p-1.5 rounded-full shadow-xs border-2 border-white flex items-center justify-center">
                  <GeovaLogo size="xs" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0b1c30]">
                  {student.name}
                </h1>
              </div>

              <p className="text-sm font-semibold text-[#464555]">
                {student.title}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-[#777587]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> San Francisco / Remote
                </span>
                <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full ${
                  student.available ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#eceef3] text-[#777587]'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {student.statusText || (student.available ? 'Available for opportunities' : 'Busy')}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-col gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setShowTranscriptModal(true)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#eff4ff] hover:bg-[#d7dff9] text-[#3525cd] border border-[#d7dff9] transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              Verified Transcript
            </button>

            <div className="flex gap-2 w-full">
              <button
                onClick={() => {
                  setConnected(!connected);
                  onConnectStudent(student);
                }}
                className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                  connected
                    ? 'bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]'
                    : 'bg-[#3525cd] hover:bg-[#1e00a9] text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                {connected ? 'Connected' : 'Connect'}
              </button>

              <button
                onClick={() => onConnectStudent(student)}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-xs bg-white border border-[#c7c4d8]/70 hover:bg-[#eff4ff] text-[#0b1c30] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#464555]" />
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        {student.links && (
          <div className="flex items-center gap-4 pt-4 border-t border-[#eceef3] text-xs font-semibold text-[#464555]">
            {student.links.github && (
              <a
                href={student.links.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-[#3525cd] transition-colors"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
            )}
            {student.links.linkedin && (
              <a
                href={student.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-[#3525cd] transition-colors"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
            {student.links.website && (
              <a
                href={student.links.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-[#3525cd] transition-colors"
              >
                <Globe className="w-4 h-4" /> Portfolio
              </a>
            )}
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
        <h2 className="font-display font-bold text-lg text-[#0b1c30]">
          About
        </h2>
        <p className="text-sm text-[#464555] leading-relaxed font-body">
          {student.about}
        </p>
      </div>

      {/* Skills Section */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="font-display font-bold text-lg text-[#0b1c30]">
          Skills & Technical Expertise
        </h2>
        <div className="flex flex-wrap gap-2">
          {student.skills.map(skill => (
            <span
              key={skill}
              className="px-4 py-2 bg-[#eff4ff] text-[#3525cd] font-semibold text-xs rounded-xl border border-[#d7dff9]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Projects Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-[#0b1c30]">
            Projects ({studentProjects.length > 0 ? studentProjects.length : student.projectsCount})
          </h2>
          <button
            onClick={() => onNavigate('discover-projects')}
            className="text-xs font-bold text-[#3525cd] hover:underline"
          >
            Explore all in Ecosystem →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {studentProjects.length > 0 ? (
            studentProjects.map(proj => (
              <div
                key={proj.id}
                onClick={() => onOpenProject(proj.id)}
                className="bg-white border border-[#c7c4d8]/60 rounded-2xl overflow-hidden p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-40 rounded-xl overflow-hidden mb-3 bg-[#eff4ff]">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#3525cd] bg-[#e5eeff] px-2 py-0.5 rounded-full">
                    {proj.type}
                  </span>
                  <h3 className="font-display font-bold text-base text-[#0b1c30] group-hover:text-[#3525cd] transition-colors mt-1.5">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-[#464555] line-clamp-2 mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#eceef3] mt-3 flex items-center justify-between text-xs">
                  <span className="text-[#777587]">Verified Codebase</span>
                  <span className="text-[#3525cd] font-bold group-hover:underline">View Details →</span>
                </div>
              </div>
            ))
          ) : (
            projects.slice(0, 2).map(proj => (
              <div
                key={proj.id}
                onClick={() => onOpenProject(proj.id)}
                className="bg-white border border-[#c7c4d8]/60 rounded-2xl overflow-hidden p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-full h-40 rounded-xl overflow-hidden mb-3 bg-[#eff4ff]">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-display font-bold text-base text-[#0b1c30] group-hover:text-[#3525cd]">
                  {proj.title}
                </h3>
                <p className="text-xs text-[#464555] line-clamp-2 mt-1">
                  {proj.tagline}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Official Verified Candidate Transcript Modal */}
      {showTranscriptModal && (
        <ResumeReportModal
          currentUser={student}
          onClose={() => setShowTranscriptModal(false)}
        />
      )}
    </div>
  );
};
