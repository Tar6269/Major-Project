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
let displayTest;
let canvas;
let mainMenu;
let joinMenu;
let hostMenu;
let inGame;
let hostList;
let cannonBalls;
let hostRoomName;
let gameGenerationData;
let playerTurn;
let enemyCannonAngle;
let enemyShipLocation;
let shipLocation;
let allyDirectionModifier;
let enemyDirectionModifier;
let enemyDirectionOffset;
let heightWidthAV;
let directionOffset;
let lastTriggered;
let cannonImage;
let enemyCannonImage;
let cameraAdjust = 0;
let cameraHangDuration;
let cameraHangLocation;
let hangCamera;
class CannonBall{
  constructor(x, y, power, angle, direction){
    this.x = x;
    this.y = y;
    this.power = pixelToCoordY(power) * pixelToCoord(power)/2;
    console.log(angle);
    this.dx = coordToPixel(Math.cos(-angle * Math.PI/180)) * this.power;
    this.dy = coordToPixelY(Math.sin(-angle* Math.PI/180)) * this.power;
    this.direction = direction;
    this.controllingCamera = false;
    if(this.direction === "left"){
      this.power *= -1;
    }
  }
  move(){
      if(this.controllingCamera){
      this.x += this.dx/2;
      }
      else{
      this.x += this.dx;
      }
      // console.log(floor(this.x) === width/2);
      // console.log(floor(this.x), width/2);
      if(Math.abs(this.x - width/2) < 5){
        this.controllingCamera = true;
      }
      this.y -= this.dy;
  
      this.dy -= pixelToCoord(.1);
  }
  draw(){
    
    console.log("cannonball being drawn")
    fill(0);
    circle(this.x, this.y, heightWidthAV/50);
    if(this.controllingCamera){
    translate(width/2 - this.x, 0);
    }
  }
  bounding(){
    return (this.y < height &&  this.y > 0);
  }
}
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
    
    if (messageJSON.messageType === "fireCannon"){
      fireCannon(messageJSON.data.angle, messageJSON.data.power);
    }
    if (messageJSON.messageType === "partnerDisconnect"){
      inGame = false;
    }
  })
  ws.addEventListener("close", () =>{
    ws.CLOSED = true;
  });
});

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  heightWidthAV = windowWidth + windowHeight/2
}
function preload(){
  wheel = loadImage('assets/woodenWheel.png');
  cannon = loadImage('assets/cannonBarrel.png');
  cannonFlipped = loadImage('assets/cannonBarrelFlipped.png');

}
function setup() {
  textAlign(CENTER, CENTER);
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
  heightWidthAV = windowWidth + windowHeight/2;
  displayTest = false;
  mainMenu = true;
  joinMenu = false;
  hostMenu = false;
  inGame = false;
  hostList = [];
  cannonBalls = [];
  playerTurn = true;
  enemyCannonAngle = 45;
  enemyShipLocation = 0;
  shipLocation = 0;
  lastTriggered = 0;
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
  else{
    fill("red");
    textSize(width/20);
    text("your opponent has disconnected :(", width/2, height/4);

    text("Back to menu", buttonWidth*2, buttonHeight);
    rect(hostButtonX, hostButtonY, buttonWidth*2, buttonHeight);
  }
}

function menuScreen(){

  rectMode(CENTER);
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
    IFireCannon(atan2(mouseY - (height*4/5 - height/30), mouseX - (pixelToCoord(shipLocation) + width/20 * allyDirectionModifier)), 5);
  }
  else{
    
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
    directionOffset = 0;
    enemyDirectionOffset = -150;
  }
  else{
    allyDirectionModifier = 1;
    enemyDirectionModifier = -1;
    cannonImage = cannon;
    enemyCannonImage = cannonFlipped;
    enemyDirectionOffset = 0;
    directionOffset = 12
  }
  inGame = true;
}
function drawBoats(){
  let aimPosition = atan2(mouseY - (height*4/5 - height/30), mouseX - (pixelToCoord(shipLocation) + width/20 * allyDirectionModifier)) + directionOffset;
  if(cannonImage === cannonFlipped){
    aimPosition += 162;
  }
  fill(0);
  // text(aimPosition , mouseX - (height*4/5 - height/30), width/5, height/20);
  fill("yellow");
// player's ship
  push();
  translate(pixelToCoord(shipLocation) + width/20 * allyDirectionModifier, height*4/5 - height/30);
  ellipse(-width/20 * allyDirectionModifier, + height/30, heightWidthAV/5, heightWidthAV/15);
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
  ellipse(-(width/20 * enemyDirectionModifier), height/30, heightWidthAV/5, heightWidthAV/15);
  rotate(enemyCannonAngle + enemyDirectionOffset);
  fill(0);

  // ellipse(0,0, heightWidthAV/40, heightWidthAV/20);
  image(enemyCannonImage, 0, 0, heightWidthAV/15, heightWidthAV/30);

  push()

}
function drawMap(){

}
function drawGame(){
  drawMap();

  for(let i = cannonBalls.length - 1; i >=0; i--){
    cannonBalls[i].draw()
    cannonBalls[i].move()
    if(!cannonBalls[i].bounding()){
      if(cannonBalls[i].controllingCamera){
        hangCameraInPlaceX(cannonBalls[i].x, 1000);
      }
      cannonBalls.splice(i, 1);
      cameraAdjust = 0;
    }
  }

  if(hangCamera){
    if(millis() - lastTriggered < cameraHangDuration){
      translate(width/2 - cameraHangLocation, 0);
    }
    else{
      hangCamera = false;
    }
  }
  drawBoats();


}
function pixelToCoord(x){
  return map(x,0, 1000, 0, width);
}
function pixelToCoordY(y){
  return map(y,0, 1000, 0, height);
}
function coordToPixel(x){
  return map(x,0, width, 0, 1000);
}
function coordToPixelY(y){
  return map(y,0, height, 0, 1000);
}
function fireCannon(angle, power){
  console.log("cannon should be firing");
  if(playerTurn){
    print(pixelToCoord(shipLocation) + width/20 * allyDirectionModifier);
    print(height*4/5 - height/30);
    print(width);
    print(height);
    let newCannonBall = new CannonBall(
      pixelToCoord(enemyShipLocation) + (width/20 * enemyDirectionModifier),
      height*4/5 - height/30,
      power,
      angle,
      allyDirectionModifier
      )
    cannonBalls.push(newCannonBall);

  }
  
  enemyCannonAngle = angle + 162;
}

function IFireCannon(angle, power){
  console.log("cannon should be firing");
  if(playerTurn){
    print(pixelToCoord(shipLocation) + width/20 * allyDirectionModifier);
    print(height*4/5 - height/30);
    print(width);
    print(height);
    let newCannonBall = new CannonBall(
      pixelToCoord(shipLocation) + width/20 * allyDirectionModifier,
      height*4/5 - height/30,
      power,
      angle,
      allyDirectionModifier
      )
    cannonBalls.push(newCannonBall);


    sendData("cannonFired", {angle:angle, power:power});
   }
}

function hangCameraInPlaceX(x, duration){
  lastTriggered = millis();
  cameraHangLocation = x;
  cameraHangDuration = duration;
  hangCamera = true;
}
