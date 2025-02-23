# Deepfake Detection UI

A modern web application for detecting deepfake images using advanced AI analysis. The application offers both basic detection and in-depth analysis with image augmentation.

## Features

### General Detection
- 🖼️ Direct image analysis without cropping
- ✂️ Optional 160x160 face cropping tool
- 📊 Confidence score display
- 🎯 Real-time prediction results

### In-Depth Analysis
- 🔄 Multiple augmentation techniques
  - Grayscale conversion
  - Image rotation
  - Brightness adjustment
  - Horizontal flipping
- 📈 Consensus prediction from multiple analyses
- 📊 Detailed confidence metrics
- 🔍 Augmented analysis results
- ⚡ Processing time and performance metrics

### Common Features
- 📱 Responsive design (desktop & mobile)
- 📸 Support for both camera capture and gallery selection
- 🖼️ Interactive image cropping option
- 🔄 Real-time analysis
- 📝 Integrated API documentation

## Tech Stack

- React.js
- Tailwind CSS
- HTML5 Canvas

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/deepfake-detection-ui.git
cd deepfake-detection-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Environment Variables

Create a `.env` file in the project root:
```
REACT_APP_API_URL=http://your-backend-url/api/v1
```

## Project Structure

```
src/
├── components/
│   ├── ImageAnalyzer.jsx     # General detection component
│   └── AugmentedAnalyzer.jsx # In-depth analysis component
├── App.js                    # Main application component
├── index.js
└── index.css                # Global styles and Tailwind imports
```

## Usage

1. Select Analysis Type:
   - General Detection: Quick single-prediction analysis
   - In-Depth Analysis: Comprehensive analysis with multiple augmentation techniques

2. Image Upload:
   - Click/tap to select from gallery or take a photo
   - Choose direct analysis or cropping option

3. Analysis Options:
   - Direct Analysis: Process the full image immediately
   - Crop Analysis: Crop to 160x160 pixels before processing

4. View Results:
   - General Detection: View prediction and confidence score
   - In-Depth Analysis: View consensus prediction, augmented results, and detailed metrics

## Deployment

The project is configured for deployment on Vercel with GitHub Actions:

1. Push changes to GitHub:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

2. The GitHub Actions workflow will automatically deploy to Vercel.

## API Integration

The frontend integrates with a Flask-based API that provides:
- Basic image analysis endpoint
- Augmented analysis with multiple techniques
- Detailed prediction metrics

API documentation is available in the application's "API Documentation" tab.

## License

This project is licensed under the MIT License.
