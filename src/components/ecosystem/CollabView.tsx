import React, { useState } from 'react';
import { CollabPost, Student } from '../../types';
import { 
  Users, 
  Search, 
  Plus, 
  MessageSquare, 
  Check, 
  Heart,
  Share2
} from 'lucide-react';

interface CollabViewProps {
  collabs: CollabPost[];
  currentUser: Student;
  onToggleInterest: (collabId: string) => void;
  onOpenCreateCollab: () => void;
  onConnectAuthor: (authorName: string) => void;
}

export const CollabView: React.FC<CollabViewProps> = ({
  collabs,
  currentUser,
  onToggleInterest,
  onOpenCreateCollab,
  onConnectAuthor
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('All');

  const phases = ['All', 'Ideation', 'Prototyping', 'Growth'];

  const filteredCollabs = collabs.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedPhase === 'All') return matchesSearch;
    return matchesSearch && c.phase.toLowerCase().includes(selectedPhase.toLowerCase());
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Post CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0b1c30]">
            Find people to build with
          </h1>
          <p className="text-sm text-[#464555] mt-1">
            Connect with technical co-founders, UI designers, and AI engineers across university campuses.
          </p>
        </div>

        <button
          onClick={onOpenCreateCollab}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#3525cd] hover:bg-[#1e00a9] text-white text-xs font-bold rounded-2xl shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Post Collab Request
        </button>
      </div>

      {/* Search & Phase Pills */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777587]" />
          <input
            type="text"
            placeholder="Search projects, roles, or authors..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#c7c4d8]/60 focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#0b1c30] placeholder-[#777587] outline-hidden shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {phases.map(p => (
            <button
              key={p}
              onClick={() => setSelectedPhase(p)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedPhase === p
                  ? 'bg-[#3525cd] text-white'
                  : 'bg-white border border-[#c7c4d8]/60 text-[#464555] hover:bg-[#eff4ff]'
              }`}
            >
              {p} {p !== 'All' ? 'Phase' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Collab Feed Cards */}
      <div className="space-y-4">
        {filteredCollabs.map(collab => (
          <div
            key={collab.id}
            className="bg-white border border-[#c7c4d8]/60 rounded-3xl p-6 shadow-[0_2px_14px_rgba(15,23,42,0.03)] hover:shadow-md transition-all space-y-4"
          >
            {/* Header: Author & Phase */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={collab.authorAvatar}
                  alt={collab.authorName}
                  className="w-12 h-12 rounded-2xl object-cover border border-[#eceef3] shadow-xs"
                />
                <div>
                  <h3 className="font-display font-bold text-base text-[#0b1c30]">
                    {collab.authorName}
                  </h3>
                  <span className="inline-block text-[11px] font-semibold text-[#3525cd] bg-[#e5eeff] px-2.5 py-0.5 rounded-full mt-0.5">
                    {collab.phase}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleInterest(collab.id)}
                  className={`text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                    collab.userInterested
                      ? 'bg-[#3525cd] text-white shadow-xs'
                      : 'bg-[#eff4ff] text-[#3525cd] hover:bg-[#3525cd] hover:text-white'
                  }`}
                >
                  {collab.userInterested ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Interested
                    </>
                  ) : (
                    "I'm Interested"
                  )}
                </button>

                <button
                  onClick={() => onConnectAuthor(collab.authorName)}
                  className="p-2 rounded-xl bg-white border border-[#c7c4d8]/60 hover:bg-[#f8f9ff] text-[#464555] transition-colors"
                  title="Message Author"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title & Body */}
            <div>
              <h2 className="font-display font-bold text-lg text-[#0b1c30]">
                {collab.title}
              </h2>
              <p className="text-sm text-[#464555] mt-1 leading-relaxed font-body">
                {collab.description}
              </p>
            </div>

            {/* Tags & Stats */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#eceef3]">
              <div className="flex flex-wrap gap-1.5">
                {collab.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs font-semibold bg-[#f8f9ff] text-[#3525cd] border border-[#e5eeff] px-3 py-1 rounded-xl"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-[#777587]">
                <Users className="w-3.5 h-3.5 text-[#3525cd]" />
                <span><strong>{collab.interestedCount}</strong> students interested</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
