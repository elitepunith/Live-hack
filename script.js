var CONFIG = {
  // REMOVED the hardcoded API key - put yours here locally, never commit it
  OTX_KEY:      '',
  OTX_INTERVAL: 30000,
  SIM_MIN_MS:   900,
  SIM_MAX_MS:   2500,
  MAX_ARCS:     40,       // lowered from 55 — less SVG pressure
  MAX_FEED:     50,       // lowered from 80 — less DOM nodes sitting around
  ARC_LIFE:     10000,    // shortened from 13s so arcs cycle out faster
};

// country coords for placing dots on the map
var GEO = [
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

// build a lookup table so we stop calling .find() on every event
var geoByCode = {};
for (var i = 0; i < GEO.length; i++) {
  geoByCode[GEO[i].code] = GEO[i];
}

var ATTACK_TYPES = [
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

// total weight computed once, not on every call
var TOTAL_TYPE_WEIGHT = 0;
for (var i = 0; i < ATTACK_TYPES.length; i++) {
  TOTAL_TYPE_WEIGHT += ATTACK_TYPES[i].weight;
}

var OTX_TYPE_MAP = {
  ddos:'ddos', dos:'ddos', flood:'ddos',
  ransomware:'ransomware', ransom:'ransomware',
  rat:'malware', trojan:'malware', backdoor:'malware', botnet:'malware', 'c2':'malware',
  exploit:'zeroday', cve:'zeroday', '0day':'zeroday',
  bruteforce:'bruteforce', brute:'bruteforce', credential:'bruteforce',
  sqli:'sqli', 'sql injection':'sqli',
  phishing:'phishing', spam:'phishing',
  scanner:'portscan', scan:'portscan', recon:'portscan',
  xss:'xss', mitm:'mitm',
};

var SRC_WEIGHTS = {CN:24,RU:20,US:10,KP:8,IR:6,UA:5,NL:4,RO:4,IN:3,BR:3,TR:2,VN:2,NG:2,HK:2};
var TGT_WEIGHTS = {US:28,GB:11,DE:8,JP:7,FR:6,CA:5,AU:5,KR:4,SG:3,IL:3,TW:3,CH:2,SE:2,NL:2,SA:2,IT:2,IN:2,BR:2};

var IP_POOLS = {
  CN:['180.76','223.71','101.89','42.56'],
  RU:['5.255','77.88','91.108','185.29'],
  US:['104.16','172.217','54.239','13.32'],
  KP:['175.45','210.52','77.194'],
  IR:['5.200','185.94','91.132'],
  UA:['91.202','194.44','178.150'],
  NL:['185.220','194.165','45.153'],
  _:['45.33','162.241','104.244','198.199'],
};


// -- helpers --

// pick a random key from a weight map
function weighted(map) {
  var keys = Object.keys(map);
  var vals = Object.values(map);
  var total = 0;
  for (var i = 0; i < vals.length; i++) total += vals[i];
  var r = Math.random() * total;
  for (var i = 0; i < keys.length; i++) {
    r -= vals[i];
    if (r <= 0) return keys[i];
  }
  return keys[keys.length - 1];
}

// pick a random attack type based on its weight
function pickType() {
  var r = Math.random() * TOTAL_TYPE_WEIGHT;
  for (var i = 0; i < ATTACK_TYPES.length; i++) {
    r -= ATTACK_TYPES[i].weight;
    if (r <= 0) return ATTACK_TYPES[i];
  }
  return ATTACK_TYPES[0];
}

// random int between a and b inclusive
function ri(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

// small random offset so dots don't stack exactly
function jit() {
  return (Math.random() - 0.5) * 2.5;
}

// lookup country by code — uses the hash map now instead of .find()
function byCode(c) {
  return geoByCode[c] || null;
}

// pick a random country from the list
function randGeo() {
  return GEO[Math.floor(Math.random() * GEO.length)];
}

// generate a fake IP for a country code
function fakeIP(code) {
  var pool = IP_POOLS[code] || IP_POOLS._;
  return pool[Math.floor(Math.random() * pool.length)] + '.' + ri(1,253) + '.' + ri(1,253);
}


var totalCount = ri(160000, 220000);
var perMinBucket = [];


// -- simulation: build a fake attack event --

function simulate() {
  var srcCode = weighted(SRC_WEIGHTS);
  var tgtCode;
  // make sure source and target are different countries
  do { tgtCode = weighted(TGT_WEIGHTS); } while (tgtCode === srcCode);

  var src = byCode(srcCode);
  var tgt = byCode(tgtCode);
  if (!src || !tgt) return null;

  var type = pickType();
  totalCount++;

  return {
    id:       'sim-' + Date.now() + '-' + Math.random().toString(36).slice(2,5),
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


// -- OTX integration --

var otxSeen = new Set();
var geoCache = {};

async function geolocateIPs(ips) {
  var fresh = ips.filter(function(ip) { return !geoCache[ip]; }).slice(0, 50);
  if (!fresh.length) return;
  try {
    var res = await fetch('https://ip-api.com/batch?fields=status,country,countryCode,lat,lon,query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fresh.map(function(q) { return { query: q }; })),
    });
    if (!res.ok) return;
    var rows = await res.json();
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (r.status === 'success') {
        geoCache[r.query] = { code: r.countryCode, name: r.country, lat: r.lat, lng: r.lon };
      }
    }
  } catch(err) {
    // network issue, just skip this batch
  }
}

// try to figure out what kind of attack a pulse is based on keywords
function typeFromPulse(pulse) {
  var hay = [pulse.name||'', pulse.description||''].concat(pulse.tags||[]).concat(pulse.malware_families||[]).join(' ').toLowerCase();
  var keys = Object.keys(OTX_TYPE_MAP);
  for (var i = 0; i < keys.length; i++) {
    if (hay.indexOf(keys[i]) !== -1) {
      var found = null;
      for (var j = 0; j < ATTACK_TYPES.length; j++) {
        if (ATTACK_TYPES[j].id === OTX_TYPE_MAP[keys[i]]) { found = ATTACK_TYPES[j]; break; }
      }
      return found || pickType();
    }
  }
  return pickType();
}

// convert an OTX pulse into attack events we can display
async function pulseToAttacks(pulse) {
  var indicators = (pulse.indicators || []);
  var inds = [];
  for (var i = 0; i < indicators.length; i++) {
    if (indicators[i].type === 'IPv4' && !otxSeen.has(indicators[i].indicator)) {
      inds.push(indicators[i]);
    }
    if (inds.length >= 5) break;
  }
  if (!inds.length) return [];

  await geolocateIPs(inds.map(function(ind) { return ind.indicator; }));

  var type = typeFromPulse(pulse);
  var results = [];

  for (var i = 0; i < inds.length; i++) {
    var ind = inds[i];
    otxSeen.add(ind.indicator);

    var geo = geoCache[ind.indicator];
    var matched = geo ? byCode(geo.code) : null;
    var src;
    if (geo) {
      src = {
        code: geo.code,
        name: geo.name || geo.code,
        lat: geo.lat + jit(),
        lng: geo.lng + jit(),
        ip: ind.indicator,
        flag: matched ? matched.flag : '🌐'
      };
    } else {
      var fallback = randGeo();
      src = { code:fallback.code, name:fallback.name, lat:fallback.lat+jit(), lng:fallback.lng+jit(), ip:ind.indicator, flag:fallback.flag };
    }

    var tgtCode = weighted(TGT_WEIGHTS);
    var tgt = byCode(tgtCode);
    if (!tgt) continue;

    totalCount++;
    results.push({
      id: 'otx-' + ind.indicator.replace(/\./g,'-') + '-' + Date.now(),
      ts: Date.now(),
      source: 'otx',
      pulse: pulse.name,
      src: src,
      tgt: { code:tgt.code, name:tgt.name, lat:tgt.lat+jit(), lng:tgt.lng+jit(), ip:fakeIP(tgtCode), flag:tgt.flag },
      type: type.id,
      label: type.label,
      color: type.color,
      severity: type.severity,
      port: type.ports[Math.floor(Math.random() * type.ports.length)],
    });
  }
  return results;
}

async function pollOTX() {
  try {
    var res = await fetch('https://otx.alienvault.com/api/v1/pulses/activity?limit=15', {
      headers: { 'X-OTX-API-KEY': CONFIG.OTX_KEY }
    });
    if (!res.ok) throw new Error(res.status);

    var data = await res.json();
    var pulses = data.results || [];

    for (var p = 0; p < pulses.length; p++) {
      var attacks = await pulseToAttacks(pulses[p]);
      for (var a = 0; a < attacks.length; a++) {
        addAttack(attacks[a]);
        await new Promise(function(resolve) { setTimeout(resolve, 500); });
      }
    }

    var el = document.getElementById('data-source');
    if (el) {
      el.textContent = 'OTX Live';
      el.style.color = '#22c55e';
    }
  } catch(e) {
    console.warn('OTX poll failed:', e.message);
  }
}


// -- app state --

var state = {
  attacks:  [],
  svgArcs:  [],   // { id, el, atk, born, timeout }
  srcTally: {},
  tgtTally: {},
  typeTally:{},
  filter:   'all',
  map:      null,
};

// init type tallies to zero
for (var i = 0; i < ATTACK_TYPES.length; i++) {
  state.typeTally[ATTACK_TYPES[i].id] = 0;
}


// -- map setup --

function initMap() {
  var map = L.map('map', {
    center: [22, 10],
    zoom: 3,
    zoomControl: true,
    attributionControl: false,
    minZoom: 2,
    maxZoom: 8,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  state.map = map;

  // redraw arcs when the user finishes panning or zooming
  map.on('moveend zoomend', redrawArcs);
  window.addEventListener('resize', function() {
    map.invalidateSize();
    redrawArcs();
  });
}


// -- SVG arc rendering --
// THIS IS WHERE THE MAIN BUGS WERE.
// The old code set strokeDasharray/strokeDashoffset once and never updated
// them on redraw, causing arcs to look frozen after camera moves.
// Also, old arcs piled up because the timeout cleanup was unreliable.

function getSVG() {
  return document.getElementById('arc-svg');
}

function latLngToXY(lat, lng) {
  var pt = state.map.latLngToContainerPoint([lat, lng]);
  return [pt.x, pt.y];
}

function buildCurve(x1, y1, x2, y2) {
  var mx = (x1 + x2) / 2;
  var my = (y1 + y2) / 2;
  var dx = x2 - x1;
  var dy = y2 - y1;
  var dist = Math.sqrt(dx * dx + dy * dy);
  // avoid division by zero if points overlap
  if (dist < 1) dist = 1;
  var lift = Math.min(dist * 0.38, 200);
  var nx = -dy / dist;
  var ny = dx / dist;
  return 'M ' + x1 + ' ' + y1 + ' Q ' + (mx + nx*lift) + ' ' + (my + ny*lift) + ' ' + x2 + ' ' + y2;
}

// calculate the approximate length of a quadratic bezier so dash values are accurate
function approxQuadLength(x1, y1, cx, cy, x2, y2) {
  // simple chord+control estimate, good enough for dash animation
  var chord = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
  var cont  = Math.sqrt((x1-cx)*(x1-cx) + (y1-cy)*(y1-cy)) + Math.sqrt((cx-x2)*(cx-x2) + (cy-y2)*(cy-y2));
  return (chord + cont) / 2;
}

// parse the control point back out of a path "d" string so we can measure it
function getPathLength(x1, y1, x2, y2) {
  var mx = (x1 + x2) / 2;
  var my = (y1 + y2) / 2;
  var dx = x2 - x1;
  var dy = y2 - y1;
  var dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 1) dist = 1;
  var lift = Math.min(dist * 0.38, 200);
  var nx = -dy / dist;
  var ny = dx / dist;
  var cx = mx + nx * lift;
  var cy = my + ny * lift;
  return approxQuadLength(x1, y1, cx, cy, x2, y2);
}

function drawArc(atk) {
  // respect the active filter
  if (state.filter !== 'all' && atk.type !== state.filter) return;

  var svg = getSVG();
  if (!svg || !state.map) return;

  var srcPt = latLngToXY(atk.src.lat, atk.src.lng);
  var tgtPt = latLngToXY(atk.tgt.lat, atk.tgt.lng);
  var sx = srcPt[0], sy = srcPt[1];
  var tx = tgtPt[0], ty = tgtPt[1];

  var d = buildCurve(sx, sy, tx, ty);
  var pathLen = getPathLength(sx, sy, tx, ty);

  var isReal  = (atk.source === 'otx');
  var color   = atk.color;
  var weight  = isReal ? 1.8 : 1.2;
  var animDur = 1000 + Math.random() * 500;

  // group element holds all parts of one arc
  var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('data-id', atk.id);

  // glow effect behind the main line
  var glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  glow.setAttribute('d', d);
  glow.setAttribute('stroke', color);
  glow.setAttribute('stroke-width', weight + 3);
  glow.setAttribute('stroke-opacity', '0.18');
  glow.setAttribute('fill', 'none');
  glow.setAttribute('filter', 'url(#glow-any)');
  glow.style.strokeDasharray  = pathLen;
  glow.style.strokeDashoffset = pathLen;
  glow.style.animation = 'arc-travel ' + animDur + 'ms cubic-bezier(0.4,0,0.2,1) forwards';

  // the visible arc line
  var arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arc.setAttribute('d', d);
  arc.setAttribute('stroke', color);
  arc.setAttribute('stroke-width', weight);
  arc.setAttribute('stroke-opacity', isReal ? '0.9' : '0.65');
  arc.setAttribute('stroke-linecap', 'round');
  arc.setAttribute('fill', 'none');
  arc.style.strokeDasharray  = pathLen;
  arc.style.strokeDashoffset = pathLen;
  arc.style.animation = 'arc-travel ' + animDur + 'ms cubic-bezier(0.4,0,0.2,1) forwards';

  // dot at the source location
  var srcDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  srcDot.setAttribute('cx', sx);
  srcDot.setAttribute('cy', sy);
  srcDot.setAttribute('r', isReal ? '4' : '3');
  srcDot.setAttribute('fill', color);
  srcDot.setAttribute('fill-opacity', '0.9');

  // expanding ring at the target
  var ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  ring.setAttribute('cx', tx);
  ring.setAttribute('cy', ty);
  ring.setAttribute('r', '4');
  ring.setAttribute('fill', 'none');
  ring.setAttribute('stroke', color);
  ring.setAttribute('stroke-width', '2');
  ring.style.animation = 'pulse-ring 1.5s ease-out ' + animDur + 'ms 3 forwards';

  // solid dot at the target
  var tgtDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  tgtDot.setAttribute('cx', tx);
  tgtDot.setAttribute('cy', ty);
  tgtDot.setAttribute('r', '3');
  tgtDot.setAttribute('fill', color);
  tgtDot.setAttribute('fill-opacity', '0.85');

  g.appendChild(glow);
  g.appendChild(arc);
  g.appendChild(srcDot);
  g.appendChild(ring);
  g.appendChild(tgtDot);
  svg.appendChild(g);

  // schedule removal — keep the timeout ID so we can cancel it if needed
  var timeoutId = setTimeout(function() {
    g.style.transition = 'opacity 1s ease';
    g.style.opacity = '0';
    setTimeout(function() {
      removeArcById(atk.id);
    }, 1000);
  }, CONFIG.ARC_LIFE);

  state.svgArcs.push({ id: atk.id, el: g, atk: atk, born: Date.now(), timeout: timeoutId });

  // if we have too many arcs on screen, kill the oldest one right away
  while (state.svgArcs.length > CONFIG.MAX_ARCS) {
    var old = state.svgArcs.shift();
    clearTimeout(old.timeout);  // cancel its scheduled removal
    old.el.remove();
  }
}

// clean removal of a single arc by its id
function removeArcById(id) {
  for (var i = 0; i < state.svgArcs.length; i++) {
    if (state.svgArcs[i].id === id) {
      state.svgArcs[i].el.remove();
      state.svgArcs.splice(i, 1);
      return;
    }
  }
}

// FIX: redraw arcs after pan/zoom — recalculate positions AND dash values
function redrawArcs() {
  for (var i = 0; i < state.svgArcs.length; i++) {
    var entry = state.svgArcs[i];
    var atk = entry.atk;
    var el  = entry.el;

    var srcPt = latLngToXY(atk.src.lat, atk.src.lng);
    var tgtPt = latLngToXY(atk.tgt.lat, atk.tgt.lng);
    var sx = srcPt[0], sy = srcPt[1];
    var tx = tgtPt[0], ty = tgtPt[1];

    var d = buildCurve(sx, sy, tx, ty);
    var pathLen = getPathLength(sx, sy, tx, ty);

    // update the path shapes
    var paths = el.querySelectorAll('path');
    for (var p = 0; p < paths.length; p++) {
      paths[p].setAttribute('d', d);
      // recalculate dash values so the line doesn't look frozen
      paths[p].style.strokeDasharray  = pathLen;
      paths[p].style.strokeDashoffset = 0; // already revealed, just show it
    }

    // move the circles to the new screen positions
    var circles = el.querySelectorAll('circle');
    if (circles[0]) { circles[0].setAttribute('cx', sx); circles[0].setAttribute('cy', sy); }
    if (circles[1]) { circles[1].setAttribute('cx', tx); circles[1].setAttribute('cy', ty); }
    if (circles[2]) { circles[2].setAttribute('cx', tx); circles[2].setAttribute('cy', ty); }
  }
}


// -- core: register a new attack event --

// throttle counter updates — don't rebuild the DOM lists on every single event
var counterDirty = false;
var counterTimer = null;

function addAttack(atk) {
  state.attacks.unshift(atk);
  if (state.attacks.length > 100) state.attacks.pop();

  // update tallies
  state.srcTally[atk.src.code] = (state.srcTally[atk.src.code] || 0) + 1;
  state.tgtTally[atk.tgt.code] = (state.tgtTally[atk.tgt.code] || 0) + 1;
  state.typeTally[atk.type]    = (state.typeTally[atk.type]    || 0) + 1;

  drawArc(atk);
  addFeedRow(atk);

  // batch counter updates — at most once every 500ms instead of every event
  if (!counterDirty) {
    counterDirty = true;
    counterTimer = setTimeout(function() {
      updateCounters();
      counterDirty = false;
    }, 500);
  }
}


// -- live feed panel --

var feedTimestamps = []; // parallel array: feedTimestamps[i] = timestamp for feed row i

function addFeedRow(atk) {
  var feed = document.getElementById('feed-scroll');
  var isReal = (atk.source === 'otx');

  var row = document.createElement('div');
  row.className = 'feed-row';
  if (isReal) row.style.borderLeft = '2px solid ' + atk.color;

  // build the row HTML
  var html = '<div class="fr-top">' +
    '<div class="fr-left">' +
    '<span class="fr-dot" style="background:' + atk.color + '"></span>' +
    '<span class="fr-type" style="color:' + atk.color + '">' + atk.label + '</span>' +
    '<span class="fr-sev sev-' + atk.severity + '">' + atk.severity + '</span>';
  if (isReal) html += '<span class="fr-real">● Real</span>';
  html += '</div><span class="fr-time">just now</span></div>';

  if (atk.pulse) html += '<div class="fr-pulse">⬡ ' + atk.pulse + '</div>';

  html += '<div class="fr-route">' +
    '<div class="fr-side">' +
    '<div class="fr-flag-name"><span class="fr-flag">' + atk.src.flag + '</span><span class="fr-country">' + atk.src.name + '</span></div>' +
    '<div class="fr-ip">' + atk.src.ip + '</div></div>' +
    '<div class="fr-arrow-icon"><svg width="26" height="10" viewBox="0 0 26 10" fill="none">' +
    '<path d="M1 5H22M18 1.5L22 5L18 8.5" stroke="' + atk.color + '" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg></div>' +
    '<div class="fr-side right">' +
    '<div class="fr-flag-name right"><span class="fr-country">' + atk.tgt.name + '</span><span class="fr-flag">' + atk.tgt.flag + '</span></div>' +
    '<div class="fr-ip" style="text-align:right">' + atk.tgt.ip + ':' + atk.port + '</div></div></div>';

  row.innerHTML = html;
  feed.prepend(row);

  // track when this row was added
  feedTimestamps.unshift(Date.now());

  // trim excess rows
  while (feed.children.length > CONFIG.MAX_FEED) {
    feed.lastChild.remove();
    feedTimestamps.pop();
  }

  document.getElementById('feed-count').textContent = feed.children.length;
}

// update the "Xs ago" timestamps in the feed
// uses the parallel array instead of querySelectorAll + WeakMap
function tickTimestamps() {
  var rows = document.getElementById('feed-scroll').children;
  var now = Date.now();
  for (var i = 0; i < rows.length; i++) {
    var el = rows[i].querySelector('.fr-time');
    if (!el || i >= feedTimestamps.length) continue;
    var seconds = Math.floor((now - feedTimestamps[i]) / 1000);
    if (seconds < 5) {
      el.textContent = 'just now';
    } else if (seconds < 60) {
      el.textContent = seconds + 's';
    } else {
      el.textContent = Math.floor(seconds / 60) + 'm';
    }
  }
}
setInterval(tickTimestamps, 5000);


// -- counters and rank lists --

function updateCounters() {
  document.getElementById('total-count').textContent = totalCount.toLocaleString();

  perMinBucket.push(Date.now());
  var cutoff = Date.now() - 60000;
  while (perMinBucket.length && perMinBucket[0] < cutoff) perMinBucket.shift();
  document.getElementById('apm-count').textContent = perMinBucket.length;

  updateRankList('top-sources', state.srcTally, '#ef4444');
  updateRankList('top-targets', state.tgtTally, '#3b82f6');
  updateTypeList();
  updateTypeStats();
}

function updateRankList(elId, tally, barColor) {
  var el = document.getElementById(elId);
  var entries = Object.entries(tally).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 6);
  if (!entries.length) return;

  var max = entries[0][1];
  var html = '';
  for (var i = 0; i < entries.length; i++) {
    var code = entries[i][0];
    var count = entries[i][1];
    var c = byCode(code);
    if (!c) continue;
    var pct = Math.round((count / max) * 100);
    html += '<div class="rank-item">' +
      '<span class="rank-num">' + (i+1) + '</span>' +
      '<span class="rank-flag">' + c.flag + '</span>' +
      '<div class="rank-info"><div class="rank-name">' + c.name + '</div>' +
      '<div class="rank-track"><div class="rank-fill" style="width:' + pct + '%;background:' + barColor + '"></div></div></div>' +
      '<span class="rank-count">' + count + '</span></div>';
  }
  el.innerHTML = html;
}

function updateTypeList() {
  var el = document.getElementById('type-list');
  var total = 0;
  var keys = Object.keys(state.typeTally);
  for (var i = 0; i < keys.length; i++) total += state.typeTally[keys[i]];
  if (!total) return;

  // sort attack types by count descending
  var sorted = ATTACK_TYPES.slice().sort(function(a, b) {
    return (state.typeTally[b.id] || 0) - (state.typeTally[a.id] || 0);
  });

  var html = '';
  var limit = Math.min(sorted.length, 8);
  for (var i = 0; i < limit; i++) {
    var t = sorted[i];
    var count = state.typeTally[t.id] || 0;
    var pct = Math.round((count / total) * 100);
    html += '<div class="type-row">' +
      '<span class="type-dot" style="background:' + t.color + '"></span>' +
      '<span class="type-name">' + t.label + '</span>' +
      '<span class="type-pct">' + pct + '%</span></div>';
  }
  el.innerHTML = html;
}

function buildTypeStats() {
  var html = '';
  for (var i = 0; i < ATTACK_TYPES.length; i++) {
    var t = ATTACK_TYPES[i];
    html += '<div class="ts-item">' +
      '<span class="ts-dot" style="background:' + t.color + '"></span>' +
      '<span class="ts-name">' + t.label + '</span>' +
      '<span class="ts-count" id="ts-' + t.id + '" style="color:' + t.color + '">0</span></div>';
  }
  document.getElementById('type-stats').innerHTML = html;
}

function updateTypeStats() {
  for (var i = 0; i < ATTACK_TYPES.length; i++) {
    var t = ATTACK_TYPES[i];
    var el = document.getElementById('ts-' + t.id);
    if (el) el.textContent = state.typeTally[t.id] || 0;
  }
}


// -- filter chips --

function buildFilterChips() {
  var container = document.getElementById('filter-chips');
  container.appendChild(makeChip('All', 'all', true));
  for (var i = 0; i < ATTACK_TYPES.length; i++) {
    container.appendChild(makeChip(ATTACK_TYPES[i].label, ATTACK_TYPES[i].id, false));
  }
}

function makeChip(label, id, active) {
  var el = document.createElement('span');
  el.className = 'fchip' + (active ? ' active' : '');
  el.textContent = label;
  el.dataset.id = id;
  el.addEventListener('click', function() {
    var chips = document.querySelectorAll('.fchip');
    for (var i = 0; i < chips.length; i++) chips[i].classList.remove('active');
    el.classList.add('active');
    state.filter = id;
  });
  return el;
}


// -- clock --

function updateClock() {
  var n = new Date();
  var h = String(n.getUTCHours()).padStart(2, '0');
  var m = String(n.getUTCMinutes()).padStart(2, '0');
  var s = String(n.getUTCSeconds()).padStart(2, '0');
  document.getElementById('utc-clock').textContent = h + ':' + m + ':' + s;
}
setInterval(updateClock, 1000);
updateClock();


// -- attack detail card --

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
  document.getElementById('ac-meta').textContent = 'Port ' + atk.port + '  ·  ' + (atk.source === 'otx' ? '● Verified (OTX)' : 'Simulated');
  document.getElementById('attack-card').classList.remove('hidden');
}

window.closeCard = function() {
  document.getElementById('attack-card').classList.add('hidden');
};


// -- simulation loop --

function runSimLoop() {
  var atk = simulate();
  if (atk) addAttack(atk);
  setTimeout(runSimLoop, ri(CONFIG.SIM_MIN_MS, CONFIG.SIM_MAX_MS));
}

// populate the feed with some initial entries so it doesn't look empty
function seedInitial() {
  for (var i = 0; i < 15; i++) {
    var atk = simulate();
    if (!atk) continue;
    state.attacks.push(atk);
    state.srcTally[atk.src.code] = (state.srcTally[atk.src.code] || 0) + 1;
    state.tgtTally[atk.tgt.code] = (state.tgtTally[atk.tgt.code] || 0) + 1;
    state.typeTally[atk.type]    = (state.typeTally[atk.type]    || 0) + 1;
    addFeedRow(atk);
  }
  updateCounters();
}


// -- boot everything up --

window.addEventListener('load', function() {
  initMap();
  buildTypeStats();
  buildFilterChips();
  seedInitial();

  // short delay so the map tiles have a moment to load
  setTimeout(function() {
    for (var i = 0; i < state.attacks.length; i++) {
      drawArc(state.attacks[i]);
    }
    runSimLoop();

    // only poll OTX if an API key is actually set
    if (CONFIG.OTX_KEY && CONFIG.OTX_KEY !== 'YOUR_OTX_API_KEY_HERE' && CONFIG.OTX_KEY.length > 10) {
      pollOTX();
      setInterval(pollOTX, CONFIG.OTX_INTERVAL);
    }
  }, 700);
});