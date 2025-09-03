# Banana Ripeness Classification App

A full-stack web application that uses machine learning to classify banana ripeness stages from photos.

## Features

- **Dual Input Methods**: Camera capture and file upload
- **Real-time Classification**: Instant results with confidence scores
- **Responsive Design**: Works seamlessly on mobile and desktop
- **User-friendly Interface**: Clean, intuitive design with smooth animations
- **Detailed Results**: Classification with recommendations and tips

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Flask + TensorFlow/Keras
- **ML Model**: Pre-trained banana ripeness classifier (.h5 format)

## Project Structure

```
├── src/                    # React frontend
│   ├── components/         # Reusable React components
│   ├── utils/             # API utilities
│   └── App.tsx            # Main application component
├── backend/               # Flask backend
│   ├── app.py            # Flask application
│   ├── requirements.txt  # Python dependencies
│   └── model/            # ML model storage
└── README.md
```

## Setup Instructions

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Place your trained model:
- Create a `model` directory in the backend folder
- Place your `.h5` model file as `model/banana_classifier.h5`

5. Start the Flask server:
```bash
python app.py
```

## Usage

1. Open the application in your browser
2. Choose to either:
   - Take a photo using your device's camera
   - Upload an existing image from your computer
3. Wait for the AI to analyze your banana
4. View detailed classification results with recommendations

## Model Information

The application expects a Keras/TensorFlow model that:
- Accepts RGB images of 224x224 pixels
- Classifies bananas into 6 ripeness categories:
  - Unripe (Green)
  - Slightly Ripe (Green-Yellow)
  - Ripe (Yellow)
  - Very Ripe (Yellow with spots)
  - Overripe (Brown spots)
  - Very Overripe (Mostly brown)

## Development

To run both frontend and backend simultaneously:

1. Start the Flask backend (Terminal 1):
```bash
cd backend && python app.py
```

2. Start the React frontend (Terminal 2):
```bash
npm run dev
```

## Deployment Notes

- Frontend can be deployed to any static hosting service
- Backend requires a Python environment with ML dependencies
- Ensure CORS is properly configured for cross-origin requests
- Model file should be included in backend deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request