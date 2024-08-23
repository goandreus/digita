var dyntraceTransformer = require('@dynatrace/react-native-plugin/lib/dynatrace-transformer');
var svgTransformer = require('react-native-svg-transformer');

module.exports.transform = function ({src, filename, options}) {
  if (filename.endsWith('.svg')) {
    return svgTransformer.transform({src, filename, options});
  } else {
    return dyntraceTransformer.transform({src, filename, options});
  }
};
