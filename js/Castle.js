export default class Castle extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        const { scene, x, y, texture } = data;
        super(scene.matter.world, x, y, texture);

        this.scene = scene;
        scene.add.existing(this);

        this.spawnPoint = { x, y };

        this.maxHp = 5;
        this.hp = this.maxHp;

        this.createBody(this.width, this.height); // width, height for collision
        this.setFixedRotation();
        this.setScale(1.1);

        // Track enemies that are currently attacking
        this.attackingEnemies = new Set();

        // Create health bar
        this.createHealthBar();

        // Setup collision detection
        this.setupCollisions();
    }

    static preload(scene) {
        scene.load.image("castle", 'asset/img/blue/Castle_Blue.png')
    }

    createBody(width, height) {
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;

        // Main collision body
        this.castleCollider = Bodies.rectangle(this.x, this.y, width, height, {
            isSensor: false,
            label: 'castleCollider',
            isStatic: true // Castle doesn't move
        });

        // Larger sensor to detect nearby enemies
        this.castleSensor = Bodies.rectangle(this.x, this.y, width, height, {
            isSensor: true,
            label: 'castleSensor'
        });

        const compoundBody = Body.create({
            parts: [this.castleCollider, this.castleSensor],
            isStatic: true
        });

        this.setExistingBody(compoundBody);
    }

    createHealthBar() {
        const barWidth = this.width;
        const barHeight = 8;
        const offsetY = -120;

        // Background (red)
        this.healthBarBg = this.scene.add.rectangle(
            this.x, 
            this.y + offsetY, 
            barWidth, 
            barHeight, 
            0xff0000
        );
        this.healthBarBg.setDepth(9999);

        // Foreground (green)
        this.healthBarFill = this.scene.add.rectangle(
            this.x, 
            this.y + offsetY, 
            barWidth, 
            barHeight, 
            0x00ff00
        );
        this.healthBarFill.setDepth(10000);
        this.healthBarFill.setOrigin(0, 0.5);
        this.healthBarFill.x = this.x - barWidth / 2;

        // Border
        this.healthBarBorder = this.scene.add.rectangle(
            this.x, 
            this.y + offsetY, 
            barWidth + 2, 
            barHeight + 2
        );
        this.healthBarBorder.setStrokeStyle(2, 0x000000);
        this.healthBarBorder.setDepth(10001);
        this.healthBarBorder.isFilled = false;
    }

    setupCollisions() {
        // Listen for collision events
        this.scene.matter.world.on('collisionstart', (event) => {
            event.pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;

                // Check if castle sensor collided with an enemy
                if (bodyA.label === 'castleSensor' || bodyB.label === 'castleSensor') {
                    const enemyBody = bodyA.label === 'castleSensor' ? bodyB : bodyA;
                    
                    // Check if it's an enemy sensor
                    if (enemyBody.label === 'enemySensor') {
                        const enemy = enemyBody.gameObject?.parent;
                        if (enemy && enemy.scene) {
                            // Mark this enemy as attacking the castle
                            this.attackingEnemies.add(enemy);
                            enemy.isAttackingCastle = true;
                        }
                    }
                }
            });
        });

        // Listen for collision end
        this.scene.matter.world.on('collisionend', (event) => {
            event.pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;

                if (bodyA.label === 'castleSensor' || bodyB.label === 'castleSensor') {
                    const enemyBody = bodyA.label === 'castleSensor' ? bodyB : bodyA;
                    
                    if (enemyBody.label === 'enemySensor') {
                        const enemy = enemyBody.gameObject?.parent;
                        if (enemy) {
                            this.attackingEnemies.delete(enemy);
                            enemy.isAttackingCastle = false;
                        }
                    }
                }
            });
        });
    }

    update() {
        this.updateHealthBar();
    }

    updateHealthBar() {
        if (this.healthBarFill) {
            const healthPercent = Math.max(0, this.hp / this.maxHp);
            this.healthBarFill.width = this.width * healthPercent;

            // Change color based on health
            if (healthPercent > 0.6) {
                this.healthBarFill.setFillStyle(0x00ff00); // Green
            } else if (healthPercent > 0.3) {
                this.healthBarFill.setFillStyle(0xffff00); // Yellow
            } else {
                this.healthBarFill.setFillStyle(0xff0000); // Red
            }
        }
    }

    takeDamage(amount) {
        this.hp -= amount;
        
        // Visual feedback
        this.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            this.clearTint();
        });

        // Update health bar
        this.updateHealthBar();

        if (this.hp <= 0) {
            this.scene.main_sound.stop()
            this.scene.scene.restart();
        }
    }
}