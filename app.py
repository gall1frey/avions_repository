from flask import Flask, render_template, url_for
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route("/",methods=['GET'])
def hello():
    with open('data/data.json','r') as f:
        data = json.loads(f.read())
    return render_template('index.html',**locals())

@app.route("/assets/Airplane.obj",methods=['GET'])
def airplane():
    with open('static/assets/Airplane.obj','rb') as f:
        return f.read()

@app.route("/assets/avions_logo.png",methods=['GET'])
def logo():
    with open('static/assets/avions_logo.png','rb') as f:
        return f.read()

@app.route("/favicon.ico",methods=['GET'])
def favicon():
    with open('favicon.ico','rb') as f:
        return f.read()

@app.route("/gallery",methods=['GET'])
def gallery():
    return render_template('gallery.html')
