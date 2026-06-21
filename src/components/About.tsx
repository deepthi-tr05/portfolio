import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { User, GraduationCap, Brain, Zap, Fingerprint, ShieldCheck, Cpu } from 'lucide-react';
import { MatrixCard } from './ui/MatrixCard';
import { StatusBadge } from './ui/StatusBadge';

const interests = [
  "Artificial Intelligence", "Machine Learning", 
  "Conversational AI", "Computer Vision", 
  "Intelligent Systems", "Human-AI Interaction"
];

export const About = () => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    if (inView) {
      setIsScanning(true);
      const timer = setTimeout(() => {
        setIsScanning(false);
        setScanComplete(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  return (
    <section id="core" ref={ref} className="py-24 relative overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-[1px] bg-primary/50" />
            <span className="font-mono text-xs text-primary uppercase tracking-[0.5em]">
              IDENTITY_AGENT.exe
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            NEURAL <span className="text-primary glow-text underline decoration-primary/20 underline-offset-8">PROFILE</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT SIDE: AI Scanner Interface */}
          <div className="lg:col-span-5 space-y-6">
            <MatrixCard className="relative aspect-square max-w-[400px] mx-auto lg:mx-0 flex items-center justify-center border-primary/20 bg-foreground/20">
              {/* Scanner Animation Overlay */}
              {isScanning && (
                <motion.div 
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 w-full h-1 bg-primary shadow-[0_0_15px_#00F5FF] z-20"
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-6">
                  <motion.div 
                    animate={isScanning ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Fingerprint size={120} className={scanComplete ? "text-primary transition-colors duration-1000" : "text-primary/30"} />
                  </motion.div>
                  {scanComplete && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-primary text-background p-1 rounded-full shadow-[0_0_10px_#00F5FF]"
                    >
                      <ShieldCheck size={20} />
                    </motion.div>
                  )}
                </div>

                <div className="space-y-4 w-full px-4">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-muted">
                    <span>Scan Progress</span>
                    <span>{scanComplete ? "100%" : isScanning ? "ANALYZING" : "0%"}</span>
                  </div>
                  <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      animate={isScanning ? { width: "100%" } : scanComplete ? { width: "100%" } : { width: "0%" }}
                      transition={{ duration: 2.5 }}
                    />
                  </div>
                  <div className="bg-background/50 border border-white/5 p-3 rounded font-mono text-[10px] text-primary/80">
                    {isScanning ? (
                      <div className="animate-pulse">
                        {">"} ACCESSING_CORE_DATABANK...<br/>
                        {">"} ANALYZING_BIOMETRICS...<br/>
                        {">"} EXTRACTING_EXPERIENCE_NODES...
                      </div>
                    ) : scanComplete ? (
                      <div>
                        {">"} IDENTITY_VERIFIED<br/>
                        {">"} SUBJECT: DEEPTHI T R<br/>
                        {">"} STATUS: OPTIMIZED
                      </div>
                    ) : (
                      <div>{">"} STANDBY_FOR_INPUT...</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Decorative Corner Indicators */}
              <div className="absolute top-4 left-4 border-t border-l border-primary/40 w-4 h-4" />
              <div className="absolute top-4 right-4 border-t border-r border-primary/40 w-4 h-4" />
              <div className="absolute bottom-4 left-4 border-b border-l border-primary/40 w-4 h-4" />
              <div className="absolute bottom-4 right-4 border-b border-r border-primary/40 w-4 h-4" />
            </MatrixCard>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 flex flex-col items-center gap-2">
                <Cpu size={20} className="text-primary/60" />
                <span className="text-[10px] uppercase font-mono text-muted">Core Level</span>
                <span className="text-white font-bold">AIML v4.0</span>
              </div>
              <div className="glass-card p-4 flex flex-col items-center gap-2">
                <Brain size={20} className="text-primary/60" />
                <span className="text-[10px] uppercase font-mono text-muted">Cognition</span>
                <span className="text-white font-bold">Research</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Identity Details */}
          <div className="lg:col-span-7 min-h-[400px]">
            <AnimatePresence>
              {scanComplete && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <StatusBadge label="Authorized Personnel Only" status="active" />
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight">
                      System Subject: Deepthi T R
                    </h3>
                    <p className="text-muted leading-relaxed text-lg font-sans">
                      Aspiring <span className="text-primary font-medium">AIML engineer</span> passionate about building intelligent systems, AI-powered applications, conversational interfaces, and innovative user experiences using machine learning and modern technologies.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary">
                        <GraduationCap size={18} />
                        <h4 className="font-display font-bold uppercase tracking-wider text-xs">Education Node</h4>
                      </div>
                      <div className="pl-6 border-l border-primary/20 space-y-2">
                        <p className="text-white text-sm font-semibold leading-tight">Final Year Engineering</p>
                        <p className="text-muted text-xs">GSSS Institute of Engineering and Technology for Women, Mysuru</p>
                        <p className="text-primary/70 text-[9px] font-mono mt-2 uppercase tracking-widest">Major: Artificial Intelligence & Machine Learning</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary">
                        <Zap size={18} />
                        <h4 className="font-display font-bold uppercase tracking-wider text-xs">Focus Sectors</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((item) => (
                          <span 
                            key={item}
                            className="text-[9px] px-2 py-1 bg-primary/5 border border-primary/20 rounded-md text-primary/80 uppercase tracking-tighter"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <MatrixCard className="bg-foreground/10 border-white/5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/5 rounded-lg text-primary border border-primary/10">
                        <User size={20} />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-white font-display font-bold text-xs uppercase tracking-widest">Objective Synthesis</h4>
                        <p className="text-muted text-sm leading-relaxed font-sans italic">
                          "Driven by the intersection of high-performance computing and human-centric design. Currently optimizing conversational intelligence and vision-based automation systems."
                        </p>
                      </div>
                    </div>
                  </MatrixCard>
                </motion.div>
              )}
            </AnimatePresence>
            
            {!scanComplete && !isScanning && (
              <div className="flex items-center justify-center h-full border border-dashed border-white/10 rounded-xl">
                <p className="text-muted font-mono text-xs animate-pulse">
                  AWAITING_IDENTITY_SCAN...
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
