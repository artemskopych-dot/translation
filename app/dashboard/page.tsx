"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [ready,setReady]=useState(false);
  useEffect(()=>{
    const token = localStorage.getItem("auth_jwt");
    if(!token){ window.location.href="/login"; return; }
    setReady(true);
  },[]);
  if(!ready) return null;
  return (
    <main style={{maxWidth:720, margin:"48px auto"}}>
      <h1>Панель</h1>
      <p>Ви авторизовані. Тут зʼявляться інструменти перевірки.</p>
      <button onClick={()=>{ localStorage.removeItem("auth_jwt"); window.location.href="/login"; }}>Вийти</button>
    </main>
  );
}
