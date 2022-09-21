const fs = require('fs');
const path = require('path');
const uglifyEs = require('uglify-es');
const mkdirp = require('mkdirp');
const { minify: htmlMinify } = require('html-minifier-terser');
const { FILES, PATHS } = require('./patterns');
const { getWebView } = require('./utils')

const { env: { PLUGIN: plugin } } = process;

if (!fs.existsSync('config')) {
  mkdirp.sync('config')
}

if (!plugin) {
  console.error('No plugin name given');
  process.exit(1);
}

const pluginPath = path.resolve(__dirname, '..', PATHS.ROOT, plugin, PATHS.SERVER);

if (!fs.existsSync(pluginPath)) {
  console.error(`Plugin ${plugin} does not exist`);
  process.exit(1);
}

const scriptPath = path.resolve(pluginPath, FILES.SCRIPT);
const adminViewPath = path.resolve(pluginPath, FILES.ADMIN_VIEW);

console.log(`Generating plugin JSON object for plugin ${plugin}...\n`);

const config = fs.readFileSync(path.resolve(pluginPath, FILES.CONFIG));
let script = null;
let admin_view = null;

if (fs.existsSync(scriptPath)) {
  const rawScript = fs.readFileSync(scriptPath, 'utf-8');
  script = uglifyEs.minify(rawScript);

  if (script.error) {
    console.error('Error occured while minifying script\n');
    console.error(script.error);
    process.exit(1);
  }

  script = script.code;
}

if (fs.existsSync(adminViewPath)) {
  const rawAdminView = fs.readFileSync(adminViewPath, 'utf-8');

  try {
    admin_view = htmlMinify(rawAdminView, {
      minifyJS: true,
      minifyCSS: true,
      collapseWhitespace: true
    });
  } catch (err) {
    console.error('Error occured while minifying admin_view\n');
    console.error(err);
    process.exit(1);
  }
}

const pluginJson = JSON.stringify({
  ...JSON.parse(config),
  script,
  admin_view,
  web_view: getWebView(plugin)
}, null, '\t');

fs.writeFileSync('config/config.json', pluginJson);

console.log(pluginJson);

process.exit(0);