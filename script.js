// ─────────────────────────────────────────────────────────────
//  Live-Hack · script.js
//
//  Free APIs:
//  · AlienVault OTX  — real malicious IPs (free key)
//    https://otx.alienvault.com/ → Settings → API Key
//  · ip-api.com      — geolocate IPs (no key needed)
// ─────────────────────────────────────────────────────────────

const CONFIG = {
  OTX_KEY:      '45767dabedb31cf712af5df63ac8d1765fd85a4cc88d01f0b9f9216b95df5884',
  OTX_INTERVAL: 30000,
  SIM_MIN_MS:   900,
  SIM_MAX_MS:   2500,
  MAX_ARCS:     55,
  MAX_FEED:     80,
  ARC_LIFETIME: 14000,
}

// ── Country database (deduplicated — UA was listed twice before) ──
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
]

const ATTACK_TYPES = [
  { id:'ddos',       label:'DDoS',        color:'#ef4444', severity:'critical', weight:18, ports:[80,443,53,123] },
  { id:'ransomware', label:'Ransomware',  color:'#f97316', severity:'critical', weight:5,  ports:[445,3389,139]  },
  { id:'malware',    label:'Malware C2',  color:'#a855f7', severity:'critical', weight:8,  ports:[4444,8888,1337]},
  { id:'zeroday',    label:'Zero-Day',    color:'#e2e8f0', severity:'critical', weight:2,  ports:[80,443]        },
  { id:'bruteforce', label:'Brute Force', color:'#eab308', severity:'high',     weight:15, ports:[22,3389,21]    },
  { id:'sqli',       label:'SQL Inject',  color:'#8b5cf6', severity:'high',     weight:12, ports:[80,443,8080]   },
  { id:'phishing',   label:'Phishing',    color:'#fb923c', severity:'medium',   weight:10, ports:[80,443,25]     },
  { id:'portscan',   label:'Port Scan',   color:'#3b82f6', severity:'low',      weight:20, ports:[22,80,443,3389]},
  { id:'xss',        label:'XSS',         color:'#06b6d4', severity:'medium',   weight:7,  ports:[80,443,8080]   },
  { id:'mitm',       label:'MITM',        color:'#22c55e', severity:'high',     weight:3,  ports:[80,443]        },
]

const OTX_TYPE_MAP = {
  ddos:'ddos', dos:'ddos', flood:'ddos',
  ransomware:'ransomware', ransom:'ransomware',
  rat:'malware', trojan:'malware', backdoor:'malware', botnet:'malware', 'c2':'malware',
  exploit:'zeroday', cve:'zeroday', '0day':'zeroday',
  bruteforce:'bruteforce', brute:'bruteforce', credential:'bruteforce',
  sqli:'sqli', 'sql injection':'sqli',
  phishing:'phishing', spam:'phishing',
  scanner:'portscan', scan:'portscan', recon:'portscan',
  xss:'xss', mitm:'mitm',
}

const SEV_COLOR = { critical:'#ef4444', high:'#f97316', medium:'#eab308', low:'#22c55e' }

const SRC_WEIGHTS = {CN:24,RU:20,US:10,KP:8,IR:6,UA:5,NL:4,RO:4,IN:3,BR:3,TR:2,VN:2,NG:2,HK:2}
const TGT_WEIGHTS = {US:28,GB:11,DE:8,JP:7,FR:6,CA:5,AU:5,KR:4,SG:3,IL:3,TW:3,CH:2,SE:2,NL:2,SA:2,IT:2,IN:2,BR:2}

const IP_POOLS = {
  CN:['180.76','223.71','101.89','42.56'],
  RU:['5.255','77.88','91.108','185.29'],
  US:['104.16','172.217','54.239','13.32'],
  KP:['175.45','210.52','77.194'],
  IR:['5.200','185.94','91.132'],
  UA:['91.202','194.44','178.150'],
  NL:['185.220','194.165','45.153'],
  _:['45.33','162.241','104.244','198.199'],
}

// ── Helpers ───────────────────────────────────────────────────
function weighted(map) {
  const keys = Object.keys(map), vals = Object.values(map)
  const total = vals.reduce((a,b) => a+b, 0)
  let r = Math.random() * total
  for (let i = 0; i < keys.length; i++) { r -= vals[i]; if (r <= 0) return keys[i] }
  return keys[keys.length-1]
}

