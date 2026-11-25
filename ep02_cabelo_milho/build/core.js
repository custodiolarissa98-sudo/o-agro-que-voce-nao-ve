// O AGRO QUE VOCÊ NÃO VÊ — núcleo compartilhado (utilitários, campo, legendas, identificações, ambiente)
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
  const rows = o.rows ?? (o.dry ? 9 : 16), sp = o.sp ?? (o.dry ? .55 : .26), rs = o.rs ?? (o.dry ? .9 : .55), spr = o.spr, PW = o.pw ?? .8;
  const k0 = Math.ceil((o.cz + (o.near ?? .45)) / sp), k1 = Math.floor((o.cz + (o.far ?? 24)) / sp);
  for (let k = k1; k >= k0; k--) { const rel = k * sp - o.cz; const s = PW * F / rel, Y = hy + o.camH * F / rel; if (Y - s * 3.2 > H + 50) continue;
    for (let r = -rows; r <= rows; r++) { const hsh = hash(k, r + 100); if (o.dry && hsh < .25) continue; const x = r * rs + (hsh - .5) * .12;
      const X = 540 + (x - o.camX) * F / rel + Math.sin(t * 1.3 + x + k) * s * .015; if (X < -s || X > W + s) continue;
      const sz = s * (.85 + hsh * .3), im = spr[Math.floor(hsh * spr.length) % spr.length], ar = im.height / im.width; ctx.drawImage(im, X - sz / 2, Y - sz * ar * .96, sz, sz * ar); } }
  g = ctx.createLinearGradient(0, hy - 30, 0, hy + 260); g.addColorStop(0, `rgba(${o.pal.haze},.85)`); g.addColorStop(1, `rgba(${o.pal.haze},0)`); ctx.fillStyle = g; ctx.fillRect(0, hy - 30, W, 290);
}

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
let KEY = new Set();
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

