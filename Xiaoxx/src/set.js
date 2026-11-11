// Shared sets for 小星星. Each paints a whole background. Keep the palette small:
// night indigo, rain blue, lamp cream, sea teal, stage rose. The gold star is the only bright light.

function skyWash(top, mid) {
  boilSeed('sky');
  paint(rectPts(-80, -80, W + 160, H * .72), { wash: top, ink: null });
  paint(rectPts(-80, H * .42, W + 160, H * .7), { fill: mid, fillOp: 210, bleed: .18, tex: .45, ink: null });
}

function starfield(t, n, yMax, seed) {
  boilSeed('stars' + seed);
  for (let i = 0; i < n; i++) {
    const x = hash(seed + i * 3.1) * W;
    const y = hash(seed + i * 7.7) * yMax;
    const tw = .35 + .65 * (.5 + .5 * Math.sin(t * 1.7 + i));
    const r = 3 + hash(seed + i * 1.3) * 8;
    paint(starPts(x, y, r, .4, 4, hash(seed + i) * 3), { wash: '#F8E7B4', washOp: Math.round(210 * tw), ink: null });
  }
}

function moon(x, y, s = 54) {
  boilSeed('moon');
  glow(x, y, s * 3.2, '#FFE6B0', .75);
  paint(ellPts(x, y, s, s, 24), { wash: '#F6E7C2', ink: null });
  paint(ellPts(x + s * .35, y - s * .1, s * .82, s * .82, 20), { wash: '#1A2148', ink: null });
}

function nightRoof(t, o = {}) {
  skyWash(o.top || '#161C3E', o.mid || '#3C4E86');
  moon(o.mx || 300, o.my || 150, o.ms || 52);
  starfield(t, o.stars || 26, H * .5, 2);
  boilSeed('roof');
  const p = [[-40, 780]];
  for (let i = 0; i <= 12; i++) p.push([-40 + (W + 80) * i / 12, 760 + Math.sin(i * .8) * 10]);
  p.push([W + 40, H + 40], [-40, H + 40]);
  paint(p, { fill: '#2A3348', fillOp: 230, bleed: .06, tex: .55, ink: null });
  paint(rectPts(-40, 900, W + 80, 220), { wash: '#3A4558', ink: null });
}

function street(t, rainOn) {
  skyWash('#4A5C78', '#8EABC8');
  boilSeed('town');
  const blocks = [[40, 430, 280, 390, '#5C6E86'], [340, 500, 220, 320, '#6E8098'], [600, 390, 340, 430, '#546480'], [980, 470, 260, 350, '#647490'], [1280, 360, 380, 460, '#4E6078'], [1680, 440, 280, 380, '#5A6C84']];
  for (const [x, y, w, h, c] of blocks) {
    paint(rectPts(x, y, w, h, 2), { wash: c, ink: PAL.ink, sw: .6 });
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
      const wx = x + 28 + i * (w / 3.4), wy = y + 36 + j * 70;
      const lit = hash(x + i * 9 + j) > .45;
      if (lit) glow(wx + 14, wy + 16, 28, '#FFD9A0', .35);
      paint(rectPts(wx, wy, 28, 34), { wash: lit ? '#F3D7A4' : '#2C3848', ink: null });
    }
  }
  boilSeed('road');
  paint(rectPts(-40, 800, W + 80, 320), { wash: '#3E4A58', ink: null });
  paint(rectPts(-40, 800, W + 80, 18), { wash: '#6A7A88', ink: null });
  for (let i = 0; i < 6; i++) paint(rectPts(80 + i * 320, 900, 120, 10), { wash: '#C9D0D4', washOp: 160, ink: null });
  if (rainOn) rain(t, 48);
}

function rain(t, n) {
  boilSeed('rain');
  for (let i = 0; i < n; i++) {
    const x = (hash(i * 2.2) * (W + 80) + t * (160 + hash(i) * 80)) % (W + 80) - 40;
    const y = (hash(i * 5.1) * (H + 60) + t * 460) % (H + 60) - 30;
    inkLine([[x, y], [x - 14, y + 38]], 2.1, '#E7F1FA', 'ink');
  }
}

