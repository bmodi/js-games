import preload from "./preload.js";
import createGame from "./createGame.js";
import update from "./update.js";

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
        create: createGame,
        update: update
    }
};

var game = new Phaser.Game(config);
