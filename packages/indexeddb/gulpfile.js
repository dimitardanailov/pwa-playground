const { src, dest, watch, series } = require('gulp');

console.log('here ...');

const { APP_DIR, DIST_DIR } = require('./utils/folders');

function copyServiceWorker() {
  return src(`${APP_DIR}/sw.js`).pipe(dest(DIST_DIR));
}

exports.default = series(copyServiceWorker);

exports.watch = function() {
  watch(`${APP_DIR}/sw.js`, copyServiceWorker);
};
