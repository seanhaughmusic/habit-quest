const TABS = [
  { id: 'character', label: 'Character', icon: '⚔️' },
  { id: 'habits', label: 'Habits', icon: '📋' },
  { id: 'battle', label: 'Battle', icon: '💀' },
  { id: 'inventory', label: 'Inventory', icon: '🎒' },
];

export default function Navigation({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gray-950 border-t border-gray-800">
      <div className="max-w-lg mx-auto flex">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors ${
              active === tab.id ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
