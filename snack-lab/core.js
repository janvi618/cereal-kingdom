// Snack Lab core: the game data, dealing and scoring, the package drawing, the taste testers,
// and the leaderboard store that both pages share.
import { createRelay, uid } from '../relay.js';
export { uid };

/* ============================== data ============================== */
export const BRIEFS = [
  { text: 'Busy parents need a lunchbox snack kids will actually trade for.', tags: ['kids', 'lunchbox', 'fun'], who: 'Maya, age 9', name: 'Maya' },
  { text: 'College students want a late-night study snack with a kick.', tags: ['bold', 'night', 'energy'], who: 'Jordan, college junior', name: 'Jordan' },
  { text: 'Weekend hikers want fuel that won’t crumble in a backpack.', tags: ['protein', 'portable', 'outdoors'], who: 'Priya, trail runner', name: 'Priya' },
  { text: 'Office workers want a 3pm pick-me-up that feels like a treat.', tags: ['treat', 'adult', 'energy'], who: 'Marcus, project manager', name: 'Marcus' },
  { text: 'Grandparents want a nostalgic snack to share with grandkids.', tags: ['nostalgic', 'share', 'kids'], who: 'Rose, grandmother of four', name: 'Rose' }
];
export const FLAVORS = [
  { name: 'Cinnamon churro', word: 'Churro', tags: ['treat', 'nostalgic', 'kids'], dot: '#C98B4A' },
  { name: 'Spicy mango chili', word: 'Mango', tags: ['bold', 'night'], dot: '#F28C28' },
  { name: 'Maple pancake', word: 'Pancake', tags: ['nostalgic', 'kids', 'share'], dot: '#D9A066' },
  { name: 'Peanut butter honey', word: 'Honey', tags: ['protein', 'kids', 'outdoors'], dot: '#E0A93B' },
  { name: 'Dark chocolate sea salt', word: 'Cocoa', tags: ['treat', 'adult'], dot: '#5B3A29' },
  { name: 'Sour watermelon', word: 'Melon', tags: ['kids', 'fun', 'bold'], dot: '#F0567A' },
  { name: 'Cold brew mocha', word: 'Mocha', tags: ['energy', 'adult', 'night'], dot: '#7A5642' },
  { name: 'Everything bagel', word: 'Bagel', tags: ['adult', 'bold', 'share'], dot: '#C9B48A' }
];
export const FORMATS = [
  { name: 'Crunchy clusters', tags: ['share', 'portable', 'fun'], art: 'clusters' },
  { name: 'Bite-size bars', tags: ['portable', 'protein', 'lunchbox', 'outdoors'], art: 'bars' },
  { name: 'Puffed rings', tags: ['kids', 'fun', 'lunchbox'], art: 'rings' },
  { name: 'Mini sandwich cookies', tags: ['treat', 'nostalgic', 'share'], art: 'cookies' },
  { name: 'Popped chips', tags: ['bold', 'night', 'share'], art: 'chips' },
  { name: 'Squeezable pouch', tags: ['kids', 'lunchbox', 'portable'], art: 'pouch' },
  { name: 'Energy bites', tags: ['energy', 'protein', 'adult'], art: 'bites' }
];
export const LOOKS = [
  { name: 'Playful', tags: ['kids', 'fun'], bag: '#FAC775', band: '#D85A30', bandText: '#FAECE7', text: '#412402', pieces: '#993C1D', burst: '#FFFFFF', burstText: '#712B13' },
  { name: 'Bold', tags: ['bold', 'night'], bag: '#2C2C2A', band: '#E24B4A', bandText: '#FCEBEB', text: '#FAC775', pieces: '#EF9F27', burst: '#E24B4A', burstText: '#FCEBEB' },
  { name: 'Cozy', tags: ['nostalgic', 'share', 'treat'], bag: '#FAEEDA', band: '#854F0B', bandText: '#FAEEDA', text: '#633806', pieces: '#BA7517', burst: '#993C1D', burstText: '#FAECE7' },
  { name: 'Fresh', tags: ['outdoors', 'protein', 'energy'], bag: '#E1F5EE', band: '#0F6E56', bandText: '#E1F5EE', text: '#04342C', pieces: '#1D9E75', burst: '#97C459', burstText: '#173404' },
  { name: 'Premium', tags: ['adult', 'treat'], bag: '#26215C', band: '#AFA9EC', bandText: '#26215C', text: '#EEEDFE', pieces: '#FAC775', burst: '#FAC775', burstText: '#412402' },
  { name: 'Lunchbox hero', tags: ['lunchbox', 'kids'], bag: '#B5D4F4', band: '#185FA5', bandText: '#E6F1FB', text: '#042C53', pieces: '#185FA5', burst: '#FAC775', burstText: '#412402' }
];
export const NO_LOOK = { name: '', tags: [], bag: '#F1EFE8', band: '#B4B2A9', bandText: '#444441', text: '#5F5E5A', pieces: '#B4B2A9', burst: '#D3D1C7', burstText: '#444441' };
export const CLAIMS = {
  kids: 'Kid approved', fun: 'Fun shapes', lunchbox: 'Lunchbox ready', bold: 'Extra bold', night: 'Late night', energy: 'Power up',
  protein: 'Protein packed', portable: 'On the go', outdoors: 'Trail ready', treat: 'Treat yourself', adult: 'Grown-up taste',
  nostalgic: 'Classic recipe', share: 'Share size'
};
export const PREFIXES = ['Mighty', 'Zippy', 'Golden', 'Snappy', 'Happy', 'Wild', 'Little', 'Super'];
export const SUFFIXES = ['Bites', 'Pops', 'Crunch', 'Loops', 'Stacks', 'Rockets', 'Nuggets', 'Munch'];
export const QUOTES = {
  5: () => 'I’d buy this today. Can I get two?',
  4: flavor => flavor ? `Really close. The ${flavor.toLowerCase()} part is spot on.` : 'Really close. It’s nearly spot on.',
  3: () => 'I’d try it once. Not sure it’s made for me.',
  2: () => 'Interesting, but it’s not what I asked for.',
  1: () => 'Hmm. Who is this snack for?'
};
export const ROUND_SECONDS = 60, MAX_SCORE = 1300;

