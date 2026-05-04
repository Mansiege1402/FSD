import React from "react";
import { useState, useEffect, useContext, createContext, useCallback } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:      #0d1117;
    --clay:     #1a1008;
    --moss:     #2d4a2d;
    --sage:     #4a7c59;
    --mint:     #7eb88a;
    --cream:    #f5f0e8;
    --warm:     #e8dfc8;
    --gold:     #c9952a;
    --amber:    #f0a830;
    --sand:     #d4b896;
    --error:    #c0392b;
    --success:  #27ae60;
    --r:        8px;
    --rL:       16px;
    --shadow:   0 2px 12px rgba(13,17,23,.12), 0 1px 3px rgba(13,17,23,.08);
    --shadowL:  0 8px 32px rgba(13,17,23,.18), 0 2px 8px rgba(13,17,23,.10);
    --trans:    .2s cubic-bezier(.4,0,.2,1);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--ink);
    line-height: 1.6;
    min-height: 100vh;
  }

  /* ── layout ── */
  .app-wrap { display:flex; flex-direction:column; min-height:100vh; }
  .main-content { flex:1; }

  /* ── nav ── */
  .nav {
    position: sticky; top:0; z-index:100;
    background: var(--clay);
    display: flex; align-items:center; justify-content:space-between;
    padding: 0 2rem;
    height: 64px;
    box-shadow: 0 2px 16px rgba(0,0,0,.25);
  }
  .nav-brand {
    font-family: 'Fraunces', serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--amber);
    letter-spacing: -.02em;
    cursor: pointer;
    display:flex; align-items:center; gap:.5rem;
  }
  .nav-brand span { font-size:1.6rem; }
  .nav-links { display:flex; align-items:center; gap:.5rem; }
  .nav-btn {
    background: none; border: none; cursor:pointer;
    color: var(--warm); font-family:'DM Sans',sans-serif; font-size:.9rem;
    padding: .45rem .9rem; border-radius: var(--r);
    transition: background var(--trans), color var(--trans);
  }
  .nav-btn:hover { background: rgba(255,255,255,.1); color:#fff; }
  .nav-btn.active { background: var(--sage); color:#fff; }
  .nav-btn.primary {
    background: var(--gold); color: var(--clay);
    font-weight: 600;
  }
  .nav-btn.primary:hover { background: var(--amber); }
  .nav-pill {
    background: var(--sage); color:#fff;
    font-size:.75rem; padding:.2rem .55rem; border-radius:99px;
    font-weight:600; margin-left:.4rem;
  }

  /* ── hero ── */
  .hero {
    background: var(--clay);
    color: var(--cream);
    padding: 6rem 2rem 5rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content:'';
    position:absolute; inset:0;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(74,124,89,.35) 0%, transparent 70%);
    pointer-events:none;
  }
  .hero-eyebrow {
    font-size:.8rem; font-weight:600; letter-spacing:.15em; text-transform:uppercase;
    color: var(--mint); margin-bottom:1rem;
  }
  .hero h1 {
    font-family:'Fraunces',serif; font-size:clamp(2.4rem,6vw,4.2rem);
    line-height:1.1; font-weight:900;
    margin-bottom:1.2rem;
    background: linear-gradient(135deg, #fff 30%, var(--amber) 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  }
  .hero-sub { font-size:1.1rem; color:var(--sand); max-width:560px; margin:0 auto 2.5rem; }
  .hero-ctas { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; }
  .btn { display:inline-flex; align-items:center; gap:.45rem; border:none; cursor:pointer;
    font-family:'DM Sans',sans-serif; font-weight:600; border-radius:var(--r);
    padding:.7rem 1.6rem; font-size:.95rem; transition: all var(--trans); text-decoration:none; }
  .btn-primary { background:var(--gold); color:var(--clay); }
  .btn-primary:hover { background:var(--amber); transform:translateY(-1px); box-shadow:var(--shadow); }
  .btn-outline { background:transparent; color:#fff; border:2px solid rgba(255,255,255,.35); }
  .btn-outline:hover { border-color:#fff; background:rgba(255,255,255,.08); }
  .btn-sm { padding:.45rem 1rem; font-size:.85rem; }
  .btn-ghost { background:transparent; color:var(--sage); padding:.4rem .8rem; border-radius:var(--r); }
  .btn-ghost:hover { background:rgba(74,124,89,.1); }
  .btn-danger { background:var(--error); color:#fff; }
  .btn-danger:hover { opacity:.88; }
  .btn-success { background:var(--success); color:#fff; }
  .btn-success:hover { opacity:.88; }

  /* ── stats strip ── */
  .stats-strip {
    background: var(--moss);
    display:flex; justify-content:center; flex-wrap:wrap; gap:0;
  }
  .stat-item {
    padding:1.4rem 2.5rem; text-align:center; color:#fff;
    border-right: 1px solid rgba(255,255,255,.15);
  }
  .stat-item:last-child { border-right:none; }
  .stat-num { font-family:'Fraunces',serif; font-size:2rem; font-weight:700; color:var(--amber); }
  .stat-label { font-size:.8rem; color:rgba(255,255,255,.7); text-transform:uppercase; letter-spacing:.08em; }

  /* ── section ── */
  .section { padding:4rem 2rem; max-width:1100px; margin:0 auto; }
  .section-title {
    font-family:'Fraunces',serif; font-size:clamp(1.6rem,3.5vw,2.4rem);
    font-weight:700; margin-bottom:.4rem; color:var(--clay);
  }
  .section-sub { color:#666; margin-bottom:2.5rem; }

  /* ── cards grid ── */
  .cards-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1.5rem; }
  .card {
    background:#fff; border-radius:var(--rL); padding:1.5rem;
    box-shadow:var(--shadow); border:1px solid rgba(0,0,0,.06);
    transition:transform var(--trans), box-shadow var(--trans);
  }
  .card:hover { transform:translateY(-2px); box-shadow:var(--shadowL); }
  .card-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; }
  .card-title { font-family:'Fraunces',serif; font-size:1.15rem; font-weight:700; color:var(--clay); }
  .card-meta { font-size:.82rem; color:#888; margin:.25rem 0; display:flex; align-items:center; gap:.3rem; }
  .card-body { font-size:.92rem; color:#555; line-height:1.65; margin:.5rem 0 1rem; }
  .card-footer { display:flex; gap:.6rem; align-items:center; flex-wrap:wrap; margin-top:auto; }
  .badge {
    font-size:.73rem; font-weight:600; padding:.25rem .65rem; border-radius:99px;
    letter-spacing:.04em; text-transform:uppercase;
  }
  .badge-green { background:rgba(39,174,96,.12); color:var(--success); }
  .badge-amber { background:rgba(201,149,42,.14); color:var(--gold); }
  .badge-blue  { background:rgba(52,152,219,.12); color:#2980b9; }
  .badge-gray  { background:#f0f0f0; color:#666; }
  .badge-red   { background:rgba(192,57,43,.12); color:var(--error); }

  /* ── forms ── */
  .form-overlay {
    position:fixed; inset:0; background:rgba(13,17,23,.7);
    z-index:200; display:flex; align-items:center; justify-content:center; padding:1rem;
    backdrop-filter:blur(4px);
    animation: fadeIn .2s ease;
  }
  @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
  .form-panel {
    background:#fff; border-radius:var(--rL); padding:2rem;
    width:100%; max-width:480px; max-height:90vh; overflow-y:auto;
    box-shadow:var(--shadowL);
    animation: slideUp .25s cubic-bezier(.4,0,.2,1);
  }
  @keyframes slideUp { from{transform:translateY(24px);opacity:0;} to{transform:none;opacity:1;} }
  .form-title { font-family:'Fraunces',serif; font-size:1.5rem; font-weight:700; margin-bottom:1.5rem; color:var(--clay); }
  .form-group { margin-bottom:1.1rem; }
  label { display:block; font-size:.85rem; font-weight:600; color:#444; margin-bottom:.4rem; }
  input, textarea, select {
    width:100%; padding:.65rem .9rem; border:1.5px solid #ddd;
    border-radius:var(--r); font-family:'DM Sans',sans-serif; font-size:.93rem;
    background:#fafafa; color:var(--ink);
    transition: border-color var(--trans), box-shadow var(--trans);
    outline:none;
  }
  input:focus, textarea:focus, select:focus {
    border-color:var(--sage); box-shadow:0 0 0 3px rgba(74,124,89,.15);
    background:#fff;
  }
  textarea { resize:vertical; min-height:90px; }
  .form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
  .form-actions { display:flex; gap:.8rem; justify-content:flex-end; margin-top:1.5rem; }
  .form-error { background:rgba(192,57,43,.1); color:var(--error); border-radius:var(--r);
    padding:.7rem 1rem; font-size:.88rem; margin-bottom:1rem; }
  .form-switch { margin-top:1rem; font-size:.88rem; color:#666; text-align:center; }
  .form-switch button { background:none; border:none; color:var(--sage); font-weight:600; cursor:pointer; }

  /* ── dashboard ── */
  .dash-layout { display:grid; grid-template-columns:220px 1fr; min-height:calc(100vh - 64px); }
  .dash-sidebar {
    background:var(--clay); padding:1.5rem 1rem;
    display:flex; flex-direction:column; gap:.3rem;
  }
  .dash-sidebar-title {
    font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.12em;
    color:rgba(255,255,255,.4); padding:.5rem .6rem; margin-top:1rem;
  }
  .dash-sidebar-title:first-child { margin-top:0; }
  .sidebar-link {
    display:flex; align-items:center; gap:.65rem;
    background:none; border:none; cursor:pointer; width:100%;
    text-align:left; padding:.6rem .8rem; border-radius:var(--r);
    color:rgba(255,255,255,.7); font-family:'DM Sans',sans-serif; font-size:.9rem;
    transition: background var(--trans), color var(--trans);
  }
  .sidebar-link:hover { background:rgba(255,255,255,.1); color:#fff; }
  .sidebar-link.active { background:var(--sage); color:#fff; }
  .sidebar-link .icon { font-size:1.1rem; width:20px; text-align:center; }

  .dash-content { background:var(--cream); padding:2rem; overflow-y:auto; }
  .dash-header { margin-bottom:2rem; }
  .dash-header h2 { font-family:'Fraunces',serif; font-size:1.8rem; font-weight:700; color:var(--clay); }
  .dash-header p { color:#666; font-size:.95rem; margin-top:.2rem; }

  .kpi-row { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:1rem; margin-bottom:2rem; }
  .kpi-card {
    background:#fff; border-radius:var(--rL); padding:1.25rem 1.5rem;
    box-shadow:var(--shadow); border:1px solid rgba(0,0,0,.06);
  }
  .kpi-icon { font-size:1.8rem; margin-bottom:.5rem; }
  .kpi-val { font-family:'Fraunces',serif; font-size:2rem; font-weight:700; color:var(--clay); }
  .kpi-label { font-size:.8rem; color:#888; text-transform:uppercase; letter-spacing:.06em; }

  /* ── table ── */
  .table-wrap { background:#fff; border-radius:var(--rL); box-shadow:var(--shadow); overflow:hidden; border:1px solid rgba(0,0,0,.06); }
  table { width:100%; border-collapse:collapse; }
  thead { background:var(--clay); color:#fff; }
  thead th { padding:.85rem 1.1rem; text-align:left; font-size:.82rem; font-weight:600; letter-spacing:.05em; text-transform:uppercase; }
  tbody tr { border-bottom:1px solid #f0f0f0; transition:background var(--trans); }
  tbody tr:last-child { border-bottom:none; }
  tbody tr:hover { background:#fafaf8; }
  td { padding:.85rem 1.1rem; font-size:.9rem; color:#444; vertical-align:middle; }

  /* ── empty state ── */
  .empty { text-align:center; padding:4rem 2rem; color:#999; }
  .empty-icon { font-size:3.5rem; margin-bottom:1rem; }
  .empty h3 { font-family:'Fraunces',serif; color:#bbb; margin-bottom:.5rem; }

  /* ── toast ── */
  .toast-container { position:fixed; bottom:1.5rem; right:1.5rem; z-index:999; display:flex; flex-direction:column; gap:.6rem; }
  .toast {
    background:var(--clay); color:#fff; padding:.8rem 1.2rem; border-radius:var(--r);
    box-shadow:var(--shadowL); font-size:.9rem; display:flex; align-items:center; gap:.6rem;
    animation:slideUp .25s ease;
    max-width:320px;
  }
  .toast.success { border-left:3px solid var(--success); }
  .toast.error   { border-left:3px solid var(--error); }
  .toast.info    { border-left:3px solid var(--amber); }

  /* ── chips ── */
  .chips { display:flex; gap:.5rem; flex-wrap:wrap; margin-bottom:1.5rem; }
  .chip {
    background:#fff; border:1.5px solid #ddd; color:#555;
    font-size:.82rem; padding:.3rem .85rem; border-radius:99px;
    cursor:pointer; transition:all var(--trans); font-weight:500;
  }
  .chip:hover { border-color:var(--sage); color:var(--sage); }
  .chip.active { background:var(--sage); border-color:var(--sage); color:#fff; }

  /* ── search ── */
  .search-bar {
    display:flex; gap:.8rem; margin-bottom:1.5rem; align-items:center; flex-wrap:wrap;
  }
  .search-input-wrap { position:relative; flex:1; min-width:220px; }
  .search-input-wrap input { padding-left:2.4rem; }
  .search-icon { position:absolute; left:.8rem; top:50%; transform:translateY(-50%); color:#aaa; font-size:1rem; }

  /* ── tabs ── */
  .tabs { display:flex; border-bottom:2px solid #e8e8e8; margin-bottom:1.5rem; gap:.2rem; }
  .tab {
    background:none; border:none; cursor:pointer; padding:.65rem 1.2rem;
    font-family:'DM Sans',sans-serif; font-size:.9rem; color:#888;
    border-bottom:2px solid transparent; margin-bottom:-2px;
    transition:color var(--trans), border-color var(--trans);
  }
  .tab.active { color:var(--sage); border-bottom-color:var(--sage); font-weight:600; }
  .tab:hover:not(.active) { color:var(--clay); }

  /* ── footer ── */
  .footer { background:var(--clay); color:rgba(255,255,255,.55); text-align:center; padding:1.5rem; font-size:.83rem; }
  .footer a { color:var(--mint); text-decoration:none; }

  /* ── misc ── */
  .divider { height:1px; background:#eee; margin:1.5rem 0; }
  .tag-row { display:flex; gap:.4rem; flex-wrap:wrap; margin-top:.6rem; }
  .avatar {
    width:36px; height:36px; border-radius:50%; background:var(--sage);
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-weight:700; font-size:.9rem; flex-shrink:0;
  }
  .avatar-lg { width:52px; height:52px; font-size:1.2rem; }

  /* ── progress ── */
  .progress-bar { height:6px; background:#e8e8e8; border-radius:99px; overflow:hidden; margin-top:.5rem; }
  .progress-fill { height:100%; background:var(--sage); border-radius:99px; transition:width .5s ease; }

  /* ── responsive ── */
  @media(max-width:768px) {
    .dash-layout { grid-template-columns:1fr; }
    .dash-sidebar { display:none; }
    .form-row { grid-template-columns:1fr; }
    .hero h1 { font-size:2.2rem; }
    .stat-item { padding:1rem 1.5rem; }
  }
`;

// ─── Context & State ──────────────────────────────────────────────────────────
const AppContext = createContext(null);

const INITIAL_OPPORTUNITIES = [
  { id: 1, title: "Beach Cleanup Drive", ngo: "Ocean Savers", ngoId: 2, description: "Join us to clean the shorelines of Juhu Beach. Equipment provided. All skill levels welcome.", date: "2026-05-20", location: "Mumbai", category: "Environment", slots: 30, filled: 18, status: "active" },
  { id: 2, title: "Literacy Camp – Rural Schools", ngo: "Teach Forward", ngoId: 3, description: "Teach basic reading and math to primary school children in Thane district for 3 weekends.", date: "2026-05-25", location: "Thane", category: "Education", slots: 12, filled: 9, status: "active" },
  { id: 3, title: "Tree Plantation Weekend", ngo: "Green Mumbai", ngoId: 2, description: "Plant 1000 saplings in Aarey Colony. A great way to contribute to urban biodiversity.", date: "2026-06-05", location: "Mumbai", category: "Environment", slots: 50, filled: 22, status: "active" },
  { id: 4, title: "Blood Donation Camp", ngo: "LifeLine Trust", ngoId: 4, description: "Organize and assist at a blood donation drive. No medical background required for logistics support.", date: "2026-06-12", location: "Pune", category: "Health", slots: 20, filled: 7, status: "active" },
  { id: 5, title: "Women's Self-Defence Workshop", ngo: "Empower Her", ngoId: 5, description: "Support a 2-day workshop teaching self-defence and safety awareness to 80 women.", date: "2026-05-30", location: "Nashik", category: "Social", slots: 15, filled: 15, status: "full" },
];

const INITIAL_NGOS = [
  { id: 2, name: "Ocean Savers", email: "ocean@example.com", password: "pass123", role: "NGO", verified: true, description: "Protecting coastlines and marine life since 2010.", focus: "Environment", location: "Mumbai" },
  { id: 3, name: "Teach Forward", email: "teach@example.com", password: "pass123", role: "NGO", verified: true, description: "Bridging the rural education gap.", focus: "Education", location: "Thane" },
  { id: 4, name: "LifeLine Trust", email: "life@example.com", password: "pass123", role: "NGO", verified: true, description: "Healthcare outreach for underserved communities.", focus: "Health", location: "Pune" },
  { id: 5, name: "Empower Her", email: "empower@example.com", password: "pass123", role: "NGO", verified: false, description: "Safety and empowerment programs for women.", focus: "Social", location: "Nashik" },
];

const INITIAL_APPLICATIONS = [
  { id: 1, userId: 1, opportunityId: 1, status: "approved", appliedAt: "2026-04-20", note: "" },
  { id: 2, userId: 1, opportunityId: 3, status: "pending", appliedAt: "2026-04-22", note: "" },
];

const CATEGORIES = ["All", "Environment", "Education", "Health", "Social", "Animals", "Disaster Relief"];

// ─── Helper Components ────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

function Avatar({ name, large }) {
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() : "?";
  return <div className={`avatar${large ? " avatar-lg" : ""}`}>{initials}</div>;
}

function Badge({ type, children }) {
  return <span className={`badge badge-${type}`}>{children}</span>;
}

function EmptyState({ icon, title, sub }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{sub}</p>
    </div>
  );
}

// ─── Auth Forms ───────────────────────────────────────────────────────────────
function AuthModal({ mode, onClose, onSuccess }) {
  const [tab, setTab] = useState(mode || "login");
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"Volunteer", focus:"", location:"" });
  const [error, setError] = useState("");
  const ctx = useContext(AppContext);

  function set(k, v) { setForm(f => ({...f, [k]:v})); setError(""); }

  function handleLogin() {
    const allUsers = [...ctx.users, ...ctx.ngos];
    const user = allUsers.find(u => u.email === form.email && u.password === form.password);
    if (!user) { setError("Invalid email or password."); return; }
    ctx.setCurrentUser(user);
    ctx.toast("Welcome back, " + user.name + "! 👋", "success");
    onSuccess(user);
  }

  function handleRegister() {
    if (!form.name || !form.email || !form.password) { setError("All fields are required."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    const allUsers = [...ctx.users, ...ctx.ngos];
    if (allUsers.find(u => u.email === form.email)) { setError("Email already registered."); return; }
    const newUser = {
      id: Date.now(), name: form.name, email: form.email, password: form.password,
      role: form.role, verified: form.role === "Volunteer",
      description: "", focus: form.focus, location: form.location,
      joinedAt: new Date().toISOString().split("T")[0]
    };
    if (form.role === "NGO") ctx.setNgos(n => [...n, newUser]);
    else ctx.setUsers(u => [...u, newUser]);
    ctx.setCurrentUser(newUser);
    ctx.toast("Account created! Welcome, " + newUser.name + " 🎉", "success");
    onSuccess(newUser);
  }

  return (
    <div className="form-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="form-panel">
        <div className="tabs">
          <button className={`tab${tab==="login"?" active":""}`} onClick={() => setTab("login")}>Sign In</button>
          <button className={`tab${tab==="register"?" active":""}`} onClick={() => setTab("register")}>Register</button>
        </div>
        {error && <div className="form-error">{error}</div>}
        {tab === "login" ? (
          <>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="you@example.com" /></div>
            <div className="form-group"><label>Password</label><input type="password" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="••••••" /></div>
            <div style={{fontSize:".8rem",color:"#999",marginBottom:"1rem"}}>Demo: volunteer@demo.com / pass123 &nbsp;|&nbsp; ocean@example.com / pass123</div>
            <button className="btn btn-primary" style={{width:"100%"}} onClick={handleLogin}>Sign In →</button>
          </>
        ) : (
          <>
            <div className="form-group"><label>Full Name / Org Name</label><input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Your name" /></div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e=>set("email",e.target.value)} /></div>
            <div className="form-group"><label>Password</label><input type="password" value={form.password} onChange={e=>set("password",e.target.value)} /></div>
            <div className="form-group">
              <label>I am a</label>
              <select value={form.role} onChange={e=>set("role",e.target.value)}>
                <option value="Volunteer">Volunteer</option>
                <option value="NGO">NGO / Organisation</option>
              </select>
            </div>
            {form.role === "NGO" && (
              <>
                <div className="form-row">
                  <div className="form-group"><label>Focus Area</label><input value={form.focus} onChange={e=>set("focus",e.target.value)} placeholder="e.g. Environment" /></div>
                  <div className="form-group"><label>Location</label><input value={form.location} onChange={e=>set("location",e.target.value)} placeholder="City" /></div>
                </div>
              </>
            )}
            <button className="btn btn-primary" style={{width:"100%"}} onClick={handleRegister}>Create Account →</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Opportunity Card ─────────────────────────────────────────────────────────
function OpportunityCard({ opp, onApply, onView, userApplications, currentUser }) {
  const pct = Math.round((opp.filled / opp.slots) * 100);
  const hasApplied = userApplications?.some(a => a.opportunityId === opp.id);
  const isFull = opp.status === "full" || opp.filled >= opp.slots;
  const statusBadge = isFull ? "red" : pct > 70 ? "amber" : "green";
  const statusText = isFull ? "Full" : pct > 70 ? "Filling Fast" : "Open";

  return (
    <div className="card" style={{display:"flex", flexDirection:"column"}}>
      <div className="card-header">
        <div>
          <div className="card-title">{opp.title}</div>
          <div className="card-meta">🏛 {opp.ngo}</div>
        </div>
        <Badge type={statusBadge}>{statusText}</Badge>
      </div>
      <div className="card-meta">📅 {opp.date} &nbsp;|&nbsp; 📍 {opp.location}</div>
      <div className="card-body">{opp.description}</div>
      <div className="progress-bar"><div className="progress-fill" style={{width:`${pct}%`}}></div></div>
      <div style={{fontSize:".78rem",color:"#999",margin:".35rem 0 1rem"}}>{opp.filled}/{opp.slots} volunteers filled</div>
      <div className="tag-row" style={{marginBottom:"1rem"}}>
        <Badge type="blue">{opp.category}</Badge>
      </div>
      <div className="card-footer" style={{marginTop:"auto"}}>
        <button className="btn btn-ghost btn-sm" onClick={() => onView(opp)}>Details</button>
        {currentUser?.role === "Volunteer" && (
          hasApplied
            ? <Badge type="green">✓ Applied</Badge>
            : <button className={`btn btn-sm btn-primary`} disabled={isFull} onClick={() => onApply(opp)}>{isFull ? "Full" : "Apply Now"}</button>
        )}
        {!currentUser && <button className="btn btn-sm btn-primary" onClick={() => onApply(opp)}>Apply Now</button>}
      </div>
    </div>
  );
}

// ─── Opportunity Detail Modal ──────────────────────────────────────────────────
function OpportunityModal({ opp, onClose, onApply, hasApplied, currentUser }) {
  const isFull = opp.status === "full" || opp.filled >= opp.slots;
  const pct = Math.round((opp.filled / opp.slots) * 100);
  return (
    <div className="form-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="form-panel" style={{maxWidth:540}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.2rem"}}>
          <h2 className="form-title" style={{margin:0}}>{opp.title}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="card-meta">🏛 {opp.ngo} &nbsp;|&nbsp; 📍 {opp.location}</div>
        <div className="card-meta" style={{marginTop:".3rem"}}>📅 {opp.date} &nbsp;|&nbsp; 🏷 {opp.category}</div>
        <div className="divider" />
        <p style={{color:"#444",lineHeight:1.7,marginBottom:"1.2rem"}}>{opp.description}</p>
        <div style={{background:"#f8f8f5",borderRadius:"var(--r)",padding:"1rem",marginBottom:"1.5rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:".88rem",marginBottom:".5rem"}}>
            <span style={{color:"#666"}}>Volunteer spots</span>
            <strong>{opp.filled}/{opp.slots}</strong>
          </div>
          <div className="progress-bar" style={{height:8}}><div className="progress-fill" style={{width:`${pct}%`}}></div></div>
          <div style={{fontSize:".78rem",color:"#999",marginTop:".35rem"}}>{opp.slots-opp.filled} spots remaining</div>
        </div>
        {currentUser?.role === "Volunteer" && (
          hasApplied
            ? <div style={{textAlign:"center",color:"var(--success)",fontWeight:600}}>✓ You have already applied to this opportunity.</div>
            : <button className="btn btn-primary" style={{width:"100%"}} disabled={isFull} onClick={onApply}>{isFull ? "This opportunity is full" : "Apply for this Opportunity"}</button>
        )}
        {!currentUser && <button className="btn btn-primary" style={{width:"100%"}} onClick={onApply}>Sign in to Apply</button>}
      </div>
    </div>
  );
}

// ─── Create Opportunity Form ───────────────────────────────────────────────────
function CreateOpportunityForm({ onClose, onSave, existing }) {
  const [form, setForm] = useState(existing || { title:"", description:"", date:"", location:"", category:"Environment", slots:20 });
  const [err, setErr] = useState("");
  function set(k,v) { setForm(f=>({...f,[k]:v})); setErr(""); }
  function save() {
    if (!form.title || !form.description || !form.date || !form.location) { setErr("Please fill all required fields."); return; }
    onSave(form);
  }
  return (
    <div className="form-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="form-panel" style={{maxWidth:520}}>
        <h2 className="form-title">{existing ? "Edit Opportunity" : "Post New Opportunity"}</h2>
        {err && <div className="form-error">{err}</div>}
        <div className="form-group"><label>Title *</label><input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. River Cleanup Drive" /></div>
        <div className="form-group"><label>Description *</label><textarea value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Describe the opportunity, requirements, what to expect…" /></div>
        <div className="form-row">
          <div className="form-group"><label>Date *</label><input type="date" value={form.date} onChange={e=>set("date",e.target.value)} /></div>
          <div className="form-group"><label>Location *</label><input value={form.location} onChange={e=>set("location",e.target.value)} placeholder="City" /></div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={e=>set("category",e.target.value)}>
              {CATEGORIES.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Volunteer Slots</label><input type="number" min="1" max="500" value={form.slots} onChange={e=>set("slots",+e.target.value)} /></div>
        </div>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>💾 {existing ? "Save Changes" : "Post Opportunity"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Apply Confirmation ────────────────────────────────────────────────────────
function ApplyModal({ opp, onClose, onConfirm }) {
  const [note, setNote] = useState("");
  return (
    <div className="form-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="form-panel" style={{maxWidth:440}}>
        <h2 className="form-title">Confirm Application</h2>
        <p style={{color:"#555",marginBottom:"1.2rem"}}>You are applying for <strong>{opp.title}</strong> on {opp.date} in {opp.location}.</p>
        <div className="form-group">
          <label>Message to NGO (optional)</label>
          <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Introduce yourself, share relevant skills or experience…" />
        </div>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onConfirm(note)}>Submit Application →</button>
        </div>
      </div>
    </div>
  );
}

// ─── Public Home Page ─────────────────────────────────────────────────────────
function HomePage({ onApply, onAuthRequired, setPage }) {
  const ctx = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [viewOpp, setViewOpp] = useState(null);
  const [applyOpp, setApplyOpp] = useState(null);

  const filtered = ctx.opportunities.filter(o => {
    const matchCat = cat === "All" || o.category === cat;
    const matchSearch = !search || o.title.toLowerCase().includes(search.toLowerCase()) || o.location.toLowerCase().includes(search.toLowerCase()) || o.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const userApps = ctx.applications.filter(a => a.userId === ctx.currentUser?.id);

  function handleApply(opp) {
    if (!ctx.currentUser) { onAuthRequired(opp); return; }
    if (ctx.currentUser.role === "NGO") { ctx.toast("NGOs cannot apply to opportunities.", "error"); return; }
    setApplyOpp(opp);
  }

  function confirmApply(note) {
    const app = { id: Date.now(), userId: ctx.currentUser.id, opportunityId: applyOpp.id, status: "pending", appliedAt: new Date().toISOString().split("T")[0], note };
    ctx.setApplications(a => [...a, app]);
    ctx.setOpportunities(ops => ops.map(o => o.id === applyOpp.id ? {...o, filled: o.filled+1} : o));
    ctx.toast("Application submitted! 🎉", "success");
    setApplyOpp(null);
  }

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">🌿 Volunteer Connect India</div>
        <h1>Make an Impact.<br />Find Your Cause.</h1>
        <p className="hero-sub">Connect with verified NGOs across India. Discover volunteer opportunities that match your skills and passion.</p>
        <div className="hero-ctas">
          <button className="btn btn-primary" onClick={() => document.getElementById("opps").scrollIntoView({behavior:"smooth"})}>Browse Opportunities</button>
          {!ctx.currentUser && <button className="btn btn-outline" onClick={() => onAuthRequired(null)}>Sign Up Free</button>}
          {ctx.currentUser && <button className="btn btn-outline" onClick={() => setPage(ctx.currentUser.role === "NGO" ? "ngo-dash" : "volunteer-dash")}>My Dashboard →</button>}
        </div>
      </section>

      {/* Stats */}
      <div className="stats-strip">
        <div className="stat-item"><div className="stat-num">{ctx.opportunities.length}</div><div className="stat-label">Opportunities</div></div>
        <div className="stat-item"><div className="stat-num">{ctx.ngos.length}</div><div className="stat-label">NGOs</div></div>
        <div className="stat-item"><div className="stat-num">{ctx.applications.length}</div><div className="stat-label">Applications</div></div>
        <div className="stat-item"><div className="stat-num">{ctx.users.length + ctx.ngos.length}</div><div className="stat-label">Members</div></div>
      </div>

      {/* Listings */}
      <div className="section" id="opps">
        <h2 className="section-title">Open Opportunities</h2>
        <p className="section-sub">Find volunteer work near you across categories</p>

        <div className="search-bar">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by title, location, or keyword…" />
          </div>
        </div>

        <div className="chips">
          {CATEGORIES.map(c => <button key={c} className={`chip${cat===c?" active":""}`} onClick={()=>setCat(c)}>{c}</button>)}
        </div>

        {filtered.length === 0
          ? <EmptyState icon="🔭" title="No results found" sub="Try adjusting your search or category filter." />
          : <div className="cards-grid">
              {filtered.map(opp => (
                <OpportunityCard key={opp.id} opp={opp}
                  onApply={handleApply}
                  onView={o => setViewOpp(o)}
                  userApplications={userApps}
                  currentUser={ctx.currentUser}
                />
              ))}
            </div>
        }
      </div>

      {/* NGO showcase */}
      <div style={{background:"#fff", borderTop:"1px solid #eee", padding:"4rem 2rem"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <h2 className="section-title">Partner NGOs</h2>
          <p className="section-sub">Verified organisations doing meaningful work</p>
          <div className="cards-grid">
            {ctx.ngos.filter(n=>n.verified).map(ngo => (
              <div className="card" key={ngo.id} style={{display:"flex",flexDirection:"column",gap:".5rem"}}>
                <div style={{display:"flex",gap:"1rem",alignItems:"center"}}>
                  <Avatar name={ngo.name} large />
                  <div>
                    <div className="card-title">{ngo.name}</div>
                    <div className="card-meta">📍 {ngo.location} · {ngo.focus}</div>
                  </div>
                </div>
                <p style={{color:"#666",fontSize:".9rem",marginTop:".3rem"}}>{ngo.description || "Making a difference."}</p>
                <div style={{marginTop:"auto"}}>
                  <Badge type="green">✓ Verified</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {viewOpp && <OpportunityModal opp={viewOpp} onClose={()=>setViewOpp(null)}
        onApply={() => { setViewOpp(null); handleApply(viewOpp); }}
        hasApplied={userApps.some(a=>a.opportunityId===viewOpp.id)}
        currentUser={ctx.currentUser} />}
      {applyOpp && <ApplyModal opp={applyOpp} onClose={()=>setApplyOpp(null)} onConfirm={confirmApply} />}
    </div>
  );
}

// ─── Volunteer Dashboard ────────────────────────────────────────────────────────
function VolunteerDashboard({ setPage }) {
  const ctx = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("overview");
  const user = ctx.currentUser;
  const myApps = ctx.applications.filter(a => a.userId === user.id);
  const myOpps = myApps.map(a => ({
    ...a,
    opp: ctx.opportunities.find(o => o.id === a.opportunityId)
  })).filter(a => a.opp);

  const approved = myApps.filter(a => a.status === "approved").length;
  const pending = myApps.filter(a => a.status === "pending").length;

  function cancelApp(appId) {
    const app = ctx.applications.find(a => a.id === appId);
    ctx.setOpportunities(ops => ops.map(o => o.id === app.opportunityId ? {...o, filled: Math.max(0, o.filled-1)} : o));
    ctx.setApplications(a => a.filter(a => a.id !== appId));
    ctx.toast("Application withdrawn.", "info");
  }

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="dash-sidebar-title">Navigation</div>
        <button className={`sidebar-link${activeTab==="overview"?" active":""}`} onClick={()=>setActiveTab("overview")}><span className="icon">🏠</span> Overview</button>
        <button className={`sidebar-link${activeTab==="applications"?" active":""}`} onClick={()=>setActiveTab("applications")}><span className="icon">📋</span> My Applications</button>
        <button className={`sidebar-link${activeTab==="browse"?" active":""}`} onClick={()=>setPage("home")}><span className="icon">🔍</span> Browse Opportunities</button>
        <div className="dash-sidebar-title">Account</div>
        <button className="sidebar-link" onClick={()=>{ ctx.setCurrentUser(null); setPage("home"); ctx.toast("Signed out.", "info"); }}><span className="icon">🚪</span> Sign Out</button>
      </aside>
      <div className="dash-content">
        {activeTab === "overview" && (
          <>
            <div className="dash-header">
              <h2>Welcome back, {user.name.split(" ")[0]}! 👋</h2>
              <p>Track your volunteer journey and discover new opportunities.</p>
            </div>
            <div className="kpi-row">
              <div className="kpi-card"><div className="kpi-icon">📋</div><div className="kpi-val">{myApps.length}</div><div className="kpi-label">Total Applied</div></div>
              <div className="kpi-card"><div className="kpi-icon">✅</div><div className="kpi-val">{approved}</div><div className="kpi-label">Approved</div></div>
              <div className="kpi-card"><div className="kpi-icon">⏳</div><div className="kpi-val">{pending}</div><div className="kpi-label">Pending</div></div>
              <div className="kpi-card"><div className="kpi-icon">🌟</div><div className="kpi-val">{approved * 4}h</div><div className="kpi-label">Volunteer Hours</div></div>
            </div>
            <h3 style={{fontFamily:"Fraunces, serif",fontSize:"1.2rem",marginBottom:"1rem",color:"var(--clay)"}}>Recent Applications</h3>
            {myOpps.length === 0
              ? <EmptyState icon="📭" title="No applications yet" sub="Browse opportunities and apply to get started!" />
              : <div className="table-wrap"><table>
                  <thead><tr><th>Opportunity</th><th>Date</th><th>Location</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {myOpps.slice(0,5).map(a=>(
                      <tr key={a.id}>
                        <td><strong>{a.opp.title}</strong><br/><span style={{fontSize:".8rem",color:"#888"}}>{a.opp.ngo}</span></td>
                        <td>{a.opp.date}</td>
                        <td>{a.opp.location}</td>
                        <td><Badge type={a.status==="approved"?"green":a.status==="rejected"?"red":"amber"}>{a.status}</Badge></td>
                        <td>{a.status==="pending"&&<button className="btn btn-ghost btn-sm" style={{color:"var(--error)"}} onClick={()=>cancelApp(a.id)}>Withdraw</button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table></div>
            }
          </>
        )}
        {activeTab === "applications" && (
          <>
            <div className="dash-header"><h2>My Applications</h2><p>All your volunteer applications in one place.</p></div>
            {myOpps.length === 0
              ? <EmptyState icon="📭" title="No applications yet" sub="Head to Browse Opportunities to apply!" />
              : <div className="table-wrap"><table>
                  <thead><tr><th>Opportunity</th><th>NGO</th><th>Date</th><th>Location</th><th>Applied</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {myOpps.map(a=>(
                      <tr key={a.id}>
                        <td><strong>{a.opp.title}</strong></td>
                        <td>{a.opp.ngo}</td>
                        <td>{a.opp.date}</td>
                        <td>{a.opp.location}</td>
                        <td style={{color:"#888",fontSize:".85rem"}}>{a.appliedAt}</td>
                        <td><Badge type={a.status==="approved"?"green":a.status==="rejected"?"red":"amber"}>{a.status}</Badge></td>
                        <td>{a.status==="pending"&&<button className="btn btn-ghost btn-sm" style={{color:"var(--error)"}} onClick={()=>cancelApp(a.id)}>Withdraw</button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table></div>
            }
          </>
        )}
      </div>
    </div>
  );
}

// ─── NGO Dashboard ─────────────────────────────────────────────────────────────
function NgoDashboard({ setPage }) {
  const ctx = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreate, setShowCreate] = useState(false);
  const [editOpp, setEditOpp] = useState(null);
  const ngo = ctx.currentUser;
  const myOpps = ctx.opportunities.filter(o => o.ngoId === ngo.id);
  const myAppIds = myOpps.map(o => o.id);
  const myApps = ctx.applications.filter(a => myAppIds.includes(a.opportunityId));
  const pending = myApps.filter(a => a.status === "pending").length;

  function createOpp(form) {
    const newOpp = { ...form, id: Date.now(), ngo: ngo.name, ngoId: ngo.id, filled: 0, status: "active", slots: +form.slots };
    ctx.setOpportunities(o => [...o, newOpp]);
    ctx.toast("Opportunity posted! 🎉", "success");
    setShowCreate(false);
  }

  function saveEdit(form) {
    ctx.setOpportunities(ops => ops.map(o => o.id === editOpp.id ? {...o, ...form, slots: +form.slots} : o));
    ctx.toast("Opportunity updated.", "success");
    setEditOpp(null);
  }

  function deleteOpp(id) {
    if (!confirm("Delete this opportunity?")) return;
    ctx.setOpportunities(o => o.filter(o => o.id !== id));
    ctx.toast("Opportunity deleted.", "info");
  }

  function updateAppStatus(appId, status) {
    ctx.setApplications(apps => apps.map(a => a.id === appId ? {...a, status} : a));
    ctx.toast(status === "approved" ? "Application approved! ✅" : "Application rejected.", status === "approved" ? "success" : "info");
  }

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="dash-sidebar-title">NGO Portal</div>
        <button className={`sidebar-link${activeTab==="overview"?" active":""}`} onClick={()=>setActiveTab("overview")}><span className="icon">🏠</span> Overview</button>
        <button className={`sidebar-link${activeTab==="opportunities"?" active":""}`} onClick={()=>setActiveTab("opportunities")}><span className="icon">📣</span> Opportunities</button>
        <button className={`sidebar-link${activeTab==="applications"?" active":""}`} onClick={()=>setActiveTab("applications")}>
          <span className="icon">📋</span> Applications {pending > 0 && <span className="nav-pill">{pending}</span>}
        </button>
        <div className="dash-sidebar-title">Account</div>
        <button className="sidebar-link" onClick={()=>setPage("home")}><span className="icon">🏛</span> Public View</button>
        <button className="sidebar-link" onClick={()=>{ ctx.setCurrentUser(null); setPage("home"); ctx.toast("Signed out.", "info"); }}><span className="icon">🚪</span> Sign Out</button>
      </aside>
      <div className="dash-content">
        {activeTab === "overview" && (
          <>
            <div className="dash-header">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"1rem"}}>
                <div>
                  <h2>{ngo.name}</h2>
                  <p>{ngo.verified ? "✅ Verified NGO" : "⏳ Verification Pending"} · {ngo.focus || "General"} · {ngo.location || "India"}</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={()=>setShowCreate(true)}>+ Post Opportunity</button>
              </div>
            </div>
            <div className="kpi-row">
              <div className="kpi-card"><div className="kpi-icon">📣</div><div className="kpi-val">{myOpps.length}</div><div className="kpi-label">Opportunities</div></div>
              <div className="kpi-card"><div className="kpi-icon">👥</div><div className="kpi-val">{myApps.length}</div><div className="kpi-label">Total Applications</div></div>
              <div className="kpi-card"><div className="kpi-icon">⏳</div><div className="kpi-val">{pending}</div><div className="kpi-label">Pending Review</div></div>
              <div className="kpi-card"><div className="kpi-icon">✅</div><div className="kpi-val">{myApps.filter(a=>a.status==="approved").length}</div><div className="kpi-label">Approved</div></div>
            </div>

            <h3 style={{fontFamily:"Fraunces, serif",fontSize:"1.2rem",marginBottom:"1rem",color:"var(--clay)"}}>Your Opportunities</h3>
            {myOpps.length === 0
              ? <EmptyState icon="📣" title="No opportunities yet" sub="Post your first opportunity to start receiving applications!" />
              : <div className="cards-grid">
                  {myOpps.map(opp=>(
                    <div className="card" key={opp.id}>
                      <div className="card-header">
                        <div className="card-title">{opp.title}</div>
                        <Badge type={opp.filled>=opp.slots?"red":"green"}>{opp.filled>=opp.slots?"Full":"Open"}</Badge>
                      </div>
                      <div className="card-meta">📅 {opp.date} · 📍 {opp.location}</div>
                      <div className="card-body">{opp.description.slice(0,100)}…</div>
                      <div className="progress-bar"><div className="progress-fill" style={{width:`${Math.round(opp.filled/opp.slots*100)}%`}}></div></div>
                      <div style={{fontSize:".78rem",color:"#999",margin:".3rem 0 1rem"}}>{opp.filled}/{opp.slots} filled</div>
                      <div className="card-footer">
                        <button className="btn btn-ghost btn-sm" onClick={()=>setEditOpp(opp)}>✏️ Edit</button>
                        <button className="btn btn-ghost btn-sm" style={{color:"var(--error)"}} onClick={()=>deleteOpp(opp.id)}>🗑 Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </>
        )}

        {activeTab === "opportunities" && (
          <>
            <div className="dash-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"1rem"}}>
              <div><h2>Opportunities</h2><p>Manage all your posted volunteer opportunities.</p></div>
              <button className="btn btn-primary btn-sm" onClick={()=>setShowCreate(true)}>+ Post New</button>
            </div>
            {myOpps.length === 0
              ? <EmptyState icon="📣" title="No opportunities posted yet" sub="" />
              : <div className="table-wrap"><table>
                  <thead><tr><th>Title</th><th>Date</th><th>Location</th><th>Slots</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {myOpps.map(opp=>(
                      <tr key={opp.id}>
                        <td><strong>{opp.title}</strong></td>
                        <td>{opp.date}</td>
                        <td>{opp.location}</td>
                        <td>{opp.filled}/{opp.slots}</td>
                        <td><Badge type={opp.filled>=opp.slots?"red":"green"}>{opp.filled>=opp.slots?"Full":"Open"}</Badge></td>
                        <td style={{display:"flex",gap:".4rem"}}>
                          <button className="btn btn-ghost btn-sm" onClick={()=>setEditOpp(opp)}>Edit</button>
                          <button className="btn btn-ghost btn-sm" style={{color:"var(--error)"}} onClick={()=>deleteOpp(opp.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table></div>
            }
          </>
        )}

        {activeTab === "applications" && (
          <>
            <div className="dash-header"><h2>Applications</h2><p>Review and manage volunteer applications for your opportunities.</p></div>
            {myApps.length === 0
              ? <EmptyState icon="📭" title="No applications received yet" sub="Applications will appear here once volunteers apply." />
              : <div className="table-wrap"><table>
                  <thead><tr><th>Volunteer</th><th>Opportunity</th><th>Applied</th><th>Message</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {myApps.map(app => {
                      const opp = ctx.opportunities.find(o => o.id === app.opportunityId);
                      const vol = ctx.users.find(u => u.id === app.userId);
                      return (
                        <tr key={app.id}>
                          <td>
                            <div style={{display:"flex",alignItems:"center",gap:".6rem"}}>
                              <Avatar name={vol?.name || "U"} />
                              <div><strong>{vol?.name || "User"}</strong><br/><span style={{fontSize:".8rem",color:"#888"}}>{vol?.email}</span></div>
                            </div>
                          </td>
                          <td>{opp?.title}</td>
                          <td style={{color:"#888",fontSize:".85rem"}}>{app.appliedAt}</td>
                          <td style={{color:"#666",fontSize:".85rem",maxWidth:180}}>{app.note || <span style={{color:"#ccc"}}>—</span>}</td>
                          <td><Badge type={app.status==="approved"?"green":app.status==="rejected"?"red":"amber"}>{app.status}</Badge></td>
                          <td>
                            {app.status === "pending" && (
                              <div style={{display:"flex",gap:".4rem"}}>
                                <button className="btn btn-success btn-sm" onClick={()=>updateAppStatus(app.id,"approved")}>✓ Approve</button>
                                <button className="btn btn-danger btn-sm" onClick={()=>updateAppStatus(app.id,"rejected")}>✕</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table></div>
            }
          </>
        )}
      </div>
      {showCreate && <CreateOpportunityForm onClose={()=>setShowCreate(false)} onSave={createOpp} />}
      {editOpp && <CreateOpportunityForm onClose={()=>setEditOpp(null)} onSave={saveEdit} existing={editOpp} />}
    </div>
  );
}

// ─── Admin Dashboard ─────────────────────────────────────────────────────────
function AdminDashboard({ setPage }) {
  const ctx = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("overview");

  function verifyNgo(id) {
    ctx.setNgos(ns => ns.map(n => n.id === id ? {...n, verified:true} : n));
    ctx.toast("NGO verified ✅", "success");
  }
  function deleteNgo(id) {
    if(!confirm("Remove this NGO?")) return;
    ctx.setNgos(ns => ns.filter(n => n.id !== id));
    ctx.toast("NGO removed.", "info");
  }

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="dash-sidebar-title">Admin Panel</div>
        <button className={`sidebar-link${activeTab==="overview"?" active":""}`} onClick={()=>setActiveTab("overview")}><span className="icon">📊</span> Overview</button>
        <button className={`sidebar-link${activeTab==="ngos"?" active":""}`} onClick={()=>setActiveTab("ngos")}><span className="icon">🏛</span> NGOs</button>
        <button className={`sidebar-link${activeTab==="opps"?" active":""}`} onClick={()=>setActiveTab("opps")}><span className="icon">📣</span> All Opportunities</button>
        <button className={`sidebar-link${activeTab==="users"?" active":""}`} onClick={()=>setActiveTab("users")}><span className="icon">👥</span> Users</button>
        <div className="dash-sidebar-title">Account</div>
        <button className="sidebar-link" onClick={()=>{ ctx.setCurrentUser(null); setPage("home"); ctx.toast("Signed out.", "info"); }}><span className="icon">🚪</span> Sign Out</button>
      </aside>
      <div className="dash-content">
        {activeTab === "overview" && (
          <>
            <div className="dash-header"><h2>Admin Dashboard</h2><p>Platform-wide overview and moderation.</p></div>
            <div className="kpi-row">
              <div className="kpi-card"><div className="kpi-icon">🏛</div><div className="kpi-val">{ctx.ngos.length}</div><div className="kpi-label">NGOs</div></div>
              <div className="kpi-card"><div className="kpi-icon">👥</div><div className="kpi-val">{ctx.users.length}</div><div className="kpi-label">Volunteers</div></div>
              <div className="kpi-card"><div className="kpi-icon">📣</div><div className="kpi-val">{ctx.opportunities.length}</div><div className="kpi-label">Opportunities</div></div>
              <div className="kpi-card"><div className="kpi-icon">📋</div><div className="kpi-val">{ctx.applications.length}</div><div className="kpi-label">Applications</div></div>
              <div className="kpi-card"><div className="kpi-icon">⏳</div><div className="kpi-val">{ctx.ngos.filter(n=>!n.verified).length}</div><div className="kpi-label">Pending Verify</div></div>
            </div>
          </>
        )}

        {activeTab === "ngos" && (
          <>
            <div className="dash-header"><h2>NGO Management</h2><p>Verify and manage registered NGOs.</p></div>
            <div className="table-wrap"><table>
              <thead><tr><th>Organisation</th><th>Email</th><th>Focus</th><th>Location</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {ctx.ngos.map(n => (
                  <tr key={n.id}>
                    <td><strong>{n.name}</strong></td>
                    <td style={{color:"#888",fontSize:".88rem"}}>{n.email}</td>
                    <td>{n.focus || "—"}</td>
                    <td>{n.location || "—"}</td>
                    <td><Badge type={n.verified?"green":"amber"}>{n.verified?"Verified":"Pending"}</Badge></td>
                    <td style={{display:"flex",gap:".4rem",flexWrap:"wrap"}}>
                      {!n.verified && <button className="btn btn-success btn-sm" onClick={()=>verifyNgo(n.id)}>Verify</button>}
                      <button className="btn btn-danger btn-sm" onClick={()=>deleteNgo(n.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </>
        )}

        {activeTab === "opps" && (
          <>
            <div className="dash-header"><h2>All Opportunities</h2><p>Platform-wide opportunity listings.</p></div>
            <div className="table-wrap"><table>
              <thead><tr><th>Title</th><th>NGO</th><th>Date</th><th>Category</th><th>Slots</th><th>Status</th></tr></thead>
              <tbody>
                {ctx.opportunities.map(o=>(
                  <tr key={o.id}>
                    <td><strong>{o.title}</strong></td>
                    <td>{o.ngo}</td>
                    <td>{o.date}</td>
                    <td><Badge type="blue">{o.category}</Badge></td>
                    <td>{o.filled}/{o.slots}</td>
                    <td><Badge type={o.filled>=o.slots?"red":"green"}>{o.filled>=o.slots?"Full":"Open"}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </>
        )}

        {activeTab === "users" && (
          <>
            <div className="dash-header"><h2>Volunteer Users</h2></div>
            <div className="table-wrap"><table>
              <thead><tr><th>Name</th><th>Email</th><th>Joined</th><th>Applications</th></tr></thead>
              <tbody>
                {ctx.users.map(u=>(
                  <tr key={u.id}>
                    <td><div style={{display:"flex",alignItems:"center",gap:".6rem"}}><Avatar name={u.name} /><strong>{u.name}</strong></div></td>
                    <td style={{color:"#888",fontSize:".88rem"}}>{u.email}</td>
                    <td style={{color:"#888",fontSize:".85rem"}}>{u.joinedAt || "—"}</td>
                    <td>{ctx.applications.filter(a=>a.userId===u.id).length}</td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [pendingOpp, setPendingOpp] = useState(null);
  const [toasts, setToasts] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  const [ngos, setNgos] = useState(INITIAL_NGOS);
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);

  const toast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  function handleAuthRequired(opp) {
    setPendingOpp(opp);
    setAuthMode("login");
    setShowAuth(true);
  }

  function handleAuthSuccess(user) {
    setShowAuth(false);
    if (user.role === "NGO") setPage("ngo-dash");
    else if (user.role === "Admin") setPage("admin-dash");
    else setPage("volunteer-dash");
    setPendingOpp(null);
  }

  const ctx = { currentUser, setCurrentUser, users, setUsers, ngos, setNgos, opportunities, setOpportunities, applications, setApplications, toast };

  const isNgo = currentUser?.role === "NGO";
  const isAdmin = currentUser?.role === "Admin";
  const isVol = currentUser?.role === "Volunteer";

  return (
    <AppContext.Provider value={ctx}>
      <style>{css}</style>
      <div className="app-wrap">
        <nav className="nav">
          <div className="nav-brand" onClick={() => setPage("home")}>
            <span>🌿</span> VolunteerConnect
          </div>
          <div className="nav-links">
            <button className={`nav-btn${page==="home"?" active":""}`} onClick={() => setPage("home")}>Opportunities</button>
            {currentUser ? (
              <>
                {isVol && <button className={`nav-btn${page==="volunteer-dash"?" active":""}`} onClick={() => setPage("volunteer-dash")}>My Dashboard</button>}
                {isNgo && <button className={`nav-btn${page==="ngo-dash"?" active":""}`} onClick={() => setPage("ngo-dash")}>NGO Portal</button>}
                {isAdmin && <button className={`nav-btn${page==="admin-dash"?" active":""}`} onClick={() => setPage("admin-dash")}>Admin</button>}
                <div style={{display:"flex",alignItems:"center",gap:".5rem",marginLeft:".5rem"}}>
                  <Avatar name={currentUser.name} />
                  <button className="nav-btn" onClick={() => { setCurrentUser(null); setPage("home"); toast("Signed out.", "info"); }}>Sign Out</button>
                </div>
              </>
            ) : (
              <>
                <button className="nav-btn" onClick={() => { setAuthMode("login"); setShowAuth(true); }}>Sign In</button>
                <button className="nav-btn primary" onClick={() => { setAuthMode("register"); setShowAuth(true); }}>Join Free</button>
              </>
            )}
          </div>
        </nav>

        <main className="main-content">
          {page === "home" && <HomePage onApply={() => {}} onAuthRequired={handleAuthRequired} setPage={setPage} />}
          {page === "volunteer-dash" && currentUser && isVol && <VolunteerDashboard setPage={setPage} />}
          {page === "ngo-dash" && currentUser && isNgo && <NgoDashboard setPage={setPage} />}
          {page === "admin-dash" && currentUser && isAdmin && <AdminDashboard setPage={setPage} />}
        </main>

        <footer className="footer">
          © 2026 VolunteerConnect · Built with ♥ for NGOs across India · <a href="#">Privacy</a> · <a href="#">Terms</a>
        </footer>
      </div>

      {showAuth && <AuthModal mode={authMode} onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />}
      <Toast toasts={toasts} />
    </AppContext.Provider>
  );
}
