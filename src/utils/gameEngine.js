export function xpToNextLevel(level) {
  return level * 100;
}

export function addXpToSkill(skillData, xpAmount) {
  let { level, xp } = skillData;
  const startLevel = level;
  xp += Math.floor(xpAmount);
  while (level < 50 && xp >= xpToNextLevel(level)) {
    xp -= xpToNextLevel(level);
    level++;
  }
  return { level, xp, leveledUp: level > startLevel, levelsGained: level - startLevel };
}

export function calcCharacterLevel(skills) {
  const totalLevels = Object.values(skills).reduce((sum, s) => sum + s.level, 0);
  return Math.max(1, Math.floor(totalLevels / 13));
}

export function calcTotalSkillLevels(skills) {
  return Object.values(skills).reduce((sum, s) => sum + s.level, 0);
}

export function calcMaxHp(skills) {
  const bodyLevels =
    skills.strength.level + skills.endurance.level + skills.agility.level + skills.vitality.level;
  return 100 + bodyLevels * 5 + skills.vitality.level * 10;
}

export function calcMaxMp(skills) {
  const mindLevels = skills.focus.level + skills.knowledge.level + skills.wisdom.level;
  return 50 + mindLevels * 5 + skills.wisdom.level * 10;
}

export function calcStreakMultiplier(streakCount) {
  if (streakCount >= 30) return 1.6;
  if (streakCount >= 14) return 1.4;
  if (streakCount >= 7) return 1.25;
  if (streakCount >= 3) return 1.1;
  return 1.0;
}

export function calcStreakLabel(count) {
  if (count >= 30) return '+60%';
  if (count >= 14) return '+40%';
  if (count >= 7) return '+25%';
  if (count >= 3) return '+10%';
  return null;
}

export function calcHabitXp(habit, value, streakCount, gear) {
  let base = habit.type === 'timed' ? habit.xpRate * value : habit.xpFlat;
  const multiplier = calcStreakMultiplier(streakCount);
  let xp = base * multiplier;

  if (gear) {
    if (gear.weapon?.id === 'mornings-edge') {
      const hour = new Date().getHours();
      if (hour < 12) xp *= 1.1;
    }
    if (gear.relic?.id === 'titans-core') {
      xp *= 1.1;
    }
    if (gear.relic?.id === 'mirror-shield' && (habit.skill === 'restraint' || habit.skill === 'wisdom')) {
      xp *= 1.15;
    }
    if (gear.relic?.id === 'chorus-silencer' && ['resolve', 'consistency', 'restraint'].includes(habit.skill)) {
      xp *= 1.2;
    }
  }

  return Math.floor(xp);
}

export function isSameDay(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function isYesterday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate()
  );
}

export function updateStreak(currentStreak, lastLoggedDate) {
  if (!lastLoggedDate) return 1;
  if (isSameDay(lastLoggedDate)) return currentStreak;
  if (isYesterday(lastLoggedDate)) return currentStreak + 1;
  return 1;
}

export function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}
