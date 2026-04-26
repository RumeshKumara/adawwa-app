/* ── Seeded RNG ── */
export function mkRng(seed: number) {
  let s = (seed ^ 0xdeadbeef) >>> 0;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 4294967295; };
}

/* ── Math helpers ── */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const prog = (t: number, s: number, e: number) => clamp((t - s) / (e - s));
export const easeOut = (t: number, p = 3) => 1 - (1 - t) ** p;
export const smoothstep = (t: number) => t * t * (3 - 2 * t);

/* ── Types ── */
export interface Star { nx: number; ny: number; r: number; base: number; amp: number; sp: number; ph: number }
export interface BatState { nx: number; ny: number; size: number; dx: number; dy: number; wp: number; wsp: number }
export interface Particle { x: number; y: number; vx: number; vy: number; r: number; life: number; ml: number }

/* ── Generators ── */
export function genStars(n: number): Star[] {
  const rng = mkRng(777);
  return Array.from({ length: n }, () => ({
    nx: rng(), ny: rng() * 0.62,
    r: rng() < 0.06 ? 1.8 + rng() * 1.2 : 0.3 + rng() * 1.2,
    base: 0.2 + rng() * 0.55, amp: 0.08 + rng() * 0.25,
    sp: 0.4 + rng() * 2.2, ph: rng() * Math.PI * 2,
  }));
}
export function genBats(n: number): BatState[] {
  const rng = mkRng(999);
  return Array.from({ length: n }, () => {
    const a = (rng() - 0.5) * 0.5;
    return { nx: 0.1 + rng() * 0.8, ny: 0.10 + rng() * 0.28, size: 0.016 + rng() * 0.020,
             dx: Math.cos(a) * (0.3 + rng() * 0.35), dy: (rng() - 0.5) * 0.12, wp: rng() * Math.PI * 2, wsp: 7 + rng() * 8 };
  });
}
export function spawnParticles(cx: number, cy: number, n: number): Particle[] {
  const rng = mkRng(555);
  return Array.from({ length: n }, () => {
    const a = rng() * Math.PI * 2; const sp = 0.5 + rng() * 1.4;
    return { x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.5, r: 1.5 + rng() * 2.5, life: 0, ml: 1.2 + rng() * 2.0 };
  });
}

/* ── Recursive fractal branch ── */
function branch(ctx: CanvasRenderingContext2D, x: number, y: number, a: number, l: number, w: number, d: number, rng: () => number) {
  if (d <= 0 || l < 2) return;
  const dev = rng() * 0.38 - 0.19;
  const ex = x + Math.cos(a) * l, ey = y + Math.sin(a) * l;
  const cpx = x + Math.cos(a + dev) * l * 0.52, cpy = y + Math.sin(a + dev) * l * 0.52;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(cpx, cpy, ex, ey);
  ctx.lineWidth = Math.max(0.5, w); ctx.lineCap = 'round'; ctx.strokeStyle = '#06020c'; ctx.stroke();
  const nb = rng() > 0.42 ? 3 : 2;
  for (let i = 0; i < nb; i++)
    branch(ctx, ex, ey, a + (rng() - 0.5) * (0.65 + 0.9 / d), l * (0.58 + rng() * 0.19), w * (0.61 + rng() * 0.12), d - 1, rng);
}

