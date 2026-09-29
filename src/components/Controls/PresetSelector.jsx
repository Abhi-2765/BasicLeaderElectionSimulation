import React from 'react';
import { PRESETS } from '../../engine/presets.js';
import { Info, Shuffle, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';

export function PresetSelector({ activePreset, onSelectPreset, mode }) {
  const currentPreset = PRESETS.find((p) => p.id === activePreset) || PRESETS[0];

  const getPresetIcon = (id) => {
    switch (id) {
      case 'best':
        return <TrendingDown className="w-3.5 h-3.5 text-green-500" />;
      case 'worst':
        return <TrendingUp className="w-3.5 h-3.5 text-red-500" />;
      case 'random':
        return <Shuffle className="w-3.5 h-3.5 text-blue-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  const descriptionText =
    typeof currentPreset.description === 'function'
      ? currentPreset.description(mode)
      : currentPreset.description;

  return (
    <div className="bg-theme-surface border border-theme-border rounded-2xl p-4 shadow-card flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-theme-muted uppercase tracking-wider">
          Ring Presets
        </label>
        <span className="text-[11px] text-theme-muted">
          Active: <strong className="text-theme-text">{currentPreset.name}</strong>
        </span>
      </div>

      {/* Preset Pill Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {PRESETS.map((preset) => {
          const isSelected = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.id)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all border ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'border-theme-border hover:bg-theme-surface-subtle text-theme-muted hover:text-theme-text'
              }`}
            >
              {getPresetIcon(preset.id)}
              <span className="truncate">{preset.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Explanation Caption */}
      <div className="flex items-start gap-2 bg-theme-surface-subtle p-2.5 rounded-xl border border-theme-border text-[11px] text-theme-muted leading-relaxed">
        <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-theme-text">{currentPreset.name}:</strong>{' '}
          {descriptionText}
        </div>
      </div>
    </div>
  );
}
