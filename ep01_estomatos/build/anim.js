// O AGRO QUE VOCÊ NÃO VÊ — "O segredo das pequenas bocas das plantas"
// Procedural renderer: render(t) draws one 1080x1920 frame at time t (seconds).
const W = 1080, H = 1920;
const MAIN = document.getElementById('c'); MAIN.width = W; MAIN.height = H;
const mctx = MAIN.getContext('2d');
let ctx = mctx;
const BUF = document.createElement('canvas'); BUF.width = W; BUF.height = H;
const bctx = BUF.getContext('2d');
const IMG = {}, PAT = {};

// ---------- utils ----------
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ss = (a, b, x) => { x = cl((x - a) / (b - a)); return x * x * (3 - 2 * x); };
const eio = x => { x = cl(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lerp = (a, b, k) => a + (b - a) * k;
const elerp = (a, b, k) => Math.exp(lerp(Math.log(a), Math.log(b), k));
function rng(s) { return () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hash(a, b) { let h = Math.imul(a * 374761393 + b * 668265263 | 0, 1274126177); h ^= h >>> 13; return ((Math.imul(h, 1103515245) >>> 0) % 10000) / 10000; }
function hex(h) { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
function mix(a, b, k) { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * cl(k))).join(',')})`; }
function mixh(a, b, k) { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * cl(k)).toString(16).padStart(2, '0')).join(''); }
function mk(w, h, f) { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), c); return c; }
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function inBuf(fn) { const o = ctx; ctx = bctx; bctx.setTransform(1, 0, 0, 1, 0, 0); bctx.globalAlpha = 1; bctx.globalCompositeOperation = 'source-over'; bctx.clearRect(0, 0, W, H); fn(); ctx = o; }
function xfade(a, fn) { if (a <= 0.001) return; if (a >= 0.999) { fn(); return; } inBuf(fn); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(BUF, 0, 0); ctx.restore(); }

// ---------- sprites ----------
function glowSpr(rgb) { return mk(128, 128, g => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(.22, `rgba(${rgb},.5)`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }); }
const GOLD = glowSpr('255,212,115'), WHITE = glowSpr('255,250,235'), BLUE = glowSpr('110,195,255'), TEAL = glowSpr('80,230,210'),
  ORANGE = glowSpr('255,140,50'), VIOLET = glowSpr('200,110,255'), GREEN = glowSpr('150,255,110'), YEL = glowSpr('255,225,80');
function glow(s, x, y, r, a) { if (a <= 0.003 || r <= 0) return; const op = ctx.globalCompositeOperation, ga = ctx.globalAlpha; ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, a) * ga; ctx.drawImage(s, x - r, y - r, 2 * r, 2 * r); ctx.globalAlpha = ga; ctx.globalCompositeOperation = op; }
function bokehSpr(rgb) { return mk(128, 128, g => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 63); gr.addColorStop(0, `rgba(${rgb},.30)`); gr.addColorStop(.78, `rgba(${rgb},.42)`); gr.addColorStop(.9, `rgba(${rgb},.55)`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }); }
const BK_GOLD = bokehSpr('255,210,120'), BK_TEAL = bokehSpr('90,230,200'), BK_GREEN = bokehSpr('170,240,110');
function sphere(base, hi, dark) { return mk(128, 128, g => { const gr = g.createRadialGradient(44, 40, 3, 64, 64, 63); gr.addColorStop(0, hi); gr.addColorStop(.38, base); gr.addColorStop(1, dark); g.fillStyle = gr; g.beginPath(); g.arc(64, 64, 62, 0, 7); g.fill(); }); }
const SO = sphere('#e0453a', '#ffd8c8', '#4a0a08'), SC = sphere('#3c4248', '#d0d8e0', '#08090b'), SH = sphere('#e8eef2', '#ffffff', '#6a7a86'), SK = sphere('#f2c230', '#fff8c8', '#6a4206');
function sph(s, x, y, r) { ctx.drawImage(s, x - r, y - r, 2 * r, 2 * r); }
function rod(x1, y1, x2, y2, w) { ctx.strokeStyle = 'rgba(225,232,238,.9)'; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function mol(type, x, y, s, a, al = 1) {
  if (al <= 0.01 || s <= 0.5) return; ctx.save(); ctx.globalAlpha = cl(al); const c = Math.cos(a), n = Math.sin(a);
  if (type == 'co2') { const d = 1.85 * s; rod(x - c * d, y - n * d, x + c * d, y + n * d, s * .42); sph(SO, x - c * d, y - n * d, s); sph(SO, x + c * d, y + n * d, s); sph(SC, x, y, s * .86); }
  else if (type == 'o2') { const d = .82 * s; rod(x - c * d, y - n * d, x + c * d, y + n * d, s * .5); sph(SO, x - c * d, y - n * d, s); sph(SO, x + c * d, y + n * d, s); }
  else { const d = 1.1 * s, b1 = a + Math.PI / 2 + .91, b2 = a + Math.PI / 2 - .91; const h1 = [x + Math.cos(b1) * d, y + Math.sin(b1) * d], h2 = [x + Math.cos(b2) * d, y + Math.sin(b2) * d];
    rod(x, y, h1[0], h1[1], s * .32); rod(x, y, h2[0], h2[1], s * .32); sph(SH, h1[0], h1[1], s * .58); sph(SH, h2[0], h2[1], s * .58); sph(SO, x, y, s); }
  ctx.restore();
}
function hexRing(x, y, r, a, al) { if (al <= .01) return; ctx.save(); ctx.globalAlpha = al; glow(GOLD, x, y, r * 2.6, .6); ctx.strokeStyle = '#fff4c8'; ctx.lineWidth = r * .22; ctx.lineJoin = 'round'; ctx.beginPath();
  for (let i = 0; i < 6; i++) { const q = a + i * Math.PI / 3; ctx.lineTo(x + Math.cos(q) * r, y + Math.sin(q) * r); } ctx.closePath(); ctx.stroke();
  ctx.fillStyle = '#ffd35a'; for (let i = 0; i < 6; i++) { const q = a + i * Math.PI / 3; ctx.beginPath(); ctx.arc(x + Math.cos(q) * r, y + Math.sin(q) * r, r * .2, 0, 7); ctx.fill(); } ctx.restore(); }

// ---------- leaflets / plants ----------
function leafletPath(g, len, w) { g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(len * .22, -w * 1.25, len * .72, -w * .95, len, 0); g.bezierCurveTo(len * .72, w * .95, len * .22, w * 1.25, 0, 0); }
function leaflet(g, x, y, len, ang, c1, c2, rim, wid = 1) {
  const w = len * .3 * wid; g.save(); g.translate(x, y); g.rotate(ang); leafletPath(g, len, w);
  const gr = g.createLinearGradient(0, -w, 0, w); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fill();
  g.strokeStyle = 'rgba(230,255,190,.35)'; g.lineWidth = Math.max(.6, len * .025); g.beginPath(); g.moveTo(0, 0); g.lineTo(len * .93, 0); g.stroke();
  if (rim) { g.strokeStyle = rim; g.lineWidth = Math.max(.8, len * .03); g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(len * .22, -w * 1.25, len * .72, -w * .95, len, 0); g.stroke(); }
  g.restore();
}
function plantSprite(seed, p) {
  return mk(256, 256, g => { const r = rng(seed);
    g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(128, 222, 90, 16, 0, 0, 7); g.fill();
    for (let i = 0; i < 30; i++) { const ang = -Math.PI / 2 + (r() - .5) * 2.5; const d = 25 + r() * 78; const x = 128 + Math.cos(ang) * d * 1.1, y = 215 + Math.sin(ang) * d * 1.3;
      const len = 30 + r() * 20, base = ang + (r() - .5) * .6 + p.droop * (Math.PI / 2 - ang) * .5;
      const c1 = mix(p.a, p.b, r() * .6), c2 = mix(p.b, p.dk, .4 + r() * .6);
      for (let j = -1; j <= 1; j++) leaflet(g, x, y, len * (j ? .85 : 1), base + j * .8, c1, c2, r() < .7 ? p.rim : null, p.wid); }
  });
}
// big procedural soybean plant, returns stem nodes and leaf tips
function soyPlant(x, base, sc, h, t, seed, rimCol) {
  const r = rng(seed), nodes = [], n = 7, droop = 1 - h, tips = [];
  for (let i = 0; i <= n; i++) { const k = i / n; nodes.push([x + Math.sin(t * 1.1 + seed) * 5 * k + droop * k * k * 55 * sc + (r() - .5) * 8 * sc, base - k * 420 * sc * (.82 + .18 * h)]); }
  ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(x, base + 6, 150 * sc, 22 * sc, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = mix('#4f8a2a', '#8a7a3a', droop); ctx.lineCap = 'round'; ctx.lineWidth = 13 * sc;
  ctx.beginPath(); ctx.moveTo(nodes[0][0], nodes[0][1]); for (let i = 1; i <= n; i++) ctx.lineTo(nodes[i][0], nodes[i][1]); ctx.stroke();
  const c1 = mixh('#9be060', '#d8bf5a', droop), c2 = mixh('#2f7a22', '#80631e', droop);
  for (let i = 1; i <= n; i++) {
    const side = i % 2 ? 1 : -1, [nx, ny] = nodes[i]; const pl = (95 + r() * 35) * sc * (1 - i / n * .3);
    let pa = -Math.PI / 2 + side * (1.0 + r() * .3) + droop * side * .9 + Math.sin(t * 1.4 + i) * .04;
    const ex = nx + Math.cos(pa) * pl, ey = ny + Math.sin(pa) * pl;
    ctx.strokeStyle = mix('#5a9a30', '#8a7a3a', droop); ctx.lineWidth = 5 * sc; ctx.beginPath(); ctx.moveTo(nx, ny); ctx.quadraticCurveTo(lerp(nx, ex, .5), lerp(ny, ey, .5) - 15 * sc, ex, ey); ctx.stroke();
    if (h > .45 && i < n - 1) { for (let q = 0; q < 3; q++) { ctx.save(); ctx.translate(nx + side * (8 + q * 7) * sc, ny + (10 + q * 4) * sc); ctx.rotate(side * (.5 + q * .25)); ctx.fillStyle = '#8fbf4a'; ctx.beginPath(); ctx.ellipse(0, 22 * sc, 7 * sc, 24 * sc, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(240,230,180,.5)'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore(); } }
    for (let j = -1; j <= 1; j++) {
      let la = pa + j * .85; la = lerp(la, Math.PI / 2 + side * .3, droop * .55);
      const len = 105 * sc * (.75 + .25 * h) * (j ? .88 : 1);
      leaflet(ctx, ex, ey, len, la, mix(c1, c2, r() * .4), c2, rimCol, .55 + .45 * h);
      tips.push([ex + Math.cos(la) * len * .5, ey + Math.sin(la) * len * .5]);
    }
  }
  return { nodes, tips };
}

// ---------- palettes ----------
const PAL = {
  rise: { sky: ['#1d2b55', '#5a4a7a', '#e0875a', '#ffc874', '#ffe6a8'], hill: ['rgba(90,70,100,.5)', 'rgba(50,75,50,.75)'], g0: '#b89a52', g1: '#4a7428', g2: '#1a3510', haze: '255,212,150' },
  set: { sky: ['#22163d', '#5e2c5c', '#c9506a', '#ff944a', '#ffd27a'], hill: ['rgba(110,50,90,.5)', 'rgba(60,45,40,.8)'], g0: '#c08048', g1: '#4a5222', g2: '#18230c', haze: '255,165,95' },
  dry: { sky: ['#efe2bc', '#f6e4b4', '#fbe0a0', '#f4c27a', '#eeb062'], hill: ['rgba(175,145,95,.5)', 'rgba(150,118,70,.6)'], haze: '250,226,175' },
};
const SPR = {};

// ---------- field ----------
function soilGround(hy, cz) {
  ctx.fillStyle = '#7a5a34'; ctx.fillRect(0, hy, W, H - hy); const n = 64;
  for (let i = 0; i < n; i++) {
    const y0 = hy + (H - hy) * Math.pow(i / n, 1.8), y1 = hy + (H - hy) * Math.pow((i + 1) / n, 1.8), yc = (y0 + y1) / 2, k = Math.max(.02, (yc - hy) / 700);
    ctx.save(); ctx.beginPath(); ctx.rect(0, y0, W, y1 - y0 + 1); ctx.clip(); ctx.translate(540, yc); ctx.scale(k, k * .42);
    const z = 1000 * 1.6 / (yc - hy + 1); ctx.translate(0, -(z + cz) * 260); ctx.fillStyle = PAT.soil; const ww = 640 / k; ctx.fillRect(-ww, (z + cz) * 260 - 3000, 2 * ww, 6000); ctx.restore();
  }
}
function drawField(t, o) {
  const hy = o.hy, F = 1000; let g = ctx.createLinearGradient(0, 0, 0, hy);
  o.pal.sky.forEach((c, i) => g.addColorStop(i / (o.pal.sky.length - 1), c)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, hy + 2);
  const [sx, sy] = o.sun; glow(o.sunCol || ORANGE, sx, sy, 950, .55); glow(GOLD, sx, sy, 480, .9); glow(WHITE, sx, sy, 150, 1); glow(WHITE, sx, sy, 60, 1);
  // god rays
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * .33 + Math.sin(t * .2 + i) * .03, w = .05 + .03 * Math.sin(i * 7.1); const gr = ctx.createRadialGradient(sx, sy, 0, sx, sy, 1600); gr.addColorStop(0, `rgba(${o.pal.haze},.16)`); gr.addColorStop(1, `rgba(${o.pal.haze},0)`); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(a - w) * 1800, sy + Math.sin(a - w) * 1800); ctx.lineTo(sx + Math.cos(a + w) * 1800, sy + Math.sin(a + w) * 1800); ctx.fill(); }
  ctx.restore();
  // hills
  o.pal.hill.forEach((c, li) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, hy + 2); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, hy - (li ? 18 : 42) - Math.sin(x * .004 + li * 2 + o.camX * .2) * (li ? 10 : 22) - Math.sin(x * .013 + li) * 8); ctx.lineTo(W, hy + 2); ctx.fill(); });
  if (o.dry) soilGround(hy, o.cz); else { g = ctx.createLinearGradient(0, hy, 0, H); g.addColorStop(0, o.pal.g0); g.addColorStop(.18, o.pal.g1); g.addColorStop(1, o.pal.g2); ctx.fillStyle = g; ctx.fillRect(0, hy, W, H - hy); }
  const rows = o.dry ? 9 : 16, sp = o.dry ? .55 : .26, rs = o.dry ? .9 : .55, spr = o.spr;
  const k0 = Math.ceil((o.cz + .45) / sp), k1 = Math.floor((o.cz + 24) / sp);
  for (let k = k1; k >= k0; k--) { const rel = k * sp - o.cz; const s = .8 * F / rel, Y = hy + o.camH * F / rel; if (Y - s > H + 50) continue;
    for (let r = -rows; r <= rows; r++) { const hsh = hash(k, r + 100); if (o.dry && hsh < .25) continue; const x = r * rs + (hsh - .5) * .12;
      const X = 540 + (x - o.camX) * F / rel + Math.sin(t * 1.3 + x + k) * s * .015; if (X < -s || X > W + s) continue;
      const sz = s * (.85 + hsh * .3); ctx.drawImage(spr[Math.floor(hsh * spr.length) % spr.length], X - sz / 2, Y - sz * .86, sz, sz); } }
  g = ctx.createLinearGradient(0, hy - 30, 0, hy + 260); g.addColorStop(0, `rgba(${o.pal.haze},.85)`); g.addColorStop(1, `rgba(${o.pal.haze},0)`); ctx.fillStyle = g; ctx.fillRect(0, hy - 30, W, 290);
}

// ---------- big leaf ----------
function bigLeaf(t, cx, cy, L, ang, warm) {
  const w = L * .31; ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.translate(-L / 2, 0);
  ctx.save(); ctx.translate(-L * .06, 0); ctx.strokeStyle = warm ? '#6a6a28' : '#4a8a2a'; ctx.lineWidth = L * .025; ctx.beginPath(); ctx.moveTo(-L * .4, L * .02); ctx.lineTo(L * .06, 0); ctx.stroke(); ctx.restore();
  leafletPath(ctx, L, w); const gr = ctx.createLinearGradient(0, -w, 0, w);
  gr.addColorStop(0, warm ? '#c8d860' : '#a8e866'); gr.addColorStop(.45, warm ? '#6a9a30' : '#4a9a2e'); gr.addColorStop(1, warm ? '#2e4a14' : '#1d5418'); ctx.fillStyle = gr; ctx.fill();
  ctx.save(); leafletPath(ctx, L, w); ctx.clip();
  ctx.globalAlpha = .55; ctx.fillStyle = PAT.veins; ctx.save(); ctx.scale(.55, .55); ctx.fillRect(-200, -w * 2.2, L * 2.2, w * 4.4); ctx.restore(); ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(225,250,170,.55)'; ctx.lineCap = 'round';
  for (let i = 1; i < 9; i++) { const u = L * (.08 + i * .1); for (const sd of [-1, 1]) { ctx.lineWidth = L * .008; ctx.beginPath(); ctx.moveTo(u, 0); ctx.quadraticCurveTo(u + L * .08, sd * w * .5, u + L * .16, sd * w * .92 * Math.sin(Math.PI * cl((u + L * .1) / L))); ctx.stroke(); } }
  ctx.lineWidth = L * .016; ctx.strokeStyle = 'rgba(230,255,180,.7)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(L * .96, 0); ctx.stroke();
  glow(warm ? ORANGE : GOLD, L * .7, -w * .6, L * .55, .35);
  ctx.restore();
  ctx.strokeStyle = warm ? 'rgba(255,170,90,.9)' : 'rgba(255,222,130,.9)'; ctx.lineWidth = L * .006; ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(L * .22, -w * 1.25, L * .72, -w * .95, L, 0); ctx.stroke();
  // trichomes
  ctx.strokeStyle = 'rgba(255,240,200,.45)'; ctx.lineWidth = L * .0016;
  for (let i = 0; i < 140; i++) { const u = i / 140, sd = i % 2 ? 1 : -1; const bx = L * u, by = sd * w * 1.0 * Math.pow(Math.sin(Math.PI * u), .9) * (u < .5 ? 1.05 : .97); ctx.beginPath(); ctx.moveTo(bx, by * .98); ctx.lineTo(bx + L * .006, by + sd * L * .012); ctx.stroke(); }
  // dew
  for (let i = 0; i < 6; i++) { const u = .2 + i * .12, v = Math.sin(i * 3.1) * .45 * w; const r = L * (.012 + .006 * (i % 3)); const dg = ctx.createRadialGradient(L * u - r * .3, v - r * .3, r * .1, L * u, v, r); dg.addColorStop(0, 'rgba(255,255,255,.9)'); dg.addColorStop(.5, 'rgba(180,240,200,.35)'); dg.addColorStop(1, 'rgba(40,90,40,.5)'); ctx.fillStyle = dg; ctx.beginPath(); ctx.arc(L * u, v, r, 0, 7); ctx.fill(); glow(WHITE, L * u - r * .35, v - r * .35, r * .5, .8); }
  ctx.restore();
}
function leafScene(t, z, fx, fy, warm) {
  const g = ctx.createLinearGradient(0, 0, 0, H); if (warm) { g.addColorStop(0, '#3a2440'); g.addColorStop(.45, '#e0884a'); g.addColorStop(1, '#3a3010'); } else { g.addColorStop(0, '#20402a'); g.addColorStop(.45, '#d8a84e'); g.addColorStop(1, '#22441c'); }
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const r = rng(11); for (let i = 0; i < 22; i++) { const x = (r() * W + t * 14 * (r() - .3)) % W, y = r() * H, s = 50 + r() * 140; ctx.globalAlpha = .45; ctx.drawImage(r() < .6 ? BK_GOLD : BK_GREEN, x - s, y - s, 2 * s, 2 * s); ctx.globalAlpha = 1; }
  ctx.save(); ctx.translate(540, 960); ctx.scale(z, z); ctx.rotate(Math.sin(t * .3) * .03); ctx.translate(-fx, -fy); bigLeaf(t, 540, 960, 1500, -1.25, warm); ctx.restore();
}

// ---------- stomata ----------
const STOM = []; { const r = rng(5); let tries = 0; STOM.push([1024, 1024, 75, 0, 1]);
  while (STOM.length < 24 && tries++ < 5000) { const x = r() * 2048, y = r() * 2048; let ok = true; for (const s of STOM) { let dx = Math.abs(s[0] - x), dy = Math.abs(s[1] - y); dx = Math.min(dx, 2048 - dx); dy = Math.min(dy, 2048 - dy); if (dx * dx + dy * dy < 300 * 300) ok = false; } if (ok) STOM.push([x, y, 52 + r() * 18, (r() - .5) * 1.1, 0]); } }
function blink(t, ph = 0) { const p = (t + ph) % 3.4; return p < .14 ? Math.abs(p - .07) / .07 : 1; }
function stoma(x, y, R, o, opt = {}) {
  const turg = opt.turg ?? o, dry = opt.dry || 0;
  const rxo = R * (.68 + .1 * turg), ryo = R * (1 + .03 * turg), rxp = R * (.025 + .25 * o), ryp = R * (.48 + .2 * o);
  ctx.save(); ctx.translate(x, y); if (opt.rot) ctx.rotate(opt.rot);
  let g = ctx.createRadialGradient(0, 0, R * .5, 0, 0, R * 1.5); g.addColorStop(0, 'rgba(8,35,12,.6)'); g.addColorStop(1, 'rgba(8,35,12,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, rxo * 1.55, ryo * 1.35, 0, 0, 7); ctx.fill();
  // pore depth
  g = ctx.createRadialGradient(0, 0, 0, 0, 0, ryp); g.addColorStop(0, '#000301'); g.addColorStop(.7, '#03140a'); g.addColorStop(1, '#0d3318'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, rxp + R * .04, ryp + R * .03, 0, 0, 7); ctx.fill();
  if (opt.inner) glow(TEAL, 0, 0, rxp * 2, opt.inner * o);
  const cA = mixh('#d4f58a', '#d8cc7a', dry * (1 - turg) + dry * .3), cB = mixh('#6cc03c', '#8a8a34', dry * (1 - turg) + dry * .3), cC = mixh('#245e1a', '#4a4418', dry * (1 - turg) + dry * .3);
  for (const sd of [-1, 1]) {
    ctx.beginPath(); if (sd < 0) { ctx.ellipse(0, 0, rxo, ryo, 0, Math.PI / 2, Math.PI * 1.5, false); ctx.ellipse(0, 0, rxp, ryp, 0, Math.PI * 1.5, Math.PI / 2, true); }
    else { ctx.ellipse(0, 0, rxo, ryo, 0, Math.PI / 2, -Math.PI / 2, true); ctx.ellipse(0, 0, rxp, ryp, 0, -Math.PI / 2, Math.PI / 2, false); } ctx.closePath();
    const mx = sd * (rxo + rxp) / 2; g = ctx.createRadialGradient(mx - sd * R * .05, -R * .35, R * .04, mx, 0, R * 1.05); g.addColorStop(0, cA); g.addColorStop(.45, cB); g.addColorStop(1, cC); ctx.fillStyle = g; ctx.fill();
    ctx.save(); ctx.clip();
    for (let i = 0; i < 7; i++) { const v = -.62 + i * .2, px = mx + sd * Math.sin(i * 2.3) * (rxo - rxp) * .18, py = v * ryo * .95; ctx.fillStyle = 'rgba(30,110,30,.75)'; ctx.beginPath(); ctx.ellipse(px, py, R * .07, R * .04, i, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(200,255,150,.35)'; ctx.beginPath(); ctx.ellipse(px - R * .015, py - R * .012, R * .03, R * .015, i, 0, 7); ctx.fill(); }
    ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,215,.35)'; ctx.lineWidth = R * .03; ctx.stroke(); ctx.strokeStyle = 'rgba(15,55,15,.85)'; ctx.lineWidth = R * .02; ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(235,255,190,.55)'; ctx.lineWidth = R * .035; ctx.beginPath(); ctx.ellipse(0, 0, rxp, ryp, 0, 0, 7); ctx.stroke();
  if (opt.eyes > 0) {
    ctx.globalAlpha = opt.eyes; const tired = opt.tired || 0, mood = opt.mood ?? 1, lk = opt.look || [0, 0];
    for (const sd of [-1, 1]) {
      const ex = sd * (rxp + (rxo - rxp) * .5), ey = -R * .3, er = R * .1, bl = (opt.bl ?? 1) * blink(opt.t || 0, sd * .02);
      ctx.fillStyle = 'rgba(255,140,140,.35)'; ctx.beginPath(); ctx.ellipse(ex + sd * er * .9, ey + er * 1.9, er * .55, er * .32, 0, 0, 7); ctx.fill();
      ctx.save(); ctx.translate(ex, ey); ctx.scale(1, Math.max(.06, bl));
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(0, 0, er * .82, er * 1.05, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#10200f'; ctx.beginPath(); ctx.ellipse(lk[0] * er * .32, lk[1] * er * .35 + er * .08, er * .5, er * .6, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(lk[0] * er * .32 - er * .18, lk[1] * er * .35 - er * .15, er * .17, 0, 7); ctx.fill();
      if (tired > 0) { ctx.fillStyle = cB; ctx.beginPath(); ctx.ellipse(0, -er * 1.1, er * 1.0, er * (.15 + tired * .95), 0, 0, 7); ctx.fill(); }
      ctx.restore();
      if (mood < 0) { ctx.strokeStyle = 'rgba(20,50,15,.85)'; ctx.lineWidth = R * .022; ctx.beginPath(); ctx.moveTo(ex - er * .8, ey - er * 1.35 + (-sd) * mood * er * .3); ctx.lineTo(ex + er * .8, ey - er * 1.35 + sd * mood * er * .3); ctx.stroke(); }
      const my = ey + er * 1.75, mw = er * .55; ctx.strokeStyle = 'rgba(20,50,15,.9)'; ctx.lineWidth = R * .022; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ex - mw, my); ctx.quadraticCurveTo(ex, my + mood * mw * .9, ex + mw, my); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}
// epidermis view; featured stoma at world (1024,1024) of tile (0,0)
function drawEpi(t, cx, cy, s, rot, o = {}) {
  const offY = o.offY || 0; ctx.save(); ctx.translate(540, 960 + offY); ctx.rotate(rot); ctx.scale(s, s); ctx.translate(-cx, -cy);
  const R = 1250 / s; ctx.fillStyle = PAT.epi; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  const i0 = Math.floor((cx - R - 200) / 2048), i1 = Math.floor((cx + R + 200) / 2048), j0 = Math.floor((cy - R - 200) / 2048), j1 = Math.floor((cy + R + 200) / 2048);
  for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) STOM.forEach((st, n) => {
    const x = st[0] + i * 2048, y = st[1] + j * 2048; if (Math.abs(x - cx) > R + 120 || Math.abs(y - cy) > R + 120) return;
    const feat = st[4] && i == 0 && j == 0;
    if (feat) stoma(x, y, st[2], o.fo ?? .4, Object.assign({ t }, o.f || {}));
    else stoma(x, y, st[2], cl((.32 + .18 * Math.sin(t * .7 + n)) * (o.go ?? 1), .03, 1), { rot: st[3], dry: o.dry || 0 });
  });
  ctx.restore();
  ctx.save(); let g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, 'rgba(255,215,130,.10)'); g.addColorStop(.5, 'rgba(0,25,10,.18)'); g.addColorStop(1, 'rgba(0,18,8,.5)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (o.dry) { ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = `rgba(230,190,110,${.55 * o.dry})`; ctx.fillRect(0, 0, W, H); }
  ctx.restore();
}
function e2s(wx, wy, cx, cy, s, rot, offY = 0) { const dx = (wx - cx) * s, dy = (wy - cy) * s, c = Math.cos(rot), n = Math.sin(rot); return [540 + dx * c - dy * n, 960 + offY + dx * n + dy * c]; }

// ---------- labels / text ----------
const LT = new Set(); let LQ = [];
function L(...a) { LQ.push(a); }
function label(t, t0, t1, text, tx, ty, bx, by, col = '#4fe3c8') {
  LT.add(t0); const a = ss(t0, t0 + .35, t) * (1 - ss(t1 - .3, t1, t)); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.font = '800 36px Nunito'; const w = ctx.measureText(text).width + 70, h = 66;
  by += (1 - ss(t0, t0 + .35, t)) * 16; const x = bx - w / 2, y = by - h / 2;
  const dx = tx - bx, dy = ty - by; let lx = bx, ly = by;
  if (Math.abs(dx) + Math.abs(dy) > 1) { if (Math.abs(dy) * w > Math.abs(dx) * h) { lx = bx + dx * (h / 2) / Math.abs(dy); ly = by + Math.sign(dy) * h / 2; } else { lx = bx + Math.sign(dx) * w / 2; ly = by + dy * (w / 2) / Math.abs(dx); } }
  const k = ss(t0 + .1, t0 + .5, t); ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 3; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lerp(lx, tx, k), lerp(ly, ty, k)); ctx.stroke();
  if (k > .9) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(tx, ty, 7, 0, 7); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(tx, ty, 15 + 4 * Math.sin(t * 6), 0, 7); ctx.stroke(); }
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 18; rr(x, y, w, h, 20); ctx.fillStyle = 'rgba(7,17,13,.84)'; ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = col; ctx.globalAlpha = a * .75; ctx.lineWidth = 2.5; ctx.stroke(); ctx.globalAlpha = a;
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x + 26, by, 7, 0, 7); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillText(text, x + 44, by + 2); ctx.restore();
}
function pill(t, t0, t1, text, y, size = 34, col = '#ffd93b') {
  const a = ss(t0, t0 + .4, t) * (1 - ss(t1 - .4, t1, t)); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.font = `800 ${size}px Nunito`;
  const w = ctx.measureText(text).width + 100, h = size * 1.9; rr(540 - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = 'rgba(7,17,13,.78)'; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke();
  // leaf icon
  ctx.save(); ctx.translate(540 - w / 2 + 42, y); ctx.rotate(-.7); ctx.fillStyle = '#7ddc4a'; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.quadraticCurveTo(0, -14, 14, 0); ctx.quadraticCurveTo(0, 14, -14, 0); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 540 + 18, y + 2); ctx.restore();
}
function bigText(t, t0, t1, lines, y, size, cols, lh = 1.05) {
  LT.add(t0); if (t < t0 || t > t1) return; const a = 1 - ss(t1 - .35, t1, t);
  ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  lines.forEach((ln, i) => { const k = cl((t - t0 - i * .18) / .55); if (k <= 0) return; const sc = (1 - Math.cos(k * Math.PI * 2.4) * Math.exp(-k * 5.5) * .55) * ss(0, .12, k);
    const fs = Array.isArray(size) ? size[i] : size; ctx.save(); ctx.translate(540, y + i * fs * lh); ctx.scale(sc, sc); ctx.font = `800 ${fs}px "Baloo 2"`;
    glow(cols[i] == '#ffd93b' ? YEL : WHITE, 0, 0, fs * 3.2, .22);
    ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = fs * .26; ctx.strokeText(ln, 0, fs * .08);
    ctx.strokeStyle = '#000'; ctx.lineWidth = fs * .2; ctx.strokeText(ln, 0, 0); ctx.fillStyle = cols[i]; ctx.fillText(ln, 0, 0); ctx.restore(); });
  ctx.restore();
}
const KEY = new Set(['bocas', 'viva', 'estômatos', 'microscópicas', 'portas', 'comunicação', 'gás', 'carbônico', 'luz', 'solar', 'açúcares', 'fotossíntese', 'oxigênio', 'vapor', 'transpiração', 'temperatura', 'células-guarda', 'pressão', 'água', 'ácido', 'abscísico', 'crescimento', 'agricultura', 'equilíbrio', 'microscópico', 'produtividade', 'lavoura', 'universo', 'invisível', 'siga']);
function subtitles(t) {
  let c = null; for (let i = 0; i < SUBS.length; i++) { const s = SUBS[i], nx = SUBS[i + 1]; const end = nx && nx.t0 - s.t1 < .6 ? nx.t0 : s.t1 + .3; if (t >= s.t0 && t < end) { c = s; break; } } if (!c) return;
  const k = cl((t - c.t0) / .22); const sc = .82 + .18 * ss(0, .6, k) + .07 * Math.sin(k * Math.PI);
  ctx.save(); ctx.translate(530, 1440); ctx.scale(sc, sc); ctx.font = '800 76px "Baloo 2"'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.lineJoin = 'round';
  const words = c.text.split(' '), sw = ctx.measureText(' ').width; const lines = [[]]; let lw = 0;
  words.forEach(wd => { const ww = ctx.measureText(wd).width; if (lw + ww > 880 && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push([wd, ww]); lw += ww + sw; });
  lines.forEach((ln, li) => { const tw = ln.reduce((a, b) => a + b[1], 0) + sw * (ln.length - 1); let x = -tw / 2; const y = (li - (lines.length - 1) / 2) * 84;
    ln.forEach(([wd, ww]) => { const key = KEY.has(wd.toLowerCase().replace(/[,.?!]/g, '')); ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 20; ctx.strokeText(wd, x, y + 6); ctx.strokeStyle = '#000'; ctx.lineWidth = 14; ctx.strokeText(wd, x, y); ctx.fillStyle = key ? '#ffd93b' : '#fff'; ctx.fillText(wd, x, y); x += ww + sw; }); });
  ctx.restore();
}

// ---------- ambient ----------
const MOTES = []; { const r = rng(21); for (let i = 0; i < 80; i++) MOTES.push([r() * W, r() * H, .3 + r() * 1.2, r() * 6.28, r(), r()]); }
function motes(t, mode) {
  for (const [x0, y0, d, ph, c, sz] of MOTES) { const x = ((x0 + t * 18 * d + Math.sin(t * .6 + ph) * 30) % W + W) % W, y = ((y0 - t * 26 * d) % H + H) % H;
    const a = (.35 + .4 * Math.sin(t * 2 + ph * 3)) * (mode == 'micro' ? .8 : .9); const spr = mode == 'micro' ? (c < .5 ? GOLD : TEAL) : (mode == 'dry' ? WHITE : GOLD); glow(spr, x, y, (5 + sz * 12) * d, a); }
}
const FB = []; { const r = rng(33); for (let i = 0; i < 7; i++) FB.push([r() * W, r() * H, 60 + r() * 120, r() * 6, r()]); }
function fgBokeh(t) { for (const [x0, y0, s, ph, c] of FB) { const x = x0 + Math.sin(t * .15 + ph) * 120, y = ((y0 - t * 12) % H + H) % H; ctx.globalAlpha = .16; ctx.drawImage(c < .5 ? BK_GOLD : BK_TEAL, x - s, y - s, 2 * s, 2 * s); ctx.globalAlpha = 1; } }
let VIG, GRAIN;
function flash(t, tc, d = .25, a = .6) { const k = 1 - Math.abs(t - tc) / d; if (k <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(540, 960, 0, 540, 960, 1200); g.addColorStop(0, `rgba(255,240,200,${a * k})`); g.addColorStop(1, `rgba(255,200,120,${a * k * .4})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function warp(t, t0, t1, rgb = '190,255,210') { const a = ss(t0, t0 + .3, t) * (1 - ss(t1 - .3, t1, t)); if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 6; i++) { const r = ((t - t0) * 1100 + i * 210) % 1300; ctx.strokeStyle = `rgba(${rgb},${a * .35 * (1 - r / 1300)})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(540, 960, r, 0, 7); ctx.stroke(); }
  const r = rng(77); for (let i = 0; i < 60; i++) { const an = r() * 6.28, sp = (r() + (t - t0) * 1.6) % 1, r0 = sp * 1100, r1 = r0 + 80 + sp * 260; ctx.strokeStyle = `rgba(255,240,200,${a * .5 * sp})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(540 + Math.cos(an) * r0, 960 + Math.sin(an) * r0); ctx.lineTo(540 + Math.cos(an) * r1, 960 + Math.sin(an) * r1); ctx.stroke(); }
  ctx.restore(); }

