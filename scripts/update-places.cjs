const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'content', 'places.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

// Coordinate corrections
const updates = {
  'Folk Art Zone & Blues Museum': { lat: 29.95405, lng: -90.04422 },
  'Appetite Repair Shop': { lat: 29.95189, lng: -90.05125 },
  'Rice Vice': { lat: 29.95217, lng: -90.05457, address: '141 Delaronde St (shared with Nighthawk)' },
  'Jazz Walk of Fame': { lat: 29.95232, lng: -90.05549 },
};

// Apply updates and remove Plume Algiers
data.body = data.body
  .filter(p => p.name !== 'Plume Algiers')
  .map(p => updates[p.name] ? { ...p, ...updates[p.name] } : p);

// Find max sort_order for new entries
const maxSort = Math.max(...data.body.map(p => p.sort_order));

// New places
const newPlaces = [
  {
    name: 'Nomad Used Book Store',
    category: 'shop',
    type: 'Bookstore',
    address: 'Algiers Point',
    description: 'Used book store in Algiers Point. Browse a curated selection of fiction, nonfiction, and local interest titles.',
    walk_time: '4 min',
    is_featured: false,
    lat: 29.95125,
    lng: -90.05308,
    image_url: '',
    sort_order: maxSort + 1,
  },
  {
    name: 'River Find Foods',
    category: 'eat',
    type: 'Market',
    address: 'Algiers Point',
    description: 'Local market and food spot near the levee.',
    walk_time: '7 min',
    is_featured: false,
    lat: 29.95401,
    lng: -90.04143,
    image_url: '',
    sort_order: maxSort + 2,
  },
  {
    name: 'The Vault NOLA',
    category: 'eat',
    type: 'Upscale Creole',
    address: 'Algiers Point',
    description: 'Upscale New Orleans cuisine inside the restored 1921 Algiers Trust and Savings Bank. The original bank vault still anchors the dining room. The Wright family has preserved authentic 1970s bank equipment alongside contemporary Creole cooking. A rare combination of architectural history and serious food, minutes from the ferry.',
    walk_time: '4 min',
    is_featured: false,
    lat: 29.95128,
    lng: -90.05056,
    image_url: '',
    sort_order: maxSort + 3,
  },
  {
    name: 'Drift Inn Diner',
    category: 'eat',
    type: 'Diner',
    address: 'Algiers Point',
    description: 'Classic neighborhood diner in Algiers Point.',
    walk_time: '3 min',
    is_featured: false,
    lat: 29.95282,
    lng: -90.05156,
    image_url: '',
    sort_order: maxSort + 4,
  },
];

data.body.push(...newPlaces);

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log('Updates applied:');
console.log('  Updated coords:', Object.keys(updates).join(', '));
console.log('  Removed: Plume Algiers');
console.log('  Added:', newPlaces.map(p => p.name).join(', '));
console.log('  Total places:', data.body.length);
