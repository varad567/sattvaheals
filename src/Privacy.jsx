import { useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600;1,700&family=Outfit:wght@200;300;400;500;600&display=swap');`;

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
  html { scroll-behavior:smooth; }
  body { background:var(--abyss); color:var(--pearl); font-family:'Outfit',sans-serif; font-weight:300; overflow-x:hidden; }
  body::after { content:''; position:fixed; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E"); pointer-events:none; z-index:998; opacity:0.4; }

  nav { position:fixed; top:0; left:0; right:0; z-index:100; padding:0 72px; height:64px; display:flex; align-items:center; justify-content:space-between; background:rgba(6,14,26,0.92); backdrop-filter:blur(24px); border-bottom:1px solid rgba(168,204,224,0.06); }
  .nav-brand { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600; color:var(--pearl); letter-spacing:5px; text-transform:uppercase; text-decoration:none; }
  .nav-brand span { color:var(--gold); font-style:italic; }
  .nav-back { background:transparent; border:1px solid rgba(168,204,224,0.15); color:var(--moon-dim); padding:8px 20px; font-family:'Outfit',sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all 0.3s; border-radius:1px; }
  .nav-back:hover { border-color:var(--moon); color:var(--moon); }

  /* HERO */
  .hero { padding:140px 72px 80px; position:relative; overflow:hidden; }
  .hero::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 50% 0%, rgba(168,204,224,0.04) 0%, transparent 55%); pointer-events:none; }
  .hero-inner { max-width:800px; }
  .eyebrow { display:inline-flex; align-items:center; gap:12px; margin-bottom:20px; }
  .ey-line { width:32px; height:1px; background:var(--gold-dim); }
  .ey-text { font-size:10px; letter-spacing:4px; color:var(--gold); text-transform:uppercase; font-weight:500; }
  .hero-title { font-family:'Cormorant Garamond',serif; font-size:clamp(40px,5vw,68px); font-weight:600; line-height:1.1; color:var(--pearl); margin-bottom:16px; animation:fadeUp 0.9s ease both; }
  .hero-title em { font-style:italic; color:var(--gold); }
  .hero-meta { font-size:12px; color:var(--pearl-dim); letter-spacing:1px; animation:fadeUp 0.9s 0.15s ease both; }
  .hero-meta span { color:var(--moon-dim); }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  /* LAYOUT */
  .policy-wrap { padding:60px 72px 120px; }
  .policy-inner { max-width:800px; display:grid; grid-template-columns:200px 1fr; gap:64px; align-items:start; }

  /* SIDEBAR NAV */
  .sidebar { position:sticky; top:88px; }
  .sidebar-title { font-size:9px; letter-spacing:3px; color:var(--moon-dim); text-transform:uppercase; font-weight:500; margin-bottom:16px; }
  .sidebar-links { display:flex; flex-direction:column; gap:2px; }
  .sidebar-link { font-size:12px; color:var(--pearl-dim); padding:8px 12px; border-left:1px solid rgba(168,204,224,0.06); text-decoration:none; transition:all 0.3s; letter-spacing:0.3px; cursor:pointer; background:none; border-top:none; border-right:none; border-bottom:none; text-align:left; font-family:'Outfit',sans-serif; }
  .sidebar-link:hover { color:var(--moon); border-left-color:var(--moon-dim); padding-left:16px; }
  .sidebar-link.active { color:var(--gold); border-left-color:var(--gold); }

  /* CONTENT */
  .policy-content { padding-bottom:40px; }

  .policy-section { margin-bottom:56px; padding-bottom:56px; border-bottom:1px solid rgba(168,204,224,0.05); }
  .policy-section:last-child { border-bottom:none; margin-bottom:0; }

  .ps-num { font-size:10px; letter-spacing:3px; color:var(--gold-dim); text-transform:uppercase; margin-bottom:10px; display:block; }
  .ps-title { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:600; color:var(--pearl); margin-bottom:20px; line-height:1.2; }
  .ps-body { font-size:14px; line-height:1.95; color:var(--pearl-dim); margin-bottom:16px; }
  .ps-body:last-child { margin-bottom:0; }
  .ps-body strong { color:var(--pearl); font-weight:500; }
  .ps-body em { font-style:italic; color:var(--moon); }
  .ps-body a { color:var(--moon); text-decoration:underline; text-underline-offset:3px; }

  .ps-list { list-style:none; margin:16px 0; display:flex; flex-direction:column; gap:8px; }
  .ps-list li { display:flex; gap:12px; font-size:14px; line-height:1.75; color:var(--pearl-dim); }
  .ps-list li::before { content:''; width:4px; height:4px; border-radius:50%; background:var(--gold-dim); flex-shrink:0; margin-top:8px; }

  .ps-highlight {
    padding:20px 24px; margin:20px 0;
    background:rgba(226,194,125,0.04);
    border:1px solid rgba(226,194,125,0.1);
    border-left:2px solid var(--gold-dim);
    font-size:14px; color:var(--pearl-dim); line-height:1.75;
  }
  .ps-highlight strong { color:var(--gold); font-weight:500; }

  /* Contact block */
  .contact-block { padding:24px 28px; background:rgba(13,31,53,0.5); border:1px solid rgba(168,204,224,0.07); margin-top:20px; }
  .cb-label { font-size:9px; letter-spacing:3px; color:var(--moon-dim); text-transform:uppercase; margin-bottom:12px; display:block; font-weight:500; }
  .cb-item { font-size:13px; color:var(--pearl-dim); margin-bottom:6px; }
  .cb-item span { color:var(--moon); }

  footer { background:rgba(0,0,0,0.4); border-top:1px solid rgba(168,204,224,0.06); padding:0 72px; height:64px; display:flex; align-items:center; }
  .foot-inner { max-width:1200px; margin:0 auto; width:100%; display:flex; justify-content:space-between; align-items:center; }
  .foot-brand { font-family:'Cormorant Garamond',serif; font-size:16px; font-weight:600; color:var(--pearl); letter-spacing:4px; text-transform:uppercase; }
  .foot-brand span { color:var(--gold); font-style:italic; }
  .foot-copy { font-size:11px; color:rgba(139,175,196,0.3); }

  @media(max-width:960px){
    nav,footer{padding:0 24px;}
    .hero,.policy-wrap{padding-left:24px;padding-right:24px;}
    .policy-inner{grid-template-columns:1fr;}
    .sidebar{display:none;}
  }
