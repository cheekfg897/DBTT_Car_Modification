import { useState } from 'react';
import { COLOR_PRESETS } from '../../data/colorPresets';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
  showPresets?: boolean;
}

export function ColorPicker({ value, onChange, label, showPresets = true }: ColorPickerProps) {
  const [customHex, setCustomHex] = useState(value);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-zinc-300">{label}</label>

      {showPresets && (
        <div className="space-y-2">
          {(['neutral', 'classic', 'sport', 'exotic'] as const).map((category) => {
            const colors = COLOR_PRESETS.filter((c) => c.category === category);
            return (
              <div key={category}>
                <p className="text-xs text-zinc-500 mb-1 capitalize">{category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {colors.map((preset) => (
                    <button
                      key={preset.hex}
                      onClick={() => { onChange(preset.hex); setCustomHex(preset.hex); }}
                      className={`w-7 h-7 rounded-md border-2 transition-all cursor-pointer ${
                        value === preset.hex ? 'border-orange-accent scale-110' : 'border-zinc-700 hover:border-zinc-500'
                      }`}
                      style={{ backgroundColor: preset.hex }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={customHex}
          onChange={(e) => { setCustomHex(e.target.value); onChange(e.target.value); }}
          className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
        />
        <input
          type="text"
          value={customHex}
          onChange={(e) => {
            setCustomHex(e.target.value);
            if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) onChange(e.target.value);
          }}
          className="bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-sm text-zinc-300 w-24 font-mono"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
