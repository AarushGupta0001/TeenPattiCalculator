import { useCallback, useMemo, useReducer } from 'react';
import {
  createDefaultNames,
  createInitialState,
  createPlayer,
  GAME_MODES,
  MAX_PLAYERS,
  MIN_PLAYERS,
} from '../models/gameModels';
import { applyBootToRound } from '../utils/bootUtils';
import { pushUndoSnapshot } from '../utils/rewindUtils';
import {
  getNextActivePlayerId,
  getPlayerById,
  getSoleRemainingPlayerId,
} from '../utils/turnUtils';
import { GameContext } from './GameContextStore.js';

const clampPlayerCount = (count) =>
  Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, count));

function applyRoundWin(state, winnerId, players) {
  const winner = getPlayerById(players, winnerId);
  if (!winner) return state;

  const potAmount = state.pot;

  const updatedPlayers = players.map((player) => {
    if (player.id !== winnerId) {
      return {
        ...player,
        roundContribution: 0,
        isPacked: false,
      };
    }
    return {
      ...player,
      walletBalance: player.walletBalance + potAmount,
      totalWon: player.totalWon + potAmount,
      roundContribution: 0,
      isPacked: false,
    };
  });

  const roundHistory = [
    {
      roundNumber: state.roundNumber,
      winnerName: winner.name,
      winningAmount: potAmount,
    },
    ...state.roundHistory,
  ];

  const nextRoundState = {
    ...state,
    players: updatedPlayers,
    pot: 0,
    roundNumber: state.roundNumber + 1,
    activePlayerId: null,
    lastBetAmount: null,
    isDeclareModalOpen: false,
    roundHistory,
  };

  return applyBootToRound(nextRoundState);
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_PLAYER_COUNT': {
      const count = clampPlayerCount(action.payload.count);
      const draftNames = createDefaultNames(count).map(
        (defaultName, i) => state.draftNames[i]?.trim() || defaultName
      );
      return { ...state, playerCount: count, draftNames };
    }

    case 'SET_DRAFT_NAME': {
      const { index, name } = action.payload;
      const draftNames = [...state.draftNames];
      draftNames[index] = name;
      return { ...state, draftNames };
    }

    case 'SET_STARTING_WALLET':
      return { ...state, startingWallet: action.payload.wallet };

    case 'SET_BOOT_AMOUNT': {
      const amount = Math.max(0, action.payload.amount);
      return {
        ...state,
        draftBootAmount: amount,
        bootAmount: state.bootEnabled ? amount : 0,
      };
    }

    case 'SET_BOOT_ENABLED': {
      const enabled = action.payload.enabled;
      return {
        ...state,
        bootEnabled: enabled,
        bootAmount: enabled ? state.draftBootAmount : 0,
      };
    }

    case 'SET_GAME_MODE':
      return { ...state, gameMode: action.payload.gameMode };

    case 'START_GAME': {
      const { players, bootAmount, gameMode } = action.payload;
      const baseState = {
        ...state,
        screen: 'game',
        players,
        bootAmount,
        gameMode,
        pot: 0,
        roundNumber: 1,
        activePlayerId: null,
        lastBetAmount: null,
        isDeclareModalOpen: false,
        roundHistory: [],
        undoStack: [],
      };
      return applyBootToRound(baseState);
    }

    case 'SET_ACTIVE_PLAYER':
      return {
        ...state,
        undoStack: pushUndoSnapshot(state),
        activePlayerId: action.payload.playerId,
      };

    case 'PLACE_BET': {
      const { amount } = action.payload;
      const activePlayer = getPlayerById(state.players, state.activePlayerId);

      if (!activePlayer || activePlayer.isPacked) return state;
      if (amount <= 0 || activePlayer.walletBalance < amount) return state;

      const players = state.players.map((player) => {
        if (player.id !== activePlayer.id) return player;
        return {
          ...player,
          walletBalance: player.walletBalance - amount,
          roundContribution: player.roundContribution + amount,
          totalContributed: player.totalContributed + amount,
        };
      });

      const nextActiveId = getNextActivePlayerId(players, activePlayer.id);

      return {
        ...state,
        undoStack: pushUndoSnapshot(state),
        players,
        pot: state.pot + amount,
        activePlayerId: nextActiveId,
        lastBetAmount:
          state.gameMode === GAME_MODES.SHOW ? amount : state.lastBetAmount,
      };
    }

    case 'PACK': {
      const activePlayer = getPlayerById(state.players, state.activePlayerId);
      if (!activePlayer || activePlayer.isPacked) return state;

      const players = state.players.map((player) => {
        if (player.id !== activePlayer.id) return player;
        return { ...player, isPacked: true };
      });

      const soleRemainingId = getSoleRemainingPlayerId(players);
      if (soleRemainingId) {
        const stateWithUndo = { ...state, undoStack: pushUndoSnapshot(state) };
        return applyRoundWin(stateWithUndo, soleRemainingId, players);
      }

      const nextActiveId = getNextActivePlayerId(players, activePlayer.id);

      return {
        ...state,
        undoStack: pushUndoSnapshot(state),
        players,
        activePlayerId: nextActiveId,
      };
    }

    case 'OPEN_DECLARE_MODAL':
      return {
        ...state,
        undoStack: pushUndoSnapshot(state),
        isDeclareModalOpen: true,
      };

    case 'CLOSE_DECLARE_MODAL':
      return { ...state, isDeclareModalOpen: false };

    case 'DECLARE_WINNER': {
      const { winnerId } = action.payload;
      const stateWithUndo = { ...state, undoStack: pushUndoSnapshot(state) };
      return applyRoundWin(stateWithUndo, winnerId, state.players);
    }

    case 'REWIND': {
      const stack = state.undoStack ?? [];
      if (stack.length === 0) return state;

      const snapshot = stack[stack.length - 1];

      return {
        ...state,
        ...snapshot,
        undoStack: stack.slice(0, -1),
      };
    }

    case 'NEW_GAME':
      return createInitialState();

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);

  const actions = useMemo(
    () => ({
      setPlayerCount: (count) =>
        dispatch({ type: 'SET_PLAYER_COUNT', payload: { count } }),

      setDraftName: (index, name) =>
        dispatch({ type: 'SET_DRAFT_NAME', payload: { index, name } }),

      setStartingWallet: (wallet) =>
        dispatch({ type: 'SET_STARTING_WALLET', payload: { wallet } }),

      setBootAmount: (amount) =>
        dispatch({ type: 'SET_BOOT_AMOUNT', payload: { amount } }),

      setBootEnabled: (enabled) =>
        dispatch({ type: 'SET_BOOT_ENABLED', payload: { enabled } }),

      setGameMode: (gameMode) =>
        dispatch({ type: 'SET_GAME_MODE', payload: { gameMode } }),

      startGame: (players, bootAmount, gameMode) =>
        dispatch({ type: 'START_GAME', payload: { players, bootAmount, gameMode } }),

      setActivePlayer: (playerId) =>
        dispatch({ type: 'SET_ACTIVE_PLAYER', payload: { playerId } }),

      placeBet: (amount) =>
        dispatch({ type: 'PLACE_BET', payload: { amount } }),

      pack: () => dispatch({ type: 'PACK' }),

      openDeclareModal: () => dispatch({ type: 'OPEN_DECLARE_MODAL' }),

      closeDeclareModal: () => dispatch({ type: 'CLOSE_DECLARE_MODAL' }),

      declareWinner: (winnerId) =>
        dispatch({ type: 'DECLARE_WINNER', payload: { winnerId } }),

      rewind: () => dispatch({ type: 'REWIND' }),

      newGame: () => dispatch({ type: 'NEW_GAME' }),
    }),
    []
  );

  const startGameFromSetup = useCallback(
    (draftNames, startingWallet, bootAmount, gameMode) => {
      const players = draftNames.map((name, index) =>
        createPlayer(name, index, startingWallet)
      );
      actions.startGame(players, bootAmount, gameMode);
    },
    [actions]
  );

  const value = useMemo(
    () => ({ state, dispatch, actions, startGameFromSetup }),
    [state, actions, startGameFromSetup]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
