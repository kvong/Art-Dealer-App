var count = 0;
var currentRound = 0;
var totalRounds;

function getArgument(argName) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(argName);
}

// Perform when a card at the seller's table is clicked
function makeSelection(cardId) {
    // Get card clicked
    let cardChoice = document.getElementById(cardId);

    // Get all choices given to dealer so far
    let selection0 = document.getElementById("choice0");
    let selection1 = document.getElementById("choice1");
    let selection2 = document.getElementById("choice2");
    let selection3 = document.getElementById("choice3");
    let allSelections = [selection0, selection1, selection2, selection3];

    // Check selected cards to see if card that's just been clicked has been selected
    let beenSelected = false;
    for (let i = 0; i < allSelections.length; i++ ){
        if (allSelections[i].alt == cardChoice.alt) {
            beenSelected = true;
        }
    }

    // Determine to add or remove card
    if (cardChoice.style.border == "0px none" && beenSelected == false) {
        // For adding a new card
        
        // Draw box around selected cards
        cardChoice.style.border = "2px solid red";

        // Look for openings on the buyer's table
        let selectedCardChoice = null;
        
        // Loop backward so that cards are filled left to right
        for (let i = 0; i < allSelections.length; i++ ){
            if (allSelections[i].alt == "choice") {
                selectedCardChoice = allSelections[i];
                count = (i + 1) % 4
                break;
            }
        }

        // If no openings on buyer's table
        if (selectedCardChoice != null){
            // Fill empty slot with opening card
            let selectedCardId = selectedCardChoice.alt;

            selectedCardChoice.alt = cardId;
            selectedCardChoice.src = cardChoice.src;
        }
        else{
            // Remove a card on the buyer's table
            
            // Erase box around removed card on the seller's table
            document.getElementById(allSelections[count].alt).style.border = "0px none";

            // Add new card
            allSelections[count].alt = cardId;
            allSelections[count].src = cardChoice.src;

            // Move to next index for next removal should that be the case again
            count++;
            count = count % 4;
        }

    }
    else{
        // Take the card back if card is already on the seller's table
        
        // Erase box on seller's table
        cardChoice.style.border = "0px none";

        // Update buyer's table
        for (let i = 0; i < allSelections.length; i++ ){
            // Remove the card and open up the slot
            if (allSelections[i].alt == cardId) {
                allSelections[i].alt = "choice";
                allSelections[i].src = "blank";
                allSelections[i].style.border = "0px none";
                break;
            }
        }
    }
}

// Take away card from buyer's table
function clearCard(slotId) {
    let slot = document.getElementById(slotId);

    // Clearing card on seller's table
    if (slot.alt != "choice") {
        let cardId = slot.alt;
        document.getElementById(cardId).style.border = "0px none";
    }

    // Clearing slot
    slot.alt = "choice";
    slot.src = "blank";
    slot.style.border = "0px none";
}

// Function to reset the seller and buyer's table
function clearSelections() {
    // Grab all elements on buyers's table
    let selection0 = document.getElementById("choice0");
    let selection1 = document.getElementById("choice1");
    let selection2 = document.getElementById("choice2");
    let selection3 = document.getElementById("choice3");
    let allSelections = [selection0, selection1, selection2, selection3];

    // Resetting count index
    count = 0;

    // Remove all cards from buyers's table
    for (let i = 0; i < allSelections.length; i++ ){
        // Only remove when there's a card on the buyers's table
        if (allSelections[i].alt != "choice") {
            // Erase box from seller's table
            document.getElementById(allSelections[i].alt).style.border = "0px none";

            // Set slots on buyer's to indicate empty slots
            allSelections[i].alt = "choice";
            allSelections[i].src = "blank";
            allSelections[i].style.border = "0px none";
        }
    }
}


// Set global sum for 'sum of number' pattern
let totalSum = 0;
// Change pattern selections based on game
let randomPattern = 0;
// Start a new round by changing buying pattern
function startNewRound() {
    if (document.title == "3-5 Game") {
        randomPattern = Math.random() * 100 % 7;
        randomPattern = Number(randomPattern.toFixed());
    }
    else if (document.title == "6-8 Game") {
        randomPattern = Math.random() * 100 % 8;
        randomPattern = Number(randomPattern.toFixed()) + 4;
        totalSum = Math.floor((Math.random() * 20) + 5 );
    }
    else{
        console.log(document.title);
    }
}

// Function for submission of cards
function submitSelections() {
    // Get all choices given to dealer so far
    let selection0 = document.getElementById("choice0");
    let selection1 = document.getElementById("choice1");
    let selection2 = document.getElementById("choice2");
    let selection3 = document.getElementById("choice3");
    let allSelections = [selection0, selection1, selection2, selection3];

    // Validate that seller has offered up four cards
    let hasError = false;
    for (let i = 0; i < allSelections.length; i++ ){
        // If there's an empty slot 
        if (allSelections[i].alt == "choice"){
            // Print error message
            alert("Please select four cards to submit.");
            hasError = true;
            break;
        }
    }   

    // If no errors detected proceed with submission
    let cardIndexes = [];
    if (hasError == false) {
        for (let i = 0; i < allSelections.length; i++ ){
            // Get card index for lookup by extracting
            let cardIndex = allSelections[i].alt.replace("card", "");
            cardIndex = Number(cardIndex);
            cardIndexes.push(cardIndex);
        }

        // Check Pattern
        let returnedCards = matchPatterns(randomPattern, [cards[cardIndexes[0]], cards[cardIndexes[1]], cards[cardIndexes[2]], cards[cardIndexes[3]]], totalSum);
        console.log(returnedCards);

        if (returnedCards != null) {
            // Start new round if all four cards matches our pattern
            if (returnedCards.length == 4) {
                for (let j = 0; j < allSelections.length; j++ ){
                    allSelections[j].style.border = "2px solid yellow"
                }
                alert("Buyer has brough all your cards!");
                console.log("Starting new round");
                clearSelections();
                currentRound++;
                if (currentRound < totalRounds) {
                    startNewRound();
                }
                else{

                }
            }
            // Highlight cards that were brought
            else if (returnedCards.length > 0) {
                for (let i = 0; i < returnedCards.length; i++ ){
                    let card = returnedCards[i];
                    for (let j = 0; j < allSelections.length; j++ ){
                        let cardIndex = allSelections[j].alt.replace("card", "");
                        cardIndex = Number(cardIndex);
                        if (card.index == cardIndex) {
                            allSelections[j].style.border = "2px solid yellow";
                            break;
                        }
                    }
                }
                let message = document.getElementById("message");
                message.innerHTML = returnedCards.length + " cards were brought by the buyer.";
            }
        }
        else{
            let message = document.getElementById("message");
            message.innerHTML = "No cards were brought by the buyer. Try again.";
        }
    }
}

startNewRound();

// totalRounds = getArgument('rounds');
// console.log("Total rounds are " + totalRounds);
