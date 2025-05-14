// script.js

const fileInput = document.getElementById("fileInput");
const songList = document.getElementById("songList");
const audioPlayer = document.getElementById("audioPlayer");
const whiteNoisePlayer = document.getElementById("whiteNoisePlayer");
const toggleWhiteNoise = document.getElementById("toggleWhiteNoise");

let currentPlaylist = [];
let supportedFormats = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/aac",
  "audio/ogg",
  "audio/webm",
  "audio/x-m4a"
];

// Load audio from file input
fileInput.addEventListener("change", function () {
  const files = Array.from(this.files);
  files.forEach((file) => {
    if (!supportedFormats.includes(file.type)) {
      console.warn(`Unsupported format: ${file.name}`);
      return;
    }
    const url = URL.createObjectURL(file);
    currentPlaylist.push({ name: file.name, url });
  });

  updateSongList();
});

// Update the UI list of songs
function updateSongList() {
  songList.innerHTML = "";
  currentPlaylist.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.name;
    li.onclick = () => playAudio(song.url);
    songList.appendChild(li);
  });
}

// Play selected song
function playAudio(url) {
  audioPlayer.src = url;
  audioPlayer.play();
}

// White noise toggle
toggleWhiteNoise.addEventListener("click", () => {
  if (whiteNoisePlayer.paused) {
    whiteNoisePlayer.play();
    toggleWhiteNoise.textContent = "Stop White Noise";
  } else {
    whiteNoisePlayer.pause();
    toggleWhiteNoise.textContent = "Play White Noise";
  }
});

// PWA install prompt (optional)
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  // You can show custom install UI if needed
});
