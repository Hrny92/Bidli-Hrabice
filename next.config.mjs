/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sanity Studio potřebuje transpilaci
  transpilePackages: ['next-sanity', 'sanity'],
  images: {
    // Povol obrázky z Sanity CDN a YouTube
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
    // Next.js Image optimizer: preferuj AVIF → WebP → original
    formats: ['image/avif', 'image/webp'],
    // Minimální TTL pro cachované optimalizované obrázky (7 dní)
    minimumCacheTTL: 60 * 60 * 24 * 7,
    // Podporované šířky pro srcset (pokryje thumbnaily i fullscreen)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 64, 128, 256, 384, 512, 800],
  },
}

export default nextConfig
