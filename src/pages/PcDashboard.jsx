import { useState } from "react";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/* ─── Font + global styles ─── */
(() => {
  if (document.getElementById("pc-font")) return;
  const l = document.createElement("link");
  l.id = "pc-font"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap";
  document.head.appendChild(l);
  const s = document.createElement("style");
  s.textContent = `*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Outfit',sans-serif}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#1A2035;border-radius:2px}input,button,select,textarea{font-family:inherit}`;
  document.head.appendChild(s);
})();

/* ─── Tokens ─── */
const C = {
  bg:"#07080F", panel:"#0C0E18", card:"#111420",
  border:"rgba(255,255,255,0.07)", green:"#00C896",
  blue:"#4F8EF7", amber:"#F5A623", red:"#EF4444", purple:"#8B5CF6",
  text:"#EEF2FF", sub:"#6B7591", dim:"#161926", f:"'Outfit',sans-serif",
};

/* ─── Data ─── */
const WEEK_DATA = [
  {d:"Mon",v:120},{d:"Tue",v:85},{d:"Wed",v:0},
  {d:"Thu",v:240},{d:"Fri",v:180},{d:"Sat",v:350},{d:"Sun",v:265},
];
const MONTH_DATA = [
  {m:"Jan",v:2400},{m:"Feb",v:3200},{m:"Mar",v:2800},
  {m:"Apr",v:4100},{m:"May",v:3800},{m:"Jun",v:4820},
];
const JOBS = [
  {id:1,client:"Alex Johnson", svc:"Full Mobile Detail",date:"Jun 5", time:"10:00 AM",addr:"123 Main St",  earn:85.50, st:"Confirmed"},
  {id:2,client:"David R.",     svc:"Ceramic Boost",     date:"Jun 5", time:"2:00 PM", addr:"789 Pine St",  earn:133.50,st:"Pending"  },
  {id:3,client:"Maya K.",      svc:"Interior Detail",   date:"Jun 6", time:"11:00 AM",addr:"456 Oak Ave",  earn:49.50, st:"Confirmed"},
  {id:4,client:"Tom B.",       svc:"Basic Wash",        date:"Jun 7", time:"9:00 AM", addr:"321 Elm St",   earn:31.50, st:"Confirmed"},
  {id:5,client:"Sarah M.",     svc:"Full Mobile Detail",date:"Jun 2", time:"10:00 AM",addr:"456 Oak Ave",  earn:85.50, st:"Completed"},
  {id:6,client:"James T.",     svc:"Ceramic Boost",     date:"Jun 1", time:"2:00 PM", addr:"789 Pine St",  earn:133.50,st:"Completed"},
  {id:7,client:"Emily R.",     svc:"Interior Detail",   date:"May 31",time:"11:00 AM",addr:"321 Pine Ave", earn:49.50, st:"Completed"},
];
const SERVICES = [
  {id:1,name:"Basic Mobile Wash",  price:35, dur:"45 min",em:"🚿",bookings:14,active:true, col:"#4F8EF7"},
  {id:2,name:"Interior Detail",    price:55, dur:"60 min",em:"🪑",bookings:23,active:true, col:"#8B5CF6"},
  {id:3,name:"Full Mobile Detail", price:95, dur:"90 min",em:"✨",bookings:52,active:true, col:C.green, hot:true},
  {id:4,name:"Ceramic Boost",      price:149,dur:"2 hrs", em:"💎",bookings:8, active:true, col:"#F5A623"},
];
const CAL = {
  5:[{client:"Alex J.",  svc:"Full Detail",    time:"10:00 AM",earn:85.50, col:C.green}],
  6:[{client:"David R.", svc:"Ceramic Boost",  time:"2:00 PM", earn:133.50,col:C.amber}],
  7:[{client:"Maya K.",  svc:"Interior Detail",time:"11:00 AM",earn:49.50, col:C.green}],
  8:[{client:"Tom B.",   svc:"Basic Wash",     time:"9:00 AM", earn:31.50, col:C.green}],
};
const BLOCKED = [15,16,22];

