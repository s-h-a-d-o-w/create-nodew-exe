import screenshot from "screenshot-desktop";
import { Canvas, loadImage } from "skia-canvas";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { basename } from "path";
import { main } from "../src/main.js";
import { execa } from "execa";
import { execPath } from "node:process";

// We can't try to go for a perfect match due to cursor blinking and the clock possibly changing.
const DIFF_THRESHOLD = 100; // Number of pixels

function pause(delay: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

async function getDiff(
  name: string,
  beforeBuffer: Buffer,
  afterBuffer: Buffer,
) {
  await writeFile(`e2e-output/${name}-before.png`, beforeBuffer);
  await writeFile(`e2e-output/${name}-after.png`, afterBuffer);

  const before = await loadImage(beforeBuffer);
  const after = await loadImage(afterBuffer);
  const canvas = new Canvas(before.width, before.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(before, 0, 0);
  ctx.globalCompositeOperation = "difference";
  ctx.drawImage(after, 0, 0);

  await writeFile(`e2e-output/${name}-diff.png`, await canvas.toBuffer("png"));

  const diffData = ctx.getImageData(0, 0, before.width, before.height).data;
  let diff = 0;
  for (let i = 0; i < diffData.length; i += 4) {
    if (diffData[i] !== 0 || diffData[i + 1] !== 0 || diffData[i + 2] !== 0) {
      diff += 1;
    }
  }

  return diff;
}

async function runTest(executable: string) {
  const before = await screenshot({ format: "png" });

  // An major flaw here is that we HAVE to use `start` to replicate the behavior of starting a new terminal session but that means we can't get the error level of what we're running. So if either the path to the script we're using or the script itself changes in a way that breaks things, there is no way for us to tell. Other than tests failing for seemingly strange reasons.
  const executionPromise = execa("start", [
    "/WAIT",
    executable,
    "e2e\\wait.js",
  ]);
  // Wait for window to appear
  await pause(1000);

  const after = await screenshot({ format: "png" });
  await executionPromise;

  return getDiff(basename(executable), before, after);
}

// Wait for environment rendering to settle
await pause(1000);
await mkdir("e2e-output");

const regularExecutable = execPath;
const silentExecutable = "bin\\testData\\nodew.exe";
main({
  src: regularExecutable,
  dst: silentExecutable,
});

const errors = [];
if ((await runTest(regularExecutable)) === 0) {
  errors.push(`💥 Regular .exe didn't pop up a terminal!`);
}
const silentDiff = await runTest(silentExecutable);
if (silentDiff > DIFF_THRESHOLD) {
  errors.push(
    `💥 Silent .exe resulted in a screenshot mismatch! (diff: ${silentDiff})`,
  );
}

await unlink(silentExecutable);

if (errors.length > 0) {
  errors.forEach((error) => {
    console.error(error);
  });
  process.exit(1);
}

console.log("SUCCESS!");
