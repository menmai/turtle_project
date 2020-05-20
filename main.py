from flask import Flask, request, render_template
from mgr import get_data, valid_filename


app = Flask(__name__)


# Home Page Route
@app.route("/")
def index():
    return render_template("index.html")


# Data handling route. Does not render HTML
@app.route("/handle_data", methods=["POST"])
def handle_data():
    # Check if file data was received. Already checked client-side.
    # if "file" not in request.files:
    #    return "ERROR: No file data received."

    file = request.files["file"]

    # Check that file name is not empty
    if file.filename == "":
        return "ERROR: Invalid file name."

    # Evaluate if file name is valid by preference. May not be necessary
    # since we won't be saving the file to local system.
    # Then process the received data and return it to the front-end.
    if valid_filename(file):
        return get_data(file)
    else:
        return "ERROR: Invalid file name or extenstion. (.txt required)"

    return "ERROR: An error occurred while handling the request."
