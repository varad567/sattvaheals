import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600;1,700&family=Outfit:wght@200;300;400;500;600&display=swap');`;

const ADMIN_PASSWORD = "sattva2026admin"; // ← change this to your own password

const css = `
  :root {
    --abyss:     #060E1A;
    --deep:      #0D1F35;
    --surface:   #112840;
    --moon:      #A8CCE0;
    --moon-dim:  #6B95AE;
    --gold:      #E2C27D;
    --gold-dim:  #B89A55;
    --pearl:     #D8EEF8;
    --pearl-dim: #8BAFC4;
    --green:     #6ECBA0;
    --yellow:    #E2C27D;
    --red:       #E07070;
  }
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body { background:var(--abyss); color:var(--pearl); font-family:'Outfit',sans-serif; font-weight:300; min-height:100vh; }

  /* LOGIN */
  .login-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; }
  .login-box { width:100%; max-width:400px; background:rgba(13,31,53,0.6); border:1px solid rgba(168,204,224,0.08); padding:48px; }
  .login-brand { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--pearl); letter-spacing:5px; text-transform:uppercase; margin-bottom:4px; }
  .login-brand span { color:var(--gold); font-style:italic; }
  .login-sub { font-size:11px; letter-spacing:2px; color:var(--moon-dim); text-transform:uppercase; margin-bottom:36px; }
  .login-label { display:block; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--moon-dim); margin-bottom:8px; font-weight:500; }
  .login-input { width:100%; padding:13px 16px; background:rgba(6,14,26,0.6); border:1px solid rgba(168,204,224,0.1); color:var(--pearl); font-family:'Outfit',sans-serif; font-size:14px; outline:none; margin-bottom:20px; border-radius:1px; transition:border-color 0.3s; }
  .login-input:focus { border-color:rgba(168,204,224,0.35); }
  .login-input.error { border-color:var(--red); }
  .login-btn { width:100%; padding:14px; background:linear-gradient(135deg,rgba(168,204,224,0.18),rgba(168,204,224,0.06)); border:1px solid rgba(168,204,224,0.3); color:var(--pearl); font-family:'Outfit',sans-serif; font-size:11px; letter-spacing:2.5px; text-transform:uppercase; cursor:pointer; transition:all 0.3s; border-radius:1px; }
  .login-btn:hover { border-color:var(--moon); color:var(--moon); }
  .login-error { font-size:12px; color:var(--red); margin-top:12px; text-align:center; }

  /* ADMIN LAYOUT */
  .admin-wrap { min-height:100vh; display:flex; flex-direction:column; }
  .admin-nav { height:60px; background:rgba(6,14,26,0.95); border-bottom:1px solid rgba(168,204,224,0.06); display:flex; align-items:center; justify-content:space-between; padding:0 32px; position:sticky; top:0; z-index:100; }
  .admin-brand { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:600; color:var(--pearl); letter-spacing:4px; text-transform:uppercase; }
  .admin-brand span { color:var(--gold); font-style:italic; }
  .admin-brand-sub { font-size:10px; letter-spacing:2px; color:var(--moon-dim); text-transform:uppercase; margin-left:12px; }
  .admin-logout { background:transparent; border:1px solid rgba(168,204,224,0.1); color:var(--pearl-dim); padding:6px 16px; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; transition:all 0.3s; border-radius:1px; font-family:'Outfit',sans-serif; }
  .admin-logout:hover { border-color:var(--red); color:var(--red); }

  /* TABS */
  .admin-tabs { display:flex; gap:0; border-bottom:1px solid rgba(168,204,224,0.06); padding:0 32px; background:rgba(6,14,26,0.6); }
  .admin-tab { padding:14px 24px; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--pearl-dim); cursor:pointer; border-bottom:2px solid transparent; transition:all 0.3s; background:none; border-top:none; border-left:none; border-right:none; font-family:'Outfit',sans-serif; }
  .admin-tab:hover { color:var(--moon); }
  .admin-tab.active { color:var(--gold); border-bottom-color:var(--gold); }
  .tab-count { display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; border-radius:50%; background:rgba(168,204,224,0.1); font-size:9px; margin-left:8px; color:var(--moon); }
  .tab-count.pending { background:rgba(226,194,125,0.15); color:var(--gold); }

  /* CONTENT */
  .admin-content { flex:1; padding:32px; }
  .admin-inner { max-width:1200px; margin:0 auto; }

  /* STATS ROW */
  .stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:3px; margin-bottom:32px; }
  .stat-card { padding:20px 24px; background:rgba(13,31,53,0.4); border:1px solid rgba(168,204,224,0.06); }
  .sc-num { font-family:'Cormorant Garamond',serif; font-size:40px; font-weight:600; color:var(--gold); line-height:1; margin-bottom:4px; }
  .sc-label { font-size:10px; letter-spacing:2px; color:var(--pearl-dim); text-transform:uppercase; }

  /* TABLE */
  .table-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
  .table-title { font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:600; color:var(--pearl); }
  .table-title em { font-style:italic; color:var(--moon); }
  .export-btn { background:transparent; border:1px solid rgba(168,204,224,0.1); color:var(--pearl-dim); padding:8px 20px; font-size:10px; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all 0.3s; border-radius:1px; font-family:'Outfit',sans-serif; }
  .export-btn:hover { border-color:var(--moon); color:var(--moon); }

  .data-table { width:100%; border-collapse:collapse; }
  .data-table th { font-size:9px; letter-spacing:2.5px; text-transform:uppercase; color:var(--moon-dim); font-weight:500; padding:10px 14px; text-align:left; border-bottom:1px solid rgba(168,204,224,0.06); background:rgba(6,14,26,0.4); }
  .data-table td { padding:14px; font-size:13px; color:var(--pearl-dim); border-bottom:1px solid rgba(168,204,224,0.04); vertical-align:top; }
  .data-table tr:hover td { background:rgba(17,40,64,0.3); color:var(--pearl); }
  .td-name { color:var(--pearl); font-weight:400; }
  .td-email { color:var(--moon-dim); font-size:12px; }
  .td-type { font-size:11px; color:var(--pearl-dim); }
  .td-msg { font-size:12px; color:var(--pearl-dim); max-width:280px; line-height:1.5; }
  .td-date { font-size:11px; color:rgba(139,175,196,0.4); white-space:nowrap; }

  /* STATUS BADGE */
  .status-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:2px; font-size:10px; letter-spacing:1.5px; text-transform:uppercase; font-weight:500; cursor:pointer; transition:all 0.2s; border:1px solid transparent; }
  .status-badge.pending { background:rgba(226,194,125,0.08); color:var(--gold); border-color:rgba(226,194,125,0.2); }
  .status-badge.confirmed { background:rgba(110,203,160,0.08); color:var(--green); border-color:rgba(110,203,160,0.2); }
  .status-badge.done { background:rgba(168,204,224,0.08); color:var(--moon); border-color:rgba(168,204,224,0.2); }
  .status-badge.cancelled { background:rgba(224,112,112,0.08); color:var(--red); border-color:rgba(224,112,112,0.2); }
  .status-dot { width:5px; height:5px; border-radius:50%; background:currentColor; }

  /* STATUS DROPDOWN */
  .status-wrap { position:relative; }
  .status-menu { position:absolute; top:calc(100% + 4px); left:0; background:var(--deep); border:1px solid rgba(168,204,224,0.1); z-index:50; min-width:140px; }
  .status-option { padding:9px 14px; font-size:11px; letter-spacing:1px; text-transform:uppercase; cursor:pointer; transition:background 0.2s; color:var(--pearl-dim); }
  .status-option:hover { background:rgba(168,204,224,0.06); color:var(--pearl); }

  /* EMPTY STATE */
  .empty-state { text-align:center; padding:60px 24px; color:var(--pearl-dim); }
  .empty-state-icon { font-size:32px; margin-bottom:12px; opacity:0.3; }
  .empty-state-text { font-size:14px; }

  /* LOADING */
  .loading-row td { text-align:center; padding:40px; color:var(--pearl-dim); font-size:13px; }

  /* SEARCH */
  .search-input { background:rgba(6,14,26,0.6); border:1px solid rgba(168,204,224,0.08); color:var(--pearl); padding:9px 14px; font-size:12px; font-family:'Outfit',sans-serif; outline:none; border-radius:1px; width:220px; transition:border-color 0.3s; }
  .search-input:focus { border-color:rgba(168,204,224,0.25); }
  .search-input::placeholder { color:rgba(139,175,196,0.2); }

  /* MAIL TAB */
  .mail-wrap { max-width: 720px; }
  .mail-title { font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:600; color:var(--pearl); margin-bottom:6px; }
  .mail-title em { font-style:italic; color:var(--moon); }
  .mail-sub { font-size:13px; color:var(--pearl-dim); margin-bottom:32px; line-height:1.6; }
  .mail-setup-box { background:rgba(226,194,125,0.05); border:1px solid rgba(226,194,125,0.15); padding:20px 24px; margin-bottom:28px; border-radius:1px; }
  .mail-setup-box p { font-size:12px; color:var(--gold); line-height:1.7; }
  .mail-setup-box a { color:var(--moon); }
  .mail-field { margin-bottom:18px; }
  .mail-label { display:block; font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:var(--moon-dim); margin-bottom:8px; font-weight:500; }
  .mail-input { width:100%; padding:12px 14px; background:rgba(6,14,26,0.6); border:1px solid rgba(168,204,224,0.1); color:var(--pearl); font-family:'Outfit',sans-serif; font-size:13px; outline:none; border-radius:1px; transition:border-color 0.3s; }
  .mail-input:focus { border-color:rgba(168,204,224,0.3); }
  .mail-input::placeholder { color:rgba(139,175,196,0.25); }
  .mail-textarea { width:100%; padding:14px; background:rgba(6,14,26,0.6); border:1px solid rgba(168,204,224,0.1); color:var(--pearl); font-family:'Outfit',sans-serif; font-size:13px; outline:none; border-radius:1px; transition:border-color 0.3s; resize:vertical; min-height:180px; line-height:1.7; }
  .mail-textarea:focus { border-color:rgba(168,204,224,0.3); }
  .mail-textarea::placeholder { color:rgba(139,175,196,0.25); }
  .mail-quick { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:18px; }
  .mail-quick-btn { padding:6px 14px; background:rgba(13,31,53,0.6); border:1px solid rgba(168,204,224,0.08); color:var(--pearl-dim); font-size:11px; font-family:'Outfit',sans-serif; cursor:pointer; border-radius:1px; transition:all 0.3s; letter-spacing:0.5px; }
  .mail-quick-btn:hover { border-color:rgba(168,204,224,0.25); color:var(--moon); }
  .mail-send-btn { padding:13px 36px; background:linear-gradient(135deg,rgba(168,204,224,0.15),rgba(168,204,224,0.05)); border:1px solid rgba(168,204,224,0.3); color:var(--pearl); font-family:'Outfit',sans-serif; font-size:11px; font-weight:500; letter-spacing:2.5px; text-transform:uppercase; cursor:pointer; transition:all 0.4s; border-radius:1px; position:relative; overflow:hidden; }
  .mail-send-btn:hover { border-color:var(--moon); color:var(--moon); }
  .mail-send-btn:disabled { opacity:0.4; cursor:not-allowed; }
  .mail-alert { padding:12px 16px; border-radius:1px; font-size:13px; margin-bottom:20px; }
  .mail-alert.success { background:rgba(110,203,160,0.08); border:1px solid rgba(110,203,160,0.2); color:#6ECBA0; }
  .mail-alert.error { background:rgba(224,112,112,0.08); border:1px solid rgba(224,112,112,0.2); color:#E07070; }
  .mail-from-note { font-size:11px; color:var(--pearl-dim); margin-top:12px; letter-spacing:0.5px; }
  .mail-from-note span { color:var(--moon-dim); }

  /* SETTINGS TAB */
  .settings-wrap { max-width: 680px; }
  .settings-section { margin-bottom: 40px; }
  .settings-section-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600; color:var(--pearl); margin-bottom:4px; }
  .settings-section-title em { font-style:italic; color:var(--moon); }
  .settings-section-sub { font-size:12px; color:var(--pearl-dim); margin-bottom:20px; line-height:1.6; }
  .settings-section-sub a { color:var(--moon); }
  .settings-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .settings-field { margin-bottom:0; }
  .settings-label { display:block; font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:var(--moon-dim); margin-bottom:8px; font-weight:500; }
  .settings-input { width:100%; padding:11px 14px; background:rgba(6,14,26,0.6); border:1px solid rgba(168,204,224,0.1); color:var(--pearl); font-family:'Outfit',sans-serif; font-size:13px; outline:none; border-radius:1px; transition:border-color 0.3s; }
  .settings-input:focus { border-color:rgba(168,204,224,0.3); }
  .settings-input::placeholder { color:rgba(139,175,196,0.2); font-size:12px; }
  .settings-input.readonly { color:var(--pearl-dim); cursor:default; }
  .settings-save-btn { margin-top:16px; padding:11px 32px; background:linear-gradient(135deg,rgba(168,204,224,0.15),rgba(168,204,224,0.05)); border:1px solid rgba(168,204,224,0.3); color:var(--pearl); font-family:'Outfit',sans-serif; font-size:11px; font-weight:500; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all 0.3s; border-radius:1px; }
  .settings-save-btn:hover { border-color:var(--moon); color:var(--moon); }
  .settings-saved { display:inline-flex; align-items:center; gap:8px; margin-left:14px; font-size:12px; color:var(--green); opacity:0; transition:opacity 0.4s; }
  .settings-saved.show { opacity:1; }
  .settings-divider { width:100%; height:1px; background:rgba(168,204,224,0.06); margin:32px 0; }
  .settings-status { display:inline-flex; align-items:center; gap:6px; font-size:11px; letter-spacing:1px; }
  .status-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
  .status-dot.green { background:var(--green); box-shadow:0 0 6px var(--green); }
  .status-dot.red { background:var(--red); }
  .settings-info-row { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; background:rgba(6,14,26,0.4); border:1px solid rgba(168,204,224,0.06); margin-bottom:8px; border-radius:1px; }
  .sir-label { font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:var(--moon-dim); }
  .sir-value { font-size:12px; color:var(--pearl-dim); font-family:monospace; }
  .sir-value.active { color:var(--green); }
  .sir-value.missing { color:var(--red); }

  @media(max-width:768px){
    .stats-row{grid-template-columns:1fr 1fr;}
    .admin-content{padding:16px;}
    .data-table th:nth-child(4),.data-table td:nth-child(4),
    .data-table th:nth-child(5),.data-table td:nth-child(5){ display:none; }
  }
`;

