import { useState, useEffect, useRef } from "react";
import { Helmet } from 'react-helmet-async';

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

  .hero { padding:140px 72px 100px; text-align:center; position:relative; overflow:hidden; }
  .hero::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 50% 0%, rgba(168,204,224,0.05) 0%, transparent 55%); pointer-events:none; }
  .eyebrow { display:inline-flex; align-items:center; gap:12px; margin-bottom:20px; }
  .ey-line { width:32px; height:1px; background:var(--gold-dim); }
  .ey-text { font-size:10px; letter-spacing:4px; color:var(--gold); text-transform:uppercase; font-weight:500; }
  .hero-title { font-family:'Cormorant Garamond',serif; font-size:clamp(44px,6vw,80px); font-weight:600; line-height:1.1; color:var(--pearl); margin-bottom:20px; animation:fadeUp 0.9s ease both; }
  .hero-title em { font-style:italic; color:var(--gold); }
  .hero-sub { font-size:17px; line-height:1.85; color:var(--pearl-dim); max-width:560px; margin:0 auto 72px; animation:fadeUp 0.9s 0.15s ease both; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

  .stepper-wrap { max-width:1000px; margin:0 auto; animation:fadeUp 0.9s 0.25s ease both; }
  .stepper-tabs { display:grid; grid-template-columns:repeat(4,1fr); gap:2px; margin-bottom:2px; }
  .step-tab { padding:22px 18px; background:rgba(13,31,53,0.5); border:1px solid rgba(168,204,224,0.06); cursor:none; transition:all 0.4s; text-align:left; border-bottom:2px solid transparent; }
  .step-tab:hover { background:rgba(17,40,64,0.7); }
  .step-tab.active { background:rgba(17,40,64,0.9); border-bottom-color:var(--gold); }
  .st-num { font-size:10px; letter-spacing:3px; color:var(--moon-dim); text-transform:uppercase; margin-bottom:6px; display:block; }
  .st-name { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600; color:var(--pearl); }
  .step-content { background:rgba(13,31,53,0.4); border:1px solid rgba(168,204,224,0.06); padding:56px 64px; display:grid; grid-template-columns:1fr 1fr; gap:72px; align-items:center; min-height:300px; position:relative; overflow:hidden; }
  .step-content::after { content:attr(data-num); position:absolute; bottom:-20px; right:20px; font-family:'Cormorant Garamond',serif; font-size:200px; font-weight:700; color:rgba(168,204,224,0.025); line-height:1; pointer-events:none; }
  .sc-label { font-size:10px; letter-spacing:4px; color:var(--gold); text-transform:uppercase; margin-bottom:14px; display:block; }
  .sc-title { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:600; color:var(--pearl); margin-bottom:16px; line-height:1.2; }
  .sc-title em { font-style:italic; color:var(--moon); }
  .sc-body { font-size:15px; line-height:1.9; color:var(--pearl-dim); }
  .sc-points { display:flex; flex-direction:column; gap:10px; }
  .sc-point { display:flex; gap:12px; padding:14px 16px; background:rgba(6,14,26,0.4); border:1px solid rgba(168,204,224,0.05); transition:all 0.3s; }
  .sc-point:hover { border-color:rgba(168,204,224,0.12); background:rgba(17,40,64,0.5); }
  .sc-dot { width:5px; height:5px; border-radius:50%; background:var(--gold); flex-shrink:0; margin-top:7px; }
  .sc-pt { font-size:13px; line-height:1.7; color:var(--pearl-dim); }
  .sc-pt strong { color:var(--pearl); font-weight:500; display:block; margin-bottom:2px; }
  .step-nav { display:flex; justify-content:space-between; align-items:center; margin-top:20px; }
  .snav-btn { background:transparent; border:1px solid rgba(168,204,224,0.12); color:var(--pearl-dim); padding:10px 24px; font-family:'Outfit',sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; cursor:none; transition:all 0.3s; border-radius:1px; }
  .snav-btn:hover { border-color:var(--moon); color:var(--moon); }
  .snav-btn:disabled { opacity:0.2; }
  .step-dots { display:flex; gap:8px; }
  .sdot { width:6px; height:6px; border-radius:50%; background:rgba(168,204,224,0.2); transition:all 0.3s; cursor:none; border:none; }
  .sdot.active { background:var(--gold); width:20px; border-radius:3px; }

  .arch { width:100%; overflow:hidden; line-height:0; display:block; }
  .arch svg { display:block; width:100%; }

  .pillars-section { padding:120px 72px; background:var(--deep); position:relative; }
  .pillars-section::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 50% 0%, rgba(168,204,224,0.04) 0%, transparent 55%); pointer-events:none; }
  .pillars-inner { max-width:1200px; margin:0 auto; }
  .pillars-header { text-align:center; margin-bottom:100px; }
  .sec-title { font-family:'Cormorant Garamond',serif; font-size:clamp(36px,4.5vw,56px); font-weight:600; color:var(--pearl); line-height:1.15; }
  .sec-title em { font-style:italic; color:var(--gold); }
  .sec-sub { font-size:16px; line-height:1.85; color:var(--pearl-dim); max-width:520px; margin:16px auto 0; font-weight:300; }

  .pillar { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:start; padding:80px 0; border-bottom:1px solid rgba(168,204,224,0.05); }
  .pillar:last-child { border-bottom:none; }
  .pillar.reverse { direction:rtl; }
  .pillar.reverse > * { direction:ltr; }

  .pillar-art { background:rgba(6,14,26,0.7); border:1px solid rgba(168,204,224,0.07); padding:48px; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; min-height:380px; }
  .pillar-art-num { position:absolute; top:16px; right:20px; font-family:'Cormorant Garamond',serif; font-size:56px; font-weight:700; color:rgba(168,204,224,0.04); line-height:1; }
  .pillar-art-label { position:absolute; bottom:16px; left:20px; font-size:9px; letter-spacing:3px; color:var(--gold-dim); text-transform:uppercase; font-weight:500; }
  .pillar-art-sk { position:absolute; bottom:14px; right:16px; font-family:'Noto Serif Devanagari',serif; font-size:13px; color:rgba(168,204,224,0.2); }

  .pillar-content {}
  .pc-eyebrow { display:inline-flex; align-items:center; gap:10px; margin-bottom:16px; }
  .pc-ey-dot { width:5px; height:5px; border-radius:50%; background:var(--gold); }
  .pc-ey-text { font-size:10px; letter-spacing:3px; color:var(--gold); text-transform:uppercase; font-weight:500; }
  .pc-title { font-family:'Cormorant Garamond',serif; font-size:clamp(32px,3.5vw,48px); font-weight:600; color:var(--pearl); margin-bottom:6px; line-height:1.15; }
  .pc-subtitle { font-family:'Cormorant Garamond',serif; font-size:18px; font-style:italic; color:var(--moon); margin-bottom:22px; line-height:1.5; }
  .pc-body { font-size:15px; line-height:1.95; color:var(--pearl-dim); margin-bottom:28px; }
  .pc-body em { font-style:italic; color:var(--moon); font-family:'Cormorant Garamond',serif; font-size:17px; }
  .pc-body strong { color:var(--pearl); font-weight:500; }

  .science-badge { display:inline-flex; align-items:center; gap:8px; padding:6px 14px; background:rgba(168,204,224,0.05); border:1px solid rgba(168,204,224,0.12); margin-bottom:20px; }
  .sb-dot { width:5px; height:5px; border-radius:50%; background:var(--moon); animation:sbpulse 2s ease-in-out infinite; }
  @keyframes sbpulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .sb-text { font-size:10px; letter-spacing:2px; color:var(--moon-dim); text-transform:uppercase; font-weight:500; }

  .pc-points { display:flex; flex-direction:column; gap:10px; margin-bottom:24px; }
  .pc-point { display:flex; gap:12px; padding:13px 16px; background:rgba(6,14,26,0.35); border-left:2px solid var(--gold-dim); transition:all 0.3s; }
  .pc-point:hover { background:rgba(17,40,64,0.5); border-left-color:var(--gold); }
  .pc-pt { font-size:13px; line-height:1.7; color:var(--pearl-dim); }
  .pc-pt strong { color:var(--pearl); font-weight:500; display:block; font-size:13px; margin-bottom:2px; }

  .science-cite { padding:18px 22px; background:rgba(168,204,224,0.03); border:1px solid rgba(168,204,224,0.08); border-left:3px solid var(--moon-dim); margin-top:4px; }
  .sci-label { font-size:9px; letter-spacing:2px; color:var(--moon-dim); text-transform:uppercase; margin-bottom:7px; display:block; font-weight:500; }
  .sci-text { font-size:13px; line-height:1.75; color:var(--pearl-dim); font-style:italic; }
  .sci-source { font-size:10px; color:rgba(139,175,196,0.4); margin-top:6px; display:block; letter-spacing:0.5px; }

  .reveal { opacity:0; transform:translateY(32px); transition:opacity 1s cubic-bezier(0.16,1,0.3,1),transform 1s cubic-bezier(0.16,1,0.3,1); }
  .reveal.visible { opacity:1; transform:translateY(0); }
  .reveal-left { opacity:0; transform:translateX(-32px); transition:opacity 1s cubic-bezier(0.16,1,0.3,1),transform 1s cubic-bezier(0.16,1,0.3,1); }
  .reveal-left.visible { opacity:1; transform:translateX(0); }
  .reveal-right { opacity:0; transform:translateX(32px); transition:opacity 1s cubic-bezier(0.16,1,0.3,1),transform 1s cubic-bezier(0.16,1,0.3,1); }
  .reveal-right.visible { opacity:1; transform:translateX(0); }

  .cta-section { padding:120px 72px; background:var(--abyss); text-align:center; position:relative; overflow:hidden; }
  .cta-section::before { content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:600px; height:600px; border-radius:50%; background:radial-gradient(circle,rgba(168,204,224,0.04) 0%,transparent 70%); pointer-events:none; }
  .cta-inner { max-width:560px; margin:0 auto; position:relative; z-index:1; }
  .cta-title { font-family:'Cormorant Garamond',serif; font-size:clamp(36px,5vw,60px); font-weight:600; color:var(--pearl); line-height:1.1; margin-bottom:16px; }
  .cta-title em { font-style:italic; color:var(--gold); }
  .cta-body { font-size:16px; line-height:1.85; color:var(--pearl-dim); margin-bottom:40px; font-weight:300; }
  .btn-primary { background:linear-gradient(135deg,rgba(168,204,224,0.18),rgba(168,204,224,0.06)); border:1px solid rgba(168,204,224,0.3); color:var(--pearl); padding:16px 44px; font-family:'Outfit',sans-serif; font-size:12px; font-weight:500; letter-spacing:2.5px; text-transform:uppercase; cursor:none; transition:all 0.4s; border-radius:1px; }
  .btn-primary:hover { border-color:var(--moon); color:var(--moon); }

  footer { background:rgba(0,0,0,0.4); border-top:1px solid rgba(168,204,224,0.06); padding:0 72px; height:64px; display:flex; align-items:center; }
  .foot-inner { max-width:1200px; margin:0 auto; width:100%; display:flex; justify-content:space-between; align-items:center; }
  .foot-brand { font-family:'Cormorant Garamond',serif; font-size:16px; font-weight:600; color:var(--pearl); letter-spacing:4px; text-transform:uppercase; }
  .foot-brand span { color:var(--gold); font-style:italic; }
  .foot-copy { font-size:11px; color:rgba(139,175,196,0.3); }

  @media(max-width:960px){
    nav,footer{padding:0 24px;}
    .hero,.pillars-section,.cta-section{padding:100px 24px 80px;}
    .stepper-tabs{grid-template-columns:1fr 1fr;}
    .step-content{grid-template-columns:1fr;gap:32px;padding:32px 24px;}
    .pillar,.pillar.reverse{grid-template-columns:1fr;gap:36px;direction:ltr;}
    .cursor,.cursor-ring{display:none;}
    body{cursor:auto;}
  }
