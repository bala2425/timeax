import React, { useState, useEffect, useRef } from 'react';
import { Send, Brain, Sparkles, User, AlertCircle } from 'lucide-react';

interface AIChatbotProps {
  user: any;
}

interface Message {
  sender: 'user' | 'ai';
  message: string;
  timestamp: string;
}

const CHIPS = [
  "How can I reduce screen time?",
  "What is the Pomodoro Technique?",
  "Recommend healthy morning routines",
  "How to maintain study consistency?"
];

export default function AIChatbot({ user }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      message: "Hello! I am TIMEX AI, your personalized productivity, time experience, and habits guide. Ask me anything about establishing schedules, study techniques, exercise routines, nutrition, or career directions!",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load existing chatbot history from db on startup
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/admin/chats`);
        if (res.ok) {
          const data = await res.json();
          // Filter history for current user
          const userHistory = data.filter((msg: any) => msg.userId === user.id);
          if (userHistory.length > 0) {
            setMessages(userHistory);
          }
        }
      } catch (e) {
        console.error('Error loading chat history', e);
      }
    };
    fetchHistory();
  }, [user.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      message: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, message: textToSend })
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, {
          sender: 'ai',
          message: data.reply,
          timestamp: new Date().toISOString()
        }]);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        message: "I apologize, the Gemini connection experienced an interruption. Let's try reflecting on healthy routines instead!",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-6 max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col justify-between">
      {/* Description header */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
        <span className="p-2.5 bg-orange-500/10 rounded-xl border border-orange-500/15 text-orange-400">
          <Brain className="w-5 h-5" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1">
            TIMEX Guard AI Assistant
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">Specialized</span>
          </h3>
          <p className="text-[11px] text-slate-400">Focused exclusively on healthy lifestyle, exercise, productivity, study, and time habits.</p>
        </div>
      </div>

      {/* Messages Timeline container */}
      <div className="flex-1 bg-[#0A0A0B]/80 border border-white/5 rounded-3xl p-6 overflow-y-auto space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`p-2 rounded-xl shrink-0 border ${
              msg.sender === 'user' 
                ? 'bg-white/5 border-white/10 text-slate-300' 
                : 'bg-orange-500/10 border-orange-500/15 text-orange-400'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
            </div>

            <div className={`p-4 rounded-2xl text-xs leading-relaxed shadow-md ${
              msg.sender === 'user'
                ? 'bg-orange-500 text-white rounded-tr-none'
                : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none whitespace-pre-wrap'
            }`}>
              {msg.message}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/15 text-orange-400 animate-pulse">
              <Brain className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 text-slate-400 text-xs rounded-tl-none animate-pulse">
              TIMEX AI is contemplating optimization routines...
            </div>
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>

      {/* Interactive suggestions chips */}
      <div className="space-y-3">
        {messages.length < 3 && (
          <div className="flex flex-wrap gap-2">
            {CHIPS.map(chip => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="text-[10px] font-semibold text-slate-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1.5 transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <form onSubmit={e => { e.preventDefault(); handleSend(input); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask about workout regimens, time management skills, Pomodoro blocks..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-orange-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
