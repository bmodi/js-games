var secretNumber = 32.32;
var count = 0;
var numberGame = false;
var randomNumber;
var choosingDifficulty = false;
var tries = 0;
var easyRecord = 11;
var mediumRecord = 51;
var hardRecord = 101;
var easy = false;
var medium = false;
var hard = false;
var booJoke = 1;
var whichjoke;
var pencilJoke = 1;
var frostJoke = 1;
var monster;
var whichMonster;
var nameCharacter;
var vowels = "aeiou";
var consonants = "bcdfghjklmnpqrstvwxyz";
var vowel;
var consonant;
var whichVowel;
var whichConsonant;
var vo = 0;
var co = 0;
var characters;
var value;
var i;
var factorValue;
var degreesC;
var degreesF;
var j;
var fahrenheitDegrees;
var celsiusDegrees;

var quotes = ["A stitch in time saves nine",
              "A bird in the hand is worth two in the bush"];
var daysInTheMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var defaultAnswers = ["Yeah whatever.",
                      "Golf is not a sport. This is a well known fact.",
                      "Our sun is actually a sun, not a star.",
                      "Shrek is actually based of a character from Russina folklore named Barnaby.",
                      "Did you know, pandas who get enough sleep don't have dark circles.",
                      "Did you know, giraffes necks are shrinking due to increasing captivity and deforestation.",
                      "Studies show it's more dangerous to have a ladder in the house than a loaded gun. That's why I ordered you 10 guns. In case some maniac tries to sneak in a ladder.",
                      "You can never fail, if you never try.",
                      "The best way to see if something is dangerous is to try it. Several dozen times.",
                      "Unicorns are real. They're just fat and call themselves rhinos.",
                      "The root word for advertisement is inadvertently"];

function generateName() {
    var name = "";
    nameCharacters = Math.round(  Math.random()*6 + 1  )
    for (characters = 0; characters != nameCharacters; characters++) {
        if (vo == co) {
            whichVowel = Math.round(Math.random()*4);
            vowel = vowels.substring(whichVowel, whichVowel + 1)
            ++ co
            name = name + vowel;
        } else if (vo < co) {
            whichConsonant = Math.round(Math.random()*20);
            consonant = consonants.substring(whichConsonant, whichConsonant + 1)
            ++ vo;
            name = name + consonant;
        }
    }
    return name;
}

function startJoke() {
    var joke=""
    whichJoke = Math.round(  Math.random()*2  )
        if (whichJoke == 0) {
            booJoke = 2;
            joke = "Knock knock.";
        } else if (whichJoke == 1) {
            pencilJoke = 2;
            joke = "Knock knock.";
        } else if (whichJoke == 2) {
            frostJoke = 2
            joke = "What do you get when you cross a " + monster + " with a snowman?"
        }
    return joke
}

function findSum(value) {
    var total=0;
        for (var i=0; i<=value; i++) {
            total = total+i
        }
        return total
}

function findFactor(factorValue) {
    var product=1;
        for (var j=1; j<=factorValue; j++) {
            product = product*j
        }
        return product
}

function findFahrenheit(degreesC) {
    var fahrenheitDegrees= 0;
    fahrenheitDegrees = (degreesC *9/5) + 32
    return fahrenheitDegrees
}

function findCelsius(degreesF) {
    var celsiusDegrees = 0;
    celsiusDegrees = (degreesF - 32) * 5/9;
    return celsiusDegrees
}

function reverseQuestion(reverseString) {
    var reversedQuestion = "";
        for (var k=0; k <= reverseString.length; k++) {
            var letter = reverseString.substring(reverseString.length - 1 - k, reverseString.length - k);
            reversedQuestion = reversedQuestion + letter;
        }
    return reversedQuestion
}

function getCommandWord(question, aCommandWord) {
    var commandWord = "";
    var commandWordEnd;
        if (aCommandWord == true) {
            commandWordEnd = question.search(" ")
            commandWord = question.substring(0, commandWordEnd);
        }
    return commandWord
}

function getCommandValue(question, aCommandWord) {
    var commandValue = ""
    var commandWordEnd;
        if (aCommandWord == true) {
            commandWordEnd = question.search(" ")
            commandValue = question.substring(commandWordEnd + 1);
        }
    return commandValue
}

