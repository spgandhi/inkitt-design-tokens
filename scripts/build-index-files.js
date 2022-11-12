const fs = require('fs');

const fileNames = fs.readdirSync('./dist/tokens')
  .filter(fileName => fileName.includes('.js'))
  .map(fileName => fileName.replace('.js', ''));

const exportStatements = fileNames.map(fileName => `export{default as ${fileName}} from './tokens/${fileName}';`).join('\n');

const commonJSExportStatements = fileNames.map(fileName => `module.exports.${fileName} = require('./tokens/${fileName}');`).join('\n');

fs.writeFileSync('dist/index.js', commonJSExportStatements);
fs.writeFileSync('dist/index.d.ts', exportStatements);
