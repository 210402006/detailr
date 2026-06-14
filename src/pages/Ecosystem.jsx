import { useState, useEffect, useRef } from "react";

/* ─── Font + styles ─── */
(() => {
  if (document.getElementById("eco-font")) return;
  const l = document.createElement("link");
  l.id = "eco-font"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap";
  document.head.appendChild(l);
  const s = document.createElement("style");
  s.textContent = `*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#1E2535;border-radius:2px}input,button,select{font-family:inherit}
  @keyframes pulse-out{0%{transform:scale(1);opacity:.5}100%{transform:scale(2.6);opacity:0}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes slide-up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes bounce-in{0%{transform:scale(.8);opacity:0}60%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
  @keyframes car-move{from{left:12%}to{left:58%}}`;
  document.head.appendChild(s);
})();

/* ─── Tokens ─── */
const C = {
  bg:"#07080F", surface:"#0C0E18", card:"#111420",
  border:"rgba(255,255,255,0.07)", green:"#00C896",
  blue:"#4F8EF7", amber:"#F5A623", red:"#EF4444", purple:"#8B5CF6",
  text:"#EEF2FF", sub:"#6B7591", dim:"#161926", f:"'Outfit',sans-serif",
};

/* ─── SHARED STATE ─── */
const INIT = {
  detailerOnline: false,
  flow: "idle",
  // idle → booked → request → accepted → enroute → arrived → complete
  booking: null,
  countdown: 15,
  jobStep: 0,   // 0=route 1=arrived 2=service 3=complete
  earnings: 241.65,
  totalEarnings: 4338.00,
  events: [],
  autoPlaying: false,
};

