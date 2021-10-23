// GLOBAL VARIABLES
// Get the canvas element
const board = document.getElementById("board");
// Return a two dimensional drawing context
const ctx = board.getContext("2d");

// Array of the head bear and its cubs.
// First element is the head.
let bear_family = [
  {x: 160, y: 200}
]

// Array of the cubs on the screen, not yet in a family.
let cubs = [

]
// Set up 20 cubs with random coordinates.
for (let i = 0; i < 20; i++) {
  const cub = {x: random_loc(0, board.width - 10), y: random_loc(0, board.width - 10)};
  cubs.unshift(cub);
}

// Score
let score = 0;
// True if changing direction.
let changing_direction = false;
// Velocities
let dx = 10;
let dy = 0;
// Direction
let direction = 0;

// CALLS TO START GAME
// Start game + draw the cubs.
main();
draw_cubs();
// Family changes direction when any arrow key is pressed.
document.addEventListener("keydown", change_direction);

// MAIN
// main function called repeatedly to keep the game running
function main() {

    if (has_game_ended()) return;

    changing_direction = false;
    setTimeout(function onTick() {
      clear_board();
      draw_cubs();
      move_family();
      draw_bear();
      // Repeat
      main();
  }, 100)
}


// CANVAS DRAWING FUNCTIONS
// Draw a border around the canvas.
function clear_board() {
  ctx.fillStyle = "white";
  ctx.strokestyle = "black";
  ctx.fillRect(0, 0, board.width, board.height);
  ctx.strokeRect(0, 0, board.width, board.height);
}

// Draw the snake on the canvas
function draw_bear() {
  // Draw each part
  bear_family.forEach(draw_bear_part)
}

// Draws all the unadopted cubs in the cubs array onto the screen.
function draw_cubs() {
  for (let i = 0; i < cubs.length; i++) {
    var img1 = new Image(); // Image constructor
    img1.src = '../assets/bear1.svg';

    ctx.drawImage(
      img1,
      cubs[i].x,
      cubs[i].y,
      15,
      15,
    );
  }
}

// Draws one bear part
function draw_bear_part(snakePart) {

  var img1 = new Image(); // Image constructor
  img1.src = '../assets/bear1.svg';

  ctx.drawImage(
    img1,
    snakePart.x,
    snakePart.y,
    15,
    15,
  );
}

// MOVEMENT FUNCTIONS

// Changes direction of the family accordingly when key is pressed.
function change_direction(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

// Prevent the snake from reversing

  if (changing_direction) return;
  changing_direction = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;
  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
    direction = 3;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
    direction = 1;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
    direction = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
    direction = 2;
  }
}

// Moves the bear family.
function move_family() {
  // Creates the new family's head.
  const head = {x: bear_family[0].x + dx, y: bear_family[0].y + dy};
  // Add the new head to the beginning of family.
  bear_family.unshift(head);
  var has_found_cub = false;
  for (let i = 0; i < cubs.length; i++) {
    if (bear_family[0].x === cubs[i].x && bear_family[0].y === cubs[i].y) {
      has_found_cub = true;
      // Removes found cub from cubs array.
      cubs.splice(i, 1);
      break;
    }
  }
  if (has_found_cub) {
    // Increase score
    score += 10;
    // Display score on screen
    document.getElementById('score').innerHTML = score;
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
  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
}

// UTILITIES
// Returns a random coordinate given a minimum and a maximum.
function random_loc(min, max) {
  return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}
