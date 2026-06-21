import React from 'react';
import { Mail, Wifi, Database, Server, Globe, Users, Link } from 'lucide-react';
import { links } from '../data/portfolio';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative mt-20 border-t border-white/5 bg-foreground/20 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-display font-bold text-xl uppercase tracking-tighter">
                DEEPTHI <span className="text-primary">T R</span>
              </span>
            </div>
            <p className="text-muted text-sm max-w-sm leading-relaxed font-sans">
              Engineering the next generation of Intelligence. Specializing in Machine Learning systems and autonomous AI agents at GSSS Institute of Engineering and Technology for Women.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-display font-semibold uppercase tracking-widest text-xs mb-6">Social Nodes</h4>
            <div className="flex flex-col gap-4">
              <a href={links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted hover:text-primary transition-colors text-sm group">
                <Globe size={18} className="group-hover:rotate-12 transition-transform" />
                <span>GitHub</span>
              </a>
              <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted hover:text-primary transition-colors text-sm group">
                <Users size={18} className="group-hover:rotate-12 transition-transform" />
                <span>LinkedIn</span>
              </a>
              <a href={links.linktree} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted hover:text-primary transition-colors text-sm group">
                <Link size={18} className="group-hover:rotate-12 transition-transform" />
                <span>Linktree</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-display font-semibold uppercase tracking-widest text-xs mb-6">Contact Endpoint</h4>
            <a href={links.email} className="flex items-center gap-3 text-muted hover:text-primary transition-colors text-sm group">
              <Mail size={18} className="group-hover:rotate-12 transition-transform" />
              <span>Initialize Handshake</span>
            </a>
          </div>
        </div>

        {/* System Status Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
              <Wifi size={12} className="text-green-500" />
              <span>Status: Online</span>
            </div>
            <div className="flex items-center gap-2">
              <Database size={12} className="text-primary" />
              <span>Lat: 24ms</span>
            </div>
            <div className="flex items-center gap-2">
              <Server size={12} className="text-blue-500" />
              <span>Node: Mysuru-01</span>
            </div>
          </div>
          
          <div className="text-[10px] font-mono text-muted uppercase tracking-[0.2em]">
            © {currentYear} DEEPTHI T R // BUILD_v1.0.42
          </div>
        </div>
      </div>
    </footer>
  );
};
