// The case of successful file conversion is covered in cli.test.js
import { createNodewExe } from "./main.js";

test("input file doesn't exist", () => {
  try {
    createNodewExe({
      src: "doesntexist",
      dst: "doesntmatter",
    });
  } catch (error) {
    expect(error).toMatchInlineSnapshot(
      `[Error: Could not open file: doesntexist]`,
    );
  }
});

test("input file is invalid", () => {
  try {
    createNodewExe({
      src: "./package.json",
      dst: "doesntmatter",
    });
  } catch (error) {
    expect(error).toMatchInlineSnapshot(`[Error: Invalid EXE: ./package.json]`);
  }
});
