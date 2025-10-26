"use client";
import React, { useEffect, useRef, useState } from "react";

type Lang = { id: string; name: string };
const LANGS: Lang[] = [
  { id: "en", name: "English" },
  { id: "es", name: "Español" },
  { id: "fr", name: "Français" },
  { id: "de", name: "Deutsch" },
  { id: "uk", name: "Українська" },
  { id: "pl", name: "Polski" },
  { id: "ru", name: "Русский" },
  { id: "it", name: "Italiano" },
  { id: "pt", name: "Português" },
];

interface Props {
  selected: string[];
  setSelected: (arr: string[]) => void;
  error?: string;
}

const box: React.CSSProperties = { position: "relative" };
const baseInput: React.CSSProperties = {
  background: "#0b1220",
  color: "#e5e7eb",
  padding: "10px 12px",
  border: "1px solid #374151",
  borderRadius: 8,
  outline: "none",
  minHeight: 42,
  display: "flex",
  alignItems: "center",
  gap: 6,
  flexWrap: "wrap",
  cursor: "pointer",
};
const placeholder: React.CSSProperties = { color: "#6b7280" };
const chip: React.CSSProperties = {
  background: "#111827",
  border: "1px solid #1f2937",
  color: "#e5e7eb",
  padding: "4px 8px",
  borderRadius: 9999,
  fontSize: 12,
};
const menuWrap: React.CSSProperties = {
  position: "absolute",
  top: 46,
  left: 0,
  right: 0,
  background: "#0b1220",
  border: "1px solid #1f2937",
  borderRadius: 8,
  zIndex: 50,
  maxHeight: 260,
  overflowY: "auto",
};
const item: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 12px",
  borderBottom: "1px solid #0f172a",
  cursor: "pointer",
};
const tickBox = (on: boolean): React.CSSProperties => ({
  width: 18,
  height: 18,
  borderRadius: 4,
  border: `1px solid ${on ? "#3b82f6" : "#374151"}`,
  background: on ? "#3b82f6" : "transparent",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  color: "#fff",
});

export default function MultiLangSelect({ selected, setSelected, error }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const names = selected
    .map((id) => LANGS.find((l) => l.id === id)?.name || id)
    .filter(Boolean);

  const bInput: React.CSSProperties = {
    ...baseInput,
    border: error ? "1px solid #ef4444" : baseInput.border as string,
  };

  const toggle = (id: string) => {
    setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };

  return (
    <div ref={ref} style={box}>
      <div style={bInput} onClick={() => setOpen((v) => !v)}>
        {names.length === 0 ? (
          <span style={placeholder}>Click to choose…</span>
        ) : (
          names.map((n) => (
            <span key={n} style={chip}>{n}</span>
          ))
        )}
      </div>

      {open && (
        <div style={menuWrap}>
          {LANGS.map((l) => {
            const on = selected.includes(l.id);
            return (
              <div key={l.id} style={item} onClick={() => toggle(l.id)}>
                <span style={tickBox(on)}>{on ? "✓" : ""}</span>
                <span>{l.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
