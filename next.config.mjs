/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    reactStrictMode: false, // 개발 단계에서 중복 실행 방지
  };
  
  export default nextConfig;