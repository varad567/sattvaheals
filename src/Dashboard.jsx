import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';

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
    --red:       #E07070;
  }

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body {
    background:var(--abyss); color:var(--pearl);
    font-family:'Outfit',sans-serif; font-weight:300;
    overflow-x:hidden; min-height:100vh;
  }
  body::after {
    content:''; position:fixed; inset:0;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events:none; z-index:998; opacity:0.4;
  }

  /* Cursor */
  .cursor { width:8px; height:8px; background:var(--moon); border-radius:50%; position:fixed; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); transition:left 0.06s,top 0.06s; }
  .cursor-ring { width:28px; height:28px; border:1px solid rgba(168,204,224,0.3); border-radius:50%; position:fixed; pointer-events:none; z-index:9998; transform:translate(-50%,-50%); transition:left 0.14s ease-out,top 0.14s ease-out; }

  /* Nav */
  .db-nav {
    position:fixed; top:0; left:0; right:0; z-index:100;
    height:64px; padding:0 48px;
    display:flex; align-items:center; justify-content:space-between;
    background:rgba(6,14,26,0.92);
    backdrop-filter:blur(20px);
    border-bottom:1px solid rgba(168,204,224,0.06);
  }
  .db-nav-brand {
    font-family:'Cormorant Garamond',serif;
    font-size:18px; font-weight:600;
    color:var(--pearl); letter-spacing:4px; text-transform:uppercase;
    text-decoration:none;
  }
  .db-nav-brand span { color:var(--gold); }
  .db-nav-right { display:flex; align-items:center; gap:20px; }
  .db-nav-user {
    font-size:12px; letter-spacing:1.5px; color:var(--pearl-dim);
    text-transform:uppercase;
  }
  .db-nav-btn {
    background:transparent;
    border:1px solid rgba(168,204,224,0.12);
    color:var(--pearl-dim); padding:7px 18px;
    font-size:10px; letter-spacing:2px; text-transform:uppercase;
    cursor:pointer; font-family:'Outfit',sans-serif;
    border-radius:1px; transition:all 0.25s;
  }
  .db-nav-btn:hover { border-color:rgba(168,204,224,0.35); color:var(--moon); }
  .db-nav-btn.primary {
    border-color:rgba(226,194,125,0.3); color:var(--gold);
  }
  .db-nav-btn.primary:hover { border-color:var(--gold); background:rgba(226,194,125,0.06); }

  /* Page wrapper */
  .db-wrap {
    min-height:100vh;
    padding:96px 48px 80px;
    max-width:1100px; margin:0 auto;
    position:relative; z-index:10;
  }

  /* Fade in */
  .db-fadein {
    opacity:0; transform:translateY(16px);
    animation:dbFadeIn 0.6s cubic-bezier(0.4,0,0.2,1) forwards;
  }
  @keyframes dbFadeIn {
    to { opacity:1; transform:translateY(0); }
  }
  .db-fadein-1 { animation-delay:0.05s; }
  .db-fadein-2 { animation-delay:0.15s; }
  .db-fadein-3 { animation-delay:0.25s; }
  .db-fadein-4 { animation-delay:0.35s; }
  .db-fadein-5 { animation-delay:0.45s; }

  /* Section label */
  .db-section-label {
    font-size:9px; letter-spacing:4px; text-transform:uppercase;
    color:var(--moon-dim); margin-bottom:6px;
    display:flex; align-items:center; gap:12px;
  }
  .db-section-label::before { content:''; width:20px; height:1px; background:var(--gold-dim); }

  /* ─── HEADER BAND ─── */
  .db-header {
    display:flex; align-items:flex-end; justify-content:space-between;
    flex-wrap:wrap; gap:20px;
    margin-bottom:48px;
    padding-bottom:32px;
    border-bottom:1px solid rgba(168,204,224,0.07);
  }
  .db-greeting {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(28px,4vw,42px); font-weight:400;
    color:var(--pearl); line-height:1.2;
  }
  .db-greeting em { color:var(--gold); font-style:italic; }
  .db-prakriti-badge {
    display:inline-flex; align-items:center; gap:10px;
    margin-top:10px;
  }
  .db-badge-dosha {
    font-family:'Cormorant Garamond',serif;
    font-size:13px; letter-spacing:3px; text-transform:uppercase;
    color:var(--gold);
    border:1px solid rgba(226,194,125,0.3);
    padding:5px 14px; border-radius:999px;
  }
  .db-badge-concern {
    font-size:12px; letter-spacing:1.5px;
    color:var(--pearl-dim);
    border:1px solid rgba(168,204,224,0.1);
    padding:5px 14px; border-radius:999px;
  }

  /* ─── GRID ─── */
  .db-grid {
    display:grid;
    grid-template-columns:1fr 340px;
    gap:20px;
    align-items:start;
  }
  .db-grid-left { display:flex; flex-direction:column; gap:20px; }
  .db-grid-right { display:flex; flex-direction:column; gap:20px; }

  /* ─── CARD ─── */
  .db-card {
    background:rgba(13,31,53,0.7);
    border:1px solid rgba(168,204,224,0.08);
    border-radius:16px;
    padding:28px 28px 26px;
    backdrop-filter:blur(10px);
    transition:border-color 0.25s;
  }
  .db-card:hover { border-color:rgba(168,204,224,0.14); }
  .db-card-head {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:20px;
  }
  .db-card-title {
    font-family:'Cormorant Garamond',serif;
    font-size:20px; color:var(--pearl); font-weight:500;
  }
  .db-card-icon { font-size:20px; opacity:0.7; }

  /* ─── MANTRA CARD ─── */
  .db-mantra-name {
    font-family:'Cormorant Garamond',serif;
    font-size:26px; color:var(--gold);
    margin-bottom:6px;
  }
  .db-mantra-translit {
    font-size:13px; color:var(--pearl-dim);
    font-style:italic; line-height:1.7;
    margin-bottom:12px;
  }
  .db-mantra-meaning {
    font-size:14px; color:var(--pearl); line-height:1.8;
    margin-bottom:12px;
  }
  .db-mantra-meta {
    font-size:11px; letter-spacing:1px;
    color:var(--moon-dim);
    border-top:1px solid rgba(168,204,224,0.07);
    padding-top:10px; margin-top:4px;
  }

  /* ─── CHECKLIST CARD ─── */
  .db-checklist { display:flex; flex-direction:column; gap:10px; }
  .db-check-item {
    display:flex; align-items:flex-start; gap:12px;
    padding:12px 14px; border-radius:10px;
    background:rgba(6,14,26,0.5);
    border:1px solid rgba(168,204,224,0.06);
    cursor:pointer; transition:all 0.2s;
    text-align:left; width:100%;
  }
  .db-check-item:hover { border-color:rgba(168,204,224,0.15); background:rgba(13,31,53,0.7); }
  .db-check-item.done {
    background:rgba(110,203,160,0.05);
    border-color:rgba(110,203,160,0.2);
  }
  .db-check-box {
    width:20px; height:20px; flex-shrink:0;
    border-radius:50%;
    border:1.5px solid rgba(168,204,224,0.2);
    display:flex; align-items:center; justify-content:center;
    margin-top:1px; transition:all 0.2s;
    font-size:10px;
  }
  .db-check-item.done .db-check-box {
    background:var(--green); border-color:var(--green); color:var(--abyss);
  }
  .db-check-label {
    font-size:13px; color:var(--pearl-dim); line-height:1.55;
    transition:color 0.2s;
  }
  .db-check-item.done .db-check-label {
    color:rgba(110,203,160,0.8); text-decoration:line-through;
    text-decoration-color:rgba(110,203,160,0.3);
  }
  .db-check-tag {
    font-size:9px; letter-spacing:2px; text-transform:uppercase;
    color:var(--moon-dim); margin-top:2px; display:block;
  }
  .db-check-progress {
    margin-top:14px; height:2px;
    background:rgba(168,204,224,0.07);
    border-radius:999px; overflow:hidden;
  }
  .db-check-progress-fill {
    height:100%; background:var(--green);
    border-radius:999px; transition:width 0.5s cubic-bezier(0.4,0,0.2,1);
  }
  .db-check-progress-text {
    font-size:10px; letter-spacing:1.5px; text-transform:uppercase;
    color:var(--pearl-dim); text-align:right; margin-top:6px;
  }

  /* ─── AHARA CARD ─── */
  .db-food-group { margin-bottom:14px; }
  .db-food-group:last-child { margin-bottom:0; }
  .db-food-group-label {
    font-size:9px; letter-spacing:3px; text-transform:uppercase;
    color:var(--pearl-dim); margin-bottom:8px;
  }
  .db-food-list { display:flex; flex-direction:column; gap:5px; }
  .db-food-item {
    display:flex; align-items:flex-start; gap:9px;
    font-size:13px; color:var(--pearl-dim); line-height:1.5;
  }
  .dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; margin-top:5px; }
  .dot-green { background:var(--green); }
  .dot-red { background:var(--red); }

  /* ─── MOON CARD ─── */
  .db-moon-display {
    display:flex; align-items:center; gap:20px; margin-bottom:16px;
  }
  .db-moon-emoji {
    font-size:52px; line-height:1;
    filter:drop-shadow(0 0 12px rgba(168,204,224,0.4));
    animation:moonPulse 4s ease-in-out infinite;
  }
  @keyframes moonPulse {
    0%,100% { filter:drop-shadow(0 0 8px rgba(168,204,224,0.3)); }
    50%      { filter:drop-shadow(0 0 20px rgba(168,204,224,0.6)); }
  }
  .db-moon-info {}
  .db-moon-phase-name {
    font-family:'Cormorant Garamond',serif;
    font-size:22px; color:var(--pearl); margin-bottom:3px;
  }
  .db-moon-date { font-size:11px; color:var(--pearl-dim); letter-spacing:1px; }
  .db-moon-percent {
    display:flex; align-items:center; gap:10px; margin-top:14px;
  }
  .db-moon-bar {
    flex:1; height:2px; background:rgba(168,204,224,0.1); border-radius:999px;
  }
  .db-moon-bar-fill {
    height:100%; background:linear-gradient(90deg,var(--moon-dim),var(--moon));
    border-radius:999px; transition:width 1s ease;
  }
  .db-moon-bar-label { font-size:10px; color:var(--moon-dim); letter-spacing:1px; }
  .db-moon-insight {
    margin-top:14px; font-size:13px; color:var(--pearl-dim);
    line-height:1.7; font-style:italic;
    border-top:1px solid rgba(168,204,224,0.07); padding-top:14px;
  }

  /* ─── JYOTISH TIMING CARD ─── */
  .db-timing-row {
    display:flex; align-items:center; justify-content:space-between;
    padding:9px 0;
    border-bottom:1px solid rgba(168,204,224,0.06);
    font-size:13px;
  }
  .db-timing-row:last-child { border-bottom:none; }
  .db-timing-label { color:var(--pearl-dim); }
  .db-timing-val { color:var(--pearl); font-weight:400; }
  .db-timing-badge {
    font-size:9px; letter-spacing:2px; text-transform:uppercase;
    padding:3px 8px; border-radius:999px;
    border:1px solid rgba(226,194,125,0.25);
    color:var(--gold-dim);
  }

  /* ─── RETAKE STRIP ─── */
  .db-retake {
    display:flex; align-items:center; justify-content:space-between;
    padding:16px 20px; border-radius:10px;
    background:rgba(6,14,26,0.5);
    border:1px solid rgba(168,204,224,0.07);
    margin-top:8px;
  }
  .db-retake-text { font-size:13px; color:var(--pearl-dim); }
  .db-retake-btn {
    font-size:10px; letter-spacing:2px; text-transform:uppercase;
    padding:8px 18px; border-radius:1px;
    border:1px solid rgba(168,204,224,0.2);
    background:transparent; color:var(--pearl-dim);
    cursor:pointer; font-family:'Outfit',sans-serif;
    transition:all 0.25s;
  }
  .db-retake-btn:hover { border-color:var(--moon); color:var(--moon); }

  /* ─── NO ASSESSMENT STATE ─── */
  .db-empty-hero {
    max-width:600px; padding:20px 0 48px;
  }
  .db-empty-heading {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(32px,5vw,52px); font-weight:400;
    color:var(--pearl); line-height:1.15; margin-bottom:16px;
  }
  .db-empty-heading em { color:var(--gold); font-style:italic; }
  .db-empty-body {
    font-size:15px; color:var(--pearl-dim); line-height:1.9;
    max-width:460px; margin-bottom:32px;
  }
  .db-cta-btn {
    padding:16px 44px;
    font-family:'Outfit',sans-serif;
    font-size:11px; font-weight:500; letter-spacing:3px;
    text-transform:uppercase; cursor:pointer; border-radius:2px;
    background:linear-gradient(135deg,rgba(226,194,125,0.15),rgba(226,194,125,0.05));
    border:1px solid rgba(226,194,125,0.35);
    color:var(--gold); transition:all 0.3s;
  }
  .db-cta-btn:hover {
    border-color:var(--gold); background:rgba(226,194,125,0.1);
    box-shadow:0 0 32px rgba(226,194,125,0.1);
  }
  .db-general-grid {
    display:grid; grid-template-columns:repeat(3,1fr); gap:16px;
    margin-top:48px;
  }
  .db-general-card {
    background:rgba(13,31,53,0.6);
    border:1px solid rgba(168,204,224,0.07);
    border-radius:14px; padding:24px 20px;
    backdrop-filter:blur(8px);
    transition:all 0.3s;
  }
  .db-general-card:hover {
    border-color:rgba(168,204,224,0.18);
    transform:translateY(-2px);
    box-shadow:0 8px 32px rgba(0,0,0,0.3);
  }
  .db-general-icon { font-size:28px; margin-bottom:14px; display:block; }
  .db-general-title {
    font-family:'Cormorant Garamond',serif;
    font-size:20px; color:var(--pearl); margin-bottom:8px;
  }
  .db-general-text { font-size:13px; color:var(--pearl-dim); line-height:1.7; }
  .db-general-sk {
    font-family:'Noto Serif Devanagari',serif;
    font-size:12px; color:var(--moon-dim); margin-top:8px; display:block;
  }

  /* Loading */
  .db-loading {
    min-height:100vh; display:flex; align-items:center; justify-content:center;
    flex-direction:column; gap:16px;
  }
  .db-loading-moon {
    font-size:40px;
    animation:moonPulse 2s ease-in-out infinite;
  }
  .db-loading-text {
    font-size:12px; letter-spacing:3px; text-transform:uppercase;
    color:var(--pearl-dim);
  }

  /* Mobile */
  @media(max-width:900px){
    .db-grid { grid-template-columns:1fr; }
    .db-general-grid { grid-template-columns:1fr; }
    .db-wrap { padding:88px 20px 60px; }
    .db-nav { padding:0 20px; }
    .db-header { margin-bottom:32px; }
  }
  @media(max-width:600px){
    .db-prakriti-badge { flex-wrap:wrap; }
  }
