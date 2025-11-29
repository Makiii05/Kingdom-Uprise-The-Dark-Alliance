export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        const { scene, x, y, texture, frame, type } = data;
        super(scene.matter.world, x, y, texture, frame);

        this.type = type;
        this.scene = scene;
        scene.add.existing(this);

        this.spawnPoint = { x, y };

        this.lives = 3;
        if(this.type === 'archer'){
            this.hp = 7;
            this.damage = 4;
            this.speed = 4;
            this.walk = 'archer_walk';
            this.idle = 'archer_idle'

            this.weapon = scene.add.sprite(this.x, this.y, 'archer_weapon');
            this.weapon.setScale(0.8);
            this.weapon.setDepth(999);

            this.arrowSize = 0.8;
            this.arrowSpeed = 15;
        } else if(this.type === 'knight') {
            this.hp = 10;
            this.damage = 2;
            this.speed = 3;
            this.walk = 'knight_walk';
            this.idle = 'knight_idle'
        }
        this.lastDirection = 'right';
        this.isAttacking = false;
        this.isShooting = false;
        this.isDashing = false; 
        this.canDash = true;
        this.dashSpeed = 100;
        this.dashDuration = 300; 
        this.dashCooldown = 1000; 

        this.isAttackSpeeding = false;
        this.canAttackSpeed = true;
        this.attackSpeed = type == 'archer' ? 96 : 48;
        this.attackSpeedDuration = 5000;
        this.attackSpeedCooldown = 7000;

        this.isGoliath = false;
        this.canGoliath = true;
        this.goliath = 2.7;
        this.goliathDuration = 5000;
        this.goliathCooldown = 15000;

        this.isBuilding = false;
        this.canBuild = true;
        this.buildExp = 0;
        this.buildExpNeeded = 100;

        this.createBody(24, 48);
        this.setFixedRotation();
        this.setScale(0.7);
    }

    static preload(scene) {
        scene.load.atlas(
            'blue_knight',
            'asset/img/blue/knight.png',
            'asset/img/blue/knight_atlas.json'
        );
        scene.load.animation(
            'blue_knight_anim',
            'asset/img/blue/knight_anim.json'
        );
        scene.load.atlas(
            'blue_archer',
            'asset/img/blue/archer.png',
            'asset/img/blue/archer_atlas.json'
        );
        scene.load.animation(
            'blue_archer_anim',
            'asset/img/blue/archer_anim.json'
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
        if(this.type === 'archer'){
            this.handleWeapon()
            if (this.isShooting && !this.isAttacking) {
                this.shootArrow();
            }

        }
        this.handleMovement();
        this.handleAttack();
        this.handleAnimation();
        this.handleSkillAttack();
    }

    handleMovement() {
        if (this.isDashing) return;

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
            this.anims.play(this.walk, true);
        } else {
            this.anims.play(this.idle, true);
        }
    }

    handleWeapon(){
        if (!this.weapon) return;

        const pointer = this.scene.input.activePointer;
        const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);

        this.angle = Phaser.Math.Angle.Between(this.x, this.y, worldPoint.x, worldPoint.y);
        if(worldPoint.x >= this.x){
            this.weapon.setFlipY(false);
            this.weapon.x = this.x + 8;
            this.weapon.y = this.y;
        }else{
            this.weapon.setFlipY(true);
            this.weapon.x = this.x - 8;
            this.weapon.y = this.y;
        }

        this.weapon.setRotation(this.angle);
    }

    handleDash() {
        if (!this.canDash || this.isDashing) return;
        this.scene.sound.play("dash_sfx")
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
        this.scene.sound.play("power_up")
        this.setTint(0xff00ff);
        this.scene.time.delayedCall(this.attackSpeedDuration, () => {
            this.clearTint();
        });

        this.isAttackSpeeding = true;
        this.canAttackSpeed = false;
        
        this.scene.time.delayedCall(this.attackSpeedDuration, () => {
            this.isAttackSpeeding = false;
            if(this.type === 'archer'){
                this.scene.anims.anims.entries['archer_weapon_shoot'].frameRate = 24
            } else if(this.type === 'knight'){
                this.scene.anims.anims.entries['knight_attack_right'].frameRate = 12
                this.scene.anims.anims.entries['knight_attack_up'].frameRate = 12
                this.scene.anims.anims.entries['knight_attack_down'].frameRate = 12
            }
        });

        this.scene.time.delayedCall(this.attackSpeedCooldown, () => {
            this.canAttackSpeed = true;
        });

        if(this.type === 'archer'){
            this.scene.anims.anims.entries['archer_weapon_shoot'].frameRate = this.attackSpeed
        } else if(this.type === 'knight'){
            this.scene.anims.anims.entries['knight_attack_right'].frameRate = this.attackSpeed
            this.scene.anims.anims.entries['knight_attack_up'].frameRate = this.attackSpeed
            this.scene.anims.anims.entries['knight_attack_down'].frameRate = this.attackSpeed
        }
    }

    handleGoliath(){
        if (!this.canGoliath || this.isGoliath) return;
        this.scene.sound.play("power_up")
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
            this.setScale(0.7);
            this.createBody(24, 48);
            this.setFixedRotation();
            if(this.type === 'archer'){
                this.weapon.setScale(0.8);
                this.arrowSize = 0.8;
                this.arrowSpeed = 15
            }
        });

        this.scene.time.delayedCall(this.goliathCooldown, () => {
            this.canGoliath = true;
        });

        this.scene.matter.world.remove(this.playerCollider);
        this.scene.matter.world.remove(this.playerSensor);
        this.damage = this.damage * this.goliath
        this.setScale(this.goliath);
        this.createBody(72, 192);
        this.setFixedRotation();
        console.log("Goliath Activated");
        if(this.type === 'archer'){
            this.weapon.setScale(this.goliath);
            this.arrowSize = this.goliath;
            this.arrowSpeed = this.arrowSpeed * this.goliath
        }
    }

    handleBuild(){
        if (!this.canBuild || this.isBuilding) return;
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
        }else if (this.inputKeys && Phaser.Input.Keyboard.JustDown(this.inputKeys.b)) {
            this.handleBuild();
            return;
        }
        
    }

    handleAttack() {
        if (this.isAttacking || this.isDashing) return;

        if (Phaser.Input.Keyboard.JustDown(this.inputKeys.space)) {
            if(this.type != "knight") return;
            this.isAttacking = true;
            this.speed = 2;

            if(this.type === 'knight'){
                if (this.lastDirection === 'left' || this.lastDirection === 'right') {
                    this.anims.play('knight_attack_right', false);
                } else if (this.lastDirection === 'up') {
                    this.anims.play('knight_attack_up', false);
                } else if (this.lastDirection === 'down') {
                    this.anims.play('knight_attack_down', false);
                }
                this.scene.sound.play("sword_atk", {
                    volume: 0.5
                })
            }

            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.isAttacking = false;
                this.speed = 3;
                this.anims.play(this.idle, true);

                const enemies = this.scene.enemies.filter(enemy => {
                    let range = 60 * (this.isGoliath ? this.goliath + 1 : 1);
                
                    if (enemy.enemyType === 'boss_orc') {
                        range += 100; 
                    }

                    const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
                    return distance <= range; 
                });

                enemies.forEach(enemy => {
                    enemy.takeDamage(this.damage);
                });

            });
        }

        if (this.type === 'archer') {
            this.scene.input.on('pointerdown', (pointer) => {
                if (pointer.leftButtonDown()) this.isShooting = true;
            });

            this.scene.input.on('pointerup', (pointer) => {
                if (pointer.leftButtonReleased()) this.isShooting = false;
            });
        }

    }

    shootArrow() {
        if (this.isAttacking) return;

        this.isAttacking = true;
        this.speed = 2;

        this.weapon.anims.play('archer_weapon_shoot', false);

        this.scene.sound.play("sword_atk", {
            volume: 0.5
        })
        this.weapon.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.isAttacking = false;
            this.speed = 4;
            this.handleArrowTravel();

            // Optional: small delay between shots
            this.scene.time.delayedCall(100, () => {
                if (this.isShooting) this.shootArrow();
            });
        });
    }

    handleArrowTravel() {
        const angle = this.weapon.rotation; 

        const spawnX = this.weapon.x;
        const spawnY = this.weapon.y;

        const arrow = this.scene.matter.add.sprite(spawnX, spawnY, 'arrow');

        arrow.setScale(this.arrowSize);
        
        arrow.setBody({
            type: 'rectangle',
            width: 32,
            height: 8,
        });
        arrow.setSensor(true);
        
        arrow.damage = this.damage;

        arrow.setOnCollide((data) => {
            const bodyA = data.bodyA;
            const targetGameObject = bodyA.gameObject;

            if (targetGameObject && bodyA.label === 'enemyCollider') {
                if (typeof targetGameObject.takeDamage === 'function' && targetGameObject !== this) {
                    targetGameObject.takeDamage(arrow.damage);
                    if(!this.isGoliath || targetGameObject.enemyType === "boss_orc")
                        arrow.destroy();
                    return;

                }
            }
        });

        const speed = this.arrowSpeed;
        arrow.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        arrow.setRotation(angle);

        this.scene.time.delayedCall(2000, () => {
            if (arrow.active) arrow.destroy();
        });
    }

    takeDamage(amount) {
         if (this.isDashing) return;

        this.hp -= amount;
        console.log("Player HP:", this.hp);
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
            this.scene.main_sound.stop()
            this.scene.scene.restart();
        }
    }

    get velocity() {
        return this.body.velocity;
    }
}
