import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
    ],
  },
  transpilePackages: ['motion'],
  experimental: {
    // @ts-expect-error - allowedDevOrigins is available in Next.js 15.1+ but might not be in types yet
    allowedDevOrigins: [
      'ais-dev-jsqbu6pmjlk5s5u3dzozuc-6497597441.europe-west1.run.app',
      'ais-pre-jsqbu6pmjlk5s5u3dzozuc-6497597441.europe-west1.run.app',
      'localhost:3000',
    ],
  },
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
