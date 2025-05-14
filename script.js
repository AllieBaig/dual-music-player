
function displaySongs() {
  const fileInput = document.getElementById("fileInput");
  const audioPlayer = document.getElementById("audioPlayer");
  const songList = document.getElementById("songList");
  const songs = JSON.parse(localStorage.getItem("songs") || "[]");
  songList.innerHTML = "";

  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.name;
    li.onclick = () => {
      audioPlayer.src = song.url;
      audioPlayer.play().catch(err => {
        console.warn("Playback prevented:", err);
        alert("Please tap the screen to allow audio playback.");
      });
    };
    songList.appendChild(li);
  });

  fileInput.addEventListener("change", () => {
    const files = Array.from(fileInput.files);
    const newSongs = files.map((file, i) => {
      const url = URL.createObjectURL(file);
      return { id: Date.now() + i, name: file.name, url };
    });
    const updated = [...songs, ...newSongs];
    localStorage.setItem("songs", JSON.stringify(updated));
    displaySongs();
    groupSongs();
  });
}

function groupSongs() {
  const allSongs = JSON.parse(localStorage.getItem('songs') || '[]');
  const grouped = {};
  allSongs.forEach(song => {
    const letter = /^[a-zA-Z]/.test(song.name[0]) ? song.name[0].toUpperCase() : '0-9';
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(song);
  });

  const container = document.getElementById('groupList');
  container.innerHTML = '';
  Object.keys(grouped).sort().forEach(letter => {
    const section = document.createElement('div');
    section.innerHTML = `<h3>${letter}</h3>`;
    grouped[letter].forEach(song => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = song.id;
      const label = document.createElement('label');
      label.textContent = ` ${song.name}`;
      section.appendChild(checkbox);
      section.appendChild(label);
      section.appendChild(document.createElement('br'));
    });
    container.appendChild(section);
  });
}

document.getElementById('createPlaylistBtn').addEventListener('click', () => {
  const name = document.getElementById('newPlaylistName').value.trim();
  if (!name) return alert("Enter a name");
  const playlists = JSON.parse(localStorage.getItem('playlists') || '[]');
  playlists.push({ name, songIds: [] });
  localStorage.setItem('playlists', JSON.stringify(playlists));
  document.getElementById('newPlaylistName').value = '';
  loadPlaylists();
});

document.getElementById('addToPlaylistBtn').addEventListener('click', () => {
  const checkboxes = document.querySelectorAll('#groupList input[type="checkbox"]:checked');
  const ids = Array.from(checkboxes).map(cb => cb.value);
  if (ids.length === 0) return alert("Select songs");
  const playlists = JSON.parse(localStorage.getItem('playlists') || '[]');
  const playlistName = prompt("Add to which playlist?");
  const playlist = playlists.find(p => p.name === playlistName);
  if (!playlist) return alert("Playlist not found");
  playlist.songIds.push(...ids);
  localStorage.setItem('playlists', JSON.stringify(playlists));
  loadPlaylists();
});

function loadPlaylists() {
  const playlists = JSON.parse(localStorage.getItem('playlists') || '[]');
  const container = document.getElementById('playlistList');
  container.innerHTML = '';
  playlists.forEach(pl => {
    const li = document.createElement('li');
    li.textContent = `${pl.name} (${pl.songIds.length} songs)`;
    container.appendChild(li);
  });
}

const whiteNoisePlayer = document.getElementById('whiteNoisePlayer');
document.getElementById('toggleWhiteNoise').addEventListener('click', () => {
  if (whiteNoisePlayer.paused) {
    whiteNoisePlayer.play().catch(err => {
      alert("Tap the screen first to allow audio playback.");
    });
  } else {
    whiteNoisePlayer.pause();
  }
});

window.onload = () => {
  displaySongs();
  groupSongs();
  loadPlaylists();
};
