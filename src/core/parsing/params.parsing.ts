import { ParamDecl } from '../../types';

const routeParamExtractRegxp = /:(\w+\??)/;
const isParamOptionalRegxp = /(\w+\?$)/;

export function extractRouteParamsFromPath(
  path: string,
  previousParams?: ParamDecl[]
): ParamDecl[] {
  const params: string[] = path.match(routeParamExtractRegxp) ?? [];
  params?.shift();
  let allMergedParams = params.map((m): ParamDecl => {
    const isOptional = isParamOptionalRegxp.test(m);
    return {
      key: isOptional ? m.replace(/\?/g, '') : m,
      type: 'string | number',
      required: !isOptional,
      optionalParam: isOptional,
    };
  });

  if (previousParams?.length) {
    allMergedParams = allMergedParams.concat(
      previousParams.map((m) => {
        const isRequired = path === '' || false;
        return { ...m, required: isRequired };
      })
    );
  }
  return allMergedParams;
}
