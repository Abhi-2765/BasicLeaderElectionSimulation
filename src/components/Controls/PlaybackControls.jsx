import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Undo2,
  PlusCircle,
  HelpCircle,
  Clock,
  Gauge,
  Sparkles,
} from 'lucide-react';

export function PlaybackControls({
  simState,
  validation,
  isPlaying,
  isAnimating,
  historyCount,
  speed,
  pauseOnDrops,
  predictMode,
  onStepForward,
  onStepBack,
  onTogglePlay,
  onReset,
  onAddNode,
  onChangeSpeed,
  onTogglePauseOnDrops,
  onTogglePredictMode,
}) {
  const { done, round } = simState;
  const canStep = validation.valid && !done && !isAnimating;
  const canStepBack = historyCount > 1 && !isAnimating;

  return (
    <div className="bg-theme-surface border border-theme-border rounded-2xl p-4 shadow-card flex flex-col gap-3">
      {/* Top row: Primary Playback buttons */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          {/* Step Back / Rewind */}
          <button
            type="button"
            onClick={onStepBack}
            disabled={!canStepBack}
            title="Step Back / Rewind (Previous Round)"
            aria-label="Step Back"
            className="p-2 rounded-xl border border-theme-border hover:bg-theme-surface-subtle disabled:opacity-40 disabled:cursor-not-allowed text-theme-text transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* Play / Pause Toggle */}
          <button
            type="button"
            onClick={onTogglePlay}
            disabled={!validation.valid || done}
            title={isPlaying ? 'Pause Simulation' : 'Auto-Play Simulation'}
            aria-label={isPlaying ? 'Pause' : 'Auto-Play'}
            className={`px-3.5 py-2 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Auto-Play</span>
              </>
            )}
          </button>

          {/* Next Round (Step Forward) */}
          <button
            type="button"
            onClick={onStepForward}
            disabled={!canStep}
            title="Advance One Synchronous Round"
            aria-label="Next Round"
            className="px-3.5 py-2 rounded-xl bg-theme-surface-subtle hover:bg-theme-border border border-theme-border font-medium text-xs text-theme-text flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next Round</span>
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={onReset}
            title="Reset Simulation to Initial State"
            aria-label="Reset Simulation"
            className="p-2 rounded-xl border border-theme-border hover:bg-theme-surface-subtle text-theme-muted hover:text-theme-text transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Add Node Button */}
        <button
          type="button"
          onClick={onAddNode}
          disabled={simState.nodes.length >= 12}
          title="Add Node to Ring (max 12)"
          className="px-3 py-2 rounded-xl border border-theme-border hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-xs font-medium text-theme-text flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <PlusCircle className="w-4 h-4 text-blue-500" />
          <span>Add Node</span>
        </button>
      </div>

      {/* Second row: Speed & Toggles */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-theme-border flex-wrap text-xs">
        {/* Speed Segmented Control */}
        <div className="flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-theme-muted" />
          <span className="text-theme-muted font-medium text-[11px]">Speed:</span>
          <div className="inline-flex rounded-lg border border-theme-border p-0.5 bg-theme-surface-subtle">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChangeSpeed(s)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  speed === s
                    ? 'bg-theme-surface text-theme-text shadow-sm'
                    : 'text-theme-muted hover:text-theme-text'
                }`}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-3">
          {/* Pause on drops toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer text-theme-muted hover:text-theme-text select-none text-[11px]">
            <input
              type="checkbox"
              checked={pauseOnDrops}
              onChange={(e) => onTogglePauseOnDrops(e.target.checked)}
              className="rounded border-theme-border text-blue-600 focus:ring-blue-500"
            />
            <span>Pause on drops</span>
          </label>

          {/* Predict Mode Toggle */}
          <button
            type="button"
            onClick={onTogglePredictMode}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors border ${
              predictMode
                ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800'
                : 'border-theme-border hover:bg-theme-surface-subtle text-theme-muted'
            }`}
            title="Active Recall: Guess which packets will drop before stepping"
          >
            <Sparkles className="w-3 h-3 text-purple-500" />
            <span>Predict Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
}
