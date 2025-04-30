/*
/   This is my blackjack js code
/   4/28/25 - Colin Adreani
*/

// Grab the element and its 2-D rendering context
const canvas = document.getElementById('canvas');
const ctx     = canvas.getContext('2d');

const canvasWidth = 800;
const canvasHeight = 600;
const dpr = window.devicePixelRatio || 1;  // 2 on Retina

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// ➊ Give the element its *display size* (CSS)
canvas.style.width  = canvasWidth  + 'px';
canvas.style.height = canvasHeight  + 'px';

// ➋ Allocate a larger backing store
canvas.width  = canvasWidth  * dpr;
canvas.height = canvasHeight  * dpr;

ctx.scale(dpr, dpr);

var suits = ["spades", "diamonds", "clubs", "hearts"];
var values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];

// create an array of values and suits to represent a deck of cards
function getDeck() {
  // new array variable
	let deck = new Array();

  // iterate through each item
	for(let i = 0; i < suits.length; i++) {
		for(let j = 0; j < values.length; j++) {
      // assign value
			let card = {Value: values[j], Suit: suits[i]};
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
shuffle(deck);

function buttonText() {
  ctx.fillStyle = "#111";
  ctx.font = "25px monospace"
  ctx.fillText("HIT", (canvasWidth/3)-21, canvasHeight-110);
  ctx.fillText("STAY", (canvasWidth/2)-28, canvasHeight-110);
  ctx.fillText("0", (2*canvasWidth/3)-28, canvasHeight-110);
  ctx.font = "20px monospace"
  ctx.fillText("- +", (2*canvasWidth/3)-18, canvasHeight-70);
}

var mouseDown = false;

window.addEventListener('mousedown', () => {

  mouseDown = true;

  shuffle(deck)
  console.log(deck);

});

window.addEventListener('mouseup', () => {

  mouseDown = false;

});

var mouseX = 0;
var mouseY = 0;

document.addEventListener("mousemove", (e) => {

  const rect = canvas.getBoundingClientRect();

  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;

}, false);

function main() {
  (mouseX > (canvasWidth/3)-25 && 
   mouseX < (canvasWidth/3)+25 &&
   mouseY > canvasHeight-100 &&
   mouseY < canvasHeight-50 &&
   mouseDown) ? ctx.fillStyle = "#333" : ctx.fillStyle = "#AAA";

  ctx.fillRect((canvasWidth/3)-25, canvasHeight-100, 50, 50);

  (mouseX > (canvasWidth/2)-25 && 
   mouseX < (canvasWidth/2)+25 &&
   mouseY > canvasHeight-100 &&
   mouseY < canvasHeight-50 &&
   mouseDown) ? ctx.fillStyle = "#333" : ctx.fillStyle = "#AAA";
  ctx.fillRect((canvasWidth/2)-25, canvasHeight-100, 50, 50);

  ctx.fillStyle = "#E44";
  ctx.fillRect((2*canvasWidth/3)-25, canvasHeight-100, 25, 50);
  ctx.fillStyle = "#4E4";
  ctx.fillRect((2*canvasWidth/3), canvasHeight-100, 25, 50);

  buttonText();

  requestAnimationFrame(main);
}
requestAnimationFrame(main);