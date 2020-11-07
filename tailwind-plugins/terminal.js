const plugin = require(`tailwindcss/plugin`);


/**
 * Default terminal config
 */
const config = {
  theme: {
    columns: {
      "1": 1,
      "2": 2
    },
    arrows: {
      up: {
        width: 9,
        height: 6,
        paths: [ `M0 6H9L5 1Z` ]
      },
      down: {
        width: 9,
        height: 6,
        paths: [ `M0 0H9L5 5Z` ]
      }
    }
  },
  variants: {
    columns: [ `responsive` ],
    arrows: [ `focus`, `disabled` ]
  }
};


/**
 * Terminal plugin
 *
 * @param {Object} helper Tailwind helper functions
 * @param {function} helper.addUtilities Registering new utilities styles
 * @param {function} helper.addBase Registering new base styles
 * @param {function} helper.e Escaping strings meant to be used in class names
 * @param {function} helper.theme Looking up values in the user's theme configuration
 * @param {function} helper.theme Looking up values in the user's variants configuration
 */
const terminal = ({ addUtilities, addBase, e, theme, variants }) => {
  // Process colors
  const black = theme(`colors.black`, `#000000`);
  const white = theme(`colors.white`, `#ffffff`);
  const colors = Object.entries(theme(`colors`, [])).map(([ color, value ]) =>
    typeof value === `string` ? { color, value } : Object.entries(value).map(([ modifier, value ]) =>
      modifier === `default` ? { color, value } : { color: `${color}-${modifier}`, value }
    )
  ).reduce((colors, color) => colors.concat(color), []);


  // HTML base style
  addBase({
    html: {
      fontFamily: theme(`fontFamily.mono`, [ `monospace` ]).join(`, `),
      fontSize: 16,
      color: white,
      backgroundColor: black,
      lineHeight: theme(`lineHeight.terminal`, `1.1875rem`)
    }
  });

  // Default selection
  addBase({
    "::selection": {
      color: black,
      background: white
    }
  });


  // Selection
  colors.forEach(({ color, value }) => {
    // Transparent
    if (value === `transparent`) {
      addBase({ [`.bg-${e(color)}::selection`]: { color: black } });
      addBase({ [`.text-${e(color)}::selection`]: { backgroundColor: black } });
    }

    // Other colors
    else {
      addBase({ [`.bg-${e(color)}::selection`]: { color: value } });
      addBase({ [`.text-${e(color)}::selection`]: { backgroundColor: value } });
    }
  });

  // Remove input number arrows
  addBase({
    ".appearance-none::-webkit-outer-spin-button, .appearance-none::-webkit-inner-spin-button": {
      appearance: `none`,
      margin: 0
    }
  });

  addBase({
    ".appearance-none[type=number]": {
      appearance: `textfield`
    }
  });


  // Columns count
  const columnsVariants = variants(`columns`);
  Object.entries(theme(`columns`)).forEach(([ key, value ]) => {
    addUtilities({ [`.${e(`columns-${key}`)}`]: { columnCount: value } }, columnsVariants);
  });


  // Select arrows
  const arrowsVariants = variants(`arrows`);
  Object.entries(theme(`arrows`)).forEach(([ key, { width, height, paths } ]) => {
    colors.forEach(({ color, value }) => {
      const path = paths.map(path => `<path fill="${value}" d="${path}" />`);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${path}</svg>`;
      addUtilities({ [`.${e(`arrow-${key}-${color}`)}`]: { backgroundImage: `url("data:image/svg+xml;base64,${Buffer.from(svg).toString(`base64`)}")`} }, arrowsVariants);
    });
  });
};

module.exports = plugin(terminal, config);
