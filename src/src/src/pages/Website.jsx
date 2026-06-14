import { useState } from "react";

/* ─── Font + global styles ─── */
(() => {
  if (document.getElementById("web-font")) return;
  const l = document.createElement("link");
  l.id = "web-font"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap";
  document.head.appendChild(l);
  const s = document.createElement("style");
  s.textContent = `*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Outfit',sans-serif;background:#07080F;color:#EEF2FF}html{scroll-behavior:smooth}input,select,textarea,button{font-family:inherit}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1A2035;border-radius:2px}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`;
  document.head.appendChild(s);
})();

const C = {
  bg:"#07080F", surface:"#0C0E18", card:"#111420",
  border:"rgba(255,255,255,0.08)", green:"#00C896",
  blue:"#4F8EF7", amber:"#F5A623", red:"#EF4444",
  text:"#EEF2FF", sub:"#8892A4", dim:"#161926",
  f:"'Outfit',sans-serif",
};

/* ─── Atoms ─── */
const GreenBtn = ({ children, onClick, style: s = {} }) => (
  <button onClick={onClick} style={{ padding:"13px 26px", borderRadius:12, background:C.green,
    color:"white", border:"none", fontSize:15, fontWeight:700, cursor:"pointer",
    boxShadow:`0 4px 20px ${C.green}45`, transition:"all .2s", ...s }}>
    {children}
  </button>
);
const OutlineBtn = ({ children, onClick, col = C.green, style: s = {} }) => (
  <button onClick={onClick} style={{ padding:"13px 26px", borderRadius:12, background:"transparent",
    color:col, border:`1.5px solid ${col}50`, fontSize:15, fontWeight:700, cursor:"pointer", ...s }}>
    {children}
  </button>
);
const SectionTag = ({ children, col = C.green }) => (
  <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:`${col}15`,
    border:`1px solid ${col}35`, borderRadius:20, padding:"6px 14px",
    fontSize:12, fontWeight:700, color:col, marginBottom:16, letterSpacing:.5 }}>
    {children}
  </div>
);

