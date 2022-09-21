const fs = require("fs");
const path = require("path");
const glob = require("glob");
const mkdirp = require('mkdirp');
const { PATTERNS, PATHS } = require("./patterns");
const { saveFile, getWebView } = require("./utils");

const { env: { PLUGIN: plugin }} = process;
const pluginsPattern = plugin ? `${PATHS.ROOT}/${plugin}` : PATTERNS.PLUGINS;

const plugins = glob.sync(pluginsPattern);

if (!fs.existsSync('json')) {
  mkdirp.sync('json')
}

plugins.forEach((pluginPath) => {
  const plugin = pluginPath.split(path.sep)[2]

  const content = {
    web_view: getWebView(plugin)
  }

  saveFile(`json/${plugin}.json`, content);
});