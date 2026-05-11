export default function StatBar({ label, current, max, color = '#3b82f6', showNumbers = true }) {
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 0;
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1" style={{ color: '#9ca3af' }}>
        <span>{label}</span>
        {showNumbers && (
          <span>
            {current} / {max}
          </span>
        )}
      </div>
      <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
