import React, { useState } from 'react';
import { GLOSSARY_TERMS } from '../../engine/explain.js';
import { BookOpen, X, Search, ChevronRight } from 'lucide-react';

export function GlossaryDrawer({ isOpen, onClose, highlightTermId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(
    highlightTermId || GLOSSARY_TERMS[0].id
  );

  if (!isOpen) return null;

  const filteredTerms = GLOSSARY_TERMS.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeItem =
    GLOSSARY_TERMS.find((t) => t.id === selectedTerm) || GLOSSARY_TERMS[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="bg-theme-surface border-l border-theme-border w-full max-w-md h-full flex flex-col shadow-2xl p-5 overflow-hidden animate-slide-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-base text-theme-text">
              Distributed Concepts & Glossary
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-theme-surface-subtle text-theme-muted hover:text-theme-text transition-colors"
            aria-label="Close Glossary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative my-3">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
          <input
            type="text"
            placeholder="Search concepts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-theme-surface-subtle border border-theme-border rounded-xl text-xs text-theme-text focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Two-part layout: Terms list + Active Card */}
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          {/* Active Term Card Detail */}
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 flex flex-col gap-2">
            <h3 className="font-bold text-sm text-theme-text">
              {activeItem.title}
            </h3>
            <p className="text-xs text-theme-muted font-medium leading-relaxed">
              {activeItem.summary}
            </p>
            <p className="text-xs text-theme-muted leading-relaxed pt-2 border-t border-blue-200/50 dark:border-blue-800/40">
              {activeItem.detail}
            </p>
          </div>

          {/* List of other terms */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1">
            {filteredTerms.map((term) => {
              const isSelected = term.id === selectedTerm;
              return (
                <button
                  key={term.id}
                  onClick={() => setSelectedTerm(term.id)}
                  className={`p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-theme-surface-subtle border-blue-500 font-semibold text-blue-600 dark:text-blue-400'
                      : 'border-theme-border hover:bg-theme-surface-subtle text-theme-text'
                  }`}
                >
                  <div>
                    <div>{term.title}</div>
                    <div className="text-[11px] text-theme-muted line-clamp-1 font-normal">
                      {term.summary}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-theme-muted shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
