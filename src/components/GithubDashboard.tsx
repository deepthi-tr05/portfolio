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
  Users
} from 'lucide-react';
import { MatrixCard } from './ui/MatrixCard';
import { GlowButton } from './ui/GlowButton';

export const GithubDashboard = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [isSyncing, setIsSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  const [repos, setRepos] = useState([
    { name: "brain-tumor-detection", lang: "Python", stars: 12, forks: 4, url: "https://github.com/deepthi-tr05/brain-tumor-detection" },
    { name: "Hostel-Management-System-PHP", lang: "PHP", stars: 8, forks: 2, url: "https://github.com/deepthi-tr05/Hostel-Management-System-PHP" },
    { name: "chatbot", lang: "JavaScript", stars: 5, forks: 1, url: "https://github.com/deepthi-tr05/chatbot" },
  ]);

  const [githubStats, setGithubStats] = useState([
    { label: "Repositories", value: "12", icon: GitBranch },
    { label: "Total Stars", value: "25", icon: Star },
    { label: "Followers", value: "5", icon: Users },
    { label: "Activity", value: "Active", icon: Activity },
  ]);

  const [languages, setLanguages] = useState([
    { l: "Python", p: "65%", c: "bg-blue-500" },
    { l: "JavaScript", p: "20%", c: "bg-yellow-500" },
    { l: "PHP", p: "15%", c: "bg-indigo-500" }
  ]);

  useEffect(() => {
    if (inView) {
      setIsSyncing(true);
      
      const fetchData = async () => {
        try {
          const profileRes = await fetch('https://api.github.com/users/deepthi-tr05');
          const reposRes = await fetch('https://api.github.com/users/deepthi-tr05/repos?per_page=100');
          
          if (profileRes.ok && reposRes.ok) {
            const profileData = await profileRes.json();
            const reposData = await reposRes.json() as any[];
            
            // Calculate total stars
            const totalStars = reposData.reduce((acc, r) => acc + r.stargazers_count, 0);
            
            // Calculate language distribution
            const langCounts: Record<string, number> = {};
            reposData.forEach(r => {
              if (r.language) {
                langCounts[r.language] = (langCounts[r.language] || 0) + 1;
              }
            });
            
            const sortedLangs = Object.entries(langCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3);
            
            const totalTopLangsCount = sortedLangs.reduce((acc, l) => acc + l[1], 0);
            
            const languageMap = sortedLangs.map((lang, idx) => {
              const colors = ["bg-blue-500", "bg-yellow-500", "bg-indigo-500"];
              const pct = totalTopLangsCount > 0 ? Math.round((lang[1] / totalTopLangsCount) * 100) : 0;
              return {
                l: lang[0],
                p: `${pct}%`,
                c: colors[idx] || "bg-gray-500"
              };
            });
            
            if (languageMap.length > 0) {
              setLanguages(languageMap);
            }
            
            // Update global stats
            setGithubStats([
              { label: "Repositories", value: String(profileData.public_repos || reposData.length), icon: GitBranch },
              { label: "Total Stars", value: String(totalStars), icon: Star },
              { label: "Followers", value: String(profileData.followers || 0), icon: Users },
              { label: "Activity", value: "Online", icon: Activity },
            ]);
            
            // Custom repos sorted by priority: those matching her 3 core projects, or sorted by stars
            const targetRepoNames = ["brain-tumor-detection", "Hostel-Management-System-PHP", "chatbot"];
            
            // Find target repos first, and fill the rest with top starred repos
            const matchedRepos = reposData.filter(r => targetRepoNames.some(name => name.toLowerCase() === r.name.toLowerCase()));
            const otherRepos = reposData
              .filter(r => !targetRepoNames.some(name => name.toLowerCase() === r.name.toLowerCase()))
              .sort((a, b) => b.stargazers_count - a.stargazers_count);
            
            const combinedRepos = [...matchedRepos, ...otherRepos].slice(0, 3);
            
            const formattedRepos = combinedRepos.map(r => ({
              name: r.name,
              lang: r.language || "Unknown",
              stars: r.stargazers_count,
              forks: r.forks_count,
              url: r.html_url
            }));
            
            if (formattedRepos.length > 0) {
              setRepos(formattedRepos);
            }
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
                <p className="text-muted italic">Requesting data from: deepthi-tr05</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {synced && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
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

            {/* Right: Featured Repositories */}
            <div className="lg:col-span-8 flex flex-col gap-6">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {repos.map((repo, i) => (
                  <MatrixCard 
                    key={i} 
                    className="group hover:border-primary/50 flex flex-col cursor-pointer"
                    onClick={() => window.open(repo.url, '_blank')}
                  >
                    <div className="flex justify-between mb-4">
                      <Code2 size={18} className="text-primary/40 group-hover:text-primary transition-colors" />
                      <div className="flex gap-3 text-[10px] font-mono text-muted">
                        <span className="flex items-center gap-1"><Star size={10} /> {repo.stars}</span>
                        <span className="flex items-center gap-1"><GitBranch size={10} /> {repo.forks}</span>
                      </div>
                    </div>
                    <h4 className="text-white font-display font-bold text-sm mb-2 group-hover:text-primary transition-colors truncate">{repo.name}</h4>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-primary/60 px-1.5 py-0.5 border border-primary/20 rounded uppercase">{repo.lang}</span>
                      <ExternalLink size={12} className="text-muted group-hover:text-white transition-colors" />
                    </div>
                  </MatrixCard>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
