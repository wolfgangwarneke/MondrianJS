var container = document.getElementById("mondrian-container");

var canvas = document.createElement("canvas");
canvas.width = 500;
canvas.height = 500;
container.appendChild(canvas);

var ctx = canvas.getContext("2d");

var dividerWidth = canvas.width * 0.025;
var minDividers = 2;
var maxDividers = 10;
var dividers = [];

//hex colors
var white = "#fff";
var black = "#000";



function intRandomRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomAxis() {
  var trueOrFalse = (Math.floor(Math.random() * 2) == 0);
  var randomX = intRandomRange(0, canvas.width);
  var randomY = intRandomRange(0, canvas.height);
  console.log(trueOrFalse);
  return trueOrFalse ? { x: randomX, y: 0 } : { x: 0, y: randomY };
}

function clearCanvas() {
  ctx.fillStyle = white;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function Divider(width, axis = getRandomAxis()) {
  this.axis = axis;
  this.width = width;
  this.drawSelf();
}

Divider.prototype.drawSelf = function () {
  if (this.axis.x !== 0) {
    ctx.fillRect(this.axis.x, this.axis.y, this.width, canvas.height);
  } else {
    ctx.fillRect(this.axis.x, this.axis.y, canvas.width, this.width);
  }
};

function generateMondrian() {
  clearCanvas();
  dividers = [];

  ctx.fillStyle = black;
  var totalLines = intRandomRange(minDividers, maxDividers);
  for (i = 0; i < totalLines; i++) {
    dividers.push(new Divider(dividerWidth));
  }
}



canvas.onclick = generateMondrian;
