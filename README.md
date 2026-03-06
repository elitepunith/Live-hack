# Live-Hack

## What is this project?

Live-Hack is a web visualization that shows cyberattacks happening around the world in real time. Animated lines travel across a world map from the attacker’s location to the target country while a live feed displays details like malicious IP addresses and attack types.

I built this project to explore threat intelligence data and cybersecurity visualization. The goal was to create something that looks like a hacker-movie attack map but is powered by real threat intelligence data.

## How to run it

1. Clone this repository

git clone https://github.com/elitepunith/Kotoba.git

2. Open the project folder.

3. Open `index.html` in your browser.

### Optional – Use Real Threat Data

If you want real attack data:

1. Create a free account on AlienVault OTX  
2. Get your OTX API key  
3. Add the key in the script configuration file.

## What I learned

While building this project, I learned:

- How to use threat intelligence APIs to retrieve malicious IP data
- How to convert IP addresses into geographic coordinates
- How to visualize cyber activity using map animations and JavaScript
- Handling real-time data updates efficiently in the browser

One of the biggest challenges was mapping IP data to real locations and animating attack paths smoothly across the map.

## Known issues

- IP geolocation is not always accurate, so attack locations are approximate
- Performance may slow down if too many attacks appear at once
- Some threat intelligence data may contain duplicates or outdated entries

## License

MIT