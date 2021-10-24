// GLOBAL VARIABLES
// Get HTML elements.
const board = document.getElementById("board");
const top_text = document.getElementById('score');
// Return a two dimensional drawing context
const ctx = board.getContext("2d");

// Array of the head bear and its cubs.
// First element is the head.
let bear_family = [
  {x: board.width / 2, y: board.height / 2}
];

// Array of the cubs on the screen, not yet in a family.
let cubs = [

];
// Set up 20 cubs with random coordinates.
for (let i = 0; i < 15; i++) {
  const cub = {x: random_loc(10, board.width - 10), y: random_loc(10, board.height - 10)};
  cubs.push(cub);
}

// Array of obstacles on the map.
let obstacles = [
  {x: 100, y: 100, width: 100, height: 100}
];

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
// Family changes direction when any arrow key is pressed.
document.addEventListener("keydown", change_direction);

// MAIN
// Main function called repeatedly to keep the game running.
function main() {

    if (has_game_ended() === 2) {
      top_text.innerHTML = "You hit a wall. Game over!";
      return;
    } else if (has_game_ended() === 1) {
      top_text.innerHTML = "Congrats! You found all the cubs!";
      return;
    }
    changing_direction = false;
    setTimeout(function onTick() {
      clear_board();
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
    var img1 = new Image(350, 200); // Image constructor
    img1.src = '../assets/obstacle.png';

    ctx.drawImage(
      img1,
      obstacles[i].x,
      obstacles[i].y,
      350,
      200,
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
  if (is_head) {
    type = 'hen';
    size = 24;
  } else {
    type = 'chick';
    size = 14;
  }

  // Different image used depending on direction and is_head.
  var img1 = new Image();
  img1.src = '../assets/blckbear-' + type + '-' + direction + '.png';

  // Draw the image.
  ctx.drawImage(
    img1,
    bear_part.x,
    bear_part.y,
    size,
    size,
  );
}

// MOVEMENT FUNCTIONS

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
  // Creates the new family's head.
  const head = {x: bear_family[0].x + dx, y: bear_family[0].y + dy};
  // Add the new head to the beginning of family.
  bear_family.unshift(head);
  var has_found_cub = false;
  for (let i = 0; i < cubs.length; i++) {
    if (Math.abs(bear_family[0].x - cubs[i].x) < 10 && Math.abs(bear_family[0].y - cubs[i].y) < 10) {
      has_found_cub = true;
      // Removes found cub from cubs array.
      cubs.splice(i, 1);
      break;
    }
  }
  if (has_found_cub) {
    // Increase score
    cubs_found += 1;
    // Display score on screen
    top_text.innerHTML = cubs_found;
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
  const noMoreCubs = cubs.length === 0;

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
