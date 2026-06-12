import { useState } from 'react';
import { GAME_MODES } from '../../models/gameModels';
import { useGame } from '../../hooks/useGame';
import { formatCurrency } from '../../utils/format';

export function BettingControls() {
  const { activePlayer, actions, betOptions, state } = useGame();
  const [customAmount, setCustomAmount] = useState('');
  const [customError, setCustomError] = useState('');

  const isShowMode = state.gameMode === GAME_MODES.SHOW;
  const isDisabled = !activePlayer || activePlayer.isPacked;

  const handleBet = (amount) => {
    if (isDisabled || activePlayer.walletBalance < amount) return;
    actions.placeBet(amount);
  };

  const handleCustomBet = () => {
    const amount = parseInt(customAmount, 10);

    if (!activePlayer) return;

    if (!Number.isFinite(amount) || amount <= 0) {
      setCustomError('Enter a valid positive amount.');
      return;
    }

    if (amount > activePlayer.walletBalance) {
      setCustomError(`Insufficient wallet. Max: ${formatCurrency(activePlayer.walletBalance)}`);
      return;
    }

    setCustomError('');
    actions.placeBet(amount);
    setCustomAmount('');
  };

  return (
    <div className="betting-controls">
      <h3 className="betting-controls__title">
        Place Bet{isShowMode ? ' · Show' : ''}
      </h3>

      {isShowMode && state.lastBetAmount != null && (
        <p className="betting-controls__show-hint">
          Current / Double (last bet: {formatCurrency(state.lastBetAmount)})
        </p>
      )}

      <div
        className={`betting-controls__chips ${
          isShowMode ? 'betting-controls__chips--show' : ''
        }`}
      >
        {betOptions.map((amount) => {
          const insufficient =
            activePlayer && activePlayer.walletBalance < amount;

          return (
            <button
              key={`${amount}-${isShowMode ? 'show' : 'classic'}`}
              type="button"
              className="betting-controls__chip"
              onClick={() => handleBet(amount)}
              disabled={isDisabled || insufficient}
              aria-label={`Bet ${formatCurrency(amount)}`}
            >
              {formatCurrency(amount)}
            </button>
          );
        })}
      </div>

      <div className="betting-controls__custom">
        <input
          type="number"
          className="betting-controls__custom-input"
          placeholder="Custom amount"
          min="1"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setCustomError('');
          }}
          disabled={isDisabled}
        />
        <button
          type="button"
          className="betting-controls__custom-btn"
          onClick={handleCustomBet}
          disabled={isDisabled || !customAmount}
        >
          Add Bet
        </button>
      </div>

      {customError && <p className="betting-controls__error">{customError}</p>}

      {activePlayer && (
        <p className="betting-controls__wallet-hint">
          Available: {formatCurrency(activePlayer.walletBalance)}
        </p>
      )}
    </div>
  );
}
