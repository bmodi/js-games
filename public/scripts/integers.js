const CANVAS_WIDTH=1000;
const CANVAS_HEIGHT=800;
const SIDEBOARD_EDGE=100;
const SIDEBOARD_TOP=50;
const SIDEBOARD_SPACING=50;
const FONT_HEIGHT=30;
const NUM_CIRCLES=7;
const CIRCLE_RADIUS=130;
const DISTRIBUTION_RADIUS=200;
const ANGLE=360.0/NUM_CIRCLES * Math.PI/180;
const NUM_TO_LEAVE=5;


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

class IntegerGame extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.i = 0;
        this.text = [];
        this.circles = [];
    }

    create ()
    {
        var canvasX=CANVAS_WIDTH/2;
        var canvasY=CANVAS_HEIGHT/2
        for (let i = 0; i < NUM_CIRCLES; i++) {
            var e = (new PolarPoint(canvasX, canvasY, DISTRIBUTION_RADIUS, i*ANGLE)).endPoint();
            this.circles[i] = this.add.circle(e.x, e.y, CIRCLE_RADIUS);
            this.circles[i].setStrokeStyle(2, 0x1a65ac);
            this.circles[i].numbersInside = new Set();
        }

        var numbers = getNumberSet(NUM_CIRCLES, -10, 10);

        var leave_out=[1, 3, 7, 8, 11];
        var sideboard_order=[1,2,3,4,5,6,7,8,9];
        var random_sideboard_order = sideboard_order.map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

        var sideboard_count=0;

        // Create all game text elements
        for (let i = 0; i < NUM_CIRCLES*2; i++) {
            if ( leave_out.includes(i) ) {
                // Place this text element in a circle
                var e = (new PolarPoint(canvasX, canvasY, DISTRIBUTION_RADIUS, i*ANGLE/2+ANGLE/2)).endPoint();
                this.text[i] = this.add.text(e.x, e.y, numbers[i], { fontSize: FONT_HEIGHT+'px', fill: "#ff0000" }).setOrigin(0.5);
            } else {
                // Put this text element on the side
                var x = CANVAS_WIDTH-SIDEBOARD_EDGE;
                var y = SIDEBOARD_TOP+sideboard_order[sideboard_count++]*SIDEBOARD_SPACING;
                this.text[i] = this.add.text(x, y, numbers[i], { fontSize: FONT_HEIGHT+'px', fill: "#00ffff" }).setOrigin(0.5);

                // Text elements on the side are draggable
                this.text[i].setInteractive();
                this.input.setDraggable(this.text[i]);
            }
            this.text[i].value = numbers[i];
        }

        // Set event handlers
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;

            for(let i=0; i < NUM_CIRCLES; i++) {
                if (Phaser.Math.Distance.Between(gameObject.scene.circles[i].x, gameObject.scene.circles[i].y, dragX, dragY) < gameObject.scene.circles[i].radius) {
                    // Number is inside this circle
                    gameObject.scene.circles[i].setStrokeStyle(5, 0xff65ac);
                    gameObject.scene.circles[i].numbersInside.add(gameObject.value);
                    console.log([...gameObject.scene.circles[i].numbersInside])
                } else {
                    // Clear other circles
                    gameObject.scene.circles[i].numbersInside.delete(gameObject.value);
                    gameObject.scene.circles[i].setStrokeStyle(2, 0x1a65ac);
                }
            }
        });

        this.input.on('pointerup', this.mouseUp);
    }

    mouseUp(pointer) {
        console.log('mouseUp');
        for(let i=0; i < NUM_CIRCLES; i++) {
            this.scene.circles[i].setStrokeStyle(2, 0x1a65ac);
        }
    }
}

function onUp() {
    console.log("Mouse up");
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
    scene: [ IntegerGame ]
};

const game = new Phaser.Game(config);
