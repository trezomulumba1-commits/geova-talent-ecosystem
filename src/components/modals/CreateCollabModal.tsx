import React, { useState } from 'react';
import { Student } from '../../types';
import { X, Plus } from 'lucide-react';

interface CreateCollabModalProps {
  currentUser: Student;
  onClose: () => void;
  onSubmit: (postData: { title: string; phase: string; description: string; tags: string[] }) => void;
}

export const CreateCollabModal: React.FC<CreateCollabModalProps> = ({
  currentUser,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState('Ideation Phase');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('React, UI/UX, AI/ML');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    onSubmit({
      title,
      phase,
      description,
      tags
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-[#0b1c30]">
              Post Collaboration Request
            </h2>
            <p className="text-xs text-[#464555] mt-0.5">
              Find technical co-founders or design talent for your side project.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#777587] hover:text-[#0b1c30] rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
              Project Title
            </label>
            <input
              type="text"
              placeholder="e.g. Decentralized Health Ledger"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full bg-[#f8f9ff] border border-[#c7c4d8]/60 focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] rounded-xl px-3.5 py-2.5 text-xs text-[#0b1c30] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
              Current Project Phase
            </label>
            <select
              value={phase}
              onChange={e => setPhase(e.target.value)}
              className="w-full bg-[#f8f9ff] border border-[#c7c4d8]/60 focus:border-[#3525cd] rounded-xl px-3.5 py-2.5 text-xs text-[#0b1c30] outline-hidden"
            >
              <option value="Ideation Phase">Ideation Phase</option>
              <option value="Prototyping Phase">Prototyping Phase</option>
              <option value="Growth Phase">Growth Phase</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
              Description & Roles Needed
            </label>
            <textarea
              placeholder="Describe the problem you're solving and what skills you need help with..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              required
              className="w-full bg-[#f8f9ff] border border-[#c7c4d8]/60 focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] rounded-xl p-3 text-xs text-[#0b1c30] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
              Skills / Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, PyTorch"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              className="w-full bg-[#f8f9ff] border border-[#c7c4d8]/60 focus:border-[#3525cd] rounded-xl px-3.5 py-2.5 text-xs text-[#0b1c30] outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eceef3]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-[#464555] hover:bg-[#eceef3] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#3525cd] hover:bg-[#1e00a9] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Publish Collab
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
