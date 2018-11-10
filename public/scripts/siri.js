function getSiriResponse(question) {
    var answer="Yeah whatever";

    if (question=="hello") {
        answer = "Hello there";
    } else if ( question<10 ) {
        answer = "It's cold out there.  Weat a hat.";
    } else if ( question>30 ) {
        answer = "Nice and toasty today.  Swimtrunks.";
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
      var st = document.createTextNode("SIRI:  "+getSiriResponse(inputValue));
      sli.appendChild(st);
      document.getElementById("myUL").appendChild(sli);
    }
  }