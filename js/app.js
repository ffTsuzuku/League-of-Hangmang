//Globals
let phrase;  //Is the thing that needs to be guessed. 
const  health = 10; //Is the players health static for now. 
let currentHealth = health;
let guesses = [];
const blank = "___";
const space = "   ";
let phraseDiv;
let livesDiv;
let guessableCharacters = 0;

const main = function () {

    //let category = prompt("Skin Or Champion?").toLowerCase();
    
    let category = "skin";
    
    if(category === "skin") { phrase = championSkin(); }

    if(category === "champion") { phrase = championName(); }

    phraseDiv = document.getElementById("phrase");
    livesDiv = document.getElementById("hearts");

    //Initialize the board.
    initBoard();

    let input = document.getElementById("guessInput");
    //Add the onkey press to the input if not mobile
    //if (!/Mobi|Android/i.test(navigator.userAgent)) {
     //   input.addEventListener("keyup", function () { makeGuess(String.fromCharCode(event.keyCode)); } );
    //}

    let submit = document.getElementById("submit");
    submit.addEventListener("click", function() { makeGuess(input.value); });
};


/**
 * Selects a random champion from the api json file. 
 * 
 * @return: An object containing champion properties. 
 */
const randomChampion = function() {
    let championID;

    //We ensure that the random champion id we generate actually exist. 
    while(!championID) { 
        championID = api.keys[Math.floor(Math.random() * 
            Object.keys(api.keys).length)];
    }

    return api.data[championID];
}

/**
 * Given a champion object, this function returns the name of the champion. 
 * 
 * @param champion: Is the Object containing the champion, if none are passed. 
 *                  A champion will be randomly picked. 
 * 
 * @return: A String containing the champion name.
 */
const championName = function (champion = null) {
    if(!champion) { champion = randomChampion(); }
    return champion.name;
}

/**
 * Given a Champion Object, this function picks a random skin. 
 * If no Object is given a random one is selected. 
 * 
 * @param champion: The champion for which to randomly get a skin for. 
 *                  if null, a champion will be randomly selected. 
 * 
 * @return: A String containing a skin name. 
 */
const championSkin = function(champion = null) {

    if(!champion) { champion = randomChampion(); }

    let skins = champion.skins.slice(1); //Remove the first skin, since its default. 

    return skins[Math.floor(Math.random() * skins.length)].name;
};

/**
 * Draws the appropriate ammount of Hearts.
 */
const renderHealth = function() {
    livesDiv.innerHTML = "";
    for(let i = 0; i < currentHealth; i++) { 
        let heart = document.createElement("div");
        heart.classList.add("heart");
        
        livesDiv.appendChild(heart);
    }
}

/**
 * Draws out the board with the appropriate blank spaces.
 */
const initBoard = function () {

    //Draw the hearts
    renderHealth();

    //Draw the words/letters/phrase
    for(let i = 0; i < phrase.length; i++) { 

        let word = document.createElement("div");
        word.classList.add("word");

        while(phrase.charAt(i) !== " ") {

            if(phrase.charAt(i) === "") { break; } // Phrase ended

            let letter = document.createElement("div");
            let character = document.createElement("h1");
            character.innerHTML = phrase.charAt(i);
            character.classList.add("character");
            letter.appendChild(character);
            letter.classList.add("letter");
            word.appendChild(letter);
            guessableCharacters++;
            i++;
        }
        
        phraseDiv.appendChild(word);
    }
}

/**
 * This function reveals the answer 
 */
const revealAnswer = function () {
    let wordList = phraseDiv.children;

    for(let i = 0; i < wordList.length; i++) {
        let characterList = wordList[i].children;
        for(let j = 0; j < characterList.length; j++) {
            characterList[j].children[0].style.display = "Block";
        }
    }
}

/**
 * Disabled the Input, and Reads out the Message.
 */
const endGame = function(message) {
    document.getElementById("guessInput").disabled = true;
    alert(message);
}

/***
 * This functions handles the logic for when a player enters
 * a guess. 
 * 
 * @return: 
 */
const makeGuess = function(guess) {
    let wordList = phraseDiv.children;
    let badGuess = true;

    //wipe input
    let input = document.getElementById("guessInput");
    input.value = "";

    //Make sure the guess hasn't be done before. 
    for(let k = 0; k < guesses.length; k++) {
        if(guess.toLowerCase() === guesses[k]){
            alert("Already Made this Guess");
            return;
        }
    }

    guesses.push(guess.toLowerCase()); //Push the new guess into the guesses list.
    let character = document.createElement("h1");
    character.innerHTML = guess;
    document.getElementById("guesses").appendChild(character);

    //Reveal the letters where the guess is correct. 
    for(let i = 0; i < wordList.length; i++) {
        let characterList = wordList[i].children;
        for(let j = 0; j < characterList.length; j++) {
            if(characterList[j].children[0].innerHTML.toLowerCase() === guess.toLowerCase()) {
                badGuess = false;
                characterList[j].children[0].style.display = "Block";

                if(--guessableCharacters <= 0) {
                    endGame("Victory!");
                }
            }
        }
    }

    //If its an incorrect guess. update health. 
    if(badGuess) {
        currentHealth--;
        renderHealth();

        if(currentHealth === 0) { 
            
            endGame("Your Nexus Has Exploded.");
            revealAnswer();
        }
    }
}