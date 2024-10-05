import { useState } from 'react';
import './App.css';
const uuid = require('uuid');

function App() {
  const [image, setImage] = useState(null); // Store the file object
  const [imagePreview, setImagePreview] = useState(null); // Store the image preview URL
  const [uploadResultMessage, setUploadResultMessage] = useState('Please upload an image to Authenticate');
  const [visitorname, setVisitorName] = useState('placeholder.jpg');
  const [isAuth, setAuth] = useState(false);

  const sendImage = (e) => {
    e.preventDefault();
    if (!image) {
      setUploadResultMessage('No image selected for upload.');
      return;
    }

    const visitorImageName = uuid.v4(); // Create unique image name for upload
    fetch(`https://your-api-gateway-link.com/${visitorImageName}.jpeg`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: image,
    })
      .then(async () => {
        const response = await authenticate(visitorImageName);
        if (response.Message === 'Success') {
          setAuth(true);
          setUploadResultMessage(`Hi ${response.firstName} ${response.lastName}, Welcome to the company. Have a great day!`);
        } else {
          setAuth(false);
          setUploadResultMessage('Authentication Failed: This person does not belong to the company.');
        }
      })
      .catch((error) => {
        setAuth(false);
        setUploadResultMessage('There was an error during the Authentication process. Please try again.');
        console.log(error);
      });
  };

  async function authenticate(visitorImageName) {
    const requestUrl = `https://your-api-url.com/path?` + new URLSearchParams({
      objectKey: `${visitorImageName}.jpeg`,
    });
    return await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log(error);
        return {};
      });
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Store the image file
      setVisitorName(file.name); // Update the visitor's name with the file name
      const previewURL = URL.createObjectURL(file); // Create a temporary URL for the preview
      setImagePreview(previewURL); // Set the preview URL
    }
  };

  return (
    <div className="App">
      <h2>Facial Recognition App</h2>
      <form onSubmit={sendImage}>
        <input type="file" name="image" onChange={handleImageChange} />
        <button type="submit">Authenticate</button>
      </form>
      <div className={isAuth ? 'success' : 'failure'}>{uploadResultMessage}</div>

      {/* Display the selected image preview */}
      {imagePreview ? (
        <img src={imagePreview} alt="Visitor Preview" height={250} width={250} />
      ) : (
        <img src={`/visitors/${visitorname}`} alt="Visitor" height={250} width={250} />
      )}
    </div>
  );
}

export default App;