/* ─── Atoms ─── */
const Pill = ({ st }) => {
  const m = { Confirmed:C.green, Pending:C.amber, Completed:C.sub, Cancelled:C.red };
  const c = m[st] || C.sub;
  return <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:`${c}20`, color:c }}>{st}</span>;
};

const StatCard = ({ label, val, sub, col, em, onClick }) => (
  <div onClick={onClick}
    style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14,
      padding:"16px", cursor:onClick?"pointer":"default" }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
      <div style={{ fontSize:11, fontWeight:700, color:C.sub, letterSpacing:.5 }}>{label}</div>
      <div style={{ width:32, height:32, borderRadius:9, background:`${col}18`,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{em}</div>
    </div>
    <div style={{ fontSize:26, fontWeight:900, color:col }}>{val}</div>
    <div style={{ fontSize:11, color:C.sub, marginTop:4 }}>{sub}</div>
  </div>
);

const SectionTitle = ({ children, action, onAction }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
    <div style={{ fontSize:16, fontWeight:800, color:C.text }}>{children}</div>
    {action && <button onClick={onAction} style={{ fontSize:12, color:C.green, fontWeight:700,
      background:"none", border:"none", cursor:"pointer" }}>{action}</button>}
  </div>
);

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:8,
      padding:"8px 12px", fontSize:12, fontFamily:C.f, color:C.text }}>
      <div style={{ color:C.sub, marginBottom:3 }}>{label}</div>
      <div style={{ fontWeight:700, color:C.green }}>${payload[0].value}</div>
    </div>
  );
};

/* ══════════════════════════════════════
   SECTION 1 — OVERVIEW
══════════════════════════════════════ */
const OverviewSection = ({ go }) => (
  <div>
    {/* Stat cards */}
    <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, marginBottom:20 }}>
      <StatCard label="TODAY'S EARNINGS" val="$241.65" sub="+$85 from last booking" col={C.green} em="💰"/>
      <StatCard label="THIS MONTH"       val="$4,338"  sub="52 jobs · goal $5,000"   col={C.blue}  em="📅"/>
      <StatCard label="AVG RATING"       val="4.9 ★"   sub="Based on 203 reviews"    col={C.amber} em="⭐"/>
      <StatCard label="PENDING REQUESTS" val="2"       sub="Tap to review"            col={C.purple} em="🗓️" onClick={()=>go("jobs")}/>
    </div>

    {/* Weekly bar chart */}
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16, marginBottom:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div style={{ fontSize:14, fontWeight:700, color:C.text }}>This Week's Earnings</div>
        <div style={{ fontSize:18, fontWeight:900, color:C.green }}>$1,240.00</div>
      </div>
      <ResponsiveContainer width="100%" height={110}>
        <BarChart data={WEEK_DATA} barSize={28} margin={{ top:4, right:0, bottom:0, left:0 }}>
          <XAxis dataKey="d" axisLine={false} tickLine={false}
            tick={{ fill:C.sub, fontSize:11, fontFamily:C.f }}/>
          <YAxis hide/>
          <Tooltip content={<ChartTip/>} cursor={{ fill:"rgba(255,255,255,0.03)" }}/>
          <Bar dataKey="v" fill={C.green} radius={[5,5,0,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Upcoming jobs */}
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16, marginBottom:20 }}>
      <SectionTitle action="View all →" onAction={() => go("jobs")}>Upcoming Jobs</SectionTitle>
      {JOBS.filter(j => j.st !== "Completed").map((j, i, arr) => (
        <div key={j.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0",
          borderBottom:i < arr.length-1 ? `1px solid ${C.border}` : "none" }}>
          <div style={{ width:36, height:36, borderRadius:10, background:`${C.green}15`,
            border:`1px solid ${C.green}30`, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:16, flexShrink:0 }}>📋</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{j.svc}</div>
            <div style={{ fontSize:11, color:C.sub, marginTop:1 }}>
              {j.client} · {j.date} · {j.time}
            </div>
          </div>
          <Pill st={j.st}/>
          <span style={{ fontSize:14, fontWeight:800, color:C.green, marginLeft:8, whiteSpace:"nowrap" }}>
            +${j.earn.toFixed(2)}
          </span>
        </div>
      ))}
    </div>

    {/* Goal progress */}
    <div style={{ background:`${C.green}08`, border:`1px solid ${C.green}25`, borderRadius:14, padding:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.text }}>Monthly Goal Progress</div>
        <div style={{ fontSize:13, fontWeight:700, color:C.green }}>$4,338 / $5,000</div>
      </div>
      <div style={{ height:8, background:C.dim, borderRadius:4, overflow:"hidden" }}>
        <div style={{ height:"100%", width:"86.8%", background:C.green, borderRadius:4,
          transition:"width .6s" }}/>
      </div>
      <div style={{ fontSize:11, color:C.sub, marginTop:6 }}>86.8% — $662 to go this month</div>
    </div>
  </div>
);