`;

// ── SVG ILLUSTRATIONS ──

const JyotishaSVG = () => (
  <svg width="260" height="260" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="140" cy="140" r="130" stroke="rgba(168,204,224,0.06)" strokeWidth="1" strokeDasharray="4 8"/>
    <circle cx="140" cy="140" r="108" stroke="rgba(168,204,224,0.04)" strokeWidth="1"/>
    {Array.from({length:12},(_,i)=>{
      const a=(i/12)*Math.PI*2-Math.PI/2;
      const x1=140+108*Math.cos(a),y1=140+108*Math.sin(a);
      const x2=140+130*Math.cos(a),y2=140+130*Math.sin(a);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(168,204,224,0.1)" strokeWidth="1"/>;
    })}
    {Array.from({length:27},(_,i)=>{
      const a=(i/27)*Math.PI*2-Math.PI/2;
      const x=140+126*Math.cos(a),y=140+126*Math.sin(a);
      return <circle key={i} cx={x} cy={y} r={i%9===0?2.5:1.2} fill={i%9===0?"#E2C27D":"#A8CCE0"} opacity={i%9===0?0.8:0.3}/>;
    })}
    <rect x="82" y="82" width="116" height="116" stroke="rgba(168,204,224,0.14)" strokeWidth="1" fill="none"/>
    <line x1="82" y1="140" x2="198" y2="140" stroke="rgba(168,204,224,0.07)" strokeWidth="1"/>
    <line x1="140" y1="82" x2="140" y2="198" stroke="rgba(168,204,224,0.07)" strokeWidth="1"/>
    <line x1="82" y1="82" x2="198" y2="198" stroke="rgba(168,204,224,0.05)" strokeWidth="1"/>
    <line x1="198" y1="82" x2="82" y2="198" stroke="rgba(168,204,224,0.05)" strokeWidth="1"/>
    <circle cx="140" cy="113" r="15" fill="rgba(168,204,224,0.08)" stroke="rgba(168,204,224,0.45)" strokeWidth="1.5"/>
    <circle cx="136" cy="110" r="9" fill="rgba(168,204,224,0.12)" stroke="rgba(168,204,224,0.15)" strokeWidth="0.5"/>
    {[[108,157,"#E2C27D",0.9],[168,107,"#A8CCE0",0.8],[174,163,"rgba(168,204,224,0.5)",1],[102,107,"rgba(226,194,125,0.6)",1]].map(([x,y,c,o],i)=>(
      <circle key={i} cx={x} cy={y} r="5" fill={c} opacity={o}/>
    ))}
    <line x1="140" y1="113" x2="108" y2="157" stroke="rgba(226,194,125,0.12)" strokeWidth="1" strokeDasharray="3 4"/>
    <line x1="140" y1="113" x2="168" y2="107" stroke="rgba(168,204,224,0.12)" strokeWidth="1" strokeDasharray="3 4"/>
    <circle cx="140" cy="140" r="28" fill="rgba(168,204,224,0.015)"/>
  </svg>
);

const AyurvedaSVG = () => (
  <svg width="260" height="260" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="140,36 248,216 32,216" stroke="rgba(168,204,224,0.09)" strokeWidth="1" fill="none"/>
    <polygon points="140,76 212,204 68,204" stroke="rgba(168,204,224,0.06)" strokeWidth="1" fill="none"/>
    <polygon points="140,108 188,196 92,196" stroke="rgba(168,204,224,0.04)" strokeWidth="1" fill="none"/>
    <circle cx="140" cy="44" r="22" fill="rgba(168,204,224,0.04)" stroke="rgba(168,204,224,0.22)" strokeWidth="1.5"/>
    <text x="140" y="40" textAnchor="middle" fontSize="10" fill="rgba(168,204,224,0.55)" fontFamily="'Noto Serif Devanagari',serif">वात</text>
    <text x="140" y="54" textAnchor="middle" fontSize="7" fill="rgba(168,204,224,0.3)" fontFamily="Outfit,sans-serif" letterSpacing="1.5">VATA</text>
    <circle cx="240" cy="218" r="22" fill="rgba(226,194,125,0.04)" stroke="rgba(226,194,125,0.22)" strokeWidth="1.5"/>
    <text x="240" y="214" textAnchor="middle" fontSize="10" fill="rgba(226,194,125,0.55)" fontFamily="'Noto Serif Devanagari',serif">पित्त</text>
    <text x="240" y="228" textAnchor="middle" fontSize="7" fill="rgba(226,194,125,0.3)" fontFamily="Outfit,sans-serif" letterSpacing="1.5">PITTA</text>
    <circle cx="40" cy="218" r="22" fill="rgba(107,149,174,0.04)" stroke="rgba(107,149,174,0.22)" strokeWidth="1.5"/>
    <text x="40" y="214" textAnchor="middle" fontSize="10" fill="rgba(107,149,174,0.55)" fontFamily="'Noto Serif Devanagari',serif">कफ</text>
    <text x="40" y="228" textAnchor="middle" fontSize="7" fill="rgba(107,149,174,0.3)" fontFamily="Outfit,sans-serif" letterSpacing="1.5">KAPHA</text>
    <circle cx="140" cy="158" r="26" fill="rgba(168,204,224,0.03)" stroke="rgba(168,204,224,0.14)" strokeWidth="1"/>
    <text x="140" y="154" textAnchor="middle" fontSize="9" fill="rgba(168,204,224,0.45)" fontFamily="'Noto Serif Devanagari',serif">प्रकृति</text>
    <text x="140" y="167" textAnchor="middle" fontSize="7" fill="rgba(168,204,224,0.25)" fontFamily="Outfit,sans-serif" letterSpacing="1">PRAKRITI</text>
    <line x1="140" y1="44" x2="140" y2="158" stroke="rgba(168,204,224,0.05)" strokeWidth="1" strokeDasharray="3 5"/>
    <line x1="240" y1="218" x2="140" y2="158" stroke="rgba(168,204,224,0.05)" strokeWidth="1" strokeDasharray="3 5"/>
    <line x1="40" y1="218" x2="140" y2="158" stroke="rgba(168,204,224,0.05)" strokeWidth="1" strokeDasharray="3 5"/>
    <circle cx="140" cy="140" r="128" stroke="rgba(168,204,224,0.03)" strokeWidth="1" strokeDasharray="2 10"/>
    {[[58,78],[220,88],[78,232],[202,237],[140,244]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="2.5" fill="rgba(107,149,174,0.35)"/>
    ))}
  </svg>
);

const YogaSVG = () => (
  <svg width="260" height="260" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20,140 C55,75 85,205 115,140 C145,75 175,205 205,140 C230,85 255,160 262,140" stroke="rgba(168,204,224,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round">
      <animate attributeName="d" values="M20,140 C55,75 85,205 115,140 C145,75 175,205 205,140 C230,85 255,160 262,140;M20,140 C55,95 85,185 115,140 C145,95 175,185 205,140 C230,100 255,158 262,140;M20,140 C55,75 85,205 115,140 C145,75 175,205 205,140 C230,85 255,160 262,140" dur="4s" repeatCount="indefinite"/>
    </path>
    <path d="M20,158 C55,93 85,223 115,158 C145,93 175,223 205,158 C230,103 255,178 262,158" stroke="rgba(168,204,224,0.15)" strokeWidth="1" fill="none" strokeLinecap="round">
      <animate attributeName="d" values="M20,158 C55,93 85,223 115,158 C145,93 175,223 205,158 C230,103 255,178 262,158;M20,158 C55,113 85,203 115,158 C145,113 175,203 205,158 C230,118 255,175 262,158;M20,158 C55,93 85,223 115,158 C145,93 175,223 205,158 C230,103 255,178 262,158" dur="6s" repeatCount="indefinite"/>
    </path>
    <path d="M20,122 C55,57 85,187 115,122 C145,57 175,187 205,122 C230,67 255,142 262,122" stroke="rgba(226,194,125,0.1)" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <circle cx="140" cy="96" r="17" stroke="rgba(168,204,224,0.3)" strokeWidth="1.5" fill="rgba(168,204,224,0.04)"/>
    <path d="M129,113 Q140,108 151,113 L159,140 Q140,146 121,140 Z" stroke="rgba(168,204,224,0.22)" strokeWidth="1.5" fill="rgba(168,204,224,0.03)" strokeLinejoin="round"/>
    <path d="M121,126 Q98,132 88,143" stroke="rgba(168,204,224,0.18)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M159,126 Q182,132 192,143" stroke="rgba(168,204,224,0.18)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M121,140 Q108,157 92,155 Q103,142 121,140" stroke="rgba(168,204,224,0.12)" strokeWidth="1" fill="rgba(168,204,224,0.02)"/>
    <path d="M159,140 Q172,157 188,155 Q177,142 159,140" stroke="rgba(168,204,224,0.12)" strokeWidth="1" fill="rgba(168,204,224,0.02)"/>
    <line x1="140" y1="79" x2="140" y2="142" stroke="rgba(226,194,125,0.18)" strokeWidth="1" strokeDasharray="2 3"/>
    {[82,96,108,120,133].map((y,i)=>(
      <circle key={i} cx="140" cy={y} r="3" fill="rgba(226,194,125,0.35)" opacity={1-i*0.15}/>
    ))}
    <circle cx="140" cy="116" r="52" stroke="rgba(168,204,224,0.04)" strokeWidth="1" strokeDasharray="3 6"/>
    <circle cx="140" cy="116" r="72" stroke="rgba(168,204,224,0.025)" strokeWidth="1" strokeDasharray="2 9"/>
  </svg>
);

const MantraSVG = () => (
  <svg width="260" height="260" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
    {[18,38,60,84,110,138].map((r,i)=>(
      <circle key={i} cx="140" cy="128" r={r}
        stroke="rgba(168,204,224,0.13)"
        strokeWidth="1"
        fill="none"
        opacity={0.9-i*0.13}
        strokeDasharray={i%2===0?"":"3 6"}>
        <animate attributeName="r" values={`${r};${r+6};${r}`} dur={`${3+i*0.6}s`} repeatCount="indefinite"/>
        <animate attributeName="opacity" values={`${0.5-i*0.06};${0.15};${0.5-i*0.06}`} dur={`${3+i*0.6}s`} repeatCount="indefinite"/>
      </circle>
    ))}
    <text x="140" y="148" textAnchor="middle" fontSize="58" fill="rgba(226,194,125,0.12)" fontFamily="'Noto Serif Devanagari',serif">ॐ</text>
    <text x="140" y="148" textAnchor="middle" fontSize="58" fill="none" stroke="rgba(226,194,125,0.38)" strokeWidth="0.5" fontFamily="'Noto Serif Devanagari',serif">ॐ</text>
    {[[-80,4],[-58,-7],[-36,9],[-14,-5],[8,8],[30,-6],[52,7],[74,-4]].map(([x,amp],i)=>(
      <line key={i}
        x1={140+x} y1={228+(amp||0)}
        x2={140+x} y2={228-(amp||0)}
        stroke="rgba(168,204,224,0.28)"
        strokeWidth="2"
        strokeLinecap="round">
        <animate attributeName="y2" values={`${228-(Math.abs(amp)+2)};${228-(Math.abs(amp)+10)};${228-(Math.abs(amp)+2)}`} dur={`${1.4+i*0.22}s`} repeatCount="indefinite"/>
        <animate attributeName="y1" values={`${228+(Math.abs(amp)+2)};${228+(Math.abs(amp)+10)};${228+(Math.abs(amp)+2)}`} dur={`${1.4+i*0.22}s`} repeatCount="indefinite"/>
      </line>
    ))}
    <path d="M140,48 C114,43 93,53 86,71 C77,90 83,109 94,120 C86,131 86,144 94,153 C102,163 116,167 130,165 L140,167 L150,165 C164,167 178,163 186,153 C194,144 194,131 186,120 C197,109 203,90 194,71 C187,53 166,43 140,48Z" stroke="rgba(168,204,224,0.1)" strokeWidth="1" fill="rgba(168,204,224,0.015)"/>
    {[[113,82],[162,80],[106,108],[170,105],[124,130],[157,132]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="2.5" fill="rgba(226,194,125,0.45)">
        <animate attributeName="opacity" values="0.2;0.9;0.2" dur={`${1+i*0.28}s`} repeatCount="indefinite"/>
      </circle>
    ))}
  </svg>
);

// ── DATA ──

const steps = [
  { num:'01', name:'Identify', title:'We understand what', em:"you're carrying.",
    body:"Before anything else, SATTVA listens. You tell us what you're experiencing in human terms. That one honest answer becomes the seed of your entire healing path.",
    points:[
      {t:'Select up to 3 struggles',d:'Overthinking, anxiety, fear, grief — each understood through lived experience and 5,000 years of IKS wisdom.'},
      {t:'No diagnosis. No judgement.',d:"You are not broken. You are unread. SATTVA doesn't pathologise — it understands."},
      {t:'Your profile begins here',d:'Every recommendation, every practice, every piece of wisdom is now calibrated to this moment.'},
    ]},
  { num:'02', name:'Profile', title:'Your Moon. Your', em:'constitution.',
    body:'Your birth chart reveals the planetary patterns behind your emotional experience. Your Prakriti tells us how your body and mind are wired. Together — a profile unlike any other.',
    points:[
      {t:'Birth chart analysis',d:'Your Moon sign, Nakshatra, and active Dasha — read through the lens of mental wellness, not prediction.'},
      {t:'Prakriti assessment',d:'A guided quiz identifying your unique Vata-Pitta-Kapha balance — the constitutional foundation of all healing.'},
      {t:'Moon affliction mapping',d:'Built from 10,000+ consultations. The specific planetary pattern amplifying your suffering — identified precisely.'},
    ]},
  { num:'03', name:'Choose', title:'You choose how', em:'you heal.',
    body:"SATTVA recommends. You decide. We present your healing pathways — each rooted in a different ancient science — and you choose up to four that resonate. Your agency never leaves your hands.",
    points:[
      {t:'Jyotisha — planetary remedies',d:'Mantras and timing mapped to your Moon affliction and active Dasha period.'},
      {t:'Ayurveda — body as foundation',d:'Protocols calibrated to your Prakriti and your specific imbalance.'},
      {t:'Yoga & Mantra',d:'Breathwork, asanas and sound practices for your nervous system — never generic, always personal.'},
    ]},
  { num:'04', name:'Journey', title:'30 days. Week by', em:'week. Yours.',
    body:'Phase 1 is 30 days. Not overwhelming — intentional. Each week one new practice unlocks. By week four you have a complete, personalised healing routine. Morning check-in. Evening reflection.',
    points:[
      {t:'Week 1 — The first step',d:'One practice. Small enough to begin. Powerful enough to matter.'},
      {t:'Weeks 2–3 — The deepening',d:'New practices unlock. The noise grows quieter. The clarity grows closer.'},
      {t:'Week 4 — The arrival',d:'Four practices. Thirty days. A routine that is entirely, completely yours.'},
    ]},
];

const pillars = [
  {
    num:'01', name:'Jyotisha', sk:'ज्योतिष', eng:'Planetary Science', reverse:false,
    subtitle:"The science that reads your mind's blueprint.",
    badge:'Vedic knowledge + Modern validation',
    body:[
      "Jyotisha is not fortune-telling. It is the most precise psychological mapping system the ancient world ever produced. Your birth chart is a snapshot of the sky at the moment of your arrival — and in that snapshot lives a complete description of how your mind works, what it fears, and where it finds peace.",
      {em:"The Moon — Chandra — is the planet of the mind. When Chandra is afflicted, the mind suffers in specific, predictable, treatable ways."},
      " SATTVA's Moon affliction mapping is built from thousands of real consultations — not from textbooks.",
    ],
    points:[
      {t:'Moon sign & Nakshatra',d:"Your Chandra placement reveals your emotional nature, triggers, and deepest psychological patterns — with a precision no personality test can match."},
      {t:'Dasha system — why NOW',d:"The planetary period you're in explains why this suffering is happening at this exact point in your life — and when it shifts."},
      {t:'Moon affliction engine',d:'Chandra–Shani, Chandra–Rahu, Chandra–Ketu, Chandra–Mangal — each creates a distinct suffering pattern with a specific remedy protocol.'},
    ],
    cite:"Vedic astrology's model of Moon-mind correlation maps closely to modern findings on the limbic system's role in emotional regulation. The precision of Nakshatra-based psychological profiling has no equivalent in Western psychological frameworks.",
    citeSource:'Comparative note — IKS Psychology & Modern Neuroscience',
    SVG: JyotishaSVG,
  },
  {
    num:'02', name:'Ayurveda', sk:'आयुर्वेद', eng:'Science of Life', reverse:true,
    subtitle:'The science that heals your constitution.',
    badge:'3,000 years clinical use + Modern lab validation',
    body:[
      "Ayurveda begins with a radical premise — every person is different, and therefore every healing must be different. Your Prakriti is your unique mind-body constitution. Mental suffering is always understood through Dosha imbalance — never treated with a one-size-fits-all solution.",
      {em:"Modern labs are now studying the same substances Ayurveda prescribed 3,000 years ago for anxiety, grief and cognitive decline."},
      " The difference is that Ayurveda never gave the same remedy to everyone. ",{strong:"Your constitution determines your medicine. SATTVA finds yours."},
    ],
    points:[
      {t:'Prakriti-first approach',d:'Before any recommendation is made, we understand your constitution. What heals one person can aggravate another. Ayurveda has always known this.'},
      {t:'Dosha-specific protocols',d:'Vata, Pitta, Kapha — each creates a different experience of suffering and requires a fundamentally different healing response.'},
      {t:'Dinacharya — daily rhythm',d:'How you structure your day is as important as what you take. Your personalised daily routine is the foundation on which all healing rests.'},
    ],
    cite:"Multiple peer-reviewed studies have validated Ayurvedic herbal protocols for anxiety and cognitive function. A 2019 study in Medicine journal found significant cortisol reduction with standardised Ayurvedic supplementation over 60 days.",
    citeSource:'Medicine Journal, 2019 · AIIMS Clinical Studies on Ayurvedic Protocols',
    SVG: AyurvedaSVG,
  },
  {
    num:'03', name:'Yoga & Pranayama', sk:'योग', eng:'Union · Nervous System Science', reverse:false,
    subtitle:'The science that steadies your nervous system.',
    badge:'Harvard · Stanford · NIMHANS validated',
    body:[
      "The yoga most people know is a fraction of what Yoga actually is. In its classical form, Yoga is a complete science of consciousness. Asanas and pranayama are tools for regulating the nervous system — not for flexibility.",
      {em:"Anxiety lives in the nervous system. Fear lives in the body. Overthinking often lives in the breath — and Pranayama has known this for thousands of years."},
      " Stanford researchers found that cyclic sighing — a pranayama technique — outperformed meditation for reducing daily anxiety. ",{strong:"Ancient India knew. Now the labs agree."},
    ],
    points:[
      {t:'Dosha-specific sequences',d:'Vata, Pitta, and Kapha each require fundamentally different practices. Yours is built for your constitution — not a generic sequence.'},
      {t:'Pranayama as medicine',d:'Controlled breathwork directly regulates the autonomic nervous system, reducing cortisol and activating the parasympathetic response.'},
      {t:'Progressive weekly practice',d:'Each week of Phase 1 introduces a new element. By week four you have a complete practice that is personal — and sustainable.'},
    ],
    cite:"Stanford University's 2023 study found cyclic sighing (a pranayama technique) reduced anxiety significantly more than mindfulness meditation. Harvard's Benson-Henry Institute has studied yogic breathing's impact on the relaxation response for over 30 years.",
    citeSource:'Stanford Medicine, 2023 · Harvard Benson-Henry Institute · NIMHANS Yoga Research',
    SVG: YogaSVG,
  },
  {
    num:'04', name:'Mantra', sk:'मन्त्र', eng:'Sound as Medicine', reverse:true,
    subtitle:'The science that rewires the patterns.',
    badge:'Neuroscience validated · Harvard Medical School',
    body:[
      "Mantra is the most misunderstood of the four sciences. It is not prayer. It is not superstition. It is the precise use of sound vibration to create measurable changes in the mind and nervous system.",
      {em:"Harvard Medical School found that mantra meditation reduces activity in the default mode network — the part of the brain responsible for overthinking and rumination that will not stop."},
      " Ancient India called this quieting Chitta Vritti Nirodha. Neuroscience calls it default mode network deactivation. ",{strong:"SATTVA gives you your specific mantra — not a generic chant. The precise sound for your Moon, your Dasha, and your Dosha."},
    ],
    points:[
      {t:'Planetary remedy mantras',d:'Each Moon affliction has a corresponding planetary mantra. Practiced consistently at the right time, it works on the vibrational pattern underlying your specific suffering.'},
      {t:'Dosha balancing sounds',d:'Specific Bija mantras address Vata, Pitta, or Kapha imbalance at a frequency level no pill can replicate.'},
      {t:'Structured Japa practice',d:'Japa — repetitive mantra recitation — creates neurological change through focused attention and rhythmic breath. SATTVA structures your practice with counts, timing and intention.'},
    ],
    cite:"Harvard Medical School research shows mantra meditation significantly reduces default mode network activity — the brain region associated with rumination and anxiety. Rhythmic sound also entrains brainwave patterns, shifting from beta (stress) to alpha and theta states.",
    citeSource:'Harvard Medical School · Journal of Cognitive Neuroscience · Frontiers in Human Neuroscience',
    SVG: MantraSVG,
  },
];

// ── COMPONENTS ──

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

function PillarBody({body}){
  return(
    <p className="pc-body">
      {body.map((chunk,i)=>{
        if(typeof chunk==='string') return <span key={i}>{chunk}</span>;
        if(chunk.em) return <em key={i}>{chunk.em}</em>;
        if(chunk.strong) return <strong key={i}>{chunk.strong}</strong>;
        return null;
      })}
    </p>
  );
}

export default function HowItWorks(){
  const [active,setActive]=useState(0);
  useReveal();

  return(
    <>
      <Helmet>
        <title>How Sattva Works — Ayurveda, Jyotish & Mantra | Sattva Heals</title>
        <meta name="description" content="Sattva uses three phases — Prakriti assessment, personalised practice, and 1-on-1 Jyotish consultation — to bring 5,000 years of Indian wisdom to your mental wellness." />
        <link rel="canonical" href="https://sattvaheals.in/how-it-works" />
      </Helmet>
      <style>{FONTS+css}</style>
      <Cursor/>
      <StarField/>

      <nav>
        <a className="nav-brand" href="/">SATTVA <span>Heals</span></a>
        <button className="nav-back" onClick={()=>window.location.href='/'}>← Back to Home</button>
      </nav>

      {/* HERO + STEPPER */}
      <section className="hero">
        <div className="eyebrow"><div className="ey-line"/><span className="ey-text">How SATTVA Works</span><div className="ey-line"/></div>
        <h1 className="hero-title">Ancient wisdom.<br/><em>Personal precision.</em></h1>
        <p className="hero-sub">SATTVA doesn't give you generic advice. It builds a healing path specific to your Moon, your constitution, your struggle, and your chosen practices.</p>

        <div className="stepper-wrap">
          <div className="stepper-tabs">
            {steps.map((s,i)=>(
              <button key={s.num} className={`step-tab ${active===i?'active':''}`} onClick={()=>setActive(i)}>
                <span className="st-num">Step {s.num}</span>
                <div className="st-name">{s.name}</div>
              </button>
            ))}
          </div>

          <div className="step-content" data-num={steps[active].num} key={active} style={{animation:'fadeUp 0.45s ease both'}}>
            <div>
              <span className="sc-label">Step {steps[active].num} — {steps[active].name}</span>
              <div className="sc-title">{steps[active].title} <em>{steps[active].em}</em></div>
              <p className="sc-body">{steps[active].body}</p>
            </div>
            <div className="sc-points">
              {steps[active].points.map((p,i)=>(
                <div className="sc-point" key={i}>
                  <div className="sc-dot"/>
                  <div className="sc-pt"><strong>{p.t}</strong>{p.d}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="step-nav">
            <button className="snav-btn" onClick={()=>setActive(s=>s-1)} disabled={active===0}>← Previous</button>
            <div className="step-dots">{steps.map((_,i)=><button key={i} className={`sdot ${active===i?'active':''}`} onClick={()=>setActive(i)}/>)}</div>
            <button className="snav-btn" onClick={()=>setActive(s=>s+1)} disabled={active===steps.length-1}>Next →</button>
          </div>
        </div>
      </section>

      <Arch to="#0D1F35"/>

      {/* PILLARS */}
      <section className="pillars-section">
        <div className="pillars-inner">
          <div className="pillars-header reveal">
            <div className="eyebrow" style={{justifyContent:'center'}}><div className="ey-line"/><span className="ey-text">The Four Sciences</span><div className="ey-line"/></div>
            <h2 className="sec-title">Ancient toolkit.<br/><em>Explained completely.</em></h2>
            <p className="sec-sub">Each science is complete on its own. Together, woven through your personal profile, they become something the world has never had — a fully personalised IKS healing system.</p>
          </div>

          {pillars.map((p)=>(
            <div className={`pillar ${p.reverse?'reverse':''}`} key={p.name}>
              <div className={p.reverse?'reveal-right':'reveal-left'}>
                <div className="pillar-art">
                  <div className="pillar-art-num">{p.num}</div>
                  <p.SVG/>
                  <div className="pillar-art-label">{p.eng}</div>
                  <div className="pillar-art-sk">{p.sk}</div>
                </div>
              </div>
              <div className={p.reverse?'reveal-left':'reveal-right'}>
                <div className="pillar-content">
                  <div className="pc-eyebrow"><div className="pc-ey-dot"/><span className="pc-ey-text">Pillar {p.num}</span></div>
                  <div className="pc-title">{p.name}</div>
                  <div className="pc-subtitle">{p.subtitle}</div>
                  <div className="science-badge"><div className="sb-dot"/><span className="sb-text">{p.badge}</span></div>
                  <PillarBody body={p.body}/>
                  <div className="pc-points">
                    {p.points.map((pt,j)=>(
                      <div className="pc-point" key={j}>
                        <div className="pc-pt"><strong>{pt.t}</strong>{pt.d}</div>
                      </div>
                    ))}
                  </div>
                  <div className="science-cite">
                    <span className="sci-label">Modern Science Says</span>
                    <div className="sci-text">{p.cite}</div>
                    <span className="sci-source">{p.citeSource}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Arch to="#060E1A"/>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner reveal">
          <h2 className="cta-title">Ready to begin<br/><em>your journey?</em></h2>
          <p className="cta-body">Your Moon has a story. Your constitution has a language. SATTVA translates both — and builds your healing path from what it finds.</p>
          <button className="btn-primary" onClick={()=>window.location.href='/signup'}>Begin — it's free</button>
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