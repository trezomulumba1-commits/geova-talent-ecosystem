import React, { useState } from 'react';
import { LibraryResource, PrepView, Student } from '../../types';
import { 
  BookOpen, 
  CheckCircle2, 
  Search, 
  Filter, 
  Clock, 
  Check, 
  ChevronRight, 
  Building2, 
  Layers, 
  HelpCircle,
  Video,
  Play
} from 'lucide-react';

interface ResourceLibraryViewProps {
  currentUser: Student;
  resources: LibraryResource[];
  onToggleResourceComplete: (resourceId: string) => void;
  onNavigatePrep: (view: PrepView) => void;
}

export const ResourceLibraryView: React.FC<ResourceLibraryViewProps> = ({
  currentUser,
  resources,
  onToggleResourceComplete,
  onNavigatePrep
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'technical' | 'behavioral' | 'company'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<LibraryResource | null>(null);

  // Calculate readiness percentage dynamically from completed resources
  const completedCount = resources.filter(r => r.completed).length;
  const progressPercent = Math.round((completedCount / resources.length) * 100);

  const filteredResources = resources.filter(r => {
    const matchesTab = activeTab === 'all' || r.section === activeTab;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const technicalResources = filteredResources.filter(r => r.section === 'technical');
  const behavioralResources = filteredResources.filter(r => r.section === 'behavioral');
  const companyResources = filteredResources.filter(r => r.section === 'company');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(15,23,42,0.04)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#3525cd] bg-[#eff4ff] px-3 py-1 rounded-full inline-block">
              Study Hub & Rubrics
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0b1c30]">
              Master Your Craft
            </h1>
            <p className="text-sm text-[#464555] leading-relaxed">
              Curated preparation guides, algorithms, system design teardowns, and interview rubrics.
            </p>
          </div>

          {/* Dynamic Preparation Readiness Gauge (Screen 15 Match) */}
          <div className="bg-[#f8f9ff] border border-[#e5eeff] p-5 rounded-2xl min-w-[220px] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#464555]">Preparation Readiness</span>
              <span className="font-bold text-[#3525cd]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#eceef3] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#3525cd] h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-[#777587] text-right">
              {completedCount} of {resources.length} completed
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-t border-[#eceef3] pt-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-[#3525cd] text-white'
                : 'bg-[#f8f9ff] text-[#464555] hover:bg-[#eff4ff]'
            }`}
          >
            All Resources ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab('technical')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'technical'
                ? 'bg-[#3525cd] text-white'
                : 'bg-[#f8f9ff] text-[#464555] hover:bg-[#eff4ff]'
            }`}
          >
            Technical Fundamentals
          </button>
          <button
            onClick={() => setActiveTab('behavioral')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'behavioral'
                ? 'bg-[#3525cd] text-white'
                : 'bg-[#f8f9ff] text-[#464555] hover:bg-[#eff4ff]'
            }`}
          >
            Behavioral Strategies
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'company'
                ? 'bg-[#3525cd] text-white'
                : 'bg-[#f8f9ff] text-[#464555] hover:bg-[#eff4ff]'
            }`}
          >
            Company Guides
          </button>
        </div>
      </div>

      {/* Section 1: Technical Fundamentals (Card Grid Match Screen 15) */}
      {(activeTab === 'all' || activeTab === 'technical') && technicalResources.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-[#0b1c30]">
            Technical Fundamentals
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {technicalResources.map(item => (
              <div
                key={item.id}
                className="bg-white border border-[#c7c4d8]/60 rounded-2xl overflow-hidden p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-[#eff4ff] relative">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs text-[#3525cd] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-sm text-[#0b1c30] group-hover:text-[#3525cd] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#777587] mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.duration}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#eceef3] mt-3 flex items-center justify-between">
                  <button
                    onClick={() => onToggleResourceComplete(item.id)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                      item.completed
                        ? 'bg-[#e8f5e9] text-[#2e7d32]'
                        : 'bg-[#f8f9ff] text-[#464555] hover:bg-[#e5eeff]'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${item.completed ? 'text-[#2e7d32]' : 'text-[#777587]'}`} />
                    {item.completed ? 'Completed' : 'Mark Done'}
                  </button>

                  <button
                    onClick={() => setSelectedArticle(item)}
                    className="text-xs font-bold text-[#3525cd] hover:underline"
                  >
                    Read →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Behavioral Strategies (Row List Match Screen 15) */}
      {(activeTab === 'all' || activeTab === 'behavioral') && behavioralResources.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-[#0b1c30]">
            Behavioral Strategies
          </h2>

          <div className="space-y-3">
            {behavioralResources.map(item => (
              <div
                key={item.id}
                className="bg-white border border-[#c7c4d8]/60 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4 hover:border-[#3525cd]/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#3525cd] flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#0b1c30]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#777587] mt-0.5">{item.duration} • {item.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleResourceComplete(item.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
                      item.completed
                        ? 'bg-[#e8f5e9] text-[#2e7d32]'
                        : 'bg-[#f8f9ff] text-[#464555] hover:bg-[#e5eeff]'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${item.completed ? 'text-[#2e7d32]' : 'text-[#777587]'}`} />
                    {item.completed ? 'Completed' : 'Mark Done'}
                  </button>

                  <button
                    onClick={() => setSelectedArticle(item)}
                    className="p-2 rounded-xl bg-[#eff4ff] text-[#3525cd] hover:bg-[#3525cd] hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Company Guides (Screen 15 Match: Google, Meta Guides) */}
      {(activeTab === 'all' || activeTab === 'company') && companyResources.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-[#0b1c30]">
            Company Guides & Rubrics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {companyResources.map(item => (
              <div
                key={item.id}
                className="bg-white border border-[#c7c4d8]/60 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#3525cd] text-white flex items-center justify-center font-display font-bold text-xl shrink-0">
                    {item.companyInitial}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#0b1c30]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#777587] mt-0.5">{item.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleResourceComplete(item.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      item.completed
                        ? 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]'
                        : 'bg-white text-[#777587] border-[#c7c4d8]/60 hover:bg-[#f8f9ff]'
                    }`}
                    title={item.completed ? 'Completed' : 'Mark as read'}
                  >
                    <Check className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setSelectedArticle(item)}
                    className="px-3.5 py-1.5 bg-[#eff4ff] text-[#3525cd] hover:bg-[#3525cd] hover:text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Read Guide
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Article Detail Reading Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#3525cd] bg-[#eff4ff] px-3 py-1 rounded-full">
                  {selectedArticle.category}
                </span>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0b1c30] mt-2">
                  {selectedArticle.title}
                </h2>
                <p className="text-xs text-[#777587] mt-1">{selectedArticle.duration}</p>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 text-[#777587] hover:text-[#0b1c30] rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-[#f8f9ff] rounded-2xl border border-[#e5eeff] text-sm text-[#464555] leading-relaxed">
              <p className="font-medium text-[#0b1c30] mb-2">Key Core Takeaways:</p>
              <p>{selectedArticle.contentSnippet}</p>
              <p className="mt-3 text-xs text-[#777587]">
                Remember to practice applying these frameworks in the Technical Practice Arena to evaluate your real-time response clarity and keyword hit rate.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#eceef3]">
              <button
                onClick={() => {
                  onToggleResourceComplete(selectedArticle.id);
                  setSelectedArticle(null);
                }}
                className="px-5 py-2.5 bg-[#e8f5e9] text-[#2e7d32] font-bold text-xs rounded-xl"
              >
                ✓ {selectedArticle.completed ? 'Mark Incomplete' : 'Complete & Earn Score'}
              </button>

              <button
                onClick={() => {
                  setSelectedArticle(null);
                  onNavigatePrep('arena');
                }}
                className="px-5 py-2.5 bg-[#3525cd] text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Practice in Arena →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
