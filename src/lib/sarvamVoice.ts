/**
 * SARVAM AI VOICE UTILITIES
 * Speech-to-Text (Saarika/Saaras) + Text-to-Speech (Bulbul)
 * Docs: https://docs.sarvam.ai
 *
 * Configure via .env.local:
 *   VITE_SARVAM_API_KEY=your-key
 * Optional:
 *   VITE_SARVAM_TTS_SPEAKER=anushka
 *   VITE_SARVAM_LANGUAGE=en-IN
 *
 * When no key is present, callers should fall back to the
 * browser's Web Speech APIs (handled in useVoice).
 */

const SARVAM_KEY = import.meta.env.VITE_SARVAM_API_KEY as string | undefined;
const SARVAM_BASE = "https://api.sarvam.ai";
const LANGUAGE = (import.meta.env.VITE_SARVAM_LANGUAGE as string | undefined) ?? "en-IN";
const TTS_SPEAKER = (import.meta.env.VITE_SARVAM_TTS_SPEAKER as string | undefined) ?? "anushka";

export const hasSarvamKey = (): boolean => Boolean(SARVAM_KEY);

/** Transcribe recorded audio via Sarvam STT. Returns transcript or null on failure. */
export async function sarvamTranscribe(audio: Blob): Promise<string | null> {
  if (!SARVAM_KEY) return null;
  try {
    const form = new FormData();
    form.append("file", audio, "speech.webm");
    form.append("model", "saarika:v2.5");
    form.append("language_code", LANGUAGE);

    const res = await fetch(`${SARVAM_BASE}/speech-to-text`, {
      method: "POST",
      headers: { "api-subscription-key": SARVAM_KEY },
      body: form,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.transcript as string)?.trim() || null;
  } catch {
    return null;
  }
}

/** Synthesize speech via Sarvam TTS. Returns a playable object URL or null. */
export async function sarvamSpeak(text: string): Promise<string | null> {
  if (!SARVAM_KEY) return null;
  try {
    const res = await fetch(`${SARVAM_BASE}/text-to-speech`, {
      method: "POST",
      headers: {
        "api-subscription-key": SARVAM_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Keep payload within API limits (500 chars per input)
        inputs: [text.slice(0, 480)],
        target_language_code: LANGUAGE,
        speaker: TTS_SPEAKER,
        model: "bulbul:v2",
        pace: 1.0,
        loudness: 1.0,
        speech_sample_rate: 22050,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const b64 = data?.audios?.[0] as string | undefined;
    if (!b64) return null;

    // base64 WAV → object URL
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: "audio/wav" });
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}
