import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'index',
      file: pkg.unpkg,
      format: 'umd'
    },
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: true
      }),
      commonjs(),
      builtins()
    ]
  },

  {
    input: 'src/index.js',
    external: [
      'base-x',
      'buffer',
      'bech32',
      'hash.js/lib/hash/sha/256'
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ]
  }
];
