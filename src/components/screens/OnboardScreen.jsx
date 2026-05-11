import { useState } from 'react';
import { useGame } from '../../context/GameContext';

export default function OnboardScreen() {
  const { dispatch } = useGame();
  const [name, setName] = useState('');

  const handleStart = () => {
    if (!name.trim()) return;
    dispatch({ type: 'ONBOARD', name: name.trim() });
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <div className="text-6xl mb-4">⚔️</div>
        <h1 className="text-3xl font-bold text-amber-400 mb-2">Habit Quest</h1>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          Turn your daily habits into power. Train your skills. Defeat what holds you back.
        </p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-left space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider">How it works</p>
          <div className="space-y-1.5 text-sm text-gray-300">
            <p>📋 Log daily habits → earn XP</p>
            <p>📈 XP levels up your skills</p>
            <p>💀 Use your stats to defeat bosses</p>
            <p>🔗 Build streaks for bonus XP</p>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5 text-left">Your hero's name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            placeholder="Enter your name..."
            maxLength={24}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>

        <button
          onClick={handleStart}
          disabled={!name.trim()}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 disabled:text-gray-500 text-gray-950 font-bold py-3 rounded-lg transition-colors text-sm"
        >
          Begin Your Quest
        </button>
      </div>

      <p className="mt-8 text-xs text-gray-600">Your progress is saved locally in your browser.</p>
    </div>
  );
}
