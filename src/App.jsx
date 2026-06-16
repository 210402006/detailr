import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import Website        from "./pages/Website";
import ClientApp      from "./pages/ClientApp";
import DetailerApp    from "./pages/DetailerApp";
import PcDashboard    from "./pages/PcDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Ecosystem      from "./pages/Ecosystem";
import ClientLogin    from "./pages/ClientLogin";
import DetailerLogin  from "./pages/DetailerLogin";

/* ─── Dev nav (hidden in production) ─── */
const DevNav = () => (
  <div style={{ position:"fixed", bottom:16, right:16, zIndex:9999,
    background:"#0C0E18", border:"1px solid rgba(255,255,255,0.12)",
    borderRadius:14, padding:"10px 14px", display:"flex", flexDirection:"column",
    gap:6, boxShadow:"0 8px 32px rgba(0,0,0,0.6)", fontFamily:"'Outfit',sans-serif" }}>
    <div style={{ fontSize:10, fontWeight:700, color:"#6B7591", letterSpacing:.5 }}>
      DETAILR APPS
    </div>
    {[
      { path:"/",               label:"🌐 Website",       col:"#F5A623" },
      { path:"/client-login",   label:"📱 Client Login",  col:"#4F8EF7" },
      { path:"/detailer-login", label:"🚐 Detailer Login",col:"#00C896" },
      { path:"/app",            label:"📱 Client App",    col:"#4F8EF7" },
      { path:"/driver",         label:"🚐 Detailer App",  col:"#00C896" },
      { path:"/dashboard",      label:"💻 Dashboard",     col:"#8B5CF6" },
      { path:"/admin",          label:"⚙️ Admin",          col:"#6366F1" },
      { path:"/ecosystem",      label:"⚡ Ecosystem",     col:"#00C896" },
    ].map(({ path, label, col }) => (
      <Link key={path} to={path} style={{ fontSize:11, fontWeight:700, color:col,
        textDecoration:"none", padding:"4px 8px", borderRadius:7,
        background:`${col}15`, border:`1px solid ${col}25` }}>
        {label}
      </Link>
    ))}
  </div>
);

/* ─── Auth callback handler ─── */
const AuthCallback = () => {
  const [msg, setMsg] = useState("Signing you in...");
  useEffect(() => {
    if (!supabase) { setMsg("Supabase not configured."); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const role = session.user?.user_metadata?.role;
        window.location.href = role === "detailer" ? "/driver" : "/app";
      } else {
        setMsg("Login failed. Please try again.");
      }
    });
  }, []);
  return (
    <div style={{ minHeight:"100vh", background:"#07080F", display:"flex",
      alignItems:"center", justifyContent:"center",
      fontFamily:"'Outfit',sans-serif", color:"#EEF2FF", fontSize:16 }}>
      {msg}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      {import.meta.env.DEV && <DevNav/>}
      <Routes>
        {/* Public */}
        <Route path="/"               element={<Website/>}/>
        <Route path="/client-login"   element={<ClientLogin/>}/>
        <Route path="/detailer-login" element={<DetailerLogin/>}/>
        <Route path="/auth/callback"  element={<AuthCallback/>}/>

        {/* Apps */}
        <Route path="/app/*"          element={<ClientApp/>}/>
        <Route path="/driver/*"       element={<DetailerApp/>}/>
        <Route path="/dashboard/*"    element={<PcDashboard/>}/>
        <Route path="/admin/*"        element={<AdminDashboard/>}/>
        <Route path="/ecosystem"      element={<Ecosystem/>}/>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}
