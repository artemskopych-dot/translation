"use client";
import React, { useState, useRef, useEffect } from "react";

const wrap: React.CSSProperties = { minHeight:"100vh", background:"#0b0f1a", color:"#e5e7eb" };
const header: React.CSSProperties = { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid #111827" };
const logoRow: React.CSSProperties = { display:"flex", alignItems:"center", gap:12 };
const tabsBar: React.CSSProperties = { display:"flex", gap:12 };
const tab = (active:boolean): React.CSSProperties => ({
  padding:"8px 12px",
  border:"1px solid " + (active ? "#3b82f6" : "#374151"),
  background: active ? "#1f2937" : "transparent",
  color:"#e5e7eb",
  borderRadius:8,
  cursor:"pointer"
});
const main: React.CSSProperties = { maxWidth:920, margin:"24px auto", padding:"0 16px" };
const section: React.CSSProperties = { background:"#0f172a", border:"1px solid #1f2937", borderRadius:12, padding:20, boxShadow:"0 6px 18px rgba(0,0,0,.25)" };
const label: React.CSSProperties = { display:"block", marginBottom:6, color:"#9ca3af" };
const input: React.CSSProperties = { width:"100%", padding:"10px 12px", border:"1px solid #374151", background:"#111827", color:"#f3f4f6", borderRadius:8, outline:"none" };
const row: React.CSSProperties = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 };
const help: React.CSSProperties = { display:"inline-flex", alignItems:"center", gap:6, fontSize:14, color:"#9ca3af", cursor:"help" };
const buttonPrimary: React.CSSProperties = { padding:"10px 12px", border:"1px solid #3b82f6", background:"#3b82f6", color:"#fff", borderRadius:8, cursor:"pointer" };

const dropdown: React.CSSProperties = { position:"relative" };
const menu: React.CSSProperties = { position:"absolute", zIndex:20, top:"calc(100% + 6px)", left:0, width:"100%", background:"#0b1220", border:"1px solid #1f2937", borderRadius:10, boxShadow:"0 6px 18px rgba(0,0,0,.35)", maxHeight:240, overflowY:"auto" };
const menuItem: React.CSSProperties = { padding:"10px 12px", borderBottom:"1px solid #111827", cursor:"pointer" };

const languages = [
  { id:"en", name:"English" },
  { id:"de", name:"Deutsch" },
  { id:"pl", name:"Polski" },
  { id:"uk", name:"Українська" },
  { id:"es", name:"Español" },
  { id:"fr", name:"Français" },
];

export default function HomeClient() {
  // УВАГА: усі хуки — ТІЛЬКИ на верхньому рівні, без умовних гілок!
  const [activeTab, setActiveTab] = useState<"translation"|"review">("translation");
  const [openLang, setOpenLang] = useState(false);
  const [language, setLanguage] = useState<string>("");
  const ddRef = useRef<HTMLDivElement|null>(null);

  // закриття меню за межами — окремий useEffect (без умов)
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setOpenLang(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div style={wrap}>
      {/* Хедер показуємо лише після логіну (бо зайти сюди можна тільки з токеном через AuthGate) */}
      <header style={header}>
        <div style={logoRow}>
          <img src="/Novicore_Logo.svg" alt="Novicore" height={28} />
          <div style={{opacity:.7}}>Novicore Translation</div>
        </div>
        <nav style={tabsBar}>
          <button style={tab(activeTab==="translation")} onClick={()=>setActiveTab("translation")}>Translation</button>
          <button style={tab(activeTab==="review")} onClick={()=>setActiveTab("review")}>Review</button>
        </nav>
        <button
          onClick={() => { localStorage.removeItem("auth_jwt"); window.location.href="/login"; }}
          style={{...buttonPrimary, background:"#ef4444", borderColor:"#ef4444"}}
          aria-label="Log out"
        >
          Logout
        </button>
      </header>

      <main style={main}>
        {activeTab === "translation" && (
          <section style={section}>
            <div style={{display:"grid", gap:16}}>
              <div>
                <label style={label}>Enter the project name</label>
                <input style={input} placeholder="Type here..." />
              </div>

              <div>
                <label style={label}>Upload file</label>
                <input type="file" style={input} />
              </div>

              <div ref={ddRef} style={dropdown}>
                <label style={label}>Select the translation languages</label>
                <input
                  style={input}
                  placeholder="Click to choose…"
                  readOnly
                  value={language ? languages.find(l=>l.id===language)?.name ?? "" : ""}
                  onClick={() => setOpenLang(v=>!v)}
                />
                {openLang && (
                  <div style={menu}>
                    {languages.map(l => (
                      <div
                        key={l.id}
                        style={menuItem}
                        onClick={() => { setLanguage(l.id); setOpenLang(false); }}
                      >
                        {l.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label style={label}>Enter a description of the game with its characteristics and age restrictions.</label>
                <textarea style={{...input, minHeight:120}} placeholder="Type here..." />
              </div>

              <div style={row}>
                <div>
                  <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6}}>
                    <label style={label}>File mapping — Copy “code Id” column name here</label>
                    <span title="Подивись приклад на картинці" style={help}>?
                      <img src="/help.png" alt="help" style={{display:"none"}} />
                    </span>
                  </div>
                  <input style={input} placeholder="Type here..." />
                </div>
                <div>
                  <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6}}>
                    <label style={label}>Copy “original language id” column…</label>
                    <span title="Подивись приклад на картинці" style={help}>?
                      <img src="/help.png" alt="help" style={{display:"none"}} />
                    </span>
                  </div>
                  <input style={input} placeholder="Type here..." />
                </div>
              </div>

              <div style={{display:"flex", justifyContent:"flex-end"}}>
                <button style={buttonPrimary}>Start</button>
              </div>
            </div>
          </section>
        )}

        {activeTab === "review" && (
          <section style={section}>
            <div style={{display:"grid", gap:16}}>
              <div>
                <label style={label}>Select project</label>
                <input style={input} placeholder="Click to choose…" />
              </div>
              <p style={{opacity:.75}}>Review table will appear here…</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
