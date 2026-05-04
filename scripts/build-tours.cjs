// Builds three audio walking tour JSON files in content/tours/.
// Coords come first from existing places.json where a stop matches an
// existing place; otherwise we Nominatim-geocode the street address.
// Empty fields (audio, transcript, directions_to_next) are intentional —
// user records audio and writes their own scripts via the CMS.
//
// Run once: `node scripts/build-tours.cjs`

const fs = require('fs');
const path = require('path');

const places = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'content', 'places.json'), 'utf8')).body;
const FERRY = { lat: 29.95309626074462, lng: -90.05550878079588 };

function findPlace(nameContains) {
  const needle = nameContains.toLowerCase();
  return places.find(p => p.name.toLowerCase().includes(needle));
}

async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'algiers-point-guide/1.0 (jasonntolliver@gmail.com)' } });
  const json = await res.json();
  if (!json.length) return null;
  return { lat: parseFloat(json[0].lat), lng: parseFloat(json[0].lon) };
}

async function resolveCoords(stop) {
  if (stop.placeMatch) {
    const p = findPlace(stop.placeMatch);
    if (p) return { lat: p.lat, lng: p.lng, source: `place:${p.name}` };
    console.log(`  ! place "${stop.placeMatch}" not found in places.json`);
  }
  if (stop.coords) return { ...stop.coords, source: 'manual' };
  if (stop.address) {
    const q = `${stop.address}, Algiers, New Orleans, LA, USA`;
    await new Promise(r => setTimeout(r, 1100)); // Nominatim rate limit
    const g = await geocode(q);
    if (g) return { ...g, source: 'nominatim' };
  }
  return { lat: FERRY.lat, lng: FERRY.lng, source: 'fallback:ferry' };
}

