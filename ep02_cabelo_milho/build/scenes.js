// O AGRO QUE VOCÊ NÃO VÊ — Episódio 02: "O Segredo do Cabelo do Milho"
// Usa core.js (utilitários, campo, legendas, identificações, ambiente).
KEY = new Set(['cabelo', 'milho', 'grão', 'fecundação', 'estilos-estigmas', 'ovário', 'óvulo', 'reprodução', 'pendão', 'pólen', 'vento', 'receptivos', 'espigas', 'receptivo', 'germina', 'tubo', 'polínico', 'dupla', 'embrião', 'endosperma', 'reservas', 'seca', 'calor', 'polinização', 'abortamento', 'falhas', 'espiga', 'agricultura', 'fundamental', 'grãos', 'produtividade', 'lavoura', 'nunca']);

function blink(t, ph = 0) { const p = (t + ph) % 3.4; return p < .14 ? Math.abs(p - .07) / .07 : 1; }

// ---------- corn plant parts ----------
function strapLeaf(x, y, len, ang, droop, wid, c1, c2, rim, t, ph) {
  const N = 14, pts = []; let a = ang, px = x, py = y; const seg = len / N;
  for (let i = 0; i <= N; i++) { pts.push([px, py, a]); a += droop / N + Math.sin(t * 1.3 + ph + i * .3) * .004; px += Math.cos(a) * seg; py += Math.sin(a) * seg; }
  const Lp = [], Rp = []; for (let i = 0; i <= N; i++) { const [qx, qy, qa] = pts[i], u = i / N, w = wid * Math.sin(Math.PI * Math.min(1, u * 1.1 + .1)) * (1 - u * .35) + wid * .15 * (1 - u), nx = -Math.sin(qa), ny = Math.cos(qa); Lp.push([qx + nx * w, qy + ny * w]); Rp.push([qx - nx * w, qy - ny * w]); }
  ctx.beginPath(); ctx.moveTo(Lp[0][0], Lp[0][1]); Lp.forEach(p => ctx.lineTo(p[0], p[1])); for (let i = Rp.length - 1; i >= 0; i--) ctx.lineTo(Rp[i][0], Rp[i][1]); ctx.closePath();
  const g = ctx.createLinearGradient(x, y, pts[N][0], pts[N][1]); g.addColorStop(0, c2); g.addColorStop(.35, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = 'rgba(235,255,200,.45)'; ctx.lineWidth = Math.max(.7, wid * .12); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
  if (rim) { ctx.strokeStyle = rim; ctx.lineWidth = Math.max(.7, wid * .12); ctx.beginPath(); Lp.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); }
}
function silks(x, y, len, ang, n, t, w = 2, spread = .7, seed = 1, dry = 0, glowA = 0) {
  const r = rng(seed); ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) { const a = ang + (r() - .5) * spread, l = len * (.55 + r() * .55), cu = (r() - .5) * 1.1 + Math.sin(t * 1.6 + i * .7) * .18;
    const ex = x + Math.cos(a + cu * .4) * l, ey = y + Math.sin(a + cu * .4) * l + l * .12, cx = x + Math.cos(a) * l * .5, cy = y + Math.sin(a) * l * .5;
    const g = ctx.createLinearGradient(x, y, ex, ey); g.addColorStop(0, dry ? '#e0d8a8' : '#f2f4c4'); g.addColorStop(.65, dry ? '#c09a68' : '#ecd29a'); g.addColorStop(1, dry ? '#7a5232' : '#cc8466');
    ctx.strokeStyle = g; ctx.lineWidth = w * (.6 + r() * .7); ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(cx, cy, ex, ey); ctx.stroke();
    if (glowA > 0 && i % 6 == 0) glow(GOLD, ex, ey, w * 6, glowA); }
}
function spindle(L, w) { ctx.beginPath(); ctx.moveTo(0, -L / 2); ctx.bezierCurveTo(w * 1.15, -L * .28, w * 1.05, L * .3, w * .32, L / 2); ctx.lineTo(-w * .32, L / 2); ctx.bezierCurveTo(-w * 1.05, L * .3, -w * 1.15, -L * .28, 0, -L / 2); ctx.closePath(); }
function huskEar(L, w, t, o = {}) { // local coords, tip up at (0,-L/2)
  const dry = o.dry || 0;
  ctx.strokeStyle = mix('#5a9a30', '#9a8a48', dry); ctx.lineWidth = w * .45; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, L * .48); ctx.lineTo(0, L * .68); ctx.stroke();
  if (o.silk !== 0) silks(0, -L * .47, L * .55 * (o.silk ?? 1), -Math.PI / 2, o.ns || 70, t, Math.max(1, w * .028), 1.4, 7, dry, o.silkGlow || 0);
  const layers = [[1.0, '#9bd05a', '#3f7a22'], [.86, '#b2dc6e', '#4f8a2c'], [.7, '#c6e888', '#5e9a34']];
  layers.forEach(([k, a, b], li) => { ctx.save(); ctx.rotate((li - 1) * .03); spindle(L * (1 - li * .03), w * k); const g = ctx.createLinearGradient(-w, 0, w, 0); g.addColorStop(0, mixh(b, '#6a5a28', dry)); g.addColorStop(.45, mixh(a, '#c8b878', dry)); g.addColorStop(1, mixh(b, '#5a4a20', dry)); ctx.fillStyle = g; ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(235,255,200,.25)'; ctx.lineWidth = Math.max(.6, w * .012); for (let i = -8; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(i * w * .02, -L / 2); ctx.quadraticCurveTo(i * w * .14, 0, i * w * .05, L / 2); ctx.stroke(); } ctx.restore(); ctx.restore(); });
  ctx.strokeStyle = o.rim || 'rgba(255,225,140,.7)'; ctx.lineWidth = Math.max(.8, w * .02); ctx.beginPath(); ctx.moveTo(0, -L / 2); ctx.bezierCurveTo(w * 1.15, -L * .28, w * 1.05, L * .3, w * .32, L / 2); ctx.stroke();
}
function tassel(x, y, L, t, dry, out) {
  ctx.lineCap = 'round'; const col = mixh('#c8c070', '#b89a50', dry);
  const br = [{ a: -Math.PI / 2, len: L, cur: 0, y0: 0 }]; for (let i = 0; i < 8; i++) { const sd = i % 2 ? 1 : -1; br.push({ a: -Math.PI / 2 + sd * (.55 + i * .07), len: L * (.78 - i * .045), cur: sd * (.8 + i * .06), y0: -i * L * .035 }); }
  for (const b of br) { let px = x, py = y + b.y0, a = b.a; const N = 9, seg = b.len / N; ctx.strokeStyle = col; ctx.lineWidth = Math.max(.8, L * .022); ctx.beginPath(); ctx.moveTo(px, py); const pts = [];
    for (let i = 0; i < N; i++) { a += b.cur * .13 + Math.sin(t * 2.2 + i + b.y0) * .012; px += Math.cos(a) * seg; py += Math.sin(a) * seg; ctx.lineTo(px, py); pts.push([px, py, a]); } ctx.stroke();
    for (const [qx, qy, qa] of pts) { ctx.fillStyle = mixh('#b8c868', '#b8a060', dry); ctx.beginPath(); ctx.ellipse(qx, qy, L * .022, L * .011, qa, 0, 7); ctx.fill();
      const sw = Math.sin(t * 3 + qx * .05) * L * .012; ctx.strokeStyle = 'rgba(240,230,170,.7)'; ctx.lineWidth = Math.max(.4, L * .004); ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(qx + sw, qy + L * .045); ctx.stroke();
      ctx.fillStyle = dry ? '#c8a050' : '#f4d44a'; ctx.beginPath(); ctx.ellipse(qx + sw, qy + L * .058, L * .009, L * .022, 0, 0, 7); ctx.fill(); if (out) out.push([qx + sw, qy + L * .075]); } }
}
function cornPlant(x, base, H, t, o = {}) {
  const h = o.health ?? 1, dry = 1 - h, r = rng(o.seed || 1), sway = Math.sin(t * .9 + (o.seed || 1)) * H * .006;
  const P = k => [x + sway * 3 * k * k, base - H * .86 * k];
  const C1 = o.warm ? mixh('#c0c858', '#c8a860', dry) : mixh('#8fd04a', '#c8b060', dry), C2 = mixh('#2f6a1e', '#7a6428', dry);
  const lv = []; for (let i = 0; i < 11; i++) { const k = .07 + i * .072; lv.push({ k, sd: i % 2 ? 1 : -1, len: H * (.3 + .2 * Math.sin(Math.PI * Math.min(1, k * 1.15))), ph: r() * 6, dr: .8 + r() * .6 }); }
  const drawL = lf => { const [px, py] = P(lf.k); strapLeaf(px, py, lf.len, -Math.PI / 2 + lf.sd * (.45 + lf.k * .2), lf.sd * (lf.dr + dry * .9), H * .021 * (1 - dry * .55), C1, C2, o.rim, t, lf.ph); };
  lv.filter((_, i) => i % 2).forEach(drawL);
  ctx.lineCap = 'round'; for (let i = 0; i < 16; i++) { const [a, b] = P(i / 16), [c, d] = P((i + 1) / 16); ctx.strokeStyle = mix(o.warm ? '#8aa040' : '#6aa83a', '#a89a50', dry); ctx.lineWidth = H * .028 * (1 - i / 16 * .55); ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); }
  lv.forEach(lf => { const [px, py] = P(lf.k); ctx.fillStyle = 'rgba(220,240,170,.5)'; ctx.beginPath(); ctx.ellipse(px, py, H * .016, H * .004, 0, 0, 7); ctx.fill(); });
  let ear = null, earTip = null;
  if (o.ear !== false) { const [ex0, ey0] = P(.42), ang = .42, L = H * .17, w = H * .034, ex = ex0 + H * .045, ey = ey0 - H * .05;
    ctx.save(); ctx.translate(ex, ey); ctx.rotate(ang); huskEar(L, w, t, { dry, silk: o.silk ?? 1, ns: 40, rim: o.rim }); ctx.restore(); ear = [ex, ey]; earTip = [ex + Math.sin(ang) * L * .5, ey - Math.cos(ang) * L * .5]; }
  lv.filter((_, i) => !(i % 2)).forEach(drawL);
  const [tx, ty] = P(1); tassel(tx, ty, H * .15, t, dry, o.anthers);
  return { ear, earTip, tas: [tx, ty - H * .07] };
}
function cornSprite(seed, p) { return mk(170, 510, (g) => { const old = ctx; ctx = g; cornPlant(85, 500, 490, seed, { seed, health: p.h, rim: p.rim, warm: p.warm }); ctx = old; }); }

