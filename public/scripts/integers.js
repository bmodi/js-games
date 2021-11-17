const CANVAS_WIDTH=1000;
const CANVAS_HEIGHT=800;
const FONT_HEIGHT=30;

class PolarPoint {

    constructor(x, y, r, theta) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.theta = theta;
    }
  
    endPoint() {
        return new PolarPoint(this.x+this.r*Math.cos(this.theta), this.y+this.r*Math.sin(this.theta));
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
        this.CIRCLE_RADIUS=130;
        this.DISTRIBUTION_RADIUS=200;
        this.ANGLE=360.0/this.NUM_CIRCLES * Math.PI/180;
    }

    create ()
    {
        var circles = [];
        
        var canvasX=CANVAS_WIDTH/2;
        var canvasY=CANVAS_HEIGHT/2
        for (let i = 0; i < this.NUM_CIRCLES; i++) {
            var e = (new PolarPoint(canvasX, canvasY, this.DISTRIBUTION_RADIUS, i*this.ANGLE)).endPoint();
            circles[i] = this.add.circle(e.x, e.y, this.CIRCLE_RADIUS);
            circles[i].setStrokeStyle(2, 0x1a65ac);
        }
        
        for (let i = 0; i < 5; i++) {
            var number = Math.floor(Math.random() * 100)+1;
            this.text[i] = this.add.text(16, 16+40*i, number, { fontSize: FONT_HEIGHT+'px' });

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
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#2d2d2d',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
