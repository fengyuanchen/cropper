const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const pkg = require('./package');

const now = new Date();
const banner = `/*!
 * Cropper v${pkg.version}
 * https://github.com/${pkg.repository}
 *
 * Copyright (c) 2014-${now.getFullYear()} ${pkg.author.name}
 * Released under the ${pkg.license} license
 *
 * Date: ${now.toISOString()}
 */
`;

module.exports = {
  input: 'src/index.js',
  output: [
    {
      banner,
      file: 'dist/cropper.js',
      format: 'umd',
      name: 'Cropper',
      globals: {
        jquery: 'jQuery',
      },
    },
    {
      banner,
      file: 'dist/cropper.common.js',
      format: 'cjs',
    },
    {
      banner,
      file: 'dist/cropper.esm.js',
      format: 'es',
    },
    {
      banner,
      file: 'docs/js/cropper.js',
      format: 'umd',
      name: 'Cropper',
      globals: {
        jquery: 'jQuery',
      },
    },
  ],
  external: ['jquery'],
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      plugins: ['external-helpers'],
    }),
  ],
};
