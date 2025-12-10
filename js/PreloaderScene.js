export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super("PreloaderScene")
    }

    preload() {
        // Player assets (blue_knight)
        this.load.atlas(
            'blue_knight',
            'asset/img/blue/knight.png',
            'asset/img/blue/knight_atlas.json'
        );
        this.load.animation(
            'blue_knight_anim',
            'asset/img/blue/knight_anim.json'
        );
        
        // Player assets (blue_archer)
        this.load.atlas(
            'blue_archer',
            'asset/img/blue/archer.png',
            'asset/img/blue/archer_atlas.json'
        );
        this.load.animation(
            'blue_archer_anim',
            'asset/img/blue/archer_anim.json'
        );

        // Enemy assets (red_knight)
        this.load.atlas('red_knight', 'asset/img/red/knight.png','asset/img/red/knight_atlas.json');
        this.load.animation('red_knight_anim', 'asset/img/red/knight_anim.json');
        
        // Enemy assets (goblin)
        this.load.atlas('goblin', 'asset/img/red/goblin.png','asset/img/red/goblin_atlas.json');
        this.load.animation('goblin_anim', 'asset/img/red/goblin_anim.json');

        // Boss assets (boss_orc)
        this.load.atlas('boss_orc', 'asset/img/boss_orc.png','asset/img/boss_orc_atlas.json');
        this.load.animation('boss_orc_anim', 'asset/img/boss_orc_anim.json');

        // Castle assets
        this.load.image("castle", 'asset/img/blue/Castle_Blue.png');

        // Tileset images
        this.load.image("GrassTileSet", 'asset/Tiny Swords (Update 010)/Terrain/Ground/Tilemap_Flat.png')
        this.load.image("Bridge_All", 'asset/Tiny Swords (Update 010)/Terrain/Bridge/Bridge_All.png')
        this.load.image("Castle_Blue", 'asset/Tiny Swords (Update 010)/Factions/Knights/Buildings/Castle/Castle_Blue.png')
        this.load.image("Castle_Destroyed", 'asset/Tiny Swords (Update 010)/Factions/Knights/Buildings/Castle/Castle_Destroyed.png')
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
        this.load.image("boss_chamber", 'asset/tiled/Tileset/boss_chamber.png')

        // Game assets
        this.load.image('arrow', 'asset/img/Arrow.png');
        this.load.image('archer_weapon', 'asset/img/blue/archer_weapon.png');

        // Animation
        this.load.spritesheet('archer_weapon_anim', 'asset/img/blue/archer_weapon_anim.png', { frameWidth: 192, frameHeight: 192 });
        this.load.spritesheet('dead', 'asset/img/Dead.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('princess_anim', 'asset/img/princess.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('menu_archer_attack', 'asset/img/menu/archer_attack.png', { frameWidth: 192, frameHeight: 192 });
        this.load.spritesheet('menu_knight_attack', 'asset/img/menu/knight_attack.png', { frameWidth: 192, frameHeight: 192 });
        this.load.spritesheet('menu_archer_idle', 'asset/img/menu/archer_idle.png', { frameWidth: 192, frameHeight: 192 });

        // Audio
        this.load.audio('in_game_sound', 'asset/mp3/Music/main.wav')
        this.load.audio('sword_atk', 'asset/mp3/sfx/26_sword_hit_1.wav')
        this.load.audio('orc_atk', 'asset/mp3/sfx/20_orc_special_atk.wav')
        this.load.audio('orc_death', 'asset/mp3/sfx/24_orc_death_spin.wav')
        this.load.audio('power_up', 'asset/mp3/sfx/power_up.mp3')
        this.load.audio('dash_sfx', 'asset/mp3/sfx/dash.mp3')
        this.load.audio('in_menu_sound', 'asset/mp3/Music/menu.wav')
        
        // Map
        this.load.tilemapTiledJSON('map', 'asset/tiled/Scene/map1_embedded.json')

        // Menu assets
        this.load.image('bg', 'asset/img/menu/menu_bg.jpg')
        this.load.image('as_archer', 'asset/img/menu/play_as_archer.png')
        this.load.image('as_knight', 'asset/img/menu/play_as_knight.png')
        this.load.image('play', 'asset/img/menu/play.png')
        this.load.image('instruction', 'asset/img/menu/instruction.png')
        this.load.image('select', 'asset/img/menu/select.png')
        this.load.image('back', 'asset/img/menu/back.png')
        this.load.image('platform', 'asset/img/menu/platform.png')
        this.load.image('select_bg', 'asset/img/menu/select_bg.png')

        // Hud assets
        this.load.image('ability_bar', 'asset/img/hud/ability_bar.png');
        this.load.image('skill_e', 'asset/img/hud/attack_speed.png');
        this.load.image('skill_q', 'asset/img/hud/dash.png');
        this.load.image('skill_c', 'asset/img/hud/goliath.png');
        this.load.image('settings_btn', 'asset/img/hud/settings.png');
        this.load.image('info_hud', 'asset/img/hud/info_hud.png');
        this.load.image('enemy_hud', 'asset/img/hud/enemy_hud.png');
        this.load.image('key_ring', 'asset/img/hud/key_ring.png');
        this.load.image('ready_ability_bar', 'asset/img/hud/ready_ability_bar.png');
        this.load.image('skill_hud', 'asset/img/hud/skill_hud.png');
        this.load.image('background_heart', 'asset/img/heart/background.png');
        this.load.image('heart', 'asset/img/heart/heart.png');

        // Overlay Scene
        this.load.image('overlay_bg', 'asset/img/overlay/bg.png');
        this.load.image('final_round', 'asset/img/overlay/final_round.png');
        this.load.image('game_over', 'asset/img/overlay/game_over.png');
        this.load.image('new_wave_start', 'asset/img/overlay/new_wave_start.png');
        this.load.image('orc_boss_spawn', 'asset/img/overlay/orc_boss_spawn.png');
        this.load.image('pause', 'asset/img/overlay/pause.png');
        this.load.image('play_again_btn', 'asset/img/overlay/play_again_btn.png');
        this.load.image('quit_btn', 'asset/img/overlay/quit_btn.png');
        this.load.image('restart_btn', 'asset/img/overlay/restart_btn.png');
        this.load.image('resume_btn', 'asset/img/overlay/resume_btn.png');
        this.load.image('you_won', 'asset/img/overlay/you_won.png');
    }

    create() {
        console.log("All assets preloaded!")
        this.scene.start('MenuScene');
    }
}
