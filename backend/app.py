from flask import Flask, request, jsonify
from flask_cors import CORS
import cloudinary
import cloudinary.uploader
from utils.predict import predict_ripeness   # <-- paste your ML code there

app = Flask(__name__)
CORS(app)

# Configure Cloudinary
cloudinary.config(
    cloud_name="YOUR_CLOUD_NAME",
    api_key="YOUR_API_KEY",
    api_secret="YOUR_API_SECRET"
)

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']

    # 1. Upload to Cloudinary
    upload_result = cloudinary.uploader.upload(file)
    image_url = upload_result.get("secure_url")

    # 2. Run ML model prediction
    prediction = predict_ripeness(image_url)  # or pass file if your code prefers local files

    return jsonify({
        'image_url': image_url,
        'prediction': prediction
    })

if __name__ == '__main__':
    app.run(debug=True)
