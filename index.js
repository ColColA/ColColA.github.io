// ----Initialize Functions----

// create node class
class node {
  constructor(pos, isObs) {
    this.parent = null;
    this.g = 0;
    this.h = 0;
    this.f = 0;
    this.pos = pos;
    this.isObs = isObs;
    this.debug = "";
  }
}

// create double-nested array of nodes
function initializeNodeMap(rows, columns) {
  let array = [];

  for (let i = 0; i < rows; i++) {
    array.push([]);
    for (let j = 0; j < columns; j++) {
      let pos = {
        x: i,
        y: j
      };
      let newNode = new node(pos, false);
      array[i].push(newNode);
    }
  }

  return array;
}

// ----Create Noise Map----

let cnvsSize = 512
let cnvs = document.getElementById('cnvs');
cnvs.width = cnvs.height = cnvsSize;
let ctx = cnvs.getContext('2d');
let mapSize = cnvsSize/4

let map = initializeNodeMap(cnvsSize/4, cnvsSize/4);

const GRID_SIZE = 16;
const RESOLUTION = 8;
const COLOR_SCALE = 250;

let pixel_size = cnvsSize / RESOLUTION;
let path_size = cnvsSize / (RESOLUTION * GRID_SIZE);
let num_pixels = GRID_SIZE / RESOLUTION;
let buffer = 125

function newMap() {
  perlin.seed();
  for (let y = 0; y < GRID_SIZE; y += num_pixels / GRID_SIZE){
    for (let x = 0; x < GRID_SIZE; x += num_pixels / GRID_SIZE){
      let v = parseInt(perlin.get(x, y)*1000+COLOR_SCALE);

      // console.log(y*8)
      if (v < buffer) {
        ctx.fillStyle = 'black';
        map[x*8][y*8].isObs = true;
      } else {
        ctx.fillStyle = 'white';
        map[x*8][y*8].isObs = false;
      }

      ctx.fillRect(
        x / GRID_SIZE * cnvs.width,
        y / GRID_SIZE * cnvs.width,
        pixel_size,
        pixel_size
      );
    }
  }
  return
}

function resetMap() {
  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      ctx.fillStyle = (map[i][j].isObs) ? 'black' : 'white'
      ctx.fillRect(
        map[i][j].pos.x * path_size,
        map[i][j].pos.y * path_size,
        path_size,
        path_size
      );
      map[i][j].f = 0;
      map[i][j].g = 0;
      map[i][j].h = 0;
      map[i][j].parent = null;
    }
  }
}

function checkGoals() {
  search(map, map[0][0], map[mapSize-1][mapSize-1]);
  search(map, map[0][0], map[0][mapSize-1]);
  search(map, map[0][0], map[mapSize-1][0]);
}

// ----Visuals----

