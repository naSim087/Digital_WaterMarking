const sharp = require('sharp');  // Image manipulation library
const path = require('path');  // To work with file paths

// For adding image watermark
const addImageWatermark = async (req, res) => {
  try {
    console.log('Adding');
    const baseImage = req.files['image'][0]; // Base image file
    const watermarkImage = req.files['watermarkImage'][0]; // Watermark image file

    // Read the base image and watermark image
    const baseImageBuffer = baseImage.buffer;
    const watermarkImageBuffer = watermarkImage.buffer;

    // Set the position and opacity of the watermark
    const watermarkWidth = 100; // Set appropriate watermark size
    const watermarkHeight = 100;
    const watermarkPosition = { top: 20, left: 20 };  // Position of the watermark (top-left corner)

    // Create watermark using Sharp
    const image = sharp(baseImageBuffer)
      .composite([
        {
          input: watermarkImageBuffer,
          top: watermarkPosition.top,
          left: watermarkPosition.left,
          gravity: 'southeast',  // Positioning of watermark image
          blend: 'over' // Overlays watermark
        }
      ]);

    // Save the modified image to the current directory
    const outputFilePath = path.join(__dirname, 'watermarked_image.png');
    await image.toFile(outputFilePath);

    // Respond with a success message
    res.status(200).send('Watermark added successfully, image saved as "watermarked_image.png"');
  } catch (error) {
    console.error('Error adding image watermark:', error);
    res.status(500).send('Error adding image watermark');
  }
};

// For adding text watermark
const addTextWatermark = async (req, res) => {
  try {
    const baseImage = req.files['image'][0]; // Base image file
    const watermarkText = req.body.watermarkText; // Watermark text

    // Read the base image
    const baseImageBuffer = baseImage.buffer;

    // Create text watermark with Sharp
    const image = sharp(baseImageBuffer)
      .composite([
        {
          input: Buffer.from(
            `<svg width="400" height="100">
              <!-- Shadow effect for better visibility -->
              <text x="10" y="50" font-size="30" fill="black" opacity="0.7" stroke="white" stroke-width="2">${watermarkText}</text>
              <!-- Main text -->
              <text x="10" y="50" font-size="30" fill="black" opacity="0.7">${watermarkText}</text>
            </svg>`
          ),
          top: 20, // Position of the text (top-left corner)
          left: 20,
        }
      ]);

    // Save the modified image to the current directory
    const outputFilePath = path.join(__dirname, 'watermarked_text_image.png');
    await image.toFile(outputFilePath);

    // Respond with a success message
    res.status(200).send('Watermark added successfully, image saved as "watermarked_text_image.png"');
  } catch (error) {
    console.error('Error adding text watermark:', error);
    res.status(500).send('Error adding text watermark');
  }
};

module.exports = { addImageWatermark, addTextWatermark };