`;

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const prakritiProfiles = {
  vata:         { name:'VATA',        sk:'वात' },
  pitta:        { name:'PITTA',       sk:'पित्त' },
  kapha:        { name:'KAPHA',       sk:'कफ' },
  'vata-pitta': { name:'VATA-PITTA',  sk:'वात-पित्त' },
  'vata-kapha': { name:'VATA-KAPHA',  sk:'वात-कफ' },
  'pitta-kapha':{ name:'PITTA-KAPHA', sk:'पित्त-कफ' },
  'pitta-vata': { name:'PITTA-VATA',  sk:'पित्त-वात' },
  'kapha-vata': { name:'KAPHA-VATA',  sk:'कफ-वात' },
  'kapha-pitta':{ name:'KAPHA-PITTA', sk:'कफ-पित्त' },
};

const concernMeta = {
  anxiety:      { iks:'Chinta' },
  aggression:   { iks:'Krodha' },
  overthinking: { iks:'Chitta Vritti' },
  stress:       { iks:'Manastapa' },
  lowmood:      { iks:'Vishada' },
  fear:         { iks:'Bhaya' },
};

const protocols = {
  anxiety: {
    vata:  { mantra:{ name:"Chandra Beej Mantra", transliteration:"Om Shraam Shreem Shraum Sah Chandramasay Namah", meaning:"An invocation of the Moon to restore coolness and steadiness to an agitated Vata mind.", count:"108 repetitions", timing:"Before sleep, or at moonrise" }, ahara:{ eat:["Warm ghee with meals","Sesame in cooking","Warm milk before bed"], avoid:["Cold drinks and raw foods","Dry snacks and crackers"] }, dinacharya:{ morning:"Oil feet with sesame before rising", evening:"No screens after 9pm", sleep:"Sleep before 10pm — non-negotiable for Vata" } },
    pitta: { mantra:{ name:"Chandra Gayatri", transliteration:"Om Ksheerputraya Vidmahe Amrut Tatvaaya Dhimahi Tanno Chandrah Prachodayaat", meaning:"An invocation of the Moon's cooling essence to pacify Pitta's heat and restore calm perception.", count:"108 repetitions", timing:"Evening, facing moonlight if possible" }, ahara:{ eat:["Coconut water daily","Pomegranate and cucumber","Sweet ripe fruits"], avoid:["Spicy and fried food","Alcohol"] }, dinacharya:{ morning:"Cold water wash on face at waking", evening:"Moonlight walk after dinner", sleep:"No work after sunset" } },
    kapha: { mantra:{ name:"Ganesh Mantra", transliteration:"Om Gam Ganapataye Namah", meaning:"Invocation of Ganesh to remove obstructions that hold Kapha anxiety in place and restore movement.", count:"108 repetitions", timing:"Early morning, before sunrise" }, ahara:{ eat:["Ginger tea on waking","Turmeric milk at night","Light warm spiced foods"], avoid:["Heavy oily meals","Cold sweet foods"] }, dinacharya:{ morning:"Wake before sunrise — 15 minutes in sunlight", evening:"Light and early dinner", sleep:"Avoid sleeping past 7am" } },
  },
  aggression: {
    vata:  { mantra:{ name:"Shiva Panchakshara", transliteration:"Om Namah Shivaya", meaning:"An invocation of Shiva's stillness — the antidote to Vata aggression that rises from overwhelm.", count:"108 repetitions", timing:"Morning, in silence" }, ahara:{ eat:["Warm soups and root vegetables","Dates and figs","Calming sweet foods"], avoid:["Caffeine and stimulants","Processed snacks"] }, dinacharya:{ morning:"Slow unrushed morning — no alarm panic", evening:"10 minutes of silence daily", sleep:"No stimulating content before bed" } },
    pitta: { mantra:{ name:"Vishnu Sahasranama", transliteration:"Daily recitation — available in audio form", meaning:"The thousand names of Vishnu pacify Pitta's fierce fire by invoking sustaining grace.", count:"Full recitation daily (~25 min)", timing:"Morning" }, ahara:{ eat:["Leafy greens and bitter vegetables","Coconut and coriander water","Lime with meals"], avoid:["Alcohol","Red meat and heavy spice"] }, dinacharya:{ morning:"Cool shower at waking", evening:"No competitive activity after 6pm", sleep:"Midday rest 10–15 minutes" } },
    kapha: { mantra:{ name:"Surya Mantra", transliteration:"Om Hraam Hreem Hraum Sah Suryaya Namah", meaning:"An invocation of the Sun to lift Kapha heaviness that causes suppressed aggression to burst.", count:"108 repetitions", timing:"At sunrise, facing the sun" }, ahara:{ eat:["Ginger and black pepper in cooking","Honey water on waking","Mustard seed in food"], avoid:["Excess sugar","Heavy meals late in day"] }, dinacharya:{ morning:"Walk or movement before 8am", evening:"Early and light dinner", sleep:"Avoid oversleeping" } },
  },
  overthinking: {
    vata:  { mantra:{ name:"Chandra Beej Mantra", transliteration:"Om Shraam Shreem Shraum Sah Chandramasay Namah", meaning:"The Moon mantra cools and anchors the Vata mind that cannot stop moving.", count:"108 repetitions", timing:"Morning before any screen" }, ahara:{ eat:["Sesame oil in cooking","Warm cooked meals only","Ghee daily"], avoid:["Cold drinks","Raw salads and dry foods"] }, dinacharya:{ morning:"Sesame oil on scalp before shower", evening:"Eat in silence — no multitasking during meals", sleep:"No screens in bed" } },
    pitta: { mantra:{ name:"Gayatri Mantra", transliteration:"Om Bhur Bhuvah Svaha, Tat Savitur Varenyam, Bhargo Devasya Dhimahi, Dhiyo Yo Nah Prachodayat", meaning:"The Gayatri transforms Pitta's relentless analysis into illuminated clarity.", count:"108 repetitions", timing:"Sunrise — facing east" }, ahara:{ eat:["Sattvic home-cooked meals","Fresh seasonal produce","Simple food"], avoid:["Processed and packaged foods","Stimulating foods near bedtime"] }, dinacharya:{ morning:"Single-task work blocks only", evening:"No news or social media after 9pm", sleep:"Silence after 9pm" } },
    kapha: { mantra:{ name:"Saraswati Mantra", transliteration:"Om Aim Saraswatyai Namah", meaning:"Saraswati mantra clears the stagnant mental loops of Kapha overthinking.", count:"108 repetitions", timing:"Early morning — before 6am if possible" }, ahara:{ eat:["Light dinner — soup or khichdi","Saffron in warm milk at night","Easy to digest evening meals"], avoid:["Eating after 8pm","Heavy dairy at night"] }, dinacharya:{ morning:"Wake 5:30–6am — journal before any screen", evening:"Cold water face wash to activate", sleep:"Early to bed, early to rise" } },
  },
  stress: {
    vata:  { mantra:{ name:"Mahamrityunjaya Mantra", transliteration:"Om Tryambakam Yajamahe Sugandhim Pushtivardhanam, Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat", meaning:"The great mantra of liberation from depletion — it nourishes the Vata worn thin by stress.", count:"108 repetitions", timing:"Morning before work begins" }, ahara:{ eat:["Warm nourishing calming meals","Ashwagandha milk (consult BAMS)","Regular meals without skipping"], avoid:["Skipping meals","Cold and irregular eating"] }, dinacharya:{ morning:"Fixed wake time — same every day", evening:"Two 5-minute stillness breaks in the working day", sleep:"Fixed meal times — Vata needs rhythmic structure" } },
    pitta: { mantra:{ name:"Narsimha Kavach", transliteration:"Evening recitation — traditional text", meaning:"The protective shield mantra — guards the Pitta mind against its own intensity.", count:"Full recitation", timing:"Evening — after work ends" }, ahara:{ eat:["Coconut water and aloe","Coriander and fennel tea","Cooling alkaline foods"], avoid:["Alcohol under stress","Spicy food in the evening"] }, dinacharya:{ morning:"Cool morning routine — no rushing", evening:"No work calls after 7pm", sleep:"Afternoon rest 15 minutes" } },
    kapha: { mantra:{ name:"Hanuman Chalisa", transliteration:"Traditional full recitation", meaning:"Invokes devoted fearless action — what Kapha needs to move through inertia.", count:"Full recitation", timing:"Morning — before food" }, ahara:{ eat:["Ginger and pepper in morning food","Honey water on waking","Light stimulating foods"], avoid:["Heavy dinners","Excess sweet foods and dairy"] }, dinacharya:{ morning:"Movement before food — every single day", evening:"Social connection — do not isolate under stress", sleep:"Wake with sunrise" } },
  },
  lowmood: {
    vata:  { mantra:{ name:"Vishnu Sahasranama", transliteration:"Daily recitation — available in audio form", meaning:"Nourishes the depleted Vata mind with Vishnu's quality of preservation and continuity.", count:"Full recitation daily", timing:"Morning" }, ahara:{ eat:["Saffron in warm milk","Dates and figs with ghee","Warm sweet nourishing foods"], avoid:["Cold and raw foods","Light airy dry foods that increase Vata"] }, dinacharya:{ morning:"Brahma Muhurta wake (4:30–5:30am) — sunlight first", evening:"Fixed loving daily routine — consistency is medicine", sleep:"Fixed bedtime" } },
    pitta: { mantra:{ name:"Surya Mantra", transliteration:"Om Hraam Hreem Hraum Sah Suryaya Namah", meaning:"Reignites the solar fire in a Pitta whose flame has dimmed — restoring purpose.", count:"108 repetitions", timing:"Sunrise — facing the sun" }, ahara:{ eat:["Pomegranate and fresh ginger","Amla (Indian gooseberry)","Light proteins"], avoid:["Heavy and sweet excess","Oversized meals that create sluggishness"] }, dinacharya:{ morning:"Minimum 15 minutes morning sunlight", evening:"One creative outlet daily", sleep:"Social contact daily — no isolation" } },
    kapha: { mantra:{ name:"Surya Beej Mantra", transliteration:"Om Hraam Hreem Hraum Sah Suryaya Namah (108x at sunrise)", meaning:"Directly addresses the Tamas that Kapha excess creates — the most important practice for Kapha low mood.", count:"108 repetitions", timing:"At sunrise — non-negotiable" }, ahara:{ eat:["Ginger tea on waking","Honey water before breakfast","Light warming foods"], avoid:["Dairy excess","Sugar — it deepens Kapha low mood"] }, dinacharya:{ morning:"Wake before 6am — this alone shifts Kapha Vishada", evening:"Physical movement every morning", sleep:"Social activity minimum 3x per week" } },
  },
  fear: {
    vata:  { mantra:{ name:"Narsimha Kavach", transliteration:"Daily recitation — especially during Rahu Kala", meaning:"The armour mantra — builds the felt sense of protection that Vata Bhaya cannot find alone.", count:"Full recitation", timing:"Daily — especially during Rahu Kala" }, ahara:{ eat:["Rock salt in warm water","Sesame in cooking","Warm grounding soups"], avoid:["Light airy cold foods","Raw and dry foods that aggravate Vata"] }, dinacharya:{ morning:"Grounding — bare feet on earth for 5 minutes", evening:"Reduce change and unpredictability in routine", sleep:"Fixed bedtime — same every night" } },
    pitta: { mantra:{ name:"Chandra Beej Mantra", transliteration:"Om Shraam Shreem Shraum Sah Chandramasay Namah", meaning:"Cools the Pitta fear of losing control — replaces anxiety's heat with Moon's calm awareness.", count:"108 repetitions", timing:"Evening at moonrise" }, ahara:{ eat:["Coconut and coriander","Fennel tea","Sweet cooling fruits"], avoid:["Spicy stimulating food in evening","Caffeine after noon"] }, dinacharya:{ morning:"Journal fears before sleep to externalise them", evening:"Moonlight sitting — 10 minutes minimum", sleep:"Cool bedroom — Pitta fear worsens in heat" } },
    kapha: { mantra:{ name:"Durga Mantra", transliteration:"Om Dum Durgayai Namah", meaning:"Fierce protective energy — addresses Kapha fear that grows in isolation.", count:"108 repetitions", timing:"Morning" }, ahara:{ eat:["Ginger, clove, cinnamon in cooking","Warming spiced foods","Light easily digested meals"], avoid:["Cold heavy foods that increase Kapha inertia","Skipping morning movement"] }, dinacharya:{ morning:"Morning sunlight and movement together", evening:"Social connection daily", sleep:"Do not isolate — connection is medicine" } },
  },
};

/* ─────────────────────────────────────────
   MOON PHASE CALCULATOR
───────────────────────────────────────── */
function getMoonData() {
  // Known new moon: Jan 29, 2025 at 12:36 UTC
  const knownNewMoon = new Date('2025-01-29T12:36:00Z');
  const now = new Date();
  const CYCLE = 29.53058867;
  const elapsed = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
  const age = ((elapsed % CYCLE) + CYCLE) % CYCLE;
  const illumination = Math.round((1 - Math.cos((age / CYCLE) * 2 * Math.PI)) / 2 * 100);

  let phase, emoji, insight;
  if      (age < 1.85)  { phase='New Moon';         emoji='🌑'; insight='A potent time for setting intentions. Begin your mantra practice with fresh resolve tonight.'; }
  else if (age < 7.38)  { phase='Waxing Crescent';  emoji='🌒'; insight='Energy is building. Lean into your morning practices now — the momentum is with you.'; }
  else if (age < 9.22)  { phase='First Quarter';    emoji='🌓'; insight='A moment of decision. If your practice has slipped, today is the perfect day to return.'; }
  else if (age < 14.77) { phase='Waxing Gibbous';   emoji='🌔'; insight='Vata types feel the heightening. Ground well tonight — oil, warmth, and an early sleep.'; }
  else if (age < 16.62) { phase='Full Moon';         emoji='🌕'; insight='Pitta and Vata are amplified at the Full Moon. Chandra mantra is especially potent tonight.'; }
  else if (age < 22.15) { phase='Waning Gibbous';   emoji='🌖'; insight='The mind naturally wants to release. Ideal for journalling and letting go of what is held.'; }
  else if (age < 24.00) { phase='Last Quarter';     emoji='🌗'; insight='Rest and reduce. Kapha types feel most balanced now. Do not push — allow the cycle to close.'; }
  else                  { phase='Waning Crescent';  emoji='🌘'; insight='The quietest phase of the cycle. Deep rest is the practice. The new moon approaches.'; }

  const today = now.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' });
  return { phase, emoji, illumination, insight, today, age: Math.floor(age) };
}

/* ─────────────────────────────────────────
   JYOTISH TIMING (approximate Rahu Kala)
───────────────────────────────────────── */
function getRahuKala() {
  const day = new Date().getDay(); // 0=Sun
  // Rahu Kala order by day (approx 8-slot day from 6am to 6pm)
  const slots = ['7:30–9:00','6:00–7:30','15:00–16:30','12:00–13:30','13:30–15:00','10:30–12:00','9:00–10:30'];
  const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  return { time: slots[day], day: days[day] };
}

/* ─────────────────────────────────────────
   CHECKLIST BUILDER
───────────────────────────────────────── */
function buildChecklist(protocol) {
  if(!protocol) return [];
  return [
    { id:'mantra', tag:'Mantra',     label:`Chant ${protocol.mantra.name} — ${protocol.mantra.count}` },
    { id:'morning',tag:'Morning',    label:protocol.dinacharya.morning },
    { id:'evening',tag:'Evening',    label:protocol.dinacharya.evening },
    { id:'sleep',  tag:'Before bed', label:protocol.dinacharya.sleep },
    { id:'eat1',   tag:'Ahara',      label:`Favour: ${protocol.ahara.eat[0]}` },
    { id:'avoid1', tag:'Ahara',      label:`Reduce: ${protocol.ahara.avoid[0]}` },
  ];
}

function getTodayKey() {
  return `sattva_checklist_${new Date().toISOString().split('T')[0]}`;
}

/* ─────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────── */
function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if(!canvas) return;
    let ctx; try { ctx = canvas.getContext('2d'); } catch(e){ return; }
    let W = canvas.width = window.innerWidth, H = canvas.height = window.innerHeight;
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    const stars = Array.from({length:70}, () => ({ x:Math.random()*W, y:Math.random()*H, r:Math.random()*1+0.2, dx:(Math.random()-0.5)*0.06, dy:-Math.random()*0.09-0.02, o:Math.random()*0.3+0.08, ts:Math.random()*0.01+0.003, to:Math.random()*Math.PI*2 }));
    let frame=0, id;
    const draw = () => {
      ctx.clearRect(0,0,W,H); frame++;
      stars.forEach(s => {
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(168,204,224,${s.o*(Math.sin(frame*s.ts+s.to)*0.35+0.65)})`; ctx.fill();
        s.x+=s.dx; s.y+=s.dy;
        if(s.y<-5){s.y=H+5;s.x=Math.random()*W;}
        if(s.x<-5)s.x=W+5; if(s.x>W+5)s.x=-5;
      });
      id=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize',onResize); };
  },[]);
  return <canvas ref={ref} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1,opacity:0.5}} />;
}

