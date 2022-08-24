const fs = require("fs");
const path = require("path");
const glob = require("glob");
const merge = require("lodash.merge");
const mkdirp = require('mkdirp');
const { PATTERNS, FILES, PATHS } = require("./patterns");
const { readFile, saveFile, getBundlePath } = require("./utils");

const { env: { PLUGIN: plugin }} = process;
const pluginsPattern = plugin ? `${PATHS.ROOT}/${plugin}` : PATTERNS.PLUGINS;

const plugins = glob.sync(pluginsPattern);

if (!fs.existsSync('json')) {
  mkdirp.sync('json')
}

plugins.forEach(pluginPath => {
  const pluginName = pluginPath.split(path.sep)[2]
  const assetsPath = `${PATHS.ROOT}/${pluginName}/${PATHS.ASSETS}`
  const pluginPattern = `${PATHS.ROOT}/${pluginName}/${PATTERNS.VIEW}`;

  let assetsAdded = false;
  const assets = {
    strings: readFile(`${assetsPath}/${FILES.STRINGS}`),
    icons: readFile(`${assetsPath}/${FILES.ICONS}`),
  };

  const webViews = glob.sync(pluginPattern, { noglobstar: true })
    .reduce((acc, curr) => {
      const view = readFile(`${path.dirname(curr)}/${FILES.VIEW}`);
      const generatedView = {
        src: getBundlePath(curr),
        ...(assetsAdded ? {} : { meta: { ...assets }}),
      };

      // development
      // const webView = merge({}, view, generatedView);
      const webView = merge({}, generatedView, view);

      assetsAdded = true;

      return [...acc, webView]
    }, []);

  const plugin = {
    web_view: webViews
  }

  saveFile(`json/${pluginName}.json`, plugin);
})