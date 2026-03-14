import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600;1,700&family=Outfit:wght@200;300;400;500;600&family=Noto+Serif+Devanagari:wght@300;400;500;600&display=swap');`;

const css = `
  :root {
    --abyss:#060E1A; --deep:#0D1F35; --surface:#112840;
    --moon:#A8CCE0; --moon-dim:#6B95AE;
    --gold:#E2C27D; --gold-dim:#B89A55;
    --pearl:#D8EEF8; --pearl-dim:#8BAFC4;
    --green:#6ECBA0; --red:#E07070;
  }
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{background:var(--abyss);color:var(--pearl);font-family:'Outfit',sans-serif;font-weight:300;overflow-x:hidden;}
  body::after{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");pointer-events:none;z-index:998;opacity:0.4;}

  .cursor{width:8px;height:8px;background:var(--moon);border-radius:50%;position:fixed;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:left 0.06s,top 0.06s;}
  .cursor-ring{width:28px;height:28px;border:1px solid rgba(168,204,224,0.3);border-radius:50%;position:fixed;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:left 0.14s ease-out,top 0.14s ease-out;}

  /* Nav */
  .iss-nav{position:fixed;top:0;left:0;right:0;z-index:100;height:64px;padding:0 48px;display:flex;align-items:center;justify-content:space-between;background:rgba(6,14,26,0.92);backdrop-filter:blur(20px);border-bottom:1px solid rgba(168,204,224,0.06);}
  .iss-nav-brand{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--pearl);letter-spacing:4px;text-transform:uppercase;text-decoration:none;cursor:pointer;}
  .iss-nav-brand span{color:var(--gold);}
  .iss-nav-links{display:flex;align-items:center;gap:24px;}
  .iss-nav-link{background:none;border:none;font-family:'Outfit',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--pearl-dim);cursor:pointer;transition:color 0.2s;padding:0;}
  .iss-nav-link:hover{color:var(--moon);}
  .iss-nav-cta{padding:8px 20px;border:1px solid rgba(226,194,125,0.3);background:transparent;color:var(--gold);font-family:'Outfit',sans-serif;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;cursor:pointer;border-radius:1px;transition:all 0.25s;}
  .iss-nav-cta:hover{border-color:var(--gold);background:rgba(226,194,125,0.06);}

  /* Page */
  .iss-wrap{min-height:100vh;padding:120px 48px 80px;max-width:1100px;margin:0 auto;position:relative;z-index:10;}

  /* Hero */
  .iss-hero{margin-bottom:72px;}
  .iss-eyebrow{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--moon-dim);margin-bottom:16px;display:flex;align-items:center;gap:12px;}
  .iss-eyebrow::before{content:'';width:24px;height:1px;background:var(--gold-dim);}
  .iss-title{font-family:'Cormorant Garamond',serif;font-size:clamp(40px,6vw,72px);font-weight:400;color:var(--pearl);line-height:1.1;margin-bottom:20px;}
  .iss-title em{color:var(--gold);font-style:italic;}
  .iss-subtitle{font-size:16px;line-height:1.9;color:var(--pearl-dim);max-width:540px;}

  /* Grid */
  .iss-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}

  /* Card */
  .iss-card{
    position:relative;
    background:rgba(13,31,53,0.65);
    border:1px solid rgba(168,204,224,0.08);
    border-radius:20px;
    padding:32px 28px 28px;
    cursor:pointer;
    transition:all 0.35s cubic-bezier(0.4,0,0.2,1);
    overflow:hidden;
    backdrop-filter:blur(10px);
  }
  .iss-card::before{
    content:'';position:absolute;inset:0;border-radius:20px;
    background:radial-gradient(ellipse at 50% 0%,rgba(226,194,125,0.07),transparent 65%);
    opacity:0;transition:opacity 0.35s;
  }
  .iss-card:hover{
    border-color:rgba(226,194,125,0.3);
    transform:translateY(-4px);
    box-shadow:0 16px 48px rgba(0,0,0,0.35);
  }
  .iss-card:hover::before{opacity:1;}

  .iss-card-number{
    font-family:'Cormorant Garamond',serif;
    font-size:11px;letter-spacing:3px;color:var(--gold-dim);
    text-transform:uppercase;margin-bottom:20px;
    opacity:0.6;
  }
  .iss-card-icon{font-size:32px;margin-bottom:16px;display:block;line-height:1;}
  .iss-card-name{
    font-family:'Cormorant Garamond',serif;
    font-size:32px;font-weight:500;color:var(--pearl);
    margin-bottom:6px;line-height:1.1;
  }
  .iss-card-sk{
    font-family:'Noto Serif Devanagari',serif;
    font-size:14px;color:var(--moon-dim);
    margin-bottom:14px;display:block;
  }
  .iss-card-tag{
    font-size:13px;color:var(--pearl-dim);
    line-height:1.6;margin-bottom:20px;
    font-style:italic;
  }
  .iss-card-dosha{
    display:inline-flex;align-items:center;gap:8px;
    font-size:10px;letter-spacing:2px;text-transform:uppercase;
    color:var(--moon-dim);
  }
  .iss-card-dosha::before{content:'';width:16px;height:1px;background:var(--moon-dim);}

  .iss-card-arrow{
    position:absolute;bottom:28px;right:28px;
    font-size:18px;color:var(--gold-dim);
    transition:transform 0.3s,color 0.3s;
    opacity:0.5;
  }
  .iss-card:hover .iss-card-arrow{transform:translate(3px,-3px);color:var(--gold);opacity:1;}

  /* Fade in animations */
  .iss-fadein{opacity:0;transform:translateY(20px);animation:issFade 0.6s cubic-bezier(0.4,0,0.2,1) forwards;}
  @keyframes issFade{to{opacity:1;transform:translateY(0);}}
  .iss-d0{animation-delay:0.05s;} .iss-d1{animation-delay:0.1s;} .iss-d2{animation-delay:0.15s;}
  .iss-d3{animation-delay:0.2s;}  .iss-d4{animation-delay:0.25s;} .iss-d5{animation-delay:0.3s;}
  .iss-hero-anim{animation-delay:0s;}

  /* Bottom CTA */
  .iss-cta{
    margin-top:64px;padding:40px 40px;
    background:rgba(13,31,53,0.6);
    border:1px solid rgba(168,204,224,0.08);
    border-radius:20px;
    display:flex;align-items:center;justify-content:space-between;gap:32px;
    backdrop-filter:blur(10px);
  }
  .iss-cta-text{}
  .iss-cta-label{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--moon-dim);margin-bottom:8px;}
  .iss-cta-heading{font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--pearl);}
  .iss-cta-heading em{color:var(--gold);font-style:italic;}
  .iss-cta-body{font-size:14px;color:var(--pearl-dim);margin-top:6px;line-height:1.7;max-width:440px;}
  .iss-cta-btn{
    flex-shrink:0;
    padding:16px 36px;
    background:linear-gradient(135deg,rgba(226,194,125,0.15),rgba(226,194,125,0.05));
    border:1px solid rgba(226,194,125,0.35);
    color:var(--gold);
    font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;
    letter-spacing:3px;text-transform:uppercase;
    cursor:pointer;border-radius:2px;transition:all 0.3s;white-space:nowrap;
  }
  .iss-cta-btn:hover{border-color:var(--gold);background:rgba(226,194,125,0.12);box-shadow:0 0 28px rgba(226,194,125,0.1);}

  @media(max-width:960px){.iss-grid{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:600px){
    .iss-grid{grid-template-columns:1fr;}
    .iss-wrap{padding:100px 20px 60px;}
    .iss-nav{padding:0 20px;}
    .iss-cta{flex-direction:column;align-items:flex-start;padding:28px 24px;}
    .iss-cta-btn{width:100%;text-align:center;}
  }
`;

