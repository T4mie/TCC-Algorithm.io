from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/calc")
def calc():
    result = 1 + 1
    return jsonify({"result": result})

if __name__ == "__main__":
    app.run(port=5000)