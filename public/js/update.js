import { player, cursors } from "./createGame.js";

export default function update ()
{
    if (cursors.left.isDown ||
        (this.input.pointer1.isDown && this.input.pointer1.x<400))
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown ||
        (this.input.pointer1.isDown && this.input.pointer1.x>400))
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if ((cursors.up.isDown ||
        (this.input.pointer1.isDown && this.input.pointer1.y<300))
        && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}
