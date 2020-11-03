const plugin = require(`tailwindcss/plugin`);


/**
 * Default terminal config
 */
const config = {
  theme: {
    columns: {
      "1": 1,
      "2": 2
    }
  },
  variants: {
    columns: [ `responsive` ]
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
  // Known colors
  const black = theme(`colors.black`, `#000000`);
  const white = theme(`colors.white`, `#ffffff`);


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
  Object.entries(theme(`colors`)).forEach(([ color, value ]) => {
    // Transparent
    if (value === `transparent`) {
      addBase({ [`.bg-${e(color)}::selection`]: { color: black } });
      addBase({ [`.text-${e(color)}::selection`]: { backgroundColor: black } });
    }

    // Simple colors
    else if (typeof value === `string`) {
      addBase({ [`.bg-${e(color)}::selection`]: { color: value } });
      addBase({ [`.text-${e(color)}::selection`]: { backgroundColor: value } });
    }

    // Nested colors
    else {
      Object.entries(value).forEach(([ modifier, value ]) => {
        // Default color
        if (modifier === `default`) {
          addBase({ [`.bg-${e(color)}::selection`]: { color: value } });
          addBase({ [`.text-${e(color)}::selection`]: { backgroundColor: value } });
        }

        // Other
        else {
          addBase({ [`.bg-${e(`${color}-${modifier}`)}::selection`]: { color: value } });
          addBase({ [`.text-${e(`${color}-${modifier}`)}::selection`]: { backgroundColor: value } });
        }
      });
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
};

module.exports = plugin(terminal, config);
