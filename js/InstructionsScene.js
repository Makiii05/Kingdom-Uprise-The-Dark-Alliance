export default class InstructionsScene extends Phaser.Scene {
    constructor() {
        super("InstructionsScene");
    }

    create() {
        this.centerX = this.cameras.main.centerX;
        this.centerY = this.cameras.main.centerY;
        this.pageIndex = 0;
        this.totalPages = 5;

        this.displayInstructions();
    }

    displayInstructions() {
        // Clear previous content
        this.children.removeAll();

        const bg = this.add.rectangle(
            this.centerX, 
            this.centerY, 
            this.cameras.main.width, 
            this.cameras.main.height, 
            0x000000, 
            0.9
        );

        const title = this.add.text(
            this.centerX, 
            60, 
            this.getPageTitle(),
            {
                font: 'bold 48px Arial',
                fill: '#FFD700',
                align: 'center'
            }
        ).setOrigin(0.5);

        const content = this.add.text(
            this.centerX, 
            150, 
            this.getPageContent(),
            {
                font: '20px Arial',
                fill: '#FFFFFF',
                align: 'center',
                wordWrap: { width: 1000 }
            }
        ).setOrigin(0.5, 0);

        // Page counter
        const pageCounter = this.add.text(
            this.centerX, 
            620, 
            `Page ${this.pageIndex + 1} of ${this.totalPages}`,
            {
                font: '16px Arial',
                fill: '#AAAAAA'
            }
        ).setOrigin(0.5);

        // Navigation buttons
        if (this.pageIndex > 0) {
            const prevBtn = this.add.text(100, 620, '← PREVIOUS', {
                font: 'bold 18px Arial',
                fill: '#FFD700',
                backgroundColor: '#444444',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5).setInteractive();
            
            prevBtn.on('pointerdown', () => {
                this.pageIndex--;
                this.displayInstructions();
            });
        }

        if (this.pageIndex < this.totalPages - 1) {
            const nextBtn = this.add.text(this.centerX + 400, 620, 'NEXT →', {
                font: 'bold 18px Arial',
                fill: '#FFD700',
                backgroundColor: '#444444',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5).setInteractive();
            
            nextBtn.on('pointerdown', () => {
                this.pageIndex++;
                this.displayInstructions();
            });
        } else {
            const backBtn = this.add.text(this.centerX + 400, 620, 'BACK TO MENU', {
                font: 'bold 18px Arial',
                fill: '#FFD700',
                backgroundColor: '#444444',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5).setInteractive();
            
            backBtn.on('pointerdown', () => {
                this.scene.start('MenuScene');
            });
        }
    }

    getPageTitle() {
        const titles = [
            'GOAL',
            'CHARACTERS',
            'COMBAT & ABILITIES',
            'SPECIAL ABILITIES',
            'STRATEGY'
        ];
        return titles[this.pageIndex];
    }

    getPageContent() {
        const pages = [
            // Page 0: GOAL
            `DEFEND THE CASTLE FROM WAVES OF ENEMIES

Your mission is to survive waves of enemies 
and protect your castle from destruction.

🛡️ CASTLE DEFENSE
Your castle has 50 HP. Enemies will attack it if they reach it.
Keep the castle alive at all costs!

🏰 THE PRINCESS
After clearing all waves, reach the barren island to save the princess!
This is your ultimate objective.

👥 PLAYER LIVES
You have 3 lives. Each time you die, you respawn at your starting point.
Lose all 3 lives and it's GAME OVER.`,

            `CHOOSE YOUR HERO

⚔️ KNIGHT
HP: 10
Damage: 2 
Speed: 3
Attack: Melee slash in all directions
Special: Can hit multiple enemies with one attack
Best for: Close combat, tanking damage

🏹 ARCHER
HP: 7 
Damage: 4 
Speed: 4 
Attack: Rapid fire arrows
Special: Can attack from range
Best for: Kiting, crowd control`,

            `BASIC COMBAT CONTROLS

⌨️ MOVEMENT
W, A, S, D - Move around the map
Mouse - Aim (Archer only)

🗡️ ATTACK
SPACE (Knight)
LEFT CLICK (Archer)

ABILITY
You earn experience from defeating enemies.
Fill the EXP bar to unlock building mode!`,

            `POWER-UP ABILITIES

⚡ Q - DASH (2s cooldown)
Quickly dodge in any direction
Invulnerable within the duration

🔥 E - ATTACK SPEED (14s cooldown)
Massively increases attack speed for 5 seconds
Perfect for boss fights!

💪 C - GOLIATH (30s cooldown)
Grow 2.7x larger for 5 seconds
Damage increases by 2.7x
Attack range increases dramatically
Ultimate power move!

🛠️ B - BUILD (exp based)
Build a selected tower
Defend the castle for you
`,

            `STRATEGY & PROGRESSION

🌊 WAVE SYSTEM
Each wave deploy random enemy
Boss spawned after clearing the wave
Difficulty increases with each wave!
After defeating final boss, you WIN!

💡 PRO TIPS
1. Use DASH to avoid damage and kite enemies
2. Save ATTACK SPEED for boss fights
3. Use GOLIATH to clear large groups
4. Build towers near the castle for defense
5. Move around the map to avoid getting surrounded
6. The barren island is in the far east - reach it after clearing all waves!`
        ];

        return pages[this.pageIndex];
    }
}
