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
let opponentLeft;
let mapOffset;
let mapX;
let mapY;
let mapWidth;
let mapHeight;
let aimPosition;
let playerDisconnected;
let gameOver;
let winStatus
class CannonBall {
  constructor(x, y, power, angle, direction, isEnemy) {
    this.x = x;
    this.y = y;
    this.isEnemy = isEnemy;
    this.hitShip = false;
    if (this.isEnemy) {
      this.power = -(pixelToCoordY(power) * pixelToCoord(power) / 2);
      angle *= -1;


    }
    else {
      this.power = pixelToCoordY(power) * pixelToCoord(power) / 2;
    }
    console.log(angle);
    this.dx = coordToPixel(Math.cos(-angle * Math.PI / 180)) * this.power;
    this.dy = coordToPixelY(Math.sin(-angle * Math.PI / 180)) * this.power;
    this.direction = direction;
    this.controllingCamera = false;
    if (this.direction === "left") {
      this.power *= -1;
    }
  }
  move() {
    if (this.controllingCamera) {
      this.x += this.dx / 2;
      mapOffset += this.dx / 16;
    }
    else {
      this.x += this.dx;
    }
    console.log(coordToPixel(this.x));
    // console.log(floor(this.x) === width/2);
    // console.log(floor(this.x), width/2);
    if (Math.abs(this.x - width / 2) < 20 && !this.isEnemy) {
      this.controllingCamera = true;
    }
    else if (Math.abs(this.x - (pixelToCoord(3000) - width / 2)) < 20 && this.isEnemy) {
      this.controllingCamera = true;
    }
    this.y -= this.dy;

    this.dy -= pixelToCoord(.1);
    // this.dx -= pixelToCoord(.01);

    // this.dx -= pixelToCoord(.01);
    if(this.x > pixelToCoord(shipLocation) - heightWidthAV/8 && this.x < pixelToCoord(shipLocation) + heightWidthAV /8 && this.y >   height * 4 / 5 - height / 30 && this.y <   height * 4 / 5 && this.isEnemy){
      console.log("ship has been hit!")
      this.hitShip = true;
      winStatus = "lost"
    }
    if(this.x > pixelToCoord(enemyShipLocation) - heightWidthAV/8  && this.x < pixelToCoord(enemyShipLocation)  + heightWidthAV/8 && this.y >   height * 4 / 5 - height / 30 && this.y <   height * 4 / 5 && !this.isEnemy){
      console.log("we hit their ship!")
      this.hitShip = true;
      winStatus = "Won"

    }
  }
  draw() {

    console.log("cannonball being drawn")
    fill(0);

    if (this.controllingCamera) {

      translate(width / 2 - this.x, 0);
      circle(this.x, this.y, heightWidthAV / 50);
      // pop();
    }
    else {
      circle(this.x, this.y, heightWidthAV / 50);
    }


  }
  bounding() {
    return (this.y < height);
  }
}
let ws = new WebSocket("wss://momentous-honored-ragdoll.glitch.me/");

