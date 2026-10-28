/**
 * Returns a random integer in the range [min, max].
 * The minimum is inclusive, and the maximum is exclusive.
 *
 * @param {number} min - The inclusive lower bound.
 * @param {number} max - The exclusive upper bound.
 * @returns {number} A random integer between min and max - 1.
 */
export function getRandomNumber(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

export function randomUnicode(length) {
  let result = "";
  while (result.length < length) {
    const code = Math.floor(Math.random() * 0x10000); // U+0000 - U+FFFF
    if (code >= 0xD800 && code <= 0xDFFF) continue;
    result += String.fromCharCode(code);
  }
  return result;
}

/**
 * Returns a random element from the given array.
 * @param {Array} arr - The array to select an element from.
 * @returns {*} A randomly selected element.
 */
export function randomArray(arr) {
  return arr[getRandomNumber(0, arr.length)];
}

/**
 * Formats raw dialpad digits as a Korean phone number while typing.
 *
 * @param {string} n - Unformatted input (digits, optionally `*` / `#`).
 * @returns {string} Hyphenated number, or the input unchanged for
 *   special codes (`*`, `#`) and inputs of 3 digits or fewer.
 *
 * Keep the stored number as raw digits; use this for display only.
 */
export function fmtNum(n) {
  if (/[*#]/.test(n)) return n;
  if (n.length <= 3) return n;
  if (n.startsWith("02")) {
    if (n.length <= 5) return n.replace(/^(\d{2})(\d+)/, "$1-$2");
    return n.replace(new RegExp(`^(\\d{2})(\\d{${n.length > 9 ? 4 : 3}})(\\d*)$`), "$1-$2-$3").replace(/-$/, "");
  }
  if (n.length <= 7) return n.replace(/^(\d{3})(\d+)/, "$1-$2");
  if (n.length <= 11) return n.replace(/^(\d{3})(\d{3,4})(\d{0,4})$/, (_, a, b, c) => {
    if (n.length === 11) return `${a}-${n.slice(3, 7)}-${n.slice(7)}`;
    return `${a}-${b}-${c}`.replace(/-$/, "");
  });
  return n.replace(/^(\d{3})(\d{4})(\d+)$/, "$1-$2-$3");
}

export function makeid(length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var _ = 0; _ < length; _++) result += characters.charAt(Math.floor(Math.random() * characters.length));
  return result;
}