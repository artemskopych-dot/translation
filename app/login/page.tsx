"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email,setEmail]=useState("demo@example.com");
  const [password,setPassword]=useState("");
  const [err,setErr]=useState<string|null>(null);
  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL!;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(null);
    try {
      const r = await fetch(AUTH_URL, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({email, password})
      });
      const data = await r.json();
      if (!r.ok) { setErr(data?.error || "Login failed"); return; }
      localStorage.setItem("auth_jwt", data.token);
      window.location.href = "/"; // після логіну — на домашню з вкладками
    } catch(e:any) { setErr(e.message || "Network error"); }
  }

  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:"24px"}}>
      <div style={{width:360,maxWidth:"90vw",padding:"24px",border:"1px solid #e5e7eb",borderRadius:12,boxShadow:"0 6px 24px rgba(0,0,0,.06)",background:"white"}}>
        <div style={{display:"grid",placeItems:"center",marginBottom:16}}>
          <img src="/Novicore_Logo.svg" alt="Logo" style={{height:56}} />
        </div>
        <h1 style={{fontSize:20,marginBottom:12}}>Вхід</h1>
        <form onSubmit={onSubmit} style={{display:"grid",gap:12}}>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle}/>
          <input placeholder="Пароль" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={inputStyle}/>
          <button type="submit" style={btnStyle}>Увійти</button>
          {err && <p style={{color:"#dc2626"}}>{err}</p>}
        </form>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = { padding:"10px 12px", border:"1px solid #d1d5db", borderRadius:8, outline:"none" };
const btnStyle: React.CSSProperties = { padding:"10px 12px", border:"1px solid #111827", background:"#111827", color:"white", borderRadius:8, cursor:"pointer" };
