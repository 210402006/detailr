import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/* ─── Font + styles ─── */
(() => {
  if (document.getElementById("admin-font")) return;
  const l = document.createElement("link");
  l.id = "admin-font"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap";
  document.head.appendChild(l);
  const s = document.createElement("style");
  s.textContent = `*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Outfit',sans-serif}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#1E2535;border-radius:2px}input,button,select,textarea{font-family:inherit}@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}@keyframes slide-up{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse-dot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:.7}}`;
  document.head.appendChild(s);
})();

/* ─── Tokens ─── */
const C = {
  bg:"#07080F", panel:"#0C0E18", card:"#111420", card2:"#141828",
  border:"rgba(255,255,255,0.07)",
  admin:"#6366F1", green:"#00C896", blue:"#4F8EF7",
  amber:"#F59E0B", red:"#EF4444", orange:"#F97316",
  text:"#EEF2FF", sub:"#6B7591", dim:"#161926",
  f:"'Outfit',sans-serif",
};

/* ─── Mock data ─── */
const APPS = [
  { id:1, name:"Marcus K.",    city:"Winnipeg", exp:"3–5 yrs", applied:"Jun 1", svcs:["Full Detail","Ceramic Boost"], docs:true  },
  { id:2, name:"Tyler R.",     city:"Winnipeg", exp:"1–3 yrs", applied:"Jun 2", svcs:["Basic Wash","Interior"],       docs:true  },
  { id:3, name:"Priya S.",     city:"Brandon",  exp:"5+ yrs",  applied:"Jun 3", svcs:["All services"],                docs:false },
  { id:4, name:"Devon M.",     city:"Winnipeg", exp:"< 1 yr",  applied:"Jun 4", svcs:["Basic Wash"],                  docs:true  },
];

const BOOKINGS = [
  { id:"BK001", client:"Alex J.",   det:"FreshRide Detail", svc:"Full Mobile Detail", date:"Jun 5", total:95,  comm:9.50,  st:"Completed"   },
  { id:"BK002", client:"Sarah M.",  det:"AutoSpark Pro",    svc:"Ceramic Boost",      date:"Jun 5", total:149, comm:14.90, st:"In Progress"  },
  { id:"BK003", client:"Tom B.",    det:"ShineKing Mobile", svc:"Basic Wash",         date:"Jun 6", total:35,  comm:3.50,  st:"Confirmed"    },
  { id:"BK004", client:"Maya K.",   det:"FreshRide Detail", svc:"Interior Detail",    date:"Jun 6", total:55,  comm:5.50,  st:"Confirmed"    },
  { id:"BK005", client:"David R.",  det:"AutoSpark Pro",    svc:"Full Mobile Detail", date:"Jun 7", total:95,  comm:9.50,  st:"Pending"      },
  { id:"BK006", client:"Emma T.",   det:"ShineKing Mobile", svc:"Ceramic Boost",      date:"Jun 4", total:149, comm:14.90, st:"Completed"    },
  { id:"BK007", client:"Chris P.",  det:"FreshRide Detail", svc:"Basic Wash",         date:"Jun 3", total:35,  comm:3.50,  st:"Completed"    },
];

const DISPUTES = [
  { id:"DP001", bk:"BK006", client:"Emma T.",  det:"ShineKing Mobile", issue:"Spots missed on rear panels — client says job was incomplete", date:"Jun 4", amount:149, st:"Open",     priority:"High"   },
  { id:"DP002", bk:"BK003", client:"Tom B.",   det:"ShineKing Mobile", issue:"Detailer arrived 2+ hours late with no communication at all",  date:"Jun 3", amount:35,  st:"Open",     priority:"Medium" },
  { id:"DP003", bk:"BK001", client:"Alex J.",  det:"FreshRide Detail", issue:"Minor scratch noticed on driver door after service",            date:"Jun 2", amount:95,  st:"Resolved", priority:"High"   },
];

const USERS = [
  { name:"Alex Johnson",     email:"alex@email.com",      role:"client",   city:"Winnipeg", joined:"Mar 15", st:"Active",  count:7   },
  { name:"FreshRide Detail", email:"fresh@email.com",     role:"detailer", city:"Winnipeg", joined:"May 1",  st:"Active",  count:120 },
  { name:"Sarah M.",         email:"sarah@email.com",     role:"client",   city:"Winnipeg", joined:"Apr 20", st:"Active",  count:3   },
  { name:"AutoSpark Pro",    email:"auto@email.com",      role:"detailer", city:"Winnipeg", joined:"Apr 5",  st:"Active",  count:87  },
  { name:"Tom B.",           email:"tomb@email.com",      role:"client",   city:"Brandon",  joined:"May 10", st:"Active",  count:2   },
  { name:"ShineKing Mobile", email:"shine@email.com",     role:"detailer", city:"Winnipeg", joined:"Mar 20", st:"Warning", count:203 },
  { name:"Emma T.",          email:"emma@email.com",      role:"client",   city:"Winnipeg", joined:"Jun 1",  st:"Active",  count:1   },
  { name:"David R.",         email:"david@email.com",     role:"client",   city:"Winnipeg", joined:"Jun 2",  st:"Active",  count:1   },
];

