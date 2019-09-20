module.exports = {
    entry: {
        "docs/examples.js": "./src/examples.jsx"
    },
    output: {
        path         : "./",
        filename     : "[name]",
        libraryTarget: "umd"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: [
                    "babel?presets[]=es2015&presets[]=stage-0&presets[]=react&plugins[]=transform-object-assign"
                ],
                exclude: /node_modules/
            }
        ]
    },
    externals : {
        "react"     : "React",
        "react-dom" : "ReactDOM",
        "prop-types": "PropTypes"
    },
    resolve : {
        extensions : [ "", ".js", ".jsx" ]
    }
};
