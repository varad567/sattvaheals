import { useState, useEffect, useRef } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Cinzel:wght@400;500;600;700&family=Jost:wght@200;300;400;500;600&display=swap');
`;

const styles = `
  :root {
    --saffron: #D4780A;
    --saffron-light: #F0A030;
    --saffron-glow: #E8901A;
    --navy: #0E1B2E;
    --navy-mid: #162540;
    --navy-light: #1E3055;
    --ivory: #F7EDD8;
    --ivory-light: #FDF6EC;
    --ivory-dim: #E8D9BC;
    --gold: #C8962A;
    --gold-light: #E8B84B;
    --terracotta: #8B3A2A;
    --sage: #2D5A3D;
    --text-light: #F0E6D0;
    --text-dim: #A89070;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--navy);
    color: var(--ivory);
    font-family: 'Jost', sans-serif;
    overflow-x: hidden;
  }

  .cinzel { font-family: 'Cinzel', serif; }
  .cormorant { font-family: 'Cormorant Garamond', serif; }

  /* ─── STARS CANVAS ─── */
  #stars-canvas {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  /* ─── NAV ─── */
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 20px 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.4s ease;
  }
  nav.scrolled {
    background: rgba(14, 27, 46, 0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(212, 120, 10, 0.15);
    padding: 14px 60px;
  }
  .nav-logo {
    font-family: 'Cinzel', serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--saffron-light);
    letter-spacing: 4px;
    text-decoration: none;
  }
  .nav-logo span {
    color: var(--ivory);
    font-weight: 400;
  }
  .nav-links {
    display: flex;
    gap: 36px;
    list-style: none;
  }
  .nav-links a {
    color: var(--text-dim);
    text-decoration: none;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 2px;
    text-transform: uppercase;
    transition: color 0.3s;
  }
  .nav-links a:hover { color: var(--saffron-light); }
  .nav-cta {
    background: transparent;
    border: 1px solid var(--saffron);
    color: var(--saffron-light);
    padding: 10px 28px;
    font-family: 'Cinzel', serif;
    font-size: 12px;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.3s;
    text-transform: uppercase;
  }
  .nav-cta:hover {
    background: var(--saffron);
    color: var(--navy);
  }

  /* ─── HERO ─── */
  .hero {
    min-height: 100vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    z-index: 1;
  }

  .mandala-bg {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
  .mandala-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(212, 120, 10, 0.08);
    animation: slowSpin 60s linear infinite;
  }
  .mandala-ring:nth-child(2) { animation-direction: reverse; animation-duration: 80s; border-color: rgba(212, 120, 10, 0.05); }
  .mandala-ring:nth-child(3) { animation-duration: 120s; border-color: rgba(212, 120, 10, 0.04); }

  @keyframes slowSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .moon-orb {
    position: absolute;
    top: 15%;
    right: 12%;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%,
      rgba(240, 160, 48, 0.15) 0%,
      rgba(200, 150, 42, 0.08) 40%,
      transparent 70%
    );
    border: 1px solid rgba(212, 120, 10, 0.2);
    box-shadow:
      0 0 60px rgba(212, 120, 10, 0.08),
      inset 0 0 40px rgba(212, 120, 10, 0.05);
    animation: moonPulse 8s ease-in-out infinite;
  }
  @keyframes moonPulse {
    0%, 100% { box-shadow: 0 0 60px rgba(212,120,10,0.08), inset 0 0 40px rgba(212,120,10,0.05); }
    50% { box-shadow: 0 0 100px rgba(212,120,10,0.15), inset 0 0 60px rgba(212,120,10,0.1); }
  }

  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 900px;
    padding: 0 40px;
    padding-top: 80px;
  }

  .hero-tag {
    display: inline-block;
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 4px;
    color: var(--saffron);
    border: 1px solid rgba(212, 120, 10, 0.3);
    padding: 8px 20px;
    margin-bottom: 40px;
    text-transform: uppercase;
    animation: fadeInUp 1s ease both;
  }

  .hero-title {
    font-family: 'Cinzel', serif;
    font-size: clamp(64px, 10vw, 120px);
    font-weight: 700;
    letter-spacing: 12px;
    color: var(--ivory);
    line-height: 1;
    margin-bottom: 8px;
    animation: fadeInUp 1s 0.2s ease both;
  }
  .hero-title .glow {
    color: var(--saffron-light);
    text-shadow: 0 0 60px rgba(212, 120, 10, 0.4);
  }

  .hero-subtitle-sanskrit {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-style: italic;
    color: var(--text-dim);
    letter-spacing: 3px;
    margin-bottom: 32px;
    animation: fadeInUp 1s 0.35s ease both;
  }

  .hero-subtitle {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(20px, 3vw, 28px);
    font-weight: 300;
    color: var(--text-light);
    line-height: 1.6;
    max-width: 680px;
    margin: 0 auto 56px;
    animation: fadeInUp 1s 0.5s ease both;
  }
  .hero-subtitle em {
    font-style: italic;
    color: var(--saffron-light);
  }

  .hero-ctas {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
    animation: fadeInUp 1s 0.65s ease both;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--saffron) 0%, var(--gold) 100%);
    color: var(--navy);
    border: none;
    padding: 16px 44px;
    font-family: 'Cinzel', serif;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  .btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.15);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .btn-primary:hover::after { opacity: 1; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(212, 120, 10, 0.35); }

  .btn-secondary {
    background: transparent;
    color: var(--ivory);
    border: 1px solid rgba(247, 237, 216, 0.3);
    padding: 16px 44px;
    font-family: 'Cinzel', serif;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
  }
  .btn-secondary:hover {
    border-color: var(--saffron);
    color: var(--saffron-light);
  }

  .hero-stats {
    display: flex;
    justify-content: center;
    align-items: stretch;
    margin-top: 52px;
    border: 1px solid rgba(212, 120, 10, 0.2);
    background: rgba(14, 27, 46, 0.55);
    backdrop-filter: blur(12px);
    max-width: 660px;
    margin-left: auto;
    margin-right: auto;
    animation: fadeInUp 1s 0.9s ease both;
  }
  .stat-item {
    flex: 1;
    text-align: center;
    padding: 22px 16px;
    position: relative;
  }
  .stat-item + .stat-item::before {
    content: '';
    position: absolute;
    left: 0; top: 18%; bottom: 18%;
    width: 1px;
    background: rgba(212, 120, 10, 0.2);
  }
  .stat-num {
    font-family: 'Cinzel', serif;
    font-size: 26px;
    font-weight: 700;
    color: var(--saffron-light);
    display: block;
    line-height: 1;
    margin-bottom: 8px;
  }
  .stat-label {
    font-size: 10px;
    letter-spacing: 1.2px;
    color: var(--text-dim);
    text-transform: uppercase;
    line-height: 1.5;
    display: block;
  }
  .stat-divider { display: none; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ─── SECTION BASE ─── */
  section {
    position: relative;
    z-index: 1;
  }

  .section-tag {
    font-family: 'Cinzel', serif;
    font-size: 10px;
    letter-spacing: 4px;
    color: var(--saffron);
    text-transform: uppercase;
    display: block;
    margin-bottom: 16px;
  }

  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 600;
    line-height: 1.1;
    color: var(--ivory);
  }

  /* ─── PROBLEM ─── */
  .problem-section {
    padding: 120px 60px;
    background: linear-gradient(180deg, var(--navy) 0%, var(--navy-mid) 100%);
  }
  .problem-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }
  .problem-left .section-title {
    margin-bottom: 28px;
  }
  .problem-left p {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 300;
    line-height: 1.8;
    color: var(--text-light);
    margin-bottom: 16px;
  }
  .problem-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 8px;
  }
  .crisis-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(212, 120, 10, 0.12);
    padding: 24px 20px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
  }
  .crisis-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: var(--saffron);
  }
  .crisis-card:hover {
    background: rgba(212, 120, 10, 0.06);
    border-color: rgba(212, 120, 10, 0.25);
  }
  .crisis-num {
    font-family: 'Cinzel', serif;
    font-size: 36px;
    font-weight: 700;
    color: var(--saffron-light);
    display: block;
    margin-bottom: 8px;
  }
  .crisis-desc {
    font-size: 13px;
    color: var(--text-dim);
    line-height: 1.5;
    letter-spacing: 0.5px;
  }

  .problem-right {
    position: relative;
  }
  .ancient-gap-box {
    background: rgba(212, 120, 10, 0.06);
    border: 1px solid rgba(212, 120, 10, 0.2);
    padding: 44px 40px;
    position: relative;
  }
  .ancient-gap-box::before {
    content: '"';
    position: absolute;
    top: -20px; left: 28px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 100px;
    color: var(--saffron);
    opacity: 0.3;
    line-height: 1;
  }
  .ancient-gap-box p {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-style: italic;
    font-weight: 300;
    line-height: 1.7;
    color: var(--ivory);
    margin-bottom: 24px;
  }
  .ancient-gap-box .attr {
    font-size: 12px;
    letter-spacing: 2px;
    color: var(--saffron);
    text-transform: uppercase;
    font-family: 'Cinzel', serif;
    font-style: normal;
  }
  .gap-label {
    margin-top: 32px;
    padding-top: 32px;
    border-top: 1px solid rgba(212, 120, 10, 0.15);
    font-size: 14px;
    color: var(--text-dim);
    line-height: 1.7;
  }

  /* ─── THREE PILLARS ─── */
  .pillars-section {
    padding: 120px 60px;
    background: var(--navy-mid);
    overflow: hidden;
  }
  .pillars-header {
    max-width: 1200px;
    margin: 0 auto 80px;
    text-align: center;
  }
  .pillars-header .section-title { margin-bottom: 20px; }
  .pillars-header p {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    color: var(--text-dim);
    font-style: italic;
  }
  .pillars-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }
  .pillar-card {
    background: rgba(255,255,255,0.02);
    padding: 56px 40px;
    position: relative;
    overflow: hidden;
    transition: all 0.4s;
    cursor: default;
  }
  .pillar-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--saffron), transparent);
    transform: scaleX(0);
    transition: transform 0.4s;
  }
  .pillar-card:hover { background: rgba(212, 120, 10, 0.05); }
  .pillar-card:hover::after { transform: scaleX(1); }
  .pillar-icon {
    font-size: 48px;
    margin-bottom: 24px;
    display: block;
  }
  .pillar-num {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 4px;
    color: var(--saffron);
    margin-bottom: 12px;
    display: block;
  }
  .pillar-name {
    font-family: 'Cinzel', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--ivory);
    margin-bottom: 8px;
    letter-spacing: 1px;
  }
  .pillar-sanskrit {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    font-style: italic;
    color: var(--saffron);
    margin-bottom: 20px;
  }
  .pillar-desc {
    font-size: 14px;
    line-height: 1.8;
    color: var(--text-dim);
    margin-bottom: 28px;
  }
  .pillar-features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .pillar-features li {
    font-size: 13px;
    color: var(--text-light);
    padding-left: 16px;
    position: relative;
    letter-spacing: 0.3px;
  }
  .pillar-features li::before {
    content: '—';
    position: absolute;
    left: 0;
    color: var(--saffron);
  }

  /* ─── HOW IT WORKS ─── */
  .hiw-section {
    padding: 120px 60px;
    background: linear-gradient(180deg, var(--navy-mid) 0%, var(--navy) 100%);
  }
  .hiw-inner {
    max-width: 1200px;
    margin: 0 auto;
  }
  .hiw-header {
    text-align: center;
    margin-bottom: 80px;
  }
  .hiw-steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    position: relative;
  }
  .hiw-steps::before {
    content: '';
    position: absolute;
    top: 52px; left: 12.5%; right: 12.5%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212,120,10,0.3), rgba(212,120,10,0.3), transparent);
  }
  .hiw-step {
    padding: 0 24px;
    text-align: center;
  }
  .step-circle {
    width: 104px;
    height: 104px;
    border-radius: 50%;
    border: 1px solid rgba(212, 120, 10, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 28px;
    font-size: 36px;
    background: rgba(212, 120, 10, 0.06);
    transition: all 0.3s;
    position: relative;
    z-index: 2;
  }
  .hiw-step:hover .step-circle {
    border-color: var(--saffron);
    background: rgba(212, 120, 10, 0.12);
    box-shadow: 0 0 30px rgba(212, 120, 10, 0.15);
  }
  .step-num {
    font-family: 'Cinzel', serif;
    font-size: 10px;
    letter-spacing: 3px;
    color: var(--saffron);
    margin-bottom: 12px;
    display: block;
    text-transform: uppercase;
  }
  .step-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--ivory);
    margin-bottom: 12px;
  }
  .step-desc {
    font-size: 13px;
    color: var(--text-dim);
    line-height: 1.7;
  }

  /* ─── MOON ENGINE ─── */
  .moon-section {
    padding: 120px 60px;
    background: var(--navy-mid);
    position: relative;
    overflow: hidden;
  }
  .moon-section::before {
    content: 'चन्द्र';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Cormorant Garamond', serif;
    font-size: 300px;
    color: rgba(212, 120, 10, 0.03);
    pointer-events: none;
    white-space: nowrap;
  }
  .moon-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 100px;
    align-items: center;
  }
  .moon-left .section-title { margin-bottom: 20px; }
  .moon-left .lead {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    color: var(--text-light);
    line-height: 1.7;
    margin-bottom: 40px;
    font-style: italic;
  }
  .affliction-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .affliction-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px 20px;
    border: 1px solid rgba(212, 120, 10, 0.1);
    background: rgba(255,255,255,0.02);
    transition: all 0.3s;
  }
  .affliction-item:hover {
    border-color: rgba(212, 120, 10, 0.25);
    background: rgba(212, 120, 10, 0.04);
  }
  .aff-planet {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(212, 120, 10, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
    border: 1px solid rgba(212, 120, 10, 0.2);
  }
  .aff-content {}
  .aff-title {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    color: var(--saffron-light);
    margin-bottom: 4px;
    letter-spacing: 1px;
  }
  .aff-desc {
    font-size: 12px;
    color: var(--text-dim);
    line-height: 1.5;
  }
  .moon-right {
    position: relative;
  }
  .chart-mockup {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(212, 120, 10, 0.15);
    padding: 40px;
    position: relative;
  }
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(212, 120, 10, 0.1);
  }
  .chart-label {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 3px;
    color: var(--saffron);
  }
  .chart-badge {
    background: rgba(212, 120, 10, 0.15);
    border: 1px solid rgba(212, 120, 10, 0.3);
    padding: 4px 12px;
    font-size: 11px;
    color: var(--saffron-light);
    letter-spacing: 1px;
  }
  .chart-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }
  .chart-cell {
    background: rgba(255,255,255,0.02);
    padding: 14px 16px;
    border: 1px solid rgba(255,255,255,0.05);
  }
  .cell-key {
    font-size: 10px;
    letter-spacing: 1px;
    color: var(--text-dim);
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .cell-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    color: var(--ivory);
    font-weight: 500;
  }
  .cell-val span {
    font-size: 13px;
    color: var(--text-dim);
  }
  .affliction-warning {
    background: rgba(212, 120, 10, 0.08);
    border: 1px solid rgba(212, 120, 10, 0.25);
    border-left: 4px solid var(--saffron);
    padding: 16px 20px;
    margin-top: 4px;
  }
  .warning-title {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 2px;
    color: var(--saffron);
    margin-bottom: 8px;
  }
  .warning-text {
    font-size: 13px;
    color: var(--text-light);
    line-height: 1.6;
  }
  .insight-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 16px;
  }
  .tag {
    padding: 5px 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    font-size: 11px;
    color: var(--text-dim);
    letter-spacing: 0.5px;
  }

  /* ─── SHLOKA PREVIEW ─── */
  .shloka-section {
    padding: 120px 60px;
    background: linear-gradient(180deg, var(--navy) 0%, var(--navy-mid) 100%);
  }
  .shloka-inner {
    max-width: 1200px;
    margin: 0 auto;
  }
  .shloka-header {
    text-align: center;
    margin-bottom: 64px;
  }
  .shloka-filters {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-bottom: 48px;
    flex-wrap: wrap;
  }
  .filter-btn {
    padding: 8px 20px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    color: var(--text-dim);
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
  }
  .filter-btn.active, .filter-btn:hover {
    border-color: var(--saffron);
    color: var(--saffron-light);
    background: rgba(212, 120, 10, 0.06);
  }
  .shloka-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }
  .shloka-card {
    background: rgba(255,255,255,0.02);
    padding: 40px 32px;
    transition: all 0.3s;
    border: 1px solid transparent;
    cursor: pointer;
  }
  .shloka-card:hover {
    background: rgba(212, 120, 10, 0.05);
    border-color: rgba(212, 120, 10, 0.2);
  }
  .shloka-emotion {
    display: inline-block;
    padding: 4px 12px;
    background: rgba(212, 120, 10, 0.1);
    border: 1px solid rgba(212, 120, 10, 0.2);
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--saffron);
    text-transform: uppercase;
    font-family: 'Cinzel', serif;
    margin-bottom: 20px;
  }
  .shloka-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 19px;
    font-style: italic;
    color: var(--ivory);
    line-height: 1.7;
    margin-bottom: 16px;
  }
  .shloka-transliteration {
    font-size: 12px;
    color: var(--text-dim);
    line-height: 1.6;
    margin-bottom: 16px;
    font-style: italic;
  }
  .shloka-meaning {
    font-size: 13px;
    color: var(--text-light);
    line-height: 1.7;
    padding-top: 16px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .shloka-source {
    font-family: 'Cinzel', serif;
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--saffron);
    margin-top: 16px;
    display: block;
  }

  /* ─── FOUNDER ─── */
  .founder-section {
    padding: 120px 60px;
    background: var(--navy-mid);
  }
  .founder-inner {
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 80px;
    align-items: center;
  }
  .founder-portrait {
    width: 240px;
    height: 320px;
    background: linear-gradient(135deg, rgba(212,120,10,0.15) 0%, rgba(14,27,46,0.8) 100%);
    border: 1px solid rgba(212, 120, 10, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 16px;
    position: relative;
    flex-shrink: 0;
  }
  .founder-portrait::before {
    content: '';
    position: absolute;
    inset: 6px;
    border: 1px solid rgba(212, 120, 10, 0.1);
  }
  .portrait-icon { font-size: 72px; }
  .portrait-rating {
    font-family: 'Cinzel', serif;
    font-size: 14px;
    color: var(--saffron-light);
    letter-spacing: 2px;
  }
  .founder-content .section-tag { margin-bottom: 20px; }
  .founder-name {
    font-family: 'Cinzel', serif;
    font-size: 36px;
    font-weight: 600;
    color: var(--ivory);
    margin-bottom: 8px;
    letter-spacing: 2px;
  }
  .founder-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-style: italic;
    color: var(--saffron);
    margin-bottom: 28px;
  }
  .founder-bio {
    font-family: 'Cormorant Garamond', serif;
    font-size: 19px;
    font-weight: 300;
    line-height: 1.8;
    color: var(--text-light);
    margin-bottom: 36px;
  }
  .founder-credentials {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
  }
  .credential {
    text-align: center;
  }
  .cred-num {
    font-family: 'Cinzel', serif;
    font-size: 28px;
    color: var(--saffron-light);
    display: block;
    font-weight: 700;
  }
  .cred-label {
    font-size: 11px;
    letter-spacing: 1.5px;
    color: var(--text-dim);
    text-transform: uppercase;
    margin-top: 4px;
  }

  /* ─── CTA SECTION ─── */
  .cta-section {
    padding: 120px 60px;
    background: var(--navy);
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .cta-section::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212,120,10,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .cta-inner {
    max-width: 700px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  .cta-section .section-title { margin-bottom: 20px; }
  .cta-section .section-title em {
    font-style: italic;
    color: var(--saffron-light);
  }
  .cta-sub {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    color: var(--text-dim);
    font-style: italic;
    margin-bottom: 48px;
    line-height: 1.6;
  }
  .cta-btns {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 48px;
  }
  .cta-note {
    font-size: 12px;
    color: var(--text-dim);
    letter-spacing: 1px;
  }

  /* ─── FOOTER ─── */
  footer {
    background: rgba(0,0,0,0.4);
    border-top: 1px solid rgba(212, 120, 10, 0.1);
    padding: 48px 60px;
  }
  .footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .footer-logo {
    font-family: 'Cinzel', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--saffron-light);
    letter-spacing: 4px;
  }
  .footer-links {
    display: flex;
    gap: 32px;
    list-style: none;
  }
  .footer-links a {
    font-size: 12px;
    letter-spacing: 1.5px;
    color: var(--text-dim);
    text-decoration: none;
    text-transform: uppercase;
    transition: color 0.3s;
  }
  .footer-links a:hover { color: var(--saffron-light); }
  .footer-copy {
    font-size: 12px;
    color: rgba(168, 144, 112, 0.5);
    letter-spacing: 0.5px;
  }

  /* ─── SCROLL ANIMATIONS ─── */
  .reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 900px) {
    nav { padding: 16px 24px; }
    nav.scrolled { padding: 12px 24px; }
    .nav-links, .nav-cta { display: none; }
    .problem-inner, .moon-inner, .founder-inner { grid-template-columns: 1fr; gap: 48px; }
    .pillars-grid { grid-template-columns: 1fr; }
    .hiw-steps { grid-template-columns: 1fr 1fr; }
    .hiw-steps::before { display: none; }
    .shloka-cards { grid-template-columns: 1fr; }
    .hero-stats { max-width: 100%; margin-top: 36px; }
    .stat-num { font-size: 22px; }
    .stat-label { font-size: 9px; }
    .hero-content { padding: 0 24px; padding-top: 80px; }
    .problem-section, .pillars-section, .hiw-section, .moon-section, .shloka-section, .founder-section, .cta-section { padding: 80px 24px; }
    footer { padding: 40px 24px; }
    .footer-inner { flex-direction: column; gap: 20px; text-align: center; }
    .problem-stats-grid { grid-template-columns: 1fr 1fr; }
    .founder-inner { grid-template-columns: 1fr; }
    .founder-portrait { width: 100%; height: 200px; }
  }
