import { useState, useEffect, useRef } from "react";
import { supabase } from './supabase'
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600;1,700&family=Outfit:wght@200;300;400;500;600&family=Noto+Serif+Devanagari:wght@300;400;500;600&display=swap');`;

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
    --error:     #E07070;
  }

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body { height: 100%; }

  body {
    background: var(--abyss);
    color: var(--pearl);
    font-family: 'Outfit', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* Noise */
  body::after {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 998; opacity: 0.4;
  }

  /* Cursor */
  .cursor { width:8px; height:8px; background:var(--moon); border-radius:50%; position:fixed; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); transition:left 0.06s,top 0.06s; }
  .cursor-ring { width:28px; height:28px; border:1px solid rgba(168,204,224,0.3); border-radius:50%; position:fixed; pointer-events:none; z-index:9998; transform:translate(-50%,-50%); transition:left 0.14s ease-out,top 0.14s ease-out; }

  /* Layout */
  .auth-wrap {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  /* LEFT — Visual */
  .auth-left {
    background: var(--deep);
    position: relative; overflow: hidden;
    display: flex; flex-direction: column;
    justify-content: space-between;
    padding: 48px 56px;
  }
  .auth-left::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 50% 40%, rgba(168,204,224,0.07) 0%, transparent 60%),
      radial-gradient(ellipse at 20% 80%, rgba(226,194,125,0.04) 0%, transparent 50%);
    pointer-events: none;
  }

  .al-brand { position: relative; z-index: 2; }
  .al-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 600;
    color: var(--pearl); letter-spacing: 5px;
    text-transform: uppercase; display: block;
  }
  .al-brand-name span { color: var(--gold); }
  .al-brand-sub {
    font-size: 9px; letter-spacing: 3px;
    color: var(--moon-dim); text-transform: uppercase;
    margin-top: 4px; display: block;
  }

  /* Moon visual */
  .al-moon-wrap {
    position: absolute;
    top: 42%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }
  .al-moon-glow {
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle at center,
      rgba(168,204,224,0.07) 0%,
      rgba(168,204,224,0.03) 40%,
      transparent 70%
    );
    animation: mPulse 5s ease-in-out infinite;
    display: flex; align-items: center; justify-content: center;
  }
  @keyframes mPulse {
    0%,100% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.06); opacity: 1; }
  }
  .al-moon-body {
    width: 120px; height: 120px; border-radius: 50%;
    background: radial-gradient(circle at 38% 35%,
      #E8F4FF 0%, #C8E0F0 25%, #A8CCE0 50%,
      #7AAEC8 75%, #4A82A0 100%
    );
    box-shadow:
      0 0 40px rgba(168,204,224,0.2),
      0 0 80px rgba(168,204,224,0.08),
      inset -12px -12px 24px rgba(74,130,160,0.4);
  }
  .al-moon-ring {
    position: absolute; inset: -40px;
    border-radius: 50%;
    border: 1px solid rgba(168,204,224,0.08);
    animation: spin 60s linear infinite;
  }
  .al-moon-ring-2 {
    position: absolute; inset: -70px;
    border-radius: 50%;
    border: 1px dashed rgba(226,194,125,0.06);
    animation: spin 90s linear infinite reverse;
  }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  /* Nakshatra dots on ring */
  .al-moon-dots {
    position: absolute; inset: -40px;
    border-radius: 50%;
    animation: spin 60s linear infinite;
  }

  /* Left bottom copy */
  .al-copy { position: relative; z-index: 2; }
  .al-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px; font-weight: 600;
    line-height: 1.2; color: var(--pearl);
    margin-bottom: 16px;
  }
  .al-headline em { font-style: italic; color: var(--gold); }
  .al-sub {
    font-size: 14px; line-height: 1.8;
    color: var(--pearl-dim); font-weight: 300;
    max-width: 340px;
  }
  .al-skt {
    font-family: 'Noto Serif Devanagari', serif;
    font-size: 13px; color: var(--moon-dim);
    letter-spacing: 2px; margin-top: 20px; display: block;
  }

  /* RIGHT — Form */
  .auth-right {
    background: var(--abyss);
    display: flex; align-items: center; justify-content: center;
    padding: 48px 64px;
    position: relative;
  }
  .auth-right::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 30%,
      rgba(168,204,224,0.03) 0%, transparent 60%);
    pointer-events: none;
  }

  .auth-form-wrap {
    width: 100%; max-width: 420px;
    position: relative; z-index: 1;
  }

  /* Tab switcher */
  .auth-tabs {
    display: flex; gap: 2px;
    margin-bottom: 40px;
    border-bottom: 1px solid rgba(168,204,224,0.08);
  }
  .auth-tab {
    padding: 12px 24px;
    background: transparent; border: none;
    font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 400;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--pearl-dim); cursor: none;
    transition: all 0.3s;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
  }
  .auth-tab.active {
    color: var(--pearl);
    border-bottom-color: var(--gold);
  }

  /* Form heading */
  .form-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; font-weight: 600;
    color: var(--pearl); margin-bottom: 8px;
    line-height: 1.2;
  }
  .form-headline em { font-style: italic; color: var(--gold); }
  .form-sub {
    font-size: 14px; color: var(--pearl-dim);
    margin-bottom: 36px; line-height: 1.6; font-weight: 300;
  }

  /* Google button */
  .btn-google {
    width: 100%; padding: 14px 20px;
    background: rgba(168,204,224,0.05);
    border: 1px solid rgba(168,204,224,0.15);
    border-radius: 2px; color: var(--pearl);
    font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 400;
    letter-spacing: 0.5px; cursor: none;
    transition: all 0.3s;
    display: flex; align-items: center;
    justify-content: center; gap: 12px;
    margin-bottom: 24px;
  }
  .btn-google:hover {
    background: rgba(168,204,224,0.1);
    border-color: rgba(168,204,224,0.3);
  }
  .google-icon {
    width: 18px; height: 18px; flex-shrink: 0;
  }

  /* Divider */
  .auth-divider {
    display: flex; align-items: center;
    gap: 14px; margin-bottom: 24px;
  }
  .div-line { flex:1; height:1px; background:rgba(168,204,224,0.08); }
  .div-text { font-size:11px; letter-spacing:2px; color:var(--pearl-dim); text-transform:uppercase; }

  /* Input fields */
  .field { margin-bottom: 18px; position: relative; }
  .field-label {
    display: block; font-size: 11px;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--moon-dim); margin-bottom: 8px;
    font-weight: 500;
  }
  .field-input {
    width: 100%; padding: 13px 16px;
    background: rgba(13,31,53,0.6);
    border: 1px solid rgba(168,204,224,0.1);
    border-radius: 2px; color: var(--pearl);
    font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 300;
    transition: all 0.3s; outline: none;
  }
  .field-input::placeholder { color: rgba(139,175,196,0.3); }
  .field-input:focus {
    border-color: rgba(168,204,224,0.35);
    background: rgba(17,40,64,0.8);
    box-shadow: 0 0 0 3px rgba(168,204,224,0.05);
  }
  .field-input.error { border-color: var(--error); }
  .field-error { font-size: 12px; color: var(--error); margin-top: 6px; display: block; }

  /* Password toggle */
  .field-toggle {
    position: absolute; right: 14px; top: 38px;
    background: none; border: none; cursor: none;
    color: var(--pearl-dim); font-size: 13px;
    transition: color 0.3s; padding: 4px;
  }
  .field-toggle:hover { color: var(--moon); }

  /* Submit button */
  .btn-submit {
    width: 100%; padding: 15px;
    background: linear-gradient(135deg, rgba(168,204,224,0.18), rgba(168,204,224,0.08));
    border: 1px solid rgba(168,204,224,0.3);
    border-radius: 2px; color: var(--pearl);
    font-family: 'Outfit', sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 2.5px; text-transform: uppercase;
    cursor: none; transition: all 0.4s;
    margin-top: 8px; position: relative; overflow: hidden;
  }
  .btn-submit::before {
    content: ''; position: absolute; inset: 0;
    background: rgba(168,204,224,0.08);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s;
  }
  .btn-submit:hover::before { transform: scaleX(1); }
  .btn-submit:hover { border-color: var(--moon); }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Loading state */
  .btn-submit.loading::after {
    content: '';
    display: inline-block; width: 14px; height: 14px;
    border: 2px solid rgba(168,204,224,0.3);
    border-top-color: var(--moon);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-left: 10px; vertical-align: middle;
  }

  /* Switch link */
  .auth-switch {
    text-align: center; margin-top: 28px;
    font-size: 13px; color: var(--pearl-dim);
  }
  .auth-switch button {
    background: none; border: none; color: var(--moon);
    font-family: 'Outfit', sans-serif; font-size: 13px;
    cursor: none; transition: color 0.3s;
    text-decoration: underline; text-underline-offset: 3px;
    text-decoration-color: rgba(168,204,224,0.3);
    padding: 0; margin-left: 6px;
  }
  .auth-switch button:hover { color: var(--pearl); }

  /* Privacy note */
  .auth-privacy {
    text-align: center; margin-top: 20px;
    font-size: 11px; color: rgba(139,175,196,0.35);
    line-height: 1.6; letter-spacing: 0.3px;
  }
  .auth-privacy span { color: var(--moon-dim); }

  /* Success state */
  .auth-success {
    text-align: center; padding: 40px 20px;
    animation: fadeUp 0.7s ease both;
  }
  .success-moon { font-size: 52px; margin-bottom: 20px; display: block; animation: mPulse 3s ease-in-out infinite; }
  .success-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; font-weight: 600;
    color: var(--pearl); margin-bottom: 12px;
  }
  .success-title em { font-style: italic; color: var(--gold); }
  .success-body { font-size: 15px; color: var(--pearl-dim); line-height: 1.7; margin-bottom: 32px; }
  .success-next {
    font-size: 12px; letter-spacing: 2px;
    color: var(--moon-dim); text-transform: uppercase;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .success-next::before, .success-next::after {
    content: ''; width: 24px; height: 1px; background: var(--gold-dim);
  }

  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  /* Responsive */
  @media (max-width: 900px) {
    .auth-wrap { grid-template-columns: 1fr; }
    .auth-left { display: none; }
    .auth-right { padding: 48px 24px; min-height: 100vh; }
    .cursor, .cursor-ring { display: none; }
    body { cursor: auto; }
  }
`;

// Star field
function StarField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let ctx; try { ctx = canvas.getContext('2d'); } catch(e) { return; }
    if (!ctx) return;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });
    const stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.1 + 0.2,
      dx: (Math.random() - 0.5) * 0.1, dy: -Math.random() * 0.12 - 0.03,
      o: Math.random() * 0.4 + 0.1, ts: Math.random() * 0.015 + 0.004, to: Math.random() * Math.PI * 2,
    }));
    let frame = 0, animId;
    const draw = () => {
      ctx.clearRect(0, 0, W, H); frame++;
      stars.forEach(s => {
        const tw = Math.sin(frame * s.ts + s.to) * 0.3 + 0.7;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,204,224,${s.o * tw})`; ctx.fill();
        s.x += s.dx; s.y += s.dy;
        if (s.y < -5) { s.y = H + 5; s.x = Math.random() * W; }
        if (s.x < -5) s.x = W + 5; if (s.x > W + 5) s.x = -5;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);
  return <canvas ref={canvasRef} style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0, opacity:0.6 }} />;
}

