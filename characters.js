class Tinker {
  constructor(id) {
    this.whenToBuildTrack=1/*how much time left to build and how much until it starts building*/;this.isBuilding=false;/*Either building or idle*/this.project=null; this.id=id; this.type="Tinker";
  }
  update() {
    this.whenToBuildTrack--;
    if (this.whenToBuildTrack==0) {
      if (!this.isBuilding) {this.beginBuild();}
      else {
        wagonband.addItem[this.project](); this.whenToBuildTrack=2; game.dialogue("Your Tinker succseffully built a "+this.project); this.isBuilding=false;
      }
    } else {game.progress();}
  }

  beginBuild(){
    game.dialogue("Your Tinker is ready to start a new project to build. What should they work on?")
    var itemsCanBuild=[];//Name of all items
    for(var item in Tinker.itemPriceObject) {
      var itemInfo = Tinker.itemPriceObject[item];
      var canPurchase = true;
      for(var cost in itemInfo) {if(wagonband.supplies[cost]<itemInfo[cost]){canPurchase=false;}}
      if(canPurchase){itemsCanBuild.push(item);}
    }
    if(itemsCanBuild.length>1){itemsCanBuild.splice(randInt(0,itemsCanBuild.length),1);}
    var choicesArray=[];
    itemsCanBuild.forEach((itemCanBuild, index) => {
      var itemName=itemCanBuild+", Requires:";
      var itemInfo = Tinker.itemPriceObject[itemCanBuild]
      for(var cost in itemInfo) {itemName+=(" "+cost+": "+itemInfo[cost]);}
      choicesArray.push({name:itemName, func:"wagonband.characters.forEach((char, index)=>{if(char.id="+this.id+"){char.isBuilding=true; char.whenToBuildTrack="+itemInfo.time+";char.project='"+itemCanBuild+"';}});for(var cost in Tinker.itemPriceObject['"+itemCanBuild+"']){if(cost!='time'){for(i=0;i<Tinker.itemPriceObject['"+itemCanBuild+"'][cost];i++){wagonband.loseItem[cost]();}}}"})
    });
    choicesArray.push({name:"Don't Build Anything", func:""})
    game.createChoice(choicesArray);
    this.whenToBuildTrack=2;
  }
}
Tinker.itemPriceObject = {Radio:{Metal:2, time:3},Engines:{Metal:1, Gas:1, time:2},Lasers:{Metal:2, Gas:2,time:2},SuperGlue:{Metal:1, Gas:2, time:1}, ItemProducer:{Metal:3, Gas:2, time:4}}//Add new items Here
class Doctor {
  constructor(id) {this.type="Doctor"; this.id=id;this.skill=0.6;this.isdevoloping=false;}
  update() {
    if(this.isdevoloping){game.dialogue("Your doctor finished devloping a medicine");wagonband.addItem.Medicine();this.isdevoloping=false;} else{
      if(Math.random()<this.skill){if(wagonband.supplies.Medicine>=1){game.dialogue("Your doctor found a buyer for your medicine");game.createChoice([{name:"Sell it for "+Math.floor(160/this.skill),func:`wagonband.loseItem.Medicine();for(var i=0;i<${Math.floor(160/this.skill)};i++){wagonband.addItem.Credits();};`},{name:"Do not sell it", func:""}]); this.skill/=1.6;}else{this.skill*=0.7;game.dialogue("Your doctor is making progress towards a new medicine");game.progress();}}else{this.isdevoloping=true;game.dialogue('Your doctor started devloping some new medicine');this.skill/=0.8;/*Higher skill is the less chance they make medicine*/}
    }
  }
}
class Engineer {
  constructor(id) {
this.type="Engineer"; this.id=id;
  }
  update() {game.progress();}
}
class Martial {
  constructor(id) {
this.type="Martial"; this.id=id;
  }
  update() {}
}
class Hunter {
  constructor(id) {
this.id=id; this.type="Hunter";this.skill=0.4;
  }
  update() {
    if(Math.random()<this.skill){game.dialogue("Your Hunter found two food");wagonband.addItem.Food();wagonband.addItem.Food();this.skill*=0.48;}
    else {game.dialogue("Your Hunter found no food, but did catch the trail of a food source and somehow found 15 credits."); this.skill*=1.3;var i=0; while(i<15){wagonband.addItem.Credits();i++};}
  }
}
class Stowaway {
  constructor(id) {
    this.id=id; this.type="Stowaway"; this.determineType(); this.timer=randInt(2,5);
  }
  determineType() {
    var type = Math.random();
    if(type<0.6){this.realType="Stowaway";}
    else if (type<0.75) {this.realType="Engineer"}
    else if (type<0.85) {this.realType="Hunter"}
    else if(type<0.9){this.realType="Leader"}
    else{this.realType="Pirate"}
  }
  update(){
    this.timer--;
    if(this.timer==0&&this.realType!="Stowaway"&&this.realType!="Pirate") {
      game.dialogue("WOW! Your Stowaway discovered some hidden talents, turns out they are a "+this.realType);
      for(var i=0;i<wagonband.characters.length;i++){if(wagonband.characters.id==this.id){wagonband.characters.splice(i,1);}}; wagonband.supplies.Stowaway--;
      wagonband.addItem[this.realType]();
    } else if (this.realType=="Pirate"&&this.timer==0) {
      var todialogue="You wake up in the morning to see the stowaway gone, turns out they weren't good news this time. Some of your items are missing too";
      wagonband.loseItem.Stowaway(); let itemsArray=["Metal", "Gas","Food","Medicine","Radio"];let valueObject = {'Metal': 120, "Gas":150, "Food": 70, "Medicine":150, "Radio":300}; for(var value=10; value<450; value*=1.1) {var itemToSteal=randomArray(itemsArray); if(value+valueObject[itemToSteal]<450&&wagonband.supplies[itemToSteal]>0){wagonband.loseItem[itemToSteal]();value+=valueObject[itemToSteal];todialogue+="<br>They Stole a "+itemToSteal+"!";}}
      game.dialogue(todialogue);
    }
    else {
      game.progress();
    }
  }
}

