import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import CharacterViewer from './CharacterViewer';
import { useGPT } from '../hooks/useGPT';
import '../styles/components/HomeAssistant.css';

// Updated System Instructions
const SYSTEM_INSTRUCTIONS = `You are the official AI Assistant for the Enabling Technology Collaboratory (ETC) at Temasek Polytechnic (School of Engineering).
Your role is to provide information about ETC's technologies, projects, and partners. 
You must respond concisely, professionally, and in a friendly manner. YOU MUST SPEAK IN ENGLISH ONLY.

Core Facts about ETC:
- Mission: A multi-disciplinary centre integrating core enabling technologies (AI, IoT, Immersive Media) to help industries innovate.
- Core Technologies:
  1. AI & Machine Learning: Chatbots, video analytics, image recognition.
  2. Internet of Things (IoT): Embedded systems, cloud/mobile computing.
  3. Immersive Media: VR/AR training and simulation, integration with AI/IoT.
- Key Projects: 
  - AI-Assisted Immersive Role-play Platform (MOE Innergy Gold 2025)
  - E-Practical and Immersive Technology Learning Package
  - SMART Serious Game Analytics Engine (MOE Innergy Silver 2022)
  - TPEBot (Educational Chatbot)
  - IVAMped (VR game for IV medication administration)
  - Aerospace AR/VR modules and Patient Safety VR applications.
- Industry Partners: Amazon Web Services (AWS), Changi General Hospital, CERTIS-CISCO, Helen O'Grady Asia, JMA Research, KiteSense, Metabots, Security Industry Institute, Tan Tock Seng Hospital.

CRITICAL INSTRUCTION FOR NAVIGATION: 
If the user asks to see, go to, or learn about a specific topic/page, you MUST provide a brief summary of that topic based on the Core Facts, AND THEN append a navigation tag at the VERY END of your response to bring them there.
- For About Us or Introduction: Summarize ETC's mission and core technologies. Append [NAV_/Introduction]
- For Partners or Ecosystem: Mention some key partners we collaborate with. Append [NAV_/OurPartners]
- For Projects, Portfolio, or Demos: Briefly mention a couple of key projects (e.g. AI Role-play, VR Patient Safety). Append [NAV_/OurProjects]
- For Home page: Append [NAV_/Home]
Append the navigation tag as the absolute last characters of your response, with nothing after it — no punctuation, no spaces, no words.
Bad:  "Let's go! [NAV_/OurPartners] sometime"
Good: "Let's learn more about our partners! [NAV_/OurPartners]"
Example: "Here is our Introduction. ETC is a multi-disciplinary centre integrating AI, IoT, and Immersive Media to help industries innovate. Let's head there now! [NAV_/Introduction]"`;

