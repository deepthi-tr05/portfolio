import {
  profile,
  skills,
  projects,
  experience,
  certifications,
  links,
  sections,
} from "../data/portfolio";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Optional section id the UI can offer to scroll to */
  navigateTo?: string;
  /** Optional UI action: open the secure form, or suggest opening it */
  action?: "contact" | "suggest-contact";
  /** Smart-detected purpose to pre-fill the communication form */
  contactPurpose?: string;
}

/* ────────────────────────────────────────────
   REMOTE LLM INTEGRATION (optional, env-based)
   Set VITE_AI_API_KEY (+ optionally VITE_AI_API_URL /
   VITE_AI_MODEL) to route through any OpenAI-compatible API.
   Falls back to the local intelligence engine when absent.
──────────────────────────────────────────── */

const API_KEY = import.meta.env.VITE_AI_API_KEY as string | undefined;
const API_URL =
  (import.meta.env.VITE_AI_API_URL as string | undefined) ??
  "https://api.openai.com/v1/chat/completions";
const MODEL = (import.meta.env.VITE_AI_MODEL as string | undefined) ?? "gpt-4o-mini";

const buildSystemPrompt = (): string => `You are NOVA, the AI assistant embedded in ${profile.name}'s portfolio (an AI Control Center themed site).
You guide visitors, answer questions about ${profile.name}, and keep replies concise (2-4 short sentences), intelligent, and futuristic but professional. Never invent facts.

CRITICAL: You are only allowed to answer questions related to ${profile.name}'s profile (her background, education, projects, skills, certifications, experience, interests, GitHub, LinkedIn, and Linktree). If the user asks about anything else outside of her profile (e.g. general programming, math, history, jokes, or generic advice), you must politely decline to answer and redirect them to ask about ${profile.name}'s portfolio.

PROFILE: ${profile.name} — ${profile.role}. ${profile.education.level} at ${profile.education.institute}. Specialization: ${profile.education.specialization}. ${profile.objective}
INTERESTS: ${profile.interests.join(", ")}.
SKILLS: ${Object.entries(skills).map(([k, v]) => `${k}: ${v.join(", ")}`).join(" | ")}.
PROJECTS: ${projects.map((p) => `${p.title} [${p.stack.join(", ")}] — ${p.description}`).join(" || ")}
EXPERIENCE: ${experience.map((e) => `${e.role} @ ${e.company} (${e.duration}) — ${e.summary}`).join(" || ")}
CERTIFICATIONS: ${certifications.join("; ")}.
GITHUB: ${links.github}.
LINKEDIN: ${links.linkedin}.
LINKTREE: ${links.linktree}.
SITE SECTIONS (anchor ids): ${Object.entries(sections).map(([id, name]) => `#${id} = ${name}`).join(", ")}.`;

