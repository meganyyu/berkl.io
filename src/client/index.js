// SELECTION
const blck_button = document.getElementById('blck');
const brwn_button = document.getElementById('brwn');
const h_button = document.getElementById('h');
function set_blck() {
  window.name = 'blck';
  blck_button.innerHTML = "<img src='public/assets/blckbear-hen-front-star.png'>";
  brwn_button.innerHTML = "<img src='public/assets/brwnbear-hen-front.png'>";
  h_button.innerHTML = "<img src='public/assets/hbear-hen-front.png'>";
}
blck_button.onclick = set_blck;
function set_brwn() {
  window.name = 'brwn';
  brwn_button.innerHTML = "<img src='public/assets/brwnbear-hen-front-star.png'>";
  blck_button.innerHTML = "<img src='public/assets/blckbear-hen-front.png'>";
  h_button.innerHTML = "<img src='public/assets/hbear-hen-front.png'>";
}
brwn_button.onclick = set_brwn;
function set_h() {
  window.name = 'h';
  h_button.innerHTML = "<img src='public/assets/hbear-hen-front-star.png'>";
  blck_button.innerHTML = "<img src='public/assets/blckbear-hen-front.png'>";
  brwn_button.innerHTML = "<img src='public/assets/brwnbear-hen-front.png'>";
}
h_button.onclick = set_h;

// PLAY BUTTON
const play_button = document.getElementById('play');
// Clicking the play button leads to main game page
function play() {
  if (window.name != 'blck' && window.name != 'brwn' && window.name != 'h') {
    alert("Please choose a type of bear!");
    return;
  }
  window.location.href = 'src/client/html/game.html';
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