// ---------- molecules helpers ----------
function intake(t, t0, t1, px, py, n, scale, rate = 1, type = 'co2', seed = 3) { // molecules spiral into pore
  const r = rng(seed); for (let i = 0; i < n; i++) { const ts = t0 + i * (t1 - t0) / n, L0 = 3.0, an = -Math.PI / 2 + (r() - .5) * 3.4, rad = 420 + r() * 380, rot = r() * 6, keep = r();
    if (keep > rate) continue; const k = (t - ts) / L0; if (k < 0 || k > 1) continue; const e = eio(k), sw = (1 - e) * .9;
    const dx = Math.cos(an + sw) * rad * (1 - e), dy = Math.sin(an + sw) * rad * (1 - e) * 1.1; const s = scale * (1 - .78 * Math.pow(k, 1.4));
    mol(type, px + dx, py + dy, s, rot + t * 1.5, ss(0, .12, k) * (1 - ss(.82, 1, k))); }
}
function outflow(t, t0, t1, px, py, n, scale, rate = 1, seed = 4) {
  const r = rng(seed); for (let i = 0; i < n; i++) { const ts = t0 + i * (t1 - t0) / n, L0 = 2.6, an = -Math.PI / 2 + (r() - .5) * 2.8, rad = 600 + r() * 400, ty = r() < .35 ? 'o2' : 'h2o', rot = r() * 6, keep = r();
    if (keep > rate) continue; const k = (t - ts) / L0; if (k < 0 || k > 1) continue; const e = 1 - Math.pow(1 - k, 2);
    const x = px + Math.cos(an) * rad * e, y = py + Math.sin(an) * rad * e * .9 - k * 60; const s = scale * (.25 + .9 * k);
    glow(BLUE, x + Math.sin(i) * 40, y + 30, s * 2.5, .35 * (1 - k)); mol(ty, x, y, s, rot + t, ss(0, .15, k) * (1 - ss(.75, 1, k))); }
}

