export function RoundTable({ simState }) {
  const { history, nodes, round } = simState;
  if (history.length <= 1 && round === 0) return null;

  return (
    <div className="border-y border-[var(--color-border)]">
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        <h2 className="text-sm font-semibold">Round record</h2>
        <p className="mt-0.5 text-xs text-[var(--color-muted)]">{round} round{round === 1 ? '' : 's'} computed</p>
      </div>

      <div className="max-h-[360px] overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-[var(--color-surface-subtle)]">
            <tr>
              <th className="w-20 border-b border-[var(--color-border)] px-4 py-3 text-left text-xs font-semibold text-[var(--color-muted)]">Round</th>
              {nodes.map((node, index) => (
                <th key={index} className="border-b border-[var(--color-border)] px-4 py-3 text-center">
                  <div className="font-semibold">Node-{index}</div>
                  <div className="mt-0.5 font-mono text-[10px] font-normal text-[var(--color-muted)]">ID {node.id}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((record) => (
              <tr key={record.round} className={record.round === round ? 'bg-slate-50/70' : ''}>
                <td className="border-b border-[var(--color-border)] px-4 py-3 text-center font-mono text-xs font-semibold text-[var(--color-muted)]">{record.round}</td>
                {record.nodes.map((node, index) => {
                  const isLeader = node.status === 'leader';
                  const isDropped = record.round > 0 && node.send === null && node.recv !== null;
                  const isForwarded = record.round > 0 && node.send !== null;
                  const isIdle = record.round > 0 && node.recv === null;
                  let content = <span className="text-[var(--color-muted)]">-</span>;
                  let className = 'text-[var(--color-muted)]';

                  if (record.round === 0) {
                    content = `Send ${node.id}`;
                    className = 'bg-sky-50 text-sky-800';
                  } else if (isLeader) {
                    content = 'Leader';
                    className = 'bg-emerald-50 text-emerald-800';
                  } else if (isForwarded) {
                    content = `Forward ${node.recv}`;
                    className = 'bg-stone-100 text-stone-700';
                  } else if (isDropped) {
                    content = `Drop ${node.recv}`;
                    className = 'bg-rose-50 text-rose-800';
                  } else if (isIdle) {
                    content = 'Idle';
                  }

                  return <td key={index} className="border-b border-[var(--color-border)] px-2 py-3 text-center"><span className={`inline-flex rounded-md px-2 py-1 font-mono text-xs ${className}`}>{content}</span></td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
