import { useState, useEffect, useRef } from "react";

/* ─── Font + global styles ─── */
if (!document.getElementById("outfit-d")) {
  const l = document.createElement("link");
  l.id = "outfit-d";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap";
  document.head.appendChild(l);
  const s = document.createElement("style");
  s.textContent = `
    *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
    ::-webkit-scrollbar{display:none}
    input,button,textarea{font-family:'Outfit',sans-serif}
    @keyframes ring-pulse{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.2);opacity:0}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  `;
  document.head.appendChild(s);
}

/* ─── Design tokens — green primary for earning side ─── */
const T = {
  bg:"#07080F", surface:"#0D0F1A", card:"#111420", card2:"#141828",
  border:"rgba(255,255,255,0.07)",
  green:"#00C896", blue:"#4F8EF7", amber:"#F5A623",
  red:"#EF4444",   purple:"#8B5CF6", orange:"#F97316",
  text:"#EEF2FF",  sub:"#6B7591",   dim:"#161926",
  f:"'Outfit',sans-serif",
};

/* ─── Mock data ─── */
const SCHEDULED = [
  { id:1, svc:"Full Mobile Detail", client:"Alex J.",  date:"Jun 5",  time:"10:00 AM", addr:"123 Main St",  dist:"1.2 km", earn:85.50,  st:"Confirmed", col:T.green  },
  { id:2, svc:"Ceramic Boost",      client:"David R.", date:"Jun 5",  time:"2:00 PM",  addr:"789 Pine St",  dist:"3.1 km", earn:133.50, st:"Pending",   col:T.amber  },
  { id:3, svc:"Interior Detail",    client:"Maya K.",  date:"Jun 6",  time:"11:00 AM", addr:"456 Oak Ave",  dist:"2.3 km", earn:49.50,  st:"Confirmed", col:T.green  },
  { id:4, svc:"Basic Wash",         client:"Tom B.",   date:"Jun 7",  time:"9:00 AM",  addr:"321 Elm St",   dist:"0.8 km", earn:31.50,  st:"Confirmed", col:T.green  },
];
const RECENT = [
  { svc:"Full Mobile Detail", client:"Sarah M.",  when:"Today, 10:00 AM",   earn:85.50  },
  { svc:"Ceramic Boost",      client:"James T.",  when:"Yesterday, 2:00 PM",earn:133.50 },
  { svc:"Interior Detail",    client:"Emily R.",  when:"Jun 1, 11:00 AM",   earn:49.50  },
];
const AVAIL_INIT = [
  { d:"Monday",    on:true,  start:"9:00 AM",  end:"6:00 PM" },
  { d:"Tuesday",   on:true,  start:"9:00 AM",  end:"6:00 PM" },
  { d:"Wednesday", on:true,  start:"10:00 AM", end:"5:00 PM" },
  { d:"Thursday",  on:true,  start:"9:00 AM",  end:"6:00 PM" },
  { d:"Friday",    on:true,  start:"9:00 AM",  end:"8:00 PM" },
  { d:"Saturday",  on:true,  start:"10:00 AM", end:"4:00 PM" },
  { d:"Sunday",    on:false, start:"",         end:""         },
];

/* ─── Reusable atoms ─── */
const Av = ({ av, col, sz = 44 }) => (
  <div style={{ width:sz, height:sz, borderRadius:"50%", background:`${col}20`,
    border:`2px solid ${col}40`, display:"flex", alignItems:"center",
    justifyContent:"center", color:col, fontWeight:700,
    fontSize:Math.round(sz * 0.34), flexShrink:0 }}>
    {av}
  </div>
);

const Card = ({ children, style: s = {}, onClick }) => (
  <div onClick={onClick}
    style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18,
      padding:16, marginBottom:12, cursor:onClick ? "pointer" : "default", ...s }}>
    {children}
  </div>
);

const BigBtn = ({ children, onClick, col = T.green, disabled = false, outline = false }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ width:"100%", padding:"17px", borderRadius:15,
      background:outline ? `${col}12` : disabled ? T.dim : col,
      color:outline ? col : disabled ? T.sub : "white",
      border:outline ? `1px solid ${col}40` : "none",
      fontSize:17, fontWeight:800, cursor:disabled ? "default" : "pointer",
      fontFamily:T.f, transition:"all .2s", opacity:disabled ? 0.5 : 1,
      boxShadow:outline || disabled ? "none" : `0 4px 20px ${col}45` }}>
    {children}
  </button>
);

const BackBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ width:38, height:38, borderRadius:12,
    background:T.card, border:`1px solid ${T.border}`,
    display:"flex", alignItems:"center", justifyContent:"center",
    cursor:"pointer", color:T.text, fontSize:22, lineHeight:1, flexShrink:0 }}>
    ‹
  </button>
);

const SLabel = ({ children }) => (
  <div style={{ fontSize:11, fontWeight:800, color:T.sub, letterSpacing:1, marginBottom:12 }}>
    {children}
  </div>
);

const StatusPill = ({ st, col }) => (
  <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20,
    background:`${col}20`, color:col }}>{st}</span>
);

/* ─── Mock SVG map ─── */
const MockMap = ({ showCar = false, carPct = 0 }) => {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 60); return () => clearInterval(id); }, []);
  const r = (tick % 100) / 100;
  return (
    <div style={{ position:"relative", width:"100%", height:"100%", overflow:"hidden", background:"#141824" }}>
      <svg style={{ position:"absolute", inset:0 }} width="100%" height="100%" viewBox="0 0 390 200" preserveAspectRatio="none">
        <rect width="390" height="200" fill="#141824"/>
        {[[18,18,86,40],[120,18,82,40],[218,18,88,40],[322,18,62,40],
          [18,78,86,40],[120,78,82,40],[218,78,88,40],[322,78,62,40],
          [18,138,86,40],[120,138,82,40],[218,138,88,40]].map(([x,y,w,h],i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="#1A2035" rx="3"/>
        ))}
        {[14,72,136].map((y,i) => <rect key={i} x="0" y={y} width="390" height="7" fill="#1D2540"/>)}
        {[112,212,316].map((x,i) => <rect key={i} x={x} y="0" width="8" height="200" fill="#1D2540"/>)}
        {[14,72,136].map((y,i) =>
          [25,65,105,145,185,225,265,305,345].map((x,j) => (
            <rect key={`${i}${j}`} x={x} y={y+3} width="16" height="1.5" fill="#263050" opacity="0.6"/>
          ))
        )}
        <rect x="125" y="82" width="78" height="38" fill="#182D1F" rx="3"/>
        <circle cx="155" cy="98" r="11" fill="#1C3526"/>
        <circle cx="172" cy="104" r="7" fill="#1C3526"/>
        {showCar && (
          <line x1="75" y1="82" x2="195" y2="102" stroke={T.blue} strokeWidth="3" strokeDasharray="8 4" opacity="0.7"/>
        )}
      </svg>
      {/* Detailer location */}
      <div style={{ position:"absolute", left:showCar ? `${20 + carPct * 0.36}%` : "20%",
        top:"42%", transform:"translate(-50%,-50%)", fontSize:22,
        transition:"left 1s linear", zIndex:4 }}>
        🚐
      </div>
      {/* Client pin */}
      <div style={{ position:"absolute", left:"50%", top:"53%", transform:"translate(-50%,-50%)", zIndex:3 }}>
        <div style={{ width:14, height:14, borderRadius:"50%", background:T.green,
          border:"3px solid white", boxShadow:`0 2px 10px ${T.green}80` }}/>
        <div style={{ position:"absolute", left:"50%", top:"50%",
          transform:"translate(-50%,-50%)", width:14 + r * 28, height:14 + r * 28,
          borderRadius:"50%", background:`rgba(0,200,150,${0.15 - r * 0.12})`, transition:"none" }}/>
      </div>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:50,
        background:`linear-gradient(transparent,${T.bg})`, pointerEvents:"none" }}/>
    </div>
  );
};

