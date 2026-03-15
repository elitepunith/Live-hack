// ── Config ────────────────────────────────────────────────
const CONFIG = {
  OTX_KEY:      '',
  OTX_INTERVAL: 30000,
  SIM_MIN_MS:   900,
  SIM_MAX_MS:   2500,
  MAX_ARCS:     35,
  MAX_FEED:     50,
  ARC_LIFE:     10000,
};

// country coords — lat/lng centers used for arc endpoints
const GEO = [
  { code:'CN', name:'China',          lat:35.86,  lng:104.19,  flag:'🇨🇳' },
  { code:'RU', name:'Russia',         lat:61.52,  lng:105.31,  flag:'🇷🇺' },
  { code:'US', name:'United States',  lat:37.09,  lng:-95.71,  flag:'🇺🇸' },
  { code:'IN', name:'India',          lat:20.59,  lng:78.96,   flag:'🇮🇳' },
  { code:'BR', name:'Brazil',         lat:-14.23, lng:-51.92,  flag:'🇧🇷' },
  { code:'DE', name:'Germany',        lat:51.16,  lng:10.45,   flag:'🇩🇪' },
  { code:'NL', name:'Netherlands',    lat:52.13,  lng:5.29,    flag:'🇳🇱' },
  { code:'KP', name:'N. Korea',       lat:40.33,  lng:127.51,  flag:'🇰🇵' },
  { code:'IR', name:'Iran',           lat:32.42,  lng:53.68,   flag:'🇮🇷' },
  { code:'UA', name:'Ukraine',        lat:48.37,  lng:31.16,   flag:'🇺🇦' },
  { code:'RO', name:'Romania',        lat:45.94,  lng:24.96,   flag:'🇷🇴' },
  { code:'TR', name:'Turkey',         lat:38.96,  lng:35.24,   flag:'🇹🇷' },
  { code:'VN', name:'Vietnam',        lat:14.05,  lng:108.27,  flag:'🇻🇳' },
  { code:'NG', name:'Nigeria',        lat:9.08,   lng:8.67,    flag:'🇳🇬' },
  { code:'PK', name:'Pakistan',       lat:30.37,  lng:69.34,   flag:'🇵🇰' },
  { code:'GB', name:'United Kingdom', lat:55.37,  lng:-3.43,   flag:'🇬🇧' },
  { code:'FR', name:'France',         lat:46.22,  lng:2.21,    flag:'🇫🇷' },
  { code:'JP', name:'Japan',          lat:36.20,  lng:138.25,  flag:'🇯🇵' },
  { code:'AU', name:'Australia',      lat:-25.27, lng:133.77,  flag:'🇦🇺' },
  { code:'CA', name:'Canada',         lat:56.13,  lng:-106.34, flag:'🇨🇦' },
  { code:'SG', name:'Singapore',      lat:1.35,   lng:103.81,  flag:'🇸🇬' },
  { code:'KR', name:'South Korea',    lat:35.90,  lng:127.76,  flag:'🇰🇷' },
  { code:'IL', name:'Israel',         lat:31.04,  lng:34.85,   flag:'🇮🇱' },
  { code:'SE', name:'Sweden',         lat:60.12,  lng:18.64,   flag:'🇸🇪' },
  { code:'PL', name:'Poland',         lat:51.91,  lng:19.14,   flag:'🇵🇱' },
  { code:'TW', name:'Taiwan',         lat:23.69,  lng:120.96,  flag:'🇹🇼' },
  { code:'SA', name:'Saudi Arabia',   lat:23.88,  lng:45.07,   flag:'🇸🇦' },
  { code:'AE', name:'UAE',            lat:23.42,  lng:53.84,   flag:'🇦🇪' },
  { code:'IT', name:'Italy',          lat:41.87,  lng:12.56,   flag:'🇮🇹' },
  { code:'ES', name:'Spain',          lat:40.46,  lng:-3.74,   flag:'🇪🇸' },
  { code:'MX', name:'Mexico',         lat:23.63,  lng:-102.55, flag:'🇲🇽' },
  { code:'HK', name:'Hong Kong',      lat:22.31,  lng:114.16,  flag:'🇭🇰' },
  { code:'ZA', name:'South Africa',   lat:-30.55, lng:22.93,   flag:'🇿🇦' },
  { code:'ID', name:'Indonesia',      lat:-0.78,  lng:113.92,  flag:'🇮🇩' },
  { code:'EG', name:'Egypt',          lat:26.82,  lng:30.80,   flag:'🇪🇬' },
  { code:'AR', name:'Argentina',      lat:-38.41, lng:-63.61,  flag:'🇦🇷' },
  { code:'BE', name:'Belgium',        lat:50.50,  lng:4.46,    flag:'🇧🇪' },
  { code:'CH', name:'Switzerland',    lat:46.81,  lng:8.22,    flag:'🇨🇭' },
  { code:'TH', name:'Thailand',       lat:15.87,  lng:100.99,  flag:'🇹🇭' },
  { code:'CZ', name:'Czech Rep.',     lat:49.81,  lng:15.47,   flag:'🇨🇿' },
];

