// lead.js — an original watercolour anime lead for this film. Not Clawd, and not a copy of any existing character.
// (x, y) is the ground point between the feet. u is the unit. The figure is about 14.5u tall.
// Options match the engine's pose/face fields (spread feel() / emotions() / stroll() straight in).
// Body colour from those helpers is ignored: the design stays on model.
//
//   lead(x, y, u, o)       the one who keeps the star
//   departed(x, y, u, o)   the one who leaves, only ever from behind or in profile-from-behind

const SKIN = '#F3C2A8', SKIN_DK = '#E09A84', BLUSH_C = '#E9899A';
const HAIR = '#2C3968', HAIR_DK = '#1C2748', GOLD = '#E8B84A';
const COAT = '#F6E6CE', COAT_DK = '#E4CBA8', SCARF = '#E7A0B4', SCARF_DK = '#C97890';
const PANTS = '#2C465C', SHOE = '#3A3144';
const ROSE = '#D9899A', ROSE_DK = '#B86478', BROWN = '#6E4E3C', BROWN_DK = '#4E3428';

function lead(x, y, u, o = {}) { person(x, y, u, o, 'lead'); }
function departed(x, y, u, o = {}) { person(x, y, u, { ...o, who: 'rose' }, 'rose'); }

function person(x, y, u, o, who) {
  const id = o.boilKey ?? (++CLAWD_N);
  const rs = part => boilSeed(who + id + part);
  const rose = who === 'rose' || o.who === 'rose';
  const hair = rose ? BROWN : HAIR, hairDk = rose ? BROWN_DK : HAIR_DK;
  const coat = rose ? ROSE : COAT, coatDk = rose ? ROSE_DK : COAT_DK;
  x += (o.dx || 0) * u;
  const dy = (o.dy || 0) * u, sq = o.sq || 0;
  const sw = clamp(u / 18, .4, 2.2);
  const view = o.view || 'front';
  const back = view === 'back' || view === 'qback' || rose && view === 'front';
  const side = view === 'side';
  const flip = !!o.flip;

  rs('shadow');
  if (!o.noShadow) {
    const lift = Math.min(.55, Math.abs(o.dy || 0) * .05);
    paint(ellPts(x, y + u * .2, u * (3.2 - lift), u * .55, 16), { fill: PAL.ink, fillOp: 70, bleed: .3, tex: .3, ink: null });
  }

  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((flip ? -1 : 1) * (1 + sq * .45), 1 - sq * .7);

  const arm = (which, behind) => {
    rs('arm' + which + (behind ? 'b' : 'f'));
    const a = which === 'L' ? (o.aL ?? -.35) : (o.aR ?? -.35);
    const hook = which === 'L' ? o.armL : o.armR;
    const sign = which === 'L' ? -1 : 1;
    const rootX = side ? u * .3 : sign * u * 2.15;
    if (behind && !side) return;
    if (side && which === 'R') return;
    push();
    translate(rootX, -7.15 * u);
    rotate(side ? (.55 - a) : -sign * a);
    const len = 2.7 * u, w = .72 * u;
    paint(rrPts(-w / 2, 0, w, len, w * .45), { wash: coat, ink: PAL.ink, sw: sw * .75 });
    paint(ellPts(0, len, w * .62, w * .5, 10), { wash: SKIN, ink: PAL.ink, sw: sw * .65 });
    if (hook) { translate(0, len); hook(u, sw); }
    pop();
  };

  // far arm, then legs, coat, near arm
  if (!side) arm('L', true);
  rs('legs');
  const step = o.walk == null ? 0 : o.walk;
  for (const [lx, ph] of side ? [[.15, 0], [-.35, .5]] : [[-1.05, 0], [1.05, .5]]) {
    const s = Math.sin((step + ph) * TAU);
    const lift = step ? Math.max(0, -Math.cos((step + ph) * TAU)) * .55 * u : 0;
    const swing = s * (side ? .7 : .28) * u;
    paint(ribbon([[lx * u + swing * .15, -4.15 * u], [lx * u + swing * .55, -2.3 * u - lift * .3], [lx * u + swing, -0.55 * u - lift]], u * .78, u * .5), { wash: PANTS, ink: PAL.ink, sw: sw * .7 });
    paint(ellPts(lx * u + swing, -0.28 * u - lift, u * .85, u * .38, 10), { wash: SHOE, ink: PAL.ink, sw: sw * .65 });
  }

  rs('coat');
  if (side) {
    paint([[-.9 * u, -8.4 * u], [1.25 * u, -8.15 * u], [1.55 * u, -5.5 * u], [1.05 * u, -3.5 * u], [-1.15 * u, -3.65 * u], [-1.35 * u, -5.8 * u]], { wash: coat, ink: PAL.ink, sw });
    paint(ellPts(.1 * u, -6.2 * u, u * .55, u * .9, 12), { fill: coatDk, fillOp: 80, bleed: .15, tex: .5, ink: null });
  } else {
    const flare = back ? 0 : .15 * u;
    paint([[-2.3 * u, -8.35 * u], [2.3 * u, -8.35 * u], [2.55 * u + flare, -5.4 * u], [2.15 * u, -3.5 * u], [-2.15 * u, -3.5 * u], [-2.55 * u - flare, -5.4 * u]], { wash: coat, ink: PAL.ink, sw });
    if (!back) paint(ellPts(0, -6.6 * u, 1.5 * u, .7 * u, 12), { fill: '#FFF8EC', fillOp: 80, bleed: .2, tex: .4, ink: null });
    else paint(ellPts(0, -6.2 * u, 1.3 * u, 1.4 * u, 12), { fill: coatDk, fillOp: 100, bleed: .12, tex: .5, ink: null });
  }

  if (!rose) {
    rs('scarf');
    paint(ribbon(side
      ? [[.2 * u, -8.5 * u], [-.4 * u, -7.6 * u], [-.9 * u, -6.2 * u], [-.5 * u, -4.8 * u]]
      : [[-1.6 * u, -8.2 * u], [0, -8.55 * u], [1.7 * u, -8.15 * u], [2.1 * u, -6.7 * u], [1.5 * u, -5.1 * u]], u * .55, u * .22), { wash: SCARF, ink: PAL.ink, sw: sw * .6 });
    if (!back && !side) paint(starPts(0, -6.15 * u, u * .42, .42, 5, -Math.PI / 2 + Math.sin(T * 1.3) * .05), { wash: GOLD, ink: PAL.ink, sw: sw * .55 });
  }

  rs('neck');
  paint(rrPts(-.55 * u, -9.15 * u, 1.1 * u, 1.05 * u, .3 * u), { wash: SKIN, ink: null });

  // head
  rs('hairback');
  const hx = side ? .85 * u : 0, hy = -11.55 * u;
  paint(ellPts(hx - (side ? 1.35 * u : 0), hy + .2 * u, (side ? 2.15 : 3.15) * u, 3.35 * u, 22), { wash: hair, ink: PAL.ink, sw });
  if (!side) {
    paint(ribbon([[-2.4 * u, hy], [-3.05 * u, hy + 1.6 * u], [-2.5 * u, hy + 3.3 * u]], u * .7, u * .28), { wash: hair, ink: PAL.ink, sw: sw * .65 });
    paint(ribbon([[2.3 * u, hy - .2 * u], [3.0 * u, hy + 1.5 * u], [2.45 * u, hy + 3.6 * u], [2.8 * u, hy + 5.1 * u]], u * .62, u * .2), { wash: hair, ink: PAL.ink, sw: sw * .65 });
    if (!rose) paint(ribbon([[2.45 * u, hy + .3 * u], [2.85 * u, hy + 2.2 * u], [2.55 * u, hy + 4.2 * u]], u * .16, u * .06), { wash: GOLD, ink: null });
  } else {
    paint(ribbon([[hx - 1.6 * u, hy], [hx - 2.3 * u, hy + 1.8 * u], [hx - 1.7 * u, hy + 3.5 * u]], u * .85, u * .3), { wash: hair, ink: PAL.ink, sw: sw * .65 });
  }

  rs('head');
  paint(ellPts(hx, hy, (side ? 1.55 : 2.45) * u, 2.75 * u, 22), { wash: SKIN, ink: PAL.ink, sw });
  if (side) paint(ellPts(hx + 1.35 * u, hy + .05 * u, u * .32, u * .26, 8), { wash: SKIN, ink: PAL.ink, sw: sw * .55 });

  if (!back) {
    rs('face');
    const squint = o.squint || 0;
    const blush = o.blush || 0;
    if (blush > .05) {
      const a = Math.round(90 * clamp(blush));
      paint(ellPts(hx - 1.15 * u, hy + .85 * u, u * .55, u * .32, 10), { wash: BLUSH_C, washOp: a, ink: null });
      if (!side) paint(ellPts(hx + 1.15 * u, hy + .85 * u, u * .55, u * .32, 10), { wash: BLUSH_C, washOp: a, ink: null });
    }
    const eyes = o.eyes;
    const pair = Array.isArray(eyes) ? eyes : [eyes || 'normal', eyes || 'normal'];
    const lookX = o.lookX || 0, lookY = o.lookY || 0;
    if (side) animeEye(hx + .85 * u, hy - .2 * u, u * .7, sw, pair[1], lookX, lookY, squint, false);
    else {
      animeEye(hx - 1.05 * u, hy - .25 * u, u * .78, sw, pair[0], lookX, lookY, squint, pair[0] === 'wink');
      animeEye(hx + 1.05 * u, hy - .25 * u, u * .78, sw, pair[1], lookX, lookY, squint, false);
    }
    brows(hx, hy, u, sw, side, o);
    animeMouth(hx + (side ? 1.35 * u : 0), hy + 1.15 * u, u, sw, o.mouth, o);
    if ((o.gloom || 0) > .08 && !side) {
      inkLine([[hx - 1.7 * u, hy - 1.7 * u], [hx - .3 * u, hy - 1.35 * u]], sw * .7, hairDk, 'inkfine');
      inkLine([[hx + .3 * u, hy - 1.35 * u], [hx + 1.7 * u, hy - 1.7 * u]], sw * .7, hairDk, 'inkfine');
    }
  }

  rs('bangs');
  if (!back) {
    if (side) {
      paint([[hx - .3 * u, hy - 2.3 * u], [hx + 1.15 * u, hy - 2.55 * u], [hx + 1.7 * u, hy - 1.85 * u], [hx + 1.15 * u, hy - 1.2 * u], [hx + .1 * u, hy - 1.35 * u], [hx - .9 * u, hy - 1.55 * u]], { wash: hair, ink: PAL.ink, sw: sw * .85 });
    } else {
      paint([[hx - 2.45 * u, hy - 1.85 * u], [hx - 1.4 * u, hy - 2.75 * u], [hx, hy - 2.05 * u], [hx + 1.45 * u, hy - 2.75 * u], [hx + 2.45 * u, hy - 1.8 * u],
        [hx + 2.05 * u, hy - 1.15 * u], [hx + 1.05 * u, hy - 1.45 * u], [hx, hy - 1.05 * u], [hx - 1.05 * u, hy - 1.45 * u], [hx - 2.1 * u, hy - 1.1 * u]], { wash: hair, ink: PAL.ink, sw: sw * .85 });
      if (!rose) paint(starPts(hx - 1.7 * u, hy - 2.55 * u, u * .32, .45, 5, -Math.PI / 2), { wash: GOLD, ink: PAL.ink, sw: sw * .5 });
    }
  } else {
    paint(ellPts(hx, hy - .2 * u, 2.7 * u, 3.05 * u, 20), { wash: hair, ink: PAL.ink, sw });
    if (!rose) paint(ribbon([[.4 * u, hy - 1.2 * u], [.9 * u, hy + .6 * u], [.5 * u, hy + 2.2 * u]], u * .2, u * .08), { wash: GOLD, ink: null });
  }

  if (side) arm('L', false);
  else { arm('L', false); arm('R', false); }

  pop();

  if (o.emote && (o.emoteK == null || o.emoteK > .02)) {
    rs('emote');
    const dir = flip ? -1 : 1;
    emote(o.emote, x + dir * u * 3.4, y + dy - u * 13.2, u * .9, o.emoteK ?? 1, o.emoteAge || 0);
  }
}

