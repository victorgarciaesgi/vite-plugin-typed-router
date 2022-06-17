import type { Plugin } from 'vite';
import { PluginOptions, routeHook } from '../common';
import PluginPages from 'vite-plugin-pages';
import type { PageContext, ReactRoute, SolidRoute, UserOptions, VueRoute } from 'vite-plugin-pages';

export default function ({
  pluginPagesOptions = {},
  outDir = './generated',
  routesObjectName = 'routerPagesNames',
}: PluginOptions): Plugin {
  const { onRoutesGenerated: customOnRoutesGenerated, ...rest } = pluginPagesOptions;
  const finalOptions: UserOptions = {
    ...rest,
    async onRoutesGenerated(routes) {
      console.log(routes);

      if (customOnRoutesGenerated) {
        await customOnRoutesGenerated(routes);
      }
      await routeHook({ outDir, routesObjectName, routes, srcDir: process.cwd() });
    },
  };
  return (PluginPages as any)['default'](finalOptions);
}
