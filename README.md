[![npm version](https://img.shields.io/npm/v/create-nodew-exe.svg)](https://www.npmjs.com/package/create-nodew-exe)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# create-nodew-exe

**_Use v1 for legacy node versions!_**

Creates an executable based on node.exe that will not show
a terminal on launch (sometimes also called "silent mode").

Credit for originally discovering how to do this goes to: [@ukoloff](https://github.com/ukoloff)
(who came up with it for his project [nvm$](https://github.com/ukoloff/nvms))

### Usage

The conversion can be done on any platform, Windows is **not** required.

Either through the CLI, e.g.:
```bash
pnpm add --global create-nodew-exe
create-nodew-exe <src> <dst>
```

... or locally in your project:
```bash
pnpm add -D create-nodew-exe
```
```ts
import { createNodewExe } from "create-nodew-exe";

createNodewExe({
  src: 'path/to/source',
  dst: 'path/to/destination',
});
```

### Notes

To see it in action, check out
[Spotify Ad Blocker](https://github.com/s-h-a-d-o-w/spotify-ad-blocker).

Windows users may experience issues with wrong icons being
displayed due to caching. See notes on `ie4uinit`
[here](https://github.com/s-h-a-d-o-w/spotify-ad-blocker#building).
