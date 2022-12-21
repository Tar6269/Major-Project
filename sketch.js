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
const ws = new WebSocket("wss://momentous-honored-ragdoll.glitch.me/");

// ws.binaryType = "string";
ws.addEventListener("open", () =>{
  console.log("We are connected!")
  ws.addEventListener("message", function(message){
    let messageJSON = JSON.parse(message.data);
    let messageType = messageJSON.messageType;
    let messageData = messageJSON.data;
    if (messageJSON.messageType === "test"){
      print("it worked")
    }
    if (messageJSON.messageType === "text"){
    console.log(messageData)
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
  menuScreen();
  if(displayTest){

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
  // const ws = new WebSocket("ws:/tar6269.github.io/Major-Project/");
  sendData("ClientTypeChange", "host")

}
function hostServer(){
  let test = {
    hello: true,
  };
  print(test.hello);
}