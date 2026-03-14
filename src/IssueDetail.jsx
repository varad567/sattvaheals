import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  .id-nav{position:fixed;top:0;left:0;right:0;z-index:100;height:64px;padding:0 48px;display:flex;align-items:center;justify-content:space-between;background:rgba(6,14,26,0.92);backdrop-filter:blur(20px);border-bottom:1px solid rgba(168,204,224,0.06);}
  .id-nav-brand{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--pearl);letter-spacing:4px;text-transform:uppercase;cursor:pointer;}
  .id-nav-brand span{color:var(--gold);}
  .id-nav-back{background:none;border:none;font-family:'Outfit',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--pearl-dim);cursor:pointer;display:flex;align-items:center;gap:10px;transition:color 0.2s;}
  .id-nav-back::before{content:'';width:20px;height:1px;background:currentColor;transition:width 0.2s;}
  .id-nav-back:hover{color:var(--moon);}
  .id-nav-back:hover::before{width:28px;}

  /* Layout */
  .id-wrap{min-height:100vh;padding:100px 0 80px;max-width:1100px;margin:0 auto;position:relative;z-index:10;}

  /* Hero — full width band */
  .id-hero{
    padding:60px 48px 56px;
    border-bottom:1px solid rgba(168,204,224,0.07);
    margin-bottom:64px;
    position:relative; overflow:hidden;
  }
  .id-hero::before{
    content:'';position:absolute;top:-80px;right:-80px;
    width:400px;height:400px;border-radius:50%;
    background:radial-gradient(circle,rgba(226,194,125,0.04),transparent 70%);
    pointer-events:none;
  }
  .id-hero-eyebrow{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--moon-dim);margin-bottom:18px;display:flex;align-items:center;gap:12px;}
  .id-hero-eyebrow::before{content:'';width:24px;height:1px;background:var(--gold-dim);}
  .id-hero-icon{font-size:56px;margin-bottom:16px;display:block;line-height:1;filter:drop-shadow(0 0 20px rgba(226,194,125,0.2));}
  .id-hero-name{font-family:'Cormorant Garamond',serif;font-size:clamp(52px,8vw,96px);font-weight:300;color:var(--pearl);line-height:1;margin-bottom:8px;letter-spacing:0.02em;}
  .id-hero-sk{font-family:'Noto Serif Devanagari',serif;font-size:22px;color:var(--moon-dim);display:block;margin-bottom:20px;}
  .id-hero-tagline{font-size:18px;color:var(--pearl-dim);font-style:italic;line-height:1.6;max-width:580px;font-family:'Cormorant Garamond',serif;}
  .id-hero-meta{margin-top:24px;display:flex;gap:16px;flex-wrap:wrap;}
  .id-hero-badge{font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:6px 16px;border-radius:999px;border:1px solid rgba(168,204,224,0.15);color:var(--pearl-dim);}
  .id-hero-badge.gold{border-color:rgba(226,194,125,0.3);color:var(--gold-dim);}

  /* Content grid */
  .id-content{display:grid;grid-template-columns:1fr 320px;gap:32px;padding:0 48px;}
  .id-main{display:flex;flex-direction:column;gap:40px;}
  .id-sidebar{display:flex;flex-direction:column;gap:20px;}

  /* Section */
  .id-section{}
  .id-section-label{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:var(--moon-dim);margin-bottom:14px;display:flex;align-items:center;gap:12px;}
  .id-section-label::before{content:'';width:20px;height:1px;background:var(--gold-dim);}
  .id-section-heading{font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--pearl);margin-bottom:14px;line-height:1.2;}
  .id-section-heading em{color:var(--gold);font-style:italic;}
  .id-section-body{font-size:15px;color:var(--pearl-dim);line-height:1.95;}
  .id-section-body + .id-section-body{margin-top:12px;}

  /* Divider */
  .id-divider{height:1px;background:linear-gradient(90deg,transparent,rgba(168,204,224,0.2),transparent);margin:4px 0;}

  /* Dosha breakdown */
  .id-dosha-grid{display:flex;flex-direction:column;gap:12px;margin-top:4px;}
  .id-dosha-row{
    background:rgba(13,31,53,0.6);
    border:1px solid rgba(168,204,224,0.08);
    border-radius:12px;padding:18px 20px;
    backdrop-filter:blur(8px);
    transition:border-color 0.25s;
  }
  .id-dosha-row:hover{border-color:rgba(168,204,224,0.18);}
  .id-dosha-row-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
  .id-dosha-name{font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--gold);}
  .id-dosha-badge{font-size:9px;letter-spacing:2px;text-transform:uppercase;padding:3px 10px;border-radius:999px;border:1px solid rgba(226,194,125,0.2);color:var(--gold-dim);}
  .id-dosha-text{font-size:13px;color:var(--pearl-dim);line-height:1.7;}

  /* Jyotish */
  .id-planet-card{
    background:rgba(13,31,53,0.6);border:1px solid rgba(168,204,224,0.08);
    border-radius:14px;padding:22px 20px;
    backdrop-filter:blur(8px);
  }
  .id-planet-name{font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--moon);margin-bottom:6px;}
  .id-planet-sk{font-family:'Noto Serif Devanagari',serif;font-size:14px;color:var(--moon-dim);display:block;margin-bottom:10px;}
  .id-planet-text{font-size:13px;color:var(--pearl-dim);line-height:1.75;}

  /* Signs list */
  .id-signs{display:flex;flex-direction:column;gap:8px;margin-top:4px;}
  .id-sign-item{display:flex;align-items:flex-start;gap:10px;font-size:14px;color:var(--pearl-dim);line-height:1.6;}
  .id-sign-dot{width:4px;height:4px;border-radius:50%;background:var(--moon-dim);margin-top:8px;flex-shrink:0;}

  /* Practices sidebar */
  .id-sidebar-card{
    background:rgba(13,31,53,0.65);
    border:1px solid rgba(168,204,224,0.08);
    border-radius:16px;padding:22px 20px;
    backdrop-filter:blur(8px);
  }
  .id-sidebar-title{font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--pearl);margin-bottom:14px;}
  .id-practice-item{display:flex;gap:10px;align-items:flex-start;font-size:13px;color:var(--pearl-dim);line-height:1.6;margin-bottom:10px;}
  .id-practice-item:last-child{margin-bottom:0;}
  .id-practice-icon{font-size:15px;flex-shrink:0;margin-top:1px;}

  /* CTA */
  .id-cta{
    margin-top:0;
    background:linear-gradient(135deg,rgba(226,194,125,0.07),rgba(13,31,53,0.8));
    border:1px solid rgba(226,194,125,0.2);
    border-radius:16px;padding:28px 24px;
  }
  .id-cta-label{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--gold-dim);margin-bottom:10px;}
  .id-cta-heading{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--pearl);margin-bottom:8px;line-height:1.3;}
  .id-cta-body{font-size:13px;color:var(--pearl-dim);line-height:1.7;margin-bottom:18px;}
  .id-cta-btn{
    width:100%;padding:14px;
    background:linear-gradient(135deg,rgba(226,194,125,0.18),rgba(226,194,125,0.06));
    border:1px solid rgba(226,194,125,0.4);
    color:var(--gold);font-family:'Outfit',sans-serif;
    font-size:10px;font-weight:500;letter-spacing:3px;text-transform:uppercase;
    cursor:pointer;border-radius:2px;transition:all 0.3s;
  }
  .id-cta-btn:hover{border-color:var(--gold);background:rgba(226,194,125,0.14);box-shadow:0 0 24px rgba(226,194,125,0.1);}

  /* Related issues */
  .id-related{padding:0 48px;margin-top:64px;padding-top:48px;border-top:1px solid rgba(168,204,224,0.07);}
  .id-related-label{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--moon-dim);margin-bottom:24px;display:flex;align-items:center;gap:12px;}
  .id-related-label::before{content:'';width:20px;height:1px;background:var(--gold-dim);}
  .id-related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
  .id-related-card{
    background:rgba(13,31,53,0.5);border:1px solid rgba(168,204,224,0.07);
    border-radius:14px;padding:20px 18px;cursor:pointer;
    transition:all 0.25s;
  }
  .id-related-card:hover{border-color:rgba(168,204,224,0.2);transform:translateY(-2px);}
  .id-related-icon{font-size:22px;margin-bottom:10px;display:block;}
  .id-related-name{font-family:'Cormorant Garamond',serif;font-size:20px;color:var(--pearl);margin-bottom:4px;}
  .id-related-sk{font-family:'Noto Serif Devanagari',serif;font-size:12px;color:var(--moon-dim);}

  /* Fade in */
  .id-fadein{opacity:0;transform:translateY(18px);animation:idFade 0.55s cubic-bezier(0.4,0,0.2,1) forwards;}
  @keyframes idFade{to{opacity:1;transform:translateY(0);}}
  .id-d0{animation-delay:0.0s;} .id-d1{animation-delay:0.08s;} .id-d2{animation-delay:0.16s;}
  .id-d3{animation-delay:0.24s;} .id-d4{animation-delay:0.32s;} .id-d5{animation-delay:0.4s;}

  /* 404 */
  .id-404{min-height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;text-align:center;}
  .id-404-head{font-family:'Cormorant Garamond',serif;font-size:48px;color:var(--pearl);}
  .id-404-body{font-size:15px;color:var(--pearl-dim);}

  @media(max-width:960px){
    .id-content{grid-template-columns:1fr;}
    .id-sidebar{order:-1;}
    .id-related-grid{grid-template-columns:repeat(2,1fr);}
  }
  @media(max-width:600px){
    .id-hero{padding:48px 20px 40px;}
    .id-content{padding:0 20px;}
    .id-related{padding:0 20px;margin-top:48px;}
    .id-nav{padding:0 20px;}
    .id-related-grid{grid-template-columns:1fr;}
  }
