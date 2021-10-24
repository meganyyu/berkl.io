// PLAY BUTTON
const play_button = document.getElementById('play');
// Clicking the play button leads to main game page
function play() {
  window.location.href = 'src/client/html/game.html';
}
play_button.onclick = play;

// HOW TO WINDOW
// Get the modal
var modal = document.getElementById("modal");
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
