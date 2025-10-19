"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  return (
    <main style={{minHeight:"100vh",background:"#0b0f1a",color:"#e5e7eb",display:"grid",placeItems:"center",padding:24}}>
      <div style={{maxWidth:520}}>
        <h1 style={{margin:"0 0 8px"}}>Щось пішло не так</h1>
        <p style={{opacity:.9,whiteSpace:"pre-wrap"}}>{error?.message || "Unknown client error"}</p>
        <button
          onClick={() => reset()}
          style={{marginTop:16,padding:"10px 12px",border:"1px solid #3b82f6",background:"#3b82f6",color:"#fff",borderRadius:8,cursor:"pointer"}}
        >
          Спробувати ще раз
        </button>
      </div>
    </main>
  );
}
