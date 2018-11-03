export function createPlatforms(parent) {
    var platforms = parent.physics.add.staticGroup();

    // Ground block
    addBlock(0, 500, 800, 100, 0x00aa00);

    // Jumping platforms
    addBlock(600, 250, 200, 50, 0xffff00);
    addBlock(0, 175, 200, 50, 0xffff00);
    addBlock(300, 350, 200, 50, 0xffff00);

    return platforms;

    function addBlock(startX, startY, width, height, color) {
        platforms.add(parent.add.rectangle(startX+width/2, startY+height/2, width, height, color));
    }
}
