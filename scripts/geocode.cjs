// Re-geocode all places using Nominatim and update places.json
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'content', 'places.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

async function geocode(address) {
  const url = 'https://nominatim.openstreetmap.org/search?q=' +
    encodeURIComponent(address + ', New Orleans, LA') +
    '&format=json&limit=1&viewbox=-90.07,29.97,-90.04,29.93&bounded=1';
  const res = await fetch(url, { headers: { 'User-Agent': 'algiers-point-guide/1.0 (jasonntolliver@gmail.com)' } });
  const r = await res.json();
  if (!r.length) return null;
  return { lat: parseFloat(r[0].lat), lng: parseFloat(r[0].lon) };
}

(async () => {
  for (const place of data.body) {
    // Skip places with non-specific addresses
    if (place.address.toLowerCase().includes('algiers point') ||
        place.address.toLowerCase().includes('mississippi river levee') ||
        place.address.toLowerCase().includes('ferry terminal') ||
        place.address.toLowerCase().includes('leboeuf st at')) {
      console.log('SKIP (non-specific):', place.name, '-', place.address);
      continue;
    }

    const result = await geocode(place.address);
    if (result) {
      // Verify it's actually in Algiers Point area
      const inArea = result.lat > 29.93 && result.lat < 29.97 && result.lng > -90.07 && result.lng < -90.04;
      if (inArea) {
        const oldLat = place.lat;
        const oldLng = place.lng;
        place.lat = parseFloat(result.lat.toFixed(5));
        place.lng = parseFloat(result.lng.toFixed(5));
        console.log('OK  ', place.name.padEnd(35), oldLat, oldLng, '->', place.lat, place.lng);
      } else {
        console.log('OUT ', place.name, '- skipping, geocoded outside Algiers area:', result);
      }
    } else {
      console.log('FAIL', place.name, '-', place.address);
    }
    await new Promise(r => setTimeout(r, 1100)); // Nominatim rate limit
  }

  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  console.log('\nUpdated', file);
})();
