/// <reference types="vite/client" />

interface ImportMetaEnv {
  // LLM chat (optional)
  readonly VITE_AI_API_KEY?: string;
  readonly VITE_AI_API_URL?: string;
  readonly VITE_AI_MODEL?: string;

  // Sarvam AI voice (optional)
  readonly VITE_SARVAM_API_KEY?: string;
  readonly VITE_SARVAM_TTS_SPEAKER?: string;
  readonly VITE_SARVAM_LANGUAGE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
