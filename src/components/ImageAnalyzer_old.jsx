import React, { useState, useRef, useCallback } from 'react';

const ImageAnalyzer = () => {
  const [image, setImage] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [croppedUrl, setCroppedUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file);
        setOriginalUrl(reader.result);
        setCroppedUrl(null);
        setCropBox({ x: 0, y: 0, width: 0, height: 0 });
        setResult(null);
      };
      reader.readAsDataURL(file);
      setError(null);
    } else {
      setError("Please select a valid JPEG or PNG image.");
    }
  };

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.target;
    setImageSize({ width, height });
    
    // Initialize crop box in the center
    const size = Math.min(width, height) / 2;
    const x = (width - size) / 2;
    const y = (height - size) / 2;
    setCropBox({ x, y, width: size, height: size });
  }, []);

  const getEventCoordinates = (e) => {
    if (!containerRef.current) return null;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleStart = useCallback((e) => {
    e.preventDefault();
    const coords = getEventCoordinates(e);
    if (!coords) return;
    
    setIsDragging(true);
    setCropBox({
      x: coords.x,
      y: coords.y,
      width: 0,
      height: 0
    });
  }, []);

  const handleMove = useCallback((e) => {
    e.preventDefault();
    if (!isDragging) return;
    
    const coords = getEventCoordinates(e);
    if (!coords) return;
    
    setCropBox(prev => {
      // Calculate dimensions while maintaining square aspect ratio
      const deltaX = coords.x - prev.x;
      const deltaY = coords.y - prev.y;
      const size = Math.min(
        Math.abs(deltaX),
        Math.abs(deltaY),
        imageSize.width - prev.x,
        imageSize.height - prev.y
      );

      return {
        ...prev,
        width: size,
        height: size
      };
    });
  }, [isDragging, imageSize]);

  const handleEnd = useCallback((e) => {
    e.preventDefault();
    if (!isDragging) return;
    setIsDragging(false);

    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || cropBox.width <= 0) return;

    // Draw cropped image to canvas
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(
      img,
      cropBox.x * (img.naturalWidth / img.width),
      cropBox.y * (img.naturalHeight / img.height),
      cropBox.width * (img.naturalWidth / img.width),
      cropBox.height * (img.naturalHeight / img.height),
      0, 0, 160, 160
    );

    // Convert to blob and update image state
    canvas.toBlob((blob) => {
      if (blob) {
        setImage(new File([blob], 'cropped.jpg', { type: 'image/jpeg' }));
        setCroppedUrl(canvas.toDataURL('image/jpeg'));
      }
    }, 'image/jpeg');
  }, [isDragging, cropBox]);

  const handleAnalyze = async () => {
    if (!image) return;
    
    try {
      setIsAnalyzing(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', image);

      const response = await fetch('https://9651-158-178-227-161.ngrok-free.app/api/v1/detect/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed');
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setOriginalUrl(null);
    setCroppedUrl(null);
    setResult(null);
    setCropBox({ x: 0, y: 0, width: 0, height: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRecrop = () => {
    setCroppedUrl(null);
    setCropBox({ x: 0, y: 0, width: 0, height: 0 });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Deepfake Detection</h2>
        
        {!originalUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Tap to take a photo or select an image
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Original image with cropping interface */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Original Image</h3>
              <div 
                ref={containerRef}
                className="relative inline-block touch-none"
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
                onTouchCancel={handleEnd}
              >
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 z-10"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                
                <img
                  ref={imageRef}
                  src={originalUrl}
                  alt="Original"
                  className="max-h-96 rounded-lg w-full"
                  onLoad={onImageLoad}
                  draggable={false}
                />
                
                {cropBox.width > 0 && (
                  <div
                    className="absolute border-2 border-white pointer-events-none"
                    style={{
                      left: `${cropBox.x}px`,
                      top: `${cropBox.y}px`,
                      width: `${cropBox.width}px`,
                      height: `${cropBox.height}px`,
                    }}
                  />
                )}
                
                <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2">
                  Touch and drag to crop the image to 160x160 pixels
                </div>
              </div>
            </div>

            {/* Cropped image display */}
            {croppedUrl && (
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Cropped Image (160x160)</h3>
                  <button
                    onClick={handleRecrop}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Recrop
                  </button>
                </div>
                <div className="flex justify-center">
                  <img
                    src={croppedUrl}
                    alt="Cropped"
                    className="w-40 h-40 rounded-lg"
                  />
                </div>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
            
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !croppedUrl}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-lg"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded shadow">
                <p className="text-gray-600">Prediction</p>
                <p className="text-2xl font-bold text-blue-600">
                  {result.prediction}
                </p>
              </div>
              <div className="p-4 bg-white rounded shadow">
                <p className="text-gray-600">Confidence</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(result.confidence * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageAnalyzer;