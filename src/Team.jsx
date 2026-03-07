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
    padding: 160px 72px 120px;
    text-align: center; position: relative; overflow: hidden;
    background: radial-gradient(ellipse at 50% 0%, rgba(168,204,224,0.05) 0%, transparent 55%);
  }
  .eyebrow { display:inline-flex; align-items:center; gap:12px; margin-bottom:20px; }
  .ey-line { width:32px; height:1px; background:var(--gold-dim); }
  .ey-text { font-size:10px; letter-spacing:4px; color:var(--gold); text-transform:uppercase; font-weight:500; }
  .hero-title { font-family:'Cormorant Garamond',serif; font-size:clamp(44px,6vw,80px); font-weight:600; line-height:1.1; color:var(--pearl); margin-bottom:20px; animation:fadeUp 0.9s ease both; }
  .hero-title em { font-style:italic; color:var(--gold); }
  .hero-sub { font-size:17px; line-height:1.85; color:var(--pearl-dim); max-width:560px; margin:0 auto; animation:fadeUp 0.9s 0.15s ease both; font-weight:300; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

  /* ARCH */
  .arch { width:100%; overflow:hidden; line-height:0; }
  .arch svg { display:block; width:100%; }

  /* FOUNDER SECTION */
  .founder-section { padding:120px 72px; background:var(--deep); position:relative; overflow:hidden; }
  .founder-section::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 30% 50%, rgba(168,204,224,0.04) 0%, transparent 55%); pointer-events:none; }
  .founder-inner { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:1fr 1.4fr; gap:100px; align-items:center; }

  /* Photo */
  .photo-wrap { position:relative; }
  .photo-frame {
    position: relative; overflow: hidden;
    border: 1px solid rgba(168,204,224,0.08);
  }
  .photo-frame img {
    width: 100%; display: block;
    filter: contrast(1.05) saturate(0.95);
    transition: transform 0.8s cubic-bezier(0.16,1,0.3,1);
  }
  .photo-frame:hover img { transform: scale(1.03); }

  /* Gold corner accents */
  .photo-frame::before {
    content:''; position:absolute; top:12px; left:12px;
    width:32px; height:32px; z-index:2; pointer-events:none;
    border-top:1px solid var(--gold-dim); border-left:1px solid var(--gold-dim);
  }
  .photo-frame::after {
    content:''; position:absolute; bottom:12px; right:12px;
    width:32px; height:32px; z-index:2; pointer-events:none;
    border-bottom:1px solid var(--gold-dim); border-right:1px solid var(--gold-dim);
  }
  /* Photo overlay gradient */
  .photo-overlay {
    position:absolute; bottom:0; left:0; right:0; height:40%;
    background:linear-gradient(to top, rgba(13,31,53,0.6), transparent);
    pointer-events:none;
  }
  /* Photo stat badge */
  .photo-badge {
    position:absolute; bottom:24px; left:24px; z-index:3;
    background:rgba(6,14,26,0.85); backdrop-filter:blur(12px);
    border:1px solid rgba(168,204,224,0.12);
    padding:14px 20px;
  }
  .pb-num { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:600; color:var(--gold); line-height:1; }
  .pb-label { font-size:10px; letter-spacing:2px; color:var(--pearl-dim); text-transform:uppercase; margin-top:3px; }

  /* Content */
  .founder-content {}
  .fc-role { font-size:10px; letter-spacing:4px; color:var(--gold); text-transform:uppercase; font-weight:500; margin-bottom:14px; display:block; }
  .fc-name { font-family:'Cormorant Garamond',serif; font-size:clamp(40px,5vw,64px); font-weight:600; color:var(--pearl); line-height:1.05; margin-bottom:6px; }
  .fc-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-style:italic; color:var(--moon); margin-bottom:32px; }

  .fc-stats { display:grid; grid-template-columns:1fr 1fr; gap:3px; margin-bottom:36px; }
  .fc-stat {
    padding:18px 20px;
    background:rgba(6,14,26,0.5);
    border:1px solid rgba(168,204,224,0.06);
    transition:all 0.3s; position:relative;
  }
  .fc-stat::before { content:''; position:absolute; top:0; left:0; width:100%; height:1px; background:linear-gradient(90deg, var(--gold-dim), transparent); opacity:0; transition:opacity 0.3s; }
  .fc-stat:hover::before { opacity:1; }
  .fc-stat:hover { background:rgba(17,40,64,0.6); }
  .fcs-num { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:600; color:var(--gold); line-height:1; margin-bottom:4px; }
  .fcs-label { font-size:11px; color:var(--pearl-dim); letter-spacing:0.5px; }

  .fc-body { font-size:15px; line-height:1.95; color:var(--pearl-dim); margin-bottom:16px; }
  .fc-body em { font-style:italic; color:var(--moon); font-family:'Cormorant Garamond',serif; font-size:17px; }
  .fc-body strong { color:var(--pearl); font-weight:500; }

  .fc-quote {
    margin-top:28px; padding:22px 26px;
    background:rgba(6,14,26,0.4);
    border-left:2px solid var(--gold-dim);
  }
  .fcq-text { font-family:'Cormorant Garamond',serif; font-size:17px; font-style:italic; color:var(--pearl); line-height:1.65; margin-bottom:10px; }
  .fcq-text em { color:var(--gold); }
  .fcq-attr { font-size:10px; letter-spacing:2px; color:var(--pearl-dim); text-transform:uppercase; }

  /* PHILOSOPHY */
  .philosophy { padding:120px 72px; background:var(--abyss); position:relative; }
  .philosophy-inner { max-width:1100px; margin:0 auto; }
  .phil-header { margin-bottom:72px; }
  .sec-label { font-size:10px; letter-spacing:4px; color:var(--gold); text-transform:uppercase; font-weight:500; margin-bottom:16px; display:block; }
  .sec-title { font-family:'Cormorant Garamond',serif; font-size:clamp(36px,4.5vw,56px); font-weight:600; color:var(--pearl); line-height:1.15; }
  .sec-title em { font-style:italic; color:var(--gold); }

  .phil-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:3px; }
  .phil-card {
    padding:36px 32px;
    background:rgba(13,31,53,0.4);
    border:1px solid rgba(168,204,224,0.06);
    position:relative; overflow:hidden;
    transition:all 0.4s;
  }
  .phil-card:hover { background:rgba(17,40,64,0.7); border-color:rgba(168,204,224,0.12); }
  .phil-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1px; background:linear-gradient(90deg, var(--gold-dim), transparent); opacity:0; transition:opacity 0.4s; }
  .phil-card:hover::after { opacity:1; }
  .pc-num { font-family:'Cormorant Garamond',serif; font-size:64px; font-weight:700; color:rgba(168,204,224,0.04); line-height:1; position:absolute; top:12px; right:16px; }
  .pc-sk { font-family:'Noto Serif Devanagari',serif; font-size:28px; color:var(--moon); opacity:0.25; margin-bottom:16px; display:block; line-height:1; }
  .pc-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--pearl); margin-bottom:12px; }
  .pc-body { font-size:13px; line-height:1.85; color:var(--pearl-dim); }

  /* MASTERS */
  .masters { padding:120px 72px; background:var(--deep); position:relative; overflow:hidden; }
  .masters::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 70% 50%, rgba(168,204,224,0.03) 0%, transparent 55%); pointer-events:none; }
  .masters-inner { max-width:900px; margin:0 auto; text-align:center; }
  .masters-title { font-family:'Cormorant Garamond',serif; font-size:clamp(36px,4.5vw,56px); font-weight:600; color:var(--pearl); line-height:1.15; margin-bottom:16px; }
  .masters-title em { font-style:italic; color:var(--gold); }
  .masters-sub { font-size:16px; line-height:1.85; color:var(--pearl-dim); max-width:560px; margin:0 auto 64px; }

  .lineage {
    display:flex; align-items:center; justify-content:center;
    gap:0; flex-wrap:wrap; margin-bottom:64px;
  }
  .lineage-node {
    text-align:center; padding:24px 32px;
    background:rgba(6,14,26,0.5);
    border:1px solid rgba(168,204,224,0.07);
    min-width:160px;
    transition:all 0.3s;
  }
  .lineage-node:hover { border-color:rgba(168,204,224,0.15); background:rgba(17,40,64,0.5); }
  .ln-role { font-size:9px; letter-spacing:3px; color:var(--moon-dim); text-transform:uppercase; margin-bottom:8px; display:block; }
  .ln-name { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:600; color:var(--pearl); }
  .ln-sub { font-size:11px; color:var(--pearl-dim); margin-top:4px; }
  .lineage-arrow {
    font-size:18px; color:var(--gold-dim); padding:0 8px;
    opacity:0.5;
  }

  .masters-note {
    padding:28px 36px;
    background:rgba(6,14,26,0.4);
    border:1px solid rgba(168,204,224,0.06);
    border-top:2px solid var(--gold-dim);
    max-width:640px; margin:0 auto;
  }
  .mn-text { font-family:'Cormorant Garamond',serif; font-size:18px; font-style:italic; color:var(--pearl); line-height:1.7; }
  .mn-text em { color:var(--gold); }

  /* CTA */
  .cta-section { padding:120px 72px; background:var(--abyss); text-align:center; position:relative; overflow:hidden; }
  .cta-section::before { content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:600px; height:600px; border-radius:50%; background:radial-gradient(circle,rgba(168,204,224,0.04) 0%,transparent 70%); pointer-events:none; }
  .cta-inner { max-width:560px; margin:0 auto; position:relative; z-index:1; }
  .cta-title { font-family:'Cormorant Garamond',serif; font-size:clamp(36px,5vw,60px); font-weight:600; color:var(--pearl); line-height:1.1; margin-bottom:16px; }
  .cta-title em { font-style:italic; color:var(--gold); }
  .cta-body { font-size:16px; line-height:1.85; color:var(--pearl-dim); margin-bottom:40px; }
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
    .hero,.founder-section,.philosophy,.masters,.cta-section{padding:100px 24px 80px;}
    .founder-inner{grid-template-columns:1fr;gap:48px;}
    .fc-stats{grid-template-columns:1fr 1fr;}
    .phil-grid{grid-template-columns:1fr;}
    .lineage{flex-direction:column;}
    .lineage-arrow{transform:rotate(90deg);}
    .cursor,.cursor-ring{display:none;}
    body{cursor:auto;}
  }
