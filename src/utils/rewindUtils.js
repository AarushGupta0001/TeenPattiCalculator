import { MAX_UNDO_STACK } from '../models/gameModels';

export const clonePlayers = (players) => players.map((player) => ({ ...player }));

export const createRewindSnapshot = (state) => ({
  players: clonePlayers(state.players),
  pot: state.pot,
  activePlayerId: state.activePlayerId,
  roundNumber: state.roundNumber,
  roundHistory: [...state.roundHistory],
  isDeclareModalOpen: state.isDeclareModalOpen,
  lastBetAmount: state.lastBetAmount,
});

export const pushUndoSnapshot = (state) => {
  const stack = [...(state.undoStack ?? []), createRewindSnapshot(state)];
  if (stack.length > MAX_UNDO_STACK) {
    stack.shift();
  }
  return stack;
};