function animeEye(x, y, s, sw, kind, lookX, lookY, squint, forceShut) {
  const shut = forceShut || squint > .72 || kind === 'closed' || kind === 'squeeze' || kind === 'happy' || kind === 'x';
  boilSeed('eye' + x.toFixed(0) + kind);
  if (shut) {
    const up = kind === 'happy' || kind === 'squeeze';
    const y0 = up ? -s * .05 : s * .15;
    inkLine(through([[x - s, y + y0], [x, y - s * .35], [x + s, y + y0]]), sw * 1.15, PAL.ink, 'ink', .4);
    if (kind === 'squeeze' || kind === 'x') inkLine([[x - s * .7, y - s * .2], [x + s * .7, y + s * .35]], sw, PAL.ink, 'ink');
    return;
  }
  const sleepy = kind === 'sleepy' || kind === 'sad' || kind === 'narrow';
  const wide = kind === 'wide' || kind === 'scared' || kind === 'shine' || kind === 'spark';
  const h = s * (sleepy ? .62 : wide ? 1.18 : .95) * (1 - clamp(squint) * .85);
  paint(ellPts(x, y, s, h, 14), { wash: '#FBF6EE', ink: PAL.ink, sw: sw * .9 });
  const ix = x + clamp(lookX, -1, 1) * s * .32, iy = y + clamp(lookY, -1, 1) * h * .28;
  const ir = s * (kind === 'scared' ? .48 : .58);
  paint(ellPts(ix, iy, ir, ir * (h / s), 12), { wash: '#3E5088', ink: null });
  paint(ellPts(ix, iy + ir * .12, ir * .5, ir * .48 * (h / s), 10), { wash: '#24325C', ink: null });
  if (kind === 'heart') paint(heartPts(ix, iy, ir * .75), { wash: '#E27A92', ink: null });
  else if (kind === 'shine' || kind === 'spark') paint(starPts(ix, iy, ir * .7, .42, 4, T), { wash: '#F6D56A', ink: null });
  else if (kind === 'swirl') inkLine(through([[ix - ir * .4, iy], [ix, iy - ir * .35], [ix + ir * .3, iy], [ix, iy + ir * .3]]), sw * .6, PAL.cream, 'inkfine');
  else paint(ellPts(ix - ir * .28, iy - ir * .32, ir * .24, ir * .24, 8), { wash: '#FFF8EA', ink: null });
  if (kind === 'wink' && !forceShut) inkLine(through([[x - s, y + h * .2], [x, y - h * .2], [x + s, y + h * .2]]), sw * .7, PAL.ink);
  // upper lid
  inkLine(through([[x - s * .95, y - h * .15], [x, y - h * .95], [x + s * .95, y - h * .15]]), sw * .85, PAL.ink, 'ink', .5);
}

