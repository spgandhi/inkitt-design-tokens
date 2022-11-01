const fs = require('fs');

const indexFileContents = '';

const filesPath = fs.readdirSync('./dist/tokens')
  .filter(fileName => fileName.includes('.js'))
  .map(fileName => fileName.replace('.js', ''));

const importStatements = filesPath.map(fileName => `import ${fileName} from './tokens/${fileName};'`).join('\n');
const exportStatements = `\n\nexport default { ${filesPath.join(',')} }`;

fs.writeFileSync('dist/index.js', importStatements + exportStatements);
fs.writeFileSync('dist/index.d.ts', importStatements + exportStatements);

