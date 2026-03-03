// ─────────────────────────────────────────────────────────────
//  LIVE-HACK · script.js
//  Real threat data: AlienVault OTX (free) + ip-api.com (free)
//
//  Get your FREE OTX key → https://otx.alienvault.com/
//  Sign up (free) → click your avatar → Settings → API Key
//  Paste it below in CONFIG.OTX_KEY
// ─────────────────────────────────────────────────────────────

const CONFIG = {
  OTX_KEY:            'YOUR_OTX_API_KEY_HERE',
  OTX_FETCH_INTERVAL: 30000,
  SIM_MIN_MS:         800,
  SIM_MAX_MS:         2400,
  MAX_ARCS:           55,
  MAX_RINGS:          18,
  MAX_FEED:           60,
}

// ─── Country database ─────────────────────────────────────────
const GEO = [
  { code:'CN', name:'China',          lat:35.86,  lng:104.19,  flag:'🇨🇳' },
  { code:'RU', name:'Russia',         lat:61.52,  lng:105.31,  flag:'🇷🇺' },
  { code:'US', name:'United States',  lat:37.09,  lng:-95.71,  flag:'🇺🇸' },
  { code:'IN', name:'India',          lat:20.59,  lng:78.96,   flag:'🇮🇳' },
  { code:'BR', name:'Brazil',         lat:-14.23, lng:-51.92,  flag:'🇧🇷' },
  { code:'DE', name:'Germany',        lat:51.16,  lng:10.45,   flag:'🇩🇪' },
  { code:'NL', name:'Netherlands',    lat:52.13,  lng:5.29,    flag:'🇳🇱' },
  { code:'KP', name:'North Korea',    lat:40.33,  lng:127.51,  flag:'🇰🇵' },
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
  { code:'CZ', name:'Czech Rep.',     lat:49.81,  lng:15.47,   flag:'🇨🇿' },
  { code:'TH', name:'Thailand',       lat:15.87,  lng:100.99,  flag:'🇹🇭' },
]

const ATTACK_TYPES = [
  { id:'ddos',       label:'DDoS',        color:'#ff1e2d', severity:'critical', weight:18, ports:[80,443,53,123] },
  { id:'ransomware', label:'Ransomware',  color:'#ff4500', severity:'critical', weight:5,  ports:[445,3389,139] },
  { id:'malware',    label:'Malware C2',  color:'#cc00ff', severity:'critical', weight:8,  ports:[4444,8888,1337,6667] },
  { id:'zeroday',    label:'Zero-Day',    color:'#ffffff', severity:'critical', weight:2,  ports:[80,443,8443] },
  { id:'bruteforce', label:'Brute Force', color:'#ffaa00', severity:'high',     weight:15, ports:[22,3389,21,5900] },
  { id:'sqli',       label:'SQL Inject',  color:'#aa44ff', severity:'high',     weight:12, ports:[80,443,8080] },
  { id:'phishing',   label:'Phishing',    color:'#ff6600', severity:'medium',   weight:10, ports:[80,443,25] },
  { id:'portscan',   label:'Port Scan',   color:'#00ccff', severity:'low',      weight:20, ports:[22,80,443,3389] },
  { id:'xss',        label:'XSS',         color:'#4488ff', severity:'medium',   weight:7,  ports:[80,443,8080] },
  { id:'mitm',       label:'MITM',        color:'#00ff99', severity:'high',     weight:3,  ports:[80,443] },
]

// Map keywords from OTX pulse tags to our attack type IDs
const OTX_TYPE_MAP = {
  ddos:'ddos', dos:'ddos', flood:'ddos',
  ransomware:'ransomware', ransom:'ransomware', locker:'ransomware',
  rat:'malware', trojan:'malware', backdoor:'malware', botnet:'malware',
  'c2':'malware', 'c&c':'malware', stealer:'malware',
  exploit:'zeroday', cve:'zeroday', '0day':'zeroday', 'zero-day':'zeroday',
  bruteforce:'bruteforce', brute:'bruteforce', credential:'bruteforce', 'password spray':'bruteforce',
  sqli:'sqli', 'sql injection':'sqli', injection:'sqli',
  phishing:'phishing', spam:'phishing', spear:'phishing',
  scanner:'portscan', scan:'portscan', recon:'portscan', masscan:'portscan',
  xss:'xss', 'cross-site':'xss',
  mitm:'mitm', intercept:'mitm',
}

