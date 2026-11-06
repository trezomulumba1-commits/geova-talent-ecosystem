import React, { useState } from 'react';
import { X, Briefcase, Plus, CheckCircle2 } from 'lucide-react';
import { Opportunity } from '../../types';

interface PostOpportunityModalProps {
  companyName: string;
  companyLogo?: string;
  onClose: () => void;
  onSubmit: (oppData: {
    title: string;
    type: string;
    location: string;
    stipend: string;
    tags: string[];
    overview: string;
  }) => Promise<void>;
}

export const PostOpportunityModal: React.FC<PostOpportunityModalProps> = ({
  companyName,
  companyLogo,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Internship');
  const [location, setLocation] = useState('Remote');
  const [stipend, setStipend] = useState('$4,500 / month');
  const [tagsStr, setTagsStr] = useState('Python, React, PostgreSQL');
  const [overview, setOverview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Job title is required.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const tags = tagsStr
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      await onSubmit({
        title,
        type,
        location,
        stipend,
        tags,
        overview: overview || `Opportunity with ${companyName} focusing on practical system development.`,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      setError(err.message || 'Failed to post opportunity to database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 text-zinc-900 dark:text-zinc-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-zinc-900 dark:text-white">
                Post New Opportunity
              </h2>
              <p className="text-xs text-zinc-500">Live database posting for {companyName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">Opportunity Published!</h3>
            <p className="text-xs text-zinc-500">Saved directly to live SQLite database.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-900/50 text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Role Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Distributed Systems Intern"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 text-sm focus:outline-none"
                >
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Remote / City"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Stipend / Salary</label>
                <input
                  type="text"
                  value={stipend}
                  onChange={e => setStipend(e.target.value)}
                  placeholder="e.g. $5,000 / month"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Key Tech Tags</label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={e => setTagsStr(e.target.value)}
                  placeholder="Comma separated"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">Overview</label>
              <textarea
                rows={3}
                value={overview}
                onChange={e => setOverview(e.target.value)}
                placeholder="Describe responsibilities and what candidate will build..."
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Saving to Database...' : 'Publish to Ecosystem'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