/* ══════════════════════════════════════
   PHONE FRAME WRAPPER
══════════════════════════════════════ */
const Phone = ({ children, label, col, glow = false }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
    <div style={{ fontSize:11, fontWeight:700, color:col, letterSpacing:.5,
      padding:"4px 14px", borderRadius:20, background:`${col}15`, border:`1px solid ${col}35` }}>
      {label}
    </div>
    <div style={{ width:260, height:530, background:C.bg, borderRadius:30, overflow:"hidden",
      position:"relative", display:"flex", flexDirection:"column",
      boxShadow:`0 30px 60px rgba(0,0,0,0.85), inset 0 0 0 1.5px rgba(255,255,255,0.07)${glow?`, 0 0 40px ${col}30`:""}`,
      transition:"box-shadow .5s" }}>
      {/* Status bar */}
      <div style={{ height:34, display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 16px", color:C.text, fontSize:11, fontWeight:700, flexShrink:0 }}>
        <span>9:41</span>
        <div style={{ display:"flex", gap:4, fontSize:9, alignItems:"center" }}>
          <span>●●●●</span><span>WiFi</span><span>🔋</span>
        </div>
      </div>
      <div style={{ flex:1, overflow:"hidden", position:"relative" }}>
        {children}
      </div>
    </div>
  </div>
);

/* ─── Shared mini map ─── */
const MiniMap = ({ showCar = false, carProgress = 0 }) => (
  <div style={{ position:"relative", width:"100%", height:"100%", background:"#141824", overflow:"hidden" }}>
    <svg style={{ position:"absolute", inset:0 }} width="100%" height="100%" viewBox="0 0 260 120" preserveAspectRatio="none">
      <rect width="260" height="120" fill="#141824"/>
      {[[8,10,50,24],[65,10,48,24],[120,10,55,24],[182,10,70,24],
        [8,42,50,24],[65,42,48,24],[120,42,55,24],[182,42,70,24],
        [8,74,50,24],[65,74,48,24],[120,74,55,24]].map(([x,y,w,h],i)=>(
        <rect key={i} x={x} y={y} width={w} height={h} fill="#1A2035" rx="2"/>
      ))}
      {[8,40,72,104].map((y,i)=><rect key={i} x="0" y={y} width="260" height="5" fill="#1D2540"/>)}
      {[62,118,180,252].map((x,i)=><rect key={i} x={x} y="0" width="5" height="120" fill="#1D2540"/>)}
      <rect x="68" y="44" width="46" height="22" fill="#182D1F" rx="2"/>
      {showCar && <line x1="36" y1="68" x2="130" y2="85" stroke={C.blue} strokeWidth="2" strokeDasharray="6 3" opacity=".7"/>}
    </svg>
    {/* User pin */}
    <div style={{ position:"absolute", left:"50%", top:"72%", transform:"translate(-50%,-50%)" }}>
      <div style={{ width:10, height:10, borderRadius:"50%", background:C.green,
        border:"2px solid white", boxShadow:`0 0 8px ${C.green}` }}/>
    </div>
    {/* Moving car */}
    {showCar && (
      <div style={{ position:"absolute", top:"54%", transform:"translateY(-50%)", fontSize:18,
        left:`${14 + carProgress * 0.42}%`, transition:"left 1.5s linear", zIndex:4 }}>🚐</div>
    )}
    {/* Detailer pin */}
    {!showCar && (
      <div style={{ position:"absolute", left:"22%", top:"30%", transform:"translate(-50%,-100%)" }}>
        <div style={{ background:C.blue, borderRadius:"7px 7px 7px 1px",
          padding:"2px 6px", fontSize:7, fontWeight:800, color:"white" }}>12 min</div>
        <div style={{ width:2, height:5, background:C.blue, margin:"0 auto" }}/>
      </div>
    )}
    <div style={{ position:"absolute", bottom:0, left:0, right:0, height:36,
      background:`linear-gradient(transparent,${C.bg})`, pointerEvents:"none" }}/>
  </div>
);

/* ══════════════════════════════════════
   CLIENT MINI APP SCREENS
══════════════════════════════════════ */
const ClientHome = ({ onBook, flow }) => (
  <div style={{ height:"100%", overflowY:"auto", background:C.bg }}>
    <div style={{ height:120, position:"relative" }}>
      <MiniMap/>
      <div style={{ position:"absolute", top:8, left:10, right:10, display:"flex", justifyContent:"space-between" }}>
        <div style={{ background:"rgba(7,8,15,.85)", backdropFilter:"blur(8px)", borderRadius:8,
          padding:"4px 8px", border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:7, color:"rgba(255,255,255,.5)", fontWeight:600 }}>LOCATION</div>
          <div style={{ fontSize:8, color:"white", fontWeight:700 }}>📍 123 Main St</div>
        </div>
        <div style={{ fontSize:16 }}>🔔</div>
      </div>
      <div style={{ position:"absolute", bottom:14, left:"50%", transform:"translateX(-50%)" }}>
        <button onClick={onBook} style={{ background:C.blue, color:"white", border:"none",
          borderRadius:14, padding:"7px 18px", fontSize:11, fontWeight:700, cursor:"pointer",
          boxShadow:`0 4px 14px ${C.blue}55`, animation:flow==="idle"?"none":"bounce-in .4s" }}>
          📍 Book Nearby
        </button>
      </div>
    </div>
    <div style={{ padding:"8px 10px 0" }}>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:9,
        padding:"8px 10px", display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
        <span style={{ fontSize:11 }}>🔍</span>
        <span style={{ fontSize:10, color:C.sub }}>Where do you need detailing?</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginBottom:10 }}>
        {[["✨","Services"],["📅","Book"],["💬","Messages"],["💳","Wallet"]].map(([em,l])=>(
          <div key={l} onClick={l==="Book"?onBook:undefined}
            style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:9,
              padding:"8px 4px", textAlign:"center", cursor:l==="Book"?"pointer":"default" }}>
            <div style={{ fontSize:16 }}>{em}</div>
            <div style={{ fontSize:8, color:C.sub, marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:11, fontWeight:700, color:C.text, marginBottom:8 }}>Nearby Detailers</div>
      {[{n:"FreshRide Detail",r:"4.9",c:C.blue,eta:"12 min"},{n:"AutoSpark Pro",r:"4.8",c:C.green,eta:"18 min"}].map(d=>(
        <div key={d.n} onClick={onBook} style={{ background:C.card, border:`1px solid ${C.border}`,
          borderRadius:10, padding:"9px 10px", marginBottom:6, display:"flex", alignItems:"center",
          gap:8, cursor:"pointer" }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:`${d.c}20`,
            border:`1px solid ${d.c}40`, display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:9, color:d.c, fontWeight:700, flexShrink:0 }}>
            {d.n.split(" ").map(w=>w[0]).join("")}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.text }}>{d.n}</div>
            <div style={{ fontSize:9, color:C.sub }}>⭐ {d.r} · {d.eta} away</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ClientBooking = ({ onConfirm }) => (
  <div style={{ height:"100%", overflowY:"auto", background:C.bg, padding:"14px 12px" }}>
    <div style={{ fontSize:14, fontWeight:800, color:C.text, marginBottom:12 }}>Book a Detailer</div>
    <div style={{ background:`${C.green}12`, border:`1px solid ${C.green}35`, borderRadius:8,
      padding:"7px 10px", display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
      <span>✨</span>
      <span style={{ fontSize:10, fontWeight:700, color:C.green }}>Full Mobile Detail</span>
      <span style={{ marginLeft:"auto", fontSize:11, fontWeight:900, color:C.green }}>$95</span>
    </div>
    {[{l:"Detailer",v:"FreshRide Detail ✅"},{l:"Date",v:"Today"},{l:"Time",v:"Right Now"},{l:"Vehicle",v:"2021 Tesla Model 3"}].map(({l,v})=>(
      <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0",
        borderBottom:`1px solid ${C.border}` }}>
        <span style={{ fontSize:10, color:C.sub }}>{l}</span>
        <span style={{ fontSize:10, fontWeight:600, color:C.text }}>{v}</span>
      </div>
    ))}
    <div style={{ background:`rgba(79,142,247,.07)`, border:`1px solid rgba(79,142,247,.2)`,
      borderRadius:10, padding:"10px 12px", margin:"10px 0" }}>
      {[{l:"Service",v:"$95.00"},{l:"Fee",v:"$3.99"},{l:"Total",v:"$98.99",bold:true}].map(({l,v,bold})=>(
        <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:bold?0:4 }}>
          <span style={{ fontSize:10, color:bold?C.text:C.sub, fontWeight:bold?700:400 }}>{l}</span>
          <span style={{ fontSize:bold?16:11, fontWeight:bold?900:600, color:bold?C.blue:C.text }}>{v}</span>
        </div>
      ))}
    </div>
    <button onClick={onConfirm} style={{ width:"100%", padding:"11px", borderRadius:10,
      background:C.blue, color:"white", border:"none", fontSize:13, fontWeight:800, cursor:"pointer",
      boxShadow:`0 4px 16px ${C.blue}45` }}>
      🚗 Confirm & Book
    </button>
  </div>
);

