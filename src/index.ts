import { MODULE_IDS, MODULE_ID_VIRTUAL, ROUTE_BLOCK_ID_VIRTUAL } from './core/constants';
import { resolve } from 'pathe';
import type { Plugin } from 'vite';
import { ResolvedConfig } from 'vitest';
import { normalizeRoutes, resolvePagesRoutes, typedPagesResolver } from './core';
import { TypedRouterOptions } from './types';

export function parsePageRequest(id: string) {
  const [moduleId, rawQuery] = id.split('?', 2);
  const query = new URLSearchParams(rawQuery);
  const pageId = query.get('id');
  return {
    moduleId,
    query,
    pageId,
  };
}

export default function vitePluginVueTypedRouter({
  outDir = 'src/generated',
  pagesDir = 'src/pages',
}: TypedRouterOptions): Plugin {
  const virtualModuleId = 'virtual:typed-router';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  let config: ResolvedConfig;
  let rootDir: string;
  let srcDir: string;
  let finalOutDir: string;
  let finalPagesDir: string;
  return {
    name: 'vite-plugin-vue-typed-router',
    enforce: 'pre',
    configResolved(config) {
      config = config;
      rootDir = config.root;
      srcDir = resolve(rootDir, 'src');
      finalOutDir = resolve(rootDir, outDir);
      finalPagesDir = resolve(rootDir, pagesDir);
    },
    resolveId(id) {
      if (MODULE_IDS.includes(id)) {
        return `${resolvedVirtualModuleId}?id=${id}`;
      }

      return null;
    },
    async load(id) {
      const { moduleId, pageId } = parsePageRequest(id);

      if (moduleId === resolvedVirtualModuleId && pageId) {
        const routes = await resolvePagesRoutes(finalPagesDir);
        return {
          code: `export default ${normalizeRoutes(routes).routes};`,
          map: null,
        };
      } else if (id === ROUTE_BLOCK_ID_VIRTUAL) {
        return {
          code: 'export default {};',
          map: null,
        };
      }
      return null;
    },

    async configureServer(server) {
      const routes = await resolvePagesRoutes(finalPagesDir);
      await typedPagesResolver({ outDir: finalOutDir, routes, srcDir });
      async function watcherHandler(path: string) {
        if (path.includes(finalPagesDir)) {
          const routes = await resolvePagesRoutes(finalPagesDir);
          await typedPagesResolver({ outDir: finalOutDir, routes, srcDir });
        }
      }
      server.watcher
        .on('unlink', watcherHandler)
        .on('add', watcherHandler)
        .on('change', watcherHandler);
    },
  };
}
