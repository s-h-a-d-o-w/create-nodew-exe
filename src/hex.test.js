const hex = require('./hex');
const winax = require('winax');

// [255, 254] => "fffe"
test('enc', () => {
	expect(hex.enc(new winax.Variant([255, 254], 'byte').__value))
		.toEqual('fffe');
});

// "fffe" => [255, 254]
test('dec', () => {
	expect(JSON.stringify(hex.dec('fffe')))
		.toEqual(JSON.stringify(new winax.Variant([255, 254], 'byte')));
});

// [255, 254] => 65279 (byte order is reversed)
test('toInt', () => {
	expect(hex.toInt(new winax.Variant([255, 254], 'byte').__value))
		.toEqual(65279);
});
