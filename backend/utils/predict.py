# This is a placeholder. Replace with your ML model code.
# You can load your model once and reuse it.

import pickle
import requests
from PIL import Image
from io import BytesIO
import numpy as np

# Example: load model (change path accordingly)
# model = pickle.load(open("model/ripeness_model.pkl", "rb"))

def preprocess(img):
    img = img.resize((224, 224))  # adjust according to your model
    arr = np.array(img) / 255.0
    arr = arr.flatten()  # or keep shape depending on model
    return arr

def predict_ripeness(image_url):
    response = requests.get(image_url)
    img = Image.open(BytesIO(response.content)).convert('RGB')
    data = preprocess(img)

    # Example dummy model output (replace with model.predict)
    # pred = model.predict([data])[0]
    # return pred
    return "Stage 3 (Example output)"  # temporary placeholder
