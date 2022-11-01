const StyleDictionary = require('style-dictionary');
const {getSDConfig} = require('./config.base');

const outputFolder = './dist/tokens/'

const galateaLightConfig = getSDConfig({
  source: ['raw-tokens/galateaLight**.json'],
  destination: 'galateaLight',
  buildPath: outputFolder,
})

const galateDarkConfig = getSDConfig({
  source: ['raw-tokens/galateaDark**.json'],
  destination: 'galateaDark',
  buildPath: outputFolder
})

const configs = [galateaLightConfig, galateDarkConfig];

configs.forEach((config) => {
  const myStyleDictionary = StyleDictionary.extend({
    ...config
  });
  myStyleDictionary.buildAllPlatforms();
})



