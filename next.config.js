/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com', 'tkkxrsqniagdyafojdto.supabase.co'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
        ],
    },
    reactStrictMode: true,
};

module.exports = nextConfig;