`;

const sections = [
  {
    id:'overview', num:'01', title:'Overview',
    content: [
      { type:'body', text:'This Privacy Policy describes how SATTVA HEALS ("SATTVA", "we", "our", or "us") collects, uses, and protects your personal information when you use our platform at sattvaheals.in.' },
      { type:'body', text:'We take your privacy seriously. Your birth data, your struggles, your journey on SATTVA — these are deeply personal. We treat them that way.' },
      { type:'highlight', text:<><strong>The short version:</strong> We collect only what we need to personalise your practice on SATTVA. We never sell your data. We never share it with advertisers. Your birth details are yours.</> },
      { type:'body', text:'By using SATTVA, you agree to the practices described in this policy. If you have any questions, contact us at privacy@sattvaheals.in.' },
    ]
  },
  {
    id:'collect', num:'02', title:'What We Collect',
    content: [
      { type:'body', text:'We collect information in two ways — what you give us directly, and what is generated through your use of the platform.' },
      { type:'body', text:<><strong>Information you provide:</strong></> },
      { type:'list', items:[
        'Name and email address when you create an account',
        'Date, time, and place of birth — used exclusively for Jyotisha chart calculation',
        'Mental health concerns and issues you select during onboarding',
        'Messages and details submitted through the consultation booking form',
        'Responses to daily check-ins and evening reflections within the platform',
      ]},
      { type:'body', text:<><strong>Information generated automatically:</strong></> },
      { type:'list', items:[
        'Basic usage data — pages visited, features used, session duration',
        'Device type and browser (for optimising your experience)',
        'IP address (for security purposes only)',
      ]},
    ]
  },
  {
    id:'use', num:'03', title:'How We Use It',
    content: [
      { type:'body', text:'Every piece of information we collect has a specific, limited purpose.' },
      { type:'list', items:[
        'Your birth data is used solely to calculate your Jyotisha birth chart and generate personalised practice recommendations',
        'Your email is used to send account-related communications and, with your consent, gentle reminders related to your practice',
        'Your issue selections personalise your dashboard, practice recommendations, and Moon calendar guidance',
        'Consultation form data is used to prepare for and conduct your personal session with our Jyotishi',
        'Usage data helps us understand how to improve the platform experience',
      ]},
      { type:'highlight', text:<><strong>We do not use your data for advertising.</strong> We do not build advertising profiles. We do not sell data to third parties. Ever.</> },
    ]
  },
  {
    id:'birth', num:'04', title:'Your Birth Data',
    content: [
      { type:'body', text:'Your birth date, time, and place are among the most sensitive pieces of information we hold. We treat them accordingly.' },
      { type:'list', items:[
        'Birth data is stored encrypted in our secure database',
        'It is used only for chart calculation and personalisation within SATTVA',
        'It is never shared with any third party for any reason',
        'It is never used for any purpose other than your journey on SATTVA',
        'You may request deletion of your birth data at any time',
      ]},
      { type:'highlight', text:<><strong>For personal consultations:</strong> Birth data shared during a 1-on-1 consultation with our Jyotishi is used only for that session. It is handled personally, not stored on the platform, and never shared.</> },
    ]
  },
  {
    id:'sharing', num:'05', title:'Sharing & Third Parties',
    content: [
      { type:'body', text:'We use a small number of trusted third-party services to operate SATTVA. Each is chosen carefully and bound by strict data agreements.' },
      { type:'list', items:[
        'Supabase — secure database and authentication (data stored in encrypted form)',
        'Vercel — platform hosting (no access to user data)',
        'Google — authentication only, if you sign in with Google (governed by Google\'s privacy policy)',
        'Razorpay — payment processing for consultations (we never see or store your card details)',
      ]},
      { type:'body', text:'We do not share your personal information with any other parties. We do not sell data. We do not use data brokers. We do not run targeted advertising.' },
    ]
  },
  {
    id:'rights', num:'06', title:'Your Rights',
    content: [
      { type:'body', text:'You have full rights over your personal data on SATTVA.' },
      { type:'list', items:[
        'Right to access — request a copy of all data we hold about you',
        'Right to correction — update or correct any inaccurate information',
        'Right to deletion — request complete deletion of your account and all associated data',
        'Right to portability — receive your data in a structured, readable format',
        'Right to withdraw consent — opt out of any data processing at any time',
      ]},
      { type:'body', text:'To exercise any of these rights, email us at privacy@sattvaheals.in. We will respond within 7 working days.' },
    ]
  },
  {
    id:'security', num:'07', title:'Security',
    content: [
      { type:'body', text:'We implement industry-standard security practices to protect your information.' },
      { type:'list', items:[
        'All data is encrypted in transit using TLS/SSL',
        'Sensitive data including birth details is encrypted at rest',
        'Access to user data is restricted to essential team members only',
        'We conduct regular security reviews of our platform and infrastructure',
      ]},
      { type:'body', text:'No system is completely secure. If you believe your account has been compromised, contact us immediately at security@sattvaheals.in.' },
    ]
  },
  {
    id:'updates', num:'08', title:'Updates & Contact',
    content: [
      { type:'body', text:'We may update this Privacy Policy from time to time. When we do, we will notify you by email and update the "Last updated" date at the top of this page. Continued use of SATTVA after changes constitutes acceptance of the updated policy.' },
      { type:'body', text:'For any privacy-related questions, concerns, or requests:' },
      { type:'contact' },
    ]
  },
];

function StarField(){
  const ref=useRef(null);
  useEffect(()=>{
    const canvas=ref.current;if(!canvas)return;
    let ctx;try{ctx=canvas.getContext('2d');}catch(e){return;}if(!ctx)return;
    let W=canvas.width=window.innerWidth,H=canvas.height=window.innerHeight;
    window.addEventListener('resize',()=>{W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;});
    const stars=Array.from({length:40},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*0.9+0.2,dx:(Math.random()-0.5)*0.06,dy:-Math.random()*0.08-0.02,o:Math.random()*0.3+0.08,ts:Math.random()*0.012+0.003,to:Math.random()*Math.PI*2}));
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
  return <canvas ref={ref} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0,opacity:0.4}}/>;
}

function renderContent(item, i){
  switch(item.type){
    case 'body': return <p className="ps-body" key={i}>{item.text}</p>;
    case 'highlight': return <div className="ps-highlight" key={i}>{item.text}</div>;
    case 'list': return(
      <ul className="ps-list" key={i}>
        {item.items.map((li,j)=><li key={j}>{li}</li>)}
      </ul>
    );
    case 'contact': return(
      <div className="contact-block" key={i}>
        <span className="cb-label">Contact us</span>
        <div className="cb-item">Email: <span>privacy@sattvaheals.in</span></div>
        <div className="cb-item">Platform: <span>sattvaheals.in</span></div>
        <div className="cb-item">Response time: <span>Within 7 working days</span></div>
      </div>
    );
    default: return null;
  }
}

export default function Privacy(){
  return(
    <>
      <style>{FONTS+css}</style>
      <StarField/>

      <nav>
        <a className="nav-brand" href="/">SATTVA <span>Heals</span></a>
        <button className="nav-back" onClick={()=>window.location.href='/'}>← Back to Home</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="eyebrow"><div className="ey-line"/><span className="ey-text">Legal</span><div className="ey-line"/></div>
          <h1 className="hero-title">Privacy <em>Policy.</em></h1>
          <div className="hero-meta">Last updated: <span>March 2026</span> · Effective: <span>March 2026</span></div>
        </div>
      </section>

      {/* POLICY */}
      <div className="policy-wrap">
        <div className="policy-inner">

          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-title">Contents</div>
            <div className="sidebar-links">
              {sections.map(s=>(
                <button key={s.id} className="sidebar-link"
                  onClick={()=>document.getElementById(s.id)?.scrollIntoView({behavior:'smooth',block:'start'})}>
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="policy-content">
            {sections.map(s=>(
              <div className="policy-section" id={s.id} key={s.id}>
                <span className="ps-num">{s.num}</span>
                <div className="ps-title">{s.title}</div>
                {s.content.map((item,i)=>renderContent(item,i))}
              </div>
            ))}
          </div>
        </div>
      </div>

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