const SEV_COLOR = { critical:'#ff1e2d', high:'#ff6600', medium:'#ffaa00', low:'#00ff88' }

// ─── Weighted random helper ───────────────────────────────────
function weighted(map) {
  const keys = Object.keys(map), vals = Object.values(map)
  const total = vals.reduce((a,b) => a+b, 0)
  let r = Math.random() * total
  for (let i = 0; i < keys.length; i++) {
    r -= vals[i]
    if (r <= 0) return keys[i]
  }
  return keys[keys.length-1]
}

function pickType() {
  const total = ATTACK_TYPES.reduce((a,t) => a+t.weight, 0)
  let r = Math.random() * total
  for (const t of ATTACK_TYPES) { r -= t.weight; if (r <= 0) return t }
  return ATTACK_TYPES[0]
}

function ri(a,b)   { return Math.floor(Math.random()*(b-a+1))+a }
function jitter()  { return (Math.random()-0.5)*2.5 }
function byCode(c) { return GEO.find(g => g.code === c) }
function randGeo() { return GEO[Math.floor(Math.random()*GEO.length)] }

const SRC_WEIGHTS = {CN:24,RU:20,US:10,KP:8,IR:6,UA:5,NL:4,RO:4,IN:3,BR:3,TR:2,VN:2,NG:2,HK:2,ID:1,DE:1,PK:1,TH:1,AR:1,MX:1}
const TGT_WEIGHTS = {US:28,GB:11,DE:8,JP:7,FR:6,CA:5,AU:5,KR:4,SG:3,IL:3,TW:3,CH:2,SE:2,NL:2,SA:2,AE:2,IT:2,IN:2,BR:2,PL:1}
const IP_POOLS    = {
  CN:['180.76','223.71','101.89','42.56'],
  RU:['5.255','77.88','91.108','185.29'],
  US:['104.16','172.217','54.239','13.32'],
  KP:['175.45','210.52','77.194','45.33'],
  IR:['5.200','185.94','91.132','62.220'],
  UA:['91.202','194.44','178.150','195.56'],
  NL:['185.220','194.165','45.153','89.249'],
  _:['45.33','162.241','104.244','198.199'],
}

function fakeIP(code) {
  const pool = IP_POOLS[code] || IP_POOLS._
  return `${pool[Math.floor(Math.random()*pool.length)]}.${ri(1,253)}.${ri(1,253)}`
}

let totalCount = ri(160000, 220000)
const perMinHistory = []

// ─── Simulation fallback ──────────────────────────────────────
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
    src:      { ...src, lat:src.lat+jitter(), lng:src.lng+jitter(), ip:fakeIP(srcCode) },
    tgt:      { ...tgt, lat:tgt.lat+jitter(), lng:tgt.lng+jitter(), ip:fakeIP(tgtCode) },
    type:     type.id,
    label:    type.label,
    color:    type.color,
    severity: type.severity,
    port:     type.ports[Math.floor(Math.random()*type.ports.length)],
  }
}

// ─────────────────────────────────────────────────────────────
//  REAL API INTEGRATION
//
//  1. AlienVault OTX — free account, real malicious IPs
//     https://otx.alienvault.com/
//
//  2. ip-api.com — geolocates the real IPs (no key needed)
//     https://ip-api.com/
// ─────────────────────────────────────────────────────────────

const otxSeen   = new Set()
const geoCache  = {}

async function fetchOTXActivity() {
  const res = await fetch(
    'https://otx.alienvault.com/api/v1/pulses/activity?limit=15',
    { headers: { 'X-OTX-API-KEY': CONFIG.OTX_KEY } }
  )
  if (!res.ok) throw new Error(`OTX ${res.status}`)
  const data = await res.json()
  return data.results || []
}

