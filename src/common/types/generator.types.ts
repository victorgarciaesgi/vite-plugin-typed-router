export interface ParamDecl {
  key: string;
  type: string;
  required: boolean;
}

export interface RouteParamsDecl {
  name: string;
  params: ParamDecl[];
}

export interface GeneratorOutput {
  /** String template of the exported route object of `__routes.ts` file (contains `as const`) */
  routesObjectTemplate: string;
  /** String template of the injected $routeList in Nuxt plugin  */
  routesDeclTemplate: string;
  /** String array of the all the routes for the Union type  */
  routesList: string[];
  /** Array of RouteParams mapping with routeList  */
  routesParams: RouteParamsDecl[];
}

export interface VitePageConfig {
  component: {
    __file: string;
    __hmrId: string;
  };
  name: string;
  path: string;
  props: boolean;
}
