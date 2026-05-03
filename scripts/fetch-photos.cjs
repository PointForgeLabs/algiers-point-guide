// Fetches a Google Places photo for each place and saves it locally.
// Uses Places API (New) v1.
// Run once: GOOGLE_PLACES_API_KEY=xxx node scripts/fetch-photos.cjs
//
// What it does:
// 1. For each place in content/places.json without a local image_url:
//    a. Text Search via Places API (New) to find the place + photos
//    b. Fetch photo media using the photo name
//    c. Download to public/images/places/<slug>.jpg
//    d. Save the local path back to image_url
//
// Cost: Text Search (Pro) ~$0.025 each + Photo Media ~$0.007 each.
// Within $200/mo free credit. Subsequent runs skip places already done.

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  console.error('ERROR: Set GOOGLE_PLACES_API_KEY env var');
  process.exit(1);
}

const placesFile = path.join(__dirname, '..', 'content', 'places.json');
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'places');
fs.mkdirSync(imagesDir, { recursive: true });

const data = JSON.parse(fs.readFileSync(placesFile, 'utf8'));

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function searchPlace(name, address) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.photos',
    },
    body: JSON.stringify({
      textQuery: `${name}, ${address}, New Orleans, LA`,
      maxResultCount: 1,
    }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.places?.[0] || null;
}

async function downloadPhoto(photoName, destPath) {
  const url = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=1200&key=${API_KEY}`;

  return new Promise((resolve, reject) => {
    https.get(url, res => {
      // Photo Media may return 302 redirect to actual content
      if (res.statusCode === 302 || res.statusCode === 301) {
        https.get(res.headers.location, res2 => {
          if (res2.statusCode !== 200) {
            reject(new Error(`Photo download failed: ${res2.statusCode}`));
            return;
          }
          const chunks = [];
          res2.on('data', c => chunks.push(c));
          res2.on('end', () => {
            fs.writeFileSync(destPath, Buffer.concat(chunks));
            resolve();
          });
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => {
          fs.writeFileSync(destPath, Buffer.concat(chunks));
          resolve();
        });
      } else {
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => {
          reject(new Error(`Photo download failed: ${res.statusCode} ${Buffer.concat(chunks).toString().substring(0, 200)}`));
        });
      }
    }).on('error', reject);
  });
}

(async () => {
  let updated = 0, skipped = 0, failed = 0;

  for (const place of data.body) {
    if (place.image_url && place.image_url.startsWith('/images/places/')) {
      skipped++;
      continue;
    }

    process.stdout.write(`Fetching ${place.name}... `);

    try {
      const found = await searchPlace(place.name, place.address);
      if (!found) { console.log('not found'); failed++; continue; }
      if (!found.photos?.length) { console.log('no photos'); failed++; continue; }

      const photoName = found.photos[0].name;
      const slug = slugify(place.name);
      const filename = `${slug}.jpg`;
      const destPath = path.join(imagesDir, filename);

      await new Promise(r => setTimeout(r, 200));
      await downloadPhoto(photoName, destPath);

      place.image_url = `/images/places/${filename}`;
      console.log('OK');
      updated++;

      // Save after each successful fetch
      fs.writeFileSync(placesFile, JSON.stringify(data, null, 2) + '\n');

      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.log('ERROR:', e.message);
      failed++;
    }
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}, Failed: ${failed}`);
})();
