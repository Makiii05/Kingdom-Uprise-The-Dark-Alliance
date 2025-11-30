import Player from "./Player.js";

export default class Tower extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene.matter.world, x, y, texture, frame);

        this.scene = scene;
        this.player = this.scene.player
        scene.add.existing(this);
        this.isBuilded = false

        this.setScale(1.2);
        this.setStatic(true);
        this.setCollisionCategory(null);
        this.setDepth(y);
        this.setInteractive();

        this.on('pointerdown', this.onPointerDown, this); 
        
    }

    update() {
        if(this.player.isBuilding && !this.isBuilded){
            this.setTint(0xff00ff);
        } else {
            this.clearTint();
        }
    }

    onPointerDown() {
        if(!this.player.isBuilding || this.isBuilded) return;
        this.setTexture('Tower_Blue');

        const newArcher = new Player({
                scene:this.scene, 
                x:this.x, 
                y:this.y - 50, 
                texture:'blue_archer', 
                frame:'idle_0', 
                type: 'tower_archer'
            }).setScale(0.8);

        this.scene.tower_archers.push(newArcher);

        this.scene.children.bringToTop(newArcher);
        this.isBuilded = true;
        this.player.isBuilding = false;
        this.player.canBuild = false;
        this.player.buildExp = 0
        document.querySelector('canvas').style.cursor = "auto";
    }
}