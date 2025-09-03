# Banana Ripeness Classification Backend

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Your trained banana classification model (.h5 file)

### Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Place your model:
- Create a `model` directory in the backend folder
- Place your trained model file as `model/banana_classifier.h5`

### Model Requirements

Your model should:
- Accept RGB images of size 224x224 (adjustable in app.py)
- Output 6 classes corresponding to ripeness stages
- Be trained on normalized images (0-1 range)

### Running the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

### API Endpoints

- `POST /classify` - Upload image for classification
- `GET /health` - Check server health
- `GET /` - API information

### Model File Structure

```
backend/
├── app.py
├── requirements.txt
├── model/
│   └── banana_classifier.h5  # Your trained model
└── README.md
```

### Testing

You can test the API using curl:

```bash
curl -X POST \
  http://localhost:5000/classify \
  -F "image=@path/to/banana/image.jpg"
```