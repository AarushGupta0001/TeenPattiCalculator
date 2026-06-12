export const getNetProfitLoss = (player) =>
  player.walletBalance - player.startingWallet;

export const sortPlayersByNet = (players) =>
  [...players].sort((a, b) => {
    const diff = getNetProfitLoss(b) - getNetProfitLoss(a);
    if (diff !== 0) return diff;
    return a.name.localeCompare(b.name);
  });
