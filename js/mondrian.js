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
var white = "#ffffff";
var black = "#000000";
var blue = '#0000ff';



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

function fillTile() {
  var tileData = { x: 0, y: 0, width: 0, height: 0 };

  var randomIndex = Math.floor(Math.random() * (dividers.length - 1));
  var randomDivider = dividers[randomIndex];
  console.log('Random Divider:');
  console.log(randomDivider);

  var intersections = dividers.filter(function(entry) {
    return randomDivider.axis.x === entry.axis.y || randomDivider.axis.y === entry.axis.x;
  });
  console.log("Intersections:");
  console.log(intersections);

  if (intersections.length > 0) {
    var randomIndex = Math.floor(Math.random() * (intersections.length - 1));
    var randomIntersection = intersections.splice(randomIndex, 1)[0];
    var closestNeighborIntersection = randomIntersection;//to avoid errors
    console.log("Random Intersection:");
    console.log(randomIntersection);

    if (intersections.length > 1) {
      for (i = 0; i < intersections.length; i++) {
        // debugger;
        if (randomIntersection.axis.y === intersections[i].axis.y) {
          if ( Math.abs(closestNeighborIntersection.axis.x - randomIntersection.axis.x) < Math.abs(intersections[i].axis.x - randomIntersection.axis.x) ) {
            closestNeighborIntersection = intersections[i];
          }
        } else if (randomIntersection.axis.y === intersections[i].axis.y) {

        }
      }

      console.log("Closest Neighbor Intersection:");
      console.log(closestNeighborIntersection);
    }
  }

}

function generateMondrian() {
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

  if (dividers.length > 0) fillTile();

}



canvas.onclick = generateMondrian;
