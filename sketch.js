var dog, dogImage, sadDog, happyDog, database, foodS, foodStock, foodObj;
var feed,addFood, feedTime, lastFed;
var database;
var gameState, readState;
var garden, washroom, bedroom;

function preload()
{
  dogImage = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  sadDog = loadImage("images/Dog.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png");
  bedroom = loadImage("images/Bed Room.png");
}

function setup() {
	createCanvas(700, 500);
  dog = createSprite(250, 350, 30, 30);
  dog.addImage(dogImage);
  dog.scale = 0.3;

  database = firebase.database();
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  foodObj = new Food();

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  });

  feedTime = database.ref('feedTime');
  feedTime.on("value", function(data){
    lastFed = data.val();
  });
}

function draw() {  
  background(46, 139, 87);

  
  
  currentTime = hour();
  if(currentTime == (lastFed+1)){
    update("playing");
    foodObj.garden();
  } else if(currentTime == (lastFed+2)){
    update("sleeping");
    foodObj.bedroom();
  } else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("bathing");
    foodObj.washroom();
  } else{
    update("hungry");
    foodObj.display();
  }

  if(gameState!="hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }
drawSprites(); 
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    feedTime: hour(),
    gameState: "hungry"
  });

}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  });
}

function update(state){
  database.ref('/').update({
    gameState: state
  });
}