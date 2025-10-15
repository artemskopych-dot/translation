'use client';
type Props = { jobId?: string; status?: string; startDate?: string; stopDate?: string };
export default function StatusCard({ jobId, status, startDate, stopDate }: Props) {
  return (
    <div className="card p-6">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-sm text-white/60">Job</div>
          <div className="text-lg font-semibold">{jobId || '—'}</div>
        </div>
        <div className="badge">{status || 'UNKNOWN'}</div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div><div className="text-xs text-white/50">Start</div>{startDate ? new Date(startDate).toLocaleString() : '—'}</div>
        <div><div className="text-xs text-white/50">Stop</div>{stopDate ? new Date(stopDate).toLocaleString() : '—'}</div>
      </div>
    </div>
  );
}
