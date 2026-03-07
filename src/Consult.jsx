import { useEffect, useRef, useState } from "react";

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
  html { scroll-behavior:smooth; }
  body { background:var(--abyss); color:var(--pearl); font-family:'Outfit',sans-serif; font-weight:300; overflow-x:hidden; }
  body::after { content:''; position:fixed; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E"); pointer-events:none; z-index:998; opacity:0.4; }

  .cursor { width:8px; height:8px; background:var(--moon); border-radius:50%; position:fixed; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); transition:left 0.06s,top 0.06s; }
  .cursor-ring { width:28px; height:28px; border:1px solid rgba(168,204,224,0.3); border-radius:50%; position:fixed; pointer-events:none; z-index:9998; transform:translate(-50%,-50%); transition:left 0.14s ease-out,top 0.14s ease-out; }

  nav { position:fixed; top:0; left:0; right:0; z-index:100; padding:0 72px; height:64px; display:flex; align-items:center; justify-content:space-between; background:rgba(6,14,26,0.92); backdrop-filter:blur(24px); border-bottom:1px solid rgba(168,204,224,0.06); }
  .nav-brand { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600; color:var(--pearl); letter-spacing:5px; text-transform:uppercase; text-decoration:none; }
  .nav-brand span { color:var(--gold); font-style:italic; }
  .nav-back { background:transparent; border:1px solid rgba(168,204,224,0.15); color:var(--moon-dim); padding:8px 20px; font-family:'Outfit',sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; cursor:none; transition:all 0.3s; border-radius:1px; }
  .nav-back:hover { border-color:var(--moon); color:var(--moon); }

  /* HERO */
  .hero { padding:140px 72px 100px; text-align:center; position:relative; overflow:hidden; }
  .hero::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 50% 0%, rgba(168,204,224,0.05) 0%, transparent 55%); pointer-events:none; }
  .eyebrow { display:inline-flex; align-items:center; gap:12px; margin-bottom:20px; }
  .ey-line { width:32px; height:1px; background:var(--gold-dim); }
  .ey-text { font-size:10px; letter-spacing:4px; color:var(--gold); text-transform:uppercase; font-weight:500; }
  .hero-title { font-family:'Cormorant Garamond',serif; font-size:clamp(44px,6vw,80px); font-weight:600; line-height:1.1; color:var(--pearl); margin-bottom:20px; animation:fadeUp 0.9s ease both; }
  .hero-title em { font-style:italic; color:var(--gold); }
  .hero-sub { font-size:17px; line-height:1.85; color:var(--pearl-dim); max-width:520px; margin:0 auto; animation:fadeUp 0.9s 0.15s ease both; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

  /* ARCH */
  .arch { width:100%; overflow:hidden; line-height:0; }
  .arch svg { display:block; width:100%; }

  /* CONSULT TYPES */
  .types-section { padding:100px 72px; background:var(--deep); position:relative; }
  .types-section::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 50% 0%, rgba(168,204,224,0.04) 0%, transparent 55%); pointer-events:none; }
  .types-inner { max-width:1100px; margin:0 auto; }
  .sec-label { font-size:10px; letter-spacing:4px; color:var(--gold); text-transform:uppercase; font-weight:500; margin-bottom:16px; display:block; }
  .sec-title { font-family:'Cormorant Garamond',serif; font-size:clamp(34px,4vw,52px); font-weight:600; color:var(--pearl); line-height:1.15; margin-bottom:60px; }
  .sec-title em { font-style:italic; color:var(--gold); }

  .types-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:3px; }
  .type-card {
    padding:40px 32px; position:relative; overflow:hidden;
    background:rgba(6,14,26,0.5);
    border:1px solid rgba(168,204,224,0.06);
    transition:all 0.4s; cursor:none;
  }
  .type-card:hover { background:rgba(17,40,64,0.7); border-color:rgba(168,204,224,0.14); }
  .type-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg, var(--gold-dim), transparent); opacity:0; transition:opacity 0.4s; }
  .type-card:hover::before { opacity:1; }
  .tc-num { position:absolute; top:16px; right:20px; font-family:'Cormorant Garamond',serif; font-size:56px; font-weight:700; color:rgba(168,204,224,0.04); line-height:1; }
  .tc-sk { font-family:'Noto Serif Devanagari',serif; font-size:24px; color:var(--moon); opacity:0.2; margin-bottom:16px; display:block; line-height:1; }
  .tc-name { font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:600; color:var(--pearl); margin-bottom:8px; line-height:1.2; }
  .tc-sub { font-size:12px; letter-spacing:1.5px; color:var(--moon-dim); text-transform:uppercase; margin-bottom:16px; }
  .tc-body { font-size:13px; line-height:1.85; color:var(--pearl-dim); margin-bottom:24px; }
  .tc-price { display:flex; align-items:baseline; gap:6px; padding-top:20px; border-top:1px solid rgba(168,204,224,0.06); }
  .tc-price-num { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:600; color:var(--gold); line-height:1; }
  .tc-price-label { font-size:12px; color:var(--pearl-dim); }

  /* INFO STRIP */
  .info-strip { background:rgba(13,31,53,0.9); border-top:1px solid rgba(168,204,224,0.07); border-bottom:1px solid rgba(168,204,224,0.07); padding:0 72px; }
  .info-strip-inner { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); }
  .info-item { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:5px; padding:28px 16px; border-right:1px solid rgba(168,204,224,0.05); text-align:center; }
  .info-item:last-child { border-right:none; }
  .ii-dot { width:5px; height:5px; border-radius:50%; background:var(--moon); animation:iipulse 2.5s ease-in-out infinite; }
  @keyframes iipulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .ii-label { font-size:9px; letter-spacing:2.5px; color:var(--moon-dim); text-transform:uppercase; font-weight:500; }
  .ii-value { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600; color:var(--pearl); line-height:1.2; }

  /* MAIN SECTION — form + what to expect */
  .main-section { padding:100px 72px 120px; background:var(--abyss); }
  .main-inner { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:1.1fr 1fr; gap:80px; align-items:start; }

  /* FORM */
  .form-wrap { background:rgba(13,31,53,0.4); border:1px solid rgba(168,204,224,0.07); padding:48px; }
  .form-title { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:600; color:var(--pearl); margin-bottom:8px; }
  .form-title em { font-style:italic; color:var(--gold); }
  .form-sub { font-size:14px; color:var(--pearl-dim); margin-bottom:36px; line-height:1.6; }

  /* Consultation selector */
  .consult-selector { display:flex; flex-direction:column; gap:8px; margin-bottom:24px; }
  .consult-opt {
    display:flex; align-items:center; gap:14px;
    padding:14px 18px;
    border:1px solid rgba(168,204,224,0.07);
    background:rgba(6,14,26,0.4);
    cursor:none; transition:all 0.3s;
  }
  .consult-opt:hover { border-color:rgba(168,204,224,0.15); background:rgba(17,40,64,0.5); }
  .consult-opt.selected { border-color:var(--gold-dim); background:rgba(226,194,125,0.05); }
  .co-radio { width:14px; height:14px; border-radius:50%; border:1px solid rgba(168,204,224,0.25); flex-shrink:0; transition:all 0.3s; position:relative; }
  .consult-opt.selected .co-radio { border-color:var(--gold); background:var(--gold); }
  .consult-opt.selected .co-radio::after { content:''; position:absolute; inset:3px; border-radius:50%; background:var(--abyss); }
  .co-name { font-size:13px; color:var(--pearl); font-weight:400; flex:1; }
  .co-price { font-family:'Cormorant Garamond',serif; font-size:18px; color:var(--gold); font-weight:600; }

  /* Fields */
  .field { margin-bottom:18px; }
  .field-label { display:block; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--moon-dim); margin-bottom:8px; font-weight:500; }
  .field-input { width:100%; padding:13px 16px; background:rgba(6,14,26,0.6); border:1px solid rgba(168,204,224,0.1); color:var(--pearl); font-family:'Outfit',sans-serif; font-size:14px; font-weight:300; transition:all 0.3s; outline:none; border-radius:1px; }
  .field-input::placeholder { color:rgba(139,175,196,0.25); }
  .field-input:focus { border-color:rgba(168,204,224,0.35); background:rgba(17,40,64,0.8); box-shadow:0 0 0 3px rgba(168,204,224,0.04); }
  .field-input.error { border-color:var(--error); }
  .field-error { font-size:11px; color:var(--error); margin-top:5px; display:block; }
  textarea.field-input { resize:vertical; min-height:120px; line-height:1.6; }

  .fields-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }

  /* Submit */
  .btn-submit { width:100%; padding:16px; background:linear-gradient(135deg,rgba(168,204,224,0.18),rgba(168,204,224,0.06)); border:1px solid rgba(168,204,224,0.3); color:var(--pearl); font-family:'Outfit',sans-serif; font-size:12px; font-weight:500; letter-spacing:2.5px; text-transform:uppercase; cursor:none; transition:all 0.4s; border-radius:1px; margin-top:8px; position:relative; overflow:hidden; }
  .btn-submit::before { content:''; position:absolute; inset:0; background:rgba(168,204,224,0.08); transform:scaleX(0); transform-origin:left; transition:transform 0.4s; }
  .btn-submit:hover::before { transform:scaleX(1); }
  .btn-submit:hover { border-color:var(--moon); }
  .btn-submit:disabled { opacity:0.5; }
  .btn-submit.loading::after { content:''; display:inline-block; width:12px; height:12px; border:1.5px solid rgba(168,204,224,0.3); border-top-color:var(--moon); border-radius:50%; animation:spin 0.8s linear infinite; margin-left:10px; vertical-align:middle; }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  .form-note { font-size:11px; color:rgba(139,175,196,0.3); text-align:center; margin-top:16px; line-height:1.6; }

  /* Success */
  .form-success { text-align:center; padding:40px 20px; animation:fadeUp 0.7s ease both; }
  .fs-icon { font-size:48px; display:block; margin-bottom:20px; }
  .fs-title { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:600; color:var(--pearl); margin-bottom:10px; }
  .fs-title em { font-style:italic; color:var(--gold); }
  .fs-body { font-size:15px; color:var(--pearl-dim); line-height:1.75; margin-bottom:24px; }
  .fs-note { font-size:11px; letter-spacing:1.5px; color:var(--moon-dim); text-transform:uppercase; }

  /* EXPECT */
  .expect-wrap {}
  .expect-title { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:600; color:var(--pearl); margin-bottom:32px; line-height:1.2; }
  .expect-title em { font-style:italic; color:var(--moon); }
  .expect-steps { display:flex; flex-direction:column; gap:0; margin-bottom:40px; }
  .estep {
    display:flex; gap:20px; padding:20px 0;
    border-bottom:1px solid rgba(168,204,224,0.05);
    position:relative;
  }
  .estep:last-child { border-bottom:none; }
  .estep-num { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:600; color:var(--gold); opacity:0.3; line-height:1; min-width:36px; }
  .estep-content {}
  .estep-title { font-size:14px; font-weight:500; color:var(--pearl); margin-bottom:5px; }
  .estep-body { font-size:13px; color:var(--pearl-dim); line-height:1.7; }

  /* Trust note */
  .trust-note {
    padding:24px 28px;
    background:rgba(13,31,53,0.4);
    border:1px solid rgba(168,204,224,0.06);
    border-left:2px solid var(--gold-dim);
  }
  .tn-label { font-size:9px; letter-spacing:3px; color:var(--gold); text-transform:uppercase; margin-bottom:8px; display:block; font-weight:500; }
  .tn-text { font-size:13px; color:var(--pearl-dim); line-height:1.75; font-style:italic; }

  /* Reveal */
  .reveal { opacity:0; transform:translateY(32px); transition:opacity 1s cubic-bezier(0.16,1,0.3,1),transform 1s cubic-bezier(0.16,1,0.3,1); }
  .reveal.visible { opacity:1; transform:translateY(0); }
  .reveal-left { opacity:0; transform:translateX(-32px); transition:opacity 1s cubic-bezier(0.16,1,0.3,1),transform 1s cubic-bezier(0.16,1,0.3,1); }
  .reveal-left.visible { opacity:1; transform:translateX(0); }
  .reveal-right { opacity:0; transform:translateX(32px); transition:opacity 1s cubic-bezier(0.16,1,0.3,1),transform 1s cubic-bezier(0.16,1,0.3,1); }
  .reveal-right.visible { opacity:1; transform:translateX(0); }

  footer { background:rgba(0,0,0,0.4); border-top:1px solid rgba(168,204,224,0.06); padding:0 72px; height:64px; display:flex; align-items:center; }
  .foot-inner { max-width:1200px; margin:0 auto; width:100%; display:flex; justify-content:space-between; align-items:center; }
  .foot-brand { font-family:'Cormorant Garamond',serif; font-size:16px; font-weight:600; color:var(--pearl); letter-spacing:4px; text-transform:uppercase; }
  .foot-brand span { color:var(--gold); font-style:italic; }
  .foot-copy { font-size:11px; color:rgba(139,175,196,0.3); }

  @media(max-width:960px){
    nav,footer{padding:0 24px;}
    .hero,.types-section,.main-section{padding:100px 24px 80px;}
    .info-strip{padding:24px;}
    .info-strip-inner{flex-direction:column;gap:24px;}
    .types-grid{grid-template-columns:1fr;}
    .main-inner{grid-template-columns:1fr;gap:48px;}
    .form-wrap{padding:32px 24px;}
    .fields-row{grid-template-columns:1fr;}
    .cursor,.cursor-ring{display:none;}
    body{cursor:auto;}
  }
