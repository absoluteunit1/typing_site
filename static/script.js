var text2 = ["Hello", "this", "is", "my", "test", "for", "my","typing","game."]
var text3 = ["This", "is", "my", "second", "text", "for", "my", "typing", "game."]

// LOCAL STORAGE

averageWordsPerMinute = window.localStorage;

// FUNCTION DEFINITIONS

// Making the API call to get the next string of text




// Updates the WPM 

updateWPM = () => {}

// Adding text to the page

addWordsToLine = (word, lastWord = false) => {
	var lines = document.getElementsByTagName("h3");
	var line  = lines[lines.length - 1];
	var wordWrapper = document.createElement("div");
	wordWrapper.className = "wordwrap";
	for (let i = 0; i < word.length; i++) {
		var span = document.createElement("span");
		var letter = document.createTextNode(word[i]);
		span.appendChild(letter);
		wordWrapper.appendChild(span);
		line.appendChild(wordWrapper);
	}
    if (!lastWord) {
	    line.innerHTML += '<div class="wordwrap"><span> </span></div>';
    }
}

addWords = (arr) => {
	var i = 0;
	var line = document.createElement("h3");
	line.id = "parent";
	while (i != arr.length) {
		var wordsWrap = document.getElementById("wordswrap");
		wordsWrap.appendChild(line);
        if ( i + 1 == arr.length) {
    		addWordsToLine(arr[i], true);
        }else{
            addWordsToLine(arr[i]);
        }
		i++;
	}

}

// Input checking

// Takes in a character and returns the id (see Shift key in index.html) of which (left or right) shift key to use
// Also checks if a the character is an upperCase or not
whichShift = (character) => {
    leftId = "LeftShift";
    rightId = "RightShift";
    leftShiftKeys = "^&*()_+|YHNUJMIK<OL>P:?\"{}";
    rightShiftKeys = "~!@#$%QWERTASDFGZXCVB";

    if (leftShiftKeys.includes(character)){
        return leftId;
    }else if(rightShiftKeys.includes(character)){
        return rightId;
    }
    return;
}

// Takes in a character that requires a shift key, and returns it's original key (which is the id in index.html)
returnKeyId = (character) => {
    keys = {
        "~" : "`",
        "!" : "1",
        "@" : "2",
        "#" : "3",
        "$" : "4",
        "%" : "5",
        "^" : "6",
        "&" : "7",
        "*" : "8",
        "(" : "9",
        ")" : "0",
        "_" : "-",
        "+" : "=",
        "{" : "[",
        "}" : "\'",
        ":" : ";",
        "\"": "'",
        "<" : ",",
        ">" : ".",
        "?" : "/",
        "|" : "\\",
        " " : "Space"
    }
    if (character.toLowerCase() != character.toUpperCase()){
        return character.toLowerCase(); 
    }else if (keys[character] != null) {
        return keys[character];
    }else{
        return character;
    }
}

// Highlights the current character on the keyboard

highlightKeyboardKey = (currentLetter) => { 
    if (whichShift(currentLetter) == undefined) {
        var keyboardKey = document.getElementById(returnKeyId(currentLetter));
        keyboardKey.style.backgroundColor = "rgba(255,255,255,0.15)";
    }else if(whichShift(currentLetter) == "LeftShift"){
        var leftShiftKey = document.getElementById("LeftShift");
        var keyboardKey = document.getElementById(returnKeyId(currentLetter));
        leftShiftKey.style.backgroundColor = "rgba(255,255,255,0.15)";
        keyboardKey.style.backgroundColor = "rgba(255,255,255,0.15)";
    }else{
        var rightShiftKey = document.getElementById("RightShift");
        var keyboardKey = document.getElementById(returnKeyId(currentLetter));
        rightShiftKey.style.backgroundColor = "rgba(255,255,255,0.15)";
        keyboardKey.style.backgroundColor = "rgba(255,255,255,0.15)";
    }
}

// Remove the previous key highlight on the keyboard

removeKeyHighlight = (prevLetter) => {
    if (whichShift(prevLetter) == undefined) {
         var keyboardKey = document.getElementById(returnKeyId(prevLetter));
         keyboardKey.style.backgroundColor = "#232946";
     }else if(whichShift(prevLetter) == "LeftShift"){
        var leftShiftKey = document.getElementById("LeftShift");
        var keyboardKey = document.getElementById(returnKeyId(prevLetter));
        leftShiftKey.style.backgroundColor = "#232946";
        keyboardKey.style.backgroundColor = "#232946";
    }else{
        var rightShiftKey = document.getElementById("RightShift");
        var keyboardKey = document.getElementById(returnKeyId(prevLetter));
        rightShiftKey.style.backgroundColor = "#232946";
        keyboardKey.style.backgroundColor = "#232946";
    }
}

returnCursor = (wordCount, letterCount) => {
        return document.getElementById("parent").getElementsByClassName("wordwrap")[wordCount].getElementsByTagName("span")[letterCount];
    }

loadText = () => {
    // Takes an array of text and loads it into the textbox area.
}

clearWords = () => document.getElementById("wordswrap").innerHTML = "";


//Cursor Functions for changing the cursor background

cursorBackground = (cursor) => cursor.id = "cursor";
correct = (cursor) => cursor.id = "correct";
incorrect = (cursor) => cursor.id = "incorrect";
clearBackground = (cursor) => cursor.id = "clear";


//EVENT LISTENERS


// Variable definitions
var textWrapper = document.getElementById("wordswrap");
var timesTextWasAdded = 0;
var beginText = document.getElementById("clickToBegin");
var wpm = document.getElementById("speed"); 
var started = false;

// Listens for the click, that loads the text and starts the timer
textWrapper.addEventListener("click", function(event) {
   
    if (!started) {
        textWrapper.style.boxShadow = 'none';
        beginText.remove();
        if (timesTextWasAdded == 0) {
            addWords(text2); 
            timesTextWasAdded++;
        }
        
        var words = document.getElementById("parent").children;
    
        // Counters for tracking the cursor position
        var wordCount   = 0;
        var letterCount = 0;

        // Counter for tracking the number of correct vs incorrect characters typed
        var correctCount = 0;
        var incorrectCount = 0;

        //Cursor
        var cursor = returnCursor(wordCount, letterCount);
        cursorBackground(cursor)

        // Highlight the first character on the keyboard
        var currentLetter = words[wordCount].childNodes[letterCount].innerText;
        highlightKeyboardKey(currentLetter);   
    }
    // Event Listener for typing
        document.addEventListener("keydown", function(event) {
            var currWordLength = words[wordCount].childElementCount;
            var prevLetter = currentLetter; 
            var totalWords = document.getElementById("parent").childNodes.length;
            // Check if the pressed key is Caps Lock; don't move cursor (stop execution of the function)
            if (event.key == "CapsLock") {
                return;
            }
            // Check if the pressed key is Shift; if so, wait for another key
            if (event.key == "Shift"){
                document.addEventListener("keydown", function(event) {
                    var pressedKey = event.key;
                });
            }else{
                var pressedKey = event.key;
            }
            
            // Check if pressedKey was only Shift without any other keys; if so, stop the execution of the function
            if (pressedKey == undefined ){
                return;
            }

            //Check if backspace is pressed and we are on the first letter of the first word

            if (pressedKey == "Backspace") {
                if (letterCount == 0 && wordCount == 0){
                    return;
                }else if(letterCount == 0){
                    removeKeyHighlight(currentLetter);
                    clearBackground(cursor);


                    wordCount = wordCount - 1;
                    currWordLength = words[wordCount].childElementCount;
                    letterCount = currWordLength - 1;
                    cursor = returnCursor(wordCount, letterCount); 
                    cursorBackground(cursor);
                                
                    currentLetter = words[wordCount].childNodes[letterCount].innerText; 
                    highlightKeyboardKey(currentLetter);
                    return;
                }else{
                    removeKeyHighlight(currentLetter);
                    clearBackground(cursor);
                    
                    letterCount = letterCount - 1;
                    
                    cursor = returnCursor(wordCount, letterCount);
                    cursorBackground(cursor);
     
                    currentLetter = words[wordCount].childNodes[letterCount].innerText; 
                    highlightKeyboardKey(currentLetter);
                    return;
                }
            }
            // Check if the pressed key matches the character in the text
            // If match: change character background to green, move to next character in text
            // else: change character background to red, move to next character in text
            if (prevLetter == pressedKey) {
                correct(cursor); 
                correctCount++;
            }else{
                incorrect(cursor);
                incorrectCount++;
            }
            letterCount++;
            if (letterCount == currWordLength) {
                wordCount++;
                letterCount = 0;
                if (wordCount == totalWords) {
                    // If the previous word was the last word in the text, clear the text
                    // todo: add a wpm calculator and show the wpm after the words were typed
                    // RESET THE TEXT AND ALL THE VARIABLES
                    clearWords();
                    removeKeyHighlight(prevLetter);
                    wordCount = 0;
                    addWords(text3);
                    words = document.getElementById("parent").children;
                    currentLetter = words[wordCount].childNodes[letterCount].innerHTML;
                    cursor = returnCursor(wordCount, letterCount); 
                    highlightKeyboardKey(currentLetter);
                    cursorBackground(cursor);
                    return;
                }
                currWordLength = words[wordCount].childElementCount;
                    
            }
            currentLetter = words[wordCount].childNodes[letterCount].innerText; 
            highlightKeyboardKey(currentLetter);
            
            // In the case that the current letter is the same as the previous letter
            if(currentLetter != prevLetter) {
                removeKeyHighlight(prevLetter); 
            }
            cursor = returnCursor(wordCount, letterCount);
            cursorBackground(cursor);
        
        });

    });
