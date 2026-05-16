# Qarar — قرار

AI-powered purchase decision assistant for Arabic and English-speaking consumers in the MENA region.

## Features

- **AI Analysis** — Get a scored recommendation (1–10) on any purchase via Claude AI
- **Bilingual** — Full Arabic (RTL) and English (LTR) support
- **Installment Plans** — See 3, 6, and 12-month payment breakdowns
- **Savings Goals** — Track how purchases impact your savings goals
- **Decision History** — Review past decisions and estimated savings
- **PWA** — Install on any device, works offline after first load

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure your API key

Copy `.env.example` to `.env` and add your Anthropic API key:

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_GEMINI_API_KEY=AIza...
```

Get your free API key at [aistudio.google.com](https://aistudio.google.com) → Get API key.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production

```bash
npm run build
```

Output is in the `/dist` folder. Serve it with any static host (Vercel, Netlify, Cloudflare Pages, etc.).

## Tech Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v3 (custom navy/gold palette)
- `@google/generative-ai` — Gemini 1.5 Flash for AI analysis (free tier)
- `vite-plugin-pwa` — Service worker + Web App Manifest
- localStorage — No backend required

## Project Structure

```
src/
  components/       # BottomNav, ScoreCard, LoadingSpinner
  screens/          # OnboardingScreen, DecisionScreen, HistoryScreen, GoalsScreen, SettingsScreen
  types/            # TypeScript interfaces
  utils/            # claudeApi.ts, i18n.ts, storage.ts
  App.tsx           # Root component and router
  main.tsx          # Entry point
  index.css         # Tailwind directives
```

## Security Note

The API key is used directly in the browser. This is appropriate for personal/demo use. For a production deployment with multiple users, proxy the API calls through a backend server.
