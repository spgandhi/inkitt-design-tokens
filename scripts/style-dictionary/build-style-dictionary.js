const StyleDictionary = require('style-dictionary');
const {getSDConfig} = require('./config.base');

const outputFolder = './src/tokens/'

const galateaLightConfig = getSDConfig({
  source: ['src/theme-tokens/galateaLight**.json'],
  destination: 'galateaLight',
  buildPath: outputFolder,
})

const galateDarkConfig = getSDConfig({
  source: ['src/theme-tokens/galateaDark**.json'],
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