// build a fast lookup so we don't scan the whole array every time
const geoByCode = {};
GEO.forEach(g => { geoByCode[g.code] = g; });

const ATTACK_TYPES = [
  { id:'ddos',       label:'DDoS',        color:'#ef4444', severity:'critical', weight:18, ports:[80,443,53,123]  },
  { id:'ransomware', label:'Ransomware',  color:'#f97316', severity:'critical', weight:5,  ports:[445,3389,139]   },
  { id:'malware',    label:'Malware C2',  color:'#a855f7', severity:'critical', weight:8,  ports:[4444,8888,1337] },
  { id:'zeroday',    label:'Zero-Day',    color:'#e2e8f0', severity:'critical', weight:2,  ports:[80,443]         },
  { id:'bruteforce', label:'Brute Force', color:'#eab308', severity:'high',     weight:15, ports:[22,3389,21]     },
  { id:'sqli',       label:'SQL Inject',  color:'#8b5cf6', severity:'high',     weight:12, ports:[80,443,8080]    },
  { id:'phishing',   label:'Phishing',    color:'#fb923c', severity:'medium',   weight:10, ports:[80,443,25]      },
  { id:'portscan',   label:'Port Scan',   color:'#3b82f6', severity:'low',      weight:20, ports:[22,80,443,3389] },
  { id:'xss',        label:'XSS',         color:'#06b6d4', severity:'medium',   weight:7,  ports:[80,443,8080]    },
  { id:'mitm',       label:'MITM',        color:'#22c55e', severity:'high',     weight:3,  ports:[80,443]         },
];

const TOTAL_TYPE_WEIGHT = ATTACK_TYPES.reduce((sum, t) => sum + t.weight, 0);

// rough keyword-to-type mapping for OTX pulse data
const OTX_TYPE_MAP = {
  ddos:'ddos', dos:'ddos', flood:'ddos',
  ransomware:'ransomware', ransom:'ransomware',
  rat:'malware', trojan:'malware', backdoor:'malware', botnet:'malware', c2:'malware',
  exploit:'zeroday', cve:'zeroday', '0day':'zeroday',
  bruteforce:'bruteforce', brute:'bruteforce', credential:'bruteforce',
  sqli:'sqli', 'sql injection':'sqli',
  phishing:'phishing', spam:'phishing',
  scanner:'portscan', scan:'portscan', recon:'portscan',
  xss:'xss', mitm:'mitm',
};

// weighted probability for source/target countries
const SRC_WEIGHTS = {CN:24,RU:20,US:10,KP:8,IR:6,UA:5,NL:4,RO:4,IN:3,BR:3,TR:2,VN:2,NG:2,HK:2};
const TGT_WEIGHTS = {US:28,GB:11,DE:8,JP:7,FR:6,CA:5,AU:5,KR:4,SG:3,IL:3,TW:3,CH:2,SE:2,NL:2,SA:2,IT:2,IN:2,BR:2};

// partial IP prefixes per country — we add random last two octets
const IP_POOLS = {
  CN:['180.76','223.71','101.89','42.56'],
  RU:['5.255','77.88','91.108','185.29'],
  US:['104.16','172.217','54.239','13.32'],
  KP:['175.45','210.52','77.194'],
  IR:['5.200','185.94','91.132'],
  UA:['91.202','194.44','178.150'],
  NL:['185.220','194.165','45.153'],
  _:['45.33','162.241','104.244','198.199'],
};

// tile layer URLs per theme
const TILE_URLS = {
  dark:  'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
  neon:  'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
};

// speed presets [slow, normal, fast]
const SPEEDS = [
  { label:'×½', min:2500, max:5000 },
  { label:'×1', min:900,  max:2500 },
  { label:'×2', min:200,  max:700  },
];


// ── Helpers ───────────────────────────────────────────────

// pick a key from an object of {key: weight} pairs
function weighted(map) {
  const keys = Object.keys(map);
  const vals = Object.values(map);
  const total = vals.reduce((s, v) => s + v, 0);
  let r = Math.random() * total;
  for (let i = 0; i < keys.length; i++) {
    r -= vals[i];
    if (r <= 0) return keys[i];
  }
  return keys[keys.length - 1];
}

