module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-underscore-dangle': [
      'error',
      {
        allow: [
          '_id',
        ],
      },
    ],
    'linebreak-style': 0,
  },
  // eslint-disable-next-line no-dupe-keys
  extends: 'airbnb-base',

};
