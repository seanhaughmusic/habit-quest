import { useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const TYPE_STYLES = {
  xp: 'bg-blue-900 border-blue-500 text-blue-200',
  levelup: 'bg-yellow-900 border-yellow-500 text-yellow-200',
  reward: 'bg-purple-900 border-purple-500 text-purple-200',
};

const TYPE_ICONS = { xp: '⬆️', levelup: '🌟', reward: '🎁' };

export default function NotificationToast() {
  const { state, dispatch } = useGame();
  const { notifications } = state;

  useEffect(() => {
    if (notifications.length === 0) return;
    const oldest = notifications[0];
    const timer = setTimeout(() => {
      dispatch({ type: 'DISMISS_NOTIFICATION', id: oldest.id });
    }, 3000);
    return () => clearTimeout(timer);
  }, [notifications, dispatch]);

  if (notifications.length === 0) return null;
  const n = notifications[0];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div
        className={`px-4 py-2 rounded-lg border text-sm font-semibold shadow-lg animate-bounce ${
          TYPE_STYLES[n.type] ?? TYPE_STYLES.xp
        }`}
      >
        {TYPE_ICONS[n.type] ?? '✨'} {n.message}
      </div>
    </div>
  );
}
