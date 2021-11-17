class Point {

    constructor(x, y, r, theta) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.theta = theta;
    }
  
    endPoint() {
        return new Point(this.x+this.r*Math.cos(this.theta), this.y+this.r*Math.sin(this.theta));
    }
  }

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.i = 0;
        this.text = [];
        this.NUM_CIRCLES=7;
        this.CIRCLE_RADIUS=125;
        this.DISTRIBUTION_RADIUS=200;
        this.ANGLE=360.0/this.NUM_CIRCLES * Math.PI/180;
        this.CANVAS_WIDTH=1000;
        this.CANVAS_HEIGHT=700;
    }

    create ()
    {
        var gameObjects = [];
        
        var canvasX=this.CANVAS_WIDTH/2;
        var canvasY=this.CANVAS_HEIGHT/2
        for (let i = 0; i < this.NUM_CIRCLES; i++) {
            var c = new Point(canvasX, canvasY, this.DISTRIBUTION_RADIUS, i*this.ANGLE);
            var e = c.endPoint();
            gameObjects[i] = this.add.circle(e.x, e.y, this.CIRCLE_RADIUS);
            gameObjects[i].setStrokeStyle(2, 0x1a65ac);
        }
        
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
