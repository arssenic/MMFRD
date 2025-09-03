import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, RotateCcw, Check, AlertCircle } from 'lucide-react';
import ImageCapture from './components/ImageCapture';
import FileUpload from './components/FileUpload';
import ClassificationResult from './components/ClassificationResult';
import { classifyImage } from './utils/api';

export interface ClassificationResult {
  class: string;
  confidence: number;
  ripeness_stage: string;
  description: string;
}

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'camera' | 'upload'>('upload');

  const handleImageSelect = useCallback(async (imageFile: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Create preview URL
      const imageUrl = URL.createObjectURL(imageFile);
      setSelectedImage(imageUrl);

      // Classify the image
      const classification = await classifyImage(imageFile);
      setResult(classification);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Classification failed');
      // Keep the image even if classification fails
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-yellow-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Banana Ripeness Classifier
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload a photo or take a picture of your banana to instantly determine its ripeness stage
            using advanced machine learning technology.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Mode Selection */}
          {!selectedImage && (
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveMode('upload')}
                    className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                      activeMode === 'upload'
                        ? 'bg-yellow-400 text-yellow-900 shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Upload size={20} className="mr-2" />
                    Upload Photo
                  </button>
                  <button
                    onClick={() => setActiveMode('camera')}
                    className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                      activeMode === 'camera'
                        ? 'bg-yellow-400 text-yellow-900 shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Camera size={20} className="mr-2" />
                    Take Photo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Input Section */}
          {!selectedImage && (
            <div className="grid md:grid-cols-1 gap-8 mb-8">
              {activeMode === 'upload' ? (
                <FileUpload onImageSelect={handleImageSelect} />
              ) : (
                <ImageCapture onImageCapture={handleImageSelect} />
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <div className="flex items-center">
                <AlertCircle className="text-red-500 mr-3" size={24} />
                <div>
                  <h3 className="font-semibold text-red-800">Classification Error</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {(selectedImage || isLoading) && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                {/* Image Preview */}
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/2">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Banana</h3>
                    {selectedImage && (
                      <div className="relative">
                        <img
                          src={selectedImage}
                          alt="Banana to classify"
                          className="w-full h-64 object-cover rounded-xl shadow-md"
                        />
                        {isLoading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                            <div className="text-white text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                              <p className="font-medium">Analyzing ripeness...</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Classification Results */}
                  <div className="lg:w-1/2">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Classification Result</h3>
                      <button
                        onClick={handleReset}
                        className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-colors duration-200"
                      >
                        <RotateCcw size={16} className="mr-2" />
                        Try Another
                      </button>
                    </div>
                    
                    {result ? (
                      <ClassificationResult result={result} />
                    ) : isLoading ? (
                      <div className="bg-gray-50 rounded-xl p-8 text-center">
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-300 rounded mb-4"></div>
                          <div className="h-4 bg-gray-300 rounded mb-4"></div>
                          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
                        Classification results will appear here
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Section */}
          {!selectedImage && !isLoading && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                How It Works
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Camera className="text-yellow-600" size={28} />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">1. Capture or Upload</h3>
                  <p className="text-gray-600">Take a photo with your camera or upload an existing image of your banana.</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Check className="text-green-600" size={28} />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">2. AI Analysis</h3>
                  <p className="text-gray-600">Our machine learning model analyzes the banana's color, texture, and visual characteristics.</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="text-orange-600" size={28} />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">3. Get Results</h3>
                  <p className="text-gray-600">Receive instant classification results with confidence scores and ripeness recommendations.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;