// Profile Initialization
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
  name: 'Guest',
  isTemp: true,
  totalMinutes: 0,
  badge: 'None'
};

updateProfileUI();

document.getElementById('loginBtn').addEventListener('click', () => {
  const confirmed = confirm("Simulate Google login?");
  if (confirmed) {
    userProfile = {
      ...userProfile,
      name: 'John (Google)',
      isTemp: false
    };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    updateProfileUI();
    alert("Logged in! Temp data transferred.");
  }
});

function updateProfileUI() {
  document.getElementById('username').textContent = `👤 ${userProfile.name}`;
  document.getElementById('badge').textContent = `🏅 Badge: ${userProfile.badge}`;
  document.getElementById('time').textContent = `⏱️ Time Listened: ${userProfile.totalMinutes} min`;
}

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

// Listening Tracker
const audio = document.getElementById('audioPlayer');
let playStartTime = null;

audio.addEventListener('play', () => {
  playStartTime = Date.now();
});

audio.addEventListener('pause', () => {
  if (playStartTime) {
    const duration = Math.floor((Date.now() - playStartTime) / 60000); // minutes
    userProfile.totalMinutes += duration;
    checkBadges();
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    updateProfileUI();
    playStartTime = null;
  }
});

function checkBadges() {
  const hour = new Date().getHours();

  if (hour >= 22 || hour < 5) {
    userProfile.badge = '🦉 Night Owl';
  } else if (userProfile.totalMinutes > 60) {
    userProfile.badge = '🐘 Endurance Listener';
  }
}
