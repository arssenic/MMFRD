import React from 'react';

const UploadButton = ({ onUpload, capturedImage }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  const handleCapturedUpload = () => {
    if (!capturedImage) return;
    // Convert the captured image (dataURL) to a File-like object
    fetch(capturedImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'captured_image.png', { type: 'image/png' });
        onUpload(file);
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Upload from file system */}
      <label>
        <strong>Upload from File:</strong>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>

      {/* Upload captured camera image (if available) */}
      {capturedImage && (
        <button onClick={handleCapturedUpload}>
          Upload Captured Image
        </button>
      )}
    </div>
  );
};

export default UploadButton;
