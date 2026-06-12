import { GameProvider } from './context/GameProvider.jsx';
import { useGame } from './hooks/useGame';
import { SetupScreen } from './components/SetupScreen/SetupScreen';
import { GameScreen } from './components/GameScreen/GameScreen';

function AppContent() {
  const { state } = useGame();

  if (state.screen === 'setup') {
    return <SetupScreen />;
  }

  return <GameScreen />;
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