/* ============================== small helpers ============================== */
export const rnd = n => Math.floor(Math.random() * n);
export const pickOne = list => list[rnd(list.length)];
export function shuffle(list){ const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
export const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const BLOCK = /(fuck|shit|bitch|cunt|dick|piss|slut|whore|nazi|fag|nigg|retard)/i;
// Player-entered text: no control characters or angle brackets, single spaces, a length cap, and a basic word filter.
export function cleanText(s, max){ s = String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max).trim(); return BLOCK.test(s) ? '' : s; }
const matches = (tags, want) => tags.filter(t => want.includes(t)).length;
const clampInt = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.floor(+v || 0)));
const idx = (v, n) => (v === null || v === undefined || v === '' || isNaN(+v) || +v < 0 || +v >= n) ? null : Math.floor(+v);

/* ============================== dealing and scoring ============================== */
// Each category shows 4 options: the best match for the brief (ties broken at random) plus 3 others, shuffled.
export function deal(brief = rnd(BRIEFS.length)){
  const want = BRIEFS[brief].tags;
  const four = list => {
    const all = list.map((_, i) => i), sc = list.map(o => matches(o.tags, want)), top = Math.max(...sc);
    const best = pickOne(all.filter(i => sc[i] === top));
    return shuffle([best, ...shuffle(all.filter(i => i !== best)).slice(0, 3)]);
  };
  return { brief, flavors: four(FLAVORS), formats: four(FORMATS), looks: four(LOOKS) };
}
export function fitOf(round, kind, i){                    // matching tags for one pick, and the best on offer in that category
  const want = BRIEFS[round.brief].tags, list = { flavor: FLAVORS, format: FORMATS, look: LOOKS }[kind], dealt = round[kind + 's'];
  return { got: i == null ? 0 : matches(list[i].tags, want), best: Math.max(...dealt.map(j => matches(list[j].tags, want))) };
}
// The starburst claim: the first flavor or format tag that matches the brief, else the flavor's first tag.
export function claimKey(brief, flavor, format){
  const want = BRIEFS[brief].tags, tags = [...(flavor == null ? [] : FLAVORS[flavor].tags), ...(format == null ? [] : FORMATS[format].tags)];
  const hit = tags.find(t => want.includes(t));
  return hit || (flavor == null ? '' : FLAVORS[flavor].tags[0]);
}
export function suggestName(flavor){
  const word = FLAVORS[flavor == null ? rnd(FLAVORS.length) : flavor].word;
  return (Math.random() < 0.5 ? pickOne(PREFIXES) + ' ' : '') + word + ' ' + pickOne(SUFFIXES);
}
// nameKind: 'typed' | 'suggested' | 'blank'. secondsLeft is the number showing on the clock.
export function scoreRound(round, pick, { nameKind, secondsLeft, timedOut, buzz = rnd(51) }){
  const f = fitOf(round, 'flavor', pick.flavor), m = fitOf(round, 'format', pick.format), l = fitOf(round, 'look', pick.look);
  const fit = 100 * (f.got + m.got + l.got), best = 100 * (f.best + m.best + l.best);
  const name = nameKind === 'typed' ? 100 : nameKind === 'suggested' ? 40 : 0;
  const speed = timedOut ? 0 : 5 * Math.max(0, Math.floor(secondsLeft));
  const ratio = best ? fit / best : 0;
  const stars = ratio >= 1 ? 5 : ratio >= 0.75 ? 4 : ratio >= 0.5 ? 3 : ratio >= 0.25 ? 2 : 1;
  return { fit, best, name, speed, buzz, total: fit + name + speed + buzz, stars };
}
export const quoteFor = (stars, flavor) => QUOTES[stars](flavor == null ? '' : FLAVORS[flavor].name);

