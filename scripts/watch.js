const path = require('path');
const rollup = require('rollup');
const babel = require('@rollup/plugin-babel');
const nodeResolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const terser = require('@rollup/plugin-terser');
const banner = require('bannerjs');
require('colors-cli/toxic');

const watchOptions = {
  input: 'src/main.js',
  output: [
    { file: 'dist/store.common.js', name: 'store', format: 'cjs', exports: 'default', banner: banner.multibanner() },
    { file: 'dist/store.js', name: 'store', format: 'umd', banner: banner.multibanner() },
    { file: 'dist/store.esm.js', name: 'store', format: 'es', banner: banner.multibanner() },
    {
      file: 'dist/store.min.js',
      name: 'store',
      banner: banner.onebanner(),
      format: 'iife',
      plugins: [terser()]
    },
  ],
  plugins: [
    nodeResolve(), // so Rollup can find `ms`
    commonjs(), // so Rollup can convert `ms` to an ES module
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**', // 只编译我们的源代码
    }),
  ],
};
const watcher = rollup.watch(watchOptions);

watcher.on('event', (event) => {
  // event.code can be one of:
  //   START        — the watcher is (re)starting
  //   BUNDLE_START — building an individual bundle
  //   BUNDLE_END   — finished building a bundle
  //   END          — finished building all bundles
  //   ERROR        — encountered an error while bundling
  //   FATAL        — encountered an unrecoverable error
  if (event.code === 'BUNDLE_END') {
    event.output.forEach((item) => {
      console.log('bundles '.x39 + `${event.input} → ${item.replace(process.cwd() + path.sep, '')}`.blue_bt);
    });
    console.log(`duration ${event.duration}ms\n`.green);
  } else if (event.code === 'END') {
    console.log('waiting for changes... ');
  }
});

// stop watching
// watcher.close();
