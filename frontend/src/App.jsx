import React, { useState } from 'react';
import CameraCapture from './components/CameraCapture';
import UploadButton from './components/UploadButton';
import { uploadImage } from './api';

function App() {
  const [imageBlob, setImageBlob] = useState(null); // holds selected/captured image
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!imageBlob) {
      alert('Please select or capture an image first.');
      return;
    }
    setLoading(true);
    try {
      const data = await uploadImage(imageBlob);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Prediction failed.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Fruit Ripeness Prediction</h1>

      <CameraCapture onCapture={setImageBlob} />

      <p>or</p>

      <UploadButton onUpload={setImageBlob} />

      <br />
      <button onClick={handleUpload} disabled={!imageBlob}>
        Upload
      </button>

      {loading && <p>Processing...</p>}

      {result && (
        <div style={{ marginTop: '20px' }}>
          <img src={result.image_url} alt="Uploaded fruit" style={{ width: '100%' }} />
          <h3>Prediction: {result.prediction}</h3>
        </div>
      )}
    </div>
  );
}

export default App;
