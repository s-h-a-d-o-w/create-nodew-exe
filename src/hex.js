// Hexadecimal Encoding/Decoding for ADO binary streams
// Based on: https://github.com/ukoloff/nvms/blob/ccfb49af76214e35732dbca6acb0761294942922/src/sys/hex.coffee
const winax = require('winax');

/**
 * Converts byte array to string. Example: [255, 254] => "fffe"
 *
 * @param {ByteArray} blob	Different type than in dec() because stream.Read() for some reason doesn't provide
 * 							the same data structure that stream.Write() demands.
 * @returns {string} Hexadecimal representation of the byte array
 */
const enc = function(blob) {
	// initial value '' necessary since JS otherwise wrongly assumes that output should be a number,
	// leading to a screwed up conversion of the 1st element.
	return blob.reduce((output, elem) =>
		output + ('0' + elem.toString(16)).slice(-2),
		'');
};

/**
 * Converts string to byte array. Example: "fffe" => [255, 254]
 *
 * @param {string} str	Hexadecimal string of bytes
 * @returns {winaxVariantByteArray} Type required for e.g. stream.Write() to work
 */
const dec = function(str) {
	return new winax.Variant(chunk(str)
		.map(elem => parseInt(elem, 16)),
		'byte');
};

// Split by 2 chars
const chunk = function(str) {
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
const revert = str =>
	chunk(str)
		.reverse()
		.join('')
;

/**
 * Byte array (as read from binary ADODB.Stream) to integer.
 * @param {ByteArray} blob
 * @returns {number}
 */
const toInt = blob => parseInt(revert(enc(blob)), 16);

module.exports = {enc, dec, toInt};
