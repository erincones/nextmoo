/**
 * Balloon limits
 */
const limits = {
  say: [
    `< `, ` >`,
    `/ `, ` \\`,
    `\\ `, ` /`,
    `| `, ` |`
  ],
  think: [
    `( `, ` )`,
    `( `, ` )`,
    `( `, ` )`,
    `( `, ` )`
  ]
};


/**
 * Split the message in multiple lines
 *
 * @param {string} message Message string
 * @param {number} [wrap] Column wrap
 */
const split = (message, wrap) => {
  // Too small column wrap
  if (wrap < 2) {
    return [ `0` ];
  }

  // Break lines
  let lines = message
    .replace(/^\ufeff/g, ``)
    .replace(/\t/g, `        `)
    .replace(/(?:\r\n|[\n\r\f\v\u2028\u2029\u0085])(\S)/g, ` $1`)
    .replace(/(?:\r\n|[\n\r\f\v\u2028\u2029\u0085])\s+/g, `\n\n`)
    .replace(/(?:\r\n|[\n\r\f\v\u2028\u2029\u0085])$/g, ` `)
    .split(/\r\n|[\n\r\f\v\u2028\u2029\u0085]/g);

  // No wrap text
  if (wrap === undefined) {
    return lines;
  }

  // Remove duplicated spaces empty lines
  lines = lines
    .map((line, i) =>
      /^\s*$/.test(line) ? `` : i > 0 ?
        line.replace(/\s+/g, ` `).trimLeft() :
        line.replace(/\s+/g, ` `)
    )
    .filter((line, i, lines) =>
      line.length > 0 ? true : i > 1 ? lines[i - 1].length > 0 : true
    );

  // Check empty message
  if (lines.every(line => line.length === 0)) {
    return [ `` ];
  }


  // Trim last empty line
  if (lines[lines.length - 1].length === 0) {
    lines.pop();
  }


  // Wrap words
  const col = wrap - 1;
  return lines.reduce((lines, line, i) => {
    // Empty line
    if (line.length === 0) {
      return lines.concat(line);
    }

    // Get break position
    const last = i > 0 ? lines[lines.length - 1] + line : line;
    let space = last.length < wrap ? last.length : last.lastIndexOf(` `, col);
    let br = (space > 0) && (space < col) ? space : (last.length === wrap) && last.endsWith(` `) ? wrap : col;

    const words = lines.concat(last.slice(0, br));
    let rest = line.slice(br).trimLeft();

    // Wrap rest of line
    while (rest.length > 0) {
      space = rest.length < wrap ? rest.length : rest.lastIndexOf(` `, col);
      br = (space > 0) && (space < col) ? space : col;

      words.push(rest.slice(0, br));
      rest = rest.slice(br).trimLeft();
    }

    // Return words
    return words;
  }, []);
};


/**
 * Balloon builder
 *
 * @param {`say` | `think`} action Cow action
 * @param {string} message Message
 * @param {number} [wrap] Column wrap
 */
export const balloon = (action, message, wrap) => {
  const limit = limits[action];
  const lines = split(message, wrap);
  const width = lines.map(line => line.length).reduce((prev, curr) => curr > prev ? curr : prev, 1);
  const spaner = Array((lines.length === 1) && (lines[0].length === 0) ? wrap !== undefined ? 2 : 3 : width + 3);


  // Box top
  const balloon = [ ` ${spaner.join(`_`)}` ];

  // Box content
  if (lines.length === 1) {
    balloon.push(`${limit[0]}${lines[0].padEnd(width)}${limit[1]}`);
  }
  else {
    const last = lines.length - 1;
    lines.forEach((line, i) => {
      switch (i) {
        case 0:    balloon.push(`${limit[2]}${line.padEnd(width)}${limit[3]}`); break;
        case last: balloon.push(`${limit[4]}${line.padEnd(width)}${limit[5]}`); break;
        default:   balloon.push(`${limit[6]}${line.padEnd(width)}${limit[7]}`);
      }
    });
  }

  // Box bottom
  balloon.push(` ${spaner.join(`-`)}`);


  // Return box
  return balloon.join(`\n`);
};
