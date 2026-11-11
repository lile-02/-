// 小星星. One night, one star, one person who cannot quite let go.
// Shot times are the lyric starts. Reads are sequenced inside each shot; nothing stacks.
(() => {
  const GY = 1040;
  const STAR = (uu) => paperStar(0, uu * .1, uu * .95, -Math.PI / 2 + Math.sin(T) * .08, 1);
  const BROLL = (uu) => umbrella(0, -uu * .2, uu * 1.15, 1);

  function camPerson(x, u, z = 1.18) { camBegin(x, GY - u * 7.6, z); }
  function skyStar(x, y, s, t) {
    const pulse = 1 + .08 * Math.sin(t * 2.2);
    glow(x, y, s * 5.2 * pulse, '#FFD78A', .85);
    paperStar(x, y, s * pulse, t * .15, 0);
  }

  // 0 — iris opens on the roof. They walk in and find the star.
  function intro(t, lt, dur) {
    nightRoof(t);
    skyStar(1460, 210, 34, t);
    const walk = stroll(t, .6, 3.1, 420, 900, 26);
    const mood = emotions(t, [[0, 'neutral'], [2.2, 'hopeful', { lookY: -.85 }], [4.3, 'starstruck', { lookY: -.9 }]]);
    const view = lt < 2.5 ? 'side' : 'q';
    camPerson(lerp(640, walk.x, .65), 26, 1.12);
    lead(walk.x, GY, 26, { ...mood, x: walk.x, walk: walk.walk, flip: false, view, dy: mood.dy + walk.dy, aR: lt > 3.3 ? 1.2 : mood.aR, lookY: -.8 });
    camEnd();
    if (lt < .75) iris(1180, 280, lerp(0, 1700, easeOut(lt / .75)), '#14182E');
    wipeOut(lt, dur, WIPE_NIGHT);
  }

  // 5.65 — they reach, and a paper star comes loose.
  function reach(t, lt, dur) {
    nightRoof(t, { mx: 260 });
    const fall = lt > 2.1 ? easeOut(seg(lt, 2.1, 4.4)) : 0;
    if (fall > 0) paperStar(lerp(1280, 980, fall), lerp(180, 760, fall), 22, t, 1);
    else skyStar(1280, 180, 30, t);
    const mood = emotions(t, [[5.65, 'hopeful'], [7.4, 'surprised', { lookY: -1 }], [9.6, 'happy']]);
    const reachA = lt < 1.6 ? lerp(-.3, 1.45, easeOut(seg(lt, .4, 1.5))) : lerp(1.45, .4, easeOut(seg(lt, 3.6, 5)));
    camPerson(940, 28, 1.22);
    lead(940, GY, 28, { ...mood, view: 'q', aR: reachA, aL: -.2 });
    camEnd();
    wipeIn(lt, WIPE_NIGHT); wipeOut(lt, dur, WIPE_NIGHT);
  }

  // 11.31 — the paper star lands in their hands. The smile fades: the place beside them is empty.
  function caught(t, lt, dur) {
    nightRoof(t, { mx: 1480, my: 180 });
    const mood = emotions(t, [[11.31, 'happy'], [13.3, 'love'], [15.1, 'shy', { lookX: .8 }]]);
    const held = lt > .45;
    camPerson(900, 30, 1.28);
    lead(900, GY, 30, { ...mood, view: 'front', aR: held ? -.05 : .8, aL: held ? -.45 : -.4, armR: held ? STAR : null });
    if (!held) paperStar(lerp(1100, 980, easeOut(lt / .45)), lerp(420, 780, easeOut(lt / .45)), 20, t, 1);
    camEnd();
    wipeIn(lt, WIPE_NIGHT); wipeOut(lt, dur, WIPE_RAIN);
  }

  // 16.96 — not brave. They step back, the star against their chest.
  function brave(t, lt, dur) {
    street(t, false);
    const back = lerp(980, 820, easeOut(seg(lt, .3, 1.6)));
    const mood = emotions(t, [[16.96, 'shy'], [18.2, 'sad']]);
    camPerson(back, 32, 1.35);
    lead(back, GY, 32, { ...mood, view: 'front', armR: STAR, aR: -.2, aL: -.55 });
    camEnd();
    wipeIn(lt, WIPE_RAIN); wipeOut(lt, dur, WIPE_RAIN);
  }

  // 19.85 — please don't leave. The rose coat walks away. They reach, too late to arrive.
  function leave(t, lt, dur) {
    street(t, false);
    const rx = lerp(1080, 1480, ease(seg(lt, .15, 3.4)));
    departed(rx, GY, 30, { view: 'back', walk: lt * 1.4, aL: .55, aR: -.15, dy: -Math.abs(Math.sin(lt * 6)) * .35 });
    const mood = emotions(t, [[19.85, 'scared'], [21.4, 'sad', { lookX: 1 }]]);
    const arm = lerp(-.2, 1.25, easeOut(seg(lt, .4, 1.3)));
    camBegin(980, GY - 280, 1.28);
    lead(700, GY, 32, { ...mood, view: 'side', aR: arm, armR: STAR });
    camEnd();
    wipeIn(lt, WIPE_RAIN); wipeOut(lt, dur, WIPE_RAIN);
  }

  // 23.80 — love that cannot be replayed. Stars fall. They catch one; two pass them.
  function cannot(t, lt, dur) {
    street(t, false);
    const mood = emotions(t, [[23.8, 'sad'], [25.2, 'nervous'], [26.4, 'relieved']]);
    camPerson(900, 28, 1.16);
    lead(900, GY, 28, { ...mood, view: 'q', aR: lt > 1.5 ? .9 : .2, armR: lt > 1.8 ? STAR : null });
    for (let i = 0; i < 5; i++) {
      const delay = i * .45;
      const k = clamp((lt - delay) / 2.6);
      const x = 520 + i * 180 + Math.sin(i + t) * 20;
      const y = lerp(-40, 1100, k);
      if (k > 0 && k < 1 && !(i === 2 && lt > 1.8)) paperStar(x, y, 16, t + i, .7);
    }
    camEnd();
    wipeIn(lt, WIPE_RAIN); wipeOut(lt, dur, WIPE_RAIN);
  }

  // 27.30 — they try to let the star go. It rises, then settles back into the open hand.
  function release(t, lt, dur) {
    street(t, false);
    const mood = emotions(t, [[27.3, 'sad'], [28.6, 'hopeful'], [30.1, 'shy']]);
    const up = Math.sin(clamp(seg(lt, .4, 2.8)) * Math.PI);
    camPerson(960, 32, 1.4);
    lead(960, GY, 32, { ...mood, view: 'front', aR: .35 + up * .4, aL: -.7, armR: up < .15 ? STAR : null });
    if (up >= .15) paperStar(1080, lerp(760, 560, up), 20 + up * 6, t, 1);
    camEnd();
    wipeIn(lt, WIPE_RAIN); wipeOut(lt, dur, WIPE_RAIN);
  }

  // 30.85 — wandering the street. A puddle holds the same star.
  function wander(t, lt, dur) {
    street(t, false);
    const walk = stroll(t, 30.9, 33.5, 480, 1280, 26);
    boilSeed('puddle');
    paint(ellPts(1500, 960, 150, 28, 14), { fill: '#9BB4C8', fillOp: 140, bleed: .2, ink: null });
    paperStar(1500, 948, 10, t, .4);
    camBegin(walk.x, GY - 180, 1.05);
    lead(walk.x, GY, 26, { ...feel('bored', t), ...walk, view: 'side', armL: STAR, aL: -.2, mouth: 'frown', eyes: 'sad' });
    camEnd();
    wipeIn(lt, WIPE_RAIN); wipeOut(lt, dur, WIPE_RAIN);
  }

  // 33.97 — rain. They open an umbrella and hurry toward the rose coat.
  function rainUmbrella(t, lt, dur) {
    street(t, true);
    const open = easeOut(seg(lt, .25, .9));
    const walk = stroll(t, 34.3, 37.4, 640, 980, 32);
    departed(walk.x + 210, GY, 32, { view: 'back', walk: lt * .4, aL: .35, dy: -Math.abs(Math.sin(lt * 5)) * .25 });
    camBegin(walk.x + 120, GY - 340, 1.34);
    lead(walk.x, GY, 32, { ...feel('determined', t), ...walk, view: 'side', eyes: 'determined', mouth: 'flat', aR: 1.25, emote: null });
    umbrella(walk.x + 100, GY - 32 * 15.2, 130, open);
    camEnd();
    wipeIn(lt, WIPE_RAIN); wipeOut(lt, dur, WIPE_RAIN);
  }

  // 37.90 — the coat is gone. The umbrella covers nobody. It droops.
  function hinder(t, lt, dur) {
    street(t, true);
    const droop = ease(seg(lt, 1.1, 2.6));
    const mood = emotions(t, [[37.9, 'hopeful'], [39.2, 'sad'], [40.6, 'cry']]);
    camPerson(900, 32, 1.32);
    lead(900, GY, 32, { ...mood, view: 'q', aR: lerp(1.25, .15, droop), emote: null });
    umbrella(900, GY - 32 * 14.8, 86 * lerp(1, .75, droop), lerp(1, .25, droop));
    camEnd();
    wipeIn(lt, WIPE_RAIN); wipeOut(lt, dur, WIPE_RAIN);
  }

  // 41.31 — bless them. A wave, and the heart-mark becomes a star that leaves.
  function bless(t, lt, dur) {
    street(t, lt < 1.2);
    const mood = emotions(t, [[41.31, 'sad'], [42.4, 'hopeful'], [43.8, 'love']]);
    const fly = easeOut(seg(lt, 1.3, 3.3));
    camPerson(960, 30, 1.22);
    lead(960, GY, 30, { ...mood, view: 'q', aR: lt > .4 && lt < 2.2 ? 1.15 + Math.sin(lt * 8) * .25 : .2, emote: fly > .05 ? null : mood.emote });
    if (fly > 0) paperStar(lerp(1120, 1500, fly), lerp(620, 220, fly), 16 + fly * 10, t, 1);
    camEnd();
    wipeIn(lt, WIPE_RAIN); wipeOut(lt, dur, WIPE_ROOM);
  }

  // 45.03 — inside. Weather crosses the window.
  function weather(t, lt, dur) {
    const cloud = lerp(-200, 900, ease(seg(lt, .2, 2.8)));
    room(t, { night: true, out: '#667EAA' });
    boilSeed('cloud');
    paint(ellPts(1080 + cloud, 280, 120, 36, 12), { fill: '#E7EEF4', fillOp: 180, bleed: .25, ink: null });
    const mood = emotions(t, [[45.03, 'neutral', { lookX: .6 }], [46.8, 'nervous']]);
    camBegin(620, 640, 1.15);
    lead(560, GY, 28, { ...mood, view: 'q', lookX: .7 });
    camEnd();
    wipeIn(lt, WIPE_ROOM); wipeOut(lt, dur, WIPE_ROOM);
  }

  // 48.21 — their heart is the weather. The glass reflection looks the other way.
  function uneasy(t, lt, dur) {
    room(t, { night: true, out: '#5A7094' });
    const mood = emotions(t, [[48.21, 'nervous'], [50.2, 'sad']]);
    camBegin(640, 700, 1.22);
    lead(520, GY, 32, { ...mood, view: 'q', lookX: .7, emote: 'sweat' });
    // the glass holds a smaller figure that looks the other way
    lead(1360, 900, 16, { ...feel('sad', t), view: 'q', lookX: -.9, eyes: 'sad', mouth: 'flat', boilKey: 'refl', noShadow: true, emote: null });
    camEnd();
    wipeIn(lt, WIPE_ROOM); wipeOut(lt, dur, WIPE_ROOM);
  }

  // 51.64 — if this is the ending. They sit. The star rests on the sill.
  function ifEnd(t, lt, dur) {
    room(t, { night: true });
    paperStar(1360, 700, 16, t * .4, .8);
    const sit = lerp(0, .35, easeOut(seg(lt, .15, .8)));
    camBegin(820, 700, 1.18);
    lead(760, GY + sit * 40, 28, { ...feel('sad', t), view: 'side', lookX: .6, dy: sit, sq: sit * .15, aL: -.6, aR: -.5 });
    camEnd();
    wipeIn(lt, WIPE_ROOM); wipeOut(lt, dur, WIPE_ROOM);
  }

  // 53.81 — I hope you... hand toward the glass.
  function hopeYou(t, lt, dur) {
    room(t, { night: true });
    paperStar(1360, 680, 16, 0, .9);
    const arm = lerp(-.4, 1.15, easeOut(seg(lt, .1, .9)));
    camBegin(900, 640, 1.25);
    lead(820, GY, 30, { ...feel('hopeful', t), view: 'side', aR: arm, lookX: .8 });
    camEnd();
    wipeIn(lt, WIPE_ROOM);
  }

  // 55.57 — are truly satisfied. They nod, and half the curtain falls.
  function satisfied(t, lt, dur) {
    const nod = Math.sin(clamp(seg(lt, .25, 1.1)) * Math.PI) * .18;
    room(t, { night: true, curtain: ease(seg(lt, .5, 2.2)) });
    camBegin(860, 600, 1.35);
    lead(800, GY, 32, { ...feel('relieved', t), view: 'front', rot: nod, lookY: .3 });
    camEnd();
  }

  // 58.35 — I hope you can hear me. The window opens; the star outside brightens.
  function hear(t, lt, dur) {
    const k = easeOut(seg(lt, .2, 1.4));
    room(t, { night: true, out: mixCol('#667EAA', '#1A2148', k) });
    skyStar(1500, 280, 18 + 16 * k, t);
    camBegin(880, 620, 1.16 + k * .08);
    lead(800, GY, 30, { ...emotions(t, [[58.35, 'shy'], [59.6, 'hopeful', { lookY: -.6 }]]), view: 'q', aR: .4 + k * .5 });
    camEnd();
    wipeOut(lt, dur, WIPE_NIGHT);
  }

  // 61.02 — you are my little star. Back on the roof. The star flares.
  function youAre(t, lt, dur) {
    nightRoof(t);
    const grow = 28 + easeOut(seg(lt, .2, 2.2)) * 26;
    skyStar(1100, 240, grow, t);
    const mood = emotions(t, [[61.02, 'surprised', { lookY: -1 }], [62.4, 'starstruck'], [63.6, 'love']]);
    camPerson(780, 30, 1.16);
    lead(780, GY, 30, { ...mood, view: 'q', lookY: -.95, armR: STAR });
    camEnd();
    wipeIn(lt, WIPE_NIGHT); wipeOut(lt, dur, WIPE_NIGHT);
  }

  // 64.43 — hanging in the sky, giving light. Tilt up. They become small under it.
  function hanging(t, lt, dur) {
    nightRoof(t, { stars: 40 });
    const lift = ease(seg(lt, 0, 2.2));
    skyStar(960, lerp(420, 200, lift), lerp(40, 70, lift), t);
    camBegin(960, lerp(640, 420, lift), lerp(1.05, .78, lift));
    lead(960, GY, 26, { ...feel('starstruck', t), view: 'front', lookY: -1, aL: .9, aR: 1.05 });
    camEnd();
    wipeIn(lt, WIPE_NIGHT); wipeOut(lt, dur, WIPE_NIGHT);
  }

  // 67.81 — I have decided to love you. They tie a string and hold.
  function decided(t, lt, dur) {
    nightRoof(t);
    skyStar(1200, 200, 36, t);
    const mood = emotions(t, [[67.81, 'determined'], [69.8, 'proud']]);
    camPerson(900, 32, 1.32);
    lead(900, GY, 32, { ...mood, view: 'front', aR: 1.05, armR: STAR, aL: -.4 });
    boilSeed('string');
    inkLine([[980, 690], [1040, 620], [1120, 500], [1200, 250]], 1.3, '#F6E6CE', 'inkfine', .4);
    camEnd();
    wipeIn(lt, WIPE_NIGHT); wipeOut(lt, dur, WIPE_NIGHT);
  }

  // 71.45 — will not give up easily. The wind pulls; they lean and hold.
  function holdOn(t, lt, dur) {
    nightRoof(t);
    const wind = Math.sin(lt * 2.4) * 18;
    skyStar(1320 + wind, 210, 34, t);
    const lean = .12 + .06 * Math.sin(lt * 2.4);
    camPerson(860, 32, 1.28);
    lead(860, GY, 32, { ...feel('determined', t), view: 'q', rot: -lean, aR: 1.2, armR: STAR, eyes: 'determined', mouth: 'flat' });
    camEnd();
    wipeIn(lt, WIPE_NIGHT); wipeOut(lt, dur, WIPE_SEA);
  }

  // 75 — wish bottles on the sea.
  function bottles(t, lt, dur) {
    sea(t);
    for (let i = 0; i < 6; i++) {
      const x = 180 + i * 280 + Math.sin(t * .7 + i) * 16;
      const y = 700 + Math.sin(t * 1.1 + i * 1.3) * 14;
      wishBottle(x, y, 36 + (i % 3) * 6, 0, .3 + .7 * hash(i + 4));
    }
    camBegin(620, 720, 1.28);
    lead(480, GY, 32, { ...feel('hopeful', t, { lookX: .7 }), view: 'side' });
    camEnd();
    wipeIn(lt, WIPE_SEA); wipeOut(lt, dur, WIPE_SEA);
  }

  // 78.51 — every wish is for you. Bottles open into rising stars.
  function wishes(t, lt, dur) {
    sea(t);
    camBegin(860, 700, 1.08);
    for (let i = 0; i < 5; i++) {
      const k = clamp((lt - i * .45) / 1.5);
      const x = 360 + i * 250;
      wishBottle(x, 760 + Math.sin(t + i) * 10, 34, 0, 1 - k);
      if (k > 0) paperStar(x, lerp(740, 220, easeOut(k)), 12 + k * 8, t, k);
    }
    lead(460, GY, 28, { ...feel('love', t), view: 'q', lookY: -.5, aL: .3, aR: .45 });
    camEnd();
    wipeIn(lt, WIPE_SEA); wipeOut(lt, dur, WIPE_SEA);
  }

  // 81.78 — even if we cannot be together. A bottle leaves their hand. They stay.
  function apart(t, lt, dur) {
    sea(t);
    const k = ease(seg(lt, .3, 3.2));
    camBegin(800, 740, 1.14);
    lead(620, GY, 30, { ...emotions(t, [[81.78, 'sad'], [83.6, 'relieved']]), view: 'side', aR: lerp(.8, .15, k) });
    wishBottle(lerp(760, 1500, k), lerp(760, 680, Math.sin(k * Math.PI) * .3 + (1 - k) * .15), 40, Math.sin(t * 2) * 6, 1);
    camEnd();
    wipeIn(lt, WIPE_SEA); wipeOut(lt, dur, WIPE_SEA);
  }

  // 85.56 — I still worry. They sit and watch the bottle through the long tide.
  function worry(t, lt, dur) {
    sea(t);
    const tide = Math.sin(lt * .35) * 30;
    const sit = lt < 1.2 ? easeOut(lt / 1.2) : 1;
    camBegin(760, 740, 1.28);
    lead(600, GY + sit * 30, 34, { ...feel('sad', t), view: 'side', lookX: .8, dy: sit * .2, sq: sit * .08, aL: -.55, aR: -.2 });
    wishBottle(1180 + Math.sin(lt * .4) * 40, 700 + tide, 42, Math.sin(t * 1.6) * 8, 1);
    camEnd();
    wipeIn(lt, WIPE_SEA);
  }

  // 93.2 — a wave almost takes the bottle. They step in and nudge it back out.
  function nudge(t, lt, dur) {
    sea(t);
    const step = stroll(t, 93.4, 95.2, 640, 980, 28);
    const back = stroll(t, 96.2, 98.2, 980, 700, 28);
    const moving = lt < 4.6 ? step : back;
    const touch = lt > 2.2 && lt < 3.6;
    camBegin(moving.x + 120, 760, 1.1);
    lead(moving.x, GY - (touch ? 10 : 0), 28, { ...feel(touch ? 'determined' : 'nervous', t), ...moving, view: 'side', aR: touch ? 1.05 : .2 });
    const bx = touch ? lerp(1200, 1360, ease(seg(lt, 2.3, 3.4))) : 1280 + Math.sin(t) * 20;
    wishBottle(bx, 690, 40, Math.sin(t * 2) * 6, 1);
    camEnd();
  }

  // 99-ish handled inside nudge until 103.32? I'll split look-up at 99.4 as its own shot in the list.

  function lookUp(t, lt, dur) {
    sea(t);
    skyStar(1100, 180, 32, t);
    const mood = emotions(t, [[99.4, 'sad'], [101.2, 'hopeful', { lookY: -.9 }]]);
    camPerson(800, 30, 1.16);
    lead(800, GY, 30, { ...mood, view: 'q', lookY: -.8 });
    camEnd();
    wipeOut(lt, dur, WIPE_ROOM);
  }

  // second verse — the room, but they are already standing, and the rain is heavier
  function weather2(t, lt, dur) {
    room(t, { night: true, out: '#4E6280' });
    rain(t, 18);
    camBegin(700, 640, 1.18);
    lead(620, GY, 30, { ...feel('nervous', t, { lookX: .7 }), view: 'q' });
    paperStar(1320, 640, 18, t * .3, 1);
    camEnd();
    wipeIn(lt, WIPE_ROOM); wipeOut(lt, dur, WIPE_ROOM);
  }

  function uneasy2(t, lt, dur) {
    room(t, { night: true, out: '#3E5270' });
    camBegin(640, 700, 1.24);
    lead(520, GY, 32, { ...feel('sad', t), view: 'front', lookY: .15, emote: null });
    lead(1360, 900, 16, { ...feel('happy', t), view: 'front', boilKey: 'refl2', noShadow: true, eyes: 'happy', mouth: 'smile', emote: null });
    camEnd();
    wipeIn(lt, WIPE_ROOM); wipeOut(lt, dur, WIPE_ROOM);
  }

  function ifEnd2(t, lt, dur) {
    room(t, { night: true });
    const shut = ease(seg(lt, .2, 1.2));
    camBegin(860, 600, 1.45);
    lead(860, GY, 36, { ...feel('sad', t), view: 'front', squint: shut, eyes: shut > .7 ? 'closed' : 'sad' });
    camEnd();
    wipeIn(lt, WIPE_ROOM);
  }

  function hope2(t, lt, dur) {
    room(t, { night: true });
    camBegin(860, 560, 1.5);
    lead(860, GY, 36, { ...feel('hopeful', t), view: 'front', lookY: -.7, squint: lerp(.8, 0, easeOut(seg(lt, .05, .7))) });
    camEnd();
  }

  function satisfied2(t, lt, dur) {
    room(t, { night: true, curtain: .35 });
    paperStar(1280, 620, 20, t * .5, 1);
    camBegin(800, 640, 1.25);
    lead(740, GY, 32, { ...feel('relieved', t), view: 'q', lookX: .6, rot: Math.sin(clamp(lt / .8) * Math.PI) * .12 });
    camEnd();
  }

  function hear2(t, lt, dur) {
    room(t, { night: true });
    const k = easeOut(seg(lt, .15, 1.2));
    skyStar(1480, 260, 16 + 18 * k, t);
    camBegin(820, 620, 1.2);
    lead(740, GY, 30, { ...feel('shy', t), view: 'side', aR: .2 + k, mouth: k > .4 ? 'o' : 'wobble', lookX: .9 });
    camEnd();
    wipeOut(lt, dur, WIPE_NIGHT);
  }

  // chorus 2 — more stars, a slow turn through the views
  function youAre2(t, lt, dur) {
    nightRoof(t, { stars: 36 });
    for (let i = 0; i < 7; i++) skyStar(200 + i * 240, 140 + (i % 2) * 80, 16 + (i % 3) * 6, t + i);
    const spin = turn(t, 119.2, 122.2, 0, 1);
    camPerson(960, 32, 1.2);
    lead(960, GY, 32, { ...feel('starstruck', t), ...spin, armL: STAR });
    camEnd();
    wipeIn(lt, WIPE_NIGHT); wipeOut(lt, dur, WIPE_NIGHT);
  }

  function hanging2(t, lt, dur) {
    nightRoof(t, { stars: 42 });
    const up = ease(seg(lt, .2, 2));
    skyStar(960, lerp(360, 160, up), lerp(48, 78, up), t);
    camBegin(960, lerp(620, 460, up), lerp(1.1, .82, up));
    const hop = Math.sin(clamp(seg(lt, .4, 1.6)) * Math.PI);
    lead(960, GY, 28, { ...feel('excited', t), view: 'front', dy: -hop * 1.4, aL: 1.15, aR: 1.15, lookY: -1 });
    camEnd();
    wipeIn(lt, WIPE_NIGHT); wipeOut(lt, dur, WIPE_NIGHT);
  }

  function decided2(t, lt, dur) {
    nightRoof(t);
    skyStar(1280, 200, 34, t);
    const k = easeOut(seg(lt, .3, 1.6));
    camPerson(900, 34, 1.36);
    lead(900, GY, 34, { ...feel('determined', t), view: 'front', aL: lerp(.2, -.2, k), aR: lerp(.4, -.15, k), armL: k > .55 ? STAR : null, armR: k > .55 ? STAR : null });
    if (k <= .55) paperStar(lerp(1100, 900, k / .55), lerp(560, 760, k / .55), 18, t, 1);
    camEnd();
    wipeIn(lt, WIPE_NIGHT); wipeOut(lt, dur, WIPE_NIGHT);
  }

  function holdOn2(t, lt, dur) {
    nightRoof(t);
    const gust = Math.sin(lt * 3) * .1;
    camPerson(880, 34, 1.34);
    lead(880, GY, 34, { ...feel('determined', t), view: 'front', rot: -gust, sq: .04, armL: STAR, armR: STAR, aL: -.05, aR: -.05, eyes: 'determined' });
    camEnd();
    wipeIn(lt, WIPE_NIGHT); wipeOut(lt, dur, WIPE_SEA);
  }

  function bottles2(t, lt, dur) {
    sea(t);
    for (let i = 0; i < 8; i++) wishBottle(120 + i * 230, 640 + (i % 2) * 50 + Math.sin(t + i) * 10, 30 + (i % 4) * 5, 0, .8);
    camBegin(520, 780, 1.08);
    lead(420, GY, 26, { ...feel('hopeful', t), view: 'side', lookX: .8 });
    camEnd();
    wipeIn(lt, WIPE_SEA); wipeOut(lt, dur, WIPE_SEA);
  }

  function wishes2(t, lt, dur) {
    sea(t);
    skyStar(960, 160, 40, t);
    camBegin(900, 680, 1.05);
    for (let i = 0; i < 6; i++) {
      const k = clamp((lt - i * .35) / 1.6);
      const x = 280 + i * 240;
      if (k < .85) wishBottle(x, 760, 28, 0, 1 - k);
      if (k > 0) paperStar(lerp(x, 960, k), lerp(740, 200, easeOut(k)), 12, t, k);
    }
    lead(420, GY, 28, { ...feel('love', t), view: 'q', lookY: -.7 });
    camEnd();
    wipeIn(lt, WIPE_SEA); wipeOut(lt, dur, WIPE_SEA);
  }

  function apart2(t, lt, dur) {
    sea(t);
    const k = ease(seg(lt, .2, 3.4));
    camPerson(700, 30, 1.16);
    lead(640, GY, 30, { ...feel('sad', t), view: 'side', aR: lerp(1, .2, k), armR: k < .2 ? () => paperStar(0, 0, 16, 0, 1) : null });
    wishBottle(lerp(820, 1600, k), 700 - Math.sin(k * Math.PI) * 40, 38, Math.sin(t * 2) * 5, 1);
    camEnd();
    wipeIn(lt, WIPE_SEA); wipeOut(lt, dur, WIPE_SEA);
  }

  function worry2(t, lt, dur) {
    sea(t);
    const up = easeOut(seg(lt, 1.2, 2.6));
    camPerson(800, 32, 1.24);
    lead(800, GY, 32, {
      ...emotions(t, [[143.8, 'sad'], [145.6, 'hopeful']]),
      view: 'front', dy: -up * .4, armL: STAR, aL: -.1, aR: -.5,
    });
    glow(800, GY - 32 * 6.2, 70, '#FFD78A', .35 + up * .4);
    camEnd();
    wipeIn(lt, WIPE_SEA); wipeOut(lt, dur, WIPE_ROOM);
  }

  // 149.15 — sadness as a concerto. They sit down at a small piano.
  function concerto(t, lt, dur) {
    room(t, { night: true, wx: 1280, ww: 480, wh: 520 });
    piano(980, 900, 150);
    const sit = easeOut(seg(lt, .2, 1.3));
    camBegin(820, 680, 1.12);
    lead(760, GY + sit * 20, 26, { ...feel('sad', t), view: 'side', dy: sit * .15, aL: lerp(-.2, .55, sit), aR: lerp(-.2, .7, sit) });
    camEnd();
    wipeIn(lt, WIPE_ROOM); wipeOut(lt, dur, WIPE_ROOM);
  }

  // 152.62 — playing in the corner. Little stars leave the keys on the beat.
  function playing(t, lt, dur) {
    room(t, { night: true, wx: 1280, ww: 480, wh: 520 });
    piano(980, 900, 160);
    const beat = pulse(t, 5);
    camBegin(860, 700, 1.16);
    lead(740, GY + 16, 28, { ...feel('neutral', t), view: 'side', eyes: 'sad', mouth: 'flat', aL: .5 + beat * .35, aR: .65 + (1 - beat) * .3, dy: .12 });
    for (let i = 0; i < 4; i++) {
      const age = (lt + i * .4) % 1.6;
      paperStar(1100 + i * 30, lerp(760, 420, age / 1.6), 10, t, 1 - age / 1.6);
    }
    camEnd();
    wipeIn(lt, WIPE_ROOM); wipeOut(lt, dur, WIPE_ROOM);
  }

  // 155.65 — you may not hear it. The notes fade before the window.
  function cannotHear(t, lt, dur) {
    room(t, { night: true, wx: 1180, ww: 560, wh: 560 });
    piano(700, 920, 140);
    camBegin(900, 680, 1.02);
    lead(560, GY + 10, 26, { ...feel('sad', t), view: 'side', aL: .45, aR: .6 });
    for (let i = 0; i < 5; i++) {
      const k = (lt * .4 + i * .2) % 1;
      const a = k * (1 - k * .3);
      paperStar(lerp(820, 1500, k), lerp(760, 300, k), 12 * (1 - k), t, a);
    }
    camEnd();
    wipeIn(lt, WIPE_ROOM); wipeOut(lt, dur, WIPE_ROOM);
  }

  // 159.65 — it is still what I mean. One star reaches the sill and stays.
  function meaning(t, lt, dur) {
    room(t, { night: true, wx: 1180, ww: 560 });
    piano(680, 920, 130);
    const k = easeOut(seg(lt, .1, 1.8));
    paperStar(lerp(860, 1400, k), lerp(700, 560, ease(k)), 14 + (1 - k) * 4, t, .4 + k);
    const mood = emotions(t, [[159.65, 'sad'], [161.2, 'surprised', { lookX: 1 }], [162.4, 'relieved']]);
    camBegin(820, 700, 1.1);
    lead(620, GY, 28, { ...mood, view: 'side', lookX: .9, aR: .3 });
    camEnd();
    wipeIn(lt, WIPE_ROOM); wipeOut(lt, dur, WIPE_ROOM);
  }

  // 163.18 — love need not be sweet. An empty rose coat on the chair. A quiet smile.
  function notSweet(t, lt, dur) {
    room(t, { night: true });
    boilSeed('chair');
    paint(rrPts(1180, 760, 200, 180, 16), { wash: '#8A6A52', ink: PAL.ink, sw: 1 });
    paint([[1200, 620], [1360, 620], [1340, 780], [1220, 780]], { wash: ROSE, ink: PAL.ink, sw: 1 });
    camBegin(760, 660, 1.18);
    lead(680, GY, 30, { ...emotions(t, [[163.18, 'sad'], [165, 'shy']]), view: 'q', lookX: .6, mouth: 'smile', eyes: 'sad' });
    camEnd();
    wipeIn(lt, WIPE_ROOM); wipeOut(lt, dur, WIPE_ROOM);
  }

  // 166.71 — oaths of mountain and sea, shown as a painted screen, not words. They look at the little star instead.
  function oath(t, lt, dur) {
    room(t, { night: false, out: '#8FB4C8', wx: 1500, ww: 280, wh: 360 });
    boilSeed('screen');
    paint(rrPts(1040, 180, 520, 420, 12), { wash: '#F3E6D2', ink: PAL.ink, sw: 1.4 });
    paint([[1080, 360], [1220, 240], [1360, 360], [1320, 520], [1120, 520]], { fill: '#6E9F78', fillOp: 200, bleed: .1, ink: null });
    paint(rectPts(1280, 400, 240, 140), { fill: '#3A8A98', fillOp: 200, bleed: .08, ink: null });
    const mood = emotions(t, [[166.71, 'neutral'], [168.2, 'love']]);
    camBegin(640, 680, 1.16);
    lead(560, GY, 30, { ...mood, view: 'q', lookY: .35, armR: STAR, aR: -.1 });
    camEnd();
    wipeIn(lt, WIPE_ROOM); wipeOut(lt, dur, WIPE_ROOM);
  }

  // 169.87 — as long as that happiness is in the heart. Close on the chest star.
  function inHeart(t, lt, dur) {
    room(t, { night: true });
    const k = easeOut(seg(lt, .1, 1.4));
    camBegin(900, GY - 34 * 6.4, 1.55 + k * .25);
    lead(900, GY, 36, { ...feel('love', t), view: 'front', armL: STAR, armR: STAR, aL: -.05, aR: -.05, lookY: .45 });
    glow(900, GY - 36 * 6.1, 90 + k * 40, '#FFD78A', .5);
    camEnd();
    wipeIn(lt, WIPE_ROOM); wipeOut(lt, dur, WIPE_ROSE);
  }

  // 173.86 — even if I am acting alone. The room becomes a stage. They bow to a chair that holds the star.
  function alone(t, lt, dur) {
    stage(t);
    paperStar(1240, 760, 22, t * .2, 1);
    boilSeed('seat');
    paint(rrPts(1120, 800, 240, 160, 14), { wash: '#4A3040', ink: PAL.ink, sw: 1 });
    const bow = Math.sin(clamp(seg(lt, 2.2, 4.2)) * Math.PI) * .45;
    camBegin(780, 680, 1.08);
    lead(720, GY, 30, { ...emotions(t, [[173.86, 'shy'], [176.4, 'sad'], [179.2, 'hopeful']]), view: 'q', rot: bow, lookX: .7 });
    camEnd();
    wipeIn(lt, WIPE_ROSE); wipeOut(lt, dur, WIPE_NIGHT);
  }

  // 182.62 — in everyone's heart. A city of small stars in the windows. Push toward one.
  function everyone(t, lt, dur) {
    const z = lerp(.72, 1.15, ease(seg(lt, .4, 3.6)));
    const cx = lerp(960, 1280, ease(seg(lt, .4, 3.6)));
    camBegin(cx, lerp(620, 540, ease(seg(lt, .4, 3.6))), z);
    cityNight(t);
    camEnd();
    wipeIn(lt, WIPE_NIGHT); wipeOut(lt, dur, WIPE_NIGHT);
  }

  // 186.63 — there is a little star. The opening roof returns. The star winks. Iris closes on it.
  function littleStar(t, lt, dur) {
    nightRoof(t, { mx: 250, my: 140 });
    const wink = lt > 2.2 && lt < 2.7 ? .35 : 1;
    skyStar(1320, 220, 40 * (.9 + .1 * wink), t);
    const mood = emotions(t, [[186.63, 'love'], [188.4, 'happy'], [190.6, 'starstruck', { lookY: -1 }]]);
    camPerson(820, 30, 1.14);
    lead(820, GY, 30, { ...mood, view: 'q', lookY: -.9, armR: STAR });
    const at = toScreen(1320, 220);
    camEnd();
    wipeIn(lt, WIPE_NIGHT);
    if (lt > dur - 2.2) iris(at[0], at[1], lerp(1600, 0, easeIn((lt - (dur - 2.2)) / 2.2)), '#14182E');
  }

  shots([
    [0, intro],
    [5.65, reach],
    [11.31, caught],
    [16.96, brave],
    [19.85, leave],
    [23.80, cannot],
    [27.30, release],
    [30.85, wander],
    [33.97, rainUmbrella],
    [37.90, hinder],
    [41.31, bless],
    [45.03, weather],
    [48.21, uneasy],
    [51.64, ifEnd],
    [53.81, hopeYou],
    [55.57, satisfied],
    [58.35, hear],
    [61.02, youAre],
    [64.43, hanging],
    [67.81, decided],
    [71.45, holdOn],
    [75.00, bottles],
    [78.51, wishes],
    [81.78, apart],
    [85.56, worry],
    [93.2, nudge],
    [99.4, lookUp],
    [103.32, weather2],
    [106.38, uneasy2],
    [109.82, ifEnd2],
    [112.07, hope2],
    [113.85, satisfied2],
    [116.34, hear2],
    [118.65, youAre2],
    [122.65, hanging2],
    [125.78, decided2],
    [129.68, holdOn2],
    [133.25, bottles2],
    [136.77, wishes2],
    [139.83, apart2],
    [143.80, worry2],
    [149.15, concerto],
    [152.62, playing],
    [155.65, cannotHear],
    [159.65, meaning],
    [163.18, notSweet],
    [166.71, oath],
    [169.87, inHeart],
    [173.86, alone],
    [182.62, everyone],
    [186.63, littleStar],
  ]);
})();
