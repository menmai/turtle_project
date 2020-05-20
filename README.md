# Turtle Project

<h1>Path following full stack application</h1>

This app is used to visualize a set of directions passed from a file containing the characters LRF, where - 

L represents a counter clockwise turn.
R represents a clockwise turn.
F represents a forward movement.

The file input is expected to be .txt format with content similar to: LRFFRLRRLLLLRFFLRLFF
Although, the app is able to discern between characters and character casing.

<h2>Running the app</h2>

(Python required)

1. Download the project

2. Open your terminal in the directory containing the main.py file

3. Export the flask app environment variable using:

`export FLASK_APP=main.py`

4. Start the app using:

`flask run`

(Alternatively for step 5, you can use `python -m flask run`

5. Open a web browser and navigate to localhost:5000

6. Select a .txt file containing your LRF format directions and select row and column sizes (Max 181x181, Default 131x131)

7. Press Begin and enjoy!
