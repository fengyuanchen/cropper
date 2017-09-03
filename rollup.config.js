const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

module.exports = {
  input: 'src/js/index.js',
  output: [
    {
      file: 'dist/cropper.js',
      format: 'umd',
    },
    {
      file: 'dist/cropper.common.js',
      format: 'cjs',
    },
    {
      file: 'dist/cropper.esm.js',
      format: 'es',
    },
    {
      file: 'docs/js/cropper.js',
      format: 'umd',
    },
  ],
  name: 'Cropper',
  external: ['jquery'],
  globals: {
    jquery: 'jQuery',
  },
  plugins: [
    commonjs(),
    nodeResolve({
      jsnext: true,
    }),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
