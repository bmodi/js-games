var secretNumber = 32.32;
var count = 0;

function getSiriResponse(question) {
    var answer = "Yeah whatever";
    ++count;

    if (question == "hello") {
        answer = "Hello there";
    } else if (question < 10) {
        answer = "It's cold out there.  Weat a hat.";
    } else if (question > 30) {
        answer = "Nice and toasty today.  Swimtrunks.";
    } else if (question == "count") {
        answer = "You've asked " + count + " questions so far.";
    } else if (question == secretNumber) {
        answer = "GASP!  You've guessed the secret number.  You will receive blessings sometime in the future.";
    }

    return answer;
}

// Create a new list item when clicking on the "Add" button
function newElement() {
    var inputValue = document.getElementById("myInput").value;
    if (!inputValue) {
        alert("You must write something!");
    } else {
        var li = document.createElement("li");
        var t = document.createTextNode(inputValue);
        li.appendChild(t);
        document.getElementById("myUL").appendChild(li);

        var sli = document.createElement("li");
        var st = document.createTextNode("SIRI:  " + getSiriResponse(inputValue));
        sli.appendChild(st);
        document.getElementById("myUL").appendChild(sli);
    }
}

function checkField() {
    if (event.keyCode == 13) {
        newElement();
    }
}
