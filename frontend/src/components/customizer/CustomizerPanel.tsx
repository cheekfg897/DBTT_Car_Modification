import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paintbrush, Droplets, CircleDot, Disc3, Layers, ShieldCheck, ChevronDown, ChevronUp, CalendarCheck } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ColorPicker } from './ColorPicker';
import { WrapSelector } from './WrapSelector';
import { WindowTintSlider } from './WindowTintSlider';
import { ModCategoryCard } from './ModCategoryCard';
import { PriceBreakdown } from './PriceBreakdown';
import { RecommendationsSidebar } from './RecommendationsSidebar';

const tabs = [
  { id: 'respray', label: 'Respray', icon: Paintbrush },
  { id: 'wraps', label: 'Wraps', icon: Layers },
  { id: 'tint', label: 'Tint', icon: Droplets },
  { id: 'wheels', label: 'Wheels', icon: Disc3 },
  { id: 'calipers', label: 'Calipers', icon: CircleDot },
  { id: 'mods', label: 'Parts', icon: ShieldCheck },
] as const;

type Tab = typeof tabs[number]['id'];

export function CustomizerPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('respray');
  const [priceOpen, setPriceOpen] = useState(true);
  const { setBodyColor, setRimColor, setCaliperColor, customization } = useStore();
  const navigate = useNavigate();

  return (
    <div className="w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-zinc-800 overflow-x-auto shrink-0">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center gap-1 px-3 py-2.5 text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeTab === id
                ? 'text-orange-accent border-b-2 border-orange-accent'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'respray' && (
          <ColorPicker
            value={customization.bodyColor}
            onChange={setBodyColor}
            label="Body Color"
            showPresets
          />
        )}

        {activeTab === 'wraps' && <WrapSelector />}

        {activeTab === 'tint' && <WindowTintSlider />}

        {activeTab === 'wheels' && (
          <ColorPicker
            value={customization.rimColor}
            onChange={setRimColor}
            label="Rim Color"
            showPresets={false}
          />
        )}

        {activeTab === 'calipers' && (
          <ColorPicker
            value={customization.caliperColor}
            onChange={setCaliperColor}
            label="Caliper Color"
            showPresets={false}
          />
        )}

        {activeTab === 'mods' && (
          <div className="space-y-4">
            <ModCategoryCard category="spoiler" />
            <ModCategoryCard category="exhaust" />
            <ModCategoryCard category="bodykit" />
            <ModCategoryCard category="hood" />
            <ModCategoryCard category="sideskirt" />
          </div>
        )}

        <RecommendationsSidebar />
      </div>

      {/* Price breakdown - collapsible at bottom */}
      <div className="shrink-0 border-t border-zinc-800">
        <button
          onClick={() => setPriceOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          Price Breakdown
          {priceOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {priceOpen && (
          <div className="px-4 pb-3">
            <PriceBreakdown />
          </div>
        )}
        <div className="px-4 pb-4 pt-1">
          <button
            onClick={() => navigate('/book', { state: { fromCustomizer: true } })}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-black text-sm transition-colors hover:brightness-110"
            style={{ background: '#f6bd2d' }}
          >
            <CalendarCheck size={16} />
            Schedule Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
