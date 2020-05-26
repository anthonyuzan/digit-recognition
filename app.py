from flask import Flask, render_template, request, json
import tensorflow as tf
import numpy as np
import cv2
import re
import base64

app = Flask(__name__)

def convertImage(imgData):
    img_str = re.search(r'base64,(.*)"}',imgData).group(1)
    with open("output.png", "wb") as fh:
        fh.write(base64.b64decode(img_str))

@app.route('/', methods=['GET'])
def home():
    return render_template("index.html")

@app.route('/predict', methods=['POST'])
def predict():
    if(model):
        img = request.get_data().decode('utf-8')
        convertImage(img)
        x = cv2.imread("output.png", cv2.IMREAD_UNCHANGED)
        y = np.zeros((280,280))

        for i in range(len(x)):
            for j in range(len(x)):
                y[i][j] = x[i][j][3] / 255.0
        
        scale_percent = 10
        width = int(x.shape[1] * scale_percent / 100)
        height = int(x.shape[0] * scale_percent / 100)
        dim = (width, height)

        y = cv2.resize(y, dim)
        y = np.reshape(y,(1, 28, 28))

        result = str(np.argmax(model.predict(y)))
        return result


if __name__ == '__main__':
    model = tf.keras.models.load_model('my_model.h5')
    port = 5000
    app.run(port=port)