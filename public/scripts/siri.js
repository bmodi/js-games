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