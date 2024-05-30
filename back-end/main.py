from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from io import BytesIO

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route("/get-predict-result", methods=["POST"])
def get_predict_result():
    file = request.files['image']
    img = Image.open(BytesIO(file.read()))
    return jsonify({"message": "Image received!"})

if __name__ == "__main__":
    app.run(debug=True, port=9898)