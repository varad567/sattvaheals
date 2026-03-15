import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

  .bp-nav{position:fixed;top:0;left:0;right:0;z-index:100;height:64px;padding:0 48px;display:flex;align-items:center;justify-content:space-between;background:rgba(6,14,26,0.92);backdrop-filter:blur(20px);border-bottom:1px solid rgba(168,204,224,0.06);}
  .bp-nav-brand{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--pearl);letter-spacing:4px;text-transform:uppercase;cursor:pointer;}
  .bp-nav-brand span{color:var(--gold);}
  .bp-nav-back{background:none;border:none;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--pearl-dim);cursor:pointer;display:flex;align-items:center;gap:10px;transition:color 0.2s;font-family:'Outfit',sans-serif;}
  .bp-nav-back::before{content:'';width:20px;height:1px;background:currentColor;transition:width 0.2s;}
  .bp-nav-back:hover{color:var(--moon);}
  .bp-nav-back:hover::before{width:28px;}

  .bp-wrap{min-height:100vh;padding:96px 48px 80px;max-width:760px;margin:0 auto;position:relative;z-index:10;}

  .bp-fadein{opacity:0;transform:translateY(16px);animation:bpFade 0.55s cubic-bezier(0.4,0,0.2,1) forwards;}
  @keyframes bpFade{to{opacity:1;transform:translateY(0);}}

  .bp-header{margin-bottom:48px;padding-bottom:40px;border-bottom:1px solid rgba(168,204,224,0.07);}
  .bp-cat{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--gold-dim);margin-bottom:16px;display:flex;align-items:center;gap:12px;}
  .bp-cat::before{content:'';width:20px;height:1px;background:var(--gold-dim);}
  .bp-title{font-family:'Cormorant Garamond',serif;font-size:clamp(32px,5vw,52px);font-weight:400;color:var(--pearl);line-height:1.15;margin-bottom:18px;}
  .bp-excerpt{font-size:17px;color:var(--pearl-dim);line-height:1.8;margin-bottom:24px;font-style:italic;}
  .bp-meta{display:flex;align-items:center;gap:20px;font-size:12px;color:var(--pearl-dim);opacity:0.6;}
  .bp-meta-dot{width:3px;height:3px;border-radius:50%;background:var(--pearl-dim);opacity:0.4;}

  /* Article body — render stored HTML safely */
  .bp-body{font-size:16px;line-height:1.95;color:var(--pearl-dim);}
  .bp-body h2{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500;color:var(--pearl);margin:40px 0 16px;line-height:1.2;}
  .bp-body h3{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;color:var(--pearl);margin:32px 0 12px;}
  .bp-body p{margin-bottom:20px;color:var(--pearl-dim);}
  .bp-body strong{color:var(--pearl);font-weight:500;}
  .bp-body em{color:var(--moon);font-style:italic;}
  .bp-body blockquote{border-left:2px solid var(--gold-dim);padding:16px 24px;margin:28px 0;background:rgba(226,194,125,0.04);font-family:'Cormorant Garamond',serif;font-size:20px;font-style:italic;color:var(--pearl);line-height:1.7;}
  .bp-body ul,
  .bp-body ol{margin:16px 0 20px 20px;display:flex;flex-direction:column;gap:8px;}
  .bp-body li{color:var(--pearl-dim);line-height:1.7;}
  .bp-body hr{border:none;border-top:1px solid rgba(168,204,224,0.08);margin:36px 0;}
  .bp-body a{color:var(--moon);text-decoration:underline;text-underline-offset:3px;}

  /* CTA at bottom */
  .bp-cta{margin-top:56px;padding:32px 36px;background:linear-gradient(135deg,rgba(226,194,125,0.07),rgba(13,31,53,0.8));border:1px solid rgba(226,194,125,0.2);border-radius:16px;}
  .bp-cta-label{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:var(--gold-dim);margin-bottom:10px;}
  .bp-cta-heading{font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--pearl);margin-bottom:8px;}
  .bp-cta-body{font-size:13px;color:var(--pearl-dim);line-height:1.7;margin-bottom:18px;}
  .bp-cta-btn{padding:12px 32px;background:transparent;border:1px solid rgba(226,194,125,0.4);color:var(--gold);font-family:'Outfit',sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all 0.3s;}
  .bp-cta-btn:hover{border-color:var(--gold);background:rgba(226,194,125,0.08);}

  /* Related */
  .bp-related{margin-top:56px;padding-top:40px;border-top:1px solid rgba(168,204,224,0.07);}
  .bp-related-label{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--moon-dim);margin-bottom:24px;display:flex;align-items:center;gap:12px;}
  .bp-related-label::before{content:'';width:20px;height:1px;background:var(--gold-dim);}
  .bp-related-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
  .bp-related-card{background:rgba(13,31,53,0.5);border:1px solid rgba(168,204,224,0.07);border-radius:12px;padding:20px;cursor:pointer;transition:all 0.25s;}
  .bp-related-card:hover{border-color:rgba(168,204,224,0.18);transform:translateY(-2px);}
  .bp-related-cat{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--gold-dim);margin-bottom:8px;display:block;}
  .bp-related-title{font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--pearl);line-height:1.3;}

  .bp-404{min-height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;text-align:center;}
  .bp-404-head{font-family:'Cormorant Garamond',serif;font-size:40px;color:var(--pearl);}
  .bp-404-body{font-size:15px;color:var(--pearl-dim);}

  footer{background:rgba(0,0,0,0.4);border-top:1px solid rgba(168,204,224,0.06);padding:0 72px;height:64px;display:flex;align-items:center;margin-top:80px;}
  .foot-inner{max-width:1200px;margin:0 auto;width:100%;display:flex;justify-content:space-between;align-items:center;}
  .foot-brand{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:var(--pearl);letter-spacing:4px;text-transform:uppercase;}
  .foot-brand span{color:var(--gold);font-style:italic;}
  .foot-copy{font-size:11px;color:rgba(139,175,196,0.3);}

  @media(max-width:700px){.bp-nav,.bp-wrap{padding-left:20px;padding-right:20px;}footer{padding:0 20px;}.bp-related-grid{grid-template-columns:1fr;}}