const ISSUES = [
  {
    slug:'anxiety',
    name:'Anxiety',
    sk:'चिन्ता',
    icon:'🌊',
    tag:'A restlessness I cannot explain — the mind seeking safety it cannot find.',
    dosha:'Primary: Vata · Secondary: Pitta',
    num:'01',
  },
  {
    slug:'aggression',
    name:'Aggression',
    sk:'क्रोध',
    icon:'🔥',
    tag:'A sharpness that comes too fast — the fire that burns before it warms.',
    dosha:'Primary: Pitta · Secondary: Vata',
    num:'02',
  },
  {
    slug:'overthinking',
    name:'Overthinking',
    sk:'चित्त वृत्ति',
    icon:'🌀',
    tag:'A mind that will not be quiet — loops that go nowhere but keep running.',
    dosha:'Primary: Vata · Secondary: Pitta',
    num:'03',
  },
  {
    slug:'stress',
    name:'Stress',
    sk:'मनस्ताप',
    icon:'⚡',
    tag:'Too much. Too fast. Running out of myself.',
    dosha:'Primary: Vata + Pitta · Combined',
    num:'04',
  },
  {
    slug:'lowmood',
    name:'Low Mood',
    sk:'विषाद',
    icon:'🌑',
    tag:'Heavy, empty, no motivation — the light that has gone quiet inside.',
    dosha:'Primary: Kapha · Secondary: Vata',
    num:'05',
  },
  {
    slug:'fear',
    name:'Fear',
    sk:'भय',
    icon:'🌫',
    tag:'A worry that lives deeper than thought — safety the mind cannot hold.',
    dosha:'Primary: Vata · Secondary: Kapha',
    num:'06',
  },
];

