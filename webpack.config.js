module.exports = {
    entry: './src/js/my-github-graph.js',
    output: {
        path: __dirname + '/dist',
        filename: 'my-github-graph.dist.js'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}