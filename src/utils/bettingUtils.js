import { BET_AMOUNTS, GAME_MODES, SHOW_START_AMOUNTS } from '../models/gameModels';

export function getShowBetOptions(lastBetAmount) {
  if (lastBetAmount == null) return SHOW_START_AMOUNTS;
  return [lastBetAmount, lastBetAmount * 2];
}

export function getBetOptions(gameMode, lastBetAmount) {
  if (gameMode === GAME_MODES.SHOW) {
    return getShowBetOptions(lastBetAmount);
  }
  return BET_AMOUNTS;
}
