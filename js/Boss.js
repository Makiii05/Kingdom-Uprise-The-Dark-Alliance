export default class Boss extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        const { scene, x, y, texture, frame, target, type } = data;
        super(scene.matter.world, x, y, texture, frame);

        this.x = x
        this.y = y
        this.enemyType = type;
        this.scene = scene;
        scene.add.existing(this);
        this.target = target; 

        this.speed = 2;
        this.lastDirection = 'right';
        this.isAttacking = false;
        this.attackInterval = 7000;
        this.lastAttackTime = 0;
        this.attackRange = 192;
        this.hp = 40;
        this.damage = 0.5;

        this.walk = `boss_orc_walk`
        this.attack = `boss_orc_attack`
        
        this.setScale(2.7);
        this.createBody();
        this.setFixedRotation();
        
        this.attackEvent = null;
    }

    static preload(scene) {
        scene.load.atlas('boss_orc', 'asset/img/boss_orc.png','asset/img/boss_orc_atlas.json');
        scene.load.animation('boss_orc_anim', 'asset/img/boss_orc_anim.json');
    }

    createBody() {
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;

        const enemyCollider = Bodies.circle(this.x, this.y, 96, {
            isSensor: false,
            label: 'enemyCollider'
        });

        const enemySensor = Bodies.circle(this.x, this.y - this.y / 16, 192, {
            isSensor: true,
            label: 'enemySensor'
        });

        const compoundBody = Body.create({
            parts: [enemyCollider, enemySensor],
            frictionAir: 0.35
        });

        this.setExistingBody(compoundBody);
    }

    update() {
        if (!this.active) return;
        
        this.handleMovement();
        this.handleAnimation();
    }

    handleMovement() {
        if (this.isAttacking || !this.target) return;

        if (!this.target.body) {
            this.setVelocity(0, 0);
            return;
        }

        const direction = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y);

        if (direction.length() > this.attackRange) {
            direction.normalize().scale(this.speed);
            this.setVelocity(direction.x, direction.y);
            if (this.velocity.x > 0) {
                this.setFlipX(false);
                this.lastDirection = 'right';
            } else if (this.velocity.x < 0) {
                this.setFlipX(true);
                this.lastDirection = 'left';
            }
        } else {
            this.handleAttack();
            this.setVelocity(0, 0);
        }
    }

    handleAnimation() {
        if (this.isAttacking) return;

        const moving =
            Math.abs(this.velocity.x) > 0.1 ||
            Math.abs(this.velocity.y) > 0.1;

        if (moving) {
            this.anims.play(`${this.walk}`, true);
        } else {
            this.anims.play(`${this.walk}`, true);
        }
    }

    handleAttack() {
        if (this.isAttacking || (Date.now() - this.lastAttackTime) < this.attackInterval) return;

        if (!this.target || !this.target.body) return;

        this.isAttacking = true;
        this.speed = 1; 
        this.lastAttackTime = Date.now();


        if(this.x > this.target.x || this.x < this.target.x){ 
            if (this.x > this.target.x){
                this.setFlipX(true);
            }else{        
                this.setFlipX(false);
            }
        }
        this.anims.play(`${this.attack}`, false);        

        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            if (!this.active) return;

            this.isAttacking = false;
            this.speed = 2;
            this.anims.play(`${this.walk}`, true);
        });

        this.scene.time.delayedCall(1100, () => {
            if (!this.active) return;

            let swing = 8
            this.attackEvent = this.scene.time.addEvent({
                delay: 250,
                callback: () => {
                    if (!this.scene || !this.body || !this.active) {
                        if (this.attackEvent) this.attackEvent.remove(false);
                        return;
                    }

                    if (!this.target || !this.target.active || !this.target.body) {
                        return;
                    }

                    this.scene.sound.play("orc_atk", {
                        volume: 0.5
                    })
                    const distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
                    
                    if(distance <= this.attackRange){
                        this.target.takeDamage(this.damage);
                    }
                    
                    swing--;
                    if(swing <= 0){
                        this.attackEvent.remove(false);
                        this.attackEvent = null;
                    }
                },
                callbackScope: this,
                loop: true
            });
        })
    }

    takeDamage(amount) {
        this.hp -= amount;
        this.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
             if(this.active) this.clearTint();
        });
        
        if (this.hp <= 0) {
            if (this.attackEvent) {
                this.attackEvent.remove(false);
                this.attackEvent = null;
            }

            this.setVelocity(0, 0);
            this.scene.enemies = this.scene.enemies.filter(e => e !== this);
            
            if(this.body) this.setCollisionCategory(null); 

            this.scene.sound.play("orc_death", {
                volume: 0.5
            })
            this.scene.player.buildExp += 20;
            this.anims.play('enemy_death', false);
            
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.destroy();
            });

            return;
        }
    }

    get velocity() {
        return this.body ? this.body.velocity : { x: 0, y: 0 };
    }
}