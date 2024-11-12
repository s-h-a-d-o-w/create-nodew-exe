// Based on: https://github.com/ukoloff/nvms/blob/master/src/tools/nodew.coffee
import fs from "fs";
import { toInt } from "./hex.js";

export function main({ src, dst }: { src: string; dst: string }) {
  let buffer: Buffer;
  let pos = 0; // current position within buffer

  try {
    buffer = fs.readFileSync(src);
  } catch (_) {
    throw new Error(`Could not open file: ${src}`);
  }

  // Some tiny helper functions
  // ====================================================
  const ok = (_: any) => true;
  const seek = (newPos: number) => (pos = newPos) || true; // Just keep || true in case we will ever seek to 0...
  const readInt = (size: number) => {
    const retval = toInt(buffer.slice(pos, pos + size));
    // Simulate stream behavior of the .coffee version with the current
    // position moving along with every read
    pos = pos + size;
    return retval;
  };
  // ====================================================

  // Changes merely one byte in source exe to suppress the terminal
  let flag, pe;
  if (
    0x5a4d === readInt(2) && // MZ
    seek(60) &&
    (pe = readInt(4)) &&
    pe < buffer.byteLength &&
    seek(pe) &&
    0x4550 === readInt(4) && // PE
    seek(pe + 20) &&
    0xf0 === (0x10 | readInt(2)) && // SizeOfOptionalHeader: 0xE0/0xF0
    ok(readInt(2)) && // Characteristics
    0x30b === (0x300 | readInt(2)) && // Magic: 0x10B/0x20B
    // ABOVE: Ensure that EXE is valid and find address
    // of the byte that needs to be checked (BELOW)
    seek((flag = pe + (24 + 68))) &&
    3 === readInt(2) && // CUI
    seek(flag)
  ) {
    // If dst already exists, delete it
    try {
      fs.unlinkSync(dst);
    } catch (_) {
      /* empty */
    }

    // Generate silent node exe
    buffer[pos] = 2; // Change this byte from 3 to 2 in order to suppress the terminal.

    const file = fs.openSync(dst, "w");
    fs.writeSync(file, buffer);
    fs.closeSync(file);
  } else {
    throw new Error(`Invalid EXE: ${src}`);
  }
}
