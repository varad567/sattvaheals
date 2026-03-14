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

  .policy-wrap { padding:60px 72px 120px; }
  .policy-inner { max-width:800px; display:grid; grid-template-columns:200px 1fr; gap:64px; align-items:start; }

  .sidebar { position:sticky; top:88px; }
  .sidebar-title { font-size:9px; letter-spacing:3px; color:var(--moon-dim); text-transform:uppercase; font-weight:500; margin-bottom:16px; }
  .sidebar-links { display:flex; flex-direction:column; gap:2px; }
  .sidebar-link { font-size:12px; color:var(--pearl-dim); padding:8px 12px; border-left:1px solid rgba(168,204,224,0.06); text-decoration:none; transition:all 0.3s; letter-spacing:0.3px; cursor:pointer; background:none; border-top:none; border-right:none; border-bottom:none; text-align:left; font-family:'Outfit',sans-serif; }
  .sidebar-link:hover { color:var(--moon); border-left-color:var(--moon-dim); padding-left:16px; }

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

  .ps-highlight { padding:20px 24px; margin:20px 0; background:rgba(226,194,125,0.04); border:1px solid rgba(226,194,125,0.1); border-left:2px solid var(--gold-dim); font-size:14px; color:var(--pearl-dim); line-height:1.75; }
  .ps-highlight strong { color:var(--gold); font-weight:500; }

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
    id:'agreement', num:'01', title:'Agreement to Terms',
    content:[
      { type:'body', text:'These Terms and Conditions ("Terms") govern your use of SATTVA HEALS ("SATTVA", "we", "our", "us") and the platform at sattvaheals.in. By accessing or using SATTVA, you agree to be bound by these Terms.' },
      { type:'body', text:'If you do not agree with any part of these Terms, you must not use SATTVA. These Terms apply to all users — visitors, registered users, and anyone who accesses or uses the platform in any way.' },
      { type:'highlight', text:<><strong>Please read these Terms carefully.</strong> They include an important section on the nature of our content — SATTVA provides traditional wellness guidance, not medical or clinical services.</> },
    ]
  },
  {
    id:'nature', num:'02', title:'Nature of Our Services',
    content:[
      { type:'body', text:'SATTVA provides wellness content rooted in the Indian Knowledge System — specifically Ayurveda, Jyotisha, Yoga, and Mantra. All content on SATTVA is traditional, educational, and culturally rooted.' },
      { type:'highlight', text:<><strong>SATTVA is not a medical service.</strong> SATTVA is not a mental health establishment. SATTVA does not provide clinical diagnosis, clinical treatment, or any form of regulated healthcare. Nothing on SATTVA constitutes medical advice.</> },
      { type:'list', items:[
        'Prakriti assessments identify your Ayurvedic constitution — they are not clinical diagnoses',
        'Mantra, Ahara, and Dinacharya recommendations are traditional practices — not prescriptions',
        'Jyotisha chart readings are spiritual and philosophical in nature — not predictive certainties',
        'Consultation sessions are with practicing Jyotishis — not licensed medical or mental health professionals',
      ]},
      { type:'body', text:'If you are experiencing a mental health emergency, please contact iCall on 9152987821 or Vandrevala Foundation on 1860-2662-345. If you have a medical condition, consult a qualified doctor. SATTVA works alongside, not instead of, professional care.' },
    ]
  },
  {
    id:'accounts', num:'03', title:'Your Account',
    content:[
      { type:'body', text:'To access certain features of SATTVA, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.' },
      { type:'list', items:[
        'You must provide accurate and complete information when creating your account',
        'You must be at least 18 years of age to use SATTVA',
        'You are responsible for keeping your password secure',
        'You must notify us immediately if you become aware of any unauthorised use of your account',
        'You may not create accounts for others without their explicit consent',
      ]},
      { type:'body', text:'We reserve the right to suspend or terminate accounts that violate these Terms, engage in harmful behaviour, or misuse the platform in any way.' },
    ]
  },
  {
    id:'consultations', num:'04', title:'Consultations',
    content:[
      { type:'body', text:'Personal consultations with our Jyotishi are offered as a separate paid service. The following terms apply to all consultations booked through SATTVA.' },
      { type:'list', items:[
        'Consultations are with Varad Bidwai, a practicing Jyotishi with 2+ years of practice and 10,000+ consultations',
        'Payment is collected after the appointment is confirmed — you will not be charged before confirmation',
        'Cancellations must be made at least 24 hours before the scheduled session for a full refund',
        'Consultations are spiritual and astrological in nature — they are not therapy, counselling, or medical appointments',
        'Insights and recommendations given during consultations are guidance, not guarantees',
      ]},
      { type:'highlight', text:<><strong>Refund policy:</strong> If a confirmed session is cancelled by SATTVA for any reason, you will receive a full refund within 5–7 working days. For user-initiated cancellations made less than 24 hours before the session, a 50% cancellation fee applies.</> },
    ]
  },
  {
    id:'content', num:'05', title:'Content & Intellectual Property',
    content:[
      { type:'body', text:'All content on SATTVA — including text, assessments, protocols, mantra recommendations, visual design, and code — is the intellectual property of SATTVA HEALS unless otherwise stated.' },
      { type:'list', items:[
        'You may not copy, reproduce, or redistribute SATTVA content without written permission',
        'You may not use SATTVA content for commercial purposes without a formal licensing agreement',
        'Traditional mantras, Sanskrit texts, and IKS knowledge are in the public domain — our specific framing, curation, and protocols are not',
        'Screenshots and personal use of your own practice recommendations are permitted',
      ]},
      { type:'body', text:'Any content you submit to SATTVA — including consultation messages and feedback — grants us a non-exclusive licence to use that content to improve our services. We will never publish or attribute your personal content publicly without your explicit consent.' },
    ]
  },
  {
    id:'prohibited', num:'06', title:'Prohibited Use',
    content:[
      { type:'body', text:'You agree not to use SATTVA in any way that:' },
      { type:'list', items:[
        'Violates any applicable law or regulation',
        'Harms, threatens, or harasses other users or our team',
        'Attempts to gain unauthorised access to any part of the platform or its underlying systems',
        'Introduces malware, viruses, or any harmful code',
        'Scrapes, crawls, or systematically extracts data from the platform',
        'Misrepresents your identity or affiliation',
        'Uses SATTVA for any commercial purpose without our written consent',
        'Attempts to reverse-engineer any part of the platform',
      ]},
      { type:'body', text:'Violation of these Terms may result in immediate account termination and, where applicable, legal action.' },
    ]
  },
  {
    id:'disclaimers', num:'07', title:'Disclaimers & Liability',
    content:[
      { type:'body', text:'SATTVA is provided "as is" and "as available" without warranties of any kind, either express or implied.' },
      { type:'highlight', text:<><strong>To the maximum extent permitted by law:</strong> SATTVA is not liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our total liability to you for any claim shall not exceed the amount you paid us in the 3 months preceding the claim.</> },
      { type:'list', items:[
        'We do not warrant that SATTVA will be uninterrupted, error-free, or entirely secure',
        'We are not responsible for the accuracy of Jyotisha interpretations or outcomes of following any recommendation',
        'Traditional Ayurvedic and Jyotisha guidance is offered in good faith — individual results vary',
        'We are not liable for any decisions you make based on content or consultations provided through SATTVA',
      ]},
      { type:'body', text:'Nothing in these Terms limits our liability for death or personal injury caused by our negligence, or for fraud or fraudulent misrepresentation.' },
    ]
  },
  {
    id:'governing', num:'08', title:'Governing Law',
    content:[
      { type:'body', text:'These Terms are governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or your use of SATTVA shall be subject to the exclusive jurisdiction of the courts of Pune, Maharashtra.' },
      { type:'body', text:'If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.' },
      { type:'body', text:'Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.' },
    ]
  },
  {
    id:'contact', num:'09', title:'Updates & Contact',
    content:[
      { type:'body', text:'We may update these Terms from time to time. When we make material changes, we will notify you by email and update the "Last updated" date. Continued use of SATTVA after changes constitutes acceptance of the updated Terms.' },
      { type:'body', text:'For any questions about these Terms:' },
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
        <div className="cb-item">Email: <span>legal@sattvaheals.in</span></div>
        <div className="cb-item">Platform: <span>sattvaheals.in</span></div>
        <div className="cb-item">Response time: <span>Within 7 working days</span></div>
      </div>
    );
    default: return null;
  }
}

export default function Terms(){
  return(
    <>
      <style>{FONTS+css}</style>
      <StarField/>

      <nav>
        <a className="nav-brand" href="/">SATTVA <span>Heals</span></a>
        <button className="nav-back" onClick={()=>window.location.href='/'}>← Back to Home</button>
      </nav>

      <section className="hero">
        <div className="hero-inner">
          <div className="eyebrow"><div className="ey-line"/><span className="ey-text">Legal</span><div className="ey-line"/></div>
          <h1 className="hero-title">Terms &amp; <em>Conditions.</em></h1>
          <div className="hero-meta">Last updated: <span>March 2026</span> · Effective: <span>March 2026</span></div>
        </div>
      </section>

      <div className="policy-wrap">
        <div className="policy-inner">

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
            {' '}· <a href="/privacy" style={{color:'rgba(139,175,196,0.4)'}}>Privacy</a> · © 2026 SATTVA HEALS · sattvaheals.in
          </div>
        </div>
      </footer>
    </>
  );
}