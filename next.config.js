const withPWA = require(`next-pwa`);


module.exports = withPWA({
  future: {
    webpack5: false,
  },
  pwa: {
    dest: `public`
  },
  poweredByHeader: false,
  reactStrictMode: true
});
