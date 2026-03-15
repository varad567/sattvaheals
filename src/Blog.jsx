import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import { Helmet } from 'react-helmet-async';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600;1,700&family=Outfit:wght@200;300;400;500;600&family=Noto+Serif+Devanagari:wght@300;400;500;600&display=swap');`;

const css = `
  :root {
    --abyss:#060E1A; --deep:#0D1F35; --surface:#112840;
    --moon:#A8CCE0; --moon-dim:#6B95AE;
    --gold:#E2C27D; --gold-dim:#B89A55;
    --pearl:#D8EEF8; --pearl-dim:#8BAFC4;
  }
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{background:var(--abyss);color:var(--pearl);font-family:'Outfit',sans-serif;font-weight:300;overflow-x:hidden;}
  body::after{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");pointer-events:none;z-index:998;opacity:0.4;}
  .cursor{width:8px;height:8px;background:var(--moon);border-radius:50%;position:fixed;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:left 0.06s,top 0.06s;}
  .cursor-ring{width:28px;height:28px;border:1px solid rgba(168,204,224,0.3);border-radius:50%;position:fixed;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:left 0.14s ease-out,top 0.14s ease-out;}

  .bl-nav{position:fixed;top:0;left:0;right:0;z-index:100;height:64px;padding:0 48px;display:flex;align-items:center;justify-content:space-between;background:rgba(6,14,26,0.92);backdrop-filter:blur(20px);border-bottom:1px solid rgba(168,204,224,0.06);}
  .bl-nav-brand{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--pearl);letter-spacing:4px;text-transform:uppercase;cursor:pointer;text-decoration:none;}
  .bl-nav-brand span{color:var(--gold);}
  .bl-nav-back{background:none;border:none;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--pearl-dim);cursor:pointer;display:flex;align-items:center;gap:10px;transition:color 0.2s;font-family:'Outfit',sans-serif;}
  .bl-nav-back::before{content:'';width:20px;height:1px;background:currentColor;transition:width 0.2s;}
  .bl-nav-back:hover{color:var(--moon);}
  .bl-nav-back:hover::before{width:28px;}

  .bl-wrap{min-height:100vh;padding:96px 48px 80px;max-width:1100px;margin:0 auto;position:relative;z-index:10;}

  .bl-fadein{opacity:0;transform:translateY(16px);animation:blFade 0.55s cubic-bezier(0.4,0,0.2,1) forwards;}
  @keyframes blFade{to{opacity:1;transform:translateY(0);}}
  .bl-d0{animation-delay:0s;} .bl-d1{animation-delay:0.08s;} .bl-d2{animation-delay:0.16s;}

  .bl-hero{margin-bottom:56px;}
  .bl-eyebrow{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--moon-dim);margin-bottom:16px;display:flex;align-items:center;gap:12px;}
  .bl-eyebrow::before{content:'';width:24px;height:1px;background:var(--gold-dim);}
  .bl-heading{font-family:'Cormorant Garamond',serif;font-size:clamp(38px,5vw,60px);font-weight:400;color:var(--pearl);line-height:1.1;margin-bottom:14px;}
  .bl-heading em{color:var(--gold);font-style:italic;}
  .bl-subhead{font-size:15px;color:var(--pearl-dim);line-height:1.8;max-width:500px;}

  .bl-cats{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:40px;}
  .bl-cat{padding:6px 16px;border:1px solid rgba(168,204,224,0.1);border-radius:999px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--pearl-dim);cursor:pointer;transition:all 0.2s;background:transparent;font-family:'Outfit',sans-serif;}
  .bl-cat:hover{border-color:rgba(168,204,224,0.3);color:var(--moon);}
  .bl-cat.active{border-color:var(--gold);color:var(--gold);background:rgba(226,194,125,0.06);}

  .bl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}

  .bl-card{
    background:rgba(13,31,53,0.65);
    border:1px solid rgba(168,204,224,0.08);
    border-radius:16px;padding:0;overflow:hidden;
    cursor:pointer;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);
    display:flex;flex-direction:column;
    backdrop-filter:blur(8px);
  }
  .bl-card:hover{border-color:rgba(168,204,224,0.2);transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,0.35);}

  .bl-card-top{padding:24px 24px 20px;}
  .bl-card-cat{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--gold-dim);margin-bottom:12px;display:block;}
  .bl-card-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;color:var(--pearl);line-height:1.3;margin-bottom:10px;}
  .bl-card-excerpt{font-size:13px;color:var(--pearl-dim);line-height:1.7;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}

  .bl-card-foot{
    margin-top:auto;padding:14px 24px;
    border-top:1px solid rgba(168,204,224,0.06);
    display:flex;align-items:center;justify-content:space-between;
  }
  .bl-card-date{font-size:11px;color:var(--pearl-dim);opacity:0.5;}
  .bl-card-read{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--moon-dim);transition:color 0.2s;}
  .bl-card:hover .bl-card-read{color:var(--moon);}

  .bl-empty{text-align:center;padding:80px 0;color:var(--pearl-dim);font-size:15px;}
  .bl-empty-icon{font-size:40px;display:block;margin-bottom:16px;opacity:0.4;}

  .bl-loading{display:flex;align-items:center;justify-content:center;padding:80px 0;gap:12px;color:var(--pearl-dim);font-size:12px;letter-spacing:3px;text-transform:uppercase;}

  footer{background:rgba(0,0,0,0.4);border-top:1px solid rgba(168,204,224,0.06);padding:0 72px;height:64px;display:flex;align-items:center;margin-top:80px;}
  .foot-inner{max-width:1200px;margin:0 auto;width:100%;display:flex;justify-content:space-between;align-items:center;}
  .foot-brand{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:var(--pearl);letter-spacing:4px;text-transform:uppercase;}
  .foot-brand span{color:var(--gold);font-style:italic;}
  .foot-copy{font-size:11px;color:rgba(139,175,196,0.3);}

  @media(max-width:900px){.bl-grid{grid-template-columns:repeat(2,1fr);}.bl-nav,.bl-wrap{padding-left:20px;padding-right:20px;}footer{padding:0 20px;}}
  @media(max-width:600px){.bl-grid{grid-template-columns:1fr;}}
`;

