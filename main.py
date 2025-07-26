from flask import Flask, render_template, url_for, request, redirect
import requests


app = Flask(__name__)

url = f"https://api.dictionaryapi.dev/api/v2/entries/en/<word>"


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/basic', methods=['POST', 'GET'])
def basic():
    word = request.form.get("word")
    response = requests.get(url=f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}").json()
    print(response)
    return render_template('basic.html', word=response[0])


if __name__ == '__main__':
    app.run(debug=True)