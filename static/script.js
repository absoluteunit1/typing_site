document.addEventListener('DOMContentLoaded', function() {

// GLOBAL VARIABLES

    let speedText = document.getElementById("wpm");
    let accuracyText = document.getElementById("percentage")
    let timeElapsed;
    let startingTime;
    let currTime;
    let charactersTyped = 0;
    let charactersTyped3SecondsAgo = 0;
    let userActive = false;
    let speed;
    let accuracy;
    let totalLetters;
    let words;
    let wordCount;
    let letterCount;
    let strictLetterCount;
    let correctCount;
    let incorrectCount;
    let cursor;
    let currentLetter;
    let totalWords;
    let pressedKey;
    let prevLetter;
    let currWordLength;


// FUNCTIONS

// Putting text into html
    addWordsToLine = (word, lastWord = false) => {
        let textBox = document.getElementById("textBox");
        let wordWrapper = document.createElement("div");
        wordWrapper.className = "wordwrap";
        for (let i = 0; i < word.length; i++) {
            let span = document.createElement("span");
            span.textContent = word[i];
            wordWrapper.appendChild(span);
            textBox.appendChild(wordWrapper);
        }
        if (!lastWord) {
            textBox.innerHTML += '<div class="wordwrap"><span> </span></div>';
        }
    }
    addWords = (arr) => {
        let i = 0;
        let line = document.createElement("div");
        line.id = "textBox";
        while (i !== arr.length) {
            let wordsWrap = document.getElementById("wordswrap");
            wordsWrap.appendChild(line);
            if (i + 1 === arr.length) {
                addWordsToLine(arr[i], true);
            } else {
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

        if (leftShiftKeys.includes(character)) {
            return leftId;
        } else if (rightShiftKeys.includes(character)) {
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
        if (character.toLowerCase() !== character.toUpperCase()) {
            return character.toLowerCase();
        } else if (keys[character] != null) {
            return keys[character];
        } else {
            return character;
        }
    }

// Highlights the current character on the keyboard
    highlightKeyboardKey = (currentLetter) => {
        let keyboardKey;
        if (whichShift(currentLetter) === undefined) {
            keyboardKey = document.getElementById(returnKeyId(currentLetter));
            keyboardKey.style.backgroundColor = "rgba(255,255,255,0.15)";
        } else if (whichShift(currentLetter) === "LeftShift") {
            let leftShiftKey = document.getElementById("LeftShift");
            keyboardKey = document.getElementById(returnKeyId(currentLetter));
            leftShiftKey.style.backgroundColor = "rgba(255,255,255,0.15)";
            keyboardKey.style.backgroundColor = "rgba(255,255,255,0.15)";
        } else {
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
        } else if (whichShift(prevLetter) === "LeftShift") {
            let leftShiftKey = document.getElementById("LeftShift");
            keyboardKey = document.getElementById(returnKeyId(prevLetter));
            leftShiftKey.style.backgroundColor = "#232946";
            keyboardKey.style.backgroundColor = "#232946";
        } else {
            let rightShiftKey = document.getElementById("RightShift");
            keyboardKey = document.getElementById(returnKeyId(prevLetter));
            rightShiftKey.style.backgroundColor = "#232946";
            keyboardKey.style.backgroundColor = "#232946";
        }
    }

    returnCursor = (wordCount, letterCount) => {
        return document.getElementById("textBox")
            .getElementsByClassName("wordwrap")[wordCount]
            .getElementsByTagName("span")[letterCount];
    }

// Clears the text from the page
    clearWords = () => {
        return document.getElementById("wordswrap").innerHTML = "";
    };

//Cursor Functions for changing the cursor background
    cursorBackground = (cursor) => cursor.id = "cursor";
    correct = (cursor) => cursor.id = "correct";
    incorrect = (cursor) => cursor.id = "incorrect";
    clearBackground = (cursor) => cursor.id = "clear";

//__________________________________TESTING AREA____________________________________________

// _________________________________________________________________________________________


// INTERVALS

// Updates the WPM display every second
    setInterval(() => {

        // Update WPM if user is active; otherwise do not update
        if (userActive === true) {
            //start tracking the speed
            speed = Math.round(((charactersTyped / 5) / timeElapsed)).toString();
            if (speed !== "NaN" && speed !== "0") {
                speedText.innerText = speed;
            }
        }

        // Update accuracy every 1s
        if (strictLetterCount > 0) {
            accuracy = Math.round((correctCount / strictLetterCount) * 100);
            accuracyText.innerText = accuracy.toString();
        }
    }, 1000);

// Check if the user is actively typing; if not, reset the timer and characters typed
    setInterval(() => {
        if (charactersTyped3SecondsAgo !== charactersTyped) {
            userActive = true;
            charactersTyped3SecondsAgo = charactersTyped;
        } else {
            userActive = false;
            startingTime = undefined;
            charactersTyped = 0;
        }
    }, 2000);


//SERVER CALLS

// GetText: Make server call to get the text, load the text into the html,dispatch event 'loadedText'
    const getText = async () => {
        const response = await fetch("/text");
        const myText = await response.text();
        totalLetters = myText.length;
        addWords(myText.split(" "));
        document.dispatchEvent(loadedText);
    }


//CUSTOM EVENTS

// Event: server call was made and text was loaded into the text area
    const loadedText = new Event('loadedText');

// Event: user finished typing the current text
    const finishedTyping = new Event('finishedTyping');


//EVENT LISTENERS

// Prevent browser from triggering default keyboard shortcut behaviours
    window.onkeydown = function (e) {
        if (e.target === document.body) {
            e.preventDefault();
        }
    }

// Loads text into the text-box area on window load
    window.addEventListener('load', () => {
        getText();
    })

// Executed when the user finished typing
    document.addEventListener('finishedTyping', function () {
        getText();
    });

// Executed when the text was loaded into the page
    document.addEventListener('loadedText', function () {
        words = document.getElementById("textBox").children;
        wordCount = 0;
        letterCount = 0;
        charactersTyped = 0;

        // Counter for tracking the number of correct vs incorrect characters typed
        strictLetterCount = 0;
        correctCount = 0;
        incorrectCount = 0;

        // Resetting the timer for speed calculation
        startingTime = undefined;
        userActive = false;

        // Resetting the gauge
        speedText.innerText = "-"
        accuracyText.innerText = "-"

        //Cursor
        cursor = returnCursor(wordCount, letterCount);
        cursorBackground(cursor)

        // Highlight the first character on the keyboard
        currentLetter = words[wordCount].childNodes[letterCount].textContent;
        highlightKeyboardKey(currentLetter);

        currWordLength = words[wordCount].childElementCount;
        totalWords = document.getElementById("textBox").childNodes.length;
    });

// Executed when the user pressed a key
    document.addEventListener("keydown", function (event) {
        userActive = true;
        if (startingTime === undefined) {
            startingTime = new Date().getTime();
        }
        currTime = new Date().getTime();
        timeElapsed = ((currTime - startingTime) / (1000 * 60));

        pressedKey = undefined;
        if (event.key === "Shift") {
            document.addEventListener("keydown", function (event) {
                pressedKey = event.key;
            });
            if (pressedKey === undefined) {
                return;
            }
        }
        if (event.key === "Backspace") {
            if (letterCount === 0 && wordCount === 0) {
                return;
            } else if (letterCount === 0) {
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
            } else {
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
            case "CapsLock":
                return;
            case "Delete":
                return;
            case "Insert":
                return;
            case "PageDown":
                return;
            case "PageUp":
                return;
            case "End":
                return;
            case "Home":
                return;
            case "ArrowRight":
                return;
            case "ArrowLeft":
                return;
            case "ArrowDown":
                return;
            case "ArrowUp":
                return;
            case "Enter":
                return;
            default:
                pressedKey = event.key;
        }

        prevLetter = currentLetter;
        if (prevLetter === pressedKey) {
            correct(cursor);
            correctCount++;
        } else {
            incorrect(cursor);
            incorrectCount++;
        }
        letterCount++;
        strictLetterCount++;
        charactersTyped++;
        if (letterCount === currWordLength) {
            wordCount++;
            letterCount = 0;
            if (wordCount === totalWords) {
                // If the previous word was the last word in the text, clear the text
                // and load another. Clear the starting time and characters typed so speed tracking
                // is reset as well.
                clearWords();
                removeKeyHighlight(prevLetter);
                document.dispatchEvent(finishedTyping);
                return;
            }
            currWordLength = words[wordCount].childElementCount;

        }
        currentLetter = words[wordCount].childNodes[letterCount].innerText;
        highlightKeyboardKey(currentLetter);
        if (currentLetter !== prevLetter) {
            removeKeyHighlight(prevLetter);
        }
        cursor = returnCursor(wordCount, letterCount);
        cursorBackground(cursor);

    });
})