export default class StoryScene extends Phaser.Scene {
    constructor() {
        super("StoryScene");
    }
    
    init(data) {
        this.playerType = data.playerType;
    }

    create() {
        this.centerX = this.cameras.main.centerX;
        this.centerY = this.cameras.main.centerY;
        
        this.startStory()

        this.skip = this.add.image(this.centerX * 2, this.centerY * 2, 'skip')
        .setScale(0.5)
        .setOrigin(1)
        .setInteractive({ pixelPerfect: true, useHandCursor: false })

        this.skip.on('pointerdown', () => {
            this.startGame(this.playerType);
        });

    }

    startStory(){
        const page1 = [];
        const page1Data = [
            { key: '110', y: this.centerY - 250, scale: 0.25 },
            { key: '120', y: this.centerY - 100, scale: 0.25 },
            { key: '130', y: this.centerY + 25, scale: 0.25 },
            { key: '140', y: this.centerY + 175, scale: 0.25 }
        ];
        
        page1Data.forEach((data, index) => {
            const image = this.add.image(-400, data.y, data.key)
                .setScale(data.scale)
                .setOrigin(0.5);
            
            // Slide in with delay
            this.tweens.add({
                targets: image,
                x: this.centerX,
                duration: 200,
                delay: index * 3000,
                ease: 'Power2.out'
            });
            
            page1.push(image);
        });
        
        // second page - slide in one by one from the right (after page 1 is removed)
        const page2 = [];
        const page2Data = [
            { key: '210', y: this.centerY - 225, scale: 0.3, x: this.centerX },
            { key: '220', y: this.centerY - 25, scale: 0.3, x: this.centerX },
            { key: '231', y: this.centerY + 180, scale: 0.3, x: this.centerX - 153 },
            { key: '232', y: this.centerY + 180, scale: 0.3, x: this.centerX + 154 }
        ];
        
        page2Data.forEach((data) => {
            const image = this.add.image(this.game.canvas.width + 400, data.y, data.key)
                .setScale(data.scale)
                .setOrigin(0.5)
                .setVisible(false);
            page2.push(image);
        });
        
        // After 2 seconds, remove page 1 and show page 2 sliding in
        this.time.delayedCall(12000, () => {
            page1.forEach(image => image.destroy());
            
            page2.forEach((image, index) => {
                const targetX = page2Data[index].x;
                image.setVisible(true);
                
                this.tweens.add({
                    targets: image,
                    x: targetX,
                    duration: 200,
                    delay: index * 2000,
                    ease: 'Power2.out'
                });
            });
        });
    }   
    
    startGame(characterType) {
        this.scene.start('MainScene', { playerType: characterType });
    }

}