`;

function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if(!canvas) return;
    let ctx; try{ctx=canvas.getContext('2d');}catch(e){return;}
    let W=canvas.width=window.innerWidth, H=canvas.height=window.innerHeight;
    const onResize=()=>{W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;};
    window.addEventListener('resize',onResize);
    const stars=Array.from({length:50},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1+0.2,dx:(Math.random()-0.5)*0.05,dy:-Math.random()*0.07-0.02,o:Math.random()*0.25+0.06,ts:Math.random()*0.01+0.003,to:Math.random()*Math.PI*2}));
    let frame=0,id;
    const draw=()=>{ctx.clearRect(0,0,W,H);frame++;stars.forEach(s=>{ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(168,204,224,${s.o*(Math.sin(frame*s.ts+s.to)*0.3+0.7)})`;ctx.fill();s.x+=s.dx;s.y+=s.dy;if(s.y<-5){s.y=H+5;s.x=Math.random()*W;}if(s.x<-5)s.x=W+5;if(s.x>W+5)s.x=-5;});id=requestAnimationFrame(draw);};
    draw();
    return()=>{cancelAnimationFrame(id);window.removeEventListener('resize',onResize);};
  },[]);
  return <canvas ref={ref} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:1,opacity:0.5}}/>;
}

function Cursor() {
  const dot=useRef(null),ring=useRef(null);
  useEffect(()=>{const mv=e=>{if(dot.current){dot.current.style.left=e.clientX+'px';dot.current.style.top=e.clientY+'px';}if(ring.current){ring.current.style.left=e.clientX+'px';ring.current.style.top=e.clientY+'px';}};window.addEventListener('mousemove',mv);return()=>window.removeEventListener('mousemove',mv);},[]);
  return <><div className="cursor" ref={dot}/><div className="cursor-ring" ref={ring}/></>;
}

