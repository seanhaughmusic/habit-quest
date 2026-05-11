import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { HABITS } from '../../data/habits';
import { SKILL_TREES } from '../../data/skills';
import { calcHabitXp, calcStreakLabel, isSameDay } from '../../utils/gameEngine';

const TREES = ['Body', 'Mind', 'Craft', 'Discipline'];

function HabitCard({ habit, streakCount, alreadyLogged, onLog }) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  const streakLabel = calcStreakLabel(streakCount);
  const previewXp =
    habit.type === 'timed' && value
      ? calcHabitXp(habit, parseInt(value) || 0, streakCount, null)
      : habit.type === 'flat'
      ? calcHabitXp(habit, 1, streakCount, null)
      : null;

  const handleLog = () => {
    if (habit.type === 'timed') {
      const mins = parseInt(value);
      if (!mins || mins <= 0) return;
      onLog(habit, mins);
    } else {
      onLog(habit, 1);
    }
    setValue('');
    setOpen(false);
  };

  return (
    <div
      className={`bg-gray-900 border rounded-xl overflow-hidden transition-all ${
        alreadyLogged ? 'border-green-800 opacity-75' : 'border-gray-800'
      }`}
    >
      <button
        className="w-full px-4 py-3 flex items-center gap-3 text-left"
        onClick={() => !alreadyLogged && setOpen(o => !o)}
        disabled={alreadyLogged}
      >
        <span className="text-2xl leading-none">{habit.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-white">{habit.name}</span>
            {alreadyLogged && (
              <span className="text-xs text-green-400 font-semibold">✓ Logged</span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">{habit.description}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {streakCount > 0 && (
            <span className="text-xs text-orange-400 font-medium">🔥 {streakCount}d</span>
          )}
          {streakLabel && (
            <span className="text-xs text-amber-400 font-bold">{streakLabel}</span>
          )}
          {habit.type === 'timed' ? (
            <span className="text-xs text-gray-600">{habit.xpRate} XP/min</span>
          ) : (
            <span className="text-xs text-gray-600">+{habit.xpFlat} XP</span>
          )}
        </div>
      </button>

      {open && !alreadyLogged && (
        <div className="px-4 pb-4 border-t border-gray-800 pt-3 space-y-3">
          {habit.type === 'timed' ? (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLog()}
                placeholder="Minutes"
                min={1}
                max={habit.maxValue}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500"
              />
              <div className="flex gap-1">
                {[15, 30, 45, 60].map(m => (
                  <button
                    key={m}
                    onClick={() => setValue(String(m))}
                    className="px-2 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg border border-gray-700"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {previewXp !== null && (
            <p className="text-xs text-amber-400">
              You will earn{' '}
              <strong>+{previewXp} XP</strong> →{' '}
              {habit.skill.charAt(0).toUpperCase() + habit.skill.slice(1)}
              {streakCount >= 3 && ` (streak bonus applied)`}
            </p>
          )}

          <button
            onClick={handleLog}
            disabled={habit.type === 'timed' && !value}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 disabled:text-gray-500 text-gray-950 font-bold py-2 rounded-lg transition-colors text-sm"
          >
            {habit.type === 'flat' ? `Log — +${habit.xpFlat} XP` : 'Log Habit'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function HabitsScreen() {
  const { state, dispatch } = useGame();
  const [activeTree, setActiveTree] = useState('Body');

  const { streaks, todayLog } = state.habits;
  const gear = state.character.gear;

  const handleLog = (habit, value) => {
    dispatch({ type: 'LOG_HABIT', habit, value });
  };

  const treeHabits = HABITS.filter(h => h.tree === activeTree);
  const loggedToday = Object.keys(todayLog).length;

  return (
    <div className="pb-20 px-4 max-w-lg mx-auto">
      <div className="pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-white">Daily Habits</h2>
          {loggedToday > 0 && (
            <span className="text-xs text-green-400">{loggedToday} logged today</span>
          )}
        </div>
        <p className="text-xs text-gray-500">Log habits to earn XP and grow your skills.</p>
      </div>

      {/* Tree tabs */}
      <div className="flex gap-1 mb-4 bg-gray-900 p-1 rounded-xl border border-gray-800">
        {TREES.map(tree => {
          const treeData = SKILL_TREES[tree];
          return (
            <button
              key={tree}
              onClick={() => setActiveTree(tree)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTree === tree ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="mr-1">{treeData.icon}</span>
              {tree}
            </button>
          );
        })}
      </div>

      {/* Habits list */}
      <div className="space-y-2">
        {treeHabits.map(habit => {
          const streakCount = streaks[habit.id] || 0;
          const lastDate = streaks[`${habit.id}_lastDate`] || null;
          const alreadyLogged = todayLog[habit.id] !== undefined;

          return (
            <HabitCard
              key={habit.id}
              habit={habit}
              streakCount={streakCount}
              alreadyLogged={alreadyLogged}
              onLog={handleLog}
              gear={gear}
            />
          );
        })}
      </div>
    </div>
  );
}
