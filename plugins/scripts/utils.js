const fs = require("fs");
const path = require("path");
const beautify = require("json-beautify");
const { PLUGINS_PATH, PATHS, FILES } = require("./patterns");

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

module.exports = {
  saveFile,
  readFile,
  getBundlePath,
}