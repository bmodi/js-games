import { createStars, createBombs } from "./createNonPlayerElements.js";
import { createPlayer } from "./createPlayer.js";

export var player;
export var stars;
export var bombs;
export var platforms;
export var cursors;
export var score = 0;
export var scoreText;

export default function createGame ()
{
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = createPlayer(this);

    cursors = this.input.keyboard.createCursorKeys();

    stars = createStars(this);
    bombs = createBombs(this);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);
}

function collectStar (player, star)
{
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);
}