const ClientWaiting = () => {
  const [dots, setDots] = useState(0);
  useEffect(() => { const t = setInterval(() => setDots(d => (d+1)%4), 500); return()=>clearInterval(t); }, []);
  return (
    <div style={{ height:"100%", background:C.bg, display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:"0 20px", textAlign:"center" }}>
      <div style={{ position:"relative", width:60, height:60, marginBottom:16 }}>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:`2px solid ${C.blue}`,
          animation:"pulse-out 1.5s infinite" }}/>
        <div style={{ width:60, height:60, borderRadius:"50%", background:`${C.blue}20`,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🔍</div>
      </div>
      <div style={{ fontSize:14, fontWeight:800, color:C.text }}>Finding a detailer{".".repeat(dots)}</div>
      <div style={{ fontSize:11, color:C.sub, marginTop:6 }}>Sending your request to nearby pros</div>
    </div>
  );
};

const ClientConfirmed = ({ onTrack }) => (
  <div style={{ height:"100%", background:C.bg, display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center", padding:"0 16px", textAlign:"center" }}>
    <div style={{ fontSize:52, marginBottom:12, animation:"bounce-in .5s" }}>✅</div>
    <div style={{ fontSize:16, fontWeight:900, color:C.text }}>Booking Confirmed!</div>
    <div style={{ fontSize:11, color:C.sub, marginTop:6, marginBottom:16 }}>Your detailer is on the way</div>
    <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:C.card,
      border:`1px solid ${C.green}40`, borderRadius:16, padding:"6px 14px", marginBottom:14 }}>
      <div style={{ width:6, height:6, borderRadius:"50%", background:C.green,
        boxShadow:`0 0 6px ${C.green}` }}/>
      <span style={{ fontSize:11, fontWeight:700, color:C.text }}>ETA: 12 min</span>
    </div>
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12,
      padding:"12px 14px", width:"100%", marginBottom:12 }}>
      {[{em:"✨",l:"Full Mobile Detail"},{em:"🧑‍🔧",l:"FreshRide Detail"},{em:"💰",l:"$98.99"}].map(({em,l})=>(
        <div key={l} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:7 }}>
          <span style={{ fontSize:14 }}>{em}</span>
          <span style={{ fontSize:11, color:C.text }}>{l}</span>
        </div>
      ))}
    </div>
    <button onClick={onTrack} style={{ width:"100%", padding:"10px", borderRadius:10,
      background:C.green, color:"white", border:"none", fontSize:12, fontWeight:700, cursor:"pointer" }}>
      📡 Track My Detailer
    </button>
  </div>
);