`;

// Stars
function StarsCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      o: Math.random() * 0.6 + 0.1,
      speed: Math.random() * 0.3 + 0.05,
      phase: Math.random() * Math.PI * 2,
    }));
    let t = 0;
    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        const opacity = s.o * (0.7 + 0.3 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 200, 140, ${opacity})`;
        ctx.fill();
      });
      t += 0.02;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas id="stars-canvas" ref={ref} />;
}

// Reveal hook
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const shlokas = [
  {
    emotion: "Anxiety",
    text: "मन एव मनुष्याणां कारणं बन्धमोक्षयोः",
    transliteration: "Mana eva manuṣyāṇāṃ kāraṇaṃ bandhamokṣayoḥ",
    meaning: "The mind alone is the cause of both bondage and liberation for human beings.",
    source: "Amṛtabindu Upaniṣad · 2",
  },
  {
    emotion: "Grief",
    text: "नासतो विद्यते भावो नाभावो विद्यते सतः",
    transliteration: "Nāsato vidyate bhāvo nābhāvo vidyate sataḥ",
    meaning: "The unreal has no being; the real never ceases to be. The truth of both has been seen by seers.",
    source: "Bhagavad Gītā · 2.16",
  },
  {
    emotion: "Confusion",
    text: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्",
    transliteration: "Uddhareda ātmanā ātmānaṃ nātmānam avasādayet",
    meaning: "Let a person lift themselves by their own self; let them not allow the self to decline.",
    source: "Bhagavad Gītā · 6.5",
  },
];

