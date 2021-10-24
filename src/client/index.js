/* -----------------------------------------------
/* Resources Referenced : Educative  - educative.io
/* Resource Link : https://www.educative.io/blog/javascript-snake-game-tutorial
/* ----------------------------------------------- */

// GLOBAL VARIABLES
// Get HTML elements.
const board = document.getElementById("board");
board.width = window.innerWidth * 0.85;
board.height = window.innerHeight * 0.85;
const foundText = document.getElementById('found');
const lostText = document.getElementById('lost');
// Return a two dimensional drawing context
const ctx = board.getContext("2d");

const tileAtlas = new Image(); // temporary test tile for static tilemap
tileAtlas.src = '../assets/random-tile.png';

const map = {
    cols: 21, // known width of full map
    rows: 14, // known height of full map
    tsize: board.height / 2, // tile size if 2 x 3 tiles on screen at a time
    layers: [
        Array.from(Array(21 * 14).keys()) // background array noting what type of tile in each position
    ],
    getTile: function (layer, col, row) { // helper for fetching specific location's tile
        return this.layers[layer][row * map.cols + col];
    }
};

const camera = new Camera(map, board.width, board.height); // camera for rendering

// Array of the head bear and its cubs.
// First element is the head.
let bear_family = [
  {x: board.width / 2, y: board.height / 2}
];

// Array of obstacles on the map.
let obstacles = [
  {x: 100, y: 100, width: 300, height: 200, src: '../assets/obstacle.png'}
];

// Number of cubs left.
let cubs_left = 15;
// Array of the cubs on the screen, not yet in a family.
let cubs = [

];
// Set up cubs with random coordinates.
for (let i = 0; i < cubs_left; i++) {
  let pos_x = random_loc(10, board.width - 24);
  let pos_y = random_loc(10, board.height - 24);

  let bear_center_x = pos_x + 7;
  let bear_center_y = pos_y + 7;
  // Check if the cubs are in the way of the obstacles' locations.
  for (let j = 0; j < obstacles.length; j++) {
    let top_bound = obstacles[j].y;
    let bottom_bound = obstacles[j].y + obstacles[j].height;
    let left_bound = obstacles[j].x;
    let right_bound = obstacles[j].x + obstacles[j].width;

    while (bear_center_x < right_bound && bear_center_x > left_bound && bear_center_y > top_bound && bear_center_y < bottom_bound) {
      pos_x = random_loc(10, board.width - 24);
      pos_y = random_loc(10, board.height - 24);
      bear_center_x = pos_x + 7;
      bear_center_y = pos_y + 7;
    }
  }

  const cub = {x: pos_x, y: pos_y};
  cubs.push(cub);
}

// Score
let cubs_found = 0;
// True if changing direction.
let changing_direction = false;
// Velocities
let dx = 18;
let dy = 0;
// Direction
let direction = 'right';

// CALLS TO START GAME
// Start game + draw the cubs.
main();
draw_obstacles();
draw_cubs();
display_score(cubs_found, cubs_left);
// Family changes direction when any arrow key is pressed.
document.addEventListener("keydown", change_direction);

// MAIN
// Main function called repeatedly to keep the game running.
function main() {

  if (has_game_ended() === 2) {
    foundText.innerHTML = "You hit a wall. Game over!";
    lostText.style.visibility = "hidden";
    return;
  } else if (has_game_ended() === 1) {
    foundText.innerHTML = "Congrats! You found all the cubs!";
    lostText.style.visibility = "hidden";
    return;
  }
  changing_direction = false;
  setTimeout(function onTick() {
    clear_board();
    update_camera(); // delta
    render(); // TODO: move render code into this function
    draw_obstacles();
    draw_cubs();
    move_family();
    draw_bear();
    // Repeat
    main();
  }, 150)
}


// CANVAS DRAWING FUNCTIONS
// Draw a border around the canvas.
function clear_board() {
  ctx.fillStyle = "white";
  ctx.strokestyle = "black";
  ctx.fillRect(0, 0, board.width, board.height);
  ctx.strokeRect(0, 0, board.width, board.height);
}

// Draws all the unadopted cubs in the cubs array onto the screen.
function draw_cubs() {
  for (let i = 0; i < cubs.length; i++) {
    var img1 = new Image(); // Image constructor
    img1.src = '../assets/blckbear-chick-front.png';

    ctx.drawImage(
      img1,
      cubs[i].x,
      cubs[i].y,
      15,
      15,
    );
  }
}

// Draws all the obstacles in the obstacles array onto the screen.
function draw_obstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    var img1 = new Image(obstacles[i].width, obstacles[i].height); // Image constructor
    img1.src = obstacles[i].src;

    ctx.drawImage(
      img1,
      obstacles[i].x,
      obstacles[i].y,
      obstacles[i].width,
      obstacles[i].height,
    );
  }
}

// Draw the bear family on the canvas.
function draw_bear() {
  for (let i = 0; i < bear_family.length; i++) {
    if (i === 0) {
      draw_bear_part(bear_family[i], true);
    } else {
      draw_bear_part(bear_family[i], false);
    }
  }
}

// Draws one bear part
function draw_bear_part(bear_part, is_head) {
  // Determine type of file to use and size of image depending on is_head.
  let type;
  let size;
  let adjustment = 0;
  if (is_head) {
    type = 'hen';
    size = 24;
  } else {
    type = 'chick';
    size = 14;
    adjustment = 5;
  }

  // Different image used depending on direction and is_head.
  var img1 = new Image();
  img1.src = '../assets/blckbear-' + type + '-' + direction + '.png';

  // Draw the image.
  ctx.drawImage(
    img1,
    bear_part.x + adjustment,
    bear_part.y + adjustment,
    size,
    size,
  );
}

