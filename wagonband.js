class WagonBand {
  constructor() {
    this.turn=0;
    this.eventLevel="0";
    this.nextCharacterID=1;
    this.crew = [];
    this.money = 5000;// TODO: Change money here
    this.debt = 0;
    this.karma=0;
    // TODO: Injuries
    this.damages={BrokenHull:false, PuncturedTank:false, SeriousInjury:false, LightInjury:false, Translators:false},
    this.injure = {Hull:()=>{if(this.damages.BrokenHull){wagonband.loseItem.Engines();}else{this.damages.BrokenHull=true}}, Serious:()=>{this.damages.SeriousInjury=true;this.seriousInjuries++;game.nextEvent(()=>{game.dialogue("You took heavy damage, it will reduce all your rolls until you fix it.");})}, FuelTank:()=>{wagonband.damages.PuncturedTank=true;}, Tire:()=>{wagonband.loseItem.Tires(); game.nextEvent(()=>{game.dialogue("A Tire gets destroyed and falls off your ship.");})}, Navigation:()=>{},character:()=>{if(wagonband.characters.length>0){var toDie=randomArray(wagonband.characters).type;wagonband.loseItem[toDie]();game.nextEvent(()=>{game.dialogue("Oh no, one of your "+toDie+" died");});}},Light:()=>{if(!wagonband.damages.LightInjury){wagonband.damages.LightInjury=true;}else{wagonband.damages.LightInjury=false;wagonband.injure.Serious();}}, Translators:()=>{wagonband.damages.Translators=false;game.nextEvent(()=>{game.dialogue("Translators...Broken  -.. <br>Communication... Difficult.");wagonband.damages.Translators=true;});}};

    this.injuryUpdates={BrokenHull:()=>{}, PuncturedTank:()=>{wagonband.loseItem.Gas();game.nextEvent(()=>{game.dialogue("Your gas tank leaks and you lose some gas");});}, SeriousInjury:()=>{wagonband.karma-=Math.pow(2,this.seriousInjuries)+2;}, LightInjury:()=>{wagonband.karma-=2;}, Translators:()=>{}}
    this.injuryFixingTimers={BrokenHull:{time:2, func:'var fix=()=>{game.nextEvent(()=>{if(wagonband.injuryFixingTimers.BrokenHull.time<=1){game.dialogue("You finish up the break and are able to seal up your hull");wagonband.injuryFixingTimers.BrokenHull.time=2;wagonband.healInjuries.BrokenHull();}else{game.dialogue("You work on the break and magae to make some protgress, you are almost done repairing it.");wagonband.injuryFixingTimers.BrokenHull.time--;}})};var roll=MakeARoll("Engineering"); if(roll>15){fix();}else if(roll>=8&&wagonband.supplies.Metal>=1){game.dialogue("You slip up and end up needing some metal, but you are able to get it patched up.");fix();}else{game.dialogue("You can not figure out how to fix the break, and end up not making any progress.");}', maxTime:2,}, PuncturedTank:{time:1, maxTime:1, func:()=>{},}, SeriousInjury:{time:1, func:'if(MakeARoll("Engineering")>=17){wagonband.healInjuries.SeriousInjury();game.nextEvent(()=>{game.dialogue("Its really hard but you manage to fix a major injury that has happened to your ship");})}', maxTime:1, }, LightInjury:{time:1, func:'if(MakeARoll("Engineering")>14){wagonband.healInjuries.LightInjury();game.nextEvent(()=>{game.dialogue("You fix a minor injury before it can become something more serious");});}', maxTime:1},Translators:{time:3,maxTime:3, func:"if(--wagonband.injuryFixingTimers.Translators.time<=0){wagonband.injuryFixingTimers.Translators.time=3;wagonband.healInjuries.Translators();game.dialogue('You fixed the Translators!!');}else{game.dialogue('You are making progress on the tranlsators.');}"}};
    this.seriousInjuries = 0;
    this.healInjuries={BrokenHull:()=>{this.damages.BrokenHull=false;},SeriousInjury:()=>{if(--this.seriousInjuries==0){this.damages.SeriousInjury=false};}, LightInjury:()=>{this.damages.LightInjury=false;}, Translators:()=>{this.damages.Translators=false;}}
    this.characters=[],
    this.updatingObjects=[],
    this.thingsNeedingUpdate=[],
    this.supplies = {Gas:0,Food:0,Medicine:0,Tires:0,Metal:0,Engines:0,Lasers:0,Radio:0, Doctor:0,Martial:0,Hunter:0,Tinker:0,Engineer:0},//Add new items Here

    this.addItem={Gas:()=>{this.supplies.Gas++;}, Food:()=>{this.supplies.Food++;}, Medicine:()=>{this.supplies.Medicine++;}, Tires:()=>{this.supplies.Tires++}, Metal:()=>{this.supplies.Metal++}, Engines:()=>{this.supplies.Engines++},
    Lasers:()=>{this.supplies.Lasers++}, Radio:()=>{this.supplies.Radio++}, Tinker:()=>{this.supplies.Tinker++; this.characters.push(new Tinker(this.nextCharacterID++));}, Doctor:()=>{this.supplies.Doctor++; this.characters.push(new Doctor(this.nextCharacterID++));},
    Martial: ()=>{this.supplies.Martial++; this.characters.push(new Martial(this.nextCharacterID++));}, Hunter: ()=>{this.supplies.Hunter++; this.characters.push(new Hunter(this.nextCharacterID++));}, Engineer:()=>{this.supplies.Engineer++;this.characters.push(new Engineer(this.nextCharacterID++));},
    Stowaway:()=>{if(!wagonband.supplies.Stowaway){wagonband.supplies.Stowaway=0;};this.supplies.Stowaway++; this.characters.unshift(new Stowaway(this.nextCharacterID++));}, Leader:()=>{if(!wagonband.supplies.Leader){wagonband.supplies.Leader=0;};this.supplies.Leader++; this.characters.push(new Leader(this.nextCharacterID++));},
    Credits:()=>{this.money++;}, Duolaser:()=>{this.supplies.Lasers+=2;}, Seer:()=>{if(!wagonband.supplies.Seer){wagonband.supplies.Seer=0;};this.supplies.Seer++;this.characters.push(new Seer(this.nextCharacterID++));}, SuperGlue:()=>{game.nextEvent(()=>{game.dialogue("You use the super glue, what would you like to repair?");var choicesArray=[{name:"None", func:""}];for(var damage in wagonband.damages){if(wagonband.damages[damage]){choicesArray.push({name:damage, func:"wagonband.healInjuries."+damage+"();"});};};game.createChoice(choicesArray);});}, ItemProducer:()=>{if(!wagonband.supplies.ItemProducer){wagonband.supplies.ItemProducer=0;};wagonband.supplies.ItemProducer++;wagonband.updatingObjects.push(new ItemProducer(this.nextCharacterID++));}, Gambler:()=>{if(!wagonband.supplies.Gambler){wagonband.supplies.Gambler=0;};this.supplies.Gambler++;this.characters.push(new Gambler(this.nextCharacterID++));}, Seeker:()=>{if(!wagonband.supplies.Seeker){wagonband.supplies.Seeker=0;};this.supplies.Seeker++;this.characters.push(new Seeker(this.nextCharacterID++));}
  },
    this.loseItem = {Gas:()=>{this.supplies.Gas--;},Food:()=>{this.supplies.Food--;},Metal:()=>{this.supplies.Metal--;},Medicine:()=>{this.supplies.Medicine--;},Tires:()=>{this.supplies.Tires--;},Engines:()=>{this.supplies.Engines--; if(wagonband.supplies.Engines==0){game.nextEvent(()=>{game.dialogue("OH NO!, you ran out of engines, as you are floating is space, you realize your sip comes with a small basic engine. It will keep you going, but will need extra gas.")})}; if(wagonband.supplies.Engines<0){game.Over("Your basic Engine died, you float through space, running out of food, and never make it to Andromeda");}},Radio:()=>{this.supplies.Radio--;},Lasers:()=>{this.supplies.Lasers--;},
    Hunter:()=>{this.supplies.Hunter--; for(var i=0;i<this.characters.length;i++){if(this.characters[i].type=="Hunter"){this.characters.splice(i,1);break;}}},Engineer:()=>{this.supplies.Engineer--; for(var i=0;i<this.characters.length;i++){if(this.characters[i].type=="Engineer"){this.characters.splice(i,1);break;}}},Martial:()=>{this.supplies.Martial--; for(var i=0;i<this.characters.length;i++){if(this.characters[i].type=="Martial"){this.characters.splice(i,1);break;}}}, Tinker:()=>{this.supplies.Tinker--; for(var i=0;i<this.characters.length;i++){if(this.characters[i].type=="Tinker"){this.characters.splice(i,1);break;}}},Doctor:()=>{this.supplies.Doctor--; for(var i=0;i<this.characters.length;i++){if(this.characters[i].type=="Doctor"){this.characters.splice(i,1);break;}}},
    Stowaway: ()=>{this.supplies.Stowaway--; for(var i=0;i<this.characters.length;i++){if(this.characters[i].type=="Stowaway"){this.characters.splice(i,1);break;}}}, Leader:()=>{this.supplies.Leader--; for(var i=0;i<this.characters.length;i++){if(this.characters[i].type=="Leader"){this.characters.splice(i,1);break;}}},
    Credits:()=>{this.money--;}, Seer:()=>{this.supplies.Seer--; for(var i=0;i<this.characters.length;i++){if(this.characters[i].type=="Seer"){this.characters.splice(i,1);break;}}}, ItemProducer:()=>{},Gambler:()=>{this.supplies.Gambler--; for(var i=0;i<this.characters.length;i++){if(this.characters[i].type=="Gambler"){this.characters.splice(i,1);break;}}},Seeker:()=>{this.supplies.Seeker--; for(var i=0;i<this.characters.length;i++){if(this.characters[i].type=="Seeker"){this.characters.splice(i,1);break;}}}
  }

  }
  update() {
    this.turn++;
    game.nextEvent(()=>{
      var todialogue = "You use gas";if(this.turn%2==0){todialogue+=" and food"};game.dialogue(todialogue);
    if(wagonband.supplies.Gas<1){game.Over("You ran out of Gas and Floted through space in a void.");} else{wagonband.loseItem.Gas();}
    if(this.turn%2==0){var starved=[];for(var char=0;char<wagonband.characters.length;char+=2){if(wagonband.supplies.Food<1){starved.push(char);game.nextEvent(()=>{var charnum=starved.pop();game.dialogue("You ran out of food and your "+this.characters[charnum].type+" starved");wagonband.loseItem[wagonband.characters[charnum].type]();})} else{wagonband.loseItem.Food();}}};
  })

    this.characters.forEach((char, i) => {game.insertEvent(game.progressnumber+1,()=>{char.update();});});
    this.updatingObjects.forEach((obj, i) => {game.insertEvent(game.progressnumber+1,()=>{obj.update();});});
    for(var i in this.damages){if(this.damages[i]){this.injuryUpdates[i]();}};

    var damagedPartsChoice=[{name:"None", func:""}];
    for(var i in this.damages){
      if(this.damages[i]){
        damagedPartsChoice.push({name:i, func:wagonband.injuryFixingTimers[i].func})
      }}
    if(damagedPartsChoice.length>1){
      game.nextEvent(()=>{
      game.dialogue("Your Ship Is Injured, what would you lke to try and work on fixing?");
      game.createChoice(damagedPartsChoice);})
    }
    if(this.seriousInjuries>=5){game.Over("Your Ship Took Too Much damage and was destroyed.");}
    game.progress();
  }
}


function makeCharacterFunctions(charName) {
  var st=`${charName}:()=>{this.supplies.${charName}++; this.characters.push(new ${charName}(this.nextCharacterID++));} \n ${charName}:()=>{this.supplies.${charName}--; for(var i=0;i<this.characters.length;i++){if(this.characters[i].type=="${charName}"){this.characters.splice(i,1);break;}}}`
  console.log(st);
  return st;
}
