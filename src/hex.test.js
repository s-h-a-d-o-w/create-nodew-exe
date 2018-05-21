const hex = require('./hex');

// [255, 254] => "fffe"
test('enc', () => {
	expect(hex.enc(Buffer.from([255, 254])))
		.toEqual('fffe');
});

// [255, 254] => 65279 (byte order is reversed)
test('toInt', () => {
	expect(hex.toInt(Buffer.from([255, 254])))
		.toEqual(65279);
});
