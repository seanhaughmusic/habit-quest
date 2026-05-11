import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { BOSSES } from '../../data/bosses';
import { ATTACK_TYPES, resolveTurn, calcPlayerMaxHp } from '../../utils/combat';
import { calcTotalSkillLevels } from '../../utils/gameEngine';
import StatBar from '../ui/StatBar';

function BattleLog({ entries }) {
  if (!entries.length) return null;
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 space-y-1 max-h-36 overflow-y-auto">
      {[...entries].reverse().map((e, i) => (
        <p key={i} className={`text-xs ${i === 0 ? 'text-white' : 'text-gray-500'}`}>
          {e}
        </p>
      ))}
    </div>
  );
}

function BossCard({ boss, bossState, onFight, totalLevels }) {
  const canFight = totalLevels >= boss.powerCheck && !bossState.defeated;
  const pct = (bossState.currentHp / boss.maxHp) * 100;

  return (
    <div
      className={`bg-gray-900 border rounded-xl p-4 ${
        bossState.unlocked && !bossState.defeated ? 'border-red-800' : 'border-gray-800'
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="text-4xl w-14 h-14 flex items-center justify-center rounded-xl shrink-0"
          style={{ backgroundColor: boss.color + '22', border: `1px solid ${boss.color}44` }}
        >
          {boss.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-0.5">{boss.subtitle}</p>
          <h3 className="text-base font-bold text-white leading-tight">{boss.name}</h3>
          {bossState.defeated && (
            <span className="text-xs text-green-400 font-semibold">✓ Defeated</span>
          )}
          {!bossState.unlocked && (
            <span className="text-xs text-gray-500">🔒 Locked</span>
          )}
        </div>
      </div>

      {bossState.unlocked && !bossState.defeated && (
        <>
          <div className="mb-3">
            <StatBar
              label={`Boss HP — ${bossState.currentHp} / ${boss.maxHp}`}
              current={bossState.currentHp}
              max={boss.maxHp}
              color="#ef4444"
              showNumbers={false}
            />
          </div>

          <p className="text-xs text-gray-400 italic mb-3 leading-relaxed">
            "{boss.description.substring(0, 120)}..."
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            <span className="text-xs text-gray-500">Weak to:</span>
            {boss.weaknesses.map(w => (
              <span
                key={w}
                className="text-xs bg-gray-800 text-amber-400 px-2 py-0.5 rounded-full"
              >
                {w}
              </span>
            ))}
          </div>

          {!canFight && (
            <div className="bg-orange-950 border border-orange-800 rounded-lg px-3 py-2 mb-3">
              <p className="text-xs text-orange-300">
                ⚠️ Power Check: Need {boss.powerCheck} total skill levels. You have {totalLevels}.
                Keep training!
              </p>
            </div>
          )}

          <button
            onClick={() => canFight && onFight(boss)}
            disabled={!canFight}
            className="w-full py-2.5 rounded-lg font-bold text-sm transition-colors disabled:bg-gray-800 disabled:text-gray-500"
            style={
              canFight
                ? { backgroundColor: '#ef444422', color: '#ef4444', border: '1px solid #ef4444' }
                : {}
            }
          >
            {canFight ? '⚔️ Enter Battle' : `🔒 Need ${boss.powerCheck - totalLevels} more levels`}
          </button>
        </>
      )}

      {bossState.defeated && (
        <div className="bg-green-950 border border-green-800 rounded-lg px-3 py-2">
          <p className="text-xs text-green-300">{boss.defeatMessage}</p>
        </div>
      )}

      {!bossState.unlocked && (
        <p className="text-xs text-gray-600">Defeat the previous boss to unlock this encounter.</p>
      )}
    </div>
  );
}

function ActiveBattle({ boss, bossState, skills, character, onAttack, onFlee, log }) {
  const playerMaxHp = calcPlayerMaxHp(skills);
  const bossHpPct = (bossState.currentHp / boss.maxHp) * 100;
  const playerHpPct = (character.hp / playerMaxHp) * 100;

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 border border-red-900 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">{boss.icon}</div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">{boss.name}</p>
            <StatBar
              label=""
              current={bossState.currentHp}
              max={boss.maxHp}
              color="#ef4444"
              showNumbers={false}
            />
            <p className="text-xs text-gray-500 mt-0.5">
              {bossState.currentHp} / {boss.maxHp} HP
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-3">
          <p className="text-xs text-gray-400 mb-1">Your HP</p>
          <StatBar
            label=""
            current={character.hp}
            max={playerMaxHp}
            color="#22c55e"
            showNumbers={false}
          />
          <p className="text-xs text-gray-500 mt-0.5">
            {character.hp} / {playerMaxHp} HP
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Choose your attack</p>
        <div className="grid grid-cols-2 gap-2">
          {ATTACK_TYPES.map(attack => {
            const isWeak = boss.weaknesses.some(w => attack.skills.includes(w));
            return (
              <button
                key={attack.id}
                onClick={() => onAttack(attack.id)}
                className="p-3 rounded-xl border text-left transition-all active:scale-95"
                style={{
                  borderColor: attack.color + '44',
                  backgroundColor: attack.color + '11',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{attack.icon}</span>
                  <span className="text-xs font-bold text-white">{attack.name}</span>
                  {isWeak && (
                    <span className="text-xs text-amber-400 font-bold ml-auto">WEAK!</span>
                  )}
                </div>
                <p className="text-xs" style={{ color: attack.color }}>
                  {attack.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <BattleLog entries={log} />

      <button
        onClick={onFlee}
        className="w-full py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 border border-gray-800 transition-colors"
      >
        ← Retreat (boss HP resets)
      </button>
    </div>
  );
}

function VictoryScreen({ boss, onContinue }) {
  return (
    <div className="text-center space-y-4 py-4">
      <div className="text-6xl mb-2">🏆</div>
      <h2 className="text-xl font-bold text-amber-400">{boss.name} Defeated!</h2>
      <p className="text-sm text-gray-300 italic px-4 leading-relaxed">{boss.defeatMessage}</p>
      <div className="bg-purple-950 border border-purple-700 rounded-xl p-4 mx-4">
        <p className="text-xs text-purple-300 uppercase tracking-wider mb-2">Reward Obtained</p>
        <div className="flex items-center gap-2 justify-center">
          <span className="text-2xl">{boss.reward.icon}</span>
          <div className="text-left">
            <p className="text-sm font-bold" style={{ color: boss.reward.rarityColor }}>
              {boss.reward.name}
            </p>
            <p className="text-xs text-gray-400">{boss.reward.description}</p>
          </div>
        </div>
      </div>
      <button
        onClick={onContinue}
        className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold py-3 px-8 rounded-xl transition-colors"
      >
        Continue
      </button>
    </div>
  );
}

function DefeatScreen({ boss, onRetry }) {
  return (
    <div className="text-center space-y-4 py-4">
      <div className="text-6xl mb-2">💀</div>
      <h2 className="text-xl font-bold text-red-400">Defeated</h2>
      <p className="text-sm text-gray-300 italic px-4 leading-relaxed">{boss.failMessage}</p>
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mx-4">
        <p className="text-xs text-gray-400">
          Train your habits and grow your skills. The boss remains — come back stronger.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-xl transition-colors"
      >
        Return to Camp
      </button>
    </div>
  );
}

export default function BattleScreen() {
  const { state, dispatch } = useGame();
  const { character, bosses } = state;
  const { skills } = character;

  const [activeBoss, setActiveBoss] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [phase, setPhase] = useState('select'); // 'select' | 'fighting' | 'victory' | 'defeat'

  const totalLevels = calcTotalSkillLevels(skills);

  const handleFight = (boss) => {
    setActiveBoss(boss);
    setBattleLog([`You face ${boss.name}. Choose your attack.`]);
    setPhase('fighting');
    dispatch({ type: 'RESET_BOSS_HP', bossId: boss.id });
  };

  const handleAttack = (attackType) => {
    if (!activeBoss) return;

    const bossState = state.bosses.find(b => b.id === activeBoss.id);
    if (!bossState) return;

    const result = resolveTurn(attackType, skills, bossState.currentHp, activeBoss);
    const attackMeta = ATTACK_TYPES.find(a => a.id === attackType);

    const logs = [];
    if (result.weaknessHit) {
      logs.push(
        `⚡ ${attackMeta.name} hits a weakness! You deal ${result.playerDamage} damage!`
      );
    } else {
      logs.push(`⚔️ ${attackMeta.name}: You deal ${result.playerDamage} damage.`);
    }

    dispatch({
      type: 'BOSS_DAMAGE',
      bossId: activeBoss.id,
      playerDamage: result.playerDamage,
      bossDamage: result.bossDamage,
    });

    if (result.newBossHp <= 0) {
      logs.push(`🏆 ${activeBoss.name} has fallen!`);
      setBattleLog(prev => [...prev, ...logs]);
      dispatch({ type: 'DEFEAT_BOSS', bossId: activeBoss.id, reward: activeBoss.reward });
      setTimeout(() => setPhase('victory'), 600);
      return;
    }

    const newPlayerHp = Math.max(0, character.hp - result.bossDamage);
    logs.push(
      `💀 ${activeBoss.name} strikes back for ${result.bossDamage} damage. Your HP: ${newPlayerHp}`
    );

    if (newPlayerHp <= 0) {
      logs.push(`You have fallen. Retreat and train harder.`);
      setBattleLog(prev => [...prev, ...logs]);
      setTimeout(() => setPhase('defeat'), 600);
      return;
    }

    setBattleLog(prev => [...prev, ...logs]);
  };

  const handleFlee = () => {
    if (activeBoss) {
      dispatch({ type: 'RESET_BOSS_HP', bossId: activeBoss.id });
    }
    setActiveBoss(null);
    setBattleLog([]);
    setPhase('select');
  };

  const handleVictoryContinue = () => {
    setActiveBoss(null);
    setBattleLog([]);
    setPhase('select');
  };

  if (phase === 'victory' && activeBoss) {
    return (
      <div className="pb-20 px-4 max-w-lg mx-auto pt-6">
        <VictoryScreen boss={activeBoss} onContinue={handleVictoryContinue} />
      </div>
    );
  }

  if (phase === 'defeat' && activeBoss) {
    return (
      <div className="pb-20 px-4 max-w-lg mx-auto pt-6">
        <DefeatScreen boss={activeBoss} onRetry={handleFlee} />
      </div>
    );
  }

  if (phase === 'fighting' && activeBoss) {
    const bossState = state.bosses.find(b => b.id === activeBoss.id);
    return (
      <div className="pb-20 px-4 max-w-lg mx-auto pt-6">
        <ActiveBattle
          boss={activeBoss}
          bossState={bossState}
          skills={skills}
          character={character}
          onAttack={handleAttack}
          onFlee={handleFlee}
          log={battleLog}
        />
      </div>
    );
  }

  return (
    <div className="pb-20 px-4 max-w-lg mx-auto">
      <div className="pt-6 pb-4">
        <h2 className="text-lg font-bold text-white mb-1">Boss Encounters</h2>
        <p className="text-xs text-gray-500">
          Your power: {totalLevels} skill levels. Defeat bosses to unlock rewards.
        </p>
      </div>
      <div className="space-y-4">
        {BOSSES.map(boss => {
          const bossState = bosses.find(b => b.id === boss.id);
          if (!bossState) return null;
          return (
            <BossCard
              key={boss.id}
              boss={boss}
              bossState={bossState}
              onFight={handleFight}
              totalLevels={totalLevels}
            />
          );
        })}
      </div>
    </div>
  );
}
