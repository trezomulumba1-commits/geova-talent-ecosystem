import React, { useState } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Plus, 
  Search, 
  Filter, 
  Tag, 
  Sparkles,
  Send,
  User
} from 'lucide-react';
import { Student } from '../../types';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  role: string;
  category: 'System Design' | 'Interview Debrief' | 'Career Advice' | 'Project Feedback';
  upvotes: number;
  repliesCount: number;
  timeAgo: string;
  tags: string[];
}

interface CommunityForumViewProps {
  currentUser: Student;
}

export const CommunityForumView: React.FC<CommunityForumViewProps> = ({ currentUser }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'System Design' | 'Interview Debrief' | 'Career Advice' | 'Project Feedback'>('System Design');

  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: 'p-1',
      title: 'Google L5 System Design Interview Experience & Key Takeaways (2026)',
      content: 'Just finished my on-site round for L5 Full Stack. They focused heavily on multi-region database sharding with consistency trade-offs (CAP theorem in practice) and rate-limiting sliding windows in Redis. Here is my exact approach...',
      author: 'Alex Mwansa',
      authorAvatar: currentUser.avatar,
      role: 'Full-Stack Lead',
      category: 'Interview Debrief',
      upvotes: 48,
      repliesCount: 14,
      timeAgo: '2 hours ago',
      tags: ['System Design', 'Google', 'Distributed Systems']
    },
    {
      id: 'p-2',
      title: 'How do you handle JWT revocation cleanly in microservices architecture?',
      content: 'Looking for best practices when dealing with short-lived access tokens vs refresh tokens stored in secure httpOnly cookies. Is Redis blacklist better or public key verification with short expiration?',
      author: 'Marcus Chen',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      role: 'AI / ML Engineer',
      category: 'System Design',
      upvotes: 32,
      repliesCount: 9,
      timeAgo: '5 hours ago',
      tags: ['Security', 'Backend', 'JWT']
    },
    {
      id: 'p-3',
      title: 'Feedback requested: Open source Tailwind component library for dashboards',
      content: 'We built a set of high-density financial and project management components. Would love the community to test the keyboard navigation and contrast accessibility.',
      author: 'Elena Rodriguez',
      authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      role: 'UI/UX Designer',
      category: 'Project Feedback',
      upvotes: 27,
      repliesCount: 6,
      timeAgo: '1 day ago',
      tags: ['React', 'Tailwind', 'Open Source']
    }
  ]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: ForumPost = {
      id: `p-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      role: currentUser.role,
      category: newCategory,
      upvotes: 1,
      repliesCount: 0,
      timeAgo: 'Just now',
      tags: [newCategory]
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowNewPostModal(false);
  };

  const categories = ['All', 'System Design', 'Interview Debrief', 'Career Advice', 'Project Feedback'];

  const filteredPosts = posts.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            Community Q&A & Interview Debriefs
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100">
            Engineering Peer Discussions
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Ask technical questions, share real-world interview debriefs, and get peer code reviews from elite engineering students and mentors.
          </p>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold rounded-2xl shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Start Discussion
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-3xl shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs hover:border-indigo-500/40 transition-all space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{post.author}</h4>
                  <span className="text-xs text-zinc-500">{post.role} • {post.timeAgo}</span>
                </div>
              </div>

              <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-full">
                {post.category}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 transition-colors cursor-pointer">
                {post.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {post.content}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="text-[11px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2.5 py-1 rounded-lg">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    setPosts(posts.map(p => p.id === post.id ? { ...p, upvotes: p.upvotes + 1 } : p));
                  }}
                  className="flex items-center gap-1.5 font-semibold text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.upvotes} Upvotes</span>
                </button>

                <div className="flex items-center gap-1.5 text-zinc-500">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.repliesCount} Replies</span>
                </div>
              </div>

              <button className="flex items-center gap-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Discussion Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">
                Start a New Discussion
              </h3>
              <button 
                onClick={() => setShowNewPostModal(false)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-indigo-600"
                >
                  <option value="System Design">System Design</option>
                  <option value="Interview Debrief">Interview Debrief</option>
                  <option value="Career Advice">Career Advice</option>
                  <option value="Project Feedback">Project Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Discussion Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tips for passing Meta E5 architecture round"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Content & Details
                </label>
                <textarea
                  rows={4}
                  placeholder="Share your question, experience, or project link..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3.5 text-sm text-zinc-900 dark:text-zinc-100 outline-hidden focus:border-indigo-600 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  Publish Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
