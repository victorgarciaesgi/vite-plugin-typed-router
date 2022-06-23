import { MODULE_IDS, ROUTE_BLOCK_ID_VIRTUAL } from './core/constants';
import { resolve } from 'pathe';
import type { Plugin } from 'vite';
import { ResolvedConfig } from 'vitest';
import { normalizeRoutes, resolvePagesRoutes, typedPagesResolver } from './core';
import { TypedRouterOptions } from './types';

export type { TypedRouterOptions };

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

export default function vitePluginVueTypedRouter(options?: TypedRouterOptions): Plugin {
  const virtualModuleId = 'virtual:typed-router';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  let srcDir = options?.srcDir ?? 'src';

  const {
    outDir = `${srcDir}/generated`,
    pagesDir = `${srcDir}/pages`,
    printRoutesTree = true,
  } = options ?? {};

  let config: ResolvedConfig;
  let rootDir: string;
  let finalSrcDir: string;
  let finalOutDir: string;
  let finalPagesDir: string;
  return {
    name: 'vite-plugin-typed-router',
    enforce: 'pre',
    configResolved(config) {
      config = config;
      rootDir = config.root;
      finalSrcDir = resolve(rootDir, srcDir);
      finalOutDir = resolve(rootDir, outDir);
      finalPagesDir = resolve(rootDir, pagesDir);
    },
    resolveId(id) {
      if (MODULE_IDS.includes(id)) {
        return `${resolvedVirtualModuleId}?id=${id}`;
      }

      return null;
    },
    api: {
      async getResolvedPagesRoutes() {
        return await resolvePagesRoutes(finalPagesDir);
      },
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
      await typedPagesResolver({
        outDir: finalOutDir,
        routes,
        printRoutesTree,
      });

      async function watcherHandler(path: string) {
        if (path.includes(finalPagesDir)) {
          const routes = await resolvePagesRoutes(finalPagesDir);
          await typedPagesResolver({
            outDir: finalOutDir,
            routes,
            printRoutesTree,
          });
        }
      }
      server.watcher
        .on('unlink', watcherHandler)
        .on('add', watcherHandler)
        .on('change', watcherHandler);
    },
  };
}
