import { cloudflarePagesAdapter } from '@khulnasoft.com/unisynth-city/adapters/cloudflare-pages/vite';
import { extendConfig } from '@khulnasoft.com/unisynth-city/vite';
// @ts-ignore
import baseConfig from '../../vite.config.mts';

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ['src/entry.cloudflare-pages.tsx', '@unisynth-city-plan'],
      },
      minify: false,
    },
    plugins: [
      cloudflarePagesAdapter({
        ssg: {
          include: ['/', '/*'],
          exclude: ['/demo/*', '/shop/*'],
          origin:
            (process.env.CF_PAGES_BRANCH !== 'main' ? process.env.CF_PAGES_URL : null) ??
            'https://unisynth.builder.io',
        },
      }),
    ],
  };
});