// ws.binaryType = "string";
ws.addEventListener("open", () => {
  console.log("We are connected!")
  mainMenu = true;
 playerDisconnected = false;
  ws.addEventListener("message", function (message) {
    let messageJSON = JSON.parse(message.data);
    let messageType = messageJSON.messageType;
    let messageData = messageJSON.data;

    if (messageJSON.messageType === "text") {
      console.log(messageData)
    }
    if (messageJSON.messageType === "hostList") {
      hostList = messageJSON.data;
      print(messageJSON.data);
      print(hostList);
    }
    if (messageJSON.messageType === "gameOn") {
      gameGenerationData = messageData;
      generateGame();
    }

    if (messageJSON.messageType === "fireCannon") {
      console.log("receiving cannonball...")
      fireCannon(messageJSON.data.angle, messageJSON.data.power);
    }
    if (messageJSON.messageType === "partnerDisconnect") {
      inGame = false;
      opponentLeft = true;
    }
  })
  ws.addEventListener("close", () => {
    playerDisconnected = true;
  });
});

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  heightWidthAV =  windowWidth;
}
function preload() {
  allyBoat = loadImage('assets/allyBoat.png');
  enemyBoat = loadImage('assets/enemyBoat.png');
  cannon = loadImage('assets/cannonBarrel.png');
  cannonFlipped = loadImage('assets/cannonBarrelFlipped.png');
  ocean = loadImage('assets/ocean.jpg');

}
function setup() {
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);
  imageMode(CENTER);
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.center("horizontal");
  buttonWidth = windowWidth / 3
  buttonHeight = windowHeight / 5
  hostButtonX = windowWidth / 2 - buttonWidth / 2;
  hostButtonY = windowHeight / 2;
  joinButtonX = windowWidth / 2 + buttonWidth / 2;
  joinButtonY = windowHeight / 2;
  heightWidthAV = windowWidth;
  displayTest = false;
  // mainMenu = true;
  joinMenu = false;
  hostMenu = false;
  inGame = false;
  opponentLeft = false;
  hostList = [];
  cannonBalls = [];
  playerTurn = true;
  enemyCannonAngle = 45;
  enemyShipLocation = 0;
  shipLocation = 0;
  lastTriggered = 0;
  mapOffset = 0;
  mapX = width * 3 / 2 - mapOffset;
  mapY = height / 2;
  mapWidth = width * 10;
  mapHeight = height;
  gameOver = false;
}

function draw() {
  background(220);
  if(playerDisconnected){
    fill("red");
    textSize(heightWidthAV / 30);
    text("you have disconnected :(", width / 2, height / 4);
    fill(255)
    rect(hostButtonX + buttonWidth/2, hostButtonY, buttonWidth*2, buttonHeight);
    fill(0)
    textSize(heightWidthAV/15);
    text("Back to menu", hostButtonX + buttonWidth/2, height / 2);
  }
  else if (mainMenu) {
    menuScreen();
  }
  else if (joinMenu) {
    displayServerList(hostList);
  }
  else if (hostMenu) {
    drawHostMenu();
  }
  else if (inGame) {
    drawGame();
  }
  else if (opponentLeft) {
    fill("red");
    textSize(heightWidthAV / 30);
    text("your opponent has disconnected :(", width / 2, height / 4);
    fill(255)
    rect(hostButtonX + buttonWidth/2, hostButtonY, buttonWidth*2, buttonHeight);
    fill(0)
    textSize(heightWidthAV/15);
    text("Back to menu", hostButtonX + buttonWidth/2, height / 2);
  }
}

