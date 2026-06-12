import { useGame } from '../../hooks/useGame';
import { usePlayerPositions } from '../../hooks/usePlayerPositions';
import { PlayerSeat } from './PlayerSeat';
import { CenterPot } from './CenterPot';
import { BettingControls } from './BettingControls';
import { ActionBar } from './ActionBar';
import '../../styles/table.css';

export function PokerTable() {
  const { state, activePlayer, needsPlayerSelection } = useGame();
  const positions = usePlayerPositions(state.players.length);

  return (
    <div className="poker-table-wrapper">
      {needsPlayerSelection && (
        <div className="poker-table__hint">
          Tap a player to start the round
        </div>
      )}

      <div className="poker-table">
        <div className="poker-table__felt">
          <CenterPot />

          {state.players.map((player, index) => (
            <PlayerSeat
              key={player.id}
              player={player}
              position={positions[index]}
              isActive={activePlayer?.id === player.id}
              canSelect={needsPlayerSelection && !player.isPacked}
            />
          ))}
        </div>
      </div>

      <BettingControls />
      <ActionBar />
    </div>
  );
}
