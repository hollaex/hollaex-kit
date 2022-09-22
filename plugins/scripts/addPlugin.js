const glob = require("glob");
const path = require("path");
const copydir = require('copy-dir');
const mkdirp = require('mkdirp');
const { PATTERNS, TEMPLATES, PATHS } = require("./patterns");

const { env: { PLUGIN: plugin, TYPE } } = process;
const type = TYPE ? TYPE.toLowerCase() : TYPE;

if (!plugin) {
  console.log('You must pass plugin argument');
  console.log('npm run add-plugin --plugin=PLUGIN_NAME --type=PLUGIN_TYPE');
} else if (!type) {
  console.log('You must pass type argument');
  console.log('npm run add-plugin --plugin=PLUGIN_NAME --type=PLUGIN_TYPE');
} else {
  const plugins = glob.sync(PATTERNS.PLUGINS)
    .reduce((acc, curr) => {
      const pluginName = curr.split(path.sep)[2];
      return [...acc, pluginName];
    }, [])

  if (plugins.includes(plugin)) {
    console.log('This plugin already exists, try another plugin name');
  } else {
    switch (type) {
      case TEMPLATES.RAW.type:
        return (
          mkdirp(`${PATHS.ROOT}/${plugin}/views`)
            .then(() => {
              mkdirp(`${PATHS.ROOT}/${plugin}/${PATHS.SERVER}`)
                .then(() => {
                  copydir.sync(TEMPLATES.RAW.template.VIEW, `${PATHS.ROOT}/${plugin}/views/view`);
                  copydir.sync(TEMPLATES.RAW.template.ASSETS, `${PATHS.ROOT}/${plugin}/assets`);
                  console.log('Plugin has been added successfully');
                })
            })
        );
      case TEMPLATES.PAGE.type:
      case TEMPLATES.VERIFICATION_TAB.type:
      case TEMPLATES.FIAT_WALLET.type:
      case TEMPLATES.KYC.type:
      case TEMPLATES.BANK.type:
      case TEMPLATES.ONRAMP.type:
        return (
          mkdirp(`${PATHS.ROOT}/${plugin}`)
            .then(() => {
              mkdirp(`${PATHS.ROOT}/${plugin}/${PATHS.SERVER}`)
                .then(() => {
                  const [, { template }] = Object.entries(TEMPLATES).find(([, { type: templateType }]) => type === templateType);
                  copydir.sync(template, `${PATHS.ROOT}/${plugin}`);
                  console.log('Plugin has been added successfully');
                })
            })
        );
      case TEMPLATES.SERVER.type:
        return (
          mkdirp(`${PATHS.ROOT}/${plugin}/${PATHS.SERVER}`)
        );
      default:
        return (
          console.log(`type ${type} does not exist, try another type. See doc for supported plugin types.`)
        );
    }
  }
}