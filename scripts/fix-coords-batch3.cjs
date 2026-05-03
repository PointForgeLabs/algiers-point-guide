const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'content', 'places.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

// Earlier batch3 mis-mapped image 1 to Beatrixbell; image 1 is actually
// McDonogh Park's updated coords. Image 2 (109 Lavergne) is Beatrixbell.
const updates = {
  'McDonogh Memorial Park': {
    lat: 29.95161258359743,
    lng: -90.05125292550599,
  },
  'Beatrixbell Handcrafted Jewelry': {
    lat: 29.95453010100002,
    lng: -90.05285492861353,
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

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log('Updated:', [...matched].join(', '));
const missed = Object.keys(updates).filter(n => !matched.has(n));
if (missed.length) console.log('NOT FOUND:', missed.join(', '));
