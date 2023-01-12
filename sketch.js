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
  
  })
  ws.addEventListener("close", () =>{
    ws.CLOSED = true;
  });
});


function setup() {
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
  else if(inGame){

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