function gameOver() {
  ctx.clearRect(0,0,cnvsSize,cnvsSize);
  ctx.fillStyle = "#ff3333";
  ctx.beginPath();
  ctx.arc(cnvsSize / 2, 400, 30, 0, 2 * Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cnvsSize / 2, 300, 25, 0, 2 * Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cnvsSize / 2, 100, 50, 0, 2 * Math.PI);
  ctx.fill();

  var polygon = [
    cnvsSize / 2 - 25, 300,
    cnvsSize / 2 + 25, 300,
    cnvsSize / 2 + 50, 100,
    cnvsSize / 2 - 50, 100
  ];

  ctx.beginPath();
  ctx.moveTo(polygon[0], polygon[1]);

  for (let item = 2; item < polygon.length - 1; item += 2) {
    ctx.lineTo(polygon[item], polygon[item + 1]);
  }

  ctx.closePath();
  ctx.fill();

  ctx.lineWidth = 10;
  ctx.strokeStyle = "#ff3333";
  ctx.beginPath();
  ctx.arc(cnvsSize / 2, 240 , 220, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.font = "bold 36px sans-serif";
  ctx.fillText(
    "Game Over",
    cnvsSize / 2 - 100, 500, 200
  );
}

function rotate(m, theta) {
  let result = [];

  for(let i = 0; i < m.length; i+=2) {
    result.push(m[i]*Math.cos(theta) + m[i+1]*Math.sin(theta))
    result.push(m[i]*-Math.sin(theta) + m[i+1]*Math.cos(theta))
  }

  return result;
}

function shift(m, x, y) {
  let result = [];

  for(let i = 0; i < m.length; i+=2) {
    result.push(m[i]+x)
    result.push(m[i+1]+y)
  }

  return result;
}

function win() {
  ctx.clearRect(0,0,cnvsSize,cnvsSize);
  ctx.fillStyle = '#33ff33'
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 1
  var theta = Math.PI/4;
  var polygon = [
    0, 0,
    0, -100,
    -60, -100,
    -60, 60,
    0, 60,
    200, 60,
    200, 0,
  ];

  polygon = rotate(polygon, theta);
  polygon = shift(polygon, 230, 270);

  ctx.beginPath();
  ctx.moveTo(polygon[0], polygon[1]);

  for (let item = 2; item < polygon.length - 1; item += 2) {
    ctx.lineTo(polygon[item], polygon[item + 1]);
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke()

  ctx.font = "bold 46px sans-serif";
  ctx.fillText(
    "You Win!",
    cnvsSize / 2 - 100, 500, 200
  );
  ctx.strokeText(
    "You Win!",
    cnvsSize / 2 - 100, 500, 200
  );
}

function drawPath(path) {
  ctx.fillStyle = "#F00";

  for (const node in path) {
    ctx.fillRect(
      path[node].x * path_size,
      path[node].y * path_size,
      path_size,
      path_size
    );
  }
}

// ----Helper Functions----

// distance for heuristic function
function distance(pos0, pos1) {
  // This is the Manhattan distance
  let d1 = Math.abs(pos1.x - pos0.x) * Math.abs(pos1.x - pos0.x);
  let d2 = Math.abs(pos1.y - pos0.y) * Math.abs(pos1.y - pos0.y);
  return Math.sqrt(d1 + d2);
}

// get neighbours to left, right, up, and down
function getNeighbours(map, pos, closeList) {
  let neighbours = [];
  let x = pos.x;
  let y = pos.y;
  let maxRow = mapSize - 1;
  let maxCol = mapSize - 1;

  // rook
  if (x !== 0 && !map[x - 1][y].isObs) {
    if (!closeList.includes(map[x - 1][y])) {
      neighbours.push(map[x - 1][y]);
    }
  }
  if (y !== 0 && !map[x][y - 1].isObs) {
    if (!closeList.includes(map[x][y - 1])) {
      neighbours.push(map[x][y - 1]);
    }
  }
  if (x !== maxRow && !map[x + 1][y].isObs) {
    if (!closeList.includes(map[x + 1][y])) {
      neighbours.push(map[x + 1][y]);
    }
  }
  if (y !== maxCol && !map[x][y + 1].isObs) {
    if (!closeList.includes(map[x][y + 1])) {
      neighbours.push(map[x][y + 1]);
    }
  }

  return neighbours;
}

// function to find node with min f-value in list
function minNode(nodeList) {
  let min = nodeList[0];

  for (const node of nodeList) {
    min = node.f < min.f ? node : min;
  }

  return min;
}

// ----Search Function----

function search(map, start, end) {
  let openList = [];
  let closeList = [];
  let curNode = start;

  openList.push(curNode);
  try {
    while (curNode.pos != end.pos) {
      let neighbours = getNeighbours(map, curNode.pos, closeList);

      for (const neighbour of neighbours) {
        if (!closeList.includes(neighbour)) {
          neighbour.g = curNode.g + 10;
          neighbour.h = distance(curNode.pos, end.pos);
          neighbour.f = neighbour.g + neighbour.h;
          neighbour.parent = curNode.pos;

          openList.includes(neighbour) ? 1+1 : openList.push(neighbour);
        }
      }

      const index = openList.indexOf(curNode);

      if (index !== -1) {
        openList.splice(index, 1);
      }
      if (!closeList.includes(curNode)) {
        closeList.push(curNode); 
      }

      curNode = minNode(openList);
    }
  } catch (TypeError) {
    resetMap();
    ctx.clearRect(0,0,cnvsSize,cnvsSize);
    newMap();
    checkGoals();
    return []
  }

  // End case -- result has been found, return the traced path

  let curr = curNode;
  let ret = [];
  while (curr.pos != start.pos) {
    ret.push(curr.pos);
    curr = map[curr.parent.x][curr.parent.y];
  }
  // console.log(ret.reverse())
  return ret.reverse();
}

// ----functionality----

function movePlayer() {
  if (keyDown.w && player.y > 0 && !map[player.x][player.y-1].isObs) {
    player.y--
  }
  if (keyDown.a && player.x > 0 && !map[player.x-1][player.y].isObs) {
    player.x--
  }
  if (keyDown.s && player.y < mapSize-1 && !map[player.x][player.y+1].isObs) {
    player.y++
  }
  if (keyDown.d && player.x < mapSize-1 && !map[player.x+1][player.y].isObs) {
    player.x++
  }
}

function moveEnemy() {
  if (path.length >= 4) {
    enemy.x = path[frameCount % 4].x;
    enemy.y = path[frameCount % 4].y;
  } else if (path.length == 3) {
    enemy.x = path[frameCount % 3].x;
    enemy.y = path[frameCount % 3].y;
  }else if (path.length == 2) {
    enemy.x = path[frameCount % 2].x;
    enemy.y = path[frameCount % 2].y;
  }else if (path.length == 1) {
    enemy.x = path[0].x;
    enemy.y = path[0].y;
  }
}

// define player object
let player = {
  x: mapSize-1,
  y: mapSize-1,
};

// define previous node
let enemy = {
  x: 0,
  y: 0
}

let keyDown = {
  w: false,
  a: false,
  s: false,
  d: false
}

let goals = {
  topLeft: false,
  topRight: false,
  bottomLeft: false
}

window.addEventListener("keydown", function(event) {
  switch (event.key) {
    case 'd':
      keyDown.d = true;
      break;
    case 'a':
      keyDown.a = true;
      break;
    case 'w':
      keyDown.w = true;
      break;
    case 's':
      keyDown.s = true;
      break;
  }
});

window.addEventListener("keyup", function(event) {
  switch (event.key) {
    case 'd':
      keyDown.d = false;
      break;
    case 'a':
      keyDown.a = false;
      break;
    case 'w':
      keyDown.w = false;
      break;
    case 's':
      keyDown.s = false;
      break;
  }
});

let isStop = false;
let resetHappening = false;
let stopPressed = false;
let isEasy = true;
let isSlow = true;

document.getElementById("start").addEventListener("click", () => {  
  if (!resetHappening && !isStop) {
    document.getElementById("reset").innerHTML = "Stop"
    frameCount = 0;
    score = 1000;
    player.x = mapSize-1;
    player.y = mapSize-1;
    enemy.x = 0;
    enemy.y = 0;
    goals.topLeft = false;
    goals.topRight = false;
    goals.bottomLeft = false;

    isStop = true;

    isSlow = isEasy

    requestAnimationFrame(cycle);
  }
});

document.getElementById("reset").addEventListener("click", () => {
  if (!isStop) {
    isStop = false;
    resetHappening = true;
    resetMap();
    ctx.clearRect(0,0,cnvsSize,cnvsSize);
    newMap();
    checkGoals();

    resetHappening = false;
  } else {
    stopPressed = true;
  }
});

document.getElementById("difficulty-slider").addEventListener("change", () => {
  let diffTag = document.getElementById("difficulty-tag")
  isEasy = !isEasy
  if (isEasy) {
    diffTag.innerHTML = "Easy";
  } else {
    diffTag.innerHTML = "Hard";
  }
});

let frameCount = 0;
let score = 1000;
let timer = document.getElementById("timer")

let path = search(map, map[enemy.x][enemy.y], map[player.x][player.y]);

function cycle() {
  resetMap();
  frameCount++;

  // check for win
  if (goals.bottomLeft && goals.topLeft && goals.topRight) {
    win()
    return undefined;
  }

  // draw goals
  if (!goals.topLeft) {
    ctx.fillStyle = '#000'
    ctx.fillRect(
      0, 
      0, 
      2*path_size+2, 
      2*path_size+2
    );
    ctx.fillStyle = '#FF0'
    ctx.fillRect(
      0, 
      0, 
      2*path_size, 
      2*path_size
    );
  }
  if (!goals.topRight) {
    ctx.fillStyle = '#000'
    ctx.fillRect(
      (mapSize-2)*path_size-2, 
      0, 
      2*path_size+2, 
      2*path_size+2
    );
    ctx.fillStyle = '#FF0'
    ctx.fillRect(
      (mapSize-2)*path_size, 
      0, 
      2*path_size, 
      2*path_size
    );
  }
  if (!goals.bottomLeft) {
    ctx.fillStyle = '#000'
    ctx.fillRect(
      0,
      (mapSize-2)*path_size-2,  
      2*path_size+2, 
      2*path_size+2
    );
    ctx.fillStyle = '#FF0'
    ctx.fillRect(
      0, 
      (mapSize-2)*path_size, 
      2*path_size, 
      2*path_size
    );
  }

  // draw player
  ctx.fillStyle = '#0AF'
  ctx.fillRect(
    player.x*path_size, 
    player.y*path_size, 
    path_size, 
    path_size
  );

  ctx.fillStyle = "rgba(0, 160, 255, .2)"
  ctx.fillRect(
    (player.x-1)*path_size, 
    (player.y-1)*path_size, 
    path_size*3, 
    path_size*3
  )

  // draw enemy
  ctx.fillStyle = '#F00'
  ctx.fillRect(
    enemy.x*path_size, 
    enemy.y*path_size, 
    path_size, 
    path_size
  );

  ctx.fillStyle = "rgba(255, 0, 0, .2)"
  ctx.fillRect(
    (enemy.x-1)*path_size, 
    (enemy.y-1)*path_size, 
    path_size*3, 
    path_size*3
  )

  // detect goal scoring
  if (player.x <= 1 && player.y <= 1) {
    goals.topLeft = true;
  }
  if (player.x <= 1 && player.y >= mapSize-2) {
    goals.bottomLeft = true;
  }
  if (player.x >= mapSize-2 && player.y <= 1) {
    goals.topRight = true;
  }

  // slow it down
  if (frameCount % 2 == 0) {
    score--
  }

  timer.innerHTML = `Score: ${score}`

  if (frameCount % 4 == 0 || frameCount == 0) {
    path = search(map, map[enemy.x][enemy.y], map[player.x][player.y]);
  }

  if ((enemy.x == player.x && enemy.y == player.y) || score == 0 || stopPressed) {
    document.getElementById("reset").innerHTML = "Reset"
    const timeOut = setTimeout(() => {
      timer.innerHTML = `Loser`
      gameOver(); 
      stopPressed = false;
      isStop = false;
    }, 200)
    timeOut()
    enemy.x = 0;
    enemy.y = 0;
    return undefined;
  }
  
  if (frameCount > 10) {
    if (!isSlow) {
      moveEnemy()
    } else if (frameCount % 2 == 0) {
      moveEnemy()
    }
  }

  if (!isSlow) {
    movePlayer()
  } else if (frameCount % 2 == 0) {
    movePlayer()
  }

  requestAnimationFrame(cycle);
}

newMap();
checkGoals();