function pickType() {
  let r = Math.random() * TOTAL_TYPE_WEIGHT;
  for (const t of ATTACK_TYPES) {
    r -= t.weight;
    if (r <= 0) return t;
  }
  return ATTACK_TYPES[0];
}

// random int between a and b (inclusive)
function ri(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

// small random jitter so markers don't all stack on the same pixel
function jit() {
  return (Math.random() - 0.5) * 2.5;
}

function byCode(c) {
  return geoByCode[c] || null;
}

function randGeo() {
  return GEO[Math.floor(Math.random() * GEO.length)];
}

function fakeIP(code) {
  const pool = IP_POOLS[code] || IP_POOLS._;
  return pool[Math.floor(Math.random() * pool.length)] + '.' + ri(1,253) + '.' + ri(1,253);
}


// ── App state ─────────────────────────────────────────────

let totalCount = ri(160000, 220000);
let perMinBucket = [];

const state = {
  attacks:   [],
  svgArcs:   [],
  srcTally:  {},
  tgtTally:  {},
  typeTally: {},
  filter:    'all',
  map:       null,
  tileLayer: null,
};

ATTACK_TYPES.forEach(t => { state.typeTally[t.id] = 0; });


// ── Simulation ────────────────────────────────────────────

function simulate() {
  const srcCode = weighted(SRC_WEIGHTS);
  let tgtCode;
  // make sure source and target aren't the same country
  do { tgtCode = weighted(TGT_WEIGHTS); } while (tgtCode === srcCode);

  const src = byCode(srcCode);
  const tgt = byCode(tgtCode);
  if (!src || !tgt) return null;

  const type = pickType();
  totalCount++;

  return {
    id:       'sim-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5),
    ts:       Date.now(),
    source:   'sim',
    src:      { code:src.code, name:src.name, lat:src.lat+jit(), lng:src.lng+jit(), ip:fakeIP(srcCode), flag:src.flag },
    tgt:      { code:tgt.code, name:tgt.name, lat:tgt.lat+jit(), lng:tgt.lng+jit(), ip:fakeIP(tgtCode), flag:tgt.flag },
    type:     type.id,
    label:    type.label,
    color:    type.color,
    severity: type.severity,
    port:     type.ports[Math.floor(Math.random() * type.ports.length)],
  };
}


// ── OTX integration ───────────────────────────────────────

const otxSeen  = new Set();
const geoCache = {};

async function geolocateIPs(ips) {
  const fresh = ips.filter(ip => !geoCache[ip]).slice(0, 50);
  if (!fresh.length) return;

  try {
    const res = await fetch('https://ip-api.com/batch?fields=status,country,countryCode,lat,lon,query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fresh.map(q => ({ query: q }))),
    });
    if (!res.ok) return;

    const rows = await res.json();
    for (const r of rows) {
      if (r.status === 'success') {
        geoCache[r.query] = { code:r.countryCode, name:r.country, lat:r.lat, lng:r.lon };
      }
    }
  } catch(e) {
    // no-op — we'll fall back to a random geo below
  }
}

function typeFromPulse(pulse) {
  const hay = [pulse.name||'', pulse.description||'']
    .concat(pulse.tags||[])
    .concat(pulse.malware_families||[])
    .join(' ')
    .toLowerCase();

  for (const key of Object.keys(OTX_TYPE_MAP)) {
    if (hay.includes(key)) {
      const found = ATTACK_TYPES.find(t => t.id === OTX_TYPE_MAP[key]);
      return found || pickType();
    }
  }
  return pickType();
}

async function pulseToAttacks(pulse) {
  const inds = (pulse.indicators || [])
    .filter(i => i.type === 'IPv4' && !otxSeen.has(i.indicator))
    .slice(0, 5);

  if (!inds.length) return [];

  await geolocateIPs(inds.map(i => i.indicator));

  const type = typeFromPulse(pulse);
  const results = [];

  for (const ind of inds) {
    otxSeen.add(ind.indicator);

    const geo     = geoCache[ind.indicator];
    const matched = geo ? byCode(geo.code) : null;
    let src;

    if (geo) {
      src = {
        code: geo.code,
        name: geo.name || geo.code,
        lat:  geo.lat + jit(),
        lng:  geo.lng + jit(),
        ip:   ind.indicator,
        flag: matched ? matched.flag : '🌐',
      };
    } else {
      const fallback = randGeo();
      src = { code:fallback.code, name:fallback.name, lat:fallback.lat+jit(), lng:fallback.lng+jit(), ip:ind.indicator, flag:fallback.flag };
    }

    const tgtCode = weighted(TGT_WEIGHTS);
    const tgt = byCode(tgtCode);
    if (!tgt) continue;

    totalCount++;
    results.push({
      id:       'otx-' + ind.indicator.replace(/\./g, '-') + '-' + Date.now(),
      ts:       Date.now(),
      source:   'otx',
      pulse:    pulse.name,
      src,
      tgt: { code:tgt.code, name:tgt.name, lat:tgt.lat+jit(), lng:tgt.lng+jit(), ip:fakeIP(tgtCode), flag:tgt.flag },
      type:     type.id,
      label:    type.label,
      color:    type.color,
      severity: type.severity,
      port:     type.ports[Math.floor(Math.random() * type.ports.length)],
    });
  }

  return results;
}

