import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  declaration: true,
  rollup: {
    emitCJS: true,
    cjsBridge: true,
  },
  entries: ['src/index'],
  externals: ['vue', 'lodash-es', 'log-symbols', 'mkdirp', 'pathe', 'prettier'],
});
