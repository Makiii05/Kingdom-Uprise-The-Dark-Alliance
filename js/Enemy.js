export default class Enemy extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        const { scene, x, y, texture, frame, target, type } = data;
        super(scene.matter.world, x, y, texture, frame);

        this.enemyType = type;
        this.scene = scene;
        scene.add.existing(this);
        this.target = target; 

        this.speed = 2;
        this.lastDirection = 'right';
        this.isAttacking = false;
        this.attackInterval = 1500;
        this.lastAttackTime = 0;
        this.attackRange = 50;

        if(type === 'red_knight'){
            this.hp = 3;
            this.damage = 1;
        } else if(type === 'goblin'){
            this.hp = 1;
            this.damage = 0.5;
        }

        this.idle = `${type}_idle`
        this.walk = `${type}_walk`
        this.attack_right = `${type}_attack_right`
        this.attack_down = `${type}_attack_down`
        this.attack_up = `${type}_attack_up`
        this.createBody();
        this.setFixedRotation();
        this.setScale(0.7);
    }

    static preload(scene) {
        scene.load.atlas('red_knight', 'asset/img/red/knight.png','asset/img/red/knight_atlas.json');
        scene.load.animation('red_knight_anim', 'asset/img/red/knight_anim.json');
        scene.load.atlas('goblin', 'asset/img/red/goblin.png','asset/img/red/goblin_atlas.json');
        scene.load.animation('goblin_anim', 'asset/img/red/goblin_anim.json');
    }

    createBody() {
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;

        const enemyCollider = Bodies.circle(this.x, this.y, 24, {
            isSensor: false,
            label: 'enemyCollider'
        });

        const enemySensor = Bodies.circle(this.x, this.y, 48, {
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
        this.handleMovement();
        this.handleAnimation();
    }

    handleMovement() {
        if (this.isAttacking || !this.target) return;

        const direction = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y);
        var condition = direction.length() > this.attackRange
        if(this.target.texture.key == "Castle_Blue"){
            condition = !Phaser.Physics.Matter.Matter.Collision.collides(this.body, this.target.body)
        }
        if (condition) {
            direction.normalize().scale(this.speed);
            this.setVelocity(direction.x, direction.y);
            if (this.velocity.x > 0) {
                this.setFlipX(false);
                this.lastDirection = 'right';
            } else if (this.velocity.x < 0) {
                this.setFlipX(true);
                this.lastDirection = 'left';
            }if (this.velocity.y > 0) {
                this.lastDirection = 'down';
            } else if (this.velocity.y < 0) {
                this.lastDirection = 'up';
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
            this.anims.play(`${this.idle}`, true);
        }
    }

    handleAttack() {
        if (this.isAttacking || (Date.now() - this.lastAttackTime) < this.attackInterval) return;

        this.isAttacking = true;
        this.speed = 1; 
        this.lastAttackTime = Date.now();

        if(Math.abs(this.target.x - this.x) > Math.abs(this.target.y - this.y)){
            if (this.x > 0 || this.x < 0){
                this.anims.play(`${this.attack_right}`, false);
            }
        }else{ 
            if (this.y > 0){
                this.anims.play(`${this.attack_up}`, false);
            }else{        
                this.anims.play(`${this.attack_down}`, false);
            }
        }

        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.isAttacking = false;
            this.speed = 2;
            this.anims.play(`${this.idle}`, true);
            
            if (this.body && this.target.body) {
                const touching = Phaser.Physics.Matter.Matter.Collision.collides(this.body, this.target.body);
                if (touching) {
                    this.target.takeDamage(this.damage);
                }
            }
        });
    }

    takeDamage(amount) {
        this.hp -= amount;
        this.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            this.clearTint();
        });
        
        if (this.hp <= 0) {

            this.setVelocity(0, 0);
            this.setCollisionCategory(null);
            this.scene.enemies = this.scene.enemies.filter(e => e !== this);
            this.scene.player.buildExp += 5;
            this.anims.play('enemy_death', false);
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.destroy();
            });

            return;
        }

    }

    get velocity() {
        return this.body.velocity;
    }
}
