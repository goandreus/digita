module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@yup': './src/yup-extended.tsx',
          '@store': './src/store/index.ts',
          '@atoms': './src/components/atoms',
          '@molecules': './src/components/molecules',
          '@organisms': './src/components/organisms',
          '@screens': './src/components/screens',
          '@templates': './src/components/templates',
          '@theme': './src/theme',
          '@services': './src/services',
          '@navigations': './src/navigations',
          '@providers': './src/providers',
          '@contexts': './src/contexts',
          '@constants': './src/constants/index.ts',
          '@global': './src/global',
          '@hooks': './src/hooks',
          '@interface': './src/interface',
          '@assets': './src/assets',
          '@helpers': './src/helpers',
          '@features': './src/features',
          '@utils': './src/utils',
          '@managers': './src/managers',
        },
      },
    ],
  ],
};
