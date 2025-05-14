const audioPlayer = document.getElementById("audioPlayer");
const whiteNoisePlayer = document.getElementById("whiteNoisePlayer");
const fileInput = document.getElementById("fileInput");
const songList = document.getElementById("songList");
const playlistSelect = document.getElementById("playlistSelect");
let currentPlaylist = [];

const supportedFormats = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/x-m4a'];

fileInput.setAttribute('accept', supportedFormats.join(','));

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

function updateSongList() {
  songList.innerHTML = "";
  currentPlaylist.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.name;
    li.onclick = () => {
      playAudio(song.url);
    };
    songList.appendChild(li);
  });
}

function playAudio(url) {
  if (!url) return;
  audioPlayer.src = url;

  // On iOS, audio playback must be triggered by user interaction
  audioPlayer.play().catch(err => {
    console.warn("Playback failed:", err.message);
  });

  logListeningTime();
}

document.getElementById("toggleWhiteNoise").addEventListener("click", () => {
  if (whiteNoisePlayer.paused) {
    whiteNoisePlayer.play().catch(err => {
      console.warn("White noise error:", err.message);
    });
  } else {
    whiteNoisePlayer.pause();
  }
});

function logListeningTime() {
  const startTime = Date.now();
  const onPauseOrEnd = () => {
    const minutes = Math.floor((Date.now() - startTime) / 60000);
    let timeListened = parseInt(localStorage.getItem("timeListened") || "0");
    timeListened += minutes;
    localStorage.setItem("timeListened", timeListened.toString());

    if (typeof updateBadges === "function") {
      updateBadges(timeListened);
    }

    audioPlayer.removeEventListener("pause", onPauseOrEnd);
    audioPlayer.removeEventListener("ended", onPauseOrEnd);
  };

  audioPlayer.addEventListener("pause", onPauseOrEnd);
  audioPlayer.addEventListener("ended", onPauseOrEnd);
}

window.addEventListener("load", () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
      .then(reg => console.log("SW registered:", reg.scope))
      .catch(err => console.warn("SW failed:", err));
  }
});
