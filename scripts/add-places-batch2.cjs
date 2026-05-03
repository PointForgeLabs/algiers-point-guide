const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'content', 'places.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const maxSort = Math.max(...data.body.map(p => p.sort_order));

const newPlaces = [
  {
    name: 'Confetti Park',
    category: 'community',
    type: 'Park',
    address: 'Algiers Point',
    description: 'Whimsical community park known for its colorful playground and family-friendly atmosphere. Hosts the Confetti Kids storytelling and music programs.',
    walk_time: '4 min',
    is_featured: false,
    lat: 29.95291979416701,
    lng: -90.05123235575807,
    image_url: '',
    sort_order: maxSort + 1,
  },
  {
    name: 'McDonogh Memorial Park',
    category: 'community',
    type: 'Park',
    address: 'Algiers Point',
    description: 'Public park honoring John McDonogh; a quiet pocket of green space in the heart of Algiers Point.',
    walk_time: '6 min',
    is_featured: false,
    lat: 29.9511015351186,
    lng: -90.05166278608007,
    image_url: '',
    sort_order: maxSort + 2,
  },
  {
    name: 'Delcazal Playground',
    category: 'community',
    type: 'Playground',
    address: 'Algiers Point',
    description: 'Neighborhood playground at the south end of Algiers Point.',
    walk_time: '7 min',
    is_featured: false,
    lat: 29.949301290458337,
    lng: -90.05087119886957,
    image_url: '',
    sort_order: maxSort + 3,
  },
  {
    name: 'Opelousas Point Supermarket',
    category: 'eat',
    type: 'Grocery',
    address: 'Algiers Point',
    description: 'Local grocery serving Algiers Point — staples, snacks, and quick essentials.',
    walk_time: '9 min',
    is_featured: false,
    lat: 29.94854567608526,
    lng: -90.05043091441871,
    image_url: '',
    sort_order: maxSort + 4,
  },
  {
    name: 'Faubourgh Fresh Market',
    category: 'eat',
    type: 'Market',
    address: 'Algiers Point',
    description: 'Fresh market in Algiers Point — produce, prepared foods, and pantry staples.',
    walk_time: '6 min',
    is_featured: false,
    lat: 29.95083570328419,
    lng: -90.0511152436272,
    image_url: '',
    sort_order: maxSort + 5,
  },
  {
    name: 'Beatrixbell Handcrafted Jewelry',
    category: 'shop',
    type: 'Jewelry',
    address: 'Algiers Point',
    description: 'Handcrafted jewelry studio and shop in Algiers Point.',
    walk_time: '6 min',
    is_featured: false,
    lat: 29.95083570328419,
    lng: -90.0511152436272,
    image_url: '',
    sort_order: maxSort + 6,
  },
];

data.body.push(...newPlaces);

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log('Added:', newPlaces.map(p => `${p.name} (${p.category})`).join(', '));
console.log('Total places:', data.body.length);
