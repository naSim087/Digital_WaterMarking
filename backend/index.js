// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const { hideMessage,showMessage } = require('./controllers/hideMessageController');  // Import the controller
// const cors = require('cors');
// const app = express();

// // Middleware to parse JSON and form data
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// // Set up multer for file upload
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // POST route to hide message in image
// app.post('/hideMessage', upload.single('image'), hideMessage);  // Use the imported hideMessage function
// app.post('/showMessage', upload.single('image'), showMessage);
// // Start the server
// const PORT = 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
const express = require('express');
const multer = require('multer');
const path = require('path');
const { hideMessage, showMessage } = require('./controllers/hideMessageController');  // Import the controller
const { addImageWatermark,addTextWatermark } = require('./controllers/addWatermarkController');  // Import the watermark controller
const cors = require('cors');
const app = express();

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Set up multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route to hide a message in the image
app.post('/hideMessage', upload.single('image'), hideMessage);

// POST route to show the hidden message in the image
app.post('/showMessage', upload.single('image'), showMessage);

// POST route to add watermark (text or image)
app.post('/addWatermarkImage', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'watermarkImage', maxCount: 1 }
]), addImageWatermark);

app.post('/addWatermarkText', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'watermarkText', maxCount: 1 }
]), addTextWatermark);
// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
