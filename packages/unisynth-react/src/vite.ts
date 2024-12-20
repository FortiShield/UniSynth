export function unisynthReact(): any {
  const OPTIMIZE_DEPS = [
    'react',
    'react-dom',
    'react-dom/client',
    'react-dom/server',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
  ];
  const DEDUPE = ['react', 'react-dom'];

  return {
    name: 'vite-plugin-unisynth-react',
    config() {
      return {
        resolve: {
          dedupe: DEDUPE,
        },
        optimizeDeps: {
          include: OPTIMIZE_DEPS,
        },
      };
    },
  };
}
