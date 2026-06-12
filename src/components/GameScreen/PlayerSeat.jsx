import { useGame } from '../../hooks/useGame';
import { formatCurrency } from '../../utils/format';

export function PlayerSeat({ player, position, isActive, canSelect }) {
  const { actions } = useGame();

  const handleClick = () => {
    if (canSelect) {
      actions.setActivePlayer(player.id);
    }
  };

  const classNames = [
    'player-seat',
    isActive && 'player-seat--active',
    player.isPacked && 'player-seat--packed',
    canSelect && 'player-seat--selectable',
  ]
    .filter(Boolean)
    .join(' ');

  const seatStyle = {
    left: position.left,
    top: position.top,
    transform: isActive
      ? 'translate(-50%, -50%) scale(1.18)'
      : position.transform,
  };

  const content = (
    <>
      {isActive && !player.isPacked && (
        <span className="player-seat__badge player-seat__badge--turn">YOUR TURN</span>
      )}
      {player.isPacked && <span className="player-seat__badge">PACKED</span>}
      <span className="player-seat__name">{player.name}</span>
      <span className="player-seat__wallet">
        Wallet: {formatCurrency(player.walletBalance)}
      </span>
      <span className="player-seat__round">
        Round: {formatCurrency(player.roundContribution)}
      </span>
    </>
  );

  if (canSelect) {
    return (
      <button
        type="button"
        className={classNames}
        style={seatStyle}
        onClick={handleClick}
        aria-label={`Select ${player.name} as active player`}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={classNames}
      style={seatStyle}
      aria-label={`${player.name}, wallet ${player.walletBalance}`}
      aria-current={isActive ? 'true' : undefined}
    >
      {content}
    </div>
  );
}
