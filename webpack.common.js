module.exports = {
    entry: {
      content: './src/scripts/content.ts',
      background: './src/scripts/background.ts',
    },
    output: {
      filename: '[name].js',
      path: __dirname + '/www'
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.script.json'
          }
        }
      ]
    }
  };