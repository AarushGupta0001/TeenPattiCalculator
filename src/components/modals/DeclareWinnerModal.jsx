import { useState } from 'react';
import { useGame } from '../../hooks/useGame';
import { formatCurrency } from '../../utils/format';
import '../../styles/modal.css';

export function DeclareWinnerModal() {
  const { state, actions } = useGame();
  const [selectedId, setSelectedId] = useState('');

  const handleConfirm = () => {
    if (!selectedId) return;
    actions.declareWinner(selectedId);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="declare-title">
      <div className="modal modal--wide">
        <h2 id="declare-title" className="modal__title">
          Declare Winner
        </h2>
        <p className="modal__text">
          Pot to award: <strong>{formatCurrency(state.pot)}</strong>
        </p>

        <div className="modal__player-list">
          {state.players.map((player) => (
            <label key={player.id} className="modal__player-option">
              <input
                type="radio"
                name="winner"
                value={player.id}
                checked={selectedId === player.id}
                onChange={() => setSelectedId(player.id)}
              />
              <span className="modal__player-info">
                <span className="modal__player-name">{player.name}</span>
                <span className="modal__player-wallet">
                  Wallet: {formatCurrency(player.walletBalance)}
                  {player.isPacked && ' · Packed'}
                </span>
              </span>
            </label>
          ))}
        </div>

        <div className="modal__actions">
          <button
            type="button"
            className="modal__btn modal__btn--secondary"
            onClick={() => actions.closeDeclareModal()}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal__btn modal__btn--primary"
            onClick={handleConfirm}
            disabled={!selectedId}
          >
            Confirm Winner
          </button>
        </div>
      </div>
    </div>
  );
}