async function geolocateIPs(ips) {
  const fresh = ips.filter(ip => !geoCache[ip]).slice(0, 50)
  if (!fresh.length) return

  try {
    const res = await fetch(
      'https://ip-api.com/batch?fields=status,country,countryCode,lat,lon,query',
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(fresh.map(q => ({ query: q }))),
      }
    )
    if (!res.ok) return
    const rows = await res.json()
    rows.forEach(r => {
      if (r.status === 'success') {
        geoCache[r.query] = { code: r.countryCode, name: r.country, lat: r.lat, lng: r.lon }
      }
    })
  } catch {}
}

function typeFromPulse(pulse) {
  const haystack = [
    pulse.name || '',
    pulse.description || '',
    ...(pulse.tags || []),
    ...(pulse.malware_families || []),
  ].join(' ').toLowerCase()

  for (const [kw, typeId] of Object.entries(OTX_TYPE_MAP)) {
    if (haystack.includes(kw)) {
      return ATTACK_TYPES.find(t => t.id === typeId) || pickType()
    }
  }
  return pickType()
}

async function pulseToAttacks(pulse) {
  const indicators = (pulse.indicators || [])
    .filter(i => i.type === 'IPv4' && !otxSeen.has(i.indicator))
    .slice(0, 5)

  if (!indicators.length) return []

  const ips = indicators.map(i => i.indicator)
  await geolocateIPs(ips)

  const type = typeFromPulse(pulse)

  return indicators.map(ind => {
    otxSeen.add(ind.indicator)

    const geo     = geoCache[ind.indicator]
    const matched = geo ? byCode(geo.code) : null

    const src = geo ? {
      code: geo.code,
      name: geo.name || geo.code,
      lat:  geo.lat + jitter(),
      lng:  geo.lng + jitter(),
      ip:   ind.indicator,
      flag: matched?.flag || '🌐',
    } : (() => { const f = randGeo(); return { ...f, lat:f.lat+jitter(), lng:f.lng+jitter(), ip:ind.indicator } })()

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
      tgt:      { ...tgt, lat:tgt.lat+jitter(), lng:tgt.lng+jitter(), ip:fakeIP(tgtCode) },
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
    setStatus('Fetching OTX threat feed...')
    const pulses = await fetchOTXActivity()
    let count = 0

    for (const pulse of pulses) {
      const attacks = await pulseToAttacks(pulse)
      for (const atk of attacks) {
        addAttack(atk)
        count++
        await new Promise(r => setTimeout(r, 500))
      }
    }

    if (count > 0) setStatus(`OTX: ${count} real indicators loaded`)
    else           setStatus('OTX: no new indicators')

    updateDataSource('otx')
  } catch (err) {
    setStatus('OTX unavailable — using simulation')
    console.warn('OTX fetch failed:', err.message)
  }
}

// ─── Status toast ─────────────────────────────────────────────
function setStatus(msg) {
  const el = document.getElementById('status-toast')
  if (!el) return
  el.textContent = msg
  el.style.opacity = '1'
  clearTimeout(el._timer)
  el._timer = setTimeout(() => { el.style.opacity = '0' }, 4000)
}

function updateDataSource(src) {
  const el = document.getElementById('data-source-badge')
  if (!el) return
  if (src === 'otx') {
    el.textContent = '⬡ OTX LIVE'
    el.style.color        = '#00ff88'
    el.style.borderColor  = '#00ff8830'
    el.style.background   = '#00ff8808'
  }
}

// ─── State ────────────────────────────────────────────────────
const state = {
  attacks:  [],
  arcs:     [],
  rings:    [],
  srcTally: {},
  tgtTally: {},
  typeTally:{},
  globe:    null,
}

ATTACK_TYPES.forEach(t => { state.typeTally[t.id] = 0 })

// ─── Core: add an attack event ────────────────────────────────
function addAttack(atk) {
  state.attacks.unshift(atk)
  if (state.attacks.length > 100) state.attacks.pop()

  state.srcTally[atk.src.code] = (state.srcTally[atk.src.code] || 0) + 1
  state.tgtTally[atk.tgt.code] = (state.tgtTally[atk.tgt.code] || 0) + 1
  state.typeTally[atk.type]    = (state.typeTally[atk.type]    || 0) + 1

  state.arcs.unshift({
    startLat: atk.src.lat, startLng: atk.src.lng,
    endLat:   atk.tgt.lat, endLng:   atk.tgt.lng,
    color:    [atk.color, `${atk.color}33`],
    label:    `${atk.label} · ${atk.src.name} → ${atk.tgt.name}`,
    isReal:   atk.source === 'otx',
  })
  if (state.arcs.length > CONFIG.MAX_ARCS) state.arcs.pop()

  state.rings.unshift({
    lat:    atk.tgt.lat, lng: atk.tgt.lng,
    maxR:   atk.severity === 'critical' ? 5 : atk.severity === 'high' ? 3.5 : 2,
    speed:  atk.severity === 'critical' ? 5 : 3,
    period: atk.severity === 'critical' ? 550 : 1000,
  })
  if (state.rings.length > CONFIG.MAX_RINGS) state.rings.pop()

  updateGlobe()
  updateFeed(atk)
  updateCounters()
}

// ─── Globe init ───────────────────────────────────────────────
function initGlobe() {
  const globe = Globe()(document.getElementById('globe-container'))

  globe
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
    .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundColor('rgba(0,0,0,0)')
    .atmosphereColor('#0088cc')
    .atmosphereAltitude(0.18)
    .width(window.innerWidth)
    .height(window.innerHeight)
    .arcsData([])
    .arcColor('color')
    .arcAltitude(0.28)
    .arcStroke(d => d.isReal ? 0.95 : 0.55)
    .arcDashLength(0.35)
    .arcDashGap(0.18)
    .arcDashAnimateTime(1700)
    .arcLabel(d => `
      <div style="font-family:Share Tech Mono,monospace;font-size:12px;padding:6px 10px;
                  background:rgba(2,10,18,0.93);border:1px solid rgba(0,229,255,0.25);color:#00e5ff">
        ${d.label}
        ${d.isReal ? '<span style="color:#00ff88;margin-left:6px">● REAL</span>' : ''}
      </div>
    `)
    .ringsData([])
    .ringColor(() => t => `rgba(255,30,45,${(1-t)*0.9})`)
    .ringMaxRadius('maxR')
    .ringPropagationSpeed('speed')
    .ringRepeatPeriod('period')
    .pointsData([])
    .pointColor('color')
    .pointAltitude(0.012)
    .pointRadius('radius')

  const ctrl = globe.controls()
  ctrl.autoRotate      = true
  ctrl.autoRotateSpeed = 0.38
  ctrl.enableZoom      = true
  ctrl.minDistance     = 160
  ctrl.maxDistance     = 650
  ctrl.enablePan       = false

  globe.pointOfView({ altitude: 1.9 }, 0)
  state.globe = globe

  window.addEventListener('resize', () => {
    globe.width(window.innerWidth).height(window.innerHeight)
  })
}

function updateGlobe() {
  if (!state.globe) return
  const seenS = new Set(), seenT = new Set(), dots = []
  state.attacks.slice(0, 40).forEach(a => {
    if (!seenS.has(a.src.code)) {
      seenS.add(a.src.code)
      dots.push({ lat:a.src.lat, lng:a.src.lng, color:a.color, radius: a.source === 'otx' ? 0.55 : 0.32 })
    }
    if (!seenT.has(a.tgt.code)) {
      seenT.add(a.tgt.code)
      dots.push({ lat:a.tgt.lat, lng:a.tgt.lng, color:'#00e5ff', radius:0.42 })
    }
  })
  state.globe.arcsData([...state.arcs]).ringsData([...state.rings]).pointsData(dots)
}

// ─── Feed panel ───────────────────────────────────────────────
const tsMap = new WeakMap()

function updateFeed(atk) {
  const feed     = document.getElementById('attack-feed')
  const sevColor = SEV_COLOR[atk.severity]
  const isReal   = atk.source === 'otx'

  const row = document.createElement('div')
  row.className = 'feed-row'
  if (isReal) row.style.cssText += ';border-left:2px solid #00ff88'

  row.innerHTML = `
    <div class="feed-top">
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
        <span class="feed-type-dot" style="background:${atk.color};box-shadow:0 0 5px ${atk.color}"></span>
        <span class="feed-type-label" style="color:${atk.color}">${atk.label}</span>
        <span class="sev-badge" style="color:${sevColor};border:1px solid ${sevColor}28;background:${sevColor}12">
          ${atk.severity.toUpperCase()}
        </span>
        ${isReal ? '<span class="sev-badge" style="color:#00ff88;border:1px solid #00ff8822;background:#00ff8810;font-size:7px">● LIVE</span>' : ''}
      </div>
      <span class="feed-time">just now</span>
    </div>
    ${atk.pulse ? `<div class="mono" style="font-size:7px;color:rgba(0,255,136,0.4);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">⬡ ${atk.pulse}</div>` : ''}
    <div class="feed-route">
      <div class="feed-side">
        <div style="display:flex;align-items:center;gap:3px">
          <span style="font-size:11px">${atk.src.flag}</span>
          <span class="feed-ip">${atk.src.ip}</span>
        </div>
        <span class="feed-country">${atk.src.name}</span>
      </div>
      <div class="feed-arrow">
        <svg width="22" height="9" viewBox="0 0 22 9" fill="none">
          <path d="M1 4.5H18M14 1.5L18 4.5L14 7.5" stroke="${atk.color}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="feed-port">:${atk.port}</span>
      </div>
      <div class="feed-side right">
        <div style="display:flex;align-items:center;gap:3px;justify-content:flex-end">
          <span class="feed-ip">${atk.tgt.ip}</span>
          <span style="font-size:11px">${atk.tgt.flag}</span>
        </div>
        <span class="feed-country">${atk.tgt.name}</span>
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
    const el = row.querySelector('.feed-time')
    if (!el) return
    if (!tsMap.has(row)) tsMap.set(row, Date.now() - i * 700)
    const s = Math.floor((Date.now() - tsMap.get(row)) / 1000)
    el.textContent = s < 5 ? 'just now' : s < 60 ? `${s}s ago` : `${Math.floor(s/60)}m ago`
  })
}

setInterval(tickTimestamps, 4000)

// ─── Counters & rankings ──────────────────────────────────────
function updateCounters() {
  document.getElementById('total-counter').textContent = totalCount.toLocaleString()

  perMinHistory.push(Date.now())
  const cutoff = Date.now() - 60000
  while (perMinHistory.length && perMinHistory[0] < cutoff) perMinHistory.shift()
  document.getElementById('apm-counter').textContent = perMinHistory.length

  updateRankList('top-sources', state.srcTally, '#ff1e2d')
  updateRankList('top-targets', state.tgtTally, '#00e5ff')
  updateTypeBreakdown()
  updateTypeCounters()
}

function updateRankList(elId, tally, barColor) {
  const el      = document.getElementById(elId)
  const entries = Object.entries(tally).sort((a,b) => b[1]-a[1]).slice(0,5)
  if (!entries.length) return
  const max = entries[0][1]
  el.innerHTML = entries.map(([code, count], i) => {
    const c = GEO.find(g => g.code === code)
    if (!c) return ''
    const pct = Math.round((count/max)*100)
    return `
      <div class="rank-item">
        <span class="rank-num">${i+1}</span>
        <span class="rank-flag">${c.flag}</span>
        <div class="rank-info">
          <div class="rank-name">${c.name}</div>
          <div class="rank-bar-track">
            <div class="rank-bar-fill" style="width:${pct}%;background:${barColor};box-shadow:0 0 4px ${barColor}"></div>
          </div>
        </div>
        <span class="rank-count">${count}</span>
      </div>
    `
  }).join('')
}

function updateTypeBreakdown() {
  const el    = document.getElementById('type-breakdown')
  const total = Object.values(state.typeTally).reduce((a,b)=>a+b, 0)
  if (!total) return
  const sorted = [...ATTACK_TYPES].sort((a,b) => (state.typeTally[b.id]||0)-(state.typeTally[a.id]||0))
  el.innerHTML = sorted.slice(0,7).map(t => {
    const count = state.typeTally[t.id] || 0
    const pct   = Math.round((count/total)*100)
    return `
      <div class="type-item">
        <span class="type-dot" style="background:${t.color}"></span>
        <span class="type-name">${t.label}</span>
        <span class="type-pct" style="color:${count>0?t.color:'var(--muted)'}">${pct}%</span>
      </div>
    `
  }).join('')
}

function buildTypeCounters() {
  document.getElementById('type-counters').innerHTML = ATTACK_TYPES.map(t => `
    <div class="type-counter-item">
      <div class="tc-label">
        <span class="tc-dot" style="background:${t.color}"></span>
        <span class="tc-name">${t.label}</span>
      </div>
      <div class="tc-count orbitron" id="tc-val-${t.id}" style="color:${t.color};opacity:.25">0</div>
    </div>
  `).join('')
}

function updateTypeCounters() {
  ATTACK_TYPES.forEach(t => {
    const el = document.getElementById(`tc-val-${t.id}`)
    if (!el) return
    const n = state.typeTally[t.id] || 0
    el.textContent     = n
    el.style.opacity   = n > 0 ? '1' : '0.25'
    el.style.textShadow = n > 0 ? `0 0 8px ${t.color}` : 'none'
  })
}

// ─── Clock ────────────────────────────────────────────────────
function updateClock() {
  const n = new Date(), p = x => String(x).padStart(2,'0')
  document.getElementById('utc-clock').textContent =
    `${p(n.getUTCHours())}:${p(n.getUTCMinutes())}:${p(n.getUTCSeconds())} UTC`
}
setInterval(updateClock, 1000)
updateClock()

// ─── Simulation fill loop ─────────────────────────────────────
function runSimLoop() {
  const atk = simulate()
  if (atk) addAttack(atk)
  setTimeout(runSimLoop, ri(CONFIG.SIM_MIN_MS, CONFIG.SIM_MAX_MS))
}

// ─── Seed initial attacks ─────────────────────────────────────
function seedInitial() {
  for (let i = 0; i < 20; i++) {
    const atk = simulate()
    if (!atk) continue
    state.attacks.push(atk)
    state.srcTally[atk.src.code] = (state.srcTally[atk.src.code] || 0) + 1
    state.tgtTally[atk.tgt.code] = (state.tgtTally[atk.tgt.code] || 0) + 1
    state.typeTally[atk.type]    = (state.typeTally[atk.type]    || 0) + 1
    state.arcs.push({ startLat:atk.src.lat, startLng:atk.src.lng, endLat:atk.tgt.lat, endLng:atk.tgt.lng, color:[atk.color,`${atk.color}33`], label:`${atk.label} · ${atk.src.name} → ${atk.tgt.name}` })
    state.rings.push({ lat:atk.tgt.lat, lng:atk.tgt.lng, maxR:atk.severity==='critical'?5:2.5, speed:atk.severity==='critical'?5:3, period:atk.severity==='critical'?550:1000 })
  }
  state.attacks.slice(0,20).forEach(updateFeed)
  updateCounters()
}

// ─── Boot ─────────────────────────────────────────────────────
window.addEventListener('load', () => {
  buildTypeCounters()
  initGlobe()
  seedInitial()

  setTimeout(() => {
    updateGlobe()
    runSimLoop()

    if (CONFIG.OTX_KEY !== 'YOUR_OTX_API_KEY_HERE') {
      pollOTX()
      setInterval(pollOTX, CONFIG.OTX_FETCH_INTERVAL)
    } else {
      setStatus('Add OTX API key in script.js → CONFIG.OTX_KEY for real data')
    }
  }, 800)
})
