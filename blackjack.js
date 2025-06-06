/*
/   This is my blackjack js code
/   4/28/25 - Colin Adreani
*/

// ---------------------------------------------------------------- CANVAS SETUP ------------------------------------------------------------------------

// Grab the element and its 2-D rendering context
const canvas = document.getElementById('canvas');
const ctx     = canvas.getContext('2d');

// define canvas dimentions and scaling factor
const canvasWidth = 800;
const canvasHeight = 600;
const dpr = window.devicePixelRatio || 1;  // 2 on Retina

// set dimentions
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// give the element its *display size* (CSS)
canvas.style.width  = canvasWidth  + 'px';
canvas.style.height = canvasHeight  + 'px';

// allocate a larger backing store
canvas.width  = canvasWidth  * dpr;
canvas.height = canvasHeight  * dpr;

// scale canvas
ctx.scale(dpr, dpr);

(async () => {
  await document.fonts.load('25px "Limelight"');
})();

var msecs = Date.now();

// ---------------------------------------------------------------- DECK SETUP ------------------------------------------------------------------------

// define deck values
var suits = ["spades", "diamonds", "clubs", "hearts"];
var names = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
var values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

// create player object to store data
let player = {
  hand: [],
  cards: [],
  value: 0,
  money: 1000,
  bet: 0,
  isBust: false,
  blackjack: false,
  chips: {
      purples: 0,
      blacks: 0,
      greens: 0,
      blues: 0,
      reds: 0,
      arr: []
    },
  betToChips() {
    let saveBet = player.bet;
    let chips = {
      purples: 0,
      blacks: 0,
      greens: 0,
      blues: 0,
      reds: 0,
      arr: []
    }

    chips.purples = Math.floor(saveBet/500);
    saveBet = saveBet - chips.purples*500;

    chips.blacks = Math.floor(saveBet/100);
    saveBet = saveBet - chips.blacks*100;

    chips.greens = Math.floor(saveBet/25);
    saveBet = saveBet - chips.greens*25;

    chips.blues = Math.floor(saveBet/10);
    saveBet = saveBet - chips.blues*10;

    chips.reds = Math.floor(saveBet/5);

    player.chips = chips;
  },
  updateChips() {
    player.betToChips();

    for (let i = 0; i < player.chips.purples; i++) {
      player.chips.arr.push(new Chip(500));
    }
    for (let i = 0; i < player.chips.blacks; i++) {
      player.chips.arr.push(new Chip(100));
    }
    for (let i = 0; i < player.chips.greens; i++) {
      player.chips.arr.push(new Chip(25));
    }
    for (let i = 0; i < player.chips.blues; i++) {
      player.chips.arr.push(new Chip(10));
    }
    for (let i = 0; i < player.chips.reds; i++) {
      player.chips.arr.push(new Chip(5));
    }
  },
  drawChips(x, y) {
    for (const chip in player.chips.arr) {
      player.chips.arr[chip].draw(x, y-chip*8);
    }
  }
};