/* ── Build offscreen tree silhouette canvas ── */
export function buildTree(side: 'left' | 'right', W: number, H: number): HTMLCanvasElement {
  const tw = Math.round(W * 0.42);
  const oc = document.createElement('canvas'); oc.width = tw; oc.height = H;
  const ctx = oc.getContext('2d')!; ctx.clearRect(0, 0, tw, H);

  const isL = side === 'left';
  /* Solid dark mass */
  ctx.fillStyle = '#03000a';
  ctx.beginPath();
  if (isL) {
    ctx.moveTo(0, 0); ctx.lineTo(tw * 0.52, 0);
    ctx.bezierCurveTo(tw * 0.72, H * 0.04, tw * 0.88, H * 0.14, tw * 0.92, H * 0.26);
    ctx.bezierCurveTo(tw * 0.95, H * 0.40, tw * 0.90, H * 0.54, tw * 0.80, H * 0.65);
    ctx.bezierCurveTo(tw * 0.68, H * 0.74, tw * 0.55, H * 0.80, tw * 0.46, H * 0.90);
    ctx.lineTo(tw * 0.40, H); ctx.lineTo(0, H);
  } else {
    ctx.moveTo(tw, 0); ctx.lineTo(tw * 0.48, 0);
    ctx.bezierCurveTo(tw * 0.28, H * 0.04, tw * 0.12, H * 0.14, tw * 0.08, H * 0.26);
    ctx.bezierCurveTo(tw * 0.05, H * 0.40, tw * 0.10, H * 0.54, tw * 0.20, H * 0.65);
    ctx.bezierCurveTo(tw * 0.32, H * 0.74, tw * 0.45, H * 0.80, tw * 0.54, H * 0.90);
    ctx.lineTo(tw * 0.60, H); ctx.lineTo(tw, H);
  }
  ctx.closePath(); ctx.fill();

  /* Fractal trunks */
  const rng = mkRng(isL ? 12345 : 67890);
  const sign = isL ? 1 : -1;
  const ox = isL ? tw * 0.26 : tw * 0.74;
  const trunks = [
    { x: isL ? tw * 0.06 : tw * 0.94, y: H, a: -Math.PI / 2 + sign * 0.22, l: H * 0.60, w: 24 },
    { x: isL ? tw * 0.18 : tw * 0.82, y: H, a: -Math.PI / 2 + sign * 0.10, l: H * 0.64, w: 20 },
    { x: isL ? tw * 0.28 : tw * 0.72, y: H, a: -Math.PI / 2 + sign * 0.02, l: H * 0.54, w: 15 },
    { x: ox, y: H * 0.58, a: -Math.PI / 2 + sign * 0.44, l: H * 0.30, w: 11 },
  ];
  for (const t of trunks) branch(ctx, t.x, t.y, t.a, t.l, t.w, 7, rng);

  /* Solid edge gradient */
  const edgeX = isL ? 0 : tw * 0.82;
  const eg = ctx.createLinearGradient(isL ? 0 : tw, 0, isL ? tw * 0.18 : tw * 0.82, 0);
  eg.addColorStop(0, 'rgba(2,0,6,1)'); eg.addColorStop(1, 'rgba(2,0,6,0)');
  ctx.fillStyle = eg; ctx.fillRect(isL ? 0 : tw * 0.82, 0, tw * 0.18, H);

  return oc;
}