/* ─── Phone mockup ─── */
const PhoneMockup = ({ tint = C.green }) => (
  <div style={{ width:155, height:308, borderRadius:26, background:"#0A0B12",
    border:"2px solid rgba(255,255,255,0.1)", position:"relative",
    boxShadow:`0 30px 60px rgba(0,0,0,0.7)`, overflow:"hidden", flexShrink:0 }}>
    <div style={{ height:18, background:"#0A0B12", display:"flex", justifyContent:"space-between",
      alignItems:"center", padding:"0 10px", fontSize:7, color:"rgba(255,255,255,0.5)", fontWeight:700 }}>
      <span>9:41</span><span>●●● 🔋</span>
    </div>
    <div style={{ height:95, background:"#141824", position:"relative", overflow:"hidden" }}>
      <svg width="100%" height="100%" viewBox="0 0 155 95" preserveAspectRatio="none">
        <rect width="155" height="95" fill="#141824"/>
        {[[6,10,35,20],[46,10,34,20],[85,10,38,20],[128,10,22,20],
          [6,38,35,20],[46,38,34,20],[85,38,38,20],[128,38,22,20],
          [6,66,35,22],[46,66,34,22],[85,66,38,22]].map(([x,y,w,h],i)=>(
          <rect key={i} x={x} y={y} width={w} height={h} fill="#1A2035" rx="2"/>
        ))}
        {[6,35,63].map((y,i)=><rect key={i} x="0" y={y} width="155" height="4" fill="#1D2540"/>)}
        {[44,83,126].map((x,i)=><rect key={i} x={x} y="0" width="4" height="95" fill="#1D2540"/>)}
      </svg>
      <div style={{ position:"absolute", left:"50%", top:"58%", transform:"translate(-50%,-50%)" }}>
        <div style={{ width:8, height:8, borderRadius:"50%", background:tint,
          border:"2px solid white", boxShadow:`0 0 8px ${tint}` }}/>
      </div>
      <div style={{ position:"absolute", left:"27%", top:"34%", transform:"translate(-50%,-100%)" }}>
        <div style={{ background:C.blue, borderRadius:"5px 5px 5px 1px",
          padding:"2px 5px", fontSize:6, fontWeight:800, color:"white" }}>12 min</div>
      </div>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:28,
        background:`linear-gradient(transparent,#07080F)` }}/>
    </div>
    <div style={{ padding:"7px 9px" }}>
      <div style={{ background:"#111420", borderRadius:7, padding:"5px 7px", marginBottom:5,
        display:"flex", alignItems:"center", gap:5 }}>
        <span style={{ fontSize:8 }}>🔍</span>
        <span style={{ fontSize:8, color:C.sub }}>Where do you need detailing?</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:3, marginBottom:7 }}>
        {["✨","📅","💬","💳"].map(em=>(
          <div key={em} style={{ background:"#111420", borderRadius:5, padding:"5px 2px",
            textAlign:"center", fontSize:11 }}>{em}</div>
        ))}
      </div>
      <div style={{ fontSize:8, fontWeight:700, color:C.text, marginBottom:5 }}>Nearby Detailers</div>
      {[{n:"FreshRide",r:"4.9",c:C.blue},{n:"AutoSpark",r:"4.8",c:tint}].map(d=>(
        <div key={d.n} style={{ background:"#111420", borderRadius:7, padding:"5px 7px",
          marginBottom:3, display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:16, height:16, borderRadius:"50%", background:`${d.c}25`,
            border:`1px solid ${d.c}50`, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:6, color:d.c, fontWeight:700, flexShrink:0 }}>
            {d.n[0]}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:7, fontWeight:700, color:C.text }}>{d.n}</div>
            <div style={{ fontSize:6, color:C.sub }}>⭐ {d.r}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AppBadges = ({ size = "normal" }) => (
  <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
    {[{ em:"🍎", store:"App Store", sub:"Download on the" },
      { em:"▶️",  store:"Google Play", sub:"Get it on" }].map(({ em, store, sub }) => (
      <button key={store} style={{ display:"flex", alignItems:"center", gap:10,
        padding:size==="large"?"13px 20px":"10px 16px", background:C.card,
        border:`1px solid ${C.border}`, borderRadius:12, cursor:"pointer" }}>
        <span style={{ fontSize:size==="large"?24:20 }}>{em}</span>
        <div style={{ textAlign:"left" }}>
          <div style={{ fontSize:10, color:C.sub }}>{sub}</div>
          <div style={{ fontSize:size==="large"?14:12, fontWeight:800, color:C.text }}>{store}</div>
        </div>
      </button>
    ))}
  </div>
);

/* ── NAVBAR ── */
const Navbar = ({ onNav }) => (
  <nav style={{ position:"sticky", top:0, zIndex:100, background:"rgba(7,8,15,0.92)",
    backdropFilter:"blur(12px)", borderBottom:`1px solid ${C.border}`,
    padding:"14px 24px", display:"flex", alignItems:"center", gap:14 }}>
    <div style={{ display:"flex", alignItems:"center", gap:8, marginRight:"auto" }}>
      <div style={{ width:32, height:32, borderRadius:9, background:`${C.green}25`,
        border:`1px solid ${C.green}50`, display:"flex", alignItems:"center",
        justifyContent:"center", fontSize:16 }}>🚐</div>
      <span style={{ fontSize:18, fontWeight:900, color:C.text }}>Detailr</span>
    </div>
    {[["How it Works","how"],["Services","services"],["For Detailers","detailers"],["Book Online","book"]].map(([l,id])=>(
      <button key={id} onClick={() => onNav(id)} style={{ background:"none", border:"none",
        color:C.sub, fontSize:13, fontWeight:600, cursor:"pointer", padding:"4px 8px" }}>{l}</button>
    ))}
    <GreenBtn onClick={() => onNav("book")} style={{ padding:"9px 20px", fontSize:13 }}>Book Now</GreenBtn>
  </nav>
);

/* ── HERO ── */
const HeroSection = ({ onBook, onJoin }) => (
  <section style={{ padding:"60px 24px 50px", position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", top:"50%", left:"35%", transform:"translate(-50%,-50%)",
      width:500, height:400, borderRadius:"50%", pointerEvents:"none",
      background:`radial-gradient(ellipse,${C.green}12 0%,transparent 70%)` }}/>
    <div style={{ display:"flex", alignItems:"center", gap:28, position:"relative" }}>
      <div style={{ flex:1, minWidth:0 }}>
        <SectionTag>🇨🇦 Canada's Mobile Detailing Marketplace</SectionTag>
        <h1 style={{ fontSize:40, fontWeight:900, color:C.text, lineHeight:1.15, marginBottom:16 }}>
          Premium car care,<br/><span style={{ color:C.green }}>at your driveway.</span>
        </h1>
        <p style={{ fontSize:15, color:C.sub, lineHeight:1.7, marginBottom:26, maxWidth:380 }}>
          Book a professional mobile detailer in minutes. They come to you — no drop-off, no waiting. Pay securely in-app.
        </p>
        <div style={{ display:"flex", gap:12, marginBottom:26, flexWrap:"wrap" }}>
          <GreenBtn onClick={onBook}>Book a Detailer</GreenBtn>
          <OutlineBtn onClick={onJoin} col={C.sub}>Become a Detailer →</OutlineBtn>
        </div>
        <AppBadges/>
        <div style={{ display:"flex", gap:18, marginTop:22, flexWrap:"wrap" }}>
          {["✓ No drop-off needed","✓ Verified pros","✓ Pay in-app"].map(t=>(
            <span key={t} style={{ fontSize:12, color:C.sub, fontWeight:600 }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:14, alignItems:"center", flexShrink:0 }}>
        <div style={{ animation:"float 4s ease-in-out infinite" }}><PhoneMockup tint={C.green}/></div>
        <div style={{ animation:"float 4s ease-in-out infinite", animationDelay:".5s", marginTop:36 }}>
          <PhoneMockup tint={C.blue}/>
        </div>
      </div>
    </div>
  </section>
);

/* ── STATS ── */
const StatsBar = () => (
  <section style={{ background:C.surface, borderTop:`1px solid ${C.border}`,
    borderBottom:`1px solid ${C.border}`, padding:"20px 24px" }}>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, textAlign:"center" }}>
      {[{val:"3",label:"Canadian Cities",em:"🏙️"},{val:"200+",label:"Active Detailers",em:"🧑‍🔧"},
        {val:"12,000+",label:"Happy Clients",em:"⭐"},{val:"$1M+",label:"Paid to Pros",em:"💰"}].map(({val,label,em})=>(
        <div key={label}>
          <div style={{ fontSize:11, marginBottom:4 }}>{em}</div>
          <div style={{ fontSize:24, fontWeight:900, color:C.green }}>{val}</div>
          <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>{label}</div>
        </div>
      ))}
    </div>
  </section>
);

/* ── HOW IT WORKS ── */
const HowSection = ({ onBook }) => (
  <section id="how" style={{ padding:"60px 24px" }}>
    <div style={{ textAlign:"center", marginBottom:36 }}>
      <SectionTag>HOW IT WORKS</SectionTag>
      <h2 style={{ fontSize:32, fontWeight:900, color:C.text }}>Clean car in 4 easy steps</h2>
      <p style={{ fontSize:15, color:C.sub, marginTop:10 }}>From booking to gleaming — without leaving home.</p>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14, marginBottom:32 }}>
      {[{n:1,em:"📱",title:"Download the app",body:"Get Detailr free on iOS or Android. Sign up in under a minute."},
        {n:2,em:"📍",title:"Pick a service & time",body:"Choose your service. Book right now or schedule for later — your call."},
        {n:3,em:"🚐",title:"We come to you",body:"A verified pro arrives at your home, office, or anywhere your car is parked."},
        {n:4,em:"✅",title:"Pay & review",body:"Pay securely in-app when the job's done. Rate your detailer to help the community."}
      ].map(({n,em,title,body})=>(
        <div key={n} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16,
          padding:22, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-10, right:10, fontSize:70, fontWeight:900,
            color:"rgba(255,255,255,0.03)", lineHeight:1 }}>{n}</div>
          <div style={{ width:46, height:46, borderRadius:13, background:`${C.green}15`,
            border:`1px solid ${C.green}30`, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:22, marginBottom:12 }}>{em}</div>
          <div style={{ fontSize:15, fontWeight:800, color:C.text, marginBottom:8 }}>{title}</div>
          <div style={{ fontSize:13, color:C.sub, lineHeight:1.7 }}>{body}</div>
        </div>
      ))}
    </div>
    <div style={{ textAlign:"center" }}>
      <GreenBtn onClick={onBook} style={{ fontSize:16, padding:"15px 36px" }}>Book Your First Detail</GreenBtn>
    </div>
  </section>
);

