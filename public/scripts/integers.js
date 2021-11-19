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
        
        var numbers = getNumberSet(this.NUM_CIRCLES, -10, 10);

        for (let i = 0; i < this.NUM_CIRCLES*2; i++) {
            var e = (new PolarPoint(canvasX, canvasY, this.DISTRIBUTION_RADIUS, i*this.ANGLE/2+this.ANGLE/2)).endPoint();
            this.text[i] = this.add.text(e.x, e.y, numbers[i], { fontSize: FONT_HEIGHT+'px' }).setOrigin(0.5);

            this.text[i].setInteractive();

            this.input.setDraggable(this.text[i]);
        
            this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
                gameObject.x = dragX;
                gameObject.y = dragY;
            });
        }
    }
}

function getNumberSet(numberOfCircles, minNumber, maxNumber) {
    while (true) { // Will break loop when list with no repeats is made
        let numbersInRange = initializeNumbersInRange(minNumber, maxNumber);
        let addends = getAddendsFromNumbersInRange(numbersInRange, numberOfCircles);
        let sums = getSumsFromAddends(addends, numberOfCircles);
        var finalList = combineAddendsAndSums(addends, sums, numberOfCircles);
        if (hasNoRepeats(finalList)) {
            break;
        }
    }
    return finalList;
}

function initializeNumbersInRange(minNumber, maxNumber) {
    let numbersInRange = [];
    for (let i = minNumber; i <= maxNumber; i++) {
        numbersInRange.push(i);
    }
    return numbersInRange;
}

function getAddendsFromNumbersInRange(numbersInRange, numberOfCircles) {
    let addends = [];
    for (let i = 0; i < numberOfCircles; i++) {
        let index = Math.floor(Math.random() * numbersInRange.length);
        addends.push(numbersInRange[index]);
        numbersInRange.splice(index, 1);
    }
    return addends;
}

function getSumsFromAddends(addends, numberOfCircles) {
    let sums = [];
    for (let i = 0; i < numberOfCircles-1; i++) {
        sums.push((addends[i] + addends[i+1])*-1);
    }
    sums.push((addends[0] + addends[addends.length-1])*-1); // Takes care of wraparound
    return sums;
}

function combineAddendsAndSums(addends, sums, numberOfCircles) {
    let finalList = [];
    for (let i = 0; i < numberOfCircles; i++) {
        finalList.push(addends[i]);
        finalList.push(sums[i]);
    }
    return finalList;
}

function hasNoRepeats(finalList) {
    if (new Set(finalList).size == finalList.length) {
        return true;
    }
    return false;
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
