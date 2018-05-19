const fs = require('fs');
const crypto = require('crypto');

let spyLog, spyError;
beforeEach(() => {
	//spy = jest.spyOn(console, 'log');
	//jest.spyOn(console, 'error');

	// mockImplementation() to suppress all that CLI console output in the test logs
	// Output will still be visible in the snapshots because of .mock.calls
	spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
	spyError = jest.spyOn(console, 'error').mockImplementation(() => {});

	// process.exit() would exit jest as well but we still need to interrupt execution
	jest.spyOn(process, 'exit').mockImplementationOnce(
		() => { throw new Error('process.exit() was called.'); }
	);

	// Without resetting, yargs would remember args from previous tests
	jest.resetModules();

	// Purge previous console output before each test
	jest.clearAllMocks();
});


test('--help', () => {
	mockCLI(['--help'], 0);
});

test('no arguments', () => {
	mockCLI([], 1);
});

test('only src, no dst', () => {
	mockCLI(['src'], 1);
});

test('correct conversion', () => {
	process.argv = ['node', './bin/cli.js', './test/test_regular.exe', './test/test_silent.exe'];

	require('./cli.js');

	// Unless the source .exe changes, these check sums should obviously always stay the same
	expect(crypto.createHash('md5').update(fs.readFileSync('./test/test_regular.exe')).digest('hex'))
		.toEqual('037c3a6fcd6719e26d1bfc7a1a835a67');
	expect(crypto.createHash('md5').update(fs.readFileSync('./test/test_silent.exe')).digest('hex'))
		.toEqual('d1bf9c7e48771ed322827e5549716484');

	expect(spyLog.mock.calls).toMatchSnapshot('log');
	expect(spyError.mock.calls).toMatchSnapshot('error');

	fs.unlinkSync('./test/test_silent.exe');
});


const mockCLI = (args, expectedExitCode) => {
	process.argv = ['node', './bin/cli.js'].concat(args);

	expect(() => {
		require('./cli.js');
	}).toThrowError('process.exit() was called.');

	expect(spyLog.mock.calls).toMatchSnapshot('log');
	expect(spyError.mock.calls).toMatchSnapshot('error');
	expect(process.exit).toHaveBeenCalledWith(expectedExitCode);
};
