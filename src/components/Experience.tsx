import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Briefcase, 
  Calendar, 
  Terminal, 
  Activity, 
  CheckCircle2,
  History
} from 'lucide-react';
import { MatrixCard } from './ui/MatrixCard';

const experiences = [
  {
    company: "HLT Software Solutions, Tumakuru",
    role: "Software Engineer Intern",
    duration: "Jan 2024 – Mar 2024",
    summary: [
      "Developed frontend components using Angular and Ionic frameworks",
      "Contributed to real-time applications and UI feature implementation",
      "Assisted in debugging, optimization, and usability improvements",
      "Collaborated on 'CMD Project', 'Learner App', and 'Borrow App'"
    ],
    status: "DEPLOYED_SUCCESS"
  }
];

export const Experience = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [isSyncing, setIsSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (inView) {
      setIsSyncing(true);
      const timer = setTimeout(() => {
        setIsSyncing(false);
        setSynced(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  return (
    <section id="experience" ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-[1px] bg-primary/50" />
            <span className="font-mono text-xs text-primary uppercase tracking-[0.5em]">
              DEPLOYMENT_HISTORY
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
            OPERATIONAL <span className="text-primary glow-text underline decoration-primary/20 underline-offset-8">TIMELINE</span>
          </h2>
        </div>

        {/* Sync Status Overlay */}
        <AnimatePresence>
          {isSyncing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-12 flex items-center gap-4 bg-primary/5 border border-primary/20 p-4 rounded-lg max-w-md"
            >
              <History size={20} className="text-primary animate-spin" />
              <div className="font-mono text-xs">
                <p className="text-primary">SYNCING_PROFESSIONAL_RECORDS...</p>
                <p className="text-muted text-[10px]">LOCAL_NODE: MYSURU-01 // REMOTE_NODE: TUMAKURU-02</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary/50 via-primary/10 to-transparent transform md:-translate-x-1/2" />

          {synced && experiences.map((exp, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className={`relative mb-12 flex flex-col md:flex-row items-center justify-between w-full ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Timeline Node */}
              <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary shadow-[0_0_10px_#00F5FF] z-10 transform md:-translate-x-1/2 md:translate-y-0" />

              {/* Card Container */}
              <div className="w-full md:w-[45%] ml-8 md:ml-0">
                <MatrixCard className="hover:border-primary/40 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-primary/10 rounded border border-primary/20 text-primary">
                      <Briefcase size={18} />
                    </div>
                    <span className="text-[10px] font-mono text-primary/60 border border-primary/20 px-2 py-0.5 rounded">
                      {exp.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors">
                    {exp.role}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted mb-6 mt-2 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Terminal size={12} className="text-primary/50" />
                      {exp.company}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-primary/50" />
                      {exp.duration}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {exp.summary.map((point, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-muted leading-relaxed group-hover:text-white/80 transition-colors">
                        <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary shadow-sm" />
                        <p>{point}</p>
                      </div>
                    ))}
                  </div>

                  {/* Activity Indicator */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity size={12} className="text-green-500 animate-pulse" />
                      <span className="text-[8px] font-mono uppercase text-muted tracking-widest">System Latency: 12ms</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-primary" />
                      <span className="text-[8px] font-mono uppercase text-primary tracking-widest">Verified</span>
                    </div>
                  </div>
                </MatrixCard>
              </div>

              {/* Empty Space for the other side on desktop */}
              <div className="hidden md:block w-[45%]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
