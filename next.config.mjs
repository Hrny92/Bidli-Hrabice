/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sanity Studio potřebuje transpilaci
  transpilePackages: ['next-sanity', 'sanity'],
  images: {
    // Povol obrázky z Sanity CDN
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
}

export default nextConfig
