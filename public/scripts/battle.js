// Game sprites
var player1;
var player2
var level = 1;
var levelText;

var platforms;
var cursors;
var keyA;
var keyW;
var keyS;
var keyD;
var keyQ;
var keyM;

var score = 0;
var scoreText;
var gameStatusText;
var gameOver = false;
var scene;
var gems;

var player1fireballs;
var player1FireballAllowed = true;
var player1ShootFireballRight = true;
var player1FireballDelay = 550;
var nightmareFireballDelay = 650;
var player1Damage = 25;
var nightmareDamage = 50;
var player2fireballs;
var player2FireballAllowed = true;
var player2ShootFireballRight = true;
var player1Health;
var player1HealthText;
var nightmareHealth = 200;
var nightmareSpeed = 100;
var nightmareJumpSpeed = 300;
var player2HealthText;
var player2Health = 100;
var gameOver = false;
var player1GemCount = 0;
var player2GemCount = 0;

var player1Speed=160;
var player1JumpSpeed = 330;

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
    this.load.spritesheet('dude', 'images/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('fireball', 'images/fireball.png');
    this.load.image('gem', 'images/gem.png');
}

function createScene() {

    var queryString = window.location.search;
    console.log("query string = " + queryString);
    var urlParams = new URLSearchParams(queryString);
    var p1Name = urlParams.get('playerone')
    console.log("p1name is " + p1Name);

    if (p1Name == 'Nightmare') {
        player1Health = nightmareHealth;
        player1Speed = nightmareSpeed
        player1JumpSpeed = nightmareJumpSpeed
        player1Damage = nightmareDamage
        player1FireballDelay = nightmareFireballDelay;
    }

    scene=this;
    scene.add.image(400, 300, 'sky');

    platforms = createPlatforms();

    cursors = scene.input.keyboard.createCursorKeys();
    keyW = scene.input.keyboard.addKey('W');  // Get key object
    keyA = scene.input.keyboard.addKey('A');
    keyS = scene.input.keyboard.addKey('S');
    keyD = scene.input.keyboard.addKey('D');
    keyQ = scene.input.keyboard.addKey('Q');
    keyM = scene.input.keyboard.addKey('M');

    scene.input.addPointer(1);
    
    player1HealthText = scene.add.text(480, 16, 'Player 1 health: ' + player1Health, { fontSize: '25px', fill: '#000' });
    player2HealthText = scene.add.text(16, 16, 'Player 2 health: ' + player2Health, { fontSize: '25px', fill: '#000' });

    scene.input.on('pointerdown', function (pointer) {
    }, scene);

    createSprites();
}

function createSprites() {
    player1 = createplayer1(scene);
    player1.setTint(0xff0000);
    
    player2 = createplayer2(scene);

    player1fireballs = createplayer1fireballs(scene);
    player2fireballs = createplayer2fireballs(scene);

    gems = createGems(scene);

    scene.physics.add.collider(player1,player2);
    scene.physics.add.collider(gems, platforms);
    scene.physics.add.collider(player1, platforms);
    scene.physics.add.collider(player2, platforms);
    scene.physics.add.collider(player1fireballs, platforms, player1FireballHitsWall, null, scene);
    scene.physics.add.collider(player2, player1fireballs, fireballHitsplayer2, null, scene);
    scene.physics.add.overlap(player1, gems, player1CollectsGem, null, scene);
    scene.physics.add.overlap(player2, gems, player2CollectsGem, null, scene);

    scene.physics.add.collider(player2fireballs, platforms, player2FireballHitsWall, null, scene);
    scene.physics.add.collider(player1, player2fireballs, fireballHitsplayer1, null, scene);

    scene.physics.resume();
}

function player1CollectsGem(player1, gem) {
    player1Speed = player1Speed*1.25
    player1JumpSpeed = player1JumpSpeed*1.25
    gem.destroy();
    player1GemCount++
    player1Health += 10;
    player1HealthText.setText('Player 1 health: ' + player1Health);
}

function player2CollectsGem(player2, gem){
    player2Speed = player2Speed*1.25
    player2JumpSpeed = player2JumpSpeed*1.25
    gem.destroy();
    player2GemCount++
    player2Health += 10;
    player2HealthText.setText('Player 2 health: ' + player2Health);
}

function player1FireballHitsWall(player1Fireball, platforms) {
    player1Fireball.destroy();
}

function fireballHitsplayer2(player2, player1Fireball) {
    player1Fireball.destroy();
    player2Health -= player1Damage;
    player2HealthText.setText('Player 2 health: ' + player2Health);
    if (player2Health <= 0) {
        this.physics.pause();
        gameStatusText = this.add.text(275, 250, 'Player Red Wins!', { fontSize: '30px', fill: '#000' });
        gameStatusText = this.add.text(player2.x - 65, player2.y - 5, 'DISSAPOINTMENT', { fontSize: '15px', fill: '#000' });
        gameOver = true;
    }
}

function createplayer1fireballs (parent) {
    player1fireballs = parent.physics.add.group();
    return player1fireballs;
}

function allowPlayer1Fireball() {
    player1FireballAllowed = true;
}

function player2FireballHitsWall(player2Fireball, platforms) {
    player2Fireball.destroy();
}

