const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'content', 'places.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

// Fix Beatrixbell — its coords were duplicated from Faubourgh.
const updates = {
  'Beatrixbell Handcrafted Jewelry': {
    lat: 29.95161258359743,
    lng: -90.05125292550599,
    address: '109 Lavergne St, Algiers Point',
  },
};

const matched = new Set();
data.body = data.body.map(p => {
  if (updates[p.name]) {
    matched.add(p.name);
    return { ...p, ...updates[p.name] };
  }
  return p;
});

const maxSort = Math.max(...data.body.map(p => p.sort_order));

const newPlaces = [
  {
    name: 'Mount Olivet Episcopal Church',
    category: 'architecture',
    type: 'Church',
    address: 'Algiers Point',
    description: 'Historic Episcopal church in Algiers Point.',
    walk_time: '4 min',
    is_featured: false,
    lat: 29.953397322499217,
    lng: -90.05036977540588,
    image_url: '',
    sort_order: maxSort + 1,
  },
  {
    name: 'Pelican Gardens',
    category: 'community',
    type: 'Garden',
    address: '310 Wagner St, Algiers Point',
    description: 'Community garden / green space along Wagner Street.',
    walk_time: '8 min',
    is_featured: false,
    lat: 29.95254426108015,
    lng: -90.03911483796635,
    image_url: '',
    sort_order: maxSort + 2,
  },
  {
    name: 'Compass Point Events',
    category: 'community',
    type: 'Event Venue',
    address: '705 Brooklyn Ave, Algiers Point',
    description: 'Event venue near the levee at the south end of Algiers Point.',
    walk_time: '9 min',
    is_featured: false,
    lat: 29.948409991449452,
    lng: -90.05372607555624,
    image_url: '',
    sort_order: maxSort + 3,
  },
  {
    name: 'Algiers United Methodist Church',
    category: 'architecture',
    type: 'Church',
    address: '725 Vallette St, Algiers Point',
    description: 'United Methodist church serving the Algiers Point community.',
    walk_time: '8 min',
    is_featured: false,
    lat: 29.94832274623693,
    lng: -90.0496582247104,
    image_url: '',
    sort_order: maxSort + 4,
  },
];

data.body.push(...newPlaces);

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log('Updated:', [...matched].join(', '));
console.log('Added:', newPlaces.map(p => `${p.name} (${p.category})`).join(', '));
console.log('Total:', data.body.length);