// ---------- pollen ----------
const POLD = []; { const r = rng(61); for (let i = 0; i < 150; i++) { const d = Math.sqrt(r()) * .93; POLD.push([r() * 6.283, d, .028 + r() * .022]); } }
function pollen(x, y, r, t, o = {}) {
  ctx.save(); ctx.translate(x, y); const sq = o.squash || 0; ctx.scale(1 + sq * .14, 1 - sq * .14); ctx.rotate(o.rot || 0);
  glow(YEL, 0, 0, r * 2.3, .35 * (o.glow ?? 1));
  const hy = o.hyd || 0; let g = ctx.createRadialGradient(-r * .35, -r * .4, r * .08, 0, 0, r); g.addColorStop(0, mixh('#fff2b0', '#f4fbff', hy * .6)); g.addColorStop(.55, mixh('#f0c850', '#f2dc8a', hy * .5)); g.addColorStop(1, '#a8741c'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
  for (const [a, d, s] of POLD) { const px = Math.cos(a) * d * r, py = Math.sin(a) * d * r, f = 1 - d * d * .55, lit = cl(.55 - (px + py) / (2 * r) * .6); ctx.fillStyle = 'rgba(110,70,10,.22)'; ctx.beginPath(); ctx.arc(px + r * .012, py + r * .014, r * s * f, 0, 7); ctx.fill(); ctx.fillStyle = `rgba(255,250,215,${.2 + .45 * lit})`; ctx.beginPath(); ctx.arc(px, py, r * s * f * .8, 0, 7); ctx.fill(); }
  const pa = o.poreA ?? -.7, ppx = Math.cos(pa) * r * .7, ppy = Math.sin(pa) * r * .7; ctx.strokeStyle = 'rgba(150,100,20,.85)'; ctx.lineWidth = r * .055; ctx.beginPath(); ctx.ellipse(ppx, ppy, r * .12, r * .085, pa, 0, 7); ctx.stroke(); ctx.fillStyle = 'rgba(255,240,190,.85)'; ctx.beginPath(); ctx.ellipse(ppx, ppy, r * .065, r * .045, pa, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(255,250,225,.55)'; ctx.lineWidth = r * .035; ctx.beginPath(); ctx.arc(0, 0, r * .97, -2.6, -1.0); ctx.stroke();
  if (o.face) { const lk = o.look || [0, 0], mood = o.mood ?? 1, bl = blink(t, o.ph || 0) * (o.eyeOpen ?? 1);
    for (const sd of [-1, 1]) { const ex = sd * r * .3, ey = -r * .1, er = r * .14; ctx.fillStyle = 'rgba(255,130,120,.35)'; ctx.beginPath(); ctx.ellipse(sd * r * .5, r * .17, r * .12, r * .07, 0, 0, 7); ctx.fill();
      ctx.save(); ctx.translate(ex, ey); ctx.scale(1, Math.max(.07, bl)); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(0, 0, er * .82, er * 1.05, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#2a1a05'; ctx.beginPath(); ctx.ellipse(lk[0] * er * .32, lk[1] * er * .35 + er * .08, er * .5, er * .6, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(lk[0] * er * .32 - er * .18, lk[1] * er * .35 - er * .15, er * .17, 0, 7); ctx.fill(); ctx.restore();
      if (o.brow) { ctx.strokeStyle = 'rgba(90,55,5,.9)'; ctx.lineWidth = r * .035; ctx.beginPath(); ctx.moveTo(ex - er * .8, ey - er * 1.35 + sd * o.brow * er * .25); ctx.lineTo(ex + er * .8, ey - er * 1.35 - sd * o.brow * er * .25); ctx.stroke(); } }
    const mw = r * .2, my = r * .2; ctx.strokeStyle = 'rgba(90,55,5,.9)'; ctx.lineWidth = r * .04; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-mw, my); ctx.quadraticCurveTo(0, my + mood * mw * .95, mw, my); ctx.stroke(); }
  ctx.restore();
}

// ---------- ear interior (cob, ovaries, silks) ----------
const EAR = { cx: 540, cy: 1000, L: 1500, R: 200 };
const TH = [-1.40, -1.05, -.70, -.35, 0, .35, .70, 1.05, 1.40], NJ = 26;
function Rf(u, E) { return E.R * (.3 + .7 * Math.pow(Math.sin(Math.min(1, u * 1.25) * Math.PI / 2), .7)) * (1 - .08 * u); }
function ePos(ci, j, E) { const u = .05 + j * .9 / (NJ - 1), th = TH[ci]; return [E.cx + Math.sin(th) * Rf(u, E), E.cy - E.L / 2 + u * E.L, u]; }
function silkPath(ci, j, E, t) { const th = TH[ci], u0 = .05 + j * .9 / (NJ - 1), pts = [], top = E.cy - E.L / 2;
  pts.push([E.cx + Math.sin(th) * 80 + Math.sin(t * 1.4 + ci + j) * 14, top - 330]); pts.push([E.cx + Math.sin(th) * 34 + Math.sin(t * 1.4 + ci) * 6, top - 160]); pts.push([E.cx + Math.sin(th) * 14, top - 40]);
  for (let v = 0; v <= u0 + 1e-6; v += Math.max(.02, u0 / 12)) pts.push([E.cx + Math.sin(th) * (Rf(v, E) + 10 + (u0 - v) * 26), top + v * E.L]); pts.push(ePos(ci, j, E).slice(0, 2)); return pts; }
function along(pts, k) { let tot = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); tot += d; } let s = cl(k) * tot; for (let i = 0; i < seg.length; i++) { if (s <= seg[i]) { const f = s / seg[i]; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } s -= seg[i]; } return pts[pts.length - 1]; }
const HI = [5, 14];
function kernelState(kind, t, mode) { // returns [size, color]
  if (mode == 'ovary') return [1, '#dcefb4'];
  if (mode == 'full') return [1, '#f6c232'];
  const dv = ss(57.4, 61.4, t);
  if (kind == 'ok') return [.75 + .25 * dv, mixh('#dcefb4', '#f6c232', dv)];
  if (kind == 'unfert') { const k = ss(57.6, 59.2, t); return [lerp(.75, .42, k), mixh('#dcefb4', '#a8a490', k)]; }
  const g = ss(57.4, 59.2, t), s = ss(59.4, 60.6, t); return [.75 + .15 * g - .38 * s, mixh(mixh('#dcefb4', '#f0c040', g), '#8a5a2a', s)];
}
function failKind(ci, j) { const u = .05 + j * .9 / (NJ - 1), h = hash(ci + 3, j + 50); if (u < .2 || h < .09) return 'unfert'; if (h < .17 || u < .27) return 'abort'; return 'ok'; }
function earGrid(t, E, o = {}) {
  const mode = o.mode || 'ovary';
  ctx.beginPath(); for (let u = 0; u <= 1.001; u += .02) ctx.lineTo(E.cx - Rf(u, E), E.cy - E.L / 2 + u * E.L); for (let u = 1; u >= -.001; u -= .02) ctx.lineTo(E.cx + Rf(u, E), E.cy - E.L / 2 + u * E.L); ctx.closePath();
  let g = ctx.createLinearGradient(E.cx - E.R, 0, E.cx + E.R, 0); g.addColorStop(0, '#4a3a20'); g.addColorStop(.5, mode == 'ovary' ? '#e6dfae' : '#e8d8b8'); g.addColorStop(1, '#4a3a20'); ctx.fillStyle = g; ctx.fill();
  const pos = {};
  for (const ci of [0, 8, 1, 7, 2, 6, 3, 5, 4]) { const c = Math.cos(TH[ci]);
    for (let j = 0; j < NJ; j++) { const [x, y, u] = ePos(ci, j, E), R0 = Rf(u, E), rx = R0 * .35 * c * .5 * .96, ry = E.L * .9 / (NJ - 1) * .5 * .94;
      const kind = o.fail ? failKind(ci, j) : 'ok'; let [sz, col] = kernelState(kind, t, o.fail ? 'fail' : mode); if (o.fail && o.final) { sz = kind == 'ok' ? 1 : kind == 'unfert' ? .38 : .5; col = kind == 'ok' ? '#f6c232' : kind == 'unfert' ? '#b0aa94' : '#8a5a2a'; }
      const sh = mixh(col, '#1a1005', (1 - c) * .55); ctx.fillStyle = sh; ctx.beginPath(); ctx.ellipse(x, y, rx * sz, ry * sz, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(60,40,10,.35)'; ctx.lineWidth = Math.max(.6, rx * .06); ctx.stroke();
      ctx.fillStyle = `rgba(255,255,235,${.35 * c})`; ctx.beginPath(); ctx.ellipse(x - rx * .3 * sz, y - ry * .35 * sz, rx * .32 * sz, ry * .22 * sz, 0, 0, 7); ctx.fill();
      pos[ci + ',' + j] = [x, y, rx, ry, kind];
      if (o.detail > 0 && ci == HI[0] && j == HI[1]) ovuleInOvary(x, y, rx, ry, o.detail, t); } }
  return pos;
}
function ovuleInOvary(x, y, rx, ry, a, t) { ctx.save(); ctx.globalAlpha = a; let g = ctx.createRadialGradient(x, y, 0, x, y, rx * .7); g.addColorStop(0, '#fffbe8'); g.addColorStop(1, '#efe3b0'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y + ry * .05, rx * .62, ry * .7, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(170,150,80,.8)'; ctx.lineWidth = rx * .04; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x, y + ry * .05, rx * .5, ry * .58, 0, 0, 7); ctx.stroke(); glow(GOLD, x, y, rx * .5, .5 + .2 * Math.sin(t * 3)); ctx.fillStyle = 'rgba(255,250,220,.9)'; ctx.beginPath(); ctx.ellipse(x, y, rx * .2, ry * .34, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#e8c870'; ctx.beginPath(); ctx.arc(x, y + ry * .22, rx * .07, 0, 7); ctx.fill(); ctx.restore(); }
function earSilks(t, E, hiK) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let ci = 1; ci < 8; ci++) for (let j = ci % 2; j < NJ; j += 2) { if (ci == HI[0] && j == HI[1]) continue; const p = silkPath(ci, j, E, t); ctx.strokeStyle = `rgba(248,240,190,${.42 + .33 * Math.cos(TH[ci])})`; ctx.lineWidth = 3.2; ctx.beginPath(); p.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.stroke(); }
  if (hiK != null) { const p = silkPath(HI[0], HI[1], E, t), a = ss(8.6, 9.2, t); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(255,205,80,.95)'; ctx.lineWidth = 6; ctx.beginPath(); p.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.stroke(); ctx.strokeStyle = 'rgba(255,250,215,.9)'; ctx.lineWidth = 2; ctx.stroke();
    const zf = 1 - .85 * ss(13.0, 14.0, t); for (let i = 0; i <= 20; i++) { const q = along(p, i / 20); glow(GOLD, q[0], q[1], 22, .35 * zf); } const hp = along(p, hiK); glow(WHITE, hp[0], hp[1], 26, zf); glow(GOLD, hp[0], hp[1], 70, .9 * zf); ctx.restore(); return hp; }
}
function huskBands(E, front) { for (const sd of [-1, 1]) { ctx.beginPath(); const top = E.cy - E.L / 2;
  ctx.moveTo(E.cx + sd * 10, top - 150); for (let u = 0; u <= 1.001; u += .04) ctx.lineTo(E.cx + sd * (Rf(u, E) + (front ? 95 : 150) + 40 * Math.sin(u * 3)), top + u * E.L); ctx.lineTo(E.cx + sd * (Rf(1, E) + 10), E.cy + E.L / 2 + 70);
  for (let u = 1; u >= 0; u -= .04) ctx.lineTo(E.cx + sd * (Rf(u, E) + (front ? 32 : 0)), top + u * E.L); ctx.closePath();
  const g = ctx.createLinearGradient(E.cx + sd * E.R, 0, E.cx + sd * (E.R + 150), 0); if (front) { g.addColorStop(0, 'rgba(200,235,140,.92)'); g.addColorStop(1, 'rgba(70,130,40,.95)'); } else { g.addColorStop(0, '#1d3d16'); g.addColorStop(1, '#0d230c'); } ctx.fillStyle = g; ctx.fill();
  if (front) { ctx.strokeStyle = 'rgba(240,255,200,.4)'; ctx.lineWidth = 2; for (let q = 1; q < 4; q++) { ctx.beginPath(); for (let u = 0; u <= 1.001; u += .04) ctx.lineTo(E.cx + sd * (Rf(u, E) + 32 + q * 16 + 10 * Math.sin(u * 3)), top + u * E.L); ctx.stroke(); } } } }
