import { RouteParamsDecl } from '../../types';
import { signatureTemplate, staticDeclarations, staticDeclImports } from './static.output';

export function createRuntimeHookFile(routesDeclTemplate: string): string {
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
    /** Contains a typed dictionnary of all your route names (for syntax sugar) */
    routes: RouteListDecl
  } => {
    const router = useRouter();

    const routesList = ${routesDeclTemplate};

    return {
      router: router,
      routes: routesList,
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
}: {
  routesList: string[];
  routesObjectTemplate: string;
}): string {
  return `
    ${signatureTemplate}

    export const routesNames = ${routesObjectTemplate};

    ${createTypedRouteListExport(routesList)}
  `;
}

export function createDeclarationRoutesFile({
  routesDeclTemplate,
  routesList,
  routesParams,
}: {
  routesDeclTemplate: string;
  routesList: string[];
  routesParams: RouteParamsDecl[];
}): string {
  return `
    ${signatureTemplate}
    ${staticDeclImports}

    export type RouteListDecl = ${routesDeclTemplate};

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
