import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
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
  body{background:var(--abyss);color:var(--pearl);font-family:'Outfit',sans-serif;font-weight:300;overflow-x:hidden;min-height:100vh;}
  body::after{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");pointer-events:none;z-index:998;opacity:0.4;}
  .cursor{width:8px;height:8px;background:var(--moon);border-radius:50%;position:fixed;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:left 0.06s,top 0.06s;}
  .cursor-ring{width:28px;height:28px;border:1px solid rgba(168,204,224,0.3);border-radius:50%;position:fixed;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:left 0.14s ease-out,top 0.14s ease-out;}

  .bc-nav{position:fixed;top:0;left:0;right:0;z-index:100;height:64px;padding:0 48px;display:flex;align-items:center;justify-content:space-between;background:rgba(6,14,26,0.92);backdrop-filter:blur(20px);border-bottom:1px solid rgba(168,204,224,0.06);}
  .bc-nav-brand{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--pearl);letter-spacing:4px;text-transform:uppercase;cursor:pointer;}
  .bc-nav-brand span{color:var(--gold);}
  .bc-nav-back{background:none;border:none;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--pearl-dim);cursor:pointer;display:flex;align-items:center;gap:10px;transition:color 0.2s;font-family:'Outfit',sans-serif;}
  .bc-nav-back::before{content:'';width:20px;height:1px;background:currentColor;transition:width 0.2s;}
  .bc-nav-back:hover{color:var(--moon);}
  .bc-nav-back:hover::before{width:28px;}

  .bc-wrap{min-height:100vh;padding:96px 48px 80px;max-width:1100px;margin:0 auto;position:relative;z-index:10;}

  .bc-fadein{opacity:0;transform:translateY(16px);animation:bcFade 0.55s cubic-bezier(0.4,0,0.2,1) forwards;}
  @keyframes bcFade{to{opacity:1;transform:translateY(0);}}
  .bc-d0{animation-delay:0s;} .bc-d1{animation-delay:0.08s;} .bc-d2{animation-delay:0.16s;} .bc-d3{animation-delay:0.24s;}

  .bc-hero{margin-bottom:48px;}
  .bc-eyebrow{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--moon-dim);margin-bottom:16px;display:flex;align-items:center;gap:12px;}
  .bc-eyebrow::before{content:'';width:24px;height:1px;background:var(--gold-dim);}
  .bc-heading{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,5vw,56px);font-weight:400;color:var(--pearl);line-height:1.1;margin-bottom:14px;}
  .bc-heading em{color:var(--gold);font-style:italic;}
  .bc-subhead{font-size:15px;color:var(--pearl-dim);line-height:1.8;max-width:500px;}

  /* Form */
  .bc-form-card{background:rgba(13,31,53,0.7);border:1px solid rgba(168,204,224,0.08);border-radius:18px;padding:36px 32px;backdrop-filter:blur(10px);max-width:640px;}
  .bc-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  .bc-field{display:flex;flex-direction:column;gap:6px;}
  .bc-field.full{grid-column:1/-1;}
  .bc-label{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--pearl-dim);}
  .bc-input{background:rgba(6,14,26,0.8);border:1px solid rgba(168,204,224,0.12);border-radius:8px;padding:12px 14px;font-family:'Outfit',sans-serif;font-size:14px;color:var(--pearl);outline:none;transition:border-color 0.2s;width:100%;}
  .bc-input:focus{border-color:rgba(168,204,224,0.4);}
  .bc-input::placeholder{color:var(--pearl-dim);opacity:0.5;}
  .bc-input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.6);}
  .bc-input[type=time]::-webkit-calendar-picker-indicator{filter:invert(0.6);}
  .bc-input-note{font-size:11px;color:var(--pearl-dim);opacity:0.6;margin-top:2px;}

  .bc-btn{padding:14px 40px;font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;letter-spacing:3px;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all 0.3s;margin-top:24px;}
  .bc-btn-primary{background:linear-gradient(135deg,rgba(226,194,125,0.15),rgba(226,194,125,0.05));border:1px solid rgba(226,194,125,0.35);color:var(--gold);}
  .bc-btn-primary:hover{border-color:var(--gold);background:rgba(226,194,125,0.1);box-shadow:0 0 24px rgba(226,194,125,0.1);}
  .bc-btn-primary:disabled{opacity:0.4;cursor:not-allowed;}
  .bc-btn-secondary{background:transparent;border:1px solid rgba(168,204,224,0.15);color:var(--pearl-dim);padding:10px 24px;font-size:10px;letter-spacing:2px;}
  .bc-btn-secondary:hover{border-color:var(--moon-dim);color:var(--moon);}
  .bc-error{font-size:12px;color:var(--red);margin-top:10px;}

  /* Chart section */
  .bc-chart-wrap{margin-top:48px;}
  .bc-chart-header{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:32px;}
  .bc-chart-title{font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--pearl);}
  .bc-chart-title span{color:var(--gold-dim);font-size:16px;margin-left:12px;font-family:'Noto Serif Devanagari',serif;}

  .bc-toggle{display:flex;gap:0;border:1px solid rgba(168,204,224,0.12);border-radius:4px;overflow:hidden;}
  .bc-toggle-btn{padding:8px 20px;font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:'Outfit',sans-serif;cursor:pointer;background:transparent;border:none;color:var(--pearl-dim);transition:all 0.2s;}
  .bc-toggle-btn.active{background:rgba(168,204,224,0.1);color:var(--moon);}

  .bc-chart-grid{display:grid;grid-template-columns:auto 1fr;gap:32px;align-items:start;}

  /* South Indian chart */
  .si-chart{display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(4,1fr);width:400px;height:400px;border:1px solid rgba(168,204,224,0.2);flex-shrink:0;}
  .si-cell{border:1px solid rgba(168,204,224,0.12);padding:6px 8px;display:flex;flex-direction:column;gap:2px;position:relative;min-height:90px;}
  .si-cell.empty{background:rgba(13,31,53,0.3);}
  .si-cell.center{background:rgba(6,14,26,0.5);display:flex;align-items:center;justify-content:center;}
  .si-sign{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--moon-dim);opacity:0.7;}
  .si-lagna-mark{font-size:8px;color:var(--gold);opacity:0.8;position:absolute;bottom:4px;right:6px;}
  .si-planets{display:flex;flex-direction:column;gap:1px;}
  .si-planet{font-size:11px;color:var(--pearl);line-height:1.4;}
  .si-planet.retro{color:var(--gold-dim);}
  .si-center-text{font-family:'Noto Serif Devanagari',serif;font-size:28px;color:rgba(226,194,125,0.15);}

  /* North Indian chart */
  .ni-chart{position:relative;width:400px;height:400px;flex-shrink:0;}
  .ni-svg{width:400px;height:400px;}

  /* Planet table */
  .bc-table-section{flex:1;}
  .bc-section-label{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:var(--moon-dim);margin-bottom:12px;display:flex;align-items:center;gap:10px;}
  .bc-section-label::before{content:'';width:16px;height:1px;background:var(--gold-dim);}

  .bc-planet-table{width:100%;border-collapse:collapse;margin-bottom:28px;}
  .bc-planet-table th{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--pearl-dim);padding:6px 12px;text-align:left;border-bottom:1px solid rgba(168,204,224,0.08);}
  .bc-planet-table td{font-size:13px;color:var(--pearl-dim);padding:9px 12px;border-bottom:1px solid rgba(168,204,224,0.05);line-height:1.4;}
  .bc-planet-table td:first-child{color:var(--pearl);font-weight:400;}
  .bc-planet-table td.sign{color:var(--moon);}
  .bc-planet-table td.nak{color:var(--pearl-dim);font-size:12px;}
  .bc-planet-table td.retro{color:var(--gold-dim);}
  .bc-planet-table tr:last-child td{border-bottom:none;}
  .bc-planet-table tr.lagna-row td{color:var(--gold);}
  .bc-planet-table tr.lagna-row td:first-child{color:var(--gold);}

  /* Dasha */
  .bc-dasha-card{background:rgba(13,31,53,0.6);border:1px solid rgba(168,204,224,0.08);border-radius:14px;padding:20px 22px;margin-bottom:16px;}
  .bc-dasha-current{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--gold);margin-bottom:4px;}
  .bc-dasha-dates{font-size:12px;color:var(--pearl-dim);margin-bottom:14px;}
  .bc-dasha-table{width:100%;border-collapse:collapse;}
  .bc-dasha-table td{font-size:12px;color:var(--pearl-dim);padding:5px 8px;border-bottom:1px solid rgba(168,204,224,0.04);}
  .bc-dasha-table td:first-child{color:var(--pearl);}
  .bc-dasha-table tr.current-dasha td{color:var(--gold-dim);}
  .bc-dasha-table tr:last-child td{border-bottom:none;}

  /* Nakshatra card */
  .bc-nak-card{background:rgba(13,31,53,0.6);border:1px solid rgba(168,204,224,0.08);border-radius:14px;padding:20px 22px;}
  .bc-nak-name{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--moon);margin-bottom:4px;}
  .bc-nak-sk{font-family:'Noto Serif Devanagari',serif;font-size:14px;color:var(--moon-dim);display:block;margin-bottom:8px;}
  .bc-nak-detail{font-size:13px;color:var(--pearl-dim);line-height:1.7;}

  /* Save strip */
  .bc-save-strip{margin-top:32px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
  .bc-save-note{font-size:12px;color:var(--pearl-dim);opacity:0.7;}

  /* Location autocomplete */
  .bc-place-wrap{position:relative;}
  .bc-place-dropdown{position:absolute;top:100%;left:0;right:0;z-index:50;background:rgba(13,31,53,0.98);border:1px solid rgba(168,204,224,0.2);border-top:none;border-radius:0 0 8px 8px;max-height:200px;overflow-y:auto;backdrop-filter:blur(16px);}
  .bc-place-option{padding:10px 14px;font-size:13px;color:var(--pearl-dim);cursor:pointer;border-bottom:1px solid rgba(168,204,224,0.05);transition:background 0.15s;line-height:1.4;}
  .bc-place-option:last-child{border-bottom:none;}
  .bc-place-option:hover{background:rgba(168,204,224,0.08);color:var(--pearl);}
  .bc-place-option strong{color:var(--moon);font-weight:500;font-size:13px;}
  .bc-place-loading{padding:10px 14px;font-size:12px;color:var(--pearl-dim);opacity:0.6;}

  /* DD/MM/YYYY grid */
  .bc-date-grid{display:grid;grid-template-columns:80px 80px 110px;gap:8px;}
  .bc-date-sep{display:flex;align-items:flex-end;padding-bottom:12px;color:var(--pearl-dim);opacity:0.4;font-size:18px;justify-content:center;}
    .bc-chart-grid{grid-template-columns:1fr;}
    .bc-nav{padding:0 20px;}
    .bc-wrap{padding:88px 20px 60px;}
    .bc-form-grid{grid-template-columns:1fr;}
    .si-chart,.ni-chart,.ni-svg{width:320px;height:320px;}
  }
  @media(max-width:400px){
    .si-chart,.ni-chart,.ni-svg{width:280px;height:280px;}
  }
