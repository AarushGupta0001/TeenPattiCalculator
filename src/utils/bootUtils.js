export function applyBootToRound(state) {
  if (!state.bootAmount || state.bootAmount <= 0) return state;

  const boot = state.bootAmount;
  const players = state.players.map((player) => ({
    ...player,
    walletBalance: Math.max(0, player.walletBalance - boot),
    roundContribution: player.roundContribution + boot,
    totalContributed: player.totalContributed + boot,
  }));

  return {
    ...state,
    players,
    pot: state.pot + boot * players.length,
  };
}
