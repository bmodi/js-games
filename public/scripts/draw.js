
function drawLine(x1, y1, x2, y2) {
    var canvas = document.getElementById('MainCanvas');
    canvas.style.backgroundColor = 'rgba(0, 0, 0)';

    var context = canvas.getContext('2d');
    context.strokeStyle = 'rgba(255, 0, 0)';
    // Reset the current path
    context.beginPath();
    // Staring point (10,45)
    context.moveTo(x1+400, 400-y1);
    // End point (180,47)
    context.lineTo(x2+400, 400-y2);
    // Make the line visible
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

function drawHouse(x,y) {
    drawBox(x,y,200)
    drawTriangle(x+100,y+300)
}

function drawTriangle(x,y) {
    drawLine(x, y, x+100, y-100);
    drawLine(x+100, y-100, x-100, y-100);
    drawLine(x-100, y-100, x, y);
}

function drawStarrySky() {
    for(var j=0; j<=20; ++j) {
        drawStar(5+Math.random()*5, 1, -400+Math.random()*800, Math.random()*400);
    }   
}

// Create a new list item when clicking on the "Add" button
function drawCommand() {
    var inputValue = document.getElementById("myInput").value;
    if (!inputValue) {
        alert("You must write something!");
    } else {
        if ( inputValue=="star" ) {
            drawStar(200, 10, 0, 0);
        } else if ( inputValue=="smallstar") {
            drawStar(100, 5, 100, 50);
        } else if ( inputValue=="box" ) {
            drawBox(x1,y1,100);
        } else if (inputValue=="small box") {
            drawBox(0,0,50)
        } else if (inputValue=="big box") {
            drawBox(0,0, 200)
        } else if ( inputValue=="triangle") {
            drawTriangle(0, 100);
        } else if (inputValue=="house"){
            drawHouse(-100,-300);
        } else if (inputValue=="starry sky") {
            drawStarrySky();
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
            }
        }
    }
}

function checkField() {
    if (event.keyCode == 13) {
        drawCommand();
    }
}