function brows(hx, hy, u, sw, side, o) {
  const kind = Array.isArray(o.eyes) ? o.eyes[0] : o.eyes;
  const sad = kind === 'sad' || kind === 'cry' || (o.gloom || 0) > .2;
  const angry = kind === 'angry' || kind === 'determined';
  const y = hy - 1.55 * u, lift = sad ? .25 * u : angry ? -.05 * u : 0;
  const tilt = sad ? .35 : angry ? -.45 : -.1;
  if (side) inkLine([[hx + .3 * u, y + lift], [hx + 1.9 * u, y + lift - tilt * u]], sw * .8, HAIR, 'ink');
  else {
    inkLine([[hx - 1.85 * u, y + lift + tilt * u], [hx - .35 * u, y + lift]], sw * .8, HAIR, 'ink');
    inkLine([[hx + .35 * u, y + lift], [hx + 1.85 * u, y + lift + tilt * u]], sw * .8, HAIR, 'ink');
  }
}

function animeMouth(x, y, u, sw, kind, o) {
  const w = u * .55;
  if (!kind || kind === 'flat') { inkLine([[x - w * .6, y], [x + w * .6, y]], sw * .8, '#A85A68', 'ink'); return; }
  if (kind === 'smile' || kind === 'grin' || kind === 'cat') {
    inkLine(through([[x - w, y], [x, y + w * .55], [x + w, y]]), sw * .9, '#A85A68', 'ink', .5);
    if (kind === 'grin') paint(ellPts(x, y + w * .2, w * .7, w * .28, 10), { wash: '#E7A0B0', ink: null });
    return;
  }
  if (kind === 'frown' || kind === 'pout') {
    inkLine(through([[x - w * .8, y + w * .25], [x, y - w * .2], [x + w * .8, y + w * .25]]), sw * .9, '#A85A68', 'ink', .5);
    return;
  }
  if (kind === 'o' || kind === 'O' || kind === 'open' || kind === 'wail' || kind === 'laugh') {
    const h = kind === 'O' || kind === 'wail' || kind === 'laugh' ? w * .7 : w * .4;
    paint(ellPts(x, y + h * .2, w * .45, h, 12), { wash: '#6E3040', ink: PAL.ink, sw: sw * .6 });
    return;
  }
  if (kind === 'wobble' || kind === 'smirk') {
    const k = kind === 'smirk' ? .2 : Math.sin(T * 6) * .15;
    inkLine(through([[x - w, y], [x - w * .2, y + w * k], [x + w, y - w * .1]]), sw * .8, '#A85A68', 'ink');
    return;
  }
  inkLine([[x - w * .5, y], [x + w * .5, y]], sw * .75, '#A85A68', 'ink');
}

