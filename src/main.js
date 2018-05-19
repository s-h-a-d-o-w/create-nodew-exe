// Based on: https://github.com/ukoloff/nvms/blob/master/src/tools/nodew.coffee
const fs = require('fs');
const hex = require('./hex');

module.exports = function(opts) {
	const src = opts.src;
	const dst = opts.dst;

	// Open src as binary stream
	const stream = new ActiveXObject('ADODB.Stream');
	stream.Type = 1;
	stream.Open();

	try { stream.LoadFromFile(src); }
	catch(err) { throw new Error(`Could not open file: ${src}`); }

	// Some tiny helper functions
	// ====================================================
	const ok = () => true;
	const readInt = (size) => hex.toInt(stream.Read(size));
	const seek = (position) => {
		stream.Position = position;
		return true;
	};
	// ====================================================

	// Changes merely one byte in source exe to suppress the terminal
	let flag, pe;
	if((0x5a4d === readInt(2))                && // MZ
			seek(60)                          &&
			(pe = readInt(4))                 &&
			(pe < stream.size)                &&
			seek(pe)                          &&
			(0x4550 === readInt(4))           && // PE
			seek(pe + 20)                     &&
			(0xF0 === (0x10 | readInt(2)))    && // SizeOfOptionalHeader: 0xE0/0xF0
			ok(readInt(2))                    && // Characteristics
			(0x30b === (0x300 | readInt(2)))  && // Magic: 0x10B/0x20B
			// ABOVE: Ensure that EXE is valid and find address
			// of the byte that needs to be checked (BELOW)
			seek(flag = pe + (24 + 68))       &&
			(3 === readInt(2))                && // CUI
			seek(flag)) {
		// If dst already exists, delete it
		try { fs.unlinkSync(dst); } catch(e) { }

		// Generate silent node exe
		stream.Write(hex.dec('02')); // Replace this byte (value 3) by 2 to suppress the terminal.
		stream.SaveToFile(dst);
	} else {
		throw new Error(`Invalid EXE: ${src}`);
	}

	stream.Close();
};