function fireballHitsplayer1(player1, player2Fireball) {
    player2Fireball.destroy();
    player1Health -= 25
    player1HealthText.setText('Player 1 health: ' + player1Health);
    if (player1Health <= 0) {
        this.physics.pause();
        gameStatusText = this.add.text(275, 250, 'Player Pink Wins!', { fontSize: '30px', fill: '#000' });
        gameStatusText = this.add.text(player1.x - 65, player1.y - 5, 'DISSAPOINTMENT', { fontSize: '15px', fill: '#000' });
        gameOver = true;
    }
}

function createplayer2fireballs (parent) {
    player2fireballs = parent.physics.add.group();
    return player2fireballs;
}

function allowplayer2Fireball() {
    player2FireballAllowed = true;
}



function resetScene() {
        player1Speed = 160;
        player1JumpSpeed = 330;
        player1.destroy(true);

        player2Speed = 160;
        player2JumpSpeed = 330;
        player2.destroy(true);
        gems.clear(true, true);

        player1fireballs.clear(true, true);
        player1ShootFireballRight = true;
        player2fireballs.clear(true,true);
        player2ShootFireballRight = true;
        player1GemCount = 0;
        player2GemCount = 0;

        gameOver = false;
        gameStatusText.setVisible(false);
} 

function createGem(parent, x, y) {
    var gem = gems.create(x, y, 'gem');
    gem.setBounce(0);
    gem.setCollideWorldBounds(true);
    gem.allowGravity = false;
    return gem;
}

function createGems(parent) {
    gems = parent.physics.add.group();
    createGem(parent, 50, 325);
    createGem(parent, 150, 325);
    createGem(parent, 750, 325);
    createGem(parent, 650, 325);
    createGem(parent, 150, 75);
    createGem(parent, 650, 75);
    createGem(parent, 325, 175);
    createGem(parent, 475, 175);
    createGem(parent, 400, 175);
    return gems;
}

function createplayer1(parent) {
    // 650,450 is the starting position
    var player1 = parent.physics.add.sprite(600, 450, 'dude');
    player1.setBounce(0.2);
    player1.setCollideWorldBounds(true);
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
    return player1;
}

function createplayer2(parent) {
    var player2 = parent.physics.add.sprite(200, 450, 'dude');
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

    //addBlock(300, 175, 1, 1, 0xff0000); //dot
    addBlock(0, 350, 200, 25, 0x0000ff) //lower left block
    addBlock(600, 350, 200, 25, 0x0000ff) //lower right block
    addBlock(300, 200, 200, 25, 0x0000ff) //center block
    addBlock(100, 100, 100, 25, 0x0000ff) //top left block
    addBlock(600, 100, 100, 25, 0x0000ff) //top right block

    return platforms;
}

function addBlock(startX, startY, width, height, color) {
    var newRectangle = scene.add.rectangle(startX + width / 2, startY + height / 2, width, height, color);
    platforms.add(newRectangle);
    return newRectangle;
}


function update() {
    if (!gameOver) {

        // player1 control based on left/right/jump keys
        if (cursors.left.isDown) {
            player1.setVelocityX(-player1Speed);
            player1.anims.play('left', true);
            player1ShootFireballRight = false;
        } else if (cursors.right.isDown) {
            player1.setVelocityX(player1Speed);
            player1.anims.play('right', true);
            player1ShootFireballRight = true;
        } else {
            player1.setVelocityX(0);
            player1.anims.play('turn');
        }

        if (cursors.up.isDown && player1.body.touching.down) {
            player1.setVelocityY(-player1JumpSpeed);
        } else if (cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown) {
            player1.setVelocityY(player1JumpSpeed)
        }

        // player2 control based on W/A/S/D keys
        if (keyA.isDown) {
            player2.setVelocityX(-player2Speed);
            player2.anims.play('left', true);
            player2ShootFireballRight = false;
        } else if (keyD.isDown) {
            player2.setVelocityX(player2Speed);
            player2.anims.play('right', true);
            player2ShootFireballRight = true;
        } else {
            player2.setVelocityX(0);
            player2.anims.play('turn');
        }

        if (keyW.isDown && player2.body.touching.down) {
            player2.setVelocityY(-player2JumpSpeed);
        } else if (keyS.isDown && !keyW.isDown && !keyA.isDown && !keyD.isDown) {
            player2.setVelocityY(player2JumpSpeed)
        }

        if (keyM.isDown && player1FireballAllowed && gameOver == false) {
            var player1Fireball = player1fireballs.create(player1.x, player1.y + 8, 'fireball');
            player1Fireball.setBounce(0);
            player1Fireball.body.setCollideWorldBounds(false);
            if (player1ShootFireballRight) {
                player1Fireball.setVelocityX(100);
            } else {
                player1Fireball.setVelocityX(-100)
            }
            player1Fireball.body.allowGravity = false;
            player1FireballAllowed = false;
            setTimeout (allowPlayer1Fireball, player1FireballDelay - 50*player1GemCount);
        }

        if (keyQ.isDown && player2FireballAllowed && gameOver == false) {
            var player2Fireball = player2fireballs.create(player2.x, player2.y + 8, 'fireball');
            player2Fireball.setBounce(0);
            player2Fireball.body.setCollideWorldBounds(false);
            if (player2ShootFireballRight) {
                player2Fireball.setVelocityX(100);
            } else {
                player2Fireball.setVelocityX(-100)
            }
            player2Fireball.body.allowGravity = false;
            player2FireballAllowed = false;
            setTimeout (allowplayer2Fireball, 550 - 50*player2GemCount);
        }

    }
}