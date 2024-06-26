function serialize(numbers) {
    let bitArray = new Uint8Array(300);
    numbers.forEach(number => {
        if (number >= 1 && number <= 300) {
            bitArray[number - 1] = 1;
        }
    });

    let compressedString = '';
    for (let i = 0; i < 300; i += 6) {
        let chunk = 0;
        for (let j = 0; j < 6; j++) {
            if (i + j < 300 && bitArray[i + j]) {
                chunk |= (1 << j);
            }
        }
        compressedString += String.fromCharCode(chunk + 32);
    }

    return compressedString;
}

function deserialize(compressedString) {
    let numbers = [];
    for (let i = 0; i < compressedString.length; i++) {
        let chunk = compressedString.charCodeAt(i) - 32;
        for (let j = 0; j < 6; j++) {
            if ((chunk & (1 << j)) !== 0) {
                numbers.push(i * 6 + j + 1);
            }
        }
    }

    return numbers;
}

function testSerialization() {
    const testCases = [
        {
            numbers: [1, 2, 3],
        },
        {
            numbers: [1, 50, 300],
        },
        {
            numbers: Array.from({ length: 50 }, (_, i) => i + 1),
        },
        {
            numbers: Array.from({ length: 100 }, (_, i) => i + 1),
        },
        {
            numbers: Array.from({ length: 500 }, (_, i) => (i % 300) + 1),
        },
        {
            numbers: Array.from({ length: 1000 }, (_, i) => (i % 300) + 1),
        },
        {
            numbers: Array.from({ length: 300 }, () => 1),
        },
        {
            numbers: Array.from({ length: 300 }, (_, i) => i + 1),
        },
        {
            numbers: Array.from({ length: 900 }, (_, i) => (i % 300) + 1),
        },
    ];

    testCases.forEach(({ numbers }, index) => {
        let serialized = serialize(numbers);
        let deserialized = deserialize(serialized);
        let originalSize = JSON.stringify(numbers).length;
        let compressedSize = serialized.length;
        let compressionRatio = compressedSize / originalSize;

        console.log(`Test case ${index + 1}:`);
        console.log(`Numbers: ${numbers}`);
        console.log(`Serialized: ${serialized}`);
        console.log(`Deserialized: ${deserialized}`);
        console.log(`Original size: ${originalSize} bytes`);
        console.log(`Compressed size: ${compressedSize} bytes`);
        console.log(`Compression ratio: ${(compressionRatio * 100).toFixed(2)}%`);
        console.log(`Test ${JSON.stringify(numbers) === JSON.stringify(deserialized) ? 'passed' : 'failed'}`);
        console.log();
    });
}

testSerialization();
