# Live-Hack

A real-time cyber threat intelligence dashboard that visualizes active attacks across the world on an interactive map. Attack arcs animate from the attacker's origin to the target country, updating continuously as new events come in.

Built with plain HTML, CSS, and JavaScript. No frameworks, no build step, no backend. Drop the three files in a folder and open index.html.

---

## What it does

The map shows live cyberattacks as animated arcs flying between countries. Each arc represents a real or simulated attack event, color-coded by type. A live feed on the right logs every event with the source IP, target IP, attack classification, and severity. The left sidebar ranks the top attacking and targeted countries in real time.

When an AlienVault OTX API key is configured, the dashboard pulls real threat intelligence data — actual malicious IPs reported by the global security community — and geolocates them using ip-api.com. Without a key, a weighted simulation engine keeps the map active using realistic attack patterns based on known threat actor geography.

---

## Data sources

AlienVault OTX is a free threat intelligence platform run by AT&T Cybersecurity. It aggregates indicators of compromise from security researchers worldwide. This project uses it to pull active threat pulses and extract malicious IPv4 addresses.

ip-api.com is a free IP geolocation API that requires no key. It resolves IP addresses to country and coordinates. The dashboard uses it to place real attacker IPs on the map.

---

## Getting started

Clone or download the repository, then open index.html directly in a browser. No installation required.

To enable real threat data, get a free API key from otx.alienvault.com, then open script.js and replace the placeholder at the top of the file:

    OTX_KEY: 'your-key-here',

Once set, the dashboard fetches live threat pulses every 30 seconds. Real events appear with a green indicator in the feed.

---

## Attack types tracked

DDoS, Ransomware, Malware C2, Zero-Day Exploit, Brute Force, SQL Injection, Phishing, Port Scan, XSS, Man-in-the-Middle

---

## Tech stack

- Leaflet.js for the interactive map
- CartoDB dark tile layer
- SVG overlay for animated attack arcs
- AlienVault OTX API for real threat intelligence
- ip-api.com for IP geolocation
- Vanilla JavaScript

---

## Deployment

The project is a static site and can be deployed anywhere that serves HTML files.

To deploy on Vercel, push the repository to GitHub and import it at vercel.com. Vercel detects a static project automatically with no configuration needed.

Live demo: https://live-hack-swart.vercel.app

---

## Project structure

    index.html    Page structure and layout
    style.css     All styling and animations
    script.js     Map logic, simulation engine, API integration

---

## Notes

Simulation mode uses weighted randomization based on real-world threat actor patterns. China, Russia, North Korea, and Iran appear more frequently as source countries, while the United States, United Kingdom, and Germany are weighted higher as targets. This reflects actual trends in reported cybersecurity incidents.

All IP addresses shown in simulation mode are randomly generated within real IP ranges for those countries. No actual network traffic is generated or intercepted.

---

## License

MIT