/* ══════════════════════════════════════
   SECTION 2 — JOBS
══════════════════════════════════════ */
const JobsSection = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = JOBS.filter(j => {
    const matchFilter = filter === "all" || j.st.toLowerCase() === filter;
    const matchSearch = j.client.toLowerCase().includes(search.toLowerCase()) ||
                        j.svc.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const tabs = [
    { id:"all",       label:"All Jobs",  count:JOBS.length },
    { id:"confirmed", label:"Upcoming",  count:JOBS.filter(j=>j.st==="Confirmed").length },
    { id:"pending",   label:"Pending",   count:JOBS.filter(j=>j.st==="Pending").length },
    { id:"completed", label:"Completed", count:JOBS.filter(j=>j.st==="Completed").length },
  ];

  return (
    <div>
      {/* Filter tabs + search */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, gap:12, flexWrap:"wrap" }}>
        <div style={{ display:"flex", gap:6 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)}
              style={{ padding:"7px 14px", borderRadius:20, border:"none", cursor:"pointer",
                fontFamily:C.f, fontSize:12, fontWeight:700, transition:"all .2s",
                background:filter===t.id ? C.green : C.card,
                color:filter===t.id ? "white" : C.sub }}>
              {t.label}
              <span style={{ marginLeft:6, fontSize:10, opacity:.7 }}>({t.count})</span>
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search jobs..."
          style={{ padding:"8px 14px", background:C.card, border:`1px solid ${C.border}`,
            borderRadius:10, color:C.text, fontSize:13, outline:"none", width:180 }}/>
      </div>

      {/* Jobs table */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
        {/* Table header */}
        <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1.5fr 1fr 0.8fr 0.7fr",
          padding:"10px 16px", borderBottom:`1px solid ${C.border}`,
          fontSize:11, fontWeight:700, color:C.sub, letterSpacing:.5 }}>
          <span>CLIENT</span><span>SERVICE</span><span>DATE</span><span>EARNINGS</span><span>STATUS</span>
        </div>
        {filtered.length > 0 ? filtered.map((j, i) => (
          <div key={j.id} style={{ display:"grid", gridTemplateColumns:"1.5fr 1.5fr 1fr 0.8fr 0.7fr",
            padding:"12px 16px", borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none",
            alignItems:"center", transition:"background .15s",
            ":hover":{ background:C.dim } }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{j.client}</div>
              <div style={{ fontSize:11, color:C.sub, marginTop:1 }}>📍 {j.addr}</div>
            </div>
            <div style={{ fontSize:13, color:C.text }}>{j.svc}</div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{j.date}</div>
              <div style={{ fontSize:11, color:C.sub }}>{j.time}</div>
            </div>
            <div style={{ fontSize:14, fontWeight:800, color:C.green }}>+${j.earn.toFixed(2)}</div>
            <Pill st={j.st}/>
          </div>
        )) : (
          <div style={{ padding:"32px", textAlign:"center", color:C.sub, fontSize:14 }}>
            No jobs found
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   SECTION 3 — EARNINGS
══════════════════════════════════════ */
const EarningsSection = () => {
  const [period, setPeriod] = useState("month");

  const PAYOUTS = [
    { date:"Jun 1", amount:892.50, method:"Stripe · ****4242", st:"Paid" },
    { date:"May 15",amount:1240.00,method:"Stripe · ****4242", st:"Paid" },
    { date:"May 1", amount:980.00, method:"Stripe · ****4242", st:"Paid" },
  ];

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        {[
          { l:"THIS MONTH",  v:"$4,338.00", sub:"52 jobs",          col:C.green },
          { l:"LAST MONTH",  v:"$3,420.00", sub:"41 jobs",          col:C.blue  },
          { l:"YEAR TO DATE",v:"$21,240.00",sub:"265 jobs total",   col:C.amber },
        ].map(({ l, v, sub, col }) => (
          <div key={l} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.sub, letterSpacing:.5, marginBottom:8 }}>{l}</div>
            <div style={{ fontSize:24, fontWeight:900, color:col }}>{v}</div>
            <div style={{ fontSize:11, color:C.sub, marginTop:4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Monthly area chart */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16, marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.text }}>6-Month Earnings</div>
          <div style={{ fontSize:18, fontWeight:900, color:C.green }}>$21,240</div>
        </div>
        <ResponsiveContainer width="100%" height={130}>
          <AreaChart data={MONTH_DATA} margin={{ top:4, right:0, bottom:0, left:0 }}>
            <defs>
              <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.green} stopOpacity={0.25}/>
                <stop offset="95%" stopColor={C.green} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="m" axisLine={false} tickLine={false}
              tick={{ fill:C.sub, fontSize:11, fontFamily:C.f }}/>
            <YAxis hide/>
            <Tooltip content={<ChartTip/>}/>
            <Area type="monotone" dataKey="v" stroke={C.green} strokeWidth={2.5}
              fill="url(#earnGrad)" dot={false} activeDot={{ r:4, fill:C.green }}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16, marginBottom:20 }}>
        <SectionTitle>This Month Breakdown</SectionTitle>
        {[
          { l:"Gross Earnings",   v:"$4,820.00", col:C.text  },
          { l:"Platform Fee (10%):",v:"− $482.00",col:C.red   },
          { l:"Net Payout",       v:"$4,338.00", col:C.green, bold:true },
        ].map(({ l, v, col, bold }) => (
          <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"10px 0", borderBottom:!bold?`1px solid ${C.border}`:"none" }}>
            <span style={{ fontSize:13, color:bold?C.text:C.sub, fontWeight:bold?700:400 }}>{l}</span>
            <span style={{ fontSize:bold?20:14, fontWeight:bold?900:600, color:col }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Payout history */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
        <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.text }}>Payout History</div>
          <button style={{ fontSize:12, color:C.blue, fontWeight:700,
            background:"none", border:"none", cursor:"pointer" }}>Export CSV</button>
        </div>
        <div style={{ padding:"0 16px" }}>
          {PAYOUTS.map((p, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12,
              padding:"12px 0", borderBottom:i<PAYOUTS.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${C.green}15`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:16, flexShrink:0 }}>💳</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.text }}>${p.amount.toFixed(2)}</div>
                <div style={{ fontSize:11, color:C.sub, marginTop:1 }}>{p.method}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:11, color:C.sub }}>{p.date}</div>
                <div style={{ fontSize:11, color:C.green, fontWeight:600, marginTop:2 }}>✓ {p.st}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   SECTION 4 — CALENDAR
══════════════════════════════════════ */
const CalendarSection = () => {
  const [selDay, setSelDay] = useState(5);
  // June 2025: starts on Sunday
  const dayLabels = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const totalDays = 30;
  // Pad start: June 1 is Sunday = index 0, no padding needed
  const cells = [...Array(totalDays).keys()].map(i => i + 1);

  return (
    <div style={{ display:"flex", gap:16 }}>
      {/* Calendar grid */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontSize:16, fontWeight:800, color:C.text }}>June 2025</div>
            <div style={{ display:"flex", gap:4 }}>
              {["‹","›"].map(a => (
                <button key={a} style={{ width:28, height:28, borderRadius:8, background:C.dim,
                  border:"none", color:C.text, cursor:"pointer", fontSize:14 }}>{a}</button>
              ))}
            </div>
          </div>
          {/* Day labels */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:6 }}>
            {dayLabels.map(d => (
              <div key={d} style={{ textAlign:"center", fontSize:10, fontWeight:700,
                color:C.sub, padding:"4px 0" }}>{d}</div>
            ))}
          </div>
          {/* Days grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
            {cells.map(n => {
              const hasJob = !!CAL[n];
              const isBlocked = BLOCKED.includes(n);
              const isSel = selDay === n;
              const isToday = n === 2;
              return (
                <div key={n} onClick={() => setSelDay(n)}
                  style={{ aspectRatio:"1", borderRadius:10, display:"flex",
                    flexDirection:"column", alignItems:"center", justifyContent:"center",
                    cursor:"pointer", transition:"all .2s", position:"relative",
                    background:isSel ? C.green : isBlocked ? `${C.red}12` : hasJob ? `${C.green}12` : C.dim,
                    border:`1px solid ${isSel ? C.green : isBlocked ? `${C.red}35` : hasJob ? `${C.green}35` : C.border}` }}>
                  {isToday && !isSel && (
                    <div style={{ position:"absolute", top:4, right:4, width:5, height:5,
                      borderRadius:"50%", background:C.blue }}/>
                  )}
                  <span style={{ fontSize:14, fontWeight:isSel||hasJob ? 800 : 500,
                    color:isSel ? "white" : isBlocked ? C.red : hasJob ? C.green : C.text }}>
                    {n}
                  </span>
                  {hasJob && !isSel && (
                    <div style={{ width:4, height:4, borderRadius:"50%",
                      background:C.green, marginTop:1 }}/>
                  )}
                  {isBlocked && (
                    <div style={{ fontSize:8, color:C.red, fontWeight:700 }}>OFF</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display:"flex", gap:14, marginTop:14, flexWrap:"wrap" }}>
            {[
              { col:C.green, label:"Booked"    },
              { col:C.red,   label:"Blocked"   },
              { col:C.blue,  label:"Today"     },
            ].map(({ col, label }) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:col }}/>
                <span style={{ fontSize:11, color:C.sub }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Block time button */}
        <button style={{ width:"100%", marginTop:12, padding:"12px", borderRadius:12,
          background:C.dim, border:`1px solid ${C.border}`, color:C.sub,
          fontSize:13, fontWeight:600, cursor:"pointer" }}>
          + Block Off Time on Jun {selDay}
        </button>
      </div>

      {/* Day detail panel */}
      <div style={{ width:220, flexShrink:0 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16 }}>
          <div style={{ fontSize:14, fontWeight:800, color:C.text, marginBottom:2 }}>
            Jun {selDay}
          </div>
          <div style={{ fontSize:11, color:C.sub, marginBottom:14 }}>
            {CAL[selDay] ? `${CAL[selDay].length} appointment${CAL[selDay].length>1?"s":""}` : "No appointments"}
          </div>

          {CAL[selDay] ? CAL[selDay].map((j, i) => (
            <div key={i} style={{ background:C.dim, borderRadius:12, padding:12, marginBottom:8 }}>
              <div style={{ width:32, height:32, borderRadius:9, background:`${j.col}20`,
                border:`1px solid ${j.col}40`, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:14, marginBottom:8 }}>📋</div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{j.svc}</div>
              <div style={{ fontSize:11, color:C.sub, marginTop:3 }}>👤 {j.client}</div>
              <div style={{ fontSize:11, color:C.sub }}>⏰ {j.time}</div>
              <div style={{ fontSize:14, fontWeight:800, color:C.green, marginTop:6 }}>
                +${j.earn.toFixed(2)}
              </div>
            </div>
          )) : (
            <div style={{ textAlign:"center", padding:"20px 0", color:C.sub, fontSize:13 }}>
              Free day ✓
            </div>
          )}

          {BLOCKED.includes(selDay) && (
            <div style={{ background:`${C.red}10`, border:`1px solid ${C.red}30`,
              borderRadius:10, padding:"10px 12px", marginTop:8 }}>
              <div style={{ fontSize:12, color:C.red, fontWeight:700 }}>🚫 Blocked Off</div>
              <div style={{ fontSize:11, color:C.sub, marginTop:3 }}>Unavailable for bookings</div>
            </div>
          )}
        </div>

        {/* Availability quick view */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:14, marginTop:12 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.sub, marginBottom:10, letterSpacing:.5 }}>
            YOUR HOURS TODAY
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:C.green }}>9:00 AM — 6:00 PM</div>
          <div style={{ fontSize:11, color:C.sub, marginTop:3 }}>Thursday · Available</div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   SECTION 5 — SERVICES
══════════════════════════════════════ */
const ServicesSection = () => {
  const [services, setServices] = useState(SERVICES.map(s => ({ ...s })));
  const toggle = id => setServices(sv => sv.map(s => s.id === id ? { ...s, active:!s.active } : s));

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:C.text }}>Your Services</div>
          <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>
            Manage what you offer and your pricing
          </div>
        </div>
        <button style={{ padding:"9px 18px", borderRadius:10, background:C.green,
          color:"white", border:"none", fontSize:13, fontWeight:700, cursor:"pointer" }}>
          + Add Service
        </button>
      </div>

      {/* Info note */}
      <div style={{ background:`${C.blue}08`, border:`1px solid ${C.blue}25`, borderRadius:12,
        padding:"11px 14px", marginBottom:16, fontSize:12, color:C.sub, lineHeight:1.6 }}>
        ℹ️ Clients browsing your profile will only see <strong style={{ color:C.text }}>active services</strong>.
        Toggle a service off to temporarily hide it without deleting it.
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
        {services.map(s => (
          <div key={s.id} style={{ background:s.active ? C.card : `${C.dim}88`,
            border:`1px solid ${s.active ? C.border : "rgba(255,255,255,0.04)"}`,
            borderRadius:14, padding:16, transition:"all .25s",
            opacity:s.active ? 1 : 0.65 }}>
            {s.hot && <div style={{ fontSize:10, fontWeight:800, color:"#F97316",
              marginBottom:8, letterSpacing:.5 }}>🔥 MOST POPULAR</div>}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <div style={{ width:44, height:44, borderRadius:13, background:`${s.col}18`,
                  border:`1px solid ${s.col}30`, display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:22 }}>{s.em}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{s.name}</div>
                  <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>⏱ {s.dur}</div>
                </div>
              </div>
              {/* Toggle */}
              <div onClick={() => toggle(s.id)}
                style={{ width:44, height:24, borderRadius:12, cursor:"pointer", flexShrink:0,
                  background:s.active ? C.green : C.dim, position:"relative", transition:"background .25s" }}>
                <div style={{ position:"absolute", top:3, width:18, height:18, borderRadius:"50%",
                  background:"white", transition:"left .25s",
                  left:s.active ? "calc(100% - 21px)" : 3,
                  boxShadow:"0 1px 3px rgba(0,0,0,0.3)" }}/>
              </div>
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              paddingTop:12, borderTop:`1px solid ${C.border}` }}>
              <div>
                <div style={{ fontSize:22, fontWeight:900, color:s.active ? s.col : C.sub }}>
                  ${s.price}
                </div>
                <div style={{ fontSize:11, color:C.sub }}>{s.bookings} bookings total</div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <button style={{ padding:"7px 14px", borderRadius:9, background:C.dim,
                  border:`1px solid ${C.border}`, color:C.text, fontSize:12,
                  fontWeight:600, cursor:"pointer" }}>Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   SECTION 6 — PROFILE
══════════════════════════════════════ */
const ProfileSection = () => {
  const [saved, setSaved] = useState(false);
  const Field = ({ label, defaultValue, type = "text" }) => (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:11, fontWeight:700, color:C.sub, marginBottom:6, letterSpacing:.5 }}>
        {label.toUpperCase()}
      </div>
      <input defaultValue={defaultValue} type={type}
        style={{ width:"100%", padding:"11px 13px", background:C.card,
          border:`1px solid ${C.border}`, borderRadius:10, color:C.text,
          fontSize:14, outline:"none" }}/>
    </div>
  );

  return (
    <div>
      {/* Profile photo */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14,
        padding:20, marginBottom:20, display:"flex", alignItems:"center", gap:20 }}>
        <div style={{ width:80, height:80, borderRadius:"50%", background:`${C.green}18`,
          border:`3px solid ${C.green}40`, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:36, flexShrink:0 }}>🧑‍🔧</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:18, fontWeight:800, color:C.text }}>Marcus K.</div>
          <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>marcus@detailr.ca · Winnipeg, MB</div>
          <div style={{ display:"flex", gap:6, marginTop:8 }}>
            <span style={{ fontSize:11, background:`${C.green}18`, color:C.green,
              padding:"3px 9px", borderRadius:20, fontWeight:700 }}>✓ Verified Pro</span>
            <span style={{ fontSize:11, background:"rgba(245,166,35,0.15)", color:C.amber,
              padding:"3px 9px", borderRadius:20, fontWeight:700 }}>⭐ 4.9 · 203 Reviews</span>
          </div>
        </div>
        <button style={{ padding:"9px 16px", borderRadius:10, background:C.dim,
          border:`1px solid ${C.border}`, color:C.text, fontSize:13,
          fontWeight:600, cursor:"pointer" }}>Change Photo</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {/* Personal info */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16 }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>Personal Info</div>
          <Field label="Full Name"  defaultValue="Marcus K."/>
          <Field label="Email"      defaultValue="marcus@detailr.ca" type="email"/>
          <Field label="Phone"      defaultValue="+1 (204) 555-0134" type="tel"/>
          <Field label="City"       defaultValue="Winnipeg, MB"/>
        </div>

        {/* Business info */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16 }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>Business Info</div>
          <Field label="Business Name" defaultValue="FreshRide Detail Co."/>
          <Field label="Service Radius" defaultValue="25 km"/>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.sub, marginBottom:6, letterSpacing:.5 }}>BIO</div>
            <textarea defaultValue="Professional mobile detailer with 5+ years experience. Specializing in paint correction and ceramic coatings."
              rows={3} style={{ width:"100%", padding:"11px 13px", background:C.dim,
                border:`1px solid ${C.border}`, borderRadius:10, color:C.text,
                fontSize:13, outline:"none", resize:"none", lineHeight:1.5 }}/>
          </div>
        </div>
      </div>

      {/* Verification status */}
      <div style={{ marginTop:16, background:`${C.green}08`, border:`1px solid ${C.green}25`,
        borderRadius:14, padding:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:C.text }}>Verification Status</div>
          <div style={{ fontSize:12, color:C.sub, marginTop:3 }}>
            Your ID, background check, and insurance have been verified
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          {["ID ✓","Background ✓","Insurance ✓"].map(b => (
            <span key={b} style={{ fontSize:11, background:`${C.green}20`, color:C.green,
              padding:"4px 10px", borderRadius:20, fontWeight:700 }}>{b}</span>
          ))}
        </div>
      </div>

      <div style={{ marginTop:16 }}>
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
          style={{ padding:"13px 28px", borderRadius:12, background:C.green,
            color:"white", border:"none", fontSize:14, fontWeight:700,
            cursor:"pointer", boxShadow:`0 4px 16px ${C.green}45` }}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   SIDEBAR
══════════════════════════════════════ */
const SIDEBAR_NAV = [
  { id:"overview",  label:"Overview",  path:"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z", fill:true },
  { id:"jobs",      label:"Jobs",      path:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { id:"earnings",  label:"Earnings",  path:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id:"calendar",  label:"Calendar",  path:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id:"services",  label:"Services",  path:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  { id:"profile",   label:"Profile",   path:"M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
];

const Sidebar = ({ active, onNav }) => (
  <div style={{ width:210, background:C.panel, borderRight:`1px solid ${C.border}`,
    display:"flex", flexDirection:"column", position:"sticky", top:0, height:"100vh",
    overflowY:"auto", flexShrink:0 }}>

    {/* Logo */}
    <div style={{ padding:"22px 20px 18px", borderBottom:`1px solid ${C.border}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:`${C.green}25`,
          border:`1px solid ${C.green}50`, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:18 }}>🚐</div>
        <div>
          <div style={{ fontSize:16, fontWeight:900, color:C.text }}>Detailr</div>
          <div style={{ fontSize:10, color:C.green, fontWeight:700 }}>Pro Dashboard</div>
        </div>
      </div>
    </div>

    {/* Online status */}
    <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}` }}>
      <div style={{ background:`${C.green}10`, border:`1px solid ${C.green}30`,
        borderRadius:10, padding:"9px 12px", display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:8, height:8, borderRadius:"50%", background:C.green,
          boxShadow:`0 0 6px ${C.green}`, flexShrink:0 }}/>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:C.green }}>Online</div>
          <div style={{ fontSize:10, color:C.sub }}>Accepting requests</div>
        </div>
      </div>
    </div>

    {/* Nav items */}
    <nav style={{ padding:"10px 12px", flex:1 }}>
      <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:1,
        padding:"8px 8px 6px" }}>MAIN MENU</div>
      {SIDEBAR_NAV.map(n => {
        const isActive = active === n.id;
        return (
          <button key={n.id} onClick={() => onNav(n.id)}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:10,
              padding:"10px 10px", borderRadius:10, border:"none", cursor:"pointer",
              background:isActive ? `${C.green}15` : "transparent",
              color:isActive ? C.green : C.sub, fontFamily:C.f,
              fontSize:13, fontWeight:isActive ? 700 : 500,
              marginBottom:2, textAlign:"left", transition:"all .15s" }}>
            <svg width="18" height="18" viewBox="0 0 24 24"
              fill={n.fill && isActive ? C.green : "none"}
              stroke={isActive ? C.green : C.sub}
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={n.path}/>
            </svg>
            {n.label}
            {n.id === "jobs" && (
              <span style={{ marginLeft:"auto", fontSize:10, fontWeight:700, padding:"2px 6px",
                borderRadius:10, background:`${C.amber}20`, color:C.amber }}>2</span>
            )}
          </button>
        );
      })}
    </nav>

    {/* Profile at bottom */}
    <div style={{ padding:"12px 16px", borderTop:`1px solid ${C.border}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:34, height:34, borderRadius:"50%", background:`${C.green}20`,
          border:`2px solid ${C.green}40`, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:16, flexShrink:0 }}>🧑‍🔧</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.text }}>Marcus K.</div>
          <div style={{ fontSize:10, color:C.sub, overflow:"hidden", textOverflow:"ellipsis",
            whiteSpace:"nowrap" }}>Verified Pro</div>
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
    overview:"Overview", jobs:"Jobs", earnings:"Earnings",
    calendar:"Calendar", services:"Services", profile:"Profile",
  };
  return (
    <div style={{ padding:"16px 24px", borderBottom:`1px solid ${C.border}`,
      display:"flex", justifyContent:"space-between", alignItems:"center",
      background:C.panel, flexShrink:0 }}>
      <div>
        <div style={{ fontSize:20, fontWeight:800, color:C.text }}>{titles[section]}</div>
        <div style={{ fontSize:12, color:C.sub, marginTop:1 }}>
          Thursday, June 5, 2025
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {/* Notif */}
        <div style={{ position:"relative" }}>
          <button style={{ width:36, height:36, borderRadius:10, background:C.card,
            border:`1px solid ${C.border}`, display:"flex", alignItems:"center",
            justifyContent:"center", cursor:"pointer", fontSize:16 }}>🔔</button>
          <div style={{ position:"absolute", top:7, right:7, width:7, height:7,
            borderRadius:"50%", background:C.red, border:`1.5px solid ${C.panel}` }}/>
        </div>
        {/* Avatar */}
        <div style={{ width:36, height:36, borderRadius:10, background:`${C.green}20`,
          border:`1px solid ${C.green}40`, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:16, cursor:"pointer" }}>🧑‍🔧</div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   ROOT APP
══════════════════════════════════════ */
export default function PcDashboard() {
  const [section, setSection] = useState("overview");

  const sections = {
    overview: <OverviewSection go={setSection}/>,
    jobs:     <JobsSection/>,
    earnings: <EarningsSection/>,
    calendar: <CalendarSection/>,
    services: <ServicesSection/>,
    profile:  <ProfileSection/>,
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:C.f }}>
      <Sidebar active={section} onNav={setSection}/>

      {/* Main area */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden" }}>
        <TopBar section={section}/>
        <div style={{ flex:1, overflowY:"auto", padding:24 }}>
          {sections[section]}
        </div>
      </div>
    </div>
  );
}
