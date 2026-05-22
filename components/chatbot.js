"use client";
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

// ─── GANTI ICON DARI FIGMA ───────────────────────────────────────────────────
// Cara 1: Paste SVG dari Figma — export as SVG, copy isi tag <svg>-nya ke sini
// Cara 2: Pakai URL image dari Figma (harus di-publish dulu atau hosted)
//   const CUSTOM_ICON_URL = "https://your-hosted-image.com/robot.png";
//   Terus ganti komponen <BotIcon> di bawah jadi: <img src={CUSTOM_ICON_URL} width={size} height={size} />
// ─────────────────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
    50% { transform: translateY(-10px) rotate(1.5deg); }
  }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 12px rgba(20, 184, 166, 0.4), 0 4px 20px rgba(20, 184, 166, 0.15); }
    50% { box-shadow: 0 0 24px rgba(20, 184, 166, 0.65), 0 4px 32px rgba(20, 184, 166, 0.3); }
  }

  @keyframes eye-blink {
    0%, 90%, 100% { transform: scaleY(1); }
    95% { transform: scaleY(0.1); }
  }

  @keyframes slide-up {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes bubble-in {
    from { opacity: 0; transform: scale(0.85) translateY(8px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  @keyframes typing-dot {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
    40% { transform: translateY(-5px); opacity: 1; }
  }

  .robot-float {
    animation: float 3s ease-in-out infinite;
    cursor: pointer;
  }
  .robot-float:hover {
    animation: float 1.5s ease-in-out infinite;
  }

  .chat-window {
    animation: slide-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  /* Bot bubble — putih bersih, border aquamarine */
  .bot-bubble {
    animation: bubble-in 0.25s ease-out forwards;
    background: #ffffff;
    border: 1.5px solid #2dd4bf;
    box-shadow: 0 2px 12px rgba(20, 184, 166, 0.15);
    color: #1e293b;
  }

  /* User bubble — aquamarine soft, teks hitam */
  .user-bubble {
    animation: bubble-in 0.25s ease-out forwards;
    background: #ccfbf1;
    border: 1.5px solid #5eead4;
    box-shadow: 0 2px 10px rgba(20, 184, 166, 0.2);
    color: #000000;
    font-weight: 600;
  }

  .eye-left  { animation: eye-blink 4s ease-in-out infinite; }
  .eye-right { animation: eye-blink 4s ease-in-out infinite 0.1s; }

  .typing-dot:nth-child(1) { animation: typing-dot 1s ease-in-out infinite; }
  .typing-dot:nth-child(2) { animation: typing-dot 1s ease-in-out infinite 0.15s; }
  .typing-dot:nth-child(3) { animation: typing-dot 1s ease-in-out infinite 0.3s; }

  .input-field {
    background: #f0fdf9;
    border: 1.5px solid #99f6e4;
    color: #0f172a;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .input-field::placeholder { color: #94a3b8; }
  .input-field:focus {
    outline: none;
    border-color: #2dd4bf;
    box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.2);
  }

  .send-btn {
    background: linear-gradient(135deg, #14b8a6, #0d9488);
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 2px 10px rgba(20, 184, 166, 0.4);
  }
  .send-btn:hover {
    transform: scale(1.08);
    box-shadow: 0 2px 18px rgba(20, 184, 166, 0.6);
  }
  .send-btn:active { transform: scale(0.95); }

  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

function BotIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer glow ring */}
      <circle cx="50" cy="50" r="46" stroke="#2dd4bf" strokeWidth="1" strokeDasharray="4 3" opacity="0.4"/>

      {/* Main face circle */}
      <circle cx="50" cy="50" r="36" fill="#e6fffe" stroke="#2dd4bf" strokeWidth="2"/>

      {/* Inner face highlight */}
      <circle cx="50" cy="44" r="26" fill="white" opacity="0.6"/>

      {/* Left eye — hexagon-ish scanner */}
      <g className="eye-left" style={{transformOrigin:'35px 44px'}}>
        <rect x="27" y="37" width="16" height="14" rx="5" fill="#0d9488"/>
        <rect x="30" y="40" width="10" height="8" rx="3" fill="#5eead4"/>
        <circle cx="35" cy="44" r="2.5" fill="white"/>
        <circle cx="35" cy="44" r="1" fill="#0d9488"/>
      </g>

      {/* Right eye */}
      <g className="eye-right" style={{transformOrigin:'65px 44px'}}>
        <rect x="57" y="37" width="16" height="14" rx="5" fill="#0d9488"/>
        <rect x="60" y="40" width="10" height="8" rx="3" fill="#5eead4"/>
        <circle cx="65" cy="44" r="2.5" fill="white"/>
        <circle cx="65" cy="44" r="1" fill="#0d9488"/>
      </g>

      {/* Nose bridge line */}
      <line x1="50" y1="52" x2="50" y2="56" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Mouth — grid/data display */}
      <rect x="32" y="57" width="36" height="10" rx="4" fill="#ccfbf1" stroke="#2dd4bf" strokeWidth="1.2"/>
      <line x1="41" y1="57" x2="41" y2="67" stroke="#2dd4bf" strokeWidth="0.8" opacity="0.6"/>
      <line x1="50" y1="57" x2="50" y2="67" stroke="#2dd4bf" strokeWidth="0.8" opacity="0.6"/>
      <line x1="59" y1="57" x2="59" y2="67" stroke="#2dd4bf" strokeWidth="0.8" opacity="0.6"/>
      <rect x="34" y="59.5" width="5" height="5" rx="1.5" fill="#14b8a6" opacity="0.9"/>
      <rect x="43" y="59.5" width="5" height="5" rx="1.5" fill="#14b8a6" opacity="0.5"/>
      <rect x="52" y="59.5" width="5" height="5" rx="1.5" fill="#14b8a6" opacity="0.9"/>
      <rect x="61" y="59.5" width="5" height="5" rx="1.5" fill="#14b8a6" opacity="0.5"/>

      {/* Side ear/sensor left */}
      <rect x="8" y="42" width="8" height="16" rx="3" fill="#ccfbf1" stroke="#2dd4bf" strokeWidth="1.2"/>
      <line x1="12" y1="46" x2="12" y2="54" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Side ear/sensor right */}
      <rect x="84" y="42" width="8" height="16" rx="3" fill="#ccfbf1" stroke="#2dd4bf" strokeWidth="1.2"/>
      <line x1="88" y1="46" x2="88" y2="54" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Top antenna */}
      <line x1="50" y1="14" x2="50" y2="22" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="50" cy="11" r="4" fill="#14b8a6" stroke="#5eead4" strokeWidth="1.5"/>
      <circle cx="50" cy="11" r="1.8" fill="white"/>
    </svg>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Yo bro! Ada yang bisa gw bantu soal data resto lu?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Waduh, koneksi ke otak AI gw putus bro. Coba lagi ya!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="fixed bottom-6 right-6 z-50" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* Chat Window */}
        {isOpen && (
          <div
            className="chat-window absolute bottom-20 right-0 flex flex-col rounded-2xl overflow-hidden"
            style={{
              width: '340px',
              height: '440px',
              background: '#f8fffd',
              border: '1.5px solid #5eead4',
              boxShadow: '0 8px 40px rgba(20, 184, 166, 0.18), 0 2px 16px rgba(0,0,0,0.08)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{
                background: 'linear-gradient(135deg, #ccfbf1, #e0fdf4)',
                borderBottom: '1.5px solid #99f6e4',
              }}
            >
              <BotIcon size={30} />
              <div>
                <div style={{ color: '#0f4c40', fontWeight: 700, fontSize: '14px', letterSpacing: '0.01em' }}>
                  Vidd-Bot AI
                </div>
                <div style={{ color: '#0d9488', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }}/>
                  Online
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3" style={{ background: '#f0fdf9' }}>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[78%] px-3 py-2 text-sm leading-relaxed ${m.role === 'user' ? 'user-bubble' : 'bot-bubble'}`}
                    style={{ borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px' }}
                  >
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bot-bubble px-4 py-3 flex gap-1 items-center" style={{ borderRadius: '18px 18px 18px 4px' }}>
                    <span className="typing-dot w-2 h-2 rounded-full inline-block" style={{ background: '#14b8a6' }}/>
                    <span className="typing-dot w-2 h-2 rounded-full inline-block" style={{ background: '#14b8a6' }}/>
                    <span className="typing-dot w-2 h-2 rounded-full inline-block" style={{ background: '#14b8a6' }}/>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="p-3 flex gap-2 items-center"
              style={{ borderTop: '1.5px solid #99f6e4', background: '#ffffff' }}
            >
              <input
                className="input-field flex-1 rounded-full px-4 py-2 text-sm"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Tanya soal omzet..."
              />
              <button
                onClick={sendMessage}
                className="send-btn w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Floating Robot Button */}
        <div className="robot-float relative" onClick={() => setIsOpen(!isOpen)}>
          <div
            style={{
              background: 'linear-gradient(135deg, #ccfbf1, #ffffff)',
              border: '2px solid #2dd4bf',
              borderRadius: '50%',
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: isOpen ? 'pulse-glow 1.5s ease-in-out infinite' : 'pulse-glow 3s ease-in-out infinite',
            }}
          >
            {isOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <BotIcon size={40} />
            )}
          </div>

          {/* Notification dot */}
          {!isOpen && (
            <span
              className="absolute top-0 right-0 w-3 h-3 rounded-full"
              style={{ background: '#22c55e', border: '2px solid #ffffff', boxShadow: '0 0 6px #22c55e' }}
            />
          )}
        </div>
      </div>
    </>
  );
}