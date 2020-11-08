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
      },
      spacing: {
        ch: `1ch`,
        "1/7": `14.2857%`,
        "2/7": `28.5714%`,
        "3/7": `42.8571%`,
        "4/7": `57.1429%`,
        "5/7": `71.4286%`,
        "6/7": `85.7143%`
      },
      width: {
        "full-3": `calc(100% - 0.75rem)`,
        "max-content": `max-content`
      },
      minHeight: {
        "10": `2.5rem`,
        "20": `5rem`,
        "55": `13.75rem`
      }
    }
  },
  variants: {
    textColor: [ `responsive`, `hover`, `focus`, `disabled` ],
    cursor: [ `disabled` ]
  },
  plugins: [
    terminal
  ],
  corePlugins: {
    animation: false
  }
};