const ClientTracking = ({ flow, carPct }) => {
  const done = flow === "complete";
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:C.bg }}>
      <div style={{ padding:"10px 12px", fontSize:13, fontWeight:800,
        color:done?C.green:C.amber }}>
        {done ? "🎉 Service Complete!" : "📡 Live Tracking"}
      </div>
      <div style={{ height:130, position:"relative", flexShrink:0 }}>
        <MiniMap showCar={!done} carProgress={carPct}/>
      </div>
      <div style={{ flex:1, padding:"10px 12px" }}>
        <div style={{ background:C.card, border:`1.5px solid ${done?C.green:C.amber}35`,
          borderRadius:12, padding:12, marginBottom:10, textAlign:"center" }}>
          <div style={{ fontSize:20, marginBottom:6 }}>{done?"✅":"🚐"}</div>
          <div style={{ fontSize:12, fontWeight:700, color:C.text }}>
            {done?"Service complete!":"Detailer is on the way"}
          </div>
          <div style={{ fontSize:10, color:C.sub, marginTop:3 }}>
            {done?"Please rate your experience":"ETA updated in real-time"}
          </div>
        </div>
        {done && (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, color:C.sub, marginBottom:8 }}>Rate FreshRide Detail</div>
            <div style={{ display:"flex", justifyContent:"center", gap:4 }}>
              {[1,2,3,4,5].map(n=><span key={n} style={{ fontSize:22, cursor:"pointer" }}>⭐</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   DETAILER MINI APP SCREENS
══════════════════════════════════════ */
const DetailerDashboard = ({ online, onToggle, earnings }) => (
  <div style={{ height:"100%", overflowY:"auto", background:C.bg }}>
    <div style={{ padding:"12px 12px 0", display:"flex", justifyContent:"space-between" }}>
      <div>
        <div style={{ fontSize:10, color:C.sub }}>Good morning 👋</div>
        <div style={{ fontSize:16, fontWeight:900, color:C.text }}>Marcus K.</div>
      </div>
      <div style={{ position:"relative" }}>
        <div style={{ width:36, height:36, borderRadius:"50%", background:`${C.green}20`,
          border:`2px solid ${C.green}40`, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:18 }}>🧑‍🔧</div>
        <div style={{ position:"absolute", bottom:0, right:0, width:10, height:10,
          borderRadius:"50%", background:online?C.green:C.sub, border:`2px solid ${C.bg}` }}/>
      </div>
    </div>
    <div style={{ margin:"10px 12px 0", padding:"14px 14px",
      background:online?`${C.green}10`:C.card,
      border:`1px solid ${online?C.green+"40":C.border}`, borderRadius:14,
      cursor:"pointer", transition:"all .35s" }} onClick={onToggle}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:46, height:46, borderRadius:"50%", flexShrink:0,
          background:online?`${C.green}25`:C.dim, border:`2px solid ${online?C.green:C.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:online?`0 0 20px ${C.green}40`:"none", transition:"all .35s" }}>
          <div style={{ width:18, height:18, borderRadius:"50%",
            background:online?C.green:C.sub, transition:"background .3s" }}/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:800, color:online?C.green:C.sub }}>
            {online?"You're Online":"You're Offline"}
          </div>
          <div style={{ fontSize:10, color:C.sub, marginTop:2 }}>
            {online?"Accepting requests":"Tap to go online"}
          </div>
        </div>
        <div style={{ width:38, height:22, borderRadius:11, background:online?C.green:C.dim,
          position:"relative", transition:"background .3s" }}>
          <div style={{ position:"absolute", top:3, width:16, height:16, borderRadius:"50%",
            background:"white", transition:"left .3s", left:online?"calc(100% - 19px)":3,
            boxShadow:"0 1px 3px rgba(0,0,0,.3)" }}/>
        </div>
      </div>
    </div>
    <div style={{ padding:"10px 12px 0" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
        {[{v:`$${earnings.toFixed(0)}`,l:"Earned",c:C.green},{v:"3",l:"Jobs",c:C.text},{v:"4.9★",l:"Rating",c:C.amber}].map(({v,l,c})=>(
          <div key={l} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"8px 6px", textAlign:"center" }}>
            <div style={{ fontSize:14, fontWeight:900, color:c }}>{v}</div>
            <div style={{ fontSize:8, color:C.sub, marginTop:1 }}>{l}</div>
          </div>
        ))}
      </div>
      {online && (
        <div style={{ marginTop:10, background:`${C.amber}10`, border:`1px solid ${C.amber}35`,
          borderRadius:10, padding:"8px 10px", textAlign:"center" }}>
          <div style={{ fontSize:10, color:C.amber, fontWeight:700, animation:"blink 2s infinite" }}>
            ● Waiting for requests...
          </div>
        </div>
      )}
    </div>
  </div>
);

const DetailerRequest = ({ countdown, onAccept, onDecline }) => {
  const circ = 2 * Math.PI * 42;
  const consumed = ((15 - countdown) / 15) * circ;
  const urgent = countdown <= 5;
  return (
    <div style={{ height:"100%", background:C.bg, display:"flex", flexDirection:"column",
      position:"relative", overflow:"hidden" }}>
      {/* Pulse rings */}
      {[180,230,280].map((sz,i)=>(
        <div key={i} style={{ position:"absolute", left:"50%", top:"30%",
          transform:"translate(-50%,-50%)", width:sz, height:sz, borderRadius:"50%",
          border:`1.5px solid rgba(239,68,68,${.2-i*.06})`, pointerEvents:"none",
          animation:"pulse-out 1.5s infinite", animationDelay:`${i*.3}s` }}/>
      ))}
      <div style={{ padding:"12px 14px 0", textAlign:"center", flexShrink:0, position:"relative" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:5,
          background:"rgba(239,68,68,.15)", border:"1px solid rgba(239,68,68,.4)",
          borderRadius:14, padding:"4px 12px", marginBottom:8 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:C.red,
            animation:"blink .7s infinite" }}/>
          <span style={{ fontSize:9, fontWeight:800, color:C.red, letterSpacing:.5 }}>INCOMING — RIGHT NOW</span>
        </div>
        <div style={{ fontSize:15, fontWeight:900, color:C.text }}>New Job Request!</div>
      </div>
      {/* Countdown */}
      <div style={{ display:"flex", justifyContent:"center", margin:"10px 0", flexShrink:0 }}>
        <div style={{ position:"relative", width:90, height:90 }}>
          <svg width="90" height="90" style={{ position:"absolute" }}>
            <circle cx="45" cy="45" r="42" fill="none" stroke={C.dim} strokeWidth="5"/>
            <circle cx="45" cy="45" r="42" fill="none"
              stroke={urgent?C.red:C.amber} strokeWidth="5"
              strokeDasharray={`${circ-consumed} ${consumed}`}
              strokeLinecap="round"
              style={{ transformOrigin:"45px 45px", transform:"rotate(-90deg)", transition:"stroke-dasharray .85s linear" }}/>
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center" }}>
            <div style={{ fontSize:28, fontWeight:900, color:urgent?C.red:C.amber, lineHeight:1 }}>{countdown}</div>
            <div style={{ fontSize:8, color:C.sub }}>seconds</div>
          </div>
        </div>
      </div>
      {/* Job info */}
      <div style={{ padding:"0 12px", flex:1 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <div>
              <div style={{ fontSize:9, color:C.sub, fontWeight:700 }}>CLIENT</div>
              <div style={{ fontSize:14, fontWeight:800, color:C.text }}>Sarah M.</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:9, color:C.sub, fontWeight:700 }}>PAYOUT</div>
              <div style={{ fontSize:20, fontWeight:900, color:C.green }}>$85.50</div>
            </div>
          </div>
          {[{em:"✨",v:"Full Mobile Detail"},{em:"📍",v:"456 Oak Ave · 2.3 km"},{em:"🚗",v:"2021 Tesla Model 3"}].map(({em,v})=>(
            <div key={v} style={{ display:"flex", gap:7, alignItems:"center", marginBottom:6 }}>
              <span style={{ fontSize:12 }}>{em}</span>
              <span style={{ fontSize:10, color:C.text }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Buttons */}
      <div style={{ padding:"10px 12px 14px", display:"flex", gap:8, flexShrink:0 }}>
        <button onClick={onDecline}
          style={{ flex:1, padding:"10px", borderRadius:10, background:"rgba(239,68,68,.12)",
            border:"1px solid rgba(239,68,68,.35)", color:C.red, fontSize:12,
            fontWeight:700, cursor:"pointer" }}>✕ Decline</button>
        <button onClick={onAccept}
          style={{ flex:2, padding:"10px", borderRadius:10, background:C.green,
            border:"none", color:"white", fontSize:13, fontWeight:800, cursor:"pointer",
            boxShadow:`0 4px 16px ${C.green}55` }}>✓ Accept</button>
      </div>
    </div>
  );
};

const DetailerActive = ({ jobStep, onStep }) => {
  const STEPS = [
    { label:"Start Route",      em:"🗺️", col:C.blue   },
    { label:"Mark Arrived",     em:"📍", col:C.amber  },
    { label:"Start Service",    em:"🧹", col:C.purple },
    { label:"Complete Service", em:"✅", col:C.green  },
  ];
  const st = STEPS[Math.min(jobStep, 3)];
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:C.bg }}>
      <div style={{ padding:"10px 12px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <div style={{ fontSize:9, color:C.sub, fontWeight:600 }}>ACTIVE JOB</div>
        <div style={{ fontSize:13, fontWeight:800, color:st.col }}>
          {["En Route","At Location","In Service","Wrapping Up"][Math.min(jobStep,3)]}
        </div>
      </div>
      <div style={{ display:"flex", gap:3, padding:"8px 12px 4px", flexShrink:0 }}>
        {STEPS.map((s,i)=>(
          <div key={i} style={{ flex:1, height:3, borderRadius:2,
            background:i<jobStep?C.green:i===jobStep?st.col:C.dim, transition:"background .3s" }}/>
        ))}
      </div>
      <div style={{ height:110, margin:"4px 12px", borderRadius:10, overflow:"hidden", flexShrink:0 }}>
        <MiniMap showCar={jobStep===0} carProgress={50}/>
      </div>
      <div style={{ padding:"8px 12px", flex:1, overflowY:"auto" }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:12, fontWeight:700, color:C.text }}>Sarah M.</span>
            <span style={{ fontSize:13, fontWeight:900, color:C.green }}>$85.50</span>
          </div>
          {[{em:"✨",v:"Full Mobile Detail"},{em:"📍",v:"456 Oak Ave"},{em:"🚗",v:"Tesla Model 3"}].map(({em,v})=>(
            <div key={v} style={{ display:"flex", gap:6, marginBottom:5 }}>
              <span style={{ fontSize:11 }}>{em}</span>
              <span style={{ fontSize:9, color:C.text }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:"8px 12px 14px", flexShrink:0 }}>
        <button onClick={onStep}
          style={{ width:"100%", padding:"12px", borderRadius:10, background:st.col,
            border:"none", color:"white", fontSize:13, fontWeight:800, cursor:"pointer",
            boxShadow:`0 4px 14px ${st.col}50` }}>
          {st.em} {st.label}
        </button>
      </div>
    </div>
  );
};

const DetailerComplete = ({ earnings }) => (
  <div style={{ height:"100%", background:C.bg, display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center", padding:"0 18px", textAlign:"center" }}>
    <div style={{ fontSize:56, marginBottom:12, animation:"bounce-in .5s" }}>🎉</div>
    <div style={{ fontSize:18, fontWeight:900, color:C.text }}>Job Complete!</div>
    <div style={{ fontSize:11, color:C.sub, marginTop:4, marginBottom:16 }}>Payout added to earnings</div>
    <div style={{ background:`${C.green}12`, border:`1px solid ${C.green}35`,
      borderRadius:14, padding:"16px 20px", width:"100%", marginBottom:14 }}>
      <div style={{ fontSize:10, color:C.sub, marginBottom:4 }}>EARNINGS THIS JOB</div>
      <div style={{ fontSize:36, fontWeight:900, color:C.green }}>+$85.50</div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:10, paddingTop:8,
        borderTop:`1px solid ${C.border}` }}>
        <span style={{ fontSize:10, color:C.sub }}>Today's total</span>
        <span style={{ fontSize:12, fontWeight:800, color:C.green }}>${earnings.toFixed(2)}</span>
      </div>
    </div>
    <div style={{ display:"flex", gap:4 }}>
      {[1,2,3,4,5].map(n=><span key={n} style={{ fontSize:20 }}>⭐</span>)}
    </div>
  </div>
);

/* ══════════════════════════════════════
   FLOW STEP INDICATOR
══════════════════════════════════════ */
const FlowIndicator = ({ flow, detailerOnline }) => {
  const steps = [
    { id:"online",   em:"🟢", label:"Detailer Online"  },
    { id:"booking",  em:"📱", label:"Client Books"     },
    { id:"request",  em:"🔔", label:"Request Sent"     },
    { id:"accepted", em:"✅", label:"Job Accepted"     },
    { id:"enroute",  em:"🚐", label:"En Route"         },
    { id:"complete", em:"🎉", label:"Complete"         },
  ];
  const order = ["idle","booking","request","accepted","enroute","complete"];
  const activeIdx = order.indexOf(flow);
  const onlineIdx = detailerOnline ? 0 : -1;

  return (
    <div style={{ display:"flex", gap:0, alignItems:"center", padding:"0 4px" }}>
      {steps.map((s, i) => {
        const lit = (i === 0 && detailerOnline) || (i > 0 && i <= activeIdx);
        return (
          <div key={s.id} style={{ display:"flex", alignItems:"center", flex:1 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <div style={{ width:28, height:28, borderRadius:"50%",
                background:lit?`${C.green}20`:C.dim,
                border:`2px solid ${lit?C.green:C.border}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:12, transition:"all .4s" }}>
                {s.em}
              </div>
              <span style={{ fontSize:8, color:lit?C.green:C.sub, fontWeight:lit?700:400,
                textAlign:"center", whiteSpace:"nowrap" }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex:1, height:2, background:i<activeIdx&&i>=0?C.green:C.dim,
                transition:"background .4s", margin:"0 2px", marginBottom:14 }}/>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ══════════════════════════════════════
   EVENT LOG
