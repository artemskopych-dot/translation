"use client";
import React from "react";

type Lang = { id: string; label: string };
const LANGS: Lang[] = [
  { id: "es", label: "Español" },
  { id: "en", label: "English" },
  { id: "de", label: "Deutsch" },
  { id: "fr", label: "Français" },
  { id: "it", label: "Italiano" },
  { id: "pl", label: "Polski" },
  { id: "uk", label: "Українська" },
  { id: "ru", label: "Русский" },
];

type Props = { selected: string[]; setSelected: (v: string[]) => void; error?: string; };

const labelStyle: React.CSSProperties = { display: "block", marginBottom: 8 };
const btnStyle = (err?: boolean): React.CSSProperties => ({
  width: "100%", textAlign: "left", background: "#0b1220", color: "#e5e7eb",
  padding: "10px 12px", border: err ? "1px solid #ef4444" : "1px solid #374151",
  borderRadius: 8, outline: "none", cursor: "pointer",
});
const menuWrap: React.CSSProperties = {
  position: "absolute", top: 44, left: 0, right: 0, background: "#0b1220", color: "#e5e7eb",
  border: "1px solid #1f2937", borderRadius: 8, boxShadow: "0 10px 20px rgba(0,0,0,.35)",
  zIndex: 30, maxHeight: 260, overflowY: "auto",
};
const itemStyle = (active: boolean): React.CSSProperties => ({
  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
  cursor: "pointer", background: active ? "#111827" : "transparent",
});
const checkBox = (checked: boolean): React.CSSProperties => ({
  width: 18, height: 18, borderRadius: 4,
  border: checked ? "1px solid #3b82f6" : "1px solid #374151",
  background: checked ? "#3b82f6" : "transparent",
  display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12,
});

export default function MultiLangSelect({ selected, setSelected, error }: Props) {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setOpen(false);
  }
  function toggle(id: string) {
    setSelected(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  }

  const buttonText = selected.length
    ? selected.map(id => LANGS.find(l => l.id === id)?.label ?? id).join(", ")
    : "Click to choose…";

  return (
    <div style={{ position: "relative" }} ref={wrapRef} onKeyDown={onKeyDown}>
      <label style={labelStyle}>Select the translation languages</label>
      <input type="hidden" name="language" value={selected.join(",")} />
      <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(o=>!o)} style={btnStyle(!!error)}>
        {buttonText}
      </button>
      {open && (
        <div role="listbox" style={menuWrap}>
          {LANGS.map(l => {
            const checked = selected.includes(l.id);
            return (
              <div role="option" aria-selected={checked} key={l.id} style={itemStyle(checked)} onClick={() => toggle(l.id)}>
                <span style={checkBox(checked)}>{checked ? "✓" : ""}</span>
                <span>{l.label}</span>
              </div>
            );
          })}
        </div>
      )}
      {error && <div style={{ color: "#ef4444", marginTop: 6, fontSize: 12 }}>{error}</div>}
    </div>
  );
}