async function pollOTX() {
  try {
    const res = await fetch('https://otx.alienvault.com/api/v1/pulses/activity?limit=15', {
      headers: { 'X-OTX-API-KEY': CONFIG.OTX_KEY },
    });
    if (!res.ok) throw new Error(res.status);

    const data   = await res.json();
    const pulses = data.results || [];

    for (const pulse of pulses) {
      const attacks = await pulseToAttacks(pulse);
      for (const atk of attacks) {
        addAttack(atk);
        await new Promise(r => setTimeout(r, 500));
      }
    }

    const el = document.getElementById('data-source');
    if (el) { el.textContent = 'OTX Live'; el.style.color = '#22c55e'; }
  } catch(e) {
    console.warn('OTX poll failed:', e.message);
  }
}


// ── Map setup ─────────────────────────────────────────────
// The map is intentionally locked — no zoom, no pan.
// That way latLngToContainerPoint() always returns consistent pixels for arcs.

function initMap() {
  const map = L.map('map', {
    center: [25, 10],
    zoom: 2,
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    touchZoom: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    minZoom: 2,
    maxZoom: 2,
  });

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  state.tileLayer = L.tileLayer(TILE_URLS[currentTheme] || TILE_URLS.dark, {
    subdomains: 'abcd',
    maxZoom: 20,
  }).addTo(map);

  state.map = map;

  window.addEventListener('resize', () => {
    map.invalidateSize();
    redrawArcs();
  });
}


// ── SVG arc drawing ───────────────────────────────────────

function getSVG() {
  return document.getElementById('arc-svg');
}

function latLngToXY(lat, lng) {
  const pt = state.map.latLngToContainerPoint([lat, lng]);
  return [pt.x, pt.y];
}

// quadratic bezier — control point lifted perpendicular to the chord
function buildCurve(x1, y1, x2, y2) {
  const mx   = (x1 + x2) / 2;
  const my   = (y1 + y2) / 2;
  const dx   = x2 - x1;
  const dy   = y2 - y1;
  const dist = Math.sqrt(dx*dx + dy*dy) || 1;
  const lift = Math.min(dist * 0.38, 200);
  const nx   = -dy / dist;
  const ny   =  dx / dist;
  return `M ${x1} ${y1} Q ${mx + nx*lift} ${my + ny*lift} ${x2} ${y2}`;
}

// rough length estimate used to set strokeDasharray correctly
function measurePath(x1, y1, x2, y2) {
  const mx   = (x1 + x2) / 2;
  const my   = (y1 + y2) / 2;
  const dx   = x2 - x1;
  const dy   = y2 - y1;
  const dist = Math.sqrt(dx*dx + dy*dy) || 1;
  const lift = Math.min(dist * 0.38, 200);
  const nx   = -dy / dist;
  const ny   =  dx / dist;
  const cx   = mx + nx * lift;
  const cy   = my + ny * lift;
  const chord = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
  const legs  = Math.sqrt((x1-cx)**2 + (y1-cy)**2)
              + Math.sqrt((cx-x2)**2 + (cy-y2)**2);
  return (chord + legs) / 2;
}