function room(t, o = {}) {
  boilSeed('room');
  paint(rectPts(-40, -40, W + 80, H + 80), { wash: o.wall || '#E7D3BE', ink: null });
  paint(rectPts(-40, 820, W + 80, 300), { wash: '#C4A88A', ink: null });
  // window
  const x = o.wx || 1080, y = o.wy || 120, w = o.ww || 640, h = o.wh || 620;
  paint(rectPts(x - 24, y - 24, w + 48, h + 48), { wash: '#6B4E3A', ink: PAL.ink, sw: 1.2 });
  paint(rectPts(x, y, w, h), { wash: o.out || '#6E88B0', ink: null });
  if (o.night) {
    glow(x + w * .72, y + 90, 80, '#FFE6B0', .5);
    paint(ellPts(x + w * .72, y + 80, 28, 28, 14), { wash: '#F6E7C2', ink: null });
    starfield(t, 12, y + h, 9);
  }
  inkLine([[x + w / 2, y], [x + w / 2, y + h]], 2, '#6B4E3A', 'ink');
  inkLine([[x, y + h / 2], [x + w, y + h / 2]], 2, '#6B4E3A', 'ink');
  if (o.curtain != null) {
    const c = clamp(o.curtain);
    paint(rectPts(x, y, w * .5 * c, h), { wash: '#E7A0B4', washOp: 230, ink: null });
  }
  // lamp
  boilSeed('lamp');
  glow(220, 250, 160, '#FFD09A', .55);
  paint(ellPts(220, 230, 46, 28, 12), { wash: '#F6E2C0', ink: PAL.ink, sw: .8 });
  inkLine([[220, 258], [220, 420]], 2, '#6B4E3A', 'ink');
}

function sea(t) {
  skyWash('#14283A', '#245068');
  moon(1500, 140, 46);
  starfield(t, 22, H * .42, 4);
  boilSeed('sea');
  const p = [];
  for (let i = 0; i <= 18; i++) {
    const x = -60 + (W + 120) * i / 18;
    p.push([x, 560 + Math.sin(i * .7 + t * .6) * 16 + Math.sin(i * 1.7 + t) * 6]);
  }
  p.push([W + 60, H + 40], [-60, H + 40]);
  paint(p, { fill: '#1E6A72', fillOp: 230, bleed: .08, tex: .6, ink: null });
  paint(rectPts(-40, 820, W + 80, 300), { wash: '#C9B48A', ink: null });
  boilSeed('foam');
  inkLine(p.slice(0, 19), 1.4, '#E7F2F0', 'inkfine', .3);
}

function stage(t) {
  boilSeed('stage');
  paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#2A2030', ink: null });
  paint(rectPts(-40, 780, W + 80, 340), { wash: '#4A3040', ink: null });
  // curtains
  paint([[-40, -40], [420, -40], [260, H + 20], [-40, H + 20]], { wash: '#8E4458', ink: null });
  paint([[W + 40, -40], [W - 420, -40], [W - 260, H + 20], [W + 40, H + 20]], { wash: '#8E4458', ink: null });
  glow(960, 180, 280, '#FFE0B0', .35);
  paint(ellPts(960, 860, 520, 40, 16), { fill: PAL.ink, fillOp: 50, bleed: .2, ink: null });
}

function cityNight(t) {
  skyWash('#14182E', '#2E3C6A');
  moon(240, 120, 40);
  starfield(t, 18, 280, 6);
  boilSeed('city');
  const houses = [[80, 520, 200, 400], [300, 460, 240, 460], [560, 560, 180, 360], [760, 420, 260, 500], [1040, 500, 220, 420], [1280, 440, 280, 480], [1580, 540, 260, 380]];
  houses.forEach(([x, y, w, h], n) => {
    paint(rectPts(x, y, w, h), { wash: n % 2 ? '#2A3454' : '#232C48', ink: null });
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const wx = x + 24 + i * (w / 3.5), wy = y + 30 + j * (h / 4);
      const on = hash(n * 20 + i * 3 + j) > .35;
      if (on) glow(wx + 12, wy + 14, 22, '#FFD9A0', .28);
      paint(rectPts(wx, wy, 22, 26), { wash: on ? '#F0D2A0' : '#1A2038', ink: null });
    }
  });
  paint(rectPts(-40, 900, W + 80, 220), { wash: '#1C2438', ink: null });
}

function wipeIn(lt, cols) { if (lt < .4) brushWipe(.5 + lt / .8, cols); }
function wipeOut(lt, dur, cols) { if (lt > dur - .4) brushWipe((lt - (dur - .4)) / .8, cols); }

const WIPE_NIGHT = ['#1A2148', '#3C4E86'];
const WIPE_RAIN = ['#5A7090', '#A8C0D4'];
const WIPE_ROOM = ['#E7C9A4', '#C48B6A'];
const WIPE_SEA = ['#163E48', '#3A8A86'];
const WIPE_ROSE = ['#7A3A4E', '#E7A0B4'];
