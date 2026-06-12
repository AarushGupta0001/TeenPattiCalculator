import { useState } from 'react';
import {
  BOOT_PRESETS,
  GAME_MODES,
  MAX_PLAYERS,
  MIN_PLAYERS,
  validateSetup,
  WALLET_PRESETS,
} from '../../models/gameModels';
import { useGame } from '../../hooks/useGame';
import { PlayerNameFields } from './PlayerNameFields';
import '../../styles/setup.css';

export function SetupScreen() {
  const { state, actions, startGameFromSetup } = useGame();
  const [error, setError] = useState('');

  const handleCountChange = (delta) => {
    actions.setPlayerCount(state.playerCount + delta);
    setError('');
  };

  const handleWalletChange = (value) => {
    const parsed = parseInt(value, 10);
    actions.setStartingWallet(Number.isNaN(parsed) ? 0 : parsed);
    setError('');
  };

  const handleBootChange = (value) => {
    const parsed = parseInt(value, 10);
    actions.setBootAmount(Number.isNaN(parsed) ? 0 : parsed);
    setError('');
  };

  const handleStart = () => {
    const bootAmount = state.bootEnabled ? state.draftBootAmount : 0;
    const validationError = validateSetup(
      state.draftNames,
      state.startingWallet,
      bootAmount
    );
    if (validationError) {
      setError(validationError);
      return;
    }
    startGameFromSetup(
      state.draftNames,
      state.startingWallet,
      bootAmount,
      state.gameMode
    );
  };

  return (
    <div className="setup">
      <div className="setup__card">
        <header className="setup__header">
          <div className="setup__logo">♠</div>
          <h1 className="setup__title">Teen Patti Money Tracker</h1>
          <p className="setup__subtitle">
            Track pots, turns, and wallets while you play with real cards.
          </p>
        </header>

        <section className="setup__section">
          <h2 className="setup__section-title">Step 1 — Number of Players</h2>
          <div className="setup__counter">
            <button
              type="button"
              className="setup__counter-btn"
              onClick={() => handleCountChange(-1)}
              disabled={state.playerCount <= MIN_PLAYERS}
              aria-label="Decrease player count"
            >
              −
            </button>
            <span className="setup__counter-value">{state.playerCount}</span>
            <button
              type="button"
              className="setup__counter-btn"
              onClick={() => handleCountChange(1)}
              disabled={state.playerCount >= MAX_PLAYERS}
              aria-label="Increase player count"
            >
              +
            </button>
          </div>
          <p className="setup__hint">
            {MIN_PLAYERS} to {MAX_PLAYERS} players
          </p>
        </section>

        <section className="setup__section">
          <h2 className="setup__section-title">Step 2 — Player Names</h2>
          <PlayerNameFields
            names={state.draftNames}
            onNameChange={(index, name) => {
              actions.setDraftName(index, name);
              setError('');
            }}
          />
        </section>

        <section className="setup__section">
          <h2 className="setup__section-title">Step 3 — Starting Wallet</h2>
          <p className="setup__hint">Same amount for every player</p>
          <div className="setup__wallet-presets">
            {WALLET_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`setup__preset-btn ${
                  state.startingWallet === preset ? 'setup__preset-btn--active' : ''
                }`}
                onClick={() => actions.setStartingWallet(preset)}
              >
                ₹{preset.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
          <input
            type="number"
            className="setup__wallet-input"
            min="1"
            value={state.startingWallet || ''}
            onChange={(e) => handleWalletChange(e.target.value)}
            placeholder="Enter starting wallet"
          />
        </section>

        <section className="setup__section">
          <h2 className="setup__section-title">Step 4 — Game Mode</h2>
          <div className="setup__mode-toggle">
            <button
              type="button"
              className={`setup__mode-btn ${
                state.gameMode === GAME_MODES.CLASSIC ? 'setup__mode-btn--active' : ''
              }`}
              onClick={() => actions.setGameMode(GAME_MODES.CLASSIC)}
            >
              Classic
            </button>
            <button
              type="button"
              className={`setup__mode-btn ${
                state.gameMode === GAME_MODES.SHOW ? 'setup__mode-btn--active' : ''
              }`}
              onClick={() => actions.setGameMode(GAME_MODES.SHOW)}
            >
              Show
            </button>
          </div>
          <p className="setup__hint">
            {state.gameMode === GAME_MODES.CLASSIC
              ? 'Fixed betting chips from ₹10 to ₹100.'
              : 'Dynamic betting: current bet and double, starting at ₹10 / ₹20.'}
          </p>
        </section>

        <section className="setup__section setup__boot-section">
          <h2 className="setup__section-title">Step 5 — Boot Amount</h2>
          <label className="setup__boot-toggle">
            <input
              type="checkbox"
              checked={state.bootEnabled}
              onChange={(e) => actions.setBootEnabled(e.target.checked)}
            />
            <span>Enable boot (ante each round)</span>
          </label>
          {state.bootEnabled && (
            <>
              <p className="setup__hint">
                Deducted from every player and added to the pot at the start of each round
              </p>
              <div className="setup__wallet-presets">
                {BOOT_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={`setup__preset-btn ${
                      state.draftBootAmount === preset ? 'setup__preset-btn--active' : ''
                    }`}
                    onClick={() => actions.setBootAmount(preset)}
                  >
                    ₹{preset.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <input
                type="number"
                className="setup__wallet-input"
                min="1"
                value={state.draftBootAmount || ''}
                onChange={(e) => handleBootChange(e.target.value)}
                placeholder="Enter boot amount"
              />
            </>
          )}
        </section>

        {error && <p className="setup__error">{error}</p>}

        <button type="button" className="setup__start-btn" onClick={handleStart}>
          Start Game
        </button>
      </div>
    </div>
  );
}
