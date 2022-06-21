/**
 * Forked from https://github.com/nuxt/framework/blob/cc72796a1c890ab31842b1a81e2c77430d6a705a/packages/nuxt/src/pages/utils.ts
 * */

import { resolveFiles } from '@nuxt/kit';
import { NuxtPage } from '@nuxt/schema';
import escapeRE from 'escape-string-regexp';
import { genArrayFromRaw, genDynamicImport, genImport, genSafeVariableName } from 'knitwork';
import { extname, normalize, relative } from 'pathe';
import { encodePath } from 'ufo';

type NuxtRoute = Omit<NuxtPage, 'file' | 'children'> & { component: string; children: NuxtRoute[] };

enum SegmentParserState {
  initial,
  static,
  dynamic,
  optional,
  catchall,
}

enum SegmentTokenType {
  static,
  dynamic,
  optional,
  catchall,
}

interface SegmentToken {
  type: SegmentTokenType;
  value: string;
}

export async function resolvePagesRoutes(pagesDir: string): Promise<NuxtRoute[]> {
  const files = await resolveFiles(pagesDir, `**/*{vue,ts,js}`);
  // Sort to make sure parent are listed first
  files.sort();
  const allRoutes = generateRoutesFromFiles(files, pagesDir);

  return uniqueBy(allRoutes, 'path');
}

export function generateRoutesFromFiles(files: string[], pagesDir: string): NuxtRoute[] {
  const routes: NuxtRoute[] = [];

  for (const file of files) {
    const segments = relative(pagesDir, file)
      .replace(new RegExp(`${escapeRE(extname(file))}$`), '')
      .split('/');

    const route: NuxtRoute = {
      name: '',
      path: '',
      component: file,
      children: [],
    };

    // Array where routes should be added, useful when adding child routes
    let parent = routes;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      const tokens = parseSegment(segment);
      const segmentName = tokens.map(({ value }) => value).join('');
      const isSingleSegment = segments.length === 1;

      // ex: parent/[slug].vue -> parent-slug
      route.name += (route.name && '-') + segmentName;

      // ex: parent.vue + parent/child.vue
      const child = parent.find((parentRoute) => parentRoute.name === route.name);
      if (child) {
        parent = child.children ?? [];
        route.path = '';
      } else if (segmentName === '404' && isSingleSegment) {
        route.path += '/:catchAll(.*)*';
      } else if (segmentName === 'index' && !route.path) {
        route.path += '/';
      } else if (segmentName !== 'index') {
        route.path += getRoutePath(tokens);
      }
    }

    parent.push(route);
  }

  return prepareRoutes(routes);
}

function getRoutePath(tokens: SegmentToken[]): string {
  return tokens.reduce((path, token) => {
    return (
      path +
      (token.type === SegmentTokenType.optional
        ? `:${token.value}?`
        : token.type === SegmentTokenType.dynamic
        ? `:${token.value}`
        : token.type === SegmentTokenType.catchall
        ? `:${token.value}(.*)*`
        : encodePath(token.value))
    );
  }, '/');
}

const PARAM_CHAR_RE = /[\w\d_.]/;

function parseSegment(segment: string) {
  let state: SegmentParserState = SegmentParserState.initial;
  let i = 0;

  let buffer = '';
  const tokens: SegmentToken[] = [];

  function consumeBuffer() {
    if (!buffer) {
      return;
    }
    if (state === SegmentParserState.initial) {
      throw new Error('wrong state');
    }

    tokens.push({
      type:
        state === SegmentParserState.static
          ? SegmentTokenType.static
          : state === SegmentParserState.dynamic
          ? SegmentTokenType.dynamic
          : state === SegmentParserState.optional
          ? SegmentTokenType.optional
          : SegmentTokenType.catchall,
      value: buffer,
    });

    buffer = '';
  }

  while (i < segment.length) {
    const c = segment[i];

    switch (state) {
      case SegmentParserState.initial:
        buffer = '';
        if (c === '[') {
          state = SegmentParserState.dynamic;
        } else {
          i--;
          state = SegmentParserState.static;
        }
        break;

      case SegmentParserState.static:
        if (c === '[') {
          consumeBuffer();
          state = SegmentParserState.dynamic;
        } else {
          buffer += c;
        }
        break;

      case SegmentParserState.catchall:
      case SegmentParserState.dynamic:
      case SegmentParserState.optional:
        if (buffer === '...') {
          buffer = '';
          state = SegmentParserState.catchall;
        }
        if (c === '[' && state === SegmentParserState.dynamic) {
          state = SegmentParserState.optional;
        }
        if (
          c === ']' &&
          (state !== SegmentParserState.optional || buffer[buffer.length - 1] === ']')
        ) {
          if (!buffer) {
            throw new Error('Empty param');
          } else {
            consumeBuffer();
          }
          state = SegmentParserState.initial;
        } else if (PARAM_CHAR_RE.test(c)) {
          buffer += c;
        } else {
          // eslint-disable-next-line no-console
          // console.debug(`[pages]Ignored character "${c}" while building param "${buffer}" from "segment"`)
        }
        break;
    }
    i++;
  }

  if (state === SegmentParserState.dynamic) {
    throw new Error(`Unfinished param "${buffer}"`);
  }

  consumeBuffer();

  return tokens;
}

function prepareRoutes(routes: NuxtRoute[], parent?: NuxtRoute) {
  for (const route of routes) {
    // Remove -index
    if (route.name) {
      route.name = route.name.replace(/-index$/, '');
    }

    // Remove leading / if children route
    if (parent && route.path.startsWith('/')) {
      route.path = route.path.slice(1);
    }

    if (route.children?.length) {
      route.children = prepareRoutes(route.children, route);
    }

    if (route.children?.find((childRoute) => childRoute.path === '')) {
      delete route.name;
    }
  }

  return routes;
}

export function normalizeRoutes(
  routes: NuxtRoute[],
  metaImports: Set<string> = new Set()
): { imports: Set<string>; routes: string } {
  return {
    imports: metaImports,
    routes: genArrayFromRaw(
      routes.map((route) => {
        const file = normalize(route.component);
        const metaImportName = genSafeVariableName(file) + 'Meta';
        metaImports.add(genImport(`${file}?macro=true`, [{ name: 'meta', as: metaImportName }]));
        return {
          ...Object.fromEntries(
            Object.entries(route).map(([key, value]) => [key, JSON.stringify(value)])
          ),
          children: route.children ? normalizeRoutes(route.children, metaImports).routes : [],
          component: genDynamicImport(file),
        };
      })
    ),
  };
}

function uniqueBy<T, K extends keyof T>(arr: T[], key: K) {
  const res: T[] = [];
  const seen = new Set<T[K]>();
  for (const item of arr) {
    if (seen.has(item[key])) {
      continue;
    }
    seen.add(item[key]);
    res.push(item);
  }
  return res;
}
