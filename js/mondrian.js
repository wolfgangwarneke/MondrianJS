Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

var container = document.getElementById("mondrian-container");

var canvas = document.createElement("canvas");
canvas.width = 500;
canvas.height = 500;
container.appendChild(canvas);
var fallBackMessage = document.createElement("p");
fallBackMessage.innerText = "Your browser does not support MondrianJS.  Please go look at one of his real paintings.  Or just imagine a bunch of rectangles with black borders and some of the rectangles are either blue, red, or yellow.  That's pretty much it really.";
canvas.appendChild(fallBackMessage);

var ctx = canvas.getContext("2d");

var dividerWidth = canvas.width * 0.025;
var minDividers = 4;
var maxDividers = 9;
var dividers = [];

//hex colors
var white = "#ffffff";
var black = "#000000";
var grey = "#d9e5f7";
var blue = '#2c5fd6';
var lightBlue = '#4286f4';
var yellow = '#ffef1c';
var dirtyYellow = '#ddc106';
var red = '#ff0000';
var tileColors = [blue, red, yellow, grey];



function intRandomRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomAxis() {
  var trueOrFalse = (Math.floor(Math.random() * 2) == 0);
  var randomX = intRandomRange(0, canvas.width);
  var randomY = intRandomRange(0, canvas.height);
  return trueOrFalse ? { x: randomX, y: 0 } : { x: 0, y: randomY };
}

