# ETC Presentation Web App — Vibe Coding Prompt

## Project Context

Build a **professional, light-themed presentation web application** for the
**Enabling Technology Collaboratory (ETC)** — a Centre of Excellence under the
School of Engineering at Temasek Polytechnic, Singapore.

The app solves a real problem: **presenters repeat the same introduction and
project overview multiple times per day**. This app lets visitors browse ETC's
content self-serve, while an AI avatar (VR/3D) narrates each section.

Reference website: https://www.tp.edu.sg/research-and-industry/centres-of-excellence/centres-under-school-of-engineering/enabling-technology-collaboratory-etc.html

---

## Tech Stack

- **Framework**: React 19 with Vite (NOT Create React App)
- **Routing**: React Router v7 (BrowserRouter, Routes, Route)
- **Styling**: Plain CSS with CSS custom properties (no Tailwind, no CSS-in-JS)
- **3D Graphics**: Three.js with @react-three/fiber and @react-three/drei
- **Fonts**: Inter (system font stack with fallbacks)
- **Build**: `npm run dev` starts the Vite dev server on port 5173

---

## Design Direction

- **Theme**: Hi-tech light (`#f5f5f7`) — clean, professional, modern
- **Accent**: Teal (`#1f7a6b`) + Violet (`#7c3aed`) + Emerald (`#059669`)
- **Typography**: Inter font family (system font with excellent readability)
- **Cards**: Glass-morphism with subtle transparency and blur effects
- **Feel**: Like Apple's design language meets modern tech presentation
- **DO NOT**: Use dark themes, harsh colors, or generic "corporate" aesthetics

---

## App Structure

```
src/
├── App.jsx                    ← Root: React Router setup with persistent elements
├── App.css                    ← Global CSS variables, shared component styles
├── main.jsx                   ← Entry point
├── assets/                    ← Static assets (images, etc.)
├── avatar/                    ← Complete 3D avatar system (TypeScript)
│   ├── App.tsx                ← Main avatar component
│   ├── main.tsx               ← Avatar entry point
│   ├── components/            ← Avatar UI components
│   ├── core/                  ← Three.js renderer, controls
│   ├── hooks/                 ← React hooks for avatar logic
│   ├── context/               ← React context for avatar state
│   ├── service/               ← TTS service
│   ├── types/                 ← TypeScript type definitions
│   ├── world/                 ← Lighting setup
│   └── styles/                ← Avatar-specific styles
├── components/
│   ├── AnimatedCounter.jsx    ← Animated number counter
│   ├── BackButton.jsx         ← Reusable back navigation
│   ├── CharacterViewer.jsx    ← 3D avatar wrapper component
│   ├── ETCChatbot.jsx         ← AI chatbot component
│   ├── LiveClock.jsx          ← Live clock display
│   ├── TypewriterText.jsx     ← Typewriter effect text
│   └── VRPlaceholder.jsx      ← Fallback placeholder for avatar
├── pages/
│   ├── LandingPage.jsx        ← Root route with 3D avatar introduction
│   ├── Home.jsx               ← Main navigation hub with bento grid
│   ├── Introduction.jsx       ← Section 01: About ETC
│   ├── OurPartners.jsx        ← Section 02: Partner showcase
│   ├── OurProjects.jsx        ← Section 03: Projects hub
│   ├── ProjectDetail.jsx      ← Section 3.1: Individual project details
│   ├── DemoProject.jsx        ← Section 3.2: Demo project showcase
│   ├── CollaborationOpportunities.jsx  ← Section 3.3: Collaboration info
│   └── QnA.jsx                ← Section 04: AI chatbot interface
├── styles/
│   ├── App.css                ← Global styles and design tokens
│   ├── components/            ← Component-specific styles
│   └── pages/                 ← Page-specific styles
└── library/
    └── lipsyncEN.js           ← Lip sync library for avatar
```

---

## Navigation Flow

```
Landing Page (/)
├── Introduction          → /Introduction
├── Our Partners          → /OurPartners
├── Our Projects          → /OurProjects
│   ├── Each Project      → /OurProjects/ProjectDetail
│   ├── Demo Project      → /OurProjects/DemoProject
│   └── Collaboration     → /OurProjects/CollaborationOpportunities
└── Q&A                   → /QnA
```

Navigation uses React Router with URL paths. The `useNavigate` hook handles routing.

---

## VR/3D Avatar Integration Points

**Every content page** contains a `<CharacterViewer />` component that wraps the 3D avatar system.

### Current Integration:
```jsx
// In pages like LandingPage.jsx, Introduction.jsx, etc.:
<CharacterViewer
  modelPath="/model/FModel1.glb"
  audioUrl="/audio/ETC-landing.mp3"
  script="Welcome message..."
  scale={1.2}
  position={[0, -1, 0]}
/>
```

### Avatar System Architecture:
- **CharacterViewer.jsx**: React wrapper that handles loading states and fallbacks
- **AvatarApp.tsx**: Main TypeScript avatar component with Three.js integration
- **useCharacter.ts**: Hook managing avatar lifecycle, animations, and audio
- **useScene.ts**: Hook managing Three.js scene, camera, renderer, and controls
- **renderer.ts**: Camera and renderer setup with responsive aspect ratios