function menuScreen() {

  rectMode(CENTER);
  textSize(heightWidthAV / 15)
  fill(255)
  rect(hostButtonX, hostButtonY, buttonWidth, buttonHeight);
  rect(joinButtonX, joinButtonY, buttonWidth, buttonHeight);
  fill(0)
  text("Host", hostButtonX, hostButtonY);
  text("Join", joinButtonX, joinButtonY);

}
function drawHostMenu() {
  textSize(heightWidthAV / 50);
  text("Your room name is :", width / 2, height / 4);
  text(hostRoomName, width / 2, height / 3.5);
  if (millis() - lastTriggered < 1000) {
    text("waiting for connection.", width / 2, height / 3);
  }
  else if (millis() - lastTriggered < 2000) {
    text("waiting for connection..", width / 2, height / 3);

  }
  else if (millis() - lastTriggered < 3000) {
    text("waiting for connection...", width / 2, height / 3);

  }
  else {
    text("waiting for connection.", width / 2, height / 3);
    lastTriggered = millis();
  }

}
function displayServerList(hostList) {
  rectMode(CENTER);
  let x = width / 2;
  let y = height / 5;
  if(hostList.length === 0){
    text("No servers available", width/2, height/2);
  }
  for (let i = 0; i < hostList.length; i++) {
    fill(255);
    rect(x, y * (i + 1), buttonWidth * 2, buttonHeight);
    fill(0);
    text(hostList[i].name, x, y * (i + 1));

  }
}
function mouseClicked() {
  if (mainMenu) {
    mainMenuButtons()
  }
  else if (joinMenu) {
    joinMenuButtons()
  }
  else if (inGame) {
    iFireCannon(aimPosition, 7);
  }
  else if(opponentLeft || playerDisconnected){
    if(mouseX > hostButtonX + buttonWidth/2 && mouseX < hostButtonX + buttonWidth/2 + buttonWidth*2 && mouseY > (hostButtonY - buttonHeight / 2) && mouseY < (hostButtonY + buttonHeight / 2)){
      if(playerDisconnected){
        ws = new WebSocket("wss://momentous-honored-ragdoll.glitch.me/");
      }
      if(opponentLeft){
        mainMenu = true;
      }
      // setup();
    }
  }
}
function mainMenuButtons(){
  if (mouseX > (hostButtonX - buttonWidth / 2) && mouseX < (hostButtonX + buttonWidth / 2) && mouseY > (hostButtonY - buttonHeight / 2) && mouseY < (hostButtonY + buttonHeight / 2)) {
    hostServer();
  }
  if (mouseX > (joinButtonX - buttonWidth / 2) && mouseX < (joinButtonX + buttonWidth / 2) && mouseY > (joinButtonY - buttonHeight / 2) && mouseY < (joinButtonY + buttonHeight / 2)) {
    connectToHost();
    mainMenu = false;
  }
}
function joinMenuButtons(){
  let x = width / 2;
  let y = height / 5;

  for (let i = 0; i < hostList.length; i++) {
    if (mouseX > (x - buttonWidth / 2) && mouseX < (x + buttonWidth / 2) && mouseY > (y * (i + 1) - buttonHeight / 2) && mouseY < (y * (i + 1) + buttonHeight / 2)) {
      console.log(hostList[i].name);
      sendData("joinGame", hostList[i]);
    }
  }
}
function sendData(Type, data) {
  let newMessage = { messageType: Type, data: data };
  let newMessageString = JSON.stringify(newMessage);
  // let newMessage = "{testing testing 123}";
  ws.send(newMessageString);

  print("message should be sent...");
}
function connectToHost() {
  sendData("request", "hostList");
  joinMenu = true;
  // sendData("test");
}
function hostServer() {
  mainMenu = false;
  hostMenu = true;
  let newRoomName = prompt("Enter a room name", "room name")
  sendData("typeChangeHost", newRoomName);
  hostRoomName = newRoomName;
}

function generateGame() {
  mainMenu = false;
  hostMenu = false;
  joinMenu = false;

  shipLocation = gameGenerationData.shipLocation;
  enemyShipLocation = gameGenerationData.enemyShipLocation;

  allyDirectionModifier = 1;
  enemyDirectionModifier = -1;
  cannonImage = cannon;
  enemyCannonImage = cannonFlipped;
  enemyDirectionOffset = 0;
  directionOffset = 12

  if (gameGenerationData.host) {
    playerTurn = true;
  }
  else {
    playerTurn = false;
  }
  inGame = true;
}
function drawBoats() {
  aimPosition = atan2(mouseY - (height * 4 / 5 - height / 30), mouseX - (pixelToCoord(shipLocation) + width / 20 * allyDirectionModifier)) + directionOffset;
  let allyCannonX = pixelToCoord(shipLocation) + width / 20;
  let enemyCannonX = pixelToCoord(enemyShipLocation) - width / 20;
  let cannonY = height * 4 / 5 - height / 30;
  let boatOffsetX = -width / 20;
  let boatOffsetY = -height / 30;
  let boatWidth = heightWidthAV / 4;
  let boatHeight = heightWidthAV / 4;
  let enemyCannonOffset = 148;
  height * 4 / 5 - height / 30
  let cannonWidth = heightWidthAV / 15
  let cannonHeight = heightWidthAV / 30
  if (cannonImage === cannonFlipped) {
    aimPosition += 162;
  }

  // player's ship and cannon
  // boat

  push();
  translate(allyCannonX, cannonY);
  image(allyBoat, boatOffsetX, boatOffsetY, boatWidth, boatHeight);
  // cannon
  rotate(aimPosition);
  fill(0);
  image(cannonImage, 0, 0, cannonWidth, cannonHeight);
  pop();

  // enemy's ship and cannon
  push();
  translate(enemyCannonX, cannonY);
  image(enemyBoat, -boatOffsetX, boatOffsetY, boatWidth, boatHeight);
  rotate(-enemyCannonAngle + enemyCannonOffset);
  // cannon
  image(enemyCannonImage, 0, 0, cannonWidth, cannonHeight);
  pop();

}
function drawMap() {
  image(ocean, mapX + mapOffset, mapY, mapWidth, mapHeight);
}

