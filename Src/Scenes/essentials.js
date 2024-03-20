import Phaser from "phaser";
import sky from "./assets/sky.png";
import bomb from "./assets/bomb.png";
import stride from "./assets/platform.png";
import star from "./assets/star.png";
import bubble from "./assets/bubble.png"
import dude from "./assets/dude.png";

class assests extends Phaser.Scene {
    constructor() {
        super();
        this.player = null;
        this.cursor = null;
        this.platforms = null;
        this.bubbles = null;
        this.bomb = null;
        this.score = 0;
        this.scoreText = null;
        this.gameOver = false;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.highScoreText = null;
    }



    preload() {
        this.load.image('sky', sky);
        this.load.image('ground', stride);
        this.load.image('bomb', bomb);
        this.load.image('star', star)
        this.load.spritesheet('dude', dude, { frameWidth: 32, frameHeight: 48 });
        this.load.image('bubble', bubble);
    }

    create() {

        this.add.image(400, 300, 'sky');

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 480, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 300, 'ground');
        this.platforms.create(50, 200, 'ground');
        this.platforms.create(750, 120, 'ground');

        this.player = this.physics.add.sprite(100, 350, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.scoreText = this.add.text(20, 20, `${'Score: ' + this.score}`, { fontSize: '20px', fill: '#000' })

        this.highScoreText = this.add.text(150, 20, `${'High Score: ' + this.highScore}`, { fontSize: '20px', fill: '#fff' })
        this.cursor = this.input.keyboard.createCursorKeys();

        this.bubbles = this.physics.add.group({
            key: 'bubble',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });



        this.bubbles.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        }, this);

        this.bomb = this.physics.add.group();

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.bubbles, this.platforms);
        this.physics.add.collider(this.bomb, this.platforms);
        this.physics.add.overlap(this.player, this.bubbles, this.destroy, null, this);
        this.physics.add.overlap(this.player, this.bomb, this.killGame, null, this);


    }

    destroy(dude, bubbles) {
        bubbles.disableBody(true, true);

        this.score++;
        this.scoreText.setText('Score: ' + this.score);

        if (this.bubbles.countActive(true) === 0) {
            //  A new batch of stars to collect
            this.bubbles.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            let bombs = this.bomb.create(x, 16, 'bomb');
            bombs.setBounce(1);
            bombs.setCollideWorldBounds(true);
            bombs.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bombs.allowGravity = false;

        }

    }

    destroyAfter5sec(bubbles, platforms) {
        this.time.delayedCall(5000, () => {
            bubbles.disableBody(true, true);
        });
    }

    killGame(player, bomb) {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        localStorage.setItem('highScore', this.score > this.highScore ? this.score : this.highScore)

        this.gameOver = true;

        this.add.text(200, 450, "Resfresh Browser To Restart Game!!!", { fontSize: '20px', fill: '#f00' })

    }
    update() {
        if (this.gameOver === true) {
            return
        }
        if (this.cursor.left.isDown) {

            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (this.cursor.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursor.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }


    }


}

export default assests;