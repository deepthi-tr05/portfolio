import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Globe, 
  GitBranch, 
  Star, 
  Code2, 
  Activity, 
  ExternalLink,
  BarChart3,
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { MatrixCard } from './ui/MatrixCard';
import { GlowButton } from './ui/GlowButton';

interface Repo {
  name: string;
  lang: string;
  stars: number;
  forks: number;
  url: string;
  description: string;
  homepage?: string;
  updatedAt?: string;
}

const ITEMS_PER_PAGE = 6;

export const GithubDashboard = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [isSyncing, setIsSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLang, setFilterLang] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const [allRepos, setAllRepos] = useState<Repo[]>([
    { name: "brain-tumor-detection", lang: "Python", stars: 0, forks: 0, url: "https://github.com/deepthi-tr05/brain-tumor-detection", description: "AI-powered brain tumor detection from MRI scans using CNN deep learning." },
    { name: "Hostel-Management-System-PHP", lang: "PHP", stars: 0, forks: 0, url: "https://github.com/deepthi-tr05/Hostel-Management-System-PHP", description: "Smart hostel management system with admin dashboard and live database." },
    { name: "chatbot", lang: "JavaScript", stars: 0, forks: 0, url: "https://github.com/deepthi-tr05/chatbot", description: "AI-powered chatbot supporting voice and text interaction using Flask." },
    { name: "iris-pca-viz", lang: "HTML", stars: 0, forks: 0, url: "https://github.com/deepthi-tr05/iris-pca-viz", description: "Interactive Iris dataset PCA visualization.", homepage: "https://iris-pca-viz.vercel.app" },
    { name: "lwr-visualizer", lang: "HTML", stars: 0, forks: 0, url: "https://github.com/deepthi-tr05/lwr-visualizer", description: "Interactive Locally Weighted Regression visualizer.", homepage: "https://lwr-visualizer.vercel.app" },
    { name: "Gaussian-Naive-Bayes", lang: "TypeScript", stars: 0, forks: 0, url: "https://github.com/deepthi-tr05/Gaussian-Naive-Bayes", description: "Gaussian Naive Bayes classifier interactive demo.", homepage: "https://gaussian-naive-bayes.vercel.app" },
  ]);

  const [githubStats, setGithubStats] = useState([
    { label: "Repositories", value: "12+", icon: GitBranch },
    { label: "Total Stars", value: "0", icon: Star },
    { label: "Followers", value: "0", icon: Users },
    { label: "Activity", value: "Active", icon: Activity },
  ]);

  const [languages, setLanguages] = useState([
    { l: "TypeScript", p: "40%", c: "bg-blue-500" },
    { l: "Python", p: "30%", c: "bg-yellow-500" },
    { l: "HTML", p: "20%", c: "bg-orange-500" },
    { l: "JavaScript", p: "10%", c: "bg-indigo-500" },
  ]);

  const [allLanguages, setAllLanguages] = useState<string[]>([]);

  useEffect(() => {
    if (inView) {
      setIsSyncing(true);
      
      const fetchData = async () => {
        try {
          const profileRes = await fetch('https://api.github.com/users/deepthi-tr05');
          const reposRes = await fetch('https://api.github.com/users/deepthi-tr05/repos?per_page=100&sort=updated');
          
          if (profileRes.ok && reposRes.ok) {
            const profileData = await profileRes.json();
            const reposData = await reposRes.json() as any[];
            
            // Calculate total stars
            const totalStars = reposData.reduce((acc: number, r: any) => acc + r.stargazers_count, 0);
            
            // Calculate language distribution
            const langCounts: Record<string, number> = {};
            reposData.forEach((r: any) => {
              if (r.language) {
                langCounts[r.language] = (langCounts[r.language] || 0) + 1;
              }
            });
            
            const sortedLangs = Object.entries(langCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4);
            
            const totalTopLangsCount = sortedLangs.reduce((acc, l) => acc + l[1], 0);
            
            const colors = ["bg-blue-500", "bg-yellow-500", "bg-orange-500", "bg-indigo-500", "bg-purple-500", "bg-green-500"];
            const languageMap = sortedLangs.map((lang, idx) => {
              const pct = totalTopLangsCount > 0 ? Math.round((lang[1] / totalTopLangsCount) * 100) : 0;
              return { l: lang[0], p: `${pct}%`, c: colors[idx] || "bg-gray-500" };
            });
            
            if (languageMap.length > 0) setLanguages(languageMap);
            
            // Update global stats
            setGithubStats([
              { label: "Repositories", value: String(profileData.public_repos || reposData.length), icon: GitBranch },
              { label: "Total Stars", value: String(totalStars), icon: Star },
              { label: "Followers", value: String(profileData.followers || 0), icon: Users },
              { label: "Activity", value: "Online", icon: Activity },
            ]);
            
            // Format ALL repos
            const formattedRepos: Repo[] = reposData.map((r: any) => ({
              name: r.name,
              lang: r.language || "Unknown",
              stars: r.stargazers_count,
              forks: r.forks_count,
              url: r.html_url,
              description: r.description || `${r.name} — open source repository`,
              homepage: r.homepage || undefined,
              updatedAt: r.updated_at,
            }));
            
            if (formattedRepos.length > 0) setAllRepos(formattedRepos);

            // Build unique language list for filter
            const uniqueLangs = Array.from(new Set(reposData.map((r: any) => r.language).filter(Boolean)));
            setAllLanguages(['All', ...uniqueLangs as string[]]);
          }
        } catch (error) {
          console.error("Failed to sync GitHub data:", error);
        } finally {
          setIsSyncing(false);
          setSynced(true);
        }
      };
      
      setTimeout(fetchData, 1000);
    }
  }, [inView]);

  // Filtering & Search
  const filteredRepos = allRepos.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = filterLang === 'All' || repo.lang === filterLang;
    return matchesSearch && matchesLang;
  });

  const totalPages = Math.ceil(filteredRepos.length / ITEMS_PER_PAGE);
  const paginatedRepos = filteredRepos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterChange = (lang: string) => {
    setFilterLang(lang);
    setCurrentPage(1);
  };

  return (
    <section id="github" ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-[1px] bg-primary/50" />
            <span className="font-mono text-xs text-primary uppercase tracking-[0.5em]">
              CODE_INTELLIGENCE_CENTER
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-tight">
            GITHUB <span className="text-primary glow-text underline decoration-primary/20 underline-offset-8">ANALYTICS</span>
          </h2>
        </div>

        <AnimatePresence>
          {isSyncing && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 p-4 glass-card border-primary/20 bg-primary/5 flex items-center gap-4 max-w-md"
            >
              <div className="relative">
                <Globe size={24} className="text-primary animate-pulse" />
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-ping" />
              </div>
              <div className="font-mono text-[10px] space-y-1">
                <p className="text-primary">INITIALIZING_GIT_HANDSHAKE...</p>
                <p className="text-muted italic">Fetching all repos from: deepthi-tr05</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {synced && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Top Row: Stats + Language + Profile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Global Stats */}
              <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                {githubStats.map((stat, i) => (
                  <MatrixCard key={i} className="flex flex-col items-center justify-center p-6 text-center group hover:bg-primary/5">
                    <stat.icon size={20} className="text-primary/60 mb-3 group-hover:text-primary transition-colors" />
                    <span className="text-2xl font-display font-bold text-white mb-1 tracking-tighter">{stat.value}</span>
                    <span className="text-[10px] font-mono text-muted uppercase tracking-widest">{stat.label}</span>
                  </MatrixCard>
                ))}
                
                <div className="col-span-2 glass-card p-6 border-white/5 bg-foreground/20">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono text-primary uppercase">Language_Distribution</span>
                    <BarChart3 size={14} className="text-primary/40" />
                  </div>
                  <div className="space-y-3">
                    {languages.map((lang, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-muted">
                          <span>{lang.l}</span>
                          <span>{lang.p}</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: lang.p }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className={`h-full ${lang.c}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Profile Card */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="glass-card p-6 border-primary/10 flex items-center justify-between bg-foreground/30">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                      <Globe size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-white font-display font-bold text-lg">deepthi-tr05</h3>
                      <p className="text-muted text-xs font-mono">github.com/deepthi-tr05</p>
                    </div>
                  </div>
                  <GlowButton variant="outline" className="text-[10px] px-4 py-2 h-auto" onClick={() => window.open('https://github.com/deepthi-tr05', '_blank')}>
                    Full Intelligence Feed
                  </GlowButton>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
                    <input
                      type="text"
                      placeholder="Search repositories..."
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      className="w-full pl-9 pr-4 py-2.5 bg-foreground/30 border border-white/10 rounded text-white text-xs font-mono placeholder-muted/50 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
                    <select
                      value={filterLang}
                      onChange={(e) => handleFilterChange(e.target.value)}
                      className="pl-8 pr-4 py-2.5 bg-foreground/30 border border-white/10 rounded text-white text-xs font-mono focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
                    >
                      {(allLanguages.length > 0 ? allLanguages : ['All', 'TypeScript', 'Python', 'JavaScript', 'HTML', 'PHP']).map(lang => (
                        <option key={lang} value={lang} className="bg-gray-900">{lang}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Repo count */}
                <div className="font-mono text-[10px] text-muted/60">
                  SHOWING {filteredRepos.length} REPOS — PAGE {currentPage}/{Math.max(totalPages, 1)}
                </div>
              </div>
            </div>

            {/* All Repositories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {paginatedRepos.map((repo, i) => (
                  <motion.div
                    key={repo.name}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <MatrixCard 
                      className="group hover:border-primary/50 flex flex-col cursor-pointer h-full"
                      onClick={() => window.open(repo.url, '_blank')}
                    >
                      <div className="flex justify-between mb-3">
                        <Code2 size={18} className="text-primary/40 group-hover:text-primary transition-colors" />
                        <div className="flex gap-3 text-[10px] font-mono text-muted">
                          <span className="flex items-center gap-1"><Star size={10} /> {repo.stars}</span>
                          <span className="flex items-center gap-1"><GitBranch size={10} /> {repo.forks}</span>
                        </div>
                      </div>
                      
                      <h4 className="text-white font-display font-bold text-sm mb-2 group-hover:text-primary transition-colors truncate">
                        {repo.name}
                      </h4>
                      
                      <p className="text-muted text-[11px] leading-relaxed mb-3 flex-1 line-clamp-2">
                        {repo.description}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between gap-2">
                        <span className="text-[9px] font-mono text-primary/60 px-1.5 py-0.5 border border-primary/20 rounded uppercase shrink-0">
                          {repo.lang}
                        </span>
                        <div className="flex items-center gap-2">
                          {repo.homepage && (
                            <button
                              onClick={(e) => { e.stopPropagation(); window.open(repo.homepage, '_blank'); }}
                              className="text-[9px] font-mono text-primary/70 hover:text-primary px-1.5 py-0.5 border border-primary/20 hover:border-primary/50 rounded uppercase transition-colors flex items-center gap-1"
                            >
                              <Globe size={8} /> Demo
                            </button>
                          )}
                          <ExternalLink size={12} className="text-muted group-hover:text-white transition-colors shrink-0" />
                        </div>
                      </div>
                    </MatrixCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded border border-white/10 text-muted hover:text-white hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded text-xs font-mono transition-colors ${
                        page === currentPage 
                          ? 'bg-primary text-black font-bold' 
                          : 'border border-white/10 text-muted hover:text-white hover:border-primary/50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded border border-white/10 text-muted hover:text-white hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};
