# create-nodew-exe

[![Travis Build Status](https://travis-ci.com/s-h-a-d-o-w/create-nodew-exe.svg?branch=master)](https://travis-ci.com/s-h-a-d-o-w/create-nodew-exe)
[![npm version](https://img.shields.io/npm/v/create-nodew-exe.svg)](https://www.npmjs.com/package/create-nodew-exe)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Creates an executable based on node.exe that will not show 
a terminal on launch (sometimes also called "silent mode").

Credit for originally discovering how to do this goes to: [@ukoloff](https://github.com/ukoloff) 
(who came up with it for his project [nvm$](https://github.com/ukoloff/nvms))

### Usage

The conversion can be done on any platform, Windows is **not** required.

Either through the CLI:
```
yarn global add create-nodew-exe
create-nodew-exe <src> <dst>
```

... or locally in your project:
```
yarn add create-nodew-exe
```
```
require('create-nodew-exe')({
	src: 'path/to/source',
	dst: 'path/to/destination',
});
```
