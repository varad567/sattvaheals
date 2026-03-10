import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";

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
  body::after {
    content:''; position:fixed; inset:0;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events:none; z-index:998; opacity:0.4;
  }

  .cursor { width:8px; height:8px; background:var(--moon); border-radius:50%; position:fixed; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); transition:left 0.06s,top 0.06s; }
  .cursor-ring { width:28px; height:28px; border:1px solid rgba(168,204,224,0.3); border-radius:50%; position:fixed; pointer-events:none; z-index:9998; transform:translate(-50%,-50%); transition:left 0.14s ease-out,top 0.14s ease-out; }

  .onb-wrap { min-height:100vh; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; padding:80px 24px 96px; }

  /* Progress bar */
  .onb-progress-track {
    position:fixed; top:0; left:0; right:0; height:3px;
    background:rgba(168,204,224,0.08);
    z-index:110;
  }
  .onb-progress-bar {
    height:100%;
    background:var(--moon);
    width:0%;
    transition:width 0.4s ease;
  }

  .onb-card {
    position:relative;
    max-width:680px;
    width:100%;
    background:rgba(13,31,53,0.85);
    border:1px solid rgba(168,204,224,0.08);
    padding:40px 32px 48px;
    z-index:10;
    overflow:hidden;
  }

  .onb-label {
    font-size:11px;
    letter-spacing:2.5px;
    text-transform:uppercase;
    color:var(--pearl-dim);
    margin-bottom:12px;
  }

  .onb-heading {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(32px,4vw,44px);
    font-weight:600;
    color:var(--pearl);
    line-height:1.15;
    margin-bottom:16px;
  }
  .onb-heading em { color:var(--gold); font-style:italic; }

  .onb-sub {
    font-size:16px;
    line-height:1.8;
    color:var(--pearl-dim);
    margin-bottom:24px;
  }

  .onb-options {
    display:flex;
    flex-direction:column;
    gap:12px;
    margin-top:16px;
  }

  .onb-option {
    border:1px solid rgba(17,40,64,0.9);
    background:rgba(6,14,26,0.7);
    padding:18px 20px;
    border-radius:12px;
    cursor:pointer;
    transition:all 0.25s ease;
    font-size:14px;
    color:var(--pearl-dim);
  }
  .onb-option:hover {
    border-color:var(--moon-dim);
    background:rgba(17,40,64,0.85);
  }
  .onb-option.selected {
    border-color:var(--moon);
    background:rgba(168,204,224,0.08);
    color:var(--pearl);
  }
  .onb-option-danger {
    border-color:rgba(224,112,112,0.4);
  }
  .onb-option-danger:hover,
  .onb-option-danger.selected {
    border-color:var(--error);
    background:rgba(224,112,112,0.08);
    color:#F9D1D1;
  }

  .onb-grid-2 {
    display:grid;
    grid-template-columns:repeat(2,minmax(0,1fr));
    gap:16px;
    margin-top:20px;
  }

  .onb-concern-card {
    border:1px solid rgba(17,40,64,0.9);
    background:rgba(6,14,26,0.7);
    border-radius:16px;
    padding:24px 18px 22px;
    text-align:center;
    cursor:pointer;
    transition:all 0.3s ease;
  }
  .onb-concern-card:hover {
    border-color:var(--moon-dim);
    background:rgba(17,40,64,0.8);
  }
  .onb-concern-card.selected {
    border-color:var(--gold);
    background:rgba(226,194,125,0.07);
  }
  .onb-concern-name {
    font-family:'Cormorant Garamond',serif;
    font-size:24px;
    color:var(--pearl);
  }
  .onb-concern-sanskrit {
    font-family:'Noto Serif Devanagari',serif;
    font-size:14px;
    color:var(--moon-dim);
    margin-top:4px;
  }
  .onb-concern-tag {
    font-size:13px;
    color:var(--pearl-dim);
    margin-top:8px;
  }

  .onb-dosha-name {
    font-family:'Cormorant Garamond',serif;
    font-size:48px;
    font-weight:600;
    color:var(--gold);
    line-height:1.1;
  }
  .onb-dosha-sanskrit {
    font-family:'Noto Serif Devanagari',serif;
    font-size:20px;
    color:var(--moon-dim);
    margin-top:4px;
  }
  .onb-dosha-text {
    margin-top:18px;
    font-size:15px;
    line-height:1.9;
    color:var(--pearl-dim);
  }

  .onb-divider {
    margin:28px 0 16px;
    height:1px;
    background:linear-gradient(90deg,transparent,rgba(168,204,224,0.4),transparent);
  }

  .onb-body-small {
    font-size:14px;
    color:var(--pearl-dim);
    line-height:1.8;
    margin-bottom:4px;
  }
  .onb-body-strong {
    font-size:14px;
    color:var(--pearl);
    line-height:1.8;
    margin-top:4px;
  }

  .onb-section-label {
    font-size:11px;
    letter-spacing:3px;
    text-transform:uppercase;
    color:var(--moon-dim);
    margin-bottom:8px;
  }

  .onb-proto-heading {
    font-family:'Cormorant Garamond',serif;
    font-size:28px;
    color:var(--gold);
    margin-bottom:4px;
  }

  .onb-mantra-translit {
    font-family:'Noto Serif Devanagari',serif;
    font-size:16px;
    color:var(--pearl-dim);
    margin-bottom:10px;
  }
  .onb-mantra-meaning {
    font-size:15px;
    color:var(--pearl);
    line-height:1.8;
    margin-bottom:10px;
  }
  .onb-mantra-meta {
    font-size:13px;
    color:var(--moon-dim);
  }

  .onb-list {
    list-style:none;
    margin:6px 0 10px;
    padding:0;
  }
  .onb-list-item {
    display:flex;
    gap:8px;
    font-size:13px;
    color:var(--pearl-dim);
    line-height:1.6;
  }
  .onb-bullet-green {
    width:5px; height:5px; border-radius:50%; background:#6ECBA0; margin-top:7px; flex-shrink:0;
  }
  .onb-bullet-red {
    width:5px; height:5px; border-radius:50%; background:var(--error); margin-top:7px; flex-shrink:0;
  }

  .onb-dina-row {
    display:flex;
    gap:10px;
    align-items:flex-start;
    font-size:13px;
    color:var(--pearl-dim);
    margin-bottom:6px;
  }
  .onb-dina-icon {
    width:18px;
  }

  .onb-disclaimer {
    margin-top:18px;
    font-size:11px;
    color:rgba(139,175,196,0.7);
    font-style:italic;
    line-height:1.6;
  }

  .onb-actions {
    margin-top:28px;
    display:flex;
    gap:12px;
    flex-wrap:wrap;
    justify-content:center;
  }
  .onb-btn-primary {
    background:linear-gradient(135deg,rgba(168,204,224,0.18),rgba(168,204,224,0.06));
    border:1px solid rgba(168,204,224,0.3);
    color:var(--pearl);
    padding:14px 32px;
    font-family:'Outfit',sans-serif;
    font-size:12px;
    font-weight:500;
    letter-spacing:2.5px;
    text-transform:uppercase;
    cursor:pointer;
    border-radius:1px;
    transition:all 0.3s;
  }
  .onb-btn-primary:hover {
    border-color:var(--moon);
    color:var(--moon);
  }
  .onb-btn-secondary {
    background:transparent;
    border:1px solid rgba(168,204,224,0.15);
    color:var(--pearl-dim);
    padding:12px 24px;
    font-family:'Outfit',sans-serif;
    font-size:11px;
    letter-spacing:2px;
    text-transform:uppercase;
    cursor:pointer;
    border-radius:1px;
    transition:all 0.3s;
  }
  .onb-btn-secondary:hover {
    border-color:var(--moon-dim);
    color:var(--moon);
  }

  .onb-btn-primary[disabled] {
    opacity:0.5;
    cursor:not-allowed;
  }

  .onb-save-error {
    margin-top:10px;
    font-size:12px;
    color:var(--error);
    text-align:center;
  }

  .onb-back {
    position:fixed;
    bottom:28px;
    left:24px;
    font-size:12px;
    letter-spacing:2px;
    text-transform:uppercase;
    color:var(--pearl-dim);
    background:none;
    border:none;
    cursor:pointer;
    z-index:120;
  }
  .onb-back:hover { color:var(--moon); }

  /* Animations */
  .onb-step {
    opacity:0;
    transform:translateY(12px);
    transition:opacity 0.35s ease, transform 0.35s ease;
  }
  .onb-step.active {
    opacity:1;
    transform:translateY(0);
  }

  /* Crisis screen */
  .onb-crisis-wrap {
    min-height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:80px 24px;
  }
  .onb-crisis-card {
    max-width:720px;
    width:100%;
    background:rgba(6,14,26,0.9);
    border:1px solid rgba(224,112,112,0.35);
    padding:40px 32px 32px;
  }
  .onb-crisis-heading {
    font-family:'Cormorant Garamond',serif;
    font-size:40px;
    color:var(--pearl);
    margin-bottom:8px;
  }
  .onb-crisis-sub {
    font-size:16px;
    color:var(--pearl-dim);
    margin-bottom:24px;
  }
  .onb-crisis-grid {
    display:grid;
    grid-template-columns:repeat(2,minmax(0,1fr));
    gap:16px;
    margin-bottom:28px;
  }
  .onb-crisis-card-item {
    background:rgba(13,31,53,0.8);
    border:1px solid rgba(168,204,224,0.15);
    padding:18px 18px 16px;
  }
  .onb-crisis-name {
    font-family:'Cormorant Garamond',serif;
    font-size:18px;
    color:var(--pearl);
    margin-bottom:4px;
  }
  .onb-crisis-num {
    font-size:16px;
    color:var(--moon);
    margin-bottom:4px;
  }
  .onb-crisis-hours {
    font-size:12px;
    color:var(--pearl-dim);
    margin-bottom:10px;
  }
  .onb-crisis-btn {
    font-size:11px;
    letter-spacing:2px;
    text-transform:uppercase;
    padding:8px 14px;
    border-radius:999px;
    border:1px solid rgba(168,204,224,0.3);
    background:transparent;
    color:var(--pearl);
    cursor:pointer;
    transition:all 0.3s;
  }
  .onb-crisis-btn:hover {
    border-color:var(--moon);
    color:var(--moon);
  }
  .onb-crisis-safe {
    margin-top:8px;
    font-size:12px;
    color:var(--pearl-dim);
    text-align:center;
  }

  @media(max-width:720px){
    .onb-card { padding:32px 20px 40px; }
    .onb-grid-2 { grid-template-columns:1fr; }
    .onb-crisis-grid { grid-template-columns:1fr; }
    .onb-back { bottom:18px; left:16px; }
  }
