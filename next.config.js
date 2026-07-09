const withPWA = require('@ducanh2912/next-pwa').default({
    dest: 'public',
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    disable: process.env.NODE_ENV === 'development',
    workboxOptions: {
        disableDevLogs: true,
    },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
            },
        ],
    },
    serverExternalPackages: ['read-excel-file'],
    // Turbopack config (Next.js 16+ default bundler)
    turbopack: {},

    // Finding B fix: Content-Security-Policy header
    // Restricts script/style loading to known-safe origins only.
    // Add SRI hashes to layout.jsx tags for an additional layer of defence.
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            // Scripts: self + exact CDN origins only
                            "script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://pagead2.googlesyndication.com",
                            // Styles: self + CDN origins
                            "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://fonts.googleapis.com",
                            // Fonts
                            "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
                            // Images: self + GitHub raw content
                            "img-src 'self' data: https://raw.githubusercontent.com",
                            // API calls: self + GitHub API + Upstash
                            "connect-src 'self' https://api.github.com https://*.upstash.io",
                            // No frames, objects, or base overrides
                            "frame-ancestors 'none'",
                            "object-src 'none'",
                            "base-uri 'self'",
                        ].join('; '),
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
};

module.exports = withPWA(nextConfig);
