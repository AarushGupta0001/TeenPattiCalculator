export function PlayerNameFields({ names, onNameChange }) {
  return (
    <div className="setup__names">
      {names.map((name, index) => (
        <label key={index} className="setup__name-row">
          <span className="setup__name-label">Player {index + 1}</span>
          <input
            type="text"
            className="setup__name-input"
            value={name}
            onChange={(e) => onNameChange(index, e.target.value)}
            placeholder={`P${index + 1}`}
            maxLength={24}
          />
        </label>
      ))}
    </div>
  );
}
