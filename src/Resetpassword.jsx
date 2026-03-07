import { useState, useEffect, useRef } from "react";
import { supabase } from './supabase';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600;1,700&family=Outfit:wght@200;300;400;500;600&family=Noto+Serif+Devanagari:wght@300;400;500;600&display=swap');`;

const css = `
  :root {
    --abyss: #060E1A; --deep: #0D1F35; --surface: #112840;
    --moon: #A8CCE0; --moon-dim: #6B95AE;
    --gold: #E2C27D; --gold-dim: #B89A55;
    --pearl: #D8EEF8; --pearl-dim: #8BAFC4;
    --error: #E07070; --green: #6ECBA0;
  }
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body { height:100%; }
  body { background:var(--abyss); color:var(--pearl); font-family:'Outfit',sans-serif; font-weight:300; overflow-x:hidden; min-height:100vh; }
  body::after { content:''; position:fixed; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E"); pointer-events:none; z-index:998; opacity:0.4; }

  .cursor { width:8px; height:8px; background:var(--moon); border-radius:50%; position:fixed; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); transition:left 0.06s,top 0.06s; }
  .cursor-ring { width:28px; height:28px; border:1px solid rgba(168,204,224,0.3); border-radius:50%; position:fixed; pointer-events:none; z-index:9998; transform:translate(-50%,-50%); transition:left 0.14s ease-out,top 0.14s ease-out; }

  .rp-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:40px 24px; position:relative; z-index:2; }
  .rp-wrap::before { content:''; position:fixed; inset:0; background:radial-gradient(ellipse at 50% 40%, rgba(168,204,224,0.05) 0%, transparent 60%); pointer-events:none; }

  .rp-box { width:100%; max-width:420px; position:relative; z-index:1; animation:fadeUp 0.7s ease both; }

  .rp-brand { text-align:center; margin-bottom:48px; }
  .rp-brand-name { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--pearl); letter-spacing:5px; text-transform:uppercase; display:block; }
  .rp-brand-name span { color:var(--gold); }
  .rp-brand-sub { font-size:9px; letter-spacing:3px; color:var(--moon-dim); text-transform:uppercase; margin-top:4px; display:block; }

  .rp-moon { font-size:40px; text-align:center; margin-bottom:20px; display:block; animation:moonPulse 4s ease-in-out infinite; }
  @keyframes moonPulse { 0%,100%{opacity:0.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.06)} }

  .rp-title { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:600; color:var(--pearl); text-align:center; margin-bottom:8px; line-height:1.2; }
  .rp-title em { font-style:italic; color:var(--gold); }
  .rp-sub { font-size:14px; color:var(--pearl-dim); text-align:center; margin-bottom:36px; line-height:1.7; font-weight:300; }

  .field { margin-bottom:18px; position:relative; }
  .field-label { display:block; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--moon-dim); margin-bottom:8px; font-weight:500; }
  .field-input { width:100%; padding:13px 16px; background:rgba(13,31,53,0.6); border:1px solid rgba(168,204,224,0.1); border-radius:2px; color:var(--pearl); font-family:'Outfit',sans-serif; font-size:14px; font-weight:300; transition:all 0.3s; outline:none; }
  .field-input::placeholder { color:rgba(139,175,196,0.3); }
  .field-input:focus { border-color:rgba(168,204,224,0.35); background:rgba(17,40,64,0.8); box-shadow:0 0 0 3px rgba(168,204,224,0.05); }
  .field-input.error { border-color:var(--error); }
  .field-error { font-size:12px; color:var(--error); margin-top:6px; display:block; }
  .field-toggle { position:absolute; right:14px; top:38px; background:none; border:none; cursor:pointer; color:var(--pearl-dim); font-size:13px; transition:color 0.3s; padding:4px; }
  .field-toggle:hover { color:var(--moon); }

  .strength-bar { margin-top:8px; height:3px; background:rgba(168,204,224,0.08); border-radius:2px; overflow:hidden; }
  .strength-fill { height:100%; border-radius:2px; transition:all 0.4s; }

  .btn-submit { width:100%; padding:15px; background:linear-gradient(135deg,rgba(168,204,224,0.18),rgba(168,204,224,0.08)); border:1px solid rgba(168,204,224,0.3); border-radius:2px; color:var(--pearl); font-family:'Outfit',sans-serif; font-size:12px; font-weight:500; letter-spacing:2.5px; text-transform:uppercase; cursor:pointer; transition:all 0.4s; margin-top:8px; position:relative; overflow:hidden; }
  .btn-submit::before { content:''; position:absolute; inset:0; background:rgba(168,204,224,0.08); transform:scaleX(0); transform-origin:left; transition:transform 0.4s; }
  .btn-submit:hover::before { transform:scaleX(1); }
  .btn-submit:hover { border-color:var(--moon); }
  .btn-submit:disabled { opacity:0.4; cursor:not-allowed; }
  .btn-submit.loading::after { content:''; display:inline-block; width:14px; height:14px; border:2px solid rgba(168,204,224,0.3); border-top-color:var(--moon); border-radius:50%; animation:spin 0.8s linear infinite; margin-left:10px; vertical-align:middle; }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  .alert { padding:12px 16px; margin-bottom:16px; font-size:13px; border-radius:2px; line-height:1.5; }
  .alert-error { background:rgba(224,112,112,0.08); border:1px solid rgba(224,112,112,0.2); color:var(--error); }
  .alert-success { background:rgba(110,203,160,0.08); border:1px solid rgba(110,203,160,0.2); color:var(--green); }

  .rp-back { text-align:center; margin-top:24px; font-size:13px; color:var(--pearl-dim); }
  .rp-back button { background:none; border:none; color:var(--moon); font-family:'Outfit',sans-serif; font-size:13px; cursor:pointer; transition:color 0.3s; text-decoration:underline; text-underline-offset:3px; text-decoration-color:rgba(168,204,224,0.3); padding:0; margin-left:6px; }
  .rp-back button:hover { color:var(--pearl); }

  /* Success state */
  .rp-success { text-align:center; animation:fadeUp 0.7s ease both; }
  .rp-success-moon { font-size:52px; display:block; margin-bottom:20px; animation:moonPulse 3s ease-in-out infinite; }
  .rp-success-title { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:600; color:var(--pearl); margin-bottom:12px; }
  .rp-success-title em { font-style:italic; color:var(--gold); }
  .rp-success-body { font-size:15px; color:var(--pearl-dim); line-height:1.7; margin-bottom:32px; }
  .rp-success-btn { display:inline-block; padding:14px 40px; background:linear-gradient(135deg,rgba(168,204,224,0.18),rgba(168,204,224,0.08)); border:1px solid rgba(168,204,224,0.3); border-radius:2px; color:var(--pearl); font-family:'Outfit',sans-serif; font-size:12px; font-weight:500; letter-spacing:2.5px; text-transform:uppercase; cursor:pointer; transition:all 0.4s; }
  .rp-success-btn:hover { border-color:var(--moon); color:var(--moon); }

  /* Invalid token state */
  .rp-invalid { text-align:center; animation:fadeUp 0.7s ease both; }
  .rp-invalid-icon { font-size:48px; display:block; margin-bottom:20px; opacity:0.5; }
  .rp-invalid-title { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:600; color:var(--pearl); margin-bottom:12px; }
  .rp-invalid-body { font-size:14px; color:var(--pearl-dim); line-height:1.7; margin-bottom:28px; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  @media(max-width:480px) {
    .rp-box { padding:0 4px; }
    .cursor, .cursor-ring { display:none; }
    body { cursor:auto; }
  }
`;

