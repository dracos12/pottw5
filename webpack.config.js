var path = require('path');

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "./dist/bundle.js",
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' as resolvable extensions.
        extensions: [".ts", ".js"]
    },

    module: {
        rules: [
            {
                // SOURCE MAP LOADER
                // Reference: https://github.com/webpack-contrib/source-map-loader
                // Extracts SourceMaps for source files that as added as sourceMappingURL comment
                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                enforce: 'pre',
                test: /\.(j|t|s?(a|c)s)s$/, // ts or js or css or scss or sass (or ass)
                use: ['source-map-loader'],
                exclude: [path.resolve(__dirname, 'node_modules/css-loader/lib/convert-source-map.js')] // There is a sourceMappingURL example in this file that triggers a warning
            },
            {
                // AWESOME TYPESCRIPT LOADER
                // Reference: https://github.com/s-panferov/awesome-typescript-loader
                // Transpile .ts files using awesome-typescript-loader
                // Compiles TS into ES6 code
                test: /\.ts$/,
                use: [
                  // { loader: 'babel-loader', options: { sourceMap: true, cacheDirectory: true } },
                  // { loader: 'ts-loader' }
                  { loader: 'awesome-typescript-loader', options: { sourceMap: true, useCache: true, useBabel: true, useTranspileModule: true } }
                ],
                exclude: [path.resolve(__dirname, 'node_modules')]
            }
        ]
    },

    externals: 
        // Don't bundle pixi.js, assume it'll be included in the HTML via a script
        // tag, and made available in the global variable PIXI.
        {
            "pixi.js": "PIXI"
        }
    

};