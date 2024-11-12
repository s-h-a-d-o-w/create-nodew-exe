// The case of successful file conversion is covered in cli.test.js
import { main } from "./main.js";

test("input file doesn't exist", () => {
  try {
    main({
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
    main({
      src: "./package.json",
      dst: "doesntmatter",
    });
  } catch (error) {
    expect(error).toMatchInlineSnapshot(`[Error: Invalid EXE: ./package.json]`);
  }
});
