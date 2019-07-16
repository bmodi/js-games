// Game sprites
var player;
var enemy;
var stars;
var bombs;
var gems;
var blueTeleporter;
var redTeleporter;
var gemsCollected = 0;
var level = 1;
var fireballs;

var roundWon = false;
var platforms;
var cursors;
var keyW;
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
var trailAllowed = true;
var bombTrailAllowed = true;
var numberOfStars = 1;
var levelText;
var requiredPointsText;
var changeSpeed = true;
var randomPlayerSpeed = 0;

var enemyDestroyed = false;
var assasinate = false;

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
    this.load.spritesheet('fireball', 'images/fireball.png');
}

function createScene()
{
    scene=this;
    scene.add.image(400, 300, 'sky');

    platforms = createPlatforms();

    cursors = scene.input.keyboard.createCursorKeys();
    keyW = scene.input.keyboard.addKey('W');  // Get key object

    scene.input.addPointer(1);
    scoreText = scene.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    levelText = scene.add.text(625, 16, 'level: 1', { fontSize: '32px', fill: '#000'});
    requiredPointsText = scene.add.text(325, 16, score + '/' + level ** 2 * 100, { fontSize: '32px', fill: '#000'})

    scene.input.on('pointerdown', function (pointer) {
        if (gameOver) {
            resetScene();
            createSprites();
            gameOver=false;
            roundWon = false;
        }
    }, scene);

    createSprites();
}

function createSprites() {
    player = createPlayer(scene);
    stars = createStars(scene);
    bombs = createBombs(scene);
    gems = createGems(scene);
    fireballs = createFireballs(scene);

    scene.physics.add.collider(player, platforms);
    scene.physics.add.collider(stars, platforms);
    scene.physics.add.collider(bombs, platforms);
    scene.physics.add.collider(gems, platforms);
    scene.physics.add.overlap(player, stars, collectStar, null, scene);
    scene.physics.add.collider(player, bombs, hitBomb, null, scene);
    scene.physics.add.overlap(player, gems, powerUp, null, scene);

    if (level >= 3 && roundWon) {
        enemy = createEnemy(scene);
        enemyCollider = scene.physics.add.collider(enemy, platforms);
        scene.physics.add.overlap(player, enemy, playerEnemyFight, null, scene);
    }
    console.log("level is " + level + " before creating teleporters")
    if (level >= 2 && roundWon) {
        createTeleporter();
        console.log("creating teleporters")
    }
    scene.physics.resume();
    console.log("sprites created for level "+level);
}

function resetScene() {
    console.log("reset function entered")
    var previousLevel = level-1;
    if (level >= 2 && roundWon == false) {
        console.log("destorying teleporters!!!!!!!!");
        blueTeleporter.destroy();
        redTeleporter.destroy();
    }
    score=0;
    playerSpeed=160;
    scoreText.setText('Score: ' + score);
    gameStatusText.setVisible(false);
    stars.clear(true,true);
    bombs.clear(true,true);
    gems.clear(true,true);
    if (level >= 3 && roundWon == false || level>=4) {
        enemy.destroy(true);
    }
    player.destroy(true);
    gemsCollected = 0;
    playerFrozen = false;
    jumpSpeed = 330;
    if (level >= 4) {
        badGem = Math.round( Math.random()*2 +2 )
    }

    numberOfStars = 1;
    console.log("reset done for level "+previousLevel);
    if (roundWon == false) {
        level = 1;
    }

    requiredPointsText.setText(score + '/' + level ** 2 * 100)
    levelText.setText('level: ' + level);
    console.log("reset function finished. Level is " + level)
} 

