import { motion } from 'framer-motion';
import { Download, Globe, Users, MessageSquare, Cpu, Box, Database, Activity } from 'lucide-react';
import { GlowButton } from './ui/GlowButton';
import { Typewriter } from './ui/Typewriter';
import { links } from '../data/portfolio';

export const Hero = () => {
  return (
    <section className="min-h-[90vh] flex items-center relative overflow-hidden">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Content Area */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="z-10"
        >
          <div className="space-y-2 mb-6">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary font-mono text-sm uppercase tracking-[0.4em] block"
            >
              System Online // Protocol 01
            </motion.span>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tighter leading-none">
              DEEPTHI <span className="text-primary glow-text">T R</span>
            </h1>
            <div className="h-8 flex items-center">
              <Typewriter 
                text="Artificial Intelligence & Machine Learning Engineer"
                className="text-lg md:text-xl text-muted font-mono"
                delay={40}
              />
            </div>
          </div>

          <p className="text-muted text-lg max-w-xl mb-10 leading-relaxed font-sans mt-4">
            Final-year AIML engineering student passionate about 
            <span className="text-white"> AI systems</span>, 
            <span className="text-white"> conversational interfaces</span>, and 
            <span className="text-white"> futuristic human-AI interaction experiences</span>.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <GlowButton variant="primary" className="flex items-center gap-2" onClick={() => window.open('/Resume Deepthi TR.pdf', '_blank')}>
              <Download size={18} />
              Resume
            </GlowButton>
            <div className="flex gap-3">
              <GlowButton variant="outline" className="p-2.5 min-w-0" aria-label="GitHub" onClick={() => window.open(links.github, '_blank')}>
                <Globe size={20} />
              </GlowButton>
              <GlowButton variant="outline" className="p-2.5 min-w-0" aria-label="LinkedIn" onClick={() => window.open(links.linkedin, '_blank')}>
                <Users size={20} />
              </GlowButton>
              <GlowButton variant="outline" className="p-2.5 min-w-0" aria-label="Contact" onClick={() => window.dispatchEvent(new CustomEvent('open-chat-assistant'))}>
                <MessageSquare size={20} />
              </GlowButton>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex items-center gap-6 text-[10px] font-mono text-muted uppercase tracking-widest"
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary shadow-[0_0_5px_#00F5FF]" />
              Mysuru, India
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary shadow-[0_0_5px_#00F5FF]" />
              GSSS Institute
            </div>
          </motion.div>
        </motion.div>

        {/* Right Futuristic AI Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative hidden lg:block"
        >
          {/* Main Visual Core */}
          <div className="relative w-full aspect-square max-w-[500px] mx-auto">
            {/* Spinning Scanner */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-[1px] border-primary/20 rounded-full border-dashed"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 border-[1px] border-primary/10 rounded-full border-dashed"
            />

            {/* Central Node */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -inset-8 bg-primary/20 blur-2xl rounded-full"
                />
                <div className="relative glass-card p-8 rounded-full border-primary/40 flex items-center justify-center">
                  <Cpu size={60} className="text-primary" />
                </div>
              </div>
            </div>

            {/* Floating Data Panels */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 glass-card p-4 border-primary/30"
            >
              <div className="flex items-center gap-3">
                <Activity size={16} className="text-primary" />
                <div className="space-y-1">
                  <div className="w-12 h-1 bg-primary/20 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ["20%", "80%", "40%"] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <div className="text-[8px] font-mono uppercase text-muted">Neural Load</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 left-0 glass-card p-4 border-primary/30"
            >
              <div className="flex items-center gap-3">
                <Database size={16} className="text-blue-400" />
                <div className="text-[8px] font-mono text-white/70 whitespace-pre">
                  DB_CONNECTED: YES{"\n"}
                  LATENCY: 12ms
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-1/2 -right-4 glass-card p-3 border-primary/30"
            >
              <Box size={24} className="text-primary/60" />
            </motion.div>
          </div>
        </motion.div>

      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-muted">Scroll to Scan</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  );
};
