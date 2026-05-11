import { useGame } from '../../context/GameContext';
import { SKILLS, SKILL_TREES } from '../../data/skills';
import { calcCharacterLevel, calcTotalSkillLevels, xpToNextLevel } from '../../utils/gameEngine';
import StatBar from '../ui/StatBar';

export default function CharacterScreen() {
  const { state } = useGame();
  const { character } = state;
  const { skills } = character;
  const charLevel = calcCharacterLevel(skills);
  const totalLevels = calcTotalSkillLevels(skills);

  const trees = Object.keys(SKILL_TREES);

  const equippedItems = Object.values(character.gear || {}).filter(Boolean);

  return (
    <div className="pb-20 px-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="pt-6 pb-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-xl">
              ⚔️
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{character.name}</h2>
              <p className="text-xs text-amber-400">
                Level {charLevel} · {totalLevels} total skill levels
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <StatBar
              label="HP"
              current={character.hp}
              max={character.maxHp}
              color="#22c55e"
            />
            <StatBar
              label="MP"
              current={character.mp}
              max={character.maxMp}
              color="#3b82f6"
            />
          </div>
        </div>
      </div>

      {/* Equipped Gear */}
      {equippedItems.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Equipped</h3>
          <div className="flex gap-2 flex-wrap">
            {equippedItems.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-1.5 bg-gray-900 border rounded-lg px-2.5 py-1.5 text-xs"
                style={{ borderColor: item.rarityColor + '60' }}
              >
                <span>{item.icon}</span>
                <span style={{ color: item.rarityColor }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill trees */}
      {trees.map(tree => {
        const treeSkills = Object.entries(SKILLS).filter(([, v]) => v.tree === tree);
        const treeData = SKILL_TREES[tree];
        return (
          <div key={tree} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span>{treeData.icon}</span>
              <h3
                className="text-xs uppercase tracking-wider font-semibold"
                style={{ color: treeData.color }}
              >
                {tree} Tree
              </h3>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
              {treeSkills.map(([skillId, skillMeta]) => {
                const skillData = skills[skillId];
                const xpNeeded = xpToNextLevel(skillData.level);
                return (
                  <div key={skillId} className="px-4 py-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{skillMeta.icon}</span>
                        <span className="text-sm text-white font-medium">{skillMeta.name}</span>
                      </div>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          color: skillMeta.color,
                          backgroundColor: skillMeta.color + '22',
                        }}
                      >
                        Lv {skillData.level}
                      </span>
                    </div>
                    <StatBar
                      label={`${skillData.xp} / ${xpNeeded} XP`}
                      current={skillData.xp}
                      max={xpNeeded}
                      color={skillMeta.color}
                      showNumbers={false}
                    />
                    <p className="text-right text-xs mt-0.5" style={{ color: '#6b7280' }}>
                      {skillData.xp} / {xpNeeded} XP
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
