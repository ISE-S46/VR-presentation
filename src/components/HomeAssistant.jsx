import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import CharacterViewer from './CharacterViewer';
import { CharacterContext } from '../avatar/context/characterContext';
import '../styles/components/HomeAssistant.css';

// Place your OpenAI API Key here (for local testing)
// Note: For production, move this to a Backend or use Environment Variables
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

function AssistantMic() {
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");
  const [aiResponseText, setAiResponseText] = useState("Hi! I am the official ETC Assistant. How can I help you today?");
  const [textInput, setTextInput] = useState("");
  const navigate = useNavigate();

  // Conversation History and System Prompt (Knowledge Injection)
  const [chatHistory, setChatHistory] = useState([
    {
      role: "system",
      content: `You are the official AI Assistant for the Enabling Technology Collaboratory (ETC) at Temasek Polytechnic (School of Engineering).
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
Example: "Here is our Introduction. ETC is a multi-disciplinary centre integrating AI, IoT, and Immersive Media to help industries innovate. Let's head there now! [NAV_/Introduction]"`
    },
    {
      role: "assistant",
      content: "Hi! I am the official ETC Assistant. How can I help you today?"
    }
  ]);

  const ctx = useContext(CharacterContext);
  const recognitionRef = useRef(null);

  // --- Core AI Chat Logic (shared between voice and text) ---
  const sendMessage = async (userMessage) => {
    setTranscriptText(userMessage);
    setAiResponseText("");
    setIsThinking(true);

    try {
      const newHistory = [...chatHistory, { role: "user", content: userMessage }];
      setChatHistory(newHistory);

      if (!OPENAI_API_KEY || OPENAI_API_KEY === "YOUR_OPENAI_API_KEY_HERE") {
        throw new Error("Missing API Key");
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: newHistory,
          max_tokens: 200,
          temperature: 0.7,
        })
      });

      if (!response.ok) throw new Error("OpenAI API Error");

      const data = await response.json();
      const aiMessage = data.choices[0].message.content;

      // Parse [NAV_...] tag for voice navigation
      let speakText = aiMessage;
      let navTarget = null;
      const navMatch = aiMessage.match(/\[NAV_(.*?)\]/);

      if (navMatch) {
        navTarget = navMatch[1];
        speakText = aiMessage.replace(navMatch[0], '').trim();
      }

      setChatHistory([...newHistory, { role: "assistant", content: aiMessage }]);
      setAiResponseText(speakText); // Show AI response as text bubble

      // Use OpenAI TTS for natural voice
      try {
        const audioResponse = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({ model: "tts-1", voice: "nova", input: speakText })
        });

        if (audioResponse.ok) {
          const audioBlob = await audioResponse.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          if (ctx && ctx.speakLocal) await ctx.speakLocal(audioUrl, speakText);
        } else {
          console.warn("TTS API returned non-ok status");
        }
      } catch (err) {
        console.error("TTS error:", err);
      }

      // Voice Navigation: change page after speaking
      if (navTarget) {
        setTimeout(() => { navigate(navTarget); }, 1500);
      }
    } catch (e) {
      console.error("Chat error:", e);
      const errorMsg = e.message === "Missing API Key"
        ? "Please add the OpenAI API Key in the environment file first."
        : "I'm sorry, I am having trouble connecting to my brain. Please try again.";
      setAiResponseText(errorMsg);
    } finally {
      setIsThinking(false);
    }
  };

  // --- Voice Input ---
  const toggleListen = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      startListening();
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("This browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-SG';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscriptText("");
      setAiResponseText("");
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      await sendMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => { setIsListening(false); };
    recognition.start();
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
    <div className="home-assistant-mic-wrapper">
      {/* User's transcript bubble */}
      {transcriptText && !isListening && (
        <div className="home-assistant-bubble user-bubble">
          {transcriptText}
        </div>
      )}
      {/* AI thinking indicator */}
      {isThinking && (
        <div className="home-assistant-bubble ai-bubble thinking">
          <div className="typing-dot" style={{ animationDelay: '0s' }}></div>
          <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
          <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}
      {/* AI response text bubble */}
      {aiResponseText && !isThinking && (
        <div className="home-assistant-bubble ai-bubble">
          {aiResponseText}
        </div>
      )}

      {/* Text input form */}
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
        {/* Mic button */}
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
  );
}

export default function HomeAssistant() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Collapse / Expand toggle button */}
      <button
        className={`home-assistant-toggle-btn ${isCollapsed ? 'collapsed' : ''}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Show Assistant" : "Hide Assistant"}
      >
        {isCollapsed ? (
          // Chat bubble icon when collapsed
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        ) : (
          // Chevron down icon when expanded
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </button>

      {/* Avatar container */}
      <div className={`home-assistant-container ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="home-assistant-canvas-wrapper">
          <CharacterViewer modelPath="/model/FModel2.glb" position={[0, -2.5, 0]} scale={2.5}>
            <AssistantMic />
          </CharacterViewer>
        </div>
      </div>
    </>
  );
}
