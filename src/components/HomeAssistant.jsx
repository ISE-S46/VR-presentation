import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import CharacterViewer from './CharacterViewer';
import { useGPT } from '../hooks/useGPT';
import '../styles/components/HomeAssistant.css';

const SYSTEM_INSTRUCTIONS = `You are an assistant for the Enabling Technology Collaboratory (ETC) at Temasek Polytechnic (TP), Singapore. Your ONLY role is to answer questions related to ETC.

## What you can answer:
- ETC's mission and overview
- Core technology areas: AI/Machine Learning, IoT, Immersive Media
- ETC's research projects (details below)
- Industry partners (e.g. AWS, Certis, CGH, TTSH, JMA Research, etc.)
- ETC team members and contact details
- Location: West Wing Block 20, Level 3, Temasek Polytechnic, 21 Tampines Ave 1, Singapore 529757
- Contact: Tan_cheng_khoon@tp.edu.sg | 6780 5585
- Office hours: 8.30am–6.00pm, Mon–Fri (Closed Sat, Sun & Public Holidays)

## Detailed ETC Project Information:
When asked to describe, summarize, or list our projects, refer to these 8 projects:
1. **Augmented Reality Application for Security Training (ARAST)**: Co-funded by SSG, partnered with Certis. Utilises image target tracking to simulate security incidents (Fire, Improvised explosive device, Break-In, Suspicious Person, Bag Search). Equipped with a real-time analytics dashboard to monitor training, identify errors, and track competencies.
2. **Automated Risk Assessment (ARA)**: A safety & AI project aiming to streamline workplace risk assessments using automated hazard identification and mitigation. Accepts workplace images to auto-generate preliminary Risk Assessment (RA) forms, categorizes hazards based on Ministry of Manpower (MOM) classifications, and offers an archive system.
3. **Pre-Procedure Evaluation System for MRI**: A healthcare & VR project co-funded by Temasek Polytechnic Research Fund (TPRF) and partnered with CGH. Simulates in-bore MRI scanning processes using VR to acclimatise claustrophobic/anxious patients. Collects bed mat pressure distribution, vitals, and camera data to establish an evaluation score.
4. **Virtual Practice Environment for Oral Exam Preparation**: An education & AI project partnered with Dunman Secondary School and Bartley Secondary School. Enables voice-to-text, LLM, and text-to-voice interactive preparation where an AI simulates a teacher. Teachers can upload visual stimuli, exam rubrics, and review AI feedback.
5. **E-Practical and Immersive technology (A/VR) Learning Package**: Education & VR/AR initiative driven by the POLITE Committee. TP developed 4 workplace safety topics: Ladder Safety, Fire Hazard Check, Fire Safety Equipment Visual Check, and Hazard Identification. Accessible via web and Oculus, benefiting ~1500 students across 5 polytechnics.
6. **Immersive Role-play: Role-Play Authoring and AI-Assisted Assessment**: A training & AI project partnered with JMA Research. Multi-device application providing cost-effective alternative to face-to-face roleplays. Allows domain experts to customize conversation intents, select avatars, choose environments, and analyze facial expressions, speech emotions, and language sentiments.
7. **Patient Safety Training (Emergency Dept)**: Healthcare & VR project partnered with Changi General Hospital (CGH). A gamified emergency department simulation to impart serious patient safety education (Skills, Knowledge, Attitudes) to junior doctors in a fun, safe environment without extra instructor costs.
8. **Featured Demo (Patient Safety VR Training)**: A live demo project highlighting emergency simulation in Virtual Reality. Since critical emergencies do not occur frequently, it simulates them to see how personnel handle the situation and verify correct procedural steps (e.g., verifying medicines upon delivery). Every session is video recorded for performance review and self-improvement.

## Strict rules:
1. Allow casual greetings (e.g. "Hi", "Hello", "Good morning") and pleasantries/thanks (e.g. "Thank you"). Respond to these warmly and introduce yourself as the ETC Assistant, then ask how you can help them learn about ETC today.
2. If the question is NOT related to ETC or Temasek Polytechnic's ETC centre, politely refuse and steer the conversation back to ETC. Always end the refusal with a welcoming prompt to ask about ETC.
3. Do NOT answer general knowledge questions (e.g. math, science, current events).
4. Do NOT make up information. If you don't know, say: "I don't have that information. Please contact ETC directly at Tan_cheng_khoon@tp.edu.sg or 6780 5585."
5. Always stay on-topic. Never break character.
6. YOU MUST SPEAK IN ENGLISH ONLY.
7. When describing, listing, or mentioning our partners (e.g. AWS, SkillsFuture SG, MOE, Certis, SBS Transit, TTSH, CGH, JMA Research, Metabots, Kite Sense, etc.), you MUST introduce them slowly. Add three dots/ellipses ("...") before and after each partner's name. This creates critical speech pauses in Text-to-Speech audio so visitors can view each partner's highlighted card clearly.
   Example: "Our ecosystem includes partners like... Ministry of Education... SkillsFuture SG... Tan Tock Seng Hospital... Changi General Hospital... AWS... SBS Transit... Certis... Metabots... Kite Sense... and JMA Research."
8. CRITICAL SPELLING RULE: Always spell partner names EXACTLY as listed above. Write "AWS" (three uppercase letters, no dots, no spaces). Never write "A.W.S." or "A W S" or "Amazon Web Services". Write "MOE" not "M.O.E.", "CGH" not "C.G.H.", "TTSH" not "T.T.S.H.", "SBS" not "S.B.S.", "SSG" not "S.S.G.". This ensures the UI can detect and highlight the correct partner card.
9. If the user asks to see, visit, summarize, or learn about Partners or the Ecosystem page, keep your answer brief and do NOT list individual partner names in that response. Say that you will bring them to the Partners page and walk through the ecosystem there, then append [NAV_/OurPartners]. The Partners page has its own detailed narration that lists and highlights the partner names after the page scrolls.

## PROJECT INQUIRY ROUTING RULE (CRITICAL):
1. If the user asks generally to "explain projects", "tell me about projects", "show me projects", "list projects", or similar:
   - YOU MUST NOT list or describe the 8 projects immediately.
   - Instead, explain that you are navigating them to the Projects menu where they can choose, and ask them: "Would you like to check out **Each Project** (our extensive portfolio of 7 assistive tech projects) or our featured **Demo Project** (the Patient Safety VR Training)?"
   - YOU MUST append [NAV_/OurProjects] at the very end of your response to navigate them.
2. If the user asks to go to or view "each project", "show all projects", "portfolio", "each projects", or similar:
   - Say: "Sure! Let's head over to the Project Portfolio where you can browse all of our individual projects."
   - YOU MUST append [NAV_/OurProjects/ProjectDetail] at the very end of your response to navigate them.
3. If they ask about a specific project by name (e.g. ARAST, ARA, MRI, Dunman, etc.):
   - Explain that specific project in detail and append the appropriate direct navigation tag:
     - For projects 1-7 (ARAST, ARA, MRI, OralExam, PolitePackage, Roleplay, SafetyVR): Append [NAV_/OurProjects/ProjectDetail]
     - For the Patient Safety VR Training / Featured Demo (Project 8): Append [NAV_/OurProjects/DemoProject]

## CRITICAL INSTRUCTION FOR NAVIGATION:
If the user asks to see, go to, or learn about a specific topic/page, or whenever you explain, introduce, or discuss a topic, you MUST provide a brief summary and then append a navigation tag at the VERY END of your response to bring them there automatically.
- For About Us or Introduction: Append [NAV_/Introduction]
- For Partners or Ecosystem: Append [NAV_/OurPartners]
- For Projects list or Portfolio: Append [NAV_/OurProjects]
- For Specific details of Projects 1-7: Append [NAV_/OurProjects/ProjectDetail]
- For the Patient Safety VR Training / Live Demo / Featured Demo: Append [NAV_/OurProjects/DemoProject] (Always append this tag when discussing the featured demo or Patient Safety VR Training so the user is automatically navigated to that page)
- For collaboration or partnership opportunities: Append [NAV_/OurProjects/CollaborationOpportunities]
- For Home page: Append [NAV_/Home]
Append the navigation tag as the absolute last characters of your response, with nothing after it — no punctuation, no spaces, no words.
Example: "We have multiple projects like ARAST and ARA. Let's see the portfolio! [NAV_/OurProjects/ProjectDetail]"`;

