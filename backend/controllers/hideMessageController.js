const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const {Jimp} = require('jimp');
require('dotenv').config();  // Load environment variables

// Set up multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Load the secret key from the environment variable
const secretKey = process.env.SECRET_KEY;
if (!secretKey || secretKey.length !== 16) {
  throw new Error('SECRET_KEY must be defined in environment variables and be 16 bytes long.');
}

// Function to hide message using LSB encoding
const lsbEncode = async (imageBuffer, message) => {
  const image = await Jimp.read(imageBuffer);
  const binaryMessage = message.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('') + '00000000'; // Append null byte to mark end

  let messageIndex = 0;

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    if (messageIndex < binaryMessage.length) {
      const pixelValue = image.bitmap.data[idx];
      const newPixelValue = (pixelValue & 0xFE) | parseInt(binaryMessage[messageIndex], 2); // Set LSB of the pixel
      image.bitmap.data[idx] = newPixelValue;
      messageIndex++;
    }
  });

  return image;
};

// Function to decode message from LSB encoding
const lsbDecode = async (imageBuffer) => {
  const image = await Jimp.read(imageBuffer);
  let binaryMessage = '';

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const lsb = image.bitmap.data[idx] & 1;
    binaryMessage += lsb.toString();
  });

  // Split binary data into 8-bit chunks and convert to string
  const message = binaryMessage.match(/.{1,8}/g).map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
  return message.split('\0')[0]; // Stop at null character
};

// Hide message controller
const hideMessage = async (req, res) => {
  const image = req.file;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(secretKey), null);

  try {
    const encryptedMessage = Buffer.concat([cipher.update(message, 'utf8'), cipher.final()]).toString('hex');
    const encodedImage = await lsbEncode(image.buffer, encryptedMessage);

    const outputPath = path.join(__dirname, '..', 'encodedImage.png');
    encodedImage.write(outputPath, (err) => {
      if (err) {
        console.error('Error writing image:', err);
        res.status(500).json({ error: 'Failed to save encoded image.' });
      } else {
        res.json({ encodedImageUrl: `/encodedImage.png` });
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error hiding message in image' });
  }
};

// Show message controller
const showMessage = async (req, res) => {
  // console.log(req);
  try {
    const image = req.file;
    const encodedImageBuffer = image.buffer;
    const encryptedMessage = await lsbDecode(encodedImageBuffer);

    const decipher = crypto.createDecipheriv('aes-128-ecb', Buffer.from(secretKey), null);
    const decryptedMessage = Buffer.concat([decipher.update(Buffer.from(encryptedMessage, 'hex')), decipher.final()]).toString('utf8');
    console.log(decryptedMessage);
    res.json({ message: decryptedMessage });

  } catch (error) {
    console.error('Error decrypting message:', error);
    res.status(500).json({ error: 'Failed to decrypt the message.' });
  }
};

module.exports = { hideMessage, showMessage };
