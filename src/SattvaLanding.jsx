import { useState, useEffect, useRef } from "react";
import { supabase } from './supabase';

// Safe navigation — works with or without React Router
function useNav() {
  let navigate = null;
  try {
    const { useNavigate } = require('react-router-dom');
    navigate = useNavigate();
  } catch(e) {}
  return (path) => {
    if (navigate) navigate(path);
    else window.location.href = path;
  };
}

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600;1,700&family=Outfit:wght@200;300;400;500;600&family=Noto+Serif+Devanagari:wght@300;400;500;600&display=swap');
`;

const css = `
  :root {
    --abyss:     #060E1A;
    --deep:      #0D1F35;
    --surface:   #112840;
    --mid:       #1A3A55;
    --moon:      #A8CCE0;
    --moon-dim:  #6B95AE;
    --gold:      #E2C27D;
    --gold-dim:  #B89A55;
    --pearl:     #D8EEF8;
    --pearl-dim: #8BAFC4;
    --glow:      rgba(168,204,224,0.12);
    --arch:      rgba(168,204,224,0.06);
  }

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; }

  body {
    background: var(--abyss);
    color: var(--pearl);
    font-family: 'Outfit', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
  }

  body::after {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 998; opacity: 0.4;
  }

  .cursor {
    width: 8px; height: 8px;
    background: var(--moon);
    border-radius: 50%;
    position: fixed; pointer-events: none;
    z-index: 9999;
    transform: translate(-50%,-50%);
    transition: left 0.06s, top 0.06s;
  }
  .cursor-ring {
    width: 28px; height: 28px;
    border: 1px solid rgba(168,204,224,0.3);
    border-radius: 50%;
    position: fixed; pointer-events: none;
    z-index: 9998;
    transform: translate(-50%,-50%);
    transition: left 0.14s ease-out, top 0.14s ease-out;
  }

  nav {
    position: fixed; top:0; left:0; right:0; z-index:100;
    padding: 0 72px; height: 72px;
    display: flex; align-items: center; justify-content: space-between;
    transition: all 0.5s;
  }
  nav.scrolled {
    background: rgba(6,14,26,0.96);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(168,204,224,0.08);
    height: 60px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.3);
  }
  .nav-brand { text-decoration: none; display: flex; flex-direction: column; justify-content: center; }
  .nav-brand-main {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 600;
    color: var(--pearl); letter-spacing: 5px;
    display: block; line-height: 1;
    text-transform: uppercase;
  }
  .nav-brand-main span { color: var(--gold); }
  .nav-brand-sub {
    font-size: 9px; letter-spacing: 3px;
    color: var(--moon-dim); text-transform: uppercase;
    font-weight: 400; margin-top: 4px; display: block;
  }
  .nav-links { display:flex; gap:36px; list-style:none; align-items: center; }
  .nav-links a {
    font-size: 11px; letter-spacing: 2px;
    color: var(--pearl-dim); text-decoration: none;
    text-transform: uppercase; transition: color 0.3s;
    font-weight: 400; line-height: 1;
  }
  .nav-links a:hover { color: var(--moon); }
  .nav-cta {
    background: transparent;
    border: 1px solid rgba(168,204,224,0.25);
    color: var(--moon); padding: 10px 24px;
    font-family: 'Outfit', sans-serif;
    font-size: 11px; font-weight: 500;
    letter-spacing: 2px; text-transform: uppercase;
    cursor: pointer; transition: all 0.3s; border-radius: 1px;
    white-space: nowrap;
  }
  .nav-cta:hover {
    background: rgba(168,204,224,0.08);
    border-color: var(--moon);
  }

  /* ── NAV USER STATE ── */
  .nav-user {
    display: flex; align-items: center; gap: 14px;
  }
  .nav-user-name {
    font-size: 12px; color: var(--moon-dim);
    letter-spacing: 1px; font-family: 'Outfit', sans-serif;
  }
  .nav-signout {
    background: transparent;
    border: 1px solid rgba(168,204,224,0.12);
    color: var(--pearl-dim); padding: 8px 18px;
    font-family: 'Outfit', sans-serif;
    font-size: 10px; letter-spacing: 2px;
    text-transform: uppercase; cursor: pointer;
    transition: all 0.3s; border-radius: 1px;
  }
  .nav-signout:hover {
    border-color: rgba(224,112,112,0.4);
    color: #E07070;
  }

  .hero {
    min-height: 100vh;
    display: grid; grid-template-columns: 1fr 1fr;
    position: relative; overflow: hidden;
    background: radial-gradient(ellipse at 20% 50%, rgba(13,31,53,0.8) 0%, var(--abyss) 70%);
  }
  .hero::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 70% 60%, rgba(168,204,224,0.04) 0%, transparent 55%),
      radial-gradient(ellipse at 30% 80%, rgba(226,194,125,0.03) 0%, transparent 45%);
    pointer-events: none;
  }
  .hero-left {
    display: flex; flex-direction: column;
    justify-content: center;
    padding: 140px 72px 140px;
    position: relative; z-index: 2;
  }
  .hero-eyebrow {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 40px;
  }
  .ey-line { width: 44px; height: 1px; background: var(--gold-dim); }
  .ey-text {
    font-size: 10px; letter-spacing: 4px;
    color: var(--gold); text-transform: uppercase; font-weight: 500;
  }
  .hero-sanskrit {
    font-family: 'Noto Serif Devanagari', serif;
    font-size: 22px; font-weight: 300;
    color: var(--moon-dim); letter-spacing: 3px;
    margin-bottom: 16px; line-height: 1;
    animation: fadeUp 1s 0.1s ease both;
  }
  .hero-brand {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(72px, 9vw, 120px);
    font-weight: 700; line-height: 0.9;
    color: var(--pearl); letter-spacing: 8px;
    text-transform: uppercase;
    margin-bottom: 36px;
    animation: fadeUp 1s 0.2s ease both;
  }
  .hero-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(20px, 2.5vw, 28px);
    font-weight: 400; line-height: 1.5;
    color: var(--moon); margin-bottom: 12px;
    font-style: italic;
    animation: fadeUp 1s 0.35s ease both;
  }
  .hero-subline {
    font-size: 15px; line-height: 1.85;
    color: var(--pearl-dim); font-weight: 300;
    max-width: 460px; margin-bottom: 52px;
    animation: fadeUp 1s 0.5s ease both;
  }
  .hero-ctas {
    display: flex; gap: 16px; flex-wrap: wrap;
    animation: fadeUp 1s 0.65s ease both;
  }

  /* ── HERO LOGGED IN WELCOME ── */
  .hero-welcome {
    display: flex; align-items: center; gap: 18px;
    padding: 20px 28px;
    background: rgba(13,31,53,0.5);
    border: 1px solid rgba(168,204,224,0.08);
    border-left: 2px solid var(--gold-dim);
    margin-bottom: 32px;
    animation: fadeUp 1s 0.5s ease both;
  }
  .hw-moon { font-size: 28px; line-height: 1; }
  .hw-text { font-family: 'Cormorant Garamond', serif; font-size: 19px; color: var(--pearl); line-height: 1.4; }
  .hw-text span { color: var(--gold); font-style: italic; }

  .btn-primary {
    background: linear-gradient(135deg, rgba(168,204,224,0.15), rgba(168,204,224,0.05));
    border: 1px solid rgba(168,204,224,0.35);
    color: var(--pearl); padding: 16px 40px;
    font-family: 'Outfit', sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 2.5px; text-transform: uppercase;
    cursor: pointer; transition: all 0.4s; border-radius: 1px;
    position: relative; overflow: hidden;
  }
  .btn-primary::before {
    content: '';
    position: absolute; inset: 0;
    background: rgba(168,204,224,0.08);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s;
  }
  .btn-primary:hover::before { transform: scaleX(1); }
  .btn-primary:hover { border-color: var(--moon); color: var(--moon); }
  .btn-ghost {
    background: transparent;
    border: none; color: var(--pearl-dim);
    padding: 16px 20px;
    font-family: 'Outfit', sans-serif;
    font-size: 12px; font-weight: 400;
    letter-spacing: 2px; text-transform: uppercase;
    cursor: pointer; transition: color 0.3s;
    text-decoration: underline; text-underline-offset: 4px;
    text-decoration-color: rgba(139,175,196,0.3);
  }
  .btn-ghost:hover { color: var(--moon); }

  .hero-right {
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .moon-container {
    position: relative; width: 420px; height: 420px;
  }
  .moon-glow {
    position: absolute; inset: -40px;
    background: radial-gradient(circle at center,
      rgba(168,204,224,0.08) 0%,
      rgba(168,204,224,0.04) 35%,
      transparent 70%
    );
    border-radius: 50%;
    animation: moonPulse 6s ease-in-out infinite;
  }
  @keyframes moonPulse {
    0%,100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
  }
  .moon-body {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 200px; height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle at 38% 35%,
      #E8F4FF 0%, #C8E0F0 25%, #A8CCE0 50%,
      #7AAEC8 75%, #4A82A0 100%
    );
    box-shadow:
      0 0 60px rgba(168,204,224,0.2),
      0 0 120px rgba(168,204,224,0.1),
      inset -20px -20px 40px rgba(74,130,160,0.4);
  }
  .moon-body::before {
    content: '';
    position: absolute;
    width: 32px; height: 32px;
    border-radius: 50%;
    background: rgba(74,130,160,0.3);
    top: 30%; left: 58%;
    box-shadow:
      -40px 20px 0 rgba(74,130,160,0.2),
      20px 50px 0 rgba(74,130,160,0.15),
      -20px -10px 0 20px rgba(74,130,160,0.1);
  }
  .nakshatra-ring {
    position: absolute; inset: 0;
    animation: spin 80s linear infinite;
  }
  .nakshatra-ring-2 {
    position: absolute; inset: 20px;
    animation: spin 120s linear infinite reverse;
    opacity: 0.5;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .n-dot {
    position: absolute;
    width: 3px; height: 3px;
    background: var(--moon);
    border-radius: 50%;
    top: 50%; left: 50%;
    transform-origin: 0 0;
    opacity: 0.6;
  }
  .n-dot.bright { background: var(--gold); width: 4px; height: 4px; opacity: 0.8; }
  .n-label {
    position: absolute;
    font-family: 'Noto Serif Devanagari', serif;
    font-size: 9px;
    color: rgba(168,204,224,0.35);
    top: 50%; left: 50%;
    white-space: nowrap;
    transform-origin: 0 0;
    pointer-events: none;
  }
  .ring-outer {
    position: absolute; inset: -10px;
    border-radius: 50%;
    border: 1px solid rgba(168,204,224,0.08);
  }
  .ring-mid {
    position: absolute; inset: 60px;
    border-radius: 50%;
    border: 1px solid rgba(168,204,224,0.06);
  }
  .ring-inner {
    position: absolute; inset: 90px;
    border-radius: 50%;
    border: 1px solid rgba(168,204,224,0.05);
  }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to { opacity:1; transform:translateY(0); }
  }

  .arch-divider {
    width: 100%; overflow: hidden;
    line-height: 0; display: block;
    position: relative; z-index: 2;
  }
  .arch-divider svg { display: block; width: 100%; }

  .sec-eyebrow {
    display: inline-flex; align-items: center;
    gap: 12px; margin-bottom: 20px;
  }
  .sec-ey-line { width: 32px; height: 1px; background: var(--gold-dim); }
  .sec-ey-text {
    font-size: 10px; letter-spacing: 4px;
    color: var(--gold); text-transform: uppercase; font-weight: 500;
  }
  .sec-ey-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--gold); flex-shrink: 0;
  }
  .sec-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 4.5vw, 58px);
    font-weight: 600; line-height: 1.15; color: var(--pearl);
  }
  .sec-heading em { font-style: italic; color: var(--gold); }
  .sec-heading .moon-text { color: var(--moon); }

  .reveal {
    opacity: 0; transform: translateY(36px);
    transition: opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1);
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-left {
    opacity: 0; transform: translateX(-36px);
    transition: opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1);
  }
  .reveal-left.visible { opacity: 1; transform: translateX(0); }
  .reveal-right {
    opacity: 0; transform: translateX(36px);
    transition: opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1);
  }
  .reveal-right.visible { opacity: 1; transform: translateX(0); }

  .problem {
    padding: 120px 72px;
    background: var(--deep);
    position: relative; overflow: hidden;
  }
  .problem-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 100px; align-items: center;
  }
  .problem-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 4vw, 52px);
    font-weight: 600; line-height: 1.2;
    color: var(--pearl); margin-bottom: 36px;
  }
  .problem-headline em { font-style: italic; color: var(--moon); }
  .problem-body { display: flex; flex-direction: column; gap: 20px; }
  .problem-body p {
    font-size: 16px; line-height: 1.9;
    color: var(--pearl-dim); font-weight: 300;
  }
  .problem-body p strong {
    color: var(--pearl); font-weight: 500;
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-style: italic;
  }
  .problem-quote {
    background: rgba(17,40,64,0.8);
    border: 1px solid rgba(168,204,224,0.08);
    padding: 52px 44px;
    position: relative; overflow: hidden;
  }
  .problem-quote::before {
    content: '"';
    position: absolute; top: -20px; left: 24px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 140px; color: rgba(168,204,224,0.05);
    line-height: 1; pointer-events: none;
  }
  .problem-quote::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
  }
  .pq-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-style: italic;
    font-weight: 400; line-height: 1.75;
    color: var(--moon); margin-bottom: 0;
  }
  .pq-line { width: 40px; height: 1px; background: var(--gold-dim); margin: 28px 0; }
  .pq-note { font-size: 13px; line-height: 1.8; color: var(--pearl-dim); font-weight: 300; }
  .moon-phases { display: flex; gap: 16px; align-items: center; margin-top: 40px; }
  .phase-item { text-align: center; }
  .phase-circle {
    width: 32px; height: 32px; border-radius: 50%;
    margin: 0 auto 6px; border: 1px solid rgba(168,204,224,0.2);
    position: relative; overflow: hidden;
  }
  .phase-circle::after {
    content: ''; position: absolute;
    top: 0; right: 0; bottom: 0;
    background: var(--deep);
  }
  .phase-label { font-size: 9px; letter-spacing: 1px; color: var(--pearl-dim); text-transform: uppercase; }

  .solution {
    padding: 120px 72px;
    background: var(--abyss);
    position: relative; overflow: hidden;
  }
  .solution::before {
    content: 'सत्त्व';
    position: absolute; top: 50%; right: -40px;
    transform: translateY(-50%);
    font-family: 'Noto Serif Devanagari', serif;
    font-size: 260px; color: rgba(168,204,224,0.025);
    line-height: 1; pointer-events: none;
  }
  .solution-inner { max-width: 1200px; margin: 0 auto; }
  .solution-header {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 80px; align-items: end; margin-bottom: 80px;
  }
  .solution-header p { font-size: 16px; line-height: 1.9; color: var(--pearl-dim); font-weight: 300; }
  .solution-header p em { font-style: italic; color: var(--moon); font-family: 'Cormorant Garamond', serif; font-size: 18px; }
  .sciences { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; }
  .science-card {
    background: rgba(13,31,53,0.6);
    padding: 44px 28px;
    position: relative; overflow: hidden;
    transition: all 0.5s cubic-bezier(0.16,1,0.3,1); cursor: pointer;
    border-bottom: 2px solid transparent;
  }
  .science-card::after {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 100%, rgba(168,204,224,0.08) 0%, transparent 65%);
    opacity: 0; transition: opacity 0.5s; pointer-events: none;
  }
  .science-card:hover { background: rgba(17,40,64,0.95); border-bottom-color: var(--gold); transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(168,204,224,0.05); }
  .science-card:hover::after { opacity: 1; }
  .science-card::before { content: attr(data-num); position: absolute; top: 20px; right: 20px; font-family: 'Cormorant Garamond', serif; font-size: 56px; font-weight: 700; color: rgba(168,204,224,0.04); line-height: 1; }
  .sc-sanskrit { font-family: 'Noto Serif Devanagari', serif; font-size: 28px; color: var(--moon); margin-bottom: 20px; display: block; opacity: 0.7; }
  .sc-num { font-size: 10px; letter-spacing: 3px; color: var(--gold); margin-bottom: 10px; display: block; text-transform: uppercase; }
  .sc-name { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 600; color: var(--pearl); margin-bottom: 8px; letter-spacing: 1px; }
  .sc-eng { font-size: 11px; letter-spacing: 2px; color: var(--moon-dim); margin-bottom: 18px; display: block; text-transform: uppercase; }
  .sc-desc { font-size: 13px; line-height: 1.8; color: var(--pearl-dim); font-weight: 300; }
  .sc-role { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(168,204,224,0.06); font-family: 'Cormorant Garamond', serif; font-size: 15px; font-style: italic; color: var(--gold); line-height: 1.5; }

  .journey { padding: 120px 72px; background: var(--deep); position: relative; overflow: hidden; }
  .journey-inner { max-width: 1200px; margin: 0 auto; }
  .journey-header { margin-bottom: 80px; }
  .journey-header p { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-style: italic; color: var(--moon-dim); margin-top: 20px; max-width: 560px; line-height: 1.7; }
  .entry-box { background: rgba(6,14,26,0.7); border: 1px solid rgba(168,204,224,0.08); padding: 48px 44px; margin-bottom: 64px; position: relative; }
  .entry-box::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-dim), transparent); }
  .entry-label { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 500; color: var(--pearl); margin-bottom: 28px; font-style: italic; }
  .entry-problems { display: flex; flex-wrap: wrap; gap: 10px; }
  .ep-btn { padding: 10px 22px; background: rgba(17,40,64,0.6); border: 1px solid rgba(168,204,224,0.1); color: var(--pearl-dim); font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 300; cursor: pointer; transition: all 0.3s; border-radius: 1px; letter-spacing: 0.5px; }
  .ep-btn:hover, .ep-btn.active { border-color: var(--moon); color: var(--moon); background: rgba(168,204,224,0.06); }
  .entry-note { margin-top: 20px; font-size: 12px; color: var(--pearl-dim); letter-spacing: 0.5px; font-style: italic; }
  .entry-note span { color: var(--gold); }
  .phases-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2px; margin-bottom: 64px; }
  .phase-card { padding: 48px 36px; background: rgba(6,14,26,0.5); border: 1px solid rgba(168,204,224,0.06); position: relative; transition: all 0.4s; }
  .phase-card:hover { background: rgba(13,31,53,0.8); border-color: rgba(168,204,224,0.12); }
  .phase-card.paid { border-color: rgba(226,194,125,0.08); }
  .phase-card.paid:hover { border-color: rgba(226,194,125,0.2); }
  .phase-num { font-family: 'Cormorant Garamond', serif; font-size: 72px; font-weight: 700; color: rgba(168,204,224,0.05); position: absolute; top: 16px; right: 20px; line-height: 1; }
  .phase-tag { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 10px; letter-spacing: 2px; font-weight: 600; text-transform: uppercase; margin-bottom: 24px; }
  .phase-tag.free { background: rgba(168,204,224,0.08); border: 1px solid rgba(168,204,224,0.2); color: var(--moon); }
  .phase-tag.paid-tag { background: rgba(226,194,125,0.08); border: 1px solid rgba(226,194,125,0.2); color: var(--gold); }
  .phase-icon { font-size: 36px; margin-bottom: 20px; display: block; }
  .phase-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; color: var(--pearl); margin-bottom: 14px; line-height: 1.2; }
  .phase-desc { font-size: 14px; line-height: 1.85; color: var(--pearl-dim); font-weight: 300; margin-bottom: 24px; }
  .phase-features { display: flex; flex-direction: column; gap: 8px; padding-top: 20px; border-top: 1px solid rgba(168,204,224,0.06); }
  .pf-item { font-size: 12px; color: var(--pearl-dim); display: flex; align-items: flex-start; gap: 10px; line-height: 1.5; }
  .pf-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--gold-dim); flex-shrink: 0; margin-top: 5px; }
  .thirty-days { background: rgba(6,14,26,0.7); border: 1px solid rgba(168,204,224,0.06); padding: 56px 52px; position: relative; overflow: hidden; }
  .thirty-days::after { content: '30'; position: absolute; bottom: -30px; right: -10px; font-family: 'Cormorant Garamond', serif; font-size: 200px; font-weight: 700; color: rgba(168,204,224,0.025); line-height: 1; pointer-events: none; }
  .td-header { margin-bottom: 48px; }
  .td-title { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 600; color: var(--pearl); margin-bottom: 12px; }
  .td-sub { font-size: 14px; color: var(--pearl-dim); line-height: 1.7; max-width: 480px; }
  .weeks { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; }
  .week { padding: 28px 22px; background: rgba(13,31,53,0.4); border-top: 2px solid transparent; transition: all 0.4s; position: relative; }
  .week:hover { background: rgba(17,40,64,0.8); border-top-color: var(--moon); }
  .week-num { font-family: 'Cormorant Garamond', serif; font-size: 11px; letter-spacing: 3px; color: var(--moon-dim); text-transform: uppercase; margin-bottom: 12px; display: block; }
  .week-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; color: var(--pearl); margin-bottom: 10px; }
  .week-desc { font-size: 13px; line-height: 1.75; color: var(--pearl-dim); font-weight: 300; }
  .daily-loop { margin-top: 40px; padding-top: 40px; border-top: 1px solid rgba(168,204,224,0.06); display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; }
  .dl-item { padding: 24px 20px; text-align: center; background: rgba(6,14,26,0.4); }
  .dl-icon { font-size: 24px; margin-bottom: 10px; display: block; }
  .dl-time { font-size: 10px; letter-spacing: 3px; color: var(--gold); text-transform: uppercase; margin-bottom: 8px; display: block; }
  .dl-action { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 500; color: var(--pearl); margin-bottom: 6px; }
  .dl-detail { font-size: 12px; color: var(--pearl-dim); line-height: 1.5; }

  .proof { padding: 120px 72px; background: var(--surface); position: relative; overflow: hidden; }
  .proof::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(ellipse at 80% 50%, rgba(168,204,224,0.04) 0%, transparent 60%); pointer-events: none; }
  .proof-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.2fr; gap: 100px; align-items: center; }
  .proof-frame { background: rgba(6,14,26,0.8); border: 1px solid rgba(168,204,224,0.08); padding: 52px 40px; position: relative; overflow: hidden; }
  .proof-frame::before { content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 3px; background: linear-gradient(180deg, transparent, var(--gold-dim), transparent); }
  .proof-stats { display: flex; flex-direction: column; gap: 32px; }
  .ps-num { font-family: 'Cormorant Garamond', serif; font-size: 52px; font-weight: 700; color: var(--moon); display: block; line-height: 1; margin-bottom: 8px; }
  .ps-label { font-size: 12px; color: var(--pearl-dim); letter-spacing: 1px; line-height: 1.5; }
  .ps-divider { width: 100%; height: 1px; background: rgba(168,204,224,0.06); }
  .proof-headline { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 3.5vw, 48px); font-weight: 600; line-height: 1.2; color: var(--pearl); margin-bottom: 32px; }
  .proof-headline em { font-style: italic; color: var(--gold); }
  .proof-body { display: flex; flex-direction: column; gap: 18px; margin-bottom: 40px; }
  .proof-body p { font-size: 15px; line-height: 1.9; color: var(--pearl-dim); font-weight: 300; }
  .proof-body p strong { color: var(--pearl); font-weight: 500; }
  .proof-body p em { font-style: italic; color: var(--moon); font-family: 'Cormorant Garamond', serif; font-size: 17px; }
  .proof-result { background: rgba(6,14,26,0.5); border: 1px solid rgba(168,204,224,0.08); border-left: 3px solid var(--gold-dim); padding: 24px 28px; }
  .pr-label { font-size: 10px; letter-spacing: 3px; color: var(--gold); text-transform: uppercase; margin-bottom: 10px; display: block; }
  .pr-words { display: flex; gap: 8px; flex-wrap: wrap; }
  .pr-word { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-style: italic; color: var(--moon); font-weight: 500; }
  .pr-sep { font-size: 22px; color: var(--pearl-dim); opacity: 0.3; align-self: center; }

  .cta-section { padding: 140px 72px; background: var(--abyss); text-align: center; position: relative; overflow: hidden; }
  .cta-section::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(168,204,224,0.05) 0%, transparent 70%); pointer-events: none; }
  .cta-arch { position: absolute; width: 600px; height: 300px; border: 1px solid rgba(168,204,224,0.04); border-radius: 300px 300px 0 0; top: 50%; left: 50%; transform: translate(-50%, -60%); pointer-events: none; }
  .cta-arch-2 { position: absolute; width: 900px; height: 450px; border: 1px solid rgba(168,204,224,0.025); border-radius: 450px 450px 0 0; top: 50%; left: 50%; transform: translate(-50%, -58%); pointer-events: none; }
  .cta-inner { max-width: 620px; margin: 0 auto; position: relative; z-index: 1; }
  .cta-moon { font-size: 48px; margin-bottom: 24px; display: block; animation: moonPulse 4s ease-in-out infinite; }
  .cta-headline { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 5vw, 62px); font-weight: 600; line-height: 1.1; color: var(--pearl); margin-bottom: 20px; }
  .cta-headline em { font-style: italic; color: var(--gold); }
  .cta-body { font-size: 16px; line-height: 1.85; color: var(--pearl-dim); font-weight: 300; margin-bottom: 48px; }
  .cta-body em { font-style: italic; color: var(--moon); font-family: 'Cormorant Garamond', serif; font-size: 18px; }
  .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 32px; }
  .cta-note { font-size: 11px; color: var(--pearl-dim); letter-spacing: 1px; line-height: 1.8; }
  .cta-note span { color: var(--moon-dim); }

  footer { background: rgba(0,0,0,0.5); border-top: 1px solid rgba(168,204,224,0.06); padding: 0 72px; height: 72px; display: flex; align-items: center; }
  .footer-inner { max-width: 1200px; margin: 0 auto; width: 100%; display: flex; justify-content: space-between; align-items: center; }
  .footer-brand { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; color: var(--pearl); letter-spacing: 4px; text-transform: uppercase; line-height: 1; }
  .footer-brand span { color: var(--gold); font-style: italic; }
  .footer-links { display: flex; gap: 28px; list-style: none; align-items: center; }
  .footer-links a { font-size: 11px; letter-spacing: 2px; color: var(--pearl-dim); text-decoration: none; text-transform: uppercase; transition: color 0.3s; font-weight: 400; line-height: 1; }
  .footer-links a:hover { color: var(--moon); }
  .footer-copy { font-size: 11px; color: rgba(139,175,196,0.3); line-height: 1; white-space: nowrap; }

  @media (max-width: 960px) {
    nav, nav.scrolled { padding: 14px 24px; }
    .nav-links { display: none; }
    .hero { grid-template-columns: 1fr; min-height: auto; }
    .hero-left { padding: 120px 24px 80px; }
    .hero-right { height: 320px; }
    .problem-inner, .solution-header, .proof-inner { grid-template-columns: 1fr; gap: 48px; }
    .sciences { grid-template-columns: 1fr 1fr; }
    .phases-grid { grid-template-columns: 1fr; }
    .weeks { grid-template-columns: 1fr 1fr; }
    .daily-loop { grid-template-columns: 1fr; }
    .problem, .solution, .journey, .proof, .cta-section { padding: 80px 24px; }
    footer { padding: 40px 24px; height: auto; }
    .footer-inner { flex-direction: column; gap: 20px; text-align: center; }
    body { cursor: auto; }
    .cursor, .cursor-ring { display: none; }
  }
