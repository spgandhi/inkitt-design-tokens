const _ = require('lodash');

// for these tokens, we set the color type as string because 
// their values are going to be different for both light and dark theme
// and we are then it does not work well with typescript for `styled-components` package DefaultTheme type.
const themeKeyWords = ['text', 'bg', 'border'];

const generateFlatTokens = ({dictionary, isTypesFile}) => {
  const tokens = {};
  const assignValueToObject = (element) => {
    const path = element.path;
    const hasThemeKeyWord = isTypesFile && themeKeyWords.some(keyword => path[1].indexOf(keyword) > -1);
    _.set(tokens, path, hasThemeKeyWord ? 'string' : element.value);
  };

  const constructObjectFromPath = (path) => {
    path.reduce(function (o, k) {
      if (!o[k]) {
        return (o[k] = {});
      } else {
        return o[k];
      }
    }, tokens);
  };

  dictionary.allTokens.forEach((element) => {
    constructObjectFromPath(element.path);
    assignValueToObject(element);
  });
  return tokens;
}

module.exports = {
  getSDConfig: ({source, buildPath, destination}) => ({
    source,
    format: {
      'custom/js/nested': ({ dictionary, platform }) => {
        const header = `/**\n* Do not edit directly\n* Generated on ${new Date().toGMTString()}\n*/\n\nmodule.exports = `;
        const tokens = generateFlatTokens({dictionary, isTypesFile: false});
        return `${header}${JSON.stringify(tokens, null, '  ')}`;
        
      },
      'custom/ts': ({ dictionary, platform }) => {
        const header = `/**\n* Do not edit directly\n* Generated on ${new Date().toGMTString()}\n*/\n\export default tokens;\n\ndeclare const tokens: `;
        const tokens = generateFlatTokens({dictionary, isTypesFile: true});
        return `${header}${JSON.stringify(tokens, null, '  ')}`;
      },
    },
    platforms: {
      'js/module': {
        transformGroup: 'js',
        buildPath,
        files: [
          {
            name: 'tokens',
            destination: `${destination}Raw.js`,
            format: 'javascript/module',
          },
        ],
      },
      'js/value': {
        transformGroup: 'js',
        buildPath,
        files: [
          {
            name: 'tokens',
            destination: `${destination}.js`,
            format: 'custom/js/nested',
          },
        ],
      },
      'ts/module': {
        transformGroup: 'js',
        buildPath,
        files: [
          {
            name: 'tokens',
            destination: `${destination}.d.ts`,
            format: 'custom/ts',
          },
        ],
      },
      'ts/moduleFull': {
        transformGroup: 'js',
        buildPath,
        files: [
          {
            name: 'tokens',
            destination: `${destination}Raw.d.ts`,
            format: 'typescript/module-declarations',
          },
        ],
      },
    },
  })
}