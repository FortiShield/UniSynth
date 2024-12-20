import { partytownVite } from '@builder.io/partytown/utils';
import { unisynthCity } from '@khulnasoft.com/unisynth-city/vite';
import { unisynthInsights } from '@khulnasoft.com/unisynth-labs/vite';
import { unisynthReact } from '@khulnasoft.com/unisynth-react/vite';
import { unisynthVite } from '@khulnasoft.com/unisynth/optimizer';
import path, { resolve } from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import Inspect from 'vite-plugin-inspect';
import { examplesData, playgroundData, rawSource, tutorialData } from './vite.repl-apps';
import { sourceResolver } from './vite.source-resolver';

const PUBLIC_UNISYNTH_INSIGHTS_KEY = loadEnv('', '.', 'PUBLIC').PUBLIC_UNISYNTH_INSIGHTS_KEY;
const docsDir = new URL(import.meta.url).pathname;

// https://github.com/vitejs/vite/issues/15012#issuecomment-1825035992
const muteWarningsPlugin = (warningsToIgnore: string[][]): Plugin => {
  const mutedMessages = new Set();
  return {
    name: 'mute-warnings',
    enforce: 'pre',
    config: (userConfig) => {
      const origOnLog = userConfig.build?.rollupOptions?.onLog;
      return {
        build: {
          rollupOptions: {
            onLog(type, warning, defaultHandler) {
              if (type === 'warn') {
                if (warning.code) {
                  const muted = warningsToIgnore.find(
                    ([code, message]) => code == warning.code && warning.message.includes(message)
                  );

                  if (muted) {
                    mutedMessages.add(muted.join());
                    return;
                  }
                }
              }
              origOnLog ? origOnLog(type, warning, defaultHandler) : defaultHandler(type, warning);
            },
          },
        },
      };
    },
    closeBundle() {
      const diff = warningsToIgnore.filter((x) => !mutedMessages.has(x.join()));
      if (diff.length > 0) {
        this.warn('Some of your muted warnings never appeared during the build process:');
        diff.forEach((m) => this.warn(`- ${m.join(': ')}`));
      }
    },
  };
};

export default defineConfig(async () => {
  const { default: rehypePrettyCode } = await import('rehype-pretty-code');

  const routesDir = resolve('src', 'routes');
  return {
    dev: {
      headers: {
        'Cache-Control': 'public, max-age=0',
      },
    },
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
    resolve: {
      alias: [
        {
          find: '~',
          replacement: path.resolve(__dirname, 'src'),
        },
        {
          // HACK: For some reason supabase imports node-fetch but only in CloudFlare build
          // This hack is here to prevent the import from happening since we don't need to
          // polyfill fetch in the edge.
          find: '@supabase/node-fetch',
          replacement: path.resolve(__dirname, 'src', 'empty.ts'),
        },
      ],
    },
    ssr: {
      noExternal: [
        '@mui/material',
        '@mui/system',
        '@emotion/react',
        '@algolia/autocomplete-core/dist/esm/resolve',
        '@algolia/autocomplete-core',
        '@algolia/autocomplete-shared',
        'algoliasearch/lite',
        'algoliasearch',
        '@algolia/autocomplete-core/dist/esm/reshape',
        'algoliasearch/dist/algoliasearch-lite.esm.browser',
      ],
    },

    plugins: [
      // some imported react code has sourcemap issues
      muteWarningsPlugin([
        ['SOURCEMAP_ERROR', "Can't resolve original location of error"],
        ['MODULE_LEVEL_DIRECTIVE', 'use client'],
      ]),
      rawSource(),
      unisynthCity({
        mdxPlugins: {
          rehypeSyntaxHighlight: false,
          remarkGfm: true,
          rehypeAutolinkHeadings: true,
        },
        mdx: {
          rehypePlugins: [
            [
              rehypePrettyCode as any,
              {
                theme: 'dark-plus',
                onVisitLine(node: any) {
                  // Prevent lines from collapsing in `display: grid` mode, and
                  // allow empty lines to be copy/pasted
                  if (node.children.length === 0) {
                    node.children = [{ type: 'text', value: ' ' }];
                  }
                },
                onVisitHighlightedLine(node: any) {
                  // Each line node by default has `class="line"`.
                  if (node.properties.className) {
                    node.properties.className.push('line--highlighted');
                  }
                },
                onVisitHighlightedWord(node: any, id: string) {
                  // Each word node has no className by default.
                  node.properties.className = ['word'];
                  if (id) {
                    const backgroundColor = {
                      a: 'rgb(196 42 94 / 59%)',
                      b: 'rgb(0 103 163 / 56%)',
                      c: 'rgb(100 50 255 / 35%)',
                    }[id];

                    const color = {
                      a: 'rgb(255 225 225 / 100%)',
                      b: 'rgb(175 255 255 / 100%)',
                      c: 'rgb(225 200 255 / 100%)',
                    }[id];
                    if (node.properties['data-rehype-pretty-code-wrapper']) {
                      node.children.forEach((childNode: any) => {
                        childNode.properties.style = ``;
                        childNode.properties.className = '';
                      });
                    }
                    node.properties.style = `background-color: ${backgroundColor}; color: ${color};`;
                  }
                },
              },
            ],
          ],
        },
      }),
      unisynthVite(),
      partytownVite({
        dest: resolve('dist', '~partytown'),
      }),
      examplesData(routesDir),
      playgroundData(routesDir),
      tutorialData(routesDir),
      sourceResolver(docsDir),
      unisynthReact(),
      Inspect(),
      unisynthInsights({ publicApiKey: PUBLIC_UNISYNTH_INSIGHTS_KEY }),
    ],
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[hash]-[name].[ext]',
        },
      },
    },
    clearScreen: false,
    server: {
      port: 3000,
    },
  };
});
