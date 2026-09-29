/**
 * LCR (Le Lann–Chang–Roberts) Leader Election Engine
 * Unidirectional ring topology with synchronous rounds.
 * Pure JavaScript, zero React dependencies, fully immutable.
 */

/**
 * Validates an array of node IDs.
 * @param {Array<number|string>} ids
 * @returns {{ valid: boolean, errors: Record<number, string>, message: string | null }}
 */
export function validateIds(ids) {
  const errors = {};
  let message = null;

  if (!Array.isArray(ids) || ids.length === 0) {
    return { valid: false, errors: {}, message: 'Ring must contain at least one node.' };
  }

  if (ids.length > 20) {
    return { valid: false, errors: {}, message: 'Maximum 20 nodes allowed.' };
  }

  const seen = new Map();

  ids.forEach((val, idx) => {
    if (val === '' || val === null || val === undefined || Number.isNaN(Number(val))) {
      errors[idx] = 'ID must be an integer';
      if (!message) message = 'All nodes must have a valid integer ID.';
      return;
    }

    const num = Number(val);
    if (!Number.isInteger(num)) {
      errors[idx] = 'ID must be an integer';
      if (!message) message = 'All nodes must have a valid integer ID.';
      return;
    }

    if (seen.has(num)) {
      errors[idx] = `Duplicate ID: ${num}`;
      errors[seen.get(num)] = `Duplicate ID: ${num}`;
      if (!message) message = `Duplicate ID ${num} detected. All IDs must be unique.`;
    } else {
      seen.set(num, idx);
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    message,
  };
}

/**
 * Initializes a new simulation state.
 * @param {number[]} ids Array of unique integer IDs
 * @param {'min' | 'max'} [mode='min'] 'min' elects the minimum ID (user requirement); 'max' elects maximum ID
 * @returns {SimState}
 */
export function init(ids, mode = 'min') {
  const cleanIds = ids.map(Number);
  const n = cleanIds.length;

  const nodes = cleanIds.map((id) => ({
    id,
    send: id, // In round 0, every node prepares to send its own ID
    recv: null,
    status: 'unknown',
  }));

  const initialRecord = {
    round: 0,
    nodes: nodes.map((node) => ({ ...node })),
    events: [],
    messagesSentThisRound: n,
    messagesDroppedThisRound: 0,
    messagesForwardedThisRound: 0,
    cumulativeMessages: n,
  };

  return {
    round: 0,
    done: false,
    leaderId: null,
    leaderIndex: null,
    mode,
    nodes,
    history: [initialRecord],
    stats: {
      totalMessages: n,
      totalDrops: 0,
      totalForwards: 0,
      roundsCount: 0,
    },
  };
}

/**
 * Computes whether value v is "better" than value u for leader election.
 * In 'min' mode, smaller values win (v < u).
 * In 'max' mode, larger values win (v > u).
 */
export function isBetterCandidate(v, u, mode = 'min') {
  return mode === 'min' ? v < u : v > u;
}

/**
 * Advances the simulation by one synchronous round.
 * Pure function: returns a new state object without mutating the input.
 *
 * @param {SimState} state
 * @returns {{ next: SimState, events: PacketEvent[] }}
 */
export function step(state) {
  if (state.done) {
    return { next: state, events: [] };
  }

  const { nodes, mode, round, history, stats } = state;
  const n = nodes.length;
  const nextRound = round + 1;

  const events = [];
  let foundLeaderId = null;
  let foundLeaderIndex = null;
  let roundDrops = 0;
  let roundForwards = 0;

  // Compute what each node receives simultaneously from its counter-clockwise predecessor
  const receivedValues = nodes.map((_, i) => {
    const prevIndex = (i - 1 + n) % n;
    return nodes[prevIndex].send;
  });

  // Compute next state for each node
  const nextNodes = nodes.map((node, i) => {
    const prevIndex = (i - 1 + n) % n;
    const v = receivedValues[i];
    const u = node.id;

    let nextSend = null;
    let nextStatus = node.status;
    let fate = null;
    let comparison = '';

    if (v === null) {
      // Nothing received this round
      nextSend = null;
      comparison = 'none';
    } else if (v === u) {
      // The node's own ID came all the way around the ring!
      nextStatus = 'leader';
      nextSend = null;
      fate = 'leader';
      comparison = `${v} === ${u}`;
      foundLeaderId = u;
      foundLeaderIndex = i;

      events.push({
        from: prevIndex,
        to: i,
        value: v,
        receiverId: u,
        fate: 'leader',
        comparison,
      });
    } else if (isBetterCandidate(v, u, mode)) {
      // Received ID is a better candidate than own ID
      // Node realizes it cannot be the leader -> becomes follower
      nextStatus = 'follower';
      nextSend = v;
      fate = 'forward';
      roundForwards += 1;
      comparison = mode === 'min' ? `${v} < ${u}` : `${v} > ${u}`;

      events.push({
        from: prevIndex,
        to: i,
        value: v,
        receiverId: u,
        fate: 'forward',
        comparison,
      });
    } else {
      // Received ID is worse than own ID -> drop it
      // Status remains unchanged
      nextSend = null;
      fate = 'drop';
      roundDrops += 1;
      comparison = mode === 'min' ? `${v} > ${u}` : `${v} < ${u}`;

      events.push({
        from: prevIndex,
        to: i,
        value: v,
        receiverId: u,
        fate: 'drop',
        comparison,
      });
    }

    return {
      id: u,
      send: nextSend,
      recv: v,
      status: nextStatus,
    };
  });

  // Total messages sent into the NEXT round
  const messagesToSendNextRound = nextNodes.filter((nd) => nd.send !== null).length;
  const isDone = foundLeaderId !== null || messagesToSendNextRound === 0;

  const newTotalMessages = stats.totalMessages + (isDone ? 0 : messagesToSendNextRound);
  const newTotalDrops = stats.totalDrops + roundDrops;
  const newTotalForwards = stats.totalForwards + roundForwards;

  const roundRecord = {
    round: nextRound,
    nodes: nextNodes.map((nd) => ({ ...nd })),
    events,
    messagesSentThisRound: events.length,
    messagesDroppedThisRound: roundDrops,
    messagesForwardedThisRound: roundForwards,
    cumulativeMessages: stats.totalMessages,
  };

  const nextState = {
    round: nextRound,
    done: isDone,
    leaderId: foundLeaderId !== null ? foundLeaderId : state.leaderId,
    leaderIndex: foundLeaderIndex !== null ? foundLeaderIndex : state.leaderIndex,
    mode,
    nodes: nextNodes,
    history: [...history, roundRecord],
    stats: {
      totalMessages: stats.totalMessages,
      totalDrops: newTotalDrops,
      totalForwards: newTotalForwards,
      roundsCount: nextRound,
    },
  };

  return { next: nextState, events };
}
