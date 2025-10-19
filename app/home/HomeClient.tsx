"use client";
import React, { useEffect, useRef, useState } from "react";

const wrap: React.CSSProperties = { minHeight:"100vh", background:"#0b0f1a", color:"#e5e7eb", boxSizing:"border-box" };
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
const main: React.CSSProperties = { maxWidth:1120, margin:"24px auto", padding:"0 16px", boxSizing:"border-box" };
const card: React.CSSProperties = { background:"#0f172a", border:"1px solid #1f2937", borderRadius:12, padding:20, boxShadow:"0 6px 18px rgba(0,0,0,.25)", boxSizing:"border-box" };

const label: React.CSSProperties = { display:"block", marginBottom:6, color:"#9ca3af", fontSize:14 };
const baseInput: React.CSSProperties = { width:"100%", padding:"10px 12px", border:"1px solid #374151", background:"#111827", color:"#f3f4f6", borderRadius:8, outline:"none", boxSizing:"border-box" };
const textarea: React.CSSProperties = { ...baseInput, minHeight:120, resize:"vertical" };
const row3: React.CSSProperties = { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20, alignItems:"start" };
const row2: React.CSSProperties = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, alignItems:"start" };
const helpIcon: React.CSSProperties = { display:"inline-flex", alignItems:"center", justifyContent:"center", width:22, height:22, fontWeight:700, borderRadius:"50%", background:"#1f2937", border:"1px solid #374151", color:"#9ca3af", cursor:"default" };
const field: React.CSSProperties = { display:"grid", gap:6 };
const actions: React.CSSProperties = { display:"flex", justifyContent:"flex-end", marginTop:8 };
const btnPrimary: React.CSSProperties = { padding:"10px 12px", border:"1px solid #3b82f6", background:"#3b82f6", color:"#fff", borderRadius:8, cursor:"pointer" };
const logoutBtn: React.CSSProperties = { ...btnPrimary, background:"#ef4444", borderColor:"#ef4444" };
const invalidBorder: React.CSSProperties = { borderColor:"#ef4444", boxShadow:"0 0 0 1px #ef4444 inset" };
const errorText: React.CSSProperties = { color:"#fca5a5", fontSize:12, marginTop:4 };

