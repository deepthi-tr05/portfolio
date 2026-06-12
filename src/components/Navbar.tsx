import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cpu, Terminal, Workflow, Globe } from 'lucide-react';
import { cn } from '../utils/cn';
import { links } from '../data/portfolio';

const navItems = [
  { name: 'Core', icon: Cpu, href: '#core' },
  { name: 'Skills', icon: Workflow, href: '#skills' },
  { name: 'Projects', icon: Terminal, href: '#projects' },
  { name: 'Lab', icon: Globe, href: '#lab' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      aria-label="Main Navigation"
      className={cn(
        "fixed top-0 left-0 w-full z-[100] transition-all duration-500 border-b",
        isScrolled ? "bg-background/80 backdrop-blur-xl border-white/10 py-3 shadow-2xl" : "bg-transparent border-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <motion.a 
          href="#"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg p-1"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-primary blur opacity-25 group-hover:opacity-50 transition-opacity" />
            <div className="relative bg-foreground p-1.5 rounded-lg border border-primary/20">
              <Cpu size={24} className="text-primary" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg tracking-tighter leading-none">
              DEEPTHI <span className="text-primary">T R</span>
            </span>
            <span className="text-[10px] text-muted uppercase tracking-[0.2em] leading-none mt-1">
              AI Command Center
            </span>
          </div>
        </motion.a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item, i) => (
            <motion.a
              key={item.name}
              href={item.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="nav-link flex items-center gap-2 relative group focus:outline-none focus:text-primary"
            >
              <item.icon size={14} className="group-hover:text-primary transition-colors" />
              <span>{item.name}</span>
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
          
          <motion.a
            href={links.email}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-5 py-2 rounded-full bg-primary text-background text-xs font-display font-bold uppercase tracking-widest hover:bg-white transition-all active:scale-95 shadow-[0_0_15px_rgba(0,245,255,0.3)]"
          >
            Initiate Contact
          </motion.a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 top-[72px] bg-background/95 backdrop-blur-2xl z-[90] flex flex-col p-6 gap-8 border-t border-white/5"
          >
            {navItems.map((item) => (
              <a 
                key={item.name}
                href={item.href}
                className="flex items-center gap-4 text-2xl font-display font-bold text-white hover:text-primary transition-colors"
                onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
              >
                <item.icon size={24} className="text-primary" />
                {item.name}
              </a>
            ))}
            <a 
              href={links.email}
              className="w-full py-5 rounded-2xl bg-primary text-background font-display font-bold uppercase tracking-widest text-center text-lg shadow-xl"
            >
              Initiate Contact
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
