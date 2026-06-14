import { useState, useEffect, useRef } from "react";

/* ─── Google Font injection ─── */
if (!document.getElementById("outfit-font")) {
  const l = document.createElement("link");
  l.id = "outfit-font";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap";
  document.head.appendChild(l);
  const s = document.createElement("style");
  s.textContent = `*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}::-webkit-scrollbar{display:none}input,button,textarea{font-family:'Outfit',sans-serif}`;
  document.head.appendChild(s);
}

/* ─── Design tokens ─── */
const T = {
  bg: "#07080F", surface: "#0D0F1A", card: "#111420", card2: "#141828",
  border: "rgba(255,255,255,0.07)", blue: "#4F8EF7", teal: "#00C896",
  amber: "#F5A623", red: "#EF4444", purple: "#8B5CF6", orange: "#F97316",
  text: "#EEF2FF", sub: "#6B7591", dim: "#161926", f: "'Outfit',sans-serif",
};

/* ─── Mock data ─── */
const DT = [
  { id:1, name:"FreshRide Detail",   rating:4.9, jobs:120, eta:"12 min", dist:"1.2 km", price:95,  badge:true,  av:"FR", col:"#4F8EF7", px:"28%", py:"38%" },
  { id:2, name:"AutoSpark Pro",      rating:4.8, jobs:87,  eta:"18 min", dist:"2.1 km", price:85,  badge:true,  av:"AS", col:"#10B981", px:"65%", py:"54%" },
  { id:3, name:"ShineKing Mobile",   rating:4.7, jobs:203, eta:"25 min", dist:"3.4 km", price:75,  badge:false, av:"SK", col:"#F97316", px:"53%", py:"22%" },
];
const SV = [
  { id:1, name:"Basic Mobile Wash",  price:35,  dur:"45 min", em:"🚿", items:["Exterior hand wash","Wheel cleaning","Tire shine"],       col:"#4F8EF7" },
  { id:2, name:"Interior Detail",    price:55,  dur:"60 min", em:"🪑", items:["Vacuum","Dashboard cleaning","Window cleaning"],           col:"#8B5CF6" },
  { id:3, name:"Full Mobile Detail", price:95,  dur:"90 min", em:"✨", items:["Interior detail","Exterior detail","Wax"],                col:"#10B981", hot:true },
  { id:4, name:"Ceramic Boost",      price:149, dur:"2 hrs",  em:"💎", items:["Paint prep","Ceramic protection"],                        col:"#F5A623" },
];
const BK = [
  { svc:"Full Mobile Detail", det:"FreshRide Detail",  date:"Jun 5",  time:"10:00 AM", car:"2021 Tesla Model 3", st:"Confirmed" },
  { svc:"Interior Detail",    det:"AutoSpark Pro",     date:"Jun 10", time:"2:00 PM",  car:"2020 BMW X5",        st:"Upcoming"  },
  { svc:"Basic Wash",         det:"ShineKing Mobile",  date:"May 28", time:"11:00 AM", car:"2021 Tesla Model 3", st:"Completed" },
];
const MG = [
  { id:1, name:"FreshRide Detail",  av:"FR", col:"#4F8EF7", last:"I'll arrive in around 10 minutes.", time:"2m",  unread:2 },
  { id:2, name:"AutoSpark Pro",     av:"AS", col:"#10B981", last:"Your booking is confirmed for tomorrow!", time:"1h", unread:0 },
  { id:3, name:"ShineKing Mobile",  av:"SK", col:"#F97316", last:"Job complete! Hope you enjoy the shine 🌟", time:"2d", unread:0 },
];
const TIMES = ["9:00 AM","10:30 AM","12:00 PM","1:30 PM","3:00 PM","4:30 PM"];
const DATES = [{n:"2",d:"Mon"},{n:"3",d:"Tue"},{n:"4",d:"Wed"},{n:"5",d:"Thu"},{n:"6",d:"Fri"},{n:"7",d:"Sat"},{n:"8",d:"Sun"}];

/* ─── Reusable atoms ─── */
const Av = ({ av, col, sz = 44 }) => (
  <div style={{ width:sz, height:sz, borderRadius:"50%", background:`${col}20`, border:`2px solid ${col}40`,
    display:"flex", alignItems:"center", justifyContent:"center", color:col,
    fontWeight:700, fontSize:Math.round(sz * 0.34), flexShrink:0 }}>
    {av}
  </div>
);

const StatusPill = ({ st }) => {
  const m = { Confirmed:"#00C896", Upcoming:"#4F8EF7", Completed:"#6B7591", "In Progress":"#F5A623", "Reminder Set":"#8B5CF6" };
  const c = m[st] || "#4F8EF7";
  return <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:`${c}20`, color:c }}>{st}</span>;
};

const PrimaryBtn = ({ children, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ width:"100%", padding:"15px", borderRadius:14, background:disabled ? T.dim : T.blue,
      color:disabled ? T.sub : "white", border:"none", fontSize:16, fontWeight:700,
      cursor:disabled ? "default" : "pointer", fontFamily:T.f, opacity:disabled ? 0.65 : 1 }}>
    {children}
  </button>
);

const GhostBtn = ({ children, onClick }) => (
  <button onClick={onClick}
    style={{ width:"100%", padding:"14px", borderRadius:14, background:T.dim, color:T.text,
      border:"none", fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:T.f }}>
    {children}
  </button>
);

const BackBtn = ({ onClick }) => (
  <button onClick={onClick}
    style={{ width:38, height:38, borderRadius:12, background:T.card, border:`1px solid ${T.border}`,
      display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
      color:T.text, fontSize:22, lineHeight:1, flexShrink:0 }}>
    ‹
  </button>
);

const SectionLabel = ({ children }) => (
  <div style={{ fontSize:11, fontWeight:800, color:T.sub, letterSpacing:1, marginBottom:12 }}>{children}</div>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18,
    padding:16, marginBottom:12, ...style }}>
    {children}
  </div>
);

