import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import typescript2 from 'rollup-plugin-typescript2';
import jsx from 'acorn-jsx';
import dts from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';

import pkg from '../package.json';

const extensions = ['.js', '.ts', '.tsx', '.json'];
const plugins = [resolve({extensions}), commonjs(), typescript()];

const cjs = {
  file: pkg.main,
  format: 'cjs',
  exports: 'named'
};
const esm = {
  file: pkg.module,
  format: 'esm',
  exports: 'named'
};

export default [
  {
    input: 'src/index.ts',
    output: [cjs, esm],
    acornInjectPlugins: [jsx()],
    external: Object.keys(pkg.peerDependencies).concat(
      Object.keys(pkg.dependencies),
    ),
    plugins,
  },
  {
    input: 'src/index.ts',
    output: [{file: 'dist/type/index.d.ts'}],
    plugins: [typescript2()]
  },
  {
    input: 'dist/type/index.d.ts',
    output: [{file: 'dist/index.d.ts', format: 'es'}],
    plugins: [dts()],
  }
];
