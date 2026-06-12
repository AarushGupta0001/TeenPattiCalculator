import { useState } from 'react';
import { GAME_MODES } from '../../models/gameModels';
import { useGame } from '../../hooks/useGame';
import { PokerTable } from './PokerTable';
import { RoundHistory } from './RoundHistory';
import { PlayerStats } from './PlayerStats';
import { DeclareWinnerModal } from '../modals/DeclareWinnerModal';
import '../../styles/game.css';

export function GameScreen() {
  const { state, actions } = useGame();
  const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);

  const handleNewGame = () => {
    setShowNewGameConfirm(true);
  };

  const confirmNewGame = () => {
    actions.newGame();
    setShowNewGameConfirm(false);
  };

  return (
    <div className="game">
      <header className="game__header">
        <div className="game__header-left">
          <span className="game__logo">♠</span>
          <div>
            <h1 className="game__title">Teen Patti Tracker</h1>
            <p className="game__subtitle">
              Round {state.roundNumber}
              <span className="game__mode-badge">
                {state.gameMode === GAME_MODES.SHOW ? 'Show' : 'Classic'}
              </span>
            </p>
          </div>
        </div>
        <button type="button" className="game__new-btn" onClick={handleNewGame}>
          New Game
        </button>
      </header>

      <main className="game__main">
        <section className="game__table-section">
          <PokerTable />
        </section>

        <aside className="game__sidebar">
          <RoundHistory history={state.roundHistory} />
          <PlayerStats />
        </aside>
      </main>

      {state.isDeclareModalOpen && <DeclareWinnerModal />}

      {showNewGameConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <h2 className="modal__title">Start New Game?</h2>
            <p className="modal__text">
              All scores, round history, and wallet data will be lost. This cannot
              be undone.
            </p>
            <div className="modal__actions">
              <button
                type="button"
                className="modal__btn modal__btn--secondary"
                onClick={() => setShowNewGameConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal__btn modal__btn--danger"
                onClick={confirmNewGame}
              >
                Confirm New Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