/* ─── Status bar ─── */
const StatusBar = ({ online }) => (
  <div style={{ height:44, display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"0 24px", fontFamily:T.f, flexShrink:0,
    background:online ? `${T.green}08` : "transparent", transition:"background .5s" }}>
    <span style={{ fontSize:15, fontWeight:700, color:T.text }}>9:41</span>
    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
      {online && (
        <span style={{ fontSize:11, fontWeight:700, color:T.green,
          animation:"blink 2s infinite" }}>● LIVE</span>
      )}
      <span style={{ fontSize:12, color:T.text }}>●●●●</span>
      <span style={{ fontSize:11, color:T.text }}>WiFi</span>
      <span style={{ fontSize:12 }}>🔋</span>
    </div>
  </div>
);

/* ─── Bottom nav ─── */
const NAV = [
  { id:"dashboard", label:"Dashboard", path:"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z", fill:true },
  { id:"calendar",  label:"Schedule",  path:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id:"earnings",  label:"Earnings",  path:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id:"account",   label:"Account",   path:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M16 7a4 4 0 11-8 0 4 4 0 018 0z" },
];

const BottomNav = ({ tab, onTab }) => (
  <div style={{ height:82, background:T.surface, borderTop:`1px solid ${T.border}`,
    display:"flex", alignItems:"center", paddingBottom:10, flexShrink:0 }}>
    {NAV.map(n => {
      const active = tab === n.id;
      return (
        <button key={n.id} onClick={() => onTab(n.id)}
          style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4,
            background:"none", border:"none", cursor:"pointer", padding:"8px 0",
            color:active ? T.green : T.sub, fontFamily:T.f, transition:"color .2s" }}>
          <svg width="22" height="22" viewBox="0 0 24 24"
            fill={n.fill && active ? T.green : "none"}
            stroke={active ? T.green : T.sub}
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={n.path}/>
          </svg>
          <span style={{ fontSize:10, fontWeight:active ? 700 : 500 }}>{n.label}</span>
          {active && <div style={{ width:4, height:4, borderRadius:"50%", background:T.green, marginTop:-2 }}/>}
        </button>
      );
    })}
  </div>
);