const tours = [
  {
    slug: 'historic-algiers-point',
    title: 'Historic Algiers Point',
    description: "Walk the quiet streets of New Orleans' second-oldest neighborhood, settled in 1719 and listed on the National Register of Historic Places. From the 1896 courthouse rebuilt after the Great Fire to a Tudor Gothic church and a former movie theater turned glass-blowing studio, this tour traces three centuries of architecture and life on the Point.",
    duration: '60 min',
    stops: [
      { name: 'Algiers Courthouse', address: '225 Morgan St', placeMatch: 'Algiers Courthouse' },
      { name: 'Canal-Commercial Trust & Savings Bank', address: '501 Patterson St' },
      { name: 'Larkin Park', address: 'Larkin Park, Algiers Point' },
      { name: '200 Block of Olivier Street', address: '200 Olivier St', placeMatch: '200 Block of Olivier' },
      { name: 'Hubbell Algiers Point Library', address: '725 Pelican Ave', placeMatch: 'Hubbell' },
      { name: 'Mount Olivet Episcopal Church', address: '530 Pelican Ave', placeMatch: 'Mount Olivet' },
      { name: 'Knights of Columbus Home', address: '342 Olivier St' },
      { name: 'Rosetree Blown Glass Studio (former "Algy" Theater)', address: '446 Vallette St', placeMatch: 'Rosetree' },
      { name: 'Trinity Evangelical Lutheran Church', address: 'Trinity Lutheran Church, Algiers Point', placeMatch: 'Trinity Lutheran' },
      { name: "McDonogh Park (\"Bermuda Triangle\")", address: 'McDonogh Memorial Park, Algiers Point', placeMatch: 'McDonogh Memorial Park' },
      { name: 'Holy Name of Mary Church', address: 'Holy Name of Mary Church, Algiers Point', placeMatch: 'Holy Name of Mary' },
      { name: 'Confetti Park', address: 'Confetti Park, Algiers Point', placeMatch: 'Confetti Park' },
      { name: 'Barracuda (former Gulf Service Station)', address: '446 Pelican Ave', placeMatch: 'Barracuda' },
      { name: 'Martin Behrman House', address: '228 Pelican Ave' },
    ],
  },
  {
    slug: 'over-da-river-jazz',
    title: 'Over da River Jazz Tour',
    description: "Algiers musicians of the 1920s called their neighborhood 'over da river' or the 'Brooklyn of the South.' This tour visits the homes of cornetists, pianists, and bandleaders who shaped early jazz, plus the dance halls, masonic temples, and corner bars where they played — ending at the Robert E. Nims Jazz Walk of Fame on the levee.",
    duration: '50 min',
    stops: [
      { name: 'Algiers Courthouse (Duverje Plantation Site)', address: '225 Morgan St', placeMatch: 'Algiers Courthouse' },
      { name: 'Emmett Hardy Home', address: '237 Morgan St' },
      { name: 'Norman Brownlee Home', address: '407 Delaronde St' },
      { name: 'The Old Point Bar', address: '545 Patterson St', placeMatch: 'Old Point Bar' },
      { name: 'Old Masonic Hall', address: '300 Olivier St' },
      { name: 'Knights of Columbus (Jazz Hall)', address: '342 Olivier St' },
      { name: 'Alphonse Picou Home', address: '436 Bermuda St' },
      { name: 'Pythian Hall Site', address: '420 Bermuda St' },
      { name: 'House of the Rising Sun B&B', address: '335 Pelican Ave' },
      { name: '"Professor" Manuel Manetta Home', address: '239 Pelican Ave' },
      { name: 'Martin Behrman House', address: '228 Pelican Ave' },
      { name: 'Robert E. Nims Jazz Walk of Fame', placeMatch: 'Jazz Walk of Fame' },
    ],
  },
  {
    slug: 'brooklyn-of-the-south-jazz',
    title: 'Brooklyn of the South Jazz Tour',
    description: "A jazz heritage tour through Algiers Point and Algiers Riverview, focused on the African American musicians and Black churches that shaped New Orleans music. Visit the homes of Henry 'Red' Allen, 'Kid' Thomas Valentine, Peter Bocage, and Manuel Manetta, plus the dance halls and clubs where the sound traveled.",
    duration: '70 min',
    stops: [
      { name: 'Manuel Manetta Home', address: '331 Alix St' },
      { name: 'Algiers Fire Station No. 17', address: '425 Opelousas Ave' },
      { name: "Love's Outreach Christian Church (former Folly Theater)", address: '501 Opelousas Ave' },
      { name: 'Delcazal Playground (Duverje Cemetery Site)', placeMatch: 'Delcazal Playground' },
      { name: 'Former Sts. John Masonic Temple', address: '648 Opelousas Ave' },
      { name: 'Henry Allen Sr. & Henry "Red" Allen Home', address: '921 Verret St' },
      { name: 'Charlie Love Home', address: '1006 Verret St' },
      { name: '"Kid" Thomas Valentine Home', address: '825 Vallette St' },
      { name: 'Peter Bocage Home', address: '1006 Vallette St' },
      { name: 'Greater Providence Baptist Church', address: '623 Newton St' },
      { name: 'Henry "Red" Allen Birthplace', address: '414 Newton St' },
      { name: "Kohlman's Tavern (the Casbah)", address: '414 Homer St' },
      { name: 'Manuel Manetta Birthplace', address: '416 Powder St' },
      { name: 'Robert E. Nims Jazz Walk of Fame', placeMatch: 'Jazz Walk of Fame' },
    ],
  },
];

(async () => {
  for (const tour of tours) {
    console.log(`\n=== ${tour.title} ===`);
    const resolved = [];
    for (const stop of tour.stops) {
      const c = await resolveCoords(stop);
      console.log(`  ${stop.name.padEnd(50)} ${c.lat.toFixed(5)}, ${c.lng.toFixed(5)} (${c.source})`);
      resolved.push({
        name: stop.name,
        lat: c.lat,
        lng: c.lng,
        audio: '',
        directions_to_next: '',
        transcript: '',
      });
    }

    const json = {
      slug: tour.slug,
      title: tour.title,
      description: tour.description,
      duration: tour.duration,
      stops: resolved,
    };

    const outFile = path.join(__dirname, '..', 'content', 'tours', `${tour.slug}.json`);
    fs.writeFileSync(outFile, JSON.stringify(json, null, 2) + '\n');
    console.log(`  -> ${outFile}`);
  }
})();
