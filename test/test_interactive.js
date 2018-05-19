const fs = require('fs');
const {spawn, exec} = require('child_process');
const path = require('path');

// Set up stdin for "Press any key to..."
//----------------------------------------------
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');
const waitForKeyPress = () => {
	return new Promise((resolve) => {
		process.stdin.on('data', (key) => {
			if(key === '\u0003') { // Ctrl+C
				process.exit();
			}
			resolve();
		});
	});
};
//----------------------------------------------

// Prepare the SILENT exe
//----------------------------------------------
const REGULAR_NODE_EXE = path.join(__dirname, 'test_regular.exe');
const SILENT_NODE_EXE = path.join(__dirname, 'test_silent.exe');
const CREATE_TEMP_JS = path.join(__dirname, 'test_create_temp.js');
require('../src/main')({
	src: REGULAR_NODE_EXE,
	dst: SILENT_NODE_EXE
});
//----------------------------------------------

// The actual prompts, launching the different node executables
//----------------------------------------------
let currProcess;
console.log(`Press any key to launch regular node.exe. (A terminal should pop up)
This will also create a temp.txt.
`);
waitForKeyPress()
	// Run regular node
	.then(() => {
		currProcess = spawn('start', ['/WAIT', REGULAR_NODE_EXE, CREATE_TEMP_JS, 'create'], {
			shell: true
		});
		console.log(`Press any key to kill the terminal. (PID that will get killed: ${currProcess.pid})\n`);
	})

	// Kill regular node
	.then(waitForKeyPress)
	.then(() => new Promise((resolve) => {
		exec(`taskkill /F /T /PID ${currProcess.pid}`, resolve);
	}))
	.then(() => console.log('Press any key to launch SILENT node.exe. It should delete temp.txt.\n'))

	// Run silent node
	.then(waitForKeyPress)
	.then(() => {
		currProcess = spawn('start', ['/WAIT', SILENT_NODE_EXE, CREATE_TEMP_JS, 'delete'], {
			shell: true
		});
		return new Promise((resolve, reject) => {
			currProcess.on('close', () => {
				if(fs.existsSync(path.join(__dirname, 'temp.txt'))) {
					reject('FAILURE - temp.txt still exists!');
				}
				else {
					console.log('temp.txt was deleted successfully and hopefully, ' +
						'you did not see a terminal this time.');
					resolve();
				}
			})
		});
	})

	// Clean up and exit
	.then(() => {
		fs.unlinkSync(SILENT_NODE_EXE);
		process.exit(0);
	})

	.catch(err => {
		console.error(err);
		process.exit(1); // Needed because stdin is blocked, user can't do Ctrl+C!
	})
;
//----------------------------------------------
