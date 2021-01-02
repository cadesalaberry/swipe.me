const path = require('path')
const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  context: __dirname,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  devtool: slsw.lib.webpack.isLocal ? 'eval-cheap-module-source-map' : 'source-map',
  resolve: {
    extensions: ['.mjs', '.json', '.ts'],
    symlinks: false,
    cacheWithContext: false,
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, slsw.lib.webpack.isLocal ? './tsconfig.json' : './tsconfig.build.json'),
        extensions: ['.ts', '.js']
      })
    ]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, slsw.lib.webpack.isLocal ? '.webpack' : '.webpack/production'),
    filename: '[name].js'
  },
  target: 'node',
  externals: [nodeExternals({ allowlist: (name) => name.startsWith('@swipeme.io/') })],
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.(tsx?)$/,
        loader: 'ts-loader',
        exclude: [
          [
            path.resolve(__dirname, '../../node_modules'),
            path.resolve(__dirname, '.serverless'),
            path.resolve(__dirname, '.webpack')
          ]
        ],
        options: {
          projectReferences: true,
          transpileOnly: true,
          experimentalWatchApi: true
        }
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        build: true,
        extensions: {
          vue: true
        }
      },
      eslint: {
        files: './packages/api/**/*.{ts,js,vue}', // required - same as command `eslint ./src/**/*.{ts,tsx,js,jsx} --ext .ts,.tsx,.js,.jsx`
        cache: true
      }
    })
  ]
}
