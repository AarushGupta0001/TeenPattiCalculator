export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 10;
export const DEFAULT_PLAYER_COUNT = 4;
export const DEFAULT_STARTING_WALLET = 1000;
export const BET_AMOUNTS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
export const WALLET_PRESETS = [1000, 2000, 5000];
export const BOOT_PRESETS = [10, 20, 50, 100];
export const MAX_UNDO_STACK = 50;

export const GAME_MODES = {
  CLASSIC: 'classic',
  SHOW: 'show',
};

export const SHOW_START_AMOUNTS = [10, 20];

export const createDefaultNames = (count) =>
  Array.from({ length: count }, (_, i) => `P${i + 1}`);

export const createInitialState = () => ({
  screen: 'setup',
  playerCount: DEFAULT_PLAYER_COUNT,
  draftNames: createDefaultNames(DEFAULT_PLAYER_COUNT),
  startingWallet: DEFAULT_STARTING_WALLET,
  bootAmount: 0,
  bootEnabled: false,
  draftBootAmount: 10,
  gameMode: GAME_MODES.CLASSIC,
  players: [],
  pot: 0,
  roundNumber: 1,
  activePlayerId: null,
  lastBetAmount: null,
  isDeclareModalOpen: false,
  roundHistory: [],
  undoStack: [],
});

export const createPlayer = (name, index, startingWallet) => ({
  id: `player-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: name.trim(),
  startingWallet,
  walletBalance: startingWallet,
  roundContribution: 0,
  totalContributed: 0,
  totalWon: 0,
  isPacked: false,
});

export const validateSetup = (draftNames, startingWallet, bootAmount) => {
  if (draftNames.some((name) => !name.trim())) {
    return 'All player names are required.';
  }
  if (!Number.isFinite(startingWallet) || startingWallet <= 0) {
    return 'Starting wallet must be a positive number.';
  }
  if (!Number.isFinite(bootAmount) || bootAmount < 0) {
    return 'Boot amount must be zero or a positive number.';
  }
  if (bootAmount > 0 && startingWallet < bootAmount) {
    return 'Starting wallet must be at least the boot amount.';
  }
  return null;
};
