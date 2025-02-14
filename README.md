# Deepfake Detection UI

A React-based web application for deepfake image detection with an intuitive user interface. Users can upload images, crop faces to 160x160 pixels, and analyze them for authenticity.

## Features

- 📱 Responsive design (desktop & mobile)
- 🖼️ Interactive image cropping to 160x160 pixels
- 📸 Support for both camera capture and gallery selection
- 🔍 Real-time analysis results
- 📊 Confidence score display

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
git clone https://github.com/kks24/deepfake-detection-ui.git
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
REACT_APP_API_URL=http://localhost:5000/api/v1
```

## Project Structure

```
src/
├── components/
│   └── ImageAnalyzer.jsx
├── App.js
├── index.js
└── index.css
```

## Deployment

The project is configured for deployment on Vercel with GitHub Actions:

1. Push changes to GitHub:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

2. The GitHub Actions workflow will automatically deploy to Vercel.

## Development Notes

- Image cropping is implemented using HTML5 Canvas
- Supports touch events for mobile devices
- Maintains 160x160 pixel aspect ratio for model compatibility
- Provides real-time visual feedback during cropping

## License

This project is licensed under the MIT License.
