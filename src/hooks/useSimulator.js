import { useState, useEffect, useRef, useCallback } from 'react';
import { init, step, validateIds } from '../algo/basicLE.js';
import { toast } from 'react-toastify';

const DEFAULT_IDS = [1, 2, 3, 4, 5];

export function useSimulator() {
  const [ids, setIdsState] = useState(DEFAULT_IDS);
  const [mode, setModeState] = useState('min');
  const [direction, setDirectionState] = useState('cw');
  const [validation, setValidation] = useState(() => validateIds(DEFAULT_IDS));
  const [simState, setSimState] = useState(() => init(DEFAULT_IDS, 'min', 'cw'));
  const [historyStack, setHistoryStack] = useState(() => [init(DEFAULT_IDS, 'min', 'cw')]);
  const [latestEvents, setLatestEvents] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.5);
  const [isAnimating, setIsAnimating] = useState(false);

  const timerRef = useRef(null);

  const resetToIds = useCallback((newIds, newMode = mode, newDir = direction) => {
    const validResult = validateIds(newIds);
    setValidation(validResult);
    if (validResult.valid) {
      const cleanIds = newIds.map(Number);
      const initial = init(cleanIds, newMode, newDir);
      setSimState(initial);
      setHistoryStack([initial]);
      setLatestEvents([]);
      setIsPlaying(false);
      setIsAnimating(false);
    }
  }, [mode, direction]);

  const setIds = useCallback((newIds) => {
    setIdsState(newIds);
    resetToIds(newIds, mode, direction);
  }, [mode, direction, resetToIds]);

  const updateNodeId = useCallback((index, rawVal) => {
    const updated = [...ids];
    updated[index] = rawVal;
    const result = validateIds(updated);

    if (!result.valid) {
      toast.error(result.message, {
        toastId: 'node-id-validation',
      });
    } else {
      toast.dismiss('node-id-validation');
    }

    setIdsState(updated);
    resetToIds(updated, mode, direction);
  }, [ids, mode, direction, resetToIds]);

  const swapNodes = useCallback((indexA, indexB) => {
    if (indexA === indexB || indexA < 0 || indexB < 0 || indexA >= ids.length || indexB >= ids.length) return;
    const updated = [...ids];
    [updated[indexA], updated[indexB]] = [updated[indexB], updated[indexA]];
    setIdsState(updated);
    resetToIds(updated, mode, direction);
  }, [ids, mode, direction, resetToIds]);

  const addNode = useCallback(() => {
    if (ids.length >= 20) return;
    const nums = ids.map(Number).filter((n) => Number.isInteger(n));
    const nextVal = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    const updated = [...ids, nextVal];
    setIdsState(updated);
    resetToIds(updated, mode, direction);
  }, [ids, mode, direction, resetToIds]);

  const removeNode = useCallback((index) => {
    if (ids.length <= 3) {
      toast.warning('A ring must have at least 3 nodes.', { toastId: 'min-nodes-warning' });
      return;
    }
    const updated = ids.filter((_, i) => i !== index);
    setIdsState(updated);
    resetToIds(updated, mode, direction);
  }, [ids, mode, direction, resetToIds]);

  const setMode = useCallback((newMode) => {
    setModeState(newMode);
    resetToIds(ids, newMode, direction);
  }, [ids, direction, resetToIds]);

  const setDirection = useCallback((newDir) => {
    setDirectionState(newDir);
    resetToIds(ids, mode, newDir);
  }, [ids, mode, resetToIds]);

  const randomize = useCallback(() => {
    const n = ids.length || 5;
    const pool = new Set();
    while (pool.size < n) pool.add(Math.floor(Math.random() * 80) + 1);
    const newIds = Array.from(pool);
    setIdsState(newIds);
    resetToIds(newIds, mode, direction);
  }, [ids.length, mode, direction, resetToIds]);

  const stepForward = useCallback(() => {
    if (!validation.valid || simState.done || isAnimating) return;

    setIsAnimating(true);
    const { next, events } = step(simState);
    setLatestEvents(events);

    const animDuration = Math.round(1050 / speed);
    setTimeout(() => {
      setSimState(next);
      setHistoryStack((prev) => [...prev, next]);
      setIsAnimating(false);

      if (next.done && !simState.done) {
        toast.success(`Node-${next.leaderIndex} (ID ${next.leaderId}) is the new Leader!`, {
          toastId: 'leader-elected',
        });
      }
    }, animDuration);
  }, [validation.valid, simState, isAnimating, speed]);

  const stepBack = useCallback(() => {
    if (historyStack.length <= 1 || isAnimating) return;
    setIsPlaying(false);
    const updatedHistory = [...historyStack];
    updatedHistory.pop();
    const prev = updatedHistory[updatedHistory.length - 1];
    setHistoryStack(updatedHistory);
    setSimState(prev);
    const prevRecord = prev.history[prev.history.length - 1];
    setLatestEvents(prevRecord ? prevRecord.events : []);
    setIsAnimating(false);
  }, [historyStack, isAnimating]);

  const reset = useCallback(() => {
    const resetIds = validation.valid ? ids : simState.nodes.map((node) => node.id);
    setIdsState(resetIds);
    resetToIds(resetIds, mode, direction);
  }, [ids, mode, direction, resetToIds, simState.nodes, validation.valid]);

  useEffect(() => {
    if (!isPlaying || simState.done) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (simState.done) setIsPlaying(false);
      return;
    }
    const intervalMs = Math.round(1200 / speed);
    timerRef.current = setInterval(() => stepForward(), intervalMs);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, simState.done, speed, stepForward]);

  return {
    ids, setIds, updateNodeId, swapNodes, addNode, removeNode,
    mode, setMode, direction, setDirection, validation, simState, historyStack, latestEvents,
    isPlaying, setIsPlaying, speed, setSpeed,
    stepForward, stepBack, reset, randomize, isAnimating,
  };
}
