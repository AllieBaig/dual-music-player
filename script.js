document.getElementById('fileInput').addEventListener('change', async (e) => {
  const files = Array.from(e.target.files);
  const storedSongs = JSON.parse(localStorage.getItem('songs') || '[]');

  for (const file of files) {
    const metadata = {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
      createdAt: Date.now()
    };

    storedSongs.push(metadata);
  }

  localStorage.setItem('songs', JSON.stringify(storedSongs));
  displaySongs();
});

document.getElementById('exportButton').addEventListener('click', () => {
  const songs = JSON.parse(localStorage.getItem('songs') || '[]');
  const blob = new Blob([JSON.stringify(songs, null, 2)], { type: 'application/json' });

  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'music_library.json';
  a.click();
});

function displaySongs() {
  const list = document.getElementById('songList');
  list.innerHTML = '';
  const songs = JSON.parse(localStorage.getItem('songs') || '[]');

  songs.forEach(song => {
    const li = document.createElement('li');
    li.textContent = `${song.name} (${(song.size / 1024).toFixed(1)} KB)`;
    list.appendChild(li);
  });
}

window.onload = displaySongs;
