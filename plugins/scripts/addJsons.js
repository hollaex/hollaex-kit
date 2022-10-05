const fs = require("fs");
const path = require("path");
const glob = require("glob");
const mkdirp = require('mkdirp');
const { PATTERNS, FILES, PATHS } = require("./patterns");

const jsons = glob.sync(PATTERNS.JSONS);

jsons.forEach((pathname) => {
  const plugin = path.basename(pathname, '.json');
  const pluginPath = path.resolve(__dirname, '..', PATHS.ROOT, plugin);
  const serverPath = path.resolve(__dirname, '..', PATHS.ROOT, plugin, PATHS.SERVER);
  const destinationPath = path.resolve(__dirname, '..', PATHS.ROOT, plugin, PATHS.SERVER, FILES.WEB_VIEW);

  if (!fs.existsSync(pluginPath)) {
    mkdirp.sync(pluginPath);
  }

  if (!fs.existsSync(serverPath)) {
    mkdirp.sync(serverPath);
  }

  fs.copyFileSync(pathname, destinationPath);
})