`;

const NAKSHATRAS = ["अश्विनी","भरणी","कृत्तिका","रोहिणी","मृगशिरा","आर्द्रा","पुनर्वसु","पुष्य","आश्लेषा","मघा","पूर्वा","उत्तरा","हस्त","चित्रा","स्वाति","विशाखा","अनुराधा","ज्येष्ठा","मूल","पूर्वाषाढा","उत्तराषाढा","श्रवण","धनिष्ठा","शतभिषा","पूर्वभाद्र","उत्तरभाद्र","रेवती"];

function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    const mv = (e) => {
      if (dot.current) { dot.current.style.left = e.clientX+'px'; dot.current.style.top = e.clientY+'px'; }
      if (ring.current) { ring.current.style.left = e.clientX+'px'; ring.current.style.top = e.clientY+'px'; }
    };
    window.addEventListener('mousemove', mv);
    return () => window.removeEventListener('mousemove', mv);
  }, []);
  return (<><div className="cursor" ref={dot}/><div className="cursor-ring" ref={ring}/></>);
}

function MoonVisual() {
  const dots = Array.from({ length: 27 }, (_, i) => {
    const angle = (i / 27) * 360;
    const rad = (angle * Math.PI) / 180;
    const r = 190;
    return { x: Math.cos(rad) * r, y: Math.sin(rad) * r, angle, name: NAKSHATRAS[i], bright: i % 4 === 0 };
  });
  return (
    <div className="moon-container">
      <div className="moon-glow" />
      <div className="ring-outer" />
      <div className="ring-mid" />
      <div className="ring-inner" />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="-210 -210 420 420">
        {dots.map((d, i) => (
          <g key={i}>
            <circle cx={d.x} cy={d.y} r={d.bright ? 2.5 : 1.5} fill={d.bright ? '#E2C27D' : '#A8CCE0'} opacity={d.bright ? 0.8 : 0.5} />
            {d.bright && (
              <text x={d.x * 1.22} y={d.y * 1.22} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="rgba(168,204,224,0.3)" fontFamily="'Noto Serif Devanagari', serif" transform={`rotate(${d.angle + 90}, ${d.x * 1.22}, ${d.y * 1.22})`}>
                {d.name}
              </text>
            )}
          </g>
        ))}
        <circle cx="0" cy="0" r="190" fill="none" stroke="rgba(168,204,224,0.06)" strokeWidth="1" strokeDasharray="2 6" />
        <circle cx="0" cy="0" r="155" fill="none" stroke="rgba(226,194,125,0.04)" strokeWidth="1" />
      </svg>
      <div className="moon-body" />
    </div>
  );
}

function StarField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let ctx;
    try { ctx = canvas.getContext('2d'); } catch(e) { return; }
    if (!ctx) return;
    let W = canvas.width = canvas.offsetWidth || window.innerWidth;
    let H = canvas.height = canvas.offsetHeight || window.innerHeight;
    const resize = () => { W = canvas.width = canvas.offsetWidth || window.innerWidth; H = canvas.height = canvas.offsetHeight || window.innerHeight; };
    window.addEventListener('resize', resize);
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      dx: (Math.random() - 0.5) * 0.12,
      dy: -Math.random() * 0.15 - 0.04,
      opacity: Math.random() * 0.45 + 0.1,
      ts: Math.random() * 0.018 + 0.004,
      to: Math.random() * Math.PI * 2,
    }));
    let frame = 0, animId;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;
      stars.forEach(s => {
        const tw = Math.sin(frame * s.ts + s.to) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,204,224,${s.opacity * tw})`;
        ctx.fill();
        s.x += s.dx; s.y += s.dy;
        if (s.y < -5) { s.y = H + 5; s.x = Math.random() * W; }
        if (s.x < -5) s.x = W + 5;
        if (s.x > W + 5) s.x = -5;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return (
    <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, opacity: 0.65 }} />
  );
}

