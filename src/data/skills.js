export const SKILL_TREES = {
  Body: { color: '#ef4444', icon: '⚔️' },
  Mind: { color: '#3b82f6', icon: '🔮' },
  Craft: { color: '#a855f7', icon: '⚒️' },
  Discipline: { color: '#14b8a6', icon: '🛡️' },
};

export const SKILLS = {
  strength:    { name: 'Strength',    tree: 'Body',       color: '#ef4444', icon: '💪' },
  endurance:   { name: 'Endurance',   tree: 'Body',       color: '#f97316', icon: '🏃' },
  agility:     { name: 'Agility',     tree: 'Body',       color: '#eab308', icon: '⚡' },
  vitality:    { name: 'Vitality',    tree: 'Body',       color: '#22c55e', icon: '❤️' },
  focus:       { name: 'Focus',       tree: 'Mind',       color: '#3b82f6', icon: '🎯' },
  knowledge:   { name: 'Knowledge',   tree: 'Mind',       color: '#8b5cf6', icon: '📚' },
  wisdom:      { name: 'Wisdom',      tree: 'Mind',       color: '#6366f1', icon: '🔮' },
  artistry:    { name: 'Artistry',    tree: 'Craft',      color: '#ec4899', icon: '🎨' },
  craft:       { name: 'Craft',       tree: 'Craft',      color: '#f43f5e', icon: '🔨' },
  mastery:     { name: 'Mastery',     tree: 'Craft',      color: '#a855f7', icon: '✨' },
  resolve:     { name: 'Resolve',     tree: 'Discipline', color: '#14b8a6', icon: '🛡️' },
  consistency: { name: 'Consistency', tree: 'Discipline', color: '#06b6d4', icon: '🔗' },
  restraint:   { name: 'Restraint',   tree: 'Discipline', color: '#0ea5e9', icon: '⚖️' },
};

export const DEFAULT_SKILLS = Object.fromEntries(
  Object.keys(SKILLS).map(k => [k, { level: 1, xp: 0 }])
);