/* ══════════════════════════════════════════
   MAIN DRAW FRAME  (called every RAF tick)
══════════════════════════════════════════ */
export function drawFrame(
  ctx: CanvasRenderingContext2D, w: number, h: number, t: number,
  treeL: HTMLCanvasElement, treeR: HTMLCanvasElement,
  stars: Star[], bats: BatState[], particles: Particle[], dt: number
) {
  ctx.clearRect(0, 0, w, h);

  /* 1 – Sky */
  const skyA = clamp(t / 1.0);
  const sg = ctx.createRadialGradient(w / 2, 0, 0, w / 2, h * 0.5, h * 0.92);
  sg.addColorStop(0, `rgba(20,7,38,${skyA})`); sg.addColorStop(0.4, `rgba(10,4,20,${skyA})`);
  sg.addColorStop(1, `rgba(2,0,6,${skyA})`);
  ctx.fillStyle = sg; ctx.fillRect(0, 0, w, h);

  /* 2 – Stars */
  const starA = prog(t, 0.5, 2.0);
  if (starA > 0) {
    for (const s of stars) {
      const a = starA * (s.base + Math.sin(t * s.sp + s.ph) * s.amp);
      if (s.r > 1.4) {
        const g = ctx.createRadialGradient(s.nx * w, s.ny * h, 0, s.nx * w, s.ny * h, s.r * 3.5);
        g.addColorStop(0, `rgba(255,240,210,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s.nx * w, s.ny * h, s.r * 3.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.beginPath(); ctx.arc(s.nx * w, s.ny * h, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,242,215,${a})`; ctx.fill();
    }
  }

  /* 3 – Moon */
  const moonA = easeOut(prog(t, 2.0, 4.2));
  if (moonA > 0.01) {
    const mx = w * 0.50, my = h * (0.40 - moonA * 0.18);
    const r = Math.min(w * 0.13, h * 0.20, 130);
    /* Corona layers */
    for (let i = 3; i >= 0; i--) {
      const cr = r * (2.6 + i * 1.1), ca = moonA * [0.05, 0.07, 0.06, 0.04][i];
      const g = ctx.createRadialGradient(mx, my, r * 0.4, mx, my, cr);
      g.addColorStop(0, `rgba(240,100,10,${ca})`); g.addColorStop(0.5, `rgba(160,40,0,${ca * 0.5})`); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mx, my, cr, 0, Math.PI * 2); ctx.fill();
    }
    /* Disk */
    const dg = ctx.createRadialGradient(mx - r * 0.22, my - r * 0.22, 0, mx, my, r);
    dg.addColorStop(0, `rgba(255,230,130,${moonA})`); dg.addColorStop(0.18, `rgba(255,185,55,${moonA})`);
    dg.addColorStop(0.42, `rgba(235,110,18,${moonA})`); dg.addColorStop(0.65, `rgba(175,58,0,${moonA})`);
    dg.addColorStop(0.87, `rgba(90,18,0,${moonA})`); dg.addColorStop(1, `rgba(32,4,0,${moonA})`);
    ctx.beginPath(); ctx.arc(mx, my, r, 0, Math.PI * 2); ctx.fillStyle = dg; ctx.fill();
    /* Craters + limb darkening */
    ctx.save(); ctx.beginPath(); ctx.arc(mx, my, r, 0, Math.PI * 2); ctx.clip();
    const limb = ctx.createRadialGradient(mx + r * 0.28, my + r * 0.28, 0, mx + r * 0.28, my + r * 0.28, r * 1.15);
    limb.addColorStop(0, `rgba(0,0,0,${moonA * 0.44})`); limb.addColorStop(0.55, 'rgba(0,0,0,0)');
    ctx.fillStyle = limb; ctx.fillRect(mx - r, my - r, r * 2, r * 2);
    for (const c of [[-0.28,-0.30,0.11],[0.22,-0.14,0.08],[-0.10,0.24,0.065],[0.30,0.18,0.09],[-0.42,0.08,0.06],[0.08,-0.42,0.07]]) {
      const cg = ctx.createRadialGradient(mx+c[0]*r, my+c[1]*r, 0, mx+c[0]*r, my+c[1]*r, c[2]*r);
      cg.addColorStop(0.4, `rgba(0,0,0,${moonA*0.22})`); cg.addColorStop(1, `rgba(255,140,40,${moonA*0.04})`);
      ctx.beginPath(); ctx.arc(mx+c[0]*r, my+c[1]*r, c[2]*r, 0, Math.PI*2); ctx.fillStyle = cg; ctx.fill();
    }
    ctx.restore();
  }

  /* 4 – Far mountains */
  const farP = easeOut(prog(t, 2.4, 4.8));
  if (farP > 0.01) {
    ctx.save(); ctx.filter = 'blur(4px)';
    const fg = ctx.createLinearGradient(0, h*0.34, 0, h*0.65);
    fg.addColorStop(0, `rgba(30,14,48,${farP*0.52})`); fg.addColorStop(1, `rgba(10,4,16,${farP*0.52})`);
    ctx.beginPath(); ctx.moveTo(0,h);
    ctx.bezierCurveTo(w*0.1,h*0.62, w*0.22,h*0.50, w*0.30,h*0.44);
    ctx.bezierCurveTo(w*0.38,h*0.38, w*0.46,h*0.41, w*0.50,h*0.37);
    ctx.bezierCurveTo(w*0.55,h*0.40, w*0.63,h*0.38, w*0.72,h*0.44);
    ctx.bezierCurveTo(w*0.82,h*0.50, w*0.90,h*0.60, w,h*0.64);
    ctx.lineTo(w,h); ctx.closePath(); ctx.fillStyle = fg; ctx.fill(); ctx.restore();
  }

  /* 5 – Main peak */
  const peakP = easeOut(prog(t, 3.2, 5.2));
  if (peakP > 0.01) {
    const pg = ctx.createLinearGradient(0, h*0.24, 0, h*0.80);
    pg.addColorStop(0, `rgba(36,18,52,${peakP*0.94})`); pg.addColorStop(0.3, `rgba(20,10,32,${peakP})`);
    pg.addColorStop(1, `rgba(4,1,8,${peakP})`);
    ctx.beginPath(); ctx.moveTo(0,h); ctx.lineTo(0,h*0.72);
    ctx.bezierCurveTo(w*0.08,h*0.65, w*0.18,h*0.60, w*0.30,h*0.56);
    ctx.bezierCurveTo(w*0.40,h*0.52, w*0.45,h*0.46, w*0.48,h*0.40);
    ctx.lineTo(w*0.50, h*0.25); ctx.lineTo(w*0.52, h*0.40);
    ctx.bezierCurveTo(w*0.55,h*0.46, w*0.60,h*0.52, w*0.70,h*0.56);
    ctx.bezierCurveTo(w*0.82,h*0.60, w*0.92,h*0.65, w,h*0.72);
    ctx.lineTo(w,h); ctx.closePath(); ctx.fillStyle = pg; ctx.fill();
    /* Snow cap */
    ctx.save(); ctx.beginPath();
    ctx.moveTo(w*0.455,h*0.36); ctx.lineTo(w*0.50,h*0.25); ctx.lineTo(w*0.545,h*0.36);
    ctx.lineTo(w*0.52,h*0.33); ctx.lineTo(w*0.50,h*0.37); ctx.lineTo(w*0.48,h*0.33); ctx.closePath();
    const scg = ctx.createLinearGradient(w*0.455,h*0.25, w*0.545,h*0.36);
    scg.addColorStop(0, `rgba(238,225,255,${peakP*0.95})`); scg.addColorStop(1, `rgba(130,105,170,${peakP*0.45})`);
    ctx.fillStyle = scg; ctx.fill();
    ctx.beginPath(); ctx.moveTo(w*0.50,h*0.25); ctx.lineTo(w*0.545,h*0.36); ctx.lineTo(w*0.515,h*0.34); ctx.closePath();
    ctx.fillStyle = `rgba(38,14,58,${peakP*0.42})`; ctx.fill(); ctx.restore();
  }

  /* 6 – Mist layers */
  const mistP = smoothstep(prog(t, 3.5, 5.5));
  if (mistP > 0) {
    for (const ml of [{y:0.70,h:0.20,a:0.50,f:0.9,dr:0.28,ph:0.0},{y:0.75,h:0.16,a:0.42,f:1.3,dr:0.38,ph:1.8},{y:0.80,h:0.13,a:0.62,f:0.7,dr:0.55,ph:3.2},{y:0.85,h:0.12,a:0.80,f:1.5,dr:0.18,ph:0.9}]) {
      const mg = ctx.createLinearGradient(0, h*ml.y, 0, h*(ml.y+ml.h));
      mg.addColorStop(0, `rgba(42,16,62,${mistP*ml.a})`); mg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.moveTo(-w*0.05, h*(ml.y+ml.h));
      for (let i = 0; i <= 28; i++) {
        const nx = i/28;
        ctx.lineTo(lerp(-w*0.05,w*1.05,nx), h*ml.y + Math.sin(nx*Math.PI*ml.f*2+t*ml.dr+ml.ph)*h*0.013);
      }
      ctx.lineTo(w*1.05,h*(ml.y+ml.h)); ctx.closePath(); ctx.fillStyle = mg; ctx.fill();
    }
  }

  /* 7 – Treasure chest */
  const chestA = easeOut(prog(t, 3.2, 5.0));
  const glowA  = easeOut(prog(t, 6.2, 8.0));
  const openA  = easeOut(prog(t, 6.5, 8.2));
  if (chestA > 0.01) {
    const cx = w*0.50, cy = h*0.645, cs = Math.min(w*0.044,36);
    ctx.save(); ctx.globalAlpha = chestA;
    if (glowA > 0) {
      const gg = ctx.createRadialGradient(cx,cy,0,cx,cy,cs*5);
      gg.addColorStop(0,`rgba(255,210,40,${glowA*0.75})`); gg.addColorStop(0.4,`rgba(255,130,10,${glowA*0.35})`); gg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(cx,cy,cs*5,0,Math.PI*2); ctx.fill();
    }
    /* Body */
    ctx.fillStyle = glowA>0 ? '#522000' : '#321400';
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(cx-cs,cy,cs*2,cs*1.4,4); else ctx.rect(cx-cs,cy,cs*2,cs*1.4); ctx.fill();
    ctx.strokeStyle='#9a5e0e'; ctx.lineWidth=1.2;
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(cx-cs,cy,cs*2,cs*1.4,4); else ctx.rect(cx-cs,cy,cs*2,cs*1.4); ctx.stroke();
    ctx.fillStyle='#b87010'; ctx.fillRect(cx-cs,cy+cs*0.36,cs*2,cs*0.22);
    ctx.fillStyle='#dfa018'; ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(cx-cs*0.22,cy+cs*0.50,cs*0.44,cs*0.30,3); else ctx.rect(cx-cs*0.22,cy+cs*0.50,cs*0.44,cs*0.30); ctx.fill();
    ctx.fillStyle='#ffd030'; ctx.beginPath(); ctx.arc(cx,cy+cs*0.66,cs*0.10,0,Math.PI*2); ctx.fill();
    /* Lid */
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(-openA*0.88);
    ctx.fillStyle = glowA>0 ? '#6a2e00' : '#3e1c00';
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-cs,-cs*0.76,cs*2,cs*0.80,[4,4,0,0]); else ctx.rect(-cs,-cs*0.76,cs*2,cs*0.80); ctx.fill();
    ctx.strokeStyle='#a06012'; ctx.lineWidth=1.2;
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-cs,-cs*0.76,cs*2,cs*0.80,[4,4,0,0]); else ctx.rect(-cs,-cs*0.76,cs*2,cs*0.80); ctx.stroke();
    ctx.fillStyle='#b87010'; ctx.fillRect(-cs,-cs*0.40,cs*2,cs*0.20);
    if (glowA > 0) {
      const ig = ctx.createRadialGradient(0,0,0,0,0,cs);
      ig.addColorStop(0,`rgba(255,240,80,${glowA*0.92})`); ig.addColorStop(0.5,`rgba(255,160,20,${glowA*0.5})`); ig.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=ig; ctx.fillRect(-cs,-cs*0.76,cs*2,cs*0.76);
    }
    ctx.restore(); ctx.restore();
  }

  /* 8 – Light rays */
  const rayA = prog(t, 6.8, 8.5);
  if (rayA > 0.01) {
    const rx=w*0.50, ry=h*0.625;
    ctx.save(); ctx.globalAlpha = rayA * 0.75;
    for (let i=0; i<20; i++) {
      const a = (i/20)*Math.PI*2 - Math.PI/2 + Math.sin(t*1.2+i)*0.05;
      const rl = Math.min(w,h)*(0.28+(i%4)*0.07);
      const rg = ctx.createLinearGradient(rx,ry,rx+Math.cos(a)*rl,ry+Math.sin(a)*rl);
      rg.addColorStop(0,`rgba(255,225,55,${0.5+Math.sin(t*2+i)*0.12})`);
      rg.addColorStop(0.55,'rgba(255,150,15,0.18)'); rg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.moveTo(rx,ry); ctx.lineTo(rx+Math.cos(a)*rl,ry+Math.sin(a)*rl);
      ctx.strokeStyle=rg; ctx.lineWidth=2.5+(i%4)*0.8; ctx.stroke();
    }
    ctx.restore();
  }

  /* 9 – Particles */
  for (const p of particles) {
    p.life += dt; p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 0.28*dt;
    const pf = 1 - p.life/p.ml;
    if (pf > 0) {
      const pg = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*2.5);
      pg.addColorStop(0,`rgba(255,235,60,${pf})`); pg.addColorStop(1,'rgba(255,100,0,0)');
      ctx.fillStyle=pg; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*2.5,0,Math.PI*2); ctx.fill();
    }
  }

  /* 10 – Bats */
  const batA = prog(t, 5.0, 6.8);
  if (batA > 0.01) {
    const elapsed = t - 5.0;
    for (const bat of bats) {
      const bx = (((bat.nx + bat.dx*elapsed*0.075) % 1.3 + 1.3) % 1.3 - 0.15) * w;
      const by = (bat.ny + bat.dy*elapsed*0.05) * h;
      const bs = bat.size * Math.min(w,h);
      const wf = Math.sin(t*bat.wsp+bat.wp)*0.4+0.6;
      ctx.save(); ctx.globalAlpha = Math.min(1,batA*2); ctx.fillStyle='#060110';
      /* Left wing */
      ctx.beginPath(); ctx.moveTo(bx,by);
      ctx.bezierCurveTo(bx-bs*0.5,by-bs*0.7*wf,bx-bs*0.95,by+bs*0.15*wf,bx-bs,by+bs*0.22);
      ctx.bezierCurveTo(bx-bs*0.7,by+bs*0.08,bx-bs*0.38,by-bs*0.08,bx,by); ctx.fill();
      /* Right wing */
      ctx.beginPath(); ctx.moveTo(bx,by);
      ctx.bezierCurveTo(bx+bs*0.5,by-bs*0.7*wf,bx+bs*0.95,by+bs*0.15*wf,bx+bs,by+bs*0.22);
      ctx.bezierCurveTo(bx+bs*0.7,by+bs*0.08,bx+bs*0.38,by-bs*0.08,bx,by); ctx.fill();
      /* Body + head */
      ctx.beginPath(); ctx.ellipse(bx,by,bs*0.13,bs*0.20,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(bx,by-bs*0.17,bs*0.09,bs*0.11,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }
  }

  /* 11 – Trees (on top of scene) */
  const treeA = prog(t, 1.2, 3.0);
  if (treeA > 0.01) {
    const sl = easeOut(treeA, 3); const tw = treeL.width;
    ctx.drawImage(treeL, lerp(-tw, 0, sl), 0);
    ctx.drawImage(treeR, w - lerp(-tw, 0, sl), 0);
    /* Top arch */
    const archY = lerp(-h*0.28, 0, sl);
    const ag = ctx.createLinearGradient(0,archY,0,archY+h*0.26);
    ag.addColorStop(0,'rgba(2,0,6,1)'); ag.addColorStop(0.8,'rgba(3,0,8,0.90)'); ag.addColorStop(1,'rgba(3,0,8,0)');
    ctx.fillStyle=ag; ctx.beginPath(); ctx.ellipse(w/2,archY-h*0.03,w*0.44,h*0.28,0,0,Math.PI*2); ctx.fill();
    /* Ground strip */
    const gg2=ctx.createLinearGradient(0,h*0.88,0,h);
    gg2.addColorStop(0,'rgba(2,0,6,0)'); gg2.addColorStop(0.5,'rgba(2,0,6,0.88)'); gg2.addColorStop(1,'rgba(2,0,6,1)');
    ctx.fillStyle=gg2; ctx.fillRect(0,h*0.88,w,h*0.12);
  }

  /* 12 – Vignette */
  const vg = ctx.createRadialGradient(w/2,h/2,h*0.12,w/2,h/2,h*0.72);
  vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(0.55,'rgba(0,0,0,0.08)'); vg.addColorStop(1,'rgba(0,0,0,0.74)');
  ctx.fillStyle=vg; ctx.fillRect(0,0,w,h);

  /* 13 – Letterbox */
  const lb=h*0.065; ctx.fillStyle='#000'; ctx.fillRect(0,0,w,lb); ctx.fillRect(0,h-lb,w,lb);

  /* 14 – Flash */
  const flashA = easeOut(prog(t, 9.0, 10.2));
  if (flashA > 0.01) {
    const fg2=ctx.createRadialGradient(w/2,h*0.64,0,w/2,h*0.64,h*0.75);
    fg2.addColorStop(0,`rgba(255,252,200,${flashA})`); fg2.addColorStop(0.35,`rgba(255,220,55,${flashA*0.9})`);
    fg2.addColorStop(0.7,`rgba(255,130,10,${flashA*0.45})`); fg2.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=fg2; ctx.fillRect(0,0,w,h);
    if (flashA > 0.72) { ctx.fillStyle=`rgba(255,252,220,${(flashA-0.72)*3.57})`; ctx.fillRect(0,0,w,h); }
  }
}
