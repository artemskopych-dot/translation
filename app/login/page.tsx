"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email,setEmail]=useState("demo@example.com");
  const [password,setPassword]=useState("");
  const [err,setErr]=useState<string|null>(null);
  const [loading,setLoading]=useState(false);
  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(null);
    if (!AUTH_URL) { setErr("NEXT_PUBLIC_AUTH_URL не налаштовано на сервері."); return; }
    setLoading(true);
    try {
      const r = await fetch(AUTH_URL, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({email, password})
      });
      const raw = await r.text();
      let data: any = null;
      try { data = JSON.parse(raw); } catch {
        throw new Error(`Неочікувана відповідь від сервера (${r.status}). ${raw.slice(0,120)}`);
      }
      if (!r.ok) throw new Error(data?.error || "Login failed");
      localStorage.setItem("auth_jwt", data.token);
      window.location.href = "/";
    } catch(e:any) {
      setErr(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{minHeight:"100vh", background:"#0b0f1a", display:"grid", placeItems:"center", padding:"24px", color:"#e5e7eb"}}>
      <div style={{width:380, maxWidth:"92vw", padding:"24px", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, boxShadow:"0 6px 30px rgba(0,0,0,.35)", background:"#111827"}}>
        <div style={{display:"grid", placeItems:"center", marginBottom:16}}>
          <img src="/Novicore_Logo.svg" alt="Logo" style={{height:56}} />
        </div>
        <h1 style={{fontSize:20, marginBottom:12, color:"#fff"}}>Вхід</h1>
        <form onSubmit={onSubmit} style={{display:"grid", gap:12}}>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={inputDark}/>
          <input placeholder="Пароль" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={inputDark}/>
          <button type="submit" disabled={loading} style={btnPrimary}>{loading?"Увійти…":"Увійти"}</button>
          {err && <p style={{color:"#fda4af"}}>{err}</p>}
          {!AUTH_URL && <p style={{color:"#fde68a"}}>NEXT_PUBLIC_AUTH_URL не заданий у середовищі білду.</p>}
        </form>
      </div>
    </main>
  );
}

const inputDark: React.CSSProperties = {
  background:"#1f2937",
  color:"#f3f4f6",
  padding:"10px 12px",
  border:"1px solid #374151",
  borderRadius:8,
  outline:"none"
};

const btnPrimary: React.CSSProperties = {
  padding:"10px 12px",
  border:"1px solid #3b82f6",
  background:"#3b82f6",
  color:"#fff",
  borderRadius:8,
  cursor:"pointer"
};
