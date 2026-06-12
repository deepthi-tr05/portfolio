import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  BrainCircuit, 
  Eye, 
  MessageSquare, 
  Box, 
  Cpu, 
  Microscope, 
  FlaskConical, 
  Layers,
  Sparkles,
  SearchCode
} from 'lucide-react';
import { MatrixCard } from './ui/MatrixCard';

const focusAreas = [
  { title: "Computer Vision", icon: Eye },
  { title: "Deep Learning", icon: BrainCircuit },
  { title: "CNN Research", icon: Layers },
  { title: "Conversational AI", icon: MessageSquare },
  { title: "AI Visualization", icon: Sparkles },
  { title: "VR + AI Systems", icon: Box },
  { title: "Intelligent UI", icon: SearchCode },
  { title: "Human-AI Interaction", icon: Cpu },
];

export const ExperimentalAILab = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [isInitializing, setIsInitializing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (inView) {
      setIsInitializing(true);
      const timer = setTimeout(() => {
        setIsInitializing(false);
        setIsReady(true);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  return (
    <section id="lab" ref={ref} className="py-24 relative overflow-hidden bg-background scroll-mt-20">
      {/* Background Neural Network Simulation Decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col mb-16 items-center text-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-[1px] bg-primary/50" />
            <span className="font-mono text-xs text-primary uppercase tracking-[0.5em]">
              EXPERIMENTAL_AI_LAB
            </span>
            <div className="w-12 h-[1px] bg-primary/50" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-tight">
            NEURAL <span className="text-primary glow-text">LABORATORY</span>
          </h2>
          <p className="text-muted mt-4 max-w-xl font-sans">
            Exploring the frontiers of deep learning and human-computer interaction through experimental prototypes and research modules.
          </p>
        </div>

        <AnimatePresence>
          {isInitializing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 py-12"
            >
              <FlaskConical size={48} className="text-primary animate-bounce" />
              <div className="space-y-2 text-center">
                <p className="font-mono text-primary text-sm uppercase tracking-[0.3em]">Calibrating Research Instruments...</p>
                <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5 }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isReady && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Featured VR Lab Section */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-12"
            >
              <MatrixCard className="bg-primary/5 border-primary/20 p-8 flex flex-col lg:flex-row gap-12 items-center relative group">
                <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-primary/40">EXPERIMENT_ID: VR-CNN-V1</div>
                
                <div className="lg:w-1/3 relative">
                  <div className="relative z-10 p-12 glass-card rounded-full border-primary/40 bg-background/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                    <Box size={80} className="text-primary group-hover:rotate-12 transition-transform" />
                    {/* Floating Pulse */}
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 bg-primary rounded-full"
                    />
                  </div>
                </div>

                <div className="lg:w-2/3 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-[10px] text-primary font-mono uppercase">
                    Featured Research
                  </div>
                  <h3 className="text-3xl font-display font-bold text-white tracking-tighter">CNN Visualization in Virtual Reality</h3>
                  <p className="text-muted leading-relaxed font-sans">
                    An experimental immersive environment designed to help users understand deep learning workflows and CNN operations through interactive VR visualization. This project bridges the gap between abstract mathematical concepts and tangible spatial interaction.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {["Unity", "C#", "Deep Learning", "Spatial UI"].map(tag => (
                      <span key={tag} className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-primary/60 uppercase tracking-widest">{tag}</span>
                    ))}
                  </div>
                </div>
              </MatrixCard>
            </motion.div>

            {/* Grid of Research Modules */}
            <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {focusAreas.map((area, idx) => (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <MatrixCard className="flex flex-col items-center justify-center py-8 group hover:bg-primary/5 cursor-crosshair">
                    <area.icon size={24} className="text-primary/40 group-hover:text-primary transition-colors mb-4 group-hover:scale-110 duration-300" />
                    <h4 className="text-center font-display font-bold text-xs uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">{area.title}</h4>
                    <div className="absolute top-2 right-2 text-primary/10 group-hover:text-primary/30 transition-colors">
                      <Microscope size={12} />
                    </div>
                  </MatrixCard>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