/* ─── Mock map (SVG city grid) ─── */
const MockMap = ({ onPin, selPin }) => {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 60); return () => clearInterval(id); }, []);
  const r = (tick % 100) / 100;
  const roads = [[14,86,158,232], [112,213,317]];

  return (
    <div style={{ position:"relative", width:"100%", height:"100%", overflow:"hidden", background:"#141824" }}>
      <svg style={{ position:"absolute", inset:0 }} width="100%" height="100%" viewBox="0 0 390 265" preserveAspectRatio="none">
        <rect width="390" height="265" fill="#141824"/>
        {/* Blocks */}
        {[[18,18,86,52],[120,18,82,52],[218,18,88,52],[322,18,62,52],
          [18,90,86,52],[120,90,82,52],[218,90,88,52],[322,90,62,52],
          [18,162,86,52],[120,162,82,52],[218,162,88,52],[322,162,62,52]].map(([x,y,w,h],i)=>(
          <rect key={i} x={x} y={y} width={w} height={h} fill="#1A2035" rx="3"/>
        ))}
        {/* Horizontal roads */}
        {[14,86,158,230].map((y,i) => <rect key={i} x="0" y={y} width="390" height="7" fill="#1D2540"/>)}
        {/* Vertical roads */}
        {[112,212,316].map((x,i) => <rect key={i} x={x} y="0" width="8" height="265" fill="#1D2540"/>)}
        {/* Dashes */}
        {[14,86,158].map((y,i) =>
          [25,65,105,145,185,225,265,305,345].map((x,j) => (
            <rect key={`${i}${j}`} x={x} y={y+3} width="16" height="1.5" fill="#263050" opacity="0.6"/>
          ))
        )}
        {/* Green */}
        <rect x="125" y="94" width="78" height="46" fill="#182D1F" rx="4"/>
        <rect x="222" y="166" width="82" height="44" fill="#182D1F" rx="4"/>
        <circle cx="155" cy="115" r="14" fill="#1C3526"/>
        <circle cx="172" cy="126" r="9" fill="#1C3526"/>
        <circle cx="254" cy="188" r="11" fill="#1C3526"/>
        <circle cx="270" cy="181" r="7" fill="#1C3526"/>
      </svg>

      {/* User pulse */}
      <div style={{ position:"absolute", left:"50%", top:"59%", transform:"translate(-50%,-50%)", zIndex:3 }}>
        <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)",
          width:14+r*36, height:14+r*36, borderRadius:"50%",
          background:`rgba(79,142,247,${0.15-r*0.12})`, transition:"none" }}/>
        <div style={{ width:14, height:14, borderRadius:"50%", background:"#4F8EF7",
          border:"3px solid white", boxShadow:"0 2px 12px rgba(79,142,247,0.9)", position:"relative" }}/>
      </div>

      {/* Detailer pins */}
      {DT.map(d => (
        <div key={d.id} onClick={() => onPin(d)}
          style={{ position:"absolute", left:d.px, top:d.py, transform:"translate(-50%,-100%)", cursor:"pointer", zIndex:4 }}>
          <div style={{
            background: selPin?.id === d.id ? d.col : "rgba(18,22,36,0.95)",
            border:`2px solid ${d.col}`, borderRadius:"12px 12px 12px 2px",
            padding:"5px 10px", display:"flex", alignItems:"center", gap:5,
            boxShadow: selPin?.id === d.id ? `0 6px 20px ${d.col}60` : "0 2px 10px rgba(0,0,0,0.5)",
            transition:"all .25s",
          }}>
            <span style={{ fontSize:13 }}>🚐</span>
            <span style={{ fontSize:11, fontWeight:800, color: selPin?.id === d.id ? "white" : d.col, whiteSpace:"nowrap" }}>{d.eta}</span>
          </div>
          <div style={{ width:2, height:7, background:d.col, margin:"0 auto" }}/>
          <div style={{ width:5, height:5, borderRadius:"50%", background:d.col, margin:"0 auto" }}/>
        </div>
      ))}

      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:70,
        background:`linear-gradient(transparent,${T.bg})`, pointerEvents:"none" }}/>
    </div>
  );
};

/* ─── Bottom navigation ─── */
const NAV = [
  { id:"home",     label:"Home",     fill:true,  path:"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" },
  { id:"book",     label:"Book",     fill:false, path:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id:"messages", label:"Messages", fill:false, path:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" },
  { id:"bookings", label:"Bookings", fill:false, path:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { id:"account",  label:"Account",  fill:false, path:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M16 7a4 4 0 11-8 0 4 4 0 018 0z" },
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
            color:active ? T.blue : T.sub, fontFamily:T.f, transition:"color .2s" }}>
          <svg width="22" height="22" viewBox="0 0 24 24"
            fill={n.fill && active ? T.blue : "none"}
            stroke={active ? T.blue : T.sub} strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round">
            <path d={n.path}/>
          </svg>
          <span style={{ fontSize:10, fontWeight:active ? 700 : 500 }}>{n.label}</span>
          {active && <div style={{ width:4, height:4, borderRadius:"50%", background:T.blue, marginTop:-2 }}/>}
        </button>
      );
    })}
  </div>
);

