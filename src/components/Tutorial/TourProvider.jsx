import React, { useState, useEffect, useRef } from 'react';
import { TOUR_STEPS } from './steps.js';
import { ArrowRight, ArrowLeft, X, Sparkles } from 'lucide-react';

export function TourProvider({ isOpen, onClose }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const cardRef = useRef(null);

  const step = TOUR_STEPS[currentStepIdx] || TOUR_STEPS[0];
  const isFirst = currentStepIdx === 0;
  const isLast = currentStepIdx === TOUR_STEPS.length - 1;

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (!isLast) setCurrentStepIdx((prev) => prev + 1);
        else onClose();
      } else if (e.key === 'ArrowLeft' && !isFirst) {
        setCurrentStepIdx((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFirst, isLast, onClose]);

  // Focus trap to tour card
  useEffect(() => {
    if (isOpen) {
      cardRef.current?.focus();
    }
  }, [isOpen, currentStepIdx]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-step-title"
    >
      {/* Spotlight Card */}
      <div
        ref={cardRef}
        tabIndex={-1}
        className="bg-theme-surface border border-theme-border rounded-2xl max-w-md w-full p-5 shadow-2xl flex flex-col gap-4 focus:outline-none animate-scale-in"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">
              Tour • Step {currentStepIdx + 1} of {TOUR_STEPS.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-theme-muted hover:text-theme-text hover:bg-theme-surface-subtle transition-colors"
            aria-label="Skip Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <h3
            id="tour-step-title"
            className="text-base font-bold text-theme-text"
          >
            {step.title}
          </h3>
          <p className="text-xs text-theme-muted leading-relaxed">
            {step.content}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 py-1">
          {TOUR_STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentStepIdx(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentStepIdx
                  ? 'w-5 bg-blue-600'
                  : 'w-1.5 bg-theme-border hover:bg-theme-muted'
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-theme-border">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-theme-muted hover:text-theme-text font-medium"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={handleBack}
                className="px-3 py-1.5 rounded-xl border border-theme-border text-xs font-medium text-theme-text hover:bg-theme-surface-subtle flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1 transition-colors shadow-sm"
            >
              <span>{isLast ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
