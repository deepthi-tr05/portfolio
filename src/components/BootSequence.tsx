import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from './ui/Typewriter';

const modules = [
  "Identity Agent",
  "Skill Analysis Agent",
  "Project Intelligence Agent",
  "Research Agent",
  "Communication Agent"
];

export const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [activeModule, setActiveModule] = useState(-1);

  useEffect(() => {
    if (activeModule < modules.length) {
      const timer = setTimeout(() => {
        setActiveModule(prev => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(onComplete, 800);
      return () => clearTimeout(finalTimer);
    }
  }, [activeModule, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center font-mono">
      <div className="max-w-md w-full px-10">
        <div className="mb-8 border-l-2 border-primary pl-4">
          <Typewriter 
            text="INITIALIZING DEEPTHI.AI..." 
            delay={40} 
            className="text-primary text-xl font-bold tracking-widest"
          />
        </div>
        
        <div className="space-y-3">
          {modules.map((module, idx) => (
            <motion.div
              key={module}
              initial={{ opacity: 0, x: -10 }}
              animate={activeModule >= idx ? { opacity: 1, x: 0 } : {}}
              className="flex items-center gap-3 text-sm"
            >
              {activeModule > idx ? (
                <span className="text-primary font-bold">[✓]</span>
              ) : (
                <span className="text-muted animate-pulse">[ ]</span>
              )}
              <span className={activeModule > idx ? "text-white" : "text-muted"}>
                {module}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-12 h-1 bg-white/5 w-full rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
};
