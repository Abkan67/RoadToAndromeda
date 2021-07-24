const basicItems = ["Gas", "Food", "Metal", "Medicine", "Tires", "Engines", "Radio", "Lasers"]//Add new baisc Items Here
const basicCharacters = ["Hunter", "Engineer", "Martial", "Tinker", "Doctor",]
const allItems = {
  Food: {image:"food.jpg", price: 75, description:"Every two turns, each of your two characters comsume one food and if you have no food they starve.", onlyOne:false},
  Gas:{image:"gas.jpg", price: 20, description:"You need Gas to go keep going on your journey, if you run out of gas between shops you will lose", onlyOne:false},
  Metal: {image:"Metal.jpg", price: 105, description:"Metal is important for repairing your ship if it takes certain damages. It can also be melded into other weapons.", onlyOne:false},
  Medicine: {image:"Medicine.jpg", price:210, description: "You will need medicine to cure different space diseases to save your people. They can also be very valuable to someone who needs them.", onlyOne:false},
  Tires:{image:"tire.png", price: 165, description: "Not sure why a flying space car needs tires, but you're going to want at least four to keep running well.", onlyOne:false},
  Engines: {image:"Engine.jpg", price: 500, description:"You need an engine to keep the car running smoothly.", onlyOne:false},
  Lasers: {image:"laser.jpg", price: 630, description:"Nothing persuades people more than a giant death cannon. Use them is self defense or for more nefarious means.", onlyOne:false},
  Radio: {image:"Radio.jpg", price: 370, description:"Might be useful while floating through then endless void that is space. Not garuenteed anyone will come to your aid though. Your car only has the slot for one.", onlyOne:true},
  Duolaser:{image:"laser.jpg", price:730, description:"Gives you two lasers."},
  SuperGlue:{image:"glue.jpg",price:260, description:"Lets you immediately heal an injury.", onlyOne:false},
  ItemProducer:{image:"machine.png",price:420, description:"Pay credits to get an item every turn.", onlyOne:true},

  Engineer: {image:"person.jpg", price:510, description:"Will help you repair your ship better.", onlyOne:false},
  Tinker: {image:"person.jpg", price: 520, description: "Can meld metal and gas into certain other items.", onlyOne:true},
  Martial: {image:"person.jpg", price:450, description: "Helps you in fights.", onlyOne:false},
  Doctor: {image:"person.jpg", price:620,description:"Gives you medicine sometimes and sells your medicine, helps you cure disease.", onlyOne:true},
  Hunter: {image:"person.jpg", price:590, description:"GIves you food or credits every turn.", onlyOne:true},
  Seer:{image:"person.jpg", price:600, description:"Can let you look into the future and avoid unwanted curcumstances.",onlyOne:true},
  Leader:{image:"person.jpg", price:530, description:"GIves you a bonus to rolls for each character you have.", onlyOne:true},
  Seeker:{image:"person.jpg", price: 480, description:"Gives you a stowaway every two turns.", onlyOne:false},

}//Add new items here
const rareItems = {
  level1:{SuperGlue:4,Seer:2, Duolaser:5, Gambler:1},
  level2:{ItemProducer:2, Gambler:2,Seeker:3, Seer:1, SuperGlue:3},
  level3:{Leader:3, Duolaser:2, Seeker:2, SuperGlue:3}
}
class Shop {

  constructor(/*level 0 is basic items*/level,rarityChance,scarcity,unavailablearray,maximumForItems,hasPeople) {
this.items = [];
this.allItemPricesInShop = {};
this.checkout = {}; this.allPrice=0;
this.itemContainers = []; this.totalPrice; this.display(); this.createExitButton();
this.determineItems(scarcity, unavailablearray, level, rarityChance, hasPeople, maximumForItems);
  }

  createExitButton() {
    const element = document.createElement("button");
    const text = document.createTextNode("Purchase and Leave");
    this.totalPrice = document.createElement("span");
    this.totalPrice.style.cssText = "font-weight:bold;";
    element.style.cssText = "background-color:white;position:absolute;bottom:20px;right:10px;height:40px;";
    element.appendChild(text);
    element.appendChild(this.totalPrice);
    element.addEventListener("click",()=>{this.purchase();});
    document.getElementById("leavestore").appendChild(element);}

  changeTotalPrice() {
    var allPrice = 0;
    for(var itemInCheckout in this.checkout) {
      var amount = this.checkout[itemInCheckout];
      var price = this.allItemPricesInShop[itemInCheckout];
      allPrice+= (amount*price);
    }
    this.allPrice = allPrice;
    this.totalPrice.innerHTML = "<br>Price: "+allPrice;
  }

  display() {store.style.display = "block"; nextButton.style.display="none";}

