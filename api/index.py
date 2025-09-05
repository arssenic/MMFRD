from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import tensorflow as tf
import io
import base64
# Removed: from tensorflow.keras.preprocessing import image
import os

app = Flask(__name__)
CORS(app)  # Allow Vite dev server

# Configuration
MODEL_PATH = 'model/dnn.h5'
IMG_SIZE = (224, 224)  # Adjust based on your model's input size

# Class mappings - adjust based on your model's classes
CLASS_NAMES = {
    0: 'Green',
    1: 'Ripe',
    2: 'Overripe',
    3: 'Decay'
}

RIPENESS_STAGES = {
    0: 'green',
    1: 'ripe',
    2: 'overripe',
    3: 'decay'
}

DESCRIPTIONS = {
    0: 'This banana is green and unripe. Store at room temperature for 3-5 days to ripen naturally.',
    1: 'Perfect ripeness! This banana is sweet, creamy, and ready to eat fresh or use in recipes.',
    2: 'Overripe but still good for consumption. Excellent for smoothies, baking, or banana bread.',
    3: 'This banana has started to decay. Not recommended for consumption - discard safely.'
}

# Load model on startup
model = None

def load_model():
    global model
    try:
        if os.path.exists(MODEL_PATH):
            model = tf.keras.models.load_model(MODEL_PATH)
            print(f"✅ Model loaded successfully from {MODEL_PATH}")
            print(f"Model input shape: {model.input_shape}")
            print(f"Model output shape: {model.output_shape}")
        else:
            print(f"❌ Model file not found at {MODEL_PATH}")
            # For demo purposes, we'll create a mock model
            print("🔄 Running in demo mode with mock predictions")
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        model = None

def preprocess_image(img):
    """Preprocess image for model prediction"""
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    img = img.resize(IMG_SIZE)
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    # Normalize pixel values to [0,1] range as expected by most models
    img_array = img_array.astype(np.float32) / 255.0
    
    return img_array

def mock_classification(img_array):
    """Mock classification for demo purposes"""
    # Simulate a prediction - in real implementation, use: model.predict(img_array)
    mock_predictions = np.random.rand(4)
    # Make it more realistic by favoring ripe stage
    mock_predictions[1] *= 2  # Favor "ripe" class
    mock_predictions[2] *= 1.5  # Favor "overripe" class
    mock_predictions = mock_predictions / np.sum(mock_predictions)
    
    predicted_class = int(np.argmax(mock_predictions))
    confidence = float(mock_predictions[predicted_class])
    
    return predicted_class, confidence

@app.route('/classify', methods=['POST'])
def classify_banana():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.content_type.startswith('image/'):
            return jsonify({'error': 'File must be an image'}), 400
        
        # Load and preprocess image
        img = Image.open(io.BytesIO(file.read()))
        img_array = preprocess_image(img)
        
        # Make prediction
        if model is not None:
            print("🔍 Running model prediction...")
            predictions = model.predict(img_array, verbose=0)
            predicted_class = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_class])
        else:
            # Use mock classification for demo
            predicted_class, confidence = mock_classification(img_array)
        
        # Prepare response
        print(f"📊 Prediction: {CLASS_NAMES[predicted_class]} (confidence: {confidence:.2%})")
        result = {
            'class': CLASS_NAMES[predicted_class],
            'confidence': confidence,
            'ripeness_stage': RIPENESS_STAGES[predicted_class],
            'description': DESCRIPTIONS[predicted_class],
            'class_id': predicted_class
        }
        
        print(f"✅ Classification completed successfully")
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': f'Classification failed: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'model_path': MODEL_PATH
    })

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'Banana Ripeness Classification API',
        'endpoints': {
            '/classify': 'POST - Upload image for classification',
            '/health': 'GET - Check API health'
        }
    })

# if __name__ == '__main__':
#     print("🚀 Starting Banana Ripeness Classification API...")
#     load_model()
#     app.run(host='0.0.0.0', port=5000, debug=False)