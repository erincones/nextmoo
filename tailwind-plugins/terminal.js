const plugin = require(`tailwindcss/plugin`);


/**
 * Terminal plugin
 *
 * @param {Object} helper Tailwind helper functions
 * @param {function} helper.addBase Registering new base styles
 * @param {function} helper.e Escaping strings meant to be used in class names
 * @param {function} helper.theme Looking up values in the user's theme configuration
 */
const terminal = ({ addBase, e, theme }) => {
  // HTML base style
  addBase({
    html: {
      fontFamily: theme(`fontFamily.mono`).join(`, `),
      fontSize: 16,
      color: theme(`colors.white`),
      backgroundColor: theme(`colors.black`),
      lineHeight: theme(`lineHeight.terminal`)
    }
  });

  // Default selection
  addBase({
    "::selection": {
      color: theme(`colors.black`),
      background: theme(`colors.white`)
    }
  });


  // Selection
  Object.entries(theme(`colors`)).forEach(([ color, value ]) => {
    // Transparent
    if (value === `transparent`) {
      addBase({ [`.bg-${e(color)}::selection`]: { color: theme(`colors.black`) } });
      addBase({ [`.text-${e(color)}::selection`]: { backgroundColor: theme(`colors.black`) } });
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
};

module.exports = plugin(terminal);
