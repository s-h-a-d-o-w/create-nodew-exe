import crypto from "crypto";
import { readFile, unlink } from "node:fs/promises";
import { MockInstance, vi } from "vitest";

async function mockCli(args: string[], expectedExitCode: number) {
  process.argv = ["node", "./bin/cli.js"].concat(args);

  try {
    await import("./cli.js");
  } catch (error) {
    expect(error).toMatchSnapshot("thrown");
  }

  expect(spyLog.mock.calls).toMatchSnapshot("log");
  expect(spyError.mock.calls).toMatchSnapshot("error");
  // eslint-disable-next-line @typescript-eslint/unbound-method
  expect(process.exit).toHaveBeenCalledWith(expectedExitCode);
}

let spyLog: MockInstance, spyError: MockInstance;
beforeAll(() => {
  vi.spyOn(process, "exit");

  // mockImplementation() to suppress all that CLI console output in the test logs
  // Output will still be visible in the snapshots because of .mock.calls
  spyLog = vi.spyOn(console, "log").mockImplementation(() => {});
  spyError = vi.spyOn(console, "error").mockImplementation(() => {});
});

beforeEach(() => {
  // Without resetting, yargs would remember args from previous tests
  vi.resetModules();

  // Purge previous console output before each test
  vi.clearAllMocks();
});

test("--help", async () => {
  await mockCli(["--help"], 0);
});

test("no arguments", async () => {
  await mockCli([], 1);
});

test("only src, no dst", async () => {
  await mockCli(["src"], 1);
});

test("correct conversion", async () => {
  const regularExecutable = "./bin/testData/node.exe";
  const silentExecutable = "./bin/testData/nodew.exe";
  process.argv = ["node", "./bin/cli.js", regularExecutable, silentExecutable];

  await import("./cli.js");

  // Unless the source .exe changes, these check sums should obviously always stay the same
  expect(
    crypto
      .createHash("md5")
      .update(await readFile(regularExecutable))
      .digest("hex"),
  ).toEqual("037c3a6fcd6719e26d1bfc7a1a835a67");
  expect(
    crypto
      .createHash("md5")
      .update(await readFile(silentExecutable))
      .digest("hex"),
  ).toEqual("d1bf9c7e48771ed322827e5549716484");

  expect(spyLog.mock.calls).toMatchSnapshot("log");
  expect(spyError.mock.calls).toMatchSnapshot("error");

  await unlink(silentExecutable);
});
