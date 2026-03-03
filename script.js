const GEO = [
  { code:'CN', name:'China',         lat:35.86, lng:104.19, flag:'🇨🇳' },
  { code:'RU', name:'Russia',        lat:61.52, lng:105.31, flag:'🇷🇺' },
  { code:'US', name:'United States', lat:37.09, lng:-95.71, flag:'🇺🇸' },
  { code:'IN', name:'India',         lat:20.59, lng:78.96,  flag:'🇮🇳' },
  { code:'BR', name:'Brazil',        lat:-14.2, lng:-51.9,  flag:'🇧🇷' },
  { code:'DE', name:'Germany',       lat:51.16, lng:10.45,  flag:'🇩🇪' },
  { code:'NL', name:'Netherlands',   lat:52.13, lng:5.29,   flag:'🇳🇱' },
  { code:'KP', name:'North Korea',   lat:40.33, lng:127.51, flag:'🇰🇵' },
  { code:'IR', name:'Iran',          lat:32.42, lng:53.68,  flag:'🇮🇷' },
  { code:'UA', name:'Ukraine',       lat:48.37, lng:31.16,  flag:'🇺🇦' },
  { code:'RO', name:'Romania',       lat:45.94, lng:24.96,  flag:'🇷🇴' },
  { code:'TR', name:'Turkey',        lat:38.96, lng:35.24,  flag:'🇹🇷' },
  { code:'VN', name:'Vietnam',       lat:14.05, lng:108.27, flag:'🇻🇳' },
  { code:'NG', name:'Nigeria',       lat:9.08,  lng:8.67,   flag:'🇳🇬' },
  { code:'PK', name:'Pakistan',      lat:30.37, lng:69.34,  flag:'🇵🇰' },
  { code:'GB', name:'United Kingdom',lat:55.37, lng:-3.43,  flag:'🇬🇧' },
  { code:'FR', name:'France',        lat:46.22, lng:2.21,   flag:'🇫🇷' },
  { code:'JP', name:'Japan',         lat:36.20, lng:138.25, flag:'🇯🇵' },
  { code:'AU', name:'Australia',     lat:-25.2, lng:133.77, flag:'🇦🇺' },
  { code:'CA', name:'Canada',        lat:56.13, lng:-106.3, flag:'🇨🇦' },
  { code:'SG', name:'Singapore',     lat:1.35,  lng:103.81, flag:'🇸🇬' },
  { code:'KR', name:'South Korea',   lat:35.90, lng:127.76, flag:'🇰🇷' },
  { code:'IL', name:'Israel',        lat:31.04, lng:34.85,  flag:'🇮🇱' },
  { code:'SE', name:'Sweden',        lat:60.12, lng:18.64,  flag:'🇸🇪' },
  { code:'PL', name:'Poland',        lat:51.91, lng:19.14,  flag:'🇵🇱' },
  { code:'TW', name:'Taiwan',        lat:23.69, lng:120.96, flag:'🇹🇼' },
  { code:'SA', name:'Saudi Arabia',  lat:23.88, lng:45.07,  flag:'🇸🇦' },
  { code:'AE', name:'UAE',           lat:23.42, lng:53.84,  flag:'🇦🇪' },
  { code:'IT', name:'Italy',         lat:41.87, lng:12.56,  flag:'🇮🇹' },
  { code:'ES', name:'Spain',         lat:40.46, lng:-3.74,  flag:'🇪🇸' },
  { code:'MX', name:'Mexico',        lat:23.63, lng:-102.5, flag:'🇲🇽' },
  { code:'HK', name:'Hong Kong',     lat:22.31, lng:114.16, flag:'🇭🇰' },
  { code:'ZA', name:'South Africa',  lat:-30.5, lng:22.93,  flag:'🇿🇦' },
  { code:'ID', name:'Indonesia',     lat:-0.78, lng:113.92, flag:'🇮🇩' },
  { code:'EG', name:'Egypt',         lat:26.82, lng:30.80,  flag:'🇪🇬' },
  { code:'AR', name:'Argentina',     lat:-38.4, lng:-63.6,  flag:'🇦🇷' },
  { code:'BE', name:'Belgium',       lat:50.50, lng:4.46,   flag:'🇧🇪' },
  { code:'CH', name:'Switzerland',   lat:46.81, lng:8.22,   flag:'🇨🇭' },
  { code:'CZ', name:'Czech Rep.',    lat:49.81, lng:15.47,  flag:'🇨🇿' },
  { code:'TH', name:'Thailand',      lat:15.87, lng:100.99, flag:'🇹🇭' },
]

