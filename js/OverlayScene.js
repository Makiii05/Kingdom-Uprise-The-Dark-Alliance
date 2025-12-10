export default class OverlayScene extends Phaser.Scene {
    constructor() {
        super("OverlayScene")

        this.isOpen = false;
        this.open = null;
    }

    init(data) {
        this.from = data.from;
        this.open = data.open;
        this.isOpen = false; // Reset flag on each init

        if(this.open === "newWave" || this.open === "bossSpawn" || this.open === "finalRound"){
            this.cameras.main.fadeIn(300);
            this.time.delayedCall(3000, () => this.scene.stop());
        }
    }

    create(){
        this.main = this.scene.get('MainScene')
        this.centerX = this.cameras.main.centerX;
        this.centerY = this.cameras.main.centerY;
    }

    update(){
        if(this.open && !this.isOpen){
            this.isOpen = true;
            // Clear any existing content from previous overlay
            this.children.list.forEach(child => {
                if (child.destroy) {
                    child.destroy();
                }
            });
            
            if(this.open === "pause"){
                this.displayBg();
                this.pause();
            }else if(this.open === "gameOver"){
                this.displayBg();
                this.gameOver();
            }else if(this.open === "youWon"){
                this.displayBg();
                this.youWon();
            }else if(this.open === "newWave"){
                this.newWave();
            }else if(this.open === "bossSpawn"){
                this.bossSpawn();
            }else if(this.open === "finalRound"){
                this.finalRound();
            }
        }
    }

    displayBg(){
        this.add.rectangle(this.centerX, this.centerY, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7);
        this.bg = this.add.image(this.centerX, this.centerY, 'overlay_bg')
            .setOrigin(0.5)
            .setDepth(0);    
    }

    pause(){
        this.add.image(this.centerX, this.centerY - 50, 'pause')
            .setScale(0.5)
        
        const quitBtn = this.add.image(this.centerX - 70, this.centerY + 50, 'quit_btn')
            .setScale(0.3)
            .setInteractive();
        
        const resumeBtn = this.add.image(this.centerX + 70, this.centerY + 50, 'resume_btn')
            .setScale(0.3)
            .setInteractive();

        quitBtn.on('pointerdown', () => {
            this.scene.stop('MainScene');
            this.scene.stop('HudScene');
            this.scene.stop();
            this.scene.start('MenuScene');
        });

        resumeBtn.on('pointerdown', () => {
            this.scene.resume('MainScene');
            this.scene.resume('HudScene');
            this.scene.stop();
        });
    }

    gameOver(){
        this.add.image(this.centerX, this.centerY - 50, 'game_over')
            .setScale(0.6)
        
        const quitBtn = this.add.image(this.centerX - 70, this.centerY + 50, 'quit_btn')
            .setScale(0.3)
            .setInteractive();
        
        const restartBtn = this.add.image(this.centerX + 70, this.centerY + 50, 'restart_btn')
            .setScale(0.3)
            .setInteractive();

        quitBtn.on('pointerdown', () => {
            this.scene.stop('MainScene');
            this.scene.stop('HudScene');
            this.scene.stop();
            this.scene.start('MenuScene');
        });

        restartBtn.on('pointerdown', () => {
            this.scene.stop('HudScene');
            this.scene.stop();
            this.main.scene.restart()
            // this.scene.restart('MainScene');
        });
    }

    youWon(){
        this.add.image(this.centerX, this.centerY - 50, 'you_won')
            .setScale(0.6)
        
        const quitBtn = this.add.image(this.centerX - 70, this.centerY + 50, 'quit_btn')
            .setScale(0.3)
            .setInteractive();
        
        const playAgainBtn = this.add.image(this.centerX + 70, this.centerY + 50, 'play_again_btn')
            .setScale(0.3)
            .setInteractive();

        quitBtn.on('pointerdown', () => {
            this.scene.stop('MainScene');
            this.scene.stop('HudScene');
            this.scene.stop();
            this.scene.start('MenuScene');
        });

        playAgainBtn.on('pointerdown', () => {
            this.scene.stop('HudScene');
            this.scene.stop();
            this.main.scene.restart()
        });
    }

    newWave(){
        this.add.rectangle(this.centerX, this.centerY, this.cameras.main.width, this.cameras.main.height * .2, 0x000000, 0.7);
        this.add.image(this.centerX, this.centerY, 'new_wave_start')
    }

    bossSpawn(){
        this.add.rectangle(this.centerX, this.centerY, this.cameras.main.width, this.cameras.main.height * .2, 0x000000, 0.7);
        this.add.image(this.centerX, this.centerY, 'orc_boss_spawn')
    }

    finalRound(){
        this.add.rectangle(this.centerX, this.centerY, this.cameras.main.width, this.cameras.main.height * .2, 0x000000, 0.7);
        this.add.image(this.centerX, this.centerY, 'final_round')
    }
    
}