`;

const consultTypes = [
  { sk:'जन्म', name:'Birth Chart Reading', sub:'Full Kundali Analysis', body:'Complete analysis of your birth chart — Moon, Ascendant, all 12 houses, planetary positions and their impact on your mind, health, relationships and life path.', price:'₹899' },
  { sk:'चन्द्र', name:'Moon & Mind Reading', sub:'Chandra & Mental Wellness', body:'Deep focus on your Chandra — Moon sign, Nakshatra, afflictions and their specific impact on your mental and emotional experience. Includes remedy protocol.', price:'₹899' },
  { sk:'उपाय', name:'Remedy Session', sub:'Targeted Healing Protocol', body:'For those who already have their chart read. A focused session on specific planetary afflictions — with a complete, personalised remedy protocol across Mantra, Ayurveda and Yoga.', price:'₹899' },
];

function Cursor(){
  const dot=useRef(null),ring=useRef(null);
  useEffect(()=>{
    const mv=e=>{
      if(dot.current){dot.current.style.left=e.clientX+'px';dot.current.style.top=e.clientY+'px';}
      if(ring.current){ring.current.style.left=e.clientX+'px';ring.current.style.top=e.clientY+'px';}
    };
    window.addEventListener('mousemove',mv);
    return()=>window.removeEventListener('mousemove',mv);
  },[]);
  return(<><div className="cursor" ref={dot}/><div className="cursor-ring" ref={ring}/></>);
}

function StarField(){
  const ref=useRef(null);
  useEffect(()=>{
    const canvas=ref.current;if(!canvas)return;
    let ctx;try{ctx=canvas.getContext('2d');}catch(e){return;}if(!ctx)return;
    let W=canvas.width=window.innerWidth,H=canvas.height=window.innerHeight;
    window.addEventListener('resize',()=>{W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;});
    const stars=Array.from({length:60},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.1+0.2,dx:(Math.random()-0.5)*0.1,dy:-Math.random()*0.12-0.03,o:Math.random()*0.4+0.1,ts:Math.random()*0.015+0.004,to:Math.random()*Math.PI*2}));
    let frame=0,id;
    const draw=()=>{
      ctx.clearRect(0,0,W,H);frame++;
      stars.forEach(s=>{
        const tw=Math.sin(frame*s.ts+s.to)*0.3+0.7;
        ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(168,204,224,${s.o*tw})`;ctx.fill();
        s.x+=s.dx;s.y+=s.dy;
        if(s.y<-5){s.y=H+5;s.x=Math.random()*W;}
        if(s.x<-5)s.x=W+5;if(s.x>W+5)s.x=-5;
      });
      id=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(id);
  },[]);
  return <canvas ref={ref} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0,opacity:0.5}}/>;
}

