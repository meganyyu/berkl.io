// SELECTION
// Global variable for bear type
let bearType = null;
// Buttons for each bear
const bear1_button = document.getElementById("choice1");
const bear2_button = document.getElementById("choice2");
const bear3_button = document.getElementById("choice3");

function setBlackBear() {
  bearType = "blackbear";
}
bear1_button.onclick = setBlackBear;

function setBrownBear() {
  bearType = "brownbear";
}
bear1_button.onclick = setBrownBear;

function setHoneyBear() {
  bearType = "honeybear";
}
bear1_button.onclick = setHoneyBear;

// PLAY BUTTON
const play_button = document.getElementById('play');
// Clicking the play button leads to main game page
function play() {
  window.location.href = 'index.html';
}
play_button.onclick = play;

// HOW TO WINDOW
// Get the modal
var modal = document.getElementById("modal_landing");
// Get the button that opens the modal
var btn = document.getElementById("how-to");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
