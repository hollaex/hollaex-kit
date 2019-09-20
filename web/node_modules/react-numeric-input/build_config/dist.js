module.exports = {
    entry: "./src/NumericInput.jsx",
    output: {
        path         : "./dist",
        filename     : "react-numeric-input.js",
        libraryTarget: "umd",
        library      : "NumericInput"
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loaders: [
                    "babel?presets[]=es2015&presets[]=stage-0&presets[]=react&plugins[]=transform-object-assign"
                ],
                exclude: /node_modules/
            }
        ]
    },
    externals : {
        "react"     : "React",
        "prop-types": "PropTypes"
    },
    resolve : {
        extensions : [ "", ".jsx", ".js" ]
    }
};
