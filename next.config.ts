import type {NextConfig} from 'next'

/**
 * 301 redirect map from the current Wix site (www.iwcmainline.com, Sept 2026
 * sitemap) to the new architecture. Every indexed URL is accounted for.
 */
const legacyRedirects: {source: string; destination: string}[] = [
  {source: '/book-online', destination: '/book'},
  {source: '/schedule-online', destination: '/book'},
  {source: '/service-page/chiropractic-new-patient', destination: '/services/chiropractic-sports-chiropractic'},
  {source: '/service-page/chiropractic-existing-patient', destination: '/book'},
  {source: '/service-page/therapeutic-massage', destination: '/services/therapeutic-massage'},
  {source: '/service-page/athlete-injury-evaluation', destination: '/how-we-help/performance'},
  {source: '/service-page/holobiome-gut-restoration-program', destination: '/services/holobiome-gut-restoration'},
  {source: '/service-page/on-demand-lab-testing', destination: '/services/direct-access-lab-testing'},
  {source: '/service-page/:slug*', destination: '/book'},
  // The old "golf-performance-expert" URL is Dr. Jenn's biography page.
  {source: '/golf-performance-expert-wayne-pa', destination: '/about'},
  {source: '/dr-irene-londer', destination: '/team/dr-irene-londer'},
  {source: '/amie-hamel-massage-therapy-wayne-pa', destination: '/team/amie-hamel'},
  {source: '/functional-gut-health-wayne-pa', destination: '/services/holobiome-gut-restoration'},
  {source: '/privacy-practices-policies', destination: '/privacy'},
  {source: '/terms-of-service-conditions', destination: '/terms'},
  {source: '/blog', destination: '/resources'},
  {source: '/post/:slug*', destination: '/resources'},
  {source: '/blog/:slug*', destination: '/resources'},
  {source: '/news', destination: '/resources'},
  {source: '/news/:slug*', destination: '/resources'},
  // Retired online store ("Dr. Jenn's Favorites"), pending a decision on its replacement.
  {source: '/category/:slug*', destination: '/how-we-help/functional-health'},
  {source: '/product-page/:slug*', destination: '/how-we-help/functional-health'},
  {source: '/contact', destination: '/book#contact'},
]

const securityHeaders = [
  {key: 'X-Content-Type-Options', value: 'nosniff'},
  {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
  {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()'},
  {key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload'},
  // Only the site itself (the Studio's Preview tool) may frame these pages.
  {key: 'Content-Security-Policy', value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'"},
  {key: 'X-Frame-Options', value: 'SAMEORIGIN'},
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [{protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/**'}],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return legacyRedirects.map((r) => ({...r, statusCode: 301 as const}))
  },
  async headers() {
    // Until launch is approved (SITE_INDEXABLE=true), tell crawlers not to index anything.
    const indexable = process.env.SITE_INDEXABLE === 'true'
    return [
      {source: '/:path*', headers: securityHeaders},
      ...(indexable ? [] : [{source: '/:path*', headers: [{key: 'X-Robots-Tag', value: 'noindex, nofollow'}]}]),
      // Never index the CMS or API.
      {source: '/studio/:path*', headers: [{key: 'X-Robots-Tag', value: 'noindex, nofollow'}]},
      {source: '/api/:path*', headers: [{key: 'X-Robots-Tag', value: 'noindex, nofollow'}]},
    ]
  },
}

export default nextConfig
