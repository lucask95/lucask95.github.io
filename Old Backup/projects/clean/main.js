$(document).ready(function(){
    $("#startBtn").click(startCleaning);
});

// -----------------------------------------------------//
// Classes
// -----------------------------------------------------//

class grid {
    // class variables:
    // grid (2d array of tiles), dirtyTiles (array of tiles), rows, cols
    constructor(rows, cols) {
        this.grid = [];
        this.rows = rows;
        this.cols = cols;
        this.dirtyTiles = [];
        this.populateGrid(rows, cols);
    }

    populateGrid(rows, cols) {
        for (var i = 0; i < rows; i++) {
            var row = [];
            for (var j = 0; j < cols; j++) {
                var temp = new tile(.25, i, j);
                // having a dirty tiles list helps with pathfinding
                if (temp.dirty == true)
                    this.dirtyTiles.push(temp);
                row.push(temp);
            }
            this.grid.push(row);
        }
    }
}

class tile {
    // class variables:
    // i, j, dirty (boolean)
    constructor(p, i, j) {
        // p = probability that cell is dirty
        if (Math.random() <= p)
            this.dirty = true;
        else
            this.dirty = false;
        this.i = i;
        this.j = j;
    }
}

class bot {
    constructor(i, j) {
        this.i = i;
        this.j = j;
    }
}

// -----------------------------------------------------//
// Global Variables
// -----------------------------------------------------//

// TODO: Remove global variables
var myGrid;
var myBot;
var animationTimer;
var botMoves = [];

// -----------------------------------------------------//
// Algorithm
// -----------------------------------------------------//

// returns list of moves to do, in order
// ex: ["UP", "UP", "LEFT", "CLEAN"]
function findMoves(tilePath) {
    // moves: 0=up, 1=down, 2=left, 3=right, 4=clean
    var move = -1;
    var moves = ["UP","DOWN","LEFT","RIGHT","CLEAN"];
    var moveList = [];
    var i = myBot.i;
    var j = myBot.j;
    var dy = 0;
    var dx = 0;

    // simulates bot movement and choosing move
    while (tilePath.length > 0) {
        dy = i - tilePath[0].i;
        dx = j - tilePath[0].j;
        if (dy == 0 && dx == 0) {
            // clean; remove tile from tile path once clean
            move = 4;
            tilePath.splice(0, 1);
        }
        else if (dx > 0) {
            j--; // left
            move = 2;
        }
        else if (dx < 0) {
            j++; // right
            move = 3;
        }
        else if (dy > 0) {
            i--; // up
            move = 0;
        }
        else if (dy < 0) {
            i++; // down
            move = 1;
        }
        moveList.push(moves[move]);
    }
    return moveList;
}

// returns the list of tiles to clean, in order.
// ex: return [
//     [0,1] // go to tile 0,1 first
//     [1,3] // go to tile 1,3 second
//     [3,4] // go to tile 3,4 third
// ];
// uses the greedy algorithm of finding nearest dirty tile
function findPath() {
    var dirtyTiles = myGrid.dirtyTiles;
    var startingLength = dirtyTiles.length;
    var tilePath = [];

    // for each dirty tile, find the nearest dirty tile via manhattan length
    for (var i = 0; i < startingLength; i++) {
        var minDistance = 100;
        var closestTile;
        var closestTileIndex;
        var tempDistance = 0;

        // check all other tiles that are not yet in path
        for (var j = 0; j < dirtyTiles.length; j++) {
            if (i == 0) {
                // find dirty tile nearest to bot
                tempDistance  = Math.abs(dirtyTiles[j].i - myBot.i);
                tempDistance += Math.abs(dirtyTiles[j].j - myBot.j);
            }
            else {
                // find nearest dirty tile to current tile
                tempDistance  = Math.abs(dirtyTiles[j].i - tilePath[i-1].i);
                tempDistance += Math.abs(dirtyTiles[j].j - tilePath[i-1].j);
            }

            // if tile being checked is closer than current closest tile
            // then replace closest tile
            if (tempDistance < minDistance) {
                minDistance = tempDistance;
                closestTile = dirtyTiles[j];
                closestTileIndex = j;
            }
        }

        // add nearest dirty tile to path and remove it from the array of tiles
        // that are not yet in the path
        tilePath.push(closestTile);
        dirtyTiles.splice(closestTileIndex, 1);
    }

    return tilePath;
}

