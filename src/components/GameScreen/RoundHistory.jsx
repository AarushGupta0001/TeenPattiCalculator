import { formatCurrency } from '../../utils/format';
import '../../styles/scoreboard.css';

export function RoundHistory({ history }) {
  return (
    <div className="score-panel">
      <h2 className="score-panel__title">Round History</h2>

      {history.length === 0 ? (
        <p className="score-panel__empty">No rounds completed yet.</p>
      ) : (
        <div className="score-panel__table-wrap">
          <table className="score-table">
            <thead>
              <tr>
                <th>Round</th>
                <th>Winner</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={`${entry.roundNumber}-${entry.winnerName}`}>
                  <td>Round {entry.roundNumber}</td>
                  <td>{entry.winnerName}</td>
                  <td className="score-table__amount">
                    {formatCurrency(entry.winningAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
