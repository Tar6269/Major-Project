// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let buttonWidth;
let buttonHeight;
let hostButtonX;
let hostButtonY;
let joinButtonX;
let joinButtonY;
let hostOrClient
let displayTest = false;
let canvas;
let mainMenu = true;
let joinMenu = false;
let hostMenu = false;
let inGame = false;
let hostList = [];
let hostRoomName;
let gameGenerationData;
let enemyShipLocation = 0;
let shipLocation = 0;
let allyDirectionModifier;
let enemyDirectionModifier;
lastTriggered = 0;
const ws = new WebSocket("wss://momentous-honored-ragdoll.glitch.me/");

// ws.binaryType = "string";
ws.addEventListener("open", () =>{
  console.log("We are connected!")
  ws.addEventListener("message", function(message){
    let messageJSON = JSON.parse(message.data);
    let messageType = messageJSON.messageType;
    let messageData = messageJSON.data;

    if (messageJSON.messageType === "text"){
    console.log(messageData)
    }
    if (messageJSON.messageType === "hostList"){
      hostList = messageJSON.data;
      print(messageJSON.data);
      print(hostList);
      }
    if (messageJSON.messageType === "gameOn"){
        gameGenerationData = messageData;
        generateGame();
      }
  })
  ws.addEventListener("close", () =>{
    ws.CLOSED = true;
  });
});


function setup() {
  angleMode(DEGREES);
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.center("horizontal");
  buttonWidth = windowWidth/3
  buttonHeight = windowHeight/5
  hostButtonX = windowWidth/2 - buttonWidth/2;
  hostButtonY = windowHeight/2;
  joinButtonX = windowWidth/2 + buttonWidth/2;
  joinButtonY = windowHeight/2;
}

function draw() {
  background(220);
  if(mainMenu){
    menuScreen();
  }
  else if(joinMenu){
    displayServerList(hostList);
  }
  else if (hostMenu){

  }
  else if(inGame){
    drawGame();
  }
}

function menuScreen(){

  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(windowWidth/10)
  rect(hostButtonX, hostButtonY, buttonWidth, buttonHeight);
  text("Host", hostButtonX, hostButtonY);

  rect(joinButtonX, joinButtonY, buttonWidth, buttonHeight);
  text("Join", joinButtonX, joinButtonY);

}
function drawHostMenu(){
  textSize(width/50);
  text("Your room name is :", width/2, height/4);
  text(hostRoomName, width/2, height/3.5);
  if(millis()- lastTriggered < 1000){
  text("waiting for connection.", width/2, height/3);
  }
  else if (millis()- lastTriggered < 2000){
    text("waiting for connection..", width/2, height/3);
    
  }
  else if (millis()- lastTriggered < 3000){
    text("waiting for connection...", width/2, height/3);
    
  }
  else{
  text("waiting for connection.", width/2, height/3);
    lastTriggered = millis();
  }

}
function displayServerList(hostList){
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  let x = width/2;
  let y = height/5;
  for(let i = 0; i < hostList.length; i++){
    rect(x, y *(i + 1), buttonWidth * 2, buttonHeight);
    text(hostList[i].name, x, y *(i + 1));
    
  }
}
function mouseClicked(){
  if(mainMenu){
    if(mouseX > (hostButtonX - buttonWidth/2) && mouseX < (hostButtonX + buttonWidth/2) && mouseY > (hostButtonY - buttonHeight/2) && mouseY < (hostButtonY + buttonHeight/2)){
      hostServer();
      // mainMenu = false;
    }
    if(mouseX > (joinButtonX - buttonWidth/2) && mouseX < (joinButtonX + buttonWidth/2) && mouseY > (joinButtonY - buttonHeight/2) && mouseY < (joinButtonY + buttonHeight/2)){
      connectToHost();
      mainMenu = false;
    }
  }
  else if (joinMenu){
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    let x = width/2;
    let y = height/5;

    for(let i = 0; i < hostList.length; i++){
      if(mouseX > (x - buttonWidth/2) && mouseX < (x + buttonWidth/2) && mouseY > (y *(i + 1) - buttonHeight/2) && mouseY < (y *(i + 1) + buttonHeight/2)){
        console.log(hostList[i].name);
        sendData("joinGame", hostList[i]);
        // sendData("", "");
      }

      // rect(x, y *(i + 1), buttonWidth * 2, buttonHeight);
      // text(hostList[i].name, x, y *(i + 1));
      
    }
  }
  else if(inGame){
  }
}

function sendData(Type, data){
  let newMessage = {messageType: Type, data: data};
  let newMessageString = JSON.stringify(newMessage);
  // let newMessage = "{testing testing 123}";
  ws.send(newMessageString);

  print("message should be sent...");
}
function connectToHost(){
  sendData("request", "hostList");
  joinMenu = true;
  // sendData("test");
}
function hostServer(){
  mainMenu = false;
  hostMenu = true;
  let newRoomName = prompt("Enter a room name", "room name")
  sendData("typeChangeHost", newRoomName);
  hostRoomName = newRoomName;
}

function generateGame(){
  mainMenu = false;
  hostMenu = false;
  joinMenu = false;
  shipLocation = gameGenerationData.shipLocation;
  enemyShipLocation = gameGenerationData.enemyShipLocation;
  if(shipLocation > enemyShipLocation){
    allyDirectionModifier = -1;
    enemyDirectionModifier = 1;
  }
  else{
    allyDirectionModifier = 1;
    enemyDirectionModifier = -1;

  }
  inGame = true;
}
function drawBoats(){
  fill("yellow");
// player's ship
  translate(pixelToCoord(shipLocation), height*4/5);
  ellipse(0, 0, width/5, height/15);
  rotate(45*allyDirectionModifier);
  ellipse(width/20 * allyDirectionModifier, - height/30, width/40, height/20);

// enemy's ship
  fill("red")
  rotate(-45*allyDirectionModifier);
  translate(-pixelToCoord(shipLocation), 0);
  translate(pixelToCoord(enemyShipLocation), 0);
  ellipse(0, 0, width/5, height/15);
  rotate(45*enemyDirectionModifier);
  ellipse((width/20 * enemyDirectionModifier),-height/30, width/40, height/20);


}
function drawMap(){

}
function drawGame(){
  drawBoats();
  drawMap();
}
function pixelToCoord(x){
  return map(x,0, 1000, 0, width);
}