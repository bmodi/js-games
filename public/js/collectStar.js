import { score, scoreText } from "./createGame.js";

export default function collectStar (player, star)
{
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);
}
