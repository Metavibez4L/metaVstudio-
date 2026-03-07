'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, Trash2, Terminal, Cpu } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.content || data.error || 'No response' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error connecting to AI. Make sure Ollama is running.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="h-3 w-3 text-[#bf5af2]/50 animate-pulse" />
            <span className="text-[9px] font-mono text-[#bf5af2]/50 tracking-[0.3em]">AI::DIRECTOR</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-[#bf5af2]" />
            <span className="text-glow-magenta">AI</span> <span className="text-[#00f0ff] text-glow-cyan">Director</span>
          </h1>
          <p className="text-[10px] font-mono text-muted/40 mt-1 tracking-wider">▸ PRODUCTION INTELLIGENCE — CREATIVE STRATEGY ENGINE</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="inline-flex items-center gap-1.5 rounded-md border border-border/40 px-3 py-1.5 text-[10px] font-mono text-muted/50 hover:text-[#ff3366] hover:border-[#ff3366]/30 tracking-wider transition-all"
          >
            <Trash2 className="h-3 w-3" /> CLEAR
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto neon-card p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <Sparkles className="h-12 w-12 text-[#bf5af2]/30 mx-auto" />
                <div className="absolute inset-0 blur-xl bg-[#bf5af2]/10 rounded-full" />
              </div>
              <div>
                <p className="text-xs font-mono text-muted/50 tracking-wider">AI DIRECTOR READY</p>
                <p className="text-[10px] font-mono text-muted/30 mt-1">Production intelligence at your command</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {[
                  'Write a creative brief for a product launch film',
                  'Generate a scene breakdown for a 30s ad spot',
                  'Create a shot list for a cinematic brand video',
                  'Build an ad campaign with 3 messaging angles',
                  'Write post-production edit notes for my rough cut',
                  'Create a content repurposing plan from hero film',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="rounded-md border border-border/40 bg-background/50 px-3 py-1.5 text-[10px] font-mono text-muted/50 hover:text-[#00f0ff] hover:border-[#00f0ff]/30 tracking-wider transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-[#bf5af2]/10 border border-[#bf5af2]/20 text-foreground'
                  : 'bg-[#00f0ff]/5 border border-[#00f0ff]/15'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-2 text-[9px] font-mono text-[#00f0ff]/40 tracking-widest">
                  <Cpu className="h-2.5 w-2.5" /> AI::RESPONSE
                </div>
              )}
              <pre className="whitespace-pre-wrap font-sans text-foreground/80">{msg.content}</pre>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-xl bg-[#00f0ff]/5 border border-[#00f0ff]/15 px-4 py-3 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#00f0ff]" />
              <span className="text-[10px] font-mono text-[#00f0ff]/50 tracking-wider animate-pulse">PROCESSING...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <div className="flex-1 relative">
          <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#00f0ff]/30" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Enter command..."
            className="w-full rounded-xl border border-border/40 bg-background/80 pl-9 pr-4 py-3 text-sm font-mono focus:border-[#00f0ff]/40 focus:outline-none focus:shadow-[0_0_15px_rgba(0,240,255,0.05)] transition-all placeholder:text-muted/30"
            disabled={loading}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="rounded-xl border border-[#bf5af2]/30 bg-[#bf5af2]/10 px-4 py-3 text-[#bf5af2] hover:bg-[#bf5af2]/20 hover:shadow-[0_0_15px_rgba(191,90,242,0.1)] disabled:opacity-30 transition-all"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
