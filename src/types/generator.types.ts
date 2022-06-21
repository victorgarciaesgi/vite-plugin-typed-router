import { Router, RouteRecordRaw } from 'vue-router';

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
  /** String template of the routes tree  */
  routesDeclTemplate: string;
  /** String array of the all the routes for the Union type  */
  routesList: string[];
  /** Array of RouteParams mapping with routeList  */
  routesParams: RouteParamsDecl[];
}
