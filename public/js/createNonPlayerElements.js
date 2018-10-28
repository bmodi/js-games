export function createStars(parent) {
    var newStars = parent.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    newStars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setBounceX(0.5);
        child.setVelocityX(Phaser.Math.FloatBetween(-20, 20));
        child.setCollideWorldBounds(true);
    });
    return newStars;
}

export function createBombs(parent) {
    var newBombs = parent.physics.add.group({
        key: 'bomb',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    newBombs.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setBounceX(0.5);
        child.setVelocityX(Phaser.Math.FloatBetween(-20, 20));
        child.setCollideWorldBounds(true);
    });
    return newBombs;
}
