import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  ExternalLink, 
  Globe,
  Database, 
  MessageSquare, 
  Box, 
  Activity,
  ChevronRight,
  Stethoscope
} from 'lucide-react';
import { MatrixCard } from './ui/MatrixCard';
import { GlowButton } from './ui/GlowButton';

const projects = [
  {
    id: 'brain-tumor',
    title: "Brain Tumor Detection System",
    category: "Medical Vision Intelligence",
    stack: ["Python", "CNN", "TensorFlow", "Keras"],
    description: "AI-powered medical image analysis system for detecting brain tumors from MRI scans using deep learning techniques.",
    features: ["MRI Scan Analysis", "Automated Detection", "Neural Processing"],
    icon: Stethoscope,
    featured: true,
    color: "from-red-500/20 to-primary/20",
    borderColor: "border-red-500/30"
  },
  {
    id: 'hostel-mgmt',
    title: "Hostel Management System",
    category: "Operational Infrastructure",
    stack: ["HTML", "CSS", "JS", "PHP", "MySQL"],
    description: "Smart hostel management system for student registration, room allocation, and hostel operations.",
    features: ["Real-time DB", "Admin Dashboard", "User Portal"],
    icon: Database,
    featured: false,
    color: "from-blue-500/20 to-primary/20",
    borderColor: "border-blue-500/30"
  },
  {
    id: 'ai-chatbot',
    title: "AI Chatbot",
    category: "Conversational Intelligence",
    stack: ["HTML", "CSS", "Flask"],
    description: "AI-powered chatbot supporting voice and text interaction for intelligent communication experiences.",
    features: ["Voice Integration", "NLP Processing", "Responsive UI"],
    icon: MessageSquare,
    featured: false,
    color: "from-indigo-500/20 to-primary/20",
    borderColor: "border-indigo-500/30"
  },
  {
    id: 'vr-cnn',
    title: "CNN Visualization in VR",
    category: "Experimental Research",
    stack: ["Unity", "C#", "CNN", "VR"],
    description: "Interactive VR environment for visualizing CNN operations and deep learning workflows.",
    features: ["Immersive 3D Space", "Workflow Graphics", "Research Lab"],
    icon: Box,
    featured: false,
    color: "from-purple-500/20 to-primary/20",
    borderColor: "border-purple-500/30"
  }
];

