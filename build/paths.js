const path = require('path');
const fs = require('fs');

const appRoot = fs.realpathSync(process.cwd());

const rootResolve = path.resolve.bind(path, appRoot);

module.exports = {
  root: appRoot,
  src: rootResolve('src'),
  popupHtml: rootResolve('src/popup/index.html'),
  notificationHtml: rootResolve('src/notification/index.html'),
  dist: rootResolve('dist'),

  rootResolve,
}
