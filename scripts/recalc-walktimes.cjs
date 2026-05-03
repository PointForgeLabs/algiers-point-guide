const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'content', 'places.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

// Ferry terminal — origin for walk times.
const FERRY = { lat: 29.95309626074462, lng: -90.05550878079588 };

// Urban tourist walking pace: 4.5 km/h = 75 m/min.
// Add a 1.3x detour multiplier since street grid is not straight-line.
const SPEED_M_PER_MIN = 75;
const DETOUR = 1.3;

function haversineMeters(a, b) {
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

// Revert addresses I had populated with street info to the generic
// "Algiers Point" — the user manages street addresses via CMS.
const addressReverts = new Set([
  'Beatrixbell Handcrafted Jewelry',
  'McDonogh Memorial Park',
  'Pelican Gardens',
  'Compass Point Events',
  'Algiers United Methodist Church',
]);

let walkChanges = 0;
let addrChanges = 0;

data.body = data.body.map(p => {
  const out = { ...p };

  const meters = haversineMeters(FERRY, { lat: p.lat, lng: p.lng });
  const minutes = Math.max(1, Math.round(meters * DETOUR / SPEED_M_PER_MIN));
  const newWalk = `${minutes} min`;
  if (out.walk_time !== newWalk) {
    out.walk_time = newWalk;
    walkChanges++;
  }

  if (addressReverts.has(p.name) && p.address !== 'Algiers Point') {
    out.address = 'Algiers Point';
    addrChanges++;
  }

  return out;
});

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(`Walk-time updates: ${walkChanges}`);
console.log(`Address reverts: ${addrChanges}`);
console.log('\nAll places (sorted by walk time):');
[...data.body]
  .sort((a, b) => parseInt(a.walk_time) - parseInt(b.walk_time))
  .forEach(p => console.log(`  ${p.walk_time.padStart(6)} | ${p.name}`));
