import React from 'react';
import { EcosystemView } from '../../types';
import { GeovaLogo } from '../GeovaLogo';
import { VectorDrawIcon } from '../common/VectorDrawIcon';
import { 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Sparkles,
  Award,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingViewProps {
  onNavigate: (view: EcosystemView) => void;
  onOpenProject: (projectId: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, onOpenProject }) => {
  const [stepTriggers, setStepTriggers] = React.useState([0, 0, 0, 0]);

  const handleViewportEnter = (index: number) => {
    setStepTriggers(prev => {
      const next = [...prev];
      next[index] += 1;
      return next;
    });
  };
  return (
    <div className="w-full pb-16">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 md:px-8 py-12 md:py-16 flex flex-col items-center text-center max-w-5xl mx-auto">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 group cursor-pointer"
        >
          <GeovaLogo size="xl" className="group-hover:scale-105 transition-transform" />
        </motion.div>

        <motion.div 
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border border-[#c7c4d8]/40 shadow-xs"
        >
          <VectorDrawIcon name="zap" size="sm" badge={false} strokeColor="#3525cd" className="w-4 h-4" />
          <span>The Next-Gen Student Engineering & Talent Network</span>
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-zinc-900 dark:text-zinc-100 tracking-tight max-w-3xl leading-[1.15] mb-4"
        >
          Show what you're capable of.
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-body text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mb-8 leading-relaxed"
        >
          GEOVA helps students showcase verified skills, build high-impact projects, connect with peer collaborators, and get discovered by top engineering teams.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <button 
            onClick={() => onNavigate('home')}
            className="bg-indigo-600 dark:bg-indigo-500 hover:bg-[#1e00a9] text-white font-semibold text-sm px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Create Your Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => onNavigate('discover-projects')}
            className="bg-transparent border-[1.5px] border-[#777587]/60 hover:border-[#3525cd] text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:text-indigo-400 font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-indigo-50 dark:bg-indigo-950/60 transition-all active:scale-95 duration-150 cursor-pointer"
          >
            Explore Talent
          </button>
        </motion.div>

        {/* Hero Visual Card (Bento) */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="mt-12 w-full max-w-3xl grid grid-cols-1 md:grid-cols-12 gap-4 text-left"
        >
          {/* Main Featured Project Preview */}
          <div 
            onClick={() => onOpenProject('ai-task-manager')}
            className="md:col-span-8 bg-white border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
          >
            <div className="w-full h-48 sm:h-52 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative border border-[#e5eeff]">
              <img 
                src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80" 
                alt="SprintSync Task Engine Dashboard" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-[#0b1c30]/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                <GeovaLogo size="xs" />
                <span>Verified Project</span>
              </div>
            </div>

            <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:text-indigo-400 transition-colors">
              SprintSync Task Engine
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">React, Node.js, Python</p>
            
            <div className="flex items-center gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <div className="w-10 h-10 rounded-full bg-[#4f46e5] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                JD
              </div>
              <div>
                <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-none">Jane Doe</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">Full Stack Developer</p>
              </div>
            </div>
          </div>

          {/* Side Metrics Bento Column with Scroll Line Icon */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="bg-white border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)] flex-1 flex flex-col justify-center items-center text-center">
              <VectorDrawIcon name="trending" size="lg" badgeTheme="indigo" delay={0.1} className="mb-2" />
              <h4 className="font-display font-bold text-2xl text-zinc-900 dark:text-zinc-100">Top 5%</h4>
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Frontend Skills Ranking</p>
            </div>

            <div className="bg-white border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)] flex-1 flex flex-wrap gap-2 content-center justify-center">
              <span className="px-3 py-1 bg-indigo-600 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-xs rounded-full">React</span>
              <span className="px-3 py-1 bg-indigo-600 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-xs rounded-full">TypeScript</span>
              <span className="px-3 py-1 bg-indigo-600 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-xs rounded-full">Figma</span>
              <span className="px-3 py-1 bg-indigo-600 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-xs rounded-full">Node.js</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How it Works Section with Scroll Line-Drawing Vector Icons */}
      <section className="px-4 sm:px-6 md:px-8 py-16 bg-white border-y border-[#c7c4d8]/40">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100 mb-2">
              How it Works
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Four deliberate steps to validate, showcase, and get hired.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1: Build */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              onViewportEnter={() => handleViewportEnter(0)}
              whileHover={{ y: -8, scale: 1.02, boxShadow: '0 12px 30px rgba(53,37,205,0.1)' }}
              whileTap={{ scale: 0.98 }}
              viewport={{ once: false, margin: '-20px' }}
              transition={{ duration: 8.0, ease: [0.25, 1, 0.5, 1], delay: 0.5 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 dark:bg-zinc-900/60 border border-[#e5eeff] dark:border-zinc-800 hover:border-[#3525cd]/40 dark:hover:border-indigo-500/40 transition-all cursor-pointer group"
            >
              <VectorDrawIcon name="build" size="xl" badgeTheme="indigo" delay={1.5} triggerKey={stepTriggers[0]} className="mb-4" />
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100 dark:text-zinc-100 mb-2 group-hover:text-indigo-600 dark:text-indigo-400 dark:group-hover:text-indigo-400 transition-colors">
                1. Build
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-400 leading-relaxed">
                Work on real-world projects and develop your practical architectural skills.
              </p>
            </motion.div>

            {/* Step 2: Showcase */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              onViewportEnter={() => handleViewportEnter(1)}
              whileHover={{ y: -8, scale: 1.02, boxShadow: '0 12px 30px rgba(53,37,205,0.1)' }}
              whileTap={{ scale: 0.98 }}
              viewport={{ once: false, margin: '-20px' }}
              transition={{ duration: 8.0, ease: [0.25, 1, 0.5, 1], delay: 2.5 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 dark:bg-zinc-900/60 border border-[#e5eeff] dark:border-zinc-800 hover:border-[#3525cd]/40 dark:hover:border-indigo-500/40 transition-all cursor-pointer group"
            >
              <VectorDrawIcon name="showcase" size="xl" badgeTheme="indigo" delay={3.0} triggerKey={stepTriggers[1]} className="mb-4" />
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100 dark:text-zinc-100 mb-2 group-hover:text-indigo-600 dark:text-indigo-400 dark:group-hover:text-indigo-400 transition-colors">
                2. Showcase
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-400 leading-relaxed">
                Upload verified evidence of your code, design, and metrics to a live portfolio.
              </p>
            </motion.div>

            {/* Step 3: Connect */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              onViewportEnter={() => handleViewportEnter(2)}
              whileHover={{ y: -8, scale: 1.02, boxShadow: '0 12px 30px rgba(53,37,205,0.1)' }}
              whileTap={{ scale: 0.98 }}
              viewport={{ once: false, margin: '-20px' }}
              transition={{ duration: 8.0, ease: [0.25, 1, 0.5, 1], delay: 4.5 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 dark:bg-zinc-900/60 border border-[#e5eeff] dark:border-zinc-800 hover:border-[#3525cd]/40 dark:hover:border-indigo-500/40 transition-all cursor-pointer group"
            >
              <VectorDrawIcon name="connect" size="xl" badgeTheme="indigo" delay={5.0} triggerKey={stepTriggers[2]} className="mb-4" />
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100 dark:text-zinc-100 mb-2 group-hover:text-indigo-600 dark:text-indigo-400 dark:group-hover:text-indigo-400 transition-colors">
                3. Connect
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-400 leading-relaxed">
                Find co-founders, peer reviewers, and build your vetted professional network.
              </p>
            </motion.div>

            {/* Step 4: Get Discovered */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              onViewportEnter={() => handleViewportEnter(3)}
              whileHover={{ y: -8, scale: 1.02, boxShadow: '0 12px 30px rgba(53,37,205,0.1)' }}
              whileTap={{ scale: 0.98 }}
              viewport={{ once: false, margin: '-20px' }}
              transition={{ duration: 8.0, ease: [0.25, 1, 0.5, 1], delay: 6.5 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 dark:bg-zinc-900/60 border border-[#e5eeff] dark:border-zinc-800 hover:border-[#3525cd]/40 dark:hover:border-indigo-500/40 transition-all cursor-pointer group"
            >
              <VectorDrawIcon name="discover" size="xl" badgeTheme="indigo" delay={7.0} triggerKey={stepTriggers[3]} className="mb-4" />
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100 dark:text-zinc-100 mb-2 group-hover:text-indigo-600 dark:text-indigo-400 dark:group-hover:text-indigo-400 transition-colors">
                4. Get Discovered
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-400 leading-relaxed">
                Let tech companies find you based on verified technical and behavioral capabilities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Footer with Animated Logo */}
      <footer className="mt-16 pt-8 border-t border-[#c7c4d8]/40 max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          <GeovaLogo size="md" />
        </div>
        <div className="flex items-center gap-6">
          <span>Student Engineering Ecosystem</span>
          <span>•</span>
          <span>Verified Skill Benchmarks</span>
          <span>•</span>
          <span>© 2026 GEOVA Inc.</span>
        </div>
      </footer>
    </div>
  );
};


