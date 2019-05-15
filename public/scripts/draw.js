
var colour = 'rgba(0, 0, 255)'

function drawLine(x1, y1, x2, y2) {
    var canvas = document.getElementById('MainCanvas');
    canvas.style.backgroundColor = 'rgba(0, 0, 0)';

    var context = canvas.getContext('2d');
    context.strokeStyle = colour;
    // Reset the current path
    context.beginPath();
    // Staring point (10,45)
    context.moveTo(x1+400, 400-y1);
    // End point (180,47)
    context.lineTo(x2+400, 400-y2);
    // Make the line visible
    context.stroke();
}

function drawCircle(x, y, radius) {
    var canvas = document.getElementById('MainCanvas');
    var context = canvas.getContext('2d');
    context.strokeStyle = colour;
    context.beginPath();
    context.arc(x+400, 400-y, radius, 0, 2 * Math.PI);
    context.stroke();
}

var boxCounterUp = 0;
var boxCounterDown = 0;
var boxCounterRight = 0;
var boxCounterLeft = 0;
var x1=-300;
var y1=50;
var randomShape;
var moveBox = 10;
var moveBoxSize = 100;
var houseGap = 0;
var houseSize = 0;
var totalHouseWidth = 0;
var showColour;

function drawStar(size, step, x, y) {
    for(var i=0; i<=size; i=i+step ) {
        drawLine(x,y + size-i,x + i,y);
        drawLine(x,y -size+i,x + i,y);
        drawLine(x,y + size-i,x -i,y);
        drawLine(x,y -size+i,x -i,y);
    }
}

function drawBox(x, y, size) {
    drawLine(x,y,x+size,y);
    drawLine(x+size,y,x+size,y+size);
    drawLine(x+size,y+size, x, y+size);
    drawLine(x,y+size,x,y);
}

function drawHouse(x,y, houseBoxSize) {
    drawBox(x,y,houseBoxSize)
    drawTriangle(x+houseBoxSize/2,y+houseBoxSize*1.5, houseBoxSize/2)
}

function drawTriangle(x,y, triangleSize) {
    drawLine(x, y, x+triangleSize, y-triangleSize);
    drawLine(x+triangleSize, y-triangleSize, x-triangleSize, y-triangleSize);
    drawLine(x-triangleSize, y-triangleSize, x, y);
}

function drawStarrySky() {
    for(var j=0; j<=20; ++j) {
        drawStar(5+Math.random()*5, 1, -400+Math.random()*800, Math.random()*400);
    }   
}

