import MainScene from "./MainScene.js";

const config = {
    width: 1280,
    height: 720,
    backgroundColor: '#999999',
    type: Phaser.AUTO,
    parent: 'game-con',

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        expandParent: true,      // <-- THIS MAKES IT FILL SCREEN
        zoom: 1,
    },

    scene: [MainScene],

    physics: {
        default: 'matter',
        matter: {
            debug: false,
            gravity: { y: 0 }
        }
    },
};

new Phaser.Game(config);
