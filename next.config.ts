import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/config.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a93237d2b97806cf3621e5e5e0d8d6e7.r2.cloudflarestorage.com',
        pathname: '/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