function pickType() {
  const total = ATTACK_TYPES.reduce((a,t) => a+t.weight, 0)
  let r = Math.random() * total
  for (const t of ATTACK_TYPES) { r -= t.weight; if (r <= 0) return t }
  return ATTACK_TYPES[0]
}

const ri      = (a,b) => Math.floor(Math.random()*(b-a+1))+a
const jit     = ()    => (Math.random()-0.5)*2.5
const byCode  = c     => GEO.find(g => g.code === c)
const randGeo = ()    => GEO[Math.floor(Math.random()*GEO.length)]

function fakeIP(code) {
  const pool = IP_POOLS[code] || IP_POOLS._
  return `${pool[Math.floor(Math.random()*pool.length)]}.${ri(1,253)}.${ri(1,253)}`
}

let totalCount = ri(160000, 220000)
const perMinBucket = []

// ── Simulation ────────────────────────────────────────────────
function simulate() {
  const srcCode = weighted(SRC_WEIGHTS)
  let tgtCode
  do { tgtCode = weighted(TGT_WEIGHTS) } while (tgtCode === srcCode)

  const src = byCode(srcCode), tgt = byCode(tgtCode)
  if (!src || !tgt) return null

  const type = pickType()
  totalCount++

  return {
    id:       `sim-${Date.now()}-${Math.random().toString(36).slice(2,5)}`,
    ts:       Date.now(),
    source:   'sim',
    src:      { ...src, lat:src.lat+jit(), lng:src.lng+jit(), ip:fakeIP(srcCode) },
    tgt:      { ...tgt, lat:tgt.lat+jit(), lng:tgt.lng+jit(), ip:fakeIP(tgtCode) },
    type:     type.id,
    label:    type.label,
    color:    type.color,
    severity: type.severity,
    port:     type.ports[Math.floor(Math.random()*type.ports.length)],
  }
}

// ── OTX + ip-api real data ────────────────────────────────────
const otxSeen  = new Set()
const geoCache = {}

async function geolocateIPs(ips) {
  const fresh = ips.filter(ip => !geoCache[ip]).slice(0,50)
  if (!fresh.length) return
  try {
    const res = await fetch('https://ip-api.com/batch?fields=status,country,countryCode,lat,lon,query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fresh.map(q => ({ query: q }))),
    })
    if (!res.ok) return
    const rows = await res.json()
    rows.forEach(r => {
      if (r.status === 'success') {
        geoCache[r.query] = { code:r.countryCode, name:r.country, lat:r.lat, lng:r.lon }
      }
    })
  } catch {}
}

function typeFromPulse(pulse) {
  const hay = [pulse.name||'', pulse.description||'', ...(pulse.tags||[]), ...(pulse.malware_families||[])].join(' ').toLowerCase()
  for (const [kw, id] of Object.entries(OTX_TYPE_MAP)) {
    if (hay.includes(kw)) return ATTACK_TYPES.find(t => t.id === id) || pickType()
  }
  return pickType()
}

async function pulseToAttacks(pulse) {
  const inds = (pulse.indicators||[]).filter(i => i.type==='IPv4' && !otxSeen.has(i.indicator)).slice(0,5)
  if (!inds.length) return []

  await geolocateIPs(inds.map(i => i.indicator))
  const type = typeFromPulse(pulse)

  return inds.map(ind => {
    otxSeen.add(ind.indicator)
    const geo     = geoCache[ind.indicator]
    const matched = geo ? byCode(geo.code) : null
    const src = geo
      ? { code:geo.code, name:geo.name||geo.code, lat:geo.lat+jit(), lng:geo.lng+jit(), ip:ind.indicator, flag:matched?.flag||'🌐' }
      : (() => { const f = randGeo(); return { ...f, lat:f.lat+jit(), lng:f.lng+jit(), ip:ind.indicator } })()

    const tgtCode = weighted(TGT_WEIGHTS)
    const tgt     = byCode(tgtCode)
    if (!tgt) return null

    totalCount++
    return {
      id:       `otx-${ind.indicator.replace(/\./g,'-')}-${Date.now()}`,
      ts:       Date.now(),
      source:   'otx',
      pulse:    pulse.name,
      src,
      tgt:      { ...tgt, lat:tgt.lat+jit(), lng:tgt.lng+jit(), ip:fakeIP(tgtCode) },
      type:     type.id,
      label:    type.label,
      color:    type.color,
      severity: type.severity,
      port:     type.ports[Math.floor(Math.random()*type.ports.length)],
    }
  }).filter(Boolean)
}