/* ═══════════════════════════════════════
   SCREEN 1 — HOME
═══════════════════════════════════════ */
const HomeScreen = ({ go, setSvc }) => {
  const [pin, setPin] = useState(null);

  return (
    <div style={{ height:"100%", overflowY:"auto", background:T.bg }}>
      {/* Map */}
      <div style={{ height:265, position:"relative", flexShrink:0 }}>
        <MockMap onPin={p => setPin(prev => prev?.id === p.id ? null : p)} selPin={pin}/>

        {/* Map top bar */}
        <div style={{ position:"absolute", top:10, left:16, right:16,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ background:"rgba(7,8,15,0.82)", backdropFilter:"blur(10px)",
            borderRadius:12, padding:"7px 12px", border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", fontWeight:600 }}>YOUR LOCATION</div>
            <div style={{ fontSize:13, color:"white", fontWeight:700 }}>📍 123 Main Street, Winnipeg</div>
          </div>
          <button style={{ width:40, height:40, borderRadius:12, background:"rgba(7,8,15,0.82)",
            backdropFilter:"blur(10px)", border:`1px solid ${T.border}`,
            display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:18 }}>
            🔔
          </button>
        </div>

        {/* Book Nearby */}
        <div style={{ position:"absolute", bottom:18, left:"50%", transform:"translateX(-50%)" }}>
          <button onClick={() => go("book")} style={{ background:T.blue, color:"white", border:"none",
            borderRadius:20, padding:"10px 24px", fontSize:14, fontWeight:700, fontFamily:T.f,
            boxShadow:`0 4px 20px rgba(79,142,247,0.55)`, cursor:"pointer" }}>
            📍 Book Nearby
          </button>
        </div>

        {/* Pin popup */}
        {pin && (
          <div style={{ position:"absolute", bottom:58, left:12, right:12, zIndex:10,
            background:"rgba(13,15,26,0.96)", backdropFilter:"blur(16px)",
            borderRadius:16, padding:"12px 14px", border:`1px solid ${pin.col}40`,
            display:"flex", alignItems:"center", gap:10 }}>
            <Av av={pin.av} col={pin.col} sz={42}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:T.text }}>{pin.name}</div>
              <div style={{ fontSize:12, color:T.sub }}>⭐ {pin.rating} · {pin.dist} · ETA {pin.eta}</div>
            </div>
            <button onClick={() => go("book")} style={{ background:T.blue, color:"white",
              border:"none", borderRadius:10, padding:"8px 14px", fontSize:13,
              fontWeight:700, cursor:"pointer", fontFamily:T.f }}>Book</button>
            <button onClick={() => setPin(null)} style={{ background:"none", border:"none",
              color:T.sub, cursor:"pointer", fontSize:22, padding:0, lineHeight:1 }}>×</button>
          </div>
        )}
      </div>

      {/* Search */}
      <div style={{ padding:"14px 16px 0" }}>
        <div onClick={() => go("book")} style={{ background:T.card, border:`1px solid ${T.border}`,
          borderRadius:14, padding:"13px 16px", display:"flex", alignItems:"center",
          gap:10, cursor:"pointer" }}>
          <span style={{ fontSize:16 }}>🔍</span>
          <span style={{ color:T.sub, fontSize:15 }}>Where do you need detailing?</span>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ padding:"14px 16px 0" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
          {[["✨","Services","service"],["📅","Book","book"],["💬","Messages","messages"],["💳","Wallet","account"]].map(([em,l,to]) => (
            <button key={l} onClick={() => go(to)}
              style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14,
                padding:"14px 8px", display:"flex", flexDirection:"column",
                alignItems:"center", gap:7, cursor:"pointer" }}>
              <span style={{ fontSize:24 }}>{em}</span>
              <span style={{ fontSize:11, fontWeight:600, color:T.sub }}>{l}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Promo */}
      <div style={{ margin:"14px 16px 0", background:"linear-gradient(135deg,#1A2744,#0F1628)",
        border:`1px solid rgba(79,142,247,0.25)`, borderRadius:18, padding:"16px 18px",
        display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:11, color:T.blue, fontWeight:700, letterSpacing:.5, marginBottom:4 }}>🎉 NEW USER OFFER</div>
          <div style={{ fontSize:18, fontWeight:800, color:T.text, lineHeight:1.3 }}>20% off your<br/>first detail!</div>
          <button onClick={() => go("book")} style={{ marginTop:10, background:T.blue, color:"white",
            border:"none", borderRadius:10, padding:"8px 16px", fontSize:13, fontWeight:700,
            cursor:"pointer", fontFamily:T.f }}>Book Now</button>
        </div>
        <div style={{ fontSize:60, lineHeight:1 }}>🚗</div>
      </div>

      {/* Nearby list */}
      <div style={{ padding:"16px 16px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontSize:17, fontWeight:800, color:T.text }}>Nearby Detailers</span>
          <span onClick={() => go("book")} style={{ fontSize:13, color:T.blue, cursor:"pointer", fontWeight:600 }}>See all →</span>
        </div>
        {DT.map(d => (
          <div key={d.id} onClick={() => go("book")}
            style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16,
              padding:14, marginBottom:10, display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
            <Av av={d.av} col={d.col} sz={50}/>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:15, fontWeight:700, color:T.text }}>{d.name}</span>
                {d.badge && <span style={{ fontSize:10, background:`${T.blue}18`, color:T.blue, padding:"2px 7px", borderRadius:20, fontWeight:700 }}>✓ Pro</span>}
              </div>
              <div style={{ fontSize:12, color:T.sub, marginTop:3 }}>⭐ {d.rating} · {d.jobs} jobs</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.text }}>{d.eta}</div>
              <div style={{ fontSize:11, color:T.sub, marginTop:2 }}>{d.dist}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height:16 }}/>
    </div>
  );
};

