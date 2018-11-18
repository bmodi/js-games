var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var scoreText;
var gameStatusText;
var gameOver = false;
var scene;

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: createScene,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'images/sky.png');
    this.load.image('ground', 'images/platform.png');
    this.load.image('star', 'images/star.png');
    this.load.image('bomb', 'images/bomb.png');
    this.load.spritesheet('dude', 'images/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function createScene()
{
    scene=this;
    scene.add.image(400, 300, 'sky');

    platforms = createPlatforms(scene);

    cursors = scene.input.keyboard.createCursorKeys();
    scene.input.addPointer(1);
    scoreText = scene.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    scene.input.on('pointerdown', function (pointer) {
        if (gameOver) {
            score=0;
            scoreText.setText('Score: ' + score);
            stars.clear(true,true);
            stars = createStars(scene);
            bombs.clear(true,true);
            bombs = createStars(scene);
            player.destroy();
            player = createPlayer(scene);

            gameOver=false;
        }
    }, scene);

    player = createPlayer(scene);
    stars = createStars(scene);
    bombs = createBombs(scene);

    scene.physics.add.collider(player, platforms);
    scene.physics.add.collider(stars, platforms);
    scene.physics.add.collider(bombs, platforms);

    scene.physics.add.overlap(player, stars, collectStar, null, scene);
    scene.physics.add.collider(player, bombs, hitBomb, null, scene);
}

function collectStar(player, star) {
    star.destroy();

    score += 10;
    scoreText.setText('Score: ' + score);

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
}

function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameStatusText = this.add.text(250, 200, 'Game Over', { fontSize: '64px', fill: '#000' });

    gameOver = true;
}

function createStars(parent) {
    var stars = parent.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setBounceX(0.5);
        child.setVelocityX(Phaser.Math.FloatBetween(-20, 20));
        child.setCollideWorldBounds(true);
    });

    return stars;
}

function createBombs(parent) {
    bombs = parent.physics.add.group();
    return bombs;
}

function createPlayer(parent) {
    var player = parent.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    parent.anims.create({
        key: 'left',
        frames: parent.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    parent.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });
    parent.anims.create({
        key: 'right',
        frames: parent.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    return player;
}

function createPlatforms(parent) {
    var platforms = parent.physics.add.staticGroup();

    // Ground block
    addBlock(0, 500, 800, 100, 0x00aa00);

    // Jumping platforms
    addBlock(600, 250, 200, 50, 0x8B4513);
    addBlock(0, 175, 200, 50, 0x8B4513);
    addBlock(300, 350, 200, 50, 0x8B4513);

    return platforms;

    function addBlock(startX, startY, width, height, color) {
        platforms.add(parent.add.rectangle(startX + width / 2, startY + height / 2, width, height, color));
    }
}

function update() {
    if (!gameOver) {
        if (cursors.left.isDown ||
            (this.input.pointer1.isDown && this.input.pointer1.x < 400)) {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown ||
            (this.input.pointer1.isDown && this.input.pointer1.x > 400)) {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if ((cursors.up.isDown ||
            (this.input.pointer1.isDown && this.input.pointer1.y < 300))
            && player.body.touching.down) {
            player.setVelocityY(-330);
        }
    }
}
