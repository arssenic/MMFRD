import React, { useRef, useState, useEffect } from 'react';

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [captured, setCaptured] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setCaptured(false);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please check permissions.');
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const capturePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    // freeze video preview
    video.pause();

    canvas.toBlob(blob => {
      if (blob) {
        setCaptured(true);
        onCapture(blob); // send to parent
      }
    }, 'image/jpeg');
  };

  const retakePhoto = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
    setCaptured(false);
    onCapture(null); // clear captured image in parent
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
    setCaptured(false);
    onCapture(null); // clear captured image in parent
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '100%', display: stream ? 'block' : 'none' }}
      />
      {!stream && <button onClick={startCamera}>Start Camera</button>}

      {stream && !captured && (
        <button onClick={capturePhoto}>Capture</button>
      )}

      {stream && captured && (
        <button onClick={retakePhoto}>Retake</button>
      )}

      {stream && (
        <button onClick={stopCamera} style={{ marginTop: '10px' }}>
          Stop Camera
        </button>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CameraCapture;
