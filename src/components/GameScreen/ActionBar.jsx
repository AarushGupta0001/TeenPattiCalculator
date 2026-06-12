import { useGame } from '../../hooks/useGame';

export function ActionBar() {
  const { activePlayer, actions, canRewind } = useGame();

  const canPack = activePlayer && !activePlayer.isPacked;

  return (
    <div className="action-bar">
      <button
        type="button"
        className="action-bar__btn action-bar__btn--pack"
        onClick={() => actions.pack()}
        disabled={!canPack}
      >
        Pack
      </button>
      <button
        type="button"
        className="action-bar__btn action-bar__btn--rewind"
        onClick={() => actions.rewind()}
        disabled={!canRewind}
        aria-label="Rewind last action"
      >
        Rewind
      </button>
      <button
        type="button"
        className="action-bar__btn action-bar__btn--declare"
        onClick={() => actions.openDeclareModal()}
      >
        Declare Winner
      </button>
    </div>
  );
}
