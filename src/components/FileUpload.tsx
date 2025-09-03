import React, { useRef, useState } from 'react';
import { Upload, Image } from 'lucide-react';

interface FileUploadProps {
  onImageSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      onImageSelect(file);
    } else {
      alert('Please select a valid image file (PNG, JPG, JPEG)');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Upload Photo
        </h2>
        
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-yellow-400 bg-yellow-50 scale-105'
              : 'border-gray-300 hover:border-yellow-400 hover:bg-yellow-50'
          }`}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className={`p-4 rounded-full transition-colors duration-200 ${
                isDragging ? 'bg-yellow-400' : 'bg-gray-100'
              }`}>
                {isDragging ? (
                  <Upload size={48} className="text-yellow-900" />
                ) : (
                  <Image size={48} className="text-gray-400" />
                )}
              </div>
            </div>
            
            <div>
              <p className="text-xl font-semibold text-gray-700">
                {isDragging ? 'Drop your banana photo here' : 'Choose a banana photo'}
              </p>
              <p className="text-gray-500 mt-2">
                Drag and drop or click to browse
              </p>
            </div>
            
            <div className="flex justify-center">
              <span className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold py-3 px-8 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Select Image
              </span>
            </div>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
        
        <p className="text-sm text-gray-500 text-center mt-4">
          Supports PNG, JPG, and JPEG files up to 10MB
        </p>
      </div>
    </div>
  );
};

export default FileUpload;