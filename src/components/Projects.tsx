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
  Stethoscope,
  LineChart,
  BrainCircuit,
  BarChart2,
  Binary,
  GitBranch,
  FlaskConical,
  Search,
  Filter
} from 'lucide-react';
import { MatrixCard } from './ui/MatrixCard';
import { GlowButton } from './ui/GlowButton';

const allProjects = [
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
    borderColor: "border-red-500/30",
    githubUrl: "https://github.com/deepthi-tr05/brain-tumor-detection",
    demoUrl: "https://github.com/deepthi-tr05/brain-tumor-detection",
    tag: "AI/ML"
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
    borderColor: "border-blue-500/30",
    githubUrl: "https://github.com/deepthi-tr05/Hostel-Management-System-PHP",
    demoUrl: "https://github.com/deepthi-tr05/Hostel-Management-System-PHP",
    tag: "Web"
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
    borderColor: "border-indigo-500/30",
    githubUrl: "https://github.com/deepthi-tr05/chatbot",
    demoUrl: "chatbot-trigger",
    tag: "AI/ML"
  },
  {
    id: 'iris-pca-viz',
    title: "Iris PCA Visualizer",
    category: "Data Science Visualization",
    stack: ["HTML", "CSS", "JavaScript"],
    description: "Interactive Principal Component Analysis visualizer on the Iris dataset. Explore dimensionality reduction live in the browser.",
    features: ["PCA Projection", "Interactive Charts", "Live Demo"],
    icon: BarChart2,
    featured: false,
    color: "from-teal-500/20 to-primary/20",
    borderColor: "border-teal-500/30",
    githubUrl: "https://github.com/deepthi-tr05/iris-pca-viz",
    demoUrl: "https://iris-pca-viz.vercel.app",
    tag: "Data Science"
  },
  {
    id: 'lwr-visualizer',
    title: "LWR Visualizer",
    category: "ML Algorithm Visualization",
    stack: ["HTML", "CSS", "JavaScript"],
    description: "Interactive Locally Weighted Regression visualizer — paint data points on a canvas and watch the model fit in real time.",
    features: ["Live Canvas Input", "Weighted Regression", "Interactive Demo"],
    icon: LineChart,
    featured: false,
    color: "from-emerald-500/20 to-primary/20",
    borderColor: "border-emerald-500/30",
    githubUrl: "https://github.com/deepthi-tr05/lwr-visualizer",
    demoUrl: "https://lwr-visualizer.vercel.app",
    tag: "Data Science"
  },
  {
    id: 'gaussian-nb',
    title: "Gaussian Naive Bayes",
    category: "ML Classifier Demo",
    stack: ["TypeScript", "React", "Vite"],
    description: "Interactive Gaussian Naive Bayes classifier visualizer demonstrating probabilistic classification with live charts.",
    features: ["Classifier Demo", "Probability Charts", "Real-time Input"],
    icon: BrainCircuit,
    featured: false,
    color: "from-violet-500/20 to-primary/20",
    borderColor: "border-violet-500/30",
    githubUrl: "https://github.com/deepthi-tr05/Gaussian-Naive-Bayes",
    demoUrl: "https://gaussian-naive-bayes.vercel.app",
    tag: "AI/ML"
  },
  {
    id: 'knn-classifier',
    title: "KNN Classifier Visualizer",
    category: "ML Algorithm Visualization",
    stack: ["TypeScript", "React", "Vite"],
    description: "Visual K-Nearest Neighbors classifier explorer with California housing dataset integration and decision boundary rendering.",
    features: ["KNN Boundaries", "Dataset Explorer", "Interactive K"],
    icon: Binary,
    featured: false,
    color: "from-cyan-500/20 to-primary/20",
    borderColor: "border-cyan-500/30",
    githubUrl: "https://github.com/deepthi-tr05/KNN-Classifier-Visualizer",
    demoUrl: "https://fetch-california-housing-matrix-u2f.vercel.app",
    tag: "Data Science"
  },
  {
    id: 'california-housing-matrix',
    title: "California Housing Matrix",
    category: "Data Science Dashboard",
    stack: ["TypeScript", "React", "Recharts"],
    description: "Interactive correlation matrix and feature analysis dashboard for the California housing dataset.",
    features: ["Correlation Matrix", "Feature Heatmap", "Interactive Charts"],
    icon: BarChart2,
    featured: false,
    color: "from-amber-500/20 to-primary/20",
    borderColor: "border-amber-500/30",
    githubUrl: "https://github.com/deepthi-tr05/fetch_california_housing_Matrix",
    demoUrl: "https://fetch-california-housing-matrix-943.vercel.app",
    tag: "Data Science"
  },
  {
    id: 'california-housing',
    title: "California Housing Explorer",
    category: "Data Science Dashboard",
    stack: ["TypeScript", "React", "Recharts", "Tailwind CSS"],
    description: "Interactive California housing dataset explorer with visualizations built using React, Recharts, and Tailwind CSS.",
    features: ["Dataset Explorer", "Charts", "Responsive UI"],
    icon: Database,
    featured: false,
    color: "from-orange-500/20 to-primary/20",
    borderColor: "border-orange-500/30",
    githubUrl: "https://github.com/deepthi-tr05/fetch_california_housing",
    demoUrl: "https://fetch-california-housing-q2bs.vercel.app",
    tag: "Data Science"
  },
  {
    id: 'find-s',
    title: "Find-S Algorithm",
    category: "ML Algorithm Visualization",
    stack: ["TypeScript", "React", "Vite"],
    description: "Interactive Find-S algorithm visualizer for concept learning — step through hypothesis generalization on training examples.",
    features: ["Concept Learning", "Step Visualization", "Interactive Input"],
    icon: Search,
    featured: false,
    color: "from-sky-500/20 to-primary/20",
    borderColor: "border-sky-500/30",
    githubUrl: "https://github.com/deepthi-tr05/find-s",
    demoUrl: "https://find-s.vercel.app",
    tag: "AI/ML"
  },
  {
    id: 'decision-tree',
    title: "Decision Tree Visualizer",
    category: "ML Algorithm Visualization",
    stack: ["TypeScript", "React", "Vite"],
    description: "Interactive Decision Tree algorithm visualizer — explore node splitting, information gain, and classification tree construction.",
    features: ["Tree Visualization", "Info Gain", "Interactive Nodes"],
    icon: GitBranch,
    featured: false,
    color: "from-lime-500/20 to-primary/20",
    borderColor: "border-lime-500/30",
    githubUrl: "https://github.com/deepthi-tr05/Decision-Tree",
    demoUrl: "https://github.com/deepthi-tr05/Decision-Tree",
    tag: "AI/ML"
  },
  {
    id: 'ml-regression-viz',
    title: "ML Regression Viz",
    category: "ML Visualization",
    stack: ["JavaScript"],
    description: "Interactive machine learning regression visualizer with live plotting and model fitting capabilities.",
    features: ["Regression Models", "Live Plotting", "Interactive"],
    icon: LineChart,
    featured: false,
    color: "from-pink-500/20 to-primary/20",
    borderColor: "border-pink-500/30",
    githubUrl: "https://github.com/deepthi-tr05/ml-regression-viz",
    demoUrl: "https://ml-regression-viz.vercel.app",
    tag: "Data Science"
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
    borderColor: "border-purple-500/30",
    githubUrl: "",
    demoUrl: "under-maintenance",
    tag: "Experimental"
  }
];