function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if(!canvas) return;
    let ctx; try{ctx=canvas.getContext('2d');}catch(e){return;}
    let W=canvas.width=window.innerWidth, H=canvas.height=window.innerHeight;
    const onResize=()=>{W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;};
    window.addEventListener('resize',onResize);
    const stars=Array.from({length:70},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1+0.2,dx:(Math.random()-0.5)*0.06,dy:-Math.random()*0.09-0.02,o:Math.random()*0.3+0.08,ts:Math.random()*0.01+0.003,to:Math.random()*Math.PI*2}));
    let frame=0,id;
    const draw=()=>{ctx.clearRect(0,0,W,H);frame++;stars.forEach(s=>{ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(168,204,224,${s.o*(Math.sin(frame*s.ts+s.to)*0.35+0.65)})`;ctx.fill();s.x+=s.dx;s.y+=s.dy;if(s.y<-5){s.y=H+5;s.x=Math.random()*W;}if(s.x<-5)s.x=W+5;if(s.x>W+5)s.x=-5;});id=requestAnimationFrame(draw);};
    draw();
    return()=>{cancelAnimationFrame(id);window.removeEventListener('resize',onResize);};
  },[]);
  return <canvas ref={ref} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1,opacity:0.5}}/>;
}

function Cursor() {
  const dot=useRef(null),ring=useRef(null);
  useEffect(()=>{
    const mv=e=>{if(dot.current){dot.current.style.left=e.clientX+'px';dot.current.style.top=e.clientY+'px';}if(ring.current){ring.current.style.left=e.clientX+'px';ring.current.style.top=e.clientY+'px';}};
    window.addEventListener('mousemove',mv);return()=>window.removeEventListener('mousemove',mv);
  },[]);
  return <><div className="cursor" ref={dot}/><div className="cursor-ring" ref={ring}/></>;
}

export default function Issues() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  return (
    <>
      <style>{FONTS+css}</style>
      <Cursor/>
      <StarField/>

      <nav className="iss-nav">
        <div className="iss-nav-brand" onClick={() => navigate('/')}>
          SATTVA <span>Heals</span>
        </div>
        <div className="iss-nav-links">
          <button className="iss-nav-link" onClick={() => navigate('/how-it-works')}>How it works</button>
          <button className="iss-nav-link" onClick={() => navigate('/consult')}>Consult</button>
          {user
            ? <button className="iss-nav-cta" onClick={() => navigate('/dashboard')}>My Space</button>
            : <button className="iss-nav-cta" onClick={() => navigate('/onboarding')}>Begin — free</button>
          }
        </div>
      </nav>

      <div className="iss-wrap">

        {/* Hero */}
        <div className="iss-hero iss-fadein iss-hero-anim">
          <div className="iss-eyebrow">What Sattva addresses</div>
          <h1 className="iss-title">
            Six expressions<br/>of a <em>disturbed mind.</em>
          </h1>
          <p className="iss-subtitle">
            Indian Knowledge Systems identified these states thousands of years ago —
            named them, understood their roots, and mapped the path back to balance.
            Each one has a cause. Each one has a remedy.
          </p>
        </div>

        {/* Grid */}
        <div className="iss-grid">
          {ISSUES.map((issue, i) => (
            <div
              key={issue.slug}
              className={`iss-card iss-fadein iss-d${i}`}
              onClick={() => navigate(`/issues/${issue.slug}`)}
            >
              <div className="iss-card-number">{issue.num}</div>
              <span className="iss-card-icon">{issue.icon}</span>
              <div className="iss-card-name">{issue.name}</div>
              <span className="iss-card-sk">{issue.sk}</span>
              <div className="iss-card-tag">{issue.tag}</div>
              <div className="iss-card-dosha">{issue.dosha}</div>
              <div className="iss-card-arrow">↗</div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="iss-cta iss-fadein" style={{animationDelay:'0.4s'}}>
          <div className="iss-cta-text">
            <div className="iss-cta-label">Not sure which is yours?</div>
            <div className="iss-cta-heading">
              The assessment will <em>find it for you.</em>
            </div>
            <div className="iss-cta-body">
              Answer 11 questions. Get your Prakriti, your concern in IKS terms,
              and a personalised practice — mantra, diet, and daily routine.
            </div>
          </div>
          <button className="iss-cta-btn" onClick={() => navigate('/onboarding')}>
            Take the assessment
          </button>
        </div>

      </div>
    </>
  );
}