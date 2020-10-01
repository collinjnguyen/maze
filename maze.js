/**
 * This is a maze solver. Draw walls and press solve.
 * If there is a valid path from the green square to
 * the red square, the path will be shown.
 * If not, display path not found. 
 */

var canvas;
var ctx;
var output;
var mazeCodeBox;
var mazeCode;
var mazeCodeText;

// Change this to set the speed at which the algorithm is displayed
const intervalSpeed = 1;

// Put an already made maze code into here to load it
var maze = "";

const WIDTH = 1200 * 2;
const HEIGHT = 800 * 2;
const tileW = 20;
const tileH = 20;
const tileRowCount = 25 * 2;
const tileColumnCount = 40 * 2;

var solveInterval;
var pathInterval;
var pathCounter = 0;

var xQueue = [0];
var yQueue = [0];
var pathFound = false;
var xLoc;
var yLoc;
var path;
var pathLength;
var currX;
var currY;
var boundX = 0;
var boundY = 0;

/** Array that holds the tiles and their states */
var tiles = [];

for (c = 0; c < tileColumnCount; c++) {
    tiles[c] = [];
    for (r = 0; r < tileRowCount; r++) {
        tiles[c][r] = {x: c*(tileW + 3), y: r*(tileH + 3), state: 'e'};
    }
}

tiles[0][0].state = 's';
tiles[tileColumnCount - 1][tileRowCount - 1].state = 'f';

if (maze != "") {
    var mazeArray = maze.split(" ");
    console.log(mazeArray);
    for (c= 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            tiles[c][r].state = mazeArray.shift();
        }
    }
}

/** Draw a rectangle with a color based on its state */
function rect(x, y, w, h, state) {

    if (state == 's') {
        ctx.fillStyle = '#00FF00'; // Green = Start
    } else if (state == 'f') {
        ctx.fillStyle = '#FF0000'; // Red = Finish
    } else if (state == 'e') {
        ctx.fillStyle = '#AAAAAA'; // Gray = Empty
    } else if (state == 'w') {
        ctx.fillStyle = '#0000FF'; // Blue = Wall
    } else if (state == 'x') {
        ctx.fillStyle = '#00FF00'; // Black = Path
    } else {
        ctx.fillStyle = '#FFFF00'; // Yellow = Explored
    }
    

    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

/** Clear rectangles */
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
}

/** Draw rectangles. This is looped to update the screen. */
function draw() {
    clear();
    
    for (c= 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            var currentTile = tiles[c][r];
            rect(currentTile.x, currentTile.y, tileW, tileH, currentTile.state);
        }
    }
    
}

/** Set the interval for the solve function */
function solveMaze() {
    for (c= 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            var currentTile = tiles[c][r];
            mazeCode = mazeCode + currentTile.state + " ";
            mazeCodeText.innerHTML = mazeCodeText.innerHTML + currentTile.state + " ";
        }
    }
    mazeCodeText = mazeCode;
    //mazeCodeBox.value = mazeCode;
    solveInterval = setInterval(solve, intervalSpeed);
}

/** Solve the maze. This is accomplished by exploring neighboring
tiles and marking them with a direction. Tiles explored are stored in a queue. 
If a neighboring tile is marked with f a path has been found. If a path is found
or the tile queue becomes empty with no path found, the final output is shown. */
function solve() {

        xLoc = xQueue.shift();
        yLoc = yQueue.shift();

        // Check if finished

        if (xLoc > 0) {
            if (tiles[xLoc - 1][yLoc].state == 'f') {
                pathFound = true;
            }
        }
        if (xLoc < tileColumnCount - 1) {
            if (tiles[xLoc + 1][yLoc].state == 'f') {
                pathFound = true;
            }
        }
        if (yLoc > 0) {
            if (tiles[xLoc][yLoc - 1].state == 'f') {
                pathFound = true;
            }
        }
        if (yLoc < tileRowCount - 1) {
            if (tiles[xLoc][yLoc + 1].state == 'f') {
                pathFound = true;
            }
        }

        // Check empty neighbors

        if (xLoc > 0) {
            if (tiles[xLoc - 1][yLoc].state == 'e') {
                xQueue.push(xLoc - 1);
                yQueue.push(yLoc);
                tiles[xLoc - 1][yLoc].state = tiles[xLoc][yLoc].state + 'l';
            }
        }
        if (xLoc < tileColumnCount - 1) {
            if (tiles[xLoc + 1][yLoc].state == 'e') {
                xQueue.push(xLoc + 1);
                yQueue.push(yLoc);
                tiles[xLoc + 1][yLoc].state = tiles[xLoc][yLoc].state + 'r';
            }
        }
        if (yLoc > 0) {
            if (tiles[xLoc][yLoc - 1].state == 'e') {
                xQueue.push(xLoc);
                yQueue.push(yLoc - 1);
                tiles[xLoc][yLoc - 1].state = tiles[xLoc][yLoc].state + 'u';
            }
        }
        if (yLoc < tileRowCount - 1) {
            if (tiles[xLoc][yLoc + 1].state == 'e') {
                xQueue.push(xLoc);
                yQueue.push(yLoc + 1);
                tiles[xLoc][yLoc + 1].state = tiles[xLoc][yLoc].state + 'd';
            }
        }
    

    // Output the path
    if (xQueue.length <= 0 || pathFound) {
        clearInterval(solveInterval);
        finalOutput();
    }
        
}