// finds the shortest path between all tiles by calculating every possible path
// returns list of tiles to clean, in order. O(n!)
// path = { pathLength: #, tiles: [tiles] }
function findPathBruteForce(path, tilesLeft) {
    var shortestPath = {
        pathLength: -1,
        tiles: []
    };

    for (var i = 0; i < tilesLeft.length; i++) {
        // use cloneDeep to make copies of the variables rather than references
        var tempTiles = _.cloneDeep(tilesLeft);
        var tempPath = _.cloneDeep(path);
        var tempLength = 0;

        // add another tile to the path and get the number of tiles in the path
        tempPath.tiles.push(tempTiles[i]);
        tempLength = tempPath.tiles.length;

        // update path length
        if (tempLength > 1) {
            tempPath.pathLength += Math.abs(tempPath.tiles[tempLength-1].i -
                tempPath.tiles[tempLength-2].i);
            tempPath.pathLength += Math.abs(tempPath.tiles[tempLength-1].j -
                tempPath.tiles[tempLength-2].j);
        }
        else if (tempLength == 1) {
            tempPath.pathLength += Math.abs(tempPath.tiles[tempLength-1].i - myBot.i);
            tempPath.pathLength += Math.abs(tempPath.tiles[tempLength-1].j - myBot.j);
        }

        // remove the tile just added from the tilesLeft
        tempTiles.splice(i, 1);
        if (tempTiles.length > 0)
            tempPath = findPathBruteForce(tempPath, tempTiles);

        // if there is not yet a shortest path, the newest path must be the shortest
        if (shortestPath.pathLength == -1)
            shortestPath = tempPath;
        else if (tempPath.pathLength < shortestPath.pathLength)
            shortestPath = tempPath;
    }

    return shortestPath;
}

// -----------------------------------------------------//
// Animation
// -----------------------------------------------------//

function animateMove() {
    var tileId = "#"+myBot.i+"_"+myBot.j;

    // calculate new bot coordinates
    switch (botMoves[0]) {
        case "UP":
            myBot.i--;
            break;
        case "DOWN":
            myBot.i++;
            break;
        case "LEFT":
            myBot.j--;
            break;
        case "RIGHT":
            myBot.j++;
            break;
        case "CLEAN":
            $("#"+myBot.i+"_"+myBot.j).removeClass("dirty");
            break;
    }

    // animate movement of the bot
    $("#botImage").animate({
        "top": ($(tileId).css("top")),
        "left": ($(tileId).css("left"))
    }, 200);

    // remove most recent movement from the path and go on to the next move
    if (botMoves.splice(0, 1).length > 0)
        setTimeout(animateMove, 250);
    else
        $("#startBtn").prop("disabled",false);
}

// -----------------------------------------------------//
// Initialization
// -----------------------------------------------------//

function renderGrid() {
    // create classtext var here so it does not keep getting deleted and recreated
    var classtext = "";
    $("#renderArea").html("");

    // for each tile in the grid, render it on the page
    for (var i = 0; i < myGrid.rows; i++) {
        for (var j = 0; j < myGrid.cols; j++) {
            // render plain or dirty tile
            if (myGrid.grid[i][j].dirty == true)
                classtext = "tile dirty";
            else
                classtext = "tile";
            $("#renderArea").append("<span class=\""+classtext+"\" id="+i+"_"+j+"></span>");

            // position tile. 15 pixel offset is purely aesthetic
            $("#"+i+"_"+j).css({
                "top": (i*64+15)+"px",
                "left": (j*64+15)+"px"
            });
        }
    }
}

function renderBot() {
    // randomize bot's starting position
    var botRow = Math.floor(Math.random()*myGrid.rows);
    var botCol = Math.floor(Math.random()*myGrid.cols);
    var text = "<img src=\"bot.png\" id=\"botImage\">";
    var tileId = "#"+botRow+"_"+botCol;
    myBot = new bot(botRow, botCol);

    // get position of tile at bot's coordinates and draw bot in the same place
    $("#renderArea").append(text);
    $("#botImage").css({
        "top": ($(tileId).css("top")),
        "left": ($(tileId).css("left"))
    });
}

function startCleaning() {
    var rows = parseInt($("#rowsIn").val());
    var cols = parseInt($("#colsIn").val());
    if (rows < 3 || cols < 3) {
        alert("Grid must be at least 3x3");
        return;
    }


    $("#startBtn").prop("disabled",true);
    myGrid = new grid(rows, cols);
    renderGrid();
    renderBot();

    // find path, then find moves for that path
    var path = { pathLength: 0, tiles: [] };
    botMoves = findMoves(findPathBruteForce(path, myGrid.dirtyTiles).tiles);

    // start animation
    setTimeout(animateMove, 250);
}