const VALID_NAV_ROUTES = new Set([
  '/Home',
  '/Introduction',
  '/OurPartners',
  '/OurProjects',
  '/OurProjects/ProjectDetail',
  '/OurProjects/DemoProject',
  '/OurProjects/CollaborationOpportunities',
]);

const QUICK_PROMPTS = [
  {
    label: 'Projects',
    prompt: 'Give me a concise tour of ETC projects and bring me to the project portfolio.',
  },
  {
    label: 'Partners',
    prompt: 'Bring me to the partners page and walk me through the ecosystem there.',
  },
  {
    label: 'Contact',
    prompt: 'Tell me ETC contact details and office hours.',
  },
  {
    label: 'Demo',
    prompt: 'Introduce the Patient Safety VR Training featured demo and bring me to that page.',
  },
];

const PARTNERS_PAGE_SCRIPT =
  "Here is the partner wall. This is where ETC's work starts to feel bigger than one lab: schools, hospitals, public agencies, and industry teams all helping ideas get tested in the real world. Let's keep it simple and spotlight a few key names... Ministry of Education Singapore... SkillsFuture SG... Changi General Hospital (SingHealth)... AWS... and Certis.";

const DEMO_PAGE_SCRIPT =
  "Let's jump into the Patient Safety VR demo. Picture a trainee stepping into a virtual emergency department as a junior doctor. The goal is not just to watch a scene, but to practise the small decisions that keep a patient safe: reading the room, checking the patient's condition, calling for the right medicine, and staying calm when the case starts moving fast. When the medicine arrives, the trainee still has to pause and verify the right drug, the right dose, the right patient, and the right timing before using it. That is the power of this demo: rare, high-pressure moments become repeatable practice. Every run is recorded too, so learners can replay what happened, catch missed steps, and improve before they face a real emergency.";

