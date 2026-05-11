import { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Navigation from './components/Navigation';
import OnboardScreen from './components/screens/OnboardScreen';
import CharacterScreen from './components/screens/CharacterScreen';
import HabitsScreen from './components/screens/HabitsScreen';
import BattleScreen from './components/screens/BattleScreen';
import InventoryScreen from './components/screens/InventoryScreen';
import NotificationToast from './components/ui/NotificationToast';

function AppContent() {
  const { state } = useGame();
  const [tab, setTab] = useState('habits');

  if (!state.onboarded) return <OnboardScreen />;

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <NotificationToast />
      <div className="overflow-y-auto">
        {tab === 'character' && <CharacterScreen />}
        {tab === 'habits' && <HabitsScreen />}
        {tab === 'battle' && <BattleScreen />}
        {tab === 'inventory' && <InventoryScreen />}
      </div>
      <Navigation active={tab} onChange={setTab} />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