// props used across the film
function paperStar(x, y, s, rot = -Math.PI / 2, shine = 1) {
  boilSeed('pstar' + Math.round(x) + Math.round(y));
  if (shine > 0) glow(x, y, s * 4.5, '#FFD78A', .55 * shine);
  paint(starPts(x, y, s, .42, 5, rot), { wash: '#F8E3A4', ink: PAL.ink, sw: clamp(s / 18, .4, 1.6) });
  inkLine([[x, y - s * .15], [x, y + s * .15]], clamp(s / 22, .3, 1), '#E8B84A', 'inkfine');
}

function umbrella(x, y, s, open = 1) {
  boilSeed('umb' + Math.round(x));
  const k = clamp(open);
  const hubY = y;
  inkLine([[x, hubY], [x, hubY + s * 1.35]], clamp(s / 28, .8, 2.2), '#3A3144', 'ink');
  paint(ellPts(x, hubY + s * 1.32, s * .09, s * .06, 8), { wash: '#3A3144', ink: null });
  if (k < .08) return;
  const rx = s * (0.5 + 1.35 * k), ry = s * .9 * k;
  const pts = [];
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI + i / 12 * Math.PI;
    pts.push([x + Math.cos(a) * rx, hubY + Math.sin(a) * ry]);
  }
  pts.push([x + rx * .92, hubY + s * .08], [x - rx * .92, hubY + s * .08]);
  paint(pts, { wash: '#E7B15A', ink: PAL.ink, sw: clamp(s / 26, .7, 1.8) });
  paint(ellPts(x, hubY - ry * .45, rx * .28, ry * .22, 10), { fill: '#F6D48A', fillOp: 140, bleed: .12, tex: .4, ink: null });
  for (const a of [Math.PI + .35, Math.PI + .8, Math.PI + 1.15, Math.PI + 1.6]) {
    inkLine([[x, hubY], [x + Math.cos(a) * rx * .92, hubY + Math.sin(a) * ry * .92]], .7, '#8A6230', 'inkfine');
  }
}

