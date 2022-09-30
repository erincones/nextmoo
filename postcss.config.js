module.exports = {
  plugins: [
    `postcss-import`,
    `tailwindcss`,
    `postcss-flexbugs-fixes`,
    [
      `postcss-preset-env`,
      {
        stage: 3,
        features: { "custom-properties": false },
        autoprefixer: { flexbox: `no-2009` },
      },
    ],
  ],
};
