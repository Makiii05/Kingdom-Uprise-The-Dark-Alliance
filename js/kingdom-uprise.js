import HudScene from "./HudScene.js";
import MainScene from "./mainScene.js";
import MenuScene from "./MenuScene.js";
import PreloaderScene from "./PreloaderScene.js";

const config = {
    width: 1280,
    height: 720,
    backgroundColor: '#999999',
    type: Phaser.AUTO,
    parent: 'game-con',

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        expandParent: true,
        zoom: 1,
    },

    scene: [PreloaderScene, MenuScene, MainScene, HudScene],

    physics: {
        default: 'matter',
        matter: {
            debug: false,
            gravity: { y: 0 }
        }
    },

};

new Phaser.Game(config);