function assasinationFailed() {
    assasinate = false;
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

function powerUp(player, gem) {
    gem.destroy();
    if (level >= 5) {
        score -= level*5;
    } else if (level == 4) {
        score = score
    } else {
        score+=20
    }
    scoreText.setText('Score: ' + score);
    requiredPointsText.setText(score + '/' + level ** 2 * 100);
    gemsCollected = gemsCollected+1;

    if (gemsCollected == badGem && level>=4) {
        playerSpeed = 0;
        jumpSpeed = 0;
        playerFrozen = true;
        enemyWallPhase = true;
        enemyCollider.destroy();
        setTimeout (resumePlayerSpeed, 2000);
    } else {
        playerSpeed=playerSpeed*1.15;
        jumpSpeed=jumpSpeed*1.15;
        console.log("playerSpeed is " + playerSpeed);
    }
    if (gemsCollected >= numberOfGems) {
        scoreText.setText('Score: ' + score);
            if (score>=level ** 2 *100) {
                gameStatusText = this.add.text(75, 200, 'congratulations, you win!', { fontSize: '45px', fill: '#000' });
                gameOver = true;
                ++level;
                roundWon = true;
                this.physics.pause();
            } else {
                gameStatusText = this.add.text(150, 200, 'Your a complete failure. Try again.', { fontSize: '25px', fill: '#000' });
                gameOver = true;
                this.physics.pause();
            }
    } else if (gemsCollected >= numberOfGems - 1) {
        player.y = 100
        player.x = 350
    }
}

function collectStar(player, star) {
    star.destroy();
    score += 20;
    scoreText.setText('Score: ' + score);
    requiredPointsText.setText(score + '/' + level ** 2 * 100)

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    if (numberOfStars < level) {
        //Create a new bomb
        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }

    ++numberOfStars;
    if (numberOfStars >= 5) {
        numberOfStars = 0
    }
   
    //Create a new bouncing star
    star = stars.create(x, 16, 'star');
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
    if (assasinate == false) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameStatusText = this.add.text(250, 200, 'Game Over', { fontSize: '64px', fill: '#000' });
        gameOver = true;
    } else {
        enemy.destroy()
        score += 100;
        scoreText.setText('Score: ' + score);
        enemyDestroyed = true;
    }
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

function createFireballs (parent) {
    fireballs = parent.physics.add.group();
    return fireballs;
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

function starTrail() {
    var star = stars.create(enemy.x, enemy.y, 'star');
    star.setBounce(1);
    star.setCollideWorldBounds(true);
    star.setVelocity(Phaser.Math.Between(-200, 200), 20);
    star.allowGravity = true;
    
    trailAllowed = true;
}

function bombTrail() {
    var bomb = bombs.create(enemy.x, enemy.y, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = true;

    bombTrailAllowed = true;
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

function createTeleporter() {
    blueTeleporter = addBlock(50, 495, 30, 5, 0x3333ff); //blue teleporter
    redTeleporter = addBlock(675, 495, 30, 5, 0xff0000); //red teleporter
    console.log("createTeleporter function entered")
}

function update() {
    if (!gameOver) {
        // Control enemy to follow player
        if (level >= 3) {
            if (enemyDestroyed == false) {
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
                    enemy.setTint(0xff0000)
                } else {
                    enemy.setTint(0xffffff)
                }

                if (assasinate) {
                    if (player.x < enemy.x) {
                        enemy.setVelocityX(60);
                    } else if (player.x > enemy.x) {
                        enemy.setVelocityX(-60);
                    }
                }

                if (assasinate) {
                    if (player.y < enemy.y) {
                        enemy.setVelocityY(60);
                    } else if (player.y > enemy.y) {
                        enemy.setVelocityY(-60);
                    }
                }

                if (playerFrozen && trailAllowed) {
                    trailAllowed = false;
                    setTimeout(starTrail, 200);
                }

                if (playerFrozen && bombTrailAllowed && level >= 5) {
                    bombTrailAllowed = false;
                    setTimeout (bombTrail, 2500 - level*100);
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
            }
        }

        // if (score >= 40 && level <= 4) {
        //     gameStatusText = this.add.text(75, 200, 'Wow, you won the test round!', { fontSize: '45px', fill: '#000' });
        //         gameOver = true;
        //         ++level;
        //         roundWon = true;
        // }

        if (level >= 2) {
            if (player.x > 50 && player.x < 80 && player.y < 495 && player.y > 470) { //blue teleporter
                player.y = 225;
                player.x = 780;
            }

            if (player.x > 675 && player.x < 705 && player.y < 495 && player.y > 470) { //red teleporter
                player.y = 290;
                player.x = 225;
            }
        }

        function allowSpeedChange() {
            changeSpeed = true
        }

        function getRandomPlayerSpeed() {
            randomPlayerSpeed = Number (Math.round( Math.random()*100*level + 160   ))
            console.log("randomPlayerSpeed is " + randomPlayerSpeed);
            console.log("playerSpeed is " + playerSpeed)
            var nextSpeedChangeTimer = Math.round( Math.random()*250 + 250)
            setTimeout(allowSpeedChange, nextSpeedChangeTimer);
            return randomPlayerSpeed
        }

        // Player control based on left/right/jump keys
        if (cursors.left.isDown ||
            (this.input.pointer1.isDown && this.input.pointer1.x < 400)) {
                if (level >= 6 && changeSpeed) {
                    changeSpeed = false
                    playerSpeed = getRandomPlayerSpeed()
                    console.log("playerSpeed is " + playerSpeed);
                    player.setVelocityX(-playerSpeed)
            } else {
                player.setVelocityX(-playerSpeed);
            }
            player.anims.play('left', true);
        } else if (cursors.right.isDown ||
            (this.input.pointer1.isDown && this.input.pointer1.x > 400)) {
                if (level >= 6 && changeSpeed) {
                    changeSpeed = false;
                    playerSpeed = getRandomPlayerSpeed()
                    player.setVelocityX( playerSpeed  )
                } else {
                    player.setVelocityX(playerSpeed);
                }            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        if ((cursors.up.isDown ||
            (this.input.pointer1.isDown && this.input.pointer1.y < 300))
            && player.body.touching.down) {
            player.setVelocityY(-jumpSpeed);
        } else if (cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown) {
            player.setVelocityY(jumpSpeed)
            player.setTint(0x00ff00);
            // if (score == 0) {
            //     blueTeleporter.destroy();
            //     redTeleporter.destroy();
            //     console.log("teleporters destroyed")
            // }
        } else if (assasinate && level >= 3) {
            player.setTint(0xff0000);
        } else if (playerFrozen) {
            player.setTint(0xccff);
        } else player.setTint(0xffffff);

        if (keyW.isDown) {
            player.setTint(0xff0000);
        }
    }
}