# Kingdom Uprise: AI Coding Guidelines

## Project Overview

A Phaser 3 2D tower defense / action game where players control a knight or archer to defend a castle from waves of enemies and bosses. The game features multiple scenes, Matter physics, wave-based spawning, and a pause/overlay system.

**Tech Stack:** Phaser 3 (v3.80.1), Matter Physics, Vanilla JavaScript (ES6 modules), Tilemap (Tiled JSON)

---

## Architecture

### Scene Flow

```
PreloaderScene → MenuScene → MainScene (+ HudScene, OverlayScene)
```

- **PreloaderScene**: Loads all assets (atlases, animations, audio, tilemaps)
- **MenuScene**: Player selection (knight/archer) → passes `playerType` to MainScene
- **MainScene**: Core gameplay loop - spawns waves, enemies, boss, handles collisions
- **HudScene**: Overlay UI (hp bar, abilities, cooldowns, wave counter) - runs parallel to MainScene
- **OverlayScene**: Modal dialogs (pause, gameOver, youWon, newWave notifications) - stops when done

### Critical Data Flow

1. **MainScene initialization** → sets up `waveNumber`, `enemyTotal`, `finalWave` vars
2. **startWave()** → calculates `enemiesToSpawn` (wave \* enemyTotal) and begins spawning
3. **spawnWaveEnemies()** → staggered spawning via `time.delayedCall(spawnIntervalTime)`
4. **Enemy/Boss defeated** → removed from `this.enemies` array
5. **Update loop detects** `enemies.length === 0` → triggers boss spawn or next wave

### Scene Communication

- **MainScene ↔ HudScene**: Shared reference via `this.scene.get('MainScene')` in HudScene
- **MainScene ↔ OverlayScene**: One-way via `scene.launch(data)` with `{ open: "type" }` param
- **MainScene ↔ Player**: Event-driven via collision detection (Matter world events)

---

## Key Patterns & Conventions

### Wave Spawning System (MainScene.js)

```javascript
// Wave scaling: each wave spawns (waveNumber * enemyTotal) enemies
// Wave 1: 1 * 5 = 5 enemies → boss
// Wave 2: 2 * 5 = 10 enemies → boss
// Wave N > finalWave: boss only (if archer) or 50 enemies (if knight)

startWave(); // Entry point - shows overlay, begins spawning
spawnWaveEnemies(); // Recursive - uses delayedCall for stagger
displayGameClearedMessage(); // Victory condition msg
```

**Important:** After ALL regular enemies cleared, automatically spawns boss. After boss defeated, starts next wave. Scene cleanup happens via `isOpen` flag reset.

### Physics Bodies (Matter)

All game entities extend `Phaser.Physics.Matter.Sprite`:

- **Player/Enemy/Boss**: Compound bodies with collider + sensor (see `createBody()`)
- **Castle**: Static body with sensor for detection
- **Tilemap collision**: `layer.setCollisionByProperty({collide:true})` + `convertTilemapLayer()`

**Label conventions**: `playerCollider`, `enemySensor`, `enemyCollider`, `castleSensor` - used in collision detection

### Asset Loading (PreloaderScene.js)

- **Atlas + Animation**: `load.atlas()` + `load.animation()` (separate JSON files from Aseprite exports)
- **Tilemap**: `load.tilemapTiledJSON()` loads from `asset/tiled/Scene/map1.json`
- **Tilesets**: Individual images, referenced by tilemap (see `allTilesets` array in MainScene)
- **Audio**: MP3/WAV in `asset/mp3/` (Music/ and sfx/ subdirs)

### OverlayScene Lifecycle (Critical Bug Pattern)

```javascript
// CORRECT: Stop scene before launching to reset isOpen flag
this.scene.stop("OverlayScene");
this.scene.launch("OverlayScene", { from: "MainScene", open: "newWave" });

// WRONG: Just launch() reuses stopped scene state
this.scene.launch("OverlayScene", { open: "pause" }); // Won't render second time

// Button actions:
// Resume/Play Again → scene.restart('MainScene')
// Quit → scene.start('MenuScene')
```

### HUD Updates (HudScene.js)

- **Update every frame** via polling `this.main.player` state
- **Health bar, cooldowns, exp**: Read current values from MainScene, redraw visual bars
- **Pause button**: Triggers `scene.pause()` + OverlayScene launch
- **No events**: HudScene doesn't use Phaser events, just reactive updates

---

## Common Development Tasks

### Adding a New Ability to Player

1. Initialize var in `Player.js` constructor (e.g., `this.canNewAbility = true`)
2. Add key binding in `spawnPlayer()`
3. Handle in `update()` with ability logic + cooldown
4. Add HUD display in `HudScene.drawSkillHUD()`

### Adjusting Wave Difficulty

- Edit `MainScene.spawnEnemy()`: `this.finalWave`, `this.finalWaveEnemies`, `this.spawnIntervalTime`
- Wave formula: enemies per wave = `waveNumber * this.enemyTotal` (increase multiplier for harder scaling)

### Adding New Enemy Type

1. Add sprite atlas + animation load in `PreloaderScene.js`
2. Create data object in `MainScene.enemyType` array with `type`, `texture`, `frame`, `target`
3. Create `Enemy` subclass if custom behavior (see `Enemy.js`)
4. Add preload in Enemy class

### Debugging Wave Spawning Issues

- Check console logs: `console.log(Wave X spawning Y enemies)`
- Verify `isSpawning` flag transitions
- Ensure `enemies.length === 0` detection in update loop
- OverlayScene cleanup: confirm `isOpen` resets in `init()`

---

## Asset Structure

```
asset/
  img/blue/          → Player (knight, archer) atlases
  img/red/           → Enemy atlases
  img/overlay/       → UI buttons, panels
  img/boss_orc_*     → Boss animation data
  tiled/Scene/       → Tilemap JSON (map1_embedded.json)
  tiled/Tileset/     → Tileset TSX references
  mp3/Music/         → Background music
  mp3/sfx/           → Attack, collision sounds
```

---

## Testing Checklist

- [ ] Player selection (knight/archer) persists to MainScene
- [ ] Wave progression: verify enemy count scales correctly
- [ ] Boss spawns after all regular enemies cleared
- [ ] Pause overlay: can open/close multiple times without freezing
- [ ] Victory condition: princess collision triggers youWon overlay
- [ ] Game restart: HudScene re-initializes without memory leaks
- [ ] Audio: in_game_sound loops, attack SFX don't overlap excessively

---

## Known Limitations & Technical Debt

- **OverlayScene scene cleanup**: Must call `scene.stop()` before `launch()` or overlay won't render (see Lifecycle section)
- **HudScene passive updates**: No event system; relies on update polling (consider events for scalability)
- **Pause state**: MainScene paused while OverlayScene runs; button callbacks must manage both scenes
