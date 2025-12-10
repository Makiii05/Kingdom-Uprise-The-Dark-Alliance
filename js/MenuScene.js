export default class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
        this.currentObjects = []; 
        this.selectedCharacter = null;
    }

    create() {
        this.handleAnimation();
        this.centerX = this.cameras.main.centerX;
        this.centerY = this.cameras.main.centerY;

        this.menu_sound = this.sound.add("in_menu_sound", { loop: true });
        this.menu_sound.play();

        this.showMainMenu();
    }

    clearPage() {
        if (this.currentObjects.length > 0) {
            this.currentObjects.forEach(obj => obj.destroy());
            this.currentObjects = [];
        }
    }

    showMainMenu() {
        this.clearPage();
        const bg = this.add.image(0, 0, 'bg').setOrigin(0).setScrollFactor(0);
        
        // Buttons
        const play_button = this.add.image(this.centerX + 70, this.centerY, 'play')
            .setInteractive({ pixelPerfect: true, useHandCursor: false })
            .setOrigin(0.5);
        const instruction_button = this.add.image(this.centerX + 70, this.centerY + 170, 'instruction')
            .setInteractive({ pixelPerfect: true, useHandCursor: false })
            .setOrigin(0.5);

        // Events
        play_button.on('pointerdown', () => {
            this.showCharacterSelect();
        });

        instruction_button.on('pointerdown', () => {
            this.showInstructions();
        });

        this.currentObjects.push(bg, play_button, instruction_button);
    }

    showCharacterSelect() {
        this.clearPage();
        const select_bg = this.add.image(this.centerX, this.centerY, 'select_bg')
            .setOrigin(0.5).setScale(.5).setScrollFactor(0).setTint(0X777777);
        const back_button = this.add.image(120, 70, 'back')
            .setInteractive({ useHandCursor: false }).setScale(0.5).setOrigin(0.5);
        const choose_header = this.add.image(this.centerX, 70, 'select')
            .setScale(1.5).setOrigin(0.5);

        // Platforms
        this.platform_archer = this.add.image(this.centerX + 275, this.centerY + 80, 'platform').setScale(0.8).setOrigin(0.5);
        this.platform_knight = this.add.image(this.centerX - 275, this.centerY + 80, 'platform').setScale(0.8).setOrigin(0.5);

        // Play Buttons
        this.play_knight_button = this.add.image(this.centerX - 275, this.centerY + 250, 'as_knight')
            .setScale(0.8).setInteractive({ pixelPerfect: true, useHandCursor: false }).setOrigin(0.5);
        this.play_archer_button = this.add.image(this.centerX + 275, this.centerY + 250, 'as_archer')
            .setScale(0.8).setInteractive({ pixelPerfect: true, useHandCursor: false }).setOrigin(0.5);

        // Characters
        this.knight = this.add.sprite(this.centerX - 275, this.centerY - 50, 'knight_idle')
            .setTint(0x555555).setScale(3).setOrigin(0.5)
            .setInteractive({ pixelPerfect: true, useHandCursor: false }); // Pixel perfect click
        this.archer = this.add.sprite(this.centerX + 275, this.centerY - 50, 'menu_archer_idle')
            .setTint(0x555555).setScale(3).setOrigin(0.5)
            .setInteractive({ pixelPerfect: true, useHandCursor: false });

        this.currentObjects.push(
            select_bg, back_button, choose_header, 
            this.platform_archer, this.platform_knight, 
            this.play_knight_button, this.play_archer_button, 
            this.knight, this.archer
        );

        this.knight.anims.play('knight_idle');
        this.archer.anims.play('menu_archer_idle_anim');
        this.setupCharacterHover();
        back_button.on('pointerdown', () => {
            this.showMainMenu();
        });
    }

    showInstructions() {
        this.menu_sound.stop();
        this.scene.start('InstructionsScene');
    }

    state(action, target, attackAnim = null, idleAnim = null) {
        const isKnight = (target === this.knight);
        const platform = isKnight ? this.platform_knight : this.platform_archer;
        const button = isKnight ? this.play_knight_button : this.play_archer_button;

        if (action === "on") {
            target.setTint(0xFFFFFF);
            if (platform) platform.setTint(0xFFFFFF);
            if (button) button.setTint(0xFFFFFF);

            target.anims.play(attackAnim, true);
        } else {
            target.setTint(0x555555);
            if (platform) platform.clearTint();
            if (button) button.clearTint();

            target.anims.play(idleAnim, true);
        }
    }

    setupCharacterHover() {
        // Knight Hover
        this.knight.on('pointerover', () => {
            this.state("on", this.knight, "menu_knight_attack_anim", null);
        });
        this.knight.on('pointerout', () => {
            this.state("out", this.knight, null, "knight_idle");
        });
        this.play_knight_button.on('pointerover', () => {
            this.state("on", this.knight, "menu_knight_attack_anim", null);
        });
        this.play_knight_button.on('pointerout', () => {
            this.state("out", this.knight, null, "knight_idle");
        });

        // Archer Hover
        this.archer.on('pointerover', () => {
            this.state("on", this.archer, "menu_archer_attack_anim", null);
        });
        this.archer.on('pointerout', () => {
            this.state("out", this.archer, null, "menu_archer_idle_anim");
        });
        this.play_archer_button.on('pointerover', () => {
            this.state("on", this.archer, "menu_archer_attack_anim", null);
        });
        this.play_archer_button.on('pointerout', () => {
            this.state("out", this.archer, null, "menu_archer_idle_anim");
        });

        // Button clicks
        this.play_knight_button.on('pointerdown', () => {
            this.startGame('knight');
        });

        this.play_archer_button.on('pointerdown', () => {
            this.startGame('archer');
        });
    }

    startGame(characterType) {
        this.menu_sound.stop();
        this.scene.start('StoryScene', { playerType: characterType });
    }

    handleAnimation() {
        if (!this.anims.exists('menu_archer_idle_anim')) {
            this.anims.create({
                key: 'menu_archer_idle_anim',
                frames: this.anims.generateFrameNumbers('menu_archer_idle', { start: 0, end: 5 }),
                frameRate: 12,
                repeat: -1
            });
        }
        if (!this.anims.exists('menu_archer_attack_anim')) {
            this.anims.create({
                key: 'menu_archer_attack_anim',
                frames: this.anims.generateFrameNumbers('menu_archer_attack', { start: 0, end: 5 }),
                frameRate: 8,
                repeat: -1
            });
        }
        if (!this.anims.exists('menu_knight_attack_anim')) {
            this.anims.create({
                key: 'menu_knight_attack_anim',
                frames: this.anims.generateFrameNumbers('menu_knight_attack', { start: 0, end: 11 }),
                frameRate: 12,
                repeat: -1
            });
        }
    }
}