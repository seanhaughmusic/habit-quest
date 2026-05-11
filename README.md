# Habit Quest

A habit-tracking RPG where your daily habits power your character. Log workouts, reading, meditation, and more to earn XP and level up 13 skills across four trees. Use your stats to fight progressively harder bosses in turn-based combat.

**Live at:** [github.com/seanhaughmusic/habit-quest](https://github.com/seanhaughmusic/habit-quest)

---

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

---

## How it works

1. **Create your hero** — enter a name on first launch
2. **Log daily habits** — tap a habit, enter minutes (or one-tap for flat XP habits)
3. **Watch your skills grow** — XP feeds into 13 skills across 4 trees
4. **Fight bosses** — use your stats in turn-based combat to defeat escalating enemies
5. **Earn gear** — defeated bosses drop items that boost your XP gains

All progress saves locally in your browser — no account needed.

---

## Skill trees

| Tree | Skills |
|---|---|
| **Body** | Strength, Endurance, Agility, Vitality |
| **Mind** | Focus, Knowledge, Wisdom |
| **Craft** | Artistry, Craft, Mastery |
| **Discipline** | Resolve, Consistency, Restraint |

---

## Habits

18 predefined habits mapped to skills:

| Habit | Skill | XP |
|---|---|---|
| Gym / Weights | Strength | 1 XP/min |
| Cardio | Endurance | 1 XP/min |
| Sport / Recreation | Agility | 1 XP/min |
| Stretching / Yoga | Vitality | 2 XP/min |
| Hit Daily Macros | Vitality | +50 flat |
| Slept 7+ Hours | Vitality | +40 flat |
| Deep Focus Work | Focus | 1 XP/min |
| Reading | Knowledge | 1 XP/min |
| Meditation / Journaling | Wisdom | 2 XP/min |
| Structured Learning | Knowledge | 1 XP/min |
| Music Practice | Artistry | 1 XP/min |
| Creative Work | Craft | 1 XP/min |
| Side Project Coding | Mastery | 1 XP/min |
| Cooking from Scratch | Craft | 1 XP/min |
| Zero Doomscroll Day | Resolve | +30 flat |
| Held a Hard Commitment | Resolve | +25 flat |
| Hit Sleep Schedule | Consistency | +20 flat |
| Said No to a Bad Habit | Restraint | +15 flat |

---

## Streak multipliers

| Streak | XP bonus |
|---|---|
| 3 days | +10% |
| 7 days | +25% |
| 14 days | +40% |
| 30 days | +60% |

---

## Leveling

- Each skill levels independently
- XP to reach level N: `N × 100` (100 for Lv1→2, 200 for Lv2→3, etc.)
- Character level = total skill levels ÷ 13
- HP = 100 + (Body levels × 5) + (Vitality × 10)
- MP = 50 + (Mind levels × 5) + (Wisdom × 10)

---

## Combat

Bosses have a **Power Check** — a minimum total skill level required to fight. Choose from 4 attack types each turn:

| Attack | Uses |
|---|---|
| Physical Strike | Strength + Endurance |
| Swift Attack | Agility + Resolve |
| Mental Strike | Focus + Knowledge |
| Wisdom Blast | Wisdom + Restraint |

Hitting a boss's weakness deals 1.5× damage. Defeat bosses to unlock rewards and the next encounter.

### Bosses (Act I)
1. **The Shade of Sloth** — Power Check: 15 levels
2. **The Doomscroll Wyrm** — Power Check: 35 levels
3. **The Plateau Titan** — Power Check: 60 levels

### Act II (unlocks after defeating Act I)
4. **The Hollow Chorus** — Power Check: 90 levels

---

## Tech stack

- [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- Browser `localStorage` for persistence (no backend)

---

## Roadmap

- [ ] User accounts / login
- [ ] Premium tier with monthly item drops
- [ ] Negative habit penalties
- [ ] More bosses (Act II full roster, Act III)
- [ ] Quest / milestone system
- [ ] Gear crafting
