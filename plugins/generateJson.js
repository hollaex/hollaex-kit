const fs = require('fs');
const path = require('path');
const uglifyEs = require('uglify-es');
const { minify: htmlMinify } = require('html-minifier-terser');
const { FILES, PATHS } = require('./scripts/patterns');

const { env: { PLUGIN: plugin } } = process;

if (!plugin) {
	console.error('No plugin name given');
	process.exit(1);
}

const pluginPath = path.resolve(__dirname, PATHS.ROOT, plugin, PATHS.SERVER);

if (!fs.existsSync(pluginPath)) {
	console.error(`Plugin ${plugin} does not exist`);
	process.exit(1);
}

const scriptPath = path.resolve(pluginPath, FILES.SCRIPT);
const adminViewPath = path.resolve(pluginPath, FILES.ADMIN_VIEW);
const webViewPath = path.resolve(pluginPath, FILES.WEB_VIEW);

console.log(`Generating plugin JSON object for plugin ${plugin}...\n`);

const config = fs.readFileSync(path.resolve(pluginPath, FILES.CONFIG));
let script = null;
let admin_view = null;
let web_view = null;

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

if (fs.existsSync(webViewPath)) {
	const web_view_json = fs.readFileSync(webViewPath);
	const { web_view: view } = JSON.parse(web_view_json);
	web_view = view
}

const pluginJson = JSON.stringify({
	...JSON.parse(config),
	script,
	admin_view,
	web_view
}, null, '\t');

const finalJsonPath = path.resolve(pluginPath, `${plugin}.json`);

fs.writeFileSync(finalJsonPath, pluginJson);

console.log(pluginJson);

process.exit(0);