/* ============================== drawing: formats ============================== */
// Each format draws around (0,0) inside a radius of about 44. c = pieces color, bg = what is behind it, cream = the light stripe.
const ART = {
  clusters: (c, bg) => [[-16, -12, 18], [12, -19, 14], [25, 3, 16], [-1, 8, 20], [-27, 15, 13], [15, 26, 13], [-9, -31, 10]]
    .map(([x, y, r]) => `<g class="pc"><circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${bg}" stroke-width="3"/></g>`).join(''),
  bars: (c, bg) => [[-26, -9, 3], [0, 6, -5], [26, -6, 2]]
    .map(([y, rot, x]) => `<g class="pc"><rect x="${x - 34}" y="${y - 10}" width="68" height="20" rx="8" fill="${c}" stroke="${bg}" stroke-width="3" transform="rotate(${rot} ${x} ${y})"/></g>`).join(''),
  rings: c => [[-21, -19], [15, -23], [27, 9], [-6, 9], [-27, 26]]
    .map(([x, y]) => `<g class="pc"><circle cx="${x}" cy="${y}" r="12.5" fill="none" stroke="${c}" stroke-width="7.5"/></g>`).join(''),
  cookies: (c, bg, cream) => [[-27, -5], [0, 6], [27, -3]]
    .map(([y, x]) => `<g class="pc"><rect x="${x - 31}" y="${y - 11}" width="62" height="22" rx="11" fill="${c}" stroke="${bg}" stroke-width="3"/><rect x="${x - 29.5}" y="${y - 2.2}" width="59" height="4.4" fill="${cream}"/></g>`).join(''),
  chips: (c, bg) => [[-20, -22, -25], [16, -24, 18], [28, 6, 62], [-6, 8, -12], [-24, 28, 34]]
    .map(([x, y, rot]) => `<g class="pc"><ellipse cx="${x}" cy="${y}" rx="21" ry="12.5" fill="${c}" stroke="${bg}" stroke-width="3" transform="rotate(${rot} ${x} ${y})"/></g>`).join(''),
  pouch: (c, bg) => `<g class="pc"><rect x="-11" y="-44" width="22" height="13" rx="4" fill="${c}"/><rect x="-7" y="-33" width="14" height="9" fill="${c}"/>` +
    `<path d="M-22 -26 Q0 -30 22 -26 Q33 6 27 36 Q0 44 -27 36 Q-33 6 -22 -26 Z" fill="${c}"/><ellipse cx="0" cy="8" rx="13" ry="10" fill="${bg}" opacity=".55"/></g>`,
  bites: (c, bg) => [[-23, -23], [0, -23], [23, -23], [-23, 0], [0, 0], [23, 0], [-11.5, 23], [11.5, 23]]
    .map(([x, y]) => `<g class="pc"><circle cx="${x}" cy="${y}" r="10" fill="${c}" stroke="${bg}" stroke-width="2"/></g>`).join(''),
  none: c => `<circle cx="0" cy="0" r="36" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="7 6"/><text x="0" y="13" text-anchor="middle" font-family="'Fraunces',Georgia,serif" font-weight="600" font-size="38" fill="${c}">?</text>`
};
export const artSVG = (format, c, bg, cream = '#FFF6E5') => ART[format == null ? 'none' : FORMATS[format].art](c, bg, cream);
// Small icons for the option buttons.
export const formatIcon = (i, c = '#14215C', bg = '#FFFFFF') => `<svg viewBox="-50 -50 100 100" aria-hidden="true">${artSVG(i, c, bg)}</svg>`;
export const lookIcon = i => { const L = LOOKS[i]; return `<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="7" y="4" width="26" height="32" rx="3" fill="${L.bag}" stroke="rgba(20,33,92,.25)" stroke-width="1"/><rect x="7" y="4" width="26" height="6" rx="2" fill="${L.band}"/><rect x="7" y="30" width="26" height="6" rx="2" fill="${L.band}"/><circle cx="24" cy="20" r="5" fill="${L.burst}"/><circle cx="15" cy="21" r="3.5" fill="${L.pieces}"/></svg>`; };