export const Projects = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [isBooting, setIsBooting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (inView) {
      setIsBooting(true);
      const timer = setTimeout(() => {
        setIsBooting(false);
        setIsReady(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  return (
    <section id="projects" ref={ref} className="py-24 relative overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-[1px] bg-primary/50" />
            <span className="font-mono text-xs text-primary uppercase tracking-[0.5em]">
              PROJECT_INTELLIGENCE_AGENT
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            CASE <span className="text-primary glow-text underline decoration-primary/20 underline-offset-8">ARCHIVE</span>
          </h2>
        </div>

        {/* Status Log */}
        <div className="mb-12 font-mono text-[10px] text-muted space-y-1 bg-foreground/20 p-4 rounded border border-white/5 max-w-md">
          <div className="flex items-center gap-2">
            <Activity size={10} className="text-primary" />
            <span>AGENT_STATUS: {isReady ? "READY" : isBooting ? "LOADING_ARCHIVES..." : "IDLE"}</span>
          </div>
          {isBooting && <div className="animate-pulse">{">"} FETCHING_ENCRYPTED_CASE_FILES...</div>}
          {isReady && <div className="text-primary/60">{">"} 4 INTELLIGENCE_NODES_DECOYED</div>}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <AnimatePresence>
            {isReady && (
              <>
                {/* Featured Project - Brain Tumor */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="lg:col-span-12"
                >
                  <ProjectCard project={projects[0]} />
                </motion.div>

                {/* Secondary Projects Grid */}
                {projects.slice(1).map((project, idx) => (
                  <motion.div 
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 + 0.2 }}
                    className="lg:col-span-4"
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const getProjectLinks = (id: string) => {
  switch (id) {
    case 'brain-tumor':
      return {
        source: 'https://github.com/deepthi-tr05/brain-tumor-detection',
        demo: 'https://github.com/deepthi-tr05/brain-tumor-detection',
      };
    case 'hostel-mgmt':
      return {
        source: 'https://github.com/deepthi-tr05/Hostel-Management-System-PHP',
        demo: 'https://github.com/deepthi-tr05/Hostel-Management-System-PHP',
      };
    case 'ai-chatbot':
      return {
        source: 'https://github.com/deepthi-tr05/chatbot',
        demo: 'chatbot-trigger',
      };
    case 'vr-cnn':
      return {
        source: '',
        demo: 'under-maintenance',
      };
    default:
      return {
        source: 'https://github.com/deepthi-tr05',
        demo: 'https://github.com/deepthi-tr05',
      };
  }
};

const ProjectCard = ({ project }: { project: typeof projects[0] }) => {
  return (
    <MatrixCard className={`h-full flex flex-col group transition-all duration-500 hover:border-primary/50 ${project.featured ? 'lg:flex-row gap-8 min-h-[400px]' : ''}`}>
      {/* Visual Side */}
      <div className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${project.color} ${project.featured ? 'lg:w-1/2 min-h-[250px]' : 'aspect-video mb-6'} flex items-center justify-center border ${project.borderColor}`}>
        <div className="absolute inset-0 opacity-20 bg-grid-pattern bg-[length:20px_20px]" />
        
        {/* Animated Visual Core */}
        <div className="relative z-10">
          <motion.div
            animate={project.featured ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 10, repeat: Infinity }}
            className="text-primary/40 group-hover:text-primary transition-colors duration-700"
          >
            <project.icon size={project.featured ? 120 : 64} strokeWidth={1} />
          </motion.div>
          {project.featured && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-1 bg-primary/20 animate-scan blur-sm" />
             </div>
          )}
        </div>

        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-2 py-1 rounded bg-background/80 backdrop-blur-md border border-white/10 text-[8px] font-mono text-primary uppercase tracking-widest">
            {project.category}
          </span>
          {project.featured && (
            <span className="px-2 py-1 rounded bg-primary/20 backdrop-blur-md border border-primary/50 text-[8px] font-mono text-white uppercase tracking-widest flex items-center gap-1">
              <Activity size={8} className="animate-pulse" />
              Featured Case
            </span>
          )}
        </div>
      </div>

      {/* Content Side */}
      <div className={`flex-1 flex flex-col ${project.featured ? 'lg:py-4' : ''}`}>
        <div className="flex-1">
          <h3 className={`font-display font-bold text-white group-hover:text-primary transition-colors ${project.featured ? 'text-3xl mb-4' : 'text-xl mb-3'}`}>
            {project.title}
          </h3>
          <p className="text-muted text-sm leading-relaxed mb-6 line-clamp-3">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.stack.map(tech => (
              <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-muted">
                {tech}
              </span>
            ))}
          </div>

          <div className="space-y-2 mb-8">
            {project.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] text-primary/70 font-mono">
                <ChevronRight size={10} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <GlowButton 
            variant="outline" 
            className="flex-1 py-2 text-[10px] flex items-center justify-center gap-2 h-auto disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => {
              const links = getProjectLinks(project.id);
              if (links.source) {
                window.open(links.source, '_blank');
              }
            }}
            disabled={project.id === 'vr-cnn'}
          >
            <Globe size={14} />
            Source
          </GlowButton>
          <GlowButton 
            variant="primary" 
            className="flex-1 py-2 text-[10px] flex items-center justify-center gap-2 h-auto disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => {
              const links = getProjectLinks(project.id);
              if (links.demo === 'chatbot-trigger') {
                window.dispatchEvent(new CustomEvent('open-chat-assistant'));
              } else if (links.demo !== 'under-maintenance') {
                window.open(links.demo, '_blank');
              }
            }}
            disabled={project.id === 'vr-cnn'}
          >
            <ExternalLink size={14} />
            {project.id === 'vr-cnn' ? 'Maintenance' : 'Initialize'}
          </GlowButton>
        </div>
      </div>

      {/* Background Decorative Text */}
      <div className="absolute bottom-4 right-4 text-[8px] font-mono text-white/5 select-none pointer-events-none uppercase">
        REF_{project.id}_CASEFILE
      </div>
    </MatrixCard>
  );
};