`;

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const SIGNS_SK = ['मेष','वृष','मिथुन','कर्क','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुम्भ','मीन'];
const SIGN_ABBR = ['Ar','Ta','Ge','Ca','Le','Vi','Li','Sc','Sa','Cp','Aq','Pi'];

const NAKSHATRAS = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishta','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];
const NAKSHATRA_SK = ['अश्विनी','भरणी','कृत्तिका','रोहिणी','मृगशिरा','आर्द्रा','पुनर्वसु','पुष्य','आश्लेषा','मघा','पूर्व फाल्गुनी','उत्तर फाल्गुनी','हस्त','चित्रा','स्वाति','विशाखा','अनुराधा','ज्येष्ठा','मूल','पूर्व आषाढ़','उत्तर आषाढ़','श्रवण','धनिष्ठा','शतभिषा','पूर्व भाद्रपद','उत्तर भाद्रपद','रेवती'];
const NAKSHATRA_LORDS = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury','Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury','Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];

const DASHA_LORDS = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];
const DASHA_YEARS = [7,20,6,10,7,18,16,19,17];
const DASHA_ORDER = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];

const PLANET_ABBR = { sun:'Su', moon:'Mo', mercury:'Me', venus:'Ve', mars:'Ma', jupiter:'Ju', saturn:'Sa', rahu:'Ra', ketu:'Ke', lagna:'As' };
const PLANET_NAMES = { sun:'Sun', moon:'Moon', mercury:'Mercury', venus:'Venus', mars:'Mars', jupiter:'Jupiter', saturn:'Saturn', rahu:'Rahu', ketu:'Ketu', lagna:'Lagna' };
const PLANET_SK = { sun:'सूर्य', moon:'चन्द्र', mercury:'बुध', venus:'शुक्र', mars:'मंगल', jupiter:'गुरु', saturn:'शनि', rahu:'राहु', ketu:'केतु', lagna:'लग्न' };

/* ─────────────────────────────────────────
   CALCULATION ENGINE
───────────────────────────────────────── */
function dateToJD(year, month, day, hour, min) {
  if (month <= 2) { year -= 1; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFrac = day + (hour + min / 60) / 24;
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + dayFrac + B - 1524.5;
}

function getLahiriAyanamsha(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  // Lahiri ayanamsha — matches Jagannatha Hora and standard references
  return 23.85 + 0.01396 * T * 100 - 0.00000308 * T * T * 100;
}

function toSidereal(tropical, ayanamsha) {
  return ((tropical - ayanamsha) % 360 + 360) % 360;
}

// Convert heliocentric longitude + radius to geocentric longitude
function helioToGeo(planetHelLon, planetR, sunLon, earthR) {
  const ph = planetHelLon * Math.PI / 180;
  const eh = (sunLon + 180) * Math.PI / 180;
  const x = planetR * Math.cos(ph) - earthR * Math.cos(eh);
  const y = planetR * Math.sin(ph) - earthR * Math.sin(eh);
  return ((Math.atan2(y, x) * 180 / Math.PI) % 360 + 360) % 360;
}

function getPlanetPositions(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const r = Math.PI / 180;

  // SUN — geocentric longitude + Earth radius vector
  const sunM = (357.52911 + 35999.05029*T - 0.0001537*T*T) * r;
  const sunL0 = 280.46646 + 36000.76983*T + 0.0003032*T*T;
  const sunC = (1.9146-0.004817*T-0.000014*T*T)*Math.sin(sunM)
             + (0.019993-0.000101*T)*Math.sin(2*sunM)
             + 0.00029*Math.sin(3*sunM);
  const sun = ((sunL0 + sunC) % 360 + 360) % 360;
  const eE = 0.016708634 - 0.000042037*T;
  const earthR = 1.000001018*(1-eE*eE)/(1+eE*Math.cos((sunM+sunC*r)));

  // MOON — geocentric (already geocentric by nature)
  const moonL = 218.3165 + 481267.8813*T;
  const moonM = (134.9634 + 477198.8676*T)*r;
  const moonD = (297.8502 + 445267.1115*T)*r;
  const moonF = (93.2720 + 483202.0175*T)*r;
  const moon = ((moonL
    + 6.2886*Math.sin(moonM)
    + 1.274*Math.sin(2*moonD-moonM)
    + 0.6583*Math.sin(2*moonD)
    + 0.2136*Math.sin(2*moonM)
    - 0.1851*Math.sin((357.5291+35999.0503*T)*r)
    - 0.1143*Math.sin(2*moonF)
    + 0.0588*Math.sin(2*moonD-2*moonM)
    + 0.0572*Math.sin(2*moonD-moonM-(357.5291+35999.0503*T)*r)
    + 0.0533*Math.sin(2*moonD+moonM)
  ) % 360 + 360) % 360;

  // MERCURY — heliocentric then geocentric
  const mercM = (174.7948 + 149472.5153*T)*r;
  const eM = 0.20563069 - 0.00002182*T;
  const mercV = mercM + (2*eM-0.25*eM*eM*eM)*Math.sin(mercM) + 1.25*eM*eM*Math.sin(2*mercM) + 13/12*eM*eM*eM*Math.sin(3*mercM);
  const mercR = 0.387098*(1-eM*eM)/(1+eM*Math.cos(mercV));
  const mercHelLon = ((252.250906 + 149472.6746358*T + (mercV-mercM)*180/Math.PI) % 360 + 360) % 360;
  const mercury = helioToGeo(mercHelLon, mercR, sun, earthR);

  // VENUS — heliocentric then geocentric
  const venM = (50.4161 + 58517.8039*T)*r;
  const eV = 0.00677323 - 0.00004938*T;
  const venV = venM + 2*eV*Math.sin(venM) + 1.25*eV*eV*Math.sin(2*venM);
  const venR = 0.723332*(1-eV*eV)/(1+eV*Math.cos(venV));
  const venHelLon = ((181.979801 + 58517.8156760*T + (venV-venM)*180/Math.PI) % 360 + 360) % 360;
  const venus = helioToGeo(venHelLon, venR, sun, earthR);

  // MARS — heliocentric then geocentric
  const marM = (19.3730 + 19140.3023*T)*r;
  const eMa = 0.09341233 - 0.00011675*T;
  const marV = marM + (2*eMa-0.25*eMa*eMa*eMa)*Math.sin(marM) + 1.25*eMa*eMa*Math.sin(2*marM) + 13/12*eMa*eMa*eMa*Math.sin(3*marM);
  const marR = 1.523679*(1-eMa*eMa)/(1+eMa*Math.cos(marV));
  const marHelLon = ((355.433+19140.2993*T+(marV-marM)*180/Math.PI) % 360 + 360) % 360;
  const mars = helioToGeo(marHelLon, marR, sun, earthR);

  // JUPITER — heliocentric then geocentric
  const jupM = (20.9441 + 3034.9057*T)*r;
  const eJ = 0.04849485 + 0.00016323*T;
  const jupV = jupM + (2*eJ-0.25*eJ*eJ*eJ)*Math.sin(jupM) + 1.25*eJ*eJ*Math.sin(2*jupM);
  const jupR = 5.202561*(1-eJ*eJ)/(1+eJ*Math.cos(jupV));
  const jupHelLon = ((34.3515+3034.9057*T+(jupV-jupM)*180/Math.PI) % 360 + 360) % 360;
  const jupiter = helioToGeo(jupHelLon, jupR, sun, earthR);

  // SATURN — heliocentric then geocentric (with Jupiter perturbation)
  const satM = (317.0207 + 1222.1138*T)*r;
  const Gj = jupM; const Gs = satM;
  const satPert = 0.812*Math.sin(2*Gj-5*Gs-67.6*r) - 0.229*Math.cos(2*Gj-4*Gs-2*r) + 0.119*Math.sin(Gj-2*Gs-3*r);
  const eS = 0.05415060 - 0.00013861*T;
  const satV = satM + (2*eS-0.25*eS*eS*eS)*Math.sin(satM) + 1.25*eS*eS*Math.sin(2*satM);
  const satR = 9.537070*(1-eS*eS)/(1+eS*Math.cos(satV));
  const satHelLon = ((50.0774+1222.1138*T+(satV-satM)*180/Math.PI+satPert) % 360 + 360) % 360;
  const saturn = helioToGeo(satHelLon, satR, sun, earthR);

  // RAHU — mean north node (retrograde)
  const rahu = ((125.0445 - 1934.1363*T) % 360 + 360) % 360;
  const ketu = (rahu + 180) % 360;

  return { sun, moon, mercury, venus, mars, jupiter, saturn, rahu, ketu };
}

function getLagnaLongitude(jd, lat, lon) {
  const T = (jd - 2451545.0) / 36525.0;
  const GST = ((280.46061837 + 360.98564736629*(jd-2451545) + 0.000387933*T*T) % 360 + 360) % 360;
  const LST = ((GST + lon) % 360 + 360) % 360;
  const eps = (23.439291111 - 0.013004167*T) * Math.PI / 180;
  const lstRad = LST * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  const ascRad = Math.atan2(Math.cos(lstRad), -(Math.sin(lstRad)*Math.cos(eps) + Math.tan(latRad)*Math.sin(eps)));
  return ((ascRad * 180 / Math.PI) + 360) % 360;
}

function calculateChart(dateStr, timeStr, lat, lon) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hLocal, mLocal] = timeStr.split(':').map(Number);
  const utcHour = hLocal - 5.5;
  const utcH = Math.floor(((utcHour % 24) + 24) % 24);
  const utcM = mLocal;
  const dayAdj = utcHour < 0 ? day - 1 : day;

  const jd = dateToJD(year, month, dayAdj, utcH, utcM);
  const ayan = getLahiriAyanamsha(jd);
  const tropical = getPlanetPositions(jd);
  const lagnaT = getLagnaLongitude(jd, lat, lon);

  const planets = {};
  Object.entries(tropical).forEach(([k, v]) => {
    planets[k] = toSidereal(v, ayan);
  });
  planets.lagna = toSidereal(lagnaT, ayan);

  // ── Retrograde detection ──────────────────────────────
  // Compare geocentric longitude at jd vs jd+1
  // A planet is retrograde when its longitude decreases
  const tropical2 = getPlanetPositions(jd + 1);
  const ayan2 = getLahiriAyanamsha(jd + 1);

  function velDiff(lon1, lon2) {
    let d = toSidereal(lon2, ayan2) - toSidereal(lon1, ayan);
    if(d > 180) d -= 360;
    if(d < -180) d += 360;
    return d; // negative = retrograde
  }

  const retrograde = {
    sun:     false, // Sun never retrograde
    moon:    false, // Moon never retrograde
    mercury: velDiff(tropical.mercury, tropical2.mercury) < 0,
    venus:   velDiff(tropical.venus,   tropical2.venus)   < 0,
    mars:    velDiff(tropical.mars,    tropical2.mars)    < 0,
    jupiter: velDiff(tropical.jupiter, tropical2.jupiter) < 0,
    saturn:  velDiff(tropical.saturn,  tropical2.saturn)  < 0,
    rahu:    true,  // Rahu always retrograde (mean node moves backward)
    ketu:    true,  // Ketu always retrograde
    lagna:   false,
  };

  // Nakshatra & Dasha
  const moonNakIdx = Math.floor(planets.moon / (360/27));
  const moonNak = NAKSHATRAS[moonNakIdx];
  const moonNakSk = NAKSHATRA_SK[moonNakIdx];
  const moonNakLord = NAKSHATRA_LORDS[moonNakIdx];

  const dashLordIdx = moonNakIdx % 9;
  const dashLord = DASHA_LORDS[dashLordIdx];
  const nakProgress = (planets.moon % (360/27)) / (360/27);
  const remainYears = DASHA_YEARS[dashLordIdx] * (1 - nakProgress);

  const birthDate = new Date(`${dateStr}T${timeStr}`);
  const dashaStart = new Date(birthDate.getTime() - (DASHA_YEARS[dashLordIdx] - remainYears) * 365.25 * 24*60*60*1000);

  const dashaSeq = [];
  let cursor = dashaStart;
  let startIdx = DASHA_ORDER.indexOf(dashLord);
  for(let i = 0; i < 9; i++) {
    const idx = (startIdx + i) % 9;
    const lord = DASHA_ORDER[idx];
    const yrs = DASHA_YEARS[DASHA_LORDS.indexOf(lord)];
    const end = new Date(cursor.getTime() + yrs * 365.25 * 24*60*60*1000);
    dashaSeq.push({ lord, start: new Date(cursor), end });
    cursor = end;
  }

  return { planets, retrograde, ayan, moonNak, moonNakSk, moonNakLord, moonNakIdx, dashLord, remainYears, dashaSeq, jd };
}

/* ─────────────────────────────────────────
   GEOCODING (OpenStreetMap Nominatim — free)
───────────────────────────────────────── */
async function geocodePlace(place) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'Accept-Language':'en' } });
  const data = await res.json();
  if(data.length === 0) throw new Error('Place not found');
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display: data[0].display_name };
}

/* ─────────────────────────────────────────
   SOUTH INDIAN CHART
   Fixed sign positions (Aries always top-left cell)
   Lagna moves based on Lagna sign
───────────────────────────────────────── */
// SI layout: 4x4 grid, center 4 cells empty
// Sign positions in grid (row, col), 0-indexed
const SI_POSITIONS = [
  [0,0],[0,1],[0,2],[0,3],
  [1,3],[2,3],[3,3],
  [3,2],[3,1],[3,0],
  [2,0],[1,0]
]; // Signs 0 (Aries) through 11 (Pisces)

function SouthIndianChart({ planets, retrograde }) {
  const lagnaSign = Math.floor(planets.lagna / 30);

  const cells = SI_POSITIONS.map((pos, signIdx) => {
    const planetsHere = Object.entries(planets)
      .filter(([k, v]) => Math.floor(v / 30) === signIdx)
      .map(([k]) => k);
    return { pos, signIdx, planets: planetsHere, isLagna: signIdx === lagnaSign };
  });

  const grid = Array(4).fill(null).map(() => Array(4).fill(null));
  cells.forEach(cell => { grid[cell.pos[0]][cell.pos[1]] = cell; });

  return (
    <div className="si-chart">
      {grid.flat().map((cell, i) => {
        if(!cell) {
          return (
            <div key={i} className="si-cell center">
              <div className="si-center-text">ॐ</div>
            </div>
          );
        }
        return (
          <div key={i} className="si-cell">
            <div className="si-sign">{SIGN_ABBR[cell.signIdx]}</div>
            <div className="si-planets">
              {cell.planets.map(p => (
                <div key={p} className={`si-planet ${retrograde[p] ? 'retro' : ''}`}>
                  {PLANET_ABBR[p]}
                  {p === 'lagna' ? '' : ` ${(planets[p] % 30).toFixed(0)}°`}
                  {retrograde[p] ? ' ℞' : ''}
                </div>
              ))}
            </div>
            {cell.isLagna && <div className="si-lagna-mark">Asc</div>}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   NORTH INDIAN CHART
   Standard Uttar Bharatiya 4×4 grid layout
   H1 always top-second-cell, clockwise
───────────────────────────────────────── */
function NorthIndianChart({ planets, retrograde }) {
  const SIZE = 400;
  const CELL = SIZE / 4; // 100px per cell
  const lagnaSign = Math.floor(planets.lagna / 30);

  // House positions in grid [row, col] — H1 at (0,1), clockwise
  const HOUSE_CELLS = [
    [0,1], // H1  — top row, 2nd cell
    [0,2], // H2  — top row, 3rd cell
    [0,3], // H3  — top row, 4th cell
    [1,3], // H4  — right col, 2nd cell
    [2,3], // H5  — right col, 3rd cell
    [3,3], // H6  — bottom row, 4th cell
    [3,2], // H7  — bottom row, 3rd cell
    [3,1], // H8  — bottom row, 2nd cell
    [3,0], // H9  — bottom row, 1st cell
    [2,0], // H10 — left col, 3rd cell
    [1,0], // H11 — left col, 2nd cell
    [0,0], // H12 — top row, 1st cell
  ];

  // Which sign is in each house (H1 = lagna sign, clockwise)
  // houseIndex: 0 = H1, 1 = H2, ...
  const houseSign = (houseIndex) => (lagnaSign + houseIndex) % 12;

  // Planets in each sign
  const planetsInSign = (signIdx) =>
    Object.entries(planets)
      .filter(([k, v]) => Math.floor(v / 30) === signIdx)
      .map(([k]) => k);

  // Build cell data for all 16 grid positions
  const cellData = {};
  HOUSE_CELLS.forEach((pos, houseIdx) => {
    const key = `${pos[0]}-${pos[1]}`;
    const sign = houseSign(houseIdx);
    cellData[key] = {
      houseNum: houseIdx + 1,
      sign,
      pls: planetsInSign(sign),
      isLagna: houseIdx === 0,
    };
  });

  // Center 2×2 cells are decorative
  const CENTER = new Set(['1-1','1-2','2-1','2-2']);

  const cells = [];
  for(let r = 0; r < 4; r++) {
    for(let c = 0; c < 4; c++) {
      cells.push({ r, c, key: `${r}-${c}` });
    }
  }

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{display:'block'}}>

      {/* Grid lines */}
      {[0,1,2,3,4].map(i => (
        <g key={i}>
          <line x1={i*CELL} y1={0} x2={i*CELL} y2={SIZE} stroke="rgba(168,204,224,0.18)" strokeWidth="0.8"/>
          <line x1={0} y1={i*CELL} x2={SIZE} y2={i*CELL} stroke="rgba(168,204,224,0.18)" strokeWidth="0.8"/>
        </g>
      ))}

      {/* Center diamond decoration */}
      <rect x={CELL} y={CELL} width={CELL*2} height={CELL*2} fill="rgba(6,14,26,0.5)" stroke="rgba(168,204,224,0.08)" strokeWidth="0.5"/>
      <line x1={CELL} y1={CELL} x2={CELL*3} y2={CELL*3} stroke="rgba(168,204,224,0.08)" strokeWidth="0.5"/>
      <line x1={CELL*3} y1={CELL} x2={CELL} y2={CELL*3} stroke="rgba(168,204,224,0.08)" strokeWidth="0.5"/>
      <text x={CELL*2} y={CELL*2+8} textAnchor="middle" fill="rgba(226,194,125,0.12)" fontSize="28" fontFamily="Noto Serif Devanagari,serif">ॐ</text>

      {/* Lagna diagonal mark in H1 cell */}
      {(() => {
        const [r,c] = HOUSE_CELLS[0];
        return <line x1={c*CELL} y1={(r+1)*CELL} x2={(c+1)*CELL} y2={r*CELL} stroke="rgba(226,194,125,0.35)" strokeWidth="0.8"/>;
      })()}

      {/* House cells */}
      {cells.map(({ r, c, key }) => {
        if(CENTER.has(key)) return null;
        const data = cellData[key];
        if(!data) return null;
        const x = c * CELL;
        const y = r * CELL;
        const cx = x + CELL / 2;
        const cy = y + CELL / 2;

        return (
          <g key={key}>
            {/* Sign label */}
            <text x={cx} y={cy - 18} textAnchor="middle"
              fill={data.isLagna ? 'rgba(226,194,125,0.6)' : 'rgba(168,204,224,0.3)'}
              fontSize="8" fontFamily="Outfit,sans-serif" letterSpacing="1">
              {SIGN_ABBR[data.sign]}
            </text>

            {/* Planet labels */}
            {data.pls.slice(0, 4).map((p, pi) => {
              const isR = retrograde[p];
              const lineH = 11;
              const startY = cy - 4 + (pi - data.pls.length/2 + 0.5) * lineH;
              return (
                <text key={p} x={cx} y={startY}
                  textAnchor="middle"
                  fill={
                    p === 'lagna' ? '#E2C27D' :
                    isR ? '#B89A55' :
                    '#D8EEF8'
                  }
                  fontSize="10" fontFamily="Outfit,sans-serif" fontWeight="400">
                  {PLANET_ABBR[p]}{isR ? '℞' : ''}
                </text>
              );
            })}

            {/* House number (small, corner) */}
            <text x={x+4} y={y+10} fill="rgba(168,204,224,0.2)" fontSize="7" fontFamily="Outfit,sans-serif">
              {data.houseNum}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─────────────────────────────────────────
   PLANET TABLE
───────────────────────────────────────── */
function PlanetTable({ planets, retrograde }) {
  const rows = ['lagna','sun','moon','mercury','venus','mars','jupiter','saturn','rahu','ketu'];
  return (
    <table className="bc-planet-table">
      <thead>
        <tr>
          <th>Planet</th>
          <th>Sanskrit</th>
          <th>Sign</th>
          <th>Degree</th>
          <th>Nakshatra</th>
          <th>Lord</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(p => {
          const deg = planets[p];
          const signIdx = Math.floor(deg / 30);
          const degInSign = (deg % 30).toFixed(1);
          const nakIdx = Math.floor(deg / (360/27));
          const nak = NAKSHATRAS[nakIdx];
          const nakLord = NAKSHATRA_LORDS[nakIdx];
          const isR = retrograde[p];
          return (
            <tr key={p} className={p==='lagna'?'lagna-row':''}>
              <td>{PLANET_NAMES[p]}</td>
              <td style={{fontFamily:'Noto Serif Devanagari,serif',fontSize:12,color:'var(--moon-dim)'}}>{PLANET_SK[p]}</td>
              <td className="sign">{SIGNS[signIdx]}</td>
              <td className={isR?'retro':''}>{degInSign}°{isR?' ℞':''}</td>
              <td className="nak">{p==='lagna'?'—':nak}</td>
              <td style={{fontSize:12,color:'var(--pearl-dim)',opacity:0.7}}>{p==='lagna'?'—':nakLord}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ─────────────────────────────────────────
   DASHA TABLE
───────────────────────────────────────── */
function DashaTable({ dashaSeq, birthDate }) {
  const now = new Date();
  const formatDate = (d) => d.toLocaleDateString('en-IN', { month:'short', year:'numeric' });

  return (
    <div className="bc-dasha-card">
      <div className="bc-section-label">Vimshottari Dasha</div>
      <table className="bc-dasha-table">
        <tbody>
          {dashaSeq.map((d, i) => {
            const isCurrent = now >= d.start && now < d.end;
            return (
              <tr key={i} className={isCurrent?'current-dasha':''}>
                <td>{d.lord}{isCurrent?' ◆':''}</td>
                <td>{formatDate(d.start)}</td>
                <td>→</td>
                <td>{formatDate(d.end)}</td>
                <td style={{textAlign:'right',opacity:0.5,fontSize:11}}>{DASHA_YEARS[DASHA_LORDS.indexOf(d.lord)]} yrs</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────── */
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
  useEffect(()=>{
    const mv=e=>{if(dot.current){dot.current.style.left=e.clientX+'px';dot.current.style.top=e.clientY+'px';}if(ring.current){ring.current.style.left=e.clientX+'px';ring.current.style.top=e.clientY+'px';}};
    window.addEventListener('mousemove',mv);return()=>window.removeEventListener('mousemove',mv);
  },[]);
  return <><div className="cursor" ref={dot}/><div className="cursor-ring" ref={ring}/></>;
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function BirthChart() {
  const navigate = useNavigate();

  // DD / MM / YYYY separate fields
  const [day, setDay]     = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear]   = useState('');
  const [time, setTime]   = useState('');

  // Location autocomplete
  const [placeQuery, setPlaceQuery]       = useState('');
  const [placeSuggestions, setPlaceSugg]  = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null); // { display, lat, lon }
  const [placeLoading, setPlaceLoading]   = useState(false);
  const placeDebounce = useRef(null);

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [chartData, setChartData] = useState(null);
  const [chartStyle, setChartStyle] = useState('south');
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [user, setUser]         = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
  }, []);

  // Debounced place search
  useEffect(() => {
    if(!placeQuery || placeQuery.length < 3) { setPlaceSugg([]); return; }
    clearTimeout(placeDebounce.current);
    placeDebounce.current = setTimeout(async () => {
      setPlaceLoading(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeQuery)}&format=json&limit=5&addressdetails=1`, { headers:{'Accept-Language':'en'} });
        const data = await res.json();
        setPlaceSugg(data.map(d => ({
          display: d.display_name,
          short: [d.address?.city || d.address?.town || d.address?.village, d.address?.state, d.address?.country].filter(Boolean).join(', '),
          lat: parseFloat(d.lat),
          lon: parseFloat(d.lon),
        })));
      } catch(e) { setPlaceSugg([]); }
      setPlaceLoading(false);
    }, 400);
  }, [placeQuery]);

  const handleSelectPlace = (p) => {
    setSelectedPlace(p);
    setPlaceQuery(p.short || p.display);
    setPlaceSugg([]);
  };

  const handleGenerate = async () => {
    // Validate all fields
    const d = parseInt(day), mo = parseInt(month), yr = parseInt(year);
    if(!d || !mo || !yr || !time || !selectedPlace) {
      setError('Please fill in all fields and select a location from the dropdown.');
      return;
    }
    if(d < 1 || d > 31) { setError('Day must be between 1 and 31.'); return; }
    if(mo < 1 || mo > 12) { setError('Month must be between 1 and 12.'); return; }
    if(yr < 1900 || yr > 2100) { setError('Please enter a valid year between 1900 and 2100.'); return; }

    // Build YYYY-MM-DD for internal use
    const dateStr = `${yr}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const displayDate = `${String(d).padStart(2,'0')}/${String(mo).padStart(2,'0')}/${yr}`;

    setError('');
    setLoading(true);
    try {
      const data = calculateChart(dateStr, time, selectedPlace.lat, selectedPlace.lon);
      setChartData({ ...data, lat: selectedPlace.lat, lon: selectedPlace.lon, display: selectedPlace.display, form: { date: dateStr, displayDate, time, place: selectedPlace.short || selectedPlace.display } });
      setTimeout(() => window.scrollTo({ top: 600, behavior: 'smooth' }), 100);
    } catch(e) {
      setError('Calculation failed. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if(!user) { navigate('/login?redirect=/birth-chart'); return; }
    if(saving || saved || !chartData) return;
    setSaving(true);
    try {
      const { error: dbErr } = await supabase.from('birth_charts').upsert({
        user_id: user.id,
        birth_date: chartData.form.date,
        birth_time: chartData.form.time,
        birth_place: chartData.form.place,
        latitude: chartData.lat,
        longitude: chartData.lon,
        lagna_sign: SIGNS[Math.floor(chartData.planets.lagna / 30)],
        moon_nakshatra: chartData.moonNak,
        birth_dasha: chartData.dashLord,
        planet_positions: JSON.stringify(chartData.planets),
        created_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      if(dbErr) throw dbErr;
      setSaved(true);
    } catch(e) {
      console.error(e);
      setError('Could not save chart. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Free Vedic Kundali Calculator — Jyotish Birth Chart | Sattva Heals</title>
        <meta name="description" content="Generate your free Vedic birth chart online. Get your Lagna, all 9 planets, Moon Nakshatra, and Vimshottari Dasha sequence — calculated using the Lahiri ayanamsha." />
        <link rel="canonical" href="https://sattvaheals.in/kundali" />
      </Helmet>
      <style>{FONTS+css}</style>
      <Cursor/>
      <StarField/>

      <nav className="bc-nav">
        <div className="bc-nav-brand" onClick={() => navigate('/')}>SATTVA <span>Heals</span></div>
        <button className="bc-nav-back" onClick={() => navigate('/dashboard')}>Dashboard</button>
      </nav>

      <div className="bc-wrap">

        {/* Hero */}
        <div className="bc-hero bc-fadein bc-d0">
          <div className="bc-eyebrow">Jyotisha</div>
          <div className="bc-heading">Your <em>birth chart</em></div>
          <div className="bc-subhead">
            Enter your birth details to generate your complete Jyotish chart —
            Lagna, all 9 grahas, Nakshatras, and Vimshottari Dasha sequence.
          </div>
        </div>

        {/* Form */}
        <div className="bc-form-card bc-fadein bc-d1">
          <div className="bc-form-grid">

            {/* Date — DD / MM / YYYY */}
            <div className="bc-field full">
              <label className="bc-label">Date of birth</label>
              <div className="bc-date-grid">
                <input className="bc-input" type="number" placeholder="DD" min="1" max="31"
                  value={day} onChange={e => setDay(e.target.value)} style={{textAlign:'center'}}/>
                <input className="bc-input" type="number" placeholder="MM" min="1" max="12"
                  value={month} onChange={e => setMonth(e.target.value)} style={{textAlign:'center'}}/>
                <input className="bc-input" type="number" placeholder="YYYY" min="1900" max="2100"
                  value={year} onChange={e => setYear(e.target.value)} style={{textAlign:'center'}}/>
              </div>
            </div>

            {/* Time */}
            <div className="bc-field">
              <label className="bc-label">Time of birth</label>
              <input className="bc-input" type="time" value={time} onChange={e => setTime(e.target.value)}/>
              <div className="bc-input-note">Enter in IST (India Standard Time)</div>
            </div>

            {/* Place with autocomplete */}
            <div className="bc-field">
              <label className="bc-label">Place of birth</label>
              <div className="bc-place-wrap">
                <input className="bc-input" type="text" placeholder="Start typing a city…"
                  value={placeQuery}
                  onChange={e => { setPlaceQuery(e.target.value); setSelectedPlace(null); }}
                  autoComplete="off"
                  style={selectedPlace ? {borderColor:'rgba(110,203,160,0.4)'} : {}}
                />
                {(placeSuggestions.length > 0 || placeLoading) && (
                  <div className="bc-place-dropdown">
                    {placeLoading && <div className="bc-place-loading">Searching…</div>}
                    {placeSuggestions.map((p, i) => (
                      <div key={i} className="bc-place-option" onClick={() => handleSelectPlace(p)}>
                        <strong>{p.short}</strong>
                        <div style={{fontSize:11,opacity:0.5,marginTop:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.display}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bc-input-note">
                {selectedPlace ? `✓ ${selectedPlace.lat.toFixed(4)}°N, ${selectedPlace.lon.toFixed(4)}°E` : 'Type and select from dropdown'}
              </div>
            </div>

          </div>
          {error && <div className="bc-error">{error}</div>}
          <button className="bc-btn bc-btn-primary" onClick={handleGenerate} disabled={loading}>
            {loading ? 'Calculating…' : 'Generate Chart →'}
          </button>
        </div>

        {/* Chart output */}
        {chartData && (
          <div className="bc-chart-wrap bc-fadein bc-d2">

            <div className="bc-chart-header">
              <div>
                <div className="bc-chart-title">
                  {SIGNS[Math.floor(chartData.planets.lagna / 30)]} Lagna
                  <span>{SIGNS_SK[Math.floor(chartData.planets.lagna / 30)]}</span>
                </div>
                <div style={{fontSize:12,color:'var(--pearl-dim)',marginTop:4}}>
                  {chartData.form.place} · {chartData.form.displayDate} · {chartData.form.time} IST
                </div>
              </div>
              <div className="bc-toggle">
                <button className={`bc-toggle-btn ${chartStyle==='south'?'active':''}`} onClick={()=>setChartStyle('south')}>South Indian</button>
                <button className={`bc-toggle-btn ${chartStyle==='north'?'active':''}`} onClick={()=>setChartStyle('north')}>North Indian</button>
              </div>
            </div>

            <div className="bc-chart-grid">
              {/* Chart */}
              {chartStyle === 'south'
                ? <SouthIndianChart planets={chartData.planets} retrograde={chartData.retrograde}/>
                : <NorthIndianChart planets={chartData.planets} retrograde={chartData.retrograde}/>
              }

              {/* Right panel */}
              <div className="bc-table-section">

                {/* Nakshatra */}
                <div className="bc-section-label" style={{marginBottom:10}}>Moon nakshatra</div>
                <div className="bc-nak-card" style={{marginBottom:24}}>
                  <div className="bc-nak-name">{chartData.moonNak}</div>
                  <span className="bc-nak-sk">{chartData.moonNakSk}</span>
                  <div className="bc-nak-detail">
                    Lord: <span style={{color:'var(--moon)'}}>{chartData.moonNakLord}</span>
                    &nbsp;·&nbsp;
                    Moon at {(chartData.planets.moon % 30).toFixed(1)}° {SIGNS[Math.floor(chartData.planets.moon/30)]}
                  </div>
                </div>

                {/* Dasha */}
                <DashaTable dashaSeq={chartData.dashaSeq} birthDate={chartData.form.date}/>

              </div>
            </div>

            {/* Full planet table */}
            <div style={{marginTop:40}}>
              <div className="bc-section-label" style={{marginBottom:12}}>All planets</div>
              <PlanetTable planets={chartData.planets} retrograde={chartData.retrograde}/>
            </div>

            {/* Save */}
            <div className="bc-save-strip">
              <button className="bc-btn bc-btn-primary" onClick={handleSave} disabled={saving||saved}>
                {saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save chart to my account'}
              </button>
              <button className="bc-btn bc-btn-secondary" onClick={() => setChartData(null)}>
                New chart
              </button>
              <div className="bc-save-note">
                {user ? 'Saved charts appear in your dashboard.' : 'You need to be logged in to save.'}
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{marginTop:28,fontSize:11,color:'rgba(139,175,196,0.4)',fontStyle:'italic',lineHeight:1.7,maxWidth:640}}>
              This chart is calculated using the Lahiri ayanamsha (Chitrapaksha) and Whole Sign houses — the standard system used in classical Jyotisha. Planet positions are approximate and intended for spiritual and educational guidance. For a detailed personalised reading, book a consultation with our Jyotishi.
            </div>

          </div>
        )}

      </div>
    </>
  );
}