/** If no path found, output "Path not found". If path found, display the path. */
function finalOutput() {
    
    if (!pathFound) {
        output.innerHTML = 'No Solution';
        console.log("Path not found");
    } else {
        output.innerHTML = 'Path Found';
        console.log("Path found");
        path = tiles[xLoc][yLoc].state;
        pathLength = path.length;
        currX = 0;
        currY = 0;
        pathInterval = setInterval(displayFinalPath, intervalSpeed);
    }
}

/** Display the path through the maze */
function displayFinalPath() {
    if (path.charAt(pathCounter + 1) == 'u') {
        currY -= 1;
    }
    if (path.charAt(pathCounter + 1) == 'd') {
        currY += 1;
    }
    if (path.charAt(pathCounter + 1) == 'r') {
        currX += 1;
    }
    if (path.charAt(pathCounter + 1) == 'l') {
        currX -= 1;
    }
    tiles[currX][currY].state = 'x';
    pathCounter++;
    if (pathCounter >= pathLength) {
        clearInterval(pathInterval);
    }
}

/** Reset the maze back to it's original state. (Has problems) */
function reset() {
    for (c = 0; c < tileColumnCount; c++) {
        tiles[c] = [];
        for (r = 0; r < tileRowCount; r++) {
            tiles[c][r] = {x: c*(tileW + 3), y: r*(tileH + 3), state: 'e'};
        }
    }
    
    tiles[0][0].state = 's';
    tiles[tileColumnCount - 1][tileRowCount - 1].state = 'f';
    
    output.innerHTML = '';
}

function drawMaze() {
    var mazeArray = mazeCodeBox.value.split(" ");
    console.log(mazeArray);
    for (c= 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            tiles[c][r].state = mazeArray.shift();
        }
    }
}

/** Initialize the canvas and output elements. Set the draw interval. */
function init() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    output = document.getElementById("outcome");
    mazeCodeBox = document.getElementById("mazecode");
    mazeCodeText = document.getElementById("mazecodetext");
    return setInterval(draw, 1);
}

/** Allows mouse to be dragged to make tiles into walls */
function myMove(e) {
    x = e.pageX - canvas.offsetLeft;
    y = e.pageY - canvas.offsetTop;
    
    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            if ( (c*(tileW + 3) < x) && (x < c*(tileW + 3)+tileW) && (r*(tileH + 3) < y) && (y < r*(tileH + 3)+tileH)) {
                var currentTile = tiles[c][r];
                if (currentTile.state == 'e' && (c != boundX || r != boundY)) {
                    currentTile.state ='w';
                    boundX = c;
                    boundY = r;
                    console.log("changed from e to w");
                } else if (currentTile.state == 'w' && (c != boundX || r != boundY)) {
                    currentTile.state = 'e';
                    boundX = c;
                    boundY = r;
                    console.log("changed from w to e");
                }
            }
        }
    }
}

/** Checks if mouse is over a tile and sets the tile either to a wall or empty */
function myDown(e) {

    canvas.onmousemove = myMove;

    x = e.pageX - canvas.offsetLeft;
    y = e.pageY - canvas.offsetTop;
    
    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            if ( (c*(tileW + 3) < x) && (x < c*(tileW + 3)+tileW) && (r*(tileH + 3) < y) && (y < r*(tileH + 3)+tileH)) {
                var currentTile = tiles[c][r];
                if (currentTile.state == 'e') {
                    currentTile.state ='w';
                    boundX = c;
                    boundY = r;
                } else if (currentTile.state == 'w') {
                    currentTile.state = 'e';
                    boundX = c;
                    boundY = r;
                }
                console.log(tiles[c][r].state);
            }
        }
    }
}

/** Once mouse is up, don't allow walls to be filled when dragged. */
function myUp() {
    canvas.onmousemove = null;
}

init();
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;