/**
 * generates:
 *  - dist/main.js
 *  - dist/manifest.json
 *  - dist/webpack-bundle-analyzer-report.html
 */
const webpack = require("webpack");
const fs = require('fs');
const WebpackAssetsManifest = require("webpack-assets-manifest");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const glob = require("glob")
const path = require("path")
const remoteComponentConfig = require("./remote-component.config").resolve;

const generateEntires = (plugin) => {
  const pattern = `src/plugins/${plugin ? plugin : '**'}/views/**/index.js`;
  const entry = glob.sync(pattern, { noglobstar: true })
    .reduce((x, y) => {
      const dir = y.split(path.sep);

      if (fs.existsSync(y)) {
        return Object.assign(x, {
          [`${dir[2]}__${dir[4]}`]: `./${y}`,
        })
      } else {
        return Object.assign(x, {})
      }

    }, {});

  if ( Object.keys(entry).length === 0) {
    process.exit();
  } else {
    return entry;
  }
}

const externals = Object.keys(remoteComponentConfig).reduce(
  (obj, key) => ({ ...obj, [key]: key }),
  {}
);

module.exports = (env) => {
  const { plugin } = env;
  const entry = generateEntires(plugin);
  return {
    plugins: [
      new webpack.EnvironmentPlugin({
        "process.env.NODE_ENV": process.env.NODE_ENV
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        openAnalyzer: false,
        reportFilename: "webpack-bundle-analyzer-report.html"
      }),
      new WebpackAssetsManifest()
    ],
    entry,
    output: {
      libraryTarget: "commonjs"
    },
    externals: {
      ...externals,
      "remote-component.config.js": "remote-component.config.js"
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.(sass|less|css)$/,
          use: ["style-loader", "css-loader"]
        },
      ]
    },
    resolve: {
      alias: {
        "components": path.resolve("./src/components"),
        "utils": path.resolve("./src/utils"),
        "store": path.resolve("./src/store"),
        "constants": path.resolve("./src/constants")
      }
    }
  }
};
