import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';
import { DEFAULT_SKILLS } from '../data/skills';
import { BOSSES } from '../data/bosses';
import {
  addXpToSkill,
  calcMaxHp,
  calcMaxMp,
  calcHabitXp,
  updateStreak,
  isSameDay,
  todayKey,
} from '../utils/gameEngine';

const DEFAULT_STATE = {
  character: {
    name: '',
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    skills: DEFAULT_SKILLS,
    inventory: [],
    gear: {},
  },
  habits: {
    streaks: {},
    todayLog: {},
    lastLogDate: null,
  },
  bosses: BOSSES.map((b, i) => ({
    id: b.id,
    defeated: false,
    unlocked: i === 0,
    currentHp: b.hp,
  })),
  notifications: [],
  onboarded: false,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'ONBOARD': {
      const { name } = action;
      return {
        ...state,
        onboarded: true,
        character: { ...state.character, name },
      };
    }

    case 'LOG_HABIT': {
      const { habit, value } = action;
      const streakKey = habit.id;
      const currentStreak = state.habits.streaks[streakKey] || 0;
      const lastDate = state.habits.streaks[`${streakKey}_lastDate`] || null;

      if (isSameDay(lastDate) && state.habits.todayLog[habit.id]) {
        return state;
      }

      const newStreak = updateStreak(currentStreak, lastDate);
      const xpAmount = calcHabitXp(habit, value, newStreak, state.character.gear);

      const updatedSkill = addXpToSkill(state.character.skills[habit.skill], xpAmount);
      const newSkills = { ...state.character.skills, [habit.skill]: updatedSkill };
      const newMaxHp = calcMaxHp(newSkills);
      const newMaxMp = calcMaxMp(newSkills);
      const hpDelta = newMaxHp - state.character.maxHp;

      const notifications = [];
      if (updatedSkill.leveledUp) {
        notifications.push({
          id: Date.now(),
          type: 'levelup',
          message: `${habit.skill.charAt(0).toUpperCase() + habit.skill.slice(1)} reached Level ${updatedSkill.level}!`,
        });
      }
      notifications.push({
        id: Date.now() + 1,
        type: 'xp',
        message: `+${xpAmount} ${habit.skill.charAt(0).toUpperCase() + habit.skill.slice(1)} XP`,
      });

      const now = new Date().toISOString();
      return {
        ...state,
        character: {
          ...state.character,
          skills: newSkills,
          maxHp: newMaxHp,
          maxMp: newMaxMp,
          hp: Math.min(state.character.hp + hpDelta, newMaxHp),
        },
        habits: {
          ...state.habits,
          streaks: {
            ...state.habits.streaks,
            [streakKey]: newStreak,
            [`${streakKey}_lastDate`]: now,
          },
          todayLog: {
            ...state.habits.todayLog,
            [habit.id]: { value, xp: xpAmount, timestamp: now },
          },
          lastLogDate: now,
        },
        notifications: [...state.notifications, ...notifications],
      };
    }

    case 'BOSS_DAMAGE': {
      const { bossId, playerDamage, bossDamage } = action;
      const newBosses = state.bosses.map(b => {
        if (b.id !== bossId) return b;
        return { ...b, currentHp: Math.max(0, b.currentHp - playerDamage) };
      });
      const newHp = Math.max(0, state.character.hp - bossDamage);
      return {
        ...state,
        character: { ...state.character, hp: newHp },
        bosses: newBosses,
      };
    }

    case 'DEFEAT_BOSS': {
      const { bossId, reward } = action;
      const bossIndex = BOSSES.findIndex(b => b.id === bossId);
      const newBosses = state.bosses.map((b, i) => {
        if (b.id === bossId) return { ...b, defeated: true, currentHp: 0 };
        if (i === bossIndex + 1) return { ...b, unlocked: true };
        return b;
      });
      const newInventory = [...state.character.inventory];
      if (reward && !newInventory.find(i => i.id === reward.id)) {
        newInventory.push(reward);
      }
      const newGear = reward
        ? { ...state.character.gear, [reward.slot]: reward }
        : state.character.gear;
      return {
        ...state,
        character: { ...state.character, inventory: newInventory, gear: newGear },
        bosses: newBosses,
        notifications: [
          ...state.notifications,
          { id: Date.now(), type: 'reward', message: `Obtained: ${reward?.name}!` },
        ],
      };
    }

    case 'RESET_BOSS_HP': {
      const { bossId } = action;
      const boss = BOSSES.find(b => b.id === bossId);
      return {
        ...state,
        bosses: state.bosses.map(b =>
          b.id === bossId ? { ...b, currentHp: boss.maxHp } : b
        ),
        character: {
          ...state.character,
          hp: state.character.maxHp,
        },
      };
    }

    case 'RESTORE_HP': {
      return {
        ...state,
        character: {
          ...state.character,
          hp: Math.min(state.character.hp + action.amount, state.character.maxHp),
        },
      };
    }

    case 'DISMISS_NOTIFICATION': {
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.id),
      };
    }

    case 'RESET_DAY': {
      return {
        ...state,
        habits: { ...state.habits, todayLog: {} },
      };
    }

    case 'EQUIP_ITEM': {
      const { item } = action;
      return {
        ...state,
        character: { ...state.character, gear: { ...state.character.gear, [item.slot]: item } },
      };
    }

    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, DEFAULT_STATE, (init) => {
    const saved = loadState();
    if (!saved) return init;
    return {
      ...init,
      ...saved,
      bosses: init.bosses.map(defaultBoss => {
        const saved_ = saved.bosses?.find(b => b.id === defaultBoss.id);
        return saved_ ? saved_ : defaultBoss;
      }),
      notifications: [],
    };
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const today = todayKey();
    const lastKey = state.habits.lastLogDate
      ? (() => {
          const d = new Date(state.habits.lastLogDate);
          return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        })()
      : null;
    if (lastKey && lastKey !== today && Object.keys(state.habits.todayLog).length > 0) {
      dispatch({ type: 'RESET_DAY' });
    }
  }, []);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}
