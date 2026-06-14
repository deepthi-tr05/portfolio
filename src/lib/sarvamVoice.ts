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
const TTS_SPEAKER = (import.meta.env.VITE_SARVAM_TTS_SPEAKER as string | undefined) ?? "shreya";

export const hasSarvamKey = (): boolean => Boolean(SARVAM_KEY);

/** Transcribe recorded audio via Sarvam STT. Returns transcript or null on failure. */
export async function sarvamTranscribe(audio: Blob): Promise<string | null> {
  if (!SARVAM_KEY) {
    console.error('[Sarvam STT] Error: Missing API Key');
    return null;
  }
  try {
    console.log('[Sarvam STT] Preparing API request...');
    const form = new FormData();
    
    let ext = "webm";
    if (audio.type.includes("mp4")) ext = "mp4";
    else if (audio.type.includes("wav")) ext = "wav";
    else if (audio.type.includes("ogg")) ext = "ogg";
    else if (audio.type.includes("mpeg") || audio.type.includes("mp3")) ext = "mp3";
    
    form.append("file", audio, `speech.${ext}`);
    form.append("model", "saaras:v3");
    form.append("language_code", LANGUAGE);
    form.append("mode", "transcribe");

    console.log(`[Sarvam STT] File appended as speech.${ext}, sending request...`);

    const res = await fetch(`${SARVAM_BASE}/speech-to-text`, {
      method: "POST",
      headers: { "api-subscription-key": SARVAM_KEY },
      body: form,
    });
    
    console.log(`[Sarvam STT] API request sent. Status: ${res.status}`);
    
    if (!res.ok) {
      const errText = await res.text();
      console.error(`[Sarvam STT] API Error (${res.status}):`, errText);
      return null;
    }
    const data = await res.json();
    console.log('[Sarvam STT] API Response:', data);
    return (data?.transcript as string)?.trim() || null;
  } catch (err) {
    console.error('[Sarvam STT] Network or Parsing Error:', err);
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
        text: text.slice(0, 480),
        target_language_code: LANGUAGE,
        speaker: TTS_SPEAKER,
        model: "bulbul:v3",
        pace: 1.0,
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