function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    const mv = e => {
      if (dot.current) { dot.current.style.left = e.clientX+'px'; dot.current.style.top = e.clientY+'px'; }
      if (ring.current) { ring.current.style.left = e.clientX+'px'; ring.current.style.top = e.clientY+'px'; }
    };
    window.addEventListener('mousemove', mv);
    return () => window.removeEventListener('mousemove', mv);
  }, []);
  return (<><div className="cursor" ref={dot}/><div className="cursor-ring" ref={ring}/></>);
}

// Animated ocean waves
function OceanWaves() {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: '45%', overflow: 'hidden', zIndex: 1,
      pointerEvents: 'none',
    }}>
      <svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', bottom: 0, width: '100%', height: '100%' }}
        preserveAspectRatio="none">
        <defs>
          <style>{`
            .w1 { animation: wave1 8s ease-in-out infinite; }
            .w2 { animation: wave2 11s ease-in-out infinite; }
            .w3 { animation: wave3 14s ease-in-out infinite; }
            .w4 { animation: wave4 17s ease-in-out infinite; }
            @keyframes wave1 {
              0%,100% { d: path("M0,180 C120,140 200,200 320,170 C440,140 520,190 640,165 C720,148 760,170 800,160 L800,300 L0,300 Z"); }
              50% { d: path("M0,170 C100,200 220,145 340,180 C460,215 540,155 660,178 C740,194 780,165 800,170 L800,300 L0,300 Z"); }
            }
            @keyframes wave2 {
              0%,100% { d: path("M0,210 C140,175 240,230 380,200 C500,172 600,215 720,195 C760,185 785,198 800,192 L800,300 L0,300 Z"); }
              50% { d: path("M0,200 C120,228 260,180 380,215 C490,245 590,195 720,210 C768,220 790,205 800,200 L800,300 L0,300 Z"); }
            }
            @keyframes wave3 {
              0%,100% { d: path("M0,235 C160,210 280,250 400,228 C520,206 620,242 740,225 C772,217 790,228 800,222 L800,300 L0,300 Z"); }
              50% { d: path("M0,228 C140,248 270,215 400,238 C520,260 630,222 740,240 C775,250 792,235 800,230 L800,300 L0,300 Z"); }
            }
            @keyframes wave4 {
              0%,100% { d: path("M0,260 C180,244 300,268 440,252 C560,237 660,262 780,250 L800,300 L0,300 Z"); }
              50% { d: path("M0,252 C160,266 300,245 440,260 C570,274 670,248 780,258 L800,300 L0,300 Z"); }
            }
          `}</style>
        </defs>
        {/* Deep base */}
        <rect x="0" y="260" width="800" height="40" fill="rgba(168,204,224,0.025)" />
        {/* Waves — back to front, decreasing opacity */}
        <path className="w4" fill="rgba(168,204,224,0.025)" />
        <path className="w3" fill="rgba(168,204,224,0.03)" />
        <path className="w2" fill="rgba(168,204,224,0.035)" />
        <path className="w1" fill="rgba(168,204,224,0.045)" />
        {/* Moon reflection on water */}
        <ellipse cx="400" cy="268" rx="60" ry="8"
          fill="rgba(168,204,224,0.06)"
          style={{ animation: 'wave1 6s ease-in-out infinite' }} />
        <ellipse cx="400" cy="272" rx="32" ry="4"
          fill="rgba(226,194,125,0.04)"
          style={{ animation: 'wave2 7s ease-in-out infinite' }} />
      </svg>
    </div>
  );
}
function LeftMoon() {
  const dots = Array.from({ length: 27 }, (_, i) => {
    const angle = (i / 27) * 360;
    const rad = angle * Math.PI / 180;
    return { x: Math.cos(rad) * 148, y: Math.sin(rad) * 148, bright: i % 5 === 0 };
  });
  return (
    <div className="al-moon-wrap">
      <div className="al-moon-glow">
        <div style={{ position: 'relative', width: 120, height: 120 }}>
          <div className="al-moon-ring" />
          <div className="al-moon-ring-2" />
          <svg style={{ position: 'absolute', inset: -160, width: 440, height: 440, top: -160, left: -160 }} viewBox="-220 -220 440 440">
            {dots.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={d.bright ? 2 : 1.2}
                fill={d.bright ? '#E2C27D' : '#A8CCE0'}
                opacity={d.bright ? 0.7 : 0.35} />
            ))}
            <circle cx="0" cy="0" r="148" fill="none" stroke="rgba(168,204,224,0.06)" strokeWidth="1" strokeDasharray="2 8" />
          </svg>
          <div className="al-moon-body" />
        </div>
      </div>
    </div>
  );
}

