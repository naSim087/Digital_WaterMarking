const { Jimp } = require("jimp");

// Helper to convert a message into a binary string
const messageToBinary = (message) => {
    return message.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
};

// Helper to convert binary back to a message
const binaryToMessage = (binary) => {
    let message = '';
    for (let i = 0; i < binary.length; i += 8) {
        const byte = binary.slice(i, i + 8);
        message += String.fromCharCode(parseInt(byte, 2));
    }
    return message;
};

// DCT encoding function (using LSB for demonstration)
exports.dctEncode = async (imageBuffer, message) => {
  console.log(imageBuffer);
    const image = await Jimp.read(imageBuffer);
    const binaryMessage = messageToBinary(message) + '1111111111111110'; // End of message marker

    let binaryIndex = 0;
    for (let y = 0; y < image.bitmap.height; y++) {
        for (let x = 0; x < image.bitmap.width; x++) {
            if (binaryIndex >= binaryMessage.length) break;

            const pixelColor = image.getPixelColor(x, y);
            const red = (pixelColor >> 24) & 0xff;

            const newRed = (red & 0xfe) | parseInt(binaryMessage[binaryIndex]); // Modify LSB
            const newColor = (newRed << 24) | (pixelColor & 0x00ffffff);

            image.setPixelColor(newColor, x, y);
            binaryIndex++;
        }
    }

    return image;  // Returns the modified image with the encoded message
};

// DCT decoding function (extracting from LSB)
exports.dctDecode = async (image) => {
    let binaryMessage = '';
    for (let y = 0; y < image.bitmap.height; y++) {
        for (let x = 0; x < image.bitmap.width; x++) {
            const pixelColor = image.getPixelColor(x, y);
            const red = (pixelColor >> 24) & 0xff;

            binaryMessage += (red & 1).toString(); // Extract LSB of red channel

            // Check if we've hit the end-of-message marker
            if (binaryMessage.endsWith('1111111111111110')) {
                binaryMessage = binaryMessage.slice(0, -16); // Remove end marker
                return binaryToMessage(binaryMessage);
            }
        }
    }
    return binaryToMessage(binaryMessage); // Return decoded message
};