  determineItems(scarcity, unavailablearray, rarity,rarityChance, hasPeople,maximumForItemsObject) {

var items = [];
basicItems.forEach((basicItem, index) => {if (!unavailablearray.includes(basicItem)) {items.push(basicItem);}});
if(hasPeople){basicCharacters.forEach((char, index) => {if (!unavailablearray.includes(char)) {items.push(char);}})}
var rareitemsPossibilities = [];
for(var rareitem in rareItems["level"+rarity]) {if (!unavailablearray.includes(rareitem)) {for(var i=0;i<rareItems["level"+rarity][rareitem];i++){rareitemsPossibilities.push(rareitem);}}}
var chosenRareItem;
if (rarity!=0) {items.push(randomArray(rareitemsPossibilities));}

items.forEach((itemToPass, index) => {
  let itemPassingPrice = allItems[itemToPass].price
  if(scarcity.hasOwnProperty(itemToPass)) {itemPassingPrice=Math.ceil(itemPassingPrice*scarcity[itemToPass]);}
this.allItemPricesInShop[itemToPass]=itemPassingPrice;
this.displayAnItem(itemToPass);
});


}
  displayAnItem(itemToDisplay) {
    this.checkout[itemToDisplay] = 0;
    this.itemContainers.push(new ItemContainer(this, itemToDisplay));

  }
  purchase() {
    if(wagonband.money>=this.allPrice) {
      for (var itemType in this.checkout) {/*wagonband.supplies[itemType]+=this.checkout[itemType];*/for(var i=0; i<this.checkout[itemType];i++){wagonband.addItem[itemType]();}}
      wagonband.money-=this.allPrice;
      this.unDisplay();
  } else {alert("Not Enough Credits, you only have "+wagonband.money);}
  }

  unDisplay() {
    nextButton.style.display="block";
    store.style.display = "none";
    document.getElementById("leavestore").innerHTML="";
    storeSelection.innerHTML="";
    game.progress();
  }



}

class ItemContainer {
  constructor(parentshop, itemType) {
    this.parentshop = parentshop;
    this.parentshope="1";
    this.itemType = itemType;
    this.amountPurchased = 0;
    this.itemContainer = document.createElement("div");
    this.itemContainer.setAttribute("class", "itemHolder");
    var itemContainerStyleText = "left:"+(parentshop.itemContainers.length%10)*100+"px; border: 3px solid black; top:"
    var itemContainerTopValue = Math.floor(parentshop.itemContainers.length/10)*150+50
    this.itemContainer.style.cssText = itemContainerStyleText+itemContainerTopValue+"px;";
    storeSelection.appendChild(this.itemContainer);
    this.itemContainer.addEventListener("mouseover", ()=>{game.dialogue(allItems[this.itemType].description);})

    this.itemName = document.createElement("div");
    this.itemName.setAttribute("class", "shopItemName");
    this.itemContainer.appendChild(this.itemName);
    this.itemNameText = document.createTextNode(itemType);
    this.itemName.appendChild(this.itemNameText);

    this.itemPriceDiv = document.createElement("div");
    this.itemPriceText = document.createTextNode(parentshop.allItemPricesInShop[itemType]);
    this.itemPriceDiv.setAttribute("class", "itemPriceNumber");
    this.itemContainer.appendChild(this.itemPriceDiv);
    this.itemPriceDiv.appendChild(this.itemPriceText);

    this.itemImage = document.createElement("img");
    this.itemImage.setAttribute("src", allItems[itemType].image);
    this.itemImage.setAttribute("class", "itemImage");
    this.itemContainer.appendChild(this.itemImage);

    this.plusArrow = document.createElement("button");
    this.minusArrow = document.createElement("button");
    this.plusArrow.setAttribute("class", "plusArrow");
    this.minusArrow.setAttribute("class", "minusArrow");
    this.itemContainer.appendChild(this.plusArrow);
    this.itemContainer.appendChild(this.minusArrow);
    this.plusArrow.addEventListener("click", ()=>{this.increaseCheckout();});
    this.minusArrow.addEventListener("click", ()=>{this.decreaseCheckout();});

    this.numberPurchased = document.createElement("div");
    this.itemContainer.appendChild(this.numberPurchased);

  }

  increaseCheckout() {
if (!allItems[this.itemType].onlyOne||(this.parentshop.checkout[this.itemType]<1&&wagonband.supplies[this.itemType]<1)){this.parentshop.checkout[this.itemType]++; this.amountPurchased++;} else {alert("You already have the maximum allowed.");}
this.update();
  }
  decreaseCheckout() {
    if (this.amountPurchased>0) {this.parentshop.checkout[this.itemType]--; this.amountPurchased--; this.update();}
  }
  update() {
 this.parentshop.changeTotalPrice(); this.numberPurchased.innerHTML=this.amountPurchased;
  }
}