/* ── SERVICES ── */
const ServicesSection = ({ onBook }) => (
  <section id="services" style={{ padding:"60px 24px", background:C.surface,
    borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
    <div style={{ textAlign:"center", marginBottom:32 }}>
      <SectionTag col={C.blue}>OUR SERVICES</SectionTag>
      <h2 style={{ fontSize:32, fontWeight:900, color:C.text }}>Every level of clean, covered.</h2>
      <p style={{ fontSize:15, color:C.sub, marginTop:10 }}>All services are mobile — your detailer brings everything.</p>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, marginBottom:28 }}>
      {[{em:"🚿",name:"Basic Mobile Wash",  price:"$35", dur:"45 min",items:["Exterior hand wash","Wheel cleaning","Tire shine"],col:"#4F8EF7"},
        {em:"🪑",name:"Interior Detail",    price:"$55", dur:"60 min",items:["Full vacuum","Dashboard cleaning","Windows"],col:"#8B5CF6"},
        {em:"✨",name:"Full Mobile Detail", price:"$95", dur:"90 min",items:["Interior + exterior","Hand wash & wax","Tire shine"],col:C.green,hot:true},
        {em:"💎",name:"Ceramic Boost",      price:"$149",dur:"2 hrs", items:["Paint decon","Ceramic protection","6-month warranty"],col:"#F5A623"}
      ].map(({em,name,price,dur,items,col,hot})=>(
        <div key={name} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:18 }}>
          {hot&&<div style={{ fontSize:10,fontWeight:800,color:"#F97316",marginBottom:8,letterSpacing:.5 }}>🔥 MOST POPULAR</div>}
          <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
            <div style={{ width:48, height:48, borderRadius:13, background:`${col}18`, border:`1px solid ${col}30`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{em}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:800, color:C.text }}>{name}</div>
              <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>⏱ {dur}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:20, fontWeight:900, color:col }}>{price}</div>
              <div style={{ fontSize:10, color:C.sub }}>per visit</div>
            </div>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
            {items.map(it=>(
              <span key={it} style={{ fontSize:11,padding:"3px 9px",borderRadius:20,background:`${col}12`,color:col }}>✓ {it}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div style={{ textAlign:"center" }}>
      <GreenBtn onClick={onBook}>Book a Service Today</GreenBtn>
    </div>
  </section>
);

/* ── FOR DETAILERS ── */
const DetailersSection = ({ onJoin }) => (
  <section id="detailers" style={{ padding:"60px 24px" }}>
    <div style={{ display:"flex", gap:28, alignItems:"flex-start", flexWrap:"wrap" }}>
      <div style={{ flex:1, minWidth:240 }}>
        <SectionTag>FOR DETAILERS</SectionTag>
        <h2 style={{ fontSize:32, fontWeight:900, color:C.text, lineHeight:1.2, marginBottom:14 }}>
          Turn your skills<br/><span style={{ color:C.green }}>into income.</span>
        </h2>
        <p style={{ fontSize:14, color:C.sub, lineHeight:1.7, marginBottom:22 }}>
          Join hundreds of professional detailers across Canada already earning on Detailr. Set up your profile in under 10 minutes.
        </p>
        <div style={{ background:`${C.green}08`, border:`1px solid ${C.green}25`,
          borderRadius:14, padding:18, marginBottom:22 }}>
          <div style={{ fontSize:11, color:C.sub, fontWeight:700, marginBottom:10 }}>EXAMPLE WEEKLY EARNINGS</div>
          {[{l:"3 Full Details",v:"+$255.00"},{l:"2 Ceramic Boosts",v:"+$267.00"},
            {l:"5 Interior Details",v:"+$247.50"},{l:"Platform fee (10%)",v:"− $76.95"},
            {l:"NET WEEKLY",v:"$692.55",bold:true}].map(({l,v,bold})=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between",
              padding:"6px 0", borderBottom:!bold?`1px solid ${C.border}`:"none" }}>
              <span style={{ fontSize:12, color:bold?C.text:C.sub, fontWeight:bold?700:400 }}>{l}</span>
              <span style={{ fontSize:bold?18:13, fontWeight:bold?900:600,
                color:bold?C.green:v.startsWith("-")?C.red:C.text }}>{v}</span>
            </div>
          ))}
        </div>
        <GreenBtn onClick={onJoin} style={{ width:"100%", fontSize:15, padding:"14px" }}>
          Join as a Detailer — It's Free
        </GreenBtn>
        <div style={{ textAlign:"center", fontSize:12, color:C.sub, marginTop:8 }}>
          No upfront cost · Background check required · Canada only
        </div>
      </div>
      <div style={{ flex:1, minWidth:240 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
          {[{em:"🕐",title:"Set your own hours",body:"Work when you want. Go online from the app and start receiving jobs instantly."},
            {em:"💰",title:"Keep 90% of earnings",body:"We take just 10%. You keep the rest, paid weekly to your bank."},
            {em:"📅",title:"Manage your schedule",body:"Set availability by day and hour. Scheduled jobs fit around your life."},
            {em:"📍",title:"Work in your city",body:"Set your service radius. No long drives unless you choose them."},
            {em:"⭐",title:"Build your reputation",body:"Every job builds your rating. Top detailers get featured and earn more."},
            {em:"🛡️",title:"We handle payments",body:"No chasing invoices. Clients pay in-app. You get paid automatically."}
          ].map(({em,title,body})=>(
            <div key={title} style={{ background:C.card, border:`1px solid ${C.border}`,
              borderRadius:13, padding:14 }}>
              <div style={{ fontSize:22, marginBottom:8 }}>{em}</div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:5 }}>{title}</div>
              <div style={{ fontSize:11, color:C.sub, lineHeight:1.6 }}>{body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ── BOOK ONLINE ── */
const BookSection = () => {
  const [step,setStep]=useState(0);
  const [svc,setSvc]=useState(null);
  const [date,setDate]=useState("");
  const [time,setTime]=useState("");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [addr,setAddr]=useState("");
  const [phone,setPhone]=useState("");
  const [done,setDone]=useState(false);
  const SVCS=[{id:1,name:"Basic Mobile Wash",price:"$35",em:"🚿"},{id:2,name:"Interior Detail",price:"$55",em:"🪑"},
    {id:3,name:"Full Mobile Detail",price:"$95",em:"✨"},{id:4,name:"Ceramic Boost",price:"$149",em:"💎"}];
  const TIMES=["9:00 AM","10:30 AM","12:00 PM","1:30 PM","3:00 PM","4:30 PM"];
  const STEPS=["Service","Date & Time","Your Details","Confirm"];

  if(done) return(
    <section id="book" style={{ padding:"60px 24px", background:C.surface, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:460, margin:"0 auto", textAlign:"center" }}>
        <div style={{ fontSize:60, marginBottom:14 }}>🎉</div>
        <h2 style={{ fontSize:26, fontWeight:900, color:C.text, marginBottom:10 }}>Booking Confirmed!</h2>
        <p style={{ fontSize:14, color:C.sub, lineHeight:1.7, marginBottom:22 }}>
          Confirmation sent to <strong style={{ color:C.text }}>{email}</strong>. Download the app for live tracking and chat.
        </p>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:18, marginBottom:22, textAlign:"left" }}>
          {[{l:"Service",v:svc?.name},{l:"Date",v:date},{l:"Time",v:time},{l:"Address",v:addr}].map(({l,v})=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:13, color:C.sub }}>{l}</span>
              <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{v}</span>
            </div>
          ))}
        </div>
        <AppBadges size="large"/>
      </div>
    </section>
  );

  return(
    <section id="book" style={{ padding:"60px 24px", background:C.surface, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:540, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <SectionTag col={C.blue}>BOOK ONLINE</SectionTag>
          <h2 style={{ fontSize:30, fontWeight:900, color:C.text }}>No app? No problem.</h2>
          <p style={{ fontSize:14, color:C.sub, marginTop:8 }}>Book from the web. Download the app later for live tracking.</p>
        </div>
        <div style={{ display:"flex", gap:4, marginBottom:24 }}>
          {STEPS.map((s,i)=>(
            <div key={s} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <div style={{ width:"100%", height:3, borderRadius:2,
                background:i<step?C.green:i===step?C.blue:C.dim, transition:"background .3s" }}/>
              <span style={{ fontSize:9, fontWeight:700, color:i<=step?C.blue:C.sub }}>{s.toUpperCase()}</span>
            </div>
          ))}
        </div>

        {step===0&&(
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:12 }}>What service do you need?</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:18 }}>
              {SVCS.map(s=>{
                const sel=svc?.id===s.id;
                return(<div key={s.id} onClick={()=>setSvc(s)}
                  style={{ background:sel?`${C.green}12`:C.card, border:`1.5px solid ${sel?C.green:C.border}`,
                    borderRadius:13, padding:16, cursor:"pointer", transition:"all .2s" }}>
                  <div style={{ fontSize:26, marginBottom:6 }}>{s.em}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{s.name}</div>
                  <div style={{ fontSize:16, fontWeight:900, color:sel?C.green:C.sub, marginTop:4 }}>{s.price}</div>
                </div>);
              })}
            </div>
            <button onClick={()=>svc&&setStep(1)} disabled={!svc}
              style={{ width:"100%", padding:"14px", borderRadius:12, background:svc?C.green:C.dim,
                color:svc?"white":C.sub, border:"none", fontSize:15, fontWeight:700, cursor:svc?"pointer":"default" }}>
              Continue →
            </button>
          </div>
        )}

        {step===1&&(
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>When do you want it done?</div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.sub, marginBottom:6, letterSpacing:.5 }}>DATE</div>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)}
                style={{ width:"100%", padding:"12px 13px", background:C.card, border:`1px solid ${C.border}`,
                  borderRadius:10, color:C.text, fontSize:14, outline:"none" }}/>
            </div>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.sub, marginBottom:8, letterSpacing:.5 }}>TIME</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                {TIMES.map(t=>(
                  <div key={t} onClick={()=>setTime(t)}
                    style={{ padding:"10px 8px", borderRadius:10, textAlign:"center",
                      background:time===t?C.blue:C.card, border:`1px solid ${time===t?C.blue:C.border}`,
                      cursor:"pointer", fontSize:12, fontWeight:700, color:time===t?"white":C.text, transition:"all .2s" }}>{t}</div>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setStep(0)} style={{ flex:1, padding:"12px", borderRadius:12, background:C.dim,
                border:"none", color:C.sub, fontSize:13, fontWeight:700, cursor:"pointer" }}>← Back</button>
              <button onClick={()=>date&&time&&setStep(2)} disabled={!date||!time}
                style={{ flex:2, padding:"12px", borderRadius:12, background:date&&time?C.green:C.dim,
                  color:date&&time?"white":C.sub, border:"none", fontSize:13, fontWeight:700, cursor:date&&time?"pointer":"default" }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {step===2&&(
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>Your details</div>
            {[{l:"Full Name",v:name,s:setName,ph:"Alex Johnson",t:"text"},{l:"Email",v:email,s:setEmail,ph:"alex@email.com",t:"email"},
              {l:"Phone",v:phone,s:setPhone,ph:"+1 (204) 555-0100",t:"tel"},{l:"Service Address",v:addr,s:setAddr,ph:"Where should we come?",t:"text"}
            ].map(({l,v,s,ph,t})=>(
              <div key={l} style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.sub, marginBottom:5, letterSpacing:.5 }}>{l.toUpperCase()}</div>
                <input type={t} value={v} onChange={e=>s(e.target.value)} placeholder={ph}
                  style={{ width:"100%", padding:"11px 13px", background:C.card, border:`1px solid ${C.border}`,
                    borderRadius:10, color:C.text, fontSize:13, outline:"none" }}/>
              </div>
            ))}
            <div style={{ display:"flex", gap:10, marginTop:4 }}>
              <button onClick={()=>setStep(1)} style={{ flex:1, padding:"12px", borderRadius:12, background:C.dim,
                border:"none", color:C.sub, fontSize:13, fontWeight:700, cursor:"pointer" }}>← Back</button>
              <button onClick={()=>name&&email&&addr&&setStep(3)} disabled={!name||!email||!addr}
                style={{ flex:2, padding:"12px", borderRadius:12, background:name&&email&&addr?C.green:C.dim,
                  color:name&&email&&addr?"white":C.sub, border:"none", fontSize:13, fontWeight:700,
                  cursor:name&&email&&addr?"pointer":"default" }}>Review →</button>
            </div>
          </div>
        )}

        {step===3&&(
          <div>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:18, marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:12 }}>Booking Summary</div>
              {[{l:"Service",v:svc?.name},{l:"Date",v:date},{l:"Time",v:time},{l:"Address",v:addr},{l:"Name",v:name},{l:"Email",v:email}].map(({l,v})=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:12, color:C.sub }}>{l}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:C.text, maxWidth:"55%", textAlign:"right" }}>{v}</span>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:10 }}>
                <span style={{ fontSize:14, fontWeight:700, color:C.text }}>Total</span>
                <span style={{ fontSize:22, fontWeight:900, color:C.green }}>{svc?.price}</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setStep(2)} style={{ flex:1, padding:"13px", borderRadius:12, background:C.dim,
                border:"none", color:C.sub, fontSize:13, fontWeight:700, cursor:"pointer" }}>← Back</button>
              <button onClick={()=>setDone(true)} style={{ flex:2, padding:"13px", borderRadius:12,
                background:C.green, border:"none", color:"white", fontSize:15, fontWeight:800,
                cursor:"pointer", boxShadow:`0 4px 16px ${C.green}45` }}>🚗 Confirm Booking</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

