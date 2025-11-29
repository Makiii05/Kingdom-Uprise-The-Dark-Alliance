export default class MenuScene extends Phaser.Scene {
    constructor(){
        super("MenuScene")
    }

    create(){
        const centerX = this.cameras.main.centerX
        const centerY = this.cameras.main.centerY

        const menu_sound = this.sound.add("in_menu_sound", {
            loop: true
        })
        menu_sound.play()

        this.add.image(0,0, 'bg').setOrigin(0).setScrollFactor(0);
        const play_archer_button = this.add.image(centerX + 100, centerY,'as_archer').setInteractive().setOrigin(0.5)
        const play_knight_button = this.add.image(centerX + 100, centerY + 150,'as_knight').setInteractive().setOrigin(0.5)

        play_archer_button.on('pointerdown', () => {
            menu_sound.stop()
            this.scene.start('MainScene');
        });
        play_knight_button.on('pointerdown', () => {
            menu_sound.stop()
            this.scene.start('MainScene');
        });
    }

    update(){

    }
}