from flask import Flask, request, abort,jsonify
import os
from detect_image import test_image
import base64

BASE_IMAGE_DIR = 'debug'
app = Flask(__name__)

@app.route('/detect', methods=['POST'])
def detect_license_plate():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    image_path = "images/temp_image.jpg"
    file.save(image_path)

    license_plate = test_image(image_path)
    print(license_plate)
    return jsonify({'license_plate': license_plate})


@app.route('/debug/<int:number>', methods=['GET'])
def debug_license_plate(number):
    directory_path = os.path.join(BASE_IMAGE_DIR, str(number))
    if os.path.exists(directory_path) and os.path.isdir(directory_path):
        images = [f for f in os.listdir(directory_path) if os.path.isfile(os.path.join(directory_path, f)) and f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif'))]

        if not images:
            return abort(404, description="No images found")

        image_data = {}
        for image in images:
            image_path = os.path.join(directory_path, image)
            with open(image_path, 'rb') as img_file:
                encoded_image = base64.b64encode(img_file.read()).decode('utf-8')
                image_data[image] = encoded_image

        return jsonify(image_data)

    else:
        return abort(404, description="Directory not found")

if __name__ == "__main__":
    # print(test_image())
    app.run(host='0.0.0.0', port=8000)

