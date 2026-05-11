import { useGame } from '../../context/GameContext';
import { RARITY_COLORS } from '../../data/bosses';

const GEAR_SLOTS = ['weapon', 'relic', 'head', 'chest', 'hands', 'feet'];
const SLOT_ICONS = {
  weapon: '⚔️',
  relic: '💎',
  head: '🪖',
  chest: '🛡️',
  hands: '🧤',
  feet: '👟',
};

function GearSlot({ slot, item, onEquip }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-lg shrink-0">
        {item ? item.icon : SLOT_ICONS[slot]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 capitalize">{slot}</p>
        {item ? (
          <>
            <p className="text-sm font-semibold" style={{ color: item.rarityColor }}>
              {item.name}
            </p>
            <p className="text-xs text-gray-400 truncate">{item.description}</p>
          </>
        ) : (
          <p className="text-sm text-gray-600">Empty slot</p>
        )}
      </div>
      {item && (
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
          style={{
            color: item.rarityColor,
            backgroundColor: item.rarityColor + '22',
          }}
        >
          {item.rarity}
        </span>
      )}
    </div>
  );
}

export default function InventoryScreen() {
  const { state, dispatch } = useGame();
  const { inventory, gear } = state.character;

  const unequippedItems = inventory.filter(item => {
    const equippedInSlot = gear[item.slot];
    return !equippedInSlot || equippedInSlot.id !== item.id;
  });

  return (
    <div className="pb-20 px-4 max-w-lg mx-auto">
      <div className="pt-6 pb-4">
        <h2 className="text-lg font-bold text-white mb-1">Inventory</h2>
        <p className="text-xs text-gray-500">
          Gear earned from defeating bosses. Better gear boosts your XP gains.
        </p>
      </div>

      {/* Equipped gear */}
      <div className="mb-6">
        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Equipped</h3>
        <div className="space-y-2">
          {GEAR_SLOTS.map(slot => (
            <GearSlot
              key={slot}
              slot={slot}
              item={gear[slot] || null}
              onEquip={item => dispatch({ type: 'EQUIP_ITEM', item })}
            />
          ))}
        </div>
      </div>

      {/* Unequipped items */}
      {unequippedItems.length > 0 && (
        <div>
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Backpack</h3>
          <div className="space-y-2">
            {unequippedItems.map(item => (
              <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl p-3 flex items-center gap-3">
                <div className="text-2xl">{item.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: item.rarityColor }}>
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400">{item.description}</p>
                </div>
                <button
                  onClick={() => dispatch({ type: 'EQUIP_ITEM', item })}
                  className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1.5 rounded-lg hover:bg-amber-500/30 transition-colors"
                >
                  Equip
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {inventory.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🎒</div>
          <p className="text-gray-500 text-sm">No items yet.</p>
          <p className="text-gray-600 text-xs mt-1">Defeat bosses to earn gear that boosts your XP.</p>
        </div>
      )}
    </div>
  );
}
