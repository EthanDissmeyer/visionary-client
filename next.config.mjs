/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable trailing slash handling if necessary
    trailingSlash: false,

    // Enable output files for server rendering
    output: 'standalone',

    // Uncomment if hosting assets on a specific domain or CDN
    // assetPrefix: 'https://visionary.host',
};

export default nextConfig;

