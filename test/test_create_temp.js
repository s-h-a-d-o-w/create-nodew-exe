// Used by test_interactive.js
// ------------------
// Creates/deletes a temporary file

const fs = require('fs');
const path = require('path');

if(process.argv.includes('create')) {
	const file = fs.openSync(path.join(__dirname, 'temp.txt'), 'w');
	fs.writeSync(file, 'something');
	fs.closeSync(file);
}
else if(process.argv.includes('delete')) {
	fs.unlinkSync(path.join(__dirname, 'temp.txt'));
}

// Need to wait so user can see the terminal
// In the case of silent exe, this doesn't seem to do anything, it simply exits. Which I suppose is a good thing...
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', () => process.exit(0));
