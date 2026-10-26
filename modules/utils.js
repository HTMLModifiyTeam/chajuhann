/**
 * Returns a random integer in the range [min, max).
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