function warmBg(t, warm = 0, seed = 11) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, warm ? '#3a2440' : '#1c3a26'); g.addColorStop(.45, warm ? '#e0884a' : '#cfa24c'); g.addColorStop(1, warm ? '#3a3010' : '#1e3c18'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const r = rng(seed); for (let i = 0; i < 22; i++) { const x = (r() * W + t * 14 * (r() - .3) + W) % W, y = r() * H, s = 50 + r() * 140; ctx.globalAlpha = .42; ctx.drawImage(r() < .6 ? BK_GOLD : BK_GREEN, x - s, y - s, 2 * s, 2 * s); ctx.globalAlpha = 1; }
}
function earCut(t, cam, o = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#13301c'); g.addColorStop(1, '#06140a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const r = rng(5); for (let i = 0; i < 14; i++) { const x = r() * W, y = r() * H, s = 40 + r() * 100; ctx.globalAlpha = .3; ctx.drawImage(BK_GOLD, x - s, y - s, 2 * s, 2 * s); ctx.globalAlpha = 1; }
  ctx.save(); ctx.translate(540, 960); ctx.scale(cam[2], cam[2]); ctx.translate(-cam[0], -cam[1]);
  huskBands(EAR, false); const pos = earGrid(t, EAR, o); const hp = earSilks(t, EAR, o.hiK); huskBands(EAR, true);
  ctx.restore(); return { pos, hp };
}
const es = (x, y, cam) => [540 + (x - cam[0]) * cam[2], 960 + (y - cam[1]) * cam[2]];

