// Merge: keep remote GPS coords + local image_url paths
const fs = require('fs');
const { execSync } = require('child_process');

const remote = JSON.parse(execSync('git show origin/master:content/places.json').toString());
const local = JSON.parse(fs.readFileSync('content/places.json', 'utf8'));

// Build map of image_urls from local (the photo fetch result)
const imageMap = {};
for (const p of local.body) {
  if (p.image_url) imageMap[p.name] = p.image_url;
}

// Apply images to remote data (which has user's GPS edits)
for (const p of remote.body) {
  if (imageMap[p.name]) p.image_url = imageMap[p.name];
}

fs.writeFileSync('content/places.json', JSON.stringify(remote, null, 2) + '\n');
console.log('Merged. Remote places:', remote.body.length, '| Images applied:', Object.keys(imageMap).length);