══════════════════════════════════════ */
const EventLog = ({ events }) => {
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [events]);
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14,
      padding:14, height:180, display:"flex", flexDirection:"column" }}>
      <div style={{ fontSize:10, fontWeight:800, color:C.sub, letterSpacing:1, marginBottom:10, flexShrink:0 }}>
        ⚡ LIVE ECOSYSTEM EVENTS
      </div>
      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:5 }}>
        {events.length === 0 && (
          <div style={{ fontSize:11, color:C.sub }}>Waiting for activity — toggle online or tap Book Now to start.</div>
        )}
        {events.map((ev, i) => (
          <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8,
            animation:"slide-up .3s ease", padding:"3px 0",
            borderBottom:i<events.length-1?`1px solid ${C.border}`:"none" }}>
            <span style={{ fontSize:13, flexShrink:0, marginTop:1 }}>{ev.em}</span>
            <div style={{ flex:1 }}>
              <span style={{ fontSize:11, color:C.text, fontWeight:500 }}>{ev.text}</span>
            </div>
            <span style={{ fontSize:9, color:C.sub, flexShrink:0 }}>{ev.time}</span>
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   OVERVIEW TAB
══════════════════════════════════════ */
const OverviewTab = () => {
  const products = [
    { em:"📱", name:"Client App",         col:C.blue,   desc:"Find, book, and track detailers. Full booking flow with live map, chat, and payments.", screens:"9 screens", badge:"iOS & Android" },
    { em:"🚐", name:"Detailer App",       col:C.green,  desc:"Accept jobs, navigate to clients, manage earnings. Right-now and scheduled request system.", screens:"8 screens", badge:"iOS & Android" },
    { em:"💻", name:"Detailer Dashboard", col:C.purple, desc:"PC-based business control panel. Calendar, earnings charts, client history, service management.", screens:"6 sections", badge:"Web (PC only)" },
    { em:"🌐", name:"Marketing Website",  col:C.amber,  desc:"Public landing page with online booking form, detailer signup, app download links.", screens:"10 sections", badge:"Web (all devices)" },
  ];

  const flows = [
    { from:"🌐 Website", to:"📱 Client App",         label:"App store download", col:C.amber },
    { from:"🌐 Website", to:"📅 Booking",             label:"Web booking form",   col:C.amber },
    { from:"📱 Client",  to:"🚐 Detailer App",        label:"Booking request",    col:C.blue  },
    { from:"🚐 Detailer",to:"💻 Dashboard",           label:"Earnings & calendar",col:C.green },
    { from:"📱 Client",  to:"🚐 Detailer",            label:"Live chat + tracking",col:C.purple},
  ];

  return (
    <div style={{ padding:"24px", overflowY:"auto" }}>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.sub, letterSpacing:1, marginBottom:6 }}>THE ECOSYSTEM</div>
        <h2 style={{ fontSize:24, fontWeight:900, color:C.text, marginBottom:6 }}>
          4 products. 1 platform.
        </h2>
        <p style={{ fontSize:13, color:C.sub, lineHeight:1.7 }}>
          Every part of Detailr is built to connect. A booking made on the website flows into the client app, triggers the detailer app, and appears on the PC dashboard — all in real time.
        </p>
      </div>

      {/* Product cards */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
        {products.map(({ em, name, col, desc, screens, badge }) => (
          <div key={name} style={{ background:C.card, border:`1px solid ${C.border}`,
            borderRadius:14, padding:16 }}>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:`${col}18`,
                border:`1px solid ${col}35`, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:20, flexShrink:0 }}>{em}</div>
              <div>
                <div style={{ fontSize:14, fontWeight:800, color:C.text }}>{name}</div>
                <div style={{ fontSize:10, color:col, fontWeight:600 }}>{badge}</div>
              </div>
            </div>
            <p style={{ fontSize:11, color:C.sub, lineHeight:1.6, marginBottom:8 }}>{desc}</p>
            <div style={{ fontSize:10, color:col, fontWeight:700, background:`${col}12`,
              padding:"3px 8px", borderRadius:10, display:"inline-block" }}>{screens}</div>
          </div>
        ))}
      </div>

      {/* Data flow */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16, marginBottom:20 }}>
        <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:14 }}>
          How data flows between apps
        </div>
        {flows.map(({ from, to, label, col }) => (
          <div key={label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10,
            padding:"8px 10px", background:C.dim, borderRadius:10 }}>
            <span style={{ fontSize:11, fontWeight:600, color:C.text, minWidth:80 }}>{from}</span>
            <div style={{ flex:1, display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ flex:1, height:1.5, background:`${col}50` }}/>
              <span style={{ fontSize:8, color:col, fontWeight:700, whiteSpace:"nowrap",
                padding:"2px 6px", borderRadius:8, background:`${col}15` }}>{label}</span>
              <div style={{ flex:1, height:1.5, background:`${col}50` }}/>
            </div>
            <span style={{ fontSize:11, fontWeight:600, color:C.text, minWidth:80, textAlign:"right" }}>{to}</span>
          </div>
        ))}
      </div>

      {/* Tech stack */}
      <div style={{ background:`${C.green}08`, border:`1px solid ${C.green}25`, borderRadius:14, padding:14 }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.green, marginBottom:10, letterSpacing:.5 }}>
          RECOMMENDED TECH STACK TO GO LIVE
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {[
            { l:"Frontend",  v:"React + Lovable.dev",   em:"⚛️" },
            { l:"Backend",   v:"Supabase (DB + Auth)",  em:"🗄️" },
            { l:"Payments",  v:"Stripe Connect",        em:"💳" },
            { l:"Maps",      v:"Google Maps API",       em:"🗺️" },
            { l:"Push Notifs",v:"Firebase FCM",         em:"🔔" },
            { l:"Hosting",   v:"Vercel / Expo",         em:"🚀" },
          ].map(({ l, v, em }) => (
            <div key={l} style={{ background:C.card, borderRadius:10, padding:"8px 10px" }}>
              <div style={{ fontSize:14, marginBottom:4 }}>{em}</div>
              <div style={{ fontSize:9, color:C.sub, fontWeight:600 }}>{l}</div>
              <div style={{ fontSize:10, fontWeight:700, color:C.text, marginTop:1 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   LIVE DEMO TAB
══════════════════════════════════════ */
const DemoTab = ({ state, dispatch }) => {
  const { flow, detailerOnline, countdown, jobStep, earnings, events, autoPlaying } = state;

  const clientScreen = () => {
    if (flow === "idle")     return <ClientHome onBook={() => dispatch("BOOK")} flow={flow}/>;
    if (flow === "booking")  return <ClientBooking onConfirm={() => dispatch("CONFIRM")}/>;
    if (flow === "request")  return <ClientWaiting/>;
    if (flow === "accepted") return <ClientConfirmed onTrack={() => dispatch("TRACK")}/>;
    if (flow === "enroute" || flow === "complete") return <ClientTracking flow={flow} carPct={Math.min(jobStep*30, 90)}/>;
    return <ClientHome onBook={() => dispatch("BOOK")} flow={flow}/>;
  };

  const detailerScreen = () => {
    if (flow === "request")
      return <DetailerRequest countdown={countdown} onAccept={() => dispatch("ACCEPT")} onDecline={() => dispatch("DECLINE")}/>;
    if (flow === "accepted" || flow === "enroute")
      return <DetailerActive jobStep={jobStep} onStep={() => dispatch("JOB_STEP")}/>;
    if (flow === "complete")
      return <DetailerComplete earnings={earnings}/>;
    return <DetailerDashboard online={detailerOnline} onToggle={() => dispatch("TOGGLE_ONLINE")} earnings={earnings}/>;
  };

  return (
    <div style={{ padding:"20px 20px" }}>
      {/* Controls */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:C.text }}>Live Ecosystem Demo</div>
          <div style={{ fontSize:12, color:C.sub, marginTop:2 }}>
            Interact with both apps — shared state flows between them in real time.
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => dispatch("RESET")}
            style={{ padding:"8px 16px", borderRadius:10, background:C.dim, border:`1px solid ${C.border}`,
              color:C.sub, fontSize:12, fontWeight:700, cursor:"pointer" }}>
            ↺ Reset
          </button>
          <button onClick={() => dispatch("AUTO_DEMO")} disabled={autoPlaying}
            style={{ padding:"8px 16px", borderRadius:10, background:autoPlaying?C.dim:C.green,
              border:"none", color:autoPlaying?C.sub:"white", fontSize:12, fontWeight:700,
              cursor:autoPlaying?"default":"pointer",
              boxShadow:autoPlaying?"none":`0 4px 14px ${C.green}45` }}>
            {autoPlaying ? "▶ Playing..." : "▶ Auto Demo"}
          </button>
        </div>
      </div>

      {/* Flow indicator */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14,
        padding:"12px 14px", marginBottom:16 }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5, marginBottom:10 }}>
          BOOKING FLOW
        </div>
        <FlowIndicator flow={flow} detailerOnline={detailerOnline}/>
      </div>

      {/* Two phones */}
      <div style={{ display:"flex", justifyContent:"center", gap:28, marginBottom:16 }}>
        <Phone label="📱 CLIENT APP" col={C.blue} glow={["booking","request","accepted"].includes(flow)}>
          {clientScreen()}
        </Phone>
        <Phone label="🚐 DETAILER APP" col={C.green} glow={["request","accepted","enroute"].includes(flow) || detailerOnline}>
          {detailerScreen()}
        </Phone>
      </div>

      {/* Event log */}
      <EventLog events={events}/>

      {/* How to use */}
      {events.length === 0 && (
        <div style={{ marginTop:14, background:`${C.blue}08`, border:`1px solid ${C.blue}25`,
          borderRadius:12, padding:"12px 14px", fontSize:12, color:C.sub, lineHeight:1.8 }}>
          <strong style={{ color:C.text }}>How to use:</strong> Toggle the detailer online → tap "Book Nearby" on the client → confirm the booking → watch the detailer get the request → accept it → work through the job steps. Or tap <strong style={{ color:C.green }}>Auto Demo</strong> to see it all play out automatically.
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════
   ROOT APP — STATE MACHINE
══════════════════════════════════════ */
export default function Ecosystem() {
  const [tab, setTab]   = useState("demo");
  const [state, setState] = useState({ ...INIT });
  const timers = useRef([]);

  const addEvent = (em, text) => {
    const time = new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit" });
    setState(s => ({ ...s, events:[...s.events, { em, text, time }] }));
  };

  const dispatch = (action) => {
    switch (action) {
      case "TOGGLE_ONLINE":
        setState(s => {
          const next = !s.detailerOnline;
          addEvent(next?"🟢":"⚫", next?"Detailer went online — accepting requests":"Detailer went offline");
          return { ...s, detailerOnline:next };
        });
        break;

      case "BOOK":
        setState(s => ({ ...s, flow:"booking" }));
        addEvent("📱","Client opened booking flow — selecting service");
        break;

      case "CONFIRM":
        setState(s => ({ ...s, flow:"request", countdown:15 }));
        addEvent("📋","Client confirmed booking — Full Mobile Detail · $98.99");
        addEvent("🔔","Request sent to FreshRide Detail · 15 seconds to respond");
        // start countdown
        const cd = setInterval(() => {
          setState(s => {
            if (s.countdown <= 1) { clearInterval(cd); return { ...s, countdown:0 }; }
            return { ...s, countdown:s.countdown-1 };
          });
        }, 1000);
        timers.current.push(cd);
        break;

      case "ACCEPT":
        timers.current.forEach(t => clearInterval(t));
        setState(s => ({ ...s, flow:"accepted", jobStep:0 }));
        addEvent("✅","Detailer accepted the job!");
        addEvent("📡","Client notified — FreshRide Detail is on the way");
        addEvent("💬","Chat channel opened between client and detailer");
        break;

      case "DECLINE":
        timers.current.forEach(t => clearInterval(t));
        setState(s => ({ ...s, flow:"idle" }));
        addEvent("✕","Detailer declined — searching for next available pro");
        break;

      case "TRACK":
        setState(s => ({ ...s, flow:"enroute" }));
        addEvent("🗺️","Client opened live tracking · Detailer en route");
        break;

      case "JOB_STEP":
        setState(s => {
          const next = s.jobStep + 1;
          const msgs = [
            "Detailer started route to client",
            "Detailer arrived at location · Service starting",
            "Service in progress",
          ];
          if (next <= 3) addEvent(["🚐","📍","🧹","🎉"][next-1], msgs[next-1]||"");
          if (next >= 4) {
            addEvent("🎉","Job complete! +$85.50 earned");
            addEvent("💰","Dashboard earnings updated · Client rating prompt sent");
            addEvent("💳","Payout queued for weekly transfer");
            return { ...s, jobStep:4, flow:"complete", earnings:s.earnings+85.50, totalEarnings:s.totalEarnings+85.50 };
          }
          return { ...s, jobStep:next, flow:next>=1?"enroute":s.flow };
        });
        break;

      case "RESET":
        timers.current.forEach(t => clearInterval(t));
        setState({ ...INIT });
        break;

      case "AUTO_DEMO":
        timers.current.forEach(t => clearInterval(t));
        setState({ ...INIT, autoPlaying:true });

        const schedule = [
          [600,  () => dispatch("TOGGLE_ONLINE")],
          [2000, () => dispatch("BOOK")],
          [3500, () => dispatch("CONFIRM")],
          [7000, () => dispatch("ACCEPT")],
          [8500, () => dispatch("TRACK")],
          [11000,() => dispatch("JOB_STEP")],
          [13000,() => dispatch("JOB_STEP")],
          [15000,() => dispatch("JOB_STEP")],
          [17000,() => dispatch("JOB_STEP")],
          [18500,() => setState(s => ({ ...s, autoPlaying:false }))],
        ];
        schedule.forEach(([delay, fn]) => {
          const t = setTimeout(fn, delay);
          timers.current.push(t);
        });
        break;
    }
  };

  const TABS = [
    { id:"overview", label:"🗺️ Overview"  },
    { id:"demo",     label:"⚡ Live Demo" },
  ];

  return (
    <div style={{ background:C.bg, fontFamily:C.f, minHeight:"100vh" }}>
      {/* Top bar */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`,
        padding:"12px 20px", display:"flex", alignItems:"center", gap:16, position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginRight:"auto" }}>
          <div style={{ width:30, height:30, borderRadius:8, background:`${C.green}25`,
            border:`1px solid ${C.green}50`, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:15 }}>🚐</div>
          <div>
            <div style={{ fontSize:14, fontWeight:900, color:C.text }}>Detailr</div>
            <div style={{ fontSize:9, color:C.green, fontWeight:700 }}>Ecosystem Hub</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding:"7px 16px", borderRadius:20, border:"none", cursor:"pointer",
                fontFamily:C.f, fontSize:12, fontWeight:700, transition:"all .2s",
                background:tab===t.id?C.green:C.card, color:tab===t.id?"white":C.sub }}>
              {t.label}
            </button>
          ))}
        </div>
        {/* Live indicator */}
        {state.detailerOnline && (
          <div style={{ display:"flex", alignItems:"center", gap:6, background:`${C.green}12`,
            border:`1px solid ${C.green}35`, borderRadius:20, padding:"5px 12px" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.green,
              animation:"blink 1s infinite" }}/>
            <span style={{ fontSize:10, fontWeight:700, color:C.green }}>LIVE</span>
          </div>
        )}
      </div>

      {/* Tab content */}
      {tab === "overview" && <OverviewTab/>}
      {tab === "demo"     && <DemoTab state={state} dispatch={dispatch}/>}
    </div>
  );
}