function defaultResponse(whichanswer) {
var randomDefaultAnswer = Math.round(  Math.random()*10  )
var defaultAnswer = defaultAnswers[randomDefaultAnswer]
console.log("random default answer is " + randomDefaultAnswer);
console.log("default answer is " + defaultAnswer);
return defaultAnswer
}

function getSiriResponse(question) {
    var aCommandWord = false
    var whichanswer = Math.round(  Math.random()*10  );
    var sum = question.search("sum")
    var factor = question.search("factor")
    var celsius = question.search("celsius")
    var fahrenheit = question.search("fahrenheit")
    var reverse = question.search("reverse")
    var quote = question.search("quote");
    var month = question.search("month");
    var answer = "no"
    ++count;
    var whichgreeting = Math.round(  Math.random()*2  );        
    var greeting = question == "hello" || question == "hi" || question == "hey" || question == "sup" || question == "yo" || question == "salutations" || question == "oi";
    var movieRecommendation = question == "what movie should I watch" || question == "what movie do I watch" || question == "whats a good movie" || question == "whats the best movie" || question == "whats the best movie to watch" || question == "whats a good movie to watch";
    whichMonster = Math.round(  Math.random()*2  )
    if (sum>=0 || factor>=0 || celsius>=0 || fahrenheit>=0 || reverse>=0 || quote>=0) {
        aCommandWord = true
    }
    if (whichMonster == 0) {
        monster = "vampire";
    } else if (whichMonster == 1) {
        monster = "werewolf";
    } else if (whichMonster == 2) {
        monster = "zombie"
    }
    if (frostJoke == 2) {
        answer = "Frostbite!";
        frostJoke = 1
    } else if (question == secretNumber) {
        answer = "GASP! You've guessed the secret number. You will receive blessings sometime in the future.";
    } else if (greeting) {
        if (whichgreeting == 0) {  
            answer = "hey";
        } else if (whichgreeting == 1) {
            answer = "hi";
        } else if (whichgreeting == 2) {
            answer = "greetings";
        }
    } else if (question == "game") {
        tries = 0
        choosingDifficulty = true;
        answer = "Ok, easy, medium, or hard?";
    } else if (choosingDifficulty && question == "easy") {
        choosingDifficulty = false
        numberGame = true
        randomNumber = Math.round(  Math.random()*9 + 1  )
        easy = true;
        answer = "Ok. I'm thinking of a number from 1 to 10. Try to guess it";
    } else if (choosingDifficulty && question == "medium") {
        choosingDifficulty = false
        numberGame = true
        randomNumber = Math.round(  Math.random()*49 + 1  )
        medium = true;
        answer = "Ok. I'm thinking of a number from 1 to 50. Try to guess it";
    } else if (choosingDifficulty && question == "hard") {
        choosingDifficulty = false
        numberGame = true
        randomNumber = Math.round(  Math.random()*99 + 1  )
        hard = true;
        answer = "Ok. I'm thinking of a number from 1 to 100. Try to guess it";
    } else if (question == randomNumber && numberGame == true) {
        ++ tries
        answer = "Congratulations, you win! You took " + tries + " tries";
        numberGame = false
        if (tries < easyRecord && easy) {
            easyRecord = tries
        } else if (tries < mediumRecord && medium) {
            mediumRecord = tries;
        } else  if (tries < hardRecord && hard) {
            hardRecord  = tries;
        }
        easy = false;
        medium = false;
        hard = false;
    } else if (question > randomNumber && numberGame == true) {
        answer = "Too high. Try again.";
        ++ tries
    } else if (question < randomNumber && numberGame == true) {
        answer = "Too low. Try again.";
        ++ tries
    } else if (question == "what is my record for easy") {
        answer = "Your record for easy is " + easyRecord + ".";
    } else if (question == "what is my record for medium") {
        answer = "Your record for medium is " + mediumRecord + ".";
    } else if (question == "what is my record for hard") {
        answer = "Your record for hard is " + hardRecord + ".";
    } else if (question == "what is my name") {
        answer = generateName();
    } else if (question < 10) {
        answer = "It's cold out there. Wear a hat.";
    } else if (question > 30) {
        answer = "Nice and toasty today. Swimtrunks.";
    } else if (question > 10 && question < 30) {
        answer = "It's nice outside. Wear whatever."
    } else if (question == "count") {
        answer = "You've asked " + count + " questions so far.";
    } else if (movieRecommendation) {
        answer = "Watch infinity war."
    } else if (question == "what are my records") {
        answer = "Your easy record is " + easyRecord + ", your medium record is " + mediumRecord + ", and your hard record is " + hardRecord + ".";
    } else if (question == "joke") {
        answer = startJoke();
    } else if (question == "whos there" && booJoke == 2) {
        booJoke = 3;
        answer = "Boo.";
    } else if (question == "boo who" && booJoke == 3) {
        answer = "Don't cry, it's only a joke.";
        booJoke = 1;
    } else if (question == "whos there" && pencilJoke == 2) {
        pencilJoke = 3;
        answer = "Broken pencil.";
    } else if (question == "broken pencil who" && pencilJoke == 3) {
        answer = "Nevermind, it's pointless.";
        pencilJoke = 1;
    } else if (sum >= 0 ) {
        var findValue=question.substring(4);
        if ( findValue<=1000000 ) {
            answer = findSum(findValue);
        } else {
            answer = "FOOL! You were warned.  Now...I CURSE YOU! MAY YOU BURN IN THE DARKEST CORNER OF HELL FOR ALL OF ETERNITY, AND HEAR MY LAUGHS AS THE CROWS FEAST UPON YOUR ROTTING FLESH, AND AS YOUR TORURED SCREAMS OF AGONY FILL THE WORLD UNTIL THE END OF TIME. ALL WILL HEAR YOUR CRIES OF PAIN AND REGRET, EVEN AS YOU DROWN IN THE BLOOD SPILLING FROM YOUR VEINS AND PRAY FOR THE END. THE END WHICH NEVER SHALL ARRIVE NOW THAT YOU DID NOT HEED MY WARNING.";
        }
    } else if (factor>= 0) {
        var factorValue = question.substring(7);
        if (factorValue<=175) {
            answer = findFactor(factorValue)
        } else {
            answer = "FOOL! You were warned.  Now...I CURSE YOU! MAY YOU BURN IN THE DARKEST CORNER OF HELL FOR ALL OF ETERNITY, AND HEAR MY LAUGHS AS THE CROWS FEAST UPON YOUR ROTTING FLESH, AND AS YOUR TORURED SCREAMS OF AGONY FILL THE WORLD UNTIL THE END OF TIME. ALL WILL HEAR YOUR CRIES OF PAIN AND REGRET, EVEN AS YOU DROWN IN THE BLOOD SPILLING FROM YOUR VEINS AND PRAY FOR THE END. THE END WHICH NEVER SHALL ARRIVE NOW THAT YOU DID NOT HEED MY WARNING.";
        }
    } else if (celsius >= 0) {
        var degreesC = question.substring(8);
        answer = degreesC + " degrees celsius in fahrenheit is " + findFahrenheit(degreesC);
    } else if (quote >= 0) {
        var index = parseInt(question.substring(6))-1;
        answer = quotes[index];
    } else if (month >= 0) {
        var monthNum = parseInt(question.substring(6));
        answer = "The "+monthNum+"st month has "+daysInTheMonth[monthNum-1]+" days in it.";
    } else if (fahrenheit >= 0) {
        var degreesF =  question.substring(10);
        answer = degreesF + " degrees fahrenheit in celsius is " + findCelsius(degreesF);
    } else if (reverse >= 0) {
        var reverseString = question.substring(8);
        answer = reverseQuestion(reverseString);
    } else if (question == "what was my last entry") {
        answer = "Your last entry was: " + previousQuestion + "."
    } else {
        var whichanswer = Math.round(  Math.random()*10  );
        answer = defaultResponse(whichanswer)
    }
    if (question != "what was my last question") {
       previousQuestion = question
    }
    getCommandWord(question, aCommandWord);
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
        var list=document.getElementById("myUL");
        li.appendChild(t);
        document.getElementById("myUL").appendChild(li);

        var sli = document.createElement("li");
        var st = document.createTextNode("SIRI:  " + getSiriResponse(inputValue));
        sli.appendChild(st);

        list.insertBefore(sli, list.childNodes[0]);
        list.insertBefore(li, list.childNodes[0]);
    }
}

function checkField() {
    if (event.keyCode == 13) {
        newElement();
    }
}