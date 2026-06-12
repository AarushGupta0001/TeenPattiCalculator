import { useGame } from '../../hooks/useGame';
import { formatCurrency } from '../../utils/format';

export function CenterPot() {
  const { state, activePlayer } = useGame();

  return (
    <div className="center-pot">
      <p className="center-pot__label">Current Pot</p>
      <p className="center-pot__amount">{formatCurrency(state.pot)}</p>
      <div className="center-pot__meta">
        <span className="center-pot__round">Round {state.roundNumber}</span>
        <span className="center-pot__divider">•</span>
        <span className="center-pot__active">
          {activePlayer ? activePlayer.name : 'No active player'}
        </span>
      </div>
      {state.bootAmount > 0 && (
        <p className="center-pot__boot">
          Boot: {formatCurrency(state.bootAmount)}/player
        </p>
      )}
    </div>
  );
}