`;

function StarField(){
  const ref = useRef(null);
  useEffect(()=>{
    const canvas = ref.current; if(!canvas) return;
    let ctx; try { ctx = canvas.getContext('2d'); } catch(e){ return; }
    if(!ctx) return;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    const stars = Array.from({length:70},()=>({
      x:Math.random()*W,
      y:Math.random()*H,
      r:Math.random()*1.1+0.2,
      dx:(Math.random()-0.5)*0.08,
      dy:-Math.random()*0.12-0.03,
      o:Math.random()*0.4+0.1,
      ts:Math.random()*0.015+0.004,
      to:Math.random()*Math.PI*2,
    }));
    let frame = 0, id;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      frame++;
      stars.forEach(s=>{
        const tw = Math.sin(frame*s.ts+s.to)*0.3+0.7;
        ctx.beginPath();
        ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle = `rgba(168,204,224,${s.o*tw})`;
        ctx.fill();
        s.x += s.dx; s.y += s.dy;
        if(s.y < -5){ s.y = H+5; s.x = Math.random()*W; }
        if(s.x < -5) s.x = W+5;
        if(s.x > W+5) s.x = -5;
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return ()=>{ cancelAnimationFrame(id); window.removeEventListener('resize', onResize); };
  },[]);
  return <canvas ref={ref} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1,opacity:0.6}} />;
}

function Cursor(){
  const dot = useRef(null), ring = useRef(null);
  useEffect(()=>{
    const mv = e => {
      if(dot.current){ dot.current.style.left = e.clientX+'px'; dot.current.style.top = e.clientY+'px'; }
      if(ring.current){ ring.current.style.left = e.clientX+'px'; ring.current.style.top = e.clientY+'px'; }
    };
    window.addEventListener('mousemove', mv);
    return ()=>window.removeEventListener('mousemove', mv);
  },[]);
  return (<><div className="cursor" ref={dot}/><div className="cursor-ring" ref={ring}/></>);
}

function computePrakriti(answers){
  let v=0,p=0,k=0;
  Object.values(answers).forEach(a=>{
    if(a==='vata') v++;
    if(a==='pitta') p++;
    if(a==='kapha') k++;
  });
  const max = Math.max(v,p,k);
  if(Math.max(v,p,k)-Math.min(v,p,k) <= 1) return 'vata';
  if(v===max && p>=max-1 && v!==p) return 'vata-pitta';
  if(v===max && k>=max-1 && v!==k) return 'vata-kapha';
  if(p===max && k>=max-1 && p!==k) return 'pitta-kapha';
  if(p===max && v>=max-1 && p!==v) return 'pitta-vata';
  if(k===max && v>=max-1 && k!==v) return 'kapha-vata';
  if(k===max && p>=max-1 && k!==p) return 'kapha-pitta';
  if(v===max) return 'vata';
  if(p===max) return 'pitta';
  return 'kapha';
}

const prakritiProfiles = {
  vata: {
    name:'VATA',
    sk:'वात',
    text:"Your mind is primarily Vata — quick, imaginative, and deeply sensitive. When in balance, you see connections others miss and feel life intensely. When disturbed, the mind moves faster than it can rest."
  },
  pitta: {
    name:'PITTA',
    sk:'पित्त',
    text:"Your mind is primarily Pitta — sharp, purposeful, and driven. When in balance, you are the person who gets things done and leads with clarity. When disturbed, the mind turns that same sharpness inward."
  },
  kapha: {
    name:'KAPHA',
    sk:'कफ',
    text:"Your mind is primarily Kapha — steady, loyal, and deep. When in balance, you are the calm that others lean on. When disturbed, the mind grows heavy, slow, and hard to lift."
  },
  'vata-pitta': {
    name:'VATA-PITTA',
    sk:'वात-पित्त',
    text:"Your mind is Vata-Pitta — it moves fast and runs hot. Creative and driven, brilliant and intense. When balanced, unstoppable. When disturbed, anxious and sharp at the same time."
  },
  'vata-kapha': {
    name:'VATA-KAPHA',
    sk:'वात-कफ',
    text:"Your mind is Vata-Kapha — it oscillates. Some days racing, some days withdrawn. The challenge is finding the middle. When you do, you are one of the most resilient minds there is."
  },
  'pitta-kapha': {
    name:'PITTA-KAPHA',
    sk:'पित्त-कफ',
    text:"Your mind is Pitta-Kapha — steady and strong, but it carries weight. You hold things in, push through, and often forget to put things down. Your healing is about release, not effort."
  },
  'pitta-vata': {
    name:'PITTA-VATA',
    sk:'पित्त-वात',
    text:"Your mind is Pitta-Vata — driven and restless in equal measure. You set high standards and worry about meeting them. Your strength is also your source of suffering when out of balance."
  },
  'kapha-vata': {
    name:'KAPHA-VATA',
    sk:'कफ-वात',
    text:"Your mind is Kapha-Vata — deep and sensitive. You feel things profoundly and take time to process. Your healing comes through gentle, consistent practice — never through force."
  },
  'kapha-pitta': {
    name:'KAPHA-PITTA',
    sk:'कफ-पित्त',
    text:"Your mind is KAPHA-PITTA — grounded but intense underneath. Calm on the surface, deeply feeling below it. Your healing comes from honest expression, not quiet endurance."
  },
};

const concernMeta = {
  anxiety: { iks:"Chinta — the restless mind" },
  aggression: { iks:"Krodha — the fire that burns before it warms" },
  overthinking: { iks:"Chitta Vritti — the mind that will not be quiet" },
  stress: { iks:"Manastapa — running out of yourself" },
  lowmood: { iks:"Vishada — the light gone quiet inside" },
  fear: { iks:"Bhaya — worry that lives deeper than thought" },
};

const durationCopy = {
  recent:"You have been carrying this recently. A gentle beginning is the right one.",
  months:"You have been carrying this for some time now. That is long enough.",
  lifelong:"This is deep in your pattern. And patterns can shift.",
};

const priorCopy = {
  therapy:"Sattva works beautifully alongside professional support.",
  nothing:"You are starting fresh — that is the best place to begin.",
  meditation:"You already know stillness. Now let us go deeper.",
  other:"You have already been seeking. Sattva honours that.",
};

const protocols = { /* full protocols object omitted for brevity in summary */ };

export default function Onboarding(){
  const [step,setStep] = useState(0);
  const [animKey,setAnimKey] = useState(0);
  const [safetyAnswer,setSafetyAnswer] = useState(null);
  const [prakritiAnswers,setPrakritiAnswers] = useState({});
  const [prakriti,setPrakriti] = useState(null);
  const [concern,setConcern] = useState(null);
  const [duration,setDuration] = useState(null);
  const [priorExperience,setPriorExperience] = useState(null);
  const [saveError,setSaveError] = useState('');
  const [saving,setSaving] = useState(false);
  const [saved,setSaved] = useState(false);
  const navigate = useNavigate();

  const totalSteps = 13;
  const baseForProgress = Math.min(step, totalSteps);
  const progress = Math.max(0, Math.min(100, (baseForProgress/totalSteps)*100));

  useEffect(()=>{ setAnimKey(k=>k+1); },[step]);

  const primaryDosha = (p) => {
    if(!p) return 'vata';
    return p.split('-')[0];
  };

  const getProtocol = () => {
    const prim = primaryDosha(prakriti);
    const prot = protocols[concern]?.[prim];
    return prot || null;
  };

  const goNext = () => {
    if(step===0){
      if(!safetyAnswer) return;
      if(safetyAnswer==='d'){ setStep(100); return; }
      setStep(1); return;
    }
    if(step>=1 && step<=8){
      if(step>=2 && step<=8){
        const qKey = `q${step-1}`;
        if(!prakritiAnswers[qKey]) return;
      }
    }
    if(step===8){
      const p = computePrakriti(prakritiAnswers);
      setPrakriti(p);
      setStep(9);
      return;
    }
    if(step===9){
      setStep(10); return;
    }
    if(step===10){
      if(!concern) return;
      setStep(11); return;
    }
    if(step===11){
      if(!duration) return;
      setStep(12); return;
    }
    if(step===12){
      if(!priorExperience) return;
      setStep(13); return;
    }
  };

  const goBack = () => {
    if(step<=1 || step>=13) return;
    if(step===100){
      setSafetyAnswer(null);
      setStep(0);
      return;
    }
    setStep(s=>Math.max(0,s-1));
  };

  const resetAll = () => {
    setSafetyAnswer(null);
    setPrakritiAnswers({});
    setPrakriti(null);
    setConcern(null);
    setDuration(null);
    setPriorExperience(null);
    setSaveError('');
    setSaving(false);
    setSaved(false);
    setStep(0);
  };

  const handleSave = async () => {
    if(saving) return;
    setSaving(true);
    setSaveError('');
    try{
      const { data:{ session } } = await supabase.auth.getSession();
      if(!session){
        navigate('/login?redirect=/onboarding&saved=pending');
        return;
      }
      const protocol = getProtocol();
      let protocolMantra = protocol?.mantra?.name || null;
      const { error } = await supabase
        .from('assessment_results')
        .upsert({
          user_id: session.user.id,
          prakriti,
          concern,
          duration,
          prior_experience: priorExperience,
          safety_answer: safetyAnswer,
          protocol_mantra: protocolMantra,
          raw_answers: JSON.stringify({ prakritiAnswers, concern, duration, priorExperience }),
          created_at: new Date().toISOString(),
        }, { onConflict:'user_id' });
      if(error){
        console.error('Assessment save error:',error);
        setSaveError('We could not save this to your account right now. You can still take a screenshot or return here later.');
      }else{
        setSaved(true);
        setTimeout(()=>{ navigate('/'); },1500);
      }
    }catch(e){
      console.error(e);
      setSaveError('Something went wrong while saving. Please try again.');
    }finally{
      setSaving(false);
    }
  };

  const renderStep = () => {
    if(step===100){
      return (
        <div className="onb-crisis-wrap">
          <div className="onb-crisis-card onb-step active" key={animKey}>
            <div className="onb-crisis-heading">You are not alone.</div>
            <div className="onb-crisis-sub">Help is available right now.</div>
            <div className="onb-crisis-grid">
              <div className="onb-crisis-card-item">
                <div className="onb-crisis-name">iCall — TISS</div>
                <div className="onb-crisis-num">9152987821</div>
                <div className="onb-crisis-hours">Monday to Saturday, 8am to 10pm</div>
                <button className="onb-crisis-btn" onClick={()=>window.location.href='tel:9152987821'}>Call Now</button>
              </div>
              <div className="onb-crisis-card-item">
                <div className="onb-crisis-name">Vandrevala Foundation</div>
                <div className="onb-crisis-num">1860-2662-345</div>
                <div className="onb-crisis-hours">24 hours, 7 days</div>
                <button className="onb-crisis-btn" onClick={()=>window.location.href='tel:18602662345'}>Call Now</button>
              </div>
              <div className="onb-crisis-card-item">
                <div className="onb-crisis-name">NIMHANS</div>
                <div className="onb-crisis-num">080-46110007</div>
                <div className="onb-crisis-hours">24 hours</div>
                <button className="onb-crisis-btn" onClick={()=>window.location.href='tel:08046110007'}>Call Now</button>
              </div>
              <div className="onb-crisis-card-item">
                <div className="onb-crisis-name">iCall Chat Support</div>
                <div className="onb-crisis-num">icallhelpline.org</div>
                <div className="onb-crisis-hours">Chat support</div>
                <button className="onb-crisis-btn" onClick={()=>window.open('https://icallhelpline.org','_blank')}>Open Chat</button>
              </div>
            </div>
            <div className="onb-actions">
              <button className="onb-btn-secondary" onClick={resetAll}>I am safe — take me back to Sattva</button>
            </div>
            <div className="onb-crisis-safe">This page is for resources only. SATTVA is not an emergency service.</div>
          </div>
        </div>
      );
    }

    return (
      <div className="onb-wrap">
        <div className="onb-card onb-step active" key={animKey}>
          {step===0 && (
            <>
              <div className="onb-heading">Before we begin</div>
              <div className="onb-sub">How are you feeling right now?</div>
              <div className="onb-options">
                {[
                  { id:'a', text:'I am going through a difficult time and looking for support' },
                  { id:'b', text:'I am okay but want to feel better than I do' },
                  { id:'c', text:'I am generally well and want to grow and deepen my practice' },
                  { id:'d', text:'I am in crisis right now and need immediate help', danger:true },
                ].map(opt=>(
                  <button
                    key={opt.id}
                    type="button"
                    className={`onb-option ${opt.danger?'onb-option-danger':''} ${safetyAnswer===opt.id?'selected':''}`}
                    onClick={()=>setSafetyAnswer(opt.id)}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
              {(safetyAnswer==='a' || safetyAnswer==='b' || safetyAnswer==='c') && (
                <div className="onb-actions" style={{marginTop:28}}>
                  <button className="onb-btn-primary" onClick={goNext}>Continue</button>
                </div>
              )}
            </>
          )}

          {step===1 && (
            <>
              <div className="onb-label">Stage 1 of 2</div>
              <div className="onb-heading">Understanding your mind</div>
              <div className="onb-sub">
                Help us understand how your mind naturally works. There are no right or wrong answers — just honest ones.
                Choose the option that feels most like you, most of the time.
              </div>
              <div className="onb-actions">
                <button className="onb-btn-primary" onClick={goNext}>Begin</button>
              </div>
            </>
          )}

          {step>=2 && step<=8 && (
            <>
              <div className="onb-label">Stage 1 of 2</div>
              <div className="onb-heading">
                {step===2 && "When something goes wrong, your mind:"}
                {step===3 && "Your sleep is usually:"}
                {step===4 && "Under pressure, your body feels:"}
                {step===5 && "Your energy through the day is:"}
                {step===6 && "When you have nothing to do, your mind:"}
                {step===7 && "You make decisions:"}
                {step===8 && "You feel truly good when:"}
              </div>
              <div className="onb-options">
                {[
                  step===2 && [
                    { id:'a', text:'Spirals and imagines worst cases', val:'vata' },
                    { id:'b', text:'Gets sharp and wants to fix it immediately', val:'pitta' },
                    { id:'c', text:'Goes quiet and withdraws slowly', val:'kapha' },
                  ],
                  step===3 && [
                    { id:'a', text:'Light and broken — my mind races at night', val:'vata' },
                    { id:'b', text:'Fine to fall asleep but I wake up restless', val:'pitta' },
                    { id:'c', text:'Deep and heavy — hard to wake up', val:'kapha' },
                  ],
                  step===4 && [
                    { id:'a', text:'Tight chest, dry mouth, butterflies', val:'vata' },
                    { id:'b', text:'Heat, flushed face, jaw tension', val:'pitta' },
                    { id:'c', text:'Heavy, slow, foggy, unmotivated', val:'kapha' },
                  ],
                  step===5 && [
                    { id:'a', text:'Bursts and crashes — high then suddenly empty', val:'vata' },
                    { id:'b', text:'Strong and sustained until I burn out', val:'pitta' },
                    { id:'c', text:'Slow to start, steady once going', val:'kapha' },
                  ],
                  step===6 && [
                    { id:'a', text:'Jumps between thoughts, plans, and worries', val:'vata' },
                    { id:'b', text:'Finds a problem to solve or something to improve', val:'pitta' },
                    { id:'c', text:'Drifts into daydreams or goes pleasantly blank', val:'kapha' },
                  ],
                  step===7 && [
                    { id:'a', text:'With difficulty — too many options overwhelm me', val:'vata' },
                    { id:'b', text:'Quickly and confidently — I trust my judgment', val:'pitta' },
                    { id:'c', text:'Very slowly — I need time before I commit', val:'kapha' },
                  ],
                  step===8 && [
                    { id:'a', text:'You feel free, inspired, and creative', val:'vata' },
                    { id:'b', text:'You feel accomplished, purposeful, and in control', val:'pitta' },
                    { id:'c', text:'You feel safe, loved, and stable', val:'kapha' },
                  ],
                ].find(Boolean).map(opt=>{
                  const qKey = `q${step-1}`;
                  const current = prakritiAnswers[qKey];
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`onb-option ${current===opt.val?'selected':''}`}
                      onClick={()=>setPrakritiAnswers(prev=>({...prev,[qKey]:opt.val}))}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
              <div className="onb-actions" style={{marginTop:24}}>
                <button className="onb-btn-primary" onClick={goNext}>Continue</button>
              </div>
            </>
          )}

          {step===9 && prakriti && (
            <>
              <div className="onb-label">Stage 1 of 2</div>
              <div className="onb-dosha-name">{prakritiProfiles[prakriti]?.name}</div>
              <div className="onb-dosha-sanskrit">{prakritiProfiles[prakriti]?.sk}</div>
              <div className="onb-dosha-text">{prakritiProfiles[prakriti]?.text}</div>
              <div className="onb-actions">
                <button className="onb-btn-primary" onClick={goNext}>Continue to your concerns →</button>
              </div>
            </>
          )}

          {step===10 && (
            <>
              <div className="onb-label">Stage 2 of 2</div>
              <div className="onb-heading">What are you carrying?</div>
              <div className="onb-sub">
                Now tell us what you are carrying. Choose what resonates most honestly — this shapes everything we show you next.
              </div>
              <div className="onb-actions">
                <button className="onb-btn-primary" onClick={goNext}>Continue</button>
              </div>
            </>
          )}

          {step===11 && (
            <>
              <div className="onb-heading">What brings you to Sattva today?</div>
              <div className="onb-grid-2">
                {[
                  { id:'anxiety', name:'Anxiety', sk:'चिन्ता', tag:'A restlessness I cannot explain' },
                  { id:'aggression', name:'Aggression', sk:'क्रोध', tag:'A sharpness that comes too fast' },
                  { id:'overthinking', name:'Overthinking', sk:'चित्त वृत्ति', tag:'A mind that will not be quiet' },
                  { id:'stress', name:'Stress', sk:'मनस्ताप', tag:'Too much. Too fast. Running out of myself.' },
                  { id:'lowmood', name:'Low Mood', sk:'विषाद', tag:'Heavy, empty, no motivation' },
                  { id:'fear', name:'Fear', sk:'भय', tag:'A worry that lives deeper than thought' },
                ].map(c=>(
                  <div
                    key={c.id}
                    className={`onb-concern-card ${concern===c.id?'selected':''}`}
                    onClick={()=>setConcern(c.id)}
                  >
                    <div className="onb-concern-name">{c.name}</div>
                    <div className="onb-concern-sanskrit">{c.sk}</div>
                    <div className="onb-concern-tag">{c.tag}</div>
                  </div>
                ))}
              </div>
              {concern && (
                <div className="onb-actions">
                  <button className="onb-btn-primary" onClick={goNext}>Continue</button>
                </div>
              )}
            </>
          )}

          {step===12 && (
            <>
              <div className="onb-heading">How long have you been feeling this?</div>
              <div className="onb-options">
                {[
                  { id:'recent', text:'Just recently — days or weeks' },
                  { id:'months', text:'A few months now' },
                  { id:'lifelong', text:'Most of my life, if I am honest' },
                ].map(opt=>(
                  <button
                    key={opt.id}
                    type="button"
                    className={`onb-option ${duration===opt.id?'selected':''}`}
                    onClick={()=>setDuration(opt.id)}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
              {duration && (
                <div className="onb-actions">
                  <button className="onb-btn-primary" onClick={goNext}>Continue</button>
                </div>
              )}
            </>
          )}

          {step===13 && (
            <>
              <div className="onb-heading">What have you tried before?</div>
              <div className="onb-options">
                {[
                  { id:'nothing', text:'Nothing yet — this is new for me' },
                  { id:'meditation', text:'Meditation or breathing exercises' },
                  { id:'therapy', text:'Therapy or counselling' },
                  { id:'other', text:'Other wellness or spiritual practices' },
                ].map(opt=>(
                  <button
                    key={opt.id}
                    type="button"
                    className={`onb-option ${priorExperience===opt.id?'selected':''}`}
                    onClick={()=>setPriorExperience(opt.id)}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
              {priorExperience && (
                <div className="onb-actions">
                  <button className="onb-btn-primary" onClick={goNext}>Show me my results →</button>
                </div>
              )}
            </>
          )}

          {step===14 && (
            <>
              {/* This step index reserved if you choose to further split results; currently unused */}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{FONTS+css}</style>
      <Cursor/>
      <StarField/>
      {step!==0 && step!==100 && step<13 && (
        <div className="onb-progress-track">
          <div className="onb-progress-bar" style={{width:`${progress}%`}}/>
        </div>
      )}
      {step>1 && step<13 && step!==100 && (
        <button className="onb-back" onClick={goBack}>← Back</button>
      )}
      {renderStep()}
    </>
  );
}

