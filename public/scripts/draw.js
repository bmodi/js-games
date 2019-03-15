
var canvas = document.getElementById('MainCanvas');
canvas.style.backgroundColor = 'rgba(0, 0, 0)';

function drawLine(x1, y1, x2, y2) {
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

for(var i=0; i<=200; i+=10) {
    drawLine(0,200-i,i,0);
}
