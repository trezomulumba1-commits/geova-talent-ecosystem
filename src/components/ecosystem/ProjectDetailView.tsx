import React, { useState } from 'react';
import { Project, Student } from '../../types';
import { GeovaLogo } from '../GeovaLogo';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ExternalLink, 
  Github, 
  Award, 
  Code2, 
  Layers, 
  Wrench, 
  Share2, 
  Bookmark,
  ChevronRight
} from 'lucide-react';

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onOpenCreator: (creatorName: string) => void;
  onConnectCreator: (creatorName: string) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onBack,
  onOpenCreator,
  onConnectCreator
}) => {
  const [saved, setSaved] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const allImages = [project.image, ...project.gallery];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Back and Actions */}
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
            title="Save Project"
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: project.title, text: project.tagline, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Project link copied to clipboard!');
              }
            }}
            className="p-2 rounded-xl bg-white border border-[#c7c4d8]/60 hover:bg-[#eff4ff] text-[#464555] transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(15,23,42,0.04)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#eff4ff] text-[#0b1c30] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-[#c7c4d8]/60">
                <GeovaLogo size="xs" />
                {project.status} Project
              </span>
              <span className="bg-[#eff4ff] text-[#3525cd] px-3 py-1 rounded-full text-xs font-semibold">
                {project.category}
              </span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0b1c30] tracking-tight">
              {project.title}
            </h1>

            <p className="text-sm sm:text-base text-[#464555] leading-relaxed">
              {project.tagline}
            </p>
          </div>

          {/* Quick CTA Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#3525cd] hover:bg-[#1e00a9] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[#c7c4d8]/70 hover:bg-[#eff4ff] text-[#0b1c30] text-xs font-semibold rounded-xl transition-colors"
              >
                <Github className="w-4 h-4" />
                View Code
              </a>
            )}
          </div>
        </div>

        {/* Creator Info Bar */}
        <div className="flex items-center justify-between p-4 bg-[#f8f9ff] rounded-2xl border border-[#e5eeff]">
          <div className="flex items-center gap-3">
            <img
              src={project.creator.avatar}
              alt={project.creator.name}
              className="w-12 h-12 rounded-xl object-cover border border-[#c7c4d8]"
            />
            <div>
              <p className="font-display font-bold text-sm text-[#0b1c30]">
                {project.creator.name}
              </p>
              <p className="text-xs text-[#464555]">{project.creator.role}</p>
            </div>
          </div>

          <button
            onClick={() => onConnectCreator(project.creator.name)}
            className="px-4 py-2 bg-[#3525cd] hover:bg-[#1e00a9] text-white text-xs font-semibold rounded-xl transition-all"
          >
            Connect with Creator
          </button>
        </div>
      </div>

      {/* Visual Gallery / Hero Image Showcase */}
      <div className="space-y-3">
        <div className="w-full h-72 sm:h-96 rounded-3xl overflow-hidden bg-black/5 border border-[#c7c4d8]/60 relative shadow-sm">
          <img
            src={allImages[activeImageIndex] || project.image}
            alt={`${project.title} Preview`}
            className="w-full h-full object-cover"
          />
        </div>

        {allImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  activeImageIndex === idx
                    ? 'border-[#3525cd] ring-2 ring-[#3525cd]/30 scale-105'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Structured Details: Problem, Solution, Contribution, Features, Tech Stack */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left 8 Cols: Narrative Breakdown */}
        <div className="md:col-span-8 space-y-6">
          {/* Problem Statement */}
          <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 shadow-xs space-y-2">
            <h2 className="font-display font-bold text-lg text-[#0b1c30] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]" />
              The Problem
            </h2>
            <p className="text-sm text-[#464555] leading-relaxed">
              {project.problem}
            </p>
          </div>

          {/* Solution */}
          <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 shadow-xs space-y-2">
            <h2 className="font-display font-bold text-lg text-[#0b1c30] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2e7d32]" />
              The Solution
            </h2>
            <p className="text-sm text-[#464555] leading-relaxed">
              {project.solution}
            </p>
          </div>

          {/* Key Features */}
          <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 shadow-xs space-y-3">
            <h2 className="font-display font-bold text-lg text-[#0b1c30]">
              Key Functional Features
            </h2>
            <ul className="space-y-2">
              {project.keyFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#464555]">
                  <CheckCircle2 className="w-4 h-4 text-[#3525cd] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Individual Contribution & Architecture */}
          <div className="bg-[#f0efff] border border-[#d7dff9] rounded-3xl p-6 space-y-2">
            <h2 className="font-display font-bold text-base text-[#1e00a9] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#3525cd]" />
              Individual Technical Contribution
            </h2>
            <p className="text-xs text-[#0b1c30] leading-relaxed font-medium">
              {project.contribution}
            </p>
          </div>
        </div>

        {/* Right 4 Cols: Tech Stack & Verification */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-base text-[#0b1c30] flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#3525cd]" />
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map(tech => (
                <span
                  key={tech}
                  className="px-3 py-1.5 bg-[#f8f9ff] border border-[#e5eeff] text-[#0b1c30] text-xs font-semibold rounded-xl"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Verification Badge Box */}
          <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#2e7d32] font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              GEOVA Code Verification
            </div>
            <p className="text-xs text-[#464555] leading-relaxed">
              This project's repository commits, architectural patterns, and live deployment have been benchmarked and verified by the GEOVA evaluation pipeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