// ---------- scene 1 ----------
function cornField(t, o) { drawField(t, Object.assign({ spr: SPR.corn, pw: 1.0, rows: 11, sp: .32, rs: .8, far: 32, near: .8 }, o)); }
function earClose(t, z, warm) {
  warmBg(t, warm);
  ctx.save(); ctx.translate(540, 960); ctx.scale(z, z); ctx.rotate(Math.sin(t * .3) * .02); ctx.translate(-560, -1000);
  ctx.strokeStyle = warm ? '#7a8a38' : '#5a9a32'; ctx.lineWidth = 70; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(300, 2200); ctx.lineTo(330, -300); ctx.stroke(); ctx.fillStyle = 'rgba(230,250,180,.5)'; ctx.fillRect(290, 1500, 80, 14);
  strapLeaf(330, 1520, 1300, -2.4, -1.2, 70, warm ? '#c0c060' : '#8fd04a', warm ? '#4a5a20' : '#2f6a1e', 'rgba(255,220,140,.8)', t, 1);
  ctx.save(); ctx.translate(560, 1000); ctx.rotate(.12 + Math.sin(t * .8) * .01); huskEar(1150, 230, t, { ns: 110, silkGlow: .5, rim: warm ? 'rgba(255,170,90,.9)' : null }); ctx.restore();
  strapLeaf(320, 1150, 1400, -.25, 1.3, 85, warm ? '#c8c860' : '#9bd858', warm ? '#4a5a20' : '#2a6418', 'rgba(255,220,140,.8)', t, 2);
  ctx.restore();
}
function cam2(t) {
  if (t < 7.6) return [540, 1000, elerp(2.0, 1.0, eio((t - 5.2) / 2.4))];
  const path = silkPath(HI[0], HI[1], EAR, t), k = eio((t - 9.0) / 4.0), pp = along(path, k), ov = ePos(HI[0], HI[1], EAR);
  if (t < 13.2) { const f = ss(9.0, 10.3, t); return [lerp(540, pp[0], f), lerp(1000 + Math.sin(t) * 10, pp[1], f), lerp(1.0, 1.7, f)]; }
  const f = eio((t - 13.2) / 1.9); return [lerp(pp[0], ov[0], f), lerp(pp[1], ov[1], f), elerp(1.7, 5.6, f) * (1 + .01 * Math.sin(t))];
}
function scene1(t) {
  if (t < 3.3) cornField(t, { pal: PAL.rise, cz: t * 6.5, camH: lerp(3.6, 2.7, eio(t / 3)), camX: .4 + Math.sin(t * .4) * .2, hy: lerp(720, 600, eio(t / 3)), sun: [760, lerp(680, 520, eio(t / 3))], sunCol: ORANGE });
  xfade(ss(2.6, 3.25, t), () => earClose(t, elerp(.62, 2.4, eio((t - 2.7) / 3.4)), false));
  xfade(ss(5.1, 6.3, t), () => earCut(t, cam2(t)));
  warp(t, 5.1, 7.0, '255,230,170');
  pill(t, .2, 5.6, 'O AGRO QUE VOCÊ NÃO VÊ', 260);
  LQ.push(['big', 2.4, 6.9, ['CADA CABELO,', 'UM GRÃO?!'], 400, [96, 116], ['#fff', '#ffd93b']]);
}
function scene2(t) {
  const cam = cam2(t), hk = eio((t - 9.0) / 4.0); const { pos, hp } = earCut(t, cam, { hiK: t > 8.6 ? hk : null, detail: ss(14.0, 15.0, t) });
  const ov = ePos(HI[0], HI[1], EAR); const os = es(ov[0], ov[1], cam);
  L(t, 7.8, 11.4, 'Espiga', ...es(EAR.cx - 290, 1150, cam), 300, 560);
  if (hp) L(t, 9.2, 13.6, 'Estilo-estigma', ...es(hp[0], hp[1], cam), 760, 420, '#ffd93b');
  L(t, 11.9, 17.5, 'Ovário', os[0] + 150, os[1] - 40, 790, 560);
  L(t, 13.6, 17.5, 'Óvulo', os[0], os[1] + 20, 290, 600);
}

// ---------- scene 3 ----------
const SKY = (t, warm) => { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5a7aa8'); g.addColorStop(.5, '#f0c878'); g.addColorStop(1, '#5a7a30'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); glow(GOLD, 820, 380, 600, .6); glow(WHITE, 820, 380, 160, .8); const r = rng(13); for (let i = 0; i < 18; i++) { const x = r() * W, y = r() * H, s = 40 + r() * 120; ctx.globalAlpha = .38; ctx.drawImage(r() < .5 ? BK_GOLD : BK_GREEN, x - s, y - s, 2 * s, 2 * s); ctx.globalAlpha = 1; } };
function cam3(t) { const k = eio((t - 17.6) / 2.6); return [lerp(640, 600, k), lerp(1900, 470, k), lerp(.95, 1.5, k) * (1 + .06 * ss(20.2, 22.6, t))]; }
function plantView(t, cam, o = {}) { SKY(t); const an = []; ctx.save(); ctx.translate(540, 960); ctx.scale(cam[2], cam[2]); ctx.translate(-cam[0], -cam[1]); const p = cornPlant(540, 3000, 2900, t, Object.assign({ seed: 4, rim: 'rgba(255,220,130,.85)', anthers: an }, o)); ctx.restore(); return { p, an }; }
function heroFlight(t) { // pollen hero position in micro flight
  return [540 + Math.sin(t * 1.1) * 60 + ss(26.6, 29.3, t) * 120, 860 + Math.sin(t * 1.7) * 40 + ss(26.6, 29.3, t) * 60]; }
function silkStrand(x0, y0, x1, y1, w, t, o = {}) {
  const ang = Math.atan2(y1 - y0, x1 - x0), len = Math.hypot(x1 - x0, y1 - y0);
  ctx.save(); ctx.translate(x0, y0); ctx.rotate(ang);
  const r = rng(o.seed || 21); for (const sd of [-1, 1]) for (let x = 20; x < len; x += 34) { const hl = 50 + r() * 80, bend = (r() - .5) * .5 + Math.sin(t * 2 + x * .01) * .08, hx = x + Math.sin(bend) * hl, hy = sd * (w / 2 + Math.cos(bend) * hl);
    ctx.strokeStyle = 'rgba(245,240,200,.75)'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, sd * w * .45); ctx.quadraticCurveTo(x + Math.sin(bend) * hl * .3, sd * (w / 2 + hl * .5), hx, hy); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,240,.85)'; ctx.beginPath(); ctx.arc(hx, hy, 6, 0, 7); ctx.fill(); glow(WHITE, hx, hy, 10, .4); }
  ctx.beginPath(); ctx.rect(0, -w / 2, len, w); ctx.save(); ctx.clip(); ctx.fillStyle = PAT.silk; ctx.save(); ctx.scale(.55, .55); ctx.translate(-t * 4, 0); ctx.fillRect(-100, -w * 2, len * 2 + 400, w * 4); ctx.restore();
  const g = ctx.createLinearGradient(0, -w / 2, 0, w / 2); g.addColorStop(0, 'rgba(255,255,230,.35)'); g.addColorStop(.3, 'rgba(255,255,230,.05)'); g.addColorStop(.8, 'rgba(40,40,10,.25)'); g.addColorStop(1, 'rgba(20,20,5,.55)'); ctx.fillStyle = g; ctx.fillRect(0, -w / 2, len, w); ctx.restore();
  ctx.restore();
}
function crowd(t, n, seed, sizeMul = 1) { const r = rng(seed); for (let i = 0; i < n; i++) { const d = .3 + r() * 1.4, y0 = r() * H, sp = 140 + r() * 200, ph = r() * 10, rr0 = (14 + r() * 26) * d * sizeMul; const x = ((r() * W - t * sp * d * .6 + ph * 200) % (W + 300) + W + 300) % (W + 300) - 150, y = y0 + Math.sin(t + ph) * 40 + t * 20 * d % H;
  ctx.globalAlpha = d > 1.3 ? .45 : .9; pollen(x, ((y % H) + H) % H, rr0, t, { rot: t * (r() - .5), glow: .4 }); ctx.globalAlpha = 1; } }
