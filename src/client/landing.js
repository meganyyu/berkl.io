// Play button leads to main game page.
const play_button = document.getElementById('play');

function play() {
  window.location.href = 'index.html';
}
play_button.onclick = play;