async function pollOTX() {
  try {
    const res = await fetch('https://otx.alienvault.com/api/v1/pulses/activity?limit=15', {
      headers: { 'X-OTX-API-KEY': CONFIG.OTX_KEY }
    })
    if (!res.ok) throw new Error(`OTX ${res.status}`)
    const data   = await res.json()
    const pulses = data.results || []

    for (const pulse of pulses) {
      const attacks = await pulseToAttacks(pulse)
      for (const atk of attacks) {
        addAttack(atk)
        await new Promise(r => setTimeout(r, 500))
      }
    }

    const el = document.getElementById('data-source')
    el.textContent  = 'OTX Live'
    el.style.color  = '#22c55e'
  } catch (e) {
    console.warn('OTX poll failed:', e.message)
  }
}

// ── State ─────────────────────────────────────────────────────
const state = {
  attacks:   [],
  svgArcs:   [],
  srcTally:  {},
  tgtTally:  {},
  typeTally: {},
  filter:    'all',
  map:       null,
}

ATTACK_TYPES.forEach(t => { state.typeTally[t.id] = 0 })

// ── Map init ──────────────────────────────────────────────────
function initMap() {
  const map = L.map('map', {
    center: [22, 10],
    zoom:   3,
    zoomControl: true,
    attributionControl: false,
    minZoom: 2,
    maxZoom: 8,
    zoomAnimation: true,
  })

  // dark_nolabels = clean dark tiles with no country/city labels
  // Labels in our own SVG/HTML stay correct and match our GEO data
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 20,
  }).addTo(map)

  state.map = map

  // Redraw arcs on map pan/zoom so they stay aligned
  map.on('move zoom moveend zoomend', redrawAllArcs)

  window.addEventListener('resize', () => {
    map.invalidateSize()
    redrawAllArcs()
  })
}

// ── SVG arc drawing (smooth, animated stroke-dashoffset) ──────
const svg = () => document.getElementById('arc-svg')

function latLngToSVG(lat, lng) {
  const point = state.map.latLngToContainerPoint([lat, lng])
  return { x: point.x, y: point.y }
}

