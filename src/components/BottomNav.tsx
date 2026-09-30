import React, { useState } from 'react';
import { AppMode, EcosystemView, PrepView } from '../types';
import { VectorDrawIcon } from './common/VectorDrawIcon';

interface BottomNavProps {
  mode: AppMode;
  ecosystemView: EcosystemView;
  onSelectEcosystemView: (view: EcosystemView) => void;
  prepView: PrepView;
  onSelectPrepView: (view: PrepView) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  mode,
  ecosystemView,
  onSelectEcosystemView,
  prepView,
  onSelectPrepView
}) => {
  const [animTrigger, setAnimTrigger] = useState(0);

  const handleTap = (action: () => void) => {
    setAnimTrigger(prev => prev + 1);
    action();
  };

  if (mode === 'prep') {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-2 pb-safe bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 shadow-md">
        {/* Hub */}
        <button
          onClick={() => handleTap(() => onSelectPrepView('hub'))}
          className={`flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
            prepView === 'hub'
              ? 'bg-black text-white dark:bg-white dark:text-black -translate-y-1 shadow-md font-bold'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <VectorDrawIcon 
            name="hub" 
            size="xs" 
            badge={false} 
            active={prepView === 'hub'}
            triggerKey={`bottom-hub-${prepView}-${animTrigger}`}
            className="mb-0.5"
          />
          <span className="text-[11px] font-semibold">Hub</span>
        </button>

        {/* Arena */}
        <button
          onClick={() => handleTap(() => onSelectPrepView('arena'))}
          className={`flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
            prepView === 'arena'
              ? 'bg-black text-white dark:bg-white dark:text-black -translate-y-1 shadow-md font-bold'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <VectorDrawIcon 
            name="arena" 
            size="xs" 
            badge={false} 
            active={prepView === 'arena'}
            triggerKey={`bottom-arena-${prepView}-${animTrigger}`}
            className="mb-0.5"
          />
          <span className="text-[11px] font-semibold">Arena</span>
        </button>

        {/* Library */}
        <button
          onClick={() => handleTap(() => onSelectPrepView('library'))}
          className={`flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
            prepView === 'library'
              ? 'bg-black text-white dark:bg-white dark:text-black -translate-y-1 shadow-md font-bold'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <VectorDrawIcon 
            name="library" 
            size="xs" 
            badge={false} 
            active={prepView === 'library'}
            triggerKey={`bottom-library-${prepView}-${animTrigger}`}
            className="mb-0.5"
          />
          <span className="text-[11px] font-semibold">Library</span>
        </button>

        {/* Review */}
        <button
          onClick={() => handleTap(() => onSelectPrepView('review'))}
          className={`flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
            prepView === 'review'
              ? 'bg-black text-white dark:bg-white dark:text-black -translate-y-1 shadow-md font-bold'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <VectorDrawIcon 
            name="review" 
            size="xs" 
            badge={false} 
            active={prepView === 'review'}
            triggerKey={`bottom-review-${prepView}-${animTrigger}`}
            className="mb-0.5"
          />
          <span className="text-[11px] font-semibold">Review</span>
        </button>
      </nav>
    );
  }

  // Ecosystem Mode
  const isHomeActive = ecosystemView === 'home' || ecosystemView === 'landing';
  const isDiscoverActive = ecosystemView.startsWith('discover') || ecosystemView === 'project-detail' || ecosystemView === 'company-profile' || ecosystemView === 'opportunity-detail';
  const isCollabActive = ecosystemView === 'collab';
  const isProfileActive = ecosystemView === 'student-profile';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-2 pb-safe bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 shadow-md">
      {/* Home */}
      <button
        onClick={() => handleTap(() => onSelectEcosystemView('home'))}
        className={`flex flex-col items-center justify-center px-3.5 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
          isHomeActive
            ? 'bg-black text-white dark:bg-white dark:text-black -translate-y-1 shadow-md font-bold'
            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`}
      >
        <VectorDrawIcon 
          name="home" 
          size="xs" 
          badge={false} 
          active={isHomeActive}
          triggerKey={`bottom-home-${ecosystemView}-${animTrigger}`}
          className="mb-0.5"
        />
        <span className="text-[11px] font-semibold">Home</span>
      </button>

      {/* Discover */}
      <button
        onClick={() => handleTap(() => onSelectEcosystemView('discover-projects'))}
        className={`flex flex-col items-center justify-center px-3.5 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
          isDiscoverActive
            ? 'bg-black text-white dark:bg-white dark:text-black -translate-y-1 shadow-md font-bold'
            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`}
      >
        <VectorDrawIcon 
          name="discover" 
          size="xs" 
          badge={false} 
          active={isDiscoverActive}
          triggerKey={`bottom-discover-${ecosystemView}-${animTrigger}`}
          className="mb-0.5"
        />
        <span className="text-[11px] font-semibold">Discover</span>
      </button>

      {/* Collab */}
      <button
        onClick={() => handleTap(() => onSelectEcosystemView('collab'))}
        className={`flex flex-col items-center justify-center px-3.5 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
          isCollabActive
            ? 'bg-black text-white dark:bg-white dark:text-black -translate-y-1 shadow-md font-bold'
            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`}
      >
        <VectorDrawIcon 
          name="collab" 
          size="xs" 
          badge={false} 
          active={isCollabActive}
          triggerKey={`bottom-collab-${ecosystemView}-${animTrigger}`}
          className="mb-0.5"
        />
        <span className="text-[11px] font-semibold">Collab</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => handleTap(() => onSelectEcosystemView('student-profile'))}
        className={`flex flex-col items-center justify-center px-3.5 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
          isProfileActive
            ? 'bg-black text-white dark:bg-white dark:text-black -translate-y-1 shadow-md font-bold'
            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`}
      >
        <VectorDrawIcon 
          name="profile" 
          size="xs" 
          badge={false} 
          active={isProfileActive}
          triggerKey={`bottom-profile-${ecosystemView}-${animTrigger}`}
          className="mb-0.5"
        />
        <span className="text-[11px] font-semibold">Profile</span>
      </button>
    </nav>
  );
};

