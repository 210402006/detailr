
import { useState } from "react";
import { supabase } from "../lib/supabase";

const C = {
  bg:"#07080F", card:"#111420", border:"rgba(255,255,255,0.07)",
  green:"#00C896", text:"#EEF2FF", sub:"#6B7591", dim:"#161926",
  f:"'Outfit',sans-serif",
};

const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

export default function DetailerLogin() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const signInWithGoogle = async () => {
    if (!supabase) { setError("Connection not ready. Check Supabase config."); return; }
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/driver` },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  const signInWithApple = async () => {
    if (!supabase) { setError("Connection not ready."); return; }
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo: `${window.location.origin}/driver` },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:C.f,
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", padding:"24px 20px" }}>

      {/* Logo */}
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <div style={{ width:72, height:72, borderRadius:22, background:`${C.green}20`,
          border:`2px solid ${C.green}50`, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:36, margin:"0 auto 16px" }}>🧑‍🔧</div>
        <div style={{ fontSize:32, fontWeight:900, color:C.text }}>Detailr Pro</div>
        <div style={{ fontSize:15, color:C.sub, marginTop:6 }}>
          The platform built for detailers.
        </div>
      </div>

      {/* Earnings preview */}
      <div style={{ width:"100%", maxWidth:380, background:`${C.green}10`,
        border:`1px solid ${C.green}30`, borderRadius:16, padding:"14px 18px",
        marginBottom:20, display:"flex", justifyContent:"space-between" }}>
        {[{ v:"$692", l:"Avg weekly" },{ v:"90%", l:"You keep" },{ v:"$0", l:"To join" }].map(({ v, l }) => (
          <div key={l} style={{ textAlign:"center" }}>
            <div style={{ fontSize:20, fontWeight:900, color:C.green }}>{v}</div>
            <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Card */}
      <div style={{ width:"100%", maxWidth:380, background:C.card,
        border:`1px solid ${C.border}`, borderRadius:24, padding:"28px 24px" }}>

        <div style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:6 }}>
          Start earning today 💰
        </div>
        <div style={{ fontSize:14, color:C.sub, marginBottom:28 }}>
          Sign in to your detailer account
        </div>

        {/* Google button */}
        <button onClick={signInWithGoogle} disabled={loading}
          style={{ width:"100%", padding:"14px 16px", borderRadius:14,
            background:"white", border:"1px solid rgba(0,0,0,0.12)",
            display:"flex", alignItems:"center", justifyContent:"center",
            gap:12, cursor:loading?"default":"pointer", marginBottom:12,
            fontSize:15, fontWeight:700, color:"#1F1F1F", fontFamily:C.f,
            transition:"all .2s", opacity:loading?0.7:1 }}>
          <GoogleLogo/>
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        {/* Apple button */}
        <button onClick={signInWithApple} disabled={loading}
          style={{ width:"100%", padding:"14px 16px", borderRadius:14,
            background:"#050505", border:"1px solid rgba(255,255,255,0.15)",
            display:"flex", alignItems:"center", justifyContent:"center",
            gap:12, cursor:loading?"default":"pointer", marginBottom:20,
            fontSize:15, fontWeight:700, color:"white", fontFamily:C.f,
            transition:"all .2s", opacity:loading?0.7:1 }}>
          <AppleLogo/>
          Continue with Apple
        </button>

        {/* Divider */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <div style={{ flex:1, height:1, background:C.border }}/>
          <span style={{ fontSize:12, color:C.sub }}>or</span>
          <div style={{ flex:1, height:1, background:C.border }}/>
        </div>

        <div style={{ textAlign:"center" }}>
          <span style={{ fontSize:13, color:C.sub }}>New detailer? </span>
          <span style={{ fontSize:13, color:C.green, fontWeight:700, cursor:"pointer" }}>
            Apply to join
          </span>
        </div>

        {error && (
          <div style={{ marginTop:16, padding:"10px 14px", borderRadius:10,
            background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
            fontSize:13, color:"#EF4444" }}>
            {error}
          </div>
        )}
      </div>

      {/* Perks */}
      <div style={{ display:"flex", gap:16, marginTop:28, flexWrap:"wrap",
        justifyContent:"center" }}>
        {["🕐 Set your own hours","💳 Paid weekly","📍 Work in your city"].map(f => (
          <span key={f} style={{ fontSize:12, color:C.sub, fontWeight:600 }}>{f}</span>
        ))}
      </div>

      {/* Switch to client */}
      <div style={{ marginTop:24, textAlign:"center" }}>
        <span style={{ fontSize:13, color:C.sub }}>Looking to book a detailer? </span>
        <a href="/client-login" style={{ fontSize:13, color:"#4F8EF7",
          fontWeight:700, textDecoration:"none" }}>
          Client login →
        </a>
      </div>

      {/* Terms */}
      <div style={{ marginTop:20, fontSize:11, color:C.sub, textAlign:"center",
        maxWidth:300, lineHeight:1.6 }}>
        By continuing you agree to our{" "}
        <span style={{ color:C.green, cursor:"pointer" }}>Terms of Service</span>
        {" "}and{" "}
        <span style={{ color:C.green, cursor:"pointer" }}>Privacy Policy</span>
      </div>
    </div>
  );
}
