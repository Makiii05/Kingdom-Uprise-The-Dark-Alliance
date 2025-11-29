export default class HudScene extends Phaser.Scene {
    constructor(){
        super("HudScene")
    }

    preload(){
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');

        this.load.image('info_hud', 'asset/img/info_hud.png');
        this.load.image('skill_hud', 'asset/img/skill_hud.png');
        this.load.image('key_ring', 'asset/img/key_ring.png');
        this.load.image('skill_q', 'asset/img/dash.png');
        this.load.image('skill_e', 'asset/img/attack_speed.png');
        this.load.image('skill_c', 'asset/img/goliath.png');
        this.load.image('ability_bar', 'asset/img/ability_bar.png');
        this.load.image('ready_ability_bar', 'asset/img/ready_ability_bar.png');
    }

    create(){
        this.main = this.scene.get('MainScene'); 
        this.drawSkillHUD();
        this.drawAbilityBar();
        this.drawStatusPanel();

        this.portraitIcon = "archer_idle"
        if(this.main.player.type === 'archer'){
            this.portraitIcon = "archer_idle"
        }else{
            this.portraitIcon = "knight_idle"
        }
        this.playerProfile = this.add.sprite(95, 60, this.portraitIcon).setScale(1.5);
        this.playerProfile.play(this.portraitIcon);
        this.playerBaseHp = this.main.player.hp;
        this.cd = [
            this.main.player.dashCooldown,
            this.main.player.attackSpeedCooldown,
            this.main.player.goliathCooldown
        ];
    }

    update() {
        // ---------- Skill Cooldowns ----------
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
            const skillSizer = this.conSizer.getChildren()[index];
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

        // ---------- HP & Lives ----------
        this.livesText.setText('Lives: ' + this.main.player.lives);

        const hpPercentage = Phaser.Math.Clamp(
            this.main.player.hp / this.playerBaseHp, 
            0, 1
        );

        this.hpFill.width = 160 * hpPercentage;
    }

    drawSkillHUD() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.hudBackground = this.add.image(width / 2, height * 0.9, 'skill_hud')
            .setOrigin(0.5)
            .setScale(1)
            .setDepth(0);

        this.conSizer = this.rexUI.add.sizer({
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
                .setDisplaySize(size * 0.85, size * 0.90)
                .setOrigin(0.5)
                .setName('skillIcon');
                
            const iconText = this.add.text(0, 0, "", {
                fontSize: `${size * 0.2}px`,
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(2).setName('iconText');

            skillSizer.add(bg);
            skillSizer.add(keyText, {expand: false,  align: 'center', padding: { top:  size / 2, bottom: 0, left: 0, right: size / 2} });
            skillSizer.add(keyBg, {expand: false, align:  'center', padding: { top:  size / 2, bottom: 0, left: 0, right: size / 2} });
            skillSizer.add(icon, {expand: false,  align: 'center' });
            skillSizer.add(iconText, {expand: false,  align: 'center' });

            sizer.add(skillSizer, { expand: false, proportion: 0 });
        }

        const size = 90;
        addSkill(this.conSizer, size, "Q", "skill_q");
        addSkill(this.conSizer, size, "E", "skill_e");
        addSkill(this.conSizer, size, "C", "skill_c");
        this.conSizer.layout();
    }

    drawStatusPanel() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

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

        this.livesText = this.add.text(0, 0, 'Lives: 3', {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#000000ff'
        });
        infoPanelSizer.add(this.livesText, { align: 'left' });


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

        this.abilityBarBG = this.add.image(width * 0.08, height * 0.45, 'ability_bar')
            .setOrigin(0.5)
            .setScale(0.5)
            .setDepth(0);
    }
}