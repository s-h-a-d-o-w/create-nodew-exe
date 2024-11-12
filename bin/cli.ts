#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { main } from "../src/main.js";

const argv = yargs(hideBin(process.argv))
  .usage(
    "Converts node.exe into a silent executable (no terminal will pop up) " +
      "by changing only one byte.\n\n" +
      "Usage: $0 [options] <src> <dst>",
  )
  .demandCommand(
    2,
    "You need to specify <src> and <dst> (or use --help for more)",
  )
  .help("h")
  .alias("h", "help")
  .showHelpOnFail(false)
  .parseSync();

console.log("Generating: ", argv._[1]);
main({
  src: String(argv._[0]),
  dst: String(argv._[1]),
});
console.log("SUCCESS");