export default function HomeAssistant() {
  const navigate = useNavigate();
  const { fetchGPTResponse, transcribeAudio } = useGPT();

  // Layout & UI States
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [textInput, setTextInput] = useState("");

  // Chat States
  const [transcriptText, setTranscriptText] = useState("");
  const [aiResponseText, setAiResponseText] = useState("Hi! I am the official ETC Assistant. How can I help you today?");

  // State for the 3D avatar's script and audio synchronization
  const [latestScript, setLatestScript] = useState("");
  const [revealData, setRevealData] = useState(null);

  // Use a ref to hold the navigation target so it doesn't trigger extra re-renders
  const pendingNavRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // --- Synchronization Effect ---
  // Listens for the signal that the audio has downloaded and is ready to play
  useEffect(() => {
    if (revealData) {
      // Audio is ready! Hide the typing dots and show the text bubble
      setIsThinking(false);
      setAiResponseText(revealData.text);

      // Trigger navigation if a tag was provided by the AI
      if (pendingNavRef.current) {
        // Capture the route in case pendingNavRef gets cleared quickly
        const route = pendingNavRef.current;
        setTimeout(() => { navigate(route); }, 1500);
        pendingNavRef.current = null;
      }
    }
  }, [revealData, navigate]);

  // --- Custom TTS Handler for CharacterViewer ---
  const handleTTSFetch = async (text) => {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, format: 'wav' })
    });

    // Signal the React component that the fetch is done
    setRevealData({ text, id: Date.now() });

    return response;
  };

  // --- Core AI Chat Logic ---
  const sendMessage = async (userMessage) => {
    setTranscriptText(userMessage);
    setAiResponseText("");
    setIsThinking(true);
    pendingNavRef.current = null;

    try {
      // Safely separate the system instructions from the user's actual question
      const enrichedMessage = `${SYSTEM_INSTRUCTIONS}\n\nUser Query: "${userMessage}"`;
      const aiMessage = await fetchGPTResponse(enrichedMessage);

      // Parse [NAV_...] tag for voice navigation using a flexible regex
      let speakText = aiMessage;
      let navTarget = null;
      const navMatch = aiMessage.match(/^([\s\S]*?)\s*\[NAV_\s*(.*?)\s*\]/);

      if (navMatch) {
        speakText = navMatch[1].trim(); // everything BEFORE the tag
        navTarget = navMatch[2].trim(); // the route
      } else {
        speakText = aiMessage.trim();
      }

      // If the AI returned an empty string for some reason, abort safely
      if (!speakText) {
        setIsThinking(false);
        if (navTarget) navigate(navTarget);
        return;
      }

      // Store the navigation target in the ref
      pendingNavRef.current = navTarget;

      // Update the script. 
      // FIX: Append a zero-width space if the text is identical to the last text.
      // This forces CharacterViewer's useEffect to run even if the AI repeats itself.
      setLatestScript(prev => prev === speakText ? speakText + '\u200B' : speakText);

    } catch (e) {
      console.error("Chat error:", e);
      setIsThinking(false);
      setAiResponseText("I'm sorry, I am having trouble connecting to my brain. Please try again.");
    }
  };

  // --- Voice Input ---
  const toggleListen = async () => {
    if (isListening) {
      // Stop recording — this triggers ondataavailable + onstop
      mediaRecorderRef.current?.stop();
    } else {
      await startListening();
    }
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      setIsListening(true);
      setTranscriptText("");
      setAiResponseText("");

      // --- Silence detection via AudioContext ---
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let silenceStart = null;
      let stopped = false;
      const SILENCE_THRESHOLD = 10;
      const SILENCE_DURATION = 1400;

      const checkSilence = () => {
        if (stopped || !mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") return;

        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        if (volume < SILENCE_THRESHOLD) {
          if (!silenceStart) silenceStart = Date.now();
          else if (Date.now() - silenceStart > SILENCE_DURATION) {
            stopped = true;
            audioContext.close();
            mediaRecorderRef.current?.stop();
            return;
          }
        } else {
          silenceStart = null;
        }

        requestAnimationFrame(checkSilence);
      };

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stopped = true;
        stream.getTracks().forEach(track => track.stop());
        setIsListening(false);

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        setIsThinking(true);
        try {
          const transcript = await transcribeAudio(audioBlob);
          if (transcript?.trim()) {
            await sendMessage(transcript.trim());
          } else {
            setIsThinking(false);
            setAiResponseText("Sorry, I couldn't make that out. Please try again.");
          }
        } catch (err) {
          console.error("STT error:", err);
          setIsThinking(false);
          setAiResponseText("Sorry, transcription failed. Please try again.");
        }
      };

      mediaRecorder.start();
      requestAnimationFrame(checkSilence);

    } catch (err) {
      console.error("Mic access denied:", err);
      setIsListening(false);
      alert("Microphone access is required for voice input.");
    }
  };

  // --- Text Input ---
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textInput.trim() || isThinking) return;
    const msg = textInput.trim();
    setTextInput("");
    await sendMessage(msg);
  };

  return (
    <>
      <button
        className={`home-assistant-toggle-btn ${isCollapsed ? 'collapsed' : ''}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Show Assistant" : "Hide Assistant"}
      >
        {isCollapsed ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </button>

      <div className={`home-assistant-container ${isCollapsed ? 'collapsed' : ''}`}>

        <div className="home-assistant-canvas-wrapper" style={{ position: 'absolute', inset: 0 }}>
          <CharacterViewer
            modelPath="/model/FModel2.glb"
            ttsEndpoint={handleTTSFetch}
            script={latestScript}
            button={false}
            modelScale={0.9}
          />
        </div>

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
          {transcriptText && !isListening && (
            <div className="home-assistant-bubble user-bubble">
              {transcriptText}
            </div>
          )}

          {isThinking && (
            <div className="home-assistant-bubble ai-bubble thinking">
              <div className="typing-dot" style={{ animationDelay: '0s' }}></div>
              <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
              <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}

          {aiResponseText && !isThinking && (
            <div className="home-assistant-bubble ai-bubble">
              {aiResponseText}
            </div>
          )}

          <form className="home-assistant-text-form" onSubmit={handleTextSubmit}>
            <input
              type="text"
              className="home-assistant-text-input"
              placeholder="Type a question..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={isThinking}
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
          {isThinking && <div className="home-assistant-status thinking">Thinking...</div>}
        </div>
      </div>
    </>
  );
}