/* ══════════════════════════════════════
   SCREEN 1 — DASHBOARD
══════════════════════════════════════ */
const DashboardScreen = ({ go, online, setOnline }) => (
  <div style={{ height:"100%", overflowY:"auto", background:T.bg }}>
    {/* Header */}
    <div style={{ padding:"16px 16px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <div>
        <div style={{ fontSize:13, color:T.sub }}>Good morning 👋</div>
        <div style={{ fontSize:22, fontWeight:900, color:T.text }}>Marcus K.</div>
      </div>
      <div style={{ position:"relative" }}>
        <Av av="MK" col={T.green} sz={48}/>
        <div style={{ position:"absolute", bottom:1, right:1, width:13, height:13,
          borderRadius:"50%", background:online ? T.green : T.sub,
          border:`2px solid ${T.bg}`, transition:"background .3s" }}/>
      </div>
    </div>

    {/* Online / Offline toggle card */}
    <div style={{ margin:"14px 16px 0" }}>
      <div onClick={() => setOnline(!online)}
        style={{ background:online ? `${T.green}10` : T.card,
          border:`1px solid ${online ? T.green + "40" : T.border}`,
          borderRadius:20, padding:"18px 20px", cursor:"pointer",
          display:"flex", alignItems:"center", gap:18, transition:"all .35s",
          boxShadow:online ? `0 0 30px ${T.green}20` : "none" }}>
        {/* Big toggle */}
        <div style={{ width:64, height:64, borderRadius:"50%", flexShrink:0,
          background:online ? `${T.green}25` : T.dim,
          border:`3px solid ${online ? T.green : T.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all .35s", boxShadow:online ? `0 0 24px ${T.green}50` : "none" }}>
          <div style={{ width:24, height:24, borderRadius:"50%",
            background:online ? T.green : T.sub, transition:"background .3s" }}/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:18, fontWeight:800,
            color:online ? T.green : T.sub, transition:"color .3s" }}>
            {online ? "You're Online" : "You're Offline"}
          </div>
          <div style={{ fontSize:13, color:T.sub, marginTop:3 }}>
            {online ? "Accepting job requests" : "Tap to start receiving jobs"}
          </div>
        </div>
        <div style={{ width:46, height:26, borderRadius:13, background:online ? T.green : T.dim,
          position:"relative", transition:"background .3s", flexShrink:0 }}>
          <div style={{ position:"absolute", top:3, left:online ? "calc(100% - 23px)" : 3,
            width:20, height:20, borderRadius:"50%", background:"white",
            transition:"left .3s", boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }}/>
        </div>
      </div>
    </div>

    {/* Today stats */}
    <div style={{ padding:"14px 16px 0" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
        {[
          { v:"$268", l:"Earned",    col:T.green, em:"💰" },
          { v:"3",    l:"Jobs Done", col:T.text,  em:"✅" },
          { v:"4.9★", l:"Rating",   col:T.amber, em:"⭐" },
        ].map(({ v, l, col, em }) => (
          <div key={l} style={{ background:T.card, border:`1px solid ${T.border}`,
            borderRadius:14, padding:"12px 10px", textAlign:"center" }}>
            <div style={{ fontSize:16, marginBottom:4 }}>{em}</div>
            <div style={{ fontSize:20, fontWeight:900, color:col }}>{v}</div>
            <div style={{ fontSize:11, color:T.sub, marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Simulate request — demo button */}
    {online && (
      <div style={{ padding:"14px 16px 0" }}>
        <div style={{ background:`${T.amber}10`, border:`1px solid ${T.amber}35`,
          borderRadius:14, padding:"12px 14px" }}>
          <div style={{ fontSize:11, fontWeight:800, color:T.amber, marginBottom:8, letterSpacing:.5 }}>
            DEMO — SIMULATE INCOMING JOB
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => go("request_now")}
              style={{ flex:1, padding:"10px", borderRadius:11, background:T.amber,
                color:"white", border:"none", fontSize:13, fontWeight:700,
                cursor:"pointer", fontFamily:T.f }}>
              🔴 Right Now
            </button>
            <button onClick={() => go("request_scheduled")}
              style={{ flex:1, padding:"10px", borderRadius:11, background:`${T.purple}20`,
                color:T.purple, border:`1px solid ${T.purple}40`, fontSize:13,
                fontWeight:700, cursor:"pointer", fontFamily:T.f }}>
              🗓️ Scheduled
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Today's schedule */}
    <div style={{ padding:"16px 16px 0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <span style={{ fontSize:17, fontWeight:800, color:T.text }}>Today's Schedule</span>
        <span onClick={() => go("calendar")}
          style={{ fontSize:13, color:T.green, cursor:"pointer", fontWeight:600 }}>View all →</span>
      </div>
      {SCHEDULED.filter(j => j.date === "Jun 5").map(j => (
        <div key={j.id} style={{ background:T.card, border:`1px solid ${T.border}`,
          borderRadius:16, padding:14, marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:T.text }}>{j.svc}</div>
              <div style={{ fontSize:12, color:T.sub, marginTop:2 }}>👤 {j.client} · 📍 {j.addr}</div>
            </div>
            <StatusPill st={j.st} col={j.col}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:12, color:T.sub }}>⏰ {j.time} · {j.dist}</span>
            <span style={{ fontSize:16, fontWeight:800, color:T.green }}>+${j.earn.toFixed(2)}</span>
          </div>
          {j.st === "Confirmed" && (
            <button onClick={() => go("active_job")}
              style={{ marginTop:10, width:"100%", padding:"9px", borderRadius:10,
                background:`${T.green}12`, border:`1px solid ${T.green}35`,
                color:T.green, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:T.f }}>
              Start Job →
            </button>
          )}
        </div>
      ))}
    </div>

    {/* Recent jobs */}
    <div style={{ padding:"4px 16px 0" }}>
      <div style={{ fontSize:17, fontWeight:800, color:T.text, marginBottom:12 }}>Recent Jobs</div>
      {RECENT.map((j, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0",
          borderBottom:`1px solid ${T.border}` }}>
          <div style={{ width:42, height:42, borderRadius:12, background:`${T.green}15`,
            border:`1px solid ${T.green}30`, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:18, flexShrink:0 }}>✅</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:600, color:T.text }}>{j.svc}</div>
            <div style={{ fontSize:12, color:T.sub, marginTop:1 }}>{j.client} · {j.when}</div>
          </div>
          <span style={{ fontSize:15, fontWeight:800, color:T.green }}>+${j.earn.toFixed(2)}</span>
        </div>
      ))}
    </div>
    <div style={{ height:16 }}/>
  </div>
);

/* ══════════════════════════════════════
   SCREEN 2 — REQUEST NOW (FULL SCREEN)
══════════════════════════════════════ */
const RequestNowScreen = ({ go, onAccept }) => {
  const [count, setCount] = useState(15);
  const [pulse, setPulse] = useState(0);
  const TOTAL = 15;

  useEffect(() => {
    const t = setInterval(() => {
      setCount(c => {
        if (c <= 1) { clearInterval(t); go("dashboard"); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setPulse(p => (p + 1) % 100), 40);
    return () => clearInterval(t);
  }, []);

  const circ = 2 * Math.PI * 56;
  const consumed = ((TOTAL - count) / TOTAL) * circ;
  const urgent = count <= 6;
  const r = pulse / 100;

  return (
    <div style={{ height:"100%", background:T.bg, display:"flex",
      flexDirection:"column", position:"relative", overflow:"hidden" }}>

      {/* Pulsing background rings */}
      {[260, 340, 420].map((sz, i) => (
        <div key={i} style={{ position:"absolute", left:"50%", top:"32%",
          transform:"translate(-50%,-50%)",
          width:sz + r * 30, height:sz + r * 30, borderRadius:"50%",
          border:`1.5px solid rgba(239,68,68,${0.18 - i * 0.05 - r * 0.08})`,
          transition:"none", pointerEvents:"none" }}/>
      ))}

      {/* Live badge */}
      <div style={{ padding:"18px 20px 0", display:"flex", justifyContent:"center", flexShrink:0 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:7,
          background:"rgba(239,68,68,0.14)", border:"1px solid rgba(239,68,68,0.4)",
          borderRadius:20, padding:"7px 18px" }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:T.red,
            boxShadow:`0 0 8px ${T.red}`, animation:"blink 0.8s infinite" }}/>
          <span style={{ fontSize:12, fontWeight:800, color:T.red, letterSpacing:.8 }}>
            INCOMING REQUEST — RIGHT NOW
          </span>
        </div>
      </div>

      <div style={{ textAlign:"center", padding:"10px 20px 0", flexShrink:0 }}>
        <div style={{ fontSize:24, fontWeight:900, color:T.text }}>New Job Request!</div>
        <div style={{ fontSize:14, color:T.sub, marginTop:4 }}>Accept before the timer runs out</div>
      </div>

      {/* Countdown ring */}
      <div style={{ display:"flex", justifyContent:"center", marginTop:16, flexShrink:0 }}>
        <div style={{ position:"relative", width:138, height:138 }}>
          <svg width="138" height="138" style={{ position:"absolute", inset:0 }}>
            <circle cx="69" cy="69" r="56" fill="none" stroke={T.dim} strokeWidth="7"/>
            <circle cx="69" cy="69" r="56" fill="none"
              stroke={urgent ? T.red : T.amber} strokeWidth="7"
              strokeDasharray={`${circ - consumed} ${consumed}`}
              strokeLinecap="round"
              style={{ transformOrigin:"69px 69px", transform:"rotate(-90deg)",
                transition:"stroke-dasharray 0.85s linear, stroke .4s" }}/>
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex",
            flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            <div style={{ fontSize:44, fontWeight:900, color:urgent ? T.red : T.amber,
              lineHeight:1, transition:"color .4s" }}>{count}</div>
            <div style={{ fontSize:11, color:T.sub, fontWeight:600 }}>seconds</div>
          </div>
        </div>
      </div>

      {/* Job details */}
      <div style={{ padding:"14px 16px 0", flex:1, overflow:"hidden" }}>
        <div style={{ background:T.card, border:`1px solid ${T.border}`,
          borderRadius:20, padding:18 }}>
          {/* Payout + client */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div>
              <div style={{ fontSize:11, color:T.sub, fontWeight:700, letterSpacing:1 }}>CLIENT</div>
              <div style={{ fontSize:20, fontWeight:800, color:T.text, marginTop:2 }}>Sarah M.</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:11, color:T.sub, fontWeight:700, letterSpacing:1 }}>YOUR PAYOUT</div>
              <div style={{ fontSize:32, fontWeight:900, color:T.green, marginTop:2,
                textShadow:`0 0 20px ${T.green}60` }}>$85.50</div>
            </div>
          </div>
          {[
            { em:"✨", l:"Service",  v:"Full Mobile Detail" },
            { em:"📍", l:"Address",  v:"456 Oak Ave, Winnipeg" },
            { em:"📏", l:"Distance", v:"2.3 km away · ~8 min drive" },
            { em:"🚗", l:"Vehicle",  v:"2021 Tesla Model 3" },
            { em:"⏱️", l:"Duration", v:"~90 minutes" },
          ].map(({ em, l, v }) => (
            <div key={l} style={{ display:"flex", gap:12, alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:18, width:24, flexShrink:0 }}>{em}</span>
              <div>
                <div style={{ fontSize:10, color:T.sub, fontWeight:600 }}>{l.toUpperCase()}</div>
                <div style={{ fontSize:14, fontWeight:600, color:T.text }}>{v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accept / Decline */}
      <div style={{ padding:"14px 16px 22px", display:"flex", gap:12, flexShrink:0 }}>
        <button onClick={() => go("dashboard")}
          style={{ flex:1, padding:"16px", borderRadius:14,
            background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.35)",
            color:T.red, fontSize:16, fontWeight:700, cursor:"pointer", fontFamily:T.f }}>
          ✕ Decline
        </button>
        <button onClick={() => { onAccept(); go("active_job"); }}
          style={{ flex:2, padding:"16px", borderRadius:14, background:T.green,
            border:"none", color:"white", fontSize:17, fontWeight:800,
            cursor:"pointer", fontFamily:T.f,
            boxShadow:`0 4px 24px ${T.green}55` }}>
          ✓ Accept Job
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   SCREEN 3 — SCHEDULED REQUEST (QUIET)
══════════════════════════════════════ */
const RequestScheduledScreen = ({ go }) => (
  <div style={{ height:"100%", overflowY:"auto", background:T.bg }}>
    <div style={{ padding:"14px 16px 0", display:"flex", alignItems:"center", gap:12 }}>
      <BackBtn onClick={() => go("calendar")}/>
      <div style={{ fontSize:20, fontWeight:800, color:T.text }}>Scheduled Request</div>
    </div>

    <div style={{ padding:"14px 16px 0" }}>
      {/* Scheduled badge */}
      <div style={{ display:"inline-flex", alignItems:"center", gap:8,
        background:`${T.purple}15`, border:`1px solid ${T.purple}40`,
        borderRadius:20, padding:"8px 16px", marginBottom:16 }}>
        <span style={{ fontSize:14 }}>🗓️</span>
        <span style={{ fontSize:13, fontWeight:700, color:T.purple }}>
          SCHEDULED · Tomorrow · 2:00 PM
        </span>
      </div>

      {/* Info note */}
      <div style={{ background:`${T.purple}08`, border:`1px solid ${T.purple}25`,
        borderRadius:14, padding:"12px 14px", marginBottom:14 }}>
        <div style={{ fontSize:12, color:T.purple, fontWeight:700, marginBottom:4 }}>
          ℹ️ HOW SCHEDULED REQUESTS WORK
        </div>
        <div style={{ fontSize:13, color:T.sub, lineHeight:1.6 }}>
          This client wants to book a <strong style={{ color:T.text }}>future slot</strong>.
          Your schedule showed you're available at this time.
          Accepting adds it to your calendar — you won't be
          disturbed on the day until a <strong style={{ color:T.text }}>2-hour reminder</strong> fires automatically.
        </div>
      </div>

      {/* Job card */}
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:11, color:T.sub, fontWeight:700, letterSpacing:1 }}>CLIENT</div>
            <div style={{ fontSize:20, fontWeight:800, color:T.text, marginTop:2 }}>David R.</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11, color:T.sub, fontWeight:700, letterSpacing:1 }}>YOUR PAYOUT</div>
            <div style={{ fontSize:28, fontWeight:900, color:T.green }}>$133.50</div>
          </div>
        </div>
        {[
          { em:"💎", l:"Service",  v:"Ceramic Boost"              },
          { em:"📅", l:"Date",     v:"Tomorrow, Jun 4 · 2:00 PM"  },
          { em:"📍", l:"Address",  v:"789 Pine St, Winnipeg"       },
          { em:"📏", l:"Distance", v:"3.1 km away"                 },
          { em:"🚗", l:"Vehicle",  v:"2020 BMW X5"                 },
          { em:"⏱️", l:"Duration", v:"~2 hours"                   },
        ].map(({ em, l, v }) => (
          <div key={l} style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:18, width:24, flexShrink:0 }}>{em}</span>
            <div>
              <div style={{ fontSize:10, color:T.sub, fontWeight:600 }}>{l.toUpperCase()}</div>
              <div style={{ fontSize:14, fontWeight:600, color:T.text }}>{v}</div>
            </div>
          </div>
        ))}
      </Card>

      {/* Availability check */}
      <div style={{ background:`${T.green}08`, border:`1px solid ${T.green}25`,
        borderRadius:14, padding:"12px 14px", marginBottom:14,
        display:"flex", gap:10, alignItems:"center" }}>
        <span style={{ fontSize:20 }}>✅</span>
        <div>
          <div style={{ fontSize:12, color:T.green, fontWeight:700 }}>YOU'RE AVAILABLE</div>
          <div style={{ fontSize:12, color:T.sub, marginTop:2 }}>
            Your schedule shows you're free tomorrow 9:00 AM – 8:00 PM
          </div>
        </div>
      </div>

      <BigBtn onClick={() => go("calendar")}>✓ Accept &amp; Add to Schedule</BigBtn>
      <div style={{ height:10 }}/>
      <BigBtn onClick={() => go("calendar")} col={T.red} outline>Decline Request</BigBtn>
    </div>
    <div style={{ height:20 }}/>
  </div>
);

/* ══════════════════════════════════════
   SCREEN 4 — ACTIVE JOB
══════════════════════════════════════ */
const ActiveJobScreen = ({ go }) => {
  const [step, setStep] = useState(0);
  const [navModal, setNavModal] = useState(false);
  const [done, setDone] = useState(false);
  const [carPct, setCarPct] = useState(0);

  useEffect(() => {
    if (step === 0) {
      const t = setInterval(() => setCarPct(p => Math.min(p + .3, 85)), 100);
      return () => clearInterval(t);
    }
  }, [step]);

  const WORKFLOW = [
    { label:"Start Route",       em:"🗺️",  col:T.blue,   hint:"Head to client location" },
    { label:"Mark as Arrived",   em:"📍",  col:T.amber,  hint:"You've reached the client" },
    { label:"Start Service",     em:"🧹",  col:T.purple, hint:"Service is in progress" },
    { label:"Complete Service",  em:"✅",  col:T.green,  hint:"Job is done" },
  ];

  const handleBtn = () => {
    if (step === 0) { setNavModal(true); return; }
    if (step >= 3) { setDone(true); return; }
    setStep(s => s + 1);
  };

  /* Completion screen */
  if (done) return (
    <div style={{ height:"100%", background:T.bg, display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:"0 24px", textAlign:"center" }}>
      <div style={{ fontSize:72, marginBottom:16 }}>🎉</div>
      <div style={{ fontSize:28, fontWeight:900, color:T.text }}>Job Complete!</div>
      <div style={{ fontSize:15, color:T.sub, marginTop:6, marginBottom:24 }}>
        Payout added to your earnings
      </div>
      <div style={{ background:`${T.green}12`, border:`1px solid ${T.green}40`,
        borderRadius:18, padding:"20px", width:"100%", marginBottom:24 }}>
        <div style={{ fontSize:13, color:T.sub, marginBottom:6 }}>EARNINGS THIS JOB</div>
        <div style={{ fontSize:44, fontWeight:900, color:T.green }}>+$85.50</div>
        <div style={{ marginTop:12, display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontSize:12, color:T.sub }}>Today's total</span>
          <span style={{ fontSize:14, fontWeight:700, color:T.green }}>$354.00</span>
        </div>
      </div>
      {/* Star rating request */}
      <div style={{ background:T.card, border:`1px solid ${T.border}`,
        borderRadius:16, padding:16, width:"100%", marginBottom:16 }}>
        <div style={{ fontSize:13, color:T.sub, marginBottom:10, textAlign:"center" }}>
          How was this job?
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:8 }}>
          {[1,2,3,4,5].map(n => (
            <span key={n} style={{ fontSize:32, cursor:"pointer" }}>⭐</span>
          ))}
        </div>
      </div>
      <BigBtn onClick={() => go("dashboard")}>Back to Dashboard</BigBtn>
    </div>
  );

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:T.bg, position:"relative" }}>
      {/* Header */}
      <div style={{ padding:"14px 16px", display:"flex", alignItems:"center",
        gap:12, flexShrink:0, borderBottom:`1px solid ${T.border}` }}>
        <div style={{ width:10, height:10, borderRadius:"50%",
          background:WORKFLOW[step].col, boxShadow:`0 0 10px ${WORKFLOW[step].col}` }}/>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12, color:T.sub, fontWeight:600, letterSpacing:.5 }}>ACTIVE JOB</div>
          <div style={{ fontSize:17, fontWeight:800, color:WORKFLOW[step].col }}>
            {WORKFLOW[step].hint}
          </div>
        </div>
        <button style={{ width:38, height:38, borderRadius:10, background:`${T.blue}15`,
          border:"none", fontSize:18, cursor:"pointer" }}>💬</button>
        <button style={{ width:38, height:38, borderRadius:10, background:`${T.green}15`,
          border:"none", fontSize:18, cursor:"pointer" }}>📞</button>
      </div>

      {/* Step progress */}
      <div style={{ padding:"10px 16px 8px", display:"flex", gap:4, flexShrink:0 }}>
        {WORKFLOW.map((w, i) => (
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <div style={{ width:"100%", height:4, borderRadius:2, transition:"background .3s",
              background:i < step ? T.green : i === step ? WORKFLOW[step].col : T.dim }}/>
            <span style={{ fontSize:9, fontWeight:700, color:i <= step ? WORKFLOW[step].col : T.sub }}>
              {w.em}
            </span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div style={{ height:200, position:"relative", margin:"0 16px",
        borderRadius:16, overflow:"hidden", flexShrink:0 }}>
        <MockMap showCar={step === 0} carPct={carPct}/>
        {step === 0 && (
          <div style={{ position:"absolute", bottom:12, left:"50%", transform:"translateX(-50%)" }}>
            <button onClick={() => setNavModal(true)}
              style={{ background:T.blue, color:"white", border:"none", borderRadius:20,
                padding:"9px 20px", fontSize:13, fontWeight:700, cursor:"pointer",
                fontFamily:T.f, boxShadow:`0 4px 16px ${T.blue}60` }}>
              🗺️ Open Navigation
            </button>
          </div>
        )}
      </div>

      {/* Job info */}
      <div style={{ flex:1, overflowY:"auto", padding:"12px 16px 0" }}>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontSize:16, fontWeight:800, color:T.text }}>Sarah M.</div>
            <span style={{ fontSize:18, fontWeight:900, color:T.green }}>$85.50</span>
          </div>
          {[
            { em:"✨", l:"Service",  v:"Full Mobile Detail" },
            { em:"📍", l:"Address",  v:"456 Oak Ave, Winnipeg" },
            { em:"🚗", l:"Vehicle",  v:"2021 Tesla Model 3" },
            { em:"⏱️", l:"Duration", v:"~90 minutes" },
          ].map(({ em, l, v }) => (
            <div key={l} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:16, width:22, flexShrink:0 }}>{em}</span>
              <div>
                <div style={{ fontSize:10, color:T.sub, fontWeight:600 }}>{l.toUpperCase()}</div>
                <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{v}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Main workflow button */}
      <div style={{ padding:"10px 16px 20px", flexShrink:0 }}>
        <BigBtn onClick={handleBtn} col={WORKFLOW[step].col}>
          {WORKFLOW[step].em} {WORKFLOW[step].label}
        </BigBtn>
      </div>

      {/* Navigation modal */}
      {navModal && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.75)",
          display:"flex", alignItems:"flex-end", zIndex:20 }}>
          <div style={{ width:"100%", background:T.surface,
            borderRadius:"24px 24px 0 0", padding:"20px 16px 32px" }}>
            <div style={{ fontSize:17, fontWeight:800, color:T.text, marginBottom:16 }}>
              Open navigation in...
            </div>
            {[
              { name:"Google Maps", em:"🗺️", col:"#4285F4" },
              { name:"Apple Maps",  em:"🍎", col:"#5E5CE6" },
              { name:"Waze",        em:"📡", col:"#33CCFF" },
            ].map(n => (
              <button key={n.name} onClick={() => { setNavModal(false); setStep(1); }}
                style={{ width:"100%", padding:"14px 16px", borderRadius:14, background:T.card,
                  border:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:14,
                  marginBottom:10, cursor:"pointer", fontFamily:T.f }}>
                <div style={{ width:42, height:42, borderRadius:12, background:`${n.col}20`,
                  border:`1px solid ${n.col}40`, display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:22 }}>{n.em}</div>
                <span style={{ fontSize:16, fontWeight:700, color:T.text }}>{n.name}</span>
                <span style={{ marginLeft:"auto", color:T.sub, fontSize:18 }}>›</span>
              </button>
            ))}
            <button onClick={() => setNavModal(false)}
              style={{ width:"100%", padding:"13px", borderRadius:12, background:T.dim,
                border:"none", color:T.sub, fontSize:14, fontWeight:600,
                cursor:"pointer", fontFamily:T.f }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════
   SCREEN 5 — EARNINGS
══════════════════════════════════════ */
const EarningsScreen = ({ go }) => {
  const [tab, setTab] = useState("week");
  const DATA = {
    day:   { gross:268.50, fee:26.85, net:241.65, jobs:3,  goal:300 },
    week:  { gross:1240.00,fee:124.00,net:1116.00,jobs:14, goal:1500 },
    month: { gross:4820.00,fee:482.00,net:4338.00,jobs:52, goal:5000 },
  };
  const d = DATA[tab];
  const goalPct = Math.min((d.net / d.goal) * 100, 100);

  const BARS = {
    day:   [["9A",95],["10A",0],["11A",0],["12P",55],["1P",0],["2P",118],["3P",0]],
    week:  [["M",120],["T",85],["W",0],["T",240],["F",180],["S",350],["S",265]],
    month: [["W1",820],["W2",1240],["W3",960],["W4",1800]],
  };
  const bars = BARS[tab];
  const maxBar = Math.max(...bars.map(b => b[1]), 1);

  const HISTORY = [
    { svc:"Full Mobile Detail", client:"Sarah M.",  earn:85.50,  date:"Today 10:00 AM" },
    { svc:"Ceramic Boost",      client:"James T.",  earn:133.50, date:"Yesterday 2:00 PM" },
    { svc:"Interior Detail",    client:"Emily R.",  earn:49.50,  date:"Jun 1 11:00 AM" },
    { svc:"Basic Wash",         client:"Priya K.",  earn:31.50,  date:"May 31 9:00 AM" },
  ];

  return (
    <div style={{ height:"100%", overflowY:"auto", background:T.bg }}>
      <div style={{ padding:"16px 16px 0" }}>
        <div style={{ fontSize:24, fontWeight:900, color:T.text }}>Earnings</div>
        <div style={{ fontSize:14, color:T.sub, marginTop:3 }}>Your income breakdown</div>
      </div>

      {/* Tabs */}
      <div style={{ padding:"12px 16px 0" }}>
        <div style={{ display:"flex", background:T.card, border:`1px solid ${T.border}`,
          borderRadius:12, padding:4, gap:2 }}>
          {["day","week","month"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex:1, padding:"9px 0", borderRadius:9, border:"none", cursor:"pointer",
                background:tab === t ? T.green : "transparent",
                color:tab === t ? "white" : T.sub,
                fontSize:13, fontWeight:700, fontFamily:T.f, transition:"all .2s" }}>
              {t === "day" ? "Today" : t === "week" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>
      </div>

      {/* Big net + goal */}
      <div style={{ padding:"18px 16px 0", textAlign:"center" }}>
        <div style={{ fontSize:13, color:T.sub, fontWeight:600, marginBottom:4 }}>NET EARNINGS</div>
        <div style={{ fontSize:54, fontWeight:900, color:T.green }}>${d.net.toFixed(2)}</div>
        <div style={{ fontSize:13, color:T.sub, marginTop:4 }}>
          {d.jobs} jobs · goal ${d.goal.toFixed(2)}
        </div>
        {/* Goal progress */}
        <div style={{ margin:"12px auto 0", maxWidth:280 }}>
          <div style={{ height:6, background:T.dim, borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", background:T.green, borderRadius:3,
              width:`${goalPct}%`, transition:"width .6s" }}/>
          </div>
          <div style={{ fontSize:11, color:T.sub, marginTop:4 }}>
            {goalPct.toFixed(0)}% of {tab} goal
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ padding:"16px 16px 0" }}>
        <Card style={{ padding:16 }}>
          <div style={{ fontSize:11, fontWeight:800, color:T.sub, letterSpacing:1, marginBottom:14 }}>
            {tab === "day" ? "HOURLY" : tab === "week" ? "DAILY" : "WEEKLY"} BREAKDOWN
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:80 }}>
            {bars.map(([label, val]) => (
              <div key={label} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ width:"100%", borderRadius:"4px 4px 0 0", minHeight:2,
                  height:val > 0 ? `${(val / maxBar) * 64}px` : "2px",
                  background:val > 0 ? T.green : T.dim, transition:"height .5s" }}/>
                <span style={{ fontSize:9, color:T.sub, fontWeight:600 }}>{label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Breakdown */}
      <div style={{ padding:"0 16px" }}>
        <Card>
          <SLabel>BREAKDOWN</SLabel>
          {[
            { l:"Gross Earnings",   v:`$${d.gross.toFixed(2)}`, col:T.text  },
            { l:"Platform Fee (10%)",v:`− $${d.fee.toFixed(2)}`,col:T.red   },
            { l:"Net Payout",       v:`$${d.net.toFixed(2)}`,  col:T.green, bold:true },
          ].map(({ l, v, col, bold }) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:bold ? 0 : 10,
              paddingBottom:bold ? 0 : 10,
              borderBottom:bold ? "none" : `1px solid ${T.border}` }}>
              <span style={{ fontSize:13, color:bold ? T.text : T.sub, fontWeight:bold ? 700 : 400 }}>{l}</span>
              <span style={{ fontSize:bold ? 22 : 14, fontWeight:bold ? 900 : 600, color:col }}>{v}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Payout button */}
      <div style={{ padding:"0 16px" }}>
        <button style={{ width:"100%", padding:"15px", borderRadius:14,
          background:`${T.green}15`, border:`1px solid ${T.green}40`,
          color:T.green, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:T.f }}>
          💳 Request Payout
        </button>
      </div>

      {/* History */}
      <div style={{ padding:"14px 16px" }}>
        <div style={{ fontSize:15, fontWeight:800, color:T.text, marginBottom:12 }}>Job History</div>
        {HISTORY.map((j, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12,
            padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ width:42, height:42, borderRadius:12, background:`${T.green}15`,
              border:`1px solid ${T.green}30`, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:18, flexShrink:0 }}>💵</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600, color:T.text }}>{j.svc}</div>
              <div style={{ fontSize:12, color:T.sub, marginTop:1 }}>{j.client} · {j.date}</div>
            </div>
            <span style={{ fontSize:15, fontWeight:800, color:T.green }}>+${j.earn.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div style={{ height:16 }}/>
    </div>
  );
};

/* ══════════════════════════════════════
   SCREEN 6 — SCHEDULE / CALENDAR
══════════════════════════════════════ */
const CalendarScreen = ({ go }) => {
  const [selDay, setSelDay] = useState("5");
  const days = [{n:"2",d:"M"},{n:"3",d:"T"},{n:"4",d:"W"},{n:"5",d:"T"},{n:"6",d:"F"},{n:"7",d:"S"},{n:"8",d:"S"}];
  const pending = SCHEDULED.filter(j => j.st === "Pending");
  const todayJobs = SCHEDULED.filter(j => j.date.includes(`Jun ${selDay}`));

  return (
    <div style={{ height:"100%", overflowY:"auto", background:T.bg }}>
      <div style={{ padding:"16px 16px 0" }}>
        <div style={{ fontSize:24, fontWeight:900, color:T.text }}>Schedule</div>
        <div style={{ fontSize:14, color:T.sub, marginTop:3 }}>Your upcoming appointments</div>
      </div>

      {/* Pending requests banner */}
      {pending.length > 0 && (
        <div style={{ padding:"14px 16px 0" }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.sub, marginBottom:8 }}>
            ⏳ PENDING REQUESTS
          </div>
          {pending.map(j => (
            <div key={j.id} onClick={() => go("request_scheduled")}
              style={{ background:`${T.purple}10`, border:`1px solid ${T.purple}40`,
                borderRadius:14, padding:"12px 14px", marginBottom:8, cursor:"pointer",
                display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:`${T.purple}20`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:20, flexShrink:0 }}>🗓️</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.purple }}>New Scheduled Request</div>
                <div style={{ fontSize:12, color:T.sub, marginTop:2 }}>
                  {j.svc} · {j.date} · {j.time} · ${j.earn.toFixed(2)}
                </div>
              </div>
              <span style={{ color:T.sub, fontSize:16 }}>›</span>
            </div>
          ))}
        </div>
      )}

      {/* Weekly calendar */}
      <div style={{ margin:"14px 16px 0", background:T.card,
        border:`1px solid ${T.border}`, borderRadius:18, padding:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontSize:16, fontWeight:800, color:T.text }}>June 2025</span>
          <div style={{ display:"flex", gap:4 }}>
            {["‹","›"].map(a => (
              <button key={a} style={{ width:28, height:28, borderRadius:8, background:T.dim,
                border:"none", color:T.text, cursor:"pointer", fontSize:14, fontFamily:T.f }}>{a}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {days.map(({ n, d }) => {
            const sel = selDay === n;
            const has = SCHEDULED.some(j => j.date.includes(`Jun ${n}`));
            const hasPending = SCHEDULED.some(j => j.date.includes(`Jun ${n}`) && j.st === "Pending");
            return (
              <div key={n} onClick={() => setSelDay(n)}
                style={{ flex:1, padding:"9px 4px", borderRadius:12, textAlign:"center",
                  background:sel ? T.green : has ? `${T.green}12` : T.dim,
                  border:`1px solid ${sel ? T.green : has ? `${T.green}35` : T.border}`,
                  cursor:"pointer", transition:"all .2s" }}>
                <div style={{ fontSize:9, fontWeight:700, color:sel ? "rgba(255,255,255,0.7)" : T.sub }}>{d}</div>
                <div style={{ fontSize:18, fontWeight:900, color:sel ? "white" : T.text, margin:"2px 0" }}>{n}</div>
                {has && !sel && (
                  <div style={{ width:5, height:5, borderRadius:"50%", margin:"2px auto 0",
                    background:hasPending ? T.amber : T.green }}/>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Jobs for selected day */}
      <div style={{ padding:"14px 16px" }}>
        <div style={{ fontSize:15, fontWeight:800, color:T.text, marginBottom:12 }}>
          Jun {selDay} · {todayJobs.length} appointment{todayJobs.length !== 1 ? "s" : ""}
        </div>
        {todayJobs.length > 0 ? todayJobs.map(j => (
          <div key={j.id} style={{ background:T.card, border:`1px solid ${T.border}`,
            borderRadius:16, padding:14, marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"flex-start", marginBottom:8 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:T.text }}>{j.svc}</div>
                <div style={{ fontSize:12, color:T.sub, marginTop:2 }}>👤 {j.client}</div>
                <div style={{ fontSize:12, color:T.sub }}>📍 {j.addr} · {j.dist}</div>
              </div>
              <StatusPill st={j.st} col={j.col}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12, color:T.sub }}>⏰ {j.time}</span>
              <span style={{ fontSize:16, fontWeight:800, color:T.green }}>+${j.earn.toFixed(2)}</span>
            </div>
            {j.st === "Confirmed" && (
              <button onClick={() => go("active_job")}
                style={{ marginTop:10, width:"100%", padding:"9px", borderRadius:10,
                  background:`${T.green}12`, border:`1px solid ${T.green}35`,
                  color:T.green, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:T.f }}>
                Start Job →
              </button>
            )}
          </div>
        )) : (
          <div style={{ textAlign:"center", color:T.sub, fontSize:14, padding:"24px 0" }}>
            No appointments for this day
          </div>
        )}

        {/* Block time */}
        <button style={{ width:"100%", padding:"13px", borderRadius:12, background:T.dim,
          border:`1px solid ${T.border}`, color:T.sub, fontSize:14,
          fontWeight:600, cursor:"pointer", fontFamily:T.f }}>
          + Block Off Time Slot
        </button>
      </div>
      <div style={{ height:16 }}/>
    </div>
  );
};

/* ══════════════════════════════════════
   SCREEN 7 — AVAILABILITY SETTINGS
══════════════════════════════════════ */
const AvailabilityScreen = ({ go }) => {
  const [days, setDays] = useState(AVAIL_INIT.map(d => ({ ...d })));
  const toggle = i => setDays(ds => ds.map((d, j) => j === i ? { ...d, on:!d.on } : d));

  return (
    <div style={{ height:"100%", overflowY:"auto", background:T.bg }}>
      <div style={{ padding:"14px 16px 0", display:"flex", alignItems:"center", gap:12 }}>
        <BackBtn onClick={() => go("account")}/>
        <div>
          <div style={{ fontSize:20, fontWeight:800, color:T.text }}>Availability</div>
          <div style={{ fontSize:13, color:T.sub }}>Set your working hours</div>
        </div>
      </div>

      <div style={{ margin:"12px 16px 0", background:`${T.green}08`,
        border:`1px solid ${T.green}25`, borderRadius:12, padding:"12px 14px",
        fontSize:13, color:T.sub, lineHeight:1.6 }}>
        ℹ️ Clients searching for a <strong style={{ color:T.text }}>specific time slot</strong> will only
        see you if that slot falls within your available hours. You can always block
        individual times in your <span onClick={() => go("calendar")}
          style={{ color:T.green, cursor:"pointer", fontWeight:700 }}>calendar</span>.
      </div>

      <div style={{ padding:"12px 16px" }}>
        {days.map((d, i) => (
          <div key={d.d} style={{ background:T.card,
            border:`1px solid ${d.on ? T.green + "40" : T.border}`,
            borderRadius:14, padding:"14px 16px", marginBottom:10, transition:"all .25s" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                {/* Toggle switch */}
                <div onClick={() => toggle(i)}
                  style={{ width:48, height:27, borderRadius:14, cursor:"pointer",
                    background:d.on ? T.green : T.dim, position:"relative",
                    transition:"background .25s", flexShrink:0 }}>
                  <div style={{ position:"absolute", top:3.5, width:20, height:20,
                    borderRadius:"50%", background:"white", transition:"left .25s",
                    left:d.on ? "calc(100% - 23px)" : 3,
                    boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }}/>
                </div>
                <span style={{ fontSize:15, fontWeight:700,
                  color:d.on ? T.text : T.sub, transition:"color .25s" }}>{d.d}</span>
              </div>
              <div style={{ textAlign:"right" }}>
                {d.on ? (
                  <span style={{ fontSize:12, color:T.green, fontWeight:700 }}>
                    {d.start} — {d.end}
                  </span>
                ) : (
                  <span style={{ fontSize:12, color:T.sub }}>Unavailable</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding:"0 16px 20px" }}>
        <BigBtn onClick={() => go("account")}>Save Availability</BigBtn>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   SCREEN 8 — ACCOUNT
══════════════════════════════════════ */
const AccountScreen = ({ go }) => {
  const items = [
    { em:"👤", l:"Edit Profile",       sub:"Name, photo, bio"                           },
    { em:"⚙️", l:"Availability",       sub:"Set your working hours",      to:"availability" },
    { em:"🛠️", l:"Services Offered",   sub:"Detailing services you provide"             },
    { em:"📍", l:"Service Radius",     sub:"How far you'll travel for jobs"             },
    { em:"💳", l:"Payout Settings",    sub:"Bank account, Stripe, tax info"             },
    { em:"⭐", l:"Reviews & Ratings",  sub:"See feedback from clients"                  },
    { em:"🔔", l:"Notifications",      sub:"Requests, reminders, alerts"                },
    { em:"🚪", l:"Logout",             sub:"Sign out of your account",     red:true      },
  ];

  return (
    <div style={{ height:"100%", overflowY:"auto", background:T.bg }}>
      {/* Profile header */}
      <div style={{ background:"linear-gradient(180deg,#091A11 0%,#07080F 100%)", padding:"20px 16px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:18 }}>
          <div style={{ position:"relative" }}>
            <div style={{ width:70, height:70, borderRadius:"50%", background:`${T.green}18`,
              border:`3px solid ${T.green}40`, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:30 }}>🧑‍🔧</div>
            <div style={{ position:"absolute", bottom:2, right:2, width:16, height:16,
              borderRadius:"50%", background:T.green, border:`2px solid ${T.bg}` }}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:22, fontWeight:900, color:T.text }}>Marcus K.</div>
            <div style={{ fontSize:13, color:T.sub, marginTop:2 }}>marcus@detailr.ca</div>
            <div style={{ display:"flex", gap:6, marginTop:7 }}>
              <span style={{ fontSize:11, background:`${T.green}18`, color:T.green,
                padding:"3px 9px", borderRadius:20, fontWeight:700 }}>✓ Verified Pro</span>
              <span style={{ fontSize:11, background:"rgba(245,166,35,0.15)", color:T.amber,
                padding:"3px 9px", borderRadius:20, fontWeight:700 }}>⭐ 4.9</span>
            </div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {[{ v:"203", l:"Total Jobs" },{ v:"$4,820", l:"This Month" },{ v:"4.9★", l:"Rating" }].map(({ v, l }) => (
            <div key={l} style={{ background:T.card, border:`1px solid ${T.border}`,
              borderRadius:12, padding:"10px 8px", textAlign:"center" }}>
              <div style={{ fontSize:18, fontWeight:900, color:T.text }}>{v}</div>
              <div style={{ fontSize:11, color:T.sub, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"8px 16px" }}>
        {items.map((item, i) => (
          <div key={i} onClick={() => item.to && go(item.to)}
            style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 0",
              borderBottom:i < items.length - 1 ? `1px solid ${T.border}` : "none",
              cursor:item.to || item.red ? "pointer" : "default" }}>
            <div style={{ width:42, height:42, borderRadius:13, flexShrink:0,
              background:item.red ? "#EF444415" : T.card,
              border:`1px solid ${item.red ? "#EF444330" : T.border}`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
              {item.em}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:600, color:item.red ? "#EF4444" : T.text }}>
                {item.l}
              </div>
              <div style={{ fontSize:12, color:T.sub, marginTop:1 }}>{item.sub}</div>
            </div>
            {!item.red && <span style={{ color:T.sub, fontSize:18 }}>›</span>}
          </div>
        ))}
      </div>
      <div style={{ height:16 }}/>
    </div>
  );
};

/* ══════════════════════════════════════
   ROOT APP
══════════════════════════════════════ */
export default function DetailerApp() {
  const [screen, setScreen] = useState("dashboard");
  const [tab, setTab]       = useState("dashboard");
  const [online, setOnline] = useState(false);

  const MAIN_TABS = ["dashboard","calendar","earnings","account"];

  const go = s => {
    setScreen(s);
    if (MAIN_TABS.includes(s)) setTab(s);
  };

  const showNav = MAIN_TABS.includes(screen);

  const screens = {
    dashboard:          <DashboardScreen        go={go} online={online} setOnline={setOnline}/>,
    request_now:        <RequestNowScreen        go={go} onAccept={() => {}}/>,
    request_scheduled:  <RequestScheduledScreen  go={go}/>,
    active_job:         <ActiveJobScreen         go={go}/>,
    earnings:           <EarningsScreen          go={go}/>,
    calendar:           <CalendarScreen          go={go}/>,
    availability:       <AvailabilityScreen      go={go}/>,
    account:            <AccountScreen           go={go}/>,
  };

  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start",
      minHeight:"100vh", background:"#040508", fontFamily:T.f, padding:"24px 0 40px" }}>

      <div style={{ position:"relative" }}>
        {/* Glow — green tint for detailer */}
        <div style={{ position:"absolute", inset:-40, borderRadius:80, pointerEvents:"none",
          background:`radial-gradient(ellipse at center,${online ? "rgba(0,200,150,0.14)" : "rgba(0,200,150,0.06)"} 0%,transparent 70%)`,
          transition:"background .5s" }}/>

        {/* Phone */}
        <div style={{ width:390, height:844, background:T.bg, borderRadius:44, overflow:"hidden",
          position:"relative", display:"flex", flexDirection:"column",
          boxShadow:"0 70px 140px rgba(0,0,0,0.95),inset 0 0 0 1.5px rgba(255,255,255,0.07)" }}>

          <StatusBar online={online}/>

          <div style={{ flex:1, overflow:"hidden", position:"relative" }}>
            {screens[screen]}
          </div>

          {showNav && <BottomNav tab={tab} onTab={t => { setTab(t); go(t); }}/>}
        </div>
      </div>
    </div>
  );
}