const STATUSES = ['pending','confirmed','done','cancelled'];

function formatDate(str){
  if(!str) return '—';
  const d = new Date(str);
  return d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) + ' · ' +
    d.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
}

function StatusBadge({ status, id, onUpdate }){
  const [open, setOpen] = useState(false);
  return(
    <div className="status-wrap">
      <div className={`status-badge ${status}`} onClick={()=>setOpen(!open)}>
        <div className="status-dot"/>
        {status}
      </div>
      {open && (
        <div className="status-menu">
          {STATUSES.map(s=>(
            <div className="status-option" key={s} onClick={()=>{ onUpdate(id,s); setOpen(false); }}>
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ConsultationsTab({ data, loading, onUpdate, onExport }){
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = data.filter(r => {
    const matchSearch = r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || r.status === filter;
    return matchSearch && matchFilter;
  });

  const pending = data.filter(r=>r.status==='pending').length;

  return(
    <>
      <div className="stats-row">
        {[
          {num:data.length, label:'Total requests'},
          {num:data.filter(r=>r.status==='pending').length, label:'Pending'},
          {num:data.filter(r=>r.status==='confirmed').length, label:'Confirmed'},
          {num:data.filter(r=>r.status==='done').length, label:'Completed'},
        ].map((s,i)=>(
          <div className="stat-card" key={i}>
            <div className="sc-num">{s.num}</div>
            <div className="sc-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="table-header">
        <div className="table-title">Consultation <em>Requests</em></div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <input className="search-input" placeholder="Search name or email…"
            value={search} onChange={e=>setSearch(e.target.value)}/>
          <select className="search-input" value={filter} onChange={e=>setFilter(e.target.value)} style={{width:'auto'}}>
            <option value="all">All status</option>
            {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <button className="export-btn" onClick={onExport}>Export CSV</button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Session Type</th>
            <th>Message</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr className="loading-row"><td colSpan={5}>Loading…</td></tr>
          )}
          {!loading && filtered.length === 0 && (
            <tr><td colSpan={5}>
              <div className="empty-state">
                <div className="empty-state-icon">🌙</div>
                <div className="empty-state-text">No requests found.</div>
              </div>
            </td></tr>
          )}
          {!loading && filtered.map(r=>(
            <tr key={r.id}>
              <td>
                <div className="td-name">{r.name}</div>
                <div className="td-email">{r.email}</div>
                {r.phone && <div className="td-email">{r.phone}</div>}
              </td>
              <td><div className="td-type">{r.session_type}</div></td>
              <td><div className="td-msg">{r.message}</div></td>
              <td><div className="td-date">{formatDate(r.created_at)}</div></td>
              <td>
                <StatusBadge status={r.status} id={r.id} onUpdate={onUpdate}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// ── Settings Tab ─────────────────────────────────────────
function SettingsTab({ settings, onSave }){
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(()=>setSaved(false), 2500);
  };

  const ejsReady = form.ejsServiceId && form.ejsTemplateId && form.ejsPublicKey;

  return (
    <div className="settings-wrap">
      <div className="settings-section">
        <div className="settings-section-title">Email <em>Settings</em></div>
        <p className="settings-section-sub">
          Uses <a href="https://emailjs.com" target="_blank" rel="noreferrer">EmailJS</a> (free — 200 emails/month) to send from your Gmail.<br/>
          Setup: emailjs.com → Add Service (Gmail) → Create Template → copy the 3 keys below.<br/>
          Template must have variables: <code style={{background:'rgba(168,204,224,0.08)',padding:'1px 6px',fontSize:11}}>{'{{to_email}} {{subject}} {{message}} {{from_name}}'}</code>
        </p>

        <div className="settings-info-row">
          <span className="sir-label">EmailJS Status</span>
          {ejsReady
            ? <span className="settings-status"><span className="status-dot green"/>  <span className="sir-value active">Configured ✓</span></span>
            : <span className="settings-status"><span className="status-dot red"/>  <span className="sir-value missing">Not configured</span></span>
          }
        </div>

        <div className="settings-grid" style={{marginTop:16}}>
          <div className="settings-field">
            <label className="settings-label">Service ID</label>
            <input className="settings-input" placeholder="service_xxxxxxx"
              value={form.ejsServiceId||''} onChange={e=>setForm({...form,ejsServiceId:e.target.value})}/>
          </div>
          <div className="settings-field">
            <label className="settings-label">Template ID</label>
            <input className="settings-input" placeholder="template_xxxxxxx"
              value={form.ejsTemplateId||''} onChange={e=>setForm({...form,ejsTemplateId:e.target.value})}/>
          </div>
          <div className="settings-field" style={{gridColumn:'1/-1'}}>
            <label className="settings-label">Public Key</label>
            <input className="settings-input" placeholder="xxxxxxxxxxxxxxxxxxxx"
              value={form.ejsPublicKey||''} onChange={e=>setForm({...form,ejsPublicKey:e.target.value})}/>
          </div>
        </div>
      </div>

      <div className="settings-divider"/>

      <div className="settings-section">
        <div className="settings-section-title">Platform <em>Info</em></div>
        <p className="settings-section-sub">Read-only — your current Supabase connection details.</p>
        {[
          {label:'Supabase URL', value:'https://krpwzbjiipsvbvjqsmfg.supabase.co'},
          {label:'Supabase Status', value:'Connected ✓', active:true},
          {label:'Auth Provider', value:'Email + Google OAuth'},
          {label:'Domain', value:'sattvaheals.in'},
        ].map(r=>(
          <div className="settings-info-row" key={r.label}>
            <span className="sir-label">{r.label}</span>
            <span className={`sir-value ${r.active?'active':''}`}>{r.value}</span>
          </div>
        ))}
      </div>

      <div className="settings-divider"/>

      <div className="settings-section">
        <div className="settings-section-title">Admin <em>Password</em></div>
        <p className="settings-section-sub">To change the admin password, update <code style={{background:'rgba(168,204,224,0.08)',padding:'1px 6px',fontSize:11}}>ADMIN_PASSWORD</code> in <code style={{background:'rgba(168,204,224,0.08)',padding:'1px 6px',fontSize:11}}>src/Admin.jsx</code> line 6, then push to GitHub.</p>
        <div className="settings-info-row">
          <span className="sir-label">Current password</span>
          <span className="sir-value">••••••••••••••• (set in code)</span>
        </div>
      </div>

      <button className="settings-save-btn" onClick={handleSave}>Save Settings</button>
      <span className={`settings-saved ${saved?'show':''}`}>✓ Saved to browser</span>
    </div>
  );
}

// ── Mail Tab ──────────────────────────────────────────────
function MailTab({ users, consultations, settings, onOpenSettings }){
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState(null);

  const { ejsServiceId, ejsTemplateId, ejsPublicKey } = settings;
  const ejsReady = ejsServiceId && ejsTemplateId && ejsPublicKey;

  const QUICK_TEMPLATES = [
    { label: 'Consultation confirmed', subject: 'Your SATTVA consultation is confirmed', body: `Namaste,\n\nYour consultation request has been confirmed. Our Jyotishi will connect with you within 2 working days.\n\nPlease keep your birth details (date, time, place) ready for the session.\n\nWith light,\nSATTVA HEALS Team\nsattvaheals.in` },
    { label: 'Payment instructions', subject: 'Payment details — SATTVA consultation', body: `Namaste,\n\nThank you for booking with SATTVA HEALS. Here are your payment details:\n\nAmount: ₹899\nUPI: payment@sattvaheals.in\n\nKindly share the payment screenshot to confirm your booking.\n\nWith light,\nSATTVA HEALS Team` },
    { label: 'Session reminder', subject: 'Reminder — Your SATTVA session is tomorrow', body: `Namaste,\n\nA gentle reminder that your consultation is scheduled for tomorrow. Please keep your birth details ready.\n\nIf you need to reschedule, reply to this email.\n\nWith light,\nSATTVA HEALS Team\nsattvaheals.in` },
    { label: 'Follow up', subject: 'Following up on your SATTVA journey', body: `Namaste,\n\nWe hope your practice on SATTVA has been going well since your session.\n\nIf you have any questions about the remedies or practices suggested, please feel free to reply to this email.\n\nWith light,\nSATTVA HEALS Team` },
  ];

  const sendMail = async () => {
    if (!to || !subject || !message) { setAlert({type:'error',msg:'Please fill all fields.'}); return; }
    if (!ejsReady) { setAlert({type:'error',msg:'EmailJS not configured. Go to Settings tab to add your keys.'}); return; }
    setSending(true); setAlert(null);
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: ejsServiceId,
          template_id: ejsTemplateId,
          user_id: ejsPublicKey,
          template_params: { to_email:to, subject, message, from_name:'SATTVA HEALS', reply_to:'support@sattvaheals.in' }
        })
      });
      if (res.ok) {
        setAlert({type:'success', msg:`✓ Email sent to ${to}`});
        setTo(''); setSubject(''); setMessage('');
      } else {
        const text = await res.text();
        setAlert({type:'error', msg:`Failed: ${text}`});
      }
    } catch(e) {
      setAlert({type:'error', msg:`Error: ${e.message}`});
    }
    setSending(false);
  };

  const allEmails = [...new Set([
    ...consultations.map(c=>c.email).filter(Boolean),
    ...users.map(u=>u.email).filter(Boolean),
  ])].sort();

  return (
    <div className="mail-wrap">
      <div className="mail-title">Send <em>Mail</em></div>
      <p className="mail-sub">Send emails directly to users or consultation bookings.</p>

      {!ejsReady && (
        <div className="mail-setup-box" style={{cursor:'pointer'}} onClick={onOpenSettings}>
          <p>
            <strong style={{color:'var(--gold)'}}>⚙ EmailJS not configured yet.</strong><br/>
            Click here or go to the <strong>Settings tab</strong> to add your EmailJS Service ID, Template ID and Public Key. Takes 5 minutes. Free.
          </p>
        </div>
      )}

      {ejsReady && (
        <div className="settings-info-row" style={{marginBottom:20}}>
          <span className="sir-label">EmailJS</span>
          <span className="settings-status"><span className="status-dot green"/> <span className="sir-value active">Ready to send ✓</span></span>
        </div>
      )}

      {alert && <div className={`mail-alert ${alert.type}`}>{alert.msg}</div>}

      <div className="mail-field">
        <label className="mail-label">To</label>
        <input className="mail-input" placeholder="user@email.com" value={to}
          onChange={e=>setTo(e.target.value)} list="email-suggestions"/>
        <datalist id="email-suggestions">
          {allEmails.map(e=><option key={e} value={e}/>)}
        </datalist>
      </div>

      <div className="mail-field">
        <label className="mail-label">Quick Templates</label>
        <div className="mail-quick">
          {QUICK_TEMPLATES.map(t=>(
            <button key={t.label} className="mail-quick-btn"
              onClick={()=>{ setSubject(t.subject); setMessage(t.body); }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mail-field">
        <label className="mail-label">Subject</label>
        <input className="mail-input" placeholder="Email subject" value={subject} onChange={e=>setSubject(e.target.value)}/>
      </div>

      <div className="mail-field">
        <label className="mail-label">Message</label>
        <textarea className="mail-textarea" placeholder="Write your message…" value={message} onChange={e=>setMessage(e.target.value)}/>
      </div>

      <button className="mail-send-btn" onClick={sendMail} disabled={sending || !ejsReady}>
        {sending ? 'Sending…' : 'Send Email'}
      </button>
      {ejsReady && <div className="mail-from-note" style={{marginTop:10}}>Via EmailJS · replies go to your Gmail</div>}
    </div>
  );
}

function UsersTab({ data, loading }){
  const [search, setSearch] = useState('');

  const filtered = data.filter(r =>
    r.email?.toLowerCase().includes(search.toLowerCase()) ||
    (r.raw_user_meta_data?.name || r.raw_user_meta_data?.full_name || r.email?.split('@')[0] || '').toLowerCase().includes(search.toLowerCase())
  );

  return(
    <>
      <div className="stats-row">
        {[
          {num:data.length, label:'Total users'},
          {num:data.filter(r=>{const d=new Date(r.created_at);const now=new Date();return(now-d)<7*24*60*60*1000;}).length, label:'This week'},
          {num:data.filter(r=>{const d=new Date(r.created_at);const now=new Date();return(now-d)<30*24*60*60*1000;}).length, label:'This month'},
          {num:data.filter(r=>r.email_confirmed_at).length, label:'Verified'},
        ].map((s,i)=>(
          <div className="stat-card" key={i}>
            <div className="sc-num">{s.num}</div>
            <div className="sc-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="table-header">
        <div className="table-title">Registered <em>Users</em></div>
        <input className="search-input" placeholder="Search name or email…"
          value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Verified</th>
            <th>Signed up</th>
            <th>Provider</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr className="loading-row"><td colSpan={5}>Loading…</td></tr>
          )}
          {!loading && filtered.length === 0 && (
            <tr><td colSpan={5}>
              <div className="empty-state">
                <div className="empty-state-icon">🌙</div>
                <div className="empty-state-text">No users found.</div>
              </div>
            </td></tr>
          )}
          {!loading && filtered.map(r=>(
            <tr key={r.id}>
              <td><div className="td-name">{r.raw_user_meta_data?.name || r.raw_user_meta_data?.full_name || r.email?.split('@')[0] || '—'}</div></td>
              <td><div className="td-email">{r.email}</div></td>
              <td>
                <span className={`status-badge ${r.email_confirmed_at?'confirmed':'pending'}`}>
                  <div className="status-dot"/>
                  {r.email_confirmed_at?'verified':'pending'}
                </span>
              </td>
              <td><div className="td-date">{formatDate(r.created_at)}</div></td>
              <td><div className="td-type">{r.app_metadata?.provider || 'email'}</div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default function Admin(){
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState('consultations');
  const [consultations, setConsultations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingC, setLoadingC] = useState(true);
  const [loadingU, setLoadingU] = useState(true);

  // Settings — persisted in localStorage
  const [settings, setSettings] = useState(()=>{
    try {
      const saved = localStorage.getItem('sattva_admin_settings');
      return saved ? JSON.parse(saved) : { ejsServiceId:'', ejsTemplateId:'', ejsPublicKey:'' };
    } catch(e) {
      return { ejsServiceId:'', ejsTemplateId:'', ejsPublicKey:'' };
    }
  });

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    try { localStorage.setItem('sattva_admin_settings', JSON.stringify(newSettings)); } catch(e){}
  };

  // Load data on auth
  useEffect(()=>{
    if(!authed) return;
    fetchConsultations();
    fetchUsers();
  },[authed]);

  async function fetchConsultations(){
    setLoadingC(true);
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .order('created_at', { ascending: false });
    if(!error) setConsultations(data || []);
    setLoadingC(false);
  }

  async function fetchUsers(){
    setLoadingU(true);
    // Query auth.users via the users table we created
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if(!error) setUsers(data || []);
    setLoadingU(false);
  }

  async function updateStatus(id, status){
    await supabase.from('consultations').update({ status }).eq('id', id);
    setConsultations(prev => prev.map(r => r.id===id ? {...r, status} : r));
  }

  function exportCSV(){
    const headers = ['Name','Email','Phone','Session Type','Message','Status','Date'];
    const rows = consultations.map(r => [
      r.name, r.email, r.phone||'', r.session_type,
      `"${(r.message||'').replace(/"/g,'""')}"`,
      r.status, formatDate(r.created_at)
    ]);
    const csv = [headers, ...rows].map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href=url; a.download='sattva-consultations.csv'; a.click();
  }

  const handleLogin = () => {
    if(pw === ADMIN_PASSWORD){ setAuthed(true); setPwError(false); }
    else { setPwError(true); }
  };

  const pendingCount = consultations.filter(r=>r.status==='pending').length;

  // LOGIN SCREEN
  if(!authed) return(
    <>
      <style>{FONTS+css}</style>
      <div className="login-wrap">
        <div className="login-box">
          <div className="login-brand">SATTVA <span>Heals</span></div>
          <div className="login-sub">Admin Portal</div>
          <label className="login-label">Password</label>
          <input
            type="password"
            className={`login-input ${pwError?'error':''}`}
            placeholder="Enter admin password"
            value={pw}
            onChange={e=>{setPw(e.target.value);setPwError(false);}}
            onKeyDown={e=>e.key==='Enter'&&handleLogin()}
          />
          <button className="login-btn" onClick={handleLogin}>Enter Admin</button>
          {pwError && <div className="login-error">Incorrect password.</div>}
        </div>
      </div>
    </>
  );

  // ADMIN DASHBOARD
  return(
    <>
      <style>{FONTS+css}</style>
      <div className="admin-wrap">
        <nav className="admin-nav">
          <div style={{display:'flex',alignItems:'center'}}>
            <div className="admin-brand">SATTVA <span>Heals</span></div>
            <span className="admin-brand-sub">Admin</span>
          </div>
          <button className="admin-logout" onClick={()=>setAuthed(false)}>Log out</button>
        </nav>

        <div className="admin-tabs">
          <button className={`admin-tab ${tab==='consultations'?'active':''}`} onClick={()=>setTab('consultations')}>
            Consultations
            {pendingCount > 0 && <span className="tab-count pending">{pendingCount}</span>}
          </button>
          <button className={`admin-tab ${tab==='users'?'active':''}`} onClick={()=>setTab('users')}>
            Users
            <span className="tab-count">{users.length}</span>
          </button>
          <button className={`admin-tab ${tab==='mail'?'active':''}`} onClick={()=>setTab('mail')}>
            Mail
          </button>
          <button className={`admin-tab ${tab==='settings'?'active':''}`} onClick={()=>setTab('settings')}>
            ⚙ Settings
          </button>
        </div>

        <div className="admin-content">
          <div className="admin-inner">
            {tab==='consultations' && (
              <ConsultationsTab
                data={consultations}
                loading={loadingC}
                onUpdate={updateStatus}
                onExport={exportCSV}
              />
            )}
            {tab==='users' && (
              <UsersTab data={users} loading={loadingU}/>
            )}
            {tab==='mail' && (
              <MailTab
                users={users}
                consultations={consultations}
                settings={settings}
                onOpenSettings={()=>setTab('settings')}
              />
            )}
            {tab==='settings' && (
              <SettingsTab settings={settings} onSave={handleSaveSettings}/>
            )}
          </div>
        </div>
      </div>
    </>
  );
}