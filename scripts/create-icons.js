const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// Create a simple SVG-based icon
function createIcon(size) {
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#4F46E5" rx="${size * 0.15}"/>
  <text x="50%" y="55%" font-size="${size * 0.5}" text-anchor="middle" fill="white">🧮</text>
</svg>`;
  return svg;
}

sizes.forEach(size => {
  const svg = createIcon(size);
  fs.writeFileSync(
    path.join(iconsDir, `icon-${size}x${size}.png`),
    svg
  );
  console.log(`Created icon-${size}x${size}.png (SVG placeholder)`);
});

console.log('Icons created!');
