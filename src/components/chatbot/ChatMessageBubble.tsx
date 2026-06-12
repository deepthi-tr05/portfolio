import { motion } from 'framer-motion';
import { Cpu, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { sections } from '../../data/portfolio';
import type { ChatMessage } from '../../lib/aiEngine';

interface Props {
  message: ChatMessage;
  onNavigate: (sectionId: string) => void;
}

export const ChatMessageBubble = ({ message, onNavigate }: Props) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('flex gap-2.5', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="shrink-0 w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mt-1">
          <Cpu size={13} className="text-primary" />
        </div>
      )}

      <div className={cn('max-w-[80%] space-y-2', isUser && 'flex flex-col items-end')}>
        <div
          className={cn(
            'px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed',
            isUser
              ? 'bg-primary text-background rounded-br-sm font-medium'
              : 'bg-foreground/70 border border-white/10 text-white/90 rounded-bl-sm backdrop-blur-sm'
          )}
        >
          {message.content}
        </div>

        {message.navigateTo && (
          <button
            onClick={() => onNavigate(message.navigateTo!)}
            className="group flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-primary/80 hover:text-primary px-2 py-1 rounded border border-primary/20 hover:border-primary/50 bg-primary/5 transition-all"
          >
            <span>Open {sections[message.navigateTo] ?? 'Section'}</span>
            <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex gap-2.5"
  >
    <div className="shrink-0 w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mt-1">
      <Cpu size={13} className="text-primary animate-pulse" />
    </div>
    <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-foreground/70 border border-white/10 flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -2, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
          className="w-1.5 h-1.5 rounded-full bg-primary"
        />
      ))}
    </div>
  </motion.div>
);
