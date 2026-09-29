import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RefreshCw, X, Award } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'In this simulator configured for the user requirement (Lowest ID wins), which node wins the election?',
    options: [
      { text: 'The node with the highest ID value', correct: false },
      { text: 'The node with the lowest (minimum) ID value', correct: true },
      { text: 'The first node created', correct: false },
      { text: 'Whichever node receives a message first', correct: false },
    ],
    explanation: 'Under the minimum-ID configuration, any packet carrying an ID greater than the receiver is dropped, allowing only the global minimum ID to traverse the entire ring.',
  },
  {
    id: 2,
    question: 'How many synchronous rounds are always required to complete the LCR election on an n-node ring?',
    options: [
      { text: 'Exactly 1 round', correct: false },
      { text: 'Log₂(n) rounds', correct: false },
      { text: 'Exactly n rounds', correct: true },
      { text: 'n² rounds', correct: false },
    ],
    explanation: 'The winning leader ID must travel around all n nodes to return to its originator. Since each round corresponds to 1 hop, it takes exactly n synchronous rounds.',
  },
  {
    id: 3,
    question: 'What happens if two distinct nodes share the exact same ID?',
    options: [
      { text: 'They both become joint leaders simultaneously', correct: false },
      { text: 'Symmetry is broken and only one is picked at random', correct: false },
      { text: 'Both might falsely declare themselves leader because their ID loops back early, violating safety', correct: true },
      { text: 'The messages cancel out and the simulation deadlocks', correct: false },
    ],
    explanation: 'Without unique IDs, symmetry cannot be broken deterministically. Both duplicate nodes could see "their" ID return after fewer hops and falsely declare victory, violating leader uniqueness.',
  },
  {
    id: 4,
    question: 'Why does dropping packets improve message complexity?',
    options: [
      { text: 'It prevents nodes with worse candidate IDs from wasting network bandwidth', correct: true },
      { text: 'It resets the clock cycle for the next round', correct: false },
      { text: 'It increases the speed of electrical signals', correct: false },
      { text: 'It converts the topology from a ring to a star network', correct: false },
    ],
    explanation: 'Once a node encounters a better candidate ID, its own ID can never win. Dropping worse candidate IDs stops futile transmissions across the remaining nodes.',
  },
];

export function MiniQuiz({ isOpen, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentQ = QUIZ_QUESTIONS[currentIdx];
  const userChoice = selectedAnswers[currentQ.id];
  const isAnswered = userChoice !== undefined;

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: idx,
    }));
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setSubmitted(false);
  };

  const totalCorrect = QUIZ_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] !== undefined && q.options[selectedAnswers[q.id]].correct
  ).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-theme-surface border border-theme-border rounded-2xl max-w-lg w-full p-5 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-base text-theme-text">
              Knowledge Check: Ring Leader Election
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-theme-surface-subtle text-theme-muted hover:text-theme-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!submitted ? (
          <>
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs text-theme-muted">
              <span>Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}</span>
              <span>{Math.round(((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100)}% Complete</span>
            </div>

            {/* Question Text */}
            <h3 className="font-semibold text-sm text-theme-text leading-snug">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="flex flex-col gap-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = userChoice === idx;
                const showFeedback = isAnswered;
                let optionStyle = 'border-theme-border hover:bg-theme-surface-subtle';

                if (showFeedback) {
                  if (opt.correct) {
                    optionStyle = 'border-green-500 bg-green-50/50 dark:bg-green-950/20 text-green-800 dark:text-green-300 font-semibold';
                  } else if (isSelected) {
                    optionStyle = 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-800 dark:text-red-300';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-blue-500 bg-blue-50 dark:bg-blue-950/30';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${optionStyle}`}
                  >
                    <span>{opt.text}</span>
                    {showFeedback && opt.correct && (
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 ml-2" />
                    )}
                    {showFeedback && isSelected && !opt.correct && (
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answering */}
            {isAnswered && (
              <div className="p-3 rounded-xl bg-theme-surface-subtle border border-theme-border text-xs text-theme-muted leading-relaxed">
                <strong className="text-theme-text">Explanation:</strong> {currentQ.explanation}
              </div>
            )}

            {/* Footer button */}
            <div className="flex justify-end pt-2 border-t border-theme-border">
              <button
                type="button"
                onClick={handleNext}
                disabled={!isAnswered}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}
              </button>
            </div>
          </>
        ) : (
          /* Results screen */
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <div className="p-3 bg-green-100 dark:bg-green-950 text-green-600 rounded-full">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-theme-text">Quiz Completed!</h3>
            <p className="text-xs text-theme-muted">
              You scored <strong>{totalCorrect}</strong> out of <strong>{QUIZ_QUESTIONS.length}</strong>!
            </p>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={handleRestart}
                className="px-4 py-2 border border-theme-border rounded-xl text-xs font-medium hover:bg-theme-surface-subtle text-theme-text flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retake Quiz
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
