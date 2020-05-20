// File size limit in kB
const FILE_SIZE_LIMIT = 1000;

// Speed of visual display
const VISUAL_SPEED = 1;

// Default row and column amount
const TABLE_SIZE = 131;
const MAX_TABLE_SIZE = 181;

// Global variables
let position = [0, 0];
let direction = "UP";
let visited_positions = [];
let revisited_positions = [];

/*
 * Initial page set up
 */

prepareEnvironment(true);

/*
 * Prepare environment for visual operations
 */

function prepareEnvironment(initialPageLoad) {
  // Fetch row and column count from input forms
  let rowCount = $("#rowCount").val();
  let columnCount = $("#columnCount").val();

  // Set default row and column count if not given
  if (!rowCount) rowCount = TABLE_SIZE;
  if (!columnCount) columnCount = TABLE_SIZE;

  // Set max row and column count if larger than 181
  if (rowCount > MAX_TABLE_SIZE) rowCount = MAX_TABLE_SIZE;
  if (columnCount > MAX_TABLE_SIZE) columnCount = MAX_TABLE_SIZE;

  // Update table
  updateTable(rowCount, columnCount);

  // If this isn't the initial page load, attempt to run the program
  if (!initialPageLoad) {

    // Reset global variables
    resetGlobals(rowCount, columnCount);

    // Get file and check validity
    var file = $("#inputFile").prop("files")[0];
    if (!checkValidFile(file)) return;

    // Disable Begin! button while we evaluate input
    $("button").prop("disabled", true);

    // Create a new file request to server and begin processing response
    processFileRequest(file).then(function(result) {
      clearError();
      if (!result.toLowerCase().includes("error"))
        processReceivedData(result);
      else {
        $("button").prop("disabled", false);
        postError(result);
      }
    });
  }
}

/*
 * Pass data as a string and loop through the characters
 * at the specified time interval
 */

function processReceivedData(chars) {
  for (let i = 0; i < chars.length; i++) {
    setTimeout(function() {
      executeStep(chars.charAt(i), i, chars.length - 1);
    }, VISUAL_SPEED * i);
  }
}

/*
 * Execute the particular (L, R, F) step based on given character
 */

function executeStep(step, stepID, totalMoves) {
  // currentTile is at table cell represented by position indices
  let currentTile = getTile(position[0], position[1]);

  // Perform special operations if it is the first tile
  if (stepID === 0) changeTileColor(currentTile, "red");

  if (step === "L" || step === "R") {
    // Global directional update
    direction = getNewDirection(direction, step);

  } else if (step === "F") {
    // global positional update
    position = getNewPosition(direction, position[0], position[1]);

    // Update currentTile to the new position
    currentTile = getTile(position[0], position[1]);

    // If the current tile is outside of the table, log details
    // Will not affect the ending results
    if (!currentTile)
      console.log("Tile extends outside view and cant not be seen.");

    if (containsArray(visited_positions, position)) {
      // If the current position has already been visisted, change tile to red
      revisited_positions.push(position);
      changeTileColor(currentTile, "orange");
    } else {
      // If the current position has not yet been visited, change tile to blue
      visited_positions.push(position);
      changeTileColor(currentTile, "blue");
    }
  }

  // Perform special operations if currentTile is the last tile
  if (stepID === totalMoves) lastStep(currentTile);
}

/*
 * Check if a cell index is valid and return the cell (tile)
 */

function getTile(rowIdx, columnIdx) {
  var table = $("table")[0];

  // Check if row exists
  var row = table.rows[position[0]];
  if (!row) return "";

  // Check if cell exists
  var cell = row.cells[position[1]];
  if (!cell) return "";

  return cell;
}

/*
 * Special function for last position in sequence
 */

function lastStep(tile) {
  $("button").prop("disabled", false);
  changeTileColor(tile, "red");
}

/*
 * Reset global variables
 */

function resetGlobals(startingX, startingY) {
  direction = "UP";
  position = [arrayMiddle(startingX), arrayMiddle(startingY)];
  visited_positions = [];
}

/*
 * Evaluate direction and position changes
 */

function getNewDirection(currentDirection, go) {
  if (go === "L") {
    if (currentDirection === "UP") return "LEFT";
    if (currentDirection === "RIGHT") return "UP";
    if (currentDirection === "DOWN") return "RIGHT";
    if (currentDirection === "LEFT") return "DOWN";
  } else if (go === "R") {
    if (currentDirection === "UP") return "RIGHT";
    if (currentDirection === "RIGHT") return "DOWN";
    if (currentDirection === "DOWN") return "LEFT";
    if (currentDirection === "LEFT") return "UP";
  }
}

function getNewPosition(currentDirection, r, c) {
  let new_col = c;
  let new_row = r;

  // Rows in table start at 0 and go top to bottom
  if (currentDirection === "UP") new_row = r - 1;
  if (currentDirection === "DOWN") new_row = r + 1;

  // Cells in a row start at 0 and go left to right
  if (currentDirection === "RIGHT") new_col = c + 1;
  if (currentDirection === "LEFT") new_col = c - 1;

  return [new_row, new_col];
}

/*
 * Dynamically update the existing HTML table in the browser
 */

function updateTable(rows, columns) {
  // Clear the currently existing table
  // Consider preventing re-rendering of entire table
  let table = $("table")[0];
  table.innerHTML = "";

  // Create row elements
  for (let i = 0; i < rows; i++) {
    const tr = document.createElement('tr');

    // Create column elements and add to rows
    for (let j = 0; j < columns; j++) {
      const td = document.createElement('td');
      tr.appendChild(td);
    }

    // Add row elements to table
    table.appendChild(tr);
  }
}

/*
 * Handle file request and response
 */

function checkValidFile(file) {
  // Check that a file is available, and it fits the size limitations
  if (!file) {
    postError("Error: No file selected. Please choose a .txt file.");
    return false;
  }
  if (!validFileSize(file)) {
    postError("Error: File size too big. Limit is " + FILE_SIZE_LIMIT + " kB.");
    return false;
  }

  return true;
}

function validFileSize(file) {
  // Limit file size to FILE_SIZE_LIMIT kB
  if (file.size / 1024 > FILE_SIZE_LIMIT)
    return false;

  return true;
}

function processFileRequest(file) {
  // Create a form data object that can be sent to the server
  var formData = new FormData();
  formData.append("file", file);

  // Send request to the server and return the response
  return $.ajax({
    url: "/handle_data",
    type: "post",
    data: formData,
    cache: false,
    contentType: false,
    processData: false
  });
}

/*
 * General purpose
 */

function changeTileColor(tile, color) {
  if (tile) tile.style.backgroundColor = color;
}

function postError(err) {
  clearError();
  // Post an error message after the table element
  $("<h1 class='error-message'>" + err + "</h1>").insertAfter($("table")[0]);
}

function clearError() {
  $(".error-message").remove();
}

function arrayMiddle(value) {
  return Math.floor(value / 2);
}

function containsArray(array, subArray) {
  // Check if an array contains a subArray (of size 2)
  for (let i = 0; i < array.length; i++)
    if (array[i][0] === subArray[0] && array[i][1] === subArray[1])
      return true;

  return false;
}
