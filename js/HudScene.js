export default class HudScene extends Phaser.Scene {
    constructor() {
        super("HudScene")
    }

    preload() {
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
    }

    create() {
        this.main = this.scene.get('MainScene');
        this.playerBaseHp = this.main.player.hp;
        this.maxBarHeight = 200;
        this.cd = [
            this.main.player.dashCooldown,
            this.main.player.attackSpeedCooldown,
            this.main.player.goliathCooldown
        ];
        this.lives = this.main.player.lives
        this.maxLives = this.lives;

        this.enemiesLeft = this.main.enemies.length;
        this.waveNumber = this.main.waveNumber;

        this.drawSkillHUD();
        this.drawAbilityBar();
        this.drawStatusPanel();
        this.drawEnemyhud()

        this.portraitIcon = "archer_idle"
        if (this.main.player.type === 'archer') {
            this.portraitIcon = "archer_idle"
        } else {
            this.portraitIcon = "knight_idle"
        }
        this.playerProfile = this.add.sprite(95, 60, this.portraitIcon).setScale(1.5);
        this.playerProfile.play(this.portraitIcon);
    }

    update() {
        // ... ability ...
        this.expFill.height = (this.main.player.buildExp/100 * this.maxBarHeight);
        if(this.expFill.height/this.maxBarHeight * 100 >= this.main.player.buildExpNeeded){
            this.abilityBarImage.setTexture('ready_ability_bar');
            this.expFill.setVisible(false);
        }else{
            this.abilityBarImage.setTexture('ability_bar');
            this.expFill.setVisible(true);
        }

        // ... cooldown ...
        const cooldowns = [
            this.main.player.dashCooldown,
            this.main.player.attackSpeedCooldown,
            this.main.player.goliathCooldown
        ];

        const abilities = [
            this.main.player.canDash,
            this.main.player.canAttackSpeed,
            this.main.player.canGoliath
        ];

        abilities.forEach((canUse, index) => {
            const skillSizer = this.conSkill.getChildren()[index];
            const icon = skillSizer.getByName('skillIcon');
            const iconText = skillSizer.getByName('iconText');

            if (!icon) return;

            if (!canUse) {
                icon.setTint(0x444444);
                this.cd[index] -= this.game.loop.delta;

                if (this.cd[index] < 0)
                    this.cd[index] = 0;

                const seconds = (this.cd[index] / 1000).toFixed(1);
                iconText.setText(seconds);
            } else {
                this.cd[index] = cooldowns[index];
                icon.clearTint();
                iconText.setText('');
            }
        });

        // ... hp - lives ...
        this.lives = this.main.player.lives;
        if(this.conLives && this.conLives.children) {
            for (let i = 0; i < this.lives; i++) {
                if(this.conLives.getChildren()[i]) this.conLives.getChildren()[i].setVisible(true);
            }
            for (let i = this.lives; i < this.maxLives; i++) {
                if(this.conLives.getChildren()[i]) this.conLives.getChildren()[i].setTexture('background_heart');
            }
        }
        
        const hpPercentage = Phaser.Math.Clamp(
            this.main.player.hp / this.playerBaseHp,
            0, 1
        );

        if(this.hpFill) this.hpFill.width = 160 * hpPercentage;

        // ... enemy hud ...
        this.enemiesLeft = this.main.enemies.length;
        this.enemyText.setText(`${this.enemiesLeft}`);
        this.waveNumber = this.main.waveNumber;
        this.waveText.setText(`${this.waveNumber}`);
    }

    drawEnemyhud(){
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.enemyHud = this.add.image(width, 0, 'enemy_hud')
            .setOrigin(1, 0)
            .setScale(0.5)
            .setDepth(0);
        this.enemyText = this.add.text(this.enemyHud.x - 98, this.enemyHud.y + 105, ``, {
            fontSize: '24px',
            color: '#f5c800ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.waveText = this.add.text(this.enemyHud.x - 98, this.enemyHud.y + 225, ``, {
            fontSize: '24px',
            color: '#f5c800ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.settingBtn = this.add.image(width - 55, 350, 'settings_btn')
            .setOrigin(0.5)
            .setScale(0.15)
            .setDepth(1)
            .setInteractive({ pixelPerfect: true })
            .on('pointerdown', () => {
                this.main.scene.pause();
                this.scene.pause();
                this.scene.stop('OverlayScene');
                this.scene.launch('OverlayScene', { from: 'HudScene', open: "pause" });
            });
    }

    drawSkillHUD() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.hudBackground = this.add.image(width / 2, height * 0.9, 'skill_hud')
            .setOrigin(0.5)
            .setScale(1)
            .setDepth(0);

        this.conSkill = this.rexUI.add.sizer({
            x: width / 2,
            y: height * 0.9,
            orientation: 'x',
            space: { left: 10, right: 10, top: 10, bottom: 10, item: 45 }
        });

        const addSkill = (sizer, size, text, iconKey) => {
            const skillSizer = this.rexUI.add.overlapSizer({
                width: size,
                height: size,
            }).setDepth(1);

            const bg = this.add.image(0, 0, 'key_ring')
                .setDisplaySize(size, size);

            const keyBg = this.add.image(0, 0, 'key_ring')
                .setDisplaySize(size * 0.5, size * 0.5)
                .setDepth(1)
                .setTint(0x888888);

            const keyText = this.add.text(0, 0, text, {
                fontSize: `${size / 2.5}px`,
                color: '#ffffffff',
                fontStyle: 'bold',
            }).setDepth(2);

            const icon = this.add.image(0, 0, iconKey)
                .setDisplaySize(size * 0.80, size * 0.80)
                .setOrigin(0.5)
                .setName('skillIcon');

            const iconText = this.add.text(0, 0, "", {
                fontSize: `${size * 0.2}px`,
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(2).setName('iconText');

            skillSizer.add(bg);
            skillSizer.add(keyText, { expand: false, align: 'center', padding: { top: size / 2, bottom: 0, left: 0, right: size / 2 } });
            skillSizer.add(keyBg, { expand: false, align: 'center', padding: { top: size / 2, bottom: 0, left: 0, right: size / 2 } });
            skillSizer.add(icon, { expand: false, align: 'center' });
            skillSizer.add(iconText, { expand: false, align: 'center' });

            sizer.add(skillSizer, { expand: false, proportion: 0 });
        }

        const size = 90;
        addSkill(this.conSkill, size, "Q", "skill_q");
        addSkill(this.conSkill, size, "E", "skill_e");
        addSkill(this.conSkill, size, "C", "skill_c");
        this.conSkill.layout();
    }

    drawStatusPanel() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.maxLives = this.lives;

        this.statusBG = this.add.image(width * 0.15, height * 0.12, 'info_hud')
            .setOrigin(0.5)
            .setScale(0.7)
            .setDepth(0);

        this.statusPanelSizer = this.rexUI.add.sizer({
            x: width * 0.15,
            y: height * 0.12,
            orientation: 'x',
            space: { left: 90, right: 20, top: 15, bottom: 15, item: 20 }
        })
            .setOrigin(0.5)
            .setDepth(2);

        const infoPanelSizer = this.rexUI.add.sizer({
            orientation: 'y',
            space: { item: 8 }
        });

        this.conLives = this.rexUI.add.sizer({
            width: 10,
            height: 10,
            orientation: 'x',
            space: { item: 0 }
        });
        for (let i = 0; i < this.maxLives; i++) {
            const heartIcon = this.add.image(0, 0, 'heart')
                .setDisplaySize(24, 24);
            this.conLives.add(heartIcon);
        }
        infoPanelSizer.add(this.conLives, { align: 'left' });


        const hpBG = this.rexUI.add.roundRectangle(0, 0, 160, 20, 5, 0x444444);
        this.hpFill = this.rexUI.add.roundRectangle(0, 0, 160, 20, 5, 0xFF0000)
            .setOrigin(0, 0.5);

        this.hpBar = this.rexUI.add.label({
            width: 160,
            height: 20,
            background: hpBG,
            align: 'center'
        });

        this.hpBar.add(this.hpFill);
        infoPanelSizer.add(this.hpBar, { align: 'left' });

        this.statusPanelSizer.add(infoPanelSizer, { align: 'center' });
        this.statusPanelSizer.layout();
    }

    drawAbilityBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const abilitySize = 45;
        const barWidth = 16;
        const barHeight = this.maxBarHeight;

        this.abilityBarImage = this.add.image(width * 0.08, height * 0.45, 'ability_bar')
            .setOrigin(0.5)
            .setScale(0.5)
            .setDepth(0);

        this.conAbility = this.rexUI.add.sizer({
            x: width * 0.052,
            y: height * 0.47,
            orientation: 'y',
            space: { item: -5 }
        }).setDepth(10);

        const abilitySizer = this.rexUI.add.overlapSizer({
            width: abilitySize,
            height: abilitySize
        });
        const keyBg = this.add.image(0, 0, 'key_ring')
            .setDisplaySize(abilitySize, abilitySize)
            .setTint(0x888888)
            .setDepth(20);
        const keyText = this.add.text(0, 0, "B", {
            fontSize: abilitySize * 0.7,
            color: '#ffffff',
            fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setDepth(21);
        
        abilitySizer.add(keyBg);
        abilitySizer.add(keyText, { align: "center" });

        const expSizer = this.rexUI.add.overlapSizer({
            width: barWidth,
            height: barHeight
        });
        const expBG = this.rexUI.add.roundRectangle(
            0, 0,
            barWidth, barHeight,
            5,
            0x000000
        ).setVisible(false);
        this.expFill = this.rexUI.add.roundRectangle(
            0, 0,
            barWidth,
            0,
            5,
            0x00ff00
        ).setOrigin(0, 1);

        expSizer.add(expBG, { expand: true }); 
        expSizer.add(this.expFill, { expand: false, align: 'bottom' });

        this.conAbility.add(abilitySizer, { expand: false });
        this.conAbility.add(expSizer, { expand: false });

        this.conAbility.layout();
    }
}