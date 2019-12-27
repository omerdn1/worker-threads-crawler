module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: ['@babel/plugin-proposal-optional-chaining'],
  env: {
    build: {
      ignore: ['**/*.test.tsx', '**/*.test.ts', '__snapshots__', '__tests__'],
    },
  },
  ignore: ['node_modules'],
};