// ---------- mesophyll ----------
const MCELLS = []; { const r = rng(9); for (let row = -1; row < 8; row++) for (let c = -1; c < 5; c++) { const x = 90 + c * 290 + (row % 2 ? 145 : 0) + (r() - .5) * 40, y = 80 + row * 270 + (r() - .5) * 40; const chl = []; for (let i = 0; i < 9; i++) chl.push([i / 9 * 6.28 + r() * .3, .7 + r() * .12, r()]); MCELLS.push([x, y, 125 + r() * 25, r() * 10, chl]); } }
function chloro(x, y, a, s, lit) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); const g = ctx.createLinearGradient(0, -s * .5, 0, s * .5); g.addColorStop(0, '#9cf06a'); g.addColorStop(.5, '#2f9a35'); g.addColorStop(1, '#0f4a1a'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, s, s * .5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(10,60,20,.8)'; for (let i = -2; i <= 2; i++) { rr(i * s * .36 - s * .1, -s * .2, s * .2, s * .4, s * .05); ctx.fill(); }
  ctx.strokeStyle = 'rgba(210,255,170,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, s, s * .5, 0, 0, 7); ctx.stroke(); ctx.restore(); glow(GREEN, x, y, s * 2.2, .25 + .4 * lit);
}
function chloroPos(cell, j, t) { const [x, y, r, ph, chl] = cell, [an, rr0] = chl[j]; const wob = 1 + .04 * Math.sin(an * 3 + ph + t); return [x + Math.cos(an) * r * rr0 * wob, y + Math.sin(an) * r * rr0 * wob, an + Math.PI / 2]; }
function mesoCam(t) { return [1.04 + .012 * (t - 24), Math.sin(t * .3) * 20, -40 + (t - 24) * -6]; }
function m2s(x, y, t) { const [s, dx, dy] = mesoCam(t); return [540 + (x - 540) * s + dx, 960 + (y - 960) * s + dy]; }
function mesophyll(t, prod = 1) {
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0f3a2a'); g.addColorStop(1, '#03140d'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const r = rng(12); for (let i = 0; i < 16; i++) { const x = r() * W, y = r() * H, s = 30 + r() * 90; ctx.globalAlpha = .35; ctx.drawImage(BK_TEAL, x - s, y - s, 2 * s, 2 * s); ctx.globalAlpha = 1; }
  const [s, dx, dy] = mesoCam(t); ctx.save(); ctx.translate(540 + dx, 960 + dy); ctx.scale(s, s); ctx.translate(-540, -960);
  for (const cell of MCELLS) { const [x, y, rad, ph] = cell; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * 6.283, rr1 = rad * (1 + .05 * Math.sin(a * 3 + ph) + .03 * Math.sin(a * 5 + ph * 2 + t * .8)); ctx.lineTo(x + Math.cos(a) * rr1, y + Math.sin(a) * rr1); } ctx.closePath();
    const cg = ctx.createRadialGradient(x - rad * .3, y - rad * .3, rad * .1, x, y, rad); cg.addColorStop(0, 'rgba(170,240,140,.35)'); cg.addColorStop(1, 'rgba(60,150,70,.28)'); ctx.fillStyle = cg; ctx.fill(); ctx.strokeStyle = 'rgba(190,255,170,.7)'; ctx.lineWidth = 7; ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,220,.25)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = 'rgba(120,200,140,.35)'; ctx.beginPath(); ctx.arc(x + rad * .2, y + rad * .1, rad * .16, 0, 7); ctx.fill(); }
  // rays
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 5; i++) { const x0 = 250 + i * 210, sh = .75 + .25 * Math.sin(t * 1.6 + i * 2); const gr = ctx.createLinearGradient(x0, 0, x0 - 500, 1900); gr.addColorStop(0, `rgba(255,215,120,${.28 * sh})`); gr.addColorStop(1, 'rgba(255,215,120,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(x0, -100); ctx.lineTo(x0 + 90 + i * 10, -100); ctx.lineTo(x0 - 420, 2000); ctx.lineTo(x0 - 600, 2000); ctx.fill(); } ctx.restore();
  MCELLS.forEach((cell, ci) => cell[4].forEach((c, j) => { const [x, y, a] = chloroPos(cell, j, t); chloro(x, y, a, 26, .5 + .5 * Math.sin(t * 3 + ci + j)); }));
  // sugars
  if (prod > 0) for (let ci = 0; ci < MCELLS.length; ci += 3) { const cell = MCELLS[ci]; for (let q = 0; q < 2; q++) { const ph = ((t - 25.2 + ci * .37 + q * 1.1) % 2.2); if (t < 25.2 + q * .4) continue; const [x, y] = chloroPos(cell, (ci + q * 4) % 9, t); const k = ph / 2.2; hexRing(x + Math.sin(k * 5 + ci) * 20, y - k * 120, 15, t + ci, prod * ss(0, .15, k) * (1 - ss(.7, 1, k))); } }
  ctx.restore();
}

// ---------- cross-section ----------
const XS = (() => { const r = rng(17), sp = []; let tries = 0; while (sp.length < 60 && tries++ < 4000) { const x = 50 + r() * 980, y = 668 + r() * 270, rad = 22 + r() * 18; if (y + rad > 735 && y - rad < 800) continue; if (Math.abs(x - 540) < 80 && y > 860) continue; if (Math.abs(x - 840) < 70 && y > 860) continue; if (sp.some(s => Math.hypot(s[0] - x, s[1] - y) < s[2] + rad + 6)) continue; sp.push([x, y, rad, r() * 6]); } return sp; })();
function xPath(k, x0, sx, wob) { // piecewise path from xylem to outside air
  const P = [[x0, 800], [lerp(x0, sx, .55) + wob, 880], [sx, 935], [sx, 990], [sx + wob * 2.5, 1210]]; const seg = cl(k) * 4, i = Math.min(3, Math.floor(seg)), f = seg - i; return [lerp(P[i][0], P[i + 1][0], f), lerp(P[i][1], P[i + 1][1], f), i]; }
function crossSection(t) {
  let g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0d2a26'); g.addColorStop(1, '#04110d'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const r0 = rng(14); for (let i = 0; i < 14; i++) { const x = r0() * W, y = r0() * H, s = 40 + r0() * 100; ctx.globalAlpha = .3; ctx.drawImage(BK_TEAL, x - s, y - s, 2 * s, 2 * s); ctx.globalAlpha = 1; }
  const k = ss(34.0, 40.4, t), sc = lerp(1.1, 1.0, eio((t - 34) / 2)); ctx.save(); ctx.translate(540, 800); ctx.scale(sc, sc); ctx.translate(-540 + Math.sin(t * .4) * 10, -800);
  // top face
  ctx.save(); ctx.transform(1, 0, .2, -.2333, 40, 420); ctx.fillStyle = PAT.epi; ctx.save(); ctx.scale(.3, .3); ctx.fillRect(0, 0, 1000 / .3, 300 / .3); ctx.restore(); ctx.fillStyle = 'rgba(0,30,10,.25)'; ctx.fillRect(0, 0, 1000, 300); ctx.restore();
  // right face
  g = ctx.createLinearGradient(1040, 0, 1100, 0); g.addColorStop(0, '#1d4a1c'); g.addColorStop(1, '#0c2410'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(1040, 420); ctx.lineTo(1100, 350); ctx.lineTo(1100, 935); ctx.lineTo(1040, 1005); ctx.fill();
  // front base
  ctx.fillStyle = '#0a2214'; ctx.fillRect(40, 420, 1000, 585);
  ctx.save(); ctx.beginPath(); ctx.rect(40, 418, 1000, 590); ctx.clip();
  // cuticle + upper epidermis
  g = ctx.createLinearGradient(0, 420, 0, 432); g.addColorStop(0, '#f4ffd8'); g.addColorStop(1, '#b8e07a'); ctx.fillStyle = g; ctx.fillRect(40, 420, 1000, 12);
  for (let x = 40; x < 1040; x += 64) { rr(x + 2, 434, 60, 48, 14); g = ctx.createLinearGradient(0, 434, 0, 482); g.addColorStop(0, '#d8f5a0'); g.addColorStop(1, '#8cc860'); ctx.fillStyle = g; ctx.fill(); }
  // palisade
  for (let x = 40, i = 0; x < 1040; x += 50, i++) { rr(x + 3, 488, 44, 172, 20); g = ctx.createLinearGradient(x, 0, x + 44, 0); g.addColorStop(0, '#4aa832'); g.addColorStop(.5, '#7cd052'); g.addColorStop(1, '#2f7a22'); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = 'rgba(200,255,160,.5)'; ctx.lineWidth = 2; ctx.stroke();
    for (let j = 0; j < 7; j++) for (const sd of [0, 1]) { ctx.fillStyle = '#17621c'; ctx.beginPath(); ctx.ellipse(x + 11 + sd * 26, 505 + j * 23, 6, 9, 0, 0, 7); ctx.fill(); glow(GREEN, x + 11 + sd * 26, 505 + j * 23, 12, .12); } }
  // spongy
  for (const [x, y, rad, ph] of XS) { ctx.beginPath(); for (let i = 0; i <= 24; i++) { const a = i / 24 * 6.28, q = rad * (1 + .12 * Math.sin(a * 3 + ph)); ctx.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } ctx.closePath(); g = ctx.createRadialGradient(x - rad * .3, y - rad * .3, 2, x, y, rad); g.addColorStop(0, '#a6e070'); g.addColorStop(1, '#3f8a2c'); ctx.fillStyle = g; ctx.fill();
    ctx.fillStyle = '#1b6a1e'; for (let j = 0; j < 4; j++) { ctx.beginPath(); ctx.ellipse(x + Math.cos(j * 1.6 + ph) * rad * .6, y + Math.sin(j * 1.6 + ph) * rad * .6, 5, 3.5, j, 0, 7); ctx.fill(); } }
  // xylem tube (longitudinal)
  g = ctx.createLinearGradient(0, 735, 0, 800); g.addColorStop(0, '#d8f0b0'); g.addColorStop(.12, 'rgba(70,160,220,.45)'); g.addColorStop(.88, 'rgba(70,160,220,.45)'); g.addColorStop(1, '#d8f0b0'); ctx.fillStyle = g; ctx.fillRect(40, 735, 1000, 65);
  ctx.strokeStyle = 'rgba(220,245,255,.55)'; ctx.lineWidth = 4; for (let x = 20; x < 1060; x += 22) { ctx.beginPath(); ctx.moveTo(x, 740); ctx.lineTo(x + 16, 795); ctx.stroke(); }
  for (let i = 0; i < 40; i++) { const x = ((i * 53 + t * 260) % 1060) + 20, y = 752 + (i * 37 % 32); glow(BLUE, x, y, 16, .9); }
  // lower epidermis with stomata
  for (let x = 40; x < 1040; x += 64) { if (Math.abs(x + 32 - 540) < 64 || Math.abs(x + 32 - 840) < 64) continue; rr(x + 2, 956, 60, 46, 14); g = ctx.createLinearGradient(0, 956, 0, 1002); g.addColorStop(0, '#9cd26a'); g.addColorStop(1, '#5a9a3c'); ctx.fillStyle = g; ctx.fill(); }
  for (const sx of [540, 840]) { ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.ellipse(sx, 915, 62, 44, 0, 0, 7); ctx.fill(); for (const sd of [-1, 1]) { g = ctx.createRadialGradient(sx + sd * 30 - 6, 975, 3, sx + sd * 30, 980, 30); g.addColorStop(0, '#d8f58a'); g.addColorStop(1, '#3f8f2a'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(sx + sd * 31, 980, 24, 26, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#245e1a'; ctx.beginPath(); ctx.arc(sx + sd * 31, 982, 6, 0, 7); ctx.fill(); } }
  ctx.restore();
  // water paths
  ctx.save(); ctx.setLineDash([14, 14]); ctx.lineDashOffset = -t * 60; ctx.strokeStyle = `rgba(120,215,255,${.7 * ss(35, 35.8, t)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(300, 800); ctx.quadraticCurveTo(470, 860, 540, 935); ctx.lineTo(540, 1120); ctx.stroke(); ctx.restore();
  const r = rng(19); for (let i = 0; i < 70; i++) { const x0 = 120 + r() * 840, sx = x0 < 700 ? 540 : 840, wob = (r() - .5) * 60, per = 2.6 + r(), ph = r() * per; const kk = ((t - 34 + ph) % per) / per; const [x, y, seg] = xPath(kk, x0, sx, wob);
    if (seg < 3) glow(BLUE, x, y, 13, .9); else { const q = (kk - .75) / .25; glow(BLUE, x, y, 14 + q * 46, .75 * (1 - q)); glow(WHITE, x, y, 6 + q * 10, .5 * (1 - q)); } }
  ctx.restore();
}

// ---------- scenes ----------
function cam2(t) { if (t < 12) { const k = t - 7; return [324 + k * 90, 1324 - k * 40, .9, .1 - k * .02]; } const k = eio((t - 12) / 2.2); return [lerp(774, 1024, k), lerp(1124, 1024, k), elerp(.9, 3.6, k), 0]; }
function scene1(t) {
  if (t < 3.4) drawField(t, { pal: PAL.rise, spr: SPR.rise, cz: t * 5.2, camH: lerp(2.4, .75, eio(t / 3.2)), camX: Math.sin(t * .4) * .3, hy: lerp(760, 620, eio(t / 3.2)), sun: [760, lerp(700, 540, eio(t / 3.2))], sunCol: ORANGE });
  xfade(ss(2.75, 3.35, t), () => leafScene(t, elerp(.55, 11, eio((t - 2.9) / 3.0)), 690, 860, false));
  xfade(ss(5.3, 6.3, t), () => drawEpi(t, 324, 1324, elerp(.28, .9, eio((t - 5.3) / 1.7)), .1 + (7 - t) * .06));
  warp(t, 5.3, 7.05);
  pill(t, .2, 5.6, 'O AGRO QUE VOCÊ NÃO VÊ', 260);
  LQ.push(['big', 2.5, 6.9, ['Milhares de', 'pequenas bocas?!'], 400, 104, ['#fff', '#ffd93b']]);
}
function scene2(t) {
  const [cx, cy, s, rot] = cam2(t);
  drawEpi(t, cx, cy, s, rot, { fo: .15 + .42 * ss(14.4, 16.6, t), f: { eyes: ss(12.6, 13.2, t), bl: ss(13.0, 13.7, t), mood: lerp(.3, 1, ss(13.5, 15, t)), look: [Math.sin(t * .8) * .6, -.2] } });
  L(t, 8.0, 11.8, 'Epiderme vegetal', ...e2s(500, 1400, cx, cy, s, rot), 330, 700);
  L(t, 9.3, 11.95, 'Estômato', ...e2s(1024, 1024, cx, cy, s, rot), 700, 560);
  L(t, 13.9, 17.5, 'Células-guarda', 420, 1040, 300, 600);
  L(t, 14.9, 17.5, 'Poro estomático', 540, 990, 790, 520);
}
function floater(i, t) { const r = rng(40 + i); const x = 100 + r() * 880, y = 300 + r() * 1100; return [x + Math.sin(t * (.4 + r() * .4) + i) * 60, y + Math.cos(t * (.3 + r() * .4) + i) * 50, 16 + r() * 22, r() * 6 + t * (r() - .5)]; }
function scene3(t) {
  const s = t < 23.2 ? 3.6 : elerp(3.6, 50, eio((t - 23.2) / 1.1)); const o = lerp(.57, .9, ss(17.4, 19.4, t));
  if (t < 24.4) { drawEpi(t, 1024, 1024, s, 0, { fo: o, f: { turg: o, eyes: 1, mood: 1, look: [-.4 * Math.sin(t), -.6], inner: .6 } });
    const z = s / 3.6; for (let i = 0; i < 12; i++) { const [x, y, sz, a] = floater(i, t); mol('co2', 540 + (x - 540) * z, 960 + (y - 960) * z, sz * Math.min(z, 4), a, 1 - ss(23.4, 24.0, t)); }
    intake(t, 17.3, 23.6, 540, 960, 26, 30, 1);
    if (t < 23.3) L(t, 19.3, 23.1, 'CO₂ — gás carbônico', ...floater(0, t).slice(0, 2), 540, 400); }
  xfade(ss(23.75, 24.35, t), () => { mesophyll(t); for (let i = 0; i < 10; i++) { const k = ((t - 23.8 + i * .45) % 4.5) / 4.5; const cell = MCELLS[(i * 5 + 7) % MCELLS.length], [cx, cy] = m2s(...chloroPos(cell, i % 9, t).slice(0, 2), t); const sx = (i * 137) % W; mol(i % 3 ? 'co2' : 'h2o', lerp(sx, cx, eio(k)), lerp(i % 3 ? -80 : 2000, cy, eio(k)), 22 * (1 - .6 * k), t + i, ss(0, .1, k) * (1 - ss(.85, 1, k))); } });
  if (t > 24.4) { const cc = MCELLS[16], [chx, chy] = m2s(...chloroPos(cc, 2, t).slice(0, 2), t);
    L(t, 24.8, 29.35, 'Cloroplasto', chx, chy, 300, 400); L(t, 25.6, 29.35, 'Energia solar', ...m2s(860, 560, t), 790, 300);
    const sc = MCELLS[18], [sx, sy] = m2s(...chloroPos(sc, 0, t).slice(0, 2), t); L(t, 26.4, 29.35, 'Fotossíntese', sx, sy - 60, 330, 1120);
    L(t, 27.2, 29.35, 'CO₂ + H₂O + luz → açúcares + O₂', 540, 1250, 540, 1250, '#ffd93b'); }
}
function scene4(t) {
  if (t < 34.6) { const s = t < 30.3 ? elerp(32, 3.6, eio((t - 29.4) / .9)) : 3.6;
    drawEpi(t, 1024, 1024, s, 0, { fo: .9, f: { turg: .9, eyes: 1, mood: 1, look: [Math.sin(t * 1.3) * .5, -.8], inner: .6 } });
    outflow(t, 29.9, 34.4, 540, 960, 40, 30, 1);
    // tagged molecules
    const kO = cl((t - 30.9) / 3.4), kH = cl((t - 31.6) / 3.0);
    const o2p = [lerp(540, 300, eio(kO)), lerp(960, 560, eio(kO))], h2p = [lerp(540, 790, eio(kH)), lerp(960, 640, eio(kH))];
    if (t > 30.9) mol('o2', ...o2p, 18 + 22 * kO, t * .8, ss(30.9, 31.2, t)); if (t > 31.6) { glow(BLUE, ...h2p, 70, .4); mol('h2o', ...h2p, 18 + 20 * kH, t * .7, ss(31.6, 31.9, t)); }
    xfade(1 - ss(29.4, 29.75, t), () => mesophyll(t, 0));
    L(t, 31.5, 34.3, 'O₂ — oxigênio', ...o2p, 290, 380); L(t, 32.3, 34.3, 'H₂O — vapor de água', ...h2p, 720, 470, '#7cc8ff'); }
  xfade(ss(34.0, 34.55, t), () => crossSection(t));
  if (t > 34.4) { pill(t, 34.6, 40.4, 'CORTE TRANSVERSAL DA FOLHA', 280, 32, '#4fe3c8');
    L(t, 35.2, 40.35, 'Xilema', 260, 772, 230, 1160, '#7cc8ff'); L(t, 36.8, 40.35, 'Transpiração vegetal', 540, 1120, 720, 1250, '#7cc8ff'); }
}
function scene5(t) {
  const s = elerp(3.6, 6.4, eio((t - 40.45) / 1.0)), offY = lerp(0, -110, eio((t - 40.45) / 1.0));
  const o = t < 47.7 ? lerp(.12, .9, eio((t - 42.4) / 4.0)) : lerp(.9, .07, eio((t - 47.8) / 2.5));
  const opening = t < 47.7; const R = 75 * s, sx = 540, sy = 960 + offY;
  drawEpi(t, 1024, 1024, s, 0, { offY, fo: o, f: { turg: o, eyes: 1, mood: lerp(.2, 1, o), tired: opening ? (1 - o) * .5 : (1 - o) * .7, look: [opening ? Math.sin(t * 1.5) * .7 : 0, opening ? 0 : .6], inner: .5 } });
  // solutes & water through guard cells
  const r = rng(51); for (let i = 0; i < 36; i++) { const sd = i % 2 ? 1 : -1, per = 1.6 + r(), ph = r() * per, vy = (r() - .5) * 1.3, isK = i % 3 == 0;
    const active = opening ? ss(42.2, 42.6, t) * (1 - ss(46.3, 46.8, t)) : ss(47.8, 48.2, t) * (1 - ss(50.0, 50.4, t)); if (active <= 0) continue;
    let k = ((t + ph) % per) / per; if (!opening) k = 1 - k; const xo = sx + sd * R * 1.15, xi = sx + sd * R * .42; const x = lerp(xo, xi, k), y = sy + vy * R * .55 + Math.sin(k * 6 + i) * 10;
    const a = active * ss(0, .2, k) * (1 - ss(.8, 1, k)) + active * (opening ? 0 : 0);
    if (isK) { ctx.globalAlpha = cl(opening ? ss(0, .2, k) : 1 - ss(.8, 1, k)) * active; sph(SK, x, y, 16); ctx.fillStyle = '#4a2a00'; ctx.font = '800 15px Nunito'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('K⁺', x, y + 1); ctx.globalAlpha = 1; }
    else glow(BLUE, x, y, 22, (opening ? ss(0, .2, k) : 1 - ss(.8, 1, k)) * active); }
  // arrows showing cell movement
  const aa = (opening ? ss(43, 43.4, t) * (1 - ss(46, 46.4, t)) : ss(48, 48.4, t) * (1 - ss(50, 50.4, t)));
  if (aa > 0) { ctx.save(); ctx.globalAlpha = aa * .85; ctx.strokeStyle = '#fff'; ctx.fillStyle = '#fff'; ctx.lineWidth = 8; ctx.lineCap = 'round';
    for (const sd of [-1, 1]) { const d = opening ? sd : -sd, x0 = sx + sd * R * .9, y0 = sy - R * 1.15, x1 = x0 + d * 70; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x1 + d * 16, y0); ctx.lineTo(x1 - d * 6, y0 - 16); ctx.lineTo(x1 - d * 6, y0 + 16); ctx.fill(); } ctx.restore(); }
  // turgor meters
  const ma = ss(43.8, 44.3, t) * (1 - ss(50.6, 51.1, t)); if (ma > 0) { ctx.save(); ctx.globalAlpha = ma; for (const mx of [90, 990]) { rr(mx - 22, sy - 170, 44, 340, 22); ctx.fillStyle = 'rgba(7,17,13,.8)'; ctx.fill(); ctx.strokeStyle = '#4fe3c8'; ctx.lineWidth = 3; ctx.stroke(); const hh = 320 * cl(o); const gg = ctx.createLinearGradient(0, sy + 160, 0, sy - 160); gg.addColorStop(0, '#2a8adf'); gg.addColorStop(1, '#6ff0c0'); ctx.fillStyle = gg; rr(mx - 14, sy + 160 - hh, 28, hh, 14); ctx.fill(); } ctx.restore(); }
  L(t, 41.3, 45.9, 'Células-guarda', sx - R * .45, sy + R * .3, 300, 290);
  L(t, 44.2, 50.9, 'Pressão de turgor', 990, sy - 175, 790, 290);
  L(t, 46.0, 47.75, 'Estômato aberto', sx, sy + R * .2, 290, 380, '#9cff6a');
  L(t, 49.5, 51.05, 'Estômato fechado', sx, sy, 290, 380, '#ffb347');
}
function heat(t, hy) { ctx.save(); ctx.strokeStyle = 'rgba(255,255,240,.12)'; ctx.lineWidth = 3; for (let i = 0; i < 10; i++) { const y = hy - 40 + i * 14; ctx.beginPath(); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, y + Math.sin(x * .03 + t * 6 + i) * 4); ctx.stroke(); } ctx.restore(); }
function drySky(t) { drawField(t, { pal: PAL.dry, spr: SPR.dry, dry: true, cz: 0, camH: 1.6, camX: 0, hy: 900, sun: [820, 380], sunCol: WHITE }); }
function scene6(t) {
  let target = null;
  if (t < 53.7) { drawField(t, { pal: PAL.dry, spr: SPR.dry, dry: true, cz: (t - 51.2) * 1.1, camH: 1.5, camX: Math.sin(t * .3) * .3, hy: 880, sun: [820, 400], sunCol: WHITE }); heat(t, 880); target = [540, 1180]; }
  xfade(ss(53.2, 53.7, t), () => { const z = lerp(1, 1.15, eio((t - 53.2) / 3.6)); ctx.save(); ctx.translate(540, 1000); ctx.scale(z, z); ctx.translate(-540, -1000); drySky(t); heat(t, 900);
    const p = soyPlant(540, 1500, 2.0, .22, t, 3, 'rgba(255,240,190,.5)'); ctx.restore();
    // ABA particles travel up the stem then to leaves
    const ns = p.nodes, tp = p.tips; for (let i = 0; i < 26; i++) { const k = cl((t - 53.6 - i * .11) / 1.8); if (k <= 0) continue; const tip = tp[i % tp.length];
      let x, y; if (k < .6) { const q = k / .6 * (ns.length - 1), j = Math.min(ns.length - 2, Math.floor(q)), f = q - j; x = lerp(ns[j][0], ns[j + 1][0], f); y = lerp(ns[j][1], ns[j + 1][1], f); } else { const q = (k - .6) / .4, top = ns[3 + i % 4]; x = lerp(top[0], tip[0], q); y = lerp(top[1], tip[1], q); }
      const X = 540 + (x - 540) * z, Y = 1000 + (y - 1000) * z; glow(i % 2 ? ORANGE : VIOLET, X, Y, 34, .9); glow(WHITE, X, Y, 10, .9); if (i == 0) target = [X, Y]; } });
  if (t < 56.9) { L(t, 51.9, 56.6, 'Estresse hídrico', 540, t < 53.5 ? 1150 : 1230, 540, 440, '#ffb347'); if (t > 53.6) L(t, 53.9, 56.7, 'Ácido abscísico — ABA', ...(target || [540, 1200]), 540, 560, '#c48bff'); }
  if (t > 56.6) { const s = 4.4, offY = -110, o = lerp(.75, .06, eio((t - 57.2) / 3.4)), sy = 960 + offY;
    xfade(ss(56.6, 57.0, t), () => { drawEpi(t, 1024, 1024, s, 0, { offY, dry: .6, go: o / .75, fo: o, f: { turg: o, dry: 1, eyes: 1, mood: lerp(1, -1, ss(57.5, 60, t)), tired: lerp(0, .55, ss(58, 61, t)), look: [Math.sin(t) * .5, .4] } });
      intake(t, 56.8, 63.5, 540, sy, 18, 26, o / .75 * .9 + .1, 'co2', 8); outflow(t, 56.8, 63.5, 540, sy, 24, 24, o / .75, 9);
      for (let i = 0; i < 18; i++) { const an = i / 18 * 6.28 + t * .6, rad = 420 - 140 * ss(57, 60, t) + Math.sin(t * 2 + i) * 30; glow(i % 2 ? ORANGE : VIOLET, 540 + Math.cos(an) * rad, sy + Math.sin(an) * rad * 1.2, 30, .8); } });
    L(t, 57.6, 62.9, 'Fechamento estomático', 540, sy, 270, 1240, '#ffb347'); L(t, 58.6, 62.9, 'Redução da transpiração', 760, 560, 790, 1320 - 80, '#7cc8ff'); }
  LQ.push(['big', 59.0, 63.05, ['ECONOMIZAR ÁGUA', 'TEM UM CUSTO!'], 290, [92, 108], ['#fff', '#ffd93b'], 1.0]);
}
function inset(t, x, y, r, o, dry) { ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.clip(); ctx.translate(x - 540, y - 960);
  drawEpi(t, 1024, 1024, r / 75 * .62, 0, { fo: o, dry: dry ? .5 : 0, go: dry ? .15 : 1, f: { turg: o, dry: dry ? 1 : 0, eyes: 1, mood: dry ? -1 : 1, tired: dry ? .5 : 0, look: [0, 0], inner: .5 } }); ctx.restore();
  ctx.save(); glow(dry ? ORANGE : GOLD, x, y, r * 1.5, .35); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); ctx.strokeStyle = dry ? '#ffb347' : '#9cff6a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r + 9, 0, 7); ctx.stroke(); ctx.restore(); }
function scene7(t) {
  const z = elerp(2.3, 1, eio((t - 63.1) / 2.0)), fy = 590; ctx.save(); ctx.translate(540, fy); ctx.scale(z, z); ctx.translate(-540, -fy);
  // left healthy
  ctx.save(); ctx.beginPath(); ctx.rect(-600, -600, 1140, 3000); ctx.clip(); drawField(t, { pal: PAL.rise, spr: SPR.rise, cz: 3 + t * .2, camH: 1.2, camX: -1.2, hy: 1060, sun: [200, 900], sunCol: ORANGE }); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(540, -600, 1140, 3000); ctx.clip(); drawField(t, { pal: PAL.dry, spr: SPR.dry, dry: true, cz: 3, camH: 1.2, camX: 1.2, hy: 1060, sun: [900, 420], sunCol: WHITE }); heat(t, 1060); ctx.restore();
  const g = ctx.createLinearGradient(500, 0, 580, 0); g.addColorStop(0, 'rgba(255,240,200,0)'); g.addColorStop(.5, 'rgba(255,240,200,.6)'); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = g; ctx.fillRect(500, 0, 80, H);
  const pl = soyPlant(270, 1340, 1.08, 1, t, 5, 'rgba(255,220,130,.8)'), pr = soyPlant(810, 1340, 1.08, .15, t, 5, 'rgba(255,240,190,.5)');
  ctx.save(); ctx.setLineDash([10, 10]); ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 3; for (const [p, x] of [[pl, 270], [pr, 810]]) { const tip = p.tips[p.tips.length - 4]; ctx.beginPath(); ctx.moveTo(x, fy + 160); ctx.lineTo(tip[0], tip[1]); ctx.stroke(); } ctx.restore();
  inset(t, 270, fy, 160, .85, false); inset(t, 810, fy, 160, .06, true);
  ctx.restore();
  const la = ss(64.6, 65, t); if (la > 0) { L(t, 64.6, 70.35, 'Hidratada', 270, 590 + 165, 270, 830, '#9cff6a'); L(t, 64.8, 70.35, 'Déficit hídrico', 810, 590 + 165, 810, 830, '#ffb347'); }
  LQ.push(['big', 65.3, 70.35, ['PEQUENAS ESTRUTURAS.', 'GRANDES IMPACTOS.'], 290, [74, 86], ['#fff', '#ffd93b'], 1.12]);
}
function scene8(t) {
  if (t < 71.5) drawEpi(t, 1024, 1024, elerp(3.6, .2, eio((t - 70.4) / 1.1)), (t - 70.4) * .2, { fo: .6, f: { turg: .6, eyes: 1, mood: 1, look: [0, -1] } });
  xfade(ss(71.0, 71.5, t) * (t < 72.7 ? 1 : 0), () => leafScene(t, elerp(10, .5, eio((t - 71.0) / 1.5)), 690, 860, true));
  const fz = ss(72.1, 72.7, t); if (fz > 0) xfade(fz, () => { const k = eio((t - 72.1) / 2.9); drawField(t, { pal: PAL.set, spr: SPR.set, cz: lerp(6, 2, k), camH: lerp(.8, 3.0, k), camX: 0, hy: lerp(980, 820, k), sun: [540, lerp(940, 790, k)], sunCol: ORANGE }); });
  if (t < 72.2) warp(t, 70.4, 72.0, '255,220,170');
  pill(t, 72.4, 75.2, 'O AGRO QUE VOCÊ NÃO VÊ', 260);
  LQ.push(['big', 72.5, 75.5, ['O SEGREDO DAS', 'PEQUENAS BOCAS'], 450, [86, 118], ['#fff', '#ffd93b'], 1.0]);
  LQ.push(['fn', () => { const a = ss(73.0, 73.4, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.font = '800 44px Nunito'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#000'; ctx.lineWidth = 10; ctx.strokeText('Estômatos e fisiologia vegetal.', 540, 690); ctx.fillStyle = '#fff'; ctx.fillText('Estômatos e fisiologia vegetal.', 540, 690); ctx.restore(); }]);
  LQ.push(['fn', () => { const k = cl((t - 73.4) / .5); if (k <= 0) return; const sc = 1 - Math.cos(k * Math.PI * 2.4) * Math.exp(-k * 5.5) * .4, pulse = 1 + .03 * Math.sin(t * 6); ctx.save(); ctx.translate(540, 820); ctx.scale(sc * pulse, sc * pulse); ctx.font = '800 42px Nunito'; const w = ctx.measureText('Siga para mais segredos do campo!').width + 90; rr(-w / 2, -44, w, 88, 44); ctx.fillStyle = '#ffd93b'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 24; ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = '#000'; ctx.lineWidth = 5; ctx.stroke(); ctx.fillStyle = '#1a1a0a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('Siga para mais segredos do campo!', 0, 3); ctx.restore(); }]);
}

// ---------- main ----------
function render(t) {
  ctx = mctx; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); LQ = [];
  let mode = 'micro';
  if (t < 7.0) { scene1(t); if (t < 5.8) mode = 'field'; }
  else if (t < 17.6) scene2(t);
  else if (t < 29.4) scene3(t);
  else if (t < 40.45) scene4(t);
  else if (t < 51.2) scene5(t);
  else if (t < 63.1) { scene6(t); if (t < 56.8) mode = 'dry'; }
  else if (t < 70.4) { scene7(t); mode = 'field'; }
  else { scene8(t); if (t > 71.2) mode = 'field'; }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  motes(t, mode); if (mode == 'micro') fgBokeh(t);
  for (const tc of [17.6, 23.95, 29.45, 34.25, 40.45, 51.2, 56.75, 63.1, 70.4]) flash(t, tc, .28, .55);
  ctx.drawImage(VIG, 0, 0);
  ctx.save(); ctx.globalAlpha = .05; ctx.translate(-(Math.floor(t * 30 * 37) % 256), -(Math.floor(t * 30 * 91) % 256)); ctx.fillStyle = GRAIN; ctx.fillRect(0, 0, W + 256, H + 256); ctx.restore();
  for (const a of LQ) { if (a[0] == 'big') bigText(t, ...a.slice(1)); else if (a[0] == 'fn') a[1](); else label(...a); }
  subtitles(t);
  // fade in/out
  if (t < .25) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .25})`; ctx.fillRect(0, 0, W, H); }
}
async function init() {
  await Promise.all(['epi.jpg', 'veins.png', 'soil.jpg'].map(n => new Promise(r => { const i = new Image(); i.onload = () => { IMG[n] = i; r(); }; i.src = n; })));
  await document.fonts.load('800 76px "Baloo 2"'); await document.fonts.load('800 36px Nunito');
  PAT.epi = mctx.createPattern(IMG['epi.jpg'], 'repeat'); PAT.veins = mctx.createPattern(IMG['veins.png'], 'repeat'); PAT.soil = mctx.createPattern(IMG['soil.jpg'], 'repeat');
  const pr = { a: '#a6e26a', b: '#3f8f2e', dk: '#163f12', rim: 'rgba(255,214,120,.9)', droop: 0, wid: 1 }, ps = { a: '#c8c060', b: '#4a7a2a', dk: '#1a2a0e', rim: 'rgba(255,150,90,.9)', droop: 0, wid: 1 }, pd = { a: '#d8c870', b: '#8a7a30', dk: '#4a3a12', rim: 'rgba(255,240,190,.6)', droop: .8, wid: .6 };
  SPR.rise = [1, 2, 3, 4].map(s => plantSprite(s, pr)); SPR.set = [1, 2, 3, 4].map(s => plantSprite(s, ps)); SPR.dry = [1, 2, 3].map(s => plantSprite(s + 10, pd));
  VIG = mk(W, H, g => { const gr = g.createRadialGradient(540, 900, 380, 540, 960, 1250); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  const gc = mk(256, 256, g => { const d = g.createImageData(256, 256); const r = rng(99); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); });
  GRAIN = mctx.createPattern(gc, 'repeat');
}
window.ready = init();
window.renderFrame = t => { render(t); return MAIN.toDataURL('image/jpeg', .92); };
window.collect = () => { for (let t = 0; t < 75; t += .1) render(t); return [...LT].sort((a, b) => a - b); };
