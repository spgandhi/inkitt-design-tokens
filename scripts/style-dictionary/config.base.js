const _ = require('lodash');

const buildPath = './build/'

module.exports = {
  getSDConfig: ({source, buildPath, destination}) => ({
    source,
    format: {
      'custom/js/nested': ({ dictionary, platform }) => {
        const header = `/**\n* Do not edit directly\n* Generated on ${new Date().toGMTString()}\n*/\n\nmodule.exports = `;
        const tokens = {};
        const assignValueToObject = (element) => {
          const path = element.path;
          _.set(tokens, path, element.value);
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
            destination: `${destination}.full.js`,
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
    },
  })
}