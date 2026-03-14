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
    --green:     #6ECBA0;
    --error:     #E07070;
  }

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body {
    background:var(--abyss);
    color:var(--pearl);
    font-family:'Outfit',sans-serif;
    font-weight:300;
    overflow-x:hidden;
    min-height:100vh;
  }
  body::after {
    content:''; position:fixed; inset:0;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events:none; z-index:998; opacity:0.4;
  }

  /* Custom cursor */
  .cursor { width:8px; height:8px; background:var(--moon); border-radius:50%; position:fixed; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); transition:left 0.06s,top 0.06s; }
  .cursor-ring { width:28px; height:28px; border:1px solid rgba(168,204,224,0.3); border-radius:50%; position:fixed; pointer-events:none; z-index:9998; transform:translate(-50%,-50%); transition:left 0.14s ease-out,top 0.14s ease-out; }

  /* Progress bar */
  .onb-progress {
    position:fixed; top:0; left:0; right:0; z-index:200;
    height:2px;
    background:rgba(168,204,224,0.07);
  }
  .onb-progress-fill {
    height:100%;
    background:linear-gradient(90deg, var(--moon-dim), var(--moon), var(--gold));
    transition:width 0.5s cubic-bezier(0.4,0,0.2,1);
    position:relative;
  }
  .onb-progress-fill::after {
    content:'';
    position:absolute; right:0; top:50%;
    transform:translateY(-50%);
    width:4px; height:4px; border-radius:50%;
    background:var(--gold);
    box-shadow:0 0 8px var(--gold);
  }

  /* Step counter */
  .onb-stepcounter {
    position:fixed; top:20px; right:24px; z-index:200;
    font-size:11px; letter-spacing:2.5px;
    color:var(--pearl-dim); text-transform:uppercase;
    font-family:'Outfit',sans-serif;
    opacity:0.6;
  }

  /* Back button */
  .onb-back {
    position:fixed; bottom:32px; left:28px; z-index:200;
    background:none; border:none;
    font-size:11px; letter-spacing:2px; text-transform:uppercase;
    color:var(--pearl-dim); cursor:pointer;
    display:flex; align-items:center; gap:8px;
    transition:color 0.2s;
    font-family:'Outfit',sans-serif;
  }
  .onb-back:hover { color:var(--moon); }
  .onb-back::before {
    content:'';
    width:20px; height:1px;
    background:currentColor;
    transition:width 0.2s;
  }
  .onb-back:hover::before { width:28px; }

  /* Main layout */
  .onb-screen {
    min-height:100vh;
    display:flex; align-items:center; justify-content:center;
    padding:80px 24px 100px;
    position:relative;
  }

  /* Ambient glow behind each step */
  .onb-ambient {
    position:fixed; inset:0; z-index:0; pointer-events:none;
    transition:opacity 0.8s ease;
  }

  /* Step wrapper with animation */
  .onb-step-wrap {
    position:relative; z-index:10;
    max-width:640px; width:100%;
    opacity:0;
    transform:translateY(20px);
    transition:opacity 0.45s cubic-bezier(0.4,0,0.2,1), transform 0.45s cubic-bezier(0.4,0,0.2,1);
  }
  .onb-step-wrap.visible {
    opacity:1;
    transform:translateY(0);
  }
  .onb-step-wrap.exiting {
    opacity:0;
    transform:translateY(-16px);
    transition:opacity 0.25s ease, transform 0.25s ease;
  }

  /* Stage label */
  .onb-stage {
    font-size:10px; letter-spacing:4px; text-transform:uppercase;
    color:var(--moon-dim); margin-bottom:20px;
    display:flex; align-items:center; gap:12px;
  }
  .onb-stage::before {
    content:''; width:24px; height:1px; background:var(--gold-dim);
  }

  /* Question heading */
  .onb-qhead {
    font-family:'Cormorant Garamond', serif;
    font-size:clamp(28px, 4vw, 42px);
    font-weight:500;
    color:var(--pearl);
    line-height:1.2;
    margin-bottom:36px;
    letter-spacing:0.01em;
  }
  .onb-qhead em { color:var(--gold); font-style:italic; }

  /* Body text */
  .onb-body {
    font-size:16px; line-height:1.85;
    color:var(--pearl-dim);
    margin-bottom:32px;
    max-width:520px;
  }

  /* ── Option cards (Q0, Q1-Q7, Q9, Q10) ── */
  .onb-options { display:flex; flex-direction:column; gap:10px; }

  .onb-opt {
    position:relative;
    background:rgba(13,31,53,0.6);
    border:1px solid rgba(168,204,224,0.08);
    border-radius:14px;
    padding:18px 22px 18px 56px;
    cursor:pointer;
    transition:all 0.28s cubic-bezier(0.4,0,0.2,1);
    text-align:left;
    font-family:'Outfit',sans-serif;
    font-size:15px;
    color:var(--pearl-dim);
    line-height:1.5;
    backdrop-filter:blur(8px);
  }
  .onb-opt::before {
    content:attr(data-index);
    position:absolute; left:20px; top:50%; transform:translateY(-50%);
    width:22px; height:22px; border-radius:50%;
    border:1px solid rgba(168,204,224,0.15);
    display:flex; align-items:center; justify-content:center;
    font-size:10px; letter-spacing:0; color:var(--moon-dim);
    display:flex; align-items:center; justify-content:center;
    transition:all 0.28s;
    font-weight:500;
  }
  .onb-opt:hover {
    background:rgba(17,40,64,0.8);
    border-color:rgba(168,204,224,0.25);
    color:var(--pearl);
    transform:translateX(4px);
  }
  .onb-opt:hover::before {
    border-color:var(--moon-dim);
    color:var(--moon);
  }
  .onb-opt.selected {
    background:rgba(168,204,224,0.07);
    border-color:rgba(168,204,224,0.4);
    color:var(--pearl);
  }
  .onb-opt.selected::before {
    background:var(--moon);
    border-color:var(--moon);
    color:var(--abyss);
    content:'✓';
    font-size:11px;
  }
  .onb-opt.danger {
    border-color:rgba(224,112,112,0.15);
  }
  .onb-opt.danger:hover, .onb-opt.danger.selected {
    border-color:rgba(224,112,112,0.5);
    background:rgba(224,112,112,0.06);
    color:#F9D1D1;
  }
  .onb-opt.danger::before { border-color:rgba(224,112,112,0.3); }
  .onb-opt.danger:hover::before, .onb-opt.danger.selected::before {
    border-color:var(--error); color:var(--error);
  }
  .onb-opt.danger.selected::before {
    background:var(--error); color:#fff;
  }

  /* ── Concern cards (Q8) ── */
  .onb-concern-grid {
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:12px;
    margin-top:4px;
  }
  .onb-concern-card {
    background:rgba(13,31,53,0.6);
    border:1px solid rgba(168,204,224,0.08);
    border-radius:16px;
    padding:22px 18px 20px;
    text-align:center;
    cursor:pointer;
    transition:all 0.3s cubic-bezier(0.4,0,0.2,1);
    backdrop-filter:blur(8px);
    position:relative; overflow:hidden;
  }
  .onb-concern-card::after {
    content:'';
    position:absolute; inset:0; border-radius:16px;
    background:radial-gradient(circle at 50% 0%, rgba(226,194,125,0.06), transparent 70%);
    opacity:0; transition:opacity 0.3s;
  }
  .onb-concern-card:hover {
    border-color:rgba(168,204,224,0.2);
    transform:translateY(-2px);
    box-shadow:0 8px 32px rgba(0,0,0,0.3);
  }
  .onb-concern-card.selected {
    border-color:rgba(226,194,125,0.5);
    background:rgba(226,194,125,0.06);
    box-shadow:0 0 0 1px rgba(226,194,125,0.15), 0 8px 32px rgba(0,0,0,0.3);
  }
  .onb-concern-card.selected::after { opacity:1; }
  .onb-concern-name {
    font-family:'Cormorant Garamond',serif;
    font-size:22px; font-weight:500;
    color:var(--pearl); margin-bottom:4px;
  }
  .onb-concern-sk {
    font-family:'Noto Serif Devanagari',serif;
    font-size:13px; color:var(--moon-dim);
    margin-bottom:8px;
  }
  .onb-concern-tag {
    font-size:12px; color:var(--pearl-dim);
    line-height:1.5; opacity:0.8;
  }

  /* ── Buttons ── */
  .onb-actions { margin-top:32px; display:flex; gap:12px; flex-wrap:wrap; }

  .onb-btn {
    padding:14px 36px;
    font-family:'Outfit',sans-serif;
    font-size:11px; font-weight:500;
    letter-spacing:3px; text-transform:uppercase;
    cursor:pointer; border-radius:2px;
    transition:all 0.3s;
  }
  .onb-btn-primary {
    background:linear-gradient(135deg, rgba(168,204,224,0.15), rgba(168,204,224,0.05));
    border:1px solid rgba(168,204,224,0.3);
    color:var(--pearl);
  }
  .onb-btn-primary:hover {
    border-color:var(--moon);
    color:var(--moon);
    background:rgba(168,204,224,0.1);
    box-shadow:0 0 24px rgba(168,204,224,0.1);
  }
  .onb-btn-primary:disabled {
    opacity:0.4; cursor:not-allowed;
  }
  .onb-btn-secondary {
    background:transparent;
    border:1px solid rgba(168,204,224,0.12);
    color:var(--pearl-dim);
  }
  .onb-btn-secondary:hover {
    border-color:rgba(168,204,224,0.3);
    color:var(--moon);
  }

  /* ── Dosha reveal ── */
  .onb-dosha-reveal {
    margin-bottom:6px;
  }
  .onb-dosha-name {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(52px,8vw,80px);
    font-weight:300; color:var(--gold);
    line-height:1; letter-spacing:0.05em;
    margin-bottom:8px;
  }
  .onb-dosha-sk {
    font-family:'Noto Serif Devanagari',serif;
    font-size:20px; color:var(--moon-dim);
    margin-bottom:20px; display:block;
  }
  .onb-dosha-text {
    font-size:16px; line-height:1.9;
    color:var(--pearl-dim);
    max-width:520px;
  }

  /* ── Divider ── */
  .onb-divider {
    height:1px; margin:28px 0;
    background:linear-gradient(90deg, transparent, rgba(168,204,224,0.25), transparent);
  }

  /* ── Result screens ── */
  .onb-result-label {
    font-size:10px; letter-spacing:4px; text-transform:uppercase;
    color:var(--gold-dim); margin-bottom:16px;
    display:flex; align-items:center; gap:12px;
  }
  .onb-result-label::before { content:''; width:24px; height:1px; background:var(--gold-dim); }

  .onb-concern-reveal {
    font-size:18px; font-family:'Cormorant Garamond',serif;
    color:var(--pearl); margin-bottom:10px; font-style:italic;
  }

  .onb-framing {
    font-size:14px; color:var(--pearl-dim);
    line-height:1.8; margin-bottom:6px;
  }

  .onb-why-text {
    font-size:15px; line-height:1.9; color:var(--pearl-dim);
    max-width:540px;
  }

  /* Protocol sections */
  .onb-proto-section { margin-bottom:28px; }
  .onb-proto-label {
    font-size:9px; letter-spacing:4px; text-transform:uppercase;
    color:var(--moon-dim); margin-bottom:12px;
    padding-bottom:8px;
    border-bottom:1px solid rgba(168,204,224,0.08);
  }
  .onb-mantra-name {
    font-family:'Cormorant Garamond',serif;
    font-size:28px; color:var(--gold); margin-bottom:4px;
  }
  .onb-mantra-translit {
    font-size:13px; color:var(--pearl-dim);
    font-style:italic; margin-bottom:12px; line-height:1.7;
  }
  .onb-mantra-meaning {
    font-size:14px; color:var(--pearl); line-height:1.8; margin-bottom:8px;
  }
  .onb-mantra-meta {
    font-size:12px; color:var(--moon-dim); letter-spacing:0.5px;
  }

  .onb-food-label {
    font-size:11px; letter-spacing:2px; text-transform:uppercase;
    color:var(--pearl-dim); margin-bottom:6px; margin-top:12px;
  }
  .onb-food-list { list-style:none; display:flex; flex-direction:column; gap:4px; }
  .onb-food-item {
    display:flex; gap:10px; align-items:flex-start;
    font-size:13px; color:var(--pearl-dim); line-height:1.6;
  }
  .dot-green {
    width:5px; height:5px; border-radius:50%;
    background:var(--green); margin-top:6px; flex-shrink:0;
  }
  .dot-red {
    width:5px; height:5px; border-radius:50%;
    background:var(--error); margin-top:6px; flex-shrink:0;
  }

  .onb-dina-row {
    display:flex; gap:12px; align-items:flex-start;
    font-size:13px; color:var(--pearl-dim);
    line-height:1.6; margin-bottom:8px;
  }
  .onb-dina-icon { font-size:15px; flex-shrink:0; margin-top:1px; }

  .onb-disclaimer {
    margin-top:20px; font-size:11px;
    color:rgba(139,175,196,0.5);
    font-style:italic; line-height:1.7;
  }
  .onb-save-error {
    margin-top:10px; font-size:12px;
    color:var(--error); text-align:left;
  }

  /* ── Crisis screen ── */
  .onb-crisis-wrap {
    min-height:100vh; display:flex;
    align-items:center; justify-content:center;
    padding:60px 24px;
  }
  .onb-crisis-inner {
    max-width:680px; width:100%;
    opacity:0; transform:translateY(20px);
    transition:opacity 0.45s ease, transform 0.45s ease;
  }
  .onb-crisis-inner.visible { opacity:1; transform:translateY(0); }
  .onb-crisis-heading {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(32px,5vw,48px); color:var(--pearl);
    margin-bottom:8px; font-weight:400;
  }
  .onb-crisis-sub {
    font-size:16px; color:var(--pearl-dim); margin-bottom:32px;
  }
  .onb-crisis-grid {
    display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:32px;
  }
  .onb-crisis-card {
    background:rgba(13,31,53,0.8);
    border:1px solid rgba(168,204,224,0.12);
    border-radius:14px; padding:20px;
    backdrop-filter:blur(8px);
  }
  .onb-crisis-name {
    font-family:'Cormorant Garamond',serif;
    font-size:17px; color:var(--pearl); margin-bottom:4px;
  }
  .onb-crisis-num {
    font-size:20px; color:var(--moon); font-weight:400;
    letter-spacing:0.5px; margin-bottom:4px;
  }
  .onb-crisis-hours {
    font-size:11px; color:var(--pearl-dim); margin-bottom:14px;
  }
  .onb-crisis-btn {
    font-size:10px; letter-spacing:2px; text-transform:uppercase;
    padding:8px 16px; border-radius:999px;
    border:1px solid rgba(168,204,224,0.25);
    background:transparent; color:var(--pearl);
    cursor:pointer; transition:all 0.25s;
    font-family:'Outfit',sans-serif;
  }
  .onb-crisis-btn:hover { border-color:var(--moon); color:var(--moon); }
  .onb-crisis-note {
    font-size:11px; color:rgba(139,175,196,0.4);
    text-align:center; margin-top:12px; font-style:italic;
  }

  /* ── Framing / intro screens ── */
  .onb-intro-wrap { max-width:560px; }
  .onb-intro-head {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(36px,5vw,54px); font-weight:400;
    color:var(--pearl); line-height:1.15; margin-bottom:20px;
  }
  .onb-intro-head em { color:var(--gold); font-style:italic; }
  .onb-intro-body {
    font-size:16px; color:var(--pearl-dim);
    line-height:1.9; margin-bottom:36px; max-width:460px;
  }

  /* ── Mobile ── */
  @media(max-width:600px){
    .onb-concern-grid { grid-template-columns:1fr; }
    .onb-crisis-grid { grid-template-columns:1fr; }
    .onb-opt { padding:16px 16px 16px 48px; font-size:14px; }
    .onb-opt::before { left:14px; }
    .onb-actions { flex-direction:column; }
    .onb-btn { width:100%; text-align:center; padding:16px; }
    .onb-back { bottom:20px; left:16px; }
    .onb-stepcounter { top:16px; right:16px; }
    .onb-dosha-name { font-size:clamp(44px,12vw,64px); }
  }
