# create-nodew-exe

Creates an executable based on node.exe that will not show 
a terminal on launch.

### Usage

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
