var safeGame=true
const htmlgame = document.getElementById("game");
const startGameButton = document.getElementById("startButton");
const startmenu = document.getElementById("startmenu");
const showItemButton = document.getElementById("showItems");
const showPeopleButton = document.getElementById("showCharacters");
const itemDisplay = document.getElementById("showSomething");
const closeItemDisplay = document.getElementById("leaveShow");
const textdisplay = document.getElementById("text");
const nextButton = document.getElementById("continue");
const choicedisplay = document.getElementById("choices")
const store = document.getElementById("shop");
const storeSelection = document.getElementById("itemsForSale");
const displayNumberInShow = document.getElementById("showText");
const fireJetImg = document.getElementById("fireJetImg");
function setup() {
  startGameButton.onclick = () => {beginGame();}
  showItemButton.onclick = () => {showItems();}
  showPeopleButton.onclick = () => {showCharacters();}
  closeItemDisplay.onclick = () => {closeItemScreen();}
  nextButton.onclick = () => {game.progress();}

}
setup();
