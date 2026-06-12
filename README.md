# Deepthi T R — AI Control Center Portfolio

A futuristic, interactive portfolio themed as an AI Control Center. It features real-time voice synthesis and speech recognition, a dynamic conversational AI assistant with custom profile restrictions, live GitHub analytics fetching, and secure contact form transmission.

## 🚀 Key Features

- **Biometric Scanner HUD:** Interactive scanner interface that loads the user profile credentials on scroll.
- **NOVA Conversational Assistant:** An AI chatbot that guides visitors. It uses a fast local search index for portfolio queries and queries the Groq API as a fallback, constrained to only discuss profile-related details.
- **Real-Time Voice Assistant:** Integrates Sarvam AI (Saarika STT + Bulbul TTS) for high-fidelity speech recognition and text-to-speech. Gracefully falls back to browser Web Speech APIs if keys are unavailable.
- **Dynamic GitHub Dashboard:** Queries the GitHub API on-the-fly to calculate public repositories, cumulative stars, language distribution, and display clickable featured repository cards.
- **Secure Communication Mode:** Encrypted transmission interface using EmailJS REST API for direct message dispatching to the inbox.
- **Single-File Bundling:** Vite configured to compile all JS and CSS directly into a single inlined HTML file for lightning-fast loading and easy hosting.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite 7 + TypeScript 5
- **Styling:** Tailwind CSS v4 + Vanilla CSS Custom Themes
- **Animations:** Framer Motion 12
- **Icons:** Lucide React
- **APIs:** Groq API (LLM), Sarvam AI (STT/TTS), EmailJS (Contact Form), GitHub REST API

---

## ⚙️ Environment Variables Setup

Create a `.env` or `.env.local` file in the root directory and define the following variables:

```env
# Groq LLM API Key (OpenAI-compatible)
VITE_AI_API_KEY=your_groq_api_key_here
VITE_AI_API_URL=https://api.groq.com/openai/v1/chat/completions
VITE_AI_MODEL=llama-3.3-70b-specdec

# Sarvam Voice API Key (STT/TTS)
VITE_SARVAM_API_KEY=your_sarvam_api_key_here
VITE_SARVAM_TTS_SPEAKER=anushka
VITE_SARVAM_LANGUAGE=en-IN

# EmailJS Service Integration
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key_here
```

---

## 💻 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/deepthi-tr05/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build the production bundle:**
   ```bash
   npm run build
   ```
   Outputs the built inlined bundle to the `dist/` directory.

---

## 🌐 Deployment on Vercel

This project is fully ready for deployment on the Vercel free tier:
1. Connect your GitHub repository to Vercel.
2. In the Vercel Dashboard, set the build command to `npm run build` and output directory to `dist`.
3. Add your environment variables (from `.env.local`) to the Vercel project settings.
4. Deploy!
