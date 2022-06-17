import { VitePageConfig } from '../types';

/**
 * Mutate the list of routes for edge case of default routes
 * @deprecated waiting for Nuxt 3 behaviour
 * */
export function transformRouteDefault(existingRoutes: VitePageConfig[], stripAtFromName: boolean) {
  const recursiveMatch = (route: VitePageConfig, parent?: VitePageConfig) => {
    if (route.path && route.path.startsWith('@') && !!parent) {
      route.path = route.path.split('@')[1];
      if (stripAtFromName && route.name) {
        const [left, right] = route.name?.split('@');
        route.name = `${left}${right}`;
      }
      const parentsChildren = parent.children;
      if (parentsChildren) {
        let defaultName = null;
        if (route.name) {
          defaultName = route.name;
        } else if (route.children) {
          const child = route.children.find((f: any) => f.path === '');
          if (child) {
            defaultName = child.name;
          }
        } else {
          defaultName = null;
        }
        parentsChildren.push({
          path: '',
          name: `${parent.name}-index`,
          redirect: {
            ...(defaultName && { name: defaultName }),
            ...(!defaultName && { path: route.path }),
          },
        });
        delete parent.name;
      }
    }
    if (route.children) {
      route.children.forEach((child) => recursiveMatch(child, route));
    }
  };
  existingRoutes.map((route) => recursiveMatch(route));
}
