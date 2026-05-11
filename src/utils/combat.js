const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const ATTACK_TYPES = [
  {
    id: 'physical',
    name: 'Physical Strike',
    icon: '⚔️',
    description: 'Strength + Endurance',
    skills: ['strength', 'endurance'],
    color: '#ef4444',
  },
  {
    id: 'swift',
    name: 'Swift Attack',
    icon: '⚡',
    description: 'Agility + Resolve',
    skills: ['agility', 'resolve'],
    color: '#eab308',
  },
  {
    id: 'mental',
    name: 'Mental Strike',
    icon: '🔮',
    description: 'Focus + Knowledge',
    skills: ['focus', 'knowledge'],
    color: '#3b82f6',
  },
  {
    id: 'wise',
    name: 'Wisdom Blast',
    icon: '✨',
    description: 'Wisdom + Restraint',
    skills: ['wisdom', 'restraint'],
    color: '#a855f7',
  },
];

export function calcPlayerDamage(attackType, skills) {
  const s = skills;
  const r = rand(1, 10);
  switch (attackType) {
    case 'physical':
      return Math.max(1, Math.floor(s.strength.level * 5 + s.endurance.level * 2 + r));
    case 'swift':
      return Math.max(1, Math.floor(s.agility.level * 4 + s.resolve.level * 3 + r));
    case 'mental':
      return Math.max(1, Math.floor(s.focus.level * 4 + s.knowledge.level * 3 + r));
    case 'wise':
      return Math.max(1, Math.floor(s.wisdom.level * 5 + s.restraint.level * 2 + r));
    default:
      return Math.max(1, 5 + r);
  }
}

export function calcBossAttack(boss) {
  return Math.max(1, boss.attack + rand(-4, 4));
}

export function calcPlayerDefense(skills) {
  return Math.floor(skills.endurance.level * 2 + skills.vitality.level * 2);
}

export function isWeaknessHit(attackType, boss) {
  const attackSkills = ATTACK_TYPES.find(a => a.id === attackType)?.skills ?? [];
  return attackSkills.some(skill => boss.weaknesses.includes(skill));
}

export function calcPlayerMaxHp(skills) {
  const bodyLevels =
    skills.strength.level + skills.endurance.level + skills.agility.level + skills.vitality.level;
  return 100 + bodyLevels * 5 + skills.vitality.level * 10;
}

export function resolveTurn(attackType, skills, bossHp, boss) {
  const baseDamage = calcPlayerDamage(attackType, skills);
  const weak = isWeaknessHit(attackType, boss);
  const playerDamage = weak ? Math.floor(baseDamage * 1.5) : baseDamage;

  const defense = calcPlayerDefense(skills);
  const bossRawAttack = calcBossAttack(boss);
  const bossDamage = Math.max(1, bossRawAttack - defense);

  const newBossHp = Math.max(0, bossHp - playerDamage);

  return {
    playerDamage,
    bossDamage,
    weaknessHit: weak,
    newBossHp,
  };
}
