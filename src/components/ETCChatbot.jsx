import { useState, useRef, useEffect } from 'react';

export default function ETCChatbot() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I\'m the ETC assistant. Ask me anything about our projects, partners, or mission.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: "I'm a placeholder for the AI backend. Connect me to an LLM to answer questions about ETC!"
      }]);
    }, 1200);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '460px',
      background: 'var(--bg-card)',
      backdropFilter: 'blur(20px)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-soft)'
    }}>
      {/* Header */}
      <div style={{
        padding: '0.85rem 1.25rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem'
      }}>
        <div style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: '#22c55e',
          boxShadow: '0 0 6px rgba(34, 197, 94, 0.4)'
        }} />
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 600,
          fontSize: '0.88rem',
          color: 'var(--text-primary)'
        }}>ETC Assistant</span>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            padding: '0.65rem 1rem',
            borderRadius: msg.role === 'user'
              ? '16px 16px 4px 16px'
              : '16px 16px 16px 4px',
            background: msg.role === 'user'
              ? 'linear-gradient(135deg, #0d9488, #059669)'
              : 'rgba(245, 245, 247, 0.9)',
            color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
            fontSize: '0.88rem',
            lineHeight: '1.55',
            fontFamily: 'Inter, sans-serif',
            boxShadow: msg.role === 'user'
              ? '0 2px 6px rgba(13, 148, 136, 0.2)'
              : '0 1px 3px rgba(0, 0, 0, 0.03)',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            {msg.content}
          </div>
        ))}

        {isTyping && (
          <div style={{
            alignSelf: 'flex-start',
            padding: '0.65rem 1rem',
            borderRadius: '16px 16px 16px 4px',
            background: 'rgba(245, 245, 247, 0.9)',
            display: 'flex',
            gap: '4px',
            alignItems: 'center'
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: 'var(--text-secondary)',
                opacity: 0.4,
                animation: `typing-dot 1.4s ease-in-out ${i * 0.2}s infinite`
              }} />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{
        padding: '0.65rem 0.85rem',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          style={{
            flex: 1,
            padding: '0.6rem 1rem',
            background: 'rgba(245, 245, 247, 0.8)',
            border: '1px solid transparent',
            borderRadius: 'var(--radius-pill)',
            color: 'var(--text-primary)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.88rem',
            outline: 'none',
            transition: 'all var(--transition)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--accent-teal)';
            e.target.style.background = '#fff';
            e.target.style.boxShadow = '0 0 0 3px rgba(13, 148, 136, 0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'transparent';
            e.target.style.background = 'rgba(245, 245, 247, 0.8)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          type="submit"
          style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0d9488, #059669)',
            color: '#fff',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            transition: 'all var(--transition)',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(13, 148, 136, 0.25)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>

      <style>{`
        @keyframes typing-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