// Build a quadratic bezier SVG path between two map points
function buildPath(x1, y1, x2, y2) {
  const mx  = (x1 + x2) / 2
  const my  = (y1 + y2) / 2
  const dx  = x2 - x1
  const dy  = y2 - y1
  const len = Math.sqrt(dx*dx + dy*dy)
  // Control point lifted perpendicular to the arc, scaled by distance
  const lift = Math.min(len * 0.35, 180)
  const cx   = mx - (dy / len) * lift
  const cy   = my + (dx / len) * lift
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`
}

// Approximate path length for dash animation
function approxPathLen(x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1
  return Math.sqrt(dx*dx + dy*dy) * 1.15
}

function drawArc(atk) {
  if (state.filter !== 'all' && atk.type !== state.filter) return

  const s = latLngToSVG(atk.src.lat, atk.src.lng)
  const t = latLngToSVG(atk.tgt.lat, atk.tgt.lng)
  const d = buildPath(s.x, s.y, t.x, t.y)
  const pathLen = approxPathLen(s.x, s.y, t.x, t.y)

  const color   = atk.color
  const isReal  = atk.source === 'otx'
  const weight  = isReal ? 1.8 : 1.2
  const opacity = isReal ? 0.9 : 0.65
  const dur     = 1200 + Math.random() * 600

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.setAttribute('data-id', atk.id)
  g.setAttribute('data-src-lat', atk.src.lat)
  g.setAttribute('data-src-lng', atk.src.lng)
  g.setAttribute('data-tgt-lat', atk.tgt.lat)
  g.setAttribute('data-tgt-lng', atk.tgt.lng)

  // Glow layer (blurred duplicate)
  const glowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  glowPath.setAttribute('d', d)
  glowPath.setAttribute('stroke', color)
  glowPath.setAttribute('stroke-width', weight + 2)
  glowPath.setAttribute('stroke-opacity', '0.2')
  glowPath.setAttribute('fill', 'none')
  glowPath.setAttribute('filter', 'url(#glow-any)')
  glowPath.style.strokeDasharray  = pathLen
  glowPath.style.strokeDashoffset = pathLen
  glowPath.style.animation = `arc-travel ${dur}ms ease-out forwards`

  // Main arc
  const mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  mainPath.setAttribute('d', d)
  mainPath.setAttribute('stroke', color)
  mainPath.setAttribute('stroke-width', weight)
  mainPath.setAttribute('stroke-opacity', opacity)
  mainPath.setAttribute('stroke-linecap', 'round')
  mainPath.setAttribute('fill', 'none')
  mainPath.style.strokeDasharray  = pathLen
  mainPath.style.strokeDashoffset = pathLen
  mainPath.style.animation = `arc-travel ${dur}ms ease-out forwards`

  // Source dot
  const srcDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  srcDot.setAttribute('cx', s.x)
  srcDot.setAttribute('cy', s.y)
  srcDot.setAttribute('r', isReal ? 4 : 3)
  srcDot.setAttribute('fill', color)
  srcDot.setAttribute('fill-opacity', '0.9')

  // Target pulse ring (animated)
  const ring1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  ring1.setAttribute('cx', t.x)
  ring1.setAttribute('cy', t.y)
  ring1.setAttribute('r', '4')
  ring1.setAttribute('fill', 'none')
  ring1.setAttribute('stroke', color)
  ring1.setAttribute('stroke-width', '1.5')
  ring1.style.animation = `pulse-ring 1.6s ease-out ${dur}ms 3 forwards`

  const ring2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  ring2.setAttribute('cx', t.x)
  ring2.setAttribute('cy', t.y)
  ring2.setAttribute('r', '4')
  ring2.setAttribute('fill', 'none')
  ring2.setAttribute('stroke', color)
  ring2.setAttribute('stroke-width', '1')
  ring2.style.animation = `pulse-ring 1.6s ease-out ${dur + 400}ms 2 forwards`

  // Target dot
  const tgtDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  tgtDot.setAttribute('cx', t.x)
  tgtDot.setAttribute('cy', t.y)
  tgtDot.setAttribute('r', '3')
  tgtDot.setAttribute('fill', color)
  tgtDot.setAttribute('fill-opacity', '0.8')

  g.append(glowPath, mainPath, srcDot, ring1, ring2, tgtDot)
  svg().appendChild(g)

  // Store for redraw + cleanup
  state.svgArcs.push({ id: atk.id, el: g, atk, born: Date.now() })
  if (state.svgArcs.length > CONFIG.MAX_ARCS) {
    const old = state.svgArcs.shift()
    old.el.remove()
  }

  // Fade out and remove after lifetime
  setTimeout(() => {
    g.style.transition = 'opacity 1s ease'
    g.style.opacity    = '0'
    setTimeout(() => {
      g.remove()
      state.svgArcs = state.svgArcs.filter(a => a.id !== atk.id)
    }, 1000)
  }, CONFIG.ARC_LIFETIME)
}

// Reposition all existing arcs when map pans/zooms
function redrawAllArcs() {
  state.svgArcs.forEach(({ atk, el }) => {
    const s = latLngToSVG(atk.src.lat, atk.src.lng)
    const t = latLngToSVG(atk.tgt.lat, atk.tgt.lng)
    const d = buildPath(s.x, s.y, t.x, t.y)

    el.querySelectorAll('path').forEach(p => p.setAttribute('d', d))
    el.querySelectorAll('circle').forEach(c => {
      const isSrc = parseFloat(c.getAttribute('cx')) < 1000
      // Determine which end this dot belongs to by comparing proximity
    })

    // Update all circles positions
    const circles = el.querySelectorAll('circle')
    if (circles[0]) { circles[0].setAttribute('cx', s.x); circles[0].setAttribute('cy', s.y) }
    if (circles[1]) { circles[1].setAttribute('cx', t.x); circles[1].setAttribute('cy', t.y) }
    if (circles[2]) { circles[2].setAttribute('cx', t.x); circles[2].setAttribute('cy', t.y) }
    if (circles[3]) { circles[3].setAttribute('cx', t.x); circles[3].setAttribute('cy', t.y) }
  })
}

// ── Add a new attack ──────────────────────────────────────────
function addAttack(atk) {
  state.attacks.unshift(atk)
  if (state.attacks.length > 100) state.attacks.pop()

  state.srcTally[atk.src.code] = (state.srcTally[atk.src.code] || 0) + 1
  state.tgtTally[atk.tgt.code] = (state.tgtTally[atk.tgt.code] || 0) + 1
  state.typeTally[atk.type]    = (state.typeTally[atk.type]    || 0) + 1

  drawArc(atk)
  addFeedRow(atk)
  updateCounters()
}

// ── Live feed ─────────────────────────────────────────────────
const tsMap = new WeakMap()

function addFeedRow(atk) {
  const feed   = document.getElementById('feed-scroll')
  const isReal = atk.source === 'otx'

  const row = document.createElement('div')
  row.className = 'feed-row'
  if (isReal) row.style.borderLeft = `2px solid ${atk.color}`

  row.innerHTML = `
    <div class="fr-top">
      <div class="fr-left">
        <span class="fr-dot" style="background:${atk.color}"></span>
        <span class="fr-type" style="color:${atk.color}">${atk.label}</span>
        <span class="fr-sev sev-${atk.severity}">${atk.severity}</span>
        ${isReal ? '<span class="fr-real">● Real</span>' : ''}
      </div>
      <span class="fr-time">just now</span>
    </div>
    ${atk.pulse ? `<div class="fr-pulse">⬡ ${atk.pulse}</div>` : ''}
    <div class="fr-route">
      <div class="fr-side">
        <div class="fr-flag-name">
          <span class="fr-flag">${atk.src.flag}</span>
          <span class="fr-country">${atk.src.name}</span>
        </div>
        <div class="fr-ip">${atk.src.ip}</div>
      </div>
      <div class="fr-arrow-icon">
        <svg width="26" height="10" viewBox="0 0 26 10" fill="none">
          <path d="M1 5H22M18 1.5L22 5L18 8.5"
            stroke="${atk.color}" stroke-width="1.2"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="fr-side right">
        <div class="fr-flag-name right">
          <span class="fr-country">${atk.tgt.name}</span>
          <span class="fr-flag">${atk.tgt.flag}</span>
        </div>
        <div class="fr-ip" style="text-align:right">${atk.tgt.ip}:${atk.port}</div>
      </div>
    </div>
  `

  feed.prepend(row)
  while (feed.children.length > CONFIG.MAX_FEED) feed.lastChild.remove()
  document.getElementById('feed-count').textContent = feed.children.length
  tickTimestamps()
}

function tickTimestamps() {
  document.querySelectorAll('.feed-row').forEach((row, i) => {
    const el = row.querySelector('.fr-time')
    if (!el) return
    if (!tsMap.has(row)) tsMap.set(row, Date.now() - i * 750)
    const s = Math.floor((Date.now() - tsMap.get(row)) / 1000)
    el.textContent = s < 5 ? 'just now' : s < 60 ? `${s}s` : `${Math.floor(s/60)}m`
  })
}

setInterval(tickTimestamps, 5000)

// ── Stats ─────────────────────────────────────────────────────
function updateCounters() {
  document.getElementById('total-count').textContent = totalCount.toLocaleString()

  perMinBucket.push(Date.now())
  const cutoff = Date.now() - 60000
  while (perMinBucket.length && perMinBucket[0] < cutoff) perMinBucket.shift()
  document.getElementById('apm-count').textContent = perMinBucket.length

  updateRankList('top-sources', state.srcTally, '#ef4444')
  updateRankList('top-targets', state.tgtTally, '#3b82f6')
  updateTypeList()
  updateTypeStats()
}

function updateRankList(elId, tally, barColor) {
  const el      = document.getElementById(elId)
  const entries = Object.entries(tally).sort((a,b) => b[1]-a[1]).slice(0,6)
  if (!entries.length) return
  const max = entries[0][1]
  el.innerHTML = entries.map(([code, count], i) => {
    const c = GEO.find(g => g.code === code)
    if (!c) return ''
    return `
      <div class="rank-item">
        <span class="rank-num">${i+1}</span>
        <span class="rank-flag">${c.flag}</span>
        <div class="rank-info">
          <div class="rank-name">${c.name}</div>
          <div class="rank-track">
            <div class="rank-fill" style="width:${Math.round((count/max)*100)}%;background:${barColor}"></div>
          </div>
        </div>
        <span class="rank-count">${count}</span>
      </div>
    `
  }).join('')
}

function updateTypeList() {
  const el    = document.getElementById('type-list')
  const total = Object.values(state.typeTally).reduce((a,b)=>a+b, 0)
  if (!total) return
  const sorted = [...ATTACK_TYPES].sort((a,b) => (state.typeTally[b.id]||0)-(state.typeTally[a.id]||0))
  el.innerHTML = sorted.slice(0,8).map(t => {
    const count = state.typeTally[t.id] || 0
    const pct   = Math.round((count/total)*100)
    return `
      <div class="type-row">
        <span class="type-dot" style="background:${t.color}"></span>
        <span class="type-name">${t.label}</span>
        <div class="type-bar-wrap">
          <div class="type-bar-fill" style="width:${pct}%;background:${t.color}"></div>
        </div>
        <span class="type-pct">${pct}%</span>
      </div>
    `
  }).join('')
}

function buildTypeStats() {
  document.getElementById('type-stats').innerHTML = ATTACK_TYPES.map(t => `
    <div class="ts-item">
      <span class="ts-dot" style="background:${t.color}"></span>
      <span class="ts-name">${t.label}</span>
      <span class="ts-count" id="ts-${t.id}" style="color:${t.color}">0</span>
    </div>
  `).join('')
}

function updateTypeStats() {
  ATTACK_TYPES.forEach(t => {
    const el = document.getElementById(`ts-${t.id}`)
    if (el) el.textContent = state.typeTally[t.id] || 0
  })
}

// ── Filter chips ──────────────────────────────────────────────
function buildFilterChips() {
  const container = document.getElementById('filter-chips')
  container.appendChild(makeChip('All', 'all', true))
  ATTACK_TYPES.forEach(t => container.appendChild(makeChip(t.label, t.id, false)))
}

function makeChip(label, id, active) {
  const el = document.createElement('span')
  el.className   = `fchip${active ? ' active' : ''}`
  el.textContent = label
  el.dataset.id  = id
  el.addEventListener('click', () => {
    document.querySelectorAll('.fchip').forEach(c => c.classList.remove('active'))
    el.classList.add('active')
    state.filter = id
  })
  return el
}

// ── Clock ─────────────────────────────────────────────────────
function updateClock() {
  const n = new Date(), p = x => String(x).padStart(2,'0')
  document.getElementById('utc-clock').textContent =
    `${p(n.getUTCHours())}:${p(n.getUTCMinutes())}:${p(n.getUTCSeconds())}`
}
setInterval(updateClock, 1000)
updateClock()

// ── Attack detail card ────────────────────────────────────────
function showCard(atk) {
  document.getElementById('ac-dot').style.background    = atk.color
  document.getElementById('ac-type').textContent        = atk.label
  document.getElementById('ac-type').style.color        = atk.color
  document.getElementById('ac-sev').textContent         = atk.severity
  document.getElementById('ac-sev').className           = `ac-sev sev-${atk.severity}`
  document.getElementById('ac-src-flag').textContent    = atk.src.flag
  document.getElementById('ac-src-country').textContent = atk.src.name
  document.getElementById('ac-src-ip').textContent      = atk.src.ip
  document.getElementById('ac-tgt-flag').textContent    = atk.tgt.flag
  document.getElementById('ac-tgt-country').textContent = atk.tgt.name
  document.getElementById('ac-tgt-ip').textContent      = atk.tgt.ip
  document.getElementById('ac-meta').textContent =
    `Port ${atk.port}  ·  ${atk.source === 'otx' ? '● Verified threat (OTX)' : 'Simulated event'}`
  document.getElementById('attack-card').classList.remove('hidden')
}

window.closeCard = () => document.getElementById('attack-card').classList.add('hidden')

// ── Sim loop ──────────────────────────────────────────────────
function runSimLoop() {
  const atk = simulate()
  if (atk) addAttack(atk)
  setTimeout(runSimLoop, ri(CONFIG.SIM_MIN_MS, CONFIG.SIM_MAX_MS))
}

// ── Seed initial attacks on load ──────────────────────────────
function seedInitial() {
  for (let i = 0; i < 20; i++) {
    const atk = simulate()
    if (!atk) continue
    state.attacks.push(atk)
    state.srcTally[atk.src.code] = (state.srcTally[atk.src.code] || 0) + 1
    state.tgtTally[atk.tgt.code] = (state.tgtTally[atk.tgt.code] || 0) + 1
    state.typeTally[atk.type]    = (state.typeTally[atk.type]    || 0) + 1
    addFeedRow(atk)
  }
  updateCounters()
}

// ── Boot ──────────────────────────────────────────────────────
window.addEventListener('load', () => {
  initMap()
  buildTypeStats()
  buildFilterChips()
  seedInitial()

  setTimeout(() => {
    state.attacks.forEach(atk => drawArc(atk))
    runSimLoop()

    if (CONFIG.OTX_KEY && CONFIG.OTX_KEY !== 'YOUR_OTX_API_KEY_HERE') {
      pollOTX()
      setInterval(pollOTX, CONFIG.OTX_INTERVAL)
    }
  }, 700)
})
