function updateBadges(minutes) {
  const badges = [];
  if (minutes >= 10) badges.push("🐿️ Curious Chipmunk – 10 min");
  if (minutes >= 60) badges.push("🦉 Night Owl – 1 hour");
  if (minutes >= 300) badges.push("🐘 Wise Elephant – 5 hours");
  if (minutes >= 600) badges.push("🐆 Swift Cheetah – 10 hours");
  if (minutes >= 1440) badges.push("🦁 King of the Jungle – 1 day");

  document.getElementById('badges').innerHTML = badges.map(b => `<div>${b}</div>`).join('');
}
