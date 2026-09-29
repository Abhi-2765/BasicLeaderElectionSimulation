/**
 * Educational Narration & Explanation Generator
 * Converts step events and node decisions into structured, human-readable explanations.
 */

/**
 * Explains an individual packet event based on election mode ('min' or 'max').
 * @param {object} event
 * @param {'min'|'max'} mode
 * @returns {{ title: string, text: string, comparison: string, fate: string }}
 */
export function explainPacketEvent(event, mode = 'min') {
  const { to: j, receiverId: u, value: v, fate } = event;
  const isMin = mode === 'min';

  if (fate === 'drop') {
    return {
      title: `Node P${j} Dropped ID ${v}`,
      comparison: isMin ? `${v} > ${u}` : `${v} < ${u}`,
      fate: 'drop',
      text: isMin
        ? `Node P${j} (ID ${u}) received ${v}. Because ${v} is larger than ${u}, P${j} drops it. ${v} can never win: there's a smaller ID (${u}) on the ring, so forwarding this message would only waste bandwidth.`
        : `Node P${j} (ID ${u}) received ${v}. Because ${v} is smaller than ${u}, P${j} drops it. ${v} can never win: there's a bigger ID (${u}) on the ring, so this message would only waste bandwidth.`,
    };
  }

  if (fate === 'forward') {
    return {
      title: `Node P${j} Forwarded ID ${v}`,
      comparison: isMin ? `${v} < ${u}` : `${v} > ${u}`,
      fate: 'forward',
      text: isMin
        ? `Node P${j} (ID ${u}) received ${v}. ${v} is smaller than ${u}, so P${j} knows it can't be the leader, marks itself not elected (follower), and forwards ${v} to the next node.`
        : `Node P${j} (ID ${u}) received ${v}. ${v} is bigger than {u}, so P${j} knows it can't be the leader, marks itself not elected, and forwards ${v} to the next node.`,
    };
  }

  if (fate === 'leader') {
    return {
      title: `Node P${j} Elected as Leader!`,
      comparison: `${v} === ${u}`,
      fate: 'leader',
      text: isMin
        ? `Node P${j} received its own ID ${u} back. It travelled the entire ring without encountering any smaller ID. P${j} is the leader!`
        : `Node P${j} received its own ID ${u} back. It travelled the entire ring without anyone dropping it, so nobody has a larger ID. P${j} is the leader!`,
    };
  }

  return {
    title: `Node P${j} Idle`,
    comparison: 'none',
    fate: 'idle',
    text: `Node P${j} received nothing this round, so it has nothing to forward.`,
  };
}

/**
 * Explains the end of a round.
 * @param {object} record
 * @returns {string}
 */
export function explainRoundSummary(record) {
  const {
    round: r,
    messagesSentThisRound: k,
    messagesDroppedThisRound: d,
    messagesForwardedThisRound: f,
    cumulativeMessages: m,
  } = record;

  return `Round ${r}: ${k} messages sent, ${d} dropped, ${f} forwarded. Total messages so far: ${m}.`;
}

/**
 * Glossary of distributed algorithm concepts with concise explanations.
 */
export const GLOSSARY_TERMS = [
  {
    id: 'ring-topology',
    title: 'Ring Topology',
    summary: 'A network setup where each computer connects to exactly two neighbors, forming a single continuous closed circular pathway.',
    detail: 'In a unidirectional ring, all packets travel strictly in one direction (clockwise in our simulator), greatly simplifying routing at the cost of fault tolerance.',
  },
  {
    id: 'unidirectional-link',
    title: 'Unidirectional Link',
    summary: 'Communication channels allow messages to move in one direction only.',
    detail: 'Nodes cannot acknowledge receipts directly to their sender; information must circulate around the entire ring to reach the sender again.',
  },
  {
    id: 'synchronous-rounds',
    title: 'Synchronous Rounds',
    summary: 'Execution proceeds in synchronized lockstep locksteps called rounds.',
    detail: 'In each round, every node simultaneously sends its outgoing message, all messages in transit arrive, and nodes perform local computations before the next round.',
  },
  {
    id: 'lcr-algorithm',
    title: 'LCR Algorithm',
    summary: 'Created by Gerard Le Lann (1977) and refined by Chang & Roberts (1979).',
    detail: 'A classic comparison-based leader election algorithm for unidirectional rings requiring unique IDs and zero knowledge of ring size n.',
  },
  {
    id: 'message-complexity',
    title: 'Message Complexity',
    summary: 'Total number of messages exchanged across all nodes before termination.',
    detail: 'For LCR with n nodes: Best case is 2n - 1 messages; Worst case is n(n+1)/2 messages (~O(n²)); Average case is O(n log n).',
  },
  {
    id: 'time-complexity',
    title: 'Time Complexity',
    summary: 'The number of synchronous rounds needed to elect a leader.',
    detail: 'Exactly n rounds. The winning ID must traverse the entire ring of n nodes to return to its originator and confirm victory.',
  },
  {
    id: 'unique-ids',
    title: 'Why Unique IDs Matter',
    summary: 'Break symmetry in an anonymous network.',
    detail: 'Without unique identifiers, an anonymous ring cannot deterministically elect a single leader without probabilistic symmetry breaking.',
  },
  {
    id: 'real-world-leader-election',
    title: 'Leader Election in Real Systems',
    summary: 'Core primitive in systems like Raft, Paxos, ZooKeeper (ZAB), and Kafka.',
    detail: 'While LCR assumes crash-free synchronous rings, real distributed systems use term numbers, heartbeats, and quorum majorities to handle crashes and network partitions.',
  },
];
