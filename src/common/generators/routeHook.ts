import { fileURLToPath } from 'url';
import pc from 'picocolors';
import { saveRouteFiles } from '../utils';
import { constructRouteMap } from './main.generator';
import {
  createDeclarationRoutesFile,
  createRuntimeHookFile,
  createRuntimeIndexFile,
  createRuntimePluginFile,
  createRuntimeRoutesFile,
} from './output.generator';

export async function routeHook({
  outDir,
  routes,
  routesObjectName,
  srcDir,
}: {
  outDir: string;
  routes: any[];
  routesObjectName: string;
  srcDir: string;
}) {
  try {
    if (routes.length) {
      const { routesDeclTemplate, routesList, routesObjectTemplate, routesParams } =
        constructRouteMap(routes);

      // const pluginName = '__typed-router.ts';

      // nuxt.hook('build:done', async () => {
      //   const pluginFolder = `${srcDir}/plugins`;
      //   await saveRouteFiles(pluginFolder, pluginName, createRuntimePluginFile(routesDeclTemplate));
      // });

      await Promise.all([
        saveRouteFiles(outDir, '__useTypedRouter.ts', createRuntimeHookFile(routesDeclTemplate)),
        saveRouteFiles(
          outDir,
          `__routes.ts`,
          createRuntimeRoutesFile({ routesList, routesObjectTemplate, routesObjectName })
        ),
        saveRouteFiles(
          outDir,
          `typed-router.d.ts`,
          createDeclarationRoutesFile({ routesDeclTemplate, routesList, routesParams })
        ),
        saveRouteFiles(outDir, 'index.ts', createRuntimeIndexFile()),
      ]);

      console.log(
        // logSymbols.success,
        `[plugin-typed-pages] Routes definitions generated`
      );
    } else {
      console.log(
        // logSymbols.warning,
        pc.yellow(
          `[plugin-typed-pages] No routes defined. Check if your ${pc.underline(
            pc.bold('pages')
          )} folder exists and remove ${pc.underline(pc.bold('app.vue'))}`
        )
      );
    }
  } catch (e) {
    console.error(pc.red('Error while generating routes definitions model'), '\n' + e);
  }
}
