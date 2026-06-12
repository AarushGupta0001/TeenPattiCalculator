export const getPlayerById = (players, id) =>
  players.find((p) => p.id === id) ?? null;

export const getActivePlayer = (players, activePlayerId) =>
  getPlayerById(players, activePlayerId);

export const getActivePlayerIndex = (players, activePlayerId) =>
  players.findIndex((p) => p.id === activePlayerId);

export const getNextActivePlayerId = (players, currentPlayerId) => {
  const currentIndex = getActivePlayerIndex(players, currentPlayerId);
  if (currentIndex === -1) return null;

  const count = players.length;
  for (let step = 1; step <= count; step++) {
    const idx = (currentIndex + step) % count;
    if (!players[idx].isPacked) {
      return players[idx].id;
    }
  }

  return currentPlayerId;
};

export const getUnpackedCount = (players) =>
  players.filter((p) => !p.isPacked).length;

export const getSoleRemainingPlayerId = (players) => {
  const unpacked = players.filter((p) => !p.isPacked);
  return unpacked.length === 1 ? unpacked[0].id : null;
};

export const allPlayersPacked = (players) =>
  players.length > 0 && players.every((p) => p.isPacked);
