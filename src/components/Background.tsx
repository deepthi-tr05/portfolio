import React from 'react';
import { motion } from 'framer-motion';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-background overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-20" />
      
      {/* Radial Gradient overlay to fade edges */}
      <div className="absolute inset-0 bg-radial-gradient" />

      {/* Animated Glow Orbs */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full"
      />
      
      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.15, 0.1],
          x: [0, -80, 0],
          y: [0, 120, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full"
      />

      {/* Scanning Line Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        <div className="w-full h-[2px] bg-primary animate-scan" />
      </div>
    </div>
  );
};
