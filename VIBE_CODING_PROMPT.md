# ETC App Coding Brief

Use this brief when asking an AI coding tool to continue the project.

## Project

Build and polish a professional presentation app for the Enabling Technology Collaboratory (ETC) at Temasek Polytechnic. The app should support visitor walkthroughs, project browsing, partner discovery, and an AI avatar assistant that can answer ETC-specific questions.

## Current Stack

- React 19 with Vite
- React Router v7
- Plain CSS with custom properties
- Three.js through the local `vendor/avatar-model` package
- Express API server
- OpenAI API for GPT, STT, and TTS

## Current App Structure

```text
src/App.jsx
src/main.jsx
src/components/
  AnimatedCounter.jsx
  BackButton.jsx
  CharacterViewer.jsx
  HomeAssistant.jsx
  LiveClock.jsx
  NetworkBackground.jsx
  TypewriterText.jsx
src/hooks/
  useGPT.js
  useSoundEffects.js
src/pages/
  LandingPage.jsx
  Home.jsx
  Introduction.jsx
  OurPartners.jsx
  OurProjects.jsx
  ProjectDetail.jsx
  DemoProject.jsx
  CollaborationOpportunities.jsx
src/styles/
api/
  gpt.js
  stt.js
  tts.js
```

## Routes

```text
/                                      Landing page
/Home                                  Main navigation hub
/Introduction                          ETC overview
/OurPartners                           Internal and external partners
/OurProjects                           Project hub
/OurProjects/ProjectDetail             Searchable/filterable project portfolio
/OurProjects/DemoProject               Smart Wheelchair featured demo
/OurProjects/CollaborationOpportunities Collaboration options
```

## Design Direction

- Keep the light, professional presentation feel.
- Use the existing CSS variables in `src/styles/App.css`.
- Keep controls compact and scannable; this is a demo tool, not a marketing landing page.
- Prefer stable dimensions for cards, controls, buttons, media, and avatar areas.
- Avoid adding new decorative visual noise unless it directly helps comprehension.

## Assistant Behavior

The assistant lives in `HomeAssistant.jsx`, uses `CharacterViewer.jsx`, and must stay ETC-scoped. It supports typed questions, microphone transcription, quick prompts, TTS narration, and navigation tags such as `[NAV_/OurProjects]`.

When adding new navigable pages, update:

- `src/App.jsx`
- the visible navigation card/list
- `VALID_NAV_ROUTES` in `HomeAssistant.jsx`
- the navigation instructions in `SYSTEM_INSTRUCTIONS`

## Quality Bar

Before handoff, run:

```bash
npm run lint
npm run build
```

Also verify the main routes in a browser, especially the global assistant, project filters, expanded project cards, and featured demo video fallback.

## Git & Deployment

When the user asks to upload to GitHub or complete a task, always perform these two steps:

1. **Push to Both Remotes**:
   - `git push origin main`
   - `git push etc main`

2. **Deploy to the Server**:
   - Connect via SSH: `ssh -i /Users/tinnapatchennil/Downloads/tp-etc-demos.pem ubuntu@13.214.134.91`
   - Path on server: `/home/ubuntu/VR-presentation-main`
   - Steps on server:
     ```bash
     cd /home/ubuntu/VR-presentation-main
     git pull origin main
     npm install
     npm run build
     pm2 restart etc-app
     ```
   - Live URL: http://13.214.134.91:20356