function wishBottle(x, y, s, bob = 0, lit = 1) {
  boilSeed('bot' + Math.round(x * 10));
  const yy = y + bob;
  paint(rrPts(x - s * .28, yy - s * .15, s * .56, s * 1.15, s * .2), { wash: '#D5E4EC', washOp: 210, ink: PAL.ink, sw: clamp(s / 20, .35, 1.2) });
  paint(rrPts(x - s * .12, yy - s * .42, s * .24, s * .32, s * .08), { wash: '#C5D6E0', ink: PAL.ink, sw: clamp(s / 24, .3, 1) });
  if (lit > 0) {
    glow(x, yy + s * .35, s * 1.6, '#FFD78A', .45 * lit);
    paperStar(x, yy + s * .4, s * .28, T * .4, 0);
  }
}

function piano(x, y, s) {
  boilSeed('piano');
  paint(rrPts(x, y - s * 2.1, s * 2.4, s * 2.1, s * .08), { wash: '#4A372C', ink: PAL.ink, sw: 1.3 });
  paint(rrPts(x + s * .15, y - s * 1.85, s * 2.1, s * .55, s * .04), { wash: '#F4E7D4', ink: PAL.ink, sw: .8 });
  for (let i = 0; i < 8; i++) paint(rectPts(x + s * .28 + i * s * .22, y - s * 1.78, s * .16, s * .4), { wash: i % 3 === 0 ? '#2B2233' : '#FBF6EE', ink: null });
  paint(rrPts(x - s * .15, y - s * .35, s * .7, s * .35, s * .06), { wash: '#6B4E3E', ink: PAL.ink, sw: .8 });
}
