#!/usr/bin/env node
const argv = require('yargs')
.usage('Converts node.exe into a silent executable (no terminal will pop up) ' +
	'by changing only one byte.\n\n'+
	'Usage: $0 [options] <src> <dst>')
.demandCommand(2, 'You need to specify <src> and <dst> (or use --help for more)')
.help('h')
.alias('h', 'help')
.showHelpOnFail(false)
.argv;

console.log('Generating: ', argv._[1]);
require('../src/main')({
	src: argv._[0],
	dst: argv._[1],
});
console.log('SUCCESS');