function windLines(t, a = 1) { ctx.save(); ctx.strokeStyle = `rgba(255,250,225,${.25 * a})`; ctx.lineWidth = 3; ctx.lineCap = 'round'; const r = rng(88); for (let i = 0; i < 16; i++) { const y = r() * H, sp = 600 + r() * 600, x = W - ((t * sp + r() * 2000) % (W + 800)); ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + 120, y - 20, x + 200, y + 20, x + 340, y); ctx.stroke(); } ctx.restore(); }
function scene3(t) {
  let tasP = null, anP = null;
  if (t < 22.9) { const cam = cam3(t); const { p, an } = plantView(t, cam); tasP = es(p.tas[0], p.tas[1], cam);
    const pick = an[Math.floor(an.length * .55)] || p.tas; anP = es(pick[0], pick[1], cam);
    const shed = ss(19.4, 20.4, t); if (shed > 0) { for (let i = 0; i < 90; i++) { const src = an[(i * 7) % an.length]; if (!src) break; const per = 2.2, k = ((t + i * .37) % per) / per; const s0 = es(src[0], src[1], cam);
      const x = s0[0] + k * 520 + Math.sin(k * 6 + i) * 30, y = s0[1] + k * 260 + Math.sin(k * 4 + i * 2) * 40; glow(YEL, x, y, 10 + k * 8, shed * (1 - k) * .9); glow(WHITE, x, y, 3, shed * (1 - k)); } } }
  if (t > 22.3) xfade(ss(22.3, 22.9, t), () => { SKY(t); ctx.save(); ctx.globalAlpha = .55; ctx.filter = 'none';
      for (let i = 0; i < 3; i++) { const x = W + 300 - ((t * 260 + i * 700) % (W + 1200)); strapLeaf(x, 1900, 1600, -1.9 + i * .2, .9, 120, '#4a7a2a', '#1a3a10', null, t, i); } ctx.restore();
    windLines(t); crowd(t, 16, 31);
    if (t > 26.2) { const a = ss(26.2, 27.6, t), off = (1 - eio((t - 26.2) / 3)) * 700; ctx.save(); ctx.globalAlpha = a; silkStrand(1300 + off, 1500, 560 + off, 380, 120, t, { seed: 4 }); silkStrand(1400 + off, 1200, 800 + off, 200, 90, t, { seed: 5 }); ctx.restore(); }
    const [hx, hy] = heroFlight(t); pollen(hx, hy, 150, t, { face: 1, rot: Math.sin(t * .8) * .2, look: [t > 26.5 ? .8 : Math.sin(t * .9) * .5, -.2], mood: 1 });
    crowd(t, 5, 32, 2.2); });
  warp(t, 22.2, 23.6, '255,235,160');
  if (tasP) { L(t, 18.6, 22.4, 'Pendão', tasP[0], tasP[1], 300, 330); L(t, 20.2, 22.4, 'Antera', anP[0], anP[1], 800, 420); }
  if (t > 23) { const [hx, hy] = heroFlight(t); L(t, 23.4, 26.9, 'Grão de pólen', hx - 90, hy - 110, 300, 380); L(t, 26.4, 29.35, 'Polinização', 820 - (1 - eio((t - 26.2) / 3)) * 300, 900, 720, 380, '#ffd93b'); }
}

// ---------- scene 4 ----------
const SA = { x0: -120, y0: 1330, x1: 1220, y1: 700, w: 320 };
function landPos(t) { const a = Math.atan2(SA.y1 - SA.y0, SA.x1 - SA.x0), cx = lerp(SA.x0, SA.x1, .45), cy = lerp(SA.y0, SA.y1, .45), n = [Math.sin(a), -Math.cos(a)], r = 140;
  const fin = [cx + n[0] * (SA.w / 2 + r * .55), cy + n[1] * (SA.w / 2 + r * .55)]; const k = eio((t - 29.3) / 1.1); return [lerp(fin[0] - 420, fin[0], k), lerp(fin[1] - 620, fin[1], k) - Math.sin(cl((t - 30.4) / .5) * Math.PI) * 30 * (t > 30.4 ? 1 : 0), n, a]; }
function tissue(t, camX) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2a4a2a'); g.addColorStop(.22, '#cfe0a0'); g.addColorStop(1, '#3a4a20'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 420, W, H - 420); ctx.clip(); ctx.translate(-camX, 0); ctx.fillStyle = PAT.silk; ctx.save(); ctx.translate(0, 420); ctx.scale(.9, .9); ctx.fillRect(camX / .9 - 200, 0, W / .9 + 400, 2000); ctx.restore(); ctx.restore();
  const gg = ctx.createLinearGradient(0, 400, 0, H); gg.addColorStop(0, 'rgba(255,250,220,.4)'); gg.addColorStop(.1, 'rgba(0,0,0,0)'); gg.addColorStop(1, 'rgba(10,25,5,.55)'); ctx.fillStyle = gg; ctx.fillRect(0, 400, W, H - 400);
  ctx.save(); ctx.translate(-camX, 0); ctx.strokeStyle = 'rgba(255,255,235,.8)'; ctx.lineWidth = 6; ctx.beginPath(); for (let x = camX - 50; x < camX + W + 50; x += 20) ctx.lineTo(x, 420 + Math.sin(x * .01) * 6); ctx.stroke(); ctx.restore();
}
function tubeY(x) { return x < 700 ? 440 + (1 - Math.pow(1 - cl((x - 380) / 320), 2)) * 520 : 960 + Math.sin((x - 700) / 420) * 70; }
function scene4(t) {
  let hero = null;
  if (t < 34.6) { SKY(t); ctx.save(); ctx.globalAlpha = .8; crowd(t * .4, 6, 41); ctx.restore(); silkStrand(SA.x0, SA.y0, SA.x1, SA.y1, SA.w, t, { seed: 7 });
    const [px, py, n, a] = landPos(t); const sq = t > 30.4 ? Math.sin(cl((t - 30.4) / .45) * Math.PI) * .6 : 0, hyd = ss(31.4, 33.2, t), r = 140 * (1 + .07 * hyd);
    if (t > 31.3 && t < 33.6) for (let i = 0; i < 14; i++) { const k = ((t * .9 + i * .23) % 1); glow(BLUE, lerp(px - n[0] * 260 + Math.sin(i) * 120, px, k), lerp(py - n[1] * 260 + Math.cos(i) * 60, py, k), 18, (1 - k) * .9); }
    const tk = ss(32.8, 34.3, t); if (tk > 0) { const bx = px - n[0] * r * .95, by = py - n[1] * r * .95, ex = px - n[0] * (r + 40 + 120 * tk), ey = py - n[1] * (r + 40 + 120 * tk); ctx.strokeStyle = 'rgba(255,240,180,.9)'; ctx.lineWidth = 30; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ex, ey); ctx.stroke(); glow(GOLD, ex, ey, 60, .9); }
    pollen(px, py, r, t, { face: 1, squash: sq, hyd, poreA: Math.atan2(-n[1], -n[0]), look: t < 30.4 ? [.3, .8] : [Math.sin(t * 2) * .4, .2], mood: 1, brow: t > 32.7 ? -.6 : 0, glow: .6 + hyd });
    hero = [px, py]; }
  let tipS = null;
  xfade(ss(34.1, 34.6, t), () => { const k = cl((t - 34.3) / 6.1), tipX = lerp(380, 3700, Math.pow(k, .9)), camX = Math.max(0, tipX - 600); tissue(t, camX);
    pollen(330 - camX, 300, 130, t, { face: 1, look: [.7, .6], mood: 1, poreA: 1.2 });
    ctx.save(); ctx.translate(-camX, 0); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; const pts = []; for (let x = 380; x <= tipX; x += 12) pts.push([x, tubeY(x)]); pts.push([tipX, tubeY(tipX)]);
    const path = () => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(380, 360)); };
    path(); ctx.strokeStyle = 'rgba(255,225,140,.35)'; ctx.lineWidth = 58; ctx.stroke(); path(); ctx.strokeStyle = 'rgba(255,240,190,.8)'; ctx.lineWidth = 36; ctx.stroke(); path(); ctx.strokeStyle = 'rgba(255,255,235,.9)'; ctx.lineWidth = 10; ctx.stroke();
    for (let i = 0; i < pts.length; i += 5) { const f = ((i * 3 + t * 40) % 20) / 20; glow(GOLD, pts[i][0], pts[i][1] + Math.sin(i) * 8, 10 + f * 8, .5); }
    const [tx, ty] = pts[pts.length - 1]; glow(GOLD, tx, ty, 110, .9); glow(WHITE, tx, ty, 34, 1);
    for (const [dx, dy] of [[-26, -8], [-44, 10]]) { ctx.fillStyle = '#fffbe8'; ctx.beginPath(); ctx.ellipse(tx + dx, ty + dy, 11, 7, .2, 0, 7); ctx.fill(); glow(YEL, tx + dx, ty + dy, 22, .8); }
    ctx.fillStyle = 'rgba(200,170,80,.9)'; ctx.beginPath(); ctx.arc(tx - 78, ty + 2, 13, 0, 7); ctx.fill(); ctx.restore(); tipS = [tx - camX, ty]; });
  warp(t, 34.0, 35.2, '255,240,190');
  if (hero) { L(t, 29.9, 33.3, 'Grão de pólen', hero[0], hero[1] - 150, 330, 420); L(t, 31.8, 34.3, 'Germinação do pólen', hero[0] - 60, hero[1] + 120, 650, 1240, '#7cc8ff'); }
  if (tipS && t > 34.6) { L(t, 34.9, 40.35, 'Tubo polínico', tipS[0], tipS[1], 700, 640, '#ffd93b'); L(t, 35.9, 40.35, 'Estilo-estigma', 300, 1250, 300, 1150); }
}