// Displays score
function display_score(found, left) {
  foundText.innerHTML = "Cubs Found: " + cubs_found;
  lostText.innerHTML = "Cubs Left: " + cubs_left;
}

function Camera(map, width, height) {
    this.x = 0; // upper left corner of camera
    this.y = 0; // upper right corner of camera
    this.width = width;
    this.height = height;
    this.maxX = map.cols * map.tsize - width;
    this.maxY = map.rows * map.tsize - height;
}

Camera.prototype.move = function (delta, dirx, diry) {
    // move camera
    this.x += dirx;
    this.y += diry;
    // clamp values
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));
};

// Runs game rendering
function render() {
    // TODO: return instead of rendering if something wrong with current state
  
    // Draw background
    renderBackground(0);

    // TODO: move player and obstacle rendering here
    // TODO: change obstacles to be a layer 1 background tile, and use logic map for collisions
}

// Draws all the background tiles in the map within camera view onto the screen.
function renderBackground(layer) {
    const startCol = Math.floor(camera.x / map.tsize);
    const endCol = startCol + (camera.width / map.tsize);
    const startRow = Math.floor(camera.y / map.tsize);
    const endRow = startRow + (camera.height / map.tsize);
    const offsetX = -camera.x + startCol * map.tsize;
    const offsetY = -camera.y + startRow * map.tsize;

    for (let c = startCol; c <= endCol; c++) {
        for (let r = startRow; r <= endRow; r++) {
            const tile = map.getTile(layer, c, r);
            const x = (c - startCol) * map.tsize + offsetX;
            const y = (r - startRow) * map.tsize + offsetY;
            ctx.drawImage(
                tileAtlas, // image
                Math.round(x),  // target x
                Math.round(y), // target y
                map.tsize, // target width
                map.tsize // target height
            );
        }
    }
}

// MOVEMENT FUNCTIONS

// Updates camera according to bear location and movement.
function update_camera() { // delta
    var dirx = 0;
    var diry = 0;

    if (direction == 'left') { dirx = -18; }
    if (direction == 'right') { dirx = 18; }
    if (direction == 'back') { diry = -18; }
    if (direction == 'front') { diry = 18; }

    camera.move(0, dirx, diry); // delta
}

// Changes direction of the family accordingly when key is pressed.
function change_direction(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  // Prevent the family from reversing
  if (changing_direction) return;
  changing_direction = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -18;
  const goingDown = dy === 18;
  const goingRight = dx === 18;
  const goingLeft = dx === -18;
  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -18;
    dy = 0;
    direction = 'left';
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -18;
    direction = 'back';
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 18;
    dy = 0;
    direction = 'right';
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 18;
    direction = 'front';
  }
}

// Moves the bear family.
function move_family() {
  let new_x = bear_family[0].x + dx;
  let new_y = bear_family[0].y + dy;

  let bear_center_x = new_x + 12;
  let bear_center_y = new_y + 12;

  // Check if new coordinates hit any obstacles. If they, do update accordingly.
  for (let i = 0; i < obstacles.length; i++) {
    let top_bound = obstacles[i].y;
    let bottom_bound = obstacles[i].y + obstacles[i].height;
    let left_bound = obstacles[i].x;
    let right_bound = obstacles[i].x + obstacles[i].width;

    if (bear_center_x < right_bound && bear_center_x > left_bound && bear_center_y > top_bound && bear_center_y < bottom_bound) {
      if (direction == "right") {
        new_x = left_bound - 29;
      } else if (direction == "left") {
        new_x = right_bound + 5;
      } else if (direction == "front") {
        new_y = top_bound - 29;
      } else {
        new_y = bottom_bound + 5;
      }
    }
  }

  // Creates the new family's head.
  const head = {x: new_x, y: new_y};
  // Add the new head to the beginning of family.
  bear_family.unshift(head);
  var has_found_cub = false;
  for (let i = 0; i < cubs.length; i++) {
    if (Math.abs(bear_family[0].x - cubs[i].x) < 10 && Math.abs(bear_family[0].y - cubs[i].y) < 10) {
      has_found_cub = true;
      // Removes found cub from cubs array.
      cubs.splice(i, 1);
      cubs_left -= 1;
      break;
    }
  }
  if (has_found_cub) {
    // Increase score
    cubs_found += 1;
    // Display score on screen
    display_score(cubs_found, cubs_left);
  } else {
    // Remove the last part of family body
    bear_family.pop();
  }
}

// GAME ENDING RELATED

function has_game_ended() {
    for (let i = 4; i < bear_family.length; i++) {
      if (bear_family[i].x === bear_family[0].x && bear_family[i].y === bear_family[0].y) return true
    }
    const hitLeftWall = bear_family[0].x < 0;
    const hitRightWall = bear_family[0].x > board.width - 10;
    const hitToptWall = bear_family[0].y < 0;
    const hitBottomWall = bear_family[0].y > board.height - 10;
    // If there are no more cubs to be adopted.
    const noMoreCubs = cubs_left === 0;
  
    if (hitLeftWall || hitRightWall || hitToptWall || hitBottomWall) {
      return 2;
    } else if (noMoreCubs) {
      return 1;
    } else {
      return 0;
    }
  }

// UTILITIES
// Returns a random coordinate given a minimum and a maximum.
function random_loc(min, max) {
  return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}
