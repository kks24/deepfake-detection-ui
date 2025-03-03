import React, { useState } from 'react';
import ImageAnalyzer from './components/ImageAnalyzer';
import AugmentedAnalyzer from './components/AugmentedAnalyzer';

const App = () => {
  const [activeTab, setActiveTab] = useState('general');

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <ImageAnalyzer />;
      case 'augmented':
        return <AugmentedAnalyzer />;
      case 'docs':
        return (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">API Documentation</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://9651-158-178-227-161.ngrok-free.app/api/v1/docs"
                className="w-full h-[800px] border-0 rounded-lg"
                title="API Documentation"
              />
            </div>
          </div>
        );
      default:
        return <ImageAnalyzer />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 py-6">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-center">
            <span className="text-blue-500">Deep</span>
            <span className="text-red-500">fake</span>
            <span className="text-gray-300"> Detection System</span>
          </h1>
          <p className="text-gray-400 text-center mt-2">
            Advanced AI-powered image analysis for deepfake detection
          </p>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-2 mb-6 bg-gray-800 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'general'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            General Detection
          </button>
          <button
            onClick={() => setActiveTab('augmented')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'augmented'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            In-Depth Analysis
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'docs'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            API Documentation
          </button>
        </div>

        {/* Content Area */}
        <div className="container mx-auto">
          {renderContent()}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-6 mt-12">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>© 2025 Deepfake Detection System for ITI110 Done by Kan Kah Seng and Ng Feng Long. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;