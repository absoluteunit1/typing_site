var text1 = ["Hello,", "this", "is", "my", "final", "project", "for", "CPS530.", "At", "this", "stage", "it", "doesn't", "fully", "work", "but", "hopefully", "it", "will", "by", "December", "7th.", "The", "idea", "is", "that", "the", "background", "of", "each", "letter", "changes", "to", "either", "pink", "if", "the", "user", "typed", "a", "correct", "letter;", "red", "if", "the", "user", "typed", "an", "incorrect", "letter."]
var text2 = ["Hello,", "this", "is", "my", "test", "for", "CPS530.", "At", "this", "stage", "it", "doesn't", "fully", "work", "but", "hopefully", "it", "will", "by", "December", "7th.", "The", "idea", "is", "that", "the", "background", "of", "each", "letter", "changes", "to", "either", "pink", "if", "the", "user", "typed", "a", "correct", "letter;", "red", "if", "the", "user", "typed", "an", "incorrect", "letter."]

addWordsToLine = (word) => {
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
	line.innerHTML += '<div class="wordwrap"><span> </span></div>';
}

addWords = (arr) => {
	var i = 0;
	var line = document.createElement("h3");
	line.id = "parent";
	while (i != arr.length) {
		var wordsWrap = document.getElementById("wordswrap");
		wordsWrap.appendChild(line);
		addWordsToLine(arr[i]);
		i++;
	}

}

clearWords = () => document.getElementById("wordswrap").innerHTML = "";
cursorBackground = (cursor) => cursor.id = "cursor";
correct = (cursor) => cursor.id = "correct";
incorrect = (cursor) => cursor.id = "incorrect";


addWords(text1);
clearWords();
addWords(text2);


words = document.getElementById("parent").children;
// console.log(words)
// element = document.getElementById("parent").getElementsByClassName("wordwrap")[0].getElementsByTagName("span")[0];
// element.style.backgroundColor="#eebbc3";
// element.style.color="#232946";
// console.log(words[0].childNodes);
// console.log(words[0].childNodes[0].innerText);

// Finds the key on the keyboard
var temp = document.getElementById((words[0].childNodes[0].innerText).toLowerCase());
temp.style.backgroundColor="white";
var l = words.length;


// Counters
var word_count   = 0;
var letter_count = 0;

var total_words = text2.length;
var word_length = words[word_count].childNodes.length;

//Cursor
var cursor = document.getElementById("parent").getElementsByClassName("wordwrap")[word_count].getElementsByTagName("span")[letter_count];
console.log(cursor);
cursorBackground(cursor);


document.addEventListener("keydown", function(event) {
    
    // Resets the previously pressed key color
    // temp.style.backgroundColor="#232946";
    var key = event.key;

    var keyboardKey = document.getElementById( (words[word_count].childNodes[letter_count].innerText).toLowerCase());
    keyboardKey.style.backgroundColor = "white";
    if (cursor.innerHTML == " ") {
        console.log("Here");
    }

    if ( key == "Spacebar" && cursor.innerHTML == " ") {
        correct(cursor);
    }else if ( key == cursor.innerHTML ) {
        correct(cursor);
    }else{
        incorrect(cursor);
    };

    letter_count++;

    if ( letter_count == word_length + 1 ){
        word_count++;
        word_length = word[word_count].childNodes.length;
        letter_count = 0;
    }

    cursor = document.getElementById("parent").getElementsByClassName("wordwrap")[word_count].getElementsByTagName("span")[letter_count];
    console.log(cursor);
    cursorBackground(cursor);
    
});


// Iterator
// 1. Have a total list of words. Count which word you're on in the listener.
// 2. Have a count of letters per word. If count reaches the end, move cursor to next word. 
// 3. Have a checker if correct letter is typed. 
// 4. Check if letter is a capital, or special symbol (highlight shift as well then).
// 5. 
