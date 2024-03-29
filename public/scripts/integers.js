// Board constants
const CANVAS_WIDTH=1000;
const CANVAS_HEIGHT=800;
const SIDEBOARD_EDGE=100;
const SIDEBOARD_TOP=50;
const SIDEBOARD_SPACING=50;
const NUM_CIRCLES=7;
const CIRCLE_RADIUS=130;
const DISTRIBUTION_RADIUS=200;
const DISTRIBUTION_ANGLE=360.0/NUM_CIRCLES * Math.PI/180;
const LEAVE_OUT=[1, 3, 7, 8];
//const LEAVE_OUT=[1, 3, 7, 8, 11];
const BOARD_BACKGROUND_COLOUR='#2d2d2d';

// Circle style
const DEFAULT_CIRCLE_COLOUR=0x1a65ac;
const DEFAULT_CIRCLE_STROKE_WIDTH=2;
const CORRECT_CIRCLE_FILL_COLOUR=0x00aa33;
const CORRECT_CIRCLE_OPACITY=0.5;
const DROP_CIRCLE_HIGHLIGHT_COLOUR=0xff65ac;

// Label style
const FONT_HEIGHT=30;
const FIXED_LABEL_COLOUR="#ff0000";
const SIDE_LABEL_COLOUR="#00ffff";


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

        this.canvasX=CANVAS_WIDTH/2;
        this.canvasY=CANVAS_HEIGHT/2

        // These are the drawn circles, indexed from circle 0 being at coordinates (DISTRIBUTION_RADIUS, 0).
        // This first circle will be the furtherest right circle, with centre right on the x-axis.
        this.circles = [];
    }

    create ()
    {
        for (let i = 0; i < NUM_CIRCLES; i++) {
            var e = (new PolarPoint(this.canvasX, this.canvasY, DISTRIBUTION_RADIUS, i*DISTRIBUTION_ANGLE)).endPoint();
            this.circles[i] = this.add.circle(e.x, e.y, CIRCLE_RADIUS);
            this.circles[i].setStrokeStyle(DEFAULT_CIRCLE_STROKE_WIDTH, DEFAULT_CIRCLE_COLOUR);
            this.circles[i].numbersInside = new Set();
        }

        var numbers = getNumberSet(NUM_CIRCLES, -10, 10);
        console.log("answer: ", numbers);

        var sideboard_order=[1,2,3,4,5,6,7,8,9,10];
        var random_sideboard_order = sideboard_order.map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

        var sideboard_count=0;

        // Create all game text elements
        for (let i = 0; i < NUM_CIRCLES*2; i++) {
            if ( LEAVE_OUT.includes(i) ) {
                // Place this text element in a circle
                var e = (new PolarPoint(this.canvasX, this.canvasY, DISTRIBUTION_RADIUS, (i-1)*DISTRIBUTION_ANGLE/2)).endPoint();
                this.text[i] = this.add.text(e.x, e.y, numbers[i], { fontSize: FONT_HEIGHT+'px', fill: FIXED_LABEL_COLOUR }).setOrigin(0.5);

                // Assign the number to the correct circle set based on the DISTRIBUTION_ANGLE position
                // 1.  First position goes into the first AND final circles
                // 2.  Other even positions go into two circles (2,4,6...)
                // 3.  Odd positions go into a single circle (1,3,5...)
                if (i==0) {
                    // Last circle and first circle
                    this.circles[0].numbersInside.add( numbers[i] );
                    this.circles[NUM_CIRCLES-1].numbersInside.add( numbers[i] );
                } else if (i%2==0) {
                    // Even positions in two circles
                    this.circles[Math.floor((i-1)/2)].numbersInside.add( numbers[i] );
                    this.circles[Math.floor((i-1)/2+1)].numbersInside.add( numbers[i] );
                } else {
                    // Odd positions in single circle
                    console.log("placing element "+i+" inside circle "+Math.floor(i/2)+": "+numbers[i]);
                    this.circles[Math.floor(i/2)].numbersInside.add( numbers[i] );
                }

            } else {
                console.log("placing element "+i+" on sideboard: "+numbers[i]);
                // Put this text element on the side
                var x = CANVAS_WIDTH-SIDEBOARD_EDGE;
                var y = SIDEBOARD_TOP+sideboard_order[sideboard_count++]*SIDEBOARD_SPACING;
                this.text[i] = this.add.text(x, y, numbers[i], { fontSize: FONT_HEIGHT+'px', fill: SIDE_LABEL_COLOUR }).setOrigin(0.5);

                // Text elements on the side are draggable
                this.text[i].setInteractive();
                this.input.setDraggable(this.text[i]);
            }
            this.text[i].value = numbers[i];
        }

        // Set event handlers
        this.input.on('drag', this.drag);
        this.input.on('pointerup', this.mouseUp);
    }

    mouseUp(pointer) {
        console.log('mouseUp');
        for(let i=0; i < NUM_CIRCLES; i++) {
            this.scene.circles[i].setStrokeStyle(DEFAULT_CIRCLE_STROKE_WIDTH, DEFAULT_CIRCLE_COLOUR);
            console.log(this.scene.circles[i].numbersInside);
        }

        var solved=true;

        // Fill in
        for(let i=0; i < NUM_CIRCLES; i++) {
            let sum=0;
            this.scene.circles[i].numbersInside.forEach(num=>{sum+=num;});
            console.log(sum);
            if ( this.scene.circles[i].numbersInside.size>0 && sum==0) {
                // Got this circle right!
                this.scene.circles[i].setFillStyle(CORRECT_CIRCLE_FILL_COLOUR, CORRECT_CIRCLE_OPACITY);
            } else {
                this.scene.circles[i].setFillStyle(0x000000, 0);
                solved=false;
            }
        }

        if (solved) {
            console.log("solved");
            this.scene.add.text(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, "SOLVED!", { fontSize: FONT_HEIGHT*2+'px', fill: SIDE_LABEL_COLOUR }).setOrigin(0.5);
        }
    }

    drag(pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;

        for(let i=0; i < NUM_CIRCLES; i++) {
            if (Phaser.Math.Distance.Between(gameObject.scene.circles[i].x, gameObject.scene.circles[i].y, dragX, dragY) < gameObject.scene.circles[i].radius) {
                // Number is inside this circle
                gameObject.scene.circles[i].setStrokeStyle(5, DROP_CIRCLE_HIGHLIGHT_COLOUR);
                gameObject.scene.circles[i].numbersInside.add(gameObject.value);
            } else {
                // Clear other circles
                gameObject.scene.circles[i].numbersInside.delete(gameObject.value);
                gameObject.scene.circles[i].setStrokeStyle(DEFAULT_CIRCLE_STROKE_WIDTH, DEFAULT_CIRCLE_COLOUR);
            }
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
    backgroundColor: BOARD_BACKGROUND_COLOUR,
    scene: [ IntegerGame ]
};

const game = new Phaser.Game(config);