const PAYOUTS = [
  { det:"FreshRide Detail",  jobs:8, gross:620.00, fee:62.00,  net:558.00, st:"Pending" },
  { det:"AutoSpark Pro",     jobs:5, gross:445.00, fee:44.50,  net:400.50, st:"Pending" },
  { det:"ShineKing Mobile",  jobs:3, gross:185.00, fee:18.50,  net:166.50, st:"Pending" },
  { det:"Marcus K.",         jobs:2, gross:130.00, fee:13.00,  net:117.00, st:"Paid"    },
];

const MONTHLY = [
  { m:"Jan", rev:1240, comm:124 }, { m:"Feb", rev:1890, comm:189 },
  { m:"Mar", rev:2340, comm:234 }, { m:"Apr", rev:3100, comm:310 },
  { m:"May", rev:3820, comm:382 }, { m:"Jun", rev:4650, comm:465 },
];
const BY_SVC = [
  { svc:"Basic Wash", n:34 }, { svc:"Interior", n:27 },
  { svc:"Full Detail", n:52 }, { svc:"Ceramic", n:12 },
];
const ACTIVITY = [
  { em:"📱", msg:"New client signed up — Emma T. (Winnipeg)",        time:"2m ago"  },
  { em:"✅", msg:"BK007 completed — +$3.50 commission",               time:"8m ago"  },
  { em:"🔔", msg:"New detailer application — Devon M. (Winnipeg)",   time:"14m ago" },
  { em:"⚠️", msg:"Dispute opened on BK003 — Tom B. vs ShineKing",   time:"22m ago" },
  { em:"🚐", msg:"BK002 started — Sarah M. + AutoSpark Pro",         time:"31m ago" },
  { em:"💳", msg:"Payout processed — FreshRide Detail $558.00",      time:"1h ago"  },
  { em:"📋", msg:"BK006 completed — +$14.90 commission",             time:"2h ago"  },
];

/* ─── Atoms ─── */
const Pill = ({ st }) => {
  const m = {
    Completed:C.green, Confirmed:C.blue, "In Progress":C.amber,
    Pending:C.sub, Open:C.red, Resolved:C.sub,
    Active:C.green, Warning:C.amber, Suspended:C.red,
    Paid:C.green, High:C.red, Medium:C.amber, Low:C.sub,
  };
  const c = m[st] || C.sub;
  return (
    <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px",
      borderRadius:20, background:`${c}20`, color:c }}>{st}</span>
  );
};

