var game;
var wagonband;
function beginGame() {
  game = new Game();
game.start();
  startmenu.style.display="none";
}

function showItems() {
  itemDisplay.style.display = "block";
  var toAddToItemDisplay = "";
  for (var wagonBandItem in wagonband.supplies) {
    toAddToItemDisplay+=wagonBandItem+": "+wagonband.supplies[wagonBandItem]+"<br>";
  }
  toAddToItemDisplay+="Credits: "+wagonband.money;
  displayNumberInShow.innerHTML = toAddToItemDisplay
}
function showCharacters() {
  itemDisplay.style.display = "block";
}
function closeItemScreen() {
  itemDisplay.style.display = "none";
  displayNumberInShow.innerHTML = "";
}
function randomArray(arr) {
  var rand = Math.floor(Math.random()*arr.length);
  return arr[rand];
}
function randomObject(obj){
  var arr = [];
  for(item in obj){arr.push(item);}
  return randomArray(arr);
}
function objToArray(obj) {
  var arr = [];
  for(item in obj){arr.push(item);}
  return arr;
}
function randInt(minInclusive, maxExclusive) {
var num = Math.random();
num*=(maxExclusive-minInclusive);
num = Math.floor(num+minInclusive);
return num;
}
function MakeARoll(type/*types are Combat, Diplomacy, Engineering, Speed*/) {
  document.getElementById("dice").style.display="block";
  var num = randInt(1,21);
  var todialogue = "";
  document.getElementById("rollResult").innerHTML=num;
  game.dialogue(num);
  if (type=="Speed") {var tiresPenalty=0;var todialogue="";var engineIncrease=0;if(wagonband.supplies.Tires<4){tiresPenalty-=(4-wagonband.supplies.Tires)*3.5;todialogue+="Your lack of Tires reduced it by: "+tiresPenalty+"<br>";};if(wagonband.supplies.Engines>1){engineIncrease+=(wagonband.supplies.Engines-1)*3;todialogue+="Your engines increased it by: "+engineIncrease+"<br>";};num+=(engineIncrease+tiresPenalty);todialogue+="Total: "+num;game.dialogue(todialogue);}
  if(type=="Engineering"&&wagonband.supplies.Engineer>0) {var totalIncrease=0;for(var i=0;i<wagonband.supplies.Engineer;i++){totalIncrease+=randInt(2,6);};todialogue+="Your Engineers increased it by: "+totalIncrease+".<br>"+(num+=totalIncrease)+" total.";game.dialogue(todialogue);}
  if(type=="Combat"&&(wagonband.supplies.Martial>0||wagonband.supplies.Lasers>0)) {for(var i=0;i<wagonband.supplies.Martial;i++){var newRoll=randInt(1,21);if(newRoll>num){num=newRoll;}}; var LaserIncrease=wagonband.supplies.Lasers/4+0.75; game.dialogue("Your Martials Made it a "+num+"<br>Lasers affected this struggle, they made your total "+(num*=LaserIncrease));}
  var whenToHide = game.progressnumber+1;
  game.setAFutureFunction(whenToHide, ()=>{document.getElementById("dice").style.display="none";});
  if(type!="Engineering"){
  num+=wagonband.karma;
  wagonband.karma=0;}
  return num;
}