// create dealer object to store data
let dealer = {
  hand: [],
  cards: [],
  value: 0,
  isBust: false,
  blackjack: false,
  draw(armRotation) {
    ctx.lineWidth = 1;
    ctx.fillStyle = "#F9C04E";
    ctx.strokeStyle = "#F6AB13";
    ctx.beginPath();
    ctx.arc(700, 45, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#3B2802";
    ctx.strokeStyle = "#130C01";
    ctx.beginPath();
    ctx.arc(700, 45, 26, 0, Math.PI, true);
    ctx.stroke();
    ctx.lineTo(700-18, 45);
    ctx.lineTo(700-18, 45-10);
    ctx.lineTo(700+18, 45-10);
    ctx.lineTo(700+18, 45);
    ctx.lineTo(700+26, 45);
    ctx.fill();

    ctx.fillStyle = "#FBFBFF";
    ctx.beginPath();
    ctx.moveTo(679, 71);
    ctx.lineTo(700, 80);
    ctx.lineTo(721, 71);
    ctx.lineTo(721, 110);
    ctx.lineTo(679, 110);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#D6D6FF";

    ctx.beginPath();
    ctx.moveTo(695, 85);
    ctx.lineTo(680, 78);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(705, 85);
    ctx.lineTo(720, 78);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = "#F46786";
    ctx.beginPath();
    ctx.moveTo(700, 80);
    ctx.lineTo(705, 85);
    ctx.lineTo(700, 90);
    ctx.lineTo(707, 110);
    ctx.lineTo(700, 130);
    ctx.lineTo(693, 110);
    ctx.lineTo(700, 90);
    ctx.lineTo(695, 85);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#4B4448";
    ctx.beginPath();
    ctx.moveTo(679, 71);
    ctx.lineTo(700, 130);
    ctx.lineTo(721, 71);
    ctx.lineTo(750, 80);
    ctx.lineTo(721, 150);
    ctx.lineTo(679, 150);
    ctx.lineTo(650, 80);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#2B2729";
    ctx.stroke();

    ctx.save();
    ctx.translate(642, 97);
    ctx.rotate(armRotation);

    ctx.fillStyle = "#4B4448";
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, 2*Math.PI);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#2B2729";
    ctx.stroke();

    ctx.beginPath()
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-18, 58, 38, 73);
    ctx.lineWidth = 22;
    ctx.strokeStyle = "#2B2729";
    ctx.stroke();
    ctx.strokeStyle = "#4B4448";
    ctx.lineWidth = 20;
    ctx.stroke();

    ctx.restore();

    ctx.fillStyle = "#4B4448";
    ctx.beginPath();
    ctx.arc(758, 97, 10, 0, 2*Math.PI);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#2B2729";
    ctx.stroke();

    ctx.beginPath()
    ctx.moveTo(758, 97);
    ctx.quadraticCurveTo(780, 155, 720, 170);
    ctx.lineWidth = 22;
    ctx.strokeStyle = "#2B2729";
    ctx.stroke();
    ctx.strokeStyle = "#4B4448";
    ctx.lineWidth = 20;
    ctx.stroke();
  }
};

class Card {
  constructor(name, suit, position) {
    this.name = name;
    this.suit = suit;
    this.pos = position;
  }

  draw() {
    ctx.fillStyle = "#EEE";
    ctx.strokeStyle = "#AAE"
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(this.pos.x, this.pos.y, 100, 140, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = (this.suit == "spades" || this.suit == "clubs") ? "#333" : "#E33"
    ctx.fillText(this.name, this.pos.x + 10, this.pos.y + 30);

    ctx.save();
    ctx.translate(this.pos.x + 90, this.pos.y + 110);
    ctx.rotate(Math.PI)
    
    ctx.fillText(this.name, 0, 0);

    ctx.restore();
  }

  drawBack() {
    ctx.fillStyle = "#AAE";
    ctx.strokeStyle = "#EEE"
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(this.pos.x, this.pos.y, 100, 140, 10);
    ctx.fill();
    ctx.stroke();
  }
}

class Chip {
  constructor(value) {
    this.value = value;
    if (this.value == 5) {
      this.fillColor = "#F46786";
      this.strokeColor = "#EF1A48"
    } else if (this.value == 10) {
      this.fillColor = "#5CEFFF";
      this.strokeColor = "#00CAE0"
    } else if (this.value == 25) {
      this.fillColor = "#66F5AB";
      this.strokeColor = "#0DD36D"
    } else if (this.value == 100) {
      this.fillColor = "#2B2729";
      this.strokeColor = "#151315"
    } else if(this.value == 500) {
      this.fillColor = "#965E97"; 
      this.strokeColor = "#573758"
    }
  }