// Signup Form
function SignupForm({ onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Your name is required';
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (form.password.length < 8) e.password = 'At least 8 characters';
    return e;
  };

  const handleSubmit = async () => {
  const e = validate();
  if (Object.keys(e).length) { setErrors(e); return; }
  setLoading(true);

 const { error } = await supabase.auth.signUp({
  email: form.email,
  password: form.password,
  options: {
    data: {
      name: form.name  // ← this must be here
    }
  }
});

  setLoading(false);
  if (error) { console.error(error); alert(error.message); return; }
  onSuccess(form.name);
};

  return (
    <div style={{ animation: 'fadeUp 0.6s ease both' }}>
      <div className="form-headline">Welcome to<br /><em>SATTVA.</em></div>
      <p className="form-sub">Create your free account. Your birth details come later — for now, just you.</p>

      {/* Google */}
      <button className="btn-google">
        <svg className="google-icon" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <div className="auth-divider">
        <div className="div-line"/><span className="div-text">or</span><div className="div-line"/>
      </div>

      {/* Name */}
      <div className="field">
        <label className="field-label">Your Name</label>
        <input className={`field-input ${errors.name ? 'error' : ''}`} placeholder="What do we call you?"
          value={form.name} onChange={e => { setForm({...form, name: e.target.value}); setErrors({...errors, name:''}); }} />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      {/* Email */}
      <div className="field">
        <label className="field-label">Email</label>
        <input type="email" className={`field-input ${errors.email ? 'error' : ''}`} placeholder="your@email.com"
          value={form.email} onChange={e => { setForm({...form, email: e.target.value}); setErrors({...errors, email:''}); }} />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      {/* Password */}
      <div className="field">
        <label className="field-label">Password</label>
        <input type={showPass ? 'text' : 'password'} className={`field-input ${errors.password ? 'error' : ''}`}
          placeholder="Min. 8 characters" value={form.password}
          onChange={e => { setForm({...form, password: e.target.value}); setErrors({...errors, password:''}); }} />
        <button className="field-toggle" onClick={() => setShowPass(!showPass)}>{showPass ? '◡' : '○'}</button>
        {errors.password && <span className="field-error">{errors.password}</span>}
      </div>

      <button className={`btn-submit ${loading ? 'loading' : ''}`} onClick={handleSubmit} disabled={loading}>
        {loading ? 'Creating your space' : 'Begin — it\'s free'}
      </button>

      <div className="auth-privacy">
        Your birth data is yours. Always.<br />
        <span>We never sell your information.</span> Ever.
      </div>
    </div>
  );
}