`;

/* ─────────────────────────────────────────
   ISSUE DATA — full deep dive content
───────────────────────────────────────── */
const ISSUE_DATA = {
  anxiety: {
    slug:'anxiety', name:'Anxiety', sk:'चिन्ता', icon:'🌊',
    tagline:'A restlessness I cannot explain — the mind seeking safety it cannot find.',
    doshas:['Vata','Pitta'],
    primaryDosha:'Vata',
    planetBadge:'Moon affliction',
    heroMeta:['Most common concern','Vata-dominant','Responds to grounding'],

    ayurveda:{
      heading:'What Ayurveda sees',
      para1:'In Ayurveda, anxiety is fundamentally a Vata disorder. Vata — the force of movement, air, and space — governs all nervous system activity. When Vata becomes aggravated, the nervous system loses its anchor. The mind begins to move faster than it can process. Thoughts multiply. The body tightens.',
      para2:'This is Chinta — the Sanskrit term for anxiety. Literally, it means "that which consumes thought." The Vata mind, when disturbed, cannot stop generating new fears because Vata\'s nature is movement — and without grounding, that movement becomes uncontrolled.',
      para3:'In secondary Pitta anxiety, the pattern is different. The mind does not spiral — it fixates. It finds a threat and analyses it with intensity. The Pitta nervous system is searching for a solution to a problem it cannot solve. This creates heat, irritability, and a hypervigilant quality.',
    },

    doshaBreakdown:[
      { dosha:'Vata Anxiety', badge:'Most common', text:'Racing thoughts, worst-case scenarios, physical tightness in the chest and throat. The body feels cold and ungrounded. Sleep is disrupted. The mind jumps from fear to fear without resolution.' },
      { dosha:'Pitta Anxiety', badge:'Secondary type', text:'Sharp, focused dread about specific outcomes. Often attached to performance, reputation, or control. Feels hot rather than cold — heat in the face, jaw tension, irritability alongside the fear.' },
      { dosha:'Kapha Anxiety', badge:'Least common', text:'Slow-burning, heavy dread. The mind clings to security it feels it is losing. This type develops quietly over time and is often mistaken for sadness. The fear is of change, abandonment, or loss of stability.' },
    ],

    jyotish:{
      planet:'Moon',
      sk:'चन्द्र',
      text:'In Jyotish, the Moon governs Manas — the mind itself. A weakened, afflicted, or poorly placed Moon directly creates the conditions for anxiety. Rahu conjunct or aspecting the Moon amplifies fear and creates an obsessive quality to anxious thinking. The 4th house governs inner peace; afflictions here disturb the foundation of emotional safety.',
      indicators:['Moon in Scorpio or debilitated in Virgo (Neecha)','Rahu conjunct or aspecting Moon','4th house lord weakened or under malefic influence','Moon in 6th, 8th, or 12th house without benefic support'],
    },

    practices:{
      heading:'What helps',
      items:[
        { icon:'🕉', text:'Chandra Beej Mantra — 108 repetitions before sleep to calm the Vata nervous system' },
        { icon:'🌿', text:'Warm, oily, grounding foods — ghee, sesame, warm milk, root vegetables' },
        { icon:'🌙', text:'Sleep before 10pm — the Vata aggravation peak is 10pm–2am' },
        { icon:'🦶', text:'Sesame oil on feet before bed — one of the most effective grounding practices for Vata' },
        { icon:'📵', text:'No screens after 9pm — digital stimulation directly aggravates Vata' },
      ],
    },
  },

  aggression: {
    slug:'aggression', name:'Aggression', sk:'क्रोध', icon:'🔥',
    tagline:'A sharpness that comes too fast — the fire that burns before it warms.',
    doshas:['Pitta','Vata'],
    primaryDosha:'Pitta',
    planetBadge:'Mars affliction',
    heroMeta:['Pitta-dominant','Fire and transformation','Responds to cooling'],

    ayurveda:{
      heading:'What Ayurveda sees',
      para1:'Aggression in Ayurveda is the excess of Pitta — the fire of transformation turned inward and outward simultaneously. Pitta\'s qualities are heat, sharpness, and intensity. When in balance, Pitta creates focus, courage, and decisive leadership. When aggravated, these same qualities become Krodha — the fire that burns what it touches.',
      para2:'Krodha arises when the Pitta mind encounters an obstacle it cannot immediately resolve. The gap between how things are and how Pitta believes they should be creates internal combustion. The larger the gap, the more intense the Krodha.',
      para3:'The Pitta body stores heat in the liver, the blood, and the eyes. Chronic aggression is not just emotional — it manifests physically as skin eruptions, acid reflux, headaches, and inflammation. The body is literally too hot.',
    },

    doshaBreakdown:[
      { dosha:'Pitta Aggression', badge:'Primary type', text:'Sharp, purposeful, and intense. Comes quickly when standards are not met. The Pitta person knows exactly why they are angry and will articulate it with precision. The danger is that the sharpness causes damage before the anger passes.' },
      { dosha:'Vata Aggression', badge:'Secondary type', text:'Reactive and inconsistent. Arises from overwhelm rather than frustration. The Vata person lashes out when they are overstimulated or under-resourced, and often regrets it quickly afterwards.' },
      { dosha:'Kapha Aggression', badge:'Suppressed type', text:'The rarest and most intense. Kapha suppresses for a long time — and when the threshold is crossed, the release is disproportionate. Others often do not see it coming.' },
    ],

    jyotish:{
      planet:'Mars',
      sk:'मंगल',
      text:'In Jyotish, Mars governs energy, drive, and the capacity for action. An afflicted Mars — particularly conjunct Rahu or aspected by Saturn — creates the conditions for uncontrolled Krodha. The Sun\'s placement also matters: a weakened Sun creates ego-driven anger, the fire of self-protection.',
      indicators:['Mars conjunct Rahu (intense, explosive anger pattern)','Mars in Aries or Scorpio afflicted by malefics','Sun debilitated or under Saturn aspect','8th house Mars without benefic support'],
    },

    practices:{
      heading:'What helps',
      items:[
        { icon:'🕉', text:'Vishnu Sahasranama — daily recitation pacifies Pitta fire through the quality of sustaining grace' },
        { icon:'🥥', text:'Cooling foods — coconut water, coriander, fennel, bitter greens. Avoid alcohol and red meat entirely' },
        { icon:'🚿', text:'Cool shower every morning — a direct Pitta pacifying practice' },
        { icon:'🌙', text:'No competitive activity after 6pm — Pitta peaks in the afternoon and evening' },
        { icon:'😴', text:'Midday rest 10–15 minutes — prevents the afternoon Pitta buildup from becoming aggression' },
      ],
    },
  },

  overthinking: {
    slug:'overthinking', name:'Overthinking', sk:'चित्त वृत्ति', icon:'🌀',
    tagline:'A mind that will not be quiet — loops that go nowhere but keep running.',
    doshas:['Vata','Pitta'],
    primaryDosha:'Vata',
    planetBadge:'Mercury + Rahu',
    heroMeta:['Most exhausting pattern','Vata-Pitta dominant','Responds to anchoring'],

    ayurveda:{
      heading:'What Ayurveda sees',
      para1:'Chitta Vritti — literally "the fluctuations of the mind-field" — is the Yogic and Ayurvedic term for the incessant movement of thought. The Yoga Sutras of Patanjali open with the statement that the goal of Yoga is to still the Chitta Vritti. This is not incidental — it is the central problem of the human mind.',
      para2:'In Ayurvedic terms, overthinking is a Vata disorder at its root. Vata\'s element is air and space — qualities of movement and boundlessness. When Vata is aggravated, the mind generates thought continuously, finds patterns in random events, loops through the same scenarios, and cannot settle.',
      para3:'When Pitta is involved, the overthinking has a specific quality of analysis — the mind is not just generating thoughts, it is trying to solve an unsolvable problem. The Pitta-Vata overthinker is exhausted not by quantity of thought but by its relentless purposefulness.',
    },

    doshaBreakdown:[
      { dosha:'Vata Overthinking', badge:'Primary type', text:'Rapid, scattered, jumping between unrelated thoughts. The mind moves from one worry to another without resolution. Often worse at night. Associated with inability to focus and difficulty completing tasks.' },
      { dosha:'Pitta Overthinking', badge:'Secondary type', text:'Focused, analytical, and relentless. The mind fixates on a problem and will not release it until it is solved — even when it cannot be solved. Creates mental exhaustion and perfectionism.' },
      { dosha:'Kapha Overthinking', badge:'Rumination type', text:'Slow, circular, returning. The same thought, the same memory, the same fear — revisited repeatedly. Kapha\'s heaviness makes thoughts sticky. Hard to let go, even when the person knows it is unhelpful.' },
    ],

    jyotish:{
      planet:'Mercury',
      sk:'बुध',
      text:'Mercury governs the rational mind, nervous system, and the faculty of discrimination. When Mercury is afflicted — particularly by Rahu or placed in certain houses without support — the mind loses the ability to stop. Rahu amplifies Mercury\'s already quick-moving quality into compulsion.',
      indicators:['Mercury conjunct Rahu in any house','Mercury in 3rd or 6th house under malefic influence','Gemini or Virgo rising with afflicted Mercury','Moon-Mercury combination agitated by Mars or Rahu'],
    },

    practices:{
      heading:'What helps',
      items:[
        { icon:'🕉', text:'Chandra Beej Mantra — 108 repetitions in the morning before any screen or conversation' },
        { icon:'🍚', text:'Warm cooked meals only — no cold drinks or raw food, which aggravate Vata directly' },
        { icon:'🫀', text:'Sesame oil on the scalp before your morning shower — grounds Vata through the nervous system' },
        { icon:'🍽', text:'Eat in complete silence — no phone, no screen, no conversation. This is a practice, not a preference' },
        { icon:'🌑', text:'Silence after 9pm — give the mind a defined window with no new inputs' },
      ],
    },
  },

  stress: {
    slug:'stress', name:'Stress', sk:'मनस्ताप', icon:'⚡',
    tagline:'Too much. Too fast. Running out of myself.',
    doshas:['Vata','Pitta'],
    primaryDosha:'Vata',
    planetBadge:'Sun + Moon weakened',
    heroMeta:['Combined Vata-Pitta','Resource depletion','Responds to restoration'],

    ayurveda:{
      heading:'What Ayurveda sees',
      para1:'Manastapa is the Ayurvedic term for the state of mind under sustained pressure. It translates literally as "that which burns the mind." Unlike anxiety, which is the fear of what might happen, or low mood, which is the absence of energy, stress is an active state of resource depletion.',
      para2:'In Ayurvedic physiology, chronic stress first aggravates Vata — the nervous system begins to fragment under load. As Vata becomes dysregulated, it aggravates Pitta — the fire begins to burn out of control. Finally, when both Vata and Pitta are exhausted, Kapha collapses inward — the body shuts down to protect itself.',
      para3:'Modern stress is also a Prana problem. Prana — the life force — is finite in each day. When we spend it faster than we restore it, the deficit accumulates. Ayurveda\'s approach to stress is not management but restoration: returning Prana to its source.',
    },

    doshaBreakdown:[
      { dosha:'Vata Stress', badge:'Fragmentation', text:'Scattered, unable to prioritise, physically cold and tight. The Vata stress response is the fraying of the nervous system. Too many inputs, too many tasks, too little capacity. Feels like falling apart.' },
      { dosha:'Pitta Stress', badge:'Combustion', text:'Driven, relentless, unable to stop. The Pitta stress response is the refusal to acknowledge limits. Pushes harder when exhausted, takes on more when already overwhelmed. The body\'s warning signals are suppressed by willpower — until they cannot be.' },
      { dosha:'Kapha Stress', badge:'Inertia', text:'Slow-moving, heavy, numbed out. The Kapha stress response is internal shutdown. The person keeps functioning externally but has disconnected inside. Feels like moving through water.' },
    ],

    jyotish:{
      planet:'Sun',
      sk:'सूर्य',
      text:'In Jyotish, the Sun governs Atma — the soul\'s vitality and sense of purpose. A weakened Sun creates the loss of direction that underlies chronic stress. When the Moon is also afflicted, both the mind (Moon) and the vital force (Sun) are depleted simultaneously. This is the Jyotish signature of burnout.',
      indicators:['Sun debilitated in Libra or under Saturn aspect','Moon afflicted in 6th, 8th, or 12th house','Sun-Saturn conjunction or opposition','Lagna lord weakened — the person\'s core vitality is under pressure'],
    },

    practices:{
      heading:'What helps',
      items:[
        { icon:'🕉', text:'Mahamrityunjaya Mantra — 108 repetitions each morning. The mantra of liberation from depletion' },
        { icon:'⏰', text:'Fixed meal times, fixed wake time — Vata stress is directly worsened by irregularity' },
        { icon:'🥛', text:'Ashwagandha milk (consult BAMS before use) — the primary Ayurvedic adaptogen for stress restoration' },
        { icon:'⏸', text:'Two 5-minute stillness breaks in the working day — scheduled, non-negotiable' },
        { icon:'📵', text:'No work calls after 7pm — the boundary that stops the day from consuming the night' },
      ],
    },
  },

  lowmood: {
    slug:'lowmood', name:'Low Mood', sk:'विषाद', icon:'🌑',
    tagline:'Heavy, empty, no motivation — the light that has gone quiet inside.',
    doshas:['Kapha','Vata'],
    primaryDosha:'Kapha',
    planetBadge:'Saturn + Moon',
    heroMeta:['Kapha-dominant','Tamas predominant','Responds to activation'],

    ayurveda:{
      heading:'What Ayurveda sees',
      para1:'Vishada is the Ayurvedic term for low mood — a state of heaviness, absence of motivation, and disconnection from meaning. It is not the same as clinical depression, though it sits on the same continuum. In Ayurvedic understanding, Vishada is primarily a Kapha disorder involving the quality of Tamas — inertia, darkness, heaviness.',
      para2:'When Kapha is severely aggravated, Tamas predominates in the mind. Tamas is one of the three Gunas — the qualities of nature. It is the quality of inertia, darkness, and resistance to change. In the Tamas state, the mind becomes like a clouded sky — unable to access the light that is still there.',
      para3:'In secondary Vata low mood, the pattern is depletion rather than heaviness. The Vata person whose lightness and creativity have been exhausted experiences a hollowness — the scaffolding of their usual aliveness has collapsed. This requires restoration, not activation.',
    },

    doshaBreakdown:[
      { dosha:'Kapha Low Mood', badge:'Primary type', text:'Heavy, slow, unmotivated. The person sleeps too much, eats for comfort, withdraws from social contact, and struggles to initiate any action. The world feels grey and far away. This is Tamas made experiential.' },
      { dosha:'Vata Low Mood', badge:'Depletion type', text:'Hollow rather than heavy. The Vata person who has been running on empty finally runs out. Creative, sensitive people are particularly vulnerable to this type — their highs are high and their lows can be very low.' },
      { dosha:'Pitta Low Mood', badge:'Loss of purpose', text:'The Pitta person whose sense of purpose or identity has been threatened experiences low mood as failure. It is associated with shame, self-criticism, and the loss of the fire that usually drives them.' },
    ],

    jyotish:{
      planet:'Saturn',
      sk:'शनि',
      text:'In Jyotish, Saturn governs limitation, time, and the weight of karma. A heavily placed Saturn — particularly influencing the Moon, the Lagna, or the 4th house — creates the conditions for Vishada. Saturn\'s lesson is acceptance of limitation; when that lesson is resisted, it becomes depression. The Moon\'s placement in Scorpio (Vishakha nakshatra) is classically associated with low mood.',
      indicators:['Saturn aspecting or conjunct Moon','Moon in Scorpio or 8th house','Saturn in Lagna or 4th house','Sun debilitated — loss of vitality and sense of self'],
    },

    practices:{
      heading:'What helps',
      items:[
        { icon:'☀️', text:'Surya Beej Mantra at sunrise — 108 repetitions facing the sun. The single most important practice for Kapha low mood' },
        { icon:'🌅', text:'Wake before 6am without exception — sleeping past sunrise directly deepens Kapha Vishada' },
        { icon:'🏃', text:'Physical movement every morning before anything else — the body must be activated before the mind will follow' },
        { icon:'👥', text:'Social contact minimum 3 times per week — isolation is the primary worsening factor for Kapha low mood' },
        { icon:'🍵', text:'Ginger tea on waking, honey water before breakfast — warming the body activates the mind' },
      ],
    },
  },

  fear: {
    slug:'fear', name:'Fear', sk:'भय', icon:'🌫',
    tagline:'A worry that lives deeper than thought — safety the mind cannot hold.',
    doshas:['Vata','Kapha'],
    primaryDosha:'Vata',
    planetBadge:'Rahu + Moon',
    heroMeta:['Vata-dominant','Deepest root pattern','Responds to protection practices'],

    ayurveda:{
      heading:'What Ayurveda sees',
      para1:'Bhaya is fear in its deep, persistent form — not the healthy fear response that protects us from immediate danger, but the background hum of threat that colours everything. In Ayurveda, Bhaya is Vata\'s most primal imbalance. Vata\'s element is air and space — qualities of movement, exposure, and groundlessness.',
      para2:'When Vata is severely aggravated, the nervous system loses its sense of safety. The body is in a state of permanent low-grade alert. This is not always consciously experienced as fear — it often manifests as hypervigilance, difficulty relaxing, startle response, and a constant background tension that the person has simply learned to live with.',
      para3:'Deep fear is also a Prana Vaha Srotas issue — the channels of life force are disturbed. Ayurveda treats this through practices that restore Prana to its natural flow: grounding, warming, rhythmic, and deeply stabilising.',
    },

    doshaBreakdown:[
      { dosha:'Vata Fear', badge:'Primary type', text:'The fear of the unknown, the uncontrollable, the boundless. Physical manifestations include cold extremities, tight chest, shallow breath, and the inability to relax even in safety. Often accompanied by anxiety and overthinking.' },
      { dosha:'Kapha Fear', badge:'Secondary type', text:'The fear of change, loss, and abandonment. Kapha fear is quieter and more enduring than Vata fear. The person clings to what is familiar. Change, even positive change, feels threatening. Often misidentified as stability or loyalty.' },
      { dosha:'Pitta Fear', badge:'Control type', text:'The fear of losing control, failing, or being exposed as inadequate. This presents more as anxiety than fear — but the root is the same: threat to the Pitta sense of mastery and invulnerability.' },
    ],

    jyotish:{
      planet:'Rahu',
      sk:'राहु',
      text:'In Jyotish, Rahu is the north node of the Moon — a shadow planet that creates obsessive patterns, illusions, and deep-seated fear when afflicting the Moon or Lagna. Rahu in the 1st, 4th, or 12th house, or conjunct the Moon, is the classic signature of deep background fear. It creates a sense of existential threat that is difficult to rationalise.',
      indicators:['Rahu conjunct or aspecting Moon','Rahu in the 1st house (Lagna)','Moon in 12th house — fear of dissolution and loss','Saturn aspecting Moon from 3rd house — fear shaped by past experience'],
    },

    practices:{
      heading:'What helps',
      items:[
        { icon:'🕉', text:'Narsimha Kavach — the armour mantra. Daily recitation, especially during Rahu Kala hours' },
        { icon:'🦶', text:'Bare feet on earth for 5 minutes each morning — the most direct grounding practice for Vata fear' },
        { icon:'⏰', text:'Fixed bedtime, fixed wake time — Vata fear worsens with irregularity. Predictability is medicine' },
        { icon:'🍲', text:'Rock salt in warm water, warm soups, sesame — grounding and warming foods stabilise Vata' },
        { icon:'📓', text:'Evening journalling — externalising fears before sleep prevents them from running on loop through the night' },
      ],
    },
  },
};

const ALL_ISSUES = Object.values(ISSUE_DATA);

function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas=ref.current; if(!canvas)return;
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

export default function IssueDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const issue = ISSUE_DATA[slug];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    window.scrollTo(0, 0);
  }, [slug]);

  if(!issue) {
    return (
      <>
        <style>{FONTS+css}</style>
        <StarField/>
        <div className="id-404">
          <div className="id-404-head">Issue not found.</div>
          <div className="id-404-body">That concern doesn't exist in the library.</div>
          <button className="id-cta-btn" style={{marginTop:20,padding:'12px 32px',width:'auto'}} onClick={() => navigate('/issues')}>
            Back to Issues
          </button>
        </div>
      </>
    );
  }

  const related = ALL_ISSUES.filter(i => i.slug !== slug).slice(0, 3);

  return (
    <>
      <style>{FONTS+css}</style>
      <Cursor/>
      <StarField/>

      {/* Nav */}
      <nav className="id-nav">
        <div className="id-nav-brand" onClick={() => navigate('/')}>SATTVA <span>Heals</span></div>
        <button className="id-nav-back" onClick={() => navigate('/issues')}>
          All issues
        </button>
      </nav>

      <div className="id-wrap">

        {/* Hero */}
        <div className="id-hero id-fadein id-d0">
          <div className="id-hero-eyebrow">{issue.planetBadge}</div>
          <span className="id-hero-icon">{issue.icon}</span>
          <div className="id-hero-name">{issue.name}</div>
          <span className="id-hero-sk">{issue.sk}</span>
          <div className="id-hero-tagline">{issue.tagline}</div>
          <div className="id-hero-meta">
            {issue.heroMeta.map((m,i) => (
              <span key={i} className={`id-hero-badge ${i===0?'gold':''}`}>{m}</span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="id-content">

          {/* Main */}
          <div className="id-main">

            {/* Ayurveda section */}
            <div className="id-section id-fadein id-d1">
              <div className="id-section-label">Ayurvedic understanding</div>
              <div className="id-section-heading">{issue.ayurveda.heading}</div>
              <div className="id-section-body">{issue.ayurveda.para1}</div>
              <div className="id-section-body">{issue.ayurveda.para2}</div>
              <div className="id-section-body">{issue.ayurveda.para3}</div>
            </div>

            {/* Dosha breakdown */}
            <div className="id-section id-fadein id-d2">
              <div className="id-section-label">How it appears by Dosha</div>
              <div className="id-section-heading">
                Three expressions of <em>{issue.name.toLowerCase()}</em>
              </div>
              <div className="id-dosha-grid">
                {issue.doshaBreakdown.map((d,i) => (
                  <div key={i} className="id-dosha-row">
                    <div className="id-dosha-row-head">
                      <span className="id-dosha-name">{d.dosha}</span>
                      <span className="id-dosha-badge">{d.badge}</span>
                    </div>
                    <div className="id-dosha-text">{d.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Jyotish */}
            <div className="id-section id-fadein id-d3">
              <div className="id-section-label">Jyotish — the planetary lens</div>
              <div className="id-section-heading">
                <em>{issue.jyotish.planet}</em> and the roots of {issue.name.toLowerCase()}
              </div>
              <div className="id-planet-card">
                <div className="id-planet-name">{issue.jyotish.planet}</div>
                <span className="id-planet-sk">{issue.jyotish.sk}</span>
                <div className="id-planet-text">{issue.jyotish.text}</div>
              </div>
              <div style={{marginTop:16}}>
                <div className="id-section-label" style={{marginBottom:10}}>Chart indicators</div>
                <div className="id-signs">
                  {issue.jyotish.indicators.map((ind,i) => (
                    <div key={i} className="id-sign-item">
                      <span className="id-sign-dot"/>
                      {ind}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>{/* end main */}

          {/* Sidebar */}
          <div className="id-sidebar">

            {/* Practices */}
            <div className="id-fadein id-d1">
              <div className="id-sidebar-card">
                <div className="id-sidebar-title">{issue.practices.heading}</div>
                {issue.practices.items.map((p,i) => (
                  <div key={i} className="id-practice-item">
                    <span className="id-practice-icon">{p.icon}</span>
                    {p.text}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="id-cta id-fadein id-d2">
              <div className="id-cta-label">Your personal protocol</div>
              <div className="id-cta-heading">
                Find out if this is what you are carrying.
              </div>
              <div className="id-cta-body">
                The Sattva assessment identifies your Prakriti and your concern,
                then gives you a specific mantra, diet, and daily routine — built for you.
              </div>
              <button className="id-cta-btn" onClick={() => navigate('/onboarding')}>
                Take the assessment
              </button>
            </div>

            {/* Dosha badges */}
            <div className="id-sidebar-card id-fadein id-d3">
              <div className="id-sidebar-title">Doshas involved</div>
              {issue.doshas.map((d,i) => (
                <div key={i} className="id-practice-item">
                  <span className="id-practice-icon">{i===0?'◆':'◇'}</span>
                  <div>
                    <div style={{fontSize:14,color:'var(--pearl)',marginBottom:2}}>{d}</div>
                    <div style={{fontSize:11,color:'var(--pearl-dim)',letterSpacing:'1px'}}>
                      {i===0?'Primary':'Secondary'} Dosha
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Related issues */}
        <div className="id-related id-fadein id-d4">
          <div className="id-related-label">Other concerns</div>
          <div className="id-related-grid">
            {related.map(r => (
              <div key={r.slug} className="id-related-card" onClick={() => navigate(`/issues/${r.slug}`)}>
                <span className="id-related-icon">{r.icon}</span>
                <div className="id-related-name">{r.name}</div>
                <div className="id-related-sk">{r.sk}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}