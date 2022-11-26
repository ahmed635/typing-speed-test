// selections
let startGame = document.querySelector(".start button");
let selectLevel = document.querySelector("main aside .levels select");
let theWord = document.querySelector(".the-word");
let upComingWords = document.querySelector(".upcoming-words");
let input = document.querySelector("section .container .input");
let history = document.querySelector(".history p");

// options
let level = 'easy';
let levelTime = 5;
let score = 0;
let randomWord;
// words
let words = [
    'Done',
    'Ok',
    'Programming',
    'Hello',
    'code',
    'Testing',
    'Youtube',
    'Country',
    'Town',
    'Coding',
    'paradigm',
    'styling',
    'hard',
    'easy',
    'normal'
]
let wordsLength = words.length;

// levels
let levels = {
    'easy': 5,
    'normal': 3,
    'hard': 2
}

// show level and time to the user
showData()

// show the instuction
showInstructions();

// show the previous history
history.onclick = showPreviousHistory;

selectLevel.onchange = (e) => {
    // get level and time
    level = e.target.value;
    levelTime = levels[level];

    // show level and time to the user
    document.querySelector("section .container .message .lvl").innerHTML = level;
    document.querySelector("section .container .message .seconds").innerHTML = levelTime;
    document.querySelector(".control .time span").innerHTML = levelTime;
};
startGame.onclick = () => { 
    startGame.remove();
    selectLevel.parentElement.remove();

    // generate random word
    generateRandomWord();
};

// generate word function
function generateRandomWord() {
    let randomIndex = Math.floor(Math.random() * words.length);
    randomWord = words[randomIndex];
    // delete the random word from the list of words
    words.splice(randomIndex, 1);
    theWord.innerHTML = randomWord;
    // start the timer 
    timeDown(levelTime);
    // show all the words
    words.forEach((word) => {
        let div = document.createElement("div");
        let text = document.createTextNode(word);
        div.appendChild(text);
        upComingWords.appendChild(div);
    });
}

// show instuction function
function showInstructions() {
    let ul = document.createElement("ul");
    Object.entries(levels).map((level) => {
        let item = document.createElement("li");
        let itemText = document.createTextNode(`${level[0]} Level Has ${level[1]} Seconds`);
        // add text into item
        item.appendChild(itemText)
        // add li into the ul
        ul.appendChild(item);
    });
    // add the ul to instrucition class div
    document.querySelector("main aside .instructions").appendChild(ul);
}

// time down function
function timeDown(seconds) {
    let counter = setInterval(() => {
        document.querySelector(".control .time span").innerHTML = seconds;
        // decrease the seconds
        seconds--;
        if (seconds == 0) {
            clearInterval(counter);
            clearFields();
            if(words.length == 0) {
                clearInterval(counter);
                finishGame();
            } else {
                generateRandomWord();
            }
        } else if (randomWord.toLowerCase() === input.value.toLowerCase()) {
            clearInterval(counter);
            // increate the score
            score++;
            input.value = '';
            document.querySelector('.control .score .got').innerHTML = score;
            clearFields();
            if(words.length == 0) {
                clearInterval(counter);
                finishGame();
            } else {
                generateRandomWord();
            }
        } else {
            // Do Nothing
        }
    }, 1000);

}

// function to show the data
function showData() {
    document.querySelector("section .container .message .lvl").innerHTML = level;
    document.querySelector("section .container .message .seconds").innerHTML = levelTime;
    document.querySelector(".control .time span").innerHTML = levelTime;
    document.querySelector(".control .score .total").innerHTML = words.length;
}

// function to clear fields
function clearFields() {
    // clear the input field
    input.value = '';
    // clear the upcoming words
    upComingWords.innerHTML = '';
}

// function to finish the game
function finishGame() {
    // clear the word
    theWord.remove();
    input.remove();
    // store in local storage
    storeHistory();
    let finish = document.querySelector(".finish");
    if (score >= words.length / 2) {
        finish.classList.add("good");
        finish.appendChild(document.createTextNode("Good"));
    } else {
        finish.classList.add("bad");
        finish.appendChild(document.createTextNode("Good"));
    }
}

// to store the history to localstorage
function storeHistory() {
    let today = new Date();
    if (localStorage.getItem('history')) {
        console.log("there is data in localstorage");
        let previousHistory = JSON.parse(localStorage.getItem('history'));
        // add new history
        previousHistory.unshift({
            "level": level,
            "date": `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`,
            "time": `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`,
            "score": `You Got ${score} From ${wordsLength}`,
        });
        // add all history into localstorage
        localStorage.setItem("history", JSON.stringify(previousHistory));
    } else {
        console.log("there are not data into localstorage");
        let record = [{
            "level": level,
            "date": `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`,
            "time": `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`,
            "score": `You Got ${score} From ${wordsLength}`,
        }];
    
        localStorage.setItem("history", JSON.stringify(record));
    }
}

// create history elements
function createHistory(data) {
    for (let i = 0; i < data.length; i++){
        let ul = document.createElement("ul");
        Object.entries(data[i]).map((record) => { 
            let item = document.createElement("li");
            item.appendChild(document.createTextNode(`${record[0]}: ${record[1]}`))
            ul.appendChild(item);
        });
        // append ul into the history container
        document.querySelector(".history").appendChild(ul);
    }
}

// show previous history function
function showPreviousHistory() {
    history.remove();
    if (localStorage.getItem('history')) {
        console.log("there is data in localstorage");
        createHistory(JSON.parse(localStorage.getItem("history")));
    } else {
        console.log("there are not data into localstorage");
        let ul = document.createElement("ul");
        let item = document.createElement("li").appendChild(document.createTextNode("No History."));
        ul.appendChild(item)

        document.querySelector('.history').appendChild(ul);
    }
}
