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
let playerTurn = true;
let enemyShipLocation = 0;
let shipLocation = 0;
let allyDirectionModifier;
let enemyDirectionModifier;
let heightWidthAV;
lastTriggered = 0;
let cannonImage;
let enemyCannonImage;

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

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
function preload(){
  wheel = loadImage('assets/woodenWheel.png');
  cannon = loadImage('assets/cannonBarrel.png');
  cannonFlipped = loadImage('assets/cannonBarrelFlipped.png');

}
function setup() {

  angleMode(DEGREES);
  imageMode(CENTER);
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.center("horizontal");
  buttonWidth = windowWidth/3
  buttonHeight = windowHeight/5
  hostButtonX = windowWidth/2 - buttonWidth/2;
  hostButtonY = windowHeight/2;
  joinButtonX = windowWidth/2 + buttonWidth/2;
  joinButtonY = windowHeight/2;
  heightWidthAV = windowWidth + windowHeight/2
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
    drawHostMenu();
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
    // textAlign(CENTER, CENTER);
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
    fireCannon(10);
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
    cannonImage = cannonFlipped;
    enemyCannonImage = cannon;
  }
  else{
    allyDirectionModifier = 1;
    enemyDirectionModifier = -1;
    cannonImage = cannon;
    enemyCannonImage = cannonFlipped;

  }
  inGame = true;
}
function drawBoats(){
  let aimPosition = atan2(mouseY - (height*4/5 - height/30), mouseX - (pixelToCoord(shipLocation) + width/20 * allyDirectionModifier)) + 12;
  if(cannonImage === cannonFlipped){
    aimPosition += 162;
  }
  fill(0);
  text(aimPosition , mouseX - (height*4/5 - height/30), width/5, height/20);
  fill("yellow");
// player's ship
  push();
  translate(pixelToCoord(shipLocation) + width/20 * allyDirectionModifier, height*4/5 - height/30);
  ellipse(-width/20 * allyDirectionModifier, + height/30, width/5, height/15);
  rotate(aimPosition);
  fill(0);
  // ellipse(0, 0, heightWidthAV/40, heightWidthAV/20);
  image(cannonImage, 0, 0, heightWidthAV/15, heightWidthAV/30);

  pop();
// enemy's ship
  fill("red")
  // rotate(-atan2(mouseY - (pixelToCoord(shipLocation) + width/20 * allyDirectionModifier), mouseX - (height*4/5 - height/30)));
  // translate(-(pixelToCoord(shipLocation) + width/20 * allyDirectionModifier), 0);
  translate(pixelToCoord(enemyShipLocation) + (width/20 * enemyDirectionModifier), height*4/5 - height/30);
  ellipse(-(width/20 * enemyDirectionModifier), height/30, width/5, height/15);
  rotate(45*-enemyDirectionModifier);
  fill(0);

  // ellipse(0,0, heightWidthAV/40, heightWidthAV/20);
  image(enemyCannonImage, 0, 0, heightWidthAV/15, heightWidthAV/30);

  push()

}
function drawMap(){

}
function drawGame(){
  drawBoats();
  drawMap();

  for(let i = cannonBalls.length; i >=0; i--){
    cannonBalls[i].draw()
    cannonballs[i].move()
    if(!cannonballs[i].bounding){
      cannonBalls.splice(i, 1);
    }
  }
}
function pixelToCoord(x){
  return map(x,0, 1000, 0, width);
}
function CoordToPixel(x){
  return map(x,0, width, 0, 1000);
}
function fireCannon(power){
  console.log("cannon should be firing");
  if(playerTurn){
    print(pixelToCoord(shipLocation) + width/20 * allyDirectionModifier);
    print(height*4/5 - height/30);
    print(width);
    print(height);
    cannonBall(
      pixelToCoord(shipLocation) + width/20 * allyDirectionModifier,
      height*4/5 - height/30,
      power,
      atan2(mouseY - (height*4/5 - height/30), mouseX - (pixelToCoord(shipLocation) + width/20 * allyDirectionModifier)) + 12,
      allyDirectionModifier
      )


    // sendData("cannonFired", coordToPixel(lastImpactCoords))
  }
}

class CannonBall{
  constructor(x, y, power, angle, direction){
    this.dx = Math.cos(angle) * power;
    this.dy = Math.sin(angle) * power;
    this.direction = direction;
    this.power = power;
    if(this.direction === "left"){
      this.power *= -1
    }
  }
  move(){
    if(y < height &&  y > 0){
      fill(0);
      
      x += dx
      y -= dy
  
      dy -= 1
    }
  }
  draw(){
    circle(x, y, heightWidthAV/50)
  }
  bounding(){
    return (y < height &&  y > 0);
  }
}