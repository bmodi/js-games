// Game sprites
var player;
var player2
var level = 1;
var levelText;

var platforms;
var cursors;
var keyA;
var keyW;
var keyS;
var keyD;
var score = 0;
var scoreText;
var gameStatusText;
var gameOver = false;
var scene;

var playerSpeed=160;
var jumpSpeed = 330;

var player2Speed = 160;
var player2JumpSpeed = 330;

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
    keyW = scene.input.keyboard.addKey('W');  // Get key object
    keyA = scene.input.keyboard.addKey('A');
    keyS = scene.input.keyboard.addKey('S');
    keyD = scene.input.keyboard.addKey('D');

    scene.input.addPointer(1);

    scene.input.on('pointerdown', function (pointer) {
    }, scene);

    createSprites();
}

function createSprites() {
    player = createPlayer(scene);

    scene.physics.add.collider(player, platforms);

    
    player2 = createPlayer2(scene);
        
    scene.physics.add.collider(player2, platforms);

    scene.physics.resume();
}

function resetScene() {
        playerSpeed=160;
        player.destroy(true);

        player2Speed=160;
        player2.destroy(true);

        gameStatusText.setVisible(false);
} 

function createPlayer(parent) {
    // 100,450 is the starting position
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

function createPlayer2(parent) {
    var player2 = parent.physics.add.sprite(500, 450, 'dude');
    player2.setBounce(0.2);
    player2.setCollideWorldBounds(true);
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
    return player2;
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

        // Player2 control based on W/A/S/D keys
        if (keyA.isDown) {
            player2.setVelocityX(-player2Speed);
            player2.anims.play('left', true);
        } else if (keyD.isDown) {
            player2.setVelocityX(player2Speed);
            player2.anims.play('right', true);
        } else {
            player2.setVelocityX(0);
            player2.anims.play('turn');
        }

        if (keyW.isDown && player2.body.touching.down) {
            player2.setVelocityY(-jumpSpeed);
        } else if (keyS.isDown && !keyW.isDown && !keyA.isDown && !keyD.isDown) {
            player2.setVelocityY(jumpSpeed)
        }

    }
}