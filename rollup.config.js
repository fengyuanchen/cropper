const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

module.exports = {
  entry: 'src/js/index.js',
  targets: [
    {
      dest: 'dist/cropper.js',
    },
    {
      dest: 'dist/cropper.common.js',
      format: 'cjs',
    },
    {
      dest: 'dist/cropper.esm.js',
      format: 'es',
    },
    {
      dest: 'docs/js/cropper.js',
    },
  ],
  format: 'umd',
  moduleName: 'Cropper',
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
      exclude: '/node_modules/**',
    }),
  ],
};
