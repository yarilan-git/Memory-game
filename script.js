const gameContainer = document.getElementById("game");

let COLORS = [];
  

//Counters
let matchingPairs;
let currentScore;
let historicBestScore;
let clicks;

//Elements
const historicScore = document.getElementById("bestHistoricScore");
const score = document.getElementById("currentScore");
const startButton = document.querySelector("button");
const numOfcards = document.querySelector("input");
const errorMessage = document.querySelector(".error");
const restartBtn = document.querySelector(".restart");
const inputField = document.querySelector("#numOfCards");
const form = document.querySelector("form");


// Other variables
let previousColor;
let previousCard;
let maxPairs;
let userChoice;


// start game listener function
const startGame = function (e) {
  e.preventDefault();
  // Reset variables and counters
  currentScore = 0;
  score.innerText = currentScore;
  matchingPairs = 0;
  clicks = 0;
  COLORS = [];
  
  // Display the best historic score, from previous games
  displayBestScore();

  // Check if the user's input is a valid number
  userChoice = parseInt(numOfcards.value);
  if (userChoice % 2 > 0 ||
      userChoice < 2 ||
      userChoice > 100 ||
      isNaN(userChoice)) {
        errorMessage.innerText = "Only even numbers up to 100 are allowed!";
        return;
    }  else {
      errorMessage.innerText = ' ';
    }

    // Reset the maximum number of matching pairs based on the user's choice
    maxPairs = userChoice / 2;

    // Generate colors based on the user's choice
    for (let i=0; i < userChoice-1; i +=2) {
      COLORS.push(`rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`);
      COLORS.push(COLORS[i]);
    }
    let shuffledColors = shuffle(COLORS);

    // Lay out the cards on the page
    createDivsForColors(shuffledColors);

    // Remove the form 
    form.style.display = "none";

    
  }
    
// Game start-over listener function
const startOver = function (e) {
  numOfcards.value = "";
  // Display the best historic score, from previous games
  displayBestScore();
  e.target.style.display = "none";  // Hide the start-over button for now
  form.style.display =  "block";  // Display the form for the user

  // Clean the board 
  let cards = document.querySelectorAll(".card");
  for (let i = 0; i < cards.length; i++) {
    cards[i].remove();
  }

}
  
  


// Function to increase the score and flip cards
function countAndFlip(e) {
  currentScore++;
  score.innerText = currentScore;
  e.target.style.backgroundColor =  e.target.classList[0];
}

// function to retreive historic best score from local storage and display it
function displayBestScore() {
  historicBestScore = localStorage.getItem("score");
  historicScore.innerText = historicBestScore;
}

// Function to save the current score to local storage
function saveScoreHistory() {
  if (currentScore < historicBestScore || historicBestScore === null) {
    localStorage.setItem("score", currentScore);
  }
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}



// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    // Added by Yaron: Also add a 'card' class, to enable cleaning the board
    //                 when the game starts/restarts
    newDiv.classList.add(color, "card");
    
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  
  // We are executing the function only if the game is not over yet, and
  // the user did not click on more than 2 cards, and the user did not
  // click on the same card more than once
  if (matchingPairs < maxPairs && clicks < 2 && event.target != previousCard) {
   
    clicks++;
    switch (clicks) {
      case 1:  // If this is the first card of two
        
        countAndFlip(event); // score it and turn the card over
        previousColor = event.target.classList[0]; // remember the current color
        previousCard = event.target; // remember the current card
        break;

      case 2:   // If this is the second card of two

        countAndFlip(event); // score it and turn the card over

        // If the color matches the previous card's color
        if (event.target.classList[0] === previousColor) {
          matchingPairs++

          // If all matching pairs have been found
          if (matchingPairs === maxPairs) {
              
              saveScoreHistory();     // If the score is lower than history, save to history
              restartBtn.style.display = "inline"; // Show the restart button
          }

          // Wait one second before allowing the user to guess another pair
          setTimeout(function () {clicks = 0;}, 1000);
        } else {     
            //  If the cards don't match, wait one second before turning them down again.
            setTimeout(function () {
              previousCard.style.removeProperty("background-color");
              event.target.style.removeProperty("background-color");
              clicks = 0;
            }, 1000);
        }
        
        break;
      default:
        setTimeout(function () {clicks = 0;}, 1000);
    }
    
      
  }
}
  
// you can use event.target to see which element was clicked

// when the DOM loads

// Retieve from local storage the best historic score and display it
displayBestScore();

// Reset the current score to zero and display it
currentScore = 0;
score.innerText = currentScore;

// Reset the user choice for number of card
numOfcards.value = "";


// Attach the 'start game' listener to the Start button.
startButton.addEventListener("click", startGame);

// Attach the 'restart' listener to the Restart button
restartBtn.addEventListener("click", startOver);
