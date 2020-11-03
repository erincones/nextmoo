const { fontFamily } = require(`tailwindcss/defaultTheme`);
const terminal = require(`./tailwind-plugins/terminal`);


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
  theme: {
    colors: {
      transparent: `transparent`,
      black: `#000000`,
      white: `#ffffff`,
      gray: {
        default: `#555555`,
        light: `#aaaaaa`
      },
      red: {
        default: `#aa0000`,
        light: `#ff5555`
      },
      green: {
        default: `#00aa00`,
        light: `#55ff55`
      },
      blue: {
        default: `#0000aa`,
        light: `#5555ff`
      },
      cyan: {
        default: `#00aaaa`,
        light: `#55ffff`
      },
      magenta: {
        default: `#aa00aa`,
        light: `#ff55ff`
      },
      yellow: {
        default: `#aa5500`,
        light: `#ffff55`
      }
    },
    extend: {
      fontFamily: {
        mono: [ `"DejaVu Sans Mono"`, ...fontFamily.mono ]
      },
      lineHeight: {
        terminal: `1.1875rem`
      }
    }
  },
  variants: {},
  plugins: [
    terminal
  ],
  corePlugins: {
    animation: false
  }
};