/* ============================== drawing: the bag ============================== */
const DISPLAY = "'Fraunces',Georgia,serif", BODY = "'DM Sans','Helvetica Neue',Arial,sans-serif";
let mctx = null;
function textWidth(text, px, family, weight){
  if (!mctx) mctx = document.createElement('canvas').getContext('2d');
  mctx.font = `${weight} ${px}px ${family}`;
  return mctx.measureText(text).width;
}
// Wrap the name onto up to 3 lines and shrink the type until it fits the panel.
function fitName(name){
  const words = name.split(' ').filter(Boolean), maxW = 168, maxH = 86;
  for (let size = 34; size >= 8; size--) {
    const lines = []; let line = '', ok = true;
    for (const w of words) {
      if (textWidth(w, size, DISPLAY, 600) > maxW) { ok = false; break; }
      const next = line ? line + ' ' + w : w;
      if (textWidth(next, size, DISPLAY, 600) <= maxW) line = next; else { lines.push(line); line = w; }
    }
    if (!ok) continue;
    if (line) lines.push(line);
    if (lines.length <= 3 && lines.length * size * 1.06 <= maxH) return { size, lines };
  }
  return { size: 8, lines: [name] };
}
function burstPath(cx, cy, R, r, n = 14){
  let d = '';
  for (let i = 0; i < n * 2; i++) { const a = Math.PI * i / n - Math.PI / 2, q = i % 2 ? r : R; d += (i ? 'L' : 'M') + (cx + Math.cos(a) * q).toFixed(1) + ' ' + (cy + Math.sin(a) * q).toFixed(1); }
  return d + 'Z';
}
function crimp(y0, y1, up, fill){            // a zigzag strip; `up` puts the teeth on the top edge
  const teeth = []; for (let x = 14, i = 0; x <= 206; x += 8, i++) teeth.push(`${x} ${up ? (i % 2 ? y0 + 5 : y0) : (i % 2 ? y1 - 5 : y1)}`);
  const pts = up ? [...teeth, `206 ${y1}`, `14 ${y1}`] : [`14 ${y0}`, `206 ${y0}`, ...teeth.reverse()];
  let ribs = ''; for (let x = 22; x < 206; x += 8) ribs += `<line x1="${x}" y1="${y0 + 6}" x2="${x}" y2="${y1 - 6}" stroke="#000" stroke-opacity=".12" stroke-width="1"/>`;
  return `<polygon points="${pts.join(' ')}" fill="${fill}"/>${ribs}`;
}
// snack: { name, flavor, format, look, claim } with indexes (or null) and a claim key. `pop` names the part that just changed.
export function bagSVG(snack, { pop = '', title = '' } = {}){
  const L = snack.look == null ? NO_LOOK : LOOKS[snack.look];
  const name = snack.name || 'Your snack', nm = fitName(name);
  const lh = nm.size * 1.06, top = 82 - (nm.lines.length * lh) / 2 + nm.size * 0.8;
  const nameText = nm.lines.map((ln, i) => `<tspan x="110" y="${(top + i * lh).toFixed(1)}">${esc(ln)}</tspan>`).join('');
  const claim = (CLAIMS[snack.claim] || 'Brand new'), sp = claim.indexOf(' '), c1 = claim.slice(0, sp), c2 = claim.slice(sp + 1);
  const cls = k => pop === k || pop === 'all' ? ' class="pop"' : '';
  const flavor = snack.flavor == null ? 'Pick a flavor' : FLAVORS[snack.flavor].name;
  const format = snack.format == null ? 'Pick a format' : FORMATS[snack.format].name;
  const dim = v => v == null ? ' opacity=".55"' : '';
  return `<svg viewBox="0 0 220 300" role="img" aria-label="${esc(title || 'Snack bag: ' + name)}">` +
    `<path d="M14 26 C10 100 10 200 14 274 L206 274 C210 200 210 100 206 26 Z" fill="${L.bag}"/>` +
    `<path d="M30 30 L52 30 L34 270 L18 270 C15 200 16 100 30 30 Z" fill="#FFFFFF" opacity=".16"/>` +
    `<path d="M196 30 C202 100 202 200 198 270 L206 274 C210 200 210 100 206 26 Z" fill="#000000" opacity=".08"/>` +
    crimp(6, 30, true, L.band) + crimp(270, 294, false, L.band) +
    `<text x="110" y="23.5" text-anchor="middle" font-family="${BODY}" font-weight="700" font-size="8.5" letter-spacing="3.2" fill="${L.bandText}">SNACK LAB</text>` +
    `<g${cls('name')} style="transform-origin:110px 82px"><text text-anchor="middle" font-family="${DISPLAY}" font-weight="600" font-size="${nm.size}" fill="${L.text}"${snack.name ? '' : ' opacity=".55"'}>${nameText}</text></g>` +
    `<g${cls('format')} style="transform-origin:76px 176px"><g transform="translate(76 176)">${artSVG(snack.format, L.pieces, L.bag)}</g></g>` +
    `<g${cls('claim')} style="transform-origin:164px 160px"><path d="${burstPath(164, 160, 34, 27)}" fill="${L.burst}"/>` +
    `<text text-anchor="middle" font-family="${BODY}" font-weight="700" font-size="${Math.max(c1.length, c2.length) > 8 ? 8.6 : 10}" fill="${L.burstText}"><tspan x="164" y="158">${esc(c1)}</tspan><tspan x="164" y="169">${esc(c2)}</tspan></text></g>` +
    `<g${cls('flavor')} style="transform-origin:110px 240px"><text x="110" y="240" text-anchor="middle" font-family="${BODY}" font-weight="700" font-size="13" fill="${L.text}"${dim(snack.flavor)}>${esc(flavor)}</text></g>` +
    `<text x="110" y="255" text-anchor="middle" font-family="${BODY}" font-weight="400" font-size="11" fill="${L.text}"${dim(snack.format)}>${esc(format)}</text>` +
    `<text x="200" y="266.5" text-anchor="end" font-family="${BODY}" font-weight="400" font-size="6.2" fill="${L.text}" opacity=".8">Net wt 8 oz</text></svg>`;
}
export const snackOf = e => ({ name: e.s, flavor: e.f, format: e.m, look: e.l, claim: e.c });
export const swatchOf = e => (e.l == null ? NO_LOOK : LOOKS[e.l]).bag;
export function randomSnack(){
  const brief = rnd(BRIEFS.length), flavor = rnd(FLAVORS.length), format = rnd(FORMATS.length), look = rnd(LOOKS.length);
  return { name: suggestName(flavor), flavor, format, look, claim: claimKey(brief, flavor, format) };
}

