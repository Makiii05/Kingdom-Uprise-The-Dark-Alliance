import Boss from "./Boss.js"
import Castle from "./Castle.js";
import Enemy from "./Enemy.js"
import Player from "./Player.js"
import Tower from "./Tower.js";

export default class MainScene extends Phaser.Scene {
    constructor(){
        super("MainScene")
    }

    init(data) {
        this.playerType = data.playerType;
    }

    create() {
        this.scene.launch('HudScene'); 
        this.scene.bringToTop('HudScene');
        this.handleAnimation()
        this.drawTileMap()
        this.spawnPlayer()
        this.spawnCastle()
        this.spawnEnemy();
        this.spawnCave()
        this.createTower(155, 325);
        this.createTower(350, 80);
        this.createTower(925, 80);
        this.createTower(1180, 200);
        this.main_sound = this.sound.add("in_game_sound", {
            loop: true
        })
        this.main_sound.play()
    }

    drawTileMap() {
        const map = this.make.tilemap({key:'map'})

        const bridge = map.addTilesetImage('Bridge_All', 'Bridge_All')
        const castle = map.addTilesetImage('Castle_Destroyed', 'Castle_Destroyed')
        const foam = map.addTilesetImage('Foam', 'Foam')
        const grass = map.addTilesetImage('GrassTileSet', 'GrassTileSet')
        const ground = map.addTilesetImage('GroundTileSet', 'GroundTileSet')
        const rocks1 = map.addTilesetImage('Rocks_01', 'Rocks_01')
        const rocks2 = map.addTilesetImage('Rocks_02', 'Rocks_02')
        const rocks3 = map.addTilesetImage('Rocks_03', 'Rocks_03')
        const rocks4 = map.addTilesetImage('Rocks_04', 'Rocks_04')
        const shadows = map.addTilesetImage('ShadowsTileSet', 'ShadowsTileSet')
        const water = map.addTilesetImage('Water', 'Water')
        const house = map.addTilesetImage('House_Blue', 'House_Blue')
        const tower = map.addTilesetImage('Tower_Blue', 'Tower_Blue')
        const destroyed = map.addTilesetImage('Tower_Destroyed', 'Tower_Destroyed')
        const tree = map.addTilesetImage('Tree', 'Tree')
        const sheep = map.addTilesetImage('HappySheep_All', 'HappySheep_All')
        const towerC = map.addTilesetImage('Tower_Construction', 'Tower_Construction')
        const bossChamber = map.addTilesetImage('boss_chamber', 'boss_chamber')

        const allTilesets = [
            bridge, castle, foam, grass, ground, rocks1, rocks2, rocks3, rocks4,
            shadows, water, house, tower, destroyed, tree, sheep, towerC, bossChamber
        ]

        const animatedTileLayer = {
            'Foam1_bottom': true, 
            'Foam1_top': true, 
            'Building_bottom': true, 
            'Building_top': true
        }

        const layerNames = [
            'Water', 'Foam1_bottom', 'Foam1_top', 'Grass1', 'Bridge', 'Shadow1_bottom', 
            'Shadow1_top', 'Ground1', 'Main', 'Shadow2_bottom', 'Shadow2_top', 'Ground2', 
            'Grass3', 'Castle', 'Building_bottom', 'Building_top', 'Collision'
        ]

        const scale = 1
        layerNames.forEach(layerName => {
            const layer = map.createLayer(layerName, allTilesets, -1375, -1000)
            if (layer) {
                layer.setScale(scale)
                
                if(animatedTileLayer[layerName]){
                    this.setupTileAnimation(map, layer);
                }
                
                if(layerName == "Collision"){
                    layer.setCollisionByProperty({collide:true})
                    layer.setVisible(false)
                    this.matter.world.convertTilemapLayer(layer)
                }
            }
        })
    }

    setupTileAnimation(map, layer) {
        const animatedTiles = [];
        map.tilesets.forEach(tileset => {
            if (tileset.tileData) {
                Object.keys(tileset.tileData).forEach(tileId => {
                    const tileData = tileset.tileData[tileId];
                    if (tileData && tileData.animation) {
                        animatedTiles.push({
                            firstGid: tileset.firstgid,
                            tileId: parseInt(tileId),
                            gid: tileset.firstgid + parseInt(tileId),
                            animation: tileData.animation
                        });
                    }
                });
            }
        });

        if (animatedTiles.length > 0) {
            const tileAnimations = new Map();
            
            layer.forEachTile(tile => {
                if (tile.index !== -1) {
                    const animData = animatedTiles.find(at => at.gid === tile.index);
                    if (animData) {
                        const key = `${tile.x}_${tile.y}`;
                        tileAnimations.set(key, {
                            tile: tile,
                            frames: animData.animation,
                            currentFrame: 0,
                            elapsed: 0,
                            firstGid: animData.firstGid
                        });
                    }
                }
            });

            if (tileAnimations.size > 0) {
                if (!this.tileAnimationStates) {
                    this.tileAnimationStates = [];
                }
                this.tileAnimationStates.push({ layer, tileAnimations });
            }
        }
    }

