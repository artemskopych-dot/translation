"use client";

import React from "react";

type Props = {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  error?: boolean;
};

const box: React.CSSProperties = { display:"flex", flexDirection:"column", gap:8, position:"relative" };
const inputStyle = (err?: boolean): React.CSSProperties => ({
  background:"#0b1220", color:"#e5e7eb", padding:"10px 12px",
  border:1px solid , borderRadius:8, outline:"none", cursor:"pointer"
});
const menuWrap: React.CSSProperties = {
  position:"absolute", top:44, left:0, background:"#0b1220",
  border:"1px solid #1f2937", borderRadius:8, padding:6,
  boxShadow:"0 10px 30px rgba(0,0,0,.35)", zIndex:50, width:320, maxHeight:280, overflowY:"auto"
};
const chip: React.CSSProperties = {
  background:"#111827", color:"#e5e7eb",
  border:"1px solid #374151", borderRadius:16,
  padding:"4px 10px", fontSize:12, display:"inline-flex", gap:8, alignItems:"center"
};
const item = (active:boolean): React.CSSProperties => ({
  display:"flex", alignItems:"center", gap:10, padding:"8px 10px",
  cursor:"pointer", background: active ? "#111827" : "transparent", borderRadius:6, color:"#e5e7eb"
});
const btn: React.CSSProperties = { padding:"8px 12px", background:"#3b82f6", color:"#fff", border:"1px solid #3b82f6", borderRadius:8, cursor:"pointer" };

const LANGS = [
  { id:"es", label:"Español" },
  { id:"en", label:"English" },
  { id:"uk", label:"Українська" },
  { id:"de", label:"Deutsch" },
  { id:"fr", label:"Français" },
  { id:"it", label:"Italiano" },
  { id:"pl", label:"Polski" },
];

export default function MultiLangSelect({ selected, setSelected, error }: Props) {
  const [open, setOpen] = React.useState(false);

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const label = selected.length
    ? selected.map(id => LANGS.find(l => l.id === id)?.label ?? id).join(", ")
    : "";

  return (
    <div style={box}>
      <label style={{ color:"#cbd5e1", fontSize:14 }}>Select the translation languages</label>

      <input
        data-field="language"
        readOnly
        onClick={() => setOpen(v => !v)}
        placeholder="Click to choose…"
        style={inputStyle(error)}
        value={label}
      />

      {selected.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {selected.map(id => {
            const l = LANGS.find(x => x.id === id)?.label ?? id;
            return (
              <span key={id} style={chip}>
                {l}
                <button type="button"
                        onClick={() => toggle(id)}
                        aria-label={Remove }
                        style={{ background:"transparent", color:"#9ca3af", border:"none", cursor:"pointer", fontSize:14, lineHeight:1 }}>
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {open && (
        <div style={menuWrap} onMouseLeave={() => setOpen(false)}>
          {LANGS.map(l => {
            const active = selected.includes(l.id);
            return (
              <div key={l.id} onClick={() => toggle(l.id)} style={item(active)}>
                <input type="checkbox" readOnly checked={active} />
                <span>{l.label}</span>
              </div>
            );
          })}
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:6 }}>
            <button type="button" onClick={() => setOpen(false)} style={btn}>Done</button>
          </div>
        </div>
      )}

      {error && <div style={{ color:"#ef4444", fontSize:12 }}>Please select at least one language</div>}
    </div>
  );
}
