import { VitePageConfig } from 'common';

/**
 * @see https://github.com/victorgarciaesgi/nuxt-typed-router/issues/28
 * for edge cases with matching siblings with same parent not in children
 * */
export function extractMatchingSiblings(
  mainRoute: VitePageConfig,
  siblingRoutes?: VitePageConfig[]
): VitePageConfig[] | undefined {
  return siblingRoutes?.filter((s) => {
    const chunkName = extractChunkMain(mainRoute.component?.__file);
    if (chunkName && s.name) {
      const siblingChunkName = extractChunkMain(s.component?.__file);
      if (!siblingChunkName) return false;
      return chunkName === siblingChunkName;
    }
    return false;
  });
}

export function extractUnMatchingSiblings(
  mainRoute: VitePageConfig,
  siblingRoutes?: VitePageConfig[]
): VitePageConfig[] | undefined {
  return siblingRoutes?.filter((s) => {
    const chunkName = extractChunkMain(mainRoute.component?.__file);
    if (chunkName) {
      const siblingChunkName = extractChunkMain(s.component?.__file);
      if (!siblingChunkName) return false;
      return chunkName !== siblingChunkName;
    }
    return false;
  });
}

function extractChunkMain(chunkName?: string): string | undefined {
  let chunkArray = chunkName?.split('/');
  // chunkArray?.pop()?.split('.vue')[0];
  return chunkArray?.join('/');
}

export function extractChunkRouteName(chunkName?: string): string | undefined {
  return chunkName?.split('/')[chunkName.length - 1].split('.vue')[0];
}