const afflictions = [
  { planet: "♄", name: "Chandra–Shani", pattern: "Chronic melancholy, isolation, fear of loss", ayurveda: "Vata-Kapha", emoji: "🪐" },
  { planet: "☊", name: "Chandra–Rahu", pattern: "Obsessive anxiety, illusions, racing thoughts", ayurveda: "Vata aggravation", emoji: "🌀" },
  { planet: "☋", name: "Chandra–Ketu", pattern: "Emotional detachment, spiritual disorientation", ayurveda: "Vata-Prana", emoji: "🌑" },
  { planet: "♂", name: "Chandra–Mangal", pattern: "Emotional volatility, impulsive anger reactions", ayurveda: "Pitta aggravation", emoji: "🔥" },
];

export default function SattvaLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{FONTS + styles}</style>
      <StarsCanvas />

      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a className="nav-logo" href="#">SATTVA</a>
        <ul className="nav-links">
          {["The System", "Moon Engine", "Shlokas", "Consult"].map(l => (
            <li key={l}><a href="#">{l}</a></li>
          ))}
        </ul>
        <button className="nav-cta">Begin Your Chart</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="mandala-bg">
          <div className="mandala-ring" style={{ width: 400, height: 400 }} />
          <div className="mandala-ring" style={{ width: 650, height: 650 }} />
          <div className="mandala-ring" style={{ width: 900, height: 900 }} />
        </div>
        <div className="moon-orb" />
        <div className="hero-content">
          <div className="hero-tag">Indian Knowledge System · Mental Wellness</div>
          <div className="hero-title">
            <span className="glow">SATTVA</span>
          </div>
          <div className="hero-subtitle-sanskrit">सत्त्व — The Pure Mind</div>
          <p className="hero-subtitle">
            Where <em>Jyotisha</em> reveals your patterns, <em>Ayurveda</em> heals your constitution,
            and <em>Sanskrit wisdom</em> steadies your mind. Ancient India's complete science of mental wellness — made accessible.
          </p>
          <div className="hero-ctas">
            <button className="btn-primary">Discover Your Chart</button>
            <button className="btn-secondary">Explore the System</button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-num">197M</span>
              <span className="stat-label">Indians affected<br/>by mental illness</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">5000+</span>
              <span className="stat-label">Years of IKS<br/>mind science</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">83%</span>
              <span className="stat-label">Treatment gap —<br/>still unserved</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="problem-section">
        <div className="problem-inner">
          <div className="problem-left reveal">
            <span className="section-tag">The Crisis</span>
            <h2 className="section-title cormorant">
              India holds the answer.<br />
              <em style={{ color: "var(--saffron-light)", fontStyle: "italic" }}>The world just forgot to look.</em>
            </h2>
            <p>
              India's mental health epidemic is severe and structurally underserved.
              Modern therapy costs thousands, carries stigma, and speaks a cultural language
              that most Indians simply do not feel.
            </p>
            <p>
              Yet this same civilization produced the most complete science of mind and consciousness
              ever developed — Yoga, Ayurveda, Jyotisha, Vedanta. Not mythology. Testable frameworks.
            </p>
            <div className="problem-stats-grid">
              {[
                ["1 in 7", "Indians has a mental health condition"],
                ["0.3", "psychiatrists per 100,000 people"],
                ["₹0", "cost of 5,000 years of IKS wisdom, if you know where to look"],
                ["83%", "of those who need care never receive it"],
              ].map(([n, d]) => (
                <div className="crisis-card" key={n}>
                  <span className="crisis-num">{n}</span>
                  <div className="crisis-desc">{d}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="problem-right reveal">
            <div className="ancient-gap-box">
              <p>
                Chandra — the Moon — is Manas, the mind itself. Every ancient text agrees.
                When the Moon is afflicted, the mind suffers. When it is nourished, the mind flourishes.
                Your birth chart holds a map of your mental landscape that no Western framework can read.
              </p>
              <div className="attr">— Charaka Saṃhitā, on Manas and Chandra</div>
              <div className="gap-label">
                SATTVA bridges this gap — translating the precise planetary intelligence of Jyotisha,
                the healing protocols of Ayurveda, and the grounding wisdom of Sanskrit into a
                personalized mental wellness system built for the modern world.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="pillars-section">
        <div className="pillars-header reveal">
          <span className="section-tag">The Three Pillars</span>
          <h2 className="section-title cormorant">One system. Three ancient sciences.</h2>
          <p>Each pillar is complete. Together, they are transformative.</p>
        </div>
        <div className="pillars-grid">
          {[
            {
              icon: "🌙", num: "01", name: "Jyotisha", sanskrit: "ज्योतिष — Light Science",
              desc: "The science of planetary intelligence. Your birth chart is not fate — it is a precise map of your psychological architecture, emotional tendencies, and the timing of mental challenges.",
              features: ["Full Kundali with Lagna, Moon sign, Nakshatra", "Moon Affliction Engine — Saturn, Rahu, Ketu, Mars", "Dasha system — why this is happening now", "Transit-mood correlation with current sky"],
            },
            {
              icon: "🌿", num: "02", name: "Ayurveda", sanskrit: "आयुर्वेद — Science of Life",
              desc: "The oldest medical system on Earth maps your mind-body constitution (Prakriti) with extraordinary precision. Your Dosha profile reveals exactly which foods, herbs, and routines heal your specific nervous system.",
              features: ["Prakriti assessment — Vata, Pitta, Kapha mind type", "Dosha-Graha correlation (your chart meets your constitution)", "Personalized Dinacharya — daily healing routine", "Herbal & dietary protocols for your imbalance"],
            },
            {
              icon: "📿", num: "03", name: "Sanskrit Wisdom", sanskrit: "संस्कृत — Refined Language",
              desc: "Sanskrit is not a dead language — it is a living technology of consciousness. Shlokas are precision instruments tuned to specific emotional states. The right verse at the right moment rewires the mind.",
              features: ["Curated shloka library mapped to emotional states", "Sanskrit with transliteration, meaning & audio", "Personalized verse recommendations from your chart", "Mantra protocols matched to your planetary remedies"],
            },
          ].map((p, i) => (
            <div className="pillar-card reveal" key={p.name} style={{ transitionDelay: `${i * 0.15}s` }}>
              <span className="pillar-icon">{p.icon}</span>
              <span className="pillar-num">{p.num}</span>
              <div className="pillar-name cinzel">{p.name}</div>
              <div className="pillar-sanskrit cormorant">{p.sanskrit}</div>
              <p className="pillar-desc">{p.desc}</p>
              <ul className="pillar-features">
                {p.features.map(f => <li key={f}>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="hiw-section">
        <div className="hiw-inner">
          <div className="hiw-header reveal">
            <span className="section-tag">The Process</span>
            <h2 className="section-title cormorant">Four steps to your complete<br /><em style={{ fontStyle: "italic", color: "var(--saffron-light)" }}>IKS wellness portrait</em></h2>
          </div>
          <div className="hiw-steps">
            {[
              { icon: "🔮", step: "Step 01", title: "Enter Your Birth Details", desc: "Date, time, and place of birth. This unlocks your complete Kundali — the planetary blueprint of your mind." },
              { icon: "🌙", step: "Step 02", title: "Moon Analysis", desc: "We scan your Moon's sign, Nakshatra, house, and all planetary afflictions using our proprietary engine built on 450+ clinical observations." },
              { icon: "🌿", step: "Step 03", title: "Prakriti Bridge", desc: "Your chart is mapped to your Ayurvedic constitution. Your Dosha profile is not guessed — it is derived directly from your planetary signature." },
              { icon: "✨", step: "Step 04", title: "Your Wellness Plan", desc: "Personalized Dinacharya, herbs, planetary remedies, shlokas, and transit alerts — all calibrated to your unique mind-body-cosmos profile." },
            ].map((s, i) => (
              <div className="hiw-step reveal" key={s.step} style={{ transitionDelay: `${i * 0.15}s` }}>
                <div className="step-circle">{s.icon}</div>
                <span className="step-num">{s.step}</span>
                <div className="step-title cormorant">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOON ENGINE */}
      <section className="moon-section">
        <div className="moon-inner">
          <div className="moon-left reveal">
            <span className="section-tag">The Core Engine</span>
            <h2 className="section-title cormorant">The Moon<br />Affliction Engine</h2>
            <p className="lead cormorant">
              Built from 450+ real consultations. When Chandra is wounded, the mind suffers in precise, predictable ways. No other platform has mapped this.
            </p>
            <div className="affliction-list">
              {afflictions.map(a => (
                <div className="affliction-item" key={a.name}>
                  <div className="aff-planet">{a.emoji}</div>
                  <div className="aff-content">
                    <div className="aff-title cinzel">{a.name}</div>
                    <div className="aff-desc">{a.pattern} · Ayurveda: {a.ayurveda}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="moon-right reveal">
            <div className="chart-mockup">
              <div className="chart-header">
                <span className="chart-label cinzel">Sample Chart Analysis</span>
                <span className="chart-badge">Moon Afflicted</span>
              </div>
              <div className="chart-grid">
                {[
                  ["Lagna", "Vṛścika", "Scorpio Ascendant"],
                  ["Chandra", "Kumbha", "11th House"],
                  ["Nakshatra", "Śatabhiṣā", "Pada 2"],
                  ["Current Dasha", "Shani–Rahu", "2024–2027"],
                ].map(([k, v, s]) => (
                  <div className="chart-cell" key={k}>
                    <div className="cell-key">{k}</div>
                    <div className="cell-val cormorant">{v} <span>· {s}</span></div>
                  </div>
                ))}
              </div>
              <div className="affliction-warning">
                <div className="warning-title cinzel">⚠ Chandra Affliction Detected</div>
                <div className="warning-text">
                  Saturn aspects Moon from the 8th house. Rahu conjunct within 4°. This combination drives
                  chronic anxiety, social withdrawal, and existential unease — amplified sharply during Shani–Rahu Dasha (now active).
                </div>
                <div className="insight-tags">
                  {["Ashwagandha protocol", "Shankhpushpi", "Shani mantra", "Rahu remedies", "Vata-Kapha diet"].map(t => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHLOKA LIBRARY */}
      <section className="shloka-section">
        <div className="shloka-inner">
          <div className="shloka-header reveal">
            <span className="section-tag">The Shloka Sanctuary</span>
            <h2 className="section-title cormorant">Sanskrit verses, curated<br />for your emotional state</h2>
          </div>
          <div className="shloka-filters reveal">
            {["All", "Anxiety", "Grief", "Anger", "Confusion", "Detachment"].map(f => (
              <button
                key={f}
                className={`filter-btn ${activeFilter === f ? "active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >{f}</button>
            ))}
          </div>
          <div className="shloka-cards">
            {shlokas.map((s, i) => (
              <div className="shloka-card reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                <span className="shloka-emotion cinzel">{s.emotion}</span>
                <div className="shloka-text cormorant">{s.text}</div>
                <div className="shloka-transliteration">{s.transliteration}</div>
                <div className="shloka-meaning">{s.meaning}</div>
                <span className="shloka-source cinzel">{s.source}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="founder-section">
        <div className="founder-inner">
          <div className="founder-portrait reveal">
            <span className="portrait-icon">🪬</span>
            <div className="portrait-rating cinzel">★ 9.8 / 10</div>
          </div>
          <div className="founder-content reveal">
            <span className="section-tag">Built By A Practitioner</span>
            <div className="founder-name cinzel">Jyotishi & Founder</div>
            <div className="founder-title cormorant">Practicing Jyotisha Acharya · IKS Researcher</div>
            <p className="founder-bio cormorant">
              SATTVA was not built in a boardroom. It emerged from 450+ real consultations with people in genuine mental and emotional crisis — each one revealing the same truth: the Moon's afflictions were always speaking. Loudly. Nobody was listening with the right framework.
            </p>
            <p className="founder-bio cormorant" style={{ marginBottom: 0 }}>
              Every pattern in this system — every Dosha-Graha mapping, every shloka pairing, every remedy recommendation — has been tested against real human suffering and real healing. This is not textbook IKS. This is clinical IKS.
            </p>
            <div className="founder-credentials" style={{ marginTop: 36 }}>
              {[
                ["450+", "Consultations"],
                ["9.8 / 10", "Avg. Rating"],
                ["5+", "Years Practice"],
                ["3", "Ancient sciences unified"],
              ].map(([n, l]) => (
                <div className="credential" key={l}>
                  <span className="cred-num cinzel">{n}</span>
                  <div className="cred-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner reveal">
          <span className="section-tag">Begin</span>
          <h2 className="section-title cormorant">
            Your mind has a cosmic blueprint.<br />
            <em>It's time to read it.</em>
          </h2>
          <p className="cta-sub cormorant">
            Enter your birth details and receive a free Moon analysis —
            the most precise lens ancient India developed for understanding the mind.
          </p>
          <div className="cta-btns">
            <button className="btn-primary">Discover Your Chart — Free</button>
            <button className="btn-secondary">Book a Consultation</button>
          </div>
          <div className="cta-note">No account required · Your data is never sold · Rooted in 5,000 years of IKS</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-logo cinzel">SATTVA</div>
          <ul className="footer-links">
            {["The System", "Moon Engine", "Shloka Library", "Consult", "About"].map(l => (
              <li key={l}><a href="#">{l}</a></li>
            ))}
          </ul>
          <div className="footer-copy">© 2026 SATTVA · All rights reserved</div>
        </div>
      </footer>
    </>
  );
}