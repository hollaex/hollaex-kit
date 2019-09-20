module.exports = {
    entry: "./src/NumericInput.jsx",
    output: {
        path: "./",
        filename: "index.js",
        libraryTarget: "commonjs2"
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: "babel",
                query: {
                    // https://github.com/babel/babel-loader#options
                    presets: ['es2015', 'stage-0', 'react'],
                    plugins: ['transform-object-assign'],
                    comments: false
                },
                exclude: /node_modules/
            }
        ]
    },
    externals : {
        "react": "react",
        "prop-types": "prop-types"
    },
    resolve : {
        extensions : [ "", ".jsx", ".js" ]
    }
};