const SRC_WEIGHTS = {CN:24,RU:20,US:10,KP:8,IR:6,UA:5,NL:4,RO:4,IN:3,BR:3,TR:2,VN:2,NG:2,HK:2,ID:1,DE:1,PK:1,TH:1,AR:1,MX:1}
const TGT_WEIGHTS = {US:28,GB:11,DE:8,JP:7,FR:6,CA:5,AU:5,KR:4,SG:3,IL:3,TW:3,CH:2,SE:2,NL:2,SA:2,AE:2,IT:2,IN:2,BR:2,PL:1}

const ATTACK_TYPES = [
  { id:'ddos',       label:'DDoS',        color:'#ff1e2d', severity:'critical', weight:18, ports:[80,443,53,123] },
  { id:'ransomware', label:'Ransomware',  color:'#ff4500', severity:'critical', weight:5,  ports:[445,3389,139] },
  { id:'malware',    label:'Malware C2',  color:'#cc00ff', severity:'critical', weight:8,  ports:[4444,8888,1337,6667] },
  { id:'zeroday',    label:'Zero-Day',    color:'#ffffff', severity:'critical', weight:2,  ports:[80,443,8443] },
  { id:'bruteforce', label:'Brute Force', color:'#ffaa00', severity:'high',     weight:15, ports:[22,3389,21,5900] },
  { id:'sqli',       label:'SQL Inject',  color:'#aa44ff', severity:'high',     weight:12, ports:[80,443,8080] },
  { id:'phishing',   label:'Phishing',    color:'#ff6600', severity:'medium',   weight:10, ports:[80,443,25] },
  { id:'portscan',   label:'Port Scan',   color:'#00ccff', severity:'low',      weight:20, ports:[22,80,443,3389,8080] },
  { id:'xss',        label:'XSS',         color:'#4488ff', severity:'medium',   weight:7,  ports:[80,443,8080] },
  { id:'mitm',       label:'MITM',        color:'#00ff99', severity:'high',     weight:3,  ports:[80,443,8080] },
]

const SEV_COLOR = { critical:'#ff1e2d', high:'#ff6600', medium:'#ffaa00', low:'#00ff88' }

const IP_POOLS = {
  CN:['180.76','223.71','101.89','42.56','116.31'],
  RU:['5.255','77.88','91.108','185.29','37.230'],
  US:['104.16','172.217','54.239','13.32','23.227'],
  KP:['175.45','210.52','77.194','45.33','89.187'],
  IR:['5.200','185.94','91.132','62.220','94.182'],
  UA:['91.202','194.44','178.150','195.56','31.128'],
  NL:['185.220','194.165','45.153','89.249','5.79'],
  RO:['89.32','79.115','195.88','93.119','82.77'],
  _:['45.33','162.241','104.244','198.199','159.89'],
}

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

function fakeIP(code) {
  const pool = IP_POOLS[code] || IP_POOLS._
  const prefix = pool[Math.floor(Math.random() * pool.length)]
  return `${prefix}.${ri(1,253)}.${ri(1,253)}`
}

function ri(a, b) { return Math.floor(Math.random() * (b-a+1)) + a }
function jitter()  { return (Math.random() - 0.5) * 2.5 }
function byCode(c) { return GEO.find(g => g.code === c) }

let totalCount = ri(160000, 220000)
let sessionAttacks = 0
const perMinHistory = []

