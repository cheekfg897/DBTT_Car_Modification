import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { streamChat } from '../../engine/chatService';
import { getPopularCombos } from '../../engine/analyticsEngine';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const customization = useStore((s) => s.customization);
  const combos = getPopularCombos();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Add empty assistant placeholder to stream into
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      await streamChat(
        newMessages,
        customization,
        (chunk) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: updated[updated.length - 1].content + chunk,
            };
            return updated;
          });
        },
        () => setLoading(false)
      );
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Sorry, I had trouble connecting. Please check your VITE_OPENAI_API_KEY.',
        };
        return updated;
      });
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-orange-500 hover:bg-orange-400 rounded-full flex items-center justify-center shadow-lg transition-colors"
      >
        {open ? (
          <X size={22} className="text-white" />
        ) : (
          <MessageCircle size={22} className="text-white" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[520px] bg-zinc-900 border border-zinc-700 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-zinc-800 border-b border-zinc-700 flex items-center gap-2">
            <Sparkles size={16} className="text-orange-400" />
            <span className="text-white font-medium text-sm">AI Customizer Assistant</span>
          </div>

          {/* Popular combos chips */}
          <div className="px-3 py-2 border-b border-zinc-700 bg-zinc-800">
            <p className="text-zinc-400 text-xs mb-2">Popular Combos</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {combos.slice(0, 3).map((combo, i) => (
                <button
                  key={i}
                  onClick={() =>
                    sendMessage(`Tell me about the ${combo.modA} + ${combo.modB} combo`)
                  }
                  className="text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-200 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors flex-shrink-0"
                >
                  {combo.modA} + {combo.modB}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-zinc-500 text-sm mt-8">
                <Sparkles size={24} className="mx-auto mb-2 text-orange-400 opacity-60" />
                <p>Ask me for customization ideas,</p>
                <p>recommendations, or pricing info.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-orange-500 text-white rounded-br-sm'
                      : 'bg-zinc-700 text-zinc-100 rounded-bl-sm'
                  }`}
                >
                  {msg.content || (loading && i === messages.length - 1 ? '▋' : '')}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-zinc-700 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Ask for recommendations..."
              className="flex-1 bg-zinc-800 text-white text-sm px-3 py-2 rounded-lg border border-zinc-600 focus:outline-none focus:border-orange-500 placeholder-zinc-500"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="bg-orange-500 hover:bg-orange-400 disabled:opacity-40 text-white p-2 rounded-lg transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
