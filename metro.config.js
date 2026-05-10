const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  ...config.resolver.alias,
  'react-native/Libraries/Utilities/Platform': 'react-native-web/dist/exports/Platform',
};

module.exports = config;