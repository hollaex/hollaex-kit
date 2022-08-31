const fs = require("fs");
const path = require("path");
const beautify = require("json-beautify");
const glob = require("glob");
const merge = require("lodash.merge");
const { PLUGINS_PATH, PATHS, FILES, PATTERNS } = require("./patterns");

const saveFile = (output, content) => {
  fs.writeFileSync(output, beautify(content, null, 4, 100));
}

const readFile = (pathname) => {
  try {
    const contents = fs.readFileSync(pathname, "utf-8")
    return JSON.parse(contents);
  } catch(err) {
    console.log(err);
    return {};
  }
}

const getBundlePath = (pathname) => {
  const dir = pathname.split(path.sep);
  const pluginName = dir[2];
  const bundleName = `${dir[2]}__${dir[4]}`;

  if(process.env.NODE_ENV === "development") {
    return `http://localhost:8080/${bundleName}.js`
  }

  const configFile = path.resolve(__dirname, '..', PATHS.ROOT, pluginName, PATHS.SERVER, FILES.CONFIG);
  const { version = 0 } = fs.existsSync(configFile) ? readFile(configFile) : {};

  return `${PLUGINS_PATH}/${pluginName}/v${version}/${bundleName}.js`
}

const getWebView = (plugin) => {
  const assetsPath = `${PATHS.ROOT}/${plugin}/${PATHS.ASSETS}`;
  const viewsPattern = `${PATHS.ROOT}/${plugin}/${PATTERNS.VIEW}`;

  let assetsAdded = false;
  const assets = {
    strings: readFile(`${assetsPath}/${FILES.STRINGS}`),
    icons: readFile(`${assetsPath}/${FILES.ICONS}`),
  };

  const webViews = glob.sync(viewsPattern, { noglobstar: true })
    .reduce((acc, curr) => {
      const view = readFile(`${path.dirname(curr)}/${FILES.VIEW}`);
      const generatedView = {
        src: getBundlePath(curr),
        ...(assetsAdded ? {} : { meta: { ...assets }}),
      };

      const webView = merge({}, generatedView, view);

      assetsAdded = true;

      return [...acc, webView]
    }, []);

  return webViews.length !== 0 ? webViews : null;
}

module.exports = {
  saveFile,
  getWebView,
}