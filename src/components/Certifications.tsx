import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Award, 
  ShieldCheck, 
  Cloud, 
  Zap,
  CheckCircle,
  QrCode
} from 'lucide-react';
import { MatrixCard } from './ui/MatrixCard';

const certs = [
  {
    title: "AWS Academy Graduate – Machine Learning Foundations",
    issuer: "Amazon Web Services",
    icon: Cloud,
    color: "text-orange-400",
    glow: "shadow-orange-500/20"
  },
  {
    title: "Salesforce Trailblazer Certification",
    issuer: "Salesforce",
    icon: Zap,
    color: "text-blue-400",
    glow: "shadow-blue-500/20"
  },
  {
    title: "Google Cloud Computing Foundations",
    issuer: "Google Cloud",
    icon: ShieldCheck,
    color: "text-red-400",
    glow: "shadow-red-500/20"
  }
];

export const Certifications = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [isValidating, setIsValidating] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (inView) {
      setIsValidating(true);
      const timer = setTimeout(() => {
        setIsValidating(false);
        setValidated(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  return (
    <section id="certifications" ref={ref} className="py-24 relative overflow-hidden bg-foreground/5">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-[1px] bg-primary/50" />
            <span className="font-mono text-xs text-primary uppercase tracking-[0.5em]">
              KNOWLEDGE_VERIFICATION_CENTER
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white">
            CREDENTIAL <span className="text-primary glow-text underline decoration-primary/20 underline-offset-8">VAULT</span>
          </h2>
        </div>

        {/* Validation Status */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-4 bg-background border border-white/10 px-6 py-3 rounded-full">
            <div className={`w-2 h-2 rounded-full ${validated ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-yellow-500 animate-pulse'}`} />
            <span className="text-[10px] font-mono text-muted uppercase tracking-[0.2em]">
              {isValidating ? "VALIDATING_ENCRYPTED_SIGNATURES..." : validated ? "CRYPTO_VERIFICATION_COMPLETE" : "WAITING_FOR_HANDSHAKE"}
            </span>
            {validated && <CheckCircle size={14} className="text-green-500" />}
          </div>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {validated && certs.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <MatrixCard className="relative h-full flex flex-col items-center text-center group hover:bg-primary/5">
                  {/* Holographic Icon Container */}
                  <div className={`mb-6 p-6 rounded-2xl bg-foreground/50 border border-white/10 group-hover:border-primary/40 transition-all duration-500 group-hover:scale-110 ${cert.glow}`}>
                    <cert.icon size={40} className={`${cert.color} group-hover:animate-pulse`} />
                  </div>

                  <h3 className="text-lg font-display font-bold text-white mb-2 px-4 leading-tight group-hover:text-primary transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-[10px] font-mono text-muted uppercase tracking-widest mb-8">
                    Issued by: {cert.issuer}
                  </p>

                  <div className="mt-auto w-full space-y-4">
                    <div className="flex items-center justify-between text-[8px] font-mono text-primary/40 px-2 uppercase">
                      <span>Ref_00{idx + 1}</span>
                      <span>Verified</span>
                    </div>
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                    <div className="flex justify-center gap-6">
                      <QrCode size={20} className="text-white/10 group-hover:text-primary/30 transition-colors" />
                      <Award size={20} className="text-white/10 group-hover:text-primary/30 transition-colors" />
                    </div>
                  </div>

                  {/* Corner Scan Decoration */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-lg" />
                  </div>
                </MatrixCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
