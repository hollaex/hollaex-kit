const glob = require("glob");
const path = require("path");
const copydir = require('copy-dir');
const { PATTERNS, PATHS } = require("./patterns")

const { env: { PLUGIN: plugin, WEB_VIEW: view = 'view' } } = process;
const viewsPattern = `${PATHS.ROOT}/${plugin}/views/*`;


if (!plugin) {
  console.log('You must pass plugin argument')
  console.log('npm run add-view --plugin=PLUGIN_NAME');
} else {
  const plugins = glob.sync(PATTERNS.PLUGINS)
    .reduce((acc, curr) => {
      const pluginName = curr.split(path.sep)[2];
      return [...acc, pluginName];
    }, [])

  if (plugins.includes(plugin)) {
    const views = glob.sync(viewsPattern)
      .reduce((acc, curr) => {
        const viewName = curr.split(path.sep)[4];
        return [...acc, viewName];
      }, []);

    if (views.includes(view)) {
      console.log('This view already exists, try another view name');
    } else {
      copydir.sync('src/templates/view', `${PATHS.ROOT}/${plugin}/views/${view}`);
      console.log(`A view has been successfully added to ${plugin} plugin`);
    }
  } else {
    console.log(`Plugin ${plugin} does not exist`);
  }
}