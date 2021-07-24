class Game {
  constructor() {
    this.events = [];
    this.state = "startmenu" //States are startmenu, shopping, trail, and end.
    this.futureFunctions = [];
    this.progressnumber = -1;
    this.turnumber=0;
this.starterEventsTemplate = [
  ()=>{let hitByAsteroid='game.dialogue("The car gets hit by the asteroid, causing you to spin around and breaking off some of your steel plating."); wagonband.injure.Hull();';
    let tryToDodge='var roll=MakeARoll("Speed"); game.insertEvent(game.progressnumber+1,()=>{if(roll>14){game.dialogue("Your engine starts up and all your wheels go at full speed as you escape the asteroid");}else{'+hitByAsteroid+'}})';
    if(wagonband.supplies.Lasers>0){this.dialogue("As you are driving, you see an asteroid coming towards you. You can either try and shoot it out of the sky or you can try and dodge out of the way");this.createChoice([{name:"Shoot It", func:"if(MakeARoll('Combat')>=15){game.nextEvent(()=>{game.dialogue('You shoot the laser out of the space and watch as its exploded peices fly past you far and go far away.')});}else{game.nextEvent(()=>{"+hitByAsteroid+"})}"},{name:"Dodge out of the way", func:tryToDodge}]);}
    else{this.dialogue("An asteroid streaks towards you, you can't shoot it out of the sky so your only chance is to try and dodge it or hope it doesn't do much damage"); this.createChoice([{name:"Try and Dodge It", func:tryToDodge}, {name:"Stay in Place", func:"if(Math.random()<=0.8){"+hitByAsteroid+"} else{game.dialogue('By some divine whim, the asteroid only sligntly scrapes your ship.');}"}])}
game.turnumber++;},
  ()=>{var wagonbandInjury; if(wagonband.supplies.Radio>0){wagonbandInjury="Hull"} else{wagonbandInjury="Serious"}
    var mugChoices=[{name:"Try to Escape", func:'var roll=MakeARoll("Speed");game.nextEvent(()=>{if(roll>16){game.dialogue("Rushing away from the robbers, you manage to escape.");}else{game.dialogue("You try to escape, but the nimble ship is too fast and deals heavy damage to you before you can get out.");wagonband.injure.'+wagonbandInjury+'();}})'}];if(wagonband.money>=200){mugChoices.push({name:"Give Money", func:'game.dialogue("You give them 200 credits");for(var i=0;i<200;i++){wagonband.loseItem.Credits();}'})} else{mugChoices.push({name:"Convince them to leave you.", func:'if(MakeARoll("None")>=16){game.nextEvent(()=>{game.dialogue("They start arguing over what to do with you which gives you enough time to fly away.")})}else{game.nextEvent(()=>{game.dialogue("They laugh at you and say that is not enough then they fire at you multiple times and fly away.");wagonband.injure.character();wagonband.injure.Hull();})}'})};var mugQuestion="A small ship rockets up to you and aims a laser at you. You hear a voice on your speaker telling you to give them 200 credits or they will fire at you.";if(wagonband.supplies.Radio<1){game.dialogue(mugQuestion);game.createChoice(mugChoices);} else{this.dialogue("You see on your radio a ship approaching you at a high speed. It looks like it may be hostile.");var choices=[{name:"Try to fly away.",func:'game.dialogue("You speed away before the ship can talk to you.");'},{name:"Wait for them and talk",func:'game.dialogue("'+mugQuestion+'");game.createChoice('+JSON.stringify(mugChoices)+');'}];if(wagonband.supplies.Lasers>0){choices.push({name:"Get your Lasers ready to fight them",func:"game.dialogue('A small ship rockets towards you, you hear the words \"Give us your money...\" and immediatly you fire your lasers, giving yourself the element of surprise');game.nextEvent(()=>{ var roll = MakeARoll('Combat');if(roll>13){game.dialogue('As the ship tries to rob you, you blast it with a laser and destroy it. Salvinging it, you are able to get a metal.');wagonband.addItem.Metal();}else{game.nextEvent(()=>{wagonband.injure.Serious();game.dialogue('Your lasers come out and fire, but the ship is too fast and shoots at you. Your ship is able to get away but not without serious damage.')})}})"})}; this.createChoice(choices);}
game.turnumber++;},
  ()=>{game.dialogue("As you are driving, you hear a cough coming from a cupboard. Catiouslly, you open it up, and you see a man inside, a stowaway.<br>You can either take him in or you can throw him out of the ship."); game.createChoice([{name:"Throw him out.", func:'game.dialogue("You don\'t have enough food for people who may not even be useful to you, so you throw the man outside the ship and don\'t look back.");'},{name:"Allow them to Stay",func:"game.dialogue('He looks at at you and thanks you profusely for allowing him to stay');wagonband.addItem.Stowaway();"}]);
game.turnumber++;},
]
this.starterEvents=[...this.starterEventsTemplate];
this.standardEvents = [
{name:"Broken Wheel", description:"One of your wheels falls off your ship", func:()=>{if(wagonband.supplies.Tires>0){wagonband.loseItem.Tires();}else{game.Nothing();wagonband.karma-=2;}}, rarity:2},
{name:"Nothing At All", description:"In the next leg of your journey is nothing at all, a long space of nothing.", func:()=>{game.nextEvent(()=>{if(wagonband.Engines>1){game.dialogue("With your multiple Engines you cruise past it");}else{wagonband.loseItem.Gas(); game.dialogue("With only one engine, you have to use some extra gas to get past it.");}})}, rarity:1},
{name:"Ship", description:"A Ship", func:()=>{var demands={Metal:0, Food:0, Lasers:0, Radio:0};var medPrice=randInt(50,301); var demandsPrices={Metal:150, Food:100, Lasers:430-medPrice, Radio:280, Medicine:medPrice,}; for(var price=10;  price<(5000-wagonband.money)/9; price*=1.08){var demand=randomObject(demandsPrices); if(wagonband.supplies[demand]-demands[demand]>0){price+=demandsPrices[demand];demands[demand]++;}}; var demandsStr="<br>"; for(item in demands){if(demands[item]>0){demandsStr+=`${demands[item]} ${item}<br>`}}; if(textdisplay.innerHTML.startsWith("A Ship")){game.dialogue("A ship rockets up to you and demands you give them "+demandsStr);}; var choicesArray=[{name:"Fight Them",func:"var rollc=MakeARoll('Combat')>16; var rolls; game.nextEvent(()=>{if(!rolls&&!rollc){game.dialogue('As you try to start shooting at them, the opposing ship proves to be both fast and strong and quickly overpowers you.');wagonband.injure.Serious();wagonband.injure.character();wagonband.karma+=8;}else if(rollc&&!rolls){game.dialogue('You keep shooting at them and hit a few times, but they are too fast and escape after dealing some damage to your hull');wagonband.injure.Hull();}else if(rolls&&!rollc){game.dialogue('As you as escaping they start firing behind you, you outmaneuvier their ship but get hit a few times.');wagonband.injure.Light();}else if(rolls&&rollc){game.dialogue('You expertly outmaneuver them and fight them expertly, you destroy their ship and find some credits and medicine');wagonband.karma-=4;wagonband.addItem.Medicine();for(var i=0;i<80;i++){wagonband.addItem.Credits();};};});game.nextEvent(()=>{rolls=MakeARoll('Speed')>=10;});"},{name:"Run Away",func:"var roll=MakeARoll('Speed');game.nextEvent(()=>{if(roll>=17){game.dialogue('You make an escape with their lasers blasting all around you.');}else{game.dialogue('As you are trying to fly away, you hear a voice saying, you aint gettin away that easy, and they start shooting at you.');wagonband.injure.Hull();wagonband.injure.Serious();}})"}, {name:'Give it to Them', func:"var demands="+JSON.stringify(demands)+";for(item in demands){for(var i=0;i<demands[item];i++){wagonband.loseItem[item]();}};game.dialogue('You give them the items');"}]; game.createChoice(choicesArray);},rarity:3},
{name:"Damage", description:"You find one of your lasers isn't working, you are able to salvage a metal from it and release the rest into space",func:()=>{if(wagonband.supplies.Lasers>0){wagonband.loseItem.Lasers();wagonband.addItem.Metal();}else{game.Nothing();}}, rarity:1},
{name:"Damage", description:"You engine sputters and dies, if you use some metal you might be able to repair it.", func:()=>{if(wagonband.supplies.Engines<=0){game.Nothing();}else{if(wagonband.supplies.Metal>=1){game.createChoice([{name:"Spend one metal and try to fix it",func:"wagonband.loseItem.Metal();if(MakeARoll('Engineering')>11){game.nextEvent(()=>{game.dialogue('You fix the engine!');});}else{game.nextEvent(()=>{game.dialogue('You try, but the engine still does not work.');wagonband.karma+=5; wagonband.loseItem.Engines();});}"},{name:"Don't try to repair it", func:"wagonband.loseItem.Engines();"}]);}else{textdisplay.innerHTML+=" Sadly you don't have any Metal";wagonband.loseItem.Engines();}};}, rarity:1},
{name:"Damage", description:"One of your medicine expires", func:()=>{if(wagonband.supplies.Medicine>0){wagonband.loseItem.Medicine();}else{game.Nothing();}}, rarity:1},
{name:"Death", description:"One", func:()=>{if(wagonband.characters.length<=0){game.Nothing();}else{var typeToDie=randomArray(wagonband.characters).type;if(textdisplay.innerHTML.startsWith("One")){game.dialogue(`Your ${typeToDie} got sick. You well need medicine to cure them.`);};if(wagonband.supplies.Medicine>0){game.createChoice([{name:"Give It", func:'game.dialogue("You give them medicine and they are OK.");wagonband.loseItem.Medicine();'},{name:"Don't Give", func:`var typeToDie='${typeToDie}'; if(Math.random()>0.8||(wagonband.supplies.Doctor>0&&Math.random()>0.4)){if(wagonband.supplies.Doctor>0&&wagonband.supplies.Food>=1){game.dialogue("You don\'t give any medicine but your Doctor identifies the disease and maages to help them. The "+typeToDie+" eats some food and is back to full health.");wagonband.loseItem.Food();}else if(wagonband.supplies.Food>=2){game.dialogue("They get really sick but you give them some food and they are better.");wagonband.loseItem.Food();wagonband.loseItem.Food();};}else{game.dialogue("The "+typeToDie+" gets too sick and dies."); wagonband.loseItem[typeToDie]();};`}]);}else{textdisplay.innerHTML+=" Although you don't have medicine"; wagonband.loseItem[typeToDie]();};}}, rarity:1},
{name: "Buyer", description:"A ship", func:()=>{var prices={"Tires":400, "Medicine":460, "Gas":85, "Engines":500, "Metal":140};var itemOfInterest=randomObject(prices);var itemPrice=prices[itemOfInterest];
if(wagonband.supplies.Radio){itemPrice+=80;};if(textdisplay.innerHTML.startsWith("A ship")){game.dialogue("A ship is slowly floating in space, it connects with you and asks if you have a "+itemOfInterest+", and they are willing to give "+itemPrice+" for it");};
var choicesArray=[{name:"Don't Give it", func:`game.dialogue('You do not give them a ${itemOfInterest}');`}];
if(wagonband.supplies[itemOfInterest]){choicesArray.push({name:"Sell it To Them", func:`game.dialogue("They thank you for the item and give you the credits");wagonband.loseItem['${itemOfInterest}']();for(var i=0;i<${prices[itemOfInterest]};i++){wagonband.addItem.Credits();}`});
choicesArray.push({name:"Give it to them for free", func:`game.dialogue("They are so thankful to you that some of the crew decides to come along with you and they bring some of their food");wagonband.addItem.Stowaway();wagonband.addItem.Stowaway(); wagonband.addItem.Food();wagonband.addItem.Food();wagonband.loseItem['${itemOfInterest}']();`});};game.createChoice(choicesArray);}, rarity:3},
{name:"Buyer", description:"You find a merchant, who asks to buy an item from you. He asks for A Tire for 280, An Engine for 440, A Radio for 410, or a character for 450 credits.", func:()=>{var choicesArray=[{name:"Don't Sell",func:'game.dialogue("You both go on your way")'}];var prices={Tires:280,Engines:440,Radio:410};if(wagonband.characters.length>=1){prices[randomArray(wagonband.characters).type]=450};for(var item in prices){if(wagonband.supplies[item]>=1){choicesArray.push({name:item, func:`wagonband.loseItem['${item}']();for(var i=0; i<${prices[item]};i++){wagonband.addItem.Credits();};`})};};game.createChoice(choicesArray);},rarity:2},
{name:"Ship", description:"A small broken ship, spiraling through the faceless void, you have the oppurtunity to loot it, but you see another ship flying toward it with your radio",func:()=>{var choicesArray=[{name:"Fight Them", func:`var rad=wagonband.supplies.Radio;if(rad>1){rad=1;};var rolls=MakeARoll('Speed')+(rad*4)>=16;var rollc;game.nextEvent(()=>{if(!rolls&&!rollc){game.dialogue(("Even with your radio warning you early and giving you the suprise advantage, ".repeat(rad))+"You are not quick and strong enough to defeat the other ship, you are forced to retreat.");wagonband.injure.character();wagonband.injure.Light();}else if(rollc&!rolls){game.dialogue(("You radio alerts you too the ship and gives you the surprise, but still, ".repeat(rad))+'You shoot at the ship which takes damage, but they are too fast and escape from you after hitting you back.');wagonband.injure.Light();}else if(rolls&&!rollc){game.dialogue(("You see the ship early on your radio, which alerts you and you speed forward, but when ".repeat(rad))+'You speed toward the wreck but the lasers blating behind you put some pressure on you, you are able to salvage a little but are forced to leave.');wagonband.addItem.Gas();wagonband.injure.Hull();}else{game.dialogue(("Your radio gives you an eraly alet, an invaluable advantage, and ".repeat(rad))+'You rush up to the wreck while fighting off the other ship, which is forced to retreat, you salvage two metal and two gas from the ship.');wagonband.addItem.Metal();wagonband.addItem.Metal();wagonband.addItem.Gas();wagonband.addItem.Gas();};});game.nextEvent(()=>{rollc=MakeARoll('Combat')+(rad*3)>16;});`}, {name:"Race Them", func:"var radioAlert='Noticing them early on your radio, '.repeat(wagonband.supplies.Radio);var roll = MakeARoll('Speed')+wagonband.supplies.Radio*4; game.nextEvent(()=>{var salvage=()=>{wagonband.addItem.Metal();wagonband.addItem.Gas();wagonband.addItem.Gas();for(var i=0;i<50;i++){wagonband.addItem.Credits();};};if(roll>=19){game.dialogue(radioAlert+'You speed past the other ship and quicly salvage the wreck before you can get shot at.');salvage();}else if(roll>15){game.dialogue(radioAlert+'You are able to make it to the ship and salvage, but take some damage.');wagonband.injure.Serious();wagonband.injure.Tire();}else{game.dialogue(radioAlert+'You fly forawrd, but get shot at from behind by the other ship, you are able to get two gas and a metal but have to flee after taking lots of damage.');wagonband.addItem.Metal();wagonband.addItem.Gas();wagonband.addItem.Gas(); wagonband.injure.Serious();wagonband.injure.Hull();wagonband.injure.character();};});"}, {name:"Leave", func:"game.dialogue('You run away and watch as the other ship salavges the wreck.');"}]; game.createChoice(choicesArray);}, rarity:1},
]

this.progression = [()=>{this.dialogue("This is the Road to Andromeda. It is Based off of the Oregon Trail and was Created By Abhi K.");},
()=>{this.dialogue("The milky was is getting too crowded for you and you are not able to live well here. You need to travel the dangerous and lawless Andromeda path by any means necessary and begin a settlement there..");},
()=>{this.dialogue/* TODO: Change Money here*/("You will have 5000 Credits, with which you can hire helpers and purchase equipment. You are going to need to make desisions on what to do with your resources.");},
()=>{this.dialogue("There will be a few shops along the way for you to spend any money you save, and make sure to have gas, spare parts, and defense mechanisms.");},
()=>{var shopStockArray={};var shopStock1=randomArray(basicItems);var shopStock2;for(shopStock2=randomArray(basicItems);shopStock1==shopStock2;shopStock2=randomArray(basicItems)){};shopStockArray[shopStock1]=0.87; shopStockArray[shopStock2]=0.94;var missingCharacter1=randomArray(basicCharacters);var missingCharacter2; for(missingCharacter2=randomArray(basicCharacters);missingCharacter1==missingCharacter2;missingCharacter2=randomArray(basicCharacters)){}; new Shop(0,0,shopStockArray, [missingCharacter1, missingCharacter2],{},true);},
()=>{this.dialogue("Stocked with items for your journey, you take off to a new galaxy."); fireJetImg.style.visibility="visible";},
()=>{var lngth=this.starterEvents.length;for(var i=0; i<lngth;i++){this.addUpdateFunction();var event=this.starterEvents.splice(randInt(0,this.starterEvents.length), 1)[0];this.insertEvent(this.progressnumber+1, event);};this.progress();},
()=>{this.dialogue/*TODO:changeMoneyHere*/("You begin to get doubt, 5000 credits may have been to little for you to be able to make it to Andromeda, as you are thinking that, you see a space foundation ship, they ask you if you would like to borrow some credits with a 25% intrest rate. How much money would you like to take?"); this.createChoice([{name:"Do Not Take A Loan",func:""}, {name:"Take a loan of 1000 credits",func:"wagonband.money+=1000;wagonband.debt+=1250;"},{name:"Take a loan of 4000 credits",func:"wagonband.money+=4000; wagonband.debt+=5000;"}])},
()=>{wagonband.eventLevel="standardEvents";this.addStandardEventAdder();},
//()=>{game.dialogue("More content possible coming soon. For now, see how long you can last!");for(var i1=0;i1<20;i1++){/*game.insertEvent(()=>{wagonband.money+=1000}); game.insertEvent(()=>{new Shop(0,0,{},[],{},false)});*/this.starterEvents=[...this.starterEventsTemplate];var lngth=this.starterEvents.length;for(var i=0; i<lngth;i++){this.addUpdateFunction();var event=this.starterEvents.splice(randInt(0,this.starterEvents.length), 1)[0];this.insertEvent(this.progressnumber+1, event);};}},
()=>{game.dialogue("You have finished the game and won! You were able to make it to the new galaxy and had lots of success.");},
()=>{game=new Game(); wagonband=new WagonBand(); game.progress();}
]
  }

  start() {
this.progress();
wagonband = new WagonBand();
  }

  dialogue(text) {
    textdisplay.innerHTML = text;
  }

  createChoice(buttonsarray) {
    for (let index=0; index < buttonsarray.length; index++) {
      const button = buttonsarray[index];
      const name = button.name;
      const callbck = button.func;
      const element = document.createElement("button");
      element.setAttribute("class", "choicebutton");
      element.setAttribute("onclick", "choices.innerHTML='';nextButton.style.display='block';"+callbck);
      const text = document.createTextNode(name);
      element.appendChild(text);
      choicedisplay.appendChild(element);
      nextButton.style.display = "none";
    }}

  progress() {
  this.progressnumber++;
  this.progression[this.progressnumber]();
    for(var futureFunction in this.futureFunctions) {
      var theFutureFunction = this.futureFunctions[futureFunction];
      if (theFutureFunction.time==this.progressnumber) {
        theFutureFunction.func();
      }
    }
  }

  setAFutureFunction(timeToRun, callbck) {
    this.futureFunctions.push({time:timeToRun, func:callbck});
  }

  insertEvent(position, func) {
    this.progression.splice(position, 0,func);
    this.futureFunctions.forEach((item, index) => {item.time++;});
  }

  addUpdateFunction() {
    this.insertEvent(this.progressnumber+1, ()=>{wagonband.update();})
  }
  nextEvent(callbck){
    this.insertEvent(this.progressnumber+1, callbck);
  }
  Over(reason) {
    console.log(reason);
    if(!safeGame){
    startmenu.style.display="block";
    document.getElementById("gameTitle").innerHTML=reason+"<br>You survived for "+game.turnumber+" turns";}
  }
  Nothing(karmaChange=-4) {
    game.dialogue("You peacfully continue your journey and nothing happens, it creates lots of nervousness"); wagonband.karma+=karmaChange;
  }
  addStandardEventAdder() {
/*
Wanted Uoutput:
standard Event is next on progression
after that is the add standard event
Immediately enter the standardEvent
*/
if(game.turnumber<=28){
game.nextEvent(()=>{game.addStandardEventAdder();game.progress();});
game.nextEvent(()=>{game.addStandardEvent();})
}
//game.progress();
  }
  addStandardEvent() {
/*
Tasks:
choose an event
reduce the event rarity by one.
if it is 0 chosse a different event.
Add the event to progression
*/
if((game.turnumber-3)%7==0&&game.turnumber!=3){
  game.nextEvent(()=>{game.turnumber++;var scarcities=[0.9,1.38,0.65,1.2,0.88,1.14,1.6,0.75];var scarcity={};for(var i=0;i<basicItems.length;i++){var item=basicItems[i];scarcity[item]=scarcities.splice(randInt(0,scarcities.length),1)[0];};console.log(scarcity);new Shop(Math.floor((game.turnumber-3)/7),0,scarcity,[],{},true);})
} else {
    var event=randomArray(this[wagonband.eventLevel]);
    if(event.rarity<=0){event.rarity+=0.5;event=randomArray(this[wagonband.eventLevel]);}
    event.rarity--;
    game.nextEvent(()=>{game.dialogue(event.description);game.turnumber++;event.func();});
    this.addUpdateFunction();
    game.progress();
  }}
}
// TODO: Ways to get money/
