// The case of successful file conversion is covered in cli.test.js

test("input file doesn't exist", () => {
	expect(() => {
		require('../src/main')({
			src: 'doesntexist',
			dst: 'doesntmatter',
		});
	}).toThrowError('Could not open file: doesntexist');
});

test("input file is invalid", () => {
	expect(() => {
		require('../src/main')({
			src: './package.json',
			dst: 'doesntmatter',
		});
	}).toThrowError('Invalid EXE: ./package.json');
});