const dropdownWrap: React.CSSProperties = { position:"relative" };
const menu: React.CSSProperties = { position:"absolute", zIndex:20, top:"calc(100% + 6px)", left:0, width:"100%", background:"#0b1220", border:"1px solid #1f2937", borderRadius:10, boxShadow:"0 6px 18px rgba(0,0,0,.35)", maxHeight:240, overflowY:"auto", boxSizing:"border-box" };
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
  const [activeTab, setActiveTab] = useState<"translation"|"review">("translation");

  // поля
  const [projectName, setProjectName] = useState("");
  const fileRef = useRef<HTMLInputElement|null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [openLang, setOpenLang] = useState(false);
  const [language, setLanguage] = useState<string>("");
  const [description, setDescription] = useState("");
  const [codeIdCol, setCodeIdCol] = useState("");
  const [origLangIdCol, setOrigLangIdCol] = useState("");

  // помилки
  const [errors, setErrors] = useState<{[k:string]:boolean}>({});

  // клік поза дропдауном
  const ddRef = useRef<HTMLDivElement|null>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setOpenLang(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const onChooseFile = () => fileRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFileName(f ? f.name : "");
  };

  const validate = () => {
    const next: {[k:string]:boolean} = {};
    next.projectName = projectName.trim() === "";
    next.fileName    = fileName.trim() === "";
    next.language    = language.trim() === "";
    next.description = description.trim() === "";
    next.codeIdCol   = codeIdCol.trim() === "";
    next.origLangIdCol = origLangIdCol.trim() === "";
    setErrors(next);
    return !Object.values(next).some(Boolean);
  };

  const onStart = () => {
    if (!validate()) {
      // Скролимо до першого невалідного поля
      const id = ["projectName","fileName","language","description","codeIdCol","origLangIdCol"].find(k => (errors as any)[k] || false);
      if (id) {
        const el = document.querySelector(`[data-field="${id}"]`) as HTMLElement | null;
        el?.scrollIntoView({ behavior:"smooth", block:"center" });
      }
      return;
    }
    // TODO: сабміт (поки лише демо)
    alert("OK! Дані валідні, можна відправляти на бекенд.");
  };

  // спільні стилі інпутів + невалідний стан
  const i = (invalid?: boolean): React.CSSProperties => ({ ...baseInput, ...(invalid ? invalidBorder : {}) });

  return (
    <div style={wrap}>
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
          style={logoutBtn}
          aria-label="Log out"
        >
          Logout
        </button>
      </header>

      <main style={main}>
        {activeTab === "translation" && (
          <section style={card}>
            <div style={{display:"grid", gap:20}}>
              {/* Ряд 1: 3 колонки */}
              <div style={row3}>
                {/* Project name */}
                <div style={field} data-field="projectName">
                  <label style={label}>Enter the project name</label>
                  <input
                    style={i(errors.projectName)}
                    placeholder="Type here..."
                    value={projectName}
                    onChange={e=>setProjectName(e.target.value)}
                  />
                  {errors.projectName && <div style={errorText}>Вкажіть назву проєкту</div>}
                </div>

                {/* Upload file (кастомний) */}
                <div style={field} data-field="fileName">
                  <label style={label}>Upload file</label>
                  <div style={{display:"flex", gap:10}}>
                    <button type="button" style={btnPrimary} onClick={onChooseFile}>Choose file</button>
                    <div style={{...i(errors.fileName), padding:"10px 12px", display:"flex", alignItems:"center"}}>
                      {fileName || "Файл не вибрано"}
                    </div>
                  </div>
                  <input ref={fileRef} type="file" style={{display:"none"}} onChange={onFileChange} />
                  {errors.fileName && <div style={errorText}>Оберіть файл</div>}
                </div>

                {/* Languages (інпут + меню) */}
                <div style={{...field, position:"relative"}} ref={ddRef} data-field="language">
                  <label style={label}>Select the translation languages</label>
                  <input
                    style={i(errors.language)}
                    placeholder="Click to choose…"
                    readOnly
                    value={language ? (languages.find(l=>l.id===language)?.name ?? "") : ""}
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
                  {errors.language && <div style={errorText}>Оберіть мову</div>}
                </div>
              </div>

              {/* Опис гри */}
              <div style={field} data-field="description">
                <label style={label}>Enter a description of the game with its characteristics and age restrictions.</label>
                <textarea
                  style={textarea}
                  placeholder="Type here..."
                  value={description}
                  onChange={e=>setDescription(e.target.value)}
                />
                {errors.description && <div style={errorText}>Заповніть опис</div>}
              </div>

              {/* Ряд 2: 2 колонки */}
              <div style={row2}>
                {/* code Id */}
                <div style={field} data-field="codeIdCol">
                  <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                    <label style={label}>File mapping — Copy “code Id” column name here</label>
                    <span title="Подивись приклад на зображенні" style={helpIcon}>?</span>
                  </div>
                  <input
                    style={i(errors.codeIdCol)}
                    placeholder="Type here..."
                    value={codeIdCol}
                    onChange={e=>setCodeIdCol(e.target.value)}
                  />
                  {errors.codeIdCol && <div style={errorText}>Вкажіть назву колонки</div>}
                </div>

                {/* original language id */}
                <div style={field} data-field="origLangIdCol">
                  <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                    <label style={label}>Copy “original language id” column…</label>
                    <span title="Подивись приклад на зображенні" style={helpIcon}>?</span>
                  </div>
                  <input
                    style={i(errors.origLangIdCol)}
                    placeholder="Type here..."
                    value={origLangIdCol}
                    onChange={e=>setOrigLangIdCol(e.target.value)}
                  />
                  {errors.origLangIdCol && <div style={errorText}>Вкажіть назву колонки</div>}
                </div>
              </div>

              <div style={actions}>
                <button style={btnPrimary} onClick={onStart}>Start</button>
              </div>
            </div>
          </section>
        )}

        {activeTab === "review" && (
          <section style={card}>
            <div style={{display:"grid", gap:20}}>
              <div style={field}>
                <label style={label}>Select project</label>
                <input style={baseInput} placeholder="Click to choose…" />
              </div>
              <p style={{opacity:.75}}>Review table will appear here…</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