### Avatar Features:
- GLB model loading with @react-three/drei
- Lip sync animation system
- Text-to-speech integration
- Orbit controls (can be enabled/disabled)
- Responsive camera setup
- Audio playback with drift correction

---

## AI Q&A Chatbot Integration Point

**In `src/pages/QnA.jsx`**, the chatbot is fully implemented as `<ETCChatbot />`.

### Current Implementation:
- Message history with user/AI roles
- Typing indicators
- Auto-scrolling message area
- Form submission handling
- Placeholder AI responses (ready for LLM integration)

### Design spec for chatbot UI:
```
User messages:  right-aligned, glass-morphism background
AI messages:    left-aligned, subtle background
Input:          full-width, rounded input field
Send button:    accent color with hover effects
Font:           Inter, responsive sizing
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 — the app loads the LandingPage with 3D avatar immediately.

---

## Prompts for Each Feature (copy-paste to AI coding tools)

### PROMPT A — If you need to add a new section/page:
```
Add a new page to the ETC presentation app. The app uses React 19 + Vite
with React Router v7. Create the page component in src/pages/[PageName].jsx
matching the existing light hi-tech theme (--bg-dark, --bg-card, --accent-teal CSS vars).
Add the new route to the Routes in App.jsx. Follow the same pattern as existing pages:
BackButton at top, page-header section, then CharacterViewer with avatar, then content.
Use useNavigate hook for navigation.
```

### PROMPT B — If you need to style a new component:
```
Create a React component for the ETC presentation app (React 19 + Vite, no Tailwind).
Match the existing light hi-tech theme: background #f5f5f7, cards rgba(255,255,255,0.78),
accent teal #1f7a6b, accent violet #7c3aed, primary text #1d1d1f, secondary text #6e6e73.
Use Inter font family. Borders are rgba(0,0,0,0.06). Border radius uses --radius-* vars.
Hover states should elevate with --shadow-hover. Use glass-morphism effects with
backdrop-filter: blur() and rgba() backgrounds.
```

### PROMPT C — To integrate or modify the VR avatar:
```
I have a VR/3D avatar component that needs to be integrated into the ETC presentation app.
The app uses React 19 + Vite with Three.js, @react-three/fiber, and @react-three/drei.
Each content page has a <CharacterViewer /> component that wraps the avatar system.
The avatar system is in src/avatar/ with TypeScript. Modify the CharacterViewer props
or avatar system as needed. The avatar should auto-play when the page loads.
Current avatar features: GLB loading, lip sync, TTS, orbit controls.
```

### PROMPT D — To integrate the AI chatbot:
```
The AI chatbot is already implemented in the ETC presentation app's Q&A page
(src/pages/QnA.jsx) as the <ETCChatbot /> component. It matches the light theme
and has placeholder responses ready for LLM integration. To connect to a real AI:
modify the handleSend function in ETCChatbot.jsx to call your AI API instead of
the setTimeout placeholder. The component handles message state, typing indicators,
and UI automatically.
```

---

## Content Reference (ETC)

**Organisation**: Enabling Technology Collaboratory (ETC)
**Under**: School of Engineering, Temasek Polytechnic, Singapore
**Mission**: Research, development, and application of assistive and enabling technologies
to improve quality of life for persons with disabilities and the elderly.

**Focus areas**: Assistive Technology, Smart Mobility, Rehabilitation Engineering,
Human-Computer Interaction, Wearable Devices, Smart Home Systems, Sensory Substitution,
Robotics & Automation

**Key partners**: SG Enable, Tan Tock Seng Hospital, Agency for Integrated Care,
NCSS, various industry and academic partners.

**Sample projects**:
- Smart Wheelchair Navigation (LiDAR + CV)
- Eye-Gaze AAC Device
- Smart Prosthetic Hand (EMG-controlled)
- Cognitive Training Platform

---

## CSS Variables Reference

```css
--bg-dark: #f5f5f7;                    /* Page background */
--bg-card: rgba(255, 255, 255, 0.78); /* Card background */
--bg-card-hover: rgba(255, 255, 255, 0.95); /* Card hover */
--accent-primary: #1d1d1f;             /* Primary text/accent */
--accent-teal: #1f7a6b;                /* Primary brand color */
--accent-violet: #7c3aed;              /* Secondary accent */
--accent-gradient: linear-gradient(135deg, #1f7a6b, #059669); /* Gradients */
--text-primary: #1d1d1f;               /* Main text */
--text-secondary: #6e6e73;             /* Muted text */
--text-heading: #1d1d1f;               /* Heading text */
--border: rgba(0, 0, 0, 0.06);        /* Default border */
--border-hover: rgba(13, 148, 136, 0.3); /* Hover border */
--radius-pill: 999px;                 /* Fully rounded */
--radius-xl: 24px;                    /* Extra large */
--radius-lg: 20px;                    /* Large */
--radius-md: 16px;                    /* Medium */
--radius-sm: 12px;                    /* Small */
--shadow-soft: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.03);
--shadow-hover: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
--shadow-float: 0 20px 48px rgba(0, 0, 0, 0.06);
--transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
--transition-bounce: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
```