/* ============================== drawing: the taste testers ============================== */
const FACES = [
  { skin: '#C98A5E', hair: '#3B2314', bg: '#FAC775', style: 'puffs' },        // Maya, age 9
  { skin: '#F0C8A0', hair: '#2C2C2A', bg: '#F5A9A0', style: 'beanie' },       // Jordan, college junior
  { skin: '#B9774B', hair: '#1E1410', bg: '#9FE0C6', style: 'ponytail' },     // Priya, trail runner
  { skin: '#8D5A3B', hair: '#1E1410', bg: '#C9C4F4', style: 'short' },        // Marcus, project manager
  { skin: '#F3D3B8', hair: '#DAD7CE', bg: '#F6DDB0', style: 'curls' }         // Rose, grandmother of four
];
// mood: neutral | think | love | happy | okay | meh | lost
export function avatarSVG(i, mood = 'neutral'){
  const F = FACES[i], ink = '#2A1A12';
  const hairBack = { puffs: `<circle cx="14" cy="26" r="11" fill="${F.hair}"/><circle cx="66" cy="26" r="11" fill="${F.hair}"/>`,
    ponytail: `<path d="M58 22 Q78 26 72 52 Q66 44 60 40 Z" fill="${F.hair}"/>`, curls: [[18, 30], [14, 42], [62, 30], [66, 42], [24, 20], [40, 15], [56, 20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${F.hair}"/>`).join('') }[F.style] || '';
  const hairFront = { puffs: `<path d="M19 38 Q20 15 40 15 Q60 15 61 38 Q52 24 40 25 Q28 24 19 38 Z" fill="${F.hair}"/>`,
    beanie: `<path d="M18 36 Q18 12 40 12 Q62 12 62 36 Z" fill="#185FA5"/><rect x="16" y="31" width="48" height="8" rx="4" fill="#0C447C"/><circle cx="40" cy="11" r="4.5" fill="#E6F1FB"/>`,
    ponytail: `<path d="M19 38 Q18 14 40 14 Q62 14 61 38 Q50 22 19 38 Z" fill="${F.hair}"/><path d="M19 31 Q40 22 61 31" fill="none" stroke="#1D9E75" stroke-width="4"/>`,
    short: `<path d="M19 36 Q19 15 40 15 Q61 15 61 36 Q56 25 40 25 Q24 25 19 36 Z" fill="${F.hair}"/>`,
    curls: `<path d="M21 34 Q26 18 40 18 Q54 18 59 34 Q50 25 40 26 Q30 25 21 34 Z" fill="${F.hair}"/>` }[F.style];
  const glasses = F.style === 'short' || F.style === 'curls' ? `<g fill="none" stroke="${ink}" stroke-width="1.8"><circle cx="31" cy="42" r="6.5"/><circle cx="49" cy="42" r="6.5"/><path d="M37.5 42 L42.5 42"/></g>` : '';
  const eyes = { love: `<path d="M27 42 Q31 37 35 42 M45 42 Q49 37 53 42" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/>`,
    think: `<circle cx="32" cy="40" r="2.4" fill="${ink}"/><circle cx="50" cy="40" r="2.4" fill="${ink}"/><path d="M26 34 L36 35" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`,
    lost: `<circle cx="31" cy="42" r="2.4" fill="${ink}"/><circle cx="49" cy="42" r="2.4" fill="${ink}"/><path d="M26 36 L35 33 M45 34 L54 36" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>` }[mood]
    || `<circle cx="31" cy="42" r="2.4" fill="${ink}"/><circle cx="49" cy="42" r="2.4" fill="${ink}"/>`;
  const mouth = { neutral: `<path d="M34 55 Q40 58 46 55" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"/>`,
    think: `<circle cx="42" cy="56" r="3" fill="${ink}"/>`,
    love: `<path d="M31 52 Q40 66 49 52 Z" fill="${ink}"/><path d="M35 57 Q40 61 45 57 Q40 55 35 57 Z" fill="#E86A6A"/>`,
    happy: `<path d="M32 53 Q40 62 48 53" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/>`,
    okay: `<path d="M34 55 Q40 59 46 55" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"/>`,
    meh: `<path d="M34 56 L46 55" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"/>`,
    lost: `<path d="M33 57 Q36.5 53 40 57 Q43.5 61 47 57" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"/>` }[mood];
  const blush = mood === 'love' || mood === 'happy' ? `<circle cx="25" cy="50" r="4" fill="#E86A6A" opacity=".35"/><circle cx="55" cy="50" r="4" fill="#E86A6A" opacity=".35"/>` : '';
  return `<svg viewBox="0 0 80 80" role="img" aria-label="${esc(BRIEFS[i].who)}"><circle cx="40" cy="40" r="40" fill="${F.bg}"/>${hairBack}` +
    `<path d="M22 80 Q22 64 40 64 Q58 64 58 80 Z" fill="#FFFBF2"/><rect x="35" y="56" width="10" height="11" fill="${F.skin}"/>` +
    `<ellipse cx="40" cy="42" rx="21" ry="23" fill="${F.skin}"/>${hairFront}${blush}${eyes}${glasses}${mouth}</svg>`;
}
export const moodFor = stars => ({ 5: 'love', 4: 'happy', 3: 'okay', 2: 'meh', 1: 'lost' }[stars]);

/* ============================== the leaderboard store ============================== */
// Scores always save on this device. Unless `local` is set, they are also shared between phones and the
// big screen: live over the MQTT relay, and through ntfy.sh so a screen opened later can catch up.
// role 'display' is the big screen: it keeps a retained snapshot of the board up to date for phones that join.
function cleanEntry(e){
  if (!e || typeof e !== 'object') return null;
  const id = String(e.id || '');
  if (!/^[a-z0-9]{6,16}$/.test(id)) return null;
  return { id, p: cleanText(e.p, 16) || 'Player', s: cleanText(e.s, 22) || 'Mystery snack', sc: clampInt(e.sc, 0, MAX_SCORE), st: clampInt(e.st, 1, 5),
    f: idx(e.f, FLAVORS.length), m: idx(e.m, FORMATS.length), l: idx(e.l, LOOKS.length), c: CLAIMS[e.c] ? e.c : '', b: clampInt(e.b, 0, BRIEFS.length - 1), t: clampInt(e.t, 0, 4e12) || Date.now() };
}
export function createStore({ room = 'fair', local = false, role = 'player', brokers, ntfy = 'https://ntfy.sh/', onChange, onNew, onStatus } = {}){
  room = String(room).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || 'fair';
  const KEY = 'snacklab:' + room, topic = `ck-snacklab-${room}-k8w3`;
  let top = [], recent = [], seen = new Set(), removed = new Set(), resetAt = 0, snapSeen = false, relay = null, snapTimer = 0;
  let extra = 0;                                             // snacks counted by the big screen that this device never saw
  function load(){
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (d) { resetAt = +d.resetAt || 0; removed = new Set(d.removed || []); seen = new Set(d.seen || []); top = (d.top || []).map(cleanEntry).filter(Boolean); recent = (d.recent || []).map(cleanEntry).filter(Boolean); }
    } catch {}
  }
  load();
  // Another tab on this device (the game next to the big screen, say) saved a score: pick it up.
  addEventListener('storage', ev => { if (ev.key !== KEY) return; const had = new Set(seen); load(); if (onNew) for (const e of recent.slice().reverse()) if (!had.has(e.id)) onNew(e); onChange && onChange(); });
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ resetAt, removed: [...removed], seen: [...seen].slice(-3000), top, recent })); } catch {} };
  const order = (a, b) => b.sc - a.sc || a.t - b.t;
  const changed = () => { save(); onChange && onChange(); if (role === 'display') queueSnap(); };
  function add(raw, fresh){
    const e = cleanEntry(raw);
    if (!e || e.t <= resetAt || removed.has(e.id)) return false;
    const isNew = !seen.has(e.id);
    if (!isNew && top.some(x => x.id === e.id)) return false;
    seen.add(e.id);
    if (!top.some(x => x.id === e.id)) { top.push(e); top.sort(order); top = top.slice(0, 50); }
    if (isNew && !recent.some(x => x.id === e.id)) { recent.unshift(e); recent.sort((a, b) => b.t - a.t); recent = recent.slice(0, 24); }
    if (isNew && fresh && onNew) onNew(e);
    return isNew;
  }
  function applyCtl(d){
    let hit = false;
    const at = +d.resetAt || 0;
    if (at > resetAt && at < Date.now() + 6e5) { resetAt = at; removed = new Set(); const keep = e => e.t > resetAt; top = top.filter(keep); recent = recent.filter(keep); seen = new Set([...top, ...recent].map(e => e.id)); hit = true; }
    if (at === resetAt && Array.isArray(d.removed)) for (const id of d.removed.slice(0, 500)) if (typeof id === 'string' && !removed.has(id)) { removed.add(id); hit = true; }
    if (hit) { const keep = e => !removed.has(e.id); top = top.filter(keep); recent = recent.filter(keep); }
    return hit;
  }
  function take(d, fresh){                                   // one message from the relay or from ntfy
    if (!d || typeof d !== 'object') return;
    let hit = false;
    if (d.type === 'ctl' || d.type === 'snap') hit = applyCtl(d);
    if (d.type === 'score') hit = add(d.e, fresh) || hit;
    if (d.type === 'snap') { snapSeen = true; for (const e of (d.top || []).slice(0, 60)) hit = add(e, false) || hit; for (const e of (d.recent || []).slice(0, 30)) hit = add(e, false) || hit; if (+d.count > seenCount()) extra = +d.count - seen.size; }
    if (hit) changed();
  }
  const seenCount = () => seen.size + Math.max(0, extra);
  const ctlMsg = () => ({ type: 'ctl', resetAt, removed: [...removed] });
  function queueSnap(){ clearTimeout(snapTimer); snapTimer = setTimeout(() => { if (relay) relay.publish('snap', { type: 'snap', resetAt, removed: [...removed], count: seenCount(), top, recent: recent.slice(0, 16) }, true); }, 1200); }
  const post = obj => { if (!local) fetch(ntfy + topic, { method: 'POST', body: JSON.stringify(obj) }).catch(() => {}); };

  if (!local) {
    try {
      relay = createRelay({ room: 'snacklab-' + room, brokers, onMessage: (ch, d, retained) => take(d, !retained), onStatus: s => onStatus && onStatus(s) });
      relay.subscribe('score'); relay.subscribe('ctl'); relay.subscribe('snap');
    } catch { relay = null; }
    const fromNtfy = (line, fresh) => { try { const m = JSON.parse(line); if (m.event === 'message') take(JSON.parse(m.message), fresh); } catch {} };
    if (role === 'display') {                                // the big screen follows ntfy all day, so it can rebuild the board after a reload
      let es = null, tries = 0, lastId = null, caughtUp = false;
      const open = () => {
        es = new EventSource(`${ntfy}${topic}/sse?since=${lastId || '12h'}`);
        es.onopen = () => { tries = 0; setTimeout(() => { caughtUp = true; }, 2500); };
        es.onmessage = ev => { try { lastId = JSON.parse(ev.data).id || lastId; } catch {} fromNtfy(ev.data, caughtUp); };
        es.onerror = () => { es.close(); setTimeout(open, Math.min(30000, 2000 * 2 ** tries++)); };
      };
      try { open(); } catch {}
      queueSnap();
    } else {                                                 // a phone asks ntfy once, and only if the big screen's snapshot hasn't arrived
      setTimeout(() => { if (snapSeen) return; fetch(`${ntfy}${topic}/json?poll=1&since=12h`).then(r => r.ok ? r.text() : '').then(t => t.split('\n').forEach(l => l && fromNtfy(l, false))).catch(() => {}); }, 2500);
    }
  }
  return {
    room, shared: !local,
    top: (n = 10) => top.slice(0, n), recent: (n = 24) => recent.slice(0, n), count: seenCount,
    rank(id){ const i = top.findIndex(e => e.id === id); return i < 0 ? null : i + 1; },
    rankOf(score){ return top.filter(e => e.sc > score).length + 1; },
    submit(raw){ const e = cleanEntry(raw); if (!e) return null; add(e, false); changed(); if (relay) relay.publish('score', { type: 'score', e }); post({ type: 'score', e }); return e; },
    reset(){ resetAt = Date.now(); top = []; recent = []; seen = new Set(); removed = new Set(); extra = 0; changed(); if (relay) relay.publish('ctl', ctlMsg(), true); post(ctlMsg()); },
    remove(id){ removed.add(id); top = top.filter(e => e.id !== id); recent = recent.filter(e => e.id !== id); changed(); if (relay) relay.publish('ctl', ctlMsg(), true); post(ctlMsg()); }
  };
}
