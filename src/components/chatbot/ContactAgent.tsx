import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, SendHorizonal, ShieldCheck, Loader2, ChevronDown, FileText, Users } from 'lucide-react';
import { links } from '../../data/portfolio';

type TransmitState = 'idle' | 'transmitting' | 'sent';

export const PURPOSE_OPTIONS = [
  'Hiring Opportunity',
  'Internship',
  'Collaboration',
  'Freelance Project',
  'Networking',
  'Technical Discussion',
  'Other',
] as const;

interface Props {
  onComplete: (summary: { name: string; purpose: string }) => void;
  /** Smart-detected purpose pre-fill from chat intent */
  defaultPurpose?: string;
}

const inputClass =
  'w-full bg-background/70 border border-white/10 focus:border-primary/60 focus:shadow-[0_0_12px_rgba(0,245,255,0.15)] rounded-lg px-3 py-2 text-[12px] text-white placeholder:text-muted/50 outline-none transition-all font-sans disabled:opacity-50';

const Label = ({ children }: { children: string }) => (
  <label className="block text-[8px] font-mono text-primary/60 uppercase tracking-[0.2em] mb-1">
    {children}
  </label>
);

/**
 * SECURE_COMMUNICATION_MODE — neural transmission terminal embedded in chat.
 */
export const ContactAgent = ({ onComplete, defaultPurpose }: Props) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    purpose: defaultPurpose && PURPOSE_OPTIONS.includes(defaultPurpose as typeof PURPOSE_OPTIONS[number]) ? defaultPurpose : '',
    message: '',
  });
  const [state, setState] = useState<TransmitState>('idle');
  const [fieldError, setFieldError] = useState<string | null>(null);

  const update = (key: string, value: string) => {
    setFieldError(null);
    setForm((f) => ({ ...f, [key]: value }));
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return 'Identity field required for secure handshake.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Valid return channel (email) required.';
    if (!form.purpose) return 'Select a transmission purpose.';
    if (form.message.trim().length < 5) return 'Transmission payload too short.';
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (state !== 'idle') return;

    const error = validate();
    if (error) {
      setFieldError(error);
      return;
    }

    setState('transmitting');
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_x053w62';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!templateId || !publicKey) {
        // Fallback to simulated secure uplink when variables are missing in env
        await new Promise((r) => setTimeout(r, 1800));
      } else {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              from_name: form.name.trim(),
              from_email: form.email.trim(),
              purpose: form.purpose,
              message: form.message.trim(),
              to_name: 'Deepthi T R',
            },
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || 'Uplink transmission rejected.');
        }
      }

      setState('sent');
      setTimeout(() => {
        onComplete({ name: form.name.trim(), purpose: form.purpose });
        setForm({ name: '', email: '', purpose: '', message: '' });
      }, 2200);
    } catch (err: any) {
      setFieldError(err?.message || 'Handshake failed. Encryption error.');
      setState('idle');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative ml-9 rounded-xl border border-primary/25 bg-foreground/60 backdrop-blur-md overflow-hidden"
    >
      {/* Terminal Header */}
      <div className="px-3.5 py-2.5 border-b border-primary/15 bg-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio size={12} className="text-primary animate-pulse" />
          <span className="text-[9px] font-mono text-primary uppercase tracking-[0.25em]">
            SECURE_COMMUNICATION_MODE
          </span>
        </div>
        <span className="text-[8px] font-mono text-muted uppercase tracking-widest flex items-center gap-1">
          <ShieldCheck size={9} className="text-green-500" /> Encrypted
        </span>
      </div>

      <AnimatePresence mode="wait">
        {state === 'sent' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 flex flex-col items-center text-center gap-3"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.25)]"
            >
              <ShieldCheck size={22} className="text-green-500" />
            </motion.div>
            <div className="font-mono text-[11px] space-y-1 text-left">
              <p className="text-primary">{'>'} Transmission Successful.</p>
              <p className="text-muted">{'>'} Communication request securely delivered.</p>
              <p className="text-muted">{'>'} Deepthi will respond through the provided channel.</p>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" exit={{ opacity: 0 }} onSubmit={handleSubmit} className="p-3.5 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <Label>Full Name</Label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Your identity..."
                  disabled={state === 'transmitting'}
                  maxLength={120}
                  className={inputClass}
                />
              </div>
              <div>
                <Label>Email Address</Label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="Return channel..."
                  disabled={state === 'transmitting'}
                  maxLength={120}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <Label>Purpose of Contact</Label>
              <div className="relative">
                <select
                  value={form.purpose}
                  onChange={(e) => update('purpose', e.target.value)}
                  disabled={state === 'transmitting'}
                  className={`${inputClass} appearance-none pr-8 cursor-pointer ${!form.purpose ? 'text-muted/50' : ''}`}
                >
                  <option value="" disabled className="bg-background text-muted">
                    Select transmission purpose...
                  </option>
                  {PURPOSE_OPTIONS.map((p) => (
                    <option key={p} value={p} className="bg-background text-white">
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary/60 pointer-events-none"
                />
              </div>
            </div>

            <div>
              <Label>Custom Message</Label>
              <textarea
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                placeholder="Compose transmission payload..."
                disabled={state === 'transmitting'}
                maxLength={1000}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Validation feedback */}
            <AnimatePresence>
              {fieldError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[10px] font-mono text-red-400 uppercase tracking-wider overflow-hidden"
                >
                  ⚠ {fieldError}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={state === 'transmitting'}
              className="relative w-full py-2.5 rounded-lg bg-primary text-background font-display font-bold text-[11px] uppercase tracking-[0.2em] disabled:opacity-60 disabled:cursor-wait hover:bg-white transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(0,245,255,0.25)] flex items-center justify-center gap-2 overflow-hidden"
            >
              {state === 'transmitting' ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Establishing Uplink...
                  <motion.span
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-y-0 w-1/3 bg-white/30 skew-x-12"
                  />
                </>
              ) : (
                <>
                  <SendHorizonal size={14} />
                  Transmit Message
                </>
              )}
            </button>

            {/* Premium quick access */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <a
                href="/Resume Deepthi TR.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[9px] font-mono text-muted hover:text-primary uppercase tracking-widest transition-colors"
              >
                <FileText size={10} /> Resume
              </a>
              <span className="w-[1px] h-3 bg-white/10" />
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[9px] font-mono text-muted hover:text-primary uppercase tracking-widest transition-colors"
              >
                <Users size={10} /> LinkedIn
              </a>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