function clearCanvas() {
  ctx.fillStyle = white;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function Divider(width, axis = getRandomAxis()) {
  this.axis = axis;
  this.width = width;
  this.direction = this.axis.x === 0 ? "horizontal" : "vertical";
}

Divider.prototype.drawSelf = function () {
  if (this.axis.x !== 0) {
    ctx.fillRect(this.axis.x, this.axis.y, this.width, canvas.height);
  } else {
    ctx.fillRect(this.axis.x, this.axis.y, canvas.width, this.width);
  }
};

function verifyNoOverlap(group, element) {
  var flag = true;
  for ( i = 0; i < group.length; i++ ) {
    if (
      (group[i].axis.x === 0 && element.axis.x === 0 && Math.abs(group[i].axis.y - element.axis.y) < element.width * 2)
      ||
      (group[i].axis.y === 0 && element.axis.y === 0 && Math.abs(group[i].axis.x - element.axis.x) < element.width * 2)
    ) {
      flag = false;
    }
  }
  return flag;
}

function Tile(upperLeftXY = {x: 0, y: 0 }, width = canvas.width, height = canvas.height) {
  this.origin = upperLeftXY;
  this.width = width;
  this.height = height;
  this.color = tileColors.random();
}

Tile.prototype.drawSelf = function () {
  ctx.fillStyle = this.color;
  ctx.fillRect(this.origin.x, this.origin.y, this.width, this.height);
};

function fillTile() {
  var tile = new Tile();

  var randomIndex = Math.floor(Math.random() * (dividers.length - 1));
  var randomDivider = dividers.splice(randomIndex, 1)[0];

  var intersections = dividers.filter(function(entry) {
    return randomDivider.direction !== entry.direction;
  });

  var randomIntersection = intersections.splice(Math.floor(Math.random()*intersections.length), 1)[0];

  function findNextGreaterDivider(divider, dividers, index = 0) {
    var nextGreaterDivider;
    var xOrY = divider.direction === "vertical" ? "x" : "y";

    var greaterDividers = dividers.filter(function(entry) {
      return entry.axis[xOrY] > divider.axis[xOrY];
    });

    greaterDividers.sort(function(a, b) {
      return a.axis[xOrY] - b.axis[xOrY];
    });

    nextGreaterDivider = greaterDividers[index];

    return nextGreaterDivider;
  }

  var nextIntersection = findNextGreaterDivider(randomIntersection, intersections);

  var parallelDividers = dividers.filter(function(entry) {
    return randomDivider.direction === entry.direction;
  });

  var nextDivider = findNextGreaterDivider(randomDivider, parallelDividers);


  //find upperLeftXY of Tile
  var enclosingDividers = [];
  if (randomDivider) enclosingDividers.push(randomDivider);
  if (nextDivider) enclosingDividers.push(nextDivider);
  if (randomIntersection) enclosingDividers.push(randomIntersection);
  if (nextIntersection) enclosingDividers.push(nextIntersection);

  function getLesserDivider(firstDivider, secondDivider) {
    var xOrY = firstDivider.direction === "horizontal" ? "y" : "x";
    return firstDivider.axis[xOrY] < secondDivider.axis[xOrY] ? firstDivider : secondDivider;
  }

  var horizontalDividers = enclosingDividers.filter(function(entry) {
    return entry.direction === "horizontal";
  });
  var topDivider = getLesserDivider(horizontalDividers[0], horizontalDividers[1]);

  var verticalDividers = enclosingDividers.filter(function(entry) {
    return entry.direction === "vertical";
  });
  var leftDivider = getLesserDivider(verticalDividers[0], verticalDividers[1]);

  var upperLeftX = leftDivider.axis.x + leftDivider.width;
  var upperLeftY = topDivider.axis.y + topDivider.width;

  tile.origin.x = upperLeftX;
  tile.origin.y = upperLeftY;

  // get lower right XY of tile for width and height
  function getGreaterDivider(firstDivider, secondDivider) {
    var xOrY = firstDivider.direction === "horizontal" ? "y" : "x";
    return firstDivider.axis[xOrY] > secondDivider.axis[xOrY] ? firstDivider : secondDivider;
  }
  var rightDivider = getGreaterDivider(verticalDividers[0], verticalDividers[1]);
  var bottomDivider = getGreaterDivider(horizontalDividers[0], horizontalDividers[1]);

  var width = rightDivider.axis.x - leftDivider.axis.x - rightDivider.width;
  var height = bottomDivider.axis.y - topDivider.axis.y - bottomDivider.width;

  tile.width = width;
  tile.height = height;

  // function ifExistsThenColor(divider, color) {
  //   ctx.fillStyle = color;
  //   divider.drawSelf();
  // }
  // ifExistsThenColor(randomDivider, "#ff0000");
  // ifExistsThenColor(nextDivider, "#ff7777");
  // ifExistsThenColor(randomIntersection, "#ffff00");
  // ifExistsThenColor(nextIntersection, "#ffff99");

  //tile.color = "#0033ff";
  tile.drawSelf();
  // tile.width /= 2;
  // tile.height /= 2;
  // tile.color = "rgba(100, 100, 256, 0.7)";
  // tile.drawSelf();

}

function setupGhostBoundaryDividers(dividerArray, canvasOutput) {
  var top = new Divider(dividerWidth, {x: -dividerWidth, y: 0});
  dividerArray.push(top);
  var bottom = new Divider(dividerWidth, {x: canvas.height, y: 0});
  dividerArray.push(bottom);
  var left = new Divider(dividerWidth, {x: 0, y: -dividerWidth});
  dividerArray.push(left);
  var right = new Divider(dividerWidth, {x: 0, y: canvas.width});
  dividerArray.push(right);
}

function generateMondrian() {
  console.clear();
  clearCanvas();
  dividers = [];

  ctx.fillStyle = black;
  var totalLines = intRandomRange(minDividers, maxDividers);
  for (i = 0; i < totalLines; i++) {
    var divider = new Divider(dividerWidth);
    if (verifyNoOverlap(dividers, divider)) {
      divider.drawSelf();
      dividers.push(divider);
    }
  }

  setupGhostBoundaryDividers(dividers, canvas);

  if (dividers.length > 0) {
    fillTile();
    fillTile();
    fillTile();
  }


}


canvas.onclick = generateMondrian;