function drawArc(atk) {
  if (state.filter !== 'all' && atk.type !== state.filter) return;

  const svg = getSVG();
  if (!svg || !state.map) return;

  const [sx, sy] = latLngToXY(atk.src.lat, atk.src.lng);
  const [tx, ty] = latLngToXY(atk.tgt.lat, atk.tgt.lng);

  const d       = buildCurve(sx, sy, tx, ty);
  const pathLen = measurePath(sx, sy, tx, ty);
  if (pathLen < 5) return;

  const isReal  = (atk.source === 'otx');
  const color   = atk.color;
  const weight  = isReal ? 1.8 : 1.2;
  const animMs  = 1000 + Math.random() * 500;

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('data-id', atk.id);

  // subtle glow behind the main arc — cheaper than SVG filter blur
  const glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  glow.setAttribute('d', d);
  glow.setAttribute('stroke', color);
  glow.setAttribute('stroke-width', weight + 2);
  glow.setAttribute('stroke-opacity', '0.12');
  glow.setAttribute('fill', 'none');
  glow.style.strokeDasharray  = pathLen;
  glow.style.strokeDashoffset = pathLen;
  glow.style.transition = `stroke-dashoffset ${animMs}ms cubic-bezier(0.4,0,0.2,1)`;

  const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arc.setAttribute('d', d);
  arc.setAttribute('stroke', color);
  arc.setAttribute('stroke-width', weight);
  arc.setAttribute('stroke-opacity', isReal ? '0.85' : '0.6');
  arc.setAttribute('stroke-linecap', 'round');
  arc.setAttribute('fill', 'none');
  arc.style.strokeDasharray  = pathLen;
  arc.style.strokeDashoffset = pathLen;
  arc.style.transition = `stroke-dashoffset ${animMs}ms cubic-bezier(0.4,0,0.2,1)`;

  // dot at source
  const srcDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  srcDot.setAttribute('cx', sx);
  srcDot.setAttribute('cy', sy);
  srcDot.setAttribute('r', isReal ? '4' : '3');
  srcDot.setAttribute('fill', color);
  srcDot.setAttribute('fill-opacity', '0.9');

  // expanding ring at target after arc arrives
  const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  ring.setAttribute('cx', tx);
  ring.setAttribute('cy', ty);
  ring.setAttribute('r', '4');
  ring.setAttribute('fill', 'none');
  ring.setAttribute('stroke', color);
  ring.setAttribute('stroke-width', '2');
  ring.style.animation = `pulse-ring 1.5s ease-out ${animMs}ms 3 forwards`;

  const tgtDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  tgtDot.setAttribute('cx', tx);
  tgtDot.setAttribute('cy', ty);
  tgtDot.setAttribute('r', '3');
  tgtDot.setAttribute('fill', color);
  tgtDot.setAttribute('fill-opacity', '0.85');

  g.append(glow, arc, srcDot, ring, tgtDot);
  svg.appendChild(g);

  // trigger the dash animation on the next paint tick
  requestAnimationFrame(() => {
    glow.style.strokeDashoffset = 0;
    arc.style.strokeDashoffset  = 0;
  });

  // schedule fade-out and removal
  const timeoutId = setTimeout(() => {
    g.style.transition = 'opacity 0.8s ease';
    g.style.opacity    = '0';
    setTimeout(() => removeArcById(atk.id), 800);
  }, CONFIG.ARC_LIFE);

  state.svgArcs.push({
    id:       atk.id,
    el:       g,
    atk:      atk,
    born:     Date.now(),
    timeout:  timeoutId,
    revealed: false,
  });

  setTimeout(() => {
    const entry = state.svgArcs.find(a => a.id === atk.id);
    if (entry) entry.revealed = true;
  }, animMs + 50);

  // trim oldest arcs if we're over the limit
  while (state.svgArcs.length > CONFIG.MAX_ARCS) {
    const old = state.svgArcs.shift();
    clearTimeout(old.timeout);
    old.el.remove();
  }
}

function removeArcById(id) {
  const idx = state.svgArcs.findIndex(a => a.id === id);
  if (idx !== -1) {
    state.svgArcs[idx].el.remove();
    state.svgArcs.splice(idx, 1);
  }
}

// called after window resize — snaps all arcs to new pixel coords
function redrawArcs() {
  if (!state.map) return;

  for (const entry of state.svgArcs) {
    const { atk, el, revealed } = entry;
    const [sx, sy] = latLngToXY(atk.src.lat, atk.src.lng);
    const [tx, ty] = latLngToXY(atk.tgt.lat, atk.tgt.lng);

    const d       = buildCurve(sx, sy, tx, ty);
    const pathLen = measurePath(sx, sy, tx, ty);

    for (const path of el.querySelectorAll('path')) {
      path.setAttribute('d', d);
      path.style.transition        = 'none';
      path.style.strokeDasharray   = pathLen;
      path.style.strokeDashoffset  = revealed ? 0 : pathLen;
    }

    const circles = el.querySelectorAll('circle');
    if (circles[0]) { circles[0].setAttribute('cx', sx); circles[0].setAttribute('cy', sy); }
    if (circles[1]) { circles[1].setAttribute('cx', tx); circles[1].setAttribute('cy', ty); }
    if (circles[2]) { circles[2].setAttribute('cx', tx); circles[2].setAttribute('cy', ty); }
  }
}