function useReveal(){
  useEffect(()=>{
    const els=document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
    const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:0.07});
    els.forEach(el=>obs.observe(el));
    return()=>obs.disconnect();
  },[]);
}

const Arch=({to})=>(
  <div className="arch">
    <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{height:60}}>
      <path d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z" fill={to}/>
      <path d="M0,0 C360,60 1080,60 1440,0" fill="none" stroke="rgba(168,204,224,0.05)" strokeWidth="1"/>
    </svg>
  </div>
);

function ConsultForm(){
  const [selected,setSelected]=useState(0);
  const [form,setForm]=useState({name:'',email:'',phone:'',message:''});
  const [errors,setErrors]=useState({});
  const [loading,setLoading]=useState(false);
  const [success,setSuccess]=useState(false);

  const validate=()=>{
    const e={};
    if(!form.name.trim()) e.name='Your name is required';
    if(!form.email.includes('@')) e.email='Enter a valid email';
    if(!form.message.trim()) e.message='Tell us a little about what you need';
    return e;
  };

  const handleSubmit=()=>{
    const e=validate();
    if(Object.keys(e).length){setErrors(e);return;}
    setLoading(true);
    setTimeout(()=>{setLoading(false);setSuccess(true);},1800);
  };

  if(success) return(
    <div className="form-success">
      <span className="fs-icon">🌙</span>
      <div className="fs-title">Request <em>received.</em></div>
      <p className="fs-body">Varad will review your message and respond within 2 working days to confirm your appointment details.</p>
      <div className="fs-note">Check your inbox · {form.email}</div>
    </div>
  );

  return(
    <>
      <div className="form-title">Book a <em>consultation.</em></div>
      <p className="form-sub">Select your session type, share your details, and Varad will reach out within 2 working days.</p>

      {/* Consultation type selector */}
      <div style={{marginBottom:24}}>
        <label className="field-label">Session Type</label>
        <div className="consult-selector">
          {consultTypes.map((t,i)=>(
            <div className={`consult-opt ${selected===i?'selected':''}`} key={i} onClick={()=>setSelected(i)}>
              <div className="co-radio"/>
              <div className="co-name">{t.name}</div>
              <div className="co-price">{t.price}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="fields-row">
        <div className="field">
          <label className="field-label">Your Name</label>
          <input className={`field-input ${errors.name?'error':''}`} placeholder="Full name"
            value={form.name} onChange={e=>{setForm({...form,name:e.target.value});setErrors({...errors,name:''}); }}/>
          {errors.name&&<span className="field-error">{errors.name}</span>}
        </div>
        <div className="field">
          <label className="field-label">Phone (optional)</label>
          <input className="field-input" placeholder="+91 XXXXX XXXXX"
            value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
        </div>
      </div>

      <div className="field">
        <label className="field-label">Email</label>
        <input type="email" className={`field-input ${errors.email?'error':''}`} placeholder="your@email.com"
          value={form.email} onChange={e=>{setForm({...form,email:e.target.value});setErrors({...errors,email:''}); }}/>
        {errors.email&&<span className="field-error">{errors.email}</span>}
      </div>

      <div className="field">
        <label className="field-label">What are you seeking?</label>
        <textarea className={`field-input ${errors.message?'error':''}`}
          placeholder="Share what's on your mind — what you're experiencing, what you're hoping to understand..."
          value={form.message} onChange={e=>{setForm({...form,message:e.target.value});setErrors({...errors,message:''}); }}/>
        {errors.message&&<span className="field-error">{errors.message}</span>}
      </div>

      <button className={`btn-submit ${loading?'loading':''}`} onClick={handleSubmit} disabled={loading}>
        {loading?'Sending your request':'Send request — ₹899'}
      </button>
      <p className="form-note">Payment is collected after Varad confirms your appointment.<br/>No charge until your session is confirmed.</p>
    </>
  );
}

export default function Consult(){
  useReveal();
  return(
    <>
      <style>{FONTS+css}</style>
      <Cursor/>
      <StarField/>

      <nav>
        <a className="nav-brand" href="/">SATTVA <span>Heals</span></a>
        <button className="nav-back" onClick={()=>window.location.href='/'}>← Back to Home</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="eyebrow"><div className="ey-line"/><span className="ey-text">Book a Consultation</span><div className="ey-line"/></div>
        <h1 className="hero-title">One session.<br /><em>Your entire chart.</em></h1>
        <p className="hero-sub">A personal consultation with Varad — your birth chart read in full, your Moon afflictions identified, your remedy path laid out. 10,000+ consultations. One for you.</p>
      </section>

      <Arch to="#0D1F35"/>

      {/* CONSULTATION TYPES */}
      <section className="types-section">
        <div className="types-inner">
          <div className="reveal">
            <span className="sec-label">What's Available</span>
            <h2 className="sec-title">Three ways to<br /><em>work with Varad.</em></h2>
          </div>
          <div className="types-grid">
            {consultTypes.map((t,i)=>(
              <div className="type-card reveal" key={i} style={{transitionDelay:`${i*0.1}s`}}>
                <div className="tc-num">0{i+1}</div>
                <span className="tc-sk">{t.sk}</span>
                <div className="tc-name">{t.name}</div>
                <div className="tc-sub">{t.sub}</div>
                <div className="tc-body">{t.body}</div>
                <div className="tc-price">
                  <div className="tc-price-num">{t.price}</div>
                  <div className="tc-price-label">per session · by appointment</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INFO STRIP */}
      <div className="info-strip">
        <div className="info-strip-inner">
          {[
            {label:'Price',value:'₹899 per session'},
            {label:'Response time',value:'Within 2 working days'},
            {label:'Format',value:'By appointment'},
            {label:'Payment',value:'Collected after confirmation'},
          ].map((item,i)=>(
            <div className="info-item" key={i}>
              <div className="ii-dot"/>
              <div>
                <div className="ii-label">{item.label}</div>
                <div className="ii-value">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Arch to="#060E1A"/>

      {/* FORM + EXPECT */}
      <section className="main-section">
        <div className="main-inner">
          <div className="reveal-left">
            <div className="form-wrap">
              <ConsultForm/>
            </div>
          </div>

          <div className="reveal-right">
            <div className="expect-wrap">
              <div className="expect-title">What to expect<br /><em>after you submit.</em></div>
              <div className="expect-steps">
                {[
                  {n:'01',t:'Your request arrives',b:"Varad reviews your message, your session type, and what you've shared. Every request is read personally."},
                  {n:'02',t:'Confirmation within 2 days',b:'You receive an email confirming your appointment date, time, and session details. Payment link included.'},
                  {n:'03',t:'Share your birth details',b:'Date, time and place of birth are collected privately before your session — used only for your chart.'},
                  {n:'04',t:'Your consultation',b:'A focused, personal session. Your chart read. Your Moon understood. Your remedy path laid out clearly.'},
                  {n:'05',t:'Your remedy document',b:'After the session, a written summary of your chart findings and personalised remedy protocol — yours to keep.'},
                ].map((s,i)=>(
                  <div className="estep" key={i}>
                    <div className="estep-num">{s.n}</div>
                    <div className="estep-content">
                      <div className="estep-title">{s.t}</div>
                      <div className="estep-body">{s.b}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="trust-note">
                <span className="tn-label">A note on privacy</span>
                <div className="tn-text">Your birth data and everything you share in consultation is completely private. It is used only to read your chart. It is never stored on SATTVA's platform, never shared, never sold.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="foot-inner">
          <div className="foot-brand">SATTVA <span>Heals</span></div>
          <div className="foot-copy">© 2026 SATTVA HEALS · sattvaheals.in</div>
        </div>
      </footer>
    </>
  );
}