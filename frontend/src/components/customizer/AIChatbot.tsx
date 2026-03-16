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

const BTN = 56; // button size px
const PANEL_W = 384;
const PANEL_H = 560;

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Draggable position (top-left of button)
  const [pos, setPos] = useState(() => ({
    x: window.innerWidth - BTN - 24,
    y: window.innerHeight - BTN - 24,
  }));
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const pointerOrigin = useRef({ x: 0, y: 0 });
  const posOrigin = useRef({ x: 0, y: 0 });

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    isDragging.current = true;
    hasMoved.current = false;
    pointerOrigin.current = { x: e.clientX, y: e.clientY };
    posOrigin.current = { ...pos };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!isDragging.current) return;
    const dx = e.clientX - pointerOrigin.current.x;
    const dy = e.clientY - pointerOrigin.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasMoved.current = true;
    if (!hasMoved.current) return;
    setPos({
      x: Math.max(0, Math.min(window.innerWidth - BTN, posOrigin.current.x + dx)),
      y: Math.max(0, Math.min(window.innerHeight - BTN, posOrigin.current.y + dy)),
    });
  }

  function onPointerUp() {
    if (!hasMoved.current) setOpen((o) => !o);
    isDragging.current = false;
  }

  // Position the chat panel so it stays fully on screen
  const panelLeft = Math.max(8, Math.min(window.innerWidth - PANEL_W - 8, pos.x + BTN - PANEL_W));
  const spaceAbove = pos.y - 8;
  const spaceBelow = window.innerHeight - (pos.y + BTN) - 8;
  const openAbove = spaceAbove >= spaceBelow;
  const panelTop = openAbove ? pos.y - Math.min(PANEL_H, spaceAbove) - 8 : pos.y + BTN + 8;
  const panelHeight = openAbove ? Math.min(PANEL_H, spaceAbove) : Math.min(PANEL_H, spaceBelow);

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
      {/* Draggable floating button + label */}
      <div
        className="fixed z-60 select-none"
        style={{ left: pos.x, top: pos.y, width: BTN }}
      >
        {/* Label above button — hidden when chat is open */}
        {!open && (
          <div
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-semibold text-black shadow-lg pointer-events-none"
            style={{ background: '#f6bd2d' }}
          >
            AI Chat
          </div>
        )}
        <button
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="w-14 h-14 bg-orange-500 hover:bg-orange-400 rounded-full flex items-center justify-center shadow-lg transition-colors"
          style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
          title="Drag to move · Click to open"
        >
          {open ? (
            <X size={22} className="text-white" />
          ) : (
            <MessageCircle size={22} className="text-white" />
          )}
        </button>
      </div>

      {/* Chat panel — positioned relative to button */}
      {open && (
        <div
          className="fixed z-50 w-96 bg-zinc-900 border border-zinc-700 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
          style={{ left: panelLeft, top: panelTop, height: panelHeight }}
        >
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
