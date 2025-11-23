export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        const { scene, x, y, texture, frame } = data;
        super(scene.matter.world, x, y, texture, frame);

        this.scene = scene;
        scene.add.existing(this);

        this.spawnPoint = { x, y };

        this.lives = 3;
        this.hp = 10;
        this.damage = 2;
        this.speed = 3;
        this.lastDirection = 'right';
        this.isAttacking = false;

        this.isDashing = false; 
        this.canDash = true;
        this.dashSpeed = 30;
        this.dashDuration = 300; 
        this.dashCooldown = 1000; 

        this.isAttackSpeeding = false;
        this.canAttackSpeed = true;
        this.attackSpeed = 48;
        this.attackSpeedDuration = 5000;
        this.attackSpeedCooldown = 7000;

        this.isGoliath = false;
        this.canGoliath = true;
        this.goliath = 2.7;
        this.goliathDuration = 5000;
        this.goliathCooldown = 15000;

        this.createBody(24, 48);
        this.setFixedRotation();
        this.setScale(0.7);
    }

    static preload(scene) {
        scene.load.atlas(
            'blue_knight',
            'asset/img/blue/knight.png',
            'asset/img/blue/knight_atlas.json',
            'asset/img/sword_swing.json'
        );
        scene.load.animation(
            'blue_knight_anim',
            'asset/img/blue/knight_anim.json',
            'asset/img/sword_swing.json'
        );
    }

    createBody(collider, sensor) {
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;

        this.playerCollider = Bodies.circle(this.x, this.y, collider, {
            isSensor: false,
            label: 'playerCollider'
        });

        this.playerSensor = Bodies.circle(this.x, this.y, sensor, {
            isSensor: true,
            label: 'playerSensor'
        });

        const compoundBody = Body.create({
            parts: [this.playerCollider, this.playerSensor],
            frictionAir: 0.35
        });

        this.setExistingBody(compoundBody);
    }

    update() {
        this.handleMovement();
        this.handleAttack();
        this.handleAnimation();
        this.handleSkillAttack();
    }

    handleMovement() {
        if (this.isAttacking || this.isDashing) return;

        const v = new Phaser.Math.Vector2();

        if (this.inputKeys) {
            if (this.inputKeys.left.isDown){
                v.x = -1;
                this.lastDirection = 'left';
            }  
            if (this.inputKeys.right.isDown) {
                v.x =  1;
                this.lastDirection = 'right';
            }
            if (this.inputKeys.up.isDown) {
                v.y = -1;
                this.lastDirection = 'up';
            }
            if (this.inputKeys.down.isDown) {
                v.y =  1;
                this.lastDirection = 'down';
            }
            
        }

        v.normalize().scale(this.speed);
        this.setVelocity(v.x, v.y);
    }

    handleAnimation() {
        if (this.isAttacking) return;

        const moving =
            Math.abs(this.velocity.x) > 0.1 ||
            Math.abs(this.velocity.y) > 0.1;

        if (moving) {
            if (this.velocity.x > 0) {
                this.setFlipX(false);
                this.lastDirection = 'right';
            } else if (this.velocity.x < 0) {
                this.setFlipX(true);
                this.lastDirection = 'left';
            }
            this.anims.play('walk', true);
        } else {
            this.anims.play('idle', true);
        }
    }

    handleDash() {
        if (!this.canDash || this.isDashing) return;
        
        this.setTint(0x00ffff);
        this.scene.time.delayedCall(this.dashDuration, () => {
            this.clearTint();
        });

        this.isDashing = true;
        this.canDash = false;
        
        this.scene.time.delayedCall(this.dashDuration, () => {
            this.isDashing = false;
        });

        this.scene.time.delayedCall(this.dashCooldown, () => {
            this.canDash = true;
        });

        const dashVector = new Phaser.Math.Vector2(0, 0);
        
        if (this.inputKeys.left.isDown) dashVector.x = -1;
        if (this.inputKeys.right.isDown) dashVector.x = 1;
        if (this.inputKeys.up.isDown) dashVector.y = -1;
        if (this.inputKeys.down.isDown) dashVector.y = 1;

        if (dashVector.length() === 0) {
            if (this.lastDirection === 'left') dashVector.x = -1;
            else if (this.lastDirection === 'right') dashVector.x = 1;
            else if (this.lastDirection === 'up') dashVector.y = -1;
            else if (this.lastDirection === 'down') dashVector.y = 1;
        }

        dashVector.normalize().scale(this.dashSpeed);
        this.setVelocity(dashVector.x, dashVector.y);
    }

    handleAttackSpeed(){
        if (!this.canAttackSpeed || this.isAttackSpeeding) return;
        
        this.setTint(0xff00ff);
        this.scene.time.delayedCall(this.attackSpeedDuration, () => {
            this.clearTint();
        });

        this.isAttackSpeeding = true;
        this.canAttackSpeed = false;
        
        this.scene.time.delayedCall(this.attackSpeedDuration, () => {
            this.isAttackSpeeding = false;
            this.scene.anims.anims.entries['attack_right'].frameRate = 12
            this.scene.anims.anims.entries['attack_up'].frameRate = 12
            this.scene.anims.anims.entries['attack_down'].frameRate = 12
        });

        this.scene.time.delayedCall(this.attackSpeedCooldown, () => {
            this.canAttackSpeed = true;
        });

        this.scene.anims.anims.entries['attack_right'].frameRate = 48
        this.scene.anims.anims.entries['attack_up'].frameRate = 48
        this.scene.anims.anims.entries['attack_down'].frameRate = 48

    }

    handleGoliath(){
        if (!this.canGoliath || this.isGoliath) return;
        
        this.setTint(0xffff00);
        this.scene.time.delayedCall(this.goliathDuration, () => {
            this.clearTint();
        });

        this.isGoliath = true;
        this.canGoliath = false;
        
        this.scene.time.delayedCall(this.goliathDuration, () => {
            this.isGoliath = false;
            this.scene.matter.world.remove(this.playerCollider);
            this.scene.matter.world.remove(this.playerSensor);
            this.damage = 2
            this.setScale(0.7); // x3 size
            this.createBody(24, 48);
            this.setFixedRotation();
        });

        this.scene.time.delayedCall(this.goliathCooldown, () => {
            this.canGoliath = true;
        });

        this.scene.matter.world.remove(this.playerCollider);
        this.scene.matter.world.remove(this.playerSensor);
        this.damage = this.damage * this.goliath
        this.setScale(this.goliath); // x3 size
        this.createBody(72, 192);
        this.setFixedRotation();
        console.log("Goliath Activated");
    }

    handleSkillAttack(){
        if (this.inputKeys && Phaser.Input.Keyboard.JustDown(this.inputKeys.q)) {
            this.handleDash();
            return;
        }else if (this.inputKeys && Phaser.Input.Keyboard.JustDown(this.inputKeys.e)) {
            this.handleAttackSpeed();
            return;
        }else if (this.inputKeys && Phaser.Input.Keyboard.JustDown(this.inputKeys.c)) {
            this.handleGoliath();
            return;
        }
    }

    handleAttack() {
        if (this.isAttacking || this.isDashing) return;

        if (Phaser.Input.Keyboard.JustDown(this.inputKeys.space)) {
            this.isAttacking = true;
            this.speed = 2;

            if (this.lastDirection === 'left' || this.lastDirection === 'right') {
                this.anims.play('attack_right', false);
            } else if (this.lastDirection === 'up') {
                this.anims.play('attack_up', false);
            } else if (this.lastDirection === 'down') {
                this.anims.play('attack_down', false);
            }

            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.isAttacking = false;
                this.speed = 3;
                this.anims.play('idle', true);

                const enemies = this.scene.enemies.filter(enemy => {
                    const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
                    return distance <= 50*(this.isGoliath ? this.goliath + 1 : 1);
                });

                enemies.forEach(enemy => {
                    enemy.takeDamage(this.damage);
                });

            });
        }
    }

    takeDamage(amount) {
         if (this.isDashing) {
            return;
        }

        this.hp -= amount;
        if(!this.isAttackSpeeding) {
            this.setTint(0xff0000);
            this.scene.time.delayedCall(200, () => {
                this.clearTint();
            });
        }

        if (this.hp <= 0) {
            this.lives -= 1;
            this.hp = 10;
            this.setPosition(this.spawnPoint.x, this.spawnPoint.y);
            console.log("Player Lives:", this.lives);
        }
        if (this.lives <= 0) {
            console.log("Game Over");
            this.scene.scene.restart();
        }
    }

    get velocity() {
        return this.body.velocity;
    }
}
