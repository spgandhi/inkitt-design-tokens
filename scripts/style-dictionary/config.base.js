const _ = require('lodash');

const generateFlatTokens = (dictionary, isTypes) => {
  const tokens = {};
  const assignValueToObject = (element) => {
    const path = element.path;
    const hasThemeKeyWord = false;// isTypes && themeKeyWords.some(keyword => path[1].indexOf(keyword) > -1);
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
        const tokens = generateFlatTokens(dictionary, false);
        return `${header}${JSON.stringify(tokens, null, '  ')}`;
        
      },
      'custom/ts': ({ dictionary, platform }) => {
        const header = `/**\n* Do not edit directly\n* Generated on ${new Date().toGMTString()}\n*/\n\export default tokens;\n\ndeclare const tokens: `;
        const tokens = generateFlatTokens(dictionary, true);
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