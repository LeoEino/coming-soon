export function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function resolvePlatformCollision(player, platform, delta) {
  if (!rectsOverlap(player, platform)) {
    return false;
  }

  const prevBottom = player.y + player.height;
  const nextBottom = player.y + player.height + player.vy * delta;

  if (prevBottom <= platform.y && nextBottom >= platform.y) {
    player.y = platform.y - player.height;
    player.vy = 0;
    player.onGround = true;
    return true;
  }

  return false;
}