const CATEGORIES = ['All', 'Ayurveda & Doshas', 'Jyotish & Planets', 'Mental Wellness & IKS', 'Mantra & Practice'];

function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if(!canvas) return;
    let ctx; try{ctx=canvas.getContext('2d');}catch(e){return;}
    let W=canvas.width=window.innerWidth, H=canvas.height=window.innerHeight;
    const onResize=()=>{W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;};
    window.addEventListener('resize',onResize);
    const stars=Array.from({length:60},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1+0.2,dx:(Math.random()-0.5)*0.06,dy:-Math.random()*0.08-0.02,o:Math.random()*0.3+0.07,ts:Math.random()*0.01+0.003,to:Math.random()*Math.PI*2}));
    let frame=0,id;
    const draw=()=>{ctx.clearRect(0,0,W,H);frame++;stars.forEach(s=>{ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(168,204,224,${s.o*(Math.sin(frame*s.ts+s.to)*0.3+0.7)})`;ctx.fill();s.x+=s.dx;s.y+=s.dy;if(s.y<-5){s.y=H+5;s.x=Math.random()*W;}if(s.x<-5)s.x=W+5;if(s.x>W+5)s.x=-5;});id=requestAnimationFrame(draw);};
    draw();
    return()=>{cancelAnimationFrame(id);window.removeEventListener('resize',onResize);};
  },[]);
  return <canvas ref={ref} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1,opacity:0.5}}/>;
}

function Cursor() {
  const dot=useRef(null),ring=useRef(null);
  useEffect(()=>{const mv=e=>{if(dot.current){dot.current.style.left=e.clientX+'px';dot.current.style.top=e.clientY+'px';}if(ring.current){ring.current.style.left=e.clientX+'px';ring.current.style.top=e.clientY+'px';}};window.addEventListener('mousemove',mv);return()=>window.removeEventListener('mousemove',mv);}, []);
  return <><div className="cursor" ref={dot}/><div className="cursor-ring" ref={ring}/></>;
}

function formatDate(str) {
  if(!str) return '';
  return new Date(str).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
}

export default function Blog() {
  const navigate = useNavigate();
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, category, published_at, read_time')
        .eq('published', true)
        .order('published_at', { ascending: false });
      if(!error && data) setPosts(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = activeCat === 'All' ? posts : posts.filter(p => p.category === activeCat);

  return (
    <>
      <Helmet>
        <title>Blog — Ayurveda, Jyotish & IKS Wisdom | Sattva Heals</title>
        <meta name="description" content="Deep dives into Ayurveda, Jyotish, Mantra, and Indian Knowledge System wellness. Written by practicing Jyotishis for the modern mind." />
        <link rel="canonical" href="https://sattvaheals.in/blog" />
      </Helmet>
      <style>{FONTS+css}</style>
      <Cursor/>
      <StarField/>

      <nav className="bl-nav">
        <div className="bl-nav-brand" onClick={() => navigate('/')}>SATTVA <span>Heals</span></div>
        <button className="bl-nav-back" onClick={() => navigate('/')}>Home</button>
      </nav>

      <div className="bl-wrap">

        <div className="bl-hero bl-fadein bl-d0">
          <div className="bl-eyebrow">Knowledge</div>
          <div className="bl-heading">The <em>Sattva</em> Journal</div>
          <div className="bl-subhead">Deep dives into Ayurveda, Jyotish, Mantra, and the wisdom India has always carried.</div>
        </div>

        <div className="bl-cats bl-fadein bl-d1">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`bl-cat ${activeCat===cat?'active':''}`} onClick={() => setActiveCat(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bl-loading">Loading</div>
        ) : filtered.length === 0 ? (
          <div className="bl-empty">
            <span className="bl-empty-icon">🌙</span>
            {posts.length === 0 ? 'No posts yet. Come back soon.' : 'No posts in this category yet.'}
          </div>
        ) : (
          <div className="bl-grid bl-fadein bl-d2">
            {filtered.map(post => (
              <div key={post.id} className="bl-card" onClick={() => navigate(`/blog/${post.slug}`)}>
                <div className="bl-card-top">
                  <span className="bl-card-cat">{post.category}</span>
                  <div className="bl-card-title">{post.title}</div>
                  <div className="bl-card-excerpt">{post.excerpt}</div>
                </div>
                <div className="bl-card-foot">
                  <span className="bl-card-date">{formatDate(post.published_at)}</span>
                  <span className="bl-card-read">{post.read_time || '5 min'} read →</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <footer>
        <div className="foot-inner">
          <div className="foot-brand">SATTVA <span>Heals</span></div>
          <div className="foot-copy">© 2026 SATTVA HEALS · sattvaheals.in</div>
        </div>
      </footer>
    </>
  );
}