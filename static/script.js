// LOCAL STORAGE

averageWordsPerMinute = window.localStorage;

// PREVENT BROWSER SHORTCUT DEFAULTS WHILE IN PAGE

window.onkeydown = function(e) {
    if (e.code === "8" && e.target === document.body){
        e.preventDefault();
    }else if(e.code === "222" && e.target === document.body){
        e.preventDefault();
    }
}

// MOBILE DETECTION

// FUNCTION DEFINITIONS

// API GET request to get the text 



// Updates the WPM 

updateWPM = () => {}

// Adding text to the page

addWordsToLine = (word, lastWord = false) => {
	let lines = document.getElementsByTagName("h3");
	let line  = lines[lines.length - 1];
	let wordWrapper = document.createElement("div");
	wordWrapper.className = "wordwrap";
	for (let i = 0; i < word.length; i++) {
		let span = document.createElement("span");
		let letter = document.createTextNode(word[i]);
		span.appendChild(letter);
		wordWrapper.appendChild(span);
		line.appendChild(wordWrapper);
	}
    if (!lastWord) {
	    line.innerHTML += '<div class="wordwrap"><span> </span></div>';
    }
}

addWords = (arr) => {
	let i = 0;
	let line = document.createElement("h3");
	line.id = "parent";
	while (i !== arr.length) {
		let wordsWrap = document.getElementById("wordswrap");
		wordsWrap.appendChild(line);
        if ( i + 1 === arr.length) {
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
    let leftId = "LeftShift";
    let rightId = "RightShift";
    let leftShiftKeys = "^&*()_+|YHNUJMIK<OL>P:?\"{}";
    let rightShiftKeys = "~!@#$%QWERTASDFGZXCVB";

    if (leftShiftKeys.includes(character)){
        return leftId;
    }else if(rightShiftKeys.includes(character)){
        return rightId;
    }
    return;
}

// Takes in a character that requires a shift key, and returns it's original key (which is the id in index.html)
returnKeyId = (character) => {
    let keys = {
        "~": "`",
        "!": "1",
        "@": "2",
        "#": "3",
        "$": "4",
        "%": "5",
        "^": "6",
        "&": "7",
        "*": "8",
        "(": "9",
        ")": "0",
        "_": "-",
        "+": "=",
        "{": "[",
        "}": "\'",
        ":": ";",
        "\"": "'",
        "<": ",",
        ">": ".",
        "?": "/",
        "|": "\\",
        " ": "Space"
    }
    if (character.toLowerCase() !== character.toUpperCase()){
        return character.toLowerCase(); 
    }else if (keys[character] != null) {
        return keys[character];
    }else{
        return character;
    }
}

// Highlights the current character on the keyboard

highlightKeyboardKey = (currentLetter) => { 
    let keyboardKey;
    if (whichShift(currentLetter) === undefined) {
        keyboardKey = document.getElementById(returnKeyId(currentLetter));
        keyboardKey.style.backgroundColor = "rgba(255,255,255,0.15)";
    }else if(whichShift(currentLetter) === "LeftShift"){
        let leftShiftKey = document.getElementById("LeftShift");
        keyboardKey = document.getElementById(returnKeyId(currentLetter));
        leftShiftKey.style.backgroundColor = "rgba(255,255,255,0.15)";
        keyboardKey.style.backgroundColor = "rgba(255,255,255,0.15)";
    }else{
        let rightShiftKey = document.getElementById("RightShift");
        keyboardKey = document.getElementById(returnKeyId(currentLetter));
        rightShiftKey.style.backgroundColor = "rgba(255,255,255,0.15)";
        keyboardKey.style.backgroundColor = "rgba(255,255,255,0.15)";
    }
}

// Remove the previous key highlight on the keyboard

removeKeyHighlight = (prevLetter) => {
    let keyboardKey;
    if (whichShift(prevLetter) === undefined) {
         keyboardKey = document.getElementById(returnKeyId(prevLetter));
         keyboardKey.style.backgroundColor = "#232946";
     }else if(whichShift(prevLetter) === "LeftShift"){
        let leftShiftKey = document.getElementById("LeftShift");
        keyboardKey = document.getElementById(returnKeyId(prevLetter));
        leftShiftKey.style.backgroundColor = "#232946";
        keyboardKey.style.backgroundColor = "#232946";
    }else{
        let rightShiftKey = document.getElementById("RightShift");
        keyboardKey = document.getElementById(returnKeyId(prevLetter));
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


//GLOBAL VARIABLE DEFINITIONS

var words;
var wordCount;
var letterCount;
var correctCount;
var incorrectCount;
var cursor;
var currentLetter;
var totalWords;
var pressedKey;

//CUSTOM EVENTS (create an event that is created by the user finishing typing 
//the text and dispatch it; have an event listener that listens for this event
//loads a new text (makes a server call) and resets the variables (counters, etc)

const loadedText = new Event('loadedText');
const finishedTyping = new Event('finishedTyping');

//EVENT LISTENERS

const getText = async () => {
    const response = await fetch("/text");
    const myText = await response.text();
    addWords(myText.split(" "));
    document.dispatchEvent(loadedText);
}

document.addEventListener('finishedTyping', function(event) {
    getText();
});

window.addEventListener('load', (event) => {
    getText();
    console.log("Page has loaded");
})


document.addEventListener('loadedText', function(loadedTheText) {
    words = document.getElementById("parent").children;    
    wordCount   = 0;
    letterCount = 0;

    // Counter for tracking the number of correct vs incorrect characters typed
    correctCount = 0;
    incorrectCount = 0;

    //Cursor
    cursor = returnCursor(wordCount, letterCount);
    cursorBackground(cursor)

    // Highlight the first character on the keyboard
    currentLetter = words[wordCount].childNodes[letterCount].innerText;
    highlightKeyboardKey(currentLetter);   

    currWordLength = words[wordCount].childElementCount;
    totalWords = document.getElementById("parent").childNodes.length;
   
    document.addEventListener("keydown", function(event) {
        prevLetter = currentLetter; 
        // Check if the pressed key is Caps Lock; don't move cursor (stop execution of the function)
        if (event.key === "CapsLock") {
            return;
        }
        // Check if the pressed key is Shift; if so, wait for another key
        if (event.key === "Shift"){
            document.addEventListener("keydown", function(event) {
                pressedKey = event.key;
            });
        }else{
            pressedKey = event.key;
        }
        
        // Check if pressedKey was only Shift without any other keys; if so, stop the execution of the function
        if (pressedKey === undefined ){
            return;
        }

        //Check if backspace is pressed and we are on the first letter of the first word

        if (pressedKey === "Backspace") {
            if (letterCount === 0 && wordCount === 0){
                return;
            }else if(letterCount === 0){
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
        if (prevLetter === pressedKey) {
            correct(cursor); 
            correctCount++;
        }else{
            incorrect(cursor);
            incorrectCount++;
        }
        letterCount++;
        if (letterCount === currWordLength) {
            wordCount++;
            letterCount = 0;
            if (wordCount === totalWords) {
                // If the previous word was the last word in the text, clear the text
                // todo: add a wpm calculator and show the wpm after the words were typed
                // RESET THE TEXT AND ALL THE VARIABLES
                clearWords();
                removeKeyHighlight(prevLetter);
                wordCount = 0;
                document.dispatchEvent(finishedTyping);
                return;
            }
            currWordLength = words[wordCount].childElementCount;
                
        }
        currentLetter = words[wordCount].childNodes[letterCount].innerText; 
        highlightKeyboardKey(currentLetter);
        
        // In the case that the current letter is the same as the previous letter
        if(currentLetter !== prevLetter) {
            removeKeyHighlight(prevLetter); 
        }
        cursor = returnCursor(wordCount, letterCount);
        cursorBackground(cursor);

    });
});
