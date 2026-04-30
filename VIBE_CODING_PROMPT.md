# ETC Presentation Web App — Vibe Coding Prompt

## Project Context

Build a **professional, dark-themed presentation web application** for the
**Enabling Technology Collaboratory (ETC)** — a Centre of Excellence under the
School of Engineering at Temasek Polytechnic, Singapore.

The app solves a real problem: **presenters repeat the same introduction and
project overview multiple times per day**. This app lets visitors browse ETC's
content self-serve, while an AI avatar (VR/3D) narrates each section.

Reference website: https://www.tp.edu.sg/research-and-industry/centres-of-excellence/centres-under-school-of-engineering/enabling-technology-collaboratory-etc.html

---

## Tech Stack

- **Framework**: React 18 with Vite (NOT Create React App)
- **Styling**: Plain CSS with CSS custom properties (no Tailwind, no CSS-in-JS)
- **Fonts**: Syne (headings) + DM Sans (body) via Google Fonts
- **Routing**: Simple state-based navigation (no React Router needed)
- **Build**: `npm run dev` starts the Vite dev server on port 5173

---

## Design Direction

- **Theme**: Deep dark navy (`#070b14`) — professional, high-tech, not gimmicky
- **Accent**: Electric blue (`#2d6ef7`) + cyan (`#00c2c7`)
- **Typography**: Syne for all headings (bold, geometric), DM Sans for body (clean, legible)
- **Cards**: Dark surface with subtle border, hover elevates with glow
- **Feel**: Like a high-end product demo or a well-designed conference kiosk
- **DO NOT**: Use purple gradients, Inter/Roboto fonts, generic "AI startup" aesthetics

---

## App Structure

```
src/
├── App.jsx                    ← Root: state router between pages
├── App.css                    ← Global CSS variables, shared component styles
├── main.jsx                   ← Entry point
├── pages/
│   ├── Home.jsx               ← Landing page with 4 main nav buttons
│   ├── Home.css               ← Home page styles
│   ├── Introduction.jsx       ← Section 01
│   ├── OurPartners.jsx        ← Section 02
│   ├── OurProjects.jsx        ← Section 03 hub (→ 3.1, 3.2, 3.3)
│   ├── ProjectDetail.jsx      ← Section 3.1
│   ├── DemoProject.jsx        ← Section 3.2
│   ├── CollaborationOpportunities.jsx  ← Section 3.3
│   └── QnA.jsx                ← Section 04 (AI chatbot placeholder)
└── components/
    ├── BackButton.jsx          ← Reusable back nav
    └── VRPlaceholder.jsx       ← VR/3D avatar integration point
```

---

## Navigation Flow

```
Home
├── 01 Introduction          → Introduction page
├── 02 Our Partners          → OurPartners page
├── 03 Our Projects          → OurProjects hub
│   ├── 3.1 Each Project     → ProjectDetail page
│   ├── 3.2 Demo Project     → DemoProject page
│   └── 3.3 Collaboration    → CollaborationOpportunities page
└── 04 Q&A                   → QnA page (AI chatbot)
```

All navigation is done via `navigate(pageId)` — a function passed as prop.
No URL routing. The `currentPage` state in `App.jsx` controls what renders.

---

## VR/3D Avatar Integration Points

**Every content page** contains a `<VRPlaceholder section="..." />` component.
This is where your teammate's VR/3D avatar gets plugged in.

### How to replace:
```jsx
// In src/components/VRPlaceholder.jsx:
// Delete the placeholder and replace with:
import MyVRAvatar from "./MyVRAvatar";

export default function VRPlaceholder({ section }) {
  return <MyVRAvatar section={section} autoPlay />;
}
```

### VRPlaceholder appears in:
| Page | section prop value |
|------|--------------------|
| Introduction | `"Introduction"` |
| OurPartners | `"Our Partners"` |
| OurProjects | `"Our Projects"` |
| ProjectDetail | `"Each Project"` |
| DemoProject | `"Demo Project"` |
| CollaborationOpportunities | `"Collaboration Opportunities"` |