function formatDate(str) {
  if(!str) return '';
  return new Date(str).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate  = useNavigate();
  const [post, setPost]       = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetch = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if(error || !data) { setNotFound(true); setLoading(false); return; }
      setPost(data);

      // Fetch related posts (same category, different slug)
      const { data: rel } = await supabase
        .from('blog_posts')
        .select('id, title, slug, category, excerpt')
        .eq('published', true)
        .eq('category', data.category)
        .neq('slug', slug)
        .limit(2);

      if(rel) setRelated(rel);
      setLoading(false);
    };
    fetch();
  }, [slug]);

  if(loading) return (
    <>
      <style>{FONTS+css}</style>
      <StarField/>
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}>
        <div style={{fontSize:36}}>🌙</div>
        <div style={{fontSize:12,letterSpacing:'3px',textTransform:'uppercase',color:'var(--pearl-dim)'}}>Loading</div>
      </div>
    </>
  );

  if(notFound) return (
    <>
      <style>{FONTS+css}</style>
      <StarField/>
      <div className="bp-404">
        <div className="bp-404-head">Post not found.</div>
        <div className="bp-404-body">This article doesn't exist or has been removed.</div>
        <button className="bp-cta-btn" style={{marginTop:20}} onClick={() => navigate('/blog')}>Back to Journal</button>
      </div>
    </>
  );

  return (
    <>
      <Helmet>
        <title>{post.title} | Sattva Heals</title>
        <meta name="description" content={post.excerpt || post.title} />
        <link rel="canonical" href={`https://sattvaheals.in/blog/${post.slug}`} />
        <meta property="og:title" content={`${post.title} | Sattva Heals`} />
        <meta property="og:description" content={post.excerpt || post.title} />
      </Helmet>
      <style>{FONTS+css}</style>
      <Cursor/>
      <StarField/>

      <nav className="bp-nav">
        <div className="bp-nav-brand" onClick={() => navigate('/')}>SATTVA <span>Heals</span></div>
        <button className="bp-nav-back" onClick={() => navigate('/blog')}>All posts</button>
      </nav>

      <div className="bp-wrap">

        <div className="bp-header bp-fadein">
          <div className="bp-cat">{post.category}</div>
          <div className="bp-title">{post.title}</div>
          {post.excerpt && <div className="bp-excerpt">{post.excerpt}</div>}
          <div className="bp-meta">
            <span>{formatDate(post.published_at)}</span>
            <span className="bp-meta-dot"/>
            <span>{post.read_time || '5 min'} read</span>
            {post.author && <>
              <span className="bp-meta-dot"/>
              <span>{post.author}</span>
            </>}
          </div>
        </div>

        {/* Article body — stored as HTML in Supabase */}
        <div
          className="bp-body bp-fadein"
          style={{animationDelay:'0.1s'}}
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />

        {/* CTA */}
        <div className="bp-cta bp-fadein" style={{animationDelay:'0.2s'}}>
          <div className="bp-cta-label">Your personal practice</div>
          <div className="bp-cta-heading">Find out what Sattva recommends for you.</div>
          <div className="bp-cta-body">
            Take the Prakriti assessment — 3 minutes to understand your constitution,
            your concern, and your personalised protocol.
          </div>
          <button className="bp-cta-btn" onClick={() => navigate('/onboarding')}>
            Begin assessment
          </button>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="bp-related bp-fadein" style={{animationDelay:'0.25s'}}>
            <div className="bp-related-label">More from the journal</div>
            <div className="bp-related-grid">
              {related.map(r => (
                <div key={r.id} className="bp-related-card" onClick={() => navigate(`/blog/${r.slug}`)}>
                  <span className="bp-related-cat">{r.category}</span>
                  <div className="bp-related-title">{r.title}</div>
                </div>
              ))}
            </div>
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