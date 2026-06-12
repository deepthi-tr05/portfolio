import { useState, useRef, useCallback, useEffect } from 'react';
import { sarvamTranscribe, sarvamSpeak, hasSarvamKey } from '../../lib/sarvamVoice';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'loading' | 'speaking';

interface UseVoiceOptions {
  onTranscript: (text: string) => void;
}

/** Minimal typings for the Web Speech API fallback */
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

const getWebSpeechRecognition = (): SpeechRecognitionLike | null => {
  const w = window as unknown as Record<string, unknown>;
  const Ctor = (w.SpeechRecognition ?? w.webkitSpeechRecognition) as
    | (new () => SpeechRecognitionLike)
    | undefined;
  return Ctor ? new Ctor() : null;
};

export const useVoice = ({ onTranscript }: UseVoiceOptions) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const rafRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playerRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const supported =
    typeof navigator !== 'undefined' &&
    (Boolean(navigator.mediaDevices?.getUserMedia) || Boolean(getWebSpeechRecognition()));

  /* ── cleanup helpers ───────────────────────── */

  const stopMeter = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setAudioLevel(0);
    analyserRef.current = null;
    if (audioCtxRef.current?.state !== 'closed') audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
  }, []);

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const stopPlayback = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current = null;
    }
    window.speechSynthesis?.cancel();
  }, []);

  /* ── live audio level for waveform ─────────── */

  const startMeter = useCallback((stream: MediaStream) => {
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setAudioLevel(Math.min(1, avg / 90));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      /* meter is decorative — ignore failures */
    }
  }, []);

  /* ── speech-to-text ────────────────────────── */

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    recognitionRef.current?.stop();
    stopMeter();
  }, [stopMeter]);

  const startListening = useCallback(async () => {
    setError(null);
    stopPlayback();

    // Preferred path: record audio → Sarvam STT
    if (hasSarvamKey() && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        startMeter(stream);

        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = async () => {
          releaseStream();
          setVoiceState('processing');
          const mimeType = recorder.mimeType || 'audio/webm';
          // Sarvam rejects 'audio/webm;codecs=opus', so we strip everything after the semicolon
          const cleanMimeType = mimeType.split(';')[0];
          const blob = new Blob(chunksRef.current, { type: cleanMimeType });
          
          console.log('[Voice STT] Recording stopped');
          console.log(`[Voice STT] Blob size: ${blob.size} bytes`);
          console.log(`[Voice STT] MIME type: ${cleanMimeType} (original: ${mimeType})`);

          if (blob.size === 0) {
            console.error('[Voice STT] Error: Blob is empty');
            setError('Transcription failed. Try again or type your query.');
            setVoiceState('idle');
            return;
          }

          const transcript = await sarvamTranscribe(blob);
          setVoiceState('idle');
          if (transcript) {
            console.log('[Voice STT] Transcription success:', transcript);
            onTranscript(transcript);
          } else {
            console.error('[Voice STT] Transcription failed (null returned)');
            setError('Transcription failed. Try again or type your query.');
          }
        };

        recorder.start();
        console.log('[Voice STT] Recording started');
        setVoiceState('listening');

        // Safety auto-stop at 15s
        setTimeout(() => {
          if (mediaRecorderRef.current?.state === 'recording') stopListening();
        }, 15000);
        return;
      } catch {
        releaseStream();
        stopMeter();
        // fall through to Web Speech fallback
      }
    }

    // Fallback path: browser Web Speech API
    const recognition = getWebSpeechRecognition();
    if (recognition) {
      recognitionRef.current = recognition;
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) onTranscript(transcript);
      };
      recognition.onerror = () => {
        setError('Voice capture failed. Check microphone permissions.');
        setVoiceState('idle');
      };
      recognition.onend = () => {
        stopMeter();
        setVoiceState((s) => (s === 'listening' ? 'idle' : s));
      };

      // Decorative meter via mic stream (best effort)
      navigator.mediaDevices
        ?.getUserMedia({ audio: true })
        .then((stream) => {
          streamRef.current = stream;
          startMeter(stream);
        })
        .catch(() => {});

      recognition.start();
      setVoiceState('listening');
      return;
    }

    setError('Voice input is not supported in this browser.');
  }, [onTranscript, releaseStream, startMeter, stopListening, stopMeter, stopPlayback]);

  /* ── text-to-speech ────────────────────────── */

  const lastSpokenTextRef = useRef<string | null>(null);

  const speak = useCallback(
    async (text: string) => {
      if (!voiceEnabled || !text) return;
      stopPlayback();
      lastSpokenTextRef.current = text;

      // Voice loading state while Sarvam synthesizes
      setVoiceState('loading');

      // Preferred: Sarvam Bulbul TTS
      const url = await sarvamSpeak(text);
      if (url) {
        const audio = new Audio(url);
        playerRef.current = audio;
        audio.onended = () => {
          URL.revokeObjectURL(url);
          setVoiceState('idle');
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          setVoiceState('idle');
        };
        try {
          await audio.play();
          setVoiceState('speaking');
          return;
        } catch {
          /* autoplay blocked — fall through */
        }
      }

      // Fallback: browser speech synthesis
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.02;
        utterance.pitch = 1;
        utterance.onstart = () => setVoiceState('speaking');
        utterance.onend = () => setVoiceState('idle');
        utterance.onerror = () => setVoiceState('idle');
        window.speechSynthesis.speak(utterance);
        return;
      }

      setVoiceState('idle');
    },
    [stopPlayback, voiceEnabled]
  );

  /** Replay the most recent AI voice response */
  const replayLast = useCallback(() => {
    if (lastSpokenTextRef.current) speak(lastSpokenTextRef.current);
  }, [speak]);

  const canReplay = Boolean(lastSpokenTextRef.current);

  const stopSpeaking = useCallback(() => {
    stopPlayback();
    setVoiceState('idle');
  }, [stopPlayback]);

  const toggleVoiceEnabled = useCallback(() => {
    setVoiceEnabled((v) => {
      if (v) stopPlayback();
      return !v;
    });
    setVoiceState('idle');
  }, [stopPlayback]);

  /* ── unmount cleanup ───────────────────────── */
  useEffect(() => {
    return () => {
      stopPlayback();
      releaseStream();
      stopMeter();
      recognitionRef.current?.abort();
    };
  }, [releaseStream, stopMeter, stopPlayback]);

  return {
    voiceState,
    audioLevel,
    error,
    supported,
    voiceEnabled,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    replayLast,
    canReplay,
    toggleVoiceEnabled,
    clearError: () => setError(null),
  };
};
