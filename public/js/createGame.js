import { createStars, createBombs } from "./createNonPlayerElements.js";
import { createPlayer } from "./createPlayer.js";
import { createPlatforms } from "./createPlatforms.js";

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

    platforms = createPlatforms(this);

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