// ---------- scene 5 ----------
const OV = { x: 540, y: 860, s: 330 };
function sacPos(name) { const { x, y, s } = OV; return { egg: [x - s * .02, y + s * .36], syn1: [x - s * .15, y + s * .5], syn2: [x + s * .13, y + s * .52], pol1: [x - s * .07, y - s * .02], pol2: [x + s * .07, y + s * .02], anti: [x, y - s * .5], mic: [x, y + s * 1.0], cen: [x, y] }[name]; }
function tubeOv(k) { const { x, y, s } = OV; const P = [[x - s * 1.6, y + s * 2.6], [x - s * .8, y + s * 1.5], [x, y + s * 1.08], [x + s * .1, y + s * .7], [x + s * .12, y + s * .56]]; return P; }
function ovuleScene(t) {
  const g = ctx.createRadialGradient(540, 860, 100, 540, 960, 1300); g.addColorStop(0, '#2a4a26'); g.addColorStop(1, '#081408'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const r0 = rng(23); for (let i = 0; i < 14; i++) { const x = r0() * W, y = r0() * H, s = 40 + r0() * 100; ctx.globalAlpha = .3; ctx.drawImage(BK_GOLD, x - s, y - s, 2 * s, 2 * s); ctx.globalAlpha = 1; }
  const { x, y, s } = OV; const z = 1 + .03 * Math.sin(t * .5);
  ctx.save(); ctx.translate(x, y); ctx.scale(z, z); ctx.translate(-x, -y);
  // ovary wall & integuments
  let gg = ctx.createRadialGradient(x - s * .3, y - s * .4, s * .2, x, y, s * 1.35); gg.addColorStop(0, '#cde89a'); gg.addColorStop(1, '#4a7a2c'); ctx.fillStyle = gg; ctx.beginPath(); ctx.ellipse(x, y, s * 1.0, s * 1.32, 0, 0, 7); ctx.fill();
  for (const [k, c] of [[.86, '#f3ecc4'], [.76, '#e8dca8']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, s * .8 * k / .86, s * 1.12 * k / .86, 0, Math.PI * .56, Math.PI * .44 + Math.PI * 2, false); ctx.lineTo(x, y + s * 1.02); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(150,130,70,.7)'; ctx.lineWidth = 4; ctx.stroke(); }
  gg = ctx.createRadialGradient(x, y, s * .1, x, y, s * .7); gg.addColorStop(0, 'rgba(255,253,235,.95)'); gg.addColorStop(1, 'rgba(240,230,190,.9)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.ellipse(x, y, s * .38, s * .66, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(200,170,90,.8)'; ctx.lineWidth = 3; ctx.stroke(); glow(GOLD, x, y, s * .6, .25);
  const P = sacPos;
  // antipodals
  for (let i = 0; i < 5; i++) { const [ax, ay] = P('anti'); ctx.fillStyle = 'rgba(220,230,170,.95)'; ctx.beginPath(); ctx.arc(ax + (i - 2) * s * .07, ay + Math.abs(i - 2) * s * .03, s * .055, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(150,140,80,.8)'; ctx.lineWidth = 2; ctx.stroke(); }
  // synergids
  for (const n of ['syn1', 'syn2']) { const [sx, sy] = P(n); ctx.fillStyle = 'rgba(235,225,180,.95)'; ctx.beginPath(); ctx.ellipse(sx, sy, s * .075, s * .11, n == 'syn1' ? .3 : -.3, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(150,140,80,.8)'; ctx.stroke(); }
  // egg / zygote
  const zy = ss(43.4, 44.0, t), [ex, ey] = P('egg'); ctx.fillStyle = mix('#f6e6b0', '#d8f0a0', zy); ctx.beginPath(); ctx.arc(ex, ey, s * .13 * (1 + .15 * zy), 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(160,140,70,.9)'; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = mix('#c8a050', '#8fd04a', zy); ctx.beginPath(); ctx.arc(ex, ey, s * .045 * (1 + .4 * zy), 0, 7); ctx.fill(); if (zy > 0) glow(GREEN, ex, ey, s * .3, zy * (.6 + .2 * Math.sin(t * 4)));
  // polar nuclei → endosperm nucleus
  const en = ss(44.1, 44.7, t); const [p1x, p1y] = P('pol1'), [p2x, p2y] = P('pol2'); const mxp = (p1x + p2x) / 2, myp = (p1y + p2y) / 2;
  if (en < 1) for (const [qx, qy] of [[p1x, p1y], [p2x, p2y]]) { ctx.fillStyle = '#d8b860'; ctx.beginPath(); ctx.arc(lerp(qx, mxp, en), lerp(qy, myp, en), s * .055, 0, 7); ctx.fill(); }
  if (en > 0) { ctx.fillStyle = '#f2c84a'; ctx.beginPath(); ctx.arc(mxp, myp, s * .08 * en, 0, 7); ctx.fill(); glow(GOLD, mxp, myp, s * .45, en * (.7 + .2 * Math.sin(t * 4))); }
  // pollen tube
  const tk = ss(40.5, 42.1, t), Tp = tubeOv(); if (tk > 0) { const tp = along(Tp, tk); const pts = []; for (let i = 0; i <= 40; i++) { const q = along(Tp, tk * i / 40); pts.push(q); }
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.strokeStyle = 'rgba(255,240,190,.75)'; ctx.lineWidth = 26; ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,235,.9)'; ctx.lineWidth = 7; ctx.stroke(); glow(GOLD, tp[0], tp[1], 60, .8);
    // sperm cells
    const rel = ss(42.2, 42.5, t); const tip = along(Tp, tk); const s1 = [lerp(tip[0], ex, eio((t - 42.4) / 1.1)), lerp(tip[1], ey, eio((t - 42.4) / 1.1))], s2 = [lerp(tip[0], mxp, eio((t - 42.6) / 1.6)), lerp(tip[1], myp, eio((t - 42.6) / 1.6))];
    if (t < 43.55) { glow(WHITE, ...(t < 42.4 ? [tip[0] - 14, tip[1] + 10] : s1), 26, 1); }
    if (t < 44.25) { glow(WHITE, ...(t < 42.4 ? [tip[0] + 10, tip[1] + 18] : s2), 26, 1); }
    if (rel > 0 && t < 42.9) glow(YEL, tip[0], tip[1], 90 * rel, .8); }
  flash(t, 43.5, .2, .35); flash(t, 44.25, .2, .35);
  ctx.restore();
}
function kernel(x, y, s, t, o = {}) {
  const w = s * .74, d = o.dev ?? 1; ctx.save(); ctx.translate(x, y);
  const path = () => { ctx.beginPath(); ctx.moveTo(0, s * .5); ctx.bezierCurveTo(-w * .2, s * .46, -w * .56, s * .06, -w * .5, -s * .24); ctx.bezierCurveTo(-w * .46, -s * .52, w * .46, -s * .52, w * .5, -s * .24); ctx.bezierCurveTo(w * .56, s * .06, w * .2, s * .46, 0, s * .5); ctx.closePath(); };
  glow(GOLD, 0, 0, s * .9, .35 * d); path(); let g = ctx.createRadialGradient(-w * .2, -s * .25, s * .05, 0, 0, s * .7); g.addColorStop(0, mixh('#f4f8d0', '#fff1a0', d)); g.addColorStop(.5, mixh('#d8ecb0', '#f6c232', d)); g.addColorStop(1, mixh('#9ab868', '#b8780e', d)); ctx.fillStyle = g; ctx.fill();
  ctx.save(); path(); ctx.clip(); const r = rng(9); for (let i = 0; i < 160; i++) { const px = (r() - .5) * w, py = (r() - .5) * s; ctx.fillStyle = `rgba(255,250,215,${.12 + .25 * d * r()})`; ctx.beginPath(); ctx.arc(px, py, s * (.008 + r() * .012), 0, 7); ctx.fill(); }
  const gy = s * .16, gx = 0; g = ctx.createLinearGradient(0, gy - s * .25, 0, gy + s * .25); g.addColorStop(0, '#fffbe8'); g.addColorStop(1, '#efd9a0'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(gx, gy, w * .17 * (.6 + .4 * d), s * .22 * (.6 + .4 * d), 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(190,160,80,.8)'; ctx.lineWidth = Math.max(1, s * .006); ctx.stroke();
  ctx.strokeStyle = 'rgba(140,190,80,.9)'; ctx.lineWidth = Math.max(1, s * .012); ctx.beginPath(); ctx.moveTo(gx, gy - s * .13); ctx.lineTo(gx, gy + s * .13); ctx.stroke(); ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(-w * .22, -s * .3, w * .12, s * .06, -.5, 0, 7); ctx.fill();
  if (o.face > 0) { ctx.globalAlpha = o.face; for (const sd of [-1, 1]) { const ex = sd * w * .16, ey = -s * .2, er = s * .045, bl = blink(t, .5); ctx.save(); ctx.translate(ex, ey); ctx.scale(1, Math.max(.07, bl)); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(0, 0, er * .82, er * 1.05, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#2a1a05'; ctx.beginPath(); ctx.ellipse(0, er * .1, er * .5, er * .6, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-er * .18, -er * .15, er * .17, 0, 7); ctx.fill(); ctx.restore(); ctx.fillStyle = 'rgba(255,130,110,.35)'; ctx.beginPath(); ctx.ellipse(sd * w * .27, -s * .13, er * .8, er * .45, 0, 0, 7); ctx.fill(); }
    ctx.strokeStyle = 'rgba(110,70,5,.9)'; ctx.lineWidth = s * .01; ctx.beginPath(); ctx.moveTo(-w * .07, -s * .12); ctx.quadraticCurveTo(0, -s * .08, w * .07, -s * .12); ctx.stroke(); ctx.globalAlpha = 1; }
  ctx.restore(); return { germ: [x + gx, y + gy], endo: [x + w * .24, y - s * .25] };
}
function scene5(t) {
  if (t < 46.9) ovuleScene(t);
  let K = null; const gk = eio((t - 46.3) / 4.0), ks = lerp(130, 600, gk);
  xfade(ss(46.3, 46.9, t), () => { warmBg(t, 0, 27); K = kernel(540, 900, ks, t, { dev: gk, face: ss(48.4, 49.0, t) });
    const day = Math.round(lerp(1, 30, gk)); ctx.save(); ctx.font = '800 64px "Baloo 2"'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#000'; ctx.lineWidth = 12; ctx.strokeText('DIA ' + day, 90, 560); ctx.fillStyle = '#fff'; ctx.fillText('DIA ' + day, 90, 560); ctx.font = '800 30px Nunito'; ctx.lineWidth = 7; ctx.strokeText('tempo acelerado', 92, 615); ctx.fillStyle = '#ffd93b'; ctx.fillText('tempo acelerado', 92, 615); ctx.restore(); });
  const P = sacPos, ex = P('egg'), mp = [(P('pol1')[0] + P('pol2')[0]) / 2, (P('pol1')[1] + P('pol2')[1]) / 2];
  const kk = ss(46.3, 46.9, t), emb = K ? [lerp(ex[0], K.germ[0], kk), lerp(ex[1], K.germ[1], kk)] : ex, endo = K ? [lerp(mp[0], K.endo[0], kk), lerp(mp[1], K.endo[1], kk)] : mp;
  L(t, 42.6, 46.4, 'Dupla fecundação', 540, 900, 540, 300, '#ffd93b');
  L(t, 44.9, 50.9, 'Embrião', ...emb, 820, 1280, '#9cff6a'); L(t, 45.7, 50.9, 'Endosperma', ...endo, 810, 560);
  L(t, 47.4, 50.9, 'Grão em desenvolvimento', 540 - ks * .3, 900 + ks * .3, 330, 1290);
  LQ.push(['big', 48.6, 51.0, ['ASSIM NASCE UM', 'GRÃO DE MILHO!'], 290, [86, 100], ['#fff', '#ffd93b']]);
}

// ---------- scene 6 ----------
function heat(t, hy) { ctx.save(); ctx.strokeStyle = 'rgba(255,255,240,.12)'; ctx.lineWidth = 3; for (let i = 0; i < 10; i++) { const y = hy - 40 + i * 14; ctx.beginPath(); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, y + Math.sin(x * .03 + t * 6 + i) * 4); ctx.stroke(); } ctx.restore(); }
const EAR6 = { cx: 540, cy: 980, L: 1350, R: 185 };
function cam6(t) { const k = eio((t - 57.2) / 3.6); return [540, lerp(560, 980, k), lerp(2.0, .9, k)]; }
function ear6(t, cam, final) { warmBg(t, 0, 19); ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(235,200,140,.55)'; ctx.fillRect(0, 0, W, H); ctx.restore();
  ctx.save(); ctx.translate(540, 960); ctx.scale(cam[2], cam[2]); ctx.translate(-cam[0], -cam[1]); huskBands(EAR6, false); const pos = earGrid(t, EAR6, { fail: 1, final }); huskBands(EAR6, true); ctx.restore(); return pos; }
function scene6(t) {
  let earTip = null, plantK = null;
  if (t < 54.4) { cornField(t, { pal: PAL.dry, spr: SPR.cornDry, dry: true, cz: (t - 51.2) * 1.3, camH: 3.6, camX: .4 + Math.sin(t * .3) * .2, hy: 780, sun: [820, 380], sunCol: WHITE, rows: 9 }); heat(t, 780); }
  xfade(ss(53.9, 54.4, t), () => { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#f2e4bc'); g.addColorStop(.6, '#f2c27a'); g.addColorStop(1, '#a07040'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); glow(WHITE, 860, 300, 260, .9); glow(GOLD, 860, 300, 700, .6); heat(t, 1500);
    ctx.save(); ctx.fillStyle = PAT.soil; ctx.translate(0, 1560); ctx.scale(.9, .35); ctx.fillRect(0, 0, W / .9, 1200); ctx.restore();
    const an = []; const z = lerp(1, 1.1, eio((t - 54 ) / 3.4)); ctx.save(); ctx.translate(540, 1000); ctx.scale(z, z); ctx.translate(-540, -1000);
    const p = cornPlant(500, 1620, 1450, t, { seed: 6, health: .25, silk: .12, anthers: an, rim: 'rgba(255,240,190,.5)' }); ctx.restore();
    earTip = [540 + (p.earTip[0] - 540) * z, 1000 + (p.earTip[1] - 1000) * z];
    for (let i = 0; i < 60; i++) { const src = an[(i * 5) % an.length]; const per = 2.6, k = ((t + i * .41) % per) / per; const sx = 540 + (src[0] - 540) * z, sy = 1000 + (src[1] - 1000) * z; glow(YEL, sx + k * 640 + Math.sin(k * 5 + i) * 30, sy + k * 900, 9, (1 - k) * .8); } });
  if (t > 57.0) xfade(ss(57.0, 57.5, t), () => { const cam = cam6(t), pos = ear6(t, cam, t > 61.2); plantK = pos; const u = pos['4,1'], a = pos['5,12'] || pos['5,8']; let ab = null; for (const k in pos) if (pos[k][4] == 'abort' && k.startsWith('4,') && !ab && +k.split(',')[1] > 3) ab = pos[k]; scene6.tg = { un: es(u[0], u[1], cam), ab: ab ? es(ab[0], ab[1], cam) : [540, 900] }; });
  L(t, 51.9, 56.9, 'Estresse hídrico', 600, t < 54.2 ? 1100 : 1350, 540, 430, '#ffb347');
  if (earTip && t < 57.2) L(t, 54.8, 57.2, 'Falhas de polinização', earTip[0], earTip[1], 760, 560, '#ffb347');
  if (t > 57.4 && scene6.tg) { L(t, 57.7, 61.0, 'Falhas de fecundação', ...scene6.tg.un, 300, 1290, '#ffb347'); L(t, 59.3, 61.0, 'Abortamento de grãos', ...scene6.tg.ab, 760, 1210, '#ff7a5a'); }
  LQ.push(['big', 60.7, 63.05, ['POR ISSO ALGUMAS', 'ESPIGAS TÊM FALHAS!'], 290, [78, 84], ['#fff', '#ffd93b'], 1.12]);
}

// ---------- scene 7 ----------
function matureEar(t, cx, cy, s, fail) { const E = { cx, cy, L: 1050 * s, R: 165 * s };
  for (const sd of [-1, 1]) { ctx.save(); ctx.translate(cx, cy + E.L * .42); strapLeaf(0, 0, 520 * s, Math.PI / 2 + sd * .7, sd * -.9, 70 * s, '#e0d8a0', '#a8985a', 'rgba(255,240,190,.7)', t, sd); ctx.restore(); }
  earGrid(t, E, fail ? { fail: 1, final: 1 } : { mode: 'full' }); return E; }
function scene7(t) {
  const fk = ss(66.6, 67.4, t);
  if (fk < 1) { warmBg(t, 0, 37); const z = lerp(1.15, 1, eio((t - 63.2) / 2)); ctx.save(); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900);
    const g = ctx.createLinearGradient(500, 0, 580, 0); g.addColorStop(0, 'rgba(255,240,200,0)'); g.addColorStop(.5, 'rgba(255,240,200,.4)'); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = g; ctx.fillRect(500, 0, 80, H);
    matureEar(t, 290, 900, .82, false); matureEar(t, 790, 900, .82, true); ctx.restore(); }
  xfade(fk, () => cornField(t, { pal: PAL.rise, cz: 4 + (t - 66.6) * 1.2, camH: lerp(3.0, 4.2, eio((t - 66.6) / 3.8)), camX: .4, hy: 760, sun: [760, 560], sunCol: ORANGE }));
  if (fk < .5) { L(t, 63.9, 66.8, 'Espiga bem formada', 290, 1000, 270, 1290, '#9cff6a'); L(t, 64.2, 66.8, 'Espiga com falhas', 790, 660, 800, 1210, '#ffb347'); }
  LQ.push(['fn', () => { const chips = ['Clima favorável', 'Polinização', 'Fecundação', 'Produtividade']; ctx.save(); ctx.font = '800 26px Nunito'; const ws = chips.map(c => ctx.measureText(c).width + 36), tot = ws.reduce((a, b) => a + b, 0) + 3 * 34; let x = 540 - tot / 2; const y = 1250;
    chips.forEach((c, i) => { const a = ss(67.0 + i * .45, 67.35 + i * .45, t) * (1 - ss(70.0, 70.35, t)); if (a <= 0) { x += ws[i] + 34; return; } ctx.globalAlpha = a; rr(x, y - 26, ws[i], 52, 26); ctx.fillStyle = 'rgba(7,17,13,.85)'; ctx.fill(); ctx.strokeStyle = i == 3 ? '#ffd93b' : '#4fe3c8'; ctx.lineWidth = 2.5; ctx.stroke(); ctx.fillStyle = i == 3 ? '#ffd93b' : '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(c, x + ws[i] / 2, y + 2); x += ws[i];
      if (i < 3) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x + 10, y - 9); ctx.lineTo(x + 24, y); ctx.lineTo(x + 10, y + 9); ctx.fill(); } x += 34; }); ctx.restore(); }]);
  LQ.push(['big', 65.4, 70.35, ['PEQUENOS PROCESSOS.', 'GRANDES IMPACTOS.'], 290, [76, 86], ['#fff', '#ffd93b'], 1.12]);
}

// ---------- scene 8 ----------
function scene8(t) {
  if (t < 72.4) earClose(t, elerp(2.2, .45, eio((t - 70.4) / 2.0)), true);
  xfade(ss(71.6, 72.4, t), () => { const k = eio((t - 71.6) / 3.4); cornField(t, { pal: PAL.set, spr: SPR.cornSet, cz: lerp(5, 1.5, k), camH: lerp(3.4, 6.5, k), camX: .4, hy: lerp(980, 840, k), sun: [540, lerp(960, 810, k)], sunCol: ORANGE }); });
  if (t > 71.8) { const a = ss(71.8, 72.6, t); ctx.save(); ctx.globalAlpha = a; pollen(880 + Math.sin(t * 1.2) * 20, 1090 + Math.sin(t * 1.9) * 16, 52, t, { face: 1, look: [-.6, -.4], mood: 1, rot: Math.sin(t) * .2 }); ctx.restore(); }
  pill(t, 72.4, 75.2, 'O AGRO QUE VOCÊ NÃO VÊ', 260);
  LQ.push(['big', 72.5, 75.5, ['O SEGREDO DO', 'CABELO DO MILHO'], 450, [86, 106], ['#fff', '#ffd93b'], 1.02]);
  LQ.push(['fn', () => { const a = ss(73.0, 73.4, t); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.font = '800 44px Nunito'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#000'; ctx.lineWidth = 10; ctx.strokeText('Polinização e formação dos grãos.', 540, 690); ctx.fillStyle = '#fff'; ctx.fillText('Polinização e formação dos grãos.', 540, 690); ctx.restore(); }]);
  LQ.push(['fn', () => { const k = cl((t - 73.4) / .5); if (k <= 0) return; const txt = 'Siga para descobrir o agro que você não vê!', sc = 1 - Math.cos(k * Math.PI * 2.4) * Math.exp(-k * 5.5) * .4, pulse = 1 + .03 * Math.sin(t * 6); ctx.save(); ctx.translate(540, 820); ctx.scale(sc * pulse, sc * pulse); ctx.font = '800 36px Nunito'; const w = ctx.measureText(txt).width + 80; rr(-w / 2, -42, w, 84, 42); ctx.fillStyle = '#ffd93b'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 24; ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = '#000'; ctx.lineWidth = 5; ctx.stroke(); ctx.fillStyle = '#1a1a0a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 3); ctx.restore(); }]);
}

// ---------- main ----------
function render(t) {
  ctx = mctx; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); LQ = [];
  let mode = 'micro';
  if (t < 7.0) { scene1(t); if (t < 5.6) mode = 'field'; }
  else if (t < 17.6) scene2(t);
  else if (t < 29.4) { scene3(t); if (t < 22.6) mode = 'field'; }
  else if (t < 40.45) scene4(t);
  else if (t < 51.2) scene5(t);
  else if (t < 63.2) { scene6(t); if (t < 57.2) mode = 'dry'; }
  else if (t < 70.4) { scene7(t); mode = 'field'; }
  else { scene8(t); mode = 'field'; }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  motes(t, mode); if (mode == 'micro') fgBokeh(t);
  for (const tc of [17.6, 29.45, 40.45, 51.2, 57.2, 63.2, 70.4]) flash(t, tc, .28, .55);
  ctx.drawImage(VIG, 0, 0);
  ctx.save(); ctx.globalAlpha = .05; ctx.translate(-(Math.floor(t * 30 * 37) % 256), -(Math.floor(t * 30 * 91) % 256)); ctx.fillStyle = GRAIN; ctx.fillRect(0, 0, W + 256, H + 256); ctx.restore();
  for (const a of LQ) { if (a[0] == 'big') bigText(t, ...a.slice(1)); else if (a[0] == 'fn') a[1](); else label(...a); }
  subtitles(t);
  if (t < .25) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .25})`; ctx.fillRect(0, 0, W, H); }
}
async function init() {
  await Promise.all(['soil.jpg', 'silk.jpg'].map(n => new Promise(r => { const i = new Image(); i.onload = () => { IMG[n] = i; r(); }; i.src = n; })));
  await document.fonts.load('800 76px "Baloo 2"'); await document.fonts.load('800 36px Nunito');
  PAT.soil = mctx.createPattern(IMG['soil.jpg'], 'repeat'); PAT.silk = mctx.createPattern(IMG['silk.jpg'], 'repeat');
  SPR.corn = [1, 2, 3].map(s => cornSprite(s, { h: 1, rim: 'rgba(255,214,120,.9)' })); SPR.cornSet = [1, 2, 3].map(s => cornSprite(s, { h: 1, rim: 'rgba(255,150,90,.9)', warm: 1 })); SPR.cornDry = [1, 2, 3].map(s => cornSprite(s + 10, { h: .2, rim: 'rgba(255,240,190,.5)' }));
  VIG = mk(W, H, g => { const gr = g.createRadialGradient(540, 900, 380, 540, 960, 1250); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  const gc = mk(256, 256, g => { const d = g.createImageData(256, 256); const r = rng(99); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); });
  GRAIN = mctx.createPattern(gc, 'repeat');
}
window.ready = init();
window.renderFrame = t => { render(t); return MAIN.toDataURL('image/jpeg', .92); };
window.collect = () => { for (let t = 0; t < 75; t += .1) render(t); return [...LT].sort((a, b) => a - b); };
