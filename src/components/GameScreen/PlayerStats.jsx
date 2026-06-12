import { useGame } from '../../hooks/useGame';
import { getNetProfitLoss } from '../../utils/calculations';
import { formatCurrency } from '../../utils/format';
import '../../styles/scoreboard.css';

export function PlayerStats() {
  const { sortedPlayers } = useGame();

  return (
    <div className="score-panel">
      <h2 className="score-panel__title">Player Stats</h2>

      <div className="score-panel__table-wrap">
        <table className="score-table score-table--stats">
          <thead>
            <tr>
              <th>Player</th>
              <th>Start</th>
              <th>Current</th>
              <th>Contrib.</th>
              <th>Won</th>
              <th>Net P/L</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player) => {
              const net = getNetProfitLoss(player);
              const netClass =
                net > 0 ? 'score-table__positive' : net < 0 ? 'score-table__negative' : '';

              return (
                <tr key={player.id}>
                  <td>{player.name}</td>
                  <td>{formatCurrency(player.startingWallet)}</td>
                  <td>{formatCurrency(player.walletBalance)}</td>
                  <td>{formatCurrency(player.totalContributed)}</td>
                  <td>{formatCurrency(player.totalWon)}</td>
                  <td className={netClass}>{formatCurrency(net)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
