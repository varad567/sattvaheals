import { useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600;1,700&family=Outfit:wght@200;300;400;500;600&family=Noto+Serif+Devanagari:wght@300;400;500;600&display=swap');`;

const css = `
  :root {
    --abyss:     #060E1A;
    --deep:      #0D1F35;
    --moon:      #A8CCE0;
    --moon-dim:  #6B95AE;
    --gold:      #E2C27D;
    --gold-dim:  #B89A55;
    --pearl:     #D8EEF8;
    --pearl-dim: #8BAFC4;
  }
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body { height:100%; }
  body { background:var(--abyss); color:var(--pearl); font-family:'Outfit',sans-serif; font-weight:300; overflow:hidden; }
  body::after { content:''; position:fixed; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E"); pointer-events:none; z-index:998; opacity:0.4; }

  .cursor { width:8px; height:8px; background:var(--moon); border-radius:50%; position:fixed; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); transition:left 0.06s,top 0.06s; }
  .cursor-ring { width:28px; height:28px; border:1px solid rgba(168,204,224,0.3); border-radius:50%; position:fixed; pointer-events:none; z-index:9998; transform:translate(-50%,-50%); transition:left 0.14s ease-out,top 0.14s ease-out; }

  /* Full screen layout */
  .wrap {
    min-height:100vh;
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    text-align:center; position:relative;
    padding:40px 24px;
  }

  /* Moon */
  .moon-wrap {
    position:relative; margin-bottom:48px;
    animation: floatMoon 6s ease-in-out infinite;
  }
  @keyframes floatMoon {
    0%,100% { transform:translateY(0); }
    50% { transform:translateY(-16px); }
  }
  .moon-glow {
    width:180px; height:180px; border-radius:50%;
    background:radial-gradient(circle at center,
      rgba(168,204,224,0.08) 0%,
      rgba(168,204,224,0.03) 50%,
      transparent 75%
    );
    display:flex; align-items:center; justify-content:center;
    position:relative;
  }
  .moon-body {
    width:80px; height:80px; border-radius:50%;
    background:radial-gradient(circle at 38% 35%,
      #E8F4FF 0%, #C8E0F0 25%, #A8CCE0 50%,
      #7AAEC8 75%, #4A82A0 100%
    );
    box-shadow:
      0 0 30px rgba(168,204,224,0.15),
      0 0 60px rgba(168,204,224,0.06),
      inset -8px -8px 16px rgba(74,130,160,0.4);
    position:relative; z-index:2;
  }
  /* Orbit ring */
  .moon-orbit {
    position:absolute; inset:-50px;
    border-radius:50%;
    border:1px solid rgba(168,204,224,0.07);
    animation:spin 40s linear infinite;
  }
  .moon-orbit-2 {
    position:absolute; inset:-80px;
    border-radius:50%;
    border:1px dashed rgba(226,194,125,0.05);
    animation:spin 65s linear infinite reverse;
  }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  /* Nakshatra dots */
  .orbit-dots {
    position:absolute; inset:-50px;
    border-radius:50%;
    animation:spin 40s linear infinite;
  }

  /* Lost comet */
  .comet {
    position:absolute;
    width:2px; height:2px; border-radius:50%;
    background:var(--moon);
    top:20%; left:15%;
    animation:cometFly 8s ease-in-out infinite;
  }
  .comet::after {
    content:''; position:absolute;
    top:50%; right:2px;
    transform:translateY(-50%);
    width:40px; height:1px;
    background:linear-gradient(to left, rgba(168,204,224,0.4), transparent);
  }
  @keyframes cometFly {
    0% { transform:translate(0,0); opacity:0; }
    10% { opacity:1; }
    90% { opacity:1; }
    100% { transform:translate(300px,120px); opacity:0; }
  }

  /* 404 number */
  .num-404 {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(100px,20vw,180px); font-weight:300;
    color:rgba(168,204,224,0.06); line-height:1;
    position:absolute; top:50%; left:50%;
    transform:translate(-50%,-50%);
    pointer-events:none; user-select:none;
    letter-spacing:-4px;
    animation:fadeUp 1s ease both;
  }

  /* Content */
  .content { position:relative; z-index:2; max-width:520px; }
  .eyebrow { display:inline-flex; align-items:center; gap:12px; margin-bottom:20px; }
  .ey-line { width:24px; height:1px; background:var(--gold-dim); }
  .ey-text { font-size:10px; letter-spacing:4px; color:var(--gold); text-transform:uppercase; font-weight:500; }
  .title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(36px,5vw,60px); font-weight:600;
    line-height:1.1; color:var(--pearl);
    margin-bottom:16px;
    animation:fadeUp 0.9s 0.1s ease both;
  }
  .title em { font-style:italic; color:var(--gold); }
  .body {
    font-size:16px; line-height:1.85;
    color:var(--pearl-dim); margin-bottom:12px;
    animation:fadeUp 0.9s 0.2s ease both;
  }
  .skt {
    font-family:'Noto Serif Devanagari',serif;
    font-size:12px; letter-spacing:2px;
    color:var(--gold); margin-bottom:44px; display:block;
    animation:fadeUp 0.9s 0.3s ease both;
  }

  /* Nav links */
  .nav-links {
    display:flex; gap:10px; justify-content:center; flex-wrap:wrap;
    animation:fadeUp 0.9s 0.4s ease both;
  }
  .nav-link {
    padding:12px 28px;
    font-family:'Outfit',sans-serif; font-size:11px;
    font-weight:400; letter-spacing:2px; text-transform:uppercase;
    cursor:none; transition:all 0.35s; border-radius:1px;
    text-decoration:none;
  }
  .nav-link.primary {
    background:linear-gradient(135deg,rgba(168,204,224,0.18),rgba(168,204,224,0.06));
    border:1px solid rgba(168,204,224,0.3); color:var(--pearl);
  }
  .nav-link.primary:hover { border-color:var(--moon); color:var(--moon); }
  .nav-link.ghost {
    background:transparent;
    border:1px solid rgba(168,204,224,0.1); color:var(--pearl-dim);
  }
  .nav-link.ghost:hover { border-color:rgba(168,204,224,0.25); color:var(--pearl); }

  /* Brand */
  .brand {
    position:fixed; top:24px; left:50%;
    transform:translateX(-50%);
    font-family:'Cormorant Garamond',serif;
    font-size:16px; font-weight:600;
    color:var(--pearl); letter-spacing:5px;
    text-transform:uppercase; text-decoration:none;
    z-index:100;
  }
  .brand span { color:var(--gold); font-style:italic; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  @media(max-width:600px){
    .cursor,.cursor-ring{display:none;}
    body{cursor:auto; overflow:auto;}
  }
`;

function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    const mv = e => {
      if (dot.current) { dot.current.style.left=e.clientX+'px'; dot.current.style.top=e.clientY+'px'; }
      if (ring.current) { ring.current.style.left=e.clientX+'px'; ring.current.style.top=e.clientY+'px'; }
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
    window.addEventListener('resize', () => { W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; });
    const stars = Array.from({ length:80 }, () => ({
      x:Math.random()*W, y:Math.random()*H,
      r:Math.random()*1.2+0.2,
      dx:(Math.random()-0.5)*0.08, dy:-Math.random()*0.1-0.02,
      o:Math.random()*0.5+0.1,
      ts:Math.random()*0.012+0.003, to:Math.random()*Math.PI*2,
    }));
    let frame=0, id;
    const draw = () => {
      ctx.clearRect(0,0,W,H); frame++;
      stars.forEach(s => {
        const tw = Math.sin(frame*s.ts+s.to)*0.35+0.65;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(168,204,224,${s.o*tw})`; ctx.fill();
        s.x+=s.dx; s.y+=s.dy;
        if(s.y<-5){s.y=H+5;s.x=Math.random()*W;}
        if(s.x<-5)s.x=W+5; if(s.x>W+5)s.x=-5;
      });
      id=requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);
  return <canvas ref={ref} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0,opacity:0.7}}/>;
}

// Nakshatra dots on orbit ring
const nakshatraDots = Array.from({ length:27 }, (_, i) => {
  const a = (i/27)*Math.PI*2 - Math.PI/2;
  const r = 130;
  return { x: Math.cos(a)*r, y: Math.sin(a)*r, bright: i%9===0 };
});

export default function NotFound() {
  return (
    <>
      <style>{FONTS + css}</style>
      <Cursor/>
      <StarField/>

      <a className="brand" href="/">SATTVA <span>Heals</span></a>

      <div className="wrap">
        {/* Ghost 404 number behind everything */}
        <div className="num-404">404</div>

        {/* Floating moon */}
        <div className="moon-wrap">
          <div className="comet"/>
          <div className="moon-glow">
            <div className="moon-orbit"/>
            <div className="moon-orbit-2"/>

            {/* Nakshatra dots SVG */}
            <svg
              style={{position:'absolute',inset:-130,width:'calc(100% + 260px)',height:'calc(100% + 260px)',pointerEvents:'none'}}
              viewBox="-230 -230 460 460">
              {nakshatraDots.map((d,i) => (
                <circle key={i} cx={d.x} cy={d.y} r={d.bright?2:1.2}
                  fill={d.bright?'#E2C27D':'#A8CCE0'}
                  opacity={d.bright?0.7:0.3}/>
              ))}
              <circle r="130" fill="none" stroke="rgba(168,204,224,0.05)" strokeWidth="1" strokeDasharray="3 8"/>
            </svg>

            <div className="moon-body"/>
          </div>
        </div>

        {/* Text content */}
        <div className="content">
          <div className="eyebrow">
            <div className="ey-line"/>
            <span className="ey-text">Lost in the cosmos</span>
            <div className="ey-line"/>
          </div>

          <h1 className="title">
            The page you seek<br />
            <em>does not exist.</em>
          </h1>

          <p className="body">
            Even the stars drift sometimes. This path leads nowhere —
            but every other path on SATTVA leads somewhere meaningful.
          </p>

          <span className="skt">मार्गं शोधय — Find the path</span>

          <div className="nav-links">
            <a className="nav-link primary" href="/">Return home</a>
            <a className="nav-link ghost" href="/how-it-works">How it works</a>
            <a className="nav-link ghost" href="/signup">Begin free</a>
          </div>
        </div>
      </div>
    </>
  );
}