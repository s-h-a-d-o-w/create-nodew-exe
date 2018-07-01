module.exports = {
	collectCoverage: true,
	collectCoverageFrom: [
		'bin/**/*.js',
		'src/**/*.js',
		'!**/node_modules/**',
	],
	coverageReporters: [
		'json',
		'html'
	],
	testEnvironment: 'node',
};