// Login Form
function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess(''); }, 1600);
  };

  return (
    <div style={{ animation: 'fadeUp 0.6s ease both' }}>
      <div className="form-headline">Welcome<br /><em>back.</em></div>
      <p className="form-sub">Your healing continues where you left it.</p>

      <button className="btn-google">
        <svg className="google-icon" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <div className="auth-divider">
        <div className="div-line"/><span className="div-text">or</span><div className="div-line"/>
      </div>

      <div className="field">
        <label className="field-label">Email</label>
        <input type="email" className={`field-input ${errors.email ? 'error' : ''}`} placeholder="your@email.com"
          value={form.email} onChange={e => { setForm({...form, email: e.target.value}); setErrors({...errors, email:''}); }} />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="field">
        <label className="field-label">Password</label>
        <input type={showPass ? 'text' : 'password'} className={`field-input ${errors.password ? 'error' : ''}`}
          placeholder="Your password" value={form.password}
          onChange={e => { setForm({...form, password: e.target.value}); setErrors({...errors, password:''}); }} />
        <button className="field-toggle" onClick={() => setShowPass(!showPass)}>{showPass ? '◡' : '○'}</button>
        {errors.password && <span className="field-error">{errors.password}</span>}
      </div>

      <div style={{ textAlign: 'right', marginBottom: 20, marginTop: -8 }}>
        <button style={{ background:'none', border:'none', color:'var(--moon-dim)', fontSize:12, cursor:'none', letterSpacing:1 }}>
          Forgot password?
        </button>
      </div>

      <button className={`btn-submit ${loading ? 'loading' : ''}`} onClick={handleSubmit} disabled={loading}>
        {loading ? 'Opening your space' : 'Enter SATTVA'}
      </button>
    </div>
  );
}

