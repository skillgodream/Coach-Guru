import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Activity, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { callAI } from '../services/aiService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
}

export const TempLlmTester: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{
    hasGeminiKey?: boolean;
    keyPrefix?: string | null;
    status?: string;
  } | null>(null);
  const [healthChecking, setHealthChecking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'system',
      text: 'Temporary LLM diagnostic console. Test prompt responses directly from deployment.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const checkHealth = async () => {
    setHealthChecking(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealthStatus(data);
      } else {
        setHealthStatus({ status: `HTTP ${res.status}`, hasGeminiKey: false });
      }
    } catch (err: any) {
      setHealthStatus({ status: 'Offline / Network error', hasGeminiKey: false });
    } finally {
      setHealthChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkHealth();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (overridePrompt?: string) => {
    const textToSend = overridePrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!overridePrompt) setInput('');
    setLoading(true);

    try {
      const startTime = Date.now();
      const result = await callAI({
        prompt: textToSend,
        systemInstruction: 'You are a helpful operational assistant. Respond concisely and clearly.',
      });
      const durationMs = Date.now() - startTime;

      let displayText = '';
      if (typeof result === 'string') {
        displayText = result;
      } else {
        displayText = JSON.stringify(result, null, 2);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: displayText,
          timestamp: `${new Date().toLocaleTimeString()} (${durationMs}ms)`,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'system',
          text: `Error: ${err.message || 'Failed to call LLM'}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating launcher trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl border border-indigo-400/40 text-xs font-bold transition-transform active:scale-95 cursor-pointer backdrop-blur-md"
          title="Open Temp LLM Test Chat"
        >
          <Sparkles size={14} className="animate-spin text-amber-300" />
          <span>🧪 LLM Test</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-90 max-w-[calc(100vw-2rem)] h-[460px] bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <div>
                <h4 className="text-xs font-black tracking-wide uppercase text-slate-100">
                  Temp LLM Tester
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span>API Key:</span>
                  {healthStatus?.hasGeminiKey ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                      <CheckCircle size={10} /> Active ({healthStatus.keyPrefix})
                    </span>
                  ) : healthStatus ? (
                    <span className="text-rose-400 font-bold flex items-center gap-0.5">
                      <AlertTriangle size={10} /> Missing
                    </span>
                  ) : (
                    <span>Checking...</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={checkHealth}
                disabled={healthChecking}
                className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-700 cursor-pointer"
                title="Refresh Health Status"
              >
                <RefreshCw size={13} className={healthChecking ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-700 cursor-pointer"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Preset quick test pills */}
          <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleSend('Respond with: {"status": "ok", "message": "Gemini is connected!"}')}
              disabled={loading}
              className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium whitespace-nowrap cursor-pointer"
            >
              Ping Test
            </button>
            <button
              onClick={() => handleSend('Give 3 golden rules for warehouse pallet safety in JSON format.')}
              disabled={loading}
              className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium whitespace-nowrap cursor-pointer"
            >
              Warehouse Rules
            </button>
            <button
              onClick={() => handleSend('Explain hotel housekeeping contact dwell time in 1 sentence.')}
              disabled={loading}
              className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium whitespace-nowrap cursor-pointer"
            >
              Housekeeping
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs font-mono">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-2.5 rounded-xl ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white ml-6'
                    : m.sender === 'assistant'
                    ? 'bg-slate-800 text-emerald-300 mr-4 border border-slate-700 whitespace-pre-wrap'
                    : 'bg-amber-950/40 text-amber-300 border border-amber-700/40 text-[11px]'
                }`}
              >
                <div className="text-[9px] opacity-60 mb-1 flex items-center justify-between">
                  <span>{m.sender.toUpperCase()}</span>
                  <span>{m.timestamp}</span>
                </div>
                <div>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 p-2 text-xs text-indigo-300 italic">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                Calling Gemini API (/api/coach)...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-slate-800/90 border-t border-slate-700 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask or test Gemini..."
              disabled={loading}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
