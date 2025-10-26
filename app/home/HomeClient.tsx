"use client";
import React, { useEffect, useRef, useState } from "react";
import MultiLangSelect from "../components/MultiLangSelect";

const wrap: React.CSSProperties   = { minHeight:"100vh", background:"#0b0f1a", color:"#e5e7eb", boxSizing:"border-box" };
const header: React.CSSProperties = { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid #111827" };
const logoRow: React.CSSProperties= { display:"flex", alignItems:"center", gap:12 };
const nav: React.CSSProperties    = { display:"flex", gap:12, alignItems:"center" };
const main: React.CSSProperties   = { maxWidth:980, margin:"32px auto", padding:"0 20px" };
const card: React.CSSProperties   = { background:"#0b1220", border:"1px solid #1f2937", borderRadius:12, padding:20 };

const row: React.CSSProperties    = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, alignItems:"start" };
const col: React.CSSProperties    = { display:"flex", flexDirection:"column", gap:10 };

const label: React.CSSProperties  = { display:"block", fontSize:14, color:"#9CA3AF" };
const baseInput: React.CSSProperties = { background:"#0b1220", color:"#e5e7eb", padding:"10px 12px", border:"1px solid #374151", borderRadius:8, outline:"none" };
const invalidBorder: React.CSSProperties = { border:"1px solid #ef4444" };
const help: React.CSSProperties   = { color:"#9CA3AF", fontSize:12 };

const btnPrimary: React.CSSProperties = { padding:"10px 12px", border:"1px solid #3b82f6", background:"#3b82f6", color:"#fff", borderRadius:8, cursor:"pointer" };
const btnTab = (active:boolean): React.CSSProperties => ({
  padding:"8px 10px", borderRadius:8, border:"1px solid #1f2937",
  background: active ? "#111827" : "transparent", color:"#e5e7eb", cursor:"pointer"
});

export default function HomeClient() {
  // вкладки
  const [activeTab, setActiveTab] = useState<"translation"|"review">("translation");

  // форми
  const [projectName, setProjectName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [desc, setDesc] = useState("");
  const [codeIdCol, setCodeIdCol] = useState("");
  const [origLangCol, setOrigLangCol] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // токен для гейту сторінки
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => { try { setToken(localStorage.getItem("token")); } catch {} }, []);

  // якщо немає токена — нічого, окрім хедера
  // (перенаправлення робить /login, тут просто не показуємо вкладки)
  const gated = !!token;

  const i = (invalid?: boolean): React.CSSProperties => ({ ...baseInput, ...(invalid ? invalidBorder : {}) });

  function onStart(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string,string|undefined> = {};
    if (!projectName.trim()) next.projectName = "Required";
    if (!file) next.file = "Required";
    if (selectedLangs.length === 0) next.language = "Select at least one language";
    if (!codeIdCol.trim()) next.codeId = "Required";
    if (!origLangCol.trim()) next.origLang = "Required";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // приклад payload (поки що просто лог)
    const payload = {
      projectName,
      description: desc,
      language: selectedLangs.join(","), // <- мультивибір
      codeIdCol,
      origLangCol,
      fileName: file?.name || ""
    };
    console.log("START PAYLOAD", payload);

    // тут далі твій submit на бекенд…
    setActiveTab("review");
  }

  return (
    <div style={wrap}>
      <header style={header}>
        <div style={logoRow}>
          <img src="/Novicore_Logo.svg" alt="Novicore" height={28} />
          <strong>Novicore • Translation</strong>
        </div>
        <nav style={nav}>
          <button style={btnTab(activeTab==="translation")} onClick={() => gated && setActiveTab("translation")} disabled={!gated}>Translation</button>
          <button style={btnTab(activeTab==="review")} onClick={() => gated && setActiveTab("review")} disabled={!gated}>Review</button>
        </nav>
      </header>

      <main style={main}>
        {activeTab === "translation" && (
          <form onSubmit={onStart} style={card}>
            <div style={row}>
              <div style={col}>
                <label style={label}>Enter the project name</label>
                <input style={i(!!errors.projectName)} placeholder="Type here..." value={projectName} onChange={e=>setProjectName(e.target.value)} />
                {errors.projectName && <div style={{color:"#ef4444",fontSize:12}}>{errors.projectName}</div>}

                <label style={label}>Upload file</label>
                <label style={{...i(!!errors.file), display:"inline-flex", alignItems:"center", gap:10, cursor:"pointer"}}>
                  <input type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}} onChange={e=>setFile(e.target.files?.[0] || null)} />
                  <span>{file ? file.name : "Choose file"}</span>
                </label>
                {errors.file && <div style={{color:"#ef4444",fontSize:12}}>{errors.file}</div>}

                {/* МУЛЬТИВИБІР МОВ */}
                <MultiLangSelect selected={selectedLangs} setSelected={setSelectedLangs} error={errors.language} />
                <input type="hidden" name="language" value={selectedLangs.join(",")} />
              </div>

              <div style={col}>
                <label style={label}>Enter a description of the game with its characteristics and age restrictions.</label>
                <textarea style={{...i(false), minHeight:120}} placeholder="Type here..." value={desc} onChange={e=>setDesc(e.target.value)} />
              </div>
            </div>

            <div style={{height:20}} />

            {/* File mapping */}
            <div style={row}>
              <div style={col}>
                <label style={label}>File mapping — Copy “code Id” column name here</label>
                <div style={{display:"flex", alignItems:"center", gap:8}}>
                  <input style={i(!!errors.codeId)} placeholder="Type here..." value={codeIdCol} onChange={e=>setCodeIdCol(e.target.value)} />
                  <span title="Приклад" style={{cursor:"pointer"}}>
                    <img src="/Без імені1111111 (1).png" alt="help" height={28} />
                  </span>
                </div>
                {errors.codeId && <div style={{color:"#ef4444",fontSize:12}}>{errors.codeId}</div>}
              </div>

              <div style={col}>
                <label style={label}>Copy “original language id” column…</label>
                <div style={{display:"flex", alignItems:"center", gap:8}}>
                  <input style={i(!!errors.origLang)} placeholder="Type here..." value={origLangCol} onChange={e=>setOrigLangCol(e.target.value)} />
                  <span title="Приклад" style={{cursor:"pointer"}}>
                    <img src="/Без імені1111111 (1).png" alt="help" height={28} />
                  </span>
                </div>
                {errors.origLang && <div style={{color:"#ef4444",fontSize:12}}>{errors.origLang}</div>}
              </div>
            </div>

            <div style={{marginTop:20, display:"flex", justifyContent:"flex-end"}}>
              <button type="submit" style={btnPrimary}>Start</button>
            </div>
          </form>
        )}

        {activeTab === "review" && (
          <div style={card}>
            <div style={help}>Review таб заповнимо пізніше.</div>
          </div>
        )}
      </main>
    </div>
  );
}