function Cursor() {
  const dot=useRef(null), ring=useRef(null);
  useEffect(() => {
    const mv = e => {
      if(dot.current){dot.current.style.left=e.clientX+'px';dot.current.style.top=e.clientY+'px';}
      if(ring.current){ring.current.style.left=e.clientX+'px';ring.current.style.top=e.clientY+'px';}
    };
    window.addEventListener('mousemove',mv);
    return ()=>window.removeEventListener('mousemove',mv);
  },[]);
  return <><div className="cursor" ref={dot}/><div className="cursor-ring" ref={ring}/></>;
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading]         = useState(true);
  const [user, setUser]               = useState(null);
  const [assessment, setAssessment]   = useState(null); // null = not done
  const [checked, setChecked]         = useState({});   // today's checklist state
  const moonData   = getMoonData();
  const rahuKala   = getRahuKala();

  /* ── Auth + data fetch ── */
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if(!session) { navigate('/login'); return; }
      setUser(session.user);

      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if(data && !error) setAssessment(data);
      setLoading(false);
    };
    init();
  }, [navigate]);

  /* ── Load checklist from localStorage ── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(getTodayKey());
      if(saved) setChecked(JSON.parse(saved));
    } catch(e) {}
  }, []);

  const toggleCheck = (id) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    try { localStorage.setItem(getTodayKey(), JSON.stringify(next)); } catch(e) {}
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  /* ── Derived state ── */
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'friend';
  const firstName = userName.split(' ')[0];

  let protocol = null;
  if(assessment?.prakriti && assessment?.concern) {
    const primaryD = assessment.prakriti.split('-')[0];
    protocol = protocols[assessment.concern]?.[primaryD] || null;
  }

  const checklist = buildChecklist(protocol);
  const doneCount = checklist.filter(item => checked[item.id]).length;
  const progressPct = checklist.length > 0 ? Math.round((doneCount / checklist.length) * 100) : 0;

  const profile = assessment?.prakriti ? prakritiProfiles[assessment.prakriti] : null;
  const concern = assessment?.concern  ? concernMeta[assessment.concern]       : null;

  /* ── Loading ── */
  if(loading) {
    return (
      <>
        <style>{FONTS+css}</style>
        <StarField/>
        <div className="db-loading">
          <div className="db-loading-moon">🌙</div>
          <div className="db-loading-text">Opening your space</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{FONTS+css}</style>
      <Cursor/>
      <StarField/>

      {/* NAV */}
      <nav className="db-nav">
        <a href="/" className="db-nav-brand">SATTVA <span>Heals</span></a>
        <div className="db-nav-right">
          <span className="db-nav-user">{firstName}</span>
          {!assessment && (
            <button className="db-nav-btn primary" onClick={() => navigate('/onboarding')}>
              Take Assessment
            </button>
          )}
          <button className="db-nav-btn" onClick={handleSignOut}>Sign Out</button>
        </div>
      </nav>

      <div className="db-wrap">

        {/* ══ STATE A: NO ASSESSMENT ══ */}
        {!assessment && (
          <>
            <div className="db-empty-hero db-fadein db-fadein-1">
              <div className="db-empty-heading">
                Welcome, <em>{firstName}.</em><br/>Your space is ready.
              </div>
              <div className="db-empty-body">
                Sattva uses 5,000 years of India's healing intelligence to understand
                your mind, your constitution, and what you are carrying right now.
                Begin with the Prakriti assessment — it takes 3 minutes.
              </div>
              <button className="db-cta-btn" onClick={() => navigate('/onboarding')}>
                Begin Your Assessment
              </button>
            </div>

            {/* General IKS content cards */}
            <div className="db-section-label db-fadein db-fadein-2" style={{marginTop:0}}>
              What Sattva offers
            </div>
            <div className="db-general-grid db-fadein db-fadein-3">
              {[
                { icon:'🌿', title:'Ayurveda', sk:'आयुर्वेद', text:'The science of life. Understand your body-mind constitution and what it needs to come back to balance.' },
                { icon:'🪐', title:'Jyotish', sk:'ज्योतिष', text:'Vedic astrology. The planetary patterns in your birth chart explain why certain tendencies feel inescapable.' },
                { icon:'🕉', title:'Mantra', sk:'मन्त्र', text:'Sound as medicine. Specific mantras prescribed for your Dosha and concern work on the nervous system.' },
              ].map((c, i) => (
                <div key={i} className="db-general-card">
                  <span className="db-general-icon">{c.icon}</span>
                  <div className="db-general-title">{c.title}</div>
                  <div className="db-general-text">{c.text}</div>
                  <span className="db-general-sk">{c.sk}</span>
                </div>
              ))}
            </div>

            {/* Moon card for everyone */}
            <div style={{marginTop:32,maxWidth:440}} className="db-fadein db-fadein-4">
              <div className="db-section-label">Tonight's sky</div>
              <div className="db-card">
                <div className="db-moon-display">
                  <div className="db-moon-emoji">{moonData.emoji}</div>
                  <div className="db-moon-info">
                    <div className="db-moon-phase-name">{moonData.phase}</div>
                    <div className="db-moon-date">{moonData.today}</div>
                  </div>
                </div>
                <div className="db-moon-percent">
                  <div className="db-moon-bar"><div className="db-moon-bar-fill" style={{width:`${moonData.illumination}%`}}/></div>
                  <div className="db-moon-bar-label">{moonData.illumination}% lit</div>
                </div>
                <div className="db-moon-insight">{moonData.insight}</div>
              </div>
            </div>
          </>
        )}

        {/* ══ STATE B: HAS ASSESSMENT ══ */}
        {assessment && protocol && (
          <>
            {/* HEADER */}
            <div className="db-header db-fadein db-fadein-1">
              <div>
                <div className="db-greeting">
                  {getGreeting()}, <em>{firstName}.</em>
                </div>
                <div className="db-prakriti-badge">
                  <span className="db-badge-dosha">{profile?.name}</span>
                  <span className="db-badge-concern">{concern?.iks}</span>
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:11,letterSpacing:'2px',color:'var(--pearl-dim)',textTransform:'uppercase',marginBottom:4}}>
                  Today's practice
                </div>
                <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:28,color:doneCount===checklist.length?'var(--green)':'var(--gold)'}}>
                  {doneCount} / {checklist.length}
                </div>
              </div>
            </div>

            {/* MAIN GRID */}
            <div className="db-grid">

              {/* LEFT COLUMN */}
              <div className="db-grid-left">

                {/* Daily Checklist */}
                <div className="db-fadein db-fadein-2">
                  <div className="db-section-label">Today's practice</div>
                  <div className="db-card">
                    <div className="db-card-head">
                      <div className="db-card-title">Daily Practice</div>
                      <div className="db-card-icon">☑</div>
                    </div>
                    <div className="db-checklist">
                      {checklist.map(item => (
                        <button
                          key={item.id}
                          className={`db-check-item ${checked[item.id]?'done':''}`}
                          onClick={() => toggleCheck(item.id)}
                        >
                          <div className="db-check-box">{checked[item.id]?'✓':''}</div>
                          <div>
                            <div className="db-check-label">{item.label}</div>
                            <span className="db-check-tag">{item.tag}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="db-check-progress">
                      <div className="db-check-progress-fill" style={{width:`${progressPct}%`}}/>
                    </div>
                    <div className="db-check-progress-text">
                      {progressPct === 100 ? '✓ Practice complete today' : `${doneCount} of ${checklist.length} complete`}
                    </div>
                  </div>
                </div>

                {/* Mantra */}
                <div className="db-fadein db-fadein-3">
                  <div className="db-section-label">Your mantra</div>
                  <div className="db-card">
                    <div className="db-card-head">
                      <div className="db-card-title">Mantra</div>
                      <div className="db-card-icon">🕉</div>
                    </div>
                    <div className="db-mantra-name">{protocol.mantra.name}</div>
                    <div className="db-mantra-translit">{protocol.mantra.transliteration}</div>
                    <div className="db-mantra-meaning">{protocol.mantra.meaning}</div>
                    <div className="db-mantra-meta">
                      {protocol.mantra.count} · Best time: {protocol.mantra.timing}
                    </div>
                  </div>
                </div>

                {/* Ahara */}
                <div className="db-fadein db-fadein-4">
                  <div className="db-section-label">Ahara — diet</div>
                  <div className="db-card">
                    <div className="db-card-head">
                      <div className="db-card-title">Ahara</div>
                      <div className="db-card-icon">🌿</div>
                    </div>
                    <div className="db-food-group">
                      <div className="db-food-group-label">Favour</div>
                      <div className="db-food-list">
                        {protocol.ahara.eat.map((item,i) => (
                          <div key={i} className="db-food-item">
                            <span className="dot dot-green"/>{item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="db-food-group">
                      <div className="db-food-group-label">Reduce</div>
                      <div className="db-food-list">
                        {protocol.ahara.avoid.map((item,i) => (
                          <div key={i} className="db-food-item">
                            <span className="dot dot-red"/>{item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>{/* end left */}

              {/* RIGHT COLUMN */}
              <div className="db-grid-right">

                {/* Moon Phase */}
                <div className="db-fadein db-fadein-2">
                  <div className="db-section-label">Tonight's sky</div>
                  <div className="db-card">
                    <div className="db-card-head">
                      <div className="db-card-title">Moon</div>
                    </div>
                    <div className="db-moon-display">
                      <div className="db-moon-emoji">{moonData.emoji}</div>
                      <div className="db-moon-info">
                        <div className="db-moon-phase-name">{moonData.phase}</div>
                        <div className="db-moon-date">{moonData.today}</div>
                      </div>
                    </div>
                    <div className="db-moon-percent">
                      <div className="db-moon-bar">
                        <div className="db-moon-bar-fill" style={{width:`${moonData.illumination}%`}}/>
                      </div>
                      <div className="db-moon-bar-label">{moonData.illumination}%</div>
                    </div>
                    <div className="db-moon-insight">{moonData.insight}</div>
                  </div>
                </div>

                {/* Dinacharya */}
                <div className="db-fadein db-fadein-3">
                  <div className="db-section-label">Dinacharya — routine</div>
                  <div className="db-card">
                    <div className="db-card-head">
                      <div className="db-card-title">Daily Routine</div>
                      <div className="db-card-icon">🌅</div>
                    </div>
                    {[
                      { icon:'🌅', label:protocol.dinacharya.morning },
                      { icon:'🌙', label:protocol.dinacharya.evening },
                      { icon:'⭐', label:protocol.dinacharya.sleep },
                    ].map((row,i)=>(
                      <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',fontSize:13,color:'var(--pearl-dim)',lineHeight:1.6,marginBottom:10}}>
                        <span style={{fontSize:15,flexShrink:0}}>{row.icon}</span>
                        {row.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Jyotish timing */}
                <div className="db-fadein db-fadein-4">
                  <div className="db-section-label">Jyotish</div>
                  <div className="db-card">
                    <div className="db-card-head">
                      <div className="db-card-title">Today's Timing</div>
                      <div className="db-card-icon">🪐</div>
                    </div>
                    <div className="db-timing-row">
                      <span className="db-timing-label">Rahu Kala</span>
                      <span className="db-timing-val">{rahuKala.time}</span>
                    </div>
                    <div className="db-timing-row">
                      <span className="db-timing-label">Avoid new starts</span>
                      <span className="db-timing-badge">During Rahu Kala</span>
                    </div>
                    <div className="db-timing-row">
                      <span className="db-timing-label">Moon age</span>
                      <span className="db-timing-val">Day {moonData.age}</span>
                    </div>
                    <div style={{marginTop:14,fontSize:12,color:'var(--pearl-dim)',lineHeight:1.7,fontStyle:'italic'}}>
                      Rahu Kala is inauspicious for new beginnings. Your mantra practice is still recommended at this time.
                    </div>
                  </div>
                </div>

                {/* Retake */}
                <div className="db-fadein db-fadein-5">
                  <div className="db-retake">
                    <span className="db-retake-text">Feeling different? Retake the assessment.</span>
                    <button className="db-retake-btn" onClick={() => navigate('/onboarding')}>
                      Retake
                    </button>
                  </div>
                </div>

              </div>{/* end right */}
            </div>
          </>
        )}

      </div>
    </>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if(h < 5)  return 'Still awake';
  if(h < 12) return 'Good morning';
  if(h < 17) return 'Good afternoon';
  if(h < 21) return 'Good evening';
  return 'Good night';
}