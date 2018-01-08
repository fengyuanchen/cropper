const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const pkg = require('./package');

const now = new Date();

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
    nodeResolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  banner: `/*!
 * Cropper v${pkg.version}
 * https://github.com/${pkg.repository}
 *
 * Copyright (c) 2014-${now.getFullYear()} ${pkg.author.name}
 * Released under the ${pkg.license} license
 *
 * Date: ${now.toISOString()}
 */
`,
};
