let audioPlayer = document.getElementById('audioPlayer');
let whiteNoisePlayer = document.getElementById('whiteNoisePlayer');
let fileInput = document.getElementById('fileInput');
let songList = document.getElementById('songList');
let playlistSelect = document.getElementById('playlistSelect');
let currentPlaylist = [];

fileInput.addEventListener('change', function () {
  const files = Array.from(this.files);
  files.forEach(file => {
    if (!file.type.startsWith('audio/')) return;

    const url = URL.createObjectURL(file);
    currentPlaylist.push({ name: file.name, url });
  });

  updateSongList();
});

function updateSongList() {
  songList.innerHTML = '';
  currentPlaylist.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = song.name;
    li.onclick = () => {
      audioPlayer.src = song.url;
      audioPlayer.play();
      logListeningTime();
    };
    songList.appendChild(li);
  });
}

document.getElementById('toggleWhiteNoise').addEventListener('click', () => {
  if (whiteNoisePlayer.paused) {
    whiteNoisePlayer.play();
  } else {
    whiteNoisePlayer.pause();
  }
});

function logListeningTime() {
  const startTime = Date.now();
  audioPlayer.onpause = () => {
    const minutes = Math.floor((Date.now() - startTime) / 60000);
    let timeListened = parseInt(localStorage.getItem('timeListened') || '0');
    timeListened += minutes;
    localStorage.setItem('timeListened', timeListened.toString());
    updateBadges(timeListened);
  };
}
