/**
 * Appearances array
 */
export const modes = [
  { id: `u`, name: `default`,  eyes: `oo`, tongue: ``  },
  { id: `b`, name: `borg`,     eyes: `==`, tongue: ``  },
  { id: `d`, name: `dead`,     eyes: `xx`, tongue: `U` },
  { id: `g`, name: `greedy`,   eyes: `$$`, tongue: ``  },
  { id: `p`, name: `paranoia`, eyes: `@@`, tongue: ``  },
  { id: `s`, name: `stoned`,   eyes: `**`, tongue: `U` },
  { id: `t`, name: `tired`,    eyes: `--`, tongue: ``  },
  { id: `w`, name: `wired`,    eyes: `OO`, tongue: ``  },
  { id: `y`, name: `youthful`, eyes: `..`, tongue: ``  }
];


/**
 * Get mode from face
 *
 * @param {string} eyes Face eyes
 * @param {string} tongue Face tongue
 *
 * @returns Cow mode
 */
export const getMode = (eyes, tongue) =>
  (modes.find(({ eyes: e, tongue: t }) => (e === eyes) && (t === tongue)) || { id: `c` }).id;

/**
 * Get face from cow mode
 *
 * @typedef Face Cow face
 * @property {string} eyes Cow eyes
 * @property {string} tongue Cow tongue
 *
 * @param {string} [mode] Mode id or name
 *
 * @returns {Face} Cow face
 */
export const getFace = mode =>
  modes.find(({ id, name }) => (id === mode) || (name === mode)) || modes[0];
