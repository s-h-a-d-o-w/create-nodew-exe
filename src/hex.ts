// Hexadecimal Encoding/Decoding for ADO binary streams
// Based on: https://github.com/ukoloff/nvms/blob/ccfb49af76214e35732dbca6acb0761294942922/src/sys/hex.coffee

/**
 * Converts byte array to string. Example: [255, 254] => "fffe"
 *
 * @param {Buffer} blob	Different type than in dec() because stream.Read() for some reason doesn't provide
 * 							the same data structure that stream.Write() demands.
 * @returns {string} Hexadecimal representation of the byte array
 */
const enc = function (blob: Buffer) {
  // initial value '' necessary since JS otherwise wrongly assumes that output should be a number,
  // leading to a screwed up conversion of the 1st element.
  return blob.reduce(
    (output, elem) => output + ("0" + elem.toString(16)).slice(-2),
    "",
  );
};

// Split by 2 chars
const chunk = function (str: string) {
  let i = 0;
  return (() => {
    const result = [];
    while (i < str.length) {
      result.push(str.substring(i, i + 2));
      i += 2;
    }
    return result;
  })();
};

// Revert bytes
const revert = (str: string) => chunk(str).reverse().join("");
/**
 * Byte array (as read from binary ADODB.Stream) to integer.
 * @param {Buffer} blob
 * @returns {number}
 */
const toInt = (blob: Buffer) => parseInt(revert(enc(blob)), 16);

export { enc, toInt };
