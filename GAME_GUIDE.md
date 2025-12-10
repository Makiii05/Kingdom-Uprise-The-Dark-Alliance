# Kingdom Uprise: Game Features & Mechanics

## GAME OVERVIEW

Kingdom Uprise is a 2D tower defense action game where players defend their castle from waves of enemies while searching for the Princess in a mysterious barren island.

---

## GAME GOAL

1. **Survive Wave-Based Battles**: Defeat 5 waves of progressively harder enemies
2. **Protect the Castle**: Keep your castle from being destroyed (50 HP)
3. **Complete Boss Fights**: Face a powerful Orc Boss after each wave
4. **Save the Princess**: After clearing all waves, reach the barren island to save the princess and win!

---

## CHARACTER SELECTION

### ⚔️ KNIGHT

**Stats:**

- HP: 10
- Damage: 2
- Speed: 3
- Attack Range: Medium melee range (~60 units, extends with Goliath)

**Attack Style:**

- Space bar to slash enemies in front
- Can hit multiple enemies in one swing
- Fast attack animation
- Best for close combat and sustained damage

**Advantages:**

- More health (durability)
- AoE attacks hit multiple enemies
- Good for beginners

---

### 🏹 ARCHER

**Stats:**

- HP: 7
- Damage: 4 per arrow
- Speed: 4
- Attack Range: Long-range projectile

**Attack Style:**

- Click and hold mouse to shoot arrows continuously
- Arrows travel in a straight line
- Higher single-target damage
- Can attack while moving
- Best for kiting and staying safe

**Advantages:**

- Higher damage output
- Attack from range
- Can position safely away from enemies
- Arrows pierce through single targets (except bosses)

---

## CORE MECHANICS

### 👥 LIVES SYSTEM

- Start with 3 lives
- Lose 1 life when HP reaches 0
- Respawn at starting position with full HP
- Game Over when all 3 lives are lost

### 🛡️ CASTLE

- Located at center of map
- Has 50 HP
- Takes damage from enemies that reach it
- If castle HP reaches 0, the game restarts
- Indicated by health bar above the castle

### 🌊 WAVE SYSTEM

**Waves 1-5:**

- Each wave spawns increasing numbers of enemies

  - Wave 1: 5 enemies → Boss
  - Wave 2: 10 enemies → Boss
  - Wave 3: 15 enemies → Boss
  - Wave 4: 20 enemies → Boss
  - Wave 5: 25 enemies → Boss

- All enemies of a wave must be defeated before the boss spawns
- Boss must be defeated to progress to next wave

**Wave 6+ (Final Rounds):**

- Knight: Spawns 50 enemies in a mega wave
- Archer: Fights boss only

### 👾 ENEMIES

**Red Knight Enemy**

- HP: 3
- Damage: 1 per attack
- Attack Speed: Every 1.5 seconds
- Targets: Player or Castle (whichever is closer)
- Behavior: Walks toward target, attacks when close (50 unit range)

**Goblin Enemy**

- HP: 1 (dies in 1 hit from most attacks)
- Damage: 0.5 per attack
- Attack Speed: Every 1.5 seconds
- Targets: Player or Castle
- Behavior: Walks toward target, attacks when close

### 👹 BOSS (Orc Boss)

- HP: 40 (high health!)
- Damage: 0.5 per hit (multiple hits over time)
- Attack Range: 192 units (long range!)
- Attack Speed: Every 7 seconds
- Size: 2.7x normal size
- Special: Spawns after all regular enemies defeated
- Strategy: Use Attack Speed ability, kite with Dash, use Goliath when ready

---

## COMBAT CONTROLS

### Movement

- **W** - Move Up
- **A** - Move Left
- **S** - Move Down
- **D** - Move Right
- Character faces the direction of movement

### Attack

**Knight:**

- **SPACE** - Melee attack in current facing direction
- Attacks with sword in a cone shape
- Can hit multiple enemies at once

**Archer:**

- **LEFT CLICK** - Shoot arrow toward mouse cursor
- Hold down to continuously fire arrows
- Aim with mouse position
- Can shoot while moving

---

## SPECIAL ABILITIES

All abilities are on cooldown timers. Check HUD for cooldown status!

### ⚡ Q - DASH ABILITY

**Cooldown:** 2 seconds
**Duration:** 300ms
**Features:**

- Quickly move in held direction (or last faced direction)
- Provides invulnerability during dash
- Visual effect: Cyan tint
- Use to: Dodge enemy attacks, reposition quickly
- Movement: 100 units/second

### 🔥 E - ATTACK SPEED ABILITY

**Cooldown:** 14 seconds
**Duration:** 5 seconds
**Features:**

- Knight: Attack speed increases 4x (48 → 96 frameRate)
- Archer: Attack speed increases 4x (24 → 96 frameRate)
- Visual effect: Magenta tint
- Use to: Burst damage enemies, clear waves faster
- Perfect for: Boss fights, emergency damage