// ── Add attack ────────────────────────────────────────────

let counterDirty = false;

function addAttack(atk) {
  state.attacks.unshift(atk);
  if (state.attacks.length > 100) state.attacks.pop();

  state.srcTally[atk.src.code] = (state.srcTally[atk.src.code] || 0) + 1;
  state.tgtTally[atk.tgt.code] = (state.tgtTally[atk.tgt.code] || 0) + 1;
  state.typeTally[atk.type]    = (state.typeTally[atk.type]    || 0) + 1;

  drawArc(atk);
  addFeedRow(atk);
  playAttackSound(atk.severity);

  // batch DOM counter updates to avoid thrashing on rapid fire attacks
  if (!counterDirty) {
    counterDirty = true;
    setTimeout(() => { updateCounters(); counterDirty = false; }, 500);
  }
}


// ── Live feed ─────────────────────────────────────────────

let feedTimestamps = [];

function addFeedRow(atk) {
  const feed   = document.getElementById('feed-scroll');
  const isReal = (atk.source === 'otx');

  const row = document.createElement('div');
  row.className = 'feed-row';
  if (isReal) row.style.borderLeft = '2px solid ' + atk.color;

  let html = `<div class="fr-top">
    <div class="fr-left">
      <span class="fr-dot" style="background:${atk.color}"></span>
      <span class="fr-type" style="color:${atk.color}">${atk.label}</span>
      <span class="fr-sev sev-${atk.severity}">${atk.severity}</span>`;

  if (isReal) html += `<span class="fr-real">● Real</span>`;
  html += `</div><span class="fr-time">just now</span></div>`;

  if (atk.pulse) html += `<div class="fr-pulse">⬡ ${atk.pulse}</div>`;

  html += `<div class="fr-route">
    <div class="fr-side">
      <div class="fr-flag-name">
        <span class="fr-flag">${atk.src.flag}</span>
        <span class="fr-country">${atk.src.name}</span>
      </div>
      <div class="fr-ip">${atk.src.ip}</div>
    </div>
    <div class="fr-arrow-icon">
      <svg width="26" height="10" viewBox="0 0 26 10" fill="none">
        <path d="M1 5H22M18 1.5L22 5L18 8.5" stroke="${atk.color}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="fr-side right">
      <div class="fr-flag-name right">
        <span class="fr-country">${atk.tgt.name}</span>
        <span class="fr-flag">${atk.tgt.flag}</span>
      </div>
      <div class="fr-ip" style="text-align:right">${atk.tgt.ip}:${atk.port}</div>
    </div>
  </div>`;

  row.innerHTML = html;

  // click a feed row to open the attack detail card
  row.addEventListener('click', () => showCard(atk));

  feed.prepend(row);
  feedTimestamps.unshift(Date.now());

  while (feed.children.length > CONFIG.MAX_FEED) {
    feed.lastChild.remove();
    feedTimestamps.pop();
  }

  document.getElementById('feed-count').textContent = feed.children.length;
}

// update "X seconds ago" labels in the feed
function tickTimestamps() {
  const rows = document.getElementById('feed-scroll').children;
  const now  = Date.now();

  for (let i = 0; i < rows.length; i++) {
    const el  = rows[i].querySelector('.fr-time');
    if (!el || i >= feedTimestamps.length) continue;
    const sec = Math.floor((now - feedTimestamps[i]) / 1000);
    if      (sec < 5)  el.textContent = 'just now';
    else if (sec < 60) el.textContent = sec + 's';
    else               el.textContent = Math.floor(sec / 60) + 'm';
  }
}

setInterval(tickTimestamps, 5000);


// ── Counters & sidebar lists ──────────────────────────────

function updateCounters() {
  document.getElementById('total-count').textContent = totalCount.toLocaleString();

  const cutoff = Date.now() - 60000;
  perMinBucket.push(Date.now());
  while (perMinBucket.length && perMinBucket[0] < cutoff) perMinBucket.shift();
  document.getElementById('apm-count').textContent = perMinBucket.length;

  updateRankList('top-sources', state.srcTally, '#ef4444');
  updateRankList('top-targets', state.tgtTally, '#3b82f6');
  updateTypeList();
  updateTypeStats();
}