  draw(x, y) {
    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y, 50, 10, 0, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(x, y, 50, 10, 0, 0, Math.PI);
    ctx.lineTo(x-50, y+8);
    ctx.ellipse(x, y+8, 50, 10, 0, Math.PI, 0, true);
    ctx.lineTo(x+50, y);
    ctx.fill();
    ctx.stroke();
  }
}

// create an array of values and suits to represent a deck of cards
function getDeck() {
  // new array variable
	let deck = new Array();

  // iterate through each item
	for(let i = 0; i < suits.length; i++) {
		for(let j = 0; j < values.length; j++) {
      // assign value
			let card = { Name: names[j], Value: values[j], Suit: suits[i]};
      // push to deck variable
			deck.push(card);
		}
	}
  // return the deck variable
	return deck;
}

// random sorting algorithm
function shuffle(deck) {
  // iterate through each item in reverse order
  for(let i = deck.length-1; i > 0; i--) {
    // chose a random index from remaining items
    let randomIndex = Math.floor(Math.random() * i);
    // swap random item with current item
    [deck[i], deck[randomIndex]] = [deck[randomIndex], deck[i]];
  }
}

// create then shuffle deck
var deck = getDeck();
var cardIndex = 0;

function resetDeck() {
  shuffle(deck);

  for (let i = 0; i < deck.length; i++) {
    if (deck[i].Name == 'A') {
      deck[i].Value = 11;
    } else {
      continue
    }
  }

  player.hand = [];
  player.cards = [];
  dealer.hand = [];
  dealer.cards = [];

  // assign inital cards to player and dealer
  player.hand.push(deck[0]);
  dealer.hand.push(deck[1]);
  player.hand.push(deck[2]);
  dealer.hand.push(deck[3]);

  player.cards.push(new Card(deck[0].Name, deck[0].Suit, {x: 100, y:300}));
  dealer.cards.push(new Card(deck[1].Name, deck[1].Suit, {x: 100, y:100}));
  player.cards.push(new Card(deck[2].Name, deck[2].Suit, {x: 220, y:300}));
  dealer.cards.push(new Card(deck[3].Name, deck[3].Suit, {x: 220, y:100}));

  if (player.hand[0].Name == 'A' && player.hand[1].Name == 'A') {
    player.hand[0].Value == 1;
  }

  cardIndex = 4;
}
resetDeck();

// ---------------------------------------------------------------- HAND HANDLING ------------------------------------------------------------------------

// function to count a player's hand
function count(person) {
  var value = 0;
  for (let i = 0; i < person.hand.length; i++) {
    value += person.hand[i].Value;
  }

  return value;
}

// function to convert a hand into a displayable string
function handToString(hand) {
  var handString = hand[0].Name.toString();
  for (let i = 1; i < hand.length; i++) {
    handString += `, ${hand[i].Name.toString()}`;
  }
  return handString;
}

// ---------------------------------------------------------------- BUTTON SETUP ------------------------------------------------------------------------

var dealFlag = false;
var isDealt = false;
var isDealing = false;

var hitFlag = false;

var stayFlag = false;
var isStay = false;
var isFlipped = false;

var plusFlag = false;
var minusFlag = false;

var resetFlag = false;
var roundDone = false;

var startTime = Date.now();

//                                        ---------------------- DEAL BUTTON ----------------------

function dealDown() {
  if (!isDealt && player.bet > 0) {
    dealFlag = true;

    ctx.fillStyle = "#A11";
  }
}

function dealUp() {
  if (dealFlag) {
    dealFlag = false;
    startTime = Date.now();
    isDealing = true;

    setTimeout( () => {
      isDealt = true;
    }, cycleTime/2);

    setTimeout( () => {
      isDealing = false;
    }, cycleTime);

    dealer.value = count(dealer);
    player.value = count(player);

    console.log(dealer.value, player.value);
    console.log(dealer.hand);
    console.log(player.hand);

    if (dealer.value == 21 && dealer.hand.length == 2) {
      isStay = true;
      isDealing = true;
      startTime = Date.now();
      setTimeout( () => {
        player.money -= player.bet;
        console.log("dealer21");
        isFlipped = true;
      }, cycleTime/2);
      setTimeout( () => {
        isDealing = false;
        roundDone = true;
        dealer.blackjack = true;
        startTime = Date.now();
      }, cycleTime);
    }
  }
}

//                                        ---------------------- HIT BUTTON ----------------------

// hit button detection
function hitDown() {
  if (isDealt && !isDealing && !isStay && !player.isBust) {
    hitFlag = true;

    ctx.fillStyle = "#028eb5";
  }
}

// update player count value
player.value = count(player);

// on hit button release
function hitUp() {
  if (hitFlag) {
  setTimeout( () => {
    // define next card and move indexer
    var nextCard = deck[cardIndex];
    player.hand.push(nextCard);
    player.cards.push(new Card(nextCard.Name, nextCard.Suit, {x: player.cards[player.cards.length-1].pos.x + 120, y: 300}));
    cardIndex++;

    // update player count value
    player.value = count(player);
    console.log("player:", player.value);

    // detect possible bust
    if (player.value > 21) {

      // find aces and make them value 1
      for (let i = 0; i < player.hand.length; i++) {
        if (player.hand[i].Name == 'A' && player.hand[i].Value != 1) {
          player.hand[i].Value = 1;
          break;
        }
      }
      player.value = count(player);

      if (player.value > 21) {
        player.isBust = true;
        player.money -= player.bet;
        console.log("playerBust");

        setTimeout(() => {
          roundDone = true;
          startTime = Date.now();
        }, cycleTime/2);
      }
    }
  }, cycleTime/2);
  
  setTimeout( () => {
    isDealing = false;
  }, cycleTime);

    startTime = Date.now();
    isDealing = true;
    hitFlag = false;
  }
}

//                                        ---------------------- STAY BUTTON ----------------------

// stay button detection
function stayDown() {
  if (isDealt && !isStay && !player.isBust) {
    stayFlag = true;

    ctx.fillStyle = "#b1ba00";
  }
}

// update dealer count value
dealer.value = count(dealer);

// on release
function stayUp() {
  if (stayFlag) {
    isStay = true;

    stayFlag = false;
 
    var nextCard = deck[cardIndex];
    
    player.value = count(player);

    if (player.value == 21 && player.hand.length == 2) {
      player.money += 2*player.bet;
      roundDone = true;
      player.blackjack = true;
      startTime = Date.now();
      return 0;
    }

    dealer.value = count(dealer);

    if (dealer.value > 21) {
      if (dealer.hand[0].Name == 'A') {
        dealer.hand[0].Value = 1;
      } else if (dealer.hand[1].Name == 'A') {
        dealer.hand[1].Value = 1;
      }
      dealer.value = count(dealer);
    }


    const sleep = (time) => {
      return new Promise((resolve) => setTimeout(resolve, time))
    }

    // hit when under value of 17
    async function dealerAlgo() {
      isDealing = true;
      startTime = Date.now();

      setTimeout(() => {isFlipped = true}, cycleTime/2)

      await sleep(cycleTime);
      
      while (dealer.value < 17) {

        setTimeout(() => {

        dealer.hand.push(nextCard);
        dealer.cards.push(new Card(nextCard.Name, nextCard.Suit, {x: dealer.cards[dealer.cards.length-1].pos.x + 120, y: 100}));
        dealer.value = count(dealer);
        cardIndex++;
        nextCard = deck[cardIndex];

        if (dealer.value > 21) {
          // find aces and make them value 1
          for (let i = 0; i < dealer.hand.length; i++) {
            if (dealer.hand[i].Name == 'A') {
              dealer.hand[i].Value = 1;
            }
          }
          dealer.value = count(dealer);

          if (dealer.value > 21) {
            dealer.isBust = true;
          }
        }}, cycleTime/2);

        await sleep(cycleTime);
        
      }
      dealer.value = count(dealer);
      player.value = count(player);

      console.log("dealer:", dealer.value, "player:", player.value);

      if (dealer.isBust || player.value > dealer.value) {
        player.money += player.bet;
        roundDone = true;
        startTime = Date.now();
        console.log("playerWin");
      } else if (player.value < dealer.value) {
        player.money -= player.bet;
        roundDone = true;
        startTime = Date.now();
        console.log("playerLoss");
      } else if (player.value == dealer.value) {
        roundDone = true;
        startTime = Date.now();
        console.log("playerTie");
      }
      isDealing = false;
    }
    dealerAlgo();
  }
}

//                                        ---------------------- BET BUTTONS ----------------------

let zeroBet = {
  flag: false,
  down() {
    if (!isDealt) {
      this.flag = true;

      ctx.fillStyle = "#A11";
    }
  },
  up() {
    if (this.flag) {
      player.bet = 0;
      this.flag = false;

      player.updateChips();
      console.log(player.chips)
    }
  }
}

let minus = {
  flag: false,
  down() {
    if (!isDealt) {
      this.flag = true;

      ctx.fillStyle = "#A11";
    }
  },
  up() {
    if (this.flag) {
      player.bet -= (player.bet != 0) ? 5 : 0;
      this.flag = false;

      player.updateChips();
      console.log(player.chips)
    }
  }
}

let plus = {
  flag: false,
  down() {
    if (!isDealt) {
      this.flag = true;

      ctx.fillStyle = "#4A4";
    }
  },
  up() {
    if (this.flag) {
      player.bet += (player.bet != player.money) ? 5 : 0;
      this.flag = false;

      player.updateChips();
      console.log(player.chips)
    }
  }
}

let allIn = {
  flag: false,
  down() {
    if (!isDealt) {
      this.flag = true;

      ctx.fillStyle = "#4A4";
    }
  },
  up() {
    if (this.flag) {
      player.bet = player.money;
      this.flag = false;

      player.updateChips();
      console.log(player.chips)
    }
  }
}

//                                        ---------------------- RESET BUTTON ----------------------

let reset = {
  flag: false,
  down() {
    if (roundDone) {
      this.flag = true;

      ctx.fillStyle = "#C5BFC5";
    }
  },
  up() {
    if (this.flag) {
      this.flag = false;

      resetDeck();

      isDealt = false;
      roundDone = false;
      isStay = false;
      isFlipped = false;

      player.isBust = false;
      player.value = 0;
      player.bet = 0;
      player.updateChips();
      player.blackjack = false;

      dealer.isBust = false;
      dealer.value = 0;
      dealer.blackjack = false;
    }
  }
}

let save = {
  flag: false,
  down() {
    this.flag = true;

    ctx.fillStyle = "#4A4";
  },
  up() {
    if (this.flag) {
      this.flag = false;

      for (const [key, value] of Object.entries(localStorage)) {
        localStorage.removeItem(key)
      }

      localStorage.setItem("playerMoney", player.money);
    }
  }
}

let yes = {
  flag: false,
  down() {
    this.flag = true;

    ctx.fillStyle = "#4A4";
  },
  up() {
    if (this.flag) {
      this.flag = false;

      gameStart = true;
      player.money = parseInt(localStorage.getItem("playerMoney"));
      requestAnimationFrame(main);
    }
  }
}

let no = {
  flag: false,
  down() {
    this.flag = true;

    ctx.fillStyle = "#A11";
  },
  up() {
    if (this.flag) {
      this.flag = false;

      gameStart = true;
      requestAnimationFrame(main);
    }
  }
}

// ---------------------------------------------------------------- TEXT SETUP ------------------------------------------------------------------------

function buttonText() {
  ctx.fillStyle = "#111";
  ctx.font = "25px Limelight";

  ctx.fillText("DEAL", (canvasWidth/8)-28, canvasHeight-20);
  ctx.fillText("SAVE", (canvasWidth/8)-12, 65);

  // display button markers
  ctx.fillText("HIT", (canvasWidth/3)-22, canvasHeight-20);
  ctx.fillText("STAY", (canvasWidth/2)-31, canvasHeight-20);
  ctx.fillText(player.bet, (2*canvasWidth/3)-20, canvasHeight-20);

  ctx.fillText("Bank:", 650, 520);
  ctx.fillText(player.money, 650, 550);
}

// ---------------------------------------------------------------- GRAPHICS ------------------------------------------------------------------------

var cycleTime = 600*Math.PI;

// ---------------------------------------------------------------- MOUSE DETECTION ------------------------------------------------------------------------

var mouseDown = false;

window.addEventListener('mousedown', () => {

  mouseDown = true;

});

window.addEventListener('mouseup', () => {

  mouseDown = false;

});

var mouseX = 0;
var mouseY = 0;

// mouse tracking
document.addEventListener("mousemove", (e) => {

  const rect = canvas.getBoundingClientRect();

  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;

}, false);

// ---------------------------------------------------------------- MAIN ------------------------------------------------------------------------

window.addEventListener("load", () => {
  if (localStorage.length == 0) {
    requestAnimationFrame(main);
  }
});

function onStartup() {

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const gradient = ctx.createRadialGradient(canvasWidth/2, canvasHeight/2, 50, canvasWidth/2, canvasHeight/2, 800);

  // Add three color stops
  gradient.addColorStop(0, "#0DD36D");
  gradient.addColorStop(0.5, "#0A994F");

  ctx.fillStyle = gradient;

  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "#F5F4F5";

  ctx.beginPath();
  ctx.roundRect(280, 250, 240, 100, 15);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#66F5AB";
  
   // detect Yes button press
  (mouseX > 300 && 
   mouseX < 390 &&
   mouseY > 360 && 
   mouseY < 410 && 
   mouseDown) ? yes.down() : yes.up();

  ctx.beginPath();
  ctx.roundRect(300, 360, 90, 50, 15);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#F46786";

  (mouseX > 410 && 
   mouseX < 500 &&
   mouseY > 360 && 
   mouseY < 410 && 
   mouseDown) ? no.down() : no.up();

  ctx.beginPath();
  ctx.roundRect(410, 360, 90, 50, 15);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#111"
  ctx.font = "20px Limelight";

  ctx.fillText("Would you like to", 310, 280);
  ctx.fillText("load your previous", 303, 305);
  ctx.fillText("game?", 370, 330);

  ctx.fillText("Yes", 325, 390);
  ctx.fillText("No", 440, 390);


  if (!gameStart) {
    requestAnimationFrame(onStartup);
  }
}

function main() {
  msecs = Date.now();
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const gradient = ctx.createRadialGradient(canvasWidth/2, canvasHeight/2, 50, canvasWidth/2, canvasHeight/2, 800);

  // Add three color stops
  gradient.addColorStop(0, "#0DD36D");
  gradient.addColorStop(0.5, "#0A994F");

  ctx.fillStyle = gradient;

  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // display hands after dealing
  if (isDealt) {

    for (let i = 0; i < player.cards.length; i++) {
      // isDealing = true;

      player.cards[i].draw();
    }

    dealer.cards[0].draw();
    dealer.cards[1].drawBack();

    if (isFlipped) {
      for (let i = 0; i < dealer.cards.length; i++) {
        // isDealing = true;

        dealer.cards[i].draw();
      }
    }
  }

  ctx.lineWidth = 1;

  ctx.fillStyle = "#F46786";
  ctx.strokeStyle = "#4B4448";

  // detect deal button press
  (mouseX > (canvasWidth/8)-30 && 
   mouseX < (canvasWidth/8)+40 &&
   mouseY > canvasHeight-120 &&
   mouseY < canvasHeight-50 &&
   mouseDown) ? dealDown() : dealUp();

  // draw button
  ctx.beginPath();
  ctx.roundRect((canvasWidth/8)-30, canvasHeight-120, 70, 70, 15);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#5CEFFF";
  
  // detect hit button press
  (mouseX > (canvasWidth/3)-25 && 
   mouseX < (canvasWidth/3)+25 &&
   mouseY > canvasHeight-100 && 
   mouseY < canvasHeight-50 && 
   mouseDown) ? hitDown() : hitUp();

  // draw button
  ctx.beginPath();
  ctx.roundRect((canvasWidth/3)-25, canvasHeight-100, 50, 50, 15);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#E7F269";

  // detect stay button oress
  (mouseX > (canvasWidth/2)-25 && 
   mouseX < (canvasWidth/2)+25 &&
   mouseY > canvasHeight-100 &&
   mouseY < canvasHeight-50 &&
   mouseDown) ? stayDown() : stayUp();

  // draw button
  ctx.beginPath();
  ctx.roundRect((canvasWidth/2)-25, canvasHeight-100, 50, 50, 15);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#F46786";
  
  // detect Zero Bet button press
  (mouseX > (2*canvasWidth/3)-60 && 
   mouseX < (2*canvasWidth/3)-30 &&
   mouseY > canvasHeight-90 &&
   mouseY < canvasHeight-60 &&
   mouseDown) ? zeroBet.down() : zeroBet.up();

  // draw Zero Bet button
  ctx.beginPath();
  ctx.roundRect((2*canvasWidth/3)-60, canvasHeight-90, 30, 30, [15, 5, 5, 15]);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#F46786";

  // detect minus button press
  (mouseX > (2*canvasWidth/3)-25 && 
   mouseX < (2*canvasWidth/3) &&
   mouseY > canvasHeight-100 &&
   mouseY < canvasHeight-50 &&
   mouseDown) ? minus.down() : minus.up();

  // draw minus button
  ctx.beginPath();
  ctx.roundRect((2*canvasWidth/3)-25, canvasHeight-100, 25, 50, [15, 0, 0, 15]);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#66F5AB";

  // detect plus button press
  (mouseX > (2*canvasWidth/3) && 
   mouseX < (2*canvasWidth/3)+25 &&
   mouseY > canvasHeight-100 &&
   mouseY < canvasHeight-50 &&
   mouseDown) ? plus.down() : plus.up();

  // draw plus button
  ctx.beginPath();
  ctx.roundRect((2*canvasWidth/3), canvasHeight-100, 25, 50, [0, 15, 15, 0]);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#66F5AB";
  
  // detect All In button press
  (mouseX > (2*canvasWidth/3)+30 && 
   mouseX < (2*canvasWidth/3)+55 &&
   mouseY > canvasHeight-90 &&
   mouseY < canvasHeight-60 &&
   mouseDown) ? allIn.down() : allIn.up();

  // draw All In button
  ctx.beginPath();
  ctx.roundRect((2*canvasWidth/3)+30, canvasHeight-90, 30, 30, [5, 15, 15, 5]);
  ctx.fill();
  ctx.stroke();

  // detect Save In button press
  (mouseX > 70 && 
   mouseX < 170 &&
   mouseY > 30 &&
   mouseY < 80 &&
   mouseDown) ? save.down() : save.up();

  // draw Save In button
  ctx.beginPath();
  ctx.roundRect(70, 30, 100, 50, 15);
  ctx.fill();
  ctx.stroke();

  if (roundDone) {
    ctx.fillStyle = "#F5F4F5";

     // detect reset button press
    (mouseX > (canvasWidth/2)-100 && 
     mouseX < (canvasWidth/2)+100 &&
     mouseY > (canvasHeight/2)-50 &&
     mouseY < (canvasHeight/2)+50 &&
     mouseDown) ? reset.down() : reset.up();

    ctx.beginPath();
    ctx.roundRect((canvasWidth/2)-100, canvasHeight/2-50, 200, 100, 15);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#111";
    ctx.fillText("RESET", (canvasWidth/2)-31, canvasHeight/2+8);
  }

  ctx.fillStyle = "#111";

  // bet button markers
  ctx.font = "20px monospace";
  ctx.fillText("- +", (2*canvasWidth/3)-18, canvasHeight-70);

  if (isDealing) {
    
    var elapsed = msecs-startTime;

    dealer.draw((Math.PI/8)*(1-Math.cos(elapsed/300)));
    
  } else {

    dealer.draw(0);

  }

  var pos = {dealer: 200, player: 450}
  var v = 6

  if (roundDone) {

    var elapsed = msecs-startTime;

    if (player.isBust || (player.value < dealer.value && !dealer.isBust) || dealer.blackjack) {

      player.drawChips(700, (pos.player-elapsed/v > pos.dealer) ? pos.player-elapsed/v : pos.dealer);

    } else if (player.blackjack) {

      player.drawChips(700, pos.player);
      if (pos.dealer+elapsed/v < pos.player) {
        player.drawChips(650, (pos.dealer+elapsed/v < pos.player) ? pos.dealer+elapsed/v : pos.player);
        player.drawChips(750, (pos.dealer+elapsed/v < pos.player) ? pos.dealer+elapsed/v : pos.player);
      }

    } else if (dealer.isBust || player.value > dealer.value) {

      player.drawChips(700, pos.player);
      player.drawChips(700, (pos.dealer+elapsed/v < pos.player) ? pos.dealer+elapsed/v : pos.player);

    } else {

      player.drawChips(700, pos.player);

    }

  } else {

    player.drawChips(700, pos.player);

  }

  buttonText();

  requestAnimationFrame(main);
}

var gameStart = false;
requestAnimationFrame(onStartup);