function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    const mv = e => {
      if(dot.current){dot.current.style.left=e.clientX+'px';dot.current.style.top=e.clientY+'px';}
      if(ring.current){ring.current.style.left=e.clientX+'px';ring.current.style.top=e.clientY+'px';}
    };
    window.addEventListener('mousemove', mv);
    return () => window.removeEventListener('mousemove', mv);
  }, []);
  return (<><div className="cursor" ref={dot}/><div className="cursor-ring" ref={ring}/></>);
}

function StarField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if(!canvas) return;
    let ctx; try{ctx=canvas.getContext('2d');}catch(e){return;} if(!ctx) return;
    let W=canvas.width=window.innerWidth, H=canvas.height=window.innerHeight;
    window.addEventListener('resize',()=>{W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;});
    const stars=Array.from({length:50},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.1+0.2,dx:(Math.random()-0.5)*0.1,dy:-Math.random()*0.12-0.03,o:Math.random()*0.4+0.1,ts:Math.random()*0.015+0.004,to:Math.random()*Math.PI*2}));
    let frame=0,animId;
    const draw=()=>{
      ctx.clearRect(0,0,W,H); frame++;
      stars.forEach(s=>{
        const tw=Math.sin(frame*s.ts+s.to)*0.3+0.7;
        ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(168,204,224,${s.o*tw})`;ctx.fill();
        s.x+=s.dx;s.y+=s.dy;
        if(s.y<-5){s.y=H+5;s.x=Math.random()*W;}
        if(s.x<-5)s.x=W+5;if(s.x>W+5)s.x=-5;
      });
      animId=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(animId);
  },[]);
  return <canvas ref={canvasRef} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0,opacity:0.5}}/>;
}

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score: 20, label: 'Weak', color: '#E07070' };
  if (score <= 2) return { score: 40, label: 'Fair', color: '#E2C27D' };
  if (score <= 3) return { score: 65, label: 'Good', color: '#A8CCE0' };
  return { score: 100, label: 'Strong', color: '#6ECBA0' };
}

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null); // null=checking, true=valid, false=invalid

  const strength = getPasswordStrength(password);

  // Supabase puts the token in the URL hash — detect it on load
  useEffect(() => {
    // onAuthStateChange fires with SIGNED_IN after Supabase processes the hash token
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setTokenValid(true);
      } else if (event === 'SIGNED_IN' && session) {
        // Already handled by Supabase — token was valid
        setTokenValid(true);
      }
    });

    // Also check if there's a session already (token processed fast)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setTokenValid(true);
      else {
        // Give Supabase 1.5s to process the hash before calling invalid
        setTimeout(() => {
          setTokenValid(prev => prev === null ? false : prev);
        }, 1500);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const validate = () => {
    const e = {};
    if (password.length < 8) e.password = 'At least 8 characters required';
    if (password !== confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true); setAlertMsg('');
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setAlertMsg(error.message); return; }
    setSuccess(true);
    // Redirect to home after 3 seconds
    setTimeout(() => { window.location.href = '/'; }, 3000);
  };

  const goToLogin = () => { window.location.href = '/login'; };

  return (
    <>
      <style>{FONTS + css}</style>
      <Cursor />
      <StarField />

      <div className="rp-wrap">
        <div className="rp-box">

          {/* Brand */}
          <div className="rp-brand">
            <span className="rp-brand-name">SATTVA <span>Heals</span></span>
            <span className="rp-brand-sub">sattvaheals.in</span>
          </div>

          {/* Checking token */}
          {tokenValid === null && (
            <div style={{textAlign:'center',color:'var(--pearl-dim)',fontSize:14,padding:'40px 0'}}>
              <span style={{fontSize:32,display:'block',marginBottom:16,opacity:0.5}}>🌙</span>
              Verifying your reset link…
            </div>
          )}

          {/* Invalid / expired token */}
          {tokenValid === false && (
            <div className="rp-invalid">
              <span className="rp-invalid-icon">🌑</span>
              <div className="rp-invalid-title">Link expired</div>
              <p className="rp-invalid-body">
                This password reset link has expired or already been used.<br/>
                Reset links are valid for 1 hour only.
              </p>
              <button className="rp-success-btn" onClick={goToLogin}>
                Back to login
              </button>
            </div>
          )}

          {/* Success state */}
          {tokenValid === true && success && (
            <div className="rp-success">
              <span className="rp-success-moon">🌙</span>
              <div className="rp-success-title">Password<br/><em>updated.</em></div>
              <p className="rp-success-body">
                Your new password is set.<br/>
                Redirecting you home in a moment…
              </p>
              <button className="rp-success-btn" onClick={goToLogin}>
                Go to login
              </button>
            </div>
          )}

          {/* Reset form */}
          {tokenValid === true && !success && (
            <>
              <span className="rp-moon">🌙</span>
              <div className="rp-title">Set a new<br/><em>password.</em></div>
              <p className="rp-sub">Choose something you'll remember.<br/>Min. 8 characters.</p>

              {alertMsg && <div className="alert alert-error">{alertMsg}</div>}

              <div className="field">
                <label className="field-label">New Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  className={`field-input ${errors.password ? 'error' : ''}`}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors({...errors, password:''}); }}
                />
                <button className="field-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? '◡' : '○'}
                </button>
                {password && (
                  <div className="strength-bar" style={{marginTop:8}}>
                    <div className="strength-fill" style={{width:`${strength.score}%`, background:strength.color}}/>
                  </div>
                )}
                {password && (
                  <span style={{fontSize:11,color:strength.color,marginTop:4,display:'block',letterSpacing:1}}>
                    {strength.label}
                  </span>
                )}
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="field">
                <label className="field-label">Confirm Password</label>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className={`field-input ${errors.confirm ? 'error' : ''}`}
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setErrors({...errors, confirm:''}); }}
                />
                <button className="field-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? '◡' : '○'}
                </button>
                {errors.confirm && <span className="field-error">{errors.confirm}</span>}
              </div>

              <button
                className={`btn-submit ${loading ? 'loading' : ''}`}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Updating password' : 'Set new password'}
              </button>

              <div className="rp-back">
                Remembered it?
                <button onClick={goToLogin}>Back to login</button>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}