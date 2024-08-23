const {getDefaultConfig} = require('metro-config');

module.exports = (async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();

  return {
    transformer: {
      babelTransformerPath: require.resolve('./customTransformer.js'),
    },
    reporter: require('@dynatrace/react-native-plugin/lib/dynatrace-reporter'),
    resolver: {
      sourceExts: [...sourceExts, 'svg'],
      assetExts: assetExts.filter(ext => ext !== 'svg'),
    },
  };
})();
