import type { Plugin } from 'vite';
import { PluginOptions, routeHook } from '../common';

const virtualModuleId = '@vite-plugin-typed-pages';
const resolvedVirtualModuleId = '\0' + virtualModuleId;

export default function ({
  outDir = './generated',
  routesObjectName = 'routerPagesNames',
}: PluginOptions = {}): Plugin {
  let srcDir: string | null = null;
  let isVitePluginPagesRegistered = true;
  return {
    name: 'vite-plugin-typed-pages',
    enforce: 'pre',
    configResolved(config) {
      console.log(config);
      if (!config.plugins.find(({ name }) => name === 'vite-plugin-pages')) {
        isVitePluginPagesRegistered = false;
        throw new Error(
          '[vite-plugin-typed-pages] You need to register vite-plugin-pages before this plugin'
        );
      }
      srcDir = config.root;
      outDir = `./${outDir}`;
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async buildStart(options) {
      if (isVitePluginPagesRegistered) {
        const routes: any = await import('~pages');
        await routeHook({ outDir, routes, srcDir, routesObjectName });
      }
    },
  };
}
