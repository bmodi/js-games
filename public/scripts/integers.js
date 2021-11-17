class Example extends Phaser.Scene
{

    constructor ()
    {
        super();
        this.i = 0;
        this.text = [];
        this.ANGLE = 360.0/7.0;
        this.CANVAS_WIDTH=1000;
        this.CANVAS_HEIGHT=700;
    }

    create ()
    {
        var gameObjects = [];
        
        for (let i = 0; i < 7; i++) {
            gameObjects[i] = this.add.circle(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2, 125);
            gameObjects[i].setStrokeStyle(2, 0x1a65ac);
        }

        var circle = new Phaser.Geom.Circle(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT/2, 200);
        Phaser.Actions.PlaceOnCircle(gameObjects, circle, 0, 270.15);
        
        for (let i = 0; i < 5; i++) {
            var number = Math.floor(Math.random() * 100)+1;
            this.text[i] = this.add.text(16, 16+40*i, number, { fontSize: '35px' });

            this.text[i].setInteractive();

            this.input.setDraggable(this.text[i]);
        
            this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        
                gameObject.x = dragX;
                gameObject.y = dragY;
        
            });
        }
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 1000,
    height: 700,
    backgroundColor: '#2d2d2d',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
