// Card Class
class Card {
    constructor(color, value) {
        this.color = color;
        this.value = value;
    }

    toString() {
        return `${this.value} of ${this.color}`;
    }
}

// UNO Deck
class UnoDeck {
    constructor() {
        this.cards = [];
        this.initDeck();
        this.shuffle();
    }

    initDeck() {
        const colors = ['Red', 'Green', 'Blue', 'Yellow'];
        const specialCards = ['Skip', 'Reverse', 'Draw Two'];
        const wildCards = ['Wild', 'Wild Draw Four'];

        for (let color of colors) {
            for (let i = 0; i <= 9; i++) {
                this.cards.push(new Card(color, i));
                if (i !== 0) this.cards.push(new Card(color, i));
            }
            for (let special of specialCards) {
                this.cards.push(new Card(color, special));
                this.cards.push(new Card(color, special));
            }
        }

        for (let wild of wildCards) {
            this.cards.push(new Card('Wild', wild));
            this.cards.push(new Card('Wild', wild));
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    drawCard() {
        return this.cards.pop();
    }

    remainingCards() {
        return this.cards.length;
    }
}

// Player Class
class Player {
    constructor(name) {
        this.name = name;
        this.hand = [];
    }

    drawCard(deck) {
        const card = deck.drawCard();
        this.hand.push(card);
    }

    playCard(index, topCard) {
        const selectedCard = this.hand[index];
        if (this.canPlayCard(selectedCard, topCard)) {
            return this.hand.splice(index, 1)[0];
        } else {
            return null;
        }
    }

    canPlayCard(card, topCard) {
        return card.color === topCard.color || card.value === topCard.value || card.color === 'Wild';
    }
}

// Game Logic
const deck = new UnoDeck();
const player = new Player("Player");
const computer = new Player("Computer");

let topCard = deck.drawCard();
let playerTurn = true;

// Colors for selection
const colors = ['Red', 'Green', 'Blue', 'Yellow'];

// Start the game
function startGame() {
    for (let i = 0; i < 7; i++) {
        player.drawCard(deck);
        computer.drawCard(deck);
    }

    renderTopCard();
    renderHand();
    updateMessage("Your turn!");
}

function renderTopCard() {
    const topCardDiv = document.getElementById('top-card');
    topCardDiv.innerHTML = `<div class="card ${topCard.color.toLowerCase()}">${topCard.value}</div>`;
}

function renderHand() {
    const handCardsDiv = document.getElementById('hand-cards-player');
    handCardsDiv.innerHTML = '';
    player.hand.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.color.toLowerCase()}`;
        cardDiv.innerText = card.value;
        cardDiv.onclick = () => playCard(index);
        handCardsDiv.appendChild(cardDiv);
    });
}

function updateMessage(message) {
    document.getElementById('game-message').innerText = message;
}

function playCard(index) {
    if (!playerTurn) return;

    const playedCard = player.playCard(index, topCard);
    if (playedCard) {
        if (playedCard.color === 'Wild') {
            updateMessage("You played a Wild card! Choose a color.");
            showColorSelection(); // Show color selection
        } else {
            topCard = playedCard;
            renderTopCard();
            renderHand();
            checkWinner(player);
            playerTurn = false;
            updateMessage("Computer's turn!");
            setTimeout(computerTurn, 1000);
        }
    } else {
        updateMessage("Invalid move! Try another card.");
    }
}

// Function to show color selection
function showColorSelection() {
    const colorSelectionDiv = document.createElement('div');
    colorSelectionDiv.id = 'color-selection';
    colors.forEach(color => {
        const colorButton = document.createElement('button');
        colorButton.innerText = color;
        colorButton.style.backgroundColor = color.toLowerCase();
        colorButton.style.color = 'white';
        colorButton.onclick = () => {
            topCard.color = color; // Change the top card color
            document.getElementById('top-card').innerHTML = `<div class="card ${color.toLowerCase()}">${topCard.value}</div>`;
            document.getElementById('color-selection').remove(); // Remove color selection
            playerTurn = false; // Switch to computer's turn
            computerTurn(); // Trigger computer's turn
        };
        colorSelectionDiv.appendChild(colorButton);
    });
    document.getElementById('game-container').appendChild(colorSelectionDiv);
}

// Computer's turn logic
function computerTurn() {
    let cardPlayed = false;
    for (let i = 0; i < computer.hand.length; i++) {
        if (computer.canPlayCard(computer.hand[i], topCard)) {
            const playedCard = computer.playCard(i, topCard);
            topCard = playedCard;
            renderTopCard();
            renderHand();
            checkWinner(computer);
            cardPlayed = true;
            break;
        }
    }
    if (!cardPlayed) {
        computer.drawCard(deck);
        updateMessage("Computer drew a card!");
    }
    playerTurn = true;
    updateMessage("Your turn!");
}

// Check for winner
function checkWinner(player) {
    if (player.hand.length === 0) {
        updateMessage(`${player.name} wins!`);
        resetGame();
    }
}

// Reset Game
function resetGame() {
    deck = new UnoDeck();
    player = new Player("Player");
    computer = new Player("Computer");
    startGame();
}

document.getElementById('draw-btn').onclick = () => {
    if (playerTurn) {
        player.drawCard(deck);
        renderHand();
        updateMessage("You drew a card!");
        playerTurn = false;
        setTimeout(computerTurn, 1000);
    }
};

document.getElementById('play-card-btn').onclick = () => {
    updateMessage("Click on a card to play.");
};

// Start the game on page load
window.onload = startGame;
