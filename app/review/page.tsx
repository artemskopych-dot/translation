'use client';

import { useEffect, useState } from 'react';
import { apiStatus } from '@/lib/api';
import StatusCard from '@/components/StatusCard';

export default function ReviewPage() {
  const [jobId, setJobId] = useState<string>('');
  const [status, setStatus] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const j = url.searchParams.get('jobId') || '';
    setJobId(j);
    if (j) {
      const id = setInterval(async () => {
        try {
          const s = await apiStatus(j);
          setStatus({ jobId: j, ...s });
        } catch (e: any) {
          setErr(e?.message || 'Error');
        }
      }, 3000);
      return () => clearInterval(id);
    }
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Review</h1>
      <div className="card p-6 space-y-3">
        <label className="label">Job ID</label>
        <input className="input" value={jobId} onChange={e=>setJobId(e.target.value)} placeholder="Paste Job ID..." />
        <div className="flex gap-3">
          <button className="btn" onClick={async ()=>{
            try {
              const s = await apiStatus(jobId);
              setStatus({ jobId, ...s });
              setErr(null);
            } catch (e: any) {
              setErr(e?.message || 'Error');
            }
          }}>Check</button>
        </div>
      </div>
      {err && <div className="text-red-400 text-sm">{err}</div>}
      {status && <StatusCard {...status} />}
    </div>
  )
}