function drawGUI() {
  if (playerTurn && !gameOver) {
    textSize(heightWidthAV / 20)
    fill("green")
    text("Ready to Fire", width / 2, height / 5);

  }
  else if (!gameOver) {
    textSize(heightWidthAV / 20)
    fill("red")
    text("Waiting until opponent fires...", width / 2, height / 5);
  }
  else {
    text("You " + winStatus, width / 2, height / 5);
  }
}
function drawCannonBalls() {
  for (let i = cannonBalls.length - 1; i >= 0; i--) {
    cannonBalls[i].draw()
    cannonBalls[i].move()
    if(cannonBalls[i].hitShip){
      gameOver = true;
    }
    if (!cannonBalls[i].bounding()) {
      console.log("cannonball is dead");
      if (cannonBalls[i].isEnemy) {
        playerTurn = true;
      }


      if (cannonBalls[i].controllingCamera) {
        hangCameraInPlaceX(cannonBalls[i].x, 1000);
      }

      cannonBalls.splice(i, 1);

      cameraAdjust = 0;


    }
  }


}
function drawGame() {



  drawMap();

  if (hangCamera) {
    if (millis() - lastTriggered < cameraHangDuration) {
      print(cameraHangLocation);
      translate(width / 2 - cameraHangLocation, 0);
    }
    else {
      hangCamera = false;
      mapOffset = 0;
    }

  }
  drawGUI();

  drawCannonBalls();

  drawBoats();


}
function pixelToCoord(x) {
  return map(x, 0, 1000, 0, width);
}
function pixelToCoordY(y) {
  return map(y, 0, 1000, 0, width);
}
function coordToPixel(x) {
  return map(x, 0, width, 0, 1000);
}
function coordToPixelY(y) {
  return map(y, 0, width, 0, 1000);
}
function fireCannon(angle, power) {
  console.log("cannon should be firing");
  if (!playerTurn) {
    print(pixelToCoord(shipLocation) + width / 20 * allyDirectionModifier);
    print(height * 4 / 5 - height / 30);
    print(width);
    print(height);
    let newCannonBall = new CannonBall(
      pixelToCoord(enemyShipLocation) + (width / 20 * enemyDirectionModifier),
      height * 4 / 5 - height / 30,
      power,
      angle,
      allyDirectionModifier,
      true
    )
    cannonBalls.push(newCannonBall);

  }

  enemyCannonAngle = angle + 162;
}

function iFireCannon(angle, power) {
  console.log("cannon should be firing");
  if (playerTurn) {
    print(pixelToCoord(shipLocation) + width / 20 * allyDirectionModifier);
    print(height * 4 / 5 - height / 30);
    print(width);
    print(height);
    let newCannonBall = new CannonBall(
      pixelToCoord(shipLocation) + width / 20 * allyDirectionModifier,
      height * 4 / 5 - height / 30,
      -power,
      angle,
      allyDirectionModifier,
      false
    )
    cannonBalls.push(newCannonBall);
    playerTurn = false;


    sendData("cannonFired", { angle: angle, power: power });
  }
}

function hangCameraInPlaceX(x, duration) {
  lastTriggered = millis();
  cameraHangLocation = x;
  cameraHangDuration = duration;
  hangCamera = true;
  // translate(width/2 - cameraHangLocation, 0);

}
