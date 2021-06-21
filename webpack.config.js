const TerserPlugin = require("terser-webpack-plugin");
const terserOptions = {
     mangle: { properties: true }
};

module.exports = {
     target: ['web', 'es5'],
     entry: './docs/src/index.ts',
     output: {
          path: __dirname + '/docs/dist',
          filename: 'bundle.js'
     },
     resolve: {
          alias: { 'module': __dirname + "/node_modules" },
          extensions: ['.tsx', '.ts', '.js']
     },
     optimization: {
          minimizer: [
               new TerserPlugin({
                    terserOptions: {
                         builtins: false
                    }
               })
          ]
     },
     module: {
          rules: [
               {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
               },
               {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
               }, {
                    test: /\.txt$/i,
                    use: 'raw-loader',
               }, {
                    test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [{
                         loader: 'file-loader',
                         options: {
                              name: '[name].[ext]',
                              outputPath: 'fonts/'
                         }
                    }],
               }],


     }
}