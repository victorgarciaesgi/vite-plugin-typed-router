import { fileURLToPath } from 'url';
import chalk from 'chalk';
import logSymbols from 'log-symbols';
import { dirname, resolve } from 'pathe';
import { saveRouteFiles } from '../utils';
import { constructRouteMap } from './main.generator';
import {
  createDeclarationRoutesFile,
  createRuntimeHookFile,
  createRuntimeIndexFile,
  createRuntimePluginFile,
  createRuntimeRoutesFile,
} from './output.generator';

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

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

      console.log(logSymbols.success, `[typed-router] Routes definitions generated`);
    } else {
      console.log(
        logSymbols.warning,
        chalk.yellow(
          `[typed-router] No routes defined. Check if your ${chalk.underline(
            chalk.bold('pages')
          )} folder exists and remove ${chalk.underline(chalk.bold('app.vue'))}`
        )
      );
    }
  } catch (e) {
    console.error(chalk.red('Error while generating routes definitions model'), '\n' + e);
  }
}