The `section` prop tells the avatar what script/content to narrate.

---

## AI Q&A Chatbot Integration Point

**In `src/pages/QnA.jsx`**, there is a clearly marked placeholder zone.

### How to replace:
```jsx
// At the top of QnA.jsx, add:
import ETCChatbot from "../components/ETCChatbot";

// Replace the placeholder <div> with:
<ETCChatbot />
```

### The chatbot component should:
- Use the dark theme color vars (`--bg-card`, `--accent-blue`, `--text-secondary`)
- Train/prompt the AI with ETC content (projects, partners, mission, etc.)
- Support multi-turn conversation
- File: `src/components/ETCChatbot.jsx`

### Design spec for chatbot UI:
```
User messages:  right-aligned, background: var(--accent-blue), color: white
AI messages:    left-aligned, background: var(--bg-card), color: var(--text-primary)
Input:          full-width, dark border, border-radius: 8px
Send button:    var(--accent-blue) background
Font:           DM Sans, 14px
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 — the app loads the Home page immediately.

---

## Prompts for Each Feature (copy-paste to AI coding tools)

### PROMPT A — If you need to add a new section/page:
```
Add a new page to the ETC presentation app. The app uses React 18 + Vite
with a state-based router (no React Router). All pages receive a `navigate(pageId)`
prop. Create the page component in src/pages/[PageName].jsx matching the existing
dark theme (--bg-dark, --bg-card, --accent-blue CSS vars). Add the new pageId to
the switch statement in App.jsx and add a nav button to Home.jsx if needed.
Follow the same pattern as the existing pages: BackButton at top, page-header
section, then VRPlaceholder, then content.
```

### PROMPT B — If you need to style a new component:
```
Create a React component for the ETC presentation app (React 18 + Vite, no Tailwind).
Match the existing dark theme: background #070b14, cards #0d1424, accent blue #2d6ef7,
accent cyan #00c2c7, primary text #f0f4ff, secondary text #8a9cc4. Use Syne font for
headings and DM Sans for body text. Borders are 1px solid rgba(255,255,255,0.07).
Border radius is 14px for cards (--radius-md) and 20px for large containers (--radius-lg).
Hover states should elevate with box-shadow: 0 16px 40px rgba(0,0,0,0.3).
```

### PROMPT C — To integrate the VR avatar:
```
I have a VR/3D avatar component that needs to be integrated into the ETC presentation app.
The app uses React 18 + Vite. Each content page has a <VRPlaceholder section="..." />
component at src/components/VRPlaceholder.jsx. Replace the placeholder with my VR
component. The `section` prop (string) tells the avatar what section is being shown.
The avatar should autoPlay when the page loads. My VR component is at: [YOUR FILE PATH].
```

### PROMPT D — To integrate the AI chatbot:
```
I have an AI chatbot component that needs to be placed in the ETC presentation app's
Q&A page (src/pages/QnA.jsx). The app uses React 18 + Vite. Find the clearly marked
placeholder in QnA.jsx (look for "AI CHATBOT ZONE" comment) and replace it with my
chatbot component: import ETCChatbot from "../components/ETCChatbot". The chatbot should
match the dark theme (background: var(--bg-card), text: var(--text-primary)). My chatbot
component is already built and located at: src/components/ETCChatbot.jsx
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
--bg-dark: #070b14;         /* Page background */
--bg-card: #0d1424;         /* Card background */
--bg-card-hover: #111d35;   /* Card hover bg */
--accent-blue: #2d6ef7;     /* Primary accent, CTAs */
--accent-cyan: #00c2c7;     /* Secondary accent, badges */
--text-primary: #f0f4ff;    /* Main text */
--text-secondary: #8a9cc4;  /* Muted text, labels */
--border: rgba(255,255,255,0.07);         /* Default border */
--border-hover: rgba(45,110,247,0.4);    /* Hover border */
--radius-sm: 8px;
--radius-md: 14px;
--radius-lg: 20px;
--transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
```
