import { RouteParamsDecl } from '../../types';
import { signatureTemplate, staticDeclarations, staticDeclImports } from './static.output';

export function createRuntimeHookFile(
  routesDeclTemplate: string,
  printRoutesTree: boolean
): string {
  return `
  ${signatureTemplate}
  import { useRouter } from 'vue-router';
  import { TypedRouter, RouteListDecl } from './typed-router';

  /** Returns instances of $typedRouter and $routesList fully typed to use in your components or your Vuex/Pinia store
   * 
   * @exemple
   * 
   * \`\`\`ts
   * const { router, routes } = useTypedRouter();
   * \`\`\`
   */
  export const useTypedRouter = (): {
    /** Export of $router with type check */
    router: TypedRouter,
    ${
      printRoutesTree
        ? `
    /** Contains a typed dictionnary of all your route names (for syntax sugar) */
    routes: RouteListDecl
    `
        : ''
    }
  } => {
    const router = useRouter();

    ${printRoutesTree ? `const routesList = ${routesDeclTemplate};` : ''} 

    return {
      router: router,
      ${printRoutesTree ? 'routes: routesList,' : ''}
    } as any;
  };

  `;
}

export function createRuntimeIndexFile(): string {
  return `
  ${signatureTemplate}
  export * from './__routes';
  export * from './__useTypedRouter';
  `;
}

export function createRuntimeRoutesFile({
  routesList,
  routesObjectTemplate,
  printRoutesTree,
}: {
  routesList: string[];
  routesObjectTemplate: string;
  printRoutesTree: boolean;
}): string {
  return `
    ${signatureTemplate}

    ${printRoutesTree ? `export const routesNames = ${routesObjectTemplate};` : ''}

    ${createTypedRouteListExport(routesList)}
  `;
}

export function createDeclarationRoutesFile({
  routesDeclTemplate,
  routesParams,
  printRoutesTree,
}: {
  routesDeclTemplate: string;
  routesParams: RouteParamsDecl[];
  printRoutesTree: boolean;
}): string {
  return `
    ${signatureTemplate}
    ${staticDeclImports}

    ${printRoutesTree ? `export type RouteListDecl = ${routesDeclTemplate};` : ''}

    ${createTypedRouteParamsExport(routesParams)}

    ${staticDeclarations}
  `;
}

export function createTypedRouteListExport(routesList: string[]): string {
  return `export type TypedRouteList = ${routesList.map((m) => `'${m}'`).join('|\n')}`;
}

export function createTypedRouteParamsExport(routesParams: RouteParamsDecl[]): string {
  return `export type TypedRouteParams = {
    ${routesParams
      .map(
        ({ name, params }) =>
          `"${name}": ${
            params.length
              ? `{
          ${params
            .map(
              ({ key, required, type, optionalParam }) =>
                `"${key}"${required && !optionalParam ? '' : '?'}: ${type}`
            )
            .join(',\n')}
        }`
              : 'never'
          }`
      )
      .join(',\n')}
  }`;
}
