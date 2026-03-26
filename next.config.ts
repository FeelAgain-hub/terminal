import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: ['motion'],
  experimental: {
    allowedDevOrigins: [
      'ais-dev-jsqbu6pmjlk5s5u3dzozuc-6497597441.europe-west1.run.app',
      'ais-pre-jsqbu6pmjlk5s5u3dzozuc-6497597441.europe-west1.run.app',
      'localhost:3000',
    ],
  },
  webpack: (config, {dev}) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,  
      };
    }
    return config;
  },
};

export default nextConfig;