// Success state
function SuccessState({ name }) {
  return (
    <div className="auth-success">
      <span className="success-moon">🌙</span>
      <div className="success-title">
        {name ? `${name},` : 'Welcome.'}<br /><em>you're home.</em>
      </div>
      <p className="success-body">
        Your space is ready.<br />
        Now let's understand what you're carrying<br />
        — and build your healing path.
      </p>
      <div className="success-next">Next — Choose your path</div>
    </div>
  );
}

export default function SattvaAuth({ defaultTab = 'signup' }) {
  const [tab, setTab] = useState(defaultTab);
  const [success, setSuccess] = useState(false);
  const [userName, setUserName] = useState('');

  const handleSuccess = (name) => {
    setUserName(name);
    setSuccess(true);
  };

  return (
    <>
      <style>{FONTS + css}</style>
      <Cursor />
      <StarField />

      <div className="auth-wrap">
        {/* LEFT */}
        <div className="auth-left">
          <div className="al-brand">
            <span className="al-brand-name">SATTVA <span>Heals</span></span>
            <span className="al-brand-sub">sattvaheals.in</span>
          </div>

          <LeftMoon />
          <OceanWaves />

          <div className="al-copy">
            <div className="al-headline">
              You came with<br />a blank mind.<br />
              <em>Leave with light.</em>
            </div>
            <p className="al-sub">
              5,000 years of India's healing intelligence —
              Jyotisha, Ayurveda, Yoga and Mantra —
              personalised to your Moon, your constitution,
              your moment in time.
            </p>
            <span className="al-skt" style={{color: 'var(--gold)'}}>सत्त्वम् — The pure nature of mind</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            {success ? (
              <SuccessState name={userName} />
            ) : (
              <>
                <div className="auth-tabs">
                  <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>Sign Up</button>
                  <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Log In</button>
                </div>
                {tab === 'signup'
                  ? <SignupForm onSuccess={handleSuccess} />
                  : <LoginForm onSuccess={handleSuccess} />
                }
                <div className="auth-switch">
                  {tab === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                  <button onClick={() => setTab(tab === 'signup' ? 'login' : 'signup')}>
                    {tab === 'signup' ? 'Log in' : 'Sign up free'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}