import React from 'react';
import { explainPacketEvent, explainRoundSummary } from '../../engine/explain.js';
import {
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Crown,
  BookOpen,
  Volume2,
} from 'lucide-react';

export function ExplainPanel({
  simState,
  latestEvents,
  mode,
  onHighlightNode,
  onOpenGlossary,
}) {
  const { round, history, done } = simState;
  const currentRecord = history[history.length - 1];

  const roundSummary = currentRecord ? explainRoundSummary(currentRecord) : '';

  return (
    <div className="bg-theme-surface border border-theme-border rounded-2xl p-4 shadow-card flex flex-col gap-3 h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-theme-border pb-2.5">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          <h3 className="font-semibold text-xs text-theme-text uppercase tracking-wider">
            Round Narration & Insights
          </h3>
        </div>
        <span className="text-[11px] font-mono text-theme-muted">
          Round {round}
        </span>
      </div>

      {/* Screen reader ARIA live region */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {roundSummary}
      </div>

      {/* Summary Banner for Current Round */}
      {round > 0 && currentRecord && (
        <div className="p-2.5 rounded-xl bg-theme-surface-subtle border border-theme-border text-xs text-theme-text flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-theme-muted shrink-0" />
            <span className="font-medium text-[11px]">{roundSummary}</span>
          </div>
        </div>
      )}

      {/* List of Packet Events for this round */}
      <div className="flex-1 overflow-y-auto max-h-[300px] flex flex-col gap-2 pr-1">
        {round === 0 ? (
          <div className="text-center py-8 text-xs text-theme-muted flex flex-col items-center gap-2">
            <p>
              In <strong>Round 0</strong>, every node awakens and prepares to send its own ID to its clockwise neighbor.
            </p>
            <p className="text-[11px]">
              Click <strong>Next Round</strong> or <strong>Auto-Play</strong> to begin the election!
            </p>
          </div>
        ) : latestEvents.length === 0 ? (
          <div className="text-center py-6 text-xs text-theme-muted">
            No events in this step.
          </div>
        ) : (
          latestEvents.map((evt, idx) => {
            const explanation = explainPacketEvent(evt, mode);

            let fateBadge = (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
                <ArrowRight className="w-3 h-3" /> FORWARD
              </span>
            );

            if (evt.fate === 'drop') {
              fateBadge = (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> DROP
                </span>
              );
            } else if (evt.fate === 'leader') {
              fateBadge = (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 flex items-center gap-1">
                  <Crown className="w-3 h-3" /> ELECTED
                </span>
              );
            }

            return (
              <div
                key={`explain-${round}-${idx}`}
                onMouseEnter={() => onHighlightNode && onHighlightNode(evt.to)}
                onMouseLeave={() => onHighlightNode && onHighlightNode(null)}
                className="p-3 rounded-xl border border-theme-border bg-theme-surface hover:bg-theme-surface-subtle transition-all flex flex-col gap-1.5 cursor-pointer shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs text-theme-text">
                    {explanation.title}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-theme-surface-subtle border border-theme-border text-theme-muted">
                      {explanation.comparison}
                    </span>
                    {fateBadge}
                  </div>
                </div>

                <p className="text-xs text-theme-muted leading-relaxed">
                  {explanation.text}
                </p>

                <div className="flex items-center justify-end mt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenGlossary && onOpenGlossary(evt.fate === 'drop' ? 'message-complexity' : 'lcr-algorithm');
                    }}
                    className="text-[11px] text-blue-500 hover:underline flex items-center gap-1 font-medium"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Learn why</span>
                  </button>
                </div>
              </div>
            );
          })
        )}

        {done && (
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-300 dark:border-green-800 text-xs text-green-900 dark:text-green-200 mt-2 flex flex-col gap-1">
            <div className="font-bold flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-green-600" />
              <span>Leader Election Concluded!</span>
            </div>
            <p className="text-[11px] leading-relaxed text-green-800 dark:text-green-300">
              Node with ID <strong>{simState.leaderId}</strong> has been elected leader in exactly{' '}
              <strong>{round}</strong> rounds. All other active nodes marked themselves as followers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
