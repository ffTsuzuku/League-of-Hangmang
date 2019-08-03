let phrase; 

const main = function () {

    //let category = prompt("Skin Or Champion?").toLowerCase();
    
    let category = "skin";
    
    if(category === "skin") { phrase = championSkin(); }

    if(category === "champion") { phrase = championName(); }

    //Initialize the board.
    initBoard();
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
 * Draws out the board with the appropriate blank spaces.
 */
const initBoard = function () {
    const blank = "___";
    const space = "   ";
    const phraseDiv = document.getElementById("phrase");
    const livesDiv = document.getElementById("hearts");


    //Draw the hearts
    for(let i = 0; i < 10; i++) { 
        let heart = document.createElement("div");
        heart.classList.add("heart");
        
        livesDiv.appendChild(heart);
    }

    //Draw the words/letters/phrase
    for(let i = 0; i < phrase.length; i++) { 

        let word = document.createElement("div");
        word.classList.add("word");

        while(phrase.charAt(i) !== " ") {

            if(phrase.charAt(i) === "") { break; } // Phrase ended

            let letter = document.createElement("h1");
            letter.innerHTML = blank;
            letter.classList.add("letter");
            word.appendChild(letter)
            i++;
        }
        
        phraseDiv.appendChild(word);
    }
}