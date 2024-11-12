import { enc, toInt } from "./hex.js";

// [255, 254] => "fffe"
test("enc", () => {
  expect(enc(Buffer.from([255, 254]))).toEqual("fffe");
});

// [255, 254] => 65279 (byte order is reversed)
test("toInt", () => {
  expect(toInt(Buffer.from([255, 254]))).toEqual(65279);
});
