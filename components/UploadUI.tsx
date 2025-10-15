'use client';

import { useRef, useState } from 'react';
import { apiPresign, apiStartJob, putFile } from '@/lib/api';

const ALL_LANGS = ['en','de','fr','es','it','pl','ro','uk','ru','pt','nl','sv','no','da','tr','ar','ja','ko','zh'];

export default function UploadUI() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [langs, setLangs] = useState<string[]>([]);
  const [codeCol, setCodeCol] = useState('');
  const [origLangCol, setOrigLangCol] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const canSend = !!file && langs.length > 0 && !busy;

  async function onSend() {
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      const contentType = file.type || 'application/octet-stream';
      const { key, uploadUrl } = await apiPresign(file.name, contentType);
      await putFile(uploadUrl, file, contentType);
      const { jobId } = await apiStartJob({
        s3Key: key,
        orgId: 'demo',
        projectName,
        description,
        languages: langs,
        codeColumn: codeCol,
        originalLangColumn: origLangCol,
      });
      setJobId(jobId);
    } catch (e: any) {
      setErr(e?.message || 'Error');
    } finally {
      setBusy(false);
    }
  }

  function onLangChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = Array.from(e.target.selectedOptions).map(o => o.value);
    setLangs(selected);
  }

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="label">Enter the project name</label>
          <input className="input" placeholder="Type here..." value={projectName} onChange={e=>setProjectName(e.target.value)}/>
        </div>
        <div>
          <label className="label">Upload file</label>
          <div className="flex items-center gap-3">
            <input ref={fileRef} type="file" className="hidden" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/json" onChange={e=>setFile(e.target.files?.[0]||null)}/>
            <button className="btn-ghost" onClick={()=>fileRef.current?.click()}>Click to upload a file</button>
            <div className="text-sm text-white/60">{file ? file.name : '—'}</div>
          </div>
        </div>
        <div>
          <label className="label">Select the translation languages</label>
          <select multiple className="min-h-[44px]" onChange={onLangChange} value={langs}>
            {ALL_LANGS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <div className="text-xs text-white/50 mt-1">Hold Ctrl/⌘ for multi-select</div>
        </div>
      </div>

      <div>
        <label className="label">Enter a description of the game with its characteristics and age restrictions.</label>
        <textarea className="textarea" placeholder="Type here..." value={description} onChange={e=>setDescription(e.target.value)} />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="font-semibold">File mapping</div>
          <div className="badge">?</div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Copy “code Id” column name here</label>
            <input className="input" placeholder="Type here..." value={codeCol} onChange={e=>setCodeCol(e.target.value)}/>
          </div>
          <div>
            <label className="label">Copy “original language id” column…</label>
            <input className="input" placeholder="Type here..." value={origLangCol} onChange={e=>setOrigLangCol(e.target.value)}/>
          </div>
        </div>
      </div>

      {err && <div className="text-red-400 text-sm">{err}</div>}

      <div className="flex items-center gap-4">
        <button className="btn" onClick={onSend} disabled={!canSend}>{busy ? 'Sending…' : 'Send'}</button>
        {jobId && <a className="btn-ghost" href={`/review?jobId=${encodeURIComponent(jobId)}`}>Open status</a>}
      </div>
    </div>
  );
}
