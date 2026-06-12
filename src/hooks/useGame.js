import { useContext, useMemo } from 'react';
import { GameContext } from '../context/GameContextStore.js';
import { sortPlayersByNet } from '../utils/calculations';
import { getActivePlayer } from '../utils/turnUtils';

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }

  const { state, actions, startGameFromSetup } = context;

  const activePlayer = useMemo(
    () => getActivePlayer(state.players, state.activePlayerId),
    [state.players, state.activePlayerId]
  );

  const sortedPlayers = useMemo(
    () => sortPlayersByNet(state.players),
    [state.players]
  );

  const needsPlayerSelection = state.activePlayerId === null;

  const canRewind = (state.undoStack?.length ?? 0) > 0;

  return {
    state,
    actions,
    startGameFromSetup,
    activePlayer,
    sortedPlayers,
    needsPlayerSelection,
    canRewind,
  };
}
