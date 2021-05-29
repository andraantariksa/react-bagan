import resolve from '@rollup/plugin-node-resolve';

import pkg from '../package.json';

const extensions = ['.js', '.ts', '.tsx', '.json'];
const plugins = [resolve({extensions})];

const cjs = {
  file: pkg.main,
  format: 'cjs',
  exports: 'named',
};
const esm = {
  file: pkg.module,
  format: 'esm',
  exports: 'named',
};

export default {
  input: 'src',
  output: [cjs, esm],
  external: Object.keys(pkg.peerDependencies),
  plugins,
};
