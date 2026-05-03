const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'content', 'places.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const updates = {
  'Congregation Coffee':         { lat: 29.951908999405727, lng: -90.05344795758592 },
  'Drift Inn Diner':             { lat: 29.95263719905331,  lng: -90.05120712173468 },
  'Rosetree Blown Glass Studio': { lat: 29.951093659962954, lng: -90.04897164830093 },
  'Folk Art Zone & Blues Museum':{ lat: 29.954067820958535, lng: -90.04165463214376 },
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

const missed = Object.keys(updates).filter(n => !matched.has(n));
console.log('Updated:', [...matched].join(', '));
if (missed.length) console.log('NOT FOUND:', missed.join(', '));