function updateRankList(elId, tally, barColor) {
  const el      = document.getElementById(elId);
  const entries = Object.entries(tally).sort((a,b) => b[1]-a[1]).slice(0, 6);
  if (!entries.length) return;

  const max  = entries[0][1];
  let html   = '';

  entries.forEach(([code, count], i) => {
    const c   = byCode(code);
    if (!c) return;
    const pct = Math.round((count / max) * 100);
    html += `<div class="rank-item">
      <span class="rank-num">${i+1}</span>
      <span class="rank-flag">${c.flag}</span>
      <div class="rank-info">
        <div class="rank-name">${c.name}</div>
        <div class="rank-track"><div class="rank-fill" style="width:${pct}%;background:${barColor}"></div></div>
      </div>
      <span class="rank-count">${count}</span>
    </div>`;
  });

  el.innerHTML = html;
}

function updateTypeList() {
  const el    = document.getElementById('type-list');
  const total = Object.values(state.typeTally).reduce((s,v) => s+v, 0);
  if (!total) return;

  const sorted = [...ATTACK_TYPES].sort((a,b) => (state.typeTally[b.id]||0) - (state.typeTally[a.id]||0));
  let html = '';

  sorted.slice(0, 8).forEach(t => {
    const count = state.typeTally[t.id] || 0;
    const pct   = Math.round((count / total) * 100);
    html += `<div class="type-row">
      <span class="type-dot" style="background:${t.color}"></span>
      <span class="type-name">${t.label}</span>
      <span class="type-pct">${pct}%</span>
    </div>`;
  });

  el.innerHTML = html;
}

function buildTypeStats() {
  let html = '';
  ATTACK_TYPES.forEach(t => {
    html += `<div class="ts-item">
      <span class="ts-dot" style="background:${t.color}"></span>
      <span class="ts-name">${t.label}</span>
      <span class="ts-count" id="ts-${t.id}" style="color:${t.color}">0</span>
    </div>`;
  });
  document.getElementById('type-stats').innerHTML = html;
}

function updateTypeStats() {
  ATTACK_TYPES.forEach(t => {
    const el = document.getElementById('ts-' + t.id);
    if (el) el.textContent = state.typeTally[t.id] || 0;
  });
}


// ── Filter chips ──────────────────────────────────────────

function buildFilterChips() {
  const container = document.getElementById('filter-chips');
  container.appendChild(makeChip('All', 'all', true));
  ATTACK_TYPES.forEach(t => container.appendChild(makeChip(t.label, t.id, false)));
}

function makeChip(label, id, active) {
  const el = document.createElement('span');
  el.className   = 'fchip' + (active ? ' active' : '');
  el.textContent = label;
  el.dataset.id  = id;

  el.addEventListener('click', () => {
    document.querySelectorAll('.fchip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    state.filter = id;
    applyFilter();
  });

  return el;
}

// clear the SVG and redraw only arcs that match the active filter
function applyFilter() {
  // wipe every arc currently on screen
  for (const entry of state.svgArcs) {
    clearTimeout(entry.timeout);
    entry.el.remove();
  }
  state.svgArcs = [];

  // redraw from the stored attack history
  const visible = state.filter === 'all'
    ? state.attacks
    : state.attacks.filter(a => a.type === state.filter);

  visible.forEach(atk => drawArc(atk));
}


// ── Clock ─────────────────────────────────────────────────

function updateClock() {
  const n = new Date();
  const h = String(n.getUTCHours()).padStart(2, '0');
  const m = String(n.getUTCMinutes()).padStart(2, '0');
  const s = String(n.getUTCSeconds()).padStart(2, '0');
  document.getElementById('utc-clock').textContent = `${h}:${m}:${s}`;
}

setInterval(updateClock, 1000);
updateClock();


// ── Attack detail card ────────────────────────────────────

function showCard(atk) {
  document.getElementById('ac-dot').style.background    = atk.color;
  document.getElementById('ac-type').textContent        = atk.label;
  document.getElementById('ac-type').style.color        = atk.color;
  document.getElementById('ac-sev').textContent         = atk.severity;
  document.getElementById('ac-sev').className           = 'ac-sev sev-' + atk.severity;
  document.getElementById('ac-src-flag').textContent    = atk.src.flag;
  document.getElementById('ac-src-country').textContent = atk.src.name;
  document.getElementById('ac-src-ip').textContent      = atk.src.ip;
  document.getElementById('ac-tgt-flag').textContent    = atk.tgt.flag;
  document.getElementById('ac-tgt-country').textContent = atk.tgt.name;
  document.getElementById('ac-tgt-ip').textContent      = atk.tgt.ip;
  document.getElementById('ac-meta').textContent        = `Port ${atk.port}  ·  ${atk.source === 'otx' ? '● Verified (OTX)' : 'Simulated'}`;
  document.getElementById('attack-card').classList.remove('hidden');
}

window.closeCard = function() {
  document.getElementById('attack-card').classList.add('hidden');
};


// ── Pause / Resume ────────────────────────────────────────

let isPaused = false;

window.togglePause = function() {
  isPaused = !isPaused;
  const btn  = document.getElementById('btn-pause');
  const wrap = document.getElementById('map-wrap');
  btn.textContent = isPaused ? '▶' : '⏸';
  btn.title       = isPaused ? 'Resume' : 'Pause';
  btn.classList.toggle('paused', isPaused);
  wrap.classList.toggle('paused', isPaused);
};


// ── Speed control ─────────────────────────────────────────

window.setSpeed = function(idx) {
  const s = SPEEDS[idx];
  if (!s) return;
  CONFIG.SIM_MIN_MS = s.min;
  CONFIG.SIM_MAX_MS = s.max;
  document.querySelectorAll('.speed-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === idx);
  });
};


