// webpack.config.js

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
    entry: [
        path.resolve(__dirname, 'src', 'scripts', 'index.js'),
    ],
    output: {
        path: path.join(__dirname, 'dist'), // bundled file in dist/
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/, // applies to js files; tells webpack which files this rule should be applied to (any file ending with .js)
                use: ['babel-loader'], // transpiles your js
                exclude: /node_modules/, // don't transpile node modules; creates an exception to the above (any file inside node_modules)
            },
            {
                test: /\.s?[ac]ss$/, // applies to css/scss/sass files
                use: [
                    MiniCssExtractPlugin.loader, // create bundled css file
                    {
                        loader: 'css-loader', // resolves @import statements
                        options: { url: false } // don't resolve url() statements
                    },
                    'sass-loader', // compiles sass to standard css
                ]
            }
        ],
    },
    plugins: [new MiniCssExtractPlugin()],
};

module.exports = (env, argv) => {
    if (argv.mode === 'production') {
        // Creates a separate main.js.map
        config.devtool = 'source-map';
    } else {
        // All the mapping data is contained within main.js
        config.devtool = 'eval-source-map';
    }

    return config;
}