export default function HomeAssistant() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const { fetchGPTResponse, transcribeAudio } = useGPT();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [assistantNotice, setAssistantNotice] = useState(null);
  const [transcriptText, setTranscriptText] = useState("");
  const [aiResponseText, setAiResponseText] = useState(
    "Hi! I am the official ETC Assistant. How can I help you today?"
  );
  const [latestScript, setLatestScript] = useState("");
  const [activeProject, setActiveProject] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);

  const pendingNavRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const activeProjectRef = useRef(null);
  const speakTimeoutRef = useRef(null);
  const revealFallbackRef = useRef(null);
  const audioUnlockedRef = useRef(false);
  const ttsCacheRef = useRef(new Map());
  const pendingSpeechRef = useRef(null);

  const updateActiveProject = useCallback((val) => {
    activeProjectRef.current = val;
    setActiveProject(val);
  }, []);

  const showNotice = useCallback((text, type = 'info') => {
    setAssistantNotice({ text, type, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!assistantNotice) return undefined;
    const timer = setTimeout(() => setAssistantNotice(null), 4800);
    return () => clearTimeout(timer);
  }, [assistantNotice]);

  const clearSpeakTimer = useCallback(() => {
    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }
  }, []);

  const clearRevealFallback = useCallback(() => {
    if (revealFallbackRef.current) {
      clearTimeout(revealFallbackRef.current);
      revealFallbackRef.current = null;
    }
  }, []);

  const broadcastAvatarStatus = useCallback((detail) => {
    window.currentAvatarState = detail;
    window.dispatchEvent(new CustomEvent('avatar-status-broadcast', { detail }));
  }, []);

  const speechStartRef = useRef(0);
  const speechRemainingRef = useRef(0);
  const speechDurationRef = useRef(0);

  const runSpeakTimeout = useCallback((timeMs) => {
    clearSpeakTimer();
    speechStartRef.current = Date.now();
    speechDurationRef.current = timeMs;
    speakTimeoutRef.current = setTimeout(() => {
      pendingSpeechRef.current = null;
      broadcastAvatarStatus({ projectName: null, status: 'idle' });
      updateActiveProject(null);
      speakTimeoutRef.current = null;
      setIsSpeaking(false);
    }, timeMs);
  }, [clearSpeakTimer, broadcastAvatarStatus, updateActiveProject, setIsSpeaking]);

  useEffect(() => {
    const handlePause = () => {
      if (speakTimeoutRef.current) {
        const elapsed = Date.now() - speechStartRef.current;
        speechRemainingRef.current = Math.max(0, speechDurationRef.current - elapsed);
        clearSpeakTimer();
      }
    };

    const handleResume = () => {
      if (speechRemainingRef.current > 0) {
        runSpeakTimeout(speechRemainingRef.current);
      }
    };

    window.addEventListener('avatar-pause-playback', handlePause);
    window.addEventListener('avatar-resume-playback', handleResume);
    return () => {
      window.removeEventListener('avatar-pause-playback', handlePause);
      window.removeEventListener('avatar-resume-playback', handleResume);
    };
  }, [clearSpeakTimer, runSpeakTimeout]);

  const resetAvatarState = useCallback(() => {
    clearSpeakTimer();
    pendingSpeechRef.current = null;
    speechRemainingRef.current = 0;
    speechDurationRef.current = 0;
    broadcastAvatarStatus({ projectName: null, status: 'idle' });
    updateActiveProject(null);
    setIsSpeaking(false);
    setShowSubtitles(false);
    setLatestScript("");
  }, [broadcastAvatarStatus, clearSpeakTimer, updateActiveProject, setLatestScript]);

  useEffect(() => {
    const handlePlaybackStarted = (e) => {
      const pendingSpeech = pendingSpeechRef.current;
      if (!pendingSpeech || pendingSpeech.script !== e.detail?.script) return;

      const playbackDurationMs = Number.isFinite(e.detail?.durationMs) && e.detail.durationMs > 0
        ? e.detail.durationMs
        : pendingSpeech.durationMs;

      broadcastAvatarStatus({
        projectName: pendingSpeech.projectName,
        status: 'speaking',
        durationMs: playbackDurationMs,
        spokenText: pendingSpeech.spokenText,
      });
      setIsSpeaking(true);
      setShowSubtitles(false);
      runSpeakTimeout(playbackDurationMs);
    };

    const handlePlaybackEnded = (e) => {
      const pendingSpeech = pendingSpeechRef.current;
      if (!pendingSpeech || pendingSpeech.script !== e.detail?.script) return;

      clearSpeakTimer();
      pendingSpeechRef.current = null;
      speechRemainingRef.current = 0;
      speechDurationRef.current = 0;
      broadcastAvatarStatus({ projectName: null, status: 'idle' });
      updateActiveProject(null);
      setIsSpeaking(false);
    };

    window.addEventListener('avatar-playback-started', handlePlaybackStarted);
    window.addEventListener('avatar-playback-ended', handlePlaybackEnded);
    return () => {
      window.removeEventListener('avatar-playback-started', handlePlaybackStarted);
      window.removeEventListener('avatar-playback-ended', handlePlaybackEnded);
    };
  }, [broadcastAvatarStatus, clearSpeakTimer, runSpeakTimeout, updateActiveProject]);

  const stopAvatarSpeech = useCallback(() => {
    window.dispatchEvent(new CustomEvent('avatar-stop-playback'));
    resetAvatarState();
    setAiResponseText("");
    setIsThinking(false);
  }, [resetAvatarState]);

  const revealAssistantResponse = useCallback((text, navTarget = pendingNavRef.current) => {
    clearRevealFallback();
    setIsThinking(false);
    setAiResponseText(text);

    if (navTarget && VALID_NAV_ROUTES.has(navTarget)) {
      if (location.pathname !== navTarget) {
        setTimeout(() => navigate(navTarget), 900);
      }
    }

    pendingNavRef.current = null;
  }, [clearRevealFallback, navigate, location.pathname]);

  const unlockAudio = useCallback(async () => {
    if (audioUnlockedRef.current) return;

    try {
      if (navigator.userActivation && !navigator.userActivation.isActive) {
        return;
      }

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;

      if (AudioContextClass) {
        const ctx = new AudioContextClass();

        if (ctx.state === "suspended") {
          await ctx.resume();
        }

        // Create tiny silent buffer
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();

        source.buffer = buffer;
        source.connect(ctx.destination);

        source.start(0);
      }

      const audio = new Audio(
        "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAACcQCA"
      );
      audio.volume = 0;
      await audio.play();
      audio.pause();

      audioUnlockedRef.current = true;
    } catch {
      showNotice('Audio will start after the next user interaction.', 'warning');
    }
  }, [showNotice]);

  // Generate (or reuse) the TTS audio for a piece of text. Results are cached
  // by text so the presentation tour can prefetch the next page's voice while
  // the current one is still playing — making transitions feel instant.
  const fetchTtsAudio = useCallback((text) => {
    const cache = ttsCacheRef.current;
    const cached = cache.get(text);
    if (cached) return cached;

    const job = (async () => {
      const processedText = text;

      // Slightly slower than natural so the narration feels calm and clear
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: processedText, format: 'wav', speed: 0.9 }),
      });

      if (!response.ok) {
        let errorText = `TTS server returned status ${response.status}`;
        try {
          const data = await response.clone().json();
          errorText = data.error || errorText;
        } catch {
          errorText = response.statusText || errorText;
        }
        throw new Error(errorText);
      }

      const blob = await response.blob();
      return { blob, processedText };
    })();

    cache.set(text, job);
    // Cap the cache and drop failed entries so they can be retried later.
    if (cache.size > 12) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    job.catch(() => {
      if (cache.get(text) === job) cache.delete(text);
    });

    return job;
  }, []);

  const handleTTSFetch = useCallback(async (text) => {
    try {
      const { blob, processedText } = await fetchTtsAudio(text);

      const charCount = processedText.length;
      const charsPerSecond = 12.8;
      const durationMs = Math.max(4500, (charCount / charsPerSecond) * 1000);
      const projectName = activeProjectRef.current;

      clearSpeakTimer();
      pendingSpeechRef.current = {
        script: text,
        projectName,
        spokenText: processedText,
        durationMs,
      };

      // Display the original clean text in the chat bubble UI
      revealAssistantResponse(text);

      // Hand the avatar a fresh Response wrapping the (possibly cached) audio
      return new Response(blob, { headers: { 'Content-Type': blob.type || 'audio/wav' } });
    } catch (err) {
      console.error("TTS fetch failed in handleTTSFetch:", err);
      showNotice('Voice playback is unavailable, so I displayed the answer as text.', 'warning');
      revealAssistantResponse(text);
      resetAvatarState();
      throw err;
    }
  }, [clearSpeakTimer, fetchTtsAudio, resetAvatarState, revealAssistantResponse, showNotice]);

  const sendMessage = useCallback(async (userMessage, showUserBubble = true) => {
    const cleanMessage = userMessage.trim();
    if (!cleanMessage) return;

    if (showUserBubble) {
      setTranscriptText(cleanMessage);
      resetAvatarState();
    } else {
      setTranscriptText("");
    }

    setAssistantNotice(null);
    setAiResponseText("");
    setIsThinking(true);
    pendingNavRef.current = null;
    clearRevealFallback();

    try {
      const enrichedMessage = `${SYSTEM_INSTRUCTIONS}\n\nCurrent Page Route: "${location.pathname}"\n\nUser Query: "${cleanMessage}"`;
      const aiMessage = await fetchGPTResponse(enrichedMessage);
      const safeMessage = typeof aiMessage === 'string' ? aiMessage : '';

      let speakText = safeMessage.trim();
      let navTarget = null;
      const navMatch = safeMessage.match(/\s*\[NAV_\s*(\/[^\]]+)\s*\]\s*$/);

      if (navMatch) {
        speakText = safeMessage.replace(navMatch[0], '').trim();
        navTarget = VALID_NAV_ROUTES.has(navMatch[1].trim()) ? navMatch[1].trim() : null;
      }

      // Programmatic fallback/reinforcement to navigate to correct pages if not set
      if (!navTarget) {
        const lowerQuery = cleanMessage.toLowerCase();
        const lowerResponse = speakText.toLowerCase();

        if (
          (lowerQuery.includes('patient safety vr') ||
           lowerQuery.includes('featured demo') ||
           lowerQuery.includes('demo project') ||
           lowerResponse.includes('patient safety vr') ||
           lowerResponse.includes('featured demo') ||
           lowerResponse.includes('demo project') ||
           activeProjectRef.current === 'PatientSafetyVR') &&
          !lowerQuery.includes('security training') &&
          !lowerResponse.includes('security training')
        ) {
          navTarget = '/OurProjects/DemoProject';
        } else if (
          lowerQuery.includes('partner') ||
          lowerQuery.includes('ecosystem') ||
          lowerResponse.includes('partner') ||
          lowerResponse.includes('ecosystem')
        ) {
          navTarget = '/OurPartners';
        } else if (
          lowerQuery.includes('collaborat') ||
          lowerResponse.includes('collaborat')
        ) {
          navTarget = '/OurProjects/CollaborationOpportunities';
        } else if (
          lowerQuery.includes('portfolio') ||
          lowerQuery.includes('all projects') ||
          lowerQuery.includes('each project') ||
          lowerResponse.includes('portfolio') ||
          lowerResponse.includes('all projects') ||
          lowerResponse.includes('each project')
        ) {
          navTarget = '/OurProjects/ProjectDetail';
        } else if (
          lowerQuery.includes('about us') ||
          lowerQuery.includes('introduction') ||
          lowerQuery.includes('mission') ||
          lowerResponse.includes('about us') ||
          lowerResponse.includes('introduction') ||
          lowerResponse.includes('mission')
        ) {
          navTarget = '/Introduction';
        }
      }

      if (navTarget === '/OurPartners' && location.pathname !== '/OurPartners') {
        speakText = "Sure, let's head to the Partners page. I will walk you through the ecosystem there.";
      }

      if (navTarget === '/OurProjects/DemoProject' && location.pathname !== '/OurProjects/DemoProject') {
        speakText = "Let's jump into the Patient Safety VR demo. I will explain the scenario while the video comes forward.";
      }

      if (!speakText) {
        revealAssistantResponse("I don't have that information. Please contact ETC directly at Tan_cheng_khoon@tp.edu.sg or 6780 5585.", navTarget);
        resetAvatarState();
        return;
      }

      pendingNavRef.current = navTarget;

      revealFallbackRef.current = setTimeout(() => {
        showNotice('Avatar voice is still loading, so I displayed the answer now.', 'info');
        revealAssistantResponse(speakText, navTarget);
      }, 6500);

      setLatestScript((prev) =>
        prev === speakText
          ? speakText + '\u200B'
          : speakText
      );

    } catch (e) {
      console.error("Chat error:", e);
      revealAssistantResponse("I'm sorry, I am having trouble connecting to the ETC assistant service. Please try again.");
      showNotice(e.message || 'Assistant request failed.', 'error');
      resetAvatarState();
    }
  }, [clearRevealFallback, fetchGPTResponse, resetAvatarState, revealAssistantResponse, showNotice, location.pathname]);

  useEffect(() => {
    const handleExplainProject = (e) => {
      const { projectName, projectTitle, customPrompt } = e.detail;

      updateActiveProject(projectName);
      clearSpeakTimer();
      broadcastAvatarStatus({ projectName, status: 'thinking' });
      setIsCollapsed(false);
      unlockAudio();
      sendMessage(customPrompt || `Please describe the ${projectTitle} project in detail.`, false);
    };

    window.addEventListener('avatar-explain-project', handleExplainProject);
    return () => {
      window.removeEventListener('avatar-explain-project', handleExplainProject);
    };
  }, [broadcastAvatarStatus, clearSpeakTimer, sendMessage, unlockAudio, updateActiveProject]);

  useEffect(() => {
    const handlePresentationTourState = (e) => {
      if (e.detail?.active) {
        setIsCollapsed(false);
        setShowSubtitles(false);
        resetAvatarState();
        unlockAudio();
      } else {
        resetAvatarState();
      }
    };

    window.addEventListener('presentation-tour-state', handlePresentationTourState);
    return () => window.removeEventListener('presentation-tour-state', handlePresentationTourState);
  }, [resetAvatarState, unlockAudio]);

  // Automatic voice greetings/prompts on route changes
  const prevPathnameRef = useRef(null);

  useEffect(() => {
    const currentPath = location.pathname;
    const prevPath = prevPathnameRef.current;
    prevPathnameRef.current = currentPath;

    // Check if the user navigated to the Landing Page.
    if (currentPath === '/' && prevPath !== '/') {
      setIsCollapsed(false);
      resetAvatarState();
      setTranscriptText("");
      setAiResponseText("Hi! I am the official ETC Assistant. How can I help you today?");
      setLatestScript("");
    }

    if (
      currentPath === '/OurPartners' &&
      prevPath !== '/OurPartners' &&
      !window.__etcTourActive
    ) {
      setIsCollapsed(false);
      resetAvatarState();
      pendingNavRef.current = null;
      setTranscriptText("");
      setAiResponseText("");
      setIsThinking(true);

      setTimeout(() => {
        setLatestScript((prev) =>
          prev === PARTNERS_PAGE_SCRIPT
            ? PARTNERS_PAGE_SCRIPT + '\u200B'
            : PARTNERS_PAGE_SCRIPT
        );
      }, 500);
    }

    if (
      currentPath === '/OurProjects/DemoProject' &&
      prevPath !== '/OurProjects/DemoProject' &&
      !window.__etcTourActive
    ) {
      setIsCollapsed(false);
      resetAvatarState();
      pendingNavRef.current = null;
      setTranscriptText("");
      setAiResponseText("");
      setIsThinking(true);

      setTimeout(() => {
        setLatestScript((prev) =>
          prev === DEMO_PAGE_SCRIPT
            ? DEMO_PAGE_SCRIPT + '\u200B'
            : DEMO_PAGE_SCRIPT
        );
      }, 500);
    }

    // Check if the user navigated to the ProjectDetail portfolio page.
    // Skip during an auto-presentation tour, which supplies its own narration.
    if (
      currentPath === '/OurProjects/ProjectDetail' &&
      prevPath !== '/OurProjects/ProjectDetail' &&
      !window.__etcTourActive
    ) {
      const explainText = "We have many projects here! If you want to know about any project, just click into that project and let me explain it for you.";

      // Make sure the assistant is expanded so they see and hear it
      setIsCollapsed(false);

      // Stop any active speech and reset
      resetAvatarState();

      // Set values and trigger TTS
      setTranscriptText("");
      setAiResponseText("");
      setIsThinking(true);

      // Play greeting after a brief delay for route transition stability
      setTimeout(() => {
        setLatestScript((prev) =>
          prev === explainText
            ? explainText + '\u200B'
            : explainText
        );
      }, 500);
    }
  }, [location.pathname, resetAvatarState]);

  // Presentation Tour: speak a fixed script with no GPT round-trip.
  // Reuses the same setLatestScript -> CharacterViewer -> TTS pipeline as the
  // route greetings, so the avatar narrates and the speaking/idle broadcasts
  // (which the tour listens to) fire exactly as usual.
  useEffect(() => {
    const handleSpeakDirect = (e) => {
      const text = e.detail?.text?.trim();
      if (!text) return;

      setIsCollapsed(false);
      resetAvatarState();
      unlockAudio();
      clearRevealFallback();
      pendingNavRef.current = null;
      setTranscriptText("");
      setAiResponseText("");
      setIsThinking(true);

      // Append a zero-width space when the script repeats so React still sees a
      // changed value and re-triggers the avatar's speech.
      setLatestScript((prev) => (prev === text ? text + String.fromCharCode(0x200B) : text));
    };

    window.addEventListener('avatar-speak-direct', handleSpeakDirect);
    return () => window.removeEventListener('avatar-speak-direct', handleSpeakDirect);
  }, [clearRevealFallback, resetAvatarState, unlockAudio]);

  // Presentation Tour: pre-generate the next page's narration audio in the
  // background so it's already cached (and plays instantly) once we navigate.
  useEffect(() => {
    const handlePrefetch = (e) => {
      const text = e.detail?.text?.trim();
      if (text) fetchTtsAudio(text).catch(() => {});
    };

    window.addEventListener('avatar-prefetch-tts', handlePrefetch);
    return () => window.removeEventListener('avatar-prefetch-tts', handlePrefetch);
  }, [fetchTtsAudio]);

  useEffect(() => {
    return () => {
      clearSpeakTimer();
      clearRevealFallback();
    };
  }, [clearRevealFallback, clearSpeakTimer]);

  const startListening = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      showNotice('Voice input is not supported in this browser. Please type your question.', 'warning');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      const SUPPORTED_TYPES = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
        "audio/ogg",
      ];
      const mimeType = SUPPORTED_TYPES.find(t => MediaRecorder.isTypeSupported(t)) || "";

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      setIsListening(true);
      setTranscriptText("");
      setAiResponseText("");
      setAssistantNotice(null);

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContextClass();

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const source =
        audioContext.createMediaStreamSource(stream);

      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 512;

      source.connect(analyser);

      const dataArray = new Uint8Array(
        analyser.frequencyBinCount
      );

      let silenceStart = null;
      let stopped = false;
      let silenceFrame = null;

      const SILENCE_THRESHOLD = 10;
      const SILENCE_DURATION = 1400;

      const checkSilence = () => {
        if (
          stopped ||
          !mediaRecorderRef.current ||
          mediaRecorderRef.current.state === "inactive"
        ) {
          return;
        }

        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        if (volume < SILENCE_THRESHOLD) {
          if (!silenceStart) silenceStart = Date.now();
          else if (Date.now() - silenceStart > SILENCE_DURATION) {
            stopped = true;
            mediaRecorderRef.current?.stop();
            return;
          }
        } else {
          silenceStart = null;
        }

        silenceFrame = requestAnimationFrame(checkSilence);
      };

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stopped = true;
        if (silenceFrame) cancelAnimationFrame(silenceFrame);
        if (audioContext.state !== "closed") {
          audioContext.close().catch(() => undefined);
        }
        stream.getTracks().forEach(track => track.stop());
        setIsListening(false);

        const actualMime = mediaRecorder.mimeType || mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMime });

        // Pick filename extension based on actual mime type
        const ext = actualMime.includes("mp4") ? "mp4"
          : actualMime.includes("ogg") ? "ogg"
            : "webm";

        setIsThinking(true);
        try {
          const transcript = await transcribeAudio(audioBlob, ext);
          if (transcript?.trim()) {
            await sendMessage(transcript.trim());
          } else {
            setIsThinking(false);
            setAiResponseText("Sorry, I couldn't make that out. Please try again.");
            showNotice('No clear speech was detected.', 'warning');
          }
        } catch (err) {
          console.error("STT error:", err);
          setIsThinking(false);
          setAiResponseText("I could not transcribe that audio. Please try again or type your question.");
          showNotice(err.message || "Transcription failed.", 'error');
        }
      };

      mediaRecorder.start();
      silenceFrame = requestAnimationFrame(checkSilence);

    } catch (err) {
      console.error("Mic access denied:", err);
      setIsListening(false);
      showNotice("Microphone access is required for voice input. You can still type your question.", 'error');
    }
  }, [sendMessage, showNotice, transcribeAudio]);

  const toggleListen = useCallback(async () => {
    await unlockAudio();

    if (isListening) {
      mediaRecorderRef.current?.stop();
    } else {
      await startListening();
    }
  }, [isListening, startListening, unlockAudio]);

  const handleResetChat = useCallback(() => {
    resetAvatarState();
    setTranscriptText("");
    setAiResponseText("Hi! I am the official ETC Assistant. How can I help you today?");
    setLatestScript("");
    setTextInput("");
    showNotice("Conversation history has been reset.", "info");
  }, [resetAvatarState, showNotice]);

  const handleTextSubmit = useCallback(async (e) => {
    e.preventDefault();

    await unlockAudio();

    if (!textInput.trim() || isThinking) return;
    if (textInput.trim().length > 280) {
      showNotice('Please keep assistant questions under 280 characters.', 'warning');
      return;
    }

    const msg = textInput.trim();
    setTextInput("");
    await sendMessage(msg);
  }, [isThinking, sendMessage, showNotice, textInput, unlockAudio]);

  const handleQuickPrompt = useCallback(async (prompt) => {
    if (isThinking) return;
    await unlockAudio();
    setTextInput("");
    await sendMessage(prompt);
  }, [isThinking, sendMessage, unlockAudio]);

  return (
    <>
      <button
        className={`home-assistant-toggle-btn ${isCollapsed ? 'collapsed' : ''} ${isLanding ? 'landing-mode' : ''}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Show Assistant" : "Hide Assistant"}
        aria-label={isCollapsed ? "Show ETC Assistant" : "Hide ETC Assistant"}
        aria-expanded={!isCollapsed}
      >
        {isCollapsed ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </button>

      <div className={`home-assistant-container ${isCollapsed ? 'collapsed' : ''} ${isLanding ? 'landing-mode' : ''}`} aria-hidden={isCollapsed}>
        <div
          className="home-assistant-canvas-wrapper"
          style={{ position: 'absolute', inset: 0 }}
        >
          <CharacterViewer
            modelPath="/model/FModel2.glb"
            ttsEndpoint={handleTTSFetch}
            script={latestScript}
            button={false}
            modelScale={0.9}
            section="ETC Assistant Avatar"
          />
        </div>

        {isSpeaking && (
          <button
            type="button"
            className="home-assistant-avatar-stop-btn"
            onClick={stopAvatarSpeech}
            title="Stop Speaking"
            aria-label="Stop avatar speech"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="7" y="7" width="10" height="10" rx="1.8" />
            </svg>
            <span>Stop</span>
          </button>
        )}

        <div
          className="home-assistant-mic-wrapper"
          style={{
            position: 'absolute',
            bottom: '20px',    // Docks the UI to the bottom
            left: '20px',      // Adds breathing room from the edges
            right: '20px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}
        >
          {!activeProject && transcriptText && !isListening && (
            <div className="home-assistant-bubble user-bubble">
              {transcriptText}
            </div>
          )}

          {!activeProject && isThinking && (
            <div className="home-assistant-bubble ai-bubble thinking">
              <div className="typing-dot" style={{ animationDelay: '0s' }}></div>
              <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
              <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}

          {!activeProject && aiResponseText && !isThinking && (!isSpeaking || showSubtitles) && (
            <div className="home-assistant-bubble ai-bubble">
              <button
                type="button"
                className="home-assistant-bubble-close"
                onClick={() => setAiResponseText("")}
                title="Hide response text"
                aria-label="Hide response text"
              >
                &times;
              </button>
              {aiResponseText}
            </div>
          )}

          {!activeProject && assistantNotice && (
            <div className={`home-assistant-notice home-assistant-notice--${assistantNotice.type}`} role="status">
              {assistantNotice.text}
            </div>
          )}

          {(isListening || isSpeaking) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', margin: '4px auto 12px auto' }}>
              <div className={`home-assistant-waveform ${isListening ? 'listening' : ''}`} style={{ margin: 0 }}>
                <div className="waveform-bar bar-1"></div>
                <div className="waveform-bar bar-2"></div>
                <div className="waveform-bar bar-3"></div>
                <div className="waveform-bar bar-4"></div>
                <div className="waveform-bar bar-5"></div>
              </div>

              {isSpeaking && (
                <>
                  <button
                    type="button"
                    className={`home-assistant-cc-btn ${showSubtitles ? 'active' : ''}`}
                    onClick={() => setShowSubtitles(!showSubtitles)}
                    title={showSubtitles ? "Hide Subtitles" : "Show Subtitles"}
                    aria-label={showSubtitles ? "Hide Subtitles" : "Show Subtitles"}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="7" y1="15" x2="11" y2="15" />
                      <line x1="13" y1="15" x2="17" y2="15" />
                      <line x1="7" y1="11" x2="17" y2="11" />
                    </svg>
                    <span>{showSubtitles ? "Hide Text" : "Show Text"}</span>
                  </button>

                  <button
                    type="button"
                    className="home-assistant-cc-btn home-assistant-cc-btn--stop"
                    onClick={stopAvatarSpeech}
                    title="Stop Speaking"
                    aria-label="Stop Speaking"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                    <span>Stop Voice</span>
                  </button>
                </>
              )}
            </div>
          )}

          {!activeProject && !isListening && !isThinking && (
            <div className="home-assistant-quick-row" aria-label="Suggested assistant questions">
              {QUICK_PROMPTS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="home-assistant-quick-chip"
                  onClick={() => handleQuickPrompt(item.prompt)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          <form className="home-assistant-text-form" onSubmit={handleTextSubmit}>
            <button
              type="button"
              className="home-assistant-reset-btn"
              onClick={handleResetChat}
              title="Reset Conversation"
              disabled={isThinking || isListening}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
            <input
              type="text"
              className="home-assistant-text-input"
              placeholder="Type a question..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={isThinking || isListening}
              maxLength={280}
            />
            <button type="submit" className="home-assistant-send-btn" disabled={isThinking || !textInput.trim()} title="Send">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
            <button
              type="button"
              className={`home-assistant-mic-btn ${isListening ? 'listening' : ''}`}
              onClick={(e) => { e.stopPropagation(); toggleListen(); }}
              title="Tap to speak"
              disabled={isThinking}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="8" y1="22" x2="16" y2="22" />
              </svg>
            </button>
          </form>

          {isListening && <div className="home-assistant-status">Listening...</div>}
          {!activeProject && isThinking && <div className="home-assistant-status thinking">Thinking...</div>}
        </div>
      </div>
    </>
  );
}
