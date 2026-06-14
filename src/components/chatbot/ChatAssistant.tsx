import { useState, useRef, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, SendHorizonal, RotateCcw, Sparkles, Mic, Square, Volume2, VolumeX } from 'lucide-react';
import { useChat } from './useChat';
import { ChatMessageBubble, TypingIndicator } from './ChatMessageBubble';
import { useVoice } from './useVoice';
import { VoiceVisualizer } from './VoiceVisualizer';
import { ContactAgent } from './ContactAgent';
import { suggestedPrompts } from '../../lib/aiEngine';
import { links } from '../../data/portfolio';

const quickActions = [
  { label: 'Contact Deepthi', query: 'Contact Deepthi' },
  { label: 'Open GitHub', href: links.github },
  { label: 'View Projects', query: 'Show me her projects' },
  { label: 'View Skills', query: 'What technologies does she know?' },
];

export const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, isTyping, sendMessage, addAssistantMessage, resetChat } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Tracks whether the pending query originated from voice (to auto-speak the reply)
  const voiceQueryRef = useRef(false);
  const lastSpokenIdRef = useRef<string | null>(null);

  const {
    voiceState,
    audioLevel,
    error: voiceError,
    supported: voiceSupported,
    voiceEnabled,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    replayLast,
    canReplay,
    toggleVoiceEnabled,
    clearError,
  } = useVoice({
    onTranscript: (text) => {
      voiceQueryRef.current = true;
      sendMessage(text);
    },
  });

  // Auto-speak assistant replies that answer voice queries
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (
      last &&
      last.role === 'assistant' &&
      last.id !== 'welcome' &&
      voiceQueryRef.current &&
      lastSpokenIdRef.current !== last.id
    ) {
      lastSpokenIdRef.current = last.id;
      voiceQueryRef.current = false;
      speak(last.content);
    }
  }, [messages, speak]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping, voiceState]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  // Listen for external open-chat-assistant events
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-chat-assistant', handleOpen);
    return () => window.removeEventListener('open-chat-assistant', handleOpen);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      if (window.innerWidth < 640) setIsOpen(false);
    }
  };

  const showSuggestions = messages.length <= 1;

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        className="fixed bottom-6 right-6 z-[95] w-12 h-12 rounded-2xl bg-foreground/90 backdrop-blur-xl border border-primary/40 shadow-[0_0_25px_rgba(0,245,255,0.25)] flex items-center justify-center text-primary hover:shadow-[0_0_35px_rgba(0,245,255,0.4)] transition-shadow"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.span>
          ) : (
            <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Bot size={26} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Status pulse */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary border-2 border-background" />
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="dialog"
            aria-label="NOVA AI assistant chat"
            className="fixed z-[94] bottom-20 right-2 left-2 sm:left-auto sm:right-6 sm:w-[380px] max-h-[70dvh] sm:max-h-[min(600px,calc(100dvh-130px))] flex flex-col rounded-2xl overflow-hidden border border-primary/25 bg-background/95 backdrop-blur-2xl shadow-[0_8px_60px_rgba(0,245,255,0.18)]"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 bg-foreground/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={
                    voiceState === 'speaking'
                      ? { scale: [1, 1.08, 1] }
                      : { scale: 1 }
                  }
                  transition={
                    voiceState === 'speaking'
                      ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
                      : { duration: 0.2 }
                  }
                  className={`relative w-9 h-9 rounded-xl bg-primary/10 border flex items-center justify-center transition-all duration-500 ${
                    voiceState === 'speaking'
                      ? 'border-primary shadow-[0_0_18px_rgba(0,245,255,0.45)]'
                      : 'border-primary/30'
                  }`}
                >
                  <Bot size={18} className="text-primary" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
                  {voiceState === 'speaking' && (
                    <motion.span
                      animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                      className="absolute inset-0 rounded-xl border border-primary"
                    />
                  )}
                </motion.div>
                <div>
                  <p className="font-display font-bold text-sm text-white leading-none">NOVA</p>
                  <p className="text-[9px] font-mono text-primary/70 uppercase tracking-[0.2em] mt-1">
                    {voiceState === 'listening'
                      ? 'Listening • Voice Link Active'
                      : voiceState === 'processing'
                      ? 'Decoding Speech...'
                      : voiceState === 'loading'
                      ? 'Synthesizing Voice...'
                      : voiceState === 'speaking'
                      ? 'AI Responding...'
                      : 'Portfolio Intelligence • Online'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {canReplay && voiceEnabled && voiceState === 'idle' && (
                  <button
                    onClick={replayLast}
                    aria-label="Replay last AI voice response"
                    className="p-2 rounded-lg text-muted hover:text-primary hover:bg-white/5 transition-colors"
                  >
                    <RotateCcw size={13} className="scale-x-[-1]" />
                  </button>
                )}
                <button
                  onClick={toggleVoiceEnabled}
                  aria-label={voiceEnabled ? 'Mute AI voice responses' : 'Enable AI voice responses'}
                  className={`p-2 rounded-lg hover:bg-white/5 transition-colors ${
                    voiceEnabled ? 'text-primary' : 'text-muted'
                  }`}
                >
                  {voiceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                </button>
                <button
                  onClick={resetChat}
                  aria-label="Reset conversation"
                  className="p-2 rounded-lg text-muted hover:text-primary hover:bg-white/5 transition-colors"
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            >
              {messages.map((msg, idx) => (
                <div key={msg.id} className="space-y-3">
                  <ChatMessageBubble message={msg} onNavigate={handleNavigate} />

                  {/* SECURE_COMMUNICATION_MODE — embedded form on the latest contact message */}
                  {msg.action === 'contact' && idx === messages.length - 1 && (
                    <ContactAgent
                      defaultPurpose={msg.contactPurpose}
                      onComplete={({ name, purpose }) =>
                        addAssistantMessage(
                          `Transmission archived under "${purpose}", ${name}. Deepthi will respond through your return channel shortly. Anything else I can help you explore?`
                        )
                      }
                    />
                  )}

                  {/* Intelligent intent suggestion → quick action to open secure mode */}
                  {msg.action === 'suggest-contact' && idx === messages.length - 1 && (
                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      onClick={() =>
                        addAssistantMessage(
                          'Secure Communication Channel Activated. Initializing Transmission Interface...',
                          { action: 'contact', contactPurpose: msg.contactPurpose }
                        )
                      }
                      className="ml-9 group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/40 text-primary text-[11px] font-display font-bold uppercase tracking-[0.15em] hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(0,245,255,0.25)] transition-all active:scale-[0.98]"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                      </span>
                      Open Secure Communication Mode
                    </motion.button>
                  )}
                </div>
              ))}
              <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>

              {/* Suggested prompts + quick actions */}
              {showSuggestions && !isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4 pt-2"
                >
                  <div className="space-y-2">
                    <p className="text-[9px] font-mono text-muted uppercase tracking-[0.25em] flex items-center gap-1.5">
                      <Sparkles size={10} className="text-primary" /> Suggested queries
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => sendMessage(prompt)}
                          className="text-[11px] px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary/80 hover:bg-primary/15 hover:text-primary hover:border-primary/40 transition-all"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[9px] font-mono text-muted uppercase tracking-[0.25em]">
                      ⚡ Quick actions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickActions.map((action) =>
                        action.href ? (
                          <a
                            key={action.label}
                            href={action.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] px-3 py-1.5 rounded-full bg-foreground/60 border border-white/10 text-white/70 hover:text-primary hover:border-primary/40 transition-all"
                          >
                            {action.label}
                          </a>
                        ) : (
                          <button
                            key={action.label}
                            onClick={() => sendMessage(action.query!)}
                            className="text-[11px] px-3 py-1.5 rounded-full bg-foreground/60 border border-white/10 text-white/70 hover:text-primary hover:border-primary/40 transition-all"
                          >
                            {action.label}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Voice Activity Panel */}
            <AnimatePresence>
              {(voiceState !== 'idle' || voiceError) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-primary/20 bg-primary/5 overflow-hidden"
                >
                  {voiceError ? (
                    <div className="px-4 py-3 flex items-center justify-between gap-3">
                      <p className="text-[10px] font-mono text-red-400 uppercase tracking-wider">
                        ⚠ {voiceError}
                      </p>
                      <button
                        onClick={clearError}
                        className="text-[10px] font-mono text-muted hover:text-white shrink-0"
                      >
                        DISMISS
                      </button>
                    </div>
                  ) : (
                    <div className="px-4 py-3 flex items-center gap-4">
                      <div className="flex-1">
                        <VoiceVisualizer state={voiceState} level={audioLevel} />
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[9px] font-mono text-primary uppercase tracking-[0.2em] animate-pulse">
                          {voiceState === 'listening'
                            ? '● REC'
                            : voiceState === 'processing'
                            ? 'STT...'
                            : voiceState === 'loading'
                            ? 'SYNTH...'
                            : 'TTS ►'}
                        </p>
                        {voiceState === 'speaking' && (
                          <button
                            onClick={stopSpeaking}
                            className="mt-1 px-2 py-0.5 rounded border border-white/10 text-[9px] font-mono text-muted hover:text-white hover:border-primary/40 uppercase transition-colors"
                          >
                            ■ Stop
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-white/10 bg-foreground/30 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={voiceState === 'listening' ? 'Listening...' : 'Query the system...'}
                aria-label="Chat message"
                maxLength={300}
                disabled={voiceState === 'listening' || voiceState === 'processing'}
                className="flex-1 min-w-0 bg-background/60 border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-muted/60 outline-none transition-colors font-sans disabled:opacity-50"
              />

              {/* Microphone Button */}
              {voiceSupported && (
                <motion.button
                  type="button"
                  onClick={voiceState === 'listening' ? stopListening : startListening}
                  disabled={voiceState === 'processing' || isTyping}
                  aria-label={voiceState === 'listening' ? 'Stop recording' : 'Start voice input'}
                  whileTap={{ scale: 0.9 }}
                  className={`relative w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 ${
                    voiceState === 'listening'
                      ? 'bg-red-500/20 border border-red-500/60 text-red-400'
                      : 'bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/60'
                  }`}
                >
                  {voiceState === 'listening' ? <Square size={14} /> : <Mic size={16} />}
                  {voiceState === 'listening' && (
                    <motion.span
                      animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="absolute inset-0 rounded-xl border-2 border-red-500"
                    />
                  )}
                </motion.button>
              )}

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
                className="w-10 h-10 shrink-0 rounded-xl bg-primary text-background flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-all active:scale-95 shadow-[0_0_12px_rgba(0,245,255,0.3)]"
              >
                <SendHorizonal size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