/* ── DETAILER SIGNUP ── */
const SignupSection = () => {
  const [f,setF]=useState({name:"",email:"",phone:"",city:"",exp:""});
  const [done,setDone]=useState(false);
  const set=k=>e=>setF(v=>({...v,[k]:e.target.value}));
  const valid=f.name&&f.email&&f.city;

  if(done) return(
    <section id="join" style={{ padding:"60px 24px", background:C.surface, borderTop:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:440, margin:"0 auto", textAlign:"center" }}>
        <div style={{ fontSize:60, marginBottom:14 }}>🙌</div>
        <h2 style={{ fontSize:26, fontWeight:900, color:C.text }}>Application Received!</h2>
        <p style={{ fontSize:14, color:C.sub, marginTop:10, lineHeight:1.7 }}>
          We'll review your application and reach out to <strong style={{ color:C.text }}>{f.email}</strong> within 2 business days.
        </p>
      </div>
    </section>
  );

  return(
    <section id="join" style={{ padding:"60px 24px", background:C.surface, borderTop:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:500, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <SectionTag>JOIN THE TEAM</SectionTag>
          <h2 style={{ fontSize:30, fontWeight:900, color:C.text }}>Start earning as a detailer</h2>
          <p style={{ fontSize:14, color:C.sub, marginTop:8 }}>Takes 5 minutes. Background check required. Canada only.</p>
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:22 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            {[{l:"Full Name",k:"name",ph:"Marcus K.",t:"text"},{l:"Email",k:"email",ph:"marcus@email.com",t:"email"},
              {l:"Phone",k:"phone",ph:"+1 (204) 555-0000",t:"tel"},{l:"City",k:"city",ph:"Winnipeg, MB",t:"text"}
            ].map(({l,k,ph,t})=>(
              <div key={k}>
                <div style={{ fontSize:11, fontWeight:700, color:C.sub, marginBottom:5, letterSpacing:.5 }}>{l.toUpperCase()}</div>
                <input type={t} value={f[k]} onChange={set(k)} placeholder={ph}
                  style={{ width:"100%", padding:"10px 12px", background:C.dim, border:`1px solid ${C.border}`,
                    borderRadius:9, color:C.text, fontSize:13, outline:"none" }}/>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.sub, marginBottom:5, letterSpacing:.5 }}>YEARS OF EXPERIENCE</div>
            <select value={f.exp} onChange={set("exp")}
              style={{ width:"100%", padding:"10px 12px", background:C.dim, border:`1px solid ${C.border}`,
                borderRadius:9, color:f.exp?C.text:C.sub, fontSize:13, outline:"none" }}>
              <option value="">Select experience level</option>
              <option value="0-1">Less than 1 year</option>
              <option value="1-3">1–3 years</option>
              <option value="3-5">3–5 years</option>
              <option value="5+">5+ years</option>
            </select>
          </div>
          <div style={{ background:`${C.green}08`, border:`1px solid ${C.green}20`, borderRadius:10,
            padding:"11px 13px", marginBottom:16, fontSize:12, color:C.sub, lineHeight:1.7 }}>
            <span style={{ color:C.green, fontWeight:700 }}>What you'll need:</span> Valid ID · Background check (we cover the cost) · Your own equipment · Liability insurance
          </div>
          <button onClick={()=>valid&&setDone(true)} disabled={!valid}
            style={{ width:"100%", padding:"14px", borderRadius:12, background:valid?C.green:C.dim,
              color:valid?"white":C.sub, border:"none", fontSize:15, fontWeight:800,
              cursor:valid?"pointer":"default", boxShadow:valid?`0 4px 20px ${C.green}45`:"none" }}>
            Apply to Join Detailr
          </button>
          <div style={{ textAlign:"center", fontSize:11, color:C.sub, marginTop:8 }}>Free to apply · No upfront fees · Get paid weekly</div>
        </div>
      </div>
    </section>
  );
};

/* ── DOWNLOAD ── */
const DownloadSection = () => (
  <section style={{ padding:"60px 24px", textAlign:"center" }}>
    <div style={{ maxWidth:460, margin:"0 auto" }}>
      <div style={{ fontSize:48, marginBottom:14 }}>📱</div>
      <h2 style={{ fontSize:30, fontWeight:900, color:C.text, marginBottom:10 }}>Get the Detailr app</h2>
      <p style={{ fontSize:14, color:C.sub, lineHeight:1.7, marginBottom:24 }}>
        Live tracking, in-app chat, instant booking, and more. Free on iOS and Android.
      </p>
      <div style={{ display:"flex", justifyContent:"center", gap:12, marginBottom:28 }}>
        <AppBadges size="large"/>
      </div>
      <div style={{ display:"inline-block", background:C.card, border:`1px solid ${C.border}`,
        borderRadius:14, padding:18, textAlign:"center" }}>
        <div style={{ width:88, height:88, background:C.dim, borderRadius:8, margin:"0 auto 8px",
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:4 }}>
            {Array(25).fill(0).map((_,i)=>(
              <div key={i} style={{ width:12, height:12, borderRadius:2,
                background:[0,2,4,10,14,20,22,24,6,12,18].includes(i)?C.green:C.dim }}/>
            ))}
          </div>
        </div>
        <div style={{ fontSize:11, color:C.sub }}>Scan to download</div>
      </div>
    </div>
  </section>
);

/* ── FOOTER ── */
const Footer = () => (
  <footer style={{ background:C.surface, borderTop:`1px solid ${C.border}`, padding:"32px 24px 24px" }}>
    <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:20, marginBottom:24 }}>
      <div style={{ maxWidth:200 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:`${C.green}25`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🚐</div>
          <span style={{ fontSize:17, fontWeight:900, color:C.text }}>Detailr</span>
        </div>
        <p style={{ fontSize:12, color:C.sub, lineHeight:1.7 }}>
          Canada's mobile car detailing marketplace. Connecting clients with pros across the country.
        </p>
      </div>
      {[{title:"Clients",links:["Book Online","How it Works","Services","FAQ"]},
        {title:"Detailers",links:["Join the Team","Detailer App","Earnings","Support"]},
        {title:"Company",links:["About","Blog","Careers","Press"]},
        {title:"Legal",links:["Privacy","Terms","Cookies"]}
      ].map(({title,links})=>(
        <div key={title}>
          <div style={{ fontSize:11, fontWeight:800, color:C.text, marginBottom:10, letterSpacing:.5 }}>{title.toUpperCase()}</div>
          {links.map(l=>(
            <div key={l} style={{ fontSize:13, color:C.sub, marginBottom:6, cursor:"pointer" }}>{l}</div>
          ))}
        </div>
      ))}
    </div>
    <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:18,
      display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
      <div style={{ fontSize:12, color:C.sub }}>© 2025 Detailr Inc. · Made in Winnipeg, Canada 🇨🇦</div>
      <div style={{ display:"flex", gap:14 }}>
        {["🐦 Twitter","📸 Instagram","💼 LinkedIn"].map(s=>(
          <span key={s} style={{ fontSize:12, color:C.sub, cursor:"pointer" }}>{s}</span>
        ))}
      </div>
    </div>
  </footer>
);

/* ── ROOT ── */
export default function Website() {
  const scrollTo = id => {
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  };
  return (
    <div style={{ background:C.bg, fontFamily:C.f, minHeight:"100vh", color:C.text }}>
      <Navbar onNav={scrollTo}/>
      <HeroSection onBook={()=>scrollTo("book")} onJoin={()=>scrollTo("join")}/>
      <StatsBar/>
      <HowSection onBook={()=>scrollTo("book")}/>
      <ServicesSection onBook={()=>scrollTo("book")}/>
      <DetailersSection onJoin={()=>scrollTo("join")}/>
      <BookSection/>
      <SignupSection/>
      <DownloadSection/>
      <Footer/>
    </div>
  );
}
