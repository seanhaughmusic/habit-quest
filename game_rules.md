# Game Rules — The Codex

This is the rulebook Cowork follows when running your game. Tune any number here and the game bends to match.

---

## 1. XP per habit

All XP is awarded to specific **skills**. Skills belong to one of four **trees**: Body, Mind, Craft, Discipline.

### Positive habits (Body)
| Habit | XP rate | Goes to |
|---|---|---|
| Weights / gym session | 1 XP / min | **Strength** |
| Cardio (run, cycle, row, swim) | 1 XP / min | **Endurance** |
| Sport / active recreation | 1 XP / min | **Agility** |
| Stretching / mobility / yoga | 2 XP / min | **Vitality** |
| Hit daily macros/nutrition target | +50 XP flat | **Vitality** |
| Slept 7+ hours | +40 XP flat | **Vitality** |

### Positive habits (Mind)
| Habit | XP rate | Goes to |
|---|---|---|
| Deep focus work (phone away, single task) | 1 XP / min | **Focus** |
| Reading (books, long-form, study) | 1 XP / min | **Knowledge** |
| Meditation / journaling / reflection | 2 XP / min | **Wisdom** |
| Language / course / structured learning | 1 XP / min | **Knowledge** |

### Positive habits (Craft)
| Habit | XP rate | Goes to |
|---|---|---|
| Music practice (instrument, theory, singing) | 1 XP / min | **Artistry** |
| Creative writing / drawing / design | 1 XP / min | **Craft** |
| Building a side project / coding for love | 1 XP / min | **Mastery** |
| Cooking from scratch | 1 XP / min | **Craft** |

### Positive habits (Discipline)
| Habit | XP | Goes to |
|---|---|---|
| Zero-doomscroll day | +30 XP | **Resolve** |
| Held a commitment that was hard | +25 XP | **Resolve** |
| Hit planned wake/sleep time | +20 XP | **Consistency** |
| Said no to a tempting bad habit | +15 XP | **Restraint** |

---

## 2. Negative habits (penalties)

| Habit | Effect |
|---|---|
| Doomscroll / passive social media | −15 XP Focus per hour **and** −10 HP per hour |
| Missed sleep (<6 hours) | −30 HP, −1 Vitality XP |
| Skipped planned workout | −10 XP Consistency |
| Broke a personal rule (self-declared) | −20 XP Resolve |

Penalties can take HP below zero — when that happens, you are **Fatigued** until you rest a full day (see below). While Fatigued: −25% XP on all gains and you can't engage a boss.

---

## 3. Leveling

**Skill leveling** — each skill levels independently.
- XP needed to reach level N from N-1: `N × 100`
- So: Lv1→2 needs 100 XP, Lv2→3 needs 200, Lv5→6 needs 500, etc.
- Max skill level: 50

**Character level** = floor of (sum of all skill levels ÷ 12).
You have 12 skills across the four trees, so character level tracks overall growth.

---

## 4. HP and MP

- **Max HP** = 100 + (total Body tree levels × 5) + (Vitality level × 10)
- **Max MP** = 50 + (total Mind tree levels × 5) + (Wisdom level × 10)

HP restores +30/day baseline, full restore on a "rest day" (deliberate recovery).
MP restores fully every morning.

HP matters for boss fights and for avoiding Fatigued status.

---

## 5. Streaks

Streaks stack multipliers. Tracked per habit.
- 3-day streak: +10% XP on that habit
- 7-day streak: +25% XP + **a gear drop** rolled from that skill's tier
- 14-day streak: +40% XP + a **rare** gear drop
- 30-day streak: +60% XP + a **legendary** relic
- Break the streak: multiplier resets to 0

Missing one day does NOT break the streak if flagged as a planned rest day.

---

## 6. Gear and equipment slots

Six equipment slots: **Head, Chest, Hands, Feet, Weapon, Relic**.

Each piece of gear provides modifiers — flat stat bonuses or XP multipliers on a specific skill. Only one item per slot can be equipped at a time.

Gear tiers: Common (white), Uncommon (green), Rare (blue), Epic (purple), Legendary (orange).

See `inventory.md` for current gear and `skill_trees.md` for drop pools.

---

## 7. Bosses

Bosses appear on a schedule (every 2-4 weeks) and are tuned ~15% above your current effective power. Each boss has:
- **HP** (what you have to "damage")
- **Power Check** (a stat threshold you must meet)
- **Gate** (a real-world condition to unlock the fight — e.g. "7-day streak on 2 habits")
- **Reward** on defeat

Fighting a boss is narrative + dice. Cowork rolls your stats vs. the boss and writes the encounter. You don't fight until you've met the Gate.

Failing a boss doesn't delete progress — it triggers a short side quest to regroup.

See `bosses.md` for the full roster.

---

## 8. Quests and milestones

Running goals tracked in `quest_log.md`:
- **Streak quests** (auto-generated for active habits)
- **Milestone quests** (lifetime totals — e.g. "500 minutes of reading")
- **Story quests** (tied to boss chapters)

Completing a quest grants bonus XP, gear, or unlocks new subtrees.

---

## 9. Daily check-in format

You can message anything Cowork can parse. Examples that work well:

> "gym 45, cycle 30, read 30m, deep work 5h, macros hit, music 30, doomscroll ~1h"

> "rest day today — just stretched 15m and slept 8h"

> "terrible day, skipped workout, scrolled 3hrs, ate garbage"

Don't stress precision. Rough minutes are fine. You can also declare "rest day" to protect streaks.
