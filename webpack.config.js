const path = require('path')

ScriptsLoader = {
  entry: './scripts.js',
  output: {
    filename: 'scripts.js',
    path: path.resolve(__dirname, '_includes')
  }
}

module.exports = [ScriptsLoader]
