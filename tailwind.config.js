module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  purge: {
    mode: `all`,
    content: [
      `pages/**/*.{js,ts,jsx,tsx}`,
      `components/**/*.{js,ts,jsx,tsx}`
    ]
  },
  theme: {},
  variants: {},
  plugins: [],
  corePlugins: {
    animation: false
  }
};