    spawnPlayer(){
        if (this.playerType === 'knight') {
            this.player = new Player({scene:this, x:this.cameras.main.centerX, y:this.cameras.main.centerY + 20, texture:'blue_knight', frame:'idle_0', type: 'knight'})
        } else {
            this.player = new Player({scene:this, x:this.cameras.main.centerX, y:this.cameras.main.centerY + 20, texture:'blue_archer', frame:'idle_0', type: 'archer'})
        }

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            q: Phaser.Input.Keyboard.KeyCodes.Q,
            e: Phaser.Input.Keyboard.KeyCodes.E,
            c: Phaser.Input.Keyboard.KeyCodes.C,
            b: Phaser.Input.Keyboard.KeyCodes.B
        })
    }

    spawnCastle(){
        this.castle = new Castle({scene:this, x:this.cameras.main.centerX, y:this.cameras.main.centerY - 140, texture:'Castle_Blue'})
    }

    spawnEnemy() {
        this.enemies = [];
        this.enemyType = [{
                type: 'red_knight', 
                texture: 'red_knight',
                frame: 'idle_0',
                target: this.player
            },{
                type: 'goblin', 
                texture: 'goblin',
                frame: 'goblin_idle_0',
                target: this.player
            },{
                type: 'red_knight', 
                texture: 'red_knight',
                frame: 'idle_0',
                target: this.castle
            },{
                type: 'goblin', 
                texture: 'goblin',
                frame: 'goblin_idle_0',
                target: this.castle
            }
        ]
        this.spawnPoints = [
            { x: 47, y: 773 }, { x: 73, y: 823 }, { x: 118, y: 828 }, { x: 160, y: 834 }, { x: 200, y: 893 }, { x: 147, y: 970 }, 
            { x: 152, y: 1033 }, { x: 192, y: 1042 }, { x: 257, y: 977 }, { x: 340, y: 1000 }, { x: 306, y: 1054 }, { x: 457, y: 1053 }, 
            { x: 444, y: 990 }, { x: 659, y: 1039 }, { x: 634, y: 1054 }, { x: 650, y: 992 }, { x: 758, y: 995 }, { x: 775, y: 1038 }, 
            { x: 883, y: 1038 }, { x: 863, y: 971 }, { x: 943, y: 955 }, { x: 1010, y: 1006 }, { x: 988, y: 1051 }, { x: 1043, y: 1098 }, 
            { x: 1016, y: 1141 }, { x: 1099, y: 1123 }, { x: 1124, y: 1161 }, { x: 1122, y: 1255 }, { x: 1104, y: 1291 }, { x: 1115, y: 1194 }, 
            { x: 1106, y: 1089 }, { x: 1149, y: 1021 }, { x: 1218, y: 1023 }, { x: 1293, y: 985 }, { x: 1355, y: 1004 }, { x: 1433, y: 962 }, 
            { x: 1508, y: 993 }, { x: 1554, y: 1052 }, { x: 1557, y: 1149 }, { x: 1546, y: 1201 }, { x: 1675, y: 1209 }, { x: 1729, y: 1244 }, 
            { x: 1766, y: 1183 }, { x: 1856, y: 1181 }, { x: 1870, y: 1109 }, { x: 1920, y: 1064 }, { x: 2019, y: 1062 }, { x: 2080, y: 1094 }, 
            { x: 2154, y: 1121 }, { x: 2239, y: 1076 }, { x: 2207, y: 1021 }, { x: 2145, y: 1028 }, { x: 2129, y: 959 }, { x: 2211, y: 886 }, 
            { x: 2242, y: 827 }, { x: 2203, y: 770 }, { x: 2167, y: 776 }, { x: 2131, y: 799 }, { x: 2100, y: 696 }, { x: 2133, y: 626 }, 
            { x: 2235, y: 574 }, { x: 2196, y: 518 }, { x: 2145, y: 579 }, { x: 2165, y: 438 }, { x: 2183, y: 383 }, { x: 2129, y: 399 }, 
            { x: 2085, y: 431 }, { x: 2016, y: 392 }, { x: 1958, y: 378 }, { x: 1890, y: 395 }, { x: 1845, y: 328 }, { x: 1755, y: 342 }, 
            { x: 1752, y: 416 }, { x: 1844, y: 470 }, { x: 1939, y: 564 }, { x: 1992, y: 603 }, { x: 2030, y: 661 }, { x: 2034, y: 726 }, 
            { x: 2026, y: 790 }, { x: 1943, y: 806 }, { x: 1919, y: 681 }, { x: 2000, y: 855 }, { x: 1976, y: 954 }, { x: 1839, y: 948 }, 
            { x: 1758, y: 1037 }, { x: 1830, y: 1067 }, { x: 1592, y: 1017 }, { x: 1508, y: 951 }, { x: 1419, y: 912 }
        ]
        
        this.waveNumber = 1;
        this.enemyTotal = 10;
        this.isSpawning = false;
        this.bossSpawned = false;
        this.gameOver = false;
        this.spawnIntervalTime = 1000;
        this.finalWave = 10;
        this.finalWaveBosses = 10;
        this.finalWaveEnemies = 20;
        
        this.startWave();
    }

    startWave() {
        if (this.waveNumber > this.finalWave) {
            if(this.playerType === 'knight'){
                console.log("Wave > 5: Final Round - Spawning many enemies");
                this.scene.stop('OverlayScene');
                this.scene.launch('OverlayScene', { from: 'MainScene', open: "finalRound" });
                this.enemyTotal = this.finalWaveEnemies;
                this.spawnIntervalTime = 10;
            } else {
                console.log("Wave > 5: Final Round - Spawning 10 Bosses");
                this.scene.stop('OverlayScene');
                this.scene.launch('OverlayScene', { from: 'MainScene', open: "finalRound" });
                for (let i = 0; i < this.finalWaveBosses; i++) {
                    this.spawnBoss();
                }
                return;
            }
        }

        const enemiesToSpawn = this.waveNumber * this.enemyTotal;
        this.scene.stop('OverlayScene');
        this.scene.launch('OverlayScene', { from: 'MainScene', open: "newWave" });
        console.log(`Starting Wave ${this.waveNumber}: Spawning ${enemiesToSpawn} enemies`);
        
        this.isSpawning = true;
        this.enemiesInWave = enemiesToSpawn;
        this.spawnedCount = 0;
        
        this.spawnWaveEnemies();
    }

    spawnWaveEnemies() {
        if (this.spawnedCount < this.enemiesInWave) {
            const spawnPoint = Phaser.Utils.Array.GetRandom(this.spawnPoints);
            const enemyType = Phaser.Utils.Array.GetRandom(this.enemyType);
            const enemy = new Enemy({
                scene: this, 
                x: spawnPoint.x, 
                y: spawnPoint.y, 
                texture: enemyType.texture, 
                frame: enemyType.frame, 
                target: enemyType.target, 
                type: enemyType.type
            });
            this.enemies.push(enemy);
            this.spawnedCount++;
            
            this.time.delayedCall(this.spawnIntervalTime, () => {
                this.spawnWaveEnemies();
            });
        } else {
            this.isSpawning = false;
            this.bossSpawned = false;
        }
    }

    spawnBoss() {
        console.log(`Spawning Boss for Wave ${this.waveNumber}`);
        const spawnPoint = Phaser.Utils.Array.GetRandom(this.spawnPoints);
        const boss = new Boss({
            scene: this, 
            x: spawnPoint.x, 
            y: spawnPoint.y, 
            texture: 'boss_orc', 
            frame: 'tile000', 
            target: this.player, 
            type: 'boss_orc'
        });
        this.enemies.push(boss);
        this.bossSpawned = true;
    }

    createTower(x, y) {
        const newTower = new Tower(this, x, y, 'Tower_Construction');
        if (!this.towers) {
            this.towers = [];
            this.tower_archers = []
        }
        this.towers.push(newTower);
    }

    spawnCave() {
        // Cave body
        this.cave = this.matter.add.rectangle(5760, 1550, 200, 200, {
            isSensor: false,
            isStatic: true
        });

        // Princess sprite with Matter body
        this.princess = this.matter.add.sprite(8730, -700, 'princess_anim')
            .setBody({ type: 'rectangle', width: 32, height: 66 })
            .setSensor(false)
            .setStatic(true);

        // Make sure the BODY has the label
        this.princess.body.label = "princess";

        this.princess.anims.play('princess_idle').setScale(0.8);

        // Collision detection
        this.matter.world.on('collisionstart', (event) => {
            event.pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;

                if ((bodyA === this.cave && bodyB.label === 'playerCollider') ||
                    (bodyB === this.cave && bodyA.label === 'playerCollider')) {
                    this.player.setPosition(7750, 1200);
                }else 
                if ((bodyA.label === "princess" && bodyB.label === 'playerCollider') ||
                        (bodyB.label === "princess" && bodyA.label === 'playerCollider')) {
                    this.scene.pause();
                    this.scene.stop('OverlayScene');
                    this.scene.launch('OverlayScene', { from: 'MainScene', open: "youWon" });
                }
            });
        });
    }

    handleAnimation (){
        if(!this.anims.exists('enemy_death')){
            this.anims.create({
                key: 'enemy_death',
                frames: this.anims.generateFrameNumbers('dead', { start: 0, end: 13 }),
                frameRate: 12,
                repeat: 0
            });
        }
        if(!this.anims.exists('archer_weapon_shoot')){
            this.anims.create({
                key: 'archer_weapon_shoot',
                frames: this.anims.generateFrameNumbers('archer_weapon_anim', { start: 0, end: 7 }),
                frameRate: 24,
                repeat: 0
            });
        }
        if(!this.anims.exists('princess_idle')){
            this.anims.create({
                key: 'princess_idle',
                frames: this.anims.generateFrameNumbers('princess_anim', { start: 0, end: 11 }),
                frameRate: 6,
                repeat: -1
            });
        }
    }

    startNextWave() {
        console.log("Wave Complete! Starting next wave...");
        
        this.waveNumber++;
        
        console.log(`Moving to Wave ${this.waveNumber}`);
        this.startWave();
    }

    displayGameClearedMessage() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY - 200;

        const message = this.add.text(
            centerX,
            centerY,
            "All waves cleared, hurry and\nsave the princess in the barren island!",
            {
                font: 'bold 32px Arial',
                fill: '#FFD700',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 4,
                wordWrap: { width: 600 }
            }
        );
        message.setOrigin(0.5, 0.5);
        message.setDepth(99999);
        message.setScrollFactor(0);

        // Optional: fade out the message after 5 seconds
        this.tweens.add({
            targets: message,
            alpha: 0,
            duration: 1000,
            delay: 4000,
            ease: 'Linear'
        });
    }
    
    
    update(time, delta){
        this.player.update()
        this.castle.update()
        this.enemies.forEach(enemy => {
            enemy.update();
        });
        this.towers.forEach(tower => {
            tower.update();
        });
        this.tower_archers.forEach(tower_archer => {
            tower_archer.update();
        });
        this.children.each(child => {
            if (child.setDepth) {
                child.setDepth(child.y + (child.depthOffset || 0));
            }
        });

        if (!this.isSpawning && !this.gameOver && this.enemies.length === 0) {
            if (this.bossSpawned) {
                if (this.waveNumber > this.finalWave) {
                    console.log("Game Over - All waves completed!");
                    this.gameOver = true;
                    this.displayGameClearedMessage();
                    // this.scene.pause();
                } else {
                    this.startNextWave();
                }
            } else if (!this.bossSpawned && this.spawnedCount > 0) {
                this.scene.stop('OverlayScene');
                this.scene.launch('OverlayScene', { from: 'MainScene', open: "newWave" });
                this.spawnBoss();
            }
        }

        if (this.tileAnimationStates) {
            this.tileAnimationStates.forEach(state => {
                state.tileAnimations.forEach(animData => {
                    animData.elapsed += delta;
                    
                    const currentFrameData = animData.frames[animData.currentFrame];
                    
                    if (animData.elapsed >= currentFrameData.duration) {
                        animData.elapsed = 0;
                        animData.currentFrame = (animData.currentFrame + 1) % animData.frames.length;
                        
                        // Get the next frame's tile ID
                        const nextFrameData = animData.frames[animData.currentFrame];
                        // Calculate the new tile index (firstGid + tileid from animation)
                        const newTileId = animData.firstGid + nextFrameData.tileid;
                        
                        // Update the tile's index to show the new frame
                        animData.tile.index = newTileId;
                    }
                });
            });
        }
    }
}