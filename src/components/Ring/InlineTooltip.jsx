import React from 'react';
import { ShieldAlert, ArrowRight, Crown } from 'lucide-react';

/**
 * Node-anchored floating comparison tooltip appearing near receiving nodes during events.
 */
export function InlineTooltip({ event, position, mode, onDismiss }) {
  if (!event || !position) return null;

  const { fate, receiverId, value, comparison } = event;
  const isMin = mode === 'min';

  let badgeBg = 'bg-blue-600 text-white';
  let badgeIcon = <ArrowRight className="w-3.5 h-3.5 mr-1 inline" />;
  let outcomeText = 'Forwarded';

  if (fate === 'drop') {
    badgeBg = 'bg-red-600 text-white';
    badgeIcon = <ShieldAlert className="w-3.5 h-3.5 mr-1 inline" />;
    outcomeText = 'Dropped';
  } else if (fate === 'leader') {
    badgeBg = 'bg-green-600 text-white';
    badgeIcon = <Crown className="w-3.5 h-3.5 mr-1 inline" />;
    outcomeText = 'LEADER!';
  }

  return (
    <div
      className="absolute z-30 pointer-events-auto transform -translate-x-1/2 -translate-y-full transition-all duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 36}px`,
      }}
      role="tooltip"
    >
      <div className="bg-theme-surface/95 dark:bg-theme-surface/95 backdrop-blur-md border border-theme-border shadow-tooltip rounded-xl px-3 py-2 text-xs max-w-[210px] text-theme-text animate-fade-in">
        <div className="flex items-center justify-between gap-1.5 mb-1">
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded font-mono font-bold text-[11px] ${badgeBg}`}
          >
            {badgeIcon}
            {comparison}
          </span>
          <span className="font-semibold uppercase tracking-wider text-[10px] text-theme-muted">
            {outcomeText}
          </span>
        </div>
        <p className="text-[11px] leading-tight text-theme-muted">
          {fate === 'drop' && (
            <>
              Received <strong>{value}</strong> {isMin ? '>' : '<'} own ID{' '}
              <strong>{receiverId}</strong>. Dropped to save bandwidth.
            </>
          )}
          {fate === 'forward' && (
            <>
              Received <strong>{value}</strong> {isMin ? '<' : '>'} own ID{' '}
              <strong>{receiverId}</strong>. Forwarded to clockwise neighbor.
            </>
          )}
          {fate === 'leader' && (
            <>
              Own ID <strong>{receiverId}</strong> returned after full ring loop!
            </>
          )}
        </p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="mt-1 text-[10px] text-blue-500 hover:underline block text-right w-full"
          >
            Dismiss
          </button>
        )}
      </div>
      {/* Downward triangle arrow */}
      <div className="w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-theme-border mx-auto -mt-px" />
    </div>
  );
}