`;

function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    const mv = e => {
      if(dot.current){dot.current.style.left=e.clientX+'px';dot.current.style.top=e.clientY+'px';}
      if(ring.current){ring.current.style.left=e.clientX+'px';ring.current.style.top=e.clientY+'px';}
    };
    window.addEventListener('mousemove',mv);
    return()=>window.removeEventListener('mousemove',mv);
  },[]);
  return(<><div className="cursor" ref={dot}/><div className="cursor-ring" ref={ring}/></>);
}

function StarField() {
  const ref = useRef(null);
  useEffect(()=>{
    const canvas=ref.current; if(!canvas)return;
    let ctx; try{ctx=canvas.getContext('2d');}catch(e){return;} if(!ctx)return;
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

export default function Team(){
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
        <div className="eyebrow"><div className="ey-line"/><span className="ey-text">The Jyotishis</span><div className="ey-line"/></div>
        <h1 className="hero-title">The people behind<br /><em>your healing.</em></h1>
        <p className="hero-sub">SATTVA is not an algorithm. It is a living practice, built by a practicing Jyotishi — guided by masters, grounded in 10,000+ real consultations.</p>
      </section>

      <Arch to="#0D1F35"/>

      {/* FOUNDER */}
      <section className="founder-section">
        <div className="founder-inner">
          <div className="reveal-left">
            <div className="photo-wrap">
              <div className="photo-frame">
                <img src="/varad_team.jpg" alt="Varad Bidwai — Founder & Chief Jyotishi"/>
                <div className="photo-overlay"/>
                <div className="photo-badge">
                  <div className="pb-num">10,000+</div>
                  <div className="pb-label">Consultations</div>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal-right">
            <div className="founder-content">
              <span className="fc-role">Founder & Chief Jyotishi</span>
              <div className="fc-name">Varad Bidwai</div>
              <div className="fc-title">Vedic Astrologer · IKS Wellness Guide</div>

              <div className="fc-stats">
                {[
                  { num:'10,000+', label:'Consultations' },
                  { num:'2+', label:'Years of practice' },
                  { num:'3', label:'Guiding masters' },
                  { num:'4', label:'Sciences integrated' },
                ].map((s,i)=>(
                  <div className="fc-stat" key={i}>
                    <div className="fcs-num">{s.num}</div>
                    <div className="fcs-label">{s.label}</div>
                  </div>
                ))}
              </div>

              <p className="fc-body">
                SATTVA was not built in a boardroom. It was built one chart at a time,
                one person at a time — across thousands of consultations where a pattern
                became impossible to ignore.
              </p>
              <p className="fc-body" style={{marginTop:14}}>
                <em>Every form of mental suffering leaves a specific, readable signature in the birth chart.</em> Chandra afflicted by Shani. Rahu clouding the mind. Ketu cutting the emotional thread. And every signature has a corresponding remedy — in Jyotisha, Ayurveda, Yoga, and Mantra.
              </p>
              <p className="fc-body" style={{marginTop:14}}>
                The knowledge existed for 5,000 years. <strong>What didn't exist was a way to make it accessible to the millions who would never find their way to a Jyotishi's consultation room. SATTVA is that way.</strong>
              </p>

              <div className="fc-quote">
                <div className="fcq-text">
                  "I did not build SATTVA because I wanted to build a product.
                  I built it because after 10,000 consultations, I could not
                  <em> not</em> build it."
                </div>
                <div className="fcq-attr">— Varad Bidwai · Founder, SATTVA Heals</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Arch to="#060E1A"/>

      {/* PHILOSOPHY */}
      <section className="philosophy">
        <div className="philosophy-inner">
          <div className="phil-header reveal">
            <span className="sec-label">The Practice</span>
            <h2 className="sec-title">How Varad<br /><em>reads a chart.</em></h2>
          </div>
          <div className="phil-grid">
            {[
              { num:'01', sk:'चन्द्र', title:'Moon first. Always.', body:"Every consultation begins with Chandra. The Moon is the mind — its sign, its Nakshatra, its afflictions and its strengths. Before any prediction, before any remedy, comes the reading of the Moon." },
              { num:'02', sk:'दशा', title:'Why this is happening now.', body:"The Dasha system reveals which planetary energy is active at this moment in your life. It explains why the same person suffers differently at different ages — and when the suffering shifts." },
              { num:'03', sk:'उपाय', title:'Remedy, not just reading.', body:"A Jyotisha consultation without a remedy is incomplete. Every session ends with a specific, actionable protocol — mantra, ritual, timing, Ayurvedic support — calibrated to what the chart reveals." },
            ].map((p,i)=>(
              <div className="phil-card reveal" key={i} style={{transitionDelay:`${i*0.1}s`}}>
                <div className="pc-num">{p.num}</div>
                <span className="pc-sk">{p.sk}</span>
                <div className="pc-title">{p.title}</div>
                <div className="pc-body">{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Arch to="#0D1F35"/>

      {/* MASTERS */}
      <section className="masters">
        <div className="masters-inner">
          <div className="reveal">
            <div className="eyebrow" style={{justifyContent:'center'}}><div className="ey-line"/><span className="ey-text">The Lineage</span><div className="ey-line"/></div>
            <h2 className="masters-title">Guided by<br /><em>masters.</em></h2>
            <p className="masters-sub">
              Jyotisha is a transmitted knowledge — it passes from master to student across generations.
              Varad's practice is rooted in a direct lineage of three guiding masters whose names,
              in the tradition of this knowledge, remain within the practice.
            </p>
          </div>

          <div className="lineage reveal">
            {[
              { role:'Third Master', name:'The Lineage', sub:'The source tradition' },
              { role:'Second Master', name:'The Teacher', sub:'Passed the torch' },
              { role:'First Master', name:'The Guide', sub:'Direct transmission' },
              { role:'Student', name:'Varad Bidwai', sub:'Carrying it forward' },
            ].map((n,i)=>(
              <>
                <div className="lineage-node" key={n.role}>
                  <span className="ln-role">{n.role}</span>
                  <div className="ln-name">{n.name}</div>
                  <div className="ln-sub">{n.sub}</div>
                </div>
                {i < 3 && <div className="lineage-arrow" key={`a${i}`}>→</div>}
              </>
            ))}
          </div>

          <div className="masters-note reveal">
            <div className="mn-text">
              "In the Jyotisha tradition, the master's name is not shared publicly —
              the knowledge is shared. <em>What matters is what was transmitted,
              not who transmitted it.</em>"
            </div>
          </div>
        </div>
      </section>

      <Arch to="#060E1A"/>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner reveal">
          <h2 className="cta-title">Ready to begin<br /><em>your journey?</em></h2>
          <p className="cta-body">10,000 consultations. 5,000 years of knowledge. One path — personalised entirely to you.</p>
          <div className="cta-btns">
            <button className="btn-primary" onClick={()=>window.location.href='/signup'}>Begin — it's free</button>
            <button className="btn-ghost" onClick={()=>window.location.href='/consult'}>Book a consultation</button>
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