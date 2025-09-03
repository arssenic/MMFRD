import React, { useRef, useState, useCallback, useEffect } from "react";
import { Camera, RotateCcw } from "lucide-react";

interface ImageCaptureProps {
  onImageCapture: (file: File) => void;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onImageCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [videoReady, setVideoReady] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      setStream(mediaStream);
      setIsStreaming(true);
      setCapturedImage(null); // reset last photo
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please check permissions.");
    }
  }, [facingMode]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = async () => {
        try {
          await videoRef.current?.play();
          setVideoReady(true);
        } catch (err) {
          console.error("Video play error:", err);
        }
      };
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setVideoReady(false);
  }, [stream]);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn("Video not ready for capture");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    setCapturedImage(dataUrl);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        onImageCapture(file);
      }
    }, "image/jpeg");

    video.pause();
    stopCamera();
  }, [onImageCapture, stopCamera]);

  const switchCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    if (isStreaming) {
      stopCamera();
      startCamera();
    }
  }, [isStreaming, stopCamera, startCamera]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Take a Photo
      </h2>

      {!isStreaming && !capturedImage && (
        <div className="bg-gray-100 rounded-xl p-12 text-center">
          <Camera size={64} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-6">Click to start your camera</p>
          <button
            onClick={startCamera}
            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold py-3 px-8 rounded-xl shadow-md"
          >
            Start Camera
          </button>
        </div>
      )}

      {isStreaming && (
        <div className="space-y-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 md:h-80 object-cover rounded-xl bg-black"
          />
          <div className="flex justify-center gap-4">
            <button
              onClick={switchCamera}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <RotateCcw size={18} className="inline mr-2" />
              Switch
            </button>
            <button
              onClick={captureImage}
              disabled={!videoReady}
              className={`px-6 py-2 rounded-lg font-semibold shadow-md ${
                videoReady
                  ? "bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Camera size={18} className="inline mr-2" />
              Capture
            </button>
            <button
              onClick={stopCamera}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {capturedImage && (
        <div className="space-y-4 text-center">
          <div className="rounded-xl w-full bg-gray-100 flex items-center justify-center">
            <img
              src={capturedImage}
              alt="Captured"
              className="max-w-full max-h-[80vh] w-auto h-auto"
            />
          </div>

          <button
            onClick={startCamera}
            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold py-3 px-8 rounded-xl shadow-md"
          >
            Retake
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageCapture;
