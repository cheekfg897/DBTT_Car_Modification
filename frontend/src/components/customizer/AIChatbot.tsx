import { useState, useRef, useEffect, useMemo } from 'react';
import { MessageCircle, X, Send, Sparkles, Check, Wand2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { streamChat, type SuggestedBuild } from '../../engine/chatService';
import { getPopularCombos } from '../../engine/analyticsEngine';
import { getMod, getFinish, getColor } from '../../utils/dataLookup';
import type { FinishType } from '../../types/customization';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestedBuild?: SuggestedBuild;
}

function ApplyBuildCard({ build, onApply }: { build: SuggestedBuild; onApply: () => void }) {
  const [applied, setApplied] = useState(false);

  const colorName = getColor(build.bodyColor ?? '')?.name;
  const finishName = getFinish(build.finishType ?? '')?.name;
  const modNames = build.selectedMods.map((id) => getMod(id)?.name).filter(Boolean);

  function handleApply() {
    onApply();
    setApplied(true);
  }

  return (
    <div className="mt-2 bg-zinc-800 border border-orange-500/40 rounded-xl p-3 space-y-2">
      <div className="flex items-center gap-1.5 text-orange-400 text-xs font-semibold">
        <Wand2 size={12} />
        Suggested Build
      </div>

      <p className="text-zinc-300 text-xs leading-relaxed">{build.summary}</p>

      <div className="space-y-1 text-xs">
        {build.bodyColor && (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full border border-zinc-600 shrink-0"
              style={{ background: build.bodyColor }}
            />
            <span className="text-zinc-400">
              {colorName || build.bodyColor} · {finishName || build.finishType} finish
            </span>
          </div>
        )}
        {modNames.length > 0 && (
          <div className="text-zinc-400">
            <span className="text-zinc-500">Mods: </span>
            {modNames.join(', ')}
          </div>
        )}
      </div>

      <button
        onClick={handleApply}
        disabled={applied}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-700 disabled:text-zinc-400 text-white"
      >
        {applied ? (
          <>
            <Check size={12} /> Applied!
          </>
        ) : (
          <>
            <Wand2 size={12} /> Apply This Build
          </>
        )}
      </button>
    </div>
  );
}

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const customization = useStore((s) => s.customization);
  const setBodyColor = useStore((s) => s.setBodyColor);
  const setFinishType = useStore((s) => s.setFinishType);
  const setRimColor = useStore((s) => s.setRimColor);
  const setCaliperColor = useStore((s) => s.setCaliperColor);
  const toggleMod = useStore((s) => s.toggleMod);

  const combos = useMemo(() => getPopularCombos(), []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function applyBuild(build: SuggestedBuild) {
    if (build.bodyColor) setBodyColor(build.bodyColor);
    if (build.finishType) setFinishType(build.finishType as FinishType);
    if (build.rimColor) setRimColor(build.rimColor);
    if (build.caliperColor) setCaliperColor(build.caliperColor);

    // Add mods not yet selected, remove mods not in suggestion
    const toAdd = build.selectedMods.filter((id) => !customization.selectedMods.includes(id));
    const toRemove = customization.selectedMods.filter((id) => !build.selectedMods.includes(id));
    for (const id of [...toAdd, ...toRemove]) toggleMod(id);
  }

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    abortRef.current?.abort();
    abortRef.current = new AbortController();

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
        () => setLoading(false),
        (build) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              suggestedBuild: build,
            };
            return updated;
          });
        },
        abortRef.current.signal
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
        <div className="fixed bottom-24 right-6 z-50 w-96 h-140 bg-zinc-900 border border-zinc-700 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
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
                  className="text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-200 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors shrink-0"
                >
                  {combo.modA} + {combo.modB}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-zinc-500 text-sm mt-6 space-y-1">
                <Sparkles size={24} className="mx-auto mb-2 text-orange-400 opacity-60" />
                <p>Describe your style and I'll build</p>
                <p>a custom configuration for you.</p>
                <p className="text-zinc-600 text-xs mt-2">
                  e.g. "aggressive track build" or "clean JDM look"
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${msg.role === 'user' ? '' : 'w-full'}`}>
                  {(msg.content || (loading && i === messages.length - 1)) && (
                    <div
                      className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-orange-500 text-white rounded-br-sm'
                          : 'bg-zinc-700 text-zinc-100 rounded-bl-sm'
                      }`}
                    >
                      {msg.content || (loading && i === messages.length - 1 ? '▋' : '')}
                    </div>
                  )}
                  {msg.suggestedBuild && (
                    <ApplyBuildCard
                      build={msg.suggestedBuild}
                      onApply={() => applyBuild(msg.suggestedBuild!)}
                    />
                  )}
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
              placeholder='Try "aggressive track build"…'
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
