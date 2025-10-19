"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Project = { id: string; name: string; lang: string; desc: string; codeCol: string; origLangCol: string };

export default function HomePage() {
  // якщо не залогінений — на /login
  useEffect(()=>{
    if (typeof window === "undefined") return;
    const t = localStorage.getItem("auth_jwt");
    if(!t){ window.location.href = "/login"; }
  },[]);

  const [tab,setTab] = useState<"translation"|"review">("translation");

  // --- Translation form ---
  const [projectName,setProjectName] = useState("");
  const [file, setFile] = useState<File|null>(null);
  const [language,setLanguage] = useState("");
  const [desc,setDesc] = useState("");
  const [codeCol,setCodeCol] = useState("");
  const [origLangCol,setOrigLangCol] = useState("");
  const isValid = !!(projectName && file && language && desc && codeCol && origLangCol);

  // dropdown мов
  const [openLang, setOpenLang] = useState(false);
  const langInputRef = useRef<HTMLInputElement>(null);
  const languages = useMemo(()=>[
    { id:"en", label:"English" },
    { id:"uk", label:"Ukrainian" },
    { id:"de", label:"German" },
    { id:"fr", label:"French" },
    { id:"zh", label:"Chinese" },
    { id:"es", label:"Spanish" }
  ],[]);
  useEffect(()=>{
    function onClickOutside(e: MouseEvent){
      if(!langInputRef.current) return;
      const box = langInputRef.current.parentElement!;
      if(!box.contains(e.target as Node)) setOpenLang(false);
    }
    document.addEventListener("click", onClickOutside);
    return ()=>document.removeEventListener("click", onClickOutside);
  },[]);

  // projects — НЕ читаємо з localStorage під час SSR
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(()=>{
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("projects");
      setProjects(raw ? JSON.parse(raw) : []);
    } catch {
      setProjects([]);
    }
  },[]);
  const saveProjects = (list: Project[]) => {
    setProjects(list);
    if (typeof window !== "undefined") {
      localStorage.setItem("projects", JSON.stringify(list));
    }
  };

  function onStart(){
    if(!isValid) return;
    const id = (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2));
    const p: Project = { id, name: projectName, lang: language, desc, codeCol, origLangCol };
    const next = [p, ...projects];
    saveProjects(next);
    setTab("review");
    setSelectedProjectId(id);
  }

  // --- Review ---
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const selectedProject = projects.find(p=>p.id===selectedProjectId) || null;

  return (
    <main style={{padding:"24px", maxWidth:960, margin:"0 auto"}}>
      <header style={{display:"flex", alignItems:"center", gap:12, marginBottom:16}}>
        <img src="/Novicore_Logo.svg" alt="Logo" style={{height:36}}/>
        <h1 style={{fontSize:20, fontWeight:600}}>Novicore Translation</h1>
        <div style={{marginLeft:"auto"}}>
          <button onClick={()=>{ if(typeof window!=="undefined"){ localStorage.removeItem("auth_jwt"); } window.location.href="/login"; }} style={btnGhost}>
            Вийти
          </button>
        </div>
      </header>

      <nav style={{display:"flex", gap:8, borderBottom:"1px solid #e5e7eb", marginBottom:16}}>
        <TabBtn active={tab==="translation"} onClick={()=>setTab("translation")}>Translation</TabBtn>
        <TabBtn active={tab==="review"} onClick={()=>setTab("review")}>Review</TabBtn>
      </nav>

      {tab==="translation" && (
        <section style={{display:"grid", gap:16}}>
          <Field label="Enter the project name">
            <input placeholder="Type here..." value={projectName} onChange={e=>setProjectName(e.target.value)} style={input}/>
          </Field>

          <Field label="Upload file">
            <label style={uploadBox}>
              <input type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}}
                     onChange={e=>setFile(e.target.files?.[0]||null)} />
              <span>{file ? file.name : "Click to upload a file"}</span>
            </label>
          </Field>

          <Field label="Select the translation languages">
            <div style={{position:"relative"}}>
              <input ref={langInputRef} readOnly value={language}
                     onClick={()=>setOpenLang(v=>!v)}
                     placeholder="Click to choose…" style={input}/>
              {openLang && (
                <div style={menu}>
                  {languages.map(l=>(
                    <div key={l.id} style={menuItem}
                         onClick={()=>{ setLanguage(l.id); setOpenLang(false); }}>
                      {l.label} ({l.id})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Field>

          <Field label="Enter a description of the game with its characteristics and age restrictions.">
            <textarea placeholder="Type here..." value={desc} onChange={e=>setDesc(e.target.value)} style={{...input, minHeight:80, resize:"vertical"}}/>
          </Field>

          <Field label="File mapping" helpImage="/mapping-help.png">
            <div style={{display:"grid", gap:12}}>
              <div>
                <div style={subLabel}>Copy “code Id” column name here</div>
                <input placeholder="Type here..." value={codeCol} onChange={e=>setCodeCol(e.target.value)} style={input}/>
              </div>
              <div>
                <div style={subLabel}>Copy “original language id” column name here</div>
                <input placeholder="Type here..." value={origLangCol} onChange={e=>setOrigLangCol(e.target.value)} style={input}/>
              </div>
            </div>
          </Field>

          <div style={{display:"flex", gap:12, justifyContent:"flex-end", marginTop:8}}>
            <button onClick={onStart} disabled={!isValid} style={isValid?btn:btnDisabled}>Start</button>
          </div>
        </section>
      )}

      {tab==="review" && (
        <section style={{display:"grid", gap:16}}>
          <Field label="Select project">
            <select value={selectedProjectId} onChange={e=>setSelectedProjectId(e.target.value)} style={input}>
              <option value="">— choose a project —</option>
              {projects.map(p=>(
                <option key={p.id} value={p.id}>{p.name} [{p.lang}]</option>
              ))}
            </select>
          </Field>

          {selectedProject && (
            <div style={{padding:16, border:"1px solid #e5e7eb", borderRadius:12}}>
              <div style={{fontWeight:600, marginBottom:8}}>{selectedProject.name}</div>
              <div>Language: <b>{selectedProject.lang}</b></div>
              <div style={{opacity:.8, marginTop:6}}>{selectedProject.desc}</div>
              <div style={{marginTop:6, fontSize:12, opacity:.7}}>
                Mapping: code=<b>{selectedProject.codeCol}</b>, original=<b>{selectedProject.origLangCol}</b>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function TabBtn({active, children, onClick}:{active:boolean;children:any;onClick:()=>void}){
  return (
    <button onClick={onClick}
      style={{
        padding:"10px 12px",
        border:"none",
        background:"transparent",
        borderBottom: active ? "2px solid #111827" : "2px solid transparent",
        color: active ? "#111827" : "#6b7280",
        cursor:"pointer"
      }}>
      {children}
    </button>
  );
}

function Field({label, children, helpImage}:{label:string;children:any;helpImage?:string}){
  return (
    <div style={{display:"grid", gap:8}}>
      <div style={{display:"flex", alignItems:"center", gap:8}}>
        <div style={{fontWeight:600}}>{label}</div>
        {helpImage && <Help image={helpImage} />}
      </div>
      {children}
    </div>
  );
}

function Help({image}:{image:string}){
  const [open,setOpen] = useState(false);
  return (
    <span style={{position:"relative", display:"inline-block"}}
          onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)}>
      <span style={{width:18,height:18, display:"inline-grid", placeItems:"center",
                    borderRadius:"50%", background:"#111827", color:"white", fontSize:12, cursor:"default"}}>?</span>
      {open && (
        <div style={{
          position:"absolute", top:"120%", left:0, zIndex:30,
          background:"white", border:"1px solid #e5e7eb", borderRadius:12,
          boxShadow:"0 12px 32px rgba(0,0,0,.12)", padding:8, width:520
        }}>
          <img src={image} alt="help" style={{width:"100%", height:"auto", display:"block"}} />
        </div>
      )}
    </span>
  );
}

const input: React.CSSProperties = { padding:"10px 12px", border:"1px solid #d1d5db", borderRadius:8, outline:"none", width:"100%" };
const subLabel: React.CSSProperties = { fontSize:12, color:"#6b7280", marginBottom:6 };
const uploadBox: React.CSSProperties = { padding:"12px", border:"1px dashed #9ca3af", borderRadius:8, cursor:"pointer", color:"#6b7280" };
const btn: React.CSSProperties = { padding:"10px 16px", borderRadius:8, border:"1px solid #111827", background:"#111827", color:"white", cursor:"pointer" };
const btnDisabled: React.CSSProperties = { ...btn, opacity:.5, cursor:"not-allowed" };
const btnGhost: React.CSSProperties = { padding:"8px 12px", borderRadius:8, border:"1px solid #e5e7eb", background:"white", cursor:"pointer" };

const menu: React.CSSProperties = {
  position:"absolute",
  top:"110%",
  left:0,
  background:"white",
  border:"1px solid #e5e7eb",
  borderRadius:8,
  boxShadow:"0 8px 24px rgba(0,0,0,.12)",
  padding:4,
  width:"100%",
  maxHeight:220,
  overflowY:"auto",
  zIndex:50
};

const menuItem: React.CSSProperties = {
  padding:"8px 10px",
  borderRadius:6,
  cursor:"pointer"
};
