module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Resolve "@/foo" para "./src/foo" em runtime.
      // O tsconfig.json já mapeia o alias para o TypeScript (autocomplete/check),
      // mas o Metro (bundler do React Native) não lê tsconfig — daí este plugin.
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
          },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],
      // react-native-worklets/plugin é exigido por react-native-reanimated v4.
      // Tem que ser o ÚLTIMO plugin da lista — ele faz transformações que
      // dependem de tudo o que veio antes já estar resolvido.
      'react-native-worklets/plugin',
    ],
  };
};