function generate() {
  const srcCode = weighted(SRC_WEIGHTS)
  let tgtCode
  do { tgtCode = weighted(TGT_WEIGHTS) } while (tgtCode === srcCode)

  const src = byCode(srcCode)
  const tgt = byCode(tgtCode)
  if (!src || !tgt) return null

  const type = pickType()
  totalCount++
  sessionAttacks++

  return {
    id:       `${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
    ts:       Date.now(),
    src:      { ...src, lat: src.lat + jitter(), lng: src.lng + jitter(), ip: fakeIP(srcCode) },
    tgt:      { ...tgt, lat: tgt.lat + jitter(), lng: tgt.lng + jitter(), ip: fakeIP(tgtCode) },
    type:     type.id,
    label:    type.label,
    color:    type.color,
    severity: type.severity,
    port:     type.ports[Math.floor(Math.random() * type.ports.length)],
  }
}

// ─── State ─────────────────────────────────────────────
const state = {
  attacks:     [],
  arcs:        [],
  rings:       [],
  srcTally:    {},
  tgtTally:    {},
  typeTally:   {},
  globe:       null,
}

ATTACK_TYPES.forEach(t => { state.typeTally[t.id] = 0 })

// ─── Globe setup ────────────────────────────────────────
function initGlobe() {
  const container = document.getElementById('globe-container')
  const globe = Globe()(container)

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
    .arcStroke(0.6)
    .arcDashLength(0.35)
    .arcDashGap(0.18)
    .arcDashAnimateTime(1700)
    .arcLabel(d => `<div style="font-family:Share Tech Mono,monospace;font-size:12px;padding:6px 10px;background:rgba(2,10,18,0.92);border:1px solid rgba(0,229,255,0.25);color:#00e5ff">${d.label}</div>`)
    .ringsData([])
    .ringColor(() => t => `rgba(255,30,45,${(1-t)*0.9})`)
    .ringMaxRadius('maxR')
    .ringPropagationSpeed('speed')
    .ringRepeatPeriod('period')
    .pointsData([])
    .pointColor('color')
    .pointAltitude(0.012)
    .pointRadius('radius')

  const controls = globe.controls()
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.38
  controls.enableZoom = true
  controls.minDistance = 160
  controls.maxDistance = 650
  controls.enablePan = false

  globe.pointOfView({ altitude: 1.9 }, 0)

  state.globe = globe

  window.addEventListener('resize', () => {
    globe.width(window.innerWidth).height(window.innerHeight)
  })
}

// ─── Add a new attack ───────────────────────────────────
function addAttack(atk) {
  state.attacks.unshift(atk)
  if (state.attacks.length > 100) state.attacks.pop()

  state.srcTally[atk.src.code] = (state.srcTally[atk.src.code] || 0) + 1
  state.tgtTally[atk.tgt.code] = (state.tgtTally[atk.tgt.code] || 0) + 1
  state.typeTally[atk.type] = (state.typeTally[atk.type] || 0) + 1

  state.arcs.unshift({
    startLat: atk.src.lat, startLng: atk.src.lng,
    endLat:   atk.tgt.lat, endLng:   atk.tgt.lng,
    color:    [atk.color, `${atk.color}33`],
    label:    `${atk.label} · ${atk.src.name} → ${atk.tgt.name}`,
  })
  if (state.arcs.length > 55) state.arcs.pop()

  state.rings.unshift({
    lat:    atk.tgt.lat,
    lng:    atk.tgt.lng,
    maxR:   atk.severity === 'critical' ? 5 : atk.severity === 'high' ? 3.5 : 2,
    speed:  atk.severity === 'critical' ? 5 : 3,
    period: atk.severity === 'critical' ? 550 : 1000,
  })
  if (state.rings.length > 18) state.rings.pop()

  updateGlobe()
  updateFeed(atk)
  updateCounters()
}

function updateGlobe() {
  if (!state.globe) return

  const dots = []
  const seenSrc = new Set(), seenTgt = new Set()
  state.attacks.slice(0, 40).forEach(a => {
    if (!seenSrc.has(a.src.code)) {
      seenSrc.add(a.src.code)
      dots.push({ lat: a.src.lat, lng: a.src.lng, color: a.color, radius: 0.35 })
    }
    if (!seenTgt.has(a.tgt.code)) {
      seenTgt.add(a.tgt.code)
      dots.push({ lat: a.tgt.lat, lng: a.tgt.lng, color: '#00e5ff', radius: 0.45 })
    }
  })

  state.globe
    .arcsData([...state.arcs])
    .ringsData([...state.rings])
    .pointsData(dots)
}

// ─── Feed panel ─────────────────────────────────────────
function updateFeed(atk) {
  const feed = document.getElementById('attack-feed')
  const sevColor = SEV_COLOR[atk.severity]

  const row = document.createElement('div')
  row.className = 'feed-row'
  row.innerHTML = `
    <div class="feed-top">
      <div style="display:flex;align-items:center;gap:6px">
        <span class="feed-type-dot" style="background:${atk.color};box-shadow:0 0 5px ${atk.color}"></span>
        <span class="feed-type-label" style="color:${atk.color}">${atk.label}</span>
        <span class="sev-badge" style="color:${sevColor};border:1px solid ${sevColor}28;background:${sevColor}12">${atk.severity.toUpperCase()}</span>
      </div>
      <span class="feed-time">just now</span>
    </div>
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

  while (feed.children.length > 60) feed.lastChild.remove()

  document.getElementById('feed-count').textContent = feed.children.length

  tickTimestamps()
}

const tsMap = new WeakMap()

function tickTimestamps() {
  document.querySelectorAll('.feed-row').forEach((row, i) => {
    const timeEl = row.querySelector('.feed-time')
    if (!timeEl) return
    if (!tsMap.has(row)) tsMap.set(row, Date.now() - i * 800)
    const s = Math.floor((Date.now() - tsMap.get(row)) / 1000)
    timeEl.textContent = s < 5 ? 'just now' : s < 60 ? `${s}s ago` : `${Math.floor(s/60)}m ago`
  })
}

setInterval(tickTimestamps, 4000)

// ─── Stats panels ────────────────────────────────────────
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
  const el = document.getElementById(elId)
  const entries = Object.entries(tally).sort((a,b) => b[1]-a[1]).slice(0,5)
  if (!entries.length) return

  const max = entries[0][1]
  el.innerHTML = entries.map(([code, count], i) => {
    const country = GEO.find(g => g.code === code)
    if (!country) return ''
    const pct = Math.round((count / max) * 100)
    return `
      <div class="rank-item">
        <span class="rank-num">${i+1}</span>
        <span class="rank-flag">${country.flag}</span>
        <div class="rank-info">
          <div class="rank-name">${country.name}</div>
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
  const el = document.getElementById('type-breakdown')
  const total = Object.values(state.typeTally).reduce((a,b) => a+b, 0)
  if (!total) return

  const sorted = [...ATTACK_TYPES].sort((a,b) => (state.typeTally[b.id]||0) - (state.typeTally[a.id]||0))
  el.innerHTML = sorted.slice(0, 7).map(type => {
    const count = state.typeTally[type.id] || 0
    const pct = total ? Math.round((count/total)*100) : 0
    return `
      <div class="type-item">
        <span class="type-dot" style="background:${type.color}"></span>
        <span class="type-name">${type.label}</span>
        <span class="type-pct" style="color:${count > 0 ? type.color : 'var(--muted)'}">${pct}%</span>
      </div>
    `
  }).join('')
}

function buildTypeCounters() {
  const el = document.getElementById('type-counters')
  el.innerHTML = ATTACK_TYPES.map(type => `
    <div class="type-counter-item" id="tc-${type.id}">
      <div class="tc-label">
        <span class="tc-dot" style="background:${type.color}"></span>
        <span class="tc-name">${type.label}</span>
      </div>
      <div class="tc-count orbitron" id="tc-val-${type.id}" style="color:${type.color};opacity:0.25">0</div>
    </div>
  `).join('')
}

function updateTypeCounters() {
  ATTACK_TYPES.forEach(type => {
    const el = document.getElementById(`tc-val-${type.id}`)
    if (!el) return
    const count = state.typeTally[type.id] || 0
    el.textContent = count
    el.style.opacity = count > 0 ? '1' : '0.25'
    if (count > 0) {
      el.classList.add('active')
      el.style.textShadow = `0 0 8px ${type.color}`
    }
  })
}

// ─── Clock ────────────────────────────────────────────────
function updateClock() {
  const n = new Date()
  const p = x => String(x).padStart(2,'0')
  document.getElementById('utc-clock').textContent =
    `${p(n.getUTCHours())}:${p(n.getUTCMinutes())}:${p(n.getUTCSeconds())} UTC`
}
setInterval(updateClock, 1000)
updateClock()

// ─── Main simulation loop ────────────────────────────────
function runLoop() {
  const atk = generate()
  if (atk) addAttack(atk)

  const delay = ri(600, 2200)
  setTimeout(runLoop, delay)
}

// ─── Burst on load (seed) ────────────────────────────────
function seedInitial() {
  for (let i = 0; i < 18; i++) {
    const atk = generate()
    if (!atk) continue
    state.attacks.push(atk)
    state.srcTally[atk.src.code] = (state.srcTally[atk.src.code] || 0) + 1
    state.tgtTally[atk.tgt.code] = (state.tgtTally[atk.tgt.code] || 0) + 1
    state.typeTally[atk.type] = (state.typeTally[atk.type] || 0) + 1
    state.arcs.push({
      startLat: atk.src.lat, startLng: atk.src.lng,
      endLat:   atk.tgt.lat, endLng:   atk.tgt.lng,
      color:    [atk.color, `${atk.color}33`],
      label:    `${atk.label} · ${atk.src.name} → ${atk.tgt.name}`,
    })
    state.rings.push({
      lat:    atk.tgt.lat, lng: atk.tgt.lng,
      maxR:   atk.severity === 'critical' ? 5 : 2.5,
      speed:  atk.severity === 'critical' ? 5 : 3,
      period: atk.severity === 'critical' ? 550 : 1000,
    })
  }

  state.attacks.slice(0, 18).forEach(atk => {
    updateFeed(atk)
  })

  updateCounters()
}

// ─── Boot ─────────────────────────────────────────────────
window.addEventListener('load', () => {
  buildTypeCounters()
  initGlobe()
  seedInitial()
  setTimeout(() => {
    updateGlobe()
    runLoop()
  }, 800)
})