function useParallax() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const fn = () => setOffset(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return offset;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const ArchDivider = ({ from, to, flip = false }) => (
  <div className="arch-divider">
    <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ height: 80, transform: flip ? 'rotate(180deg)' : 'none' }}>
      <path d={`M0,0 C360,80 1080,80 1440,0 L1440,80 L0,80 Z`} fill={to} />
      <path d="M0,0 C360,80 1080,80 1440,0" fill="none" stroke="rgba(168,204,224,0.06)" strokeWidth="1" />
    </svg>
  </div>
);

export default function SattvaLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [activeProb, setActiveProb] = useState(null);
  const [user, setUser] = useState(null);           // ← AUTH STATE
  const scrollY = useParallax();
  const navigate = useNav();
  useReveal();

  // ── Auth listener ──────────────────────────────────────
  useEffect(() => {
    // Get existing session on first load (handles OAuth redirect)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    // Listen for any future login / logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || '';

  return (
    <>
      <style>{FONTS + css}</style>
      <Cursor />
      <StarField />

      {/* ── NAV ── */}
      <nav className={scrolled ? 'scrolled' : ''}>
        <a className="nav-brand" href="#">
          <span className="nav-brand-main">SATTVA</span>
          <span className="nav-brand-sub">sattvaheals.in · Indian Knowledge System</span>
        </a>
        <ul className="nav-links">
          {[
            ['The System', '/about'],
            ['Your Journey', '/how-it-works'],
            ['Our Jyotishis', '/team'],
          ].map(([l, path]) => (
            <li key={l}><a href="#" onClick={e => { e.preventDefault(); navigate(path); }}>{l}</a></li>
          ))}
        </ul>

        {/* ── Show user name + sign out if logged in, else CTA ── */}
        {user ? (
          <div className="nav-user">
            <span className="nav-user-name">🌙 {userName}</span>
            <button className="nav-signout" onClick={handleSignOut}>Sign out</button>
          </div>
        ) : (
          <button className="nav-cta" onClick={() => navigate('/signup')}>Begin — it's free</button>
        )}
      </nav>

      {/* ── SECTION 1: HERO ── */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <div className="ey-line" />
            <span className="ey-text">sattvaheals.in</span>
          </div>
          <div className="hero-sanskrit">सत्त्व</div>
          <div className="hero-brand">SATTVA</div>
          <h1 className="hero-headline">
            5,000 years of mind science.<br />
            Built for the one mind that matters — yours.
          </h1>
          <p className="hero-subline">
            Ancient India never separated the stars from the soul,
            the body from the mind, or wisdom from healing.
            SATTVA doesn't either.
          </p>

          {/* ── Logged-in welcome strip ── */}
          {user && (
            <div className="hero-welcome">
              <span className="hw-moon">🌙</span>
              <div className="hw-text">
                Welcome back, <span>{userName}.</span><br />
                Your healing continues where you left it.
              </div>
            </div>
          )}

          <div className="hero-ctas">
            {user ? (
              <>
                <button className="btn-primary" onClick={() => navigate('/how-it-works')}>Continue your journey</button>
                <button className="btn-ghost" onClick={() => navigate('/consult')}>Book a consultation</button>
              </>
            ) : (
              <>
                <button className="btn-primary" onClick={() => navigate('/signup')}>Begin — it's free</button>
                <button className="btn-ghost" onClick={() => navigate('/how-it-works')}>How it works</button>
              </>
            )}
          </div>
        </div>
        <div className="hero-right">
          <div style={{ transform: `translateY(${scrollY * 0.18}px)`, transition: 'transform 0.1s linear' }}>
            <MoonVisual />
          </div>
        </div>
      </section>

      <ArchDivider from="#060E1A" to="#0D1F35" />

      {/* ── SECTION 2: PROBLEM ── */}
      <section className="problem">
        <div className="problem-inner">
          <div className="problem-left reveal-left">
            <div className="sec-eyebrow">
              <div className="sec-ey-line" />
              <span className="sec-ey-text">We see you</span>
            </div>
            <h2 className="problem-headline">
              You don't always know<br />
              <em>what's wrong.</em><br />
              You just know something is.
            </h2>
            <div className="problem-body">
              <p>Not every wound has a name.<br />Not every storm announces itself.</p>
              <p>
                Sometimes the mind just goes quiet —<br />
                not from peace,<br />
                but from not knowing<br />
                <strong>where to even begin.</strong>
              </p>
              <p>
                You're not lost.<br />
                You're unread.<br /><br />
                And there is a difference.
              </p>
            </div>
          </div>
          <div className="problem-right reveal-right">
            <div className="problem-quote">
              <p className="pq-text">
                "Chandra is Manas —<br />
                the Moon is the mind itself.<br />
                When the Moon is afflicted,<br />
                the mind suffers.<br />
                When it is nourished,<br />
                the mind flourishes."
              </p>
              <div className="pq-line" />
              <p className="pq-note">
                Ancient India built an entire science around this truth.
                Jyotisha, Ayurveda, Yoga and Mantra were never separate disciplines —
                they were one complete answer to the question every generation asks:
                <br /><br />
                <em style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, color: '#A8CCE0', fontStyle: 'italic' }}>
                  "Why do I feel this way, and what do I do about it?"
                </em>
              </p>
            </div>
          </div>
        </div>
      </section>

      <ArchDivider from="#0D1F35" to="#060E1A" />

      {/* ── SECTION 3: SOLUTION ── */}
      <section className="solution">
        <div className="solution-inner">
          <div className="solution-header reveal">
            <div>
              <div className="sec-eyebrow">
                <div className="sec-ey-line" />
                <span className="sec-ey-text">The ancient answer</span>
              </div>
              <h2 className="sec-heading">
                The map has always existed.<br />
                <em>Nobody showed it to you.</em>
              </h2>
            </div>
            <p>
              For 5,000 years, India built a complete science of the human mind.
              Not one framework — <em>four.</em> Each one precise. Each one personal.
              Together, calibrated to your Moon, your constitution, your moment in time — <em>complete.</em>
            </p>
          </div>
          <div className="sciences">
            {[
              { sk: 'ज्योतिष', num: '01', name: 'Jyotisha', eng: 'Planetary Science', desc: 'Your birth chart is not fate — it is a precise map of your psychological architecture. The Moon\'s position, its afflictions, and the Dasha system reveal exactly why your mind works the way it does.', role: 'Jyotisha reads your blueprint.' },
              { sk: 'आयुर्वेद', num: '02', name: 'Ayurveda', eng: 'Science of Life', desc: 'Your Prakriti — your unique mind-body constitution — determines which foods, herbs and routines heal your specific nervous system. No generic advice. Your body. Your protocol.', role: 'Ayurveda heals your constitution.' },
              { sk: 'योग', num: '03', name: 'Yoga', eng: 'Union', desc: 'Not generic yoga. Specific asana sequences and pranayama mapped to your Dosha and Moon affliction — for your imbalance, your nervous system, your healing.', role: 'Yoga steadies your nervous system.' },
              { sk: 'मन्त्र', num: '04', name: 'Mantra', eng: 'Sound as Medicine', desc: 'Planetary mantras are precision instruments. The right mantra for your affliction, practiced with consistency, rewires deep mental patterns that no amount of thinking can reach.', role: 'Mantra rewires the patterns.' },
            ].map((s, i) => (
              <div className="science-card reveal" key={s.name} data-num={s.num} style={{ transitionDelay: `${i * 0.12}s` }}>
                <span className="sc-sanskrit">{s.sk}</span>
                <span className="sc-num">{s.num}</span>
                <div className="sc-name">{s.name}</div>
                <span className="sc-eng">{s.eng}</span>
                <p className="sc-desc">{s.desc}</p>
                <div className="sc-role">{s.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ArchDivider from="#060E1A" to="#0D1F35" />

      {/* ── SECTION 4: JOURNEY ── */}
      <section className="journey">
        <div className="journey-inner">
          <div className="journey-header reveal">
            <div className="sec-eyebrow">
              <div className="sec-ey-line" />
              <span className="sec-ey-text">Your journey</span>
            </div>
            <h2 className="sec-heading">
              Your practice.<br />
              Your pace.<br />
              <em>Your choice.</em>
            </h2>
            <p>Tell us what you're carrying. We'll show you the path. You choose how to walk it.</p>
          </div>

          <div className="entry-box reveal">
            <div className="entry-label">What are you carrying right now?</div>
            <div className="entry-problems">
              {['Anxiety', 'Aggression', 'Overthinking', 'Stress', 'Fear', 'Grief', 'Confusion', 'Insecurity', 'Lack of clarity', 'Emotional exhaustion'].map(p => (
                <button key={p} className={`ep-btn ${activeProb === p ? 'active' : ''}`} onClick={() => setActiveProb(p)}>{p}</button>
              ))}
            </div>
            <div className="entry-note">
              Select what resonates. SATTVA will build your personal path.
              <span> Your profile is built from your answer.</span>
            </div>
          </div>

          <div className="phases-grid">
            {[
              { num: '01', tag: 'free', icon: '🌙', title: 'Phase One', subtitle: 'Know yourself. Begin your practice.', desc: 'We build your complete profile — your Moon sign, Prakriti, and the patterns your chart reveals. Then we give you your personal path across all four sciences.', features: ['Prakriti assessment — your mind-body constitution', 'Moon & Nakshatra analysis', 'Personalised problem-to-practice mapping', 'Choose up to 4 practices', '30 days. One new practice unlocked each week'], duration: '30 Days · Free' },
              { num: '02', tag: 'paid', icon: '☿', title: 'Phase Two', subtitle: 'Evolve your mind.', desc: 'Beyond healing — becoming. Phase Two works on Mercury, the planet of thought. Structured thinking, philosophy, mental clarity. For those ready to build a mind that doesn\'t break.', features: ['Mercury-based cognitive practices', 'Philosophy & structured thinking', 'Advanced pranayama protocols', 'Mental clarity rituals', 'Guided reflection practices'], duration: 'After Phase 1 · Paid' },
              { num: '03', tag: 'paid', icon: '🪬', title: 'Phase Three', subtitle: 'One conversation. A clear path forward.', desc: 'Direct 1-on-1 with our Jyotishi. Your complete chart, your current Dasha, your specific struggles — read, understood, and answered in a single session.', features: ['Full birth chart consultation', 'Current Dasha & transit reading', 'Personalised remedy prescription', 'Direct guidance from our Jyotishi', 'Available after Phase 1'], duration: 'After Phase 1 · Paid' },
            ].map((ph, i) => (
              <div className={`phase-card reveal ${ph.tag === 'paid' ? 'paid' : ''}`} key={ph.num} style={{ transitionDelay: `${i * 0.15}s` }}>
                <div className="phase-num">{ph.num}</div>
                <span className={`phase-tag ${ph.tag === 'free' ? 'free' : 'paid-tag'}`}>{ph.duration}</span>
                <span className="phase-icon">{ph.icon}</span>
                <div className="phase-title">{ph.title}</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17, fontStyle: 'italic', color: 'var(--moon)', marginBottom: 14 }}>{ph.subtitle}</div>
                <p className="phase-desc">{ph.desc}</p>
                <div className="phase-features">
                  {ph.features.map(f => (<div className="pf-item" key={f}><div className="pf-dot" /><span>{f}</span></div>))}
                </div>
              </div>
            ))}
          </div>

          <div className="thirty-days reveal">
            <div className="td-header">
              <div className="td-title">The 30-Day Experience</div>
              <p className="td-sub">Phase One doesn't overwhelm you. It builds you — one week, one practice at a time. Consistency over intensity. Always.</p>
            </div>
            <div className="weeks">
              {[
                { num: 'Week 01', title: 'The First Step', desc: 'You don\'t need to do everything. You just need to begin. One practice. Chosen by you. Small enough to start. Powerful enough to matter. This week you plant the seed.' },
                { num: 'Week 02', title: 'The First Shift', desc: 'Something has changed. You might not name it yet. But it\'s there. A second practice unlocks. The first one is now yours. You\'re building something real.' },
                { num: 'Week 03', title: 'The Deepening', desc: 'This is where most people have given up before. Not here. Not anymore. A third practice enters your life. The noise is getting quieter. The clarity is getting closer.' },
                { num: 'Week 04', title: 'The Arrival', desc: 'You came with a blank mind. Look at you now. Four practices. Thirty days. A routine that is entirely, completely, yours. This is just the beginning.' },
              ].map((w, i) => (
                <div className="week" key={w.num} style={{ transitionDelay: `${i * 0.1}s` }}>
                  <span className="week-num">{w.num}</span>
                  <div className="week-title">{w.title}</div>
                  <p className="week-desc">{w.desc}</p>
                </div>
              ))}
            </div>
            <div className="daily-loop">
              {[
                { icon: '🌅', time: 'Morning', action: 'Daily Check-in', detail: '"How are you feeling today?" — your practice for the day, based on your answer.' },
                { icon: '🌙', time: 'Anytime', action: 'Moon Calendar', detail: "Today's Moon energy and what it means for your mind, your body, your practice." },
                { icon: '🌌', time: 'Evening', action: 'Evening Reflection', detail: 'One question before you sleep. One moment to close the day with intention.' },
              ].map((dl) => (
                <div className="dl-item" key={dl.time}>
                  <span className="dl-icon">{dl.icon}</span>
                  <span className="dl-time">{dl.time}</span>
                  <div className="dl-action">{dl.action}</div>
                  <p className="dl-detail">{dl.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ArchDivider from="#0D1F35" to="#112840" />

      {/* ── SECTION 5: PROOF ── */}
      <section className="proof">
        <div className="proof-inner">
          <div className="proof-visual reveal-left">
            <div className="proof-frame">
              <div className="proof-stats">
                <div className="ps-item">
                  <span className="ps-num">Thousands+</span>
                  <div className="ps-label">Consultations across our founding Jyotishis.<br />Real people. Real journeys.</div>
                </div>
                <div className="ps-divider" />
                <div className="ps-item">
                  <span className="ps-num">5,000+</span>
                  <div className="ps-label">Years of IKS wisdom distilled into one platform.</div>
                </div>
                <div className="ps-divider" />
                <div className="ps-item">
                  <span className="ps-num">4</span>
                  <div className="ps-label">Ancient sciences. One complete system. Yours.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="proof-content reveal-right">
            <div className="sec-eyebrow">
              <div className="sec-ey-line" />
              <span className="sec-ey-text">Built on lived wisdom</span>
            </div>
            <h2 className="proof-headline">
              Built on decades of wisdom.<br />
              <em>Practiced on thousands of real lives.</em>
            </h2>
            <div className="proof-body">
              <p>Not a startup. Not an algorithm. Not a team of designers who read about Ayurveda online.</p>
              <p>SATTVA is built by <strong>practicing Jyotishis</strong> guided by masters with experience across thousands of consultations — because the gap between ancient wisdom and the people who need it became impossible to ignore.</p>
              <p>Every Moon affliction pattern. Every protocol. Every word on this platform — <strong>witnessed in real people, carrying real weight, over decades of practice.</strong></p>
            </div>
            <div className="proof-result">
              <span className="pr-label">What we build toward</span>
              <div className="pr-words">
                <span className="pr-word">Confident</span>
                <span className="pr-sep">·</span>
                <span className="pr-word">Clear</span>
                <span className="pr-sep">·</span>
                <span className="pr-word">At peace</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ArchDivider from="#112840" to="#060E1A" />

      {/* ── SECTION 6: CTA ── */}
      <section className="cta-section">
        <div className="cta-arch" />
        <div className="cta-arch-2" />
        <div className="cta-inner reveal">
          <span className="cta-moon">🌙</span>
          <h2 className="cta-headline">
            Whenever<br />
            <em>you're ready.</em>
          </h2>
          <p className="cta-body">
            There's no perfect moment to begin.<br />
            There never is.<br /><br />
            But you're here.<br />
            And that's already <em>something.</em><br /><br />
            {user
              ? <>Welcome back, <em>{userName}.</em><br />Your practice continues — one step at a time.</>
              : <>Create your free account.<br />Your journey starts gently — at your own pace, in your own time.</>
            }
          </p>
          <div className="cta-btns">
            {user ? (
              <>
                <button className="btn-primary" onClick={() => navigate('/how-it-works')}>Continue your journey</button>
                <button className="btn-ghost" onClick={() => navigate('/consult')}>Book a consultation</button>
              </>
            ) : (
              <>
                <button className="btn-primary" onClick={() => navigate('/signup')}>Begin — it's free</button>
                <button className="btn-ghost" onClick={() => navigate('/consult')}>Book a consultation</button>
              </>
            )}
          </div>
          <div className="cta-note">
            <span>Free account required</span> · Your data is never sold ·
            <span> Rooted in 5,000 years of IKS</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-inner">
          <div className="footer-brand">SATTVA<span>heals</span></div>
          <ul className="footer-links">
            {[
              ['The System', '/about'],
              ['Your Journey', '/how-it-works'],
              ['Moon Engine', '/about#moon'],
              ['Shlokas', '/about#shlokas'],
              ['Consult', '/consult'],
              ['About', '/team'],
            ].map(([l, path]) => (
              <li key={l}><a href="#" onClick={e => { e.preventDefault(); navigate(path); }}>{l}</a></li>
            ))}
          </ul>
          <div className="footer-copy">
            SATTVA provides traditional wellness content rooted in Ayurveda, Yoga, Jyotish, and Mantra.
            It is not a medical service, mental health establishment, or substitute for professional care.
            If you are experiencing a mental health crisis, call iCall: 9152987821.
            {' '}· © 2026 SATTVA HEALS · sattvaheals.in
          </div>
        </div>
      </footer>
    </>
  );
}