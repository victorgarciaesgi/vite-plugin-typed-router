import chalk from 'chalk';
import { saveRouteFiles } from '../../utils';
import {
  createDeclarationRoutesFile,
  createRuntimeHookFile,
  createRuntimeIndexFile,
  createRuntimeRoutesFile,
} from '../output/runtime.output';
import { constructRouteMap } from './main';

export async function typedPagesResolver({
  outDir,
  routes,
  printRoutesTree,
}: {
  outDir: string;
  routes: any[];
  printRoutesTree: boolean;
}): Promise<void> {
  try {
    if (routes.length) {
      const { routesDeclTemplate, routesList, routesObjectTemplate, routesParams } =
        constructRouteMap(routes);

      await Promise.all([
        saveRouteFiles(
          outDir,
          '__useTypedRouter.ts',
          createRuntimeHookFile(routesDeclTemplate, printRoutesTree)
        ),
        saveRouteFiles(
          outDir,
          `__routes.ts`,
          createRuntimeRoutesFile({ routesList, routesObjectTemplate, printRoutesTree })
        ),
        saveRouteFiles(
          outDir,
          `typed-router.d.ts`,
          createDeclarationRoutesFile({ routesDeclTemplate, routesParams, printRoutesTree })
        ),
        saveRouteFiles(outDir, 'index.ts', createRuntimeIndexFile()),
      ]);

      console.log(
        // logSymbols.success,
        `[plugin-typed-router] Routes definitions generated`
      );
    } else {
      console.log(
        // logSymbols.warning,
        chalk.yellow(
          `[plugin-typed-router] No routes defined. Check if your ${chalk.underline(
            chalk.bold('pages')
          )} folder exists and remove ${chalk.underline(chalk.bold('app.vue'))}`
        )
      );
    }
  } catch (e) {
    console.error(chalk.red('Error while generating routes definitions model'), '\n' + e);
  }
}