/* ═══════════════════════════════════════
   SCREEN 2 — SERVICES
═══════════════════════════════════════ */
const ServiceScreen = ({ go, svc, setSvc }) => (
  <div style={{ height:"100%", overflowY:"auto", background:T.bg }}>
    <div style={{ padding:"14px 16px 0", display:"flex", alignItems:"center", gap:12 }}>
      <BackBtn onClick={() => go("home")}/>
      <div>
        <div style={{ fontSize:22, fontWeight:800, color:T.text }}>Services</div>
        <div style={{ fontSize:13, color:T.sub }}>Select a service to book</div>
      </div>
    </div>
    <div style={{ padding:"12px 16px" }}>
      {SV.map(s => {
        const sel = svc?.id === s.id;
        return (
          <div key={s.id} onClick={() => setSvc(sel ? null : s)}
            style={{ background:sel ? `${s.col}12` : T.card, border:`1.5px solid ${sel ? s.col : T.border}`,
              borderRadius:18, padding:16, marginBottom:12, cursor:"pointer", transition:"all .2s" }}>
            {s.hot && <div style={{ fontSize:10, fontWeight:800, color:"#F97316", marginBottom:8, letterSpacing:.5 }}>🔥 MOST POPULAR</div>}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ width:52, height:52, borderRadius:15, background:`${s.col}18`,
                  border:`1px solid ${s.col}30`, display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:26 }}>{s.em}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:T.text }}>{s.name}</div>
                  <div style={{ fontSize:12, color:T.sub, marginTop:2 }}>⏱ {s.dur}</div>
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:22, fontWeight:900, color:sel ? s.col : T.text }}>${s.price}</div>
                {sel && <div style={{ fontSize:11, color:s.col, fontWeight:700 }}>✓ Selected</div>}
              </div>
            </div>
            <div style={{ marginTop:12, display:"flex", flexWrap:"wrap", gap:6 }}>
              {s.items.map(it => (
                <span key={it} style={{ fontSize:11, padding:"4px 10px", borderRadius:20,
                  background:sel ? `${s.col}15` : T.dim, color:sel ? s.col : T.sub }}>✓ {it}</span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
    <div style={{ padding:"0 16px 20px" }}>
      <PrimaryBtn onClick={() => svc && go("book")} disabled={!svc}>
        {svc ? `Book ${svc.name} — $${svc.price}` : "Select a service to continue"}
      </PrimaryBtn>
    </div>
  </div>
);

/* ═══════════════════════════════════════
   SCREEN 3 — BOOK (4 steps)
═══════════════════════════════════════ */
const BookScreen = ({ go, svc, setConfirmData }) => {
  const [step, setStep] = useState(0);
  const [det, setDet] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [yr, setYr] = useState("2021");
  const [mk, setMk] = useState("Tesla");
  const [mo, setMo] = useState("Model 3");

  const service = svc || SV[2];
  const fee = 3.99;
  const total = (service.price + fee).toFixed(2);
  const STEPS = ["Detailer", "Schedule", "Vehicle", "Summary"];
  const canGo = (step === 0 && det) || (step === 1 && date && time) || step === 2 || step === 3;

  const next = () => {
    if (step < 3) { setStep(step + 1); return; }
    setConfirmData({ service, det, date, time, vehicle:`${yr} ${mk} ${mo}`, total });
    go("confirmation");
  };

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:T.bg }}>
      {/* Header */}
      <div style={{ padding:"14px 16px 0", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
          <BackBtn onClick={() => step > 0 ? setStep(step - 1) : go("home")}/>
          <div style={{ fontSize:20, fontWeight:800, color:T.text }}>Book a Detailer</div>
        </div>
        {/* Step progress */}
        <div style={{ display:"flex", gap:4 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <div style={{ width:"100%", height:3, borderRadius:2,
                background:i < step ? T.teal : i === step ? T.blue : T.dim, transition:"background .3s" }}/>
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:.5,
                color:i <= step ? T.blue : T.sub }}>{s.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Service pill */}
      <div style={{ margin:"10px 16px 0", background:`${service.col}12`,
        border:`1px solid ${service.col}35`, borderRadius:10, padding:"8px 12px",
        display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
        <span style={{ fontSize:16 }}>{service.em}</span>
        <span style={{ fontSize:13, fontWeight:700, color:service.col }}>{service.name}</span>
        <div style={{ flex:1 }}/>
        <span style={{ fontSize:14, fontWeight:800, color:service.col }}>${service.price}</span>
        <button onClick={() => go("service")} style={{ fontSize:11, color:T.sub, background:"none",
          border:"none", cursor:"pointer", fontFamily:T.f }}>Change</button>
      </div>

      {/* Step content */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 16px" }}>

        {/* Step 0: Detailer */}
        {step === 0 && DT.map(d => {
          const sel = det?.id === d.id;
          return (
            <div key={d.id} onClick={() => setDet(d)}
              style={{ background:sel ? `${d.col}10` : T.card, border:`1.5px solid ${sel ? d.col : T.border}`,
                borderRadius:16, padding:14, marginBottom:10, cursor:"pointer", transition:"all .2s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <Av av={d.av} col={d.col} sz={54}/>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:15, fontWeight:700, color:T.text }}>{d.name}</span>
                    {d.badge && <span style={{ fontSize:13 }}>✅</span>}
                  </div>
                  <div style={{ fontSize:12, color:T.sub, marginTop:3 }}>⭐ {d.rating} · {d.jobs} jobs</div>
                  <div style={{ fontSize:12, color:T.sub }}>📍 {d.dist} · ETA {d.eta}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:20, fontWeight:900, color:sel ? d.col : T.text }}>${d.price}</div>
                  <div style={{ fontSize:10, color:T.sub }}>from</div>
                  {sel && (
                    <div style={{ width:22, height:22, borderRadius:"50%", background:d.col,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:12, color:"white", marginTop:4, marginLeft:"auto" }}>✓</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Step 1: Schedule */}
        {step === 1 && (
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:T.text, marginBottom:10 }}>Select Date</div>
            <div style={{ display:"flex", gap:8, marginBottom:18, overflowX:"auto", paddingBottom:4 }}>
              {DATES.map(({ n, d }) => {
                const sel = date === `Jun ${n}`;
                return (
                  <div key={n} onClick={() => setDate(`Jun ${n}`)}
                    style={{ minWidth:50, padding:"10px 6px", borderRadius:12, textAlign:"center",
                      background:sel ? T.blue : T.card, border:`1px solid ${sel ? T.blue : T.border}`,
                      cursor:"pointer", transition:"all .2s" }}>
                    <div style={{ fontSize:10, color:sel ? "rgba(255,255,255,0.7)" : T.sub, fontWeight:700 }}>{d}</div>
                    <div style={{ fontSize:20, fontWeight:900, color:sel ? "white" : T.text, margin:"2px 0" }}>{n}</div>
                    <div style={{ fontSize:10, color:sel ? "rgba(255,255,255,0.6)" : T.sub }}>Jun</div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize:15, fontWeight:700, color:T.text, marginBottom:10 }}>Select Time</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
              {TIMES.map(t => {
                const sel = time === t;
                return (
                  <div key={t} onClick={() => setTime(t)}
                    style={{ padding:"12px 8px", borderRadius:12, textAlign:"center",
                      background:sel ? T.blue : T.card, border:`1px solid ${sel ? T.blue : T.border}`,
                      cursor:"pointer", fontSize:13, fontWeight:700,
                      color:sel ? "white" : T.text, transition:"all .2s" }}>
                    {t}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Vehicle */}
        {step === 2 && (
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:T.text, marginBottom:14 }}>Vehicle Information</div>
            {[{ l:"Year", v:yr, set:setYr, ph:"e.g. 2021" },
              { l:"Make", v:mk, set:setMk, ph:"e.g. Tesla" },
              { l:"Model", v:mo, set:setMo, ph:"e.g. Model 3" }].map(({ l, v, set, ph }) => (
              <div key={l} style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.sub, marginBottom:6, letterSpacing:.8 }}>{l.toUpperCase()}</div>
                <input value={v} onChange={e => set(e.target.value)} placeholder={ph}
                  style={{ width:"100%", padding:"13px 14px", background:T.card,
                    border:`1px solid ${T.border}`, borderRadius:12, color:T.text,
                    fontSize:15, outline:"none" }}/>
              </div>
            ))}
            <div style={{ background:T.dim, borderRadius:14, padding:14,
              display:"flex", gap:12, alignItems:"center", border:`1px solid ${T.border}` }}>
              <span style={{ fontSize:28 }}>🚗</span>
              <div>
                <div style={{ fontSize:11, color:T.sub, fontWeight:600 }}>YOUR VEHICLE</div>
                <div style={{ fontSize:16, fontWeight:700, color:T.text, marginTop:2 }}>{yr} {mk} {mo}</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Summary */}
        {step === 3 && (
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:T.text, marginBottom:14 }}>Booking Summary</div>
            {[
              { l:"Service",    v:`${service.em} ${service.name}` },
              { l:"Detailer",   v:det?.name || "—" },
              { l:"Date & Time",v:date && time ? `${date} · ${time}` : "—" },
              { l:"Vehicle",    v:`${yr} ${mk} ${mo}` },
            ].map(({ l, v }) => (
              <div key={l} style={{ background:T.card, border:`1px solid ${T.border}`,
                borderRadius:12, padding:"12px 14px", marginBottom:8,
                display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:13, color:T.sub }}>{l}</span>
                <span style={{ fontSize:13, fontWeight:700, color:T.text, maxWidth:"55%", textAlign:"right" }}>{v}</span>
              </div>
            ))}
            <div style={{ background:`rgba(79,142,247,0.06)`, border:`1px solid rgba(79,142,247,0.2)`,
              borderRadius:14, padding:"14px 16px", marginTop:6 }}>
              {[{ l:"Service price", v:`$${service.price}` },{ l:"Platform fee", v:`$${fee}` }].map(({ l, v }) => (
                <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <span style={{ fontSize:13, color:T.sub }}>{l}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:T.text }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:10,
                display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:14, fontWeight:700, color:T.text }}>Total</span>
                <span style={{ fontSize:22, fontWeight:900, color:T.blue }}>${total}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding:"12px 16px 16px", flexShrink:0, borderTop:`1px solid ${T.border}` }}>
        <PrimaryBtn onClick={next} disabled={!canGo}>
          {step === 3 ? "🚗 Confirm & Book" : step === 2 ? "Review Summary →" : "Continue →"}
        </PrimaryBtn>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   SCREEN 4 — CONFIRMATION
═══════════════════════════════════════ */
const ConfirmationScreen = ({ go, data }) => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPct(p => { if (p >= 100) { clearInterval(id); return 100; } return p + 2.5; }), 30);
    return () => clearInterval(id);
  }, []);
  const d = data || { service:SV[2], det:DT[0], date:"Jun 5", time:"10:00 AM", vehicle:"2021 Tesla Model 3", total:"98.99" };

  return (
    <div style={{ height:"100%", overflowY:"auto", background:T.bg }}>
      <div style={{ textAlign:"center", padding:"30px 20px 20px" }}>
        {/* Animated ring */}
        <div style={{ position:"relative", width:110, height:110, margin:"0 auto 20px" }}>
          <svg width="110" height="110" style={{ position:"absolute", inset:0 }}>
            <circle cx="55" cy="55" r="50" fill="none" stroke={T.dim} strokeWidth="5"/>
            <circle cx="55" cy="55" r="50" fill="none" stroke={T.teal} strokeWidth="5"
              strokeDasharray={`${pct * 3.14} 314`} strokeLinecap="round"
              style={{ transformOrigin:"55px 55px", transform:"rotate(-90deg)", transition:"stroke-dasharray .3s" }}/>
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:40 }}>{pct >= 100 ? "✅" : "⏳"}</div>
        </div>
        <div style={{ fontSize:24, fontWeight:900, color:T.text }}>Booking Confirmed!</div>
        <div style={{ fontSize:14, color:T.sub, marginTop:6 }}>Your detailer is on the way</div>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:T.card,
          border:`1px solid rgba(0,200,150,0.35)`, borderRadius:20, padding:"8px 18px", marginTop:12 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:T.teal, boxShadow:`0 0 8px ${T.teal}` }}/>
          <span style={{ fontSize:14, fontWeight:700, color:T.text }}>ETA: {d.det?.eta || "12 min"}</span>
        </div>
      </div>

      <div style={{ padding:"0 16px" }}>
        <Card>
          <SectionLabel>YOUR DETAILER</SectionLabel>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <Av av={d.det?.av || "FR"} col={d.det?.col || T.blue} sz={54}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:16, fontWeight:800, color:T.text }}>{d.det?.name || "FreshRide Detail"}</div>
              <div style={{ fontSize:12, color:T.sub, marginTop:3 }}>⭐ {d.det?.rating || 4.9} · {d.det?.jobs || 120} jobs</div>
            </div>
            <button onClick={() => go("messages")} style={{ width:42, height:42, borderRadius:12,
              background:`${T.blue}18`, border:`1px solid ${T.blue}35`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:20, cursor:"pointer" }}>💬</button>
          </div>
        </Card>

        <Card>
          <SectionLabel>BOOKING DETAILS</SectionLabel>
          {[
            { em:"✨", l:"Service",   v:d.service?.name || "Full Mobile Detail" },
            { em:"📅", l:"Date",      v:`${d.date || "Jun 5"} · ${d.time || "10:00 AM"}` },
            { em:"🚗", l:"Vehicle",   v:d.vehicle || "2021 Tesla Model 3" },
            { em:"💰", l:"Total Paid",v:`$${d.total || "98.99"}` },
          ].map(({ em, l, v }) => (
            <div key={l} style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
              <span style={{ fontSize:18, width:26 }}>{em}</span>
              <div>
                <div style={{ fontSize:11, color:T.sub, fontWeight:600 }}>{l}</div>
                <div style={{ fontSize:14, fontWeight:700, color:T.text }}>{v}</div>
              </div>
            </div>
          ))}
        </Card>

        <PrimaryBtn onClick={() => go("tracking")}>📡 Track My Detailer</PrimaryBtn>
        <div style={{ height:10 }}/>
        <GhostBtn onClick={() => go("home")}>Back to Home</GhostBtn>
      </div>
      <div style={{ height:20 }}/>
    </div>
  );
};

/* ═══════════════════════════════════════
   SCREEN 5 — LIVE TRACKING
═══════════════════════════════════════ */
const TrackingScreen = ({ go }) => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPct(p => { if (p >= 100) { clearInterval(id); return 100; } return p + 0.18; }), 80);
    return () => clearInterval(id);
  }, []);

  const phase = pct < 40 ? 0 : pct < 85 ? 1 : 2;
  const ph = [
    { em:"🕐", title:"Detailer en route",     sub:"Your detailer will reach you shortly.",  col:T.sub   },
    { em:"📍", title:"Detailer is close by!",  sub:"Live tracking enabled — route visible",   col:T.amber },
    { em:"🎉", title:"Detailer has arrived!",  sub:"Service is starting soon",                col:T.teal  },
  ][phase];

  const updates = [
    { t:"Booking confirmed",       ok:true       },
    { t:"Detailer assigned",       ok:true       },
    { t:"Detailer started driving",ok:true       },
    { t:"Detailer within 5 km",    ok:phase >= 1 },
    { t:"Detailer within 3 km",    ok:phase >= 1 },
    { t:"Detailer arrived",        ok:phase >= 2 },
    { t:"Service started",         ok:false      },
  ];

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:T.bg }}>
      <div style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <BackBtn onClick={() => go("confirmation")}/>
        <div style={{ fontSize:18, fontWeight:800, color:T.text }}>Live Tracking</div>
        <div style={{ marginLeft:"auto", fontSize:13, fontWeight:700, color:ph.col }}>
          {["En Route","📍 Live","✅ Arrived"][phase]}
        </div>
      </div>

      {/* Map */}
      <div style={{ height:230, position:"relative", flexShrink:0 }}>
        <MockMap onPin={() => {}} selPin={null}/>
        {phase >= 1 && (
          <>
            <div style={{ position:"absolute", top:"44%", left:`${18 + pct * 0.36}%`,
              fontSize:26, transform:"translateY(-50%)", zIndex:5, transition:"left 2s linear" }}>🚐</div>
            <svg style={{ position:"absolute", inset:0, pointerEvents:"none" }} width="100%" height="100%" viewBox="0 0 390 230">
              <line x1="80" y1="105" x2="195" y2="135"
                stroke={T.blue} strokeWidth="3" strokeDasharray="10 5" opacity="0.8"/>
            </svg>
          </>
        )}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:60,
          background:`linear-gradient(transparent,${T.bg})`, pointerEvents:"none" }}/>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"14px 16px" }}>
        {/* Status card */}
        <div style={{ background:T.card, border:`1.5px solid ${ph.col}35`, borderRadius:16,
          padding:16, marginBottom:12, textAlign:"center" }}>
          <div style={{ fontSize:34, marginBottom:8 }}>{ph.em}</div>
          <div style={{ fontSize:16, fontWeight:800, color:T.text, marginBottom:4 }}>{ph.title}</div>
          <div style={{ fontSize:13, color:T.sub }}>{ph.sub}</div>
        </div>

        {/* Progress */}
        <div style={{ background:T.card, border:`1px solid ${T.border}`,
          borderRadius:14, padding:14, marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:13, color:T.sub, fontWeight:600 }}>
              {["Driving to you","Almost there!","Arrived!"][phase]}
            </span>
            <span style={{ fontSize:13, fontWeight:800, color:T.blue }}>{Math.round(pct)}%</span>
          </div>
          <div style={{ height:6, background:T.dim, borderRadius:3 }}>
            <div style={{ height:"100%", borderRadius:3, transition:"width .4s",
              width:`${pct}%`, background:pct >= 100 ? T.teal : T.blue }}/>
          </div>
        </div>

        {/* Detailer strip */}
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14,
          padding:"12px 14px", marginBottom:12, display:"flex", alignItems:"center", gap:10 }}>
          <Av av="FR" col={T.blue} sz={44}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:T.text }}>FreshRide Detail</div>
            <div style={{ fontSize:12, color:T.sub }}>⭐ 4.9 · {["On the way...","Almost there!","Has arrived! 🎉"][phase]}</div>
          </div>
          <button onClick={() => go("messages")} style={{ width:38, height:38, borderRadius:10,
            background:`${T.blue}18`, border:"none", fontSize:18, cursor:"pointer" }}>💬</button>
          <button style={{ width:38, height:38, borderRadius:10,
            background:`${T.teal}12`, border:"none", fontSize:18, cursor:"pointer" }}>📞</button>
        </div>

        {/* Updates log */}
        <Card>
          <SectionLabel>STATUS UPDATES</SectionLabel>
          {updates.map(({ t, ok }) => (
            <div key={t} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0,
                background:ok ? `${T.teal}20` : T.dim,
                border:`1.5px solid ${ok ? T.teal : T.border}`,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                {ok && <span style={{ fontSize:10, color:T.teal, fontWeight:700 }}>✓</span>}
              </div>
              <span style={{ fontSize:13, color:ok ? T.text : T.sub, fontWeight:ok ? 600 : 400 }}>{t}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   SCREEN 6 — MESSAGES LIST
═══════════════════════════════════════ */
const MessagesScreen = ({ go, onChat }) => (
  <div style={{ height:"100%", overflowY:"auto", background:T.bg }}>
    <div style={{ padding:"16px 16px 0" }}>
      <div style={{ fontSize:24, fontWeight:900, color:T.text }}>Messages</div>
      <div style={{ fontSize:14, color:T.sub, marginTop:3, marginBottom:14 }}>Chat with your detailers</div>
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12,
        padding:"11px 14px", display:"flex", gap:10, alignItems:"center", marginBottom:16 }}>
        <span style={{ fontSize:16 }}>🔍</span>
        <span style={{ fontSize:14, color:T.sub }}>Search messages...</span>
      </div>
    </div>
    {MG.map(m => (
      <div key={m.id} onClick={() => { onChat(m); go("chat"); }}
        style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px",
          borderBottom:`1px solid ${T.border}`, cursor:"pointer" }}>
        <div style={{ position:"relative" }}>
          <Av av={m.av} col={m.col} sz={52}/>
          {m.unread > 0 && (
            <div style={{ position:"absolute", top:-2, right:-2, width:19, height:19,
              borderRadius:"50%", background:"#EF4444", border:`2px solid ${T.bg}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:10, fontWeight:800, color:"white" }}>{m.unread}</div>
          )}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:15, fontWeight:700, color:T.text }}>{m.name}</span>
            <span style={{ fontSize:11, color:T.sub }}>{m.time} ago</span>
          </div>
          <div style={{ fontSize:13, color:m.unread > 0 ? T.text : T.sub, marginTop:3,
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
            fontWeight:m.unread > 0 ? 600 : 400 }}>{m.last}</div>
        </div>
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════
   SCREEN 7 — CHAT
═══════════════════════════════════════ */
const ChatScreen = ({ go, det }) => {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    { from:"them", text:"Hey! Just accepted your booking for today.", t:"10:02" },
    { from:"me",   text:"Awesome! How far away are you?",             t:"10:03" },
    { from:"them", text:"About 15 minutes away, traffic is light.",   t:"10:04" },
    { from:"them", text:"I'll arrive in around 10 minutes. See you soon!", t:"10:08" },
  ]);
  const d = det || MG[0];
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    setMsgs(m => [...m, { from:"me", text:input, t:"Now" }]);
    setInput("");
    setTimeout(() => setMsgs(m => [...m, { from:"them", text:"Got it! See you soon 👍", t:"Now" }]), 1200);
  };

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:T.bg }}>
      <div style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:10,
        borderBottom:`1px solid ${T.border}`, flexShrink:0 }}>
        <BackBtn onClick={() => go("messages")}/>
        <Av av={d.av} col={d.col} sz={38}/>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:700, color:T.text }}>{d.name}</div>
          <div style={{ fontSize:11, color:T.teal, fontWeight:600 }}>● Online</div>
        </div>
        <button onClick={() => go("tracking")} style={{ fontSize:12, color:T.blue,
          fontWeight:700, background:"none", border:"none", cursor:"pointer", fontFamily:T.f }}>Track →</button>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"14px 16px",
        display:"flex", flexDirection:"column", gap:10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.from === "me" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth:"76%", background:m.from === "me" ? T.blue : T.card,
              border:`1px solid ${m.from === "me" ? T.blue : T.border}`,
              borderRadius:m.from === "me" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
              padding:"10px 13px" }}>
              <div style={{ fontSize:14, color:m.from === "me" ? "white" : T.text, lineHeight:1.5 }}>{m.text}</div>
              <div style={{ fontSize:10, color:m.from === "me" ? "rgba(255,255,255,0.55)" : T.sub,
                marginTop:3, textAlign:"right" }}>{m.t}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>

      <div style={{ padding:"10px 16px 14px", borderTop:`1px solid ${T.border}`,
        display:"flex", gap:8, flexShrink:0, alignItems:"center" }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()} placeholder="Type a message..."
          style={{ flex:1, padding:"12px 14px", background:T.card,
            border:`1px solid ${T.border}`, borderRadius:12, color:T.text,
            fontSize:14, outline:"none" }}/>
        <button onClick={send} style={{ width:46, height:46, borderRadius:12, background:T.blue,
          border:"none", display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", flexShrink:0, fontSize:20, color:"white" }}>➤</button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   SCREEN 8 — BOOKINGS
═══════════════════════════════════════ */
const BookingsScreen = ({ go }) => {
  const [day, setDay] = useState("5");
  const dts = [{ n:"2",d:"M" },{ n:"3",d:"T" },{ n:"4",d:"W" },{ n:"5",d:"T" },{ n:"6",d:"F" },{ n:"7",d:"S" },{ n:"8",d:"S" }];
  const marked = ["5","10"];

  return (
    <div style={{ height:"100%", overflowY:"auto", background:T.bg }}>
      <div style={{ padding:"16px 16px 0" }}>
        <div style={{ fontSize:24, fontWeight:900, color:T.text }}>My Bookings</div>
        <div style={{ fontSize:14, color:T.sub, marginTop:3 }}>Manage your appointments</div>
      </div>

      {/* Calendar */}
      <div style={{ margin:"14px 16px 0", background:T.card, border:`1px solid ${T.border}`,
        borderRadius:18, padding:16 }}>
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
          {dts.map(({ n, d }) => {
            const sel = day === n;
            const dot = marked.includes(n) && !sel;
            return (
              <div key={n} onClick={() => setDay(n)}
                style={{ flex:1, padding:"9px 4px", borderRadius:12, textAlign:"center",
                  background:sel ? T.blue : marked.includes(n) ? `${T.blue}12` : T.dim,
                  border:`1px solid ${sel ? T.blue : marked.includes(n) ? `${T.blue}35` : T.border}`,
                  cursor:"pointer", transition:"all .2s" }}>
                <div style={{ fontSize:9, fontWeight:700, color:sel ? "rgba(255,255,255,0.7)" : T.sub }}>{d}</div>
                <div style={{ fontSize:18, fontWeight:900, color:sel ? "white" : T.text, margin:"2px 0" }}>{n}</div>
                {dot && <div style={{ width:4, height:4, borderRadius:"50%", background:T.blue, margin:"2px auto 0" }}/>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bookings list */}
      <div style={{ padding:"14px 16px" }}>
        <div style={{ fontSize:15, fontWeight:800, color:T.text, marginBottom:12 }}>Upcoming Reminders</div>
        {BK.map((b, i) => (
          <div key={i} style={{ background:T.card, border:`1px solid ${T.border}`,
            borderRadius:16, padding:14, marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:800, color:T.text }}>{b.svc}</div>
                <div style={{ fontSize:12, color:T.sub, marginTop:3 }}>with {b.det}</div>
              </div>
              <StatusPill st={b.st}/>
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              {[`📅 ${b.date}`, `⏰ ${b.time}`, `🚗 ${b.car}`].map(t => (
                <span key={t} style={{ fontSize:12, color:T.sub }}>{t}</span>
              ))}
            </div>
            {b.st === "Confirmed" && (
              <button onClick={() => go("tracking")} style={{ marginTop:10, width:"100%",
                padding:"9px", borderRadius:10, background:`${T.blue}12`,
                border:`1px solid ${T.blue}35`, color:T.blue, fontSize:13,
                fontWeight:700, cursor:"pointer", fontFamily:T.f }}>
                Track Detailer →
              </button>
            )}
          </div>
        ))}
      </div>
      <div style={{ height:16 }}/>
    </div>
  );
};

/* ═══════════════════════════════════════
   SCREEN 9 — ACCOUNT
═══════════════════════════════════════ */
const AccountScreen = ({ go }) => {
  const items = [
    { em:"👤", l:"Edit Profile",     sub:"Name, photo, preferences"          },
    { em:"💳", l:"Payment Methods",  sub:"Cards, Apple Pay, Google Pay"       },
    { em:"📍", l:"Saved Addresses",  sub:"Home, work & more"                  },
    { em:"🔔", l:"Notifications",    sub:"Booking updates & offers"           },
    { em:"📋", l:"Booking History",  sub:"Past services & receipts", to:"bookings" },
    { em:"💬", l:"Support",          sub:"Help center & live chat",  to:"messages" },
    { em:"🚪", l:"Logout",           sub:"Sign out of your account", red:true  },
  ];
  return (
    <div style={{ height:"100%", overflowY:"auto", background:T.bg }}>
      {/* Profile header */}
      <div style={{ background:"linear-gradient(180deg,#0E1428 0%,#07080F 100%)", padding:"20px 16px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:18 }}>
          <div style={{ width:70, height:70, borderRadius:"50%", background:`${T.blue}18`,
            border:`3px solid ${T.blue}40`, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:30 }}>😊</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:22, fontWeight:900, color:T.text }}>Alex Johnson</div>
            <div style={{ fontSize:13, color:T.sub, marginTop:2 }}>alex@email.com</div>
            <div style={{ display:"flex", gap:6, marginTop:7 }}>
              <span style={{ fontSize:11, background:`${T.teal}18`, color:T.teal,
                padding:"3px 9px", borderRadius:20, fontWeight:700 }}>✓ Verified</span>
              <span style={{ fontSize:11, background:`${T.amber}18`, color:T.amber,
                padding:"3px 9px", borderRadius:20, fontWeight:700 }}>⭐ 4.8 Client</span>
            </div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {[{ v:"7", l:"Bookings" },{ v:"$342", l:"Spent" },{ v:"4.8★", l:"Rating" }].map(({ v, l }) => (
            <div key={l} style={{ background:T.card, border:`1px solid ${T.border}`,
              borderRadius:12, padding:"10px 8px", textAlign:"center" }}>
              <div style={{ fontSize:20, fontWeight:900, color:T.text }}>{v}</div>
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
              <div style={{ fontSize:15, fontWeight:600, color:item.red ? "#EF4444" : T.text }}>{item.l}</div>
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

/* ═══════════════════════════════════════
   STATUS BAR
═══════════════════════════════════════ */
const StatusBar = () => (
  <div style={{ height:44, display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"0 24px", color:T.text, fontSize:15, fontWeight:700, flexShrink:0 }}>
    <span>9:41</span>
    <div style={{ display:"flex", gap:5, alignItems:"center", fontSize:12 }}>
      <span>●●●●</span>
      <span style={{ fontSize:11 }}>WiFi</span>
      <span>🔋</span>
    </div>
  </div>
);

/* ═══════════════════════════════════════
   ROOT APP
═══════════════════════════════════════ */
export default function ClientApp() {
  const [screen, setScreen]     = useState("home");
  const [tab, setTab]           = useState("home");
  const [svc, setSvc]           = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [chatDet, setChatDet]   = useState(null);

  const MAIN_TABS = ["home","book","messages","bookings","account"];

  const go = (s) => {
    setScreen(s);
    if (MAIN_TABS.includes(s)) setTab(s);
  };

  const screens = {
    home:         <HomeScreen         go={go} setSvc={setSvc}/>,
    service:      <ServiceScreen      go={go} svc={svc} setSvc={setSvc}/>,
    book:         <BookScreen         go={go} svc={svc} setConfirmData={setConfirmData}/>,
    confirmation: <ConfirmationScreen go={go} data={confirmData}/>,
    tracking:     <TrackingScreen     go={go}/>,
    messages:     <MessagesScreen     go={go} onChat={setChatDet}/>,
    chat:         <ChatScreen         go={go} det={chatDet}/>,
    bookings:     <BookingsScreen     go={go}/>,
    account:      <AccountScreen      go={go}/>,
  };

  const showNav = MAIN_TABS.includes(screen);

  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start",
      minHeight:"100vh", background:"#040508", fontFamily:T.f, padding:"24px 0 40px" }}>

      {/* Outer glow */}
      <div style={{ position:"relative" }}>
        <div style={{ position:"absolute", inset:-40, borderRadius:80,
          background:"radial-gradient(ellipse at center,rgba(79,142,247,0.14) 0%,transparent 70%)",
          pointerEvents:"none" }}/>

        {/* Phone frame */}
        <div style={{ width:390, height:844, background:T.bg, borderRadius:44, overflow:"hidden",
          position:"relative", display:"flex", flexDirection:"column",
          boxShadow:"0 70px 140px rgba(0,0,0,0.95),inset 0 0 0 1.5px rgba(255,255,255,0.07)" }}>

          <StatusBar/>

          <div style={{ flex:1, overflow:"hidden", position:"relative" }}>
            {screens[screen]}
          </div>

          {showNav && <BottomNav tab={tab} onTab={t => { setTab(t); go(t); }}/>}
        </div>
      </div>
    </div>
  );
}
