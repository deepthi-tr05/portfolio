import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Code2, 
  Layers, 
  Database, 
  BrainCircuit, 
  Terminal, 
  Wrench,
  Zap,
  Activity
} from 'lucide-react';
import { MatrixCard } from './ui/MatrixCard';

const skillCategories = [
  {
    title: "AI & Machine Learning",
    icon: BrainCircuit,
    color: "text-primary",
    skills: ["TensorFlow", "Keras", "CNN"]
  },
  {
    title: "Programming",
    icon: Terminal,
    color: "text-blue-400",
    skills: ["Java", "C", "Python"]
  },
  {
    title: "Frontend Development",
    icon: Layers,
    color: "text-cyan-400",
    skills: ["HTML", "CSS", "JavaScript"]
  },
  {
    title: "Backend Development",
    icon: Code2,
    color: "text-indigo-400",
    skills: ["PHP", "Flask"]
  },
  {
    title: "Databases",
    icon: Database,
    color: "text-emerald-400",
    skills: ["SQL", "MongoDB"]
  },
  {
    title: "Tools & Platforms",
    icon: Wrench,
    color: "text-purple-400",
    skills: ["Git", "GitHub", "Unity", "C#"]
  }
];

export const Skills = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  useEffect(() => {
    if (inView) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  return (
    <section id="skills" ref={ref} className="py-24 relative overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-[1px] bg-primary/50" />
            <span className="font-mono text-xs text-primary uppercase tracking-[0.5em]">
              SKILL_ANALYSIS_AGENT
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            CAPABILITY <span className="text-primary glow-text underline decoration-primary/20 underline-offset-8">MATRIX</span>
          </h2>
        </div>

        {/* Analysis Status Bar */}
        <div className="mb-12 max-w-2xl">
          <div className="glass-card bg-primary/5 border-primary/20 p-4 font-mono text-xs">
            <div className="flex items-center gap-3 mb-3">
              <Activity size={14} className={isAnalyzing ? "animate-pulse text-primary" : "text-primary"} />
              <span className="text-muted uppercase tracking-widest">System Status:</span>
              <span className={analysisComplete ? "text-primary" : "text-yellow-500"}>
                {isAnalyzing ? "ANALYZING_CAPABILITIES..." : analysisComplete ? "ANALYSIS_COMPLETE" : "WAITING_FOR_SCROLL..."}
              </span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary shadow-[0_0_10px_#00F5FF]"
                initial={{ width: "0%" }}
                animate={isAnalyzing ? { width: "100%" } : analysisComplete ? { width: "100%" } : { width: "0%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {analysisComplete && skillCategories.map((category, idx) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <MatrixCard className="h-full group hover:border-primary/40 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-lg bg-white/5 border border-white/10 group-hover:border-primary/30 transition-colors ${category.color}`}>
                      <category.icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-display font-bold text-sm uppercase tracking-wider">
                        {category.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <div 
                            key={dot} 
                            className={`w-1 h-1 rounded-full ${dot <= 4 ? 'bg-primary/60' : 'bg-white/10'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <div 
                        key={skill}
                        className="relative px-3 py-1.5 rounded bg-foreground/50 border border-white/5 overflow-hidden group/skill"
                      >
                        <span className="relative z-10 text-xs text-muted group-hover/skill:text-primary transition-colors font-mono">
                          {skill}
                        </span>
                        <motion.div 
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 bg-primary/10 -skew-x-12"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Decorative Scan Line on Hover */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity">
                    <div className="w-full h-1 bg-primary animate-scan" />
                  </div>
                  
                  {/* Category Code Label */}
                  <div className="absolute top-4 right-4 text-[8px] font-mono text-white/10 group-hover:text-primary/20 transition-colors">
                    MOD_0{idx + 1}
                  </div>
                </MatrixCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Call to Action Module */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="mt-16 flex justify-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 glass-card border-primary/20 bg-primary/5">
            <Zap size={16} className="text-primary animate-pulse" />
            <span className="text-[10px] font-mono text-muted uppercase tracking-[0.2em]">
              Ready to deploy technical intelligence to your next project
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
