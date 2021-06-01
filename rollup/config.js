import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import jsx from 'acorn-jsx';

import pkg from '../package.json';

const extensions = ['.js', '.ts', '.tsx', '.json'];
const plugins = [resolve({extensions}), commonjs(), typescript()];

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
  acornInjectPlugins: [jsx()],
  external: Object.keys(pkg.peerDependencies).concat(
    Object.keys(pkg.dependencies),
  ),
  plugins,
};
