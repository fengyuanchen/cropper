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
      dest: 'docs/js/cropper.js',
    },
  ],
  format: 'umd',
  moduleName: 'Cropper',
  external: ['jquery'],
  globals: {
    jquery: '$',
  },
  plugins: [
    babel({
      exclude: '/node_modules/**',
    }),
    commonjs(),
    nodeResolve({
      jsnext: true,
    }),
  ],
};
