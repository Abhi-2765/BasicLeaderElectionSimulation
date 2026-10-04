import React from 'react';
import { RingCanvas } from './components/Ring/RingCanvas.jsx';
import { RoundTable } from './components/Log/RoundTable.jsx';
import { useSimulator } from './hooks/useSimulator.js';

export default function App() {
  const store = useSimulator();

  const canStep = store.validation.valid && !store.simState.done && !store.isAnimating;
  const canGoBack = store.historyStack.length > 1 && !store.isAnimating;
  const messagesSent = store.simState.history
    .slice(1)
    .reduce((total, record) => total + record.events.length, 0);
  const nodeCount = store.simState.nodes.length;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans selection:bg-stone-300 pb-16">
      <main className="w-full px-2 py-1 sm:px-3 sm:py-2 lg:px-6">
        <section className="relative flex h-[calc(100svh-0.25rem)] flex-col sm:h-[calc(100svh-0.5rem)]">
          <header className="relative flex shrink-0 items-center justify-center gap-3 border-b border-[var(--color-border)] pb-2">
            <div>
              <h1 className="text-lg font-semibold tracking-tight sm:text-xl">Basic Leader Election in Ring Networks</h1>
            </div>
          </header>

          {!store.validation.valid && (
            <div className="relative mt-4 flex items-center justify-between gap-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <span>{store.validation.message}</span>
              <button type="button" onClick={store.reset} className="shrink-0 underline underline-offset-2">Reset</button>
            </div>
          )}

          <div className="relative mt-2 grid shrink-0 grid-cols-2 gap-px overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-border)]">
            <div className="bg-[var(--color-bg)] px-2 py-1.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-muted)]">Rounds</p>
              <p className="mt-0.5 text-base font-semibold">{store.simState.round} <span className="text-xs font-normal text-[var(--color-muted)]">of {nodeCount}</span></p>
            </div>
            <div className="bg-[var(--color-bg)] px-2 py-1.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-muted)]">Messages sent</p>
              <p className="mt-0.5 text-base font-semibold">{messagesSent}</p>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center py-0">
            <RingCanvas simState={store.simState} validation={store.validation} latestEvents={store.latestEvents} isAnimating={store.isAnimating} speed={store.speed} mode={store.mode} ids={store.ids} onUpdateId={store.updateNodeId} onSwap={store.swapNodes} onRemove={store.removeNode} disabled={store.isPlaying || store.isAnimating} />
          </div>

          <div className="relative shrink-0 border-t border-[var(--color-border)] pt-2">
            <div className="flex flex-col justify-between gap-2 lg:flex-row lg:items-center">
              <div className="grid grid-cols-2 items-center gap-2 sm:flex sm:flex-wrap">
                <button type="button" onClick={store.stepBack} disabled={!canGoBack} className="control-button">Previous</button>
                <button type="button" onClick={() => store.setIsPlaying(!store.isPlaying)} disabled={!store.validation.valid || store.simState.done} className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-stone-50 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">
                  {store.isPlaying ? 'Pause' : 'Run'}
                </button>
                <button type="button" onClick={store.stepForward} disabled={!canStep} className="control-button">Next round</button>
                <button type="button" onClick={store.reset} className="control-button">Reset</button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs sm:flex sm:flex-wrap sm:items-center">
                <div className="col-span-2 grid w-full grid-cols-2 rounded-lg border border-[var(--color-border)] p-0.5 sm:inline-flex sm:w-auto">
                  {['min', 'max'].map((mode) => (
                    <button type="button" key={mode} onClick={() => store.setMode(mode)} className={`rounded-md px-2.5 py-1.5 font-medium ${store.mode === mode ? 'bg-[var(--color-surface-subtle)] text-[var(--color-text)]' : 'text-[var(--color-muted)]'}`}>{mode === 'min' ? 'Min ID' : 'Max ID'}</button>
                  ))}
                </div>
                <div className="col-span-2 grid w-full grid-cols-2 rounded-lg border border-[var(--color-border)] p-0.5 sm:inline-flex sm:w-auto">
                  {['cw', 'ccw'].map((dir) => (
                    <button type="button" key={dir} onClick={() => store.setDirection(dir)} className={`rounded-md px-2.5 py-1.5 font-medium ${store.direction === dir ? 'bg-[var(--color-surface-subtle)] text-[var(--color-text)]' : 'text-[var(--color-muted)]'}`}>{dir === 'cw' ? 'Clockwise' : 'Counter Clockwise'}</button>
                  ))}
                </div>
                <button type="button" onClick={store.randomize} className="control-button w-full sm:w-auto">Randomize</button>
                <button type="button" onClick={store.addNode} disabled={store.ids.length >= 20} className="control-button w-full sm:w-auto">Add node</button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-3"><RoundTable simState={store.simState} /></section>
      </main>
    </div>
  );
}
