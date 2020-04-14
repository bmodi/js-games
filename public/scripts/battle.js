// Game sprites
var player;
var level = 1;
var levelText;

var platforms;
var cursors;
var keyF;
var keyS;
var score = 0;
var scoreText;
var gameStatusText;
var gameOver = false;
var scene;

var playerSpeed=160;
var jumpSpeed = 330;

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
    this.load.image('gem', 'images/gem.png');
    this.load.image('bomb', 'images/bomb.png');
    this.load.spritesheet('dude', 'images/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('enemy', 'images/invader.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('fireball', 'images/fireball.png');
    this.load.image('shield', 'images/shield.png');
}

function createScene()
{
    scene=this;
    scene.add.image(400, 300, 'sky');

    platforms = createPlatforms();

    cursors = scene.input.keyboard.createCursorKeys();
    keyF = scene.input.keyboard.addKey('F');  // Get key object
    keyS = scene.input.keyboard.addKey('S');

    scene.input.addPointer(1);
    scoreText = scene.add.text(16, 16, 'score: 0/' + level **2 * 100, { fontSize: '25px', fill: '#000' });
    levelText = scene.add.text(625, 16, 'level: 1', { fontSize: '25px', fill: '#000'});

    scene.input.on('pointerdown', function (pointer) {
        if (gameOver && level <= 7) {
            resetScene();
            createSprites();
            gameOver = false;
            roundWon = false;
        }
    }, scene);

    createSprites();
}

function createSprites() {
    player = createPlayer(scene);

    scene.physics.add.collider(player, platforms);

    scene.physics.resume();
}

function resetScene() {
        score=0;
        playerSpeed=160;
        gameStatusText.setVisible(false);
        player.destroy(true);
        scoreText.setText('score: ' + score + '/' + level **2 * 100);
} 

function resumePlayerSpeed() {
    playerSpeed = 160*1.15*badGem;
    jumpSpeed = 330*1.15*badGem;
    playerFrozen = false;
    assasinate = true;

    if (level >= 3) {
        enemyWallPhase = false;
        scene.physics.add.collider(enemy, platforms);
            if (enemy.x > 300 && enemy.x < 400 && enemy.y > 51 && enemy.y < 226) {
                enemy.y = 325;
                    if (player.x < 400) {
                        enemy.x = 650
                    } else {
                        enemy.x = 100
                    }
            }
    }

    setTimeout (assasinationFailed, 3000)

    return playerSpeed
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

function createPlatforms() {
    platforms = scene.physics.add.staticGroup();
        
    // Ground block
    addBlock(0, 500, 800, 100, 0x00aa00);

    // Jumping platforms
    addBlock(699, 250, 101, 25, 0x8B4513);
    addBlock(175, 325, 250, 25, 0x8B4513); //center horizontal
    addBlock(525, 150, 25, 300, 0x8B4513); // vertical block
    addBlock(675, 150, 25, 125, 0x8B4513); // top L vertical piece
    addBlock(675, 375, 125, 25, 0x8B4513); //blocker of death
    addBlock(0, 225, 100, 25, 0x8B4513);
    //addBlock(300, 175, 1, 1, 0xff0000); //dot
    addBlock(300, 224, 100, 10, 0x8B4513); //box bottom
    addBlock(300, 50, 100, 10, 0x8B4513); //box top
    addBlock(300, 51, 10, 175, 0x8B4513); //box left
    addBlock(390, 51, 10, 175, 0x8B4513); //box right

    return platforms;
}

function addBlock(startX, startY, width, height, color) {
    var newRectangle = scene.add.rectangle(startX + width / 2, startY + height / 2, width, height, color);
    platforms.add(newRectangle);
    return newRectangle;
}


function update() {
    if (!gameOver) {

        // Player control based on left/right/jump keys
        if (cursors.left.isDown) {
            player.setVelocityX(-playerSpeed);
            player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(playerSpeed);
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-jumpSpeed);
        } else if (cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown) {
            player.setVelocityY(jumpSpeed)
        }
    }
}