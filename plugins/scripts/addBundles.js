const fs = require("fs");
const path = require("path");
const glob = require("glob");
const mkdirp = require('mkdirp');
const { PATTERNS, PATHS } = require("./patterns");

const bundles = glob.sync(PATTERNS.BUNDLES);

bundles.forEach((pathname) => {
  const bundle = path.basename(pathname, '.js');
  const [plugin, view] = bundle.split('__');
  const pluginPath = path.resolve(__dirname, '..', PATHS.ROOT, plugin);
  const bundlesPath = path.resolve(__dirname, '..', PATHS.ROOT, plugin, PATHS.BUNDLES);

  if (view) {
    const destinationPath = path.resolve(bundlesPath, `${bundle}.js`);

    if (!fs.existsSync(pluginPath)) {
      mkdirp.sync(pluginPath);
    }

    if (!fs.existsSync(bundlesPath)) {
      mkdirp.sync(bundlesPath);
    }

    fs.copyFileSync(pathname, destinationPath);
  }
})