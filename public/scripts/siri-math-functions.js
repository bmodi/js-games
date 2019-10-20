function findSum(value) {
    var total=0;
        for (var i=0; i<=value; i++) {
            total = total+i
            console.log ("the total is " + total);
            console.log ("i is " + i);
        }
        return total
}

function findFactor(factorValue) {
    var product=1;
        for (var j=1; j<=factorValue; j++) {
            product = product*j
            console.log("j is " + j);
            console.log("product is " + product);
        }
        return product
}

function findFahrenheit(degreesC) {
    var fahrenheitDegrees= 0;
    fahrenheitDegrees = (degreesC *9/5) + 32
    console.log("degreesC is " + degreesC);
    return fahrenheitDegrees
}

function findCelsius(degreesF) {
    var celsiusDegrees = 0;
    celsiusDegrees = (degreesF - 32) * 5/9;
    return celsiusDegrees
}