const TAGS = ['All', 'AI/ML', 'Data Science', 'Web', 'Experimental'];

export const Projects = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [isBooting, setIsBooting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [activeTag, setActiveTag] = useState('All');

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

  const filteredProjects = activeTag === 'All'
    ? allProjects
    : allProjects.filter(p => p.tag === activeTag);

  const featuredProject = allProjects.find(p => p.featured);
  const displayProjects = activeTag === 'All' ? filteredProjects.slice(1) : filteredProjects;

  return (
    <section id="projects" ref={ref} className="py-24 relative overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col mb-10">
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
        <div className="mb-8 font-mono text-[10px] text-muted space-y-1 bg-foreground/20 p-4 rounded border border-white/5 max-w-md">
          <div className="flex items-center gap-2">
            <Activity size={10} className="text-primary" />
            <span>AGENT_STATUS: {isReady ? "READY" : isBooting ? "LOADING_ARCHIVES..." : "IDLE"}</span>
          </div>
          {isBooting && <div className="animate-pulse">{">"} FETCHING_ENCRYPTED_CASE_FILES...</div>}
          {isReady && <div className="text-primary/60">{">"} {allProjects.length} INTELLIGENCE_NODES_DECODED</div>}
        </div>

        {/* Category Filter Tabs */}
        {isReady && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-1.5 rounded text-[10px] font-mono uppercase tracking-widest border transition-all duration-200 ${
                  activeTag === tag
                    ? 'bg-primary text-black border-primary font-bold'
                    : 'bg-foreground/20 text-muted border-white/10 hover:border-primary/40 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
            <span className="ml-auto text-[10px] font-mono text-muted/60 self-center">
              {filteredProjects.length} projects
            </span>
          </motion.div>
        )}

        {/* Projects Grid */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {isReady && (
              <>
                {/* Featured Project (only when All tab) */}
                {activeTag === 'All' && featuredProject && (
                  <motion.div 
                    key="featured"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <ProjectCard project={featuredProject} />
                  </motion.div>
                )}

                {/* Other Projects Grid */}
                <motion.div
                  key={activeTag}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {displayProjects.map((project, idx) => (
                    <motion.div 
                      key={project.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project }: { project: typeof allProjects[0] }) => {
  return (
    <MatrixCard className={`h-full flex flex-col group transition-all duration-500 hover:border-primary/50 ${project.featured ? 'lg:flex-row gap-8 min-h-[360px]' : ''}`}>
      {/* Visual Side */}
      <div className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${project.color} ${project.featured ? 'lg:w-2/5 min-h-[220px]' : 'aspect-video mb-5'} flex items-center justify-center border ${project.borderColor}`}>
        <div className="absolute inset-0 opacity-20 bg-grid-pattern bg-[length:20px_20px]" />
        
        {/* Animated Visual Core */}
        <div className="relative z-10">
          <motion.div
            animate={project.featured ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 10, repeat: Infinity }}
            className="text-primary/40 group-hover:text-primary transition-colors duration-700"
          >
            <project.icon size={project.featured ? 100 : 52} strokeWidth={1} />
          </motion.div>
          {project.featured && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-1 bg-primary/20 animate-scan blur-sm" />
             </div>
          )}
        </div>

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <span className="px-2 py-1 rounded bg-background/80 backdrop-blur-md border border-white/10 text-[8px] font-mono text-primary uppercase tracking-widest">
            {project.category}
          </span>
          {project.featured && (
            <span className="px-2 py-1 rounded bg-primary/20 backdrop-blur-md border border-primary/50 text-[8px] font-mono text-white uppercase tracking-widest flex items-center gap-1">
              <Activity size={8} className="animate-pulse" />
              Featured Case
            </span>
          )}
          <span className="px-2 py-1 rounded bg-white/5 backdrop-blur-md border border-white/10 text-[8px] font-mono text-muted uppercase tracking-widest">
            {project.tag}
          </span>
        </div>
      </div>

      {/* Content Side */}
      <div className={`flex-1 flex flex-col ${project.featured ? 'lg:py-2' : ''}`}>
        <div className="flex-1">
          <h3 className={`font-display font-bold text-white group-hover:text-primary transition-colors ${project.featured ? 'text-2xl mb-3' : 'text-lg mb-2'}`}>
            {project.title}
          </h3>
          <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.stack.map(tech => (
              <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-muted">
                {tech}
              </span>
            ))}
          </div>

          <div className="space-y-1.5 mb-6">
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
              if (project.githubUrl) {
                window.open(project.githubUrl, '_blank');
              }
            }}
            disabled={!project.githubUrl}
          >
            <Globe size={14} />
            Source
          </GlowButton>
          <GlowButton 
            variant="primary" 
            className="flex-1 py-2 text-[10px] flex items-center justify-center gap-2 h-auto disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => {
              if (project.demoUrl === 'chatbot-trigger') {
                window.dispatchEvent(new CustomEvent('open-chat-assistant'));
              } else if (project.demoUrl && project.demoUrl !== 'under-maintenance') {
                window.open(project.demoUrl, '_blank');
              }
            }}
            disabled={project.demoUrl === 'under-maintenance' || !project.demoUrl}
          >
            <ExternalLink size={14} />
            {project.demoUrl === 'under-maintenance' ? 'Maintenance' : 
             project.demoUrl === 'chatbot-trigger' ? 'Launch Chat' : 'Live Demo'}
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