// Create a new list item when clicking on the "Add" button
function drawCommand() {
    var inputValue = document.getElementById("myInput").value;
    showColour.setVisible(false);
    showColour = this.add.text(0, 0, 'the colour is ' + colour, { fontSize: '64px', fill: '#ffffff' });
    if (!inputValue) {
        alert("You must write something!");
    } else {
        if (inputValue=="starry sky") {
            drawStarrySky();
        } else if ( inputValue.substring(0, 4) == "star") {
            var starCoordinates = inputValue.substring(5);
            var starXDigits = starCoordinates.search(" ");
            var starYSize = inputValue.substring(6 + starXDigits);
            var starYDigits = starYSize.search(" ");
            var starX = Number (inputValue.substring(5, 5 + starXDigits));
            var starY = Number (inputValue.substring(6 + starXDigits, 6 + starXDigits + starYDigits));
            var starSize = Number (inputValue.substring(7 + starXDigits + starYDigits));
            console.log("starCoordinates are " + starCoordinates);
            console.log("starXDigits is " + starXDigits);
            console.log("starX is " + starX);
            console.log("starY is " + starY);
            console.log("starSize is " + starSize);
            console.log("starYDigits is " + starYDigits);
            drawStar(starSize, 10, starX, starY);
        } else if ( inputValue=="small star") {
            drawStar(100, 5, 100, 50);
        } else if ( inputValue=="box" ) {
            drawBox(x1,y1,100);
        } else if (inputValue.substring(0, 9) == "small box") {
            var boxCoordinates = inputValue.substring(10);
            var boxXDigits = boxCoordinates.search(" ");
            var boxYSize = inputValue.substring(11 + boxXDigits)
            var boxYDigits = boxYSize.search(" ");
            var boxX = Number(inputValue.substring(10, 10 + boxXDigits));
            var boxY = Number(inputValue.substring(11 + boxXDigits, 11 + boxXDigits + boxYDigits));
            var boxSize = Number (inputValue.substring(12 + boxXDigits + boxYDigits))
            console.log("boxCoordinates are " + boxCoordinates);
            console.log("boxXDigits is " + boxXDigits);
            console.log("boxX is " + boxX);
            console.log("boxY is " + boxY);
            console.log("box size is " + boxSize);
            drawBox(boxX, boxY, boxSize);
        } else if (inputValue=="big box") {
            drawBox(0,0, 200)
        } else if ( inputValue=="triangle") {
            drawTriangle(0, 100, 200);
        } else if (inputValue=="house"){
            drawHouse(0, 0, 200);
        } else if (inputValue=="stars") {
            for (var i=0; i<=1; ++i) {
                drawStar(200, 10, -175 + 300*i, 175-300*i);
            }
        } else if (inputValue=="w") {
            ++boxCounterUp
            drawBox(x1 - boxCounterLeft*moveBox + boxCounterRight*moveBox ,y1+boxCounterUp*moveBox - boxCounterDown*moveBox,moveBoxSize)
        } else if (inputValue=="a") {
            ++boxCounterLeft
            drawBox(x1 - boxCounterLeft*moveBox + boxCounterRight*moveBox,y1+boxCounterUp*moveBox - boxCounterDown*moveBox,moveBoxSize)
        } else if (inputValue=="d") {
            ++boxCounterRight
            drawBox(x1 - boxCounterLeft*moveBox + boxCounterRight*moveBox,y1+boxCounterUp*moveBox - boxCounterDown*moveBox,moveBoxSize)
        } else if (inputValue=="s") {
                ++boxCounterDown
                drawBox(x1 - boxCounterLeft*moveBox + boxCounterRight*moveBox,y1+boxCounterUp*moveBox - boxCounterDown*moveBox,moveBoxSize)
        } else if (inputValue=="anything") {
            randomShape = Math.round(Math.random()*4)
            if (randomShape == 0) {
                drawStar(Math.round(Math.random()*100), 10, Math.round(Math.random()*300) - Math.round(Math.random()*400), Math.round(Math.random()*300) - Math.round(Math.random()*300));
            } else if (randomShape == 1) {
                drawBox(Math.round(Math.random()*300) - Math.round(Math.random()*400),Math.round(Math.random()*300) - Math.round(Math.random()*400),Math.round(Math.random()*100));
            } else if (randomShape == 2) {
                drawHouse(Math.round(Math.random()*300) - Math.round(Math.random()*400), Math.round(Math.random()*300) - Math.round(Math.random()*400));
            } else if (randomShape == 3) {
                drawTriangle(Math.round(Math.random()*300) - Math.round(Math.random()*300), Math.round(Math.random()*300) - Math.round(Math.random()*300));
            } else if (randomShape == 4) {
                drawStarrySky();
                console.log("randomShape is " + randomShape);
            } 
        } else if (inputValue.substring(0, 6) == "circle") {
            var circleCoordinates = inputValue.substring(7);
            var circleXDigits = circleCoordinates.search(" ");
            var circleYSize = inputValue.substring(8 + circleXDigits)
            var circleYDigits = circleYSize.search(" ");
            var circleX = Number(inputValue.substring(7, 7 + circleXDigits));
            var circleY = Number(inputValue.substring(8 + circleXDigits, 8 + circleXDigits + circleYDigits));
            var circleSize = Number (inputValue.substring(9 + circleXDigits + circleYDigits))
            console.log("circleCoordinates are " + circleCoordinates);
            console.log("circleXDigits is " + circleXDigits);
            console.log("circleX is " + circleX);
            console.log("circleY is " + circleY);
            console.log("circle size is " + circleSize);
            drawCircle(circleX, circleY, circleSize);
        } else if (inputValue.substring(0, 6) == "colour") {
            var typedColour = inputValue.substring(7);
            if (typedColour == "blue") {
                colour = 'rgb(0, 0, 255)'
            } else if (typedColour == "red") {
                colour = 'rgb(255, 0, 0)'
            } else if (typedColour == "green") {
                colour = 'rgb(0, 255, 0'
            } else if (typedColour == "purple") {
                colour = 'rgb(102, 0, 102)'
            } else if (typedColour == "pink") {
                colour = 'rgb(255, 0, 255)'
            } else if (typedColour == "orange") {
                colour = 'rgb(255, 153, 0)'
            } else if (typedColour == "yellow") {
                colour = 'rgb(255, 255, 0)'
            } else if (typedColour == "black") {
                colour = 'rgb(0, 0, 0)'
            } else if (typedColour == "brown") {
                colour = 'rgb(102, 51, 0)'
            } else if (typedColour == "white") {
                colour = 'rgb(255, 255, 255)'
            } else if (typedColour == "aqua") {
                colour = '(0, 255, 255)'
            }
        } else if (inputValue.substring(0, 7) == "village") {
            var minimumHouseSize = Number (inputValue.substring(8))
            console.log("minimum house size is " + minimumHouseSize);
            for (var l = 0; l<=800; ++l) {
                houseSize = Math.round( Math.random()*125)
                houseGap = Math.round( Math.random()*20 ) + 10;
                drawHouse(-400 + houseGap + totalHouseWidth, -50 - Math.round( Math.random()*300 ), minimumHouseSize + houseSize)
                totalHouseWidth = totalHouseWidth + houseSize + minimumHouseSize + houseGap;
                l = totalHouseWidth
            }
        houseSize = 0;
        houseGap = 0;
        totalHouseWidth = 0;
        }
    }
}

function checkField() {
    if (event.keyCode == 13) {
        drawCommand();
    }
}