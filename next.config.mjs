/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    outputFileTracingExcludes: {
      "/api/**/*": ["**/*.js", "**/*.ts"],
    },
  },
};

export default nextConfig;
