// Game sprites
var player;
var enemy;
var stars;
var bombs;
var gems;
var gemsCollected = 0;

var platforms;
var cursors;
var score = 0;
var scoreText;
var gameStatusText;
var gameOver = false;
var scene;
var playerFrozen = false;
var enemyWallPhase = false;
var enemyCollider;
var badGem = Math.round( Math.random()*2 +2 )
var numberOfGems = 8;

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
            resetScene();
            createSprites();
            gameOver=false;
        }
    }, scene);

    createSprites();
}

function createSprites() {
    player = createPlayer(scene);
    enemy = createEnemy(scene);
    stars = createStars(scene);
    bombs = createBombs(scene);
    gems = createGems(scene);

    scene.physics.add.collider(player, platforms);
    scene.physics.add.collider(stars, platforms);
    scene.physics.add.collider(bombs, platforms);
    scene.physics.add.collider(gems, platforms);
    enemyCollider = scene.physics.add.collider(enemy, platforms);

    scene.physics.add.overlap(player, stars, collectStar, null, scene);
    scene.physics.add.collider(player, bombs, hitBomb, null, scene);
    scene.physics.add.overlap(player, enemy, playerEnemyFight, null, scene);
    scene.physics.add.overlap(player, gems, powerUp, null, scene);

    scene.physics.resume();
}

function resetScene() {
    score=0;
    playerSpeed=160;
    scoreText.setText('Score: ' + score);
    gameStatusText.setVisible(false);
    stars.clear(true,true);
    bombs.clear(true,true);
    gems.clear(true,true);
    enemy.destroy(true);
    player.destroy(true);
    gemsCollected = 0;
    playerFrozen = false;
    jumpSpeed = 330;
    scene.physics.add.collider(enemy, platforms);
} 

function resumePlayerSpeed() {
    playerSpeed = 160*1.75*badGem;
    jumpSpeed = 330;
    playerFrozen = false;
    enemyWallPhase = false;
    scene.physics.add.collider(enemy, platforms);
        if (enemy.x > 300 && enemy.x < 400 && enemy.y > 51 && enemy.y < 226) {
            enemy.y = 50;
                if (player.x < 400) {
                    enemy.x = 700
                } else {
                    enemy.x = 100
                }
        }
    return playerSpeed
}

function powerUp(player, gem) {
    gem.destroy();

    score += 10;
    scoreText.setText('Score: ' + score);
    gemsCollected = gemsCollected+1;


    if (gemsCollected == badGem) {
        playerSpeed = 0;
        jumpSpeed = 0;
        playerFrozen = true;
        enemyWallPhase = true;
        enemyCollider.destroy();
        setTimeout (resumePlayerSpeed, 2000);
    } else {
        playerSpeed=playerSpeed*1.75;
    }
        if (gemsCollected >= numberOfGems && score>=10) {
            score = score*2
            scoreText.setText('Score: ' + score);
                if (score>=500) {
                    gameStatusText = this.add.text(250, 200, 'congratulations, you win!', { fontSize: '64px', fill: '#000' });
                    gameOver = true;
                } else {
                    gameStatusText = this.add.text(50, 200, '*shakes head in disapointment* "not good enough"', { fontSize: '25px', fill: '#000' });
                    gameOver = true;
                }
        } else if (gemsCollected >= numberOfGems - 1) {
            player.y = 100
            player.x = 350
        }
}

function collectStar(player, star) {
    star.destroy();

    score += 10;
    scoreText.setText('Score: ' + score);

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    // Create a new bomb
    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
   
    // Create a new bouncing star
    var star = stars.create(x, 16, 'star');
    star.setBounce(1);
    star.setCollideWorldBounds(true);
    star.setVelocity(Phaser.Math.Between(-200, 200), 20);
    star.allowGravity = false;
}

function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameStatusText = this.add.text(250, 200, 'Game Over', { fontSize: '64px', fill: '#000' });
    gameOver = true;
}

function playerEnemyFight(player, enemy) {
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

function createGem(parent, x, y) {
    var gem = gems.create(x, y, 'gem');
    gem.setBounce(0);
    gem.setCollideWorldBounds(true);
    gem.allowGravity = false;
    return gem;
}

function createGems(parent) {
    gems = parent.physics.add.group();
    createGem(parent, 200, 200);
    createGem(parent, 300, 400);
    createGem(parent, 50, 100);
    createGem(parent, 500, 200);
    createGem(parent, 350, 100);
    createGem(parent, 600, 100);
    createGem(parent, 135, 100);
    createGem(parent, 750, 150)
    return gems;
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

function createEnemy(parent) {
    var enemy = parent.physics.add.sprite(700, 100, 'enemy');
    enemy.setBounce(0.2);
    enemy.setCollideWorldBounds(true);
    parent.anims.create({
        key: 'default',
        frames: parent.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    return enemy;
}

function createPlatforms(parent) {
    var platforms = parent.physics.add.staticGroup();
        
    // Ground block
    addBlock(0, 500, 800, 100, 0x00aa00);

    // Jumping platforms
    addBlock(699, 250, 101, 25, 0x8B4513);
    addBlock(175, 325, 250, 25, 0x8B4513);
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

    function addBlock(startX, startY, width, height, color) {
        platforms.add(parent.add.rectangle(startX + width / 2, startY + height / 2, width, height, color));
    }
}

function update() {
    if (!gameOver) {
        // Control enemy to follow player
        enemy.anims.play('default', true);

        if (player.x < enemy.x && playerFrozen) {
            enemy.setVelocityX(-120);
        } else if (player.x > enemy.x && playerFrozen) {
            enemy.setVelocityX(120);
        } else if (player.x < enemy.x) {
            enemy.setVelocityX(-60);
        } else if (player.x > enemy.x) {
            enemy.setVelocityX(60);
        }

        if (playerFrozen) {
            enemy.setTint(0xff0000);
        } else {
            enemy.setTint(0xffffff)
        } 

        if (player.y < enemy.y && playerFrozen) {
            enemy.setVelocityY(-120);
        } else if (player.y > enemy.y && playerFrozen) {
            enemy.setVelocityY(120);
        } else if (player.y < enemy.y) {
            enemy.setVelocityY(-60);
        } else if (player.y > enemy.y) {
            enemy.setVelocityY(60);
        }

        // Player control based on left/right/jump keys
        if (cursors.left.isDown ||
            (this.input.pointer1.isDown && this.input.pointer1.x < 400)) {
            player.setVelocityX(-playerSpeed);
            player.anims.play('left', true);
        } else if (cursors.right.isDown ||
            (this.input.pointer1.isDown && this.input.pointer1.x > 400)) {
            player.setVelocityX(playerSpeed);
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        if ((cursors.up.isDown ||
            (this.input.pointer1.isDown && this.input.pointer1.y < 300))
            && player.body.touching.down) {
            player.setVelocityY(-jumpSpeed);
        } else if (cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown) {
            player.setTint(0x00ff00);
        } else player.setTint(0xffffff);
    }
}