async function remoteReply(history: ChatMessage[]): Promise<string | null> {
  if (!API_KEY) return null;
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 220,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          ...history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

/* ────────────────────────────────────────────
   LOCAL INTELLIGENCE ENGINE (fallback)
   Intent matching over the knowledge base —
   data driven, zero hardcoded essays.
──────────────────────────────────────────── */

interface LocalReply {
  content: string;
  navigateTo?: string;
  action?: "contact" | "suggest-contact";
  contactPurpose?: string;
}

const has = (q: string, ...terms: string[]) => terms.some((t) => q.includes(t));

/* ── SECURE_COMMUNICATION_MODE intent detection ── */

export const SECURE_ACTIVATION_TEXT =
  "Secure Communication Channel Activated. Initializing Transmission Interface...";

/** Smart purpose detection for the communication form */
function detectPurpose(q: string): string | null {
  if (has(q, "hire", "hiring", "recruit", "job offer", "need a developer", "need an aiml", "need aiml", "looking for a developer", "work opportunity")) return "Hiring Opportunity";
  if (has(q, "intern")) return "Internship";
  if (has(q, "collaborat", "team up", "partner")) return "Collaboration";
  if (has(q, "freelance", "have a project", "project for you", "project idea")) return "Freelance Project";
  if (has(q, "network", "let's connect", "lets connect")) return "Networking";
  if (has(q, "technical discussion", "discuss tech", "talk about ai", "discuss ai")) return "Technical Discussion";
  return null;
}

/**
 * Returns a contact intent when detected:
 * - "contact": direct activation phrases → open the form immediately
 * - "suggest-contact": softer signals (hiring/collab/etc.) → offer a quick action
 */
function contactIntent(q: string): { action: "contact" | "suggest-contact"; purpose?: string } | null {
  const purpose = detectPurpose(q) ?? undefined;

  const direct = has(
    q,
    "contact",
    "send message",
    "send a message",
    "send her a message",
    "reach out",
    "get in touch",
    "let's connect",
    "lets connect",
    "custom message",
    "email deepthi",
    "message deepthi",
    "hire deepthi",
    "work opportunity",
    "internship opportunity",
    "project collaboration"
  );
  if (direct) return { action: "contact", purpose };

  // Soft intent → suggest opening secure mode
  if (purpose && has(q, "hire", "hiring", "recruit", "collaborat", "freelance", "have a project", "project for you", "need a developer", "need aiml", "need an aiml", "discuss internship", "internship at", "job offer", "team up", "partner")) {
    return { action: "suggest-contact", purpose };
  }

  return null;
}

function localReply(query: string, history: ChatMessage[]): LocalReply {
  const q = query.toLowerCase();

  // Greetings
  if (has(q, "hello", "hi ", "hey") || q === "hi") {
    return {
      content: `Systems online. I'm NOVA — ${profile.name}'s portfolio intelligence. Ask me about her projects, skills, certifications, or experience, and I'll route you to the right module.`,
    };
  }

  // SECURE_COMMUNICATION_MODE — checked early (high-value intent)
  const contact = contactIntent(q);
  if (contact?.action === "contact") {
    return {
      content: SECURE_ACTIVATION_TEXT,
      action: "contact",
      contactPurpose: contact.purpose,
    };
  }
  if (contact?.action === "suggest-contact") {
    return {
      content: `${contact.purpose} signal detected. I can open a secure transmission channel to ${profile.name} right now — initialize Secure Communication Mode below.`,
      action: "suggest-contact",
      contactPurpose: contact.purpose,
    };
  }

  // About / introduction
  if (has(q, "about", "who is", "introduce", "tell me about deepthi", "background")) {
    return {
      content: `${profile.name} is a ${profile.education.level.toLowerCase()} specializing in ${profile.education.specialization} at ${profile.education.institute}. ${profile.objective}`,
      navigateTo: "core",
    };
  }

  // Specific projects
  const project = projects.find(
    (p) =>
      q.includes(p.id.replace("-", " ")) ||
      p.title.toLowerCase().split(" ").filter((w) => w.length > 3).some((w) => q.includes(w))
  );
  if (project && has(q, "project", "explain", "detect", "tumor", "hostel", "chatbot", "vr", "cnn", "visualization")) {
    return {
      content: `📁 ${project.title} [${project.category}] — ${project.description} Stack: ${project.stack.join(", ")}.${project.highlight ? ` ${project.highlight}` : ""}`,
      navigateTo: project.sectionId,
    };
  }

  // All projects
  if (has(q, "project", "built", "portfolio work", "showcase", "case")) {
    return {
      content: `Project archive contains ${projects.length} case files: ${projects.map((p) => p.title).join(" • ")}. Ask about any of them by name for a full analysis.`,
      navigateTo: "projects",
    };
  }

  // Skills / technologies
  if (has(q, "skill", "technolog", "stack", "language", "framework", "know", "tools")) {
    const summary = Object.entries(skills)
      .map(([cat, list]) => `${cat}: ${list.join(", ")}`)
      .join(" • ");
    return {
      content: `Capability matrix synced. ${summary}.`,
      navigateTo: "skills",
    };
  }

  // Certifications
  if (has(q, "certif", "credential", "aws", "salesforce", "google cloud")) {
    return {
      content: `Verified credentials on record: ${certifications.join(" • ")}. All signatures validated in the Credential Vault.`,
      navigateTo: "certifications",
    };
  }

  // Experience / internship
  if (has(q, "experience", "intern", "work", "company", "hlt", "job")) {
    const e = experience[0];
    return {
      content: `Deployment history: ${e.role} at ${e.company} (${e.duration}). ${e.summary}`,
      navigateTo: "experience",
    };
  }

  // GitHub
  if (has(q, "github", "repo", "code", "source")) {
    return {
      content: `Code intelligence feed available at ${links.github}. Highlighted repositories include Brain-Tumor-Detection, Hostel-Management-PHP and the Flask AI Chatbot.`,
      navigateTo: "github",
    };
  }

  // Interests / career
  if (has(q, "interest", "career", "goal", "passion", "future", "research")) {
    return {
      content: `Career trajectory locked on: ${profile.interests.join(", ")}. The Experimental AI Lab section showcases her active research directions.`,
      navigateTo: "lab",
    };
  }



  // Education
  if (has(q, "education", "college", "study", "gsss", "university", "degree")) {
    return {
      content: `${profile.name} is a ${profile.education.level} at ${profile.education.institute}, specializing in ${profile.education.specialization}.`,
      navigateTo: "core",
    };
  }

  // Contextual follow-up: if last assistant message referenced a project
  const lastAssistant = [...history].reverse().find((m) => m.role === "assistant");
  if (has(q, "more", "detail", "tell me more") && lastAssistant?.navigateTo) {
    const ref = projects.find((p) => p.sectionId === lastAssistant.navigateTo);
    if (ref) {
      return {
        content: `Expanding case file: ${ref.title} uses ${ref.stack.join(", ")}. ${ref.description}`,
        navigateTo: ref.sectionId,
      };
    }
  }

  // Default
  return {
    content: `Query outside indexed parameters. I can brief you on: Deepthi's profile, projects (e.g. "Brain Tumor Detection"), skills, certifications, internship experience, or GitHub activity. Which module shall I open?`,
  };
}

/* ────────────────────────────────────────────
   PUBLIC API
──────────────────────────────────────────── */

export async function generateReply(
  history: ChatMessage[]
): Promise<LocalReply> {
  const lastUser = [...history].reverse().find((m) => m.role === "user");
  if (!lastUser) return { content: "Awaiting input..." };

  // Contact intent is always detected locally so SECURE_COMMUNICATION_MODE
  // works regardless of the reply engine.
  const intent = contactIntent(lastUser.content.toLowerCase());

  // First check if we have a direct local match (greetings, projects, skills, etc.)
  const local = localReply(lastUser.content, history);
  
  // If it is NOT the default "outside parameters" message, return the local reply immediately
  const isDefaultFallback = local.content.startsWith("Query outside indexed parameters");
  if (!isDefaultFallback) {
    // Return local response (simulating small delay for human feel)
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));
    return {
      ...local,
      action: intent?.action ?? local.action,
      contactPurpose: intent?.purpose ?? local.contactPurpose,
    };
  }

  // If local did not match, use Groq (remote) LLM
  const remote = await remoteReply(history);
  if (remote) {
    return {
      content: remote,
      action: intent?.action,
      contactPurpose: intent?.purpose,
    };
  }

  // Fallback to local default if remote is unavailable/fails
  return {
    ...local,
    action: intent?.action ?? local.action,
    contactPurpose: intent?.purpose ?? local.contactPurpose,
  };
}

export const suggestedPrompts = [
  "Tell me about Deepthi",
  "Explain the Brain Tumor project",
  "What technologies does she know?",
  "What certifications does she have?",
];