`;

/* ─────────────────────────────────────────
   DATA LAYER
───────────────────────────────────────── */

const prakritiProfiles = {
  vata:        { name:'VATA',        sk:'वात',       text:"Your mind is primarily Vata — quick, imaginative, and deeply sensitive. When in balance, you see connections others miss and feel life intensely. When disturbed, the mind moves faster than it can rest." },
  pitta:       { name:'PITTA',       sk:'पित्त',      text:"Your mind is primarily Pitta — sharp, purposeful, and driven. When in balance, you are the person who gets things done and leads with clarity. When disturbed, the mind turns that same sharpness inward." },
  kapha:       { name:'KAPHA',       sk:'कफ',        text:"Your mind is primarily Kapha — steady, loyal, and deep. When in balance, you are the calm that others lean on. When disturbed, the mind grows heavy, slow, and hard to lift." },
  'vata-pitta':{ name:'VATA-PITTA',  sk:'वात-पित्त',  text:"Your mind is Vata-Pitta — it moves fast and runs hot. Creative and driven, brilliant and intense. When balanced, unstoppable. When disturbed, anxious and sharp at the same time." },
  'vata-kapha':{ name:'VATA-KAPHA',  sk:'वात-कफ',    text:"Your mind is Vata-Kapha — it oscillates. Some days racing, some days withdrawn. The challenge is finding the middle. When you do, you are one of the most resilient minds there is." },
  'pitta-kapha':{ name:'PITTA-KAPHA',sk:'पित्त-कफ',  text:"Your mind is Pitta-Kapha — steady and strong, but it carries weight. You hold things in, push through, and often forget to put things down. Your healing is about release, not effort." },
  'pitta-vata':{ name:'PITTA-VATA',  sk:'पित्त-वात',  text:"Your mind is Pitta-Vata — driven and restless in equal measure. You set high standards and worry about meeting them. Your strength is also your source of suffering when out of balance." },
  'kapha-vata':{ name:'KAPHA-VATA',  sk:'कफ-वात',    text:"Your mind is Kapha-Vata — deep and sensitive. You feel things profoundly and take time to process. Your healing comes through gentle, consistent practice — never through force." },
  'kapha-pitta':{ name:'KAPHA-PITTA',sk:'कफ-पित्त',  text:"Your mind is Kapha-Pitta — grounded but intense underneath. Calm on the surface, deeply feeling below it. Your healing comes from honest expression, not quiet endurance." },
};

const concernMeta = {
  anxiety:     { name:'Anxiety',     sk:'चिन्ता',      tag:'A restlessness I cannot explain',          iks:'Chinta — the restless mind' },
  aggression:  { name:'Aggression',  sk:'क्रोध',       tag:'A sharpness that comes too fast',           iks:'Krodha — the fire that burns before it warms' },
  overthinking:{ name:'Overthinking',sk:'चित्त वृत्ति', tag:'A mind that will not be quiet',            iks:'Chitta Vritti — the mind that will not be quiet' },
  stress:      { name:'Stress',      sk:'मनस्ताप',     tag:'Too much. Too fast. Running out of myself.', iks:'Manastapa — running out of yourself' },
  lowmood:     { name:'Low Mood',    sk:'विषाद',       tag:'Heavy, empty, no motivation',               iks:'Vishada — the light gone quiet inside' },
  fear:        { name:'Fear',        sk:'भय',          tag:'A worry that lives deeper than thought',    iks:'Bhaya — worry that lives deeper than thought' },
};

const durationCopy = {
  recent:   "You have been carrying this recently. A gentle beginning is the right one.",
  months:   "You have been carrying this for some time now. That is long enough.",
  lifelong: "This is deep in your pattern. And patterns can shift.",
};

const priorCopy = {
  nothing:    "You are starting fresh — that is the best place to begin.",
  meditation: "You already know stillness. Now let us go deeper.",
  therapy:    "Sattva works beautifully alongside professional support.",
  other:      "You have already been seeking. Sattva honours that.",
};

const whyMap = {
  'anxiety-vata':       "In Ayurveda, Vata governs all movement — including the movement of the mind. When Vata is aggravated, the mind moves without anchor. Chinta arises when the nervous system cannot find stillness. In Jyotish, Moon affliction or a disturbed 4th house weakens the capacity for inner peace.",
  'anxiety-pitta':      "Pitta governs perception and the drive to control outcomes. When aggravated, the mind turns its sharp focus onto threats — real or imagined. Chinta in Pitta types is the mind scanning for danger it cannot neutralise. In Jyotish, a debilitated Moon or Rahu near the Moon deepens this pattern.",
  'anxiety-kapha':      "Kapha gives steadiness, but when blocked, its heaviness can generate a slow-burning dread. The mind clings to security it feels it is losing. In Jyotish, Saturn's influence on the Moon or the 4th house can create this anxious attachment.",
  'aggression-vata':    "Vata's instability feeds the nervous system with overstimulation. When the Vata body cannot process incoming intensity, it bursts. This Krodha is reactive — it arises from overwhelm, not power. In Jyotish, Mars and Rahu together in a Vata-dominant chart can amplify this.",
  'aggression-pitta':   "Pitta is the fire of transformation. When excessive, it becomes Krodha — the fire that does not warm but burns. This aggression is purposeful and intense, driven by the frustration of high standards unmet. In Jyotish, an afflicted Mars or Sun often underlies this pattern.",
  'aggression-kapha':   "Kapha suppresses. It holds emotion under a calm surface for a long time — until the dam breaks. Krodha in Kapha types is infrequent but fierce. In Jyotish, Saturn's restriction on Mars energy can cause this long-held pressure to release suddenly.",
  'overthinking-vata':  "Vata's primary quality is movement. The mind that will not be quiet is Vata's most characteristic imbalance — Chitta Vritti. Thoughts loop because Vata cannot anchor without grounding practices. In Jyotish, a Rahu-influenced Mercury or 3rd house can accelerate this mental spinning.",
  'overthinking-pitta': "Pitta's analytical nature becomes its burden in excess. The mind that finds a problem in everything is Pitta overthinking — precise, relentless, never satisfied. In Jyotish, Mercury conjunct or aspecting Mars in the chart often creates this hyper-analytical loop.",
  'overthinking-kapha': "Kapha's depth of feeling means things are not let go easily. Overthinking in Kapha types is circular — returning to the same thought, the same fear, the same memory. In Jyotish, Moon-Saturn connections in the natal chart can create this pattern of mental retention.",
  'stress-vata':        "Manastapa in Vata is the experience of too much with too little to hold it. The Vata constitution was not built for sustained high pressure — it fragments. In Jyotish, a weakened or afflicted Moon alongside an overactive Mercury creates the scattered, exhausted Vata under stress.",
  'stress-pitta':       "Pitta drives until it burns. Manastapa in Pitta types comes from the gap between ambition and resource — the Pitta body keeps pushing when the body has already said enough. In Jyotish, Sun-Mars combinations with Rahu amplify this relentless drive.",
  'stress-kapha':       "Kapha endures. It absorbs stress quietly and carries it in the body — until the weight becomes too much to move under. In Jyotish, Saturn influencing the Moon or Lagna in a Kapha chart deepens this pattern of internalised load.",
  'lowmood-vata':       "Vishada in Vata arises when the lightness of the Vata mind collapses into exhaustion. The creative, quick mind turns hollow. In Jyotish, Moon in Scorpio, an afflicted 4th house, or Ketu near the Moon can create this deep interior dimming.",
  'lowmood-pitta':      "When the fire goes low in a Pitta person, it feels like failure — and that interpretation deepens the low mood. Vishada in Pitta is the loss of purpose. In Jyotish, Sun debilitation or Saturn's aspect on the Sun can create this loss of vitality and identity.",
  'lowmood-kapha':      "Vishada is Kapha's most natural vulnerability. When Kapha is heavily aggravated, Tamas predominates — the mind becomes inert, heavy, and without motivation. In Jyotish, a strongly placed Saturn in the 1st or 4th house in a Kapha chart deepens this tendency.",
  'fear-vata':          "Bhaya is Vata's most primal imbalance. Fear is the shadow of Vata's element — air and space, boundless and unmoored. The Vata mind without grounding lives in the territory of imagined threat. In Jyotish, Rahu in the Lagna or a weak Moon in dusthana houses creates this deep background fear.",
  'fear-pitta':         "Fear in Pitta types is the fear of losing control — of outcomes, of reputation, of the future. It is anxiety dressed in intensity. In Jyotish, Mars-Rahu combinations or Rahu in the 10th house can create this fear beneath the confident Pitta surface.",
  'fear-kapha':         "Bhaya in Kapha is the fear of change, of loss, of being left. It is the heaviness of attachment. The Kapha mind clings to what is known. In Jyotish, Saturn-Moon aspects or a heavily afflicted 4th house can create this fear of dissolution.",
};

const protocols = {
  anxiety: {
    vata: {
      mantra: { name:"Chandra Beej Mantra", transliteration:"Om Shraam Shreem Shraum Sah Chandramasay Namah", meaning:"An invocation of the Moon — the lord of the mind — to restore coolness and steadiness to an agitated Vata mind.", count:"108 repetitions", timing:"Before sleep, or at moonrise" },
      ahara: { eat:["Warm ghee with meals","Sesame in cooking","Warm milk before bed"], avoid:["Cold drinks and raw foods","Dry snacks and crackers"] },
      dinacharya: { morning:"Oil feet with sesame before rising", evening:"No screens after 9pm", sleep:"Sleep before 10pm — non-negotiable for Vata" }
    },
    pitta: {
      mantra: { name:"Chandra Gayatri", transliteration:"Om Ksheerputraya Vidmahe Amrut Tatvaaya Dhimahi Tanno Chandrah Prachodayaat", meaning:"An invocation of the Moon's cooling essence to pacify Pitta's heat and restore calm perception.", count:"108 repetitions", timing:"Evening, facing moonlight if possible" },
      ahara: { eat:["Coconut water daily","Pomegranate and cucumber","Sweet ripe fruits"], avoid:["Spicy and fried food","Alcohol"] },
      dinacharya: { morning:"Cold water wash on face at waking", evening:"Moonlight walk after dinner", sleep:"No work after sunset" }
    },
    kapha: {
      mantra: { name:"Ganesh Mantra", transliteration:"Om Gam Ganapataye Namah", meaning:"Invocation of Ganesh to remove the internal obstructions that hold Kapha anxiety in place and restore movement.", count:"108 repetitions", timing:"Early morning, before sunrise" },
      ahara: { eat:["Ginger tea on waking","Turmeric milk at night","Light warm spiced foods"], avoid:["Heavy oily meals","Cold sweet foods"] },
      dinacharya: { morning:"Wake before sunrise — 15 minutes in sunlight", evening:"Light and early dinner", sleep:"Avoid sleeping past 7am" }
    }
  },
  aggression: {
    vata: {
      mantra: { name:"Shiva Panchakshara", transliteration:"Om Namah Shivaya", meaning:"An invocation of Shiva's stillness — the antidote to Vata aggression that rises from overwhelm and lack of space.", count:"108 repetitions", timing:"Morning, in silence" },
      ahara: { eat:["Warm soups and root vegetables","Dates and figs","Calming sweet foods"], avoid:["Caffeine and stimulants","Processed snacks"] },
      dinacharya: { morning:"Slow, unrushed morning — no alarm-driven panic", evening:"Build in 10 minutes of silence daily", sleep:"No stimulating content before bed" }
    },
    pitta: {
      mantra: { name:"Vishnu Sahasranama", transliteration:"Daily recitation — available in audio form", meaning:"The thousand names of Vishnu pacify Pitta's fierce fire by invoking the principle of sustaining grace over consuming intensity.", count:"Full recitation daily (approx 25 min)", timing:"Morning" },
      ahara: { eat:["Leafy greens and bitter vegetables","Coconut and coriander water","Lime with meals"], avoid:["Alcohol","Red meat and heavy spice"] },
      dinacharya: { morning:"Cool shower at waking", evening:"No competitive activity or work calls after 6pm", sleep:"Midday rest 10–15 minutes" }
    },
    kapha: {
      mantra: { name:"Surya Mantra", transliteration:"Om Hraam Hreem Hraum Sah Suryaya Namah", meaning:"An invocation of the Sun to lift the Kapha heaviness that causes suppressed aggression to accumulate and eventually burst.", count:"108 repetitions", timing:"At sunrise, facing the sun" },
      ahara: { eat:["Ginger and black pepper in cooking","Honey water on waking","Mustard seed in food"], avoid:["Excess sugar","Heavy meals late in day"] },
      dinacharya: { morning:"Walk or movement before 8am", evening:"Early and light dinner", sleep:"Avoid oversleeping" }
    }
  },
  overthinking: {
    vata: {
      mantra: { name:"Chandra Beej Mantra", transliteration:"Om Shraam Shreem Shraum Sah Chandramasay Namah", meaning:"The Moon mantra is the primary remedy for Vata overthinking — it cools and anchors the mind that cannot stop moving.", count:"108 repetitions", timing:"Morning before any screen or conversation" },
      ahara: { eat:["Sesame oil in cooking","Warm cooked meals only","Ghee daily"], avoid:["Cold drinks","Raw salads and dry foods"] },
      dinacharya: { morning:"Apply sesame oil to scalp before shower", evening:"Eat in silence — no multitasking during meals", sleep:"No screens in bed" }
    },
    pitta: {
      mantra: { name:"Gayatri Mantra", transliteration:"Om Bhur Bhuvah Svaha, Tat Savitur Varenyam, Bhargo Devasya Dhimahi, Dhiyo Yo Nah Prachodayat", meaning:"The Gayatri invokes divine light to guide the intellect — transforming Pitta's relentless analysis into illuminated clarity.", count:"108 repetitions", timing:"Sunrise — facing east" },
      ahara: { eat:["Sattvic home-cooked meals","Fresh seasonal produce","Simple uncomplicated food"], avoid:["Processed and packaged foods","Stimulating foods close to bedtime"] },
      dinacharya: { morning:"Single-task work blocks — no multitasking", evening:"No news or social media after 9pm", sleep:"Silence after 9pm" }
    },
    kapha: {
      mantra: { name:"Saraswati Mantra", transliteration:"Om Aim Saraswatyai Namah", meaning:"Saraswati mantra clears the stagnant mental loops of Kapha overthinking by invoking the goddess of clear wisdom and speech.", count:"108 repetitions", timing:"Early morning — before 6am if possible" },
      ahara: { eat:["Light dinner — soup or khichdi","Saffron in warm milk at night","Easy to digest evening meals"], avoid:["Eating after 8pm","Heavy dairy at night"] },
      dinacharya: { morning:"Wake 5:30–6am — journalling before any screen", evening:"Cold water face wash in the evening to activate", sleep:"Early to bed, early to rise — essential for Kapha" }
    }
  },
  stress: {
    vata: {
      mantra: { name:"Mahamrityunjaya Mantra", transliteration:"Om Tryambakam Yajamahe Sugandhim Pushtivardhanam, Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat", meaning:"The great mantra of liberation from fear and depletion — it nourishes the Vata constitution worn thin by stress.", count:"108 repetitions", timing:"Morning before work begins" },
      ahara: { eat:["Warm nourishing calming meals","Ashwagandha milk (educational — consult BAMS)","Regular meals without skipping"], avoid:["Skipping meals","Cold and irregular eating"] },
      dinacharya: { morning:"Fixed wake time — same every day", evening:"Two 5-minute stillness breaks in the working day", sleep:"Fixed meal times — Vata needs rhythmic structure" }
    },
    pitta: {
      mantra: { name:"Narsimha Kavach", transliteration:"Evening recitation — traditional text", meaning:"Narsimha Kavach is the protective shield mantra — it guards the Pitta mind against its own intensity and the stress of self-imposed pressure.", count:"Full recitation", timing:"Evening — after work ends" },
      ahara: { eat:["Coconut water and aloe","Coriander and fennel tea","Cooling alkaline foods"], avoid:["Alcohol — especially under stress","Spicy food in the evening"] },
      dinacharya: { morning:"Cool morning routine — no rushing", evening:"No work calls after 7pm", sleep:"Afternoon rest 15 minutes where possible" }
    },
    kapha: {
      mantra: { name:"Hanuman Chalisa", transliteration:"Traditional full recitation", meaning:"Hanuman Chalisa invokes the energy of devoted, fearless action — exactly what Kapha needs to move through the inertia that stress creates.", count:"Full recitation", timing:"Morning — before food" },
      ahara: { eat:["Ginger and pepper in morning food","Honey water on waking","Light stimulating foods"], avoid:["Heavy dinners","Excess sweet foods and dairy"] },
      dinacharya: { morning:"Movement before food — every single day", evening:"Social connection — Kapha must not isolate under stress", sleep:"Wake with sunrise" }
    }
  },
  lowmood: {
    vata: {
      mantra: { name:"Vishnu Sahasranama", transliteration:"Daily recitation — available in audio form", meaning:"Vishnu Sahasranama nourishes the depleted Vata mind with the sustaining quality of Vishnu — preservation, continuity, and the light that does not abandon.", count:"Full recitation daily", timing:"Morning" },
      ahara: { eat:["Saffron in warm milk","Dates and figs with ghee","Warm sweet nourishing foods"], avoid:["Cold and raw foods","Light airy dry foods that increase Vata"] },
      dinacharya: { morning:"Brahma Muhurta wake (4:30–5:30am) — sunlight first", evening:"Fixed loving daily routine — consistency is the medicine", sleep:"Fixed bedtime" }
    },
    pitta: {
      mantra: { name:"Surya Mantra", transliteration:"Om Hraam Hreem Hraum Sah Suryaya Namah", meaning:"Surya Mantra reignites the solar fire in a Pitta whose flame has dimmed — restoring purpose, vitality, and forward momentum.", count:"108 repetitions", timing:"Sunrise — facing the sun" },
      ahara: { eat:["Pomegranate and fresh ginger","Amla (Indian gooseberry)","Light proteins"], avoid:["Heavy and sweet excess","Oversized meals that create sluggishness"] },
      dinacharya: { morning:"Minimum 15 minutes morning sunlight", evening:"One creative outlet daily — non-negotiable", sleep:"No isolation — social contact daily" }
    },
    kapha: {
      mantra: { name:"Surya Beej Mantra", transliteration:"Om Hraam Hreem Hraum Sah Suryaya Namah (108x at sunrise)", meaning:"The Surya Beej Mantra is the single most important practice for Kapha low mood — it directly addresses the Tamas that Kapha excess creates.", count:"108 repetitions", timing:"At sunrise — this is non-negotiable" },
      ahara: { eat:["Ginger tea on waking","Honey water before breakfast","Light warming foods"], avoid:["Dairy excess","Sugar — it deepens Kapha low mood"] },
      dinacharya: { morning:"Wake before 6am — this alone shifts Kapha Vishada", evening:"Physical movement every morning", sleep:"Social activity minimum 3 times per week" }
    }
  },
  fear: {
    vata: {
      mantra: { name:"Narsimha Kavach", transliteration:"Daily recitation — especially during Rahu Kala", meaning:"Narsimha Kavach is the armour mantra — it addresses the Vata quality of fear directly by building the felt sense of protection that Vata Bhaya cannot find on its own.", count:"Full recitation", timing:"Daily — especially during Rahu Kala hours" },
      ahara: { eat:["Rock salt in warm water","Sesame in cooking","Warm grounding soups"], avoid:["Light airy cold foods","Raw and dry foods that aggravate Vata"] },
      dinacharya: { morning:"Grounding practice — bare feet on earth for 5 minutes", evening:"Reduce change and unpredictability in daily routine", sleep:"Fixed bedtime — same every night" }
    },
    pitta: {
      mantra: { name:"Chandra Beej Mantra", transliteration:"Om Shraam Shreem Shraum Sah Chandramasay Namah", meaning:"The Moon mantra cools the Pitta fear of losing control — it replaces the heat of anxiety with the Moon's quality of calm, reflective awareness.", count:"108 repetitions", timing:"Evening at moonrise" },
      ahara: { eat:["Coconut and coriander","Fennel tea","Sweet cooling fruits"], avoid:["Spicy stimulating food in evening","Caffeine after noon"] },
      dinacharya: { morning:"Journalling fears before sleep to externalise them", evening:"Evening moonlight sitting — 10 minutes minimum", sleep:"Cool bedroom — Pitta fear worsens in heat" }
    },
    kapha: {
      mantra: { name:"Durga Mantra", transliteration:"Om Dum Durgayai Namah", meaning:"Durga mantra is the invocation of fierce protective energy — it addresses the Kapha fear that grows in isolation by connecting to inner strength and divine courage.", count:"108 repetitions", timing:"Morning" },
      ahara: { eat:["Ginger, clove, and cinnamon in cooking","Warming spiced foods","Light easily digested meals"], avoid:["Cold heavy foods that increase Kapha inertia","Oversleeping and skipping morning movement"] },
      dinacharya: { morning:"Morning sunlight and movement together", evening:"Social connection daily — Kapha fear grows in isolation", sleep:"Do not isolate — connection is medicine" }
    }
  }
};

/* ─────────────────────────────────────────
   SCORING
───────────────────────────────────────── */
function computePrakriti(answers) {
  let v=0, p=0, k=0;
  Object.values(answers).forEach(a => {
    if(a==='vata')  v++;
    if(a==='pitta') p++;
    if(a==='kapha') k++;
  });
  if(Math.max(v,p,k) - Math.min(v,p,k) <= 1) return 'vata';
  const max = Math.max(v,p,k);
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

/* ─────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────── */
function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if(!canvas) return;
    let ctx; try { ctx = canvas.getContext('2d'); } catch(e){ return; }
    if(!ctx) return;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    const stars = Array.from({length:80}, () => ({
      x:Math.random()*W, y:Math.random()*H,
      r:Math.random()*1.1+0.2,
      dx:(Math.random()-0.5)*0.07, dy:-Math.random()*0.1-0.02,
      o:Math.random()*0.35+0.08,
      ts:Math.random()*0.012+0.003, to:Math.random()*Math.PI*2,
    }));
    let frame=0, id;
    const draw = () => {
      ctx.clearRect(0,0,W,H); frame++;
      stars.forEach(s => {
        const tw = Math.sin(frame*s.ts+s.to)*0.35+0.65;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle = `rgba(168,204,224,${s.o*tw})`; ctx.fill();
        s.x+=s.dx; s.y+=s.dy;
        if(s.y<-5){ s.y=H+5; s.x=Math.random()*W; }
        if(s.x<-5) s.x=W+5;
        if(s.x>W+5) s.x=-5;
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={ref} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1,opacity:0.55}} />;
}

function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    const mv = e => {
      if(dot.current){ dot.current.style.left=e.clientX+'px'; dot.current.style.top=e.clientY+'px'; }
      if(ring.current){ ring.current.style.left=e.clientX+'px'; ring.current.style.top=e.clientY+'px'; }
    };
    window.addEventListener('mousemove', mv);
    return () => window.removeEventListener('mousemove', mv);
  }, []);
  return <><div className="cursor" ref={dot}/><div className="cursor-ring" ref={ring}/></>;
}

/* Animated step wrapper */
function StepWrap({ stepKey, children }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), 30);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`onb-step-wrap ${vis ? 'visible' : ''}`} key={stepKey}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   PRAKRITI QUESTIONS DATA
───────────────────────────────────────── */
const PRAKRITI_QUESTIONS = [
  { q:"When something goes wrong, your mind:", opts:[
    { text:"Spirals and imagines worst cases", val:'vata' },
    { text:"Gets sharp and wants to fix it immediately", val:'pitta' },
    { text:"Goes quiet and withdraws slowly", val:'kapha' },
  ]},
  { q:"Your sleep is usually:", opts:[
    { text:"Light and broken — my mind races at night", val:'vata' },
    { text:"Fine to fall asleep but I wake up restless", val:'pitta' },
    { text:"Deep and heavy — hard to wake up", val:'kapha' },
  ]},
  { q:"Under pressure, your body feels:", opts:[
    { text:"Tight chest, dry mouth, butterflies", val:'vata' },
    { text:"Heat, flushed face, jaw tension", val:'pitta' },
    { text:"Heavy, slow, foggy, unmotivated", val:'kapha' },
  ]},
  { q:"Your energy through the day is:", opts:[
    { text:"Bursts and crashes — high then suddenly empty", val:'vata' },
    { text:"Strong and sustained until I burn out", val:'pitta' },
    { text:"Slow to start, steady once going", val:'kapha' },
  ]},
  { q:"When you have nothing to do, your mind:", opts:[
    { text:"Jumps between thoughts, plans, and worries", val:'vata' },
    { text:"Finds a problem to solve or something to improve", val:'pitta' },
    { text:"Drifts into daydreams or goes pleasantly blank", val:'kapha' },
  ]},
  { q:"You make decisions:", opts:[
    { text:"With difficulty — too many options overwhelm me", val:'vata' },
    { text:"Quickly and confidently — I trust my judgment", val:'pitta' },
    { text:"Very slowly — I need time before I commit", val:'kapha' },
  ]},
  { q:"You feel truly good when:", opts:[
    { text:"You feel free, inspired, and creative", val:'vata' },
    { text:"You feel accomplished, purposeful, and in control", val:'pitta' },
    { text:"You feel safe, loved, and stable", val:'kapha' },
  ]},
];

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */

// Step map:
// 0  = Safety gate
// 100 = Crisis screen
// 1  = Prakriti intro
// 2-8 = Q1-Q7 prakriti
// 9  = Prakriti reveal
// 10 = Concern framing
// 11 = Q8 concern cards
// 12 = Q9 duration
// 13 = Q10 prior experience
// 14 = Result screen 1
// 15 = Result screen 2 (The Why)
// 16 = Result screen 3 (Protocol + Save)

const TOTAL_QUESTION_STEPS = 13;

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [safetyAnswer, setSafetyAnswer] = useState(null);
  const [prakritiAnswers, setPrakritiAnswers] = useState({});
  const [prakriti, setPrakriti] = useState(null);
  const [concern, setConcern] = useState(null);
  const [duration, setDuration] = useState(null);
  const [priorExperience, setPriorExperience] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const pending = sessionStorage.getItem('sattva_pending_result');
    if (!pending) return;
    try {
      const data = JSON.parse(pending);
      sessionStorage.removeItem('sattva_pending_result');
      if (data.prakriti)        setPrakriti(data.prakriti);
      if (data.concern)         setConcern(data.concern);
      if (data.duration)        setDuration(data.duration);
      if (data.priorExperience) setPriorExperience(data.priorExperience);
      if (data.safetyAnswer)    setSafetyAnswer(data.safetyAnswer);
      if (data.prakritiAnswers) setPrakritiAnswers(data.prakritiAnswers);
      if (data.pendingStep)     setStep(data.pendingStep);
    } catch(e) {}
  }, []); // runs once on mount

  // Smooth step transition
  const goToStep = (next) => {
    if(transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setStep(next);
      setTransitioning(false);
    }, 280);
  };

  const progress = Math.min(100, (Math.min(step, TOTAL_QUESTION_STEPS) / TOTAL_QUESTION_STEPS) * 100);

  const goNext = () => {
    if(step === 0) {
      if(!safetyAnswer) return;
      if(safetyAnswer === 'd') { goToStep(100); return; }
      goToStep(1); return;
    }
    if(step === 1) { goToStep(2); return; }
    if(step >= 2 && step <= 7) {
      const qKey = `q${step - 1}`;
      if(!prakritiAnswers[qKey]) return;
      goToStep(step + 1); return;
    }
    if(step === 8) {
      const qKey = 'q7';
      if(!prakritiAnswers[qKey]) return;
      const p = computePrakriti(prakritiAnswers);
      setPrakriti(p);
      goToStep(9); return;
    }
    if(step === 9)  { goToStep(10); return; }
    if(step === 10) { goToStep(11); return; }
    if(step === 11) { if(!concern) return; goToStep(12); return; }
    if(step === 12) { if(!duration) return; goToStep(13); return; }
    if(step === 13) { if(!priorExperience) return; goToStep(14); return; }
    if(step === 14) { goToStep(15); return; }
    if(step === 15) { goToStep(16); return; }
  };

  const goBack = () => {
    if(step === 100) { setSafetyAnswer(null); goToStep(0); return; }
    if(step <= 1 || step >= 14) return;
    goToStep(step - 1);
  };

  const resetAll = () => {
    setSafetyAnswer(null); setPrakritiAnswers({}); setPrakriti(null);
    setConcern(null); setDuration(null); setPriorExperience(null);
    setSaving(false); setSaved(false); setSaveError('');
    goToStep(0);
  };

  const handleSave = async () => {
    if(saving || saved) return;
    setSaving(true); setSaveError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Save all answers before leaving so we can restore them after login
        sessionStorage.setItem('sattva_pending_result', JSON.stringify({
          prakriti,
          concern,
          duration,
          priorExperience,
          safetyAnswer,
          prakritiAnswers,
          pendingStep: 16  // bring them back to the protocol screen
        }));
        navigate('/login?redirect=/onboarding&saved=pending');
        return;
      }
      const primaryD = prakriti?.split('-')[0] || 'vata';
      const protocol = protocols[concern]?.[primaryD];
      const { error } = await supabase.from('assessment_results').upsert({
        user_id: session.user.id,
        prakriti, concern, duration,
        prior_experience: priorExperience,
        safety_answer: safetyAnswer,
        protocol_mantra: protocol?.mantra?.name || null,
        raw_answers: JSON.stringify({ prakritiAnswers, concern, duration, priorExperience }),
        created_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      if(error) {
        console.error('Assessment save error:', error);
        setSaveError('Could not save right now. You can still take a screenshot of your practice.');
      } else {
        setSaved(true);
        setTimeout(() => navigate('/'), 1600);
      }
    } catch(e) {
      console.error(e);
      setSaveError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  /* ── Crisis screen ── */
  if(step === 100) {
    return (
      <>
        <style>{FONTS + css}</style>
        <Cursor />
        <StarField />
        <div className="onb-crisis-wrap">
          <div className="onb-crisis-inner visible">
            <div className="onb-crisis-heading">You are not alone.</div>
            <div className="onb-crisis-sub">Help is available right now.</div>
            <div className="onb-crisis-grid">
              {[
                { name:"iCall — TISS", num:"9152987821", hours:"Monday to Saturday, 8am to 10pm", href:"tel:9152987821", label:"Call Now" },
                { name:"Vandrevala Foundation", num:"1860-2662-345", hours:"24 hours, 7 days", href:"tel:18602662345", label:"Call Now" },
                { name:"NIMHANS", num:"080-46110007", hours:"24 hours", href:"tel:08046110007", label:"Call Now" },
                { name:"iCall Chat Support", num:"icallhelpline.org", hours:"Chat support available", href:"https://icallhelpline.org", label:"Open Chat", external:true },
              ].map((r, i) => (
                <div key={i} className="onb-crisis-card">
                  <div className="onb-crisis-name">{r.name}</div>
                  <div className="onb-crisis-num">{r.num}</div>
                  <div className="onb-crisis-hours">{r.hours}</div>
                  <button className="onb-crisis-btn"
                    onClick={() => r.external ? window.open(r.href,'_blank') : window.location.href = r.href}>
                    {r.label}
                  </button>
                </div>
              ))}
            </div>
            <div style={{textAlign:'center'}}>
              <button className="onb-btn onb-btn-secondary" onClick={resetAll}>
                I am safe — take me back to Sattva
              </button>
            </div>
            <div className="onb-crisis-note">This page shows resources only. Sattva is not an emergency service.</div>
          </div>
        </div>
      </>
    );
  }

  /* ── Main flow ── */
  const showProgress = step > 0 && step < 14;
  const showBack = step > 1 && step < 14;
  const primaryDosha = prakriti?.split('-')[0] || 'vata';
  const protocol = concern ? protocols[concern]?.[primaryDosha] : null;

  return (
    <>
      <style>{FONTS + css}</style>
      <Cursor />
      <StarField />

      {showProgress && (
        <>
          <div className="onb-progress">
            <div className="onb-progress-fill" style={{width:`${progress}%`}} />
          </div>
          <div className="onb-stepcounter">
            {step <= 8 ? `Q ${step - 1} of 7` : step <= 13 ? `Q ${step - 9} of 4` : ''}
          </div>
        </>
      )}

      {showBack && (
        <button className="onb-back" onClick={goBack}>Back</button>
      )}

      <div className={`onb-screen ${transitioning ? 'onb-step-wrap exiting' : ''}`}>

        {/* ── STEP 0 — Safety gate ── */}
        {step === 0 && (
          <StepWrap stepKey="s0">
            <div className="onb-intro-wrap">
              <div className="onb-stage">Before we begin</div>
              <div className="onb-intro-head">How are you feeling <em>right now?</em></div>
              <div className="onb-options">
                {[
                  { id:'a', text:'I am going through a difficult time and looking for support' },
                  { id:'b', text:'I am okay but want to feel better than I do' },
                  { id:'c', text:'I am generally well and want to grow and deepen my practice' },
                  { id:'d', text:'I am in crisis right now and need immediate help', danger:true },
                ].map((opt, i) => (
                  <button key={opt.id} type="button" data-index={String.fromCharCode(65+i)}
                    className={`onb-opt ${opt.danger?'danger':''} ${safetyAnswer===opt.id?'selected':''}`}
                    onClick={() => setSafetyAnswer(opt.id)}>
                    {opt.text}
                  </button>
                ))}
              </div>
              {(safetyAnswer === 'a' || safetyAnswer === 'b' || safetyAnswer === 'c') && (
                <div className="onb-actions">
                  <button className="onb-btn onb-btn-primary" onClick={goNext}>Continue</button>
                </div>
              )}
              {safetyAnswer === 'd' && (
                <div className="onb-actions">
                  <button className="onb-btn onb-btn-primary" style={{borderColor:'rgba(224,112,112,0.5)',color:'#F9D1D1'}} onClick={goNext}>
                    Show me help resources
                  </button>
                </div>
              )}
            </div>
          </StepWrap>
        )}

        {/* ── STEP 1 — Prakriti intro ── */}
        {step === 1 && (
          <StepWrap stepKey="s1">
            <div className="onb-intro-wrap">
              <div className="onb-stage">Stage 1 of 2 — Prakriti</div>
              <div className="onb-intro-head">Understanding <em>your mind</em></div>
              <div className="onb-intro-body">
                Help us understand how your mind naturally works. There are no right or wrong answers — just honest ones.
                Choose the option that feels most like you, most of the time.
              </div>
              <div className="onb-actions">
                <button className="onb-btn onb-btn-primary" onClick={goNext}>Begin</button>
              </div>
            </div>
          </StepWrap>
        )}

        {/* ── STEPS 2–8 — Q1 to Q7 ── */}
        {step >= 2 && step <= 8 && (() => {
          const qIndex = step - 2;
          const qData = PRAKRITI_QUESTIONS[qIndex];
          const qKey = `q${step - 1}`;
          const current = prakritiAnswers[qKey];
          return (
            <StepWrap stepKey={`sq${step}`}>
              <div className="onb-stage">Stage 1 of 2 — Prakriti · {step - 1} of 7</div>
              <div className="onb-qhead">{qData.q}</div>
              <div className="onb-options">
                {qData.opts.map((opt, i) => (
                  <button key={opt.val} type="button" data-index={String.fromCharCode(65+i)}
                    className={`onb-opt ${current===opt.val?'selected':''}`}
                    onClick={() => setPrakritiAnswers(prev => ({...prev, [qKey]: opt.val}))}>
                    {opt.text}
                  </button>
                ))}
              </div>
              {current && (
                <div className="onb-actions">
                  <button className="onb-btn onb-btn-primary" onClick={goNext}>
                    {step === 8 ? 'See my profile →' : 'Continue'}
                  </button>
                </div>
              )}
            </StepWrap>
          );
        })()}

        {/* ── STEP 9 — Prakriti reveal ── */}
        {step === 9 && prakriti && (
          <StepWrap stepKey="s9">
            <div className="onb-result-label">Your constitution</div>
            <div className="onb-dosha-reveal">
              <div className="onb-dosha-name">{prakritiProfiles[prakriti]?.name}</div>
              <span className="onb-dosha-sk">{prakritiProfiles[prakriti]?.sk}</span>
              <div className="onb-dosha-text">{prakritiProfiles[prakriti]?.text}</div>
            </div>
            <div className="onb-actions">
              <button className="onb-btn onb-btn-primary" onClick={goNext}>Continue to your concerns →</button>
            </div>
          </StepWrap>
        )}

        {/* ── STEP 10 — Concern framing ── */}
        {step === 10 && (
          <StepWrap stepKey="s10">
            <div className="onb-intro-wrap">
              <div className="onb-stage">Stage 2 of 2 — Your concern</div>
              <div className="onb-intro-head">What are you <em>carrying?</em></div>
              <div className="onb-intro-body">
                Now tell us what you are carrying. Choose what resonates most honestly — this shapes everything we show you next.
              </div>
              <div className="onb-actions">
                <button className="onb-btn onb-btn-primary" onClick={goNext}>Continue</button>
              </div>
            </div>
          </StepWrap>
        )}

        {/* ── STEP 11 — Q8 Concern cards ── */}
        {step === 11 && (
          <StepWrap stepKey="s11">
            <div className="onb-stage">Stage 2 of 2 · 1 of 3</div>
            <div className="onb-qhead">What brings you to Sattva today?</div>
            <div className="onb-concern-grid">
              {Object.entries(concernMeta).map(([id, c]) => (
                <div key={id}
                  className={`onb-concern-card ${concern===id?'selected':''}`}
                  onClick={() => setConcern(id)}>
                  <div className="onb-concern-name">{c.name}</div>
                  <div className="onb-concern-sk">{c.sk}</div>
                  <div className="onb-concern-tag">{c.tag}</div>
                </div>
              ))}
            </div>
            {concern && (
              <div className="onb-actions">
                <button className="onb-btn onb-btn-primary" onClick={goNext}>Continue</button>
              </div>
            )}
          </StepWrap>
        )}

        {/* ── STEP 12 — Q9 Duration ── */}
        {step === 12 && (
          <StepWrap stepKey="s12">
            <div className="onb-stage">Stage 2 of 2 · 2 of 3</div>
            <div className="onb-qhead">How long have you been feeling this?</div>
            <div className="onb-options">
              {[
                { id:'recent',   text:'Just recently — days or weeks' },
                { id:'months',   text:'A few months now' },
                { id:'lifelong', text:'Most of my life, if I am honest' },
              ].map((opt, i) => (
                <button key={opt.id} type="button" data-index={String.fromCharCode(65+i)}
                  className={`onb-opt ${duration===opt.id?'selected':''}`}
                  onClick={() => setDuration(opt.id)}>
                  {opt.text}
                </button>
              ))}
            </div>
            {duration && (
              <div className="onb-actions">
                <button className="onb-btn onb-btn-primary" onClick={goNext}>Continue</button>
              </div>
            )}
          </StepWrap>
        )}

        {/* ── STEP 13 — Q10 Prior experience ── */}
        {step === 13 && (
          <StepWrap stepKey="s13">
            <div className="onb-stage">Stage 2 of 2 · 3 of 3</div>
            <div className="onb-qhead">What have you tried before?</div>
            <div className="onb-options">
              {[
                { id:'nothing',    text:'Nothing yet — this is new for me' },
                { id:'meditation', text:'Meditation or breathing exercises' },
                { id:'therapy',    text:'Therapy or counselling' },
                { id:'other',      text:'Other wellness or spiritual practices' },
              ].map((opt, i) => (
                <button key={opt.id} type="button" data-index={String.fromCharCode(65+i)}
                  className={`onb-opt ${priorExperience===opt.id?'selected':''}`}
                  onClick={() => setPriorExperience(opt.id)}>
                  {opt.text}
                </button>
              ))}
            </div>
            {priorExperience && (
              <div className="onb-actions">
                <button className="onb-btn onb-btn-primary" onClick={goNext}>Show me my results →</button>
              </div>
            )}
          </StepWrap>
        )}

        {/* ── STEP 14 — Result Screen 1 ── */}
        {step === 14 && prakriti && concern && (
          <StepWrap stepKey="s14">
            <div className="onb-result-label">Your profile</div>
            <div className="onb-dosha-name">{prakritiProfiles[prakriti]?.name}</div>
            <span className="onb-dosha-sk">{prakritiProfiles[prakriti]?.sk}</span>
            <div className="onb-dosha-text" style={{marginBottom:24}}>{prakritiProfiles[prakriti]?.text}</div>
            <div className="onb-divider" />
            <div className="onb-concern-reveal">You are carrying {concernMeta[concern]?.iks}</div>
            <div className="onb-framing" style={{marginTop:12}}>{durationCopy[duration]}</div>
            <div className="onb-framing">{priorCopy[priorExperience]}</div>
            <div className="onb-actions">
              <button className="onb-btn onb-btn-primary" onClick={goNext}>See what Sattva recommends →</button>
            </div>
          </StepWrap>
        )}

        {/* ── STEP 15 — Result Screen 2 — The Why ── */}
        {step === 15 && prakriti && concern && (
          <StepWrap stepKey="s15">
            <div className="onb-result-label">Why this is happening</div>
            <div className="onb-qhead" style={{fontSize:'clamp(26px,3.5vw,36px)', marginBottom:24}}>
              Through the <em>IKS lens</em>
            </div>
            <div className="onb-why-text">
              {whyMap[`${concern}-${primaryDosha}`] || ''}
            </div>
            <div className="onb-actions">
              <button className="onb-btn onb-btn-primary" onClick={goNext}>Show me my practice →</button>
            </div>
          </StepWrap>
        )}

        {/* ── STEP 16 — Result Screen 3 — Protocol ── */}
        {step === 16 && protocol && (
          <StepWrap stepKey="s16">
            <div className="onb-result-label">Your practice</div>
            <div className="onb-qhead" style={{fontSize:'clamp(30px,4vw,44px)', marginBottom:4}}>
              Your practice
            </div>
            <div className="onb-framing" style={{marginBottom:28}}>
              {prakritiProfiles[prakriti]?.name} · {concernMeta[concern]?.iks}
            </div>

            {/* Mantra */}
            <div className="onb-proto-section">
              <div className="onb-proto-label">Mantra</div>
              <div className="onb-mantra-name">{protocol.mantra.name}</div>
              <div className="onb-mantra-translit">{protocol.mantra.transliteration}</div>
              <div className="onb-mantra-meaning">{protocol.mantra.meaning}</div>
              <div className="onb-mantra-meta">{protocol.mantra.count} · {protocol.mantra.timing}</div>
            </div>

            <div className="onb-divider" />

            {/* Ahara */}
            <div className="onb-proto-section">
              <div className="onb-proto-label">Ahara — Diet</div>
              <div className="onb-food-label">Favour</div>
              <ul className="onb-food-list">
                {protocol.ahara.eat.map((item, i) => (
                  <li key={i} className="onb-food-item"><span className="dot-green"/>{item}</li>
                ))}
              </ul>
              <div className="onb-food-label">Reduce</div>
              <ul className="onb-food-list">
                {protocol.ahara.avoid.map((item, i) => (
                  <li key={i} className="onb-food-item"><span className="dot-red"/>{item}</li>
                ))}
              </ul>
            </div>

            <div className="onb-divider" />

            {/* Dinacharya */}
            <div className="onb-proto-section">
              <div className="onb-proto-label">Dinacharya — Daily Routine</div>
              <div className="onb-dina-row"><span className="onb-dina-icon">🌅</span>{protocol.dinacharya.morning}</div>
              <div className="onb-dina-row"><span className="onb-dina-icon">🌙</span>{protocol.dinacharya.evening}</div>
              <div className="onb-dina-row"><span className="onb-dina-icon">⭐</span>{protocol.dinacharya.sleep}</div>
            </div>

            <div className="onb-disclaimer">
              This guidance is rooted in traditional Ayurvedic wisdom. It is not medical advice.
              Consult a qualified BAMS physician for personalised Ayurvedic care.
            </div>

            <div className="onb-actions">
              <button className="onb-btn onb-btn-primary" onClick={handleSave} disabled={saving || saved}>
                {saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save my practice'}
              </button>
              <button className="onb-btn onb-btn-secondary" onClick={() => navigate('/')}>
                Return to Sattva
              </button>
            </div>
            {saveError && <div className="onb-save-error">{saveError}</div>}
          </StepWrap>
        )}

      </div>
    </>
  );
}