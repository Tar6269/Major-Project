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
let joinMenu = false;
let hostMenu = false;
let hostList = [];

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

  if(joinMenu){
    displayServerList(hostList);
  }
  else{
    menuScreen();
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
  if(mouseX > (hostButtonX - buttonWidth/2) && mouseX < (hostButtonX + buttonWidth/2) && mouseY > (hostButtonY - buttonHeight/2) && mouseY < (hostButtonY + buttonHeight/2)){
    hostServer();
  }
  if(mouseX > (joinButtonX - buttonWidth/2) && mouseX < (joinButtonX + buttonWidth/2) && mouseY > (joinButtonY - buttonHeight/2) && mouseY < (joinButtonY + buttonHeight/2)){
    connectToHost();
    print("test");

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
  // sendData("request", "hostList");
  // joinMenu = true;
  sendData("test");
}
function hostServer(){
  sendData("typeChangeHost", prompt("Enter a room name", "room name"));
}