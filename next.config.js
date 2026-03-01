/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static export for GitHub Pages/static hosting
  output: 'export',
  // Required for static export
  images: {
    unoptimized: true,
  },
  // Add trailing slash for better routing
  trailingSlash: true,
}

// Conditionally add PWA wrapper
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA(nextConfig)
