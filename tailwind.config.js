module.exports = {
  purge: {
    content: [
      'src/**/*.js',
      'src/**/*.jsx',
      'src/**/*.ts',
      'src/**/*.tsx',
      'public/**/*.html',
    ],
    options: {
      whitelist: [
        'bg-yellow-700',
        'bg-green-700',
        'bg-red-700',
        'bg-purple-700',
        'bg-pink-700',
      ],
    },
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
