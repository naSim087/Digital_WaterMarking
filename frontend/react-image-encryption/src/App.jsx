import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [encodedImageUrl, setEncodedImageUrl] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [watermarkType, setWatermarkType] = useState('image');
const [watermarkImage, setWatermarkImage] = useState(null);
const [watermarkText, setWatermarkText] = useState('');
  // Handle image file change
  const handleWatermarkImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setWatermarkImage(file);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setUploadSuccess(true);
      setSuccessMessage('Image uploaded successfully!');
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    }
    setEncodedImageUrl('');
    setDecodedMessage('');
  };

  // Encode message into the image
  const encodeMessage = async (e) => {
    e.preventDefault();

    if (!imageFile || !message.trim()) {
      alert('Please select an image and enter a valid message');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('message', message);

    try {
      const response = await fetch('http://localhost:5000/hideMessage', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.encodedImageUrl) {
        setEncodedImageUrl(data.encodedImageUrl);
        setSuccessMessage('Message encoded successfully!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        alert('Error encoding the message');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while encoding the message');
    }
  };

  // Decode message from the image
  const decodeMessage = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert('Please select an image to decode');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch('http://localhost:5000/showMessage', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.message) {
        setDecodedMessage(data.message);
        setSuccessMessage('Message decoded successfully!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        alert('Error decoding the message');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while decoding the message');
    }
  };

 
  
  const addWatermark = async (e) => {
    e.preventDefault();
  
    if (!imageFile) {
      alert('Please select a base image first');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', imageFile);
    
    if (watermarkType === 'image' && watermarkImage) {
      // Append the watermark image if the watermark type is 'image'
      console.log(watermarkImage);
      formData.append('watermarkImage', watermarkImage);
  
      try {
        // Send the request to the backend for adding image watermark
        const response = await fetch('http://localhost:5000/addWatermarkImage', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          setSuccessMessage('Image watermark added successfully!');
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        } else {
          alert('Error adding image watermark');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding image watermark');
      }
  
    } else if (watermarkType === 'text' && watermarkText.trim()) {
      // Append the watermark text if the watermark type is 'text'
      console.log(watermarkText);
      formData.append('watermarkText', watermarkText);
  
      try {
        // Send the request to the backend for adding text watermark
        const response = await fetch('http://localhost:5000/addWatermarkText', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          setSuccessMessage('Text watermark added successfully!');
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        } else {
          alert('Error adding text watermark');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding text watermark');
      }
  
    } else {
      alert('Please provide a valid watermark');
    }
  };
  
  return (
    <div className="app">
      <header className="header">
        <h1>Image Message Encoder & Decoder</h1>
        <nav className="nav">
          <button 
            className={`nav-button ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button 
            className={`nav-button ${activeTab === 'encrypt' ? 'active' : ''}`}
            onClick={() => setActiveTab('encrypt')}
          >
            Encrypt Message
          </button>
          <button 
            className={`nav-button ${activeTab === 'decrypt' ? 'active' : ''}`}
            onClick={() => setActiveTab('decrypt')}
          >
            Decrypt Message
          </button>
          <button 
            className={`nav-button ${activeTab === 'watermark' ? 'active' : ''}`}
            onClick={() => setActiveTab('watermark')}
          >
            Add Watermark
          </button>
        </nav>
      </header>

      <main className="main-content">
        {/* Success Messages */}
        {(successMessage || uploadSuccess) && (
          <div className="alert success">
            {uploadSuccess ? 'Image uploaded successfully!' : successMessage}
          </div>
        )}

        {/* Home Section */}
        {activeTab === 'home' && (
          <div className="home-section">
            <h2>Welcome to Image Encoder & Decoder</h2>
            <p>This application allows you to:</p>
            <ul>
              <li>Encrypt secret messages within images</li>
              <li>Decrypt hidden messages from encoded images</li>
              <li>Add watermarks to your images</li>
            </ul>
            <p>Select an option from the navigation menu to get started!</p>
          </div>
        )}

        {/* Encrypt Section */}
        {activeTab === 'encrypt' && (
          <div className="card">
            <h2>Encrypt Message</h2>
            <div className="form-group">
              <label className="file-input">
                <span>Upload Image</span>
                <input 
                  type="file" 
                  onChange={handleImageChange}
                  className="input-file"
                />
              </label>
              
              <input
                type="text"
                placeholder="Enter secret message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-text"
              />
              
              <button 
                onClick={encodeMessage}
                className="button"
              >
                Encrypt Message in Image
              </button>

              {encodedImageUrl && (
                <a 
                  href={encodedImageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="link"
                >
                  View Encoded Image
                </a>
              )}
            </div>
          </div>
        )}

        {/* Decrypt Section */}
        {activeTab === 'decrypt' && (
          <div className="card">
            <h2>Decrypt Message</h2>
            <div className="form-group">
              <label className="file-input">
                <span>Upload Encoded Image</span>
                <input 
                  type="file" 
                  onChange={handleImageChange}
                  className="input-file"
                />
              </label>
              
              <button 
                onClick={decodeMessage}
                className="button"
              >
                Decrypt Message
              </button>

              {decodedMessage && (
                <div className="decoded-message">
                  <p className="message-label">Decoded Message:</p>
                  <p className="message-content">{decodedMessage}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Watermark Section */}
        {activeTab === 'watermark' && (
  <div className="card">
    <h2>Add Watermark</h2>
    <div className="form-group">
      {/* Upload Base Image */}
      <label className="file-input">
        <span>Upload Base Image</span>
        <input 
          type="file" 
          onChange={handleImageChange}
          className="input-file"
        />
      </label>

      {/* Select Watermark Type */}
      <label className="select-input">
        <span>Select Watermark Type</span>
        <select 
          value={watermarkType} 
          onChange={(e) => setWatermarkType(e.target.value)}
          className="input-select"
        >
          <option value="image">Image Watermark</option>
          <option value="text">Text Watermark</option>
        </select>
      </label>

      {/* Conditional Input for Watermark */}
      {watermarkType === 'image' ? (
        <label className="file-input">
          <span>Upload Watermark Image</span>
          <input 
            type="file" 
            onChange={handleWatermarkImageChange} // Function to handle watermark image change
            className="input-file"
          />
        </label>
      ) : (
        <input
          type="text"
          placeholder="Enter watermark text"
          value={watermarkText}
          onChange={(e) => setWatermarkText(e.target.value)} // Function to handle watermark text change
          className="input-text"
        />
      )}

      <button 
        onClick={addWatermark}
        className="button"
      >
        Add Watermark
      </button>
    </div>
  </div>
)}
      </main>

      <style>
        {`
          .app {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }

          .header {
            background-color: #2563eb;
            color: white;
            padding: 1rem;
            text-align: center;
          }

          .header h1 {
            margin: 0 0 1rem;
            font-size: 2rem;
          }

          .nav {
            display: flex;
            justify-content: center;
            gap: 1rem;
            padding: 0.5rem;
            flex-wrap: wrap;
          }

          .nav-button {
            background: transparent;
            color: white;
            border: 2px solid white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
          }

          .nav-button:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          .nav-button.active {
            background: white;
            color: #2563eb;
          }

          .main-content {
            flex-grow: 1;
            padding: 1.5rem;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
          }

          .home-section {
            text-align: center;
            padding: 2rem;
          }

          .home-section ul {
            list-style: none;
            padding: 0;
            margin: 1rem 0;
          }

          .home-section li {
            margin: 0.5rem 0;
          }

          .alert {
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 4px;
          }

          .alert.success {
            background-color: #ecfdf5;
            border: 1px solid #34d399;
            color: #065f46;
          }

          .card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
          }

          .card h2 {
            margin: 0 0 1rem;
            font-size: 1.5rem;
            text-align: center;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .file-input {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: #f3f4f6;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
          }

          .input-file {
            display: none;
          }

          .input-text {
            padding: 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 1rem;
          }

          .button {
            background-color: #2563eb;
            color: white;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
          }

          .button:hover {
            background-color: #1d4ed8;
          }

          .link {
            color: #2563eb;
            text-decoration: none;
            text-align: center;
          }

          .link:hover {
            text-decoration: underline;
          }

          .decoded-message {
            background: #f3f4f6;
            padding: 1rem;
            border-radius: 4px;
          }

          .message-label {
            font-weight: 600;
            margin: 0 0 0.5rem;
          }

          .message-content {
            margin: 0;
          }

          @media (max-width: 600px) {
            .nav {
              flex-direction: column;
              padding: 0.5rem 2rem;
            }

            .nav-button {
              width: 100%;
            }

            .main-content {
              padding: 1rem;
            }
          }
            .section-group {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 4px;
            margin-bottom: 1rem;
          }

          .section-group h3 {
            margin: 0 0 1rem;
            font-size: 1.1rem;
            color: #374151;
          }

          .select-input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 1rem;
            background-color: white;
          }

          .range-input {
            width: 100%;
            margin-right: 1rem;
          }

          .opacity-control {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .opacity-value {
            min-width: 3rem;
            text-align: right;
            font-weight: 500;
          }

          /* Style for range input */
          input[type="range"] {
            -webkit-appearance: none;
            width: 100%;
            height: 8px;
            border-radius: 4px;
            background: #d1d5db;
            outline: none;
            padding: 0;
            margin: 0;
          }

          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #2563eb;
            cursor: pointer;
            transition: all .15s ease-in-out;
          }

          input[type="range"]::-webkit-slider-thumb:hover {
            background: #1d4ed8;
            transform: scale(1.1);
          }

          input[type="range"]::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border: 0;
            border-radius: 50%;
            background: #2563eb;
            cursor: pointer;
            transition: background .15s ease-in-out;
          }

          .select-input:focus,
          .input-text:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
          } 

        `}
      </style>
    </div>
  );
}

export default App;