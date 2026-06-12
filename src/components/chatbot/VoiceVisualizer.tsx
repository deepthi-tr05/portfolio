import { motion } from 'framer-motion';
import type { VoiceState } from './useVoice';

const BAR_COUNT = 24;

interface Props {
  state: VoiceState;
  /** 0..1 live microphone level */
  level: number;
}

/**
 * Futuristic waveform — bars react to live mic level while listening,
 * gently undulate while the assistant is speaking.
 */
export const VoiceVisualizer = ({ state, level }: Props) => {
  const active = state === 'listening' || state === 'speaking' || state === 'loading';

  return (
    <div className="flex items-center justify-center gap-[3px] h-10" aria-hidden="true">
      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        // Bell-curve base height so the center bars are tallest
        const center = Math.abs(i - BAR_COUNT / 2) / (BAR_COUNT / 2);
        const base = 4 + (1 - center) * 10;

        const listenHeight = base + level * (1 - center) * 26;

        return (
          <motion.span
            key={i}
            animate={
              state === 'speaking'
                ? { height: [base, base + (1 - center) * 18, base] }
                : state === 'loading'
                ? { height: [4, 8, 4], opacity: [0.3, 0.8, 0.3] }
                : { height: state === 'listening' ? listenHeight : 4 }
            }
            transition={
              state === 'speaking'
                ? { duration: 0.9, repeat: Infinity, delay: i * 0.045, ease: 'easeInOut' }
                : state === 'loading'
                ? { duration: 1.4, repeat: Infinity, delay: i * 0.05, ease: 'easeInOut' }
                : { duration: 0.1 }
            }
            className={`w-[3px] rounded-full ${
              active ? 'bg-primary shadow-[0_0_6px_rgba(0,245,255,0.6)]' : 'bg-primary/20'
            }`}
            style={{ height: 4 }}
          />
        );
      })}
    </div>
  );
};
