import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Website       from "./pages/Website";
import ClientApp     from "./pages/ClientApp";
import DetailerApp   from "./pages/DetailerApp";
import PcDashboard   from "./pages/PcDashboard";
import Ecosystem     from "./pages/Ecosystem";
import AdminDashboard from "./pages/AdminDashboard";

const DevNav = () => (
  <div style={{ position:"fixed", bottom:16, right:16, zIndex:9999,
    background:"#0C0E18", border:"1px solid rgba(255,255,255,0.12)",
    borderRadius:14, padding:"10px 14px", display:"flex", flexDirection:"column",
    gap:8, boxShadow:"0 8px 32px rgba(0,0,0,0.6)", fontFamily:"'Outfit',sans-serif" }}>
    <div style={{ fontSize:10, fontWeight:700, color:"#6B7591", letterSpacing:.5 }}>DETAILR APPS</div>
    {[
      { path:"/",          label:"🌐 Website",     col:"#F5A623" },
      { path:"/app",       label:"📱 Client App",  col:"#4F8EF7" },
      { path:"/driver",    label:"🚐 Detailer App", col:"#00C896" },
      { path:"/dashboard", label:"💻 Dashboard",   col:"#8B5CF6" },
      { path:"/admin",     label:"⚙️ Admin",        col:"#6366F1" },
      { path:"/ecosystem", label:"⚡ Ecosystem",   col:"#00C896" },
    ].map(({ path, label, col }) => (
      <Link key={path} to={path} style={{ fontSize:12, fontWeight:700, color:col,
        textDecoration:"none", padding:"5px 10px", borderRadius:8,
        background:`${col}15`, border:`1px solid ${col}30` }}>
        {label}
      </Link>
    ))}
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      {import.meta.env.DEV && <DevNav/>}
      <Routes>
        <Route path="/"           element={<Website/>}/>
        <Route path="/app/*"      element={<ClientApp/>}/>
        <Route path="/driver/*"   element={<DetailerApp/>}/>
        <Route path="/dashboard/*"element={<PcDashboard/>}/>
        <Route path="/admin/*"    element={<AdminDashboard/>}/>
        <Route path="/ecosystem"  element={<Ecosystem/>}/>
        <Route path="*"           element={<Navigate to="/" replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}
