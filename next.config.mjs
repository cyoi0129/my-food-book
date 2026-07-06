import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 完全クライアント (IndexedDB) 完結アプリ。静的書き出しで任意の静的ホスティングへ配置する。
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  sassOptions: {
    // 各 *.module.scss から `@use 'styles/mixins'` で共有ミックスインを参照できるようにする。
    includePaths: [path.join(__dirname, 'src')],
  },
};

export default nextConfig;
