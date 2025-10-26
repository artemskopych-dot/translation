"use client";
import React, { useEffect, useRef, useState } from "react";
import MultiLangSelect from "../components/MultiLangSelect";

const wrap: React.CSSProperties   = { minHeight:"100vh", background:"#0b0f1a", color:"#e5e7eb", boxSizing:"border-box" };
const header: React.CSSProperties = { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid #111827" };
const logoRow: React.CSSProperties= { display:"flex", alignItems:"center", gap:12 };
const nav: React.CSSProperties    = { display:"flex", gap:12, alignItems:"center" };
const main: React.CSSProperties   = { maxWidth:980, margin:"32px auto", padding:"0 20px" };

const card: React.CSSProperties   = { background:"#0b1220", border:"1px solid #1f2937", borderRadius:12, padding:20 };

const row3: React.CSSProperties   = { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20, alignItems:"start" }; // 3 колонки в один ряд
const row2: React.CSSProperties   = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, alignItems:"start" };     // 2 колонки в один ряд
const col: React.CSSProperties    = { display:"flex", flexDirection:"column", gap:8 };

const label: React.CSSProperties  = { display:"block", fontSize:14, color:"#9CA3AF" };
const baseInput: React.CSSProperties = { background:"#0b1220", color:"#e5e7eb", padding:"10px 12px", border:"1px solid #374151", borderRadius:8, outline:"none" };
const invalidBorder: React.CSSProperties = { border:"1px solid #ef4444" };
const errText: React.CSSProperties = { color:"#ef4444", fontSize:12 };

const btnPrimary: React.CSSProperties = { padding:"10px 12px", border:"1px solid #3b82f6", background:"#3b82f6", color:"#fff", borderRadius:8, cursor:"pointer" };
const btnTab = (active:boolean): React.CSSProperties => ({
  padding:"8px 10px", borderRadius:8, border:"1px solid #1f2937",
  background: active ? "#111827" : "transparent", color:"#e5e7eb", cursor:"pointer"
});

function HelpHover({ src, alt = "help" }: { src: string; alt?: string }) {
  const wrap: React.CSSProperties = { position:"relative", display:"inline-block" };
  const q: React.CSSProperties    = { width:22, height:22, border:"1px solid #1f2937", borderRadius:9999, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#9CA3AF", cursor:"help", background:"#0b1220" };
  const img: React.CSSProperties  = { position:"absolute", top:"120%", left:0, display:"none", background:"#000", border:"1px solid #1f2937", borderRadius:8, padding:6, zIndex:50, maxWidth:360 };
  return (
    <span style={wrap} className="help-hover">
      <span style={q}>?</span>
      <img src={src} alt={alt} style={img} />
      <style jsx>{`
        .help-hover:hover img { display: block; }
      `}</style>
    </span>
  );
}

export default function HomeClient() {
  const [activeTab, setActiveTab] = useState<"translation"|"review">("translation");

  // поля форми
  const [projectName, setProjectName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [desc, setDesc] = useState("");
  const [codeIdCol, setCodeIdCol] = useState("");
  const [origLangCol, setOrigLangCol] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // гейт доступу по токену
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => { try { setToken(localStorage.getItem("token")); } catch {} }, []);
  const gated = !!token;

  const i = (invalid?: boolean): React.CSSProperties => ({ ...baseInput, ...(invalid ? invalidBorder : {}) });

  const fileInput = useRef<HTMLInputElement>(null);
  function chooseFile() { fileInput.current?.click(); }
  function shortName(name: string, max = 28) {
    return name.length <= max ? name : (name.slice(0, max-10) + "..." + name.slice(-7));
  }

  function onStart(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string,string|undefined> = {};
    if (!projectName.trim()) next.projectName = "Required";
    if (!file)               next.file = "Required";
    if (selectedLangs.length === 0) next.language = "Select at least one language";
    if (!desc.trim())        next.desc = "Required";
    if (!codeIdCol.trim())   next.codeId = "Required";
    if (!origLangCol.trim()) next.origLang = "Required";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const payload = {
      projectName,
      description: desc,
      language: selectedLangs.join(","), // мультивибір
      codeIdCol,
      origLangCol,
      fileName: file?.name || ""
    };
    console.log("START PAYLOAD", payload);

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

            {/* Ряд 1: Project name / Upload file / Languages */}
            <div style={row3}>
              {/* Project name */}
              <div style={col}>
                <label style={label}>Enter the project name</label>
                <input
                  style={i(!!errors.projectName)}
                  placeholder="Type here..."
                  value={projectName}
                  onChange={e=>setProjectName(e.target.value)}
                />
                {errors.projectName && <div style={errText}>Required</div>}
              </div>

              {/* Upload file — лише кнопка, ім'я файлу всередині */}
              <div style={col}>
                <label style={label}>Upload file</label>
                <button type="button" onClick={chooseFile} style={{...baseInput, cursor:"pointer", textAlign:"left"}}>
                  {file ? shortName(file.name) : "Choose file"}
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  style={{display:"none"}}
                  onChange={e=>setFile(e.target.files?.[0] || null)}
                />
                {errors.file && <div style={errText}>Required</div>}
              </div>

              {/* Languages — мультивибір з галочками */}
              <div style={col}>
                <label style={label}>Select the translation languages</label>
                <MultiLangSelect
                  selected={selectedLangs}
                  setSelected={setSelectedLangs}
                  error={errors.language}
                />
              </div>
            </div>

            <div style={{height:20}} />

            {/* Опис — окремим блоком під першим рядом */}
            <div style={{display:"flex", flexDirection:"column", gap:8}}>
              <label style={label}>Enter a description of the game with its characteristics and age restrictions.</label>
              <textarea
                style={{...i(!!errors.desc), minHeight:120}}
                placeholder="Type here..."
                value={desc}
                onChange={e=>setDesc(e.target.value)}
              />
              {errors.desc && <div style={errText}>Required</div>}
            </div>

            <div style={{height:20}} />

            {/* Ряд 2: два мапінги + знак питання з картинкою по hover */}
            <div style={row2}>
              <div style={col}>
                <label style={label}>File mapping — Copy “code Id” column name here</label>
                <div style={{display:"flex", alignItems:"center", gap:8}}>
                  <input
                    style={i(!!errors.codeId)}
                    placeholder="Type here..."
                    value={codeIdCol}
                    onChange={e=>setCodeIdCol(e.target.value)}
                  />
                  <HelpHover src="/Без імені1111111 (1).png" />
                </div>
                {errors.codeId && <div style={errText}>Required</div>}
              </div>

              <div style={col}>
                <label style={label}>Copy “original language id” column…</label>
                <div style={{display:"flex", alignItems:"center", gap:8}}>
                  <input
                    style={i(!!errors.origLang)}
                    placeholder="Type here..."
                    value={origLangCol}
                    onChange={e=>setOrigLangCol(e.target.value)}
                  />
                  <HelpHover src="/Без імені1111111 (1).png" />
                </div>
                {errors.origLang && <div style={errText}>Required</div>}
              </div>
            </div>

            {/* приховане поле для бекенду з CSV мов */}
            <input type="hidden" name="language" value={selectedLangs.join(",")} />

            <div style={{marginTop:20, display:"flex", justifyContent:"flex-end"}}>
              <button type="submit" style={btnPrimary}>Start</button>
            </div>
          </form>
        )}

        {activeTab === "review" && (
          <div style={card}>
            {/* TODO: Review UI */}
            <div style={{color:"#9CA3AF", fontSize:14}}>Review tab placeholder.</div>
          </div>
        )}
      </main>
    </div>
  );
}
