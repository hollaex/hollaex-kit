/* global process */
module.exports = function (config) {
    config.set({
        browsers: process.env.CONTINUOUS_INTEGRATION ?
            [ 'Firefox' ] :
            [
                'PhantomJS',
                'Chrome',
                'ChromeCanary',
                'Firefox',
                'Opera',
                'Safari'
            ],
        singleRun: true,
        browserNoActivityTimeout: 30000,
        frameworks: [ 'mocha' ],
        files: [

            // This one is needed for testing in PhantomJS
            'https://raw.githubusercontent.com/es-shims/es5-shim/master/es5-shim.js',
            './__tests__/tests.webpack.js'
        ],
        preprocessors: {
            './__tests__/tests.webpack.js': [ 'webpack', 'sourcemap' ]
        },
        reporters: [ 'progress' ],
        webpack: {
            devtool: 'inline-source-map',
            module: {
                loaders: [
                    {
                        test: /\.jsx?$/,
                        loader: "babel",
                        query: {
                            // https://github.com/babel/babel-loader#options
                            cacheDirectory: true,
                            presets: ['es2015', 'stage-0', 'react'],
                            plugins: ["transform-runtime"]
                        },
                        exclude: /node_modules/
                    }
                ]
            }
        },
        webpackServer: {
            noInfo: true
        }
    });
};