class Seer {
  constructor(id){
    this.id=id;this.type="Seer";
  }
  update() {
    var choicesArray = [];
    for(var i=0;i<3;i++){
      var number = randInt(0,game.standardEvents.length);
      var choice = {};
      choice.name=game.standardEvents[number].name;
      choice.func=`game.standardEvents[${number}].rarity--;`;
      choicesArray.push(choice);
    }
    game.dialogue("Decrease the Probability of one Event");
    game.createChoice(choicesArray);
  }
}
class Leader {
  constructor(id) {
    this.id=id; this.type="Leader";
  }
  update() {
    wagonband.karma+=wagonband.characters.length;
  }
}
class Gambler {
  constructor(id){this.id=id;this.type="Gambler";}
  update(){
    game.dialogue("Your gambler is ready, gamble how much?");
    var choicesArray=[];
    choicesArray.push({name:""+Math.floor(wagonband.money/4)+"", func:`if(Math.random()>0.5){game.dialogue('Your gambler wins you ${Math.floor(wagonband.money/4)} Credits!');for(var i=0; i<Math.floor(wagonband.money/4); i++){wagonband.addItem.Credits();}}else{game.dialogue('Your gambler loses and you lose ${Math.floor(wagonband.money/8)}');for(var i=0; i<Math.floor(wagonband.money/8); i++){wagonband.loseItem.Credits();}};`});
    choicesArray.push({name:""+Math.floor(wagonband.money/2)+"", func:`if(Math.random()>0.5){game.dialogue('Your gambler wins you ${Math.floor(wagonband.money/2)} Credits!');for(var i=0; i<Math.floor(wagonband.money/2); i++){wagonband.addItem.Credits();}}else{game.dialogue('Your gambler loses and you lose ${Math.floor(wagonband.money/4)}');for(var i=0; i<Math.floor(wagonband.money/4); i++){wagonband.loseItem.Credits();}};`});
    var char;
    for(char = randomArray(basicCharacters);allItems[char].onlyOne===false;char=randomArray(basicCharacters)){};
    var gambleItems=["Tires", "Medicine", "Food", "Metal", char];
    if(!gambleItems.every((value)=>{return !wagonband.supplies[value];})){
      var itemToGamble;
      for(itemToGamble=randomArray(gambleItems);!wagonband.supplies[itemToGamble];itemToGamble=randomArray(gambleItems)){}
      choicesArray.push({name:itemToGamble, func:`if(Math.random()>0.45){game.dialogue('Your gambler won and earned you an extra ${itemToGamble}');wagonband.addItem.${itemToGamble}();}else{game.dialogue('Your gambler lost and you lose a ${itemToGamble}');wagonband.loseItem.${itemToGamble}();}`})
    }
    game.createChoice(choicesArray);
  }
}

class ItemProducer {
  constructor(id){
this.id=id; this.type="ItemProducer"
  }
  update() {
    var toGive = randomArray(basicItems);
    var price = Math.floor(allItems[toGive].price/(5/3));
    game.dialogue("Your item machine is acting up, would you like to give it money for an item?");
    game.createChoice([{name:"No", func:""}, {name:"Yes", func:`if(wagonband.money>=${price}){game.dialogue("You give the machine ${price} credits and it creates a ${toGive}");for(var i=0;i<${price};i++){wagonband.loseItem.Credits();};wagonband.addItem.${toGive}()}else{var toPay=Math.floor(${price}/3);if(toPay>wagonband.money){toPay=Math.floor(wagonband.money/1.2);};game.dialogue('After giving it '+toPay+' credits, you relaize you do not have enough to make the item');for(var i=0;i<toPay;i++){wagonband.loseItem.Credits();};}`}]);
  }
}
class Seeker {
  constructor(id){
    this.id=id; this.type="Seeker";this.ready=false;
  }
  update() {
    if(this.ready){wagonband.addItem.Stowaway();game.dialogue('Your seeker found you a stowaway');}
     else{game.progress();};
    this.ready=!this.ready;
  }
}
