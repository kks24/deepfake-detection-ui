import React, { useState, useRef, useCallback } from 'react';

const AugmentedAnalyzer = () => {
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

      const response = await fetch('https://6ba3-158-178-227-161.ngrok-free.app/api/v1/detect/augmented', {
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
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">In-Depth Analysis with Augmentation</h2>
        
        {!originalUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
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
            <p className="mt-2 text-sm text-gray-400">
              Click to select an image (JPEG or PNG)
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-200">Original Image</h3>
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
                    className="absolute border-2 border-blue-400 pointer-events-none"
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

            {croppedUrl && (
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-200">
                    Cropped Image (160x160)
                  </h3>
                  <button
                    onClick={handleRecrop}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

                {!result && (
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full mt-4 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 text-lg transition-colors"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Start In-Depth Analysis'}
                  </button>
                )}
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Consensus Prediction */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-blue-400">Consensus Results</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400">Final Prediction</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-bold text-white">
                          {result.consensus_prediction}
                        </p>
                        <span className={`px-2 py-1 rounded text-sm ${
                          result.consensus_prediction === 'FAKE' 
                            ? 'bg-red-900 text-red-200' 
                            : 'bg-green-900 text-green-200'
                        }`}>
                          Consensus
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400">Average Confidence</p>
                      <p className="text-2xl font-bold text-white">
                        {(result.average_confidence * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Original Prediction */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-blue-400">Original Prediction</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400">Result</p>
                      <p className="text-2xl font-bold text-white">
                        {result.original_prediction.prediction}
                      </p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400">Confidence</p>
                      <p className="text-2xl font-bold text-white">
                        {(result.original_prediction.confidence * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Augmented Predictions */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-blue-400">Augmented Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.augmented_predictions.map((pred, index) => (
                      <div key={index} className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-gray-400 capitalize">
                            {pred.augmentation_type.replace('_', ' ')}
                          </p>
                          <span className={`px-2 py-1 rounded text-sm ${
                            pred.prediction === 'fake' 
                              ? 'bg-red-900 text-red-200' 
                              : 'bg-green-900 text-green-200'
                          }`}>
                            {pred.prediction}
                          </span>
                        </div>
                        <p className="text-xl font-bold text-white">
                          {(pred.confidence * 100).toFixed(2)}% confidence
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Processing Details */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-blue-400">Processing Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400">Processing Time</p>
                      <p className="text-xl font-bold text-white">
                        {result.processing_time.toFixed(3)}s
                      </p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400">Input Shape</p>
                      <p className="text-xl font-bold text-white">
                        {result.debug_info.input_size.join(' × ')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400">Predictions Below Threshold</p>
                      <p className="text-xl font-bold text-white">
                        {result.debug_info.predictions_below_threshold} / {result.debug_info.total_predictions}
                      </p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-400">Confidence Threshold</p>
                      <p className="text-xl font-bold text-white">
                        {(result.debug_info.threshold * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-900/50 text-red-200 rounded-lg border border-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AugmentedAnalyzer;