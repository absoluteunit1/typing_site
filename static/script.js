// LOCAL STORAGE
averageWordsPerMinute = window.localStorage;

// PREVENT BROWSER SHORTCUT DEFAULTS
window.onkeydown = function(e) {
    if (e.code === "Backspace" && e.target === document.body){
        e.preventDefault();
    }else if(e.code === "Quote" && e.target === document.body){
        e.preventDefault();
    }
}

// ON WINDOW LOAD
window.addEventListener('load', () => {
    getText();
})

// FUNCTIONS

// Putting text into html
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

// Clears the text from the page
clearWords = () => document.getElementById("wordswrap").innerHTML = "";

//Cursor Functions for changing the cursor background
cursorBackground = (cursor) => cursor.id = "cursor";
correct = (cursor) => cursor.id = "correct";
incorrect = (cursor) => cursor.id = "incorrect";
clearBackground = (cursor) => cursor.id = "clear";



//__________________________________TESTING AREA____________________________________________
let wpmText = document.getElementById("wpm");
let timerId = setInterval(() => {
    wpmText.innerText = (charactersTyped/timeElapsed).toString();
}, 500);


// ______________________________________________

//SERVER CALLS

// Make server call to get the text the user will type, loads the text into the html and dispatch an event
//that the text has been loaded
const getText = async () => {
    const response = await fetch("/text");
    const myText = await response.text();
    totalLetters = myText.length;
    addWords(myText.split(" "));
    document.dispatchEvent(loadedText);
}

//GLOBAL VARIABLE DEFINITIONS

let timeElapsed=5;
let charactersTyped=5;
let totalLetters;
let words;
let wordCount;
let letterCount;
let correctCount;
let incorrectCount;
let cursor;
let currentLetter;
let totalWords;
let pressedKey;
let prevLetter;
let currWordLength;

//CUSTOM EVENTS

// Event: server call was made and text was loaded into the text area
const loadedText = new Event('loadedText');

// Event: user finished typing the current text
const finishedTyping = new Event('finishedTyping');

//EVENT LISTENERS

// Executed when the user finished typing
document.addEventListener('finishedTyping', function() {
    getText();
});

// Executed when the text was loaded into the page
document.addEventListener('loadedText', function() {
    words = document.getElementById("parent").children;
    wordCount = 0;
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
});

// Executed when the user pressed a key
document.addEventListener("keydown", function(event) {
        pressedKey = undefined;
        if (event.key === "Shift") {
            document.addEventListener("keydown", function(event) {
                pressedKey = event.key;
            });
            if (pressedKey === undefined) {
                return;
            }
        }
        if (event.key === "Backspace") {
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
        if (event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }
        switch (event.key) {
            case "CapsLock": return;
            case "Delete": return;
            case "Insert": return;
            case "PageDown": return;
            case "PageUp": return;
            case "End": return;
            case "Home": return;
            case "ArrowRight": return;
            case "ArrowLeft": return;
            case "ArrowDown": return;
            case "ArrowUp": return;
            case "Enter": return;
            default: pressedKey = event.key;
        }

        prevLetter = currentLetter;
        if (prevLetter === pressedKey) {
            correct(cursor); 
            correctCount++;
        }else{
            incorrect(cursor);
            incorrectCount++;
        }
        letterCount++;
        charactersTyped++;
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
        if(currentLetter !== prevLetter) {
            removeKeyHighlight(prevLetter); 
        }
        cursor = returnCursor(wordCount, letterCount);
        cursorBackground(cursor);

});