// ── Sound effects (Web Audio API) ─────────────────────────

let soundEnabled = false;
let audioCtx     = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playAttackSound(severity) {
  if (!soundEnabled) return;

  // different pitch per severity level
  const freqs = { critical: 880, high: 660, medium: 440, low: 330 };
  const freq  = freqs[severity] || 440;

  try {
    const ctx  = getAudioCtx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type            = 'sine';
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch(e) {
    // browsers sometimes block AudioContext until a user gesture — just skip
  }
}

window.toggleSound = function() {
  soundEnabled = !soundEnabled;
  const btn    = document.getElementById('btn-sound');
  btn.textContent = soundEnabled ? '🔊' : '🔇';
  btn.title       = soundEnabled ? 'Sound on (click to mute)' : 'Sound off (click to enable)';

  // Chrome requires AudioContext creation inside a user gesture
  if (soundEnabled) getAudioCtx();
};


// ── Theme system ──────────────────────────────────────────

window.setTheme = function(name) {
  document.documentElement.setAttribute('data-theme', name);
  localStorage.setItem('lh-theme', name);

  // swap the map tile layer to match the theme
  if (state.map) {
    if (state.tileLayer) state.map.removeLayer(state.tileLayer);
    state.tileLayer = L.tileLayer(TILE_URLS[name] || TILE_URLS.dark, {
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(state.map);
  }

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === name);
  });
};

function restoreTheme() {
  const saved = localStorage.getItem('lh-theme');
  if (saved && saved !== 'dark') setTheme(saved);
}


// ── Mobile panel toggles ──────────────────────────────────

window.toggleFeedPanel = function() {
  const feed    = document.getElementById('feed-panel');
  const overlay = document.getElementById('mobile-overlay');
  const isOpen  = feed.classList.toggle('open');
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
  overlay.classList.toggle('show', isOpen);
};

window.closeMobilePanels = function() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('feed-panel').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobile-overlay').classList.remove('show');
};

function initMobileToggle() {
  const hamburger = document.getElementById('hamburger');
  hamburger.addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    const isOpen  = sidebar.classList.toggle('open');
    document.getElementById('feed-panel').classList.remove('open');
    hamburger.classList.toggle('open', isOpen);
    overlay.classList.toggle('show', isOpen);
  });
}


// ── Simulation loop ───────────────────────────────────────

function runSimLoop() {
  if (!isPaused) {
    const atk = simulate();
    if (atk) addAttack(atk);
  }
  // always re-schedule so resuming works without any extra code
  setTimeout(runSimLoop, ri(CONFIG.SIM_MIN_MS, CONFIG.SIM_MAX_MS));
}

function seedInitial() {
  // put some attacks in so the map isn't empty on load
  for (let i = 0; i < 15; i++) {
    const atk = simulate();
    if (!atk) continue;
    state.attacks.push(atk);
    state.srcTally[atk.src.code] = (state.srcTally[atk.src.code] || 0) + 1;
    state.tgtTally[atk.tgt.code] = (state.tgtTally[atk.tgt.code] || 0) + 1;
    state.typeTally[atk.type]    = (state.typeTally[atk.type]    || 0) + 1;
    addFeedRow(atk);
  }
  updateCounters();
}


// ── Boot ──────────────────────────────────────────────────

window.addEventListener('load', () => {
  restoreTheme();
  initMap();
  initMobileToggle();
  buildTypeStats();
  buildFilterChips();
  seedInitial();

  // short delay so the map tiles can load before we draw arcs on top
  setTimeout(() => {
    state.attacks.forEach(atk => drawArc(atk));
    runSimLoop();

    if (CONFIG.OTX_KEY && CONFIG.OTX_KEY.length > 10) {
      pollOTX();
      setInterval(pollOTX, CONFIG.OTX_INTERVAL);
    }
  }, 700);
});
