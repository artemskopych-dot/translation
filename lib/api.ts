export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function apiPresign(filename: string, contentType: string) {
  const res = await fetch(`${API_BASE}/presign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, contentType }),
  });
  if (!res.ok) throw new Error('Failed to get presigned URL');
  return res.json() as Promise<{ key: string; uploadUrl: string }>;
}

export async function putFile(uploadUrl: string, file: File, contentType: string) {
  const res = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': contentType }, body: file });
  if (!res.ok) throw new Error('Failed to upload file');
}

export async function apiStartJob(args: {
  s3Key: string;
  orgId: string;
  projectName?: string;
  description?: string;
  languages?: string[];
  codeColumn?: string;
  originalLangColumn?: string;
}) {
  const res = await fetch(`${API_BASE}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error('Failed to start job');
  return res.json() as Promise<{ jobId: string; executionArn: string }>;
}

export async function apiStatus(jobId?: string, executionArn?: string) {
  const qs = new URLSearchParams();
  if (jobId) qs.set('jobId', jobId);
  if (executionArn) qs.set('executionArn', executionArn);
  const res = await fetch(`${API_BASE}/status?${qs.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to get status');
  return res.json() as Promise<{ status: string; startDate?: string; stopDate?: string }>;
}
