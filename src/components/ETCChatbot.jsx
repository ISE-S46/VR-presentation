import { useState, useEffect, useRef } from 'react';
import { useGPT } from '../hooks/useGPT';
import '../styles/components/ETCChatbot.css';

export default function ETCChatbot({ onResponseReceived }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm the ETC assistant. Ask me anything about our projects, partners, or mission." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const { fetchGPTResponse } = useGPT();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;

    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setIsTyping(true);

    const aiReply = await fetchGPTResponse(userText);

    if (onResponseReceived) {
      onResponseReceived(aiReply);
    }

    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'ai', content: aiReply }]);
  };

  return (
    <div className="chatbot-container">
      {/* Header */}
      <div className="chatbot-header">
        <div className="chatbot-status-dot" />
        <span className="chatbot-title">ETC Assistant</span>
      </div>

      {/* Messages */}
      <div className="chatbot-messages-area">
        {messages.map((msg, i) => (
          <div key={i} className={`chatbot-bubble chatbot-bubble-${msg.role}`}>
            {msg.content}
          </div>
        ))}

        {isTyping && (
          <div className="chatbot-bubble chatbot-bubble-ai typing-indicator">
            {[0, 1, 2].map(i => (
              <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="chatbot-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          className="chatbot-input"
        />
        <button type="submit" className="chatbot-submit-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
}