const StatCard = ({ label, val, sub, col, em, onClick }) => (
  <div onClick={onClick} style={{ background:C.card, border:`1px solid ${C.border}`,
    borderRadius:14, padding:16, cursor:onClick?"pointer":"default" }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
      <div style={{ fontSize:11, fontWeight:700, color:C.sub, letterSpacing:.5 }}>{label}</div>
      <div style={{ width:32, height:32, borderRadius:9, background:`${col}18`,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{em}</div>
    </div>
    <div style={{ fontSize:26, fontWeight:900, color:col }}>{val}</div>
    <div style={{ fontSize:11, color:C.sub, marginTop:4 }}>{sub}</div>
  </div>
);

const SLabel = ({ children }) => (
  <div style={{ fontSize:11, fontWeight:800, color:C.sub, letterSpacing:1, marginBottom:12 }}>{children}</div>
);

const ActionBtn = ({ children, onClick, col = C.admin, outline = false }) => (
  <button onClick={onClick} style={{ padding:"6px 14px", borderRadius:8, cursor:"pointer",
    fontFamily:C.f, fontSize:12, fontWeight:700, border:"none",
    background:outline?`${col}15`:col, color:outline?col:"white" }}>
    {children}
  </button>
);

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:8,
      padding:"8px 12px", fontSize:12, fontFamily:C.f, color:C.text }}>
      <div style={{ color:C.sub, marginBottom:4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color:p.color, fontWeight:700 }}>{p.name}: ${p.value}</div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════
   OVERVIEW
══════════════════════════════════════ */
const OverviewSection = ({ go }) => {
  const health = [
    { label:"Payments",       ok:true  }, { label:"Bookings",    ok:true  },
    { label:"Realtime",       ok:true  }, { label:"Auth",        ok:true  },
    { label:"ShineKing acct", ok:false },
  ];
  const totalComm = MONTHLY.reduce((s, m) => s + m.comm, 0);
  const pendingPayout = PAYOUTS.filter(p => p.st === "Pending").reduce((s, p) => s + p.net, 0);

  return (
    <div>
      {/* Alert banner */}
      <div style={{ background:`${C.red}10`, border:`1px solid ${C.red}35`,
        borderRadius:12, padding:"10px 16px", marginBottom:18,
        display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:18 }}>⚠️</span>
        <div style={{ flex:1 }}>
          <span style={{ fontSize:13, fontWeight:700, color:C.text }}>
            4 detailer applications need review
          </span>
          <span style={{ fontSize:12, color:C.sub, marginLeft:8 }}>
            · 2 open disputes require action · ShineKing account flagged
          </span>
        </div>
        <ActionBtn onClick={() => go("approvals")}>Review Now</ActionBtn>
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, marginBottom:18 }}>
        <StatCard label="PLATFORM REVENUE (ALL TIME)" val="$21,240"    sub="Gross across all bookings"       col={C.blue}  em="💳"/>
        <StatCard label="YOUR COMMISSION EARNED"       val={`$${totalComm}`} sub="10% platform fee · this year" col={C.admin} em="💰" onClick={() => go("payouts")}/>
        <StatCard label="TOTAL PLATFORM USERS"         val="247"        sub="198 clients · 49 detailers"      col={C.green} em="👥" onClick={() => go("users")}/>
        <StatCard label="PENDING DETAILER PAYOUTS"     val={`$${pendingPayout.toFixed(2)}`} sub="3 detailers waiting" col={C.amber} em="⏳" onClick={() => go("payouts")}/>
      </div>

      {/* Platform health */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`,
        borderRadius:14, padding:16, marginBottom:18 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.text }}>Platform Health</div>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11,
            color:C.green, fontWeight:700 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.green,
              animation:"pulse-dot 2s infinite" }}/>
            4/5 Systems Operational
          </div>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {health.map(({ label, ok }) => (
            <div key={label} style={{ display:"flex", alignItems:"center", gap:6,
              background:ok?`${C.green}10`:`${C.red}10`,
              border:`1px solid ${ok?C.green+"30":C.red+"30"}`,
              borderRadius:8, padding:"5px 10px" }}>
              <div style={{ width:6, height:6, borderRadius:"50%",
                background:ok?C.green:C.red,
                animation:ok?"pulse-dot 2s infinite":"blink 1s infinite" }}/>
              <span style={{ fontSize:11, fontWeight:600,
                color:ok?C.green:C.red }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue chart + activity */}
      <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:14, marginBottom:18 }}>
        {/* Chart */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.text }}>Revenue vs Commission</div>
            <div style={{ fontSize:13, fontWeight:900, color:C.admin }}>${totalComm} earned</div>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={MONTHLY} margin={{ top:4, right:0, bottom:0, left:0 }}>
              <defs>
                <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.blue}  stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={C.blue}  stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="comG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.admin} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={C.admin} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="m" axisLine={false} tickLine={false}
                tick={{ fill:C.sub, fontSize:11, fontFamily:C.f }}/>
              <YAxis hide/>
              <Tooltip content={<ChartTip/>}/>
              <Area type="monotone" dataKey="rev"  name="Revenue"    stroke={C.blue}  strokeWidth={2} fill="url(#revG)" dot={false}/>
              <Area type="monotone" dataKey="comm" name="Commission" stroke={C.admin} strokeWidth={2} fill="url(#comG)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity feed */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16 }}>
          <SLabel>LIVE ACTIVITY</SLabel>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start",
                padding:"5px 0", borderBottom:i<ACTIVITY.length-1?`1px solid ${C.border}`:"none",
                animation:"slide-up .3s ease" }}>
                <span style={{ fontSize:13, flexShrink:0 }}>{a.em}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:11, color:C.text, fontWeight:500,
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {a.msg}
                  </div>
                  <div style={{ fontSize:9, color:C.sub, marginTop:1 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top detailers */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.text }}>Top Detailers This Month</div>
          <button onClick={() => go("users")} style={{ fontSize:12, color:C.admin, fontWeight:700,
            background:"none", border:"none", cursor:"pointer" }}>View all →</button>
        </div>
        {[
          { name:"FreshRide Detail", jobs:8, earned:620, rating:4.9, col:C.blue  },
          { name:"AutoSpark Pro",    jobs:5, earned:445, rating:4.8, col:C.green },
          { name:"ShineKing Mobile", jobs:3, earned:185, rating:4.7, col:C.amber },
        ].map((d, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12,
            padding:"10px 0", borderBottom:i<2?`1px solid ${C.border}`:"none" }}>
            <div style={{ width:32, height:32, borderRadius:10, background:`${d.col}20`,
              border:`1px solid ${d.col}40`, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:13, color:d.col, fontWeight:800 }}>
              {i+1}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{d.name}</div>
              <div style={{ fontSize:11, color:C.sub }}>{d.jobs} jobs · ⭐ {d.rating}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:14, fontWeight:800, color:C.green }}>${d.earned}</div>
              <div style={{ fontSize:10, color:C.sub }}>gross</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   APPROVALS
══════════════════════════════════════ */
const ApprovalsSection = () => {
  const [apps, setApps] = useState(APPS.map(a => ({ ...a, status:"pending" })));

  const act = (id, action) => setApps(a => a.map(x => x.id === id ? { ...x, status:action } : x));

  return (
    <div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:16, fontWeight:800, color:C.text }}>Detailer Applications</div>
        <div style={{ fontSize:13, color:C.sub, marginTop:3 }}>
          Review and approve or reject detailers joining the platform. Approved detailers appear to clients immediately.
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:18 }}>
        {[
          { l:"Pending Review", v:apps.filter(a=>a.status==="pending").length,  col:C.amber },
          { l:"Approved Today", v:apps.filter(a=>a.status==="approved").length, col:C.green },
          { l:"Rejected",       v:apps.filter(a=>a.status==="rejected").length, col:C.red   },
        ].map(({ l, v, col }) => (
          <div key={l} style={{ background:C.card, border:`1px solid ${C.border}`,
            borderRadius:12, padding:"12px 14px" }}>
            <div style={{ fontSize:22, fontWeight:900, color:col }}>{v}</div>
            <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Application cards */}
      {apps.map(a => (
        <div key={a.id} style={{ background:C.card, border:`1px solid ${
          a.status==="approved"?C.green+"40":a.status==="rejected"?"rgba(239,68,68,.3)":C.border
        }`, borderRadius:16, padding:18, marginBottom:12, transition:"all .25s" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ width:44, height:44, borderRadius:12, background:`${C.admin}20`,
                border:`1px solid ${C.admin}40`, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:20 }}>🧑‍🔧</div>
              <div>
                <div style={{ fontSize:15, fontWeight:800, color:C.text }}>{a.name}</div>
                <div style={{ fontSize:12, color:C.sub }}>📍 {a.city} · ⏱ {a.exp} experience · Applied {a.applied}</div>
              </div>
            </div>
            <Pill st={a.status==="pending"?"Pending":a.status==="approved"?"Active":"Suspended"}/>
          </div>

          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
            {a.svcs.map(s => (
              <span key={s} style={{ fontSize:11, padding:"3px 9px", borderRadius:20,
                background:`${C.admin}12`, color:C.admin }}>✓ {s}</span>
            ))}
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ flex:1, display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:12, color:a.docs?C.green:C.red, fontWeight:600 }}>
                {a.docs?"✓ Documents submitted":"⚠ Documents missing"}
              </span>
            </div>
            {a.status === "pending" && (
              <div style={{ display:"flex", gap:8 }}>
                <ActionBtn onClick={() => act(a.id,"rejected")} col={C.red} outline>✕ Reject</ActionBtn>
                <button onClick={() => act(a.id,"approved")}
                  style={{ padding:"6px 16px", borderRadius:8, background:C.green,
                    color:"white", border:"none", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  ✓ Approve
                </button>
              </div>
            )}
            {a.status === "approved" && (
              <span style={{ fontSize:12, color:C.green, fontWeight:700 }}>✓ Approved — now live</span>
            )}
            {a.status === "rejected" && (
              <span style={{ fontSize:12, color:C.red, fontWeight:700 }}>✕ Rejected</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════
   BOOKINGS
══════════════════════════════════════ */
const BookingsSection = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = BOOKINGS.filter(b => {
    const mf = filter === "all" || b.st.toLowerCase().replace(" ","-") === filter;
    const ms = b.client.toLowerCase().includes(search.toLowerCase()) ||
               b.det.toLowerCase().includes(search.toLowerCase()) ||
               b.id.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const tabs = [
    { id:"all", label:"All" },
    { id:"completed", label:"Completed" },
    { id:"in-progress", label:"In Progress" },
    { id:"confirmed", label:"Confirmed" },
    { id:"pending", label:"Pending" },
  ];

  return (
    <div>
      <div style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:4 }}>All Bookings</div>
      <div style={{ fontSize:13, color:C.sub, marginBottom:16 }}>
        Every booking across the platform. Click any row to see full details.
      </div>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
        {[
          { l:"Total Bookings", v:BOOKINGS.length,   col:C.text  },
          { l:"Gross Revenue",  v:"$613",             col:C.blue  },
          { l:"Your Commission",v:"$61.30",           col:C.admin },
          { l:"Active Now",     v:"1",                col:C.green },
        ].map(({ l, v, col }) => (
          <div key={l} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 14px" }}>
            <div style={{ fontSize:20, fontWeight:900, color:col }}>{v}</div>
            <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        marginBottom:14, gap:10, flexWrap:"wrap" }}>
        <div style={{ display:"flex", gap:6 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)}
              style={{ padding:"6px 14px", borderRadius:20, border:"none", cursor:"pointer",
                fontFamily:C.f, fontSize:12, fontWeight:700, transition:"all .2s",
                background:filter===t.id?C.admin:C.card, color:filter===t.id?"white":C.sub }}>
              {t.label}
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search client, detailer, ID..."
          style={{ padding:"7px 14px", background:C.card, border:`1px solid ${C.border}`,
            borderRadius:10, color:C.text, fontSize:12, outline:"none", width:220 }}/>
      </div>

      {/* Table */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"0.6fr 1fr 1.2fr 1.4fr 0.7fr 0.8fr 0.7fr 0.8fr",
          padding:"10px 16px", borderBottom:`1px solid ${C.border}`,
          fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5 }}>
          <span>ID</span><span>CLIENT</span><span>DETAILER</span><span>SERVICE</span>
          <span>DATE</span><span>TOTAL</span><span>COMM.</span><span>STATUS</span>
        </div>
        {filtered.map((b, i) => (
          <div key={b.id} style={{ display:"grid",
            gridTemplateColumns:"0.6fr 1fr 1.2fr 1.4fr 0.7fr 0.8fr 0.7fr 0.8fr",
            padding:"11px 16px", borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none",
            alignItems:"center" }}>
            <span style={{ fontSize:11, color:C.admin, fontWeight:700 }}>{b.id}</span>
            <span style={{ fontSize:12, color:C.text, fontWeight:600 }}>{b.client}</span>
            <span style={{ fontSize:12, color:C.sub }}>{b.det}</span>
            <span style={{ fontSize:11, color:C.sub }}>{b.svc}</span>
            <span style={{ fontSize:11, color:C.sub }}>{b.date}</span>
            <span style={{ fontSize:13, fontWeight:800, color:C.text }}>${b.total}</span>
            <span style={{ fontSize:12, fontWeight:700, color:C.admin }}>+${b.comm.toFixed(2)}</span>
            <Pill st={b.st}/>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding:"24px", textAlign:"center", color:C.sub, fontSize:13 }}>
            No bookings found
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   USERS
══════════════════════════════════════ */
const UsersSection = () => {
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = USERS.filter(u => {
    const mr = roleFilter === "all" || u.role === roleFilter;
    const ms = u.name.toLowerCase().includes(search.toLowerCase()) ||
               u.email.toLowerCase().includes(search.toLowerCase());
    return mr && ms;
  });

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:C.text }}>All Users</div>
          <div style={{ fontSize:13, color:C.sub, marginTop:3 }}>
            {USERS.filter(u=>u.role==="client").length} clients · {USERS.filter(u=>u.role==="detailer").length} detailers
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{ padding:"7px 14px", background:C.card, border:`1px solid ${C.border}`,
              borderRadius:10, color:C.text, fontSize:12, outline:"none", width:200 }}/>
          {["all","client","detailer"].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              style={{ padding:"7px 14px", borderRadius:20, border:"none", cursor:"pointer",
                fontFamily:C.f, fontSize:12, fontWeight:700,
                background:roleFilter===r?C.admin:C.card,
                color:roleFilter===r?"white":C.sub }}>
              {r === "all" ? "All" : r === "client" ? "Clients" : "Detailers"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1.8fr 0.8fr 0.8fr 0.7fr 0.7fr 0.8fr",
          padding:"10px 16px", borderBottom:`1px solid ${C.border}`,
          fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5 }}>
          <span>NAME</span><span>EMAIL</span><span>ROLE</span><span>CITY</span>
          <span>JOINED</span><span>JOBS</span><span>STATUS</span>
        </div>
        {filtered.map((u, i) => (
          <div key={i} style={{ display:"grid",
            gridTemplateColumns:"1.5fr 1.8fr 0.8fr 0.8fr 0.7fr 0.7fr 0.8fr",
            padding:"11px 16px", borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none",
            alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0,
                background:u.role==="detailer"?`${C.green}20`:`${C.blue}20`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:12, color:u.role==="detailer"?C.green:C.blue, fontWeight:700 }}>
                {u.name[0]}
              </div>
              <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{u.name}</span>
            </div>
            <span style={{ fontSize:11, color:C.sub }}>{u.email}</span>
            <span style={{ fontSize:11, fontWeight:700,
              color:u.role==="detailer"?C.green:C.blue }}>
              {u.role}
            </span>
            <span style={{ fontSize:11, color:C.sub }}>{u.city}</span>
            <span style={{ fontSize:11, color:C.sub }}>{u.joined}</span>
            <span style={{ fontSize:12, fontWeight:700, color:C.text }}>{u.count}</span>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Pill st={u.st}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   DISPUTES
══════════════════════════════════════ */
const DisputesSection = () => {
  const [disputes, setDisputes] = useState(DISPUTES);
  const resolve = id => setDisputes(d => d.map(x => x.id===id?{...x,st:"Resolved"}:x));

  return (
    <div>
      <div style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:4 }}>Disputes</div>
      <div style={{ fontSize:13, color:C.sub, marginBottom:16 }}>
        Handle complaints between clients and detailers. Open disputes affect your platform rating.
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:18 }}>
        {[
          { l:"Open Disputes",    v:disputes.filter(d=>d.st==="Open").length,     col:C.red   },
          { l:"Resolved",         v:disputes.filter(d=>d.st==="Resolved").length, col:C.green },
          { l:"Amount at Risk",   v:"$184",                                        col:C.amber },
        ].map(({ l, v, col }) => (
          <div key={l} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 14px" }}>
            <div style={{ fontSize:22, fontWeight:900, color:col }}>{v}</div>
            <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {disputes.map(d => (
        <div key={d.id} style={{ background:C.card,
          border:`1px solid ${d.st==="Open"?C.red+"35":C.border}`,
          borderRadius:16, padding:18, marginBottom:12, transition:"all .25s" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <div style={{ width:40, height:40, borderRadius:12,
                background:d.st==="Open"?`${C.red}15`:`${C.green}15`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
                {d.st==="Open"?"⚠️":"✅"}
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:C.text }}>
                  {d.client} vs {d.det}
                </div>
                <div style={{ fontSize:11, color:C.sub }}>
                  {d.id} · {d.bk} · Reported {d.date} · ${d.amount}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <Pill st={d.priority}/>
              <Pill st={d.st}/>
            </div>
          </div>

          <div style={{ background:C.dim, borderRadius:10, padding:"10px 12px", marginBottom:12,
            fontSize:13, color:C.sub, lineHeight:1.6 }}>
            "{d.issue}"
          </div>

          {d.st === "Open" && (
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <ActionBtn col={C.green} onClick={() => resolve(d.id)}>✓ Mark Resolved</ActionBtn>
              <ActionBtn col={C.red} outline>💳 Issue Refund</ActionBtn>
              <ActionBtn col={C.amber} outline>⚠️ Warn Detailer</ActionBtn>
              <ActionBtn col={C.blue} outline>💬 Contact Client</ActionBtn>
            </div>
          )}
          {d.st === "Resolved" && (
            <div style={{ fontSize:12, color:C.green, fontWeight:700 }}>
              ✓ Resolved — no further action needed
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════
   PAYOUTS
══════════════════════════════════════ */
const PayoutsSection = () => {
  const [payouts, setPayouts] = useState(PAYOUTS);
  const pay = det => setPayouts(p => p.map(x => x.det===det?{...x,st:"Paid"}:x));
  const pending = payouts.filter(p => p.st==="Pending");
  const totalPending = pending.reduce((s, p) => s + p.net, 0);
  const totalFees = payouts.reduce((s, p) => s + p.fee, 0);

  return (
    <div>
      <div style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:4 }}>Detailer Payouts</div>
      <div style={{ fontSize:13, color:C.sub, marginBottom:16 }}>
        Manage weekly payouts to detailers. Platform fee (10%) is automatically deducted.
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:18 }}>
        <StatCard label="TOTAL OWED TO DETAILERS" val={`$${totalPending.toFixed(2)}`}  sub={`${pending.length} pending payouts`}  col={C.amber} em="⏳"/>
        <StatCard label="YOUR FEES COLLECTED"      val={`$${totalFees.toFixed(2)}`}     sub="Platform commission this cycle"        col={C.admin} em="💰"/>
        <StatCard label="PAID OUT THIS CYCLE"      val="$117.00"                         sub="1 completed payout"                   col={C.green} em="✅"/>
      </div>

      {/* Pending payouts */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden", marginBottom:16 }}>
        <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.text }}>Pending Payouts</div>
          <button style={{ padding:"8px 18px", borderRadius:10, background:C.green,
            color:"white", border:"none", fontSize:13, fontWeight:700, cursor:"pointer",
            boxShadow:`0 4px 14px ${C.green}45` }}
            onClick={() => setPayouts(p => p.map(x => ({...x,st:"Paid"})))}>
            💳 Pay All — ${totalPending.toFixed(2)}
          </button>
        </div>
        <div style={{ padding:"0 16px" }}>
          {payouts.map((p, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12,
              padding:"13px 0", borderBottom:i<payouts.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ width:40, height:40, borderRadius:11, background:`${C.green}15`,
                border:`1px solid ${C.green}30`, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:18, flexShrink:0 }}>🧑‍🔧</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{p.det}</div>
                <div style={{ fontSize:11, color:C.sub }}>
                  {p.jobs} jobs · Gross ${p.gross.toFixed(2)} · Fee ${p.fee.toFixed(2)}
                </div>
              </div>
              <div style={{ textAlign:"right", marginRight:12 }}>
                <div style={{ fontSize:18, fontWeight:900,
                  color:p.st==="Paid"?C.sub:C.green }}>${p.net.toFixed(2)}</div>
                <div style={{ fontSize:10, color:C.sub }}>net payout</div>
              </div>
              {p.st === "Pending" ? (
                <button onClick={() => pay(p.det)}
                  style={{ padding:"7px 16px", borderRadius:9, background:`${C.green}15`,
                    border:`1px solid ${C.green}40`, color:C.green, fontSize:12,
                    fontWeight:700, cursor:"pointer", flexShrink:0 }}>
                  Pay Now
                </button>
              ) : (
                <Pill st="Paid"/>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   ANALYTICS
══════════════════════════════════════ */
const AnalyticsSection = () => (
  <div>
    <div style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:16 }}>Analytics</div>

    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:18 }}>
      {[
        { l:"Monthly Growth",  v:"+22%",  col:C.green },
        { l:"Avg Booking Val", v:"$87.57",col:C.blue  },
        { l:"Retention Rate",  v:"68%",   col:C.admin },
        { l:"Dispute Rate",    v:"2.4%",  col:C.amber },
      ].map(({ l, v, col }) => (
        <div key={l} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px" }}>
          <div style={{ fontSize:24, fontWeight:900, color:col }}>{v}</div>
          <div style={{ fontSize:11, color:C.sub, marginTop:3 }}>{l}</div>
        </div>
      ))}
    </div>

    {/* Monthly revenue */}
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16, marginBottom:16 }}>
      <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>
        Platform Revenue — 6 Months
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={MONTHLY} margin={{ top:4, right:0, bottom:0, left:0 }}>
          <defs>
            <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={C.admin} stopOpacity={0.25}/>
              <stop offset="95%" stopColor={C.admin} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="m" axisLine={false} tickLine={false}
            tick={{ fill:C.sub, fontSize:11, fontFamily:C.f }}/>
          <YAxis hide/>
          <Tooltip content={<ChartTip/>}/>
          <Area type="monotone" dataKey="rev" name="Revenue"
            stroke={C.admin} strokeWidth={2.5} fill="url(#aG)" dot={false}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>

    <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:14 }}>
      {/* Bookings by service */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:14 }}>Bookings by Service</div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={BY_SVC} barSize={30} margin={{ top:4, right:0, bottom:0, left:0 }}>
            <XAxis dataKey="svc" axisLine={false} tickLine={false}
              tick={{ fill:C.sub, fontSize:10, fontFamily:C.f }}/>
            <YAxis hide/>
            <Tooltip content={<ChartTip/>}/>
            <Bar dataKey="n" name="Bookings" fill={C.admin} radius={[5,5,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* City breakdown */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16 }}>
        <SLabel>BOOKINGS BY CITY</SLabel>
        {[
          { city:"Winnipeg", count:112, pct:90 },
          { city:"Brandon",  count:8,   pct:6  },
          { city:"Steinbach",count:5,   pct:4  },
        ].map(({ city, count, pct }) => (
          <div key={city} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:12, color:C.text, fontWeight:600 }}>{city}</span>
              <span style={{ fontSize:12, color:C.sub }}>{count} bookings ({pct}%)</span>
            </div>
            <div style={{ height:5, background:C.dim, borderRadius:3 }}>
              <div style={{ height:"100%", width:`${pct}%`, background:C.admin,
                borderRadius:3, transition:"width .6s" }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════
   SETTINGS
══════════════════════════════════════ */
const SettingsSection = () => {
  const [commission, setCommission] = useState(10);
  const [maintenance, setMaintenance] = useState(false);
  const [autoApprove, setAutoApprove] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const Toggle = ({ val, set, label, sub }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
      padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
      <div>
        <div style={{ fontSize:14, fontWeight:600, color:C.text }}>{label}</div>
        <div style={{ fontSize:12, color:C.sub, marginTop:2 }}>{sub}</div>
      </div>
      <div onClick={() => set(!val)}
        style={{ width:46, height:26, borderRadius:13, background:val?C.admin:C.dim,
          position:"relative", cursor:"pointer", transition:"background .25s", flexShrink:0 }}>
        <div style={{ position:"absolute", top:3, width:20, height:20, borderRadius:"50%",
          background:"white", transition:"left .25s", left:val?"calc(100% - 23px)":3,
          boxShadow:"0 1px 3px rgba(0,0,0,.3)" }}/>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:16 }}>Platform Settings</div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {/* Commission */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:18 }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:4 }}>Commission Rate</div>
          <div style={{ fontSize:12, color:C.sub, marginBottom:14 }}>
            Percentage taken from each booking. Detailer keeps the rest.
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
            <input type="range" min={5} max={20} value={commission}
              onChange={e => setCommission(Number(e.target.value))}
              style={{ flex:1, accentColor:C.admin }}/>
            <div style={{ fontSize:24, fontWeight:900, color:C.admin, minWidth:50 }}>
              {commission}%
            </div>
          </div>
          <div style={{ background:C.dim, borderRadius:10, padding:"10px 12px",
            fontSize:12, color:C.sub }}>
            On a $95 booking → you earn{" "}
            <strong style={{ color:C.admin }}>${(95*commission/100).toFixed(2)}</strong>{" "}
            · detailer gets{" "}
            <strong style={{ color:C.green }}>${(95*(1-commission/100)).toFixed(2)}</strong>
          </div>
        </div>

        {/* Toggles */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:18 }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>Platform Controls</div>
          <Toggle val={maintenance} set={setMaintenance}
            label="Maintenance Mode"
            sub="Temporarily disable all new bookings"/>
          <Toggle val={autoApprove} set={setAutoApprove}
            label="Auto-Approve Detailers"
            sub="Skip manual review (not recommended)"/>
        </div>

        {/* Payout schedule */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:18 }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:4 }}>Payout Schedule</div>
          <div style={{ fontSize:12, color:C.sub, marginBottom:14 }}>When detailers receive their earnings</div>
          <select defaultValue="weekly"
            style={{ width:"100%", padding:"11px 12px", background:C.dim,
              border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:14, outline:"none" }}>
            <option value="daily">Daily payouts</option>
            <option value="weekly">Weekly payouts (every Monday)</option>
            <option value="biweekly">Bi-weekly payouts</option>
            <option value="manual">Manual only</option>
          </select>
        </div>

        {/* Support email */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:18 }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:4 }}>Platform Info</div>
          <div style={{ fontSize:12, color:C.sub, marginBottom:14 }}>Public-facing contact details</div>
          {[{ l:"Support Email", v:"support@detailr.ca" },
            { l:"Platform Name", v:"Detailr" },
            { l:"Default City",  v:"Winnipeg, MB" }].map(({ l, v }) => (
            <div key={l} style={{ marginBottom:12 }}>
              <div style={{ fontSize:11, color:C.sub, fontWeight:600, marginBottom:4 }}>{l.toUpperCase()}</div>
              <input defaultValue={v}
                style={{ width:"100%", padding:"9px 12px", background:C.dim,
                  border:`1px solid ${C.border}`, borderRadius:9, color:C.text,
                  fontSize:13, outline:"none" }}/>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop:16 }}>
        <button onClick={save}
          style={{ padding:"13px 28px", borderRadius:12, background:saved?C.green:C.admin,
            color:"white", border:"none", fontSize:14, fontWeight:700, cursor:"pointer",
            boxShadow:`0 4px 16px ${saved?C.green:C.admin}45`, transition:"all .3s" }}>
          {saved ? "✓ Settings Saved!" : "Save All Settings"}
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   SIDEBAR
══════════════════════════════════════ */
const NAV = [
  { id:"overview",  label:"Overview",  fill:true,  badge:0, path:"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"                 },
  { id:"approvals", label:"Approvals", fill:false, badge:4, path:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"       },
  { id:"bookings",  label:"Bookings",  fill:false, badge:0, path:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id:"users",     label:"Users",     fill:false, badge:0, path:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { id:"disputes",  label:"Disputes",  fill:false, badge:2, path:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
  { id:"payouts",   label:"Payouts",   fill:false, badge:0, path:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id:"analytics", label:"Analytics", fill:false, badge:0, path:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { id:"settings",  label:"Settings",  fill:false, badge:0, path:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

const Sidebar = ({ active, go }) => (
  <div style={{ width:210, background:C.panel, borderRight:`1px solid ${C.border}`,
    display:"flex", flexDirection:"column", position:"sticky", top:0,
    height:"100vh", overflowY:"auto", flexShrink:0 }}>
    {/* Logo */}
    <div style={{ padding:"20px 18px 16px", borderBottom:`1px solid ${C.border}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:34, height:34, borderRadius:10, background:`${C.admin}25`,
          border:`1px solid ${C.admin}50`, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:16 }}>⚙️</div>
        <div>
          <div style={{ fontSize:14, fontWeight:900, color:C.text }}>Detailr</div>
          <div style={{ fontSize:9, color:C.admin, fontWeight:700 }}>Admin Control Room</div>
        </div>
      </div>
    </div>

    {/* Your earnings at a glance */}
    <div style={{ padding:"12px 14px", borderBottom:`1px solid ${C.border}` }}>
      <div style={{ background:`${C.admin}10`, border:`1px solid ${C.admin}30`,
        borderRadius:10, padding:"10px 12px" }}>
        <div style={{ fontSize:10, color:C.sub, fontWeight:600 }}>YOUR COMMISSION</div>
        <div style={{ fontSize:22, fontWeight:900, color:C.admin, marginTop:2 }}>$1,904</div>
        <div style={{ fontSize:10, color:C.sub, marginTop:1 }}>YTD · 10% platform fee</div>
      </div>
    </div>

    {/* Nav */}
    <nav style={{ padding:"10px 10px", flex:1 }}>
      <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:1,
        padding:"8px 8px 6px" }}>MANAGE</div>
      {NAV.map(n => {
        const isActive = active === n.id;
        return (
          <button key={n.id} onClick={() => go(n.id)}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:10,
              padding:"9px 10px", borderRadius:10, border:"none", cursor:"pointer",
              background:isActive?`${C.admin}15`:"transparent",
              color:isActive?C.admin:C.sub, fontFamily:C.f,
              fontSize:13, fontWeight:isActive?700:500, marginBottom:2,
              textAlign:"left", transition:"all .15s" }}>
            <svg width="17" height="17" viewBox="0 0 24 24"
              fill={n.fill && isActive ? C.admin : "none"}
              stroke={isActive ? C.admin : C.sub}
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={n.path}/>
            </svg>
            <span style={{ flex:1 }}>{n.label}</span>
            {n.badge > 0 && (
              <span style={{ fontSize:10, fontWeight:800, padding:"2px 6px",
                borderRadius:10, background:n.id==="disputes"?`${C.red}20`:`${C.amber}20`,
                color:n.id==="disputes"?C.red:C.amber }}>
                {n.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>

    {/* Admin profile */}
    <div style={{ padding:"12px 14px", borderTop:`1px solid ${C.border}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:"50%", background:`${C.admin}20`,
          border:`2px solid ${C.admin}40`, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:14, flexShrink:0 }}>👑</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.text }}>Jaskirat (Owner)</div>
          <div style={{ fontSize:10, color:C.sub }}>Super Admin</div>
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════
   TOP BAR
══════════════════════════════════════ */
const TopBar = ({ section }) => {
  const titles = {
    overview:"Overview", approvals:"Detailer Approvals", bookings:"All Bookings",
    users:"User Management", disputes:"Disputes", payouts:"Detailer Payouts",
    analytics:"Analytics", settings:"Platform Settings",
  };
  return (
    <div style={{ padding:"14px 24px", borderBottom:`1px solid ${C.border}`,
      display:"flex", justifyContent:"space-between", alignItems:"center",
      background:C.panel, flexShrink:0 }}>
      <div>
        <div style={{ fontSize:20, fontWeight:800, color:C.text }}>{titles[section]}</div>
        <div style={{ fontSize:12, color:C.sub, marginTop:1 }}>Thursday, June 5, 2025</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {/* Platform status */}
        <div style={{ display:"flex", alignItems:"center", gap:6,
          background:`${C.green}12`, border:`1px solid ${C.green}35`,
          borderRadius:20, padding:"5px 12px" }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:C.green,
            animation:"pulse-dot 2s infinite" }}/>
          <span style={{ fontSize:10, fontWeight:700, color:C.green }}>PLATFORM LIVE</span>
        </div>
        {/* Alerts */}
        <div style={{ position:"relative" }}>
          <button style={{ width:36, height:36, borderRadius:10, background:C.card,
            border:`1px solid ${C.border}`, display:"flex", alignItems:"center",
            justifyContent:"center", cursor:"pointer", fontSize:16 }}>🔔</button>
          <div style={{ position:"absolute", top:7, right:7, width:7, height:7,
            borderRadius:"50%", background:C.red, border:`1.5px solid ${C.panel}` }}/>
        </div>
        {/* Admin avatar */}
        <div style={{ width:36, height:36, borderRadius:10, background:`${C.admin}20`,
          border:`1px solid ${C.admin}40`, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:16, cursor:"pointer" }}>👑</div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   ROOT APP
══════════════════════════════════════ */
export default function AdminDashboard() {
  const [section, setSection] = useState("overview");

  const sections = {
    overview:  <OverviewSection  go={setSection}/>,
    approvals: <ApprovalsSection/>,
    bookings:  <BookingsSection/>,
    users:     <UsersSection/>,
    disputes:  <DisputesSection/>,
    payouts:   <PayoutsSection/>,
    analytics: <AnalyticsSection/>,
    settings:  <SettingsSection/>,
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:C.f }}>
      <Sidebar active={section} go={setSection}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden" }}>
        <TopBar section={section}/>
        <div style={{ flex:1, overflowY:"auto", padding:24 }}>
          {sections[section]}
        </div>
      </div>
    </div>
  );
}
