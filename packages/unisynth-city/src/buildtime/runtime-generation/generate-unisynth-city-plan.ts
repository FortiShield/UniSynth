import type { UnisynthVitePlugin } from '@khulnasoft.com/unisynth/optimizer';
import type { BuildContext } from '../types';
import { createEntries } from './generate-entries';
import { createMenus } from './generate-menus';
import { createRoutes } from './generate-routes';
import { createServerPlugins } from './generate-server-plugins';

/** Generates the Unisynth City Plan runtime code */
export function generateUnisynthCityPlan(
  ctx: BuildContext,
  unisynthPlugin: UnisynthVitePlugin,
  isSSR: boolean
) {
  const esmImports: string[] = [];
  const c: string[] = [];

  c.push(`\n/** Unisynth City Plan */`);

  createServerPlugins(ctx, unisynthPlugin, c, esmImports, isSSR);

  createRoutes(ctx, unisynthPlugin, c, esmImports, isSSR);

  createMenus(ctx, c, esmImports, isSSR);

  createEntries(ctx, c);

  c.push(`export const trailingSlash = ${JSON.stringify(!!ctx.opts.trailingSlash)};`);

  c.push(`export const basePathname = ${JSON.stringify(ctx.opts.basePathname)};`);

  c.push(`export const cacheModules = ${JSON.stringify(!ctx.isDevServer)};`);

  c.push(
    `export default { routes, serverPlugins, menus, trailingSlash, basePathname, cacheModules };`
  );

  return esmImports.join('\n') + c.join('\n');
}