### 💪 C - GOLIATH ABILITY

**Cooldown:** 30 seconds
**Duration:** 5 seconds
**Features:**

- Grow 2.7x larger
- Damage increases 2.7x
- Attack range increases dramatically (melee range extends to ~150 units)
- Arrows grow larger and faster
- Visual effect: Yellow tint
- Use to: Massive area damage, crowd control
- Perfect for: Large groups of enemies, phase changes

---

## BUILDING & TOWERS

### Tower Building System

- **How to Unlock:** Fill your EXP bar by defeating enemies
- **How to Build:** Press **B** key to enter BUILD mode
- Cursor changes to indicate build mode
- Click on unbuilt towers to place archers

### Tower Archers

- Auto-target nearby enemies
- Continuously shoot arrows at closest enemy
- Range: Approximately 500 units
- Damage: 4 per arrow (same as player archer)
- Cannot be damaged by enemies
- Visual: Blue archer sprite on tower

### Strategy Tips:

- Place archers near castle for defense
- Use towers to deal extra damage to bosses
- Build early to have help during waves
- Max 4 towers can be built throughout the map

---

## HUD (HEADS-UP DISPLAY)

**Top-Left:**

- Player portrait (Knight or Archer)
- Current HP bar
- Player lives remaining (×3)

**Bottom-Left:**

- 3 ability icons with cooldown timers
- EXP bar (blue) - fills as you defeat enemies
- Ready Ability Bar (glowing) - appears when EXP is full and build mode available

**Bottom-Right:**

- Wave counter (current wave / total waves)
- Enemy count (enemies remaining in wave)
- Boss indicator (when boss is spawned)

---

## VICTORY CONDITIONS

### Win Condition:

1. Defeat all 5 waves and their bosses
2. See "All waves cleared" message
3. Travel to the barren island (far east of map)
4. Reach the Princess location
5. Enjoy the "YOU WON!" screen

### Lose Condition:

- Lose all 3 lives
- Game Over screen appears
- Restart from MenuScene

---

## PROGRESSION & DIFFICULTY

- **Wave 1:** 5 enemies + 1 boss (easiest)
- **Wave 2:** 10 enemies + 1 boss (moderate)
- **Wave 3:** 15 enemies + 1 boss (challenging)
- **Wave 4:** 20 enemies + 1 boss (hard)
- **Wave 5:** 25 enemies + 1 boss (very hard)
- **Waves 6+:** Boss only or massive horde (extreme)

Difficulty scales through:

- More enemies per wave
- Stronger enemy types (goblins + knights mix)
- Boss fights testing your abilities
- Limited healing (no pickups)

---

## PRO TIPS & STRATEGIES

### Survival Tips:

1. **Use DASH constantly** to avoid damage
2. **Keep moving** - never stand still against bosses
3. **Build towers early** - they help throughout the game
4. **Save ults for bosses** - Attack Speed + Goliath combo destroys bosses
5. **Group enemies** - When possible, let enemies bunch up for AoE attacks

### Combat Strategy:

- **Kiting:** Keep moving while attacking (Archer specialty)
- **Zoning:** Stay away from enemies using DASH and movement
- **Burst Damage:** Use Attack Speed for emergency clearing
- **Area Control:** Use Goliath when surrounded
- **Boss Tactics:** Attack Speed → Goliath combo = massive damage burst

### Map Knowledge:

- Castle is at center
- Multiple spawn points on edges
- Barren Island is far east (where princess is)
- Tower locations are pre-set (you just activate them)
- Use map layout to kite and avoid hits

### Resource Management:

- EXP earned from each enemy killed
- 5 EXP per enemy defeated
- 100 EXP needed to unlock build mode
- Build towers strategically (max 4)
- Tower damage helps against bosses

---

## GAME RULES

1. Enemies always target closest entity (player or castle)
2. Enemies stop moving when close enough to attack
3. Projectiles (arrows) disappear after 2 seconds
4. Dash provides invulnerability during movement
5. Goliath extends attack range significantly
6. Towers auto-attack without player control
7. Music loops throughout gameplay
8. Pause menu available anytime during game

---

## PAUSE & MENU

- **Pause Button:** Settings icon in bottom-right of HUD
- Pauses MainScene and HudScene
- Opens OverlayScene with options:

  - **Resume:** Unpause and continue
  - **Quit:** Return to main menu

- **Game Over:** Automatically triggered when you lose all lives

  - **Restart:** Try again from wave 1
  - **Quit:** Return to main menu

- **You Won:** Triggered when you reach the princess
  - **Play Again:** Restart from wave 1
  - **Quit:** Return to main menu

---

## AUDIO

- **Background Music:** Loops throughout gameplay
- **Attack SFX:** Sword/arrow impact sounds
- **Ability SFX:** Power-up sounds when using abilities
- **Boss SFX:** Special sounds for boss attacks

---

Good luck, hero! The kingdom's fate depends on you!
