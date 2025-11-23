import Enemy from "./Enemy.js"
import Player from "./Player.js"

export default class MainScene extends Phaser.Scene {
    constructor(){
        super("MainScene")
    }

    preload() {
        Player.preload(this)
        Enemy.preload(this)
        this.load.image("GrassTileSet", 'asset/Tiny Swords (Update 010)/Terrain/Ground/Tilemap_Flat.png')
        this.load.image("Bridge_All", 'asset/Tiny Swords (Update 010)/Terrain/Bridge/Bridge_All.png')
        this.load.image("Castle_Blue", 'asset/Tiny Swords (Update 010)/Factions/Knights/Buildings/Castle/Castle_Blue.png')
        this.load.image("Foam", 'asset/Tiny Swords (Update 010)/Terrain/Water/Foam/Foam.png')
        this.load.image("GroundTileSet", 'asset/Tiny Swords (Update 010)/Terrain/Ground/Tilemap_Elevation.png')
        this.load.image("Rocks_01", 'asset/Tiny Swords (Update 010)/Terrain/Water/Rocks/Rocks_01.png')
        this.load.image("Rocks_02", 'asset/Tiny Swords (Update 010)/Terrain/Water/Rocks/Rocks_02.png')
        this.load.image("Rocks_03", 'asset/Tiny Swords (Update 010)/Terrain/Water/Rocks/Rocks_03.png')
        this.load.image("Rocks_04", 'asset/Tiny Swords (Update 010)/Terrain/Water/Rocks/Rocks_04.png')
        this.load.image("ShadowsTileSet", 'asset/Tiny Swords (Update 010)/Terrain/Ground/Shadows.png')
        this.load.image("Water", 'asset/Tiny Swords (Update 010)/Terrain/Water/Water.png') 
        this.load.image("House_Blue", 'asset/Tiny Swords (Update 010)/Factions/Knights/Buildings/House/House_Blue.png')
        this.load.image("Tower_Blue", 'asset/Tiny Swords (Update 010)/Factions/Knights/Buildings/Tower/Tower_Blue.png')
        this.load.image("Tower_Destroyed", 'asset/Tiny Swords (Update 010)/Factions/Knights/Buildings/Tower/Tower_Destroyed.png')
        this.load.image("Tree", 'asset/Tiny Swords (Update 010)/Resources/Trees/Tree.png')
        this.load.image("HappySheep_All", 'asset/Tiny Swords (Update 010)/Resources/Sheep/HappySheep_All.png')
        this.load.image("Tower_Construction", 'asset/Tiny Swords (Update 010)/Factions/Knights/Buildings/Tower/Tower_Construction.png')

        this.load.spritesheet('dead', 'asset/img/Dead.png', { frameWidth: 128, frameHeight: 128 });

        this.load.tilemapTiledJSON('map', 'asset/tiled/Scene/map1_embedded.json')    
    }

    create() {
        //--------------------TILED MAP
        const map = this.make.tilemap({key:'map'})

        const bridge = map.addTilesetImage('Bridge_All', 'Bridge_All')
        const castle = map.addTilesetImage('Castle_Blue', 'Castle_Blue')
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

        const allTilesets = [
            bridge, castle, foam, grass, ground, rocks1, rocks2, rocks3, rocks4,
            shadows, water, house, tower, destroyed, tree, sheep, towerC
        ]

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
                if(layerName == "Collision"){
                    layer.setCollisionByProperty({collide:true})
                    layer.setVisible(false)
                    this.matter.world.convertTilemapLayer(layer)
                }
            }
        })

        //--------------------PLAYER
        this.player = new Player({scene:this, x:this.cameras.main.centerX, y:this.cameras.main.centerY, texture:'blue_knight', frame:'idle_0'})

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            q: Phaser.Input.Keyboard.KeyCodes.Q,
            e: Phaser.Input.Keyboard.KeyCodes.E,
            c: Phaser.Input.Keyboard.KeyCodes.C
        })

        //--------------------ENEMY
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
            }
            //will add  target tower later
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
        this.enemytotal = 1000
        this.waveNumber = 100
        this.enemyleft = 1000
        this.waveInterval = 5000
        setInterval(() => {
            if(this.enemyleft > 0){
                for (let i = 0; i < this.enemytotal/this.waveNumber; i++) {
                    const spawnPoint = Phaser.Utils.Array.GetRandom(this.spawnPoints);
                    const enemyType = Phaser.Utils.Array.GetRandom(this.enemyType);
                    const enemy = new Enemy({scene:this, x: spawnPoint.x, y: spawnPoint.y, texture: enemyType.texture, frame: enemyType.frame, target: enemyType.target, type: enemyType.type});
                    this.enemies.push(enemy);
                    this.enemyleft -= 1   
                }
            }
        }, this.waveInterval);

        //--------------------ANIMATIONS
        this.anims.create({
            key: 'enemy_death',
            frames: this.anims.generateFrameNumbers('dead', { start: 0, end: 13 }),
            frameRate: 12,
            repeat: 0
        });
        
    }

    
    update(){
        this.player.update()
        this.enemies.forEach(enemy => {
            enemy.update();
        });
        this.children.each(child => {
            if (child.setDepth) {
                child.setDepth(child.y);
            }
        });

    }
}