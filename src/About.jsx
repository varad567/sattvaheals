import { useEffect, useRef } from "react";

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

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 120px 72px 80px;
    text-align: center; position: relative; overflow: hidden;
  }
  .hero::before {
    content:''; position:absolute; inset:0;
    background:
      radial-gradient(ellipse at 50% 30%, rgba(168,204,224,0.06) 0%, transparent 55%),
      radial-gradient(ellipse at 20% 80%, rgba(226,194,125,0.03) 0%, transparent 50%);
    pointer-events:none;
  }
  .eyebrow { display:inline-flex; align-items:center; gap:12px; margin-bottom:24px; }
  .ey-line { width:32px; height:1px; background:var(--gold-dim); }
  .ey-text { font-size:10px; letter-spacing:4px; color:var(--gold); text-transform:uppercase; font-weight:500; }
  .hero-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(48px,7vw,96px); font-weight:600;
    line-height:1.05; color:var(--pearl);
    margin-bottom:28px; animation:fadeUp 1s ease both;
  }
  .hero-title em { font-style:italic; color:var(--gold); }
  .hero-body {
    font-size:18px; line-height:1.9; color:var(--pearl-dim);
    max-width:640px; margin:0 auto 56px;
    font-weight:300; animation:fadeUp 1s 0.15s ease both;
  }
  .hero-skt {
    font-family:'Noto Serif Devanagari',serif;
    font-size:13px; letter-spacing:3px; color:var(--gold);
    animation:fadeUp 1s 0.3s ease both;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

  /* Scroll indicator */
  .scroll-hint {
    position: absolute; bottom: 40px; left: 50%;
    transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .sh-text { font-size:9px; letter-spacing:3px; color:var(--pearl-dim); text-transform:uppercase; opacity:0.4; }
  .sh-line { width:1px; height:40px; background:linear-gradient(to bottom, var(--moon-dim), transparent); animation:shLine 2s ease-in-out infinite; }
  @keyframes shLine { 0%{opacity:0;transform:scaleY(0);transform-origin:top} 50%{opacity:1;transform:scaleY(1)} 100%{opacity:0;transform:scaleY(0);transform-origin:bottom} }

  /* ARCH */
  .arch { width:100%; overflow:hidden; line-height:0; }
  .arch svg { display:block; width:100%; }

  /* CRISIS SECTION */
  .crisis { padding:120px 72px; background:var(--deep); position:relative; overflow:hidden; }
  .crisis::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 50% 50%, rgba(226,194,125,0.03) 0%, transparent 60%); pointer-events:none; }
  .section-inner { max-width:1200px; margin:0 auto; }

  .crisis-grid { display:grid; grid-template-columns:1fr 1fr; gap:100px; align-items:center; }
  .sec-label { font-size:10px; letter-spacing:4px; color:var(--gold); text-transform:uppercase; font-weight:500; margin-bottom:20px; display:block; }
  .sec-title { font-family:'Cormorant Garamond',serif; font-size:clamp(36px,4.5vw,58px); font-weight:600; color:var(--pearl); line-height:1.15; margin-bottom:24px; }
  .sec-title em { font-style:italic; color:var(--gold); }
  .sec-body { font-size:15px; line-height:1.95; color:var(--pearl-dim); font-weight:300; }
  .sec-body + .sec-body { margin-top:16px; }
  .sec-body em { font-style:italic; color:var(--moon); font-family:'Cormorant Garamond',serif; font-size:17px; }
  .sec-body strong { color:var(--pearl); font-weight:500; }

  /* Stats */
  .stats-block { display:flex; flex-direction:column; gap:4px; }
  .stat-card {
    padding:28px 32px;
    border:1px solid rgba(168,204,224,0.07);
    background:rgba(6,14,26,0.5);
    position:relative; overflow:hidden;
    transition:all 0.4s;
  }
  .stat-card:hover { border-color:rgba(168,204,224,0.15); background:rgba(17,40,64,0.5); }
  .stat-card::before { content:''; position:absolute; top:0; left:0; width:3px; height:100%; background:linear-gradient(to bottom, var(--gold), transparent); }
  .stat-num {
    font-family:'Cormorant Garamond',serif;
    font-size:52px; font-weight:600;
    color:var(--gold); line-height:1;
    margin-bottom:6px;
  }
  .stat-label { font-size:13px; color:var(--pearl-dim); line-height:1.6; }
  .stat-source { font-size:10px; color:rgba(139,175,196,0.3); margin-top:6px; letter-spacing:0.5px; }

  /* THERAPY SECTION */
  .therapy { padding:120px 72px; background:var(--abyss); position:relative; }
  .therapy-grid { display:grid; grid-template-columns:1fr 1fr; gap:100px; align-items:start; }

  /* Comparison visual */
  .compare-block { display:flex; flex-direction:column; gap:3px; }
  .compare-row {
    display:grid; grid-template-columns:1fr 1fr;
    gap:3px;
  }
  .compare-cell {
    padding:16px 20px;
    font-size:13px; line-height:1.6; color:var(--pearl-dim);
    background:rgba(13,31,53,0.5);
    border:1px solid rgba(168,204,224,0.06);
    transition:all 0.3s;
  }
  .compare-cell:hover { background:rgba(17,40,64,0.7); }
  .compare-cell.header {
    font-size:10px; letter-spacing:2px; text-transform:uppercase; font-weight:500;
    background:rgba(6,14,26,0.7);
  }
  .compare-cell.header.modern { color:var(--pearl-dim); border-bottom:2px solid rgba(168,204,224,0.15); }
  .compare-cell.header.iks { color:var(--gold); border-bottom:2px solid var(--gold-dim); }
  .compare-cell.iks-val { border-left:2px solid rgba(226,194,125,0.2); color:var(--pearl); }
  .compare-cell.gap { background:rgba(168,204,224,0.02); color:rgba(139,175,196,0.4); font-size:12px; font-style:italic; text-align:center; grid-column:1/-1; border:1px solid rgba(168,204,224,0.04); padding:10px; }

  /* IKS SECTION */
  .iks-section { padding:120px 72px; background:var(--deep); position:relative; }
  .iks-section::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 30% 50%, rgba(168,204,224,0.04) 0%, transparent 55%); pointer-events:none; }

  .manifesto {
    max-width:800px; margin:0 auto;
    text-align:center;
  }
  .manifesto-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(40px,5vw,68px); font-weight:600;
    line-height:1.1; color:var(--pearl); margin-bottom:48px;
  }
  .manifesto-title em { font-style:italic; color:var(--gold); }

  .manifesto-lines { display:flex; flex-direction:column; gap:0; margin-bottom:56px; }
  .m-line {
    padding:20px 32px;
    border-bottom:1px solid rgba(168,204,224,0.05);
    display:flex; align-items:baseline; gap:16px;
    text-align:left; transition:all 0.3s;
  }
  .m-line:first-child { border-top:1px solid rgba(168,204,224,0.05); }
  .m-line:hover { background:rgba(17,40,64,0.3); }
  .m-num { font-family:'Cormorant Garamond',serif; font-size:13px; color:var(--gold-dim); min-width:24px; }
  .m-text { font-size:16px; line-height:1.7; color:var(--pearl-dim); font-weight:300; }
  .m-text strong { color:var(--pearl); font-weight:500; }
  .m-text em { font-style:italic; color:var(--moon); font-family:'Cormorant Garamond',serif; }

  .manifesto-quote {
    padding:36px 40px;
    background:rgba(6,14,26,0.5);
    border:1px solid rgba(168,204,224,0.07);
    border-top:2px solid var(--gold-dim);
    position:relative;
  }
  .mq-text {
    font-family:'Cormorant Garamond',serif;
    font-size:22px; font-style:italic;
    color:var(--pearl); line-height:1.65;
    margin-bottom:16px;
  }
  .mq-text em { color:var(--gold); }
  .mq-attr { font-size:11px; letter-spacing:2px; color:var(--pearl-dim); text-transform:uppercase; }

  /* FOUNDER */
  .founder-section { padding:120px 72px; background:var(--abyss); }
  .founder-grid { display:grid; grid-template-columns:1fr 2fr; gap:80px; align-items:start; max-width:1000px; margin:0 auto; }

  .founder-visual {
    background:rgba(13,31,53,0.6);
    border:1px solid rgba(168,204,224,0.07);
    padding:40px 32px; text-align:center;
    position:relative; overflow:hidden;
  }
  .founder-visual::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg, transparent, var(--gold-dim), transparent);
  }
  .founder-symbol {
    font-family:'Noto Serif Devanagari',serif;
    font-size:72px; color:rgba(168,204,224,0.08);
    display:block; margin-bottom:20px; line-height:1;
  }
  .founder-role { font-size:10px; letter-spacing:3px; color:var(--gold); text-transform:uppercase; font-weight:500; margin-bottom:8px; display:block; }
  .founder-name { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--pearl); margin-bottom:4px; }
  .founder-title { font-size:12px; color:var(--pearl-dim); letter-spacing:0.5px; margin-bottom:24px; }
  .founder-stats { display:flex; flex-direction:column; gap:10px; }
  .fs-item { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid rgba(168,204,224,0.05); }
  .fs-num { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--gold); }
  .fs-label { font-size:11px; color:var(--pearl-dim); letter-spacing:0.5px; }

  .founder-content {}
  .founder-content .sec-title { font-size:clamp(28px,3.5vw,44px); }

  /* VISION */
  .vision-section { padding:120px 72px; background:var(--deep); position:relative; overflow:hidden; }
  .vision-section::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 70% 50%, rgba(168,204,224,0.04) 0%, transparent 55%); pointer-events:none; }
  .vision-inner { max-width:1200px; margin:0 auto; }
  .vision-header { text-align:center; margin-bottom:80px; }

  .vision-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:3px; }
  .vision-card {
    padding:40px 36px;
    background:rgba(6,14,26,0.5);
    border:1px solid rgba(168,204,224,0.06);
    position:relative; overflow:hidden;
    transition:all 0.4s;
  }
  .vision-card:hover { background:rgba(17,40,64,0.6); border-color:rgba(168,204,224,0.12); }
  .vision-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1px; background:linear-gradient(90deg, var(--gold-dim), transparent); opacity:0; transition:opacity 0.4s; }
  .vision-card:hover::after { opacity:1; }
  .vc-year { font-family:'Cormorant Garamond',serif; font-size:42px; font-weight:600; color:var(--gold); line-height:1; margin-bottom:12px; opacity:0.6; }
  .vc-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--pearl); margin-bottom:12px; line-height:1.2; }
  .vc-body { font-size:13px; line-height:1.8; color:var(--pearl-dim); }

  /* CTA */
  .cta-section { padding:140px 72px; background:var(--abyss); text-align:center; position:relative; overflow:hidden; }
  .cta-section::before { content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:700px; height:700px; border-radius:50%; background:radial-gradient(circle,rgba(168,204,224,0.04) 0%,transparent 70%); pointer-events:none; }
  .cta-inner { max-width:600px; margin:0 auto; position:relative; z-index:1; }
  .cta-title { font-family:'Cormorant Garamond',serif; font-size:clamp(40px,5.5vw,68px); font-weight:600; color:var(--pearl); line-height:1.1; margin-bottom:16px; }
  .cta-title em { font-style:italic; color:var(--gold); }
  .cta-body { font-size:17px; line-height:1.85; color:var(--pearl-dim); margin-bottom:44px; font-weight:300; }
  .cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
  .btn-primary { background:linear-gradient(135deg,rgba(168,204,224,0.18),rgba(168,204,224,0.06)); border:1px solid rgba(168,204,224,0.3); color:var(--pearl); padding:16px 44px; font-family:'Outfit',sans-serif; font-size:12px; font-weight:500; letter-spacing:2.5px; text-transform:uppercase; cursor:none; transition:all 0.4s; border-radius:1px; }
  .btn-primary:hover { border-color:var(--moon); color:var(--moon); }
  .btn-ghost { background:transparent; border:1px solid rgba(168,204,224,0.1); color:var(--pearl-dim); padding:16px 36px; font-family:'Outfit',sans-serif; font-size:12px; font-weight:400; letter-spacing:2px; text-transform:uppercase; cursor:none; transition:all 0.4s; border-radius:1px; }
  .btn-ghost:hover { border-color:rgba(168,204,224,0.25); color:var(--pearl); }

  footer { background:rgba(0,0,0,0.4); border-top:1px solid rgba(168,204,224,0.06); padding:0 72px; height:64px; display:flex; align-items:center; }
  .foot-inner { max-width:1200px; margin:0 auto; width:100%; display:flex; justify-content:space-between; align-items:center; }
  .foot-brand { font-family:'Cormorant Garamond',serif; font-size:16px; font-weight:600; color:var(--pearl); letter-spacing:4px; text-transform:uppercase; }
  .foot-brand span { color:var(--gold); font-style:italic; }
  .foot-copy { font-size:11px; color:rgba(139,175,196,0.3); }

  /* Reveal */
  .reveal { opacity:0; transform:translateY(32px); transition:opacity 1s cubic-bezier(0.16,1,0.3,1),transform 1s cubic-bezier(0.16,1,0.3,1); }
  .reveal.visible { opacity:1; transform:translateY(0); }
  .reveal-left { opacity:0; transform:translateX(-32px); transition:opacity 1s cubic-bezier(0.16,1,0.3,1),transform 1s cubic-bezier(0.16,1,0.3,1); }
  .reveal-left.visible { opacity:1; transform:translateX(0); }
  .reveal-right { opacity:0; transform:translateX(32px); transition:opacity 1s cubic-bezier(0.16,1,0.3,1),transform 1s cubic-bezier(0.16,1,0.3,1); }
  .reveal-right.visible { opacity:1; transform:translateX(0); }

  @media(max-width:960px){
    nav,footer{padding:0 24px;}
    .hero,.crisis,.therapy,.iks-section,.founder-section,.vision-section,.cta-section{padding:100px 24px 80px;}
    .crisis-grid,.therapy-grid,.founder-grid{grid-template-columns:1fr;gap:48px;}
    .vision-grid{grid-template-columns:1fr;}
    .cursor,.cursor-ring{display:none;}
    body{cursor:auto;}
  }
`;

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

function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    let ctx; try { ctx = canvas.getContext('2d'); } catch(e) { return; } if (!ctx) return;
    let W = canvas.width = window.innerWidth, H = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });
    const stars = Array.from({ length: 60 }, () => ({ x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.1+0.2, dx:(Math.random()-0.5)*0.1, dy:-Math.random()*0.12-0.03, o:Math.random()*0.4+0.1, ts:Math.random()*0.015+0.004, to:Math.random()*Math.PI*2 }));
    let frame = 0, id;
    const draw = () => {
      ctx.clearRect(0,0,W,H); frame++;
      stars.forEach(s => {
        const tw = Math.sin(frame*s.ts+s.to)*0.3+0.7;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle = `rgba(168,204,224,${s.o*tw})`; ctx.fill();
        s.x+=s.dx; s.y+=s.dy;
        if (s.y<-5){s.y=H+5;s.x=Math.random()*W;}
        if (s.x<-5) s.x=W+5; if(s.x>W+5) s.x=-5;
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={ref} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0,opacity:0.5}}/>;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }), { threshold: 0.07 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const Arch = ({ to }) => (
  <div className="arch">
    <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{height:60}}>
      <path d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z" fill={to}/>
      <path d="M0,0 C360,60 1080,60 1440,0" fill="none" stroke="rgba(168,204,224,0.05)" strokeWidth="1"/>
    </svg>
  </div>
);

export default function About() {
  useReveal();

  return (
    <>
      <style>{FONTS + css}</style>
      <Cursor />
      <StarField />

      {/* NAV */}
      <nav>
        <a className="nav-brand" href="/">SATTVA <span>Heals</span></a>
        <button className="nav-back" onClick={() => window.location.href='/'}>← Back to Home</button>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="eyebrow"><div className="ey-line"/><span className="ey-text">Our Mission</span><div className="ey-line"/></div>
        <h1 className="hero-title">
          India is in a<br /><em>mental health crisis.</em><br />
          Nobody is talking<br />about the real answer.
        </h1>
        <p className="hero-body">
          197 million people. An 83% treatment gap. A civilisation that spent 5,000 years
          perfecting the science of the mind — forgotten, dismissed, replaced by systems
          that were never built for us. SATTVA exists to change that.
        </p>
        <span className="hero-skt">सत्त्वम् शुद्धम् — Pure mind is possible.</span>
        <div className="scroll-hint">
          <span className="sh-text">Scroll</span>
          <div className="sh-line"/>
        </div>
      </section>

      <Arch to="#0D1F35"/>

      {/* ── CRISIS ── */}
      <section className="crisis">
        <div className="section-inner">
          <div className="crisis-grid">
            <div className="reveal-left">
              <span className="sec-label">The Reality</span>
              <h2 className="sec-title">The numbers<br />nobody wants<br /><em>to say out loud.</em></h2>
              <p className="sec-body">
                India is home to the largest population of people experiencing mental health
                struggles anywhere on earth. Not because Indians are weaker. Because the system
                built to help them was designed somewhere else, for someone else.
              </p>
              <p className="sec-body" style={{marginTop:16}}>
                <em>The treatment gap is not a failure of people. It is a failure of the system.</em>
              </p>
              <p className="sec-body" style={{marginTop:16}}>
                <strong>
                  SATTVA is not built on the premise that something is wrong with you. It is built
                  on the premise that something in you already knows the way back.
                </strong>
              </p>
            </div>
            <div className="reveal-right">
              <div className="stats-block">
                {[
                  { num:'197M', label:'Indians experiencing mental health conditions', source:'WHO Global Mental Health Report, 2022' },
                  { num:'83%', label:'treatment gap — most receive no care at all', source:'The Lancet, India State-Level Disease Burden' },
                  { num:'1 in 5', label:'Indians will experience a mental health condition in their lifetime', source:'NIMHANS National Mental Health Survey' },
                  { num:'₹1.03T', label:'estimated economic loss from mental health conditions annually', source:'World Economic Forum India Report' },
                ].map((s,i) => (
                  <div className="stat-card" key={i}>
                    <div className="stat-num">{s.num}</div>
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-source">{s.source}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Arch to="#060E1A"/>

      {/* ── THERAPY COMPARISON ── */}
      <section className="therapy">
        <div className="section-inner">
          <div className="therapy-grid">
            <div className="reveal-left">
              <span className="sec-label">The Gap</span>
              <h2 className="sec-title">Why modern<br />therapy alone<br /><em>is not enough.</em></h2>
              <p className="sec-body">
                Modern psychology is a gift. But it was built in the West, for Western minds,
                within a Western understanding of what a human being is. It treats symptoms.
                It rarely asks why — at a cosmic, constitutional, karmic level — this person,
                at this moment, is suffering in this specific way.
              </p>
              <p className="sec-body" style={{marginTop:16}}>
                <em>India has always had the deeper answer. We just stopped teaching it.</em>
              </p>
              <p className="sec-body" style={{marginTop:16}}>
                This is not an argument against therapy. It is an argument for completeness.
                <strong> SATTVA fills the space that modern psychology was never designed to reach.</strong>
              </p>
            </div>
            <div className="reveal-right">
              <div className="compare-block">
                <div className="compare-row">
                  <div className="compare-cell header modern">Modern Psychology</div>
                  <div className="compare-cell header iks">IKS Approach</div>
                </div>
                {[
                  ['Treats the symptom','Finds the root — planetary, constitutional, karmic'],
                  ['Same protocol for all','Every healing is completely personal'],
                  ['Begins at crisis point','Builds resilience before the crisis arrives'],
                  ['Mind and body separate','Mind, body, and cosmos are one system'],
                  ['Weekly sessions','A complete daily healing practice'],
                  ['Western framework','Built in and for India — for 5,000 years'],
                ].map(([mod, iks], i) => (
                  <div className="compare-row" key={i}>
                    <div className="compare-cell">{mod}</div>
                    <div className="compare-cell iks-val">{iks}</div>
                  </div>
                ))}
                <div className="compare-cell gap">SATTVA bridges both. Not either / or.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Arch to="#0D1F35"/>

      {/* ── IKS MANIFESTO ── */}
      <section className="iks-section">
        <div className="section-inner">
          <div className="manifesto reveal">
            <div className="eyebrow" style={{justifyContent:'center'}}><div className="ey-line"/><span className="ey-text">The IKS Answer</span><div className="ey-line"/></div>
            <h2 className="manifesto-title">
              Not alternative.<br /><em>Foundational.</em>
            </h2>
            <div className="manifesto-lines">
              {[
                { n:'01', text:<>India did not wait for neuroscience to discover the mind-body connection. <strong>Charaka mapped it 3,000 years ago.</strong></> },
                { n:'02', text:<>Jyotisha did not wait for psychology to understand that timing shapes experience. <em>It built a complete system around it.</em></> },
                { n:'03', text:<>Yoga did not wait for Stanford to prove breathwork reduces anxiety. <strong>It had already designed 50 techniques to address exactly that.</strong></> },
                { n:'04', text:<>Mantra did not wait for Harvard to discover the default mode network. <em>It had already named the problem — Chitta Vritti — and built the solution.</em></> },
                { n:'05', text:<>IKS is not alternative medicine. <strong>It is the original medicine of this civilisation — and it is time we returned to it.</strong></> },
              ].map((l, i) => (
                <div className="m-line" key={i}>
                  <div className="m-num">{l.n}</div>
                  <div className="m-text">{l.text}</div>
                </div>
              ))}
            </div>
            <div className="manifesto-quote">
              <p className="mq-text">
                "The mind that is in harmony with its own nature needs no medicine.
                <em> The science of Sattva is the science of that harmony.</em>"
              </p>
              <div className="mq-attr">— Charaka Saṃhitā · Sūtrasthāna</div>
            </div>
          </div>
        </div>
      </section>

      <Arch to="#060E1A"/>

      {/* ── FOUNDER ── */}
      <section className="founder-section">
        <div className="section-inner">
          <div className="founder-grid">
            <div className="reveal-left">
              <div className="founder-visual">
                <span className="founder-symbol">ज्योतिष</span>
                <span className="founder-role">Founder & Chief Jyotishi</span>
                <div className="founder-name">The Jyotishi</div>
                <div className="founder-title">Practicing Vedic Astrologer · IKS Wellness Guide</div>
                <div className="founder-stats">
                  {[
                    { num:'10,000+', label:'Consultations' },
                    { num:'5+', label:'Years practice' },
                    { num:'3', label:'Guiding masters' },
                  ].map((s, i) => (
                    <div className="fs-item" key={i}>
                      <div className="fs-label">{s.label}</div>
                      <div className="fs-num">{s.num}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="reveal-right">
              <div className="founder-content">
                <span className="sec-label">Why SATTVA Exists</span>
                <h2 className="sec-title">Built by someone<br />who has sat with<br /><em>10,000 minds.</em></h2>
                <p className="sec-body">
                  SATTVA was not built in a boardroom. It was built across 10,000+ consultations —
                  one person at a time, one chart at a time, one Moon at a time.
                </p>
                <p className="sec-body" style={{marginTop:16}}>
                  Over years of practice, guided by masters in the Jyotisha tradition, a pattern
                  became clear: <em>every form of mental suffering leaves a specific, readable signature
                  in the birth chart.</em> Chandra afflicted by Shani. Rahu clouding the mind.
                  Ketu cutting the emotional thread.
                </p>
                <p className="sec-body" style={{marginTop:16}}>
                  And every signature had a corresponding remedy — in Jyotisha, in Ayurveda,
                  in Yoga, in Mantra. The knowledge existed. What didn't exist was a way to
                  make it accessible to the millions who needed it and would never find their
                  way to a Jyotishi's consultation room.
                </p>
                <p className="sec-body" style={{marginTop:16}}>
                  <strong>SATTVA is that way.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Arch to="#0D1F35"/>

      {/* ── VISION ── */}
      <section className="vision-section">
        <div className="vision-inner">
          <div className="vision-header reveal">
            <div className="eyebrow" style={{justifyContent:'center'}}><div className="ey-line"/><span className="ey-text">Where We're Going</span><div className="ey-line"/></div>
            <h2 className="sec-title" style={{textAlign:'center'}}>The next<br /><em>10 years.</em></h2>
          </div>
          <div className="vision-grid reveal">
            {[
              { year:'2026', title:'The foundation.', body:'Phase 1 live. 30-day personalised journeys for free. Jyotisha, Ayurveda, Yoga and Mantra — woven into a daily practice that anyone in India can access from their phone.' },
              { year:'2027', title:'The mind evolution.', body:'Phase 2 launches. Mercury work — structured thinking, philosophy, mental clarity. For those who have completed Phase 1 and are ready to go deeper than symptom relief.' },
              { year:'2028', title:'The human layer.', body:'A network of trained IKS wellness practitioners — Jyotishis, Ayurvedic counsellors, Yoga therapists — available for 1-on-1 consultations through SATTVA for those who need human guidance.' },
              { year:'2030', title:'A new standard for India.', body:"SATTVA as India's definitive mental wellness platform — a practitioner network across every state, and IKS recognised globally as a complete system of mind science." },
            ].map((v, i) => (
              <div className="vision-card" key={i}>
                <div className="vc-year">{v.year}</div>
                <div className="vc-title">{v.title}</div>
                <div className="vc-body">{v.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Arch to="#060E1A"/>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-inner reveal">
          <h2 className="cta-title">Be part of<br /><em>the return.</em></h2>
          <p className="cta-body">
            5,000 years of India's healing intelligence is waiting for you.
            Not in a dusty library. Right here. Personalised to your Moon,
            your constitution, and this exact moment in your life.
          </p>
          <div className="cta-btns">
            <button className="btn-primary" onClick={() => window.location.href='/signup'}>Begin — it's free</button>
            <button className="btn-ghost" onClick={() => window.location.href='/how-it-works'}>How it works</button>
          </div>
        </div>
      </section>

      <footer>
        <div className="foot-inner">
          <div className="foot-brand">SATTVA <span>Heals</span></div>
